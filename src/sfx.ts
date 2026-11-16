import { createAudioPlayer, setAudioModeAsync } from 'expo-audio';

const FILES = {
  tap: require('../assets/sfx/tap.wav'),
  chime: require('../assets/sfx/chime.wav'),
  soft: require('../assets/sfx/soft.wav'),
} as const;
export type Sfx = keyof typeof FILES;
let modeSet = false;

/** Short, gentle effects. Fails silently: a missing sound must never break practice. */
export function playSfx(name: Sfx) {
  try {
    if (!modeSet) { modeSet = true; setAudioModeAsync({ playsInSilentMode: true }).catch(() => {}); }
    const p = createAudioPlayer(FILES[name]);
    p.play();
    setTimeout(() => { try { p.remove(); } catch {} }, 1500);
  } catch {}
}
