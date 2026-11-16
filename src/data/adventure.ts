export interface World {
  id: string;
  name: string;
  scene: string[]; // emoji scenery
  tint: string; // soft background
  story: string;
  need: number; // mastered words needed to open
  badge: string;
}

export const ADVENTURE: World[] = [
  { id: 'w1', name: 'Sunny Meadow', scene: ['🌻', '🦋', '🐝', '🌼'], tint: '#D2F7EB', need: 0, badge: '🌻', story: 'The flowers are asleep! Say each word clearly to wake them up.' },
  { id: 'w2', name: 'Rainbow River', scene: ['🌈', '🐟', '🦆', '🐸'], tint: '#DCEBFF', need: 5, badge: '🌈', story: 'The rainbow lost its colours. Every good word brings one back.' },
  { id: 'w3', name: 'Star Mountain', scene: ['⛰️', '⭐', '🦅', '🌙'], tint: '#EDEAFF', need: 10, badge: '⭐', story: 'Climb the mountain! Each clear word is one step closer to the stars.' },
  { id: 'w4', name: 'Ocean Adventure', scene: ['🐙', '🐋', '🐠', '🦀'], tint: '#D9F6F2', need: 15, badge: '🐙', story: 'The sea friends need help. Say the words to find the hidden pearls.' },
  { id: 'w5', name: 'Space Station', scene: ['🚀', '🛰️', '🪐', '👩‍🚀'], tint: '#FFE3EC', need: 20, badge: '🚀', story: 'Blast off! Speak clearly so mission control can hear you.' },
];
