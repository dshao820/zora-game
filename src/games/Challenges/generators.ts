import { SPECIES_NAMES, type AnimalInfo, type Species } from '../../data/animals';
import type { GameColor } from '../../data/colors';
import { quantityWord } from '../../data/numbers';
import { pick, sample, shuffle } from '../../lib/random';

/** 一個選項 = 一群（或一隻）動物 */
export interface ChallengeOption {
  key: string;
  species: Species;
  count: number;
  color?: GameColor;
  /** 答錯時念出這個選項是什麼，幫助理解 */
  describe: string;
}

export interface Challenge {
  kind: 'colorCount' | 'animalCount' | 'colorAnimal';
  prompt: string;
  options: ChallengeOption[];
  answer: string;
}

interface Pools {
  numbers: number[];
  colors: GameColor[];
  animals: AnimalInfo[];
}

const MAX_GROUP = 5;

const opt = (species: Species, count: number, color?: GameColor): ChallengeOption => ({
  key: `${species}-${count}-${color?.id ?? ''}`,
  species,
  count,
  color,
  describe: `${quantityWord(count)}隻${color ? `${color.name}的` : ''}${SPECIES_NAMES[species]}`,
});

/** 挑戰 A：「請找到兩隻紅色的小鳥！」—— 同時要看數量和顏色 */
function colorCount({ numbers, colors }: Pools): Challenge {
  const counts = numbers.filter((n) => n <= MAX_GROUP);
  const [n1, n2] = sample(counts, 2);
  const [c1, c2] = sample(colors, 2);
  const target = opt('bird', n1, c1);
  return {
    kind: 'colorCount',
    prompt: `請找到${quantityWord(n1)}隻${c1.name}的小鳥！`,
    options: shuffle([target, opt('bird', n2, c1), opt('bird', n1, c2)]),
    answer: target.key,
  };
}

/** 挑戰 B：「請找出三隻小兔子！」—— 同時要看數量和動物 */
function animalCount({ numbers, animals }: Pools): Challenge {
  const counts = numbers.filter((n) => n <= MAX_GROUP);
  const [n1, n2] = sample(counts, 2);
  const [a1, a2] = sample(animals, 2);
  const target = opt(a1.id, n1);
  return {
    kind: 'animalCount',
    prompt: `請找出${quantityWord(n1)}隻${a1.name}！`,
    options: shuffle([target, opt(a1.id, n2), opt(a2.id, n1)]),
    answer: target.key,
  };
}

/** 挑戰 C：「請點一下黃色的小鴨！」—— 同時要看顏色和動物 */
function colorAnimal({ colors, animals }: Pools): Challenge {
  const species: Species[] = [...animals.filter((a) => a.tintable).map((a) => a.id), 'bird'];
  const [s1, s2] = sample(species, 2);
  const [c1, c2] = sample(colors, 2);
  const target = opt(s1, 1, c1);
  return {
    kind: 'colorAnimal',
    prompt: `請點一下${c1.name}的${SPECIES_NAMES[s1]}！`,
    options: shuffle([target, opt(s1, 1, c2), opt(s2, 1, c1)]),
    answer: target.key,
  };
}

const GENERATORS: Record<Challenge['kind'], (p: Pools) => Challenge> = { colorCount, animalCount, colorAnimal };

/** 隨機出題，避免連續兩題同一種 */
export function makeChallenge(pools: Pools, previous?: Challenge['kind']): Challenge {
  const kinds = (Object.keys(GENERATORS) as Challenge['kind'][]).filter((k) => k !== previous);
  return GENERATORS[pick(kinds)](pools);
}
