import type { Word } from '../data/sounds';

/** Five stops per world, picked from the child's own sounds in a fixed order. */
export function questWords(worldIndex: number, pool: Word[]): Word[] {
  if (!pool.length) return [];
  return Array.from({ length: 5 }, (_, k) => pool[(worldIndex * 5 + k) % pool.length]);
}

const GENTLE_START = ['p', 's', 'r'];

export function questPool(all: Word[], targetSounds: string[]): Word[] {
  const sounds = targetSounds.length ? targetSounds : GENTLE_START;
  const order = ['initial', 'medial', 'final'];
  return all
    .filter((w) => sounds.includes(w.soundId))
    .sort((a, b) => sounds.indexOf(a.soundId) - sounds.indexOf(b.soundId) || order.indexOf(a.position) - order.indexOf(b.position));
}
