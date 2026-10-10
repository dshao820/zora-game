export const randInt = (min: number, max: number) => min + Math.floor(Math.random() * (max - min + 1));

export function shuffle<T>(arr: readonly T[]): T[] {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export const pick = <T,>(arr: readonly T[]): T => arr[Math.floor(Math.random() * arr.length)];

export const sample = <T,>(arr: readonly T[], n: number): T[] => shuffle(arr).slice(0, n);

export const range = (from: number, to: number) => Array.from({ length: to - from + 1 }, (_, i) => from + i);

export const wait = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

/**
 * 洗牌抽卡：每一輪把所有項目都抽過一次才重新洗牌，
 * 而且新一輪的第一張不會和上一張相同，避免同一題連續出現。
 */
export function createDeck<T>() {
  let deck: T[] = [];
  let last: T | undefined;
  return (items: readonly T[]): T => {
    deck = deck.filter((x) => items.includes(x));
    if (deck.length === 0) {
      deck = shuffle(items);
      if (deck.length > 1 && deck[deck.length - 1] === last) deck.unshift(deck.pop()!);
    }
    last = deck.pop()!;
    return last;
  };
}
