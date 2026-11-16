import { type Accent, accentCycle } from '../theme.ts';

export type Position = 'initial' | 'medial' | 'final';
export const POSITIONS: Position[] = ['initial', 'medial', 'final'];
export type Group = 'Early' | 'Intermediate' | 'Late' | 'Custom';

export interface Sound {
  id: string;
  label: string; // e.g. /s/
  positions: Position[]; // where the sound can occur in English words
  letters: string; // spelling used to underline the sound in a word
  group: Group;
  accent: Accent;
  emoji: string;
  cue: string;
  watch: string;
}
export interface Word {
  id: string;
  soundId: string;
  position: Position;
  word: string;
  emoji: string;
  sentence: string;
  level?: 1 | 2; // 1 = core word, 2 = stretch word for older children
  kind?: 'sound' | 'syllable' | 'word' | 'phrase' | 'sentence' | 'story'; // generated ladder items
  speakText?: string; // what the voice says when it differs from the text shown
  tier?: number;
  custom?: boolean;
  imageUri?: string;
  voiceUri?: string;
}

const S: [string, Group, string, string, string][] = [
  ['p', 'Early', '🎈', 'Close your lips, then pop out a puff of air.', 'Lips together, then open with a little pop.'],
  ['b', 'Early', '🐻', 'Lips together, voice on, then pop them open.', 'Lips together and buzz your voice, then pop open.'],
  ['m', 'Early', '🌙', 'Lips together and hum through your nose.', 'Lips stay closed. Feel a hum on your lips.'],
  ['t', 'Early', '🐯', 'Tongue tip taps behind your top teeth.', 'Tongue tip up behind top teeth, tap and release.'],
  ['d', 'Early', '🐶', 'Tongue taps behind your top teeth with your voice on.', 'Tap behind top teeth and let your voice buzz.'],
  ['n', 'Early', '👃', 'Tongue behind top teeth, hum through your nose.', 'Tongue up and hold. Feel the hum in your nose.'],
  ['k', 'Intermediate', '🐄', 'The back of your tongue lifts to the roof of your mouth, then drops.', 'Back of the tongue goes up, then pops down.'],
  ['g', 'Intermediate', '🐐', 'Back of your tongue lifts up with your voice on, then drops.', 'Back of the tongue goes up and your voice buzzes.'],
  ['f', 'Intermediate', '🐟', 'Top teeth touch your bottom lip, then blow air.', 'Bite your bottom lip gently and blow.'],
  ['v', 'Intermediate', '🎻', 'Top teeth touch your bottom lip, then buzz your voice.', 'Bite your bottom lip gently and buzz like a bee.'],
  ['s', 'Intermediate', '☀️', 'Teeth close, tongue behind them, hiss like a snake.', 'Teeth together, tongue tip behind them, hiss.'],
  ['z', 'Intermediate', '🦓', 'Same as /s/, but turn your voice on and buzz like a bee.', 'Teeth together, tongue behind them, buzz.'],
  ['r', 'Late', '🐰', 'Lips round a little, tongue pulled back and bunched, growl like a tiger.', 'Tongue pulls back and bunches up. Do not touch the roof.'],
  ['l', 'Late', '🦁', 'Tongue tip lifts and touches behind your top teeth, voice on.', 'Tongue tip up and touching. Let your voice sing.'],
  ['sh', 'Late', '🤫', 'Lips push out, teeth close, say "shhh" like a quiet librarian.', 'Round your lips, teeth together, long soft shhh.'],
  ['ch', 'Late', '🚂', 'Start with a /t/ tongue tap, then slide into "sh" like a choo-choo train.', 'Tap your tongue, then shhh. Choo choo!'],
  ['th', 'Late', '👅', 'Tongue tip peeks between your teeth, then blow softly.', 'Poke your tongue tip out between your teeth and blow.'],
  ['h', 'Early', '🏠', 'Open your mouth a little and breathe out a warm breath, like fogging a mirror.', 'Mouth open, no voice, just a warm breath.'],
  ['w', 'Early', '🐺', 'Round your lips like a little o, then open and let your voice go.', 'Lips go round, then open as your voice starts.'],
  ['y', 'Intermediate', '🪀', 'Smile a little, lift the middle of your tongue, and let your voice slide.', 'Middle of the tongue lifts, then glides down.'],
  ['ng', 'Intermediate', '💍', 'Back of your tongue lifts to the soft roof and the hum goes through your nose.', 'Back of the tongue up, hum through the nose.'],
  ['j', 'Intermediate', '🧃', 'Start with a /d/ tongue tap, then slide into a buzzy shh.', 'Tap your tongue, then buzz: j.'],
  ['st', 'Late', '⭐', 'Hiss like a snake, then tap your tongue up for a quick /t/.', 'Hiss sss, then tap t, with no gap.'],
  ['zh', 'Late', '📺', 'Like shh, but turn your voice on and buzz.', 'Lips out, teeth close, buzz zhh.'],
  ['dh', 'Late', '🪶', 'Tongue tip peeks between your teeth, then buzz your voice.', 'Poke your tongue tip out and let your voice buzz.'],
];
const LIMITED: Record<string, Position[]> = {
  h: ['initial', 'medial'], w: ['initial', 'medial'], y: ['initial', 'medial'], dh: ['initial', 'medial'],
  ng: ['medial', 'final'], zh: ['medial', 'final'],
};
const LETTERS: Record<string, string> = { dh: 'th', zh: 's' };

export const SOUNDS: Sound[] = S.map(([id, group, emoji, cue, watch], i) => ({
  id, group, emoji, cue, watch, label: `/${id}/`, accent: accentCycle[i % 7], positions: LIMITED[id] ?? POSITIONS, letters: LETTERS[id] ?? id,
}));
export const GROUPS: Group[] = ['Early', 'Intermediate', 'Late', 'Custom'];

export function createCustomSound(
  rawId: string,
  emoji = '⭐',
  cue = '',
  accent: Accent = 'coral',
  positions: Position[] = POSITIONS,
): Sound {
  const cleanId = rawId.toLowerCase().replace(/[^a-z0-9_]/g, '');
  return {
    id: cleanId,
    group: 'Custom',
    emoji: emoji.trim() || '⭐',
    cue: cue.trim() || `Practise the /${cleanId}/ sound clearly.`,
    watch: 'Watch mouth shape and tongue position carefully.',
    label: `/${cleanId}/`,
    accent,
    positions: positions.length ? positions : POSITIONS,
    letters: cleanId,
  };
}

export const soundById = (id: string, customSounds: Sound[] = []): Sound => {
  const found = SOUNDS.find((s) => s.id === id) || customSounds.find((s) => s.id === id);
  if (found) return found;
  return createCustomSound(id);
};

// word|emoji|sentence — 4 words per sound per position (initial, medial, final)
const RAW: Record<string, [string, string, string][][]> = {
  p: [
    [['pig','🐷','The pig is pink.'],['pen','🖊️','I write with a pen.'],['pizza','🍕','I eat pizza.'],['pear','🍐','The pear is sweet.']],
    [['puppy','🐶','The puppy plays.'],['apple','🍎','I eat an apple.'],['zipper','🧥','Pull the zipper up.'],['carpet','🟫','The carpet is soft.']],
    [['cup','☕','I hold a cup.'],['soap','🧼','Wash with soap.'],['map','🗺️','Look at the map.'],['sheep','🐑','The sheep is fluffy.']],
  ],
  b: [
    [['ball','⚽','Kick the ball.'],['bear','🐻','The bear is big.'],['banana','🍌','I peel a banana.'],['bus','🚌','The bus is yellow.']],
    [['baby','👶','The baby smiles.'],['ribbon','🎀','The ribbon is red.'],['robot','🤖','The robot walks.'],['number','🔢','Say the number.']],
    [['crab','🦀','The crab is red.'],['tub','🛁','I sit in the tub.'],['web','🕸️','The web is sticky.'],['cab','🚕','The cab is fast.']],
  ],
  m: [
    [['moon','🌙','The moon is bright.'],['mouse','🐭','The mouse is small.'],['milk','🥛','I drink milk.'],['monkey','🐒','The monkey climbs.']],
    [['hammer','🔨','Tap with the hammer.'],['lemon','🍋','The lemon is sour.'],['camera','📷','Smile at the camera.'],['farmer','🧑‍🌾','The farmer waves.']],
    [['drum','🥁','Bang the drum.'],['worm','🪱','The worm wiggles.'],['broom','🧹','Sweep with the broom.'],['ham','🍖','I like ham.']],
  ],
  t: [
    [['tiger','🐯','The tiger roars.'],['train','🚂','The train goes choo.'],['tree','🌳','The tree is tall.'],['turtle','🐢','The turtle is slow.']],
    [['water','💧','I drink water.'],['butter','🧈','Butter on my toast.'],['kitten','🐱','The kitten purrs.'],['potato','🥔','I eat a potato.']],
    [['cat','🐱','The cat naps.'],['boat','⛵','The boat floats.'],['hat','🎩','I wear a hat.'],['kite','🪁','The kite flies.']],
  ],
  d: [
    [['dog','🐶','The dog barks.'],['duck','🦆','The duck swims.'],['door','🚪','Open the door.'],['dinosaur','🦕','The dinosaur stomps.']],
    [['ladder','🪜','Climb the ladder.'],['candy','🍬','I like candy.'],['radio','📻','Turn on the radio.'],['window','🪟','Look out the window.']],
    [['bed','🛏️','Time for bed.'],['bird','🐦','The bird sings.'],['cloud','☁️','The cloud is white.'],['hand','✋','Wave your hand.']],
  ],
  n: [
    [['nose','👃','I smell with my nose.'],['nest','🪺','The nest is cosy.'],['nine','9️⃣','I have nine toys.'],['nut','🥜','The squirrel has a nut.']],
    [['bunny','🐰','The bunny hops.'],['dinner','🍽️','Dinner is ready.'],['snowman','⛄','We built a snowman in the garden.'],['penny','🪙','I found a penny.']],
    [['spoon','🥄','Stir the soup with a spoon.'],['phone','📱','Answer the phone.'],['rain','🌧️','The rain falls.'],['queen','👑','The queen waves.']],
  ],
  k: [
    [['cow','🐄','The cow says moo.'],['cake','🎂','I eat cake.'],['key','🔑','Turn the key.'],['cap','🧢','I wear a cap.']],
    [['cookie','🍪','I bake a cookie.'],['chicken','🐔','The chicken clucks.'],['pumpkin','🎃','The pumpkin is orange.'],['ticket','🎫','I have a ticket.']],
    [['book','📖','Read the book.'],['sock','🧦','Put on a sock.'],['bike','🚲','I ride my bike.'],['clock','🕐','Look at the clock.']],
  ],
  g: [
    [['goat','🐐','The goat jumps.'],['girl','👧','The girl smiles.'],['gift','🎁','I open a gift.'],['grapes','🍇','The grapes are purple.']],
    [['yogurt','🥣','I eat yogurt for breakfast.'],['finger','👆','Point your finger.'],['eagle','🦅','The eagle soars.'],['magnet','🧲','The magnet sticks.']],
    [['bug','🐛','The bug crawls.'],['egg','🥚','I crack an egg.'],['flag','🚩','Wave the flag.'],['frog','🐸','The frog hops.']],
  ],
  f: [
    [['fish','🐟','The fish swims.'],['fork','🍴','Use your fork.'],['feet','🦶','Wiggle your feet.'],['farm','🚜','We visit the farm.']],
    [['coffee','☕','Mum drinks coffee.'],['elephant','🐘','The elephant is huge.'],['giraffe','🦒','The giraffe is tall.'],['muffin','🧁','I eat a muffin.']],
    [['leaf','🍃','The leaf is green.'],['cliff','🏔️','We stood at the top of the cliff.'],['scarf','🧣','Wrap the scarf.'],['roof','🏠','The roof is red.']],
  ],
  v: [
    [['van','🚐','The van is white.'],['vase','🏺','The vase has flowers.'],['violin','🎻','Play the violin.'],['vest','🦺','I wear a vest.']],
    [['seven','7️⃣','I am seven.'],['river','🏞️','The river flows.'],['clover','🍀','Find a clover.'],['oven','🔥','The oven is hot.']],
    [['glove','🧤','Put on a glove.'],['cave','🕳️','The bear is in the cave.'],['five','5️⃣','I have five fingers.'],['wave','🌊','The wave is big.']],
  ],
  s: [
    [['sun','☀️','The sun shines.'],['snake','🐍','The snake hisses.'],['star','⭐','The star twinkles.'],['sand','🏖️','Dig in the sand.']],
    [['castle','🏰','The castle is tall.'],['pencil','✏️','I draw with a pencil.'],['basket','🧺','Fill the basket.'],['monster','👹','The monster is silly.']],
    [['horse','🐴','The horse can run.'],['house','🏠','I live in a house.'],['grass','🌱','The grass is green.'],['ice','🧊','The ice is cold.']],
  ],
  z: [
    [['zebra','🦓','The zebra has stripes.'],['zoo','🐧','We go to the zoo.'],['zip','🤐','Zip up your coat.'],['zero','0️⃣','Zero is nothing.']],
    [['lizard','🦎','The lizard is green.'],['scissors','✂️','Cut with scissors.'],['music','🎵','I love music.'],['daisy','🌼','Pick a daisy.']],
    [['cheese','🧀','I like cheese.'],['eyes','👀','Open your eyes.'],['bees','🐝','The bees buzz.'],['toys','🧸','Put away the toys.']],
  ],
  r: [
    [['rabbit','🐰','The rabbit hops.'],['rainbow','🌈','The rainbow is bright.'],['rocket','🚀','The rocket zooms.'],['ring','💍','The ring is shiny.']],
    [['carrot','🥕','I crunch a carrot.'],['mirror','🪞','Look in the mirror.'],['parrot','🦜','The parrot talks.'],['strawberry','🍓','The strawberry is red.']],
    [['car','🚗','The car goes fast.'],['chair','🪑','Sit on the chair.'],['flower','🌸','Smell the flower.'],['deer','🦌','The deer runs.']],
  ],
  l: [
    [['lion','🦁','The lion roars.'],['lemon','🍋','The lemon is yellow.'],['lamp','💡','Switch on the lamp.'],['leg','🦵','Kick your leg.']],
    [['balloon','🎈','The balloon floats.'],['yellow','💛','The sun is yellow.'],['salad','🥗','I eat salad.'],['melon','🍈','The melon is sweet.']],
    [['bell','🔔','Ring the bell.'],['owl','🦉','The owl hoots.'],['snail','🐌','The snail is slow.'],['whale','🐋','The whale is huge.']],
  ],
  sh: [
    [['ship','🚢','The ship sails.'],['sheep','🐑','The sheep is white.'],['shoe','👟','Tie your shoe.'],['shirt','👕','I wear a shirt.']],
    [['fishing','🎣','We go fishing.'],['ocean','🌊','The ocean is deep.'],['dishes','🍽️','Wash the dishes.'],['brushing','🪥','I am brushing my teeth.']],
    [['fish','🐟','The fish is gold.'],['brush','🪥','Use a brush.'],['dish','🍽️','Put food on the dish.'],['splash','💦','Make a big splash.']],
  ],
  ch: [
    [['chick','🐥','The chick is yellow.'],['cherry','🍒','The cherry is red.'],['chocolate','🍫','I love chocolate.'],['chain','⛓️','The chain is long.']],
    [['teacher','🧑‍🏫','My teacher is kind.'],['kitchen','🍳','Cook in the kitchen.'],['peaches','🍑','The peaches are soft.'],['ketchup','🍅','Add some ketchup.']],
    [['beach','🏖️','We play at the beach.'],['watch','⌚','Look at my watch.'],['couch','🛋️','Sit on the couch.'],['lunch','🥪','It is time for lunch.']],
  ],
  th: [
    [['thumb','👍','Thumbs up!'],['three','3️⃣','I see three birds.'],['think','🤔','I think hard.'],['thunder','⛈️','The thunder is loud.']],
    [['birthday','🎂','Happy birthday!'],['healthy','🍎','Fruit keeps me healthy.'],['bathtub','🛁','The bathtub is full of bubbles.'],['panther','🐈‍⬛','The panther is black.']],
    [['tooth','🦷','I lost a tooth.'],['bath','🛁','Bath time!'],['mouth','👄','Open your mouth.'],['earth','🌍','The earth is round.']],
  ],
  h: [
    [['hat','🎩','The hat is on my head.'],['horse','🐴','The horse can run.'],['house','🏠','I live in a house.'],['hand','✋','Wave your hand.']],
    [['behind','🔙','The cat is behind the door.'],['ahead','➡️','Look straight ahead.'],['unhappy','😞','The boy is unhappy.'],['beehive','🐝','Bees live in a beehive.']],
    [],
  ],
  w: [
    [['wolf','🐺','The wolf howls at the moon.'],['worm','🪱','The worm wiggles.'],['window','🪟','Look out of the window.'],['whale','🐋','The whale swims in the sea.']],
    [['away','🏃','The bird flew away.'],['cowboy','🤠','The cowboy rides a horse.'],['highway','🛣️','The car drives on the highway.'],['rewind','⏪','Rewind the video.']],
    [],
  ],
  y: [
    [['yawn','🥱','I yawn when I am tired.'],['yarn','🧶','The yarn is soft and red.'],['yo-yo','🪀','The yo-yo goes up and down.'],['yogurt','🥣','I eat yogurt for breakfast.']],
    [['kayak','🛶','We paddle the kayak.'],['canyon','🏞️','The canyon is deep.'],['beyond','🌌','The stars are beyond the sky.'],['onion','🧅','The onion makes me cry.']],
    [],
  ],
  ng: [
    [],
    [['singer','🎤','The singer has a lovely voice.'],['hanger','🧥','Hang your coat on the hanger.'],['ringing','🔔','The bell is ringing.'],['angry','😠','The lion looks angry.']],
    [['ring','💍','The ring is shiny.'],['king','🤴','The king wears a crown.'],['song','🎵','I sing a song.'],['wing','🕊️','The bird has a wing.']],
  ],
  j: [
    [['jam','🍓','I spread jam on toast.'],['jet','✈️','The jet flies fast.'],['juice','🧃','I drink orange juice.'],['jelly','🍮','The jelly wobbles.']],
    [['magic','🪄','The magic wand sparkles.'],['angel','👼','The angel has a halo.'],['pyjamas','👚','I wear pyjamas at night.'],['enjoy','😊','I enjoy the story.']],
    [['page','📄','Turn the page.'],['bridge','🌉','We cross the bridge.'],['fridge','🧊','The milk is in the fridge.'],['badge','🏅','I wear a shiny badge.']],
  ],
  zh: [
    [],
    [['television','📺','We watch television together.'],['treasure','💎','The pirate hid the treasure.'],['measure','📏','Measure the table with a ruler.'],['vision','👓','Glasses help my vision.']],
    [['beige','🟫','The wall is painted beige.'],['garage','🚗','The car is in the garage.'],['mirage','🏜️','A mirage shimmers in the desert.'],['massage','💆','A massage feels relaxing.']],
  ],
  dh: [
    [['this','👇','This is my bag.'],['that','👉','That is my coat.'],['they','👥','They are my friends.'],['then','⏭️','Then we go home.']],
    [['feather','🪶','The feather is light.'],['mother','👩','I hug my mother.'],['father','👨','I wave to my father.'],['brother','👦','My brother plays football.']],
    [],
  ],
  st: [
    [['star','⭐','The star twinkles.'],['stop','🛑','Stop at the red light.'],['stone','🪨','The stone is smooth.'],['stamp','📮','Put a stamp on the letter.']],
    [['pasta','🍝','We eat pasta for dinner.'],['rooster','🐓','The rooster crows at dawn.'],['dustbin','🗑️','Put it in the dustbin.'],['toaster','🍞','The toaster is hot.']],
    [['nest','🪺','The bird sits in the nest.'],['toast','🍞','I like toast and jam.'],['post','📮','Post the letter today.'],['fist','✊','Make a fist.']],
  ],
};


// Stretch words: longer or less common words with richer sentences, for ages 5-8. [initial x2, medial x2, final x2]
const RAW2: Record<string, [string, string, string][][]> = {
  p: [[['pirate','🏴‍☠️','The pirate hid his treasure on a small island.'],['parachute','🪂','The parachute floated gently down to the park.']],
      [['spider','🕷️','A spider spun a silky web in the corner.'],['aeroplane','✈️','The aeroplane flew high above the clouds.']],
      [['jump','🤸','I can jump over the little puddle.'],['rope','🪢','We skip with a long rope at playtime.']]],
  b: [[['butterfly','🦋','A butterfly landed on the big blue balloon.'],['basketball','🏀','My brother bounces the basketball in the back garden.']],
      [['cabbage','🥬','The rabbit nibbled a green cabbage.'],['umbrella','🌂','Take an umbrella because it might rain.']],
      [['globe','🌐','We spun the globe and found our country.'],['bulb','💡','Please change the bulb in the lamp.']]],
  m: [[['mermaid','🧜','The mermaid combed her long hair.'],['mountain','⛰️','We climbed the mountain on Monday.']],
      [['camel','🐫','The camel carries a heavy load.'],['tomato','🍅','The tomato is ripe and red.']],
      [['storm','🌩️','A storm rumbled over the hills.'],['swim','🏊','I learned to swim at the pool.']]],
  t: [[['telephone','☎️','The telephone rang twice.'],['tractor','🚜','The tractor pulled a heavy trailer.']],
      [['spaghetti','🍝','We twirled spaghetti on our forks.'],['letter','✉️','I posted a letter to my gran.']],
      [['jacket','🧥','Put on your jacket because it is cold.'],['planet','🪐','Saturn is a planet with rings.']]],
  d: [[['dolphin','🐬','The dolphin dived and did a flip.'],['donkey','🫏','The donkey ate dry hay.']],
      [['pudding','🍮','We had pudding for dessert.'],['reindeer','🦌','The reindeer pulled the sleigh.']],
      [['road','🛣️','The road winds up the hill.'],['bread','🍞','Dad sliced the fresh bread.']]],
  n: [[['necklace','📿','She wore a pretty necklace.'],['newspaper','📰','Grandad reads the newspaper each morning.']],
      [['penguin','🐧','The penguin waddled across the snow.'],['rhino','🦏','The rhino ran across the river.']],
      [['pigeon','🕊️','The pigeon sat on the roof.'],['crown','👑','The king wore a golden crown.']]],
  k: [[['kangaroo','🦘','The kangaroo keeps her baby in a pouch.'],['kettle','🫖','The kettle boiled quickly.']],
      [['monkey','🐒','The monkey swung across the branch.'],['turkey','🦃','The turkey gobbled loudly.']],
      [['duck','🦆','The duck quacked by the lake.'],['shark','🦈','The shark swam deep below the boat.']]],
  g: [[['gorilla','🦍','The gorilla beat its chest.'],['guitar','🎸','He played the guitar on the stage.']],
      [['dragon','🐉','The dragon guarded a golden cave.'],['burger','🍔','I ate a burger with my family.']],
      [['bag','👜','Pack your bag for school.'],['log','🪵','A beetle crawled under the log.']]],
  f: [[['fairy','🧚','The fairy flew over the forest.'],['firefighter','🧑‍🚒','The firefighter climbed the tall ladder.']],
      [['sofa','🛋️','We sat on the soft sofa.'],['butterfly','🦋','A butterfly fluttered past the flowers.']],
      [['loaf','🍞','The baker made a fresh loaf.'],['beef','🥩','We had beef for dinner.']]],
  v: [[['volcano','🌋','The volcano erupted with hot lava.'],['vegetable','🥦','Every vegetable on my plate is green.']],
      [['eleven','🔢','There are eleven players in a football team.'],['diving','🤿','She went diving to see the fish.']],
      [['hive','🐝','Bees live in a busy hive.'],['stove','🍳','Mum cooks soup on the stove.']]],
  s: [[['sandwich','🥪','I packed a sandwich for lunch.'],['sailboat','⛵','The sailboat sped across the sea.']],
      [['octopus','🐙','The octopus has eight arms.'],['toaster','🍞','The toaster popped up the toast.']],
      [['dress','👗','She wore a red dress.'],['glass','🥛','Please fill my glass with juice.']]],
  z: [[['zigzag','〰️','We ran in a zigzag across the field.'],['zoom','🔍','Zoom in to see the tiny ant.']],
      [['dizzy','😵','I felt dizzy after the spinning ride.'],['buzzing','🐝','The bees were buzzing around the flowers.']],
      [['rose','🌹','A red rose grows by the gate.'],['prize','🏆','She won first prize at the show.']]],
  r: [[['rhino','🦏','The rhino ran across the river.'],['rice','🍚','We ate rice with red peppers.']],
      [['orange','🍊','The orange is round and juicy.'],['fireworks','🎆','The fireworks lit up the night sky.']],
      [['sister','👧','My sister reads a story every night.'],['tractor','🚜','The tractor rolled across the field.']]],
  l: [[['ladybird','🐞','A ladybird landed on my left hand.'],['lorry','🚚','The lorry carried logs along the lane.']],
      [['dolphin','🐬','The dolphin leapt out of the waves.'],['pillow','🛌','I rest my head on a soft pillow.']],
      [['hill','⛰️','We rolled down the grassy hill.'],['wheel','🛞','The wheel on my bike is flat.']]],
  sh: [[['shell','🐚','I found a shell on the shore.'],['shower','🚿','I sing in the shower.']],
      [['washing','🧺','Mum is washing the muddy boots.'],['cushion','🛋️','A cushion sits on the chair.']],
      [['crash','💥','The tower fell with a crash.'],['wash','🫧','Wash your hands with warm water.']]],
  ch: [[['cheetah','🐆','The cheetah is the fastest animal.'],['chimney','🏠','Smoke rises from the chimney.']],
      [['picture','🖼️','I painted a picture of a chicken.'],['matches','🔥','Never play with matches.']],
      [['bench','🪑','We sat on the bench in the park.'],['sandwich','🥪','She ate a cheese sandwich.']]],
  th: [[['thread','🧵','I sew with a needle and thread.'],['thirsty','🥤','I am thirsty after the long run.']],
      [['toothpaste','🪥','Squeeze toothpaste onto the brush.'],['bathroom','🚿','Wash your hands in the bathroom.']],
      [['teeth','🦷','Brush your teeth twice a day.'],['month','📅','May is the fifth month of the year.']]],
  h: [[['hippo','🦛','The hippo wallows in the water.'],['helicopter','🚁','The helicopter hovered over the hill.']],
      [['rehearse','🎭','We rehearse the play after lunch.'],['overhead','☁️','A cloud floated overhead.']], []],
  w: [[['wizard','🧙','The wizard waved his wand.'],['watermelon','🍉','The watermelon is wet and sweet.']],
      [['twenty','🔢','There are twenty children in class.'],['homework','📚','I finish my homework after school.']], []],
  y: [[['yellow','💛','The yellow duck is in the yard.'],['yacht','⛵','The yacht sailed past the harbour.']],
      [['lawyer','⚖️','The lawyer wore a black gown.'],['vineyard','🍇','We picked grapes in the vineyard.']], []],
  ng: [[], [['swinging','🛝','The children are swinging high.'],['hungry','🍽️','I am hungry for dinner.']],
      [['swing','🛝','I push my friend on the swing.'],['strong','💪','The strong man lifted the box.']]],
  j: [[['jellyfish','🪼','The jellyfish floats in the sea.'],['jigsaw','🧩','We finished the jigsaw together.']],
      [['pigeon','🕊️','The pigeon sat on the roof.'],['dangerous','⚠️','The sign says it is dangerous.']],
      [['village','🏘️','We live in a small village.'],['sausage','🌭','I ate a sausage for lunch.']]],
  zh: [[], [['decision','🤔','It was a hard decision.'],['usually','📆','We usually eat at six.']],
      [['camouflage','🦎','The lizard uses camouflage.'],['collage','🖼️','We made a collage with paper.']]],
  dh: [[['these','👇','These shoes are new.'],['those','👉','Those birds are flying.']],
      [['weather','⛅','The weather is lovely today.'],['together','🤝','We play together.']], []],
  st: [[['stadium','🏟️','The stadium was full of fans.'],['stethoscope','🩺','The doctor listens with a stethoscope.']],
      [['monster','👹','The monster is silly.'],['mistake','❌','Everyone makes a mistake.']],
      [['forest','🌲','We walked through the forest.'],['ghost','👻','The ghost said boo.']]],
};

const mk = (raw: Record<string, [string, string, string][][]>, level: 1 | 2): Word[] => SOUNDS.flatMap((s) =>
  POSITIONS.flatMap((pos, pi) =>
    raw[s.id][pi].map(([word, emoji, sentence]) => ({ id: `${s.id}-${pos}-${word}`, soundId: s.id, position: pos, word, emoji, sentence, level })),
  ),
);

export const WORDS: Word[] = [...mk(RAW, 1), ...mk(RAW2, 2)];
export type Band = '3-4' | '5-6' | '7-8';

/** Core words first for ages 3-4; core then stretch for 5-6; stretch first for 7-8. Custom words always last. */
export function wordsFor(soundId: string, position: Position, custom: Word[] = [], band: Band = '5-6'): Word[] {
  const all = WORDS.filter((w) => w.soundId === soundId && w.position === position);
  const core = all.filter((w) => w.level !== 2);
  const stretch = all.filter((w) => w.level === 2);
  const main = band === '3-4' ? core : band === '5-6' ? [...core, ...stretch] : [...stretch, ...core];
  const exactCustom = custom.filter((w) => w.soundId === soundId && w.position === position);
  const soundCustom = custom.filter((w) => w.soundId === soundId);
  const addedCustom = exactCustom.length > 0 ? exactCustom : (main.length === 0 ? soundCustom : []);
  return [...main, ...addedCustom];
}
