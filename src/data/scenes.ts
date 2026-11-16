/**
 * The picture for each phrase and story. Phrases are matched to the thing they describe
 * ("sit on sand" → the beach, "sweet soup" → a bowl of soup), not to the sound's emoji.
 * Sentences use the picture of the word they were written for (see levels.ts).
 */
export const PHRASE_PIC: Record<string, string> = {
  'pink pig': '🐷', 'happy puppy': '🐶', 'big cup': '🥤', 'a purple pen': '🖊️', 'pat the puppy': '🐕', 'pick up the pear': '🍐',
  'big ball': '⚽', 'baby bear': '🐻', 'red crab': '🦀', 'a blue bus': '🚌', 'bounce the ball': '🏀', 'bring a book': '📚',
  'mad monkey': '🐒', 'warm milk': '🥛', 'big drum': '🥁', 'more warm milk': '🥛', 'my mum hums': '👩', 'a funny monkey': '🐵',
  'nice nest': '🪺', 'sunny day': '🌞', 'ten buns': '🥯', 'a nice nap': '😴', 'nine new notes': '🎵', 'none for Nan': '👵',
  'tall tree': '🌳', 'tiny turtle': '🐢', 'hot tea': '🍵', 'take two turns': '🎲', 'a tiny tiger': '🐯', 'tap the table': '🪑',
  'big dog': '🐕', 'dark door': '🚪', 'red bed': '🛏️', 'Dad did it': '👨', 'a dirty duck': '🦆', 'draw a dinosaur': '🦖',
  'kind king': '🤴', 'cold cake': '🎂', 'black cat': '🐈‍⬛', 'kick the can': '🥫', 'a cute kitten': '🐱', 'cook some cake': '🧁',
  'green grass': '🌱', 'good girl': '👧', 'big bag': '👜', 'get the goat': '🐐', 'give a gift': '🎁', 'go get gold': '🪙',
  'fat fish': '🐟', 'funny fox': '🦊', 'soft leaf': '🍃', 'a fun farm': '🚜', 'find four fish': '🐠', 'feed the fox': '🦊',
  'five vans': '🚐', 'brave vet': '🩺', 'old volcano': '🌋', 'a violet vest': '🦺', 'visit the vet': '🐾', 'give me five': '🖐️',
  'sunny sky': '☀️', 'sweet soup': '🍲', 'big bus': '🚌', 'see the sun': '🌞', 'sit on sand': '🏖️', 'a silly snake': '🐍',
  'busy bees': '🐝', 'zippy zebra': '🦓', 'lazy daisy': '🌼', 'zoom to the zoo': '🦁', 'zip the zipper': '🧥', 'a dizzy zebra': '🦓',
  'red rabbit': '🐰', 'big rocket': '🚀', 'rainy road': '🌧️', 'run to the river': '🏞️', 'a round rainbow': '🌈', 'row the boat': '🚣',
  'little lion': '🦁', 'yellow lemon': '🍋', 'cold hill': '⛰️', 'look at the lamp': '💡', 'a lazy lizard': '🦎', 'lots of leaves': '🍂',
  'big ship': '🚢', 'shiny shoe': '👟', 'fresh fish': '🐟', 'a shy sheep': '🐑', 'wash the dishes': '🍽️', 'shut the shop': '🏪',
  'chubby chick': '🐥', 'cheesy chips': '🍟', 'beach chair': '🏖️', 'chop the cheese': '🧀', 'a cheeky chimp': '🐵', 'catch a chick': '🐤',
  'three thumbs': '👍', 'thin thread': '🧵', 'bath time': '🛁', 'three thin things': '3️⃣', 'think of nothing': '💭', 'brush both teeth': '🪥',
  'happy hippo': '🦛', 'big house': '🏠', 'hairy horse': '🐴', 'hug the hamster': '🐹', 'a happy hen': '🐔', 'help me hop': '🐇',
  'wet wolf': '🐺', 'warm water': '💧', 'wise owl': '🦉', 'we wave hello': '👋', 'a wobbly window': '🪟', 'walk with me': '🚶',
  'yellow yo-yo': '🪀', 'yummy yogurt': '🥣', 'young yak': '🐂', 'a yellow yacht': '⛵', 'yes you can': '👍', 'you yawn loudly': '🥱',
  'long song': '🎤', 'big ring': '💍', 'strong king': '💪', 'sing a song': '🎶', 'a long swing': '🛝', 'bring the ring': '💍',
  'jolly jelly': '🍮', 'juicy jam': '🍓', 'big jump': '🤸', 'jump in July': '🏃', 'a jar of jam': '🫙', 'judge the jug': '⚖️',
  'big star': '⭐', 'hot toast': '🍞', 'stop sign': '🛑', 'stand on a stone': '🪨', 'stop at the post': '📮', 'a star at last': '🌟',
  'beige garage': '🏠', 'pleasure treasure': '💎', 'long measure': '📏', 'watch the television': '📺', 'measure the treasure': '📏', 'a usual decision': '🤔',
  'this and that': '👉', 'my mother': '👩', 'my brother': '👦', 'they were together': '🫂', 'these and those': '👉', 'the weather today': '⛅',
};

/** One picture for each story. */
export const STORY_PIC: Record<string, string> = {
  p: '🐶', b: '🐻', m: '🍽️', n: '🪺', t: '🐢', d: '🕳️', k: '🪁', g: '🐐', f: '🐥', v: '🚐', s: '🐟', z: '🦓',
  r: '🚀', l: '🦎', sh: '🐚', ch: '🐵', th: '🧵', h: '🦛', w: '🐺', y: '🐂', ng: '🔔', j: '🍓', st: '⭐', zh: '📺', dh: '🏡',
};
