import type { GameColor } from '../../data/colors';

/** 顏色名稱小標籤：色塊＋文字，避免只靠顏色辨識 */
export function ColorLabel({ color, big = false }: { color: GameColor; big?: boolean }) {
  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full bg-white/90 font-black text-[#4a3b3f] shadow ${
        big ? 'px-5 py-2 text-3xl' : 'px-3 py-1 text-lg'
      }`}
    >
      <span className={`${big ? 'size-7' : 'size-4'} rounded-full border-[3px] border-[#4a3b3f]`} style={{ background: color.hex }} />
      {color.name}
    </span>
  );
}
