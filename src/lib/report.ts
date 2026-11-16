export interface ReportAttempt { day: string; soundId: string; word: string; status: string; score: number; source: string }
export interface ReportInput {
  name: string;
  from: string;
  to: string;
  attempts: ReportAttempt[];
  mastery: Record<string, string>; // soundId -> level
}

const esc = (s: string) => s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!);

export function summarise(attempts: ReportAttempt[]) {
  const bySound = new Map<string, { scored: number[]; noSound: number; words: Set<string> }>();
  for (const a of attempts) {
    const e = bySound.get(a.soundId) ?? { scored: [], noSound: 0, words: new Set() };
    if (a.status === 'scored') { e.scored.push(a.score); e.words.add(a.word); } else e.noSound++;
    bySound.set(a.soundId, e);
  }
  return [...bySound.entries()].map(([soundId, e]) => ({
    soundId,
    scored: e.scored.length,
    accuracy: e.scored.length ? Math.round(e.scored.reduce((a, b) => a + b, 0) / e.scored.length) : 0,
    noSound: e.noSound,
    words: [...e.words],
  }));
}

/** Printable weekly report. Accuracy uses scored tries only; no-sound tries are listed separately. */
export function buildReportHtml(r: ReportInput): string {
  const rows = summarise(r.attempts);
  const total = rows.reduce((n, x) => n + x.scored, 0);
  const silent = rows.reduce((n, x) => n + x.noSound, 0);
  const body = rows.length
    ? rows.map((x) => `<tr><td>/${esc(x.soundId)}/</td><td>${x.scored}</td><td>${x.accuracy}%</td><td>${esc(r.mastery[x.soundId] ?? 'Learning')}</td><td>${x.noSound}</td><td>${esc(x.words.slice(0, 6).join(', '))}</td></tr>`).join('')
    : '<tr><td colspan="6">No practice this week.</td></tr>';
  return `<!doctype html><html><head><meta charset="utf-8"><title>Angel Artic weekly report</title>
<style>
body{font-family:-apple-system,Helvetica,Arial,sans-serif;color:#2D2A4A;padding:32px}
h1{color:#6C5CE7;margin:0 0 4px}h2{margin:24px 0 8px}
.sub{color:#7A7799;margin-bottom:16px}
table{border-collapse:collapse;width:100%}th,td{border:1px solid #EFE6D8;padding:8px;text-align:left;font-size:14px}
th{background:#EDEAFF}.box{background:#FFF1D6;border-radius:12px;padding:12px;margin:12px 0}
.small{font-size:12px;color:#7A7799;margin-top:24px}
</style></head><body>
<h1>Angel Artic weekly report</h1>
<div class="sub">${esc(r.name)} &middot; ${esc(r.from)} to ${esc(r.to)}</div>
<div class="box"><b>${total}</b> scored tries &middot; <b>${silent}</b> no sound heard (not counted in accuracy)</div>
<h2>By sound</h2>
<table><tr><th>Sound</th><th>Scored tries</th><th>Accuracy</th><th>Mastery</th><th>No sound heard</th><th>Words practised</th></tr>${body}</table>
<p class="small">These are practice scores from a speech practice app. They are not a diagnosis. If you have a worry about your child's speech, talk to your doctor. Accuracy uses scored tries only.</p>
</body></html>`;
}
