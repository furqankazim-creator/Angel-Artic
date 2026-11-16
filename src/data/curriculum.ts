import type { Band } from './sounds.ts';

/** Maps a child's age to a content band. Under 5 is 3-4, 5-6 is 5-6, 7 and over is 7-8. */
export function bandFor(age: number): Band {
  return age <= 4 ? '3-4' : age <= 6 ? '5-6' : '7-8';
}

export interface BandInfo {
  label: string;
  focus: string[]; // sounds most children of this age are expected to be working on
  emerging: string[]; // sounds that may still be developing: practise gently
  wordLevel: string;
  sentenceLevel: string;
  goal: string;
}

/**
 * Age bands are a teaching guide, not a diagnosis. Sound ages follow commonly cited English norms
 * (for example McLeod and Crowe, 2018) and vary between children, accents and clinics.
 * A speech-language therapist should confirm targets for any child with a concern.
 */
export const BANDS: Record<Band, BandInfo> = {
  '3-4': {
    label: 'Ages 3 to 4',
    focus: ['p', 'b', 'm', 'n', 't', 'd', 'h', 'w'],
    emerging: ['k', 'g', 'f', 'ng'],
    wordLevel: 'Short, familiar one- and two-syllable words.',
    sentenceLevel: 'Short sentences of three to five words.',
    goal: 'Clear, easy-to-copy early sounds. Play first, accuracy second.',
  },
  '5-6': {
    label: 'Ages 5 to 6',
    focus: ['k', 'g', 'f', 'v', 's', 'z', 'l', 'sh', 'ch', 'ng', 'j', 'y'],
    emerging: ['r', 'th', 'st', 'dh'],
    wordLevel: 'Core words, then longer words of two to four syllables.',
    sentenceLevel: 'Full sentences of six to eight words.',
    goal: 'Secure the sounds used at school, in all three word positions.',
  },
  '7-8': {
    label: 'Ages 7 to 8',
    focus: ['r', 'th', 'dh', 'zh', 'st', 'j', 'l', 'sh', 'ch', 's', 'z'],
    emerging: [],
    wordLevel: 'Longer and multi-syllable words first, core words to warm up.',
    sentenceLevel: 'Longer sentences and a tongue twister for each sound.',
    goal: 'Automatic, accurate sounds in fast, connected speech.',
  },
};

export interface SoundInfo {
  ipa: string;
  how: string; // voicing, place and manner
  usual: string; // when most children have the sound
  pair: [string, string]; // minimal pair for a listening game
  twister: string;
}

export const SOUND_INFO: Record<string, SoundInfo> = {
  p: { ipa: '/p/', how: 'Voiceless bilabial plosive', usual: 'by about 3', pair: ['pea', 'bee'], twister: 'Peter Piper picked a peck of pickled peppers.' },
  b: { ipa: '/b/', how: 'Voiced bilabial plosive', usual: 'by about 3', pair: ['bat', 'pat'], twister: 'Big blue bears bounce brown balls.' },
  m: { ipa: '/m/', how: 'Voiced bilabial nasal', usual: 'by about 3', pair: ['map', 'nap'], twister: 'Many mighty monkeys munch mangoes.' },
  n: { ipa: '/n/', how: 'Voiced alveolar nasal', usual: 'by about 3', pair: ['no', 'toe'], twister: 'Nina napped nine nights in a nest.' },
  t: { ipa: '/t/', how: 'Voiceless alveolar plosive', usual: 'by about 3 to 4', pair: ['tie', 'die'], twister: 'Ten tiny turtles tiptoe to town.' },
  d: { ipa: '/d/', how: 'Voiced alveolar plosive', usual: 'by about 3 to 4', pair: ['dime', 'time'], twister: 'Dad and Dan dug a deep ditch.' },
  k: { ipa: '/k/', how: 'Voiceless velar plosive', usual: 'by about 3 to 4', pair: ['key', 'tea'], twister: 'Kind Kate keeps cats and kittens.' },
  g: { ipa: '/ɡ/', how: 'Voiced velar plosive', usual: 'by about 3 to 4', pair: ['go', 'dough'], twister: 'Gus gave green grapes to the goat.' },
  f: { ipa: '/f/', how: 'Voiceless labiodental fricative', usual: 'by about 4', pair: ['fan', 'pan'], twister: 'Five fat frogs fell from a fig tree.' },
  v: { ipa: '/v/', how: 'Voiced labiodental fricative', usual: 'by about 5 to 6', pair: ['van', 'ban'], twister: 'Victor drove seven vans over the valley.' },
  s: { ipa: '/s/', how: 'Voiceless alveolar fricative', usual: 'by about 4 to 5', pair: ['sip', 'ship'], twister: 'Sam sells seven sandy seashells.' },
  z: { ipa: '/z/', how: 'Voiced alveolar fricative', usual: 'by about 4 to 5', pair: ['zoo', 'sue'], twister: 'Zack zooms a zippy zebra across the zoo.' },
  sh: { ipa: '/ʃ/', how: 'Voiceless postalveolar fricative', usual: 'by about 4 to 5', pair: ['ship', 'sip'], twister: 'She sells shiny shells on the shore.' },
  ch: { ipa: '/tʃ/', how: 'Voiceless postalveolar affricate', usual: 'by about 4 to 5', pair: ['chair', 'share'], twister: 'Cheeky chimps chew cherries and chips.' },
  l: { ipa: '/l/', how: 'Voiced alveolar lateral approximant', usual: 'by about 4 to 5', pair: ['lake', 'rake'], twister: 'Lola licks lemon lollies lazily.' },
  r: { ipa: '/r/', how: 'Voiced postalveolar approximant', usual: 'by about 5 to 6, sometimes later', pair: ['red', 'wed'], twister: 'Round rabbits race red rockets.' },
  h: { ipa: '/h/', how: 'Voiceless glottal fricative', usual: 'by about 3', pair: ['hat', 'at'], twister: 'Harry the happy hippo hops home.' },
  w: { ipa: '/w/', how: 'Voiced labial-velar approximant', usual: 'by about 3', pair: ['wing', 'ring'], twister: 'Wendy wore warm woolly wellies.' },
  y: { ipa: '/j/', how: 'Voiced palatal approximant', usual: 'by about 4 to 5', pair: ['yes', 'less'], twister: 'Yesterday Yara yawned a yellow yawn.' },
  ng: { ipa: '/ŋ/', how: 'Voiced velar nasal', usual: 'by about 3 to 4', pair: ['sing', 'sin'], twister: 'The strong king sang a long song.' },
  j: { ipa: '/dʒ/', how: 'Voiced postalveolar affricate', usual: 'by about 4 to 5', pair: ['jam', 'yam'], twister: 'Jack jumped and juggled jam jars.' },
  st: { ipa: '/st/', how: 'Voiceless alveolar fricative plus plosive (blend)', usual: 'by about 5 to 6', pair: ['star', 'tar'], twister: 'Stella stood still on the stone staircase.' },
  zh: { ipa: '/ʒ/', how: 'Voiced postalveolar fricative', usual: 'by about 6 to 7', pair: ['vision', 'fission'], twister: 'It is a pleasure to measure treasure.' },
  dh: { ipa: '/ð/', how: 'Voiced dental fricative', usual: 'by about 5 to 7', pair: ['then', 'zen'], twister: 'My brother and father gather feathers together.' },
  th: { ipa: '/θ/', how: 'Voiceless dental fricative', usual: 'by about 5 to 7', pair: ['thin', 'fin'], twister: 'Thea thinks three thin threads are enough.' },
};

export const ageNote = 'Age bands are a guide, not a diagnosis. Children develop at different speeds. If you have a concern, ask a speech-language therapist.';
