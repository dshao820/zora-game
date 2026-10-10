import { INK } from './AnimalArt';

/** 可愛氣球（有表情），顏色樂園使用 */
export function Balloon({ color, size = 160, face = true }: { color: string; size?: string | number; face?: boolean }) {
  return (
    <svg viewBox="0 0 120 212" aria-hidden style={{ width: size, height: 'auto', overflow: 'visible', display: 'block' }}>
      <path d="M60 150 Q48 170 62 184 Q74 196 60 210" fill="none" stroke={INK} strokeWidth="2.5" strokeLinecap="round" />
      <path d="M52 141 L68 141 L60 151 Z" fill={color} stroke={INK} strokeWidth="3.5" strokeLinejoin="round" />
      <path
        d="M60 8 C96 8 112 38 112 70 C112 108 84 136 60 142 C36 136 8 108 8 70 C8 38 24 8 60 8 Z"
        fill={color}
        stroke={INK}
        strokeWidth="4"
      />
      <ellipse cx="36" cy="44" rx="10" ry="19" fill="#fff" opacity="0.55" transform="rotate(-22 36 44)" />
      {face && (
        <g>
          <circle cx="46" cy="72" r="5" fill={INK} />
          <circle cx="74" cy="72" r="5" fill={INK} />
          <circle cx="44.5" cy="70" r="1.8" fill="#fff" />
          <circle cx="72.5" cy="70" r="1.8" fill="#fff" />
          <path d="M52 84 Q60 92 68 84" fill="none" stroke={INK} strokeWidth="3" strokeLinecap="round" />
          <ellipse cx="38" cy="83" rx="6" ry="4" fill="#ff8fa3" opacity="0.5" />
          <ellipse cx="82" cy="83" rx="6" ry="4" fill="#ff8fa3" opacity="0.5" />
        </g>
      )}
    </svg>
  );
}
