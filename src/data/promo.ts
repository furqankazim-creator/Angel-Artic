/** Angel Talk, the AAC app from the same makers. Change these in one place. */
export const ANGEL_TALK = {
  url: 'https://hopebirdgedigital.site/apps/angel-talk',
  email: 'hello@hopebridgedigital.com',
  tagline: 'A voice for every child.',
  /** Flip to true when the App Store and Google Play links are live. */
  inStores: false,
  features: [
    { icon: '🗣️', title: 'Taps become words', text: 'Picture tiles speak out loud, or build a full sentence first.' },
    { icon: '🌍', title: 'Natural voices', text: 'Boy, girl, woman and man voices in English and Arabic.' },
    { icon: '🖼️', title: 'About 14,800 symbols', text: 'Add your own photos and pictures for the people and things your child knows.' },
    { icon: '🎙️', title: 'Voice Add', text: 'Build a new board just by saying the words.' },
    { icon: '🧘', title: 'Calm tools', text: 'Social stories, a visual schedule, learning games and a breathing tool.' },
    { icon: '🔒', title: 'Private by design', text: 'No forced account. Works offline. Data stays on the device.' },
  ] as { icon: string; title: string; text: string }[],
  steps: [
    { icon: '👆', title: 'Tap a picture', text: 'Choose what you want to say.' },
    { icon: '🧩', title: 'Build a sentence', text: 'Add more tiles: I + want + apple.' },
    { icon: '🔊', title: 'Angel Talk speaks', text: 'A clear voice says it for the child.' },
  ] as { icon: string; title: string; text: string }[],
  audience: ['Autism', 'Apraxia', 'Speech delay', 'Down syndrome', 'Non-verbal children and teens', 'Parents, carers and teachers'],
};
