import { NUMBER_TINTS } from '../data/numbers';
import { INK } from './AnimalArt';

/** 數字＋點點（不識字也能用點點對應數量） */
export function NumberTile({ n, size, dots = true }: { n: number; size: string; dots?: boolean }) {
  return (
    <div
      className="flex flex-col items-center justify-center rounded-[28%] border-[5px] border-white shadow-[0_8px_0_rgba(74,59,63,0.15)]"
      style={{ width: size, height: size, background: NUMBER_TINTS[n] ?? '#fff' }}
    >
      <span className="font-black leading-none" style={{ fontSize: `calc(${size} * 0.55)`, color: INK }}>
        {n}
      </span>
      {dots && (
        <span className="flex max-w-[85%] flex-wrap justify-center" style={{ gap: `calc(${size} * 0.025)`, marginTop: `calc(${size} * 0.03)` }}>
          {Array.from({ length: n }, (_, i) => (
            <span
              key={i}
              className="block rounded-full bg-white"
              style={{ width: `calc(${size} * 0.075)`, height: `calc(${size} * 0.075)`, border: `2px solid ${INK}` }}
            />
          ))}
        </span>
      )}
    </div>
  );
}
