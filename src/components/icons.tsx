import { INK } from './AnimalArt';

/** UI 圖示：與動物同樣的粗描邊、圓角、糖果色 */

interface IconProps {
  size?: string | number;
  className?: string;
}

const svgProps = (size: string | number = '62%', className = '') => ({
  width: size,
  height: size,
  viewBox: '0 0 64 64',
  className,
  'aria-hidden': true,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
});

export function HomeIcon({ size, className }: IconProps) {
  return (
    <svg {...svgProps(size, className)}>
      <path d="M16 28 V52 H48 V28" fill="#ffd36e" stroke={INK} strokeWidth="5" />
      <rect x="27" y="36" width="10" height="16" rx="3" fill="#ff8fa3" stroke={INK} strokeWidth="4" />
      <path d="M8 31 L32 11 L56 31" fill="none" stroke={INK} strokeWidth="6" />
    </svg>
  );
}

export function BackIcon({ size, className }: IconProps) {
  return (
    <svg {...svgProps(size, className)}>
      <path d="M38 12 L18 32 L38 52" fill="none" stroke={INK} strokeWidth="9" />
      <path d="M38 12 L18 32 L38 52" fill="none" stroke="#7dd3fc" strokeWidth="3" />
    </svg>
  );
}

export function SpeakerIcon({ size, className }: IconProps) {
  return (
    <svg {...svgProps(size, className)}>
      <path d="M10 25 H20 L34 13 V51 L20 39 H10 Z" fill="#7dd3fc" stroke={INK} strokeWidth="4.5" />
      <path d="M42 24 Q48 32 42 40 M48 17 Q59 32 48 47" fill="none" stroke={INK} strokeWidth="4.5" />
    </svg>
  );
}

export function MusicIcon({ size, className, off = false }: IconProps & { off?: boolean }) {
  return (
    <svg {...svgProps(size, className)}>
      <path d="M24 46 V14 L50 9 V40" fill="none" stroke={INK} strokeWidth="5" />
      <ellipse cx="18" cy="47" rx="8" ry="6.5" fill={off ? '#cbd5e1' : '#c4b5fd'} stroke={INK} strokeWidth="4" />
      <ellipse cx="44" cy="42" rx="8" ry="6.5" fill={off ? '#cbd5e1' : '#c4b5fd'} stroke={INK} strokeWidth="4" />
      {off && <path d="M10 10 L54 54" stroke="#ef5350" strokeWidth="6" />}
    </svg>
  );
}

const STAR_POINTS = '32,5 40,23 60,25 45,38 50,58 32,47 14,58 19,38 4,25 24,23';

export function StarIcon({ size, className, fill = '#ffd93d' }: IconProps & { fill?: string }) {
  return (
    <svg {...svgProps(size, className)}>
      <polygon points={STAR_POINTS} fill={fill} stroke={INK} strokeWidth="4" />
      <ellipse cx="25" cy="27" rx="4" ry="2.5" fill="#fff" opacity="0.7" transform="rotate(-30 25 27)" />
    </svg>
  );
}

export function NextIcon({ size, className }: IconProps) {
  return (
    <svg {...svgProps(size, className)}>
      <path d="M10 26 H34 V14 L56 32 L34 50 V38 H10 Z" fill="#86efac" stroke={INK} strokeWidth="5" />
    </svg>
  );
}

export function PlayIcon({ size, className }: IconProps) {
  return (
    <svg {...svgProps(size, className)}>
      <path d="M20 12 L52 32 L20 52 Z" fill="#fff" stroke={INK} strokeWidth="5" />
    </svg>
  );
}

export function GearIcon({ size, className }: IconProps) {
  const teeth = Array.from({ length: 8 }, (_, i) => i * 45);
  return (
    <svg {...svgProps(size, className)}>
      {teeth.map((a) => (
        <rect key={a} x="27" y="6" width="10" height="14" rx="3" fill="#cbd5e1" stroke={INK} strokeWidth="3" transform={`rotate(${a} 32 32)`} />
      ))}
      <circle cx="32" cy="32" r="17" fill="#cbd5e1" stroke={INK} strokeWidth="3.5" />
      <circle cx="32" cy="32" r="7" fill="#fff" stroke={INK} strokeWidth="3.5" />
    </svg>
  );
}

export function EarIcon({ size, className }: IconProps) {
  return (
    <svg {...svgProps(size, className)}>
      <path d="M20 26 Q20 8 36 8 Q52 8 52 26 Q52 36 44 42 Q38 46 38 52 Q38 58 30 58 Q22 58 22 50" fill="#ffd6b3" stroke={INK} strokeWidth="5" />
      <path d="M30 26 Q30 18 36 18 Q42 18 42 26 Q42 32 36 34" fill="none" stroke={INK} strokeWidth="4" />
    </svg>
  );
}

export function NumberBlocksIcon({ size, className }: IconProps) {
  const blocks = [
    { x: 4, y: 34, c: '#ff8a80', n: '1' },
    { x: 34, y: 34, c: '#ffd54f', n: '2' },
    { x: 19, y: 6, c: '#64b5f6', n: '3' },
  ];
  return (
    <svg {...svgProps(size, className)}>
      {blocks.map((b) => (
        <g key={b.n}>
          <rect x={b.x} y={b.y} width="26" height="26" rx="6" fill={b.c} stroke={INK} strokeWidth="3.5" />
          <text x={b.x + 13} y={b.y + 20} textAnchor="middle" fontSize="18" fontWeight="900" fill={INK}>
            {b.n}
          </text>
        </g>
      ))}
    </svg>
  );
}

export function PaletteIcon({ size, className }: IconProps) {
  return (
    <svg {...svgProps(size, className)}>
      <path
        d="M32 6 C14 6 4 18 4 32 C4 48 16 58 30 58 C36 58 36 52 33 49 C30 45 32 40 38 40 H46 C54 40 60 34 60 26 C60 14 48 6 32 6 Z"
        fill="#fff3d6"
        stroke={INK}
        strokeWidth="4"
      />
      <circle cx="18" cy="30" r="5.5" fill="#ef5350" stroke={INK} strokeWidth="2.5" />
      <circle cx="24" cy="17" r="5.5" fill="#ffd93d" stroke={INK} strokeWidth="2.5" />
      <circle cx="38" cy="15" r="5.5" fill="#5cc46b" stroke={INK} strokeWidth="2.5" />
      <circle cx="49" cy="25" r="5.5" fill="#4d96ff" stroke={INK} strokeWidth="2.5" />
      <circle cx="18" cy="44" r="5.5" fill="#a374f5" stroke={INK} strokeWidth="2.5" />
    </svg>
  );
}

export function TrophyIcon({ size, className }: IconProps) {
  return (
    <svg {...svgProps(size, className)}>
      <path d="M16 12 H8 Q6 26 18 28 M48 12 H56 Q58 26 46 28" fill="none" stroke={INK} strokeWidth="4" />
      <path d="M16 8 H48 V22 Q48 38 32 40 Q16 38 16 22 Z" fill="#ffd93d" stroke={INK} strokeWidth="4" />
      <rect x="27" y="40" width="10" height="9" fill="#ffd93d" stroke={INK} strokeWidth="4" />
      <rect x="18" y="49" width="28" height="9" rx="3" fill="#ff9f43" stroke={INK} strokeWidth="4" />
      <polygon points="32,13 35,20 42,20 36.5,24.5 38.5,31 32,27 25.5,31 27.5,24.5 22,20 29,20" fill="#fff" />
    </svg>
  );
}

export function CheckIcon({ size, className }: IconProps) {
  return (
    <svg {...svgProps(size, className)}>
      <path d="M12 34 L26 48 L52 18" fill="none" stroke={INK} strokeWidth="10" />
      <path d="M12 34 L26 48 L52 18" fill="none" stroke="#86efac" strokeWidth="4" />
    </svg>
  );
}

export function QuestionIcon({ size, className }: IconProps) {
  return (
    <svg {...svgProps(size, className)}>
      <circle cx="32" cy="32" r="26" fill="#fde68a" stroke={INK} strokeWidth="4" />
      <path d="M24 25 Q24 15 32 15 Q41 15 41 24 Q41 30 34 33 Q32 34 32 39" fill="none" stroke={INK} strokeWidth="5" />
      <circle cx="32" cy="48" r="3.5" fill={INK} />
    </svg>
  );
}

export function ShirtIcon({ size, className, color = '#fff' }: IconProps & { color?: string }) {
  return (
    <svg {...svgProps(size, className)}>
      <path d="M22 8 Q32 14 42 8 L58 18 L52 30 L46 27 V56 H18 V27 L12 30 L6 18 Z" fill={color} stroke={INK} strokeWidth="4" />
    </svg>
  );
}
