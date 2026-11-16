export const STICKERS = [
  { id: 's1', name: 'Super Star', emoji: '🌟', xp: 10 },
  { id: 's2', name: 'Sound Hero', emoji: '🦸', xp: 25 },
  { id: 's3', name: 'Brave Talker', emoji: '🦁', xp: 50 },
  { id: 's4', name: 'Rainbow Voice', emoji: '🌈', xp: 75 },
  { id: 's5', name: 'Rocket Speaker', emoji: '🚀', xp: 100 },
  { id: 's6', name: 'Golden Mic', emoji: '🎤', xp: 150 },
  { id: 's7', name: 'Dragon Roar', emoji: '🐲', xp: 200 },
  { id: 's8', name: 'Word King', emoji: '👑', xp: 250 },
];

export const OUTFITS = [
  { id: 'o1', name: 'Cool Cap', emoji: '🧢', xp: 20 },
  { id: 'o2', name: 'Hero Cape', emoji: '🦸', xp: 50 },
  { id: 'o3', name: 'Party Hat', emoji: '🥳', xp: 90 },
  { id: 'o4', name: 'Sunglasses', emoji: '😎', xp: 130 },
  { id: 'o5', name: 'Wizard Hat', emoji: '🧙', xp: 180 },
  { id: 'o6', name: 'Space Suit', emoji: '👩‍🚀', xp: 240 },
];

export const WORLDS = [
  { id: 'w1', name: 'Sunny Meadow', emoji: '🌻', words: 0 },
  { id: 'w2', name: 'Rainbow River', emoji: '🌈', words: 5 },
  { id: 'w3', name: 'Star Mountain', emoji: '⛰️', words: 10 },
  { id: 'w4', name: 'Ocean Adventure', emoji: '🐙', words: 15 },
  { id: 'w5', name: 'Space Station', emoji: '🛰️', words: 20 },
];

export const AAC_GROUPS: { name: string; emoji: string; words: { word: string; emoji: string }[] }[] = [
  { name: 'I want', emoji: '🙋', words: [
    { word: 'I want', emoji: '🙋' }, { word: 'More', emoji: '➕' }, { word: 'Help', emoji: '🆘' }, { word: 'Stop', emoji: '✋' }] },
  { name: 'Feelings', emoji: '😊', words: [
    { word: 'Happy', emoji: '😊' }, { word: 'Sad', emoji: '😢' }, { word: 'Tired', emoji: '😴' }, { word: 'Hurt', emoji: '🤕' }] },
  { name: 'Food', emoji: '🍎', words: [
    { word: 'Water', emoji: '💧' }, { word: 'Milk', emoji: '🥛' }, { word: 'Apple', emoji: '🍎' }, { word: 'Cookie', emoji: '🍪' }] },
  { name: 'Play', emoji: '⚽', words: [
    { word: 'Ball', emoji: '⚽' }, { word: 'Music', emoji: '🎵' }, { word: 'Book', emoji: '📖' }, { word: 'Bubbles', emoji: '🫧' }] },
  { name: 'People', emoji: '🫂', words: [
    { word: 'Mama', emoji: '👩' }, { word: 'Dada', emoji: '👨' }, { word: 'Friend', emoji: '🧒' }, { word: 'Teacher', emoji: '🧑‍🏫' }] },
  { name: 'Places', emoji: '🏠', words: [
    { word: 'Bathroom', emoji: '🚽' }, { word: 'Home', emoji: '🏠' }, { word: 'Outside', emoji: '🌳' }, { word: 'Bed', emoji: '🛏️' }] },
];
