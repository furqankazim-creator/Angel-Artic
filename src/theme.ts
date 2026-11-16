// Single locked palette. Every screen takes its colours from here.
export const colors = {
  violet: '#6C5CE7',
  teal: '#00B8A9',
  sunny: '#FFC93C',
  coral: '#FF6B6B',
  pink: '#FF8FAB',
  green: '#06D6A0',
  sky: '#4D96FF',
  bg: '#FFF9F0',
  card: '#FFF1D6',
  border: '#EFE6D8',
  white: '#FFFFFF',
  ink: '#2D2A4A',
  muted: '#7A7799',
} as const;

export const soft = {
  violet: '#EDEAFF',
  teal: '#D9F6F2',
  sunny: '#FFF3C4',
  coral: '#FFE3E3',
  pink: '#FFE3EC',
  green: '#D2F7EB',
  sky: '#DCEBFF',
} as const;

export type Accent = keyof typeof soft;
export const accentCycle: Accent[] = ['violet', 'teal', 'sunny', 'coral', 'pink', 'green', 'sky'];

export const type = {
  display: { fontSize: 34, fontWeight: '800' },
  title: { fontSize: 26, fontWeight: '800' },
  heading: { fontSize: 20, fontWeight: '700' },
  sub: { fontSize: 17, fontWeight: '700' },
  body: { fontSize: 16, fontWeight: '400' },
  bodyBold: { fontSize: 16, fontWeight: '700' },
  button: { fontSize: 17, fontWeight: '800' },
  caption: { fontSize: 13, fontWeight: '600' },
  bigSound: { fontSize: 42, fontWeight: '800' },
  bigWord: { fontSize: 36, fontWeight: '800' },
} as const;
export type TypeKey = keyof typeof type;

export const layout = { pad: 20, cardPad: 16, tap: 56, radius: 20, radiusBig: 28 };
