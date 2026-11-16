/**
 * A "parental gate" for links that leave the app (stores ask for one in children's apps).
 * The adult must READ a number written in words and type it as digits. A young child cannot.
 */
const ONES = ['', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'];
const TEENS = ['ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'];
const TENS = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];

export function numberToWords(n: number): string {
  if (n < 0 || n > 99 || !Number.isInteger(n)) throw new Error('0 to 99 only');
  if (n === 0) return 'zero';
  if (n < 10) return ONES[n];
  if (n < 20) return TEENS[n - 10];
  return TENS[Math.floor(n / 10)] + (n % 10 ? `-${ONES[n % 10]}` : '');
}

/** A challenge between 21 and 98 that is not a round number, so it must be read, not guessed. */
export function newChallenge(rand: () => number = Math.random): { n: number; words: string } {
  let n = 21 + Math.floor(rand() * 78);
  if (n % 10 === 0) n += 1;
  return { n, words: numberToWords(n) };
}

export const checkAnswer = (n: number, typed: string) => typed.trim() === String(n);
