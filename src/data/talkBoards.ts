export type Accent = 'violet' | 'teal' | 'pink' | 'coral' | 'sky' | 'sunny' | 'green';
export interface Board { name: string; icon: string; accent: Accent; words: [string, string][] }

/** The picture boards on the Talk tab. Every word is spoken by the app's voice. */
export const BOARDS: Board[] = [
  { name: 'Core', icon: '⭐', accent: 'violet', words: [
    ['I', '🙋'], ['want', '🤲'], ['more', '➕'], ['help', '🆘'],
    ['eat', '🍽️'], ['drink', '🥤'], ['play', '🧸'], ['go', '🚶'],
    ['stop', '✋'], ['yes', '👍'], ['no', '🙅'], ['please', '🥺'],
    ['finished', '✅'], ['toilet', '🚽'], ['book', '📖'], ['ball', '⚽'],
    ['music', '🎵'], ['outside', '🌳'], ['home', '🏠'], ['mummy', '👩'],
    ['daddy', '👨'], ['happy', '😊'], ['sad', '😢'], ['hurt', '🤕'],
  ] },
  { name: 'Actions', icon: '🏃', accent: 'teal', words: [
    ['come', '🫴'], ['look', '👀'], ['give', '🤝'], ['open', '🔓'], ['wash', '🧼'], ['sleep', '🛌'],
    ['run', '🏃'], ['sit', '🪑'], ['jump', '🤸'], ['hug', '🤗'], ['wait', '⏳'], ['listen', '👂'],
  ] },
  { name: 'Feelings', icon: '😊', accent: 'pink', words: [
    ['angry', '😠'], ['scared', '😨'], ['tired', '😴'], ['excited', '🤩'], ['sick', '🤒'], ['love', '❤️'],
    ['hungry', '😋'], ['thirsty', '🥵'], ['sorry', '🙏'], ['proud', '🥹'], ['worried', '😟'], ['calm', '😌'],
  ] },
  { name: 'Food', icon: '🍎', accent: 'coral', words: [
    ['water', '💧'], ['milk', '🥛'], ['apple', '🍎'], ['banana', '🍌'], ['cookie', '🍪'], ['bread', '🍞'], ['juice', '🧃'], ['pizza', '🍕'],
    ['rice', '🍚'], ['egg', '🥚'], ['cheese', '🧀'], ['chicken', '🍗'], ['grapes', '🍇'], ['carrot', '🥕'], ['ice cream', '🍦'], ['cake', '🎂'],
  ] },
  { name: 'Play', icon: '⚽', accent: 'sky', words: [
    ['bubbles', '🫧'], ['draw', '🖍️'], ['swing', '🛝'], ['puzzle', '🧩'], ['video', '📺'], ['dance', '💃'],
    ['blocks', '🧱'], ['doll', '🪆'], ['bike', '🚲'], ['game', '🎮'], ['song', '🎤'], ['story', '📚'],
  ] },
  { name: 'People', icon: '🫂', accent: 'sunny', words: [
    ['friend', '🧒'], ['teacher', '🧑‍🏫'], ['baby', '👶'], ['grandma', '👵'], ['grandpa', '👴'], ['doctor', '🧑‍⚕️'],
    ['brother', '👦'], ['sister', '👧'], ['you', '🫵'], ['we', '🫂'], ['family', '🏡'], ['me', '🫶'],
  ] },
  { name: 'Places', icon: '🏠', accent: 'green', words: [
    ['school', '🏫'], ['park', '🏞️'], ['bed', '🛏️'], ['bathroom', '🛁'], ['shop', '🛒'], ['car', '🚗'],
    ['kitchen', '🍳'], ['garden', '🌷'], ['hospital', '🏥'], ['bus', '🚌'], ['beach', '🏖️'], ['playground', '🎠'],
  ] },
  { name: 'Body', icon: '🧍', accent: 'violet', words: [
    ['eyes', '👁️'], ['ears', '👂'], ['nose', '👃'], ['mouth', '👄'], ['hands', '🙌'], ['feet', '🦶'],
    ['tummy', '🫃'], ['teeth', '🦷'], ['hair', '💇'], ['arm', '💪'], ['leg', '🦵'], ['head', '🗣️'],
  ] },
];

export const uniqueWordCount = () => new Set(BOARDS.flatMap((b) => b.words.map((w) => w[0].toLowerCase()))).size;
