import { useCallback, useEffect, useRef, useState } from 'react';
import { Platform } from 'react-native';
import * as Speech from 'expo-speech';
import {
  AudioQuality, IOSOutputFormat, RecordingPresets, createAudioPlayer, requestRecordingPermissionsAsync, setAudioModeAsync, useAudioRecorder,
} from 'expo-audio';
import { SPEECH_DB, TICK_MS, TOO_QUIET_PEAK_DB, NO_SPEECH_PEAK_DB } from './lib/gate';
import { useStore } from './store';
import { VOICE } from './data/voiceMap';

const slug = (t: string) => t.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '');
let current: ReturnType<typeof createAudioPlayer> | null = null;
let modeSet = false;

/** Plays a bundled voice clip when one exists (swap any file for a human recording), else the phone's voice. */
export function useSpeak() {
  const { s } = useStore();
  return useCallback((text: string, slow?: boolean) => {
    const wantSlow = !!slow || s.settings.slow;
    const key = slug(text);
    const clip = (wantSlow ? VOICE[`${key}__slow`] : undefined) ?? (wantSlow && !VOICE[`${key}__slow`] ? undefined : VOICE[key]);
    Speech.stop();
    try { current?.remove(); } catch {}
    current = null;
    if (clip) {
      try {
        if (!modeSet) { modeSet = true; setAudioModeAsync({ playsInSilentMode: true }).catch(() => {}); }
        current = createAudioPlayer(clip);
        current.play();
        return;
      } catch {}
    }
    Speech.speak(text, { rate: wantSlow ? 0.5 : 0.9, pitch: 1.05, language: 'en-US' });
  }, [s.settings.slow]);
}

let activePlayer: ReturnType<typeof createAudioPlayer> | null = null;
export function playUri(uri: string) {
  try {
    activePlayer?.remove();
    activePlayer = createAudioPlayer(uri);
    activePlayer.play();
  } catch {}
}

// Web-only speech recognition so a heard word can be compared to the target.
function startRecognition() {
  if (Platform.OS !== 'web') return null;
  const SR = (globalThis as any).SpeechRecognition || (globalThis as any).webkitSpeechRecognition;
  if (!SR) return null;
  try {
    const r = new SR();
    r.lang = 'en-US'; r.interimResults = false; r.maxAlternatives = 1;
    let text: string | null = null;
    r.onresult = (e: any) => { text = e.results?.[0]?.[0]?.transcript ?? null; };
    r.start();
    return { stop: () => new Promise<string | null>((res) => { r.onend = () => res(text); try { r.stop(); } catch { res(text); } setTimeout(() => res(text), 800); }) };
  } catch { return null; }
}

export type LiveStatus = 'idle' | 'Listening' | 'Hearing you' | 'Too quiet';
export interface Tick { db: number; samples: number[]; speechMs: number; silentMs: number; speechSeen: boolean; elapsed: number }

export interface Capture { samples: number[]; uri?: string; heard: string | null }

/** Records 16 kHz mono with metering and reports live levels. */
export function useMeterRecorder() {
  const recorder = useAudioRecorder({
    ...RecordingPresets.HIGH_QUALITY, sampleRate: 16000, numberOfChannels: 1, isMeteringEnabled: true,
    // iOS records 16 kHz mono WAV so cloud pronunciation scoring can read it.
    ios: { ...RecordingPresets.HIGH_QUALITY.ios, extension: '.wav', outputFormat: IOSOutputFormat.LINEARPCM, audioQuality: AudioQuality.MAX, sampleRate: 16000, linearPCMBitDepth: 16, linearPCMIsBigEndian: false, linearPCMIsFloat: false },
  });
  const [recording, setRecording] = useState(false);
  const [status, setStatus] = useState<LiveStatus>('idle');
  const [levels, setLevels] = useState<number[]>([]);
  const [denied, setDenied] = useState(false);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);
  const samples = useRef<number[]>([]);
  const rec = useRef<ReturnType<typeof startRecognition>>(null);
  const done = useRef<((c: Capture) => void) | null>(null);

  const finish = useCallback(async () => {
    if (timer.current) clearInterval(timer.current);
    timer.current = null;
    setRecording(false);
    setStatus('idle');
    let uri: string | undefined;
    try { await recorder.stop(); uri = recorder.uri ?? undefined; } catch {}
    const heard = rec.current ? await rec.current.stop() : null;
    rec.current = null;
    const cb = done.current; done.current = null;
    cb?.({ samples: samples.current, uri, heard });
  }, [recorder]);

  useEffect(() => () => { if (timer.current) clearInterval(timer.current); }, []);

  /**
   * opts.autoStop: stop 1500 ms after silence, only once speech was heard.
   * opts.maxMs: hard cap. opts.onTick: live data for the UI.
   */
  const start = useCallback(async (opts: { autoStop?: boolean; maxMs?: number; onTick?: (t: Tick) => void }, onDone: (c: Capture) => void) => {
    const perm = await requestRecordingPermissionsAsync();
    if (!perm.granted) { setDenied(true); return false; }
    setDenied(false);
    try {
      await setAudioModeAsync({ allowsRecording: true, playsInSilentMode: true });
      await recorder.prepareToRecordAsync();
      recorder.record();
    } catch { setDenied(true); return false; }
    samples.current = []; setLevels([]); setRecording(true); setStatus('Listening');
    done.current = onDone;
    rec.current = startRecognition();
    let speechSeen = false, silent = 0, speechMs = 0, elapsed = 0;
    timer.current = setInterval(() => {
      const st = recorder.getStatus();
      const db = typeof st.metering === 'number' ? st.metering : -160;
      samples.current.push(db);
      elapsed += TICK_MS;
      const heardNow = db > SPEECH_DB;
      if (heardNow) { speechSeen = true; silent = 0; speechMs += TICK_MS; } else if (speechSeen) silent += TICK_MS;
      const peak = Math.max(...samples.current);
      setStatus(heardNow ? 'Hearing you' : elapsed > 2000 && !speechSeen && peak > NO_SPEECH_PEAK_DB && peak < TOO_QUIET_PEAK_DB ? 'Too quiet' : 'Listening');
      setLevels((l) => [...l.slice(-27), db]);
      opts.onTick?.({ db, samples: samples.current, speechMs, silentMs: silent, speechSeen, elapsed });
      if ((opts.autoStop && speechSeen && silent >= 1500) || elapsed >= (opts.maxMs ?? 7000)) finish();
    }, TICK_MS);
    return true;
  }, [recorder, finish]);

  return { start, stop: finish, recording, status, levels, denied };
}
