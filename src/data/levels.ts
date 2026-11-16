import { SOUNDS, WORDS, wordsFor, type Band, type Word } from './sounds.ts';
import { SOUND_INFO } from './curriculum.ts';
import { PHRASE_PIC, STORY_PIC } from './scenes.ts';

/** The learning ladder for every sound, from easiest to hardest. */
export type Level = 'sound' | 'syllable' | 'word' | 'phrase' | 'sentence' | 'story';
export interface LevelMeta { id: Level; label: string; icon: string; hint: string }

export const LEVELS: LevelMeta[] = [
  { id: 'sound', label: 'Sound', icon: '🔈', hint: 'Watch the mouth and make the sound on its own.' },
  { id: 'syllable', label: 'Syllables', icon: '🧩', hint: 'Join the sound to a vowel: pah, pee, poo.' },
  { id: 'word', label: 'Words', icon: '🔤', hint: 'The sound at the start, middle and end of words.' },
  { id: 'phrase', label: 'Phrases', icon: '💬', hint: 'Two or three words together.' },
  { id: 'sentence', label: 'Sentences', icon: '📝', hint: 'Whole sentences with the sound in them.' },
  { id: 'story', label: 'Story', icon: '📖', hint: 'A short story, read aloud in your best voice.' },
];
export const levelMeta = (l: Level) => LEVELS.find((x) => x.id === l)!;

/** Levels offered per age band, and where a child of that age should usually begin. */
export const BAND_LEVELS: Record<Band, { levels: Level[]; start: Level }> = {
  '3-4': { levels: ['word', 'syllable', 'phrase', 'sentence'], start: 'word' },
  '5-6': { levels: ['word', 'syllable', 'phrase', 'sentence', 'story'], start: 'word' },
  '7-8': { levels: ['word', 'syllable', 'phrase', 'sentence', 'story'], start: 'phrase' },
};

/** A keyword that already has a recorded model voice. */
export const KEY: Record<string, string> = {
  p: 'pig', b: 'ball', m: 'moon', n: 'nose', t: 'tiger', d: 'dog', k: 'cake', g: 'goat', f: 'fish',
  v: 'van', s: 'sun', z: 'zebra', r: 'rabbit', l: 'lion', sh: 'ship', ch: 'chick', th: 'thumb',
  h: 'hat', w: 'wolf', y: 'yarn', ng: 'ring', j: 'jam', zh: 'vision', dh: 'this', st: 'star',
};
export const SOUND_ANCHORS = KEY;

/** Levels that make no sense for a sound (a voice cannot say these on their own, so no syllable drills). */
const SKIP_LEVELS: Record<string, Level[]> = { zh: ['syllable'], dh: ['syllable'] };
export const levelsFor = (soundId: string, band: Band): Level[] => BAND_LEVELS[band].levels.filter((l) => !SKIP_LEVELS[soundId]?.includes(l));

// [easy two-word phrases, longer three-word phrases]
const PHRASES: Record<string, [string[], string[]]> = {
  p: [['pink pig', 'happy puppy', 'big cup'], ['a purple pen', 'pat the puppy', 'pick up the pear']],
  b: [['big ball', 'baby bear', 'red crab'], ['a blue bus', 'bounce the ball', 'bring a book']],
  m: [['mad monkey', 'warm milk', 'big drum'], ['more warm milk', 'my mum hums', 'a funny monkey']],
  n: [['nice nest', 'sunny day', 'ten buns'], ['a nice nap', 'nine new notes', 'none for Nan']],
  t: [['tall tree', 'tiny turtle', 'hot tea'], ['take two turns', 'a tiny tiger', 'tap the table']],
  d: [['big dog', 'dark door', 'red bed'], ['Dad did it', 'a dirty duck', 'draw a dinosaur']],
  k: [['kind king', 'cold cake', 'black cat'], ['kick the can', 'a cute kitten', 'cook some cake']],
  g: [['green grass', 'good girl', 'big bag'], ['get the goat', 'give a gift', 'go get gold']],
  f: [['fat fish', 'funny fox', 'soft leaf'], ['a fun farm', 'find four fish', 'feed the fox']],
  v: [['five vans', 'brave vet', 'old volcano'], ['a violet vest', 'visit the vet', 'give me five']],
  s: [['sunny sky', 'sweet soup', 'big bus'], ['see the sun', 'sit on sand', 'a silly snake']],
  z: [['busy bees', 'zippy zebra', 'lazy daisy'], ['zoom to the zoo', 'zip the zipper', 'a dizzy zebra']],
  r: [['red rabbit', 'big rocket', 'rainy road'], ['run to the river', 'a round rainbow', 'row the boat']],
  l: [['little lion', 'yellow lemon', 'cold hill'], ['look at the lamp', 'a lazy lizard', 'lots of leaves']],
  sh: [['big ship', 'shiny shoe', 'fresh fish'], ['a shy sheep', 'wash the dishes', 'shut the shop']],
  ch: [['chubby chick', 'cheesy chips', 'beach chair'], ['chop the cheese', 'a cheeky chimp', 'catch a chick']],
  th: [['three thumbs', 'thin thread', 'bath time'], ['three thin things', 'think of nothing', 'brush both teeth']],
  h: [['happy hippo', 'big house', 'hairy horse'], ['hug the hamster', 'a happy hen', 'help me hop']],
  w: [['wet wolf', 'warm water', 'wise owl'], ['we wave hello', 'a wobbly window', 'walk with me']],
  y: [['yellow yo-yo', 'yummy yogurt', 'young yak'], ['a yellow yacht', 'yes you can', 'you yawn loudly']],
  ng: [['long song', 'big ring', 'strong king'], ['sing a song', 'a long swing', 'bring the ring']],
  j: [['jolly jelly', 'juicy jam', 'big jump'], ['jump in July', 'a jar of jam', 'judge the jug']],
  st: [['big star', 'hot toast', 'stop sign'], ['stand on a stone', 'stop at the post', 'a star at last']],
  zh: [['beige garage', 'pleasure treasure', 'long measure'], ['watch the television', 'measure the treasure', 'a usual decision']],
  dh: [['this and that', 'my mother', 'my brother'], ['they were together', 'these and those', 'the weather today']],
};

const STORIES: Record<string, string> = {
  p: 'Pip the puppy found a purple parcel in the park. He pushed it, pulled it and popped it open. Inside was a plump pink pear.',
  b: 'Ben the baby bear built a big boat from blue boxes. He bobbed along the bubbly brook. Bump! The boat bumped a rubber duck.',
  m: 'My mum made a mountain of mashed potato for Monday dinner. Tom munched and Millie hummed. Mmm, it was marvellous.',
  n: 'Nina and Noah noticed a nest in the nearest tree. Nine tiny eggs sat inside. They tiptoed away and kept quiet.',
  t: 'Tim took ten tiny turtles to the town pond. They tumbled in and tapped the water. Tim waited to watch them take a bath.',
  d: 'Dad and Daisy dug a deep hole in the garden. Down in the dirt they found an old red door key.',
  k: 'Kate the kind kitten kept a kite in a basket. A strong gust took it up, up and away. Kate waved as it flew.',
  g: 'Gus the goat got a gift of green grapes. He gobbled them with a happy gulp. Then Gus grinned and shared them with the geese.',
  f: 'Fiona fed five fluffy chicks on the farm. A friendly fox peeped out of a field of ferns. The chicks flapped off to find their mother.',
  v: 'Vera drove her van to a volcano with seven brave friends. They wore bright vests and ate vegetable soup.',
  s: 'Sam saw seven silver fish swim past the sandy shore. A seagull sat on a post and sang a silly song.',
  z: 'Zara zipped up her jacket and went to the zoo with Zack. They saw a zebra and heard the bees buzzing. It was a lazy, dizzy day.',
  r: 'Ron raced his red rocket down the road. A rabbit ran by and Ron raised his arm to wave. The rocket rolled right into a rose bush.',
  l: 'Lola the little lizard lay on a large yellow leaf. She licked a lollipop and looked at the lake. A leaf fell, and Lola laughed loudly.',
  sh: 'Shelley sells shells on the shore each Sunday. A shy fish showed up and shook its shiny tail. She shared her fresh lunch with it.',
  ch: 'Charlie the cheeky chimp chewed cheese and chips on a bench. A chilly breeze made him chuckle. He chose to catch a choo-choo train to the beach.',
  th: 'On Thursday, Thea threw a thick thread through three thin beads. Both of her thumbs got a little sore. Then she thanked everyone with a smile.',
  h: 'Harry the hippo hurried home on a hot day. He hugged his hen and hung up his hat. Then he had a big hot chocolate.',
  w: 'Will went for a walk with his wolf puppy in the warm weather. They watched the waves and waded in the water. What a wonderful day!',
  y: 'Yesterday, Yara took her yak to the yard. She yelled yippee and played with a yo-yo. Yummy yogurt was the best end to the day.',
  ng: 'The king and the singer sang a long song. A ringing bell rang along. It was a strong and happy evening.',
  j: 'Jack and June made jam in July. They jumped for joy when the jar was full. Then Jack gave a jar to the judge.',
  st: 'Stella the star stood on a stone staircase. She stopped to stroke a stray cat and a stork. Then she stepped back to the stars.',
  zh: 'Last evening we watched television. A pirate measured his treasure with great pleasure. It was quite a vision.',
  dh: 'This is my mother, and that is my father. My brother and I gather feathers together. Then we show them the feathers.',
};

const VOWELS = ['ah', 'ee', 'oo'];

function item(kind: Level, soundId: string, key: string, text: string, tip: string, emoji?: string): Word {
  const snd = SOUNDS.find((s) => s.id === soundId) ?? { emoji: '⭐' };
  return { id: `${kind}:${soundId}:${key}`, soundId, position: 'initial', word: text, emoji: emoji ?? snd.emoji, sentence: tip, kind };
}

/** Every generated item for a sound at a level (all difficulty tiers; callers pick by band). */
function build(soundId: string, level: Level): Word[] {
  const info = SOUND_INFO[soundId] ?? { ipa: `/${soundId}/`, twister: `Say the ${soundId} sound clearly.` };
  const lead = soundId;
  const keyWord = KEY[soundId] ?? soundId;
  switch (level) {
    case 'sound':
      return [{ ...item('sound', soundId, '1', info.ipa, `Listen to “${keyWord}”, then make the ${info.ipa} sound by itself.`), speakText: keyWord }];
    case 'syllable': {
      const snd = SOUNDS.find((x) => x.id === soundId);
      const pos = snd ? snd.positions : ['initial', 'medial', 'final'];
      return [
        ...(pos.includes('initial') ? VOWELS.map((v) => item('syllable', soundId, `i-${v}`, `${lead}${v}`, 'Say it smoothly.')) : []),
        ...(pos.includes('final') ? VOWELS.map((v) => item('syllable', soundId, `f-${v}`, `${v}${lead}`, 'Say it smoothly.')) : []),
        ...VOWELS.slice(0, 2).map((v) => item('syllable', soundId, `m-${v}`, `${v}${lead}${v}`, 'Say it smoothly.')),
      ];
    }
    case 'phrase': {
      const phrases = PHRASES[soundId] ? [...PHRASES[soundId][0], ...PHRASES[soundId][1]] : [`practise ${soundId}`, `fun ${soundId} sound`];
      return phrases.map((p, i) => item('phrase', soundId, String(i), p, 'Say the whole phrase.', PHRASE_PIC[p]));
    }
    case 'sentence':
      return [
        ...WORDS.filter((w) => w.soundId === soundId && w.level === 1).filter((_, i) => i % 2 === 0).map((w) => ({ ...item('sentence', soundId, `c-${w.word}`, w.sentence, 'Say the whole sentence.', w.emoji), tier: 1 })),
        ...WORDS.filter((w) => w.soundId === soundId && w.level === 2).map((w) => ({ ...item('sentence', soundId, `s-${w.word}`, w.sentence, 'Say the whole sentence.', w.emoji), tier: 2 })),
        { ...item('sentence', soundId, 'twister', info.twister, 'A tongue twister. Start slowly, then go a little faster.'), tier: 3 },
      ];
    case 'story': {
      const story = STORIES[soundId] ?? `Let's practice the /${soundId}/ sound together! Say each word carefully and clearly.`;
      return [item('story', soundId, '1', story, 'Read the story in your best voice, one sentence at a time.', STORY_PIC[soundId])];
    }
    default:
      return [];
  }
}

const cache = new Map<string, Word[]>();
export function allItems(soundId: string, level: Level): Word[] {
  const k = `${soundId}|${level}`;
  if (!cache.has(k)) cache.set(k, build(soundId, level));
  return cache.get(k)!;
}

export const ALL_ITEMS: Word[] = SOUNDS.flatMap((s) => LEVELS.filter((l) => l.id !== 'word' && !SKIP_LEVELS[s.id]?.includes(l.id)).flatMap((l) => allItems(s.id, l.id)));

/** The items a child of this age practises at a level, easiest first. */
export function itemsFor(soundId: string, level: Level, band: Band, custom: Word[] = []): Word[] {
  if (level === 'word') return wordsFor(soundId, 'initial', custom, band); // positions are chosen in the screen
  const all = allItems(soundId, level);
  if (level === 'syllable') {
    const pick = band === '3-4' ? all.filter((w) => w.id.includes(':i-')) : band === '5-6' ? all.filter((w) => !w.id.includes(':m-')) : all;
    return pick.length ? pick : all;
  }
  if (level === 'phrase') return band === '3-4' ? all.slice(0, 3) : band === '5-6' ? all : [...all.slice(3), ...all.slice(0, 3)];
  if (level === 'sentence') {
    const tier = (w: Word) => (w as any).tier as number;
    return band === '3-4' ? all.filter((w) => tier(w) === 1) : band === '5-6' ? all.filter((w) => tier(w) === 2) : all.filter((w) => tier(w) >= 2).reverse();
  }
  return all;
}

export function levelOfWordId(id: string): Level {
  const p = id.split(':')[0] as Level;
  return LEVELS.some((l) => l.id === p) && id.includes(':') ? p : 'word';
}
export const isGeneratedId = (id: string) => id.includes(':');

export type StepState = 'done' | 'next' | 'todo';
export interface Step { level: Level; tries: number; avg: number; state: StepState }

/**
 * A level is done after 3 scored tries averaging 60 or more. Nothing is ever locked:
 * the ladder only shows what to try next. "Next" is the first level not yet done,
 * starting from the first level for the child's age.
 */
export function ladder(attempts: { wordId: string; soundId: string; status: string; score: number }[], soundId: string, band: Band): Step[] {
  const { start } = BAND_LEVELS[band];
  const levels = levelsFor(soundId, band);
  const steps: Step[] = levels.map((level) => {
    const a = attempts.filter((x) => x.soundId === soundId && x.status === 'scored' && levelOfWordId(x.wordId) === level);
    const avg = a.length ? Math.round(a.reduce((n, x) => n + x.score, 0) / a.length) : 0;
    return { level, tries: a.length, avg, state: a.length >= 3 && avg >= 60 ? 'done' : 'todo' };
  });
  const from = Math.max(0, levels.indexOf(start) >= 0 ? levels.indexOf(start) : 0);
  const nextIdx = steps.findIndex((s, i) => i >= from && s.state !== 'done');
  if (nextIdx >= 0) steps[nextIdx].state = 'next';
  return steps;
}
