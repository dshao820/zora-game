/**
 * 尺寸單位：--u 以 1280×800 為設計基準（1u ≈ 12.8px），隨螢幕等比縮放。
 * tap() 保證觸控目標至少 80px。
 */
export const u = (n: number) => `calc(var(--u) * ${n})`;
export const tap = (n: number) => `max(80px, calc(var(--u) * ${n}))`;

/** 依數量決定每隻動物的大小，讓 1～10 隻都排得下 */
export function crowdSize(count: number, big = 15) {
  if (count <= 2) return u(big);
  if (count <= 3) return u(big * 0.85);
  if (count <= 5) return u(big * 0.7);
  if (count <= 8) return u(big * 0.55);
  return u(big * 0.48);
}
