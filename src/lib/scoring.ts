
export type ScoreSource = 'local' | 'azure' | 'parent';
export interface ScoreResult {
  score: number;
  source: ScoreSource;
  heard: string | null;
  verified: boolean; // true when a heard word was compared to the target
}

function lev(a: string, b: string) {
  const d = Array.from({ length: a.length + 1 }, (_, i) => [i, ...Array(b.length).fill(0)]);
  for (let j = 1; j <= b.length; j++) d[0][j] = j;
  for (let i = 1; i <= a.length; i++)
    for (let j = 1; j <= b.length; j++)
      d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
  return d[a.length][b.length];
}

/**
 * Gentle local PRACTICE scoring. Only called after the voice gate passed.
 * - If a recogniser returned a heard word (web), compare it to the target.
 * - Otherwise we know a voice was heard but not which word, so we give a
 *   practice score from how clearly the voice was captured. It is capped
 *   below an exact match and is labelled as a practice score.
 */
export const tokens = (t: string) => t.toLowerCase().replace(/[^a-z' ]/g, ' ').split(/\s+/).filter(Boolean);

export function localScore(target: string, heard: string | null, speechMs: number): ScoreResult {
  const tt = tokens(target);
  if (heard && tt.length > 1) {
    const ht = tokens(heard);
    const hit = tt.filter((t) => ht.includes(t)).length / tt.length;
    return { score: hit === 1 ? 95 + Math.min(5, Math.round(speechMs / 1500)) : Math.round(30 + hit * 55), source: 'local', heard: ht.join(' '), verified: true };
  }
  if (heard) {
    const h = heard.toLowerCase().trim().split(/\s+/).pop() ?? '';
    const t = target.toLowerCase();
    if (h === t) return { score: 95 + Math.min(5, Math.round(speechMs / 400)), source: 'local', heard: h, verified: true };
    const sim = 1 - lev(h, t) / Math.max(h.length, t.length, 1);
    return { score: Math.round(30 + sim * 55), source: 'local', heard: h, verified: true };
  }
  const clarity = Math.min(1, speechMs / 1200);
  return { score: Math.round(66 + clarity * 20), source: 'local', heard: null, verified: false };
}

export const starsFor = (score: number) => (score >= 90 ? 3 : score >= 80 ? 2 : 1);
export const isPass = (score: number) => score >= 80;
export const isNearMiss = (score: number) => score >= 60 && score < 80;
