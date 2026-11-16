// Writes the sheets you hand to the illustrator and the speech therapist. Usage: node scripts/export-briefs.mjs
import { writeFileSync, mkdirSync } from 'node:fs';
const slug = (t) => t.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '');
const csv = (rows) => rows.map((r) => r.map((c) => `"${String(c ?? '').replace(/"/g, '""')}"`).join(',')).join('\n') + '\n';
const { WORDS, SOUNDS } = await import('../src/data/sounds.ts');
const { SOUND_INFO, BANDS } = await import('../src/data/curriculum.ts');
const { BOARDS } = await import('../src/data/talkBoards.ts');
mkdirSync('store/briefs', { recursive: true });

// Words that cannot be drawn as a single object: the illustrator needs a different approach.
const ABSTRACT = new Set(['this', 'that', 'they', 'then', 'these', 'those', 'me', 'you', 'we', 'more', 'please', 'finished', 'stop', 'go', 'wait', 'listen', 'calm', 'proud', 'worried', 'sorry', 'yes', 'no', 'help', 'want', 'I', 'ahead', 'behind', 'away', 'beyond', 'enjoy', 'usually', 'decision', 'mistake', 'together', 'weather', 'vision', 'overhead', 'rewind', 'mirage', 'camouflage', 'collage']);

// 1. Illustration list: one row per picture the app shows.
const seen = new Map();
for (const w of WORDS) { const k = slug(w.word); if (!seen.has(k)) seen.set(k, { word: w.word, where: [], emoji: w.emoji, sentence: w.sentence }); seen.get(k).where.push(`/${w.soundId}/ ${w.position}`); }
for (const b of BOARDS) for (const [word, emoji] of b.words) { const k = slug(word); if (!seen.has(k)) seen.set(k, { word, where: [], emoji, sentence: '' }); seen.get(k).where.push(`Talk: ${b.name}`); }
const rows = [['file_name', 'word', 'used_for', 'sentence', 'current_emoji', 'kind', 'note']];
for (const [k, v] of [...seen].sort()) rows.push([`${k}.png`, v.word, [...new Set(v.where)].join('; '), v.sentence, v.emoji, ABSTRACT.has(v.word) ? 'abstract' : 'object', ABSTRACT.has(v.word) ? 'Not a single object: show a clear child-friendly scene or gesture' : '']);
writeFileSync('store/briefs/illustration-list.csv', csv(rows));

// 2. Therapist review sheet: one row per word, with tick-boxes.
const t = [['sound', 'ipa', 'position', 'tier', 'word', 'sentence', 'sound_is_correct_for_word (y/n)', 'age_suitable (y/n)', 'picture_matches (y/n)', 'comments']];
for (const w of WORDS) t.push([`/${w.soundId}/`, SOUND_INFO[w.soundId].ipa, w.position, w.level === 2 ? 'stretch (age 5-8)' : 'core', w.word, w.sentence, '', '', '', '']);
writeFileSync('store/briefs/therapist-review-words.csv', csv(t));

const s = [['sound', 'ipa', 'how_it_is_made', 'when_most_children_have_it', 'listening_pair', 'tongue_twister', 'age_band_focus', 'age_band_still_developing', 'correct (y/n)', 'comments']];
for (const x of SOUNDS) {
  const i = SOUND_INFO[x.id];
  const focus = Object.entries(BANDS).filter(([, b]) => b.focus.includes(x.id)).map(([k]) => k).join(' ');
  const emerg = Object.entries(BANDS).filter(([, b]) => b.emerging.includes(x.id)).map(([k]) => k).join(' ');
  s.push([`/${x.id}/`, i.ipa, i.how, i.usual, i.pair.join(' / '), i.twister, focus, emerg, '', '']);
}
writeFileSync('store/briefs/therapist-review-sounds.csv', csv(s));
console.log(`illustration-list.csv: ${rows.length - 1} pictures | therapist-review-words.csv: ${t.length - 1} words | therapist-review-sounds.csv: ${s.length - 1} sounds`);
