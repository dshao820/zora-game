export type ColorId = 'red' | 'yellow' | 'blue' | 'green' | 'orange' | 'purple' | 'pink' | 'black' | 'white';

export interface GameColor {
  id: ColorId;
  name: string;
  hex: string;
}

/** 依難度解鎖的順序排列：前 4 色 = 初級、前 6 色 = 中級、全部 = 進階 */
export const COLORS: GameColor[] = [
  { id: 'red', name: '紅色', hex: '#ef5350' },
  { id: 'yellow', name: '黃色', hex: '#ffd93d' },
  { id: 'blue', name: '藍色', hex: '#4d96ff' },
  { id: 'green', name: '綠色', hex: '#5cc46b' },
  { id: 'orange', name: '橘色', hex: '#ff9f43' },
  { id: 'purple', name: '紫色', hex: '#a374f5' },
  { id: 'pink', name: '粉紅色', hex: '#ff8fc7' },
  { id: 'black', name: '黑色', hex: '#3a3540' },
  { id: 'white', name: '白色', hex: '#ffffff' },
];

export const getColor = (id: ColorId): GameColor => COLORS.find((c) => c.id === id)!;

/** 深色底上需要白色眼睛等細節 */
export function isDark(hex: string): boolean {
  const v = parseInt(hex.slice(1), 16);
  const r = (v >> 16) & 255, g = (v >> 8) & 255, b = v & 255;
  return 0.299 * r + 0.587 * g + 0.114 * b < 90;
}
