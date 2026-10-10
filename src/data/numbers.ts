const NUMBER_WORDS = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九', '十'];
const QUANTITY_WORDS = ['零', '一', '兩', '三', '四', '五', '六', '七', '八', '九', '十'];

/** 念數字：「一、二、三」 */
export const numberWord = (n: number) => NUMBER_WORDS[n] ?? String(n);

/** 念數量：「兩隻」用「兩」 */
export const quantityWord = (n: number) => QUANTITY_WORDS[n] ?? String(n);

/** 數字卡片的主題色，同一個數字永遠同色，方便記憶 */
export const NUMBER_TINTS = [
  '#ffffff', '#ff8a80', '#ffb74d', '#ffd54f', '#aed581', '#4dd0e1',
  '#64b5f6', '#9575cd', '#f48fb1', '#a1887f', '#81c784',
];
