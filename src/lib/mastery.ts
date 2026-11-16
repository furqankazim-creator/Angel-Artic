import type { Attempt } from '../store';

export type Mastery = 'Learning' | 'Practising' | 'Mastered';

/** From the last 10 SCORED attempts for a sound. No-sound attempts never count. */
export function masteryFor(attempts: Attempt[], soundId: string): { level: Mastery; avg: number; n: number } {
  const last = attempts.filter((a) => a.soundId === soundId && a.status === 'scored').slice(-10);
  const n = last.length;
  const avg = n ? Math.round(last.reduce((s, a) => s + a.score, 0) / n) : 0;
  let level: Mastery = 'Learning';
  if (n >= 5 && avg >= 80) level = 'Mastered';
  else if ((n >= 3 && avg >= 60) || last.some((a) => a.score >= 80)) level = 'Practising';
  return { level, avg, n };
}
