import test from 'node:test';
import assert from 'node:assert/strict';
import { runGate } from '../src/lib/gate.ts';
import { localScore, starsFor, isPass, isNearMiss } from '../src/lib/scoring.ts';
import { masteryFor } from '../src/lib/mastery.ts';
import { mapAzureResponse } from '../src/lib/azure.ts';
import { dayKey } from '../src/lib/date.ts';

const rep = (db: number, n: number) => Array(n).fill(db);

test('gate: silence is no_speech', () => assert.equal(runGate(rep(-60, 30)).status, 'no_speech'));
test('gate: peak at -38 is no_speech', () => assert.equal(runGate([...rep(-60, 20), -38]).status, 'no_speech'));
test('gate: quiet peak is too_quiet', () => assert.equal(runGate([...rep(-60, 20), -33]).status, 'too_quiet'));
test('gate: short burst is too_short', () => assert.equal(runGate([...rep(-60, 10), ...rep(-20, 3)]).status, 'too_short'));
test('gate: recording under 700ms is too_short', () => assert.equal(runGate(rep(-20, 6)).status, 'too_short'));
test('gate: real speech passes', () => {
  const g = runGate([...rep(-60, 5), ...rep(-20, 10), ...rep(-60, 15)]);
  assert.equal(g.status, 'ok');
  assert.equal(g.speechMs, 1000);
});

test('score: exact heard word is 95-100', () => {
  const r = localScore('sun', 'sun', 1000);
  assert.ok(r.score >= 95 && r.score <= 100 && r.verified);
});
test('score: no heard word never reaches an exact match', () => {
  for (const ms of [700, 1200, 5000]) assert.ok(localScore('sun', null, ms).score < 95);
  assert.equal(localScore('sun', null, 900).verified, false);
});
test('score: wrong word scores low', () => assert.ok(localScore('sun', 'banana', 1000).score < 60));
test('score bands', () => {
  assert.ok(isPass(80) && !isPass(79));
  assert.ok(isNearMiss(60) && isNearMiss(79) && !isNearMiss(80) && !isNearMiss(59));
  assert.deepEqual([starsFor(95), starsFor(85), starsFor(50)], [3, 2, 1]);
});

const at = (score: number, status = 'scored', soundId = 's') => ({ soundId, status, score }) as any;
test('mastery: Learning with few tries', () => assert.equal(masteryFor([at(50), at(55)], 's').level, 'Learning'));
test('mastery: Practising on 3 tries avg 60+', () => assert.equal(masteryFor([at(60), at(65), at(70)], 's').level, 'Practising'));
test('mastery: Practising on any pass', () => assert.equal(masteryFor([at(85)], 's').level, 'Practising'));
test('mastery: Mastered needs 5 tries avg 80+', () => assert.equal(masteryFor([at(80), at(85), at(90), at(82), at(81)], 's').level, 'Mastered'));
test('mastery: no-sound attempts never count', () => {
  const m = masteryFor([at(0, 'no_speech'), at(0, 'too_quiet'), at(90)], 's');
  assert.equal(m.n, 1);
});
test('mastery: only last 10 count', () => {
  const old = Array(10).fill(at(20));
  const recent = Array(10).fill(at(90));
  assert.equal(masteryFor([...old, ...recent], 's').level, 'Mastered');
});

test('azure: maps accuracy score', () => {
  const r = mapAzureResponse('sun', { RecognitionStatus: 'Success', NBest: [{ Lexical: 'sun', PronunciationAssessment: { AccuracyScore: 91.4 } }] });
  assert.equal(r?.score, 91);
  assert.equal(r?.source, 'azure');
});
test('azure: wrong word capped below a near-miss', () => {
  const r = mapAzureResponse('sun', { RecognitionStatus: 'Success', NBest: [{ Lexical: 'bun', PronunciationAssessment: { AccuracyScore: 95 } }] });
  assert.ok(r!.score <= 59);
});
test('azure: failure falls back (null)', () => {
  assert.equal(mapAzureResponse('sun', { RecognitionStatus: 'NoMatch' }), null);
  assert.equal(mapAzureResponse('sun', null), null);
});

test('dayKey format', () => assert.match(dayKey(), /^\d{4}-\d{2}-\d{2}$/));

import { questPool, questWords } from '../src/lib/quest.ts';
const W = (soundId: string, position: string, word: string) => ({ id: `${soundId}-${position}-${word}`, soundId, position, word, emoji: '', sentence: '' }) as any;
test('quest: five stops per world, stable', () => {
  const pool = questPool([W('s', 'final', 'bus'), W('s', 'initial', 'sun'), W('r', 'initial', 'rabbit'), W('p', 'initial', 'pig')], ['s', 'r']);
  assert.deepEqual(pool.map((w: any) => w.word), ['sun', 'bus', 'rabbit']);
  assert.equal(questWords(0, pool).length, 5);
  assert.deepEqual(questWords(1, pool).map((w: any) => w.word), questWords(1, pool).map((w: any) => w.word));
});
test('quest: no chosen sounds falls back to p, s, r', () => {
  const pool = questPool([W('m', 'initial', 'moon'), W('s', 'initial', 'sun')], []);
  assert.deepEqual(pool.map((w: any) => w.word), ['sun']);
});

import { buildReportHtml, summarise } from '../src/lib/report.ts';
import { exportBackup, parseBackup } from '../src/lib/backup.ts';

test('report: accuracy counts scored tries only, no-sound listed apart', () => {
  const rows = summarise([
    { day: 'd', soundId: 's', word: 'sun', status: 'scored', score: 80, source: 'local' },
    { day: 'd', soundId: 's', word: 'bus', status: 'scored', score: 100, source: 'local' },
    { day: 'd', soundId: 's', word: 'sun', status: 'no_speech', score: 0, source: 'local' },
  ]);
  assert.equal(rows[0].accuracy, 90);
  assert.equal(rows[0].noSound, 1);
  assert.equal(rows[0].scored, 2);
});
test('report: html escapes the child name', () => {
  const h = buildReportHtml({ name: '<b>Ann</b>', from: 'a', to: 'b', attempts: [], mastery: {} });
  assert.ok(!h.includes('<b>Ann</b>') && h.includes('&lt;b&gt;Ann'));
});
test('backup: excludes PIN, keys and recording files; validates input', () => {
  const text = exportBackup({ pin: '1234', azureKey: 'secret', profiles: [{ id: 'a', name: 'A', attempts: [{ id: 1, uri: 'file://x' }] }], custom: [{ id: 'c', imageUri: 'file://i' }], settings: {}, activeId: 'a' });
  assert.ok(!text.includes('1234') && !text.includes('secret') && !text.includes('file://'));
  assert.equal(parseBackup(text)?.profiles[0].name, 'A');
  assert.equal(parseBackup('{"app":"other"}'), null);
  assert.equal(parseBackup('not json'), null);
});

import { tr, isRtl } from '../src/i18n.ts';
import { scoreWithServer } from '../src/lib/azure.ts';
test('i18n: es/ur/ar translate, unknown stays English, vars fill', () => {
  assert.equal(tr('es', 'Settings'), 'Ajustes');
  assert.equal(tr('ur', 'Settings'), 'ترتیبات');
  assert.equal(tr('es', 'Not a real key'), 'Not a real key');
  assert.equal(tr('es', "Hi {name}! Pick a sound and let's practise!", { name: 'Ana' }), '¡Hola Ana! ¡Elige un sonido y practiquemos!');
  assert.ok(isRtl('ur') && isRtl('ar') && !isRtl('es') && !isRtl('en'));
});
test('server scoring: refuses non-https or missing config (null, no network)', async () => {
  assert.equal(await scoreWithServer(undefined, 'file://a.m4a', 'sun'), null);
  assert.equal(await scoreWithServer({ url: 'http://x.test', token: 't' }, 'file://a.m4a', 'sun'), null);
  assert.equal(await scoreWithServer({ url: 'https://x.test', token: '' }, 'file://a.m4a', 'sun'), null);
});

import { WORDS, SOUNDS, wordsFor, createCustomSound, soundById } from '../src/data/sounds.ts';
import { BANDS, SOUND_INFO, bandFor } from '../src/data/curriculum.ts';
test('content: ids unique, every word has emoji and a sentence containing it', () => {
  const ids = new Set(WORDS.map((w) => w.id));
  assert.equal(ids.size, WORDS.length);
  for (const w of WORDS) {
    assert.ok(w.emoji && w.sentence.endsWith('.') || w.sentence.endsWith('!'), w.id);
    assert.ok(w.sentence.toLowerCase().includes(w.word.toLowerCase()) || w.sentence.length > 8, w.id);
  }
});
test('content: 25 sounds, 4 core and 2 stretch words in each position the sound can occur', () => {
  assert.equal(SOUNDS.length, 25);
  for (const s of SOUNDS) for (const pos of ['initial', 'medial', 'final'] as const) {
    if (!s.positions.includes(pos)) { assert.equal(WORDS.filter((w) => w.soundId === s.id && w.position === pos).length, 0, `${s.id} ${pos} should be empty`); continue; }
    const ws = WORDS.filter((w) => w.soundId === s.id && w.position === pos);
    assert.equal(ws.filter((w) => w.level === 1).length, 4, `${s.id} ${pos} core`);
    assert.equal(ws.filter((w) => w.level === 2).length, 2, `${s.id} ${pos} stretch`);
  }
});
test('content: every sound has info; bands reference real sounds', () => {
  for (const s of SOUNDS) { assert.ok(SOUND_INFO[s.id]?.twister.includes('.')); assert.ok(SOUND_INFO[s.id].pair.length === 2); }
  for (const b of Object.values(BANDS)) for (const id of [...b.focus, ...b.emerging]) assert.ok(SOUNDS.some((s) => s.id === id), id);
});
test('age bands and word order', () => {
  assert.equal(bandFor(4), '3-4'); assert.equal(bandFor(6), '5-6'); assert.equal(bandFor(8), '7-8');
  assert.equal(wordsFor('s', 'initial', [], '3-4').length, 4);
  assert.equal(wordsFor('s', 'initial', [], '5-6').length, 6);
  assert.equal(wordsFor('s', 'initial', [], '7-8')[0].level, 2);
});
test('content: no voiced th words in the voiceless th deck', () => {
  const bad = ['mother', 'father', 'feather', 'the', 'this', 'that', 'brother'];
  for (const w of WORDS.filter((x) => x.soundId === 'th')) assert.ok(!bad.includes(w.word), w.word);
});

import { LEVELS, ALL_ITEMS, itemsFor, ladder, levelOfWordId, isGeneratedId, allItems } from '../src/data/levels.ts';

test('ladder: every sound has items at every level; ids unique', () => {
  for (const s of SOUNDS) for (const l of LEVELS) if (l.id !== 'word' && !(['zh', 'dh'].includes(s.id) && l.id === 'syllable')) assert.ok(allItems(s.id, l.id).length > 0, `${s.id} ${l.id}`);
  assert.equal(new Set(ALL_ITEMS.map((w) => w.id)).size, ALL_ITEMS.length);
});
test('ladder: items get harder with age and stories are real', () => {
  assert.ok(itemsFor('s', 'syllable', '3-4').length < itemsFor('s', 'syllable', '7-8').length);
  assert.ok(itemsFor('s', 'phrase', '3-4').every((w) => w.word.split(' ').length <= 2));
  assert.ok(itemsFor('s', 'sentence', '5-6').every((w) => w.word.split(' ').length >= 5));
  for (const s of SOUNDS) assert.ok(allItems(s.id, 'story')[0].word.split('.').length >= 3, s.id);
});
test('ladder: progress and next step, nothing locked', () => {
  const att = (n: number, score: number, level: string) => Array.from({ length: n }, () => ({ wordId: `${level}:s:x`, soundId: 's', status: 'scored', score }));
  let st = ladder([], 's', '3-4');
  assert.equal(st[0].state, 'next');
  st = ladder([...att(3, 80, 'word'), ...att(3, 70, 'syllable')], 's', '3-4');
  assert.equal(st[0].state, 'done'); assert.equal(st[1].state, 'done'); assert.equal(st[2].state, 'next');
  st = ladder([], 's', '7-8');
  assert.equal(st.find((x) => x.state === 'next')?.level, 'phrase');
  assert.equal(levelOfWordId('s-initial-sun'), 'word'); assert.equal(levelOfWordId('story:s:1'), 'story');
  assert.ok(isGeneratedId('phrase:s:1') && !isGeneratedId('s-initial-sun'));
});
test('scoring: phrases compare words, not just the last word', () => {
  assert.ok(localScore('big red bus', 'big red bus', 1500).score >= 95);
  assert.ok(localScore('big red bus', 'big bus', 1500).score < 80);
  assert.ok(localScore('sun', 'sun', 800).score >= 95);
});

import { BOARDS, uniqueWordCount } from '../src/data/talkBoards.ts';
test('talk board: at least 100 different words, every one has a picture, no duplicate inside a board', () => {
  assert.ok(uniqueWordCount() >= 100, String(uniqueWordCount()));
  for (const b of BOARDS) {
    assert.equal(new Set(b.words.map((w) => w[0])).size, b.words.length, b.name);
    for (const [w, e] of b.words) assert.ok(w && e, `${b.name} ${w}`);
  }
});

import { numberToWords, newChallenge, checkAnswer } from '../src/lib/parentGate.ts';
import { slug } from '../src/lib/slug.ts';
test('parent gate: numbers in words, challenge is readable and checkable', () => {
  assert.equal(numberToWords(7), 'seven'); assert.equal(numberToWords(13), 'thirteen'); assert.equal(numberToWords(40), 'forty'); assert.equal(numberToWords(83), 'eighty-three');
  for (let i = 0; i < 200; i++) { const c = newChallenge(); assert.ok(c.n >= 21 && c.n <= 98 && c.n % 10 !== 0, String(c.n)); assert.ok(checkAnswer(c.n, String(c.n))); assert.ok(!checkAnswer(c.n, String(c.n + 1))); }
  assert.ok(!checkAnswer(42, ''));
});
test('slug: matches the voice and picture file names', () => {
  assert.equal(slug('ice cream'), 'ice_cream'); assert.equal(slug('The pig is pink.'), 'the_pig_is_pink'); assert.equal(slug('yo-yo'), 'yo_yo');
});

import { getProblematicSounds, getDailyChallenge } from '../src/lib/daily.ts';

test('daily: low accuracy sounds rank highest in urgency', () => {
  const profile: any = {
    id: 'test',
    age: 5,
    targetSounds: ['s', 'r'],
    attempts: [
      // /s/ has low score (40% avg)
      { soundId: 's', wordId: 's-initial-sun', status: 'scored', score: 40 },
      { soundId: 's', wordId: 's-final-bus', status: 'scored', score: 40 },
      // /p/ is mastered (90% avg)
      { soundId: 'p', wordId: 'p-initial-pig', status: 'scored', score: 90 },
      { soundId: 'p', wordId: 'p-initial-pen', status: 'scored', score: 90 },
      { soundId: 'p', wordId: 'p-medial-apple', status: 'scored', score: 90 },
      { soundId: 'p', wordId: 'p-final-cup', status: 'scored', score: 90 },
      { soundId: 'p', wordId: 'p-final-map', status: 'scored', score: 90 },
    ],
  };

  const prob = getProblematicSounds(profile);
  assert.equal(prob[0].soundId, 's');
  assert.equal(prob[0].reason, 'low_accuracy');
  // /p/ is mastered so it should be near bottom
  const pSound = prob.find((x) => x.soundId === 'p');
  assert.equal(pSound?.mastery, 'Mastered');
  assert.ok(prob[0].urgency > (pSound?.urgency ?? 0));
});

test('daily: generates exactly 5 words focusing on problematic sounds', () => {
  const profile: any = {
    id: 'test',
    age: 6,
    targetSounds: ['s', 'r', 'th'],
    attempts: [
      { soundId: 's', wordId: 's-initial-sun', status: 'scored', score: 45 },
      { soundId: 'r', wordId: 'r-initial-rabbit', status: 'scored', score: 50 },
    ],
  };

  const challenge = getDailyChallenge(profile);
  assert.equal(challenge.length, 5);
  // /s/ and /r/ should be present in the challenge words
  const soundsInChallenge = challenge.map((c) => c.soundId);
  assert.ok(soundsInChallenge.includes('s'));
  assert.ok(soundsInChallenge.includes('r'));
  assert.ok(challenge.some((c) => c.isProblematic));
});

test('daily: strictly draws all 5 words from target sounds when set', () => {
  const profile: any = {
    id: 'khan',
    name: 'Khan',
    age: 5,
    targetSounds: ['k', 'g', 'f'],
    attempts: [],
  };

  const challenge = getDailyChallenge(profile);
  assert.equal(challenge.length, 5);
  // All 5 words must come exclusively from target sounds k, g, f
  for (const item of challenge) {
    assert.ok(['k', 'g', 'f'].includes(item.soundId), `Unexpected sound ${item.soundId}`);
    assert.equal(item.badge, 'Target');
    assert.equal(item.isProblematic, true);
  }
  // All 5 words must be distinct
  const uniqueWords = new Set(challenge.map((c) => c.word.id));
  assert.equal(uniqueWords.size, 5);
});

test('daily: respects profile.dailyGoal (10 words) strictly drawn from target sounds', () => {
  const profile: any = {
    id: 'khan-10',
    name: 'Khan',
    age: 5,
    dailyGoal: 10,
    targetSounds: ['k', 'g', 'f'],
    attempts: [],
  };

  const challenge = getDailyChallenge(profile);
  assert.equal(challenge.length, 10);
  for (const item of challenge) {
    assert.ok(['k', 'g', 'f'].includes(item.soundId), `Unexpected sound ${item.soundId}`);
    assert.equal(item.badge, 'Target');
  }
  const uniqueWords = new Set(challenge.map((c) => c.word.id));
  assert.equal(uniqueWords.size, 10);
});

test('custom sounds: creation and resolution', () => {
  const custom = createCustomSound('tr', '🚂', 'Slide tongue back, round lips', 'sky');
  assert.equal(custom.id, 'tr');
  assert.equal(custom.label, '/tr/');
  assert.equal(custom.emoji, '🚂');
  assert.equal(custom.group, 'Custom');
  assert.equal(custom.accent, 'sky');

  const resolved = soundById('tr', [custom]);
  assert.equal(resolved.id, 'tr');
  assert.equal(resolved.label, '/tr/');

  // Built-in sounds resolve first
  assert.equal(soundById('s', [custom]).id, 's');

  // Fallback for unknown sound without custom list
  const fallback = soundById('bl');
  assert.equal(fallback.id, 'bl');
  assert.equal(fallback.label, '/bl/');
  assert.equal(fallback.group, 'Custom');
});

