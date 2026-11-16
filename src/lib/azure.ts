import { tokens, type ScoreResult } from './scoring.ts';

export interface AzureConfig { key: string; region: string }

/** Pure mapping so it can be unit-tested without the network. */
export function mapAzureResponse(target: string, json: any): ScoreResult | null {
  if (!json || json.RecognitionStatus !== 'Success') return null;
  const best = json.NBest?.[0];
  const pa = best?.PronunciationAssessment;
  if (!best || !pa || typeof pa.AccuracyScore !== 'number') return null;
  const heard = String(best.Lexical ?? best.Display ?? '').toLowerCase().replace(/[^a-z' ]/g, '').trim();
  const tt = tokens(target);
  // Azure scores the reference text; if it heard different words, never go above a near-miss.
  const ht = tokens(heard);
  const wrongWord = !!heard && (tt.length === 1 ? ht[0] !== tt[0] : tt.filter((x) => ht.includes(x)).length / tt.length < 0.6);
  const raw = Math.round(pa.AccuracyScore);
  return { score: wrongWord ? Math.min(raw, 59) : raw, source: 'azure', heard: heard || null, verified: true };
}

/**
 * Real pronunciation scoring with Azure Speech (Pronunciation Assessment, short-audio REST).
 * Runs ONLY when a parent has added a key and region, and only for 16 kHz WAV recordings.
 * Returns null on any problem so the app falls back to the local practice score.
 */
export async function scoreWithAzure(cfg: AzureConfig | undefined, audioUri: string | undefined, word: string): Promise<ScoreResult | null> {
  if (!cfg?.key || !cfg.region || !audioUri || !audioUri.toLowerCase().endsWith('.wav')) return null;
  try {
    const assessment = { ReferenceText: word, GradingSystem: 'HundredMark', Granularity: 'Phoneme', Dimension: 'Comprehensive', EnableMiscue: true };
    const header = btoa(JSON.stringify(assessment));
    const body = await (await fetch(audioUri)).blob();
    const res = await fetch(
      `https://${cfg.region}.stt.speech.microsoft.com/speech/recognition/conversation/cognitiveservices/v1?language=en-US&format=detailed`,
      {
        method: 'POST',
        headers: {
          'Ocp-Apim-Subscription-Key': cfg.key,
          'Content-Type': 'audio/wav; codecs=audio/pcm; samplerate=16000',
          'Pronunciation-Assessment': header,
          Accept: 'application/json',
        },
        body,
      },
    );
    if (!res.ok) return null;
    return mapAzureResponse(word, await res.json());
  } catch {
    return null;
  }
}

export interface ServerConfig { url: string; token: string }

/** Scores through the optional proxy (see server/README.md). Works for Android too: the server converts the audio. */
export async function scoreWithServer(cfg: ServerConfig | undefined, audioUri: string | undefined, word: string): Promise<ScoreResult | null> {
  if (!cfg?.url || !cfg.token || !audioUri || !/^https:\/\//i.test(cfg.url)) return null;
  try {
    const body = await (await fetch(audioUri)).blob();
    const res = await fetch(`${cfg.url.replace(/\/+$/, '')}/score?word=${encodeURIComponent(word)}`, {
      method: 'POST', headers: { Authorization: `Bearer ${cfg.token}` }, body,
    });
    if (!res.ok) return null;
    return mapAzureResponse(word, await res.json());
  } catch {
    return null;
  }
}
