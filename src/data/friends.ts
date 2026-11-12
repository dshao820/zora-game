import { ANIMALS, getAnimal, type AnimalId, type AnimalInfo } from './animals';

/** 動物朋友加入的順序：熟悉的和特別的動物交錯出現，讓每顆星星都有驚喜 */
const ORDER: AnimalId[] = [
  'dog', 'panda', 'cat', 'elephant', 'rabbit', 'lion', 'duck', 'monkey', 'chick',
  'giraffe', 'pig', 'penguin', 'cow', 'frog', 'sheep', 'horse', 'squirrel', 'turtle',
];

/** 之後在 animals.ts 新增的動物會自動排在最後 */
export const FRIENDS: AnimalInfo[] = [...ORDER, ...ANIMALS.map((a) => a.id).filter((id) => !ORDER.includes(id))].map(getAnimal);

/** 一開始就有一位朋友，之後每得到一顆星星多一位 */
const STARTER_FRIENDS = 1;

export const friendCount = (stars: number) => Math.min(FRIENDS.length, stars + STARTER_FRIENDS);

/** 得到第 stars 顆星星時加入的新朋友；全部收集完之後回傳 null */
export const friendForStar = (stars: number): AnimalInfo | null => FRIENDS[stars + STARTER_FRIENDS - 1] ?? null;
