import type { ReactNode } from 'react';
import type { HabitatId } from '../data/animals';
import { INK } from './AnimalArt';

const S = { stroke: INK, strokeWidth: 3.5, strokeLinejoin: 'round' as const, strokeLinecap: 'round' as const };

const Grass = () => <path d="M0 100 Q40 92 80 98 T160 96 V120 H0 Z" fill="#8fd47e" {...S} />;

const ART: Record<HabitatId, ReactNode> = {
  pond: (
    <>
      <Grass />
      <ellipse cx="80" cy="88" rx="66" ry="24" fill="#7cc8f2" {...S} />
      <path d="M50 86 Q60 82 70 86 M88 94 Q98 90 108 94" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" />
      <path d="M112 82 a12 7 0 1 1 1 0 Z" fill="#6bcb77" {...S} />
      <path d="M20 90 V52 M28 90 V58" fill="none" {...S} />
      <ellipse cx="20" cy="50" rx="4" ry="9" fill="#b07a4f" {...S} />
      <ellipse cx="28" cy="56" rx="4" ry="9" fill="#b07a4f" {...S} />
    </>
  ),
  tree: (
    <>
      <Grass />
      <path d="M72 100 L76 56 L86 56 L90 100 Z" fill="#b07a4f" {...S} />
      <path d="M82 70 L104 56" fill="none" {...S} strokeWidth={6} />
      <circle cx="80" cy="40" r="30" fill="#6cc46a" {...S} />
      <circle cx="54" cy="52" r="20" fill="#5fb85e" {...S} />
      <circle cx="108" cy="50" r="22" fill="#5fb85e" {...S} />
      <circle cx="70" cy="34" r="4" fill="#ef5350" />
      <circle cx="96" cy="44" r="4" fill="#ef5350" />
      <circle cx="60" cy="54" r="4" fill="#ef5350" />
    </>
  ),
  doghouse: (
    <>
      <Grass />
      <rect x="38" y="52" width="84" height="50" fill="#f5c26b" {...S} />
      <path d="M28 58 L80 20 L132 58 Z" fill="#e65f5c" {...S} />
      <path d="M66 102 V82 a14 14 0 0 1 28 0 V102 Z" fill={INK} />
      <rect x="64" y="38" width="32" height="12" rx="6" fill="#fff" {...S} strokeWidth={2.5} />
      <circle cx="68" cy="44" r="3" fill="#fff" />
    </>
  ),
  barn: (
    <>
      <Grass />
      <path d="M24 102 V56 L80 22 L136 56 V102 Z" fill="#e65f5c" {...S} />
      <rect x="62" y="64" width="36" height="38" fill="#fff4e6" {...S} />
      <path d="M62 64 L98 102 M98 64 L62 102" fill="none" {...S} />
      <rect x="72" y="38" width="16" height="14" fill="#fff4e6" {...S} />
      <path d="M128 102 Q136 84 150 102 Z" fill="#ffd93d" {...S} />
    </>
  ),
  savanna: (
    <>
      <path d="M0 98 Q40 90 80 96 T160 94 V120 H0 Z" fill="#f4d27a" {...S} />
      <circle cx="132" cy="28" r="14" fill="#ffd93d" {...S} />
      <path d="M58 98 L62 56 M62 64 L44 50 M62 60 L80 48" fill="none" {...S} strokeWidth={5} stroke="#9a6a43" />
      <ellipse cx="62" cy="46" rx="40" ry="12" fill="#7cc16a" {...S} />
      <path d="M100 98 l4 -12 l4 12 M116 98 l4 -10 l4 10 M20 98 l4 -12 l4 12" fill="none" stroke="#c99a3c" strokeWidth={3} strokeLinecap="round" />
    </>
  ),
  bamboo: (
    <>
      <Grass />
      {[40, 72, 104].map((x, i) => (
        <g key={x}>
          <rect x={x} y={20 + i * 6} width="14" height={80 - i * 6} rx="5" fill="#7cc16a" {...S} />
          <path d={`M${x} ${48 + i * 4} H${x + 14} M${x} ${72 + i * 2} H${x + 14}`} {...S} />
          <path d={`M${x + 14} ${40 + i * 6} q16 -10 26 -4 q-14 8 -26 4 Z`} fill="#5fb85e" {...S} strokeWidth={2.5} />
        </g>
      ))}
    </>
  ),
  carrots: (
    <>
      <path d="M0 96 Q80 80 160 96 V120 H0 Z" fill="#b07a4f" {...S} />
      {[36, 80, 124].map((x) => (
        <g key={x}>
          <path d={`M${x - 8} 90 L${x + 8} 90 L${x} 112 Z`} fill="#ff9f43" {...S} />
          <path d={`M${x} 90 q-10 -20 -6 -28 M${x} 90 q0 -22 4 -30 M${x} 90 q10 -16 12 -24`} fill="none" stroke="#5cc46b" strokeWidth="5" strokeLinecap="round" />
        </g>
      ))}
    </>
  ),
  bed: (
    <>
      <rect x="0" y="100" width="160" height="20" fill="#f3e0c8" />
      <ellipse cx="80" cy="86" rx="64" ry="22" fill="#c4b5fd" {...S} />
      <ellipse cx="80" cy="80" rx="48" ry="14" fill="#ede9fe" {...S} />
      <ellipse cx="54" cy="72" rx="18" ry="9" fill="#fff" {...S} />
      <circle cx="112" cy="70" r="9" fill="#ff8fc7" {...S} />
      <path d="M112 61 q8 -10 14 -2" fill="none" stroke="#ff8fc7" strokeWidth="3" />
    </>
  ),
};

export function HabitatArt({ id, size = '100%' }: { id: HabitatId; size?: string | number }) {
  return (
    <svg viewBox="0 0 160 120" aria-hidden style={{ width: size, height: "auto", display: "block" }}>
      {ART[id]}
    </svg>
  );
}
