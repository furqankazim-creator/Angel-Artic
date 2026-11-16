// Voice gate: runs BEFORE any score exists. Silence can never become "so close".
export const SPEECH_DB = -35;
export const NO_SPEECH_PEAK_DB = -38;
export const TOO_QUIET_PEAK_DB = -30;
export const MIN_MS = 700;
export const TICK_MS = 100;

export type GateStatus = 'ok' | 'no_speech' | 'too_quiet' | 'too_short';
export interface GateResult {
  status: GateStatus;
  peakDb: number;
  speechMs: number;
  totalMs: number;
}

export function runGate(samples: number[], tickMs = TICK_MS): GateResult {
  const totalMs = samples.length * tickMs;
  const peakDb = samples.length ? Math.max(...samples) : -160;
  const speechMs = samples.filter((d) => d > SPEECH_DB).length * tickMs;
  let status: GateStatus = 'ok';
  if (peakDb <= NO_SPEECH_PEAK_DB) status = 'no_speech';
  else if (peakDb < TOO_QUIET_PEAK_DB) status = 'too_quiet';
  else if (speechMs < MIN_MS || totalMs < MIN_MS) status = 'too_short';
  return { status, peakDb, speechMs, totalMs };
}

export const GATE_MESSAGES: Record<Exclude<GateStatus, 'ok'>, string> = {
  no_speech: "I didn't hear anything. Let's try again!",
  too_quiet: 'That was too quiet for me to hear. Try a bit louder!',
  too_short: 'That was a little too short. Say the whole word!',
};
