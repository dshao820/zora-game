import type { ReactNode } from 'react';
import type { Species } from '../data/animals';
import { isDark } from '../data/colors';

/**
 * 所有動物共用同一套造型語言：
 * 200×200 畫布、圓頭圓身、深棕描邊、大眼睛＋高光、粉紅腮紅。
 */
export const INK = '#4a3b3f';
const SW = 4;

interface ArtProps {
  c: string;
  shirt?: string;
}

function Eyes({ y = 90, dx = 20, onDark = false }: { y?: number; dx?: number; onDark?: boolean }) {
  return (
    <g className="aa-blink">
      {[100 - dx, 100 + dx].map((x) =>
        onDark ? (
          <g key={x}>
            <circle cx={x} cy={y} r={9.5} fill="#fff" />
            <circle cx={x} cy={y + 1} r={6} fill={INK} />
            <circle cx={x - 2} cy={y - 2} r={2.2} fill="#fff" />
          </g>
        ) : (
          <g key={x}>
            <ellipse cx={x} cy={y} rx={8} ry={10} fill={INK} />
            <circle cx={x - 2.5} cy={y - 4} r={3.2} fill="#fff" />
            <circle cx={x + 2.5} cy={y + 3} r={1.5} fill="#fff" />
          </g>
        ),
      )}
    </g>
  );
}

function Cheeks({ y = 108, dx = 36 }: { y?: number; dx?: number }) {
  return (
    <g fill="#ff8fa3" opacity={0.55}>
      <ellipse cx={100 - dx} cy={y} rx={10} ry={6.5} />
      <ellipse cx={100 + dx} cy={y} rx={10} ry={6.5} />
    </g>
  );
}

function Line({ d, w = 3.5, color = INK }: { d: string; w?: number; color?: string }) {
  return <path d={d} fill="none" stroke={color} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round" />;
}

function Shape({ children }: { children: ReactNode }) {
  return (
    <g stroke={INK} strokeWidth={SW} strokeLinejoin="round">
      {children}
    </g>
  );
}

function Body({ c, cy = 152, rx = 50, ry = 38 }: { c: string; cy?: number; rx?: number; ry?: number }) {
  return <ellipse cx={100} cy={cy} rx={rx} ry={ry} fill={c} stroke={INK} strokeWidth={SW} />;
}

function Feet({ c, y = 184 }: { c: string; y?: number }) {
  return (
    <Shape>
      <ellipse cx={78} cy={y} rx={15} ry={9} fill={c} />
      <ellipse cx={122} cy={y} rx={15} ry={9} fill={c} />
    </Shape>
  );
}

function Head({ c, r = 54, cy = 90 }: { c: string; r?: number; cy?: number }) {
  return <circle cx={100} cy={cy} r={r} fill={c} stroke={INK} strokeWidth={SW} />;
}

/** 粗尾巴：外層描邊＋內層填色，會依 CSS 擺動 */
function Tail({ d, c, origin, w = 10 }: { d: string; c: string; origin: string; w?: number }) {
  return (
    <g className="aa-tail" style={{ transformOrigin: origin }}>
      <Line d={d} w={w + 8} />
      <Line d={d} w={w} color={c} />
    </g>
  );
}

/** 衣服（顏色樂園「幫動物穿衣服」） */
export function Shirt({ color }: { color: string }) {
  return (
    <g>
      <path
        d="M56 136 Q100 122 144 136 L158 158 L139 166 L137 184 Q100 193 63 184 L61 166 L42 158 Z"
        fill={color}
        stroke={INK}
        strokeWidth={SW}
        strokeLinejoin="round"
      />
      <Line d="M88 131 L100 145 L112 131" w={3} />
      <circle cx={100} cy={160} r={3.5} fill={INK} opacity={0.5} />
      <circle cx={100} cy={174} r={3.5} fill={INK} opacity={0.5} />
    </g>
  );
}

const ART: Record<Species, { base: string; draw: (p: ArtProps) => ReactNode }> = {
  dog: {
    base: '#f3c08a',
    draw: ({ c, shirt }) => (
      <>
        <Tail d="M142 150 Q172 140 168 110" c={c} origin="142px 150px" />
        <Body c={c} />
        {shirt && <Shirt color={shirt} />}
        <Feet c={c} />
        <Head c={c} />
        <ellipse cx={122} cy={86} rx={16} ry={15} fill="#c98a55" />
        <Shape>
          <ellipse cx={50} cy={94} rx={16} ry={31} fill="#b97a4a" transform="rotate(18 50 94)" />
          <ellipse cx={150} cy={94} rx={16} ry={31} fill="#b97a4a" transform="rotate(-18 150 94)" />
        </Shape>
        <ellipse cx={100} cy={115} rx={24} ry={16} fill="#fff4e6" />
        <Eyes y={86} />
        <ellipse cx={100} cy={106} rx={9} ry={6.5} fill={INK} />
        <Line d="M100 112 L100 118 M91 118 Q100 127 109 118" />
        <Cheeks y={110} dx={38} />
      </>
    ),
  },
  cat: {
    base: '#ffb36b',
    draw: ({ c, shirt }) => (
      <>
        <Tail d="M146 160 Q184 150 172 118 Q166 104 178 96" c={c} origin="146px 160px" />
        <Body c={c} />
        {shirt && <Shirt color={shirt} />}
        <Feet c={c} />
        <Shape>
          <path d="M52 76 L60 24 L98 46 Z" fill={c} />
          <path d="M148 76 L140 24 L102 46 Z" fill={c} />
        </Shape>
        <path d="M62 62 L66 38 L86 50 Z" fill="#ffc9d6" />
        <path d="M138 62 L134 38 L114 50 Z" fill="#ffc9d6" />
        <Head c={c} />
        <Line d="M100 40 L100 54 M86 43 L90 54 M114 43 L110 54" w={5} color="#e0883a" />
        <Eyes y={90} />
        <path d="M94 104 L106 104 L100 111 Z" fill="#ff7a93" stroke={INK} strokeWidth={2} strokeLinejoin="round" />
        <Line d="M90 115 Q95 122 100 114 Q105 122 110 115" />
        <Line d="M62 104 L40 99 M62 112 L40 117 M138 104 L160 99 M138 112 L160 117" w={2.5} />
        <Cheeks y={112} dx={36} />
      </>
    ),
  },
  rabbit: {
    base: '#fbf6ef',
    draw: ({ c, shirt }) => (
      <>
        <circle cx={150} cy={170} r={13} fill={c} stroke={INK} strokeWidth={SW} />
        <Body c={c} />
        {shirt && <Shirt color={shirt} />}
        <Feet c={c} />
        <Shape>
          <ellipse cx={78} cy={36} rx={15} ry={40} fill={c} transform="rotate(-8 78 36)" />
          <ellipse cx={122} cy={36} rx={15} ry={40} fill={c} transform="rotate(8 122 36)" />
        </Shape>
        <ellipse cx={78} cy={38} rx={7} ry={29} fill="#ffc4d4" transform="rotate(-8 78 38)" />
        <ellipse cx={122} cy={38} rx={7} ry={29} fill="#ffc4d4" transform="rotate(8 122 38)" />
        <Head c={c} cy={94} />
        <Eyes y={92} />
        <ellipse cx={100} cy={108} rx={6.5} ry={4.5} fill="#ff8fab" />
        <Line d="M100 112 L100 116 M92 116 Q96 121 100 116 Q104 121 108 116" />
        <rect x={95} y={118} width={10} height={9} rx={2} fill="#fff" stroke={INK} strokeWidth={2.5} />
        <Cheeks y={110} dx={36} />
      </>
    ),
  },
  duck: {
    base: '#ffd84d',
    draw: ({ c, shirt }) => (
      <>
        <path d="M142 146 L170 130 L160 158 Z" fill={c} stroke={INK} strokeWidth={SW} strokeLinejoin="round" />
        <Body c={c} />
        {shirt ? (
          <Shirt color={shirt} />
        ) : (
          <Shape>
            <ellipse cx={58} cy={152} rx={14} ry={24} fill={c} transform="rotate(20 58 152)" />
            <ellipse cx={142} cy={152} rx={14} ry={24} fill={c} transform="rotate(-20 142 152)" />
          </Shape>
        )}
        <Feet c="#ff9f1c" />
        <path d="M96 40 Q88 18 110 20 Q98 28 106 40 Z" fill={c} stroke={INK} strokeWidth={SW} strokeLinejoin="round" />
        <Head c={c} />
        <Eyes y={84} />
        <ellipse cx={100} cy={110} rx={25} ry={11} fill="#ff9f1c" stroke={INK} strokeWidth={SW} />
        <Line d="M78 110 Q100 116 122 110" w={2.5} />
        <Cheeks y={102} dx={40} />
      </>
    ),
  },
  chick: {
    base: '#ffe680',
    draw: ({ c, shirt }) => (
      <>
        <Body c={c} cy={150} rx={54} ry={42} />
        {shirt ? (
          <Shirt color={shirt} />
        ) : (
          <Shape>
            <ellipse cx={52} cy={148} rx={11} ry={18} fill={c} transform="rotate(30 52 148)" />
            <ellipse cx={148} cy={148} rx={11} ry={18} fill={c} transform="rotate(-30 148 148)" />
          </Shape>
        )}
        <Feet c="#ff9f1c" />
        <Shape>
          <path d="M92 44 Q84 26 96 22 Q96 34 100 42 Q102 26 112 24 Q110 36 106 44 Z" fill={c} />
        </Shape>
        <Head c={c} r={50} cy={92} />
        <Eyes y={88} dx={19} />
        <path d="M89 104 L111 104 L100 119 Z" fill="#ff9f1c" stroke={INK} strokeWidth={3} strokeLinejoin="round" />
        <Cheeks y={106} dx={34} />
      </>
    ),
  },
  cow: {
    base: '#ffffff',
    draw: ({ c, shirt }) => (
      <>
        <Tail d="M146 152 Q172 150 166 176" c={c} origin="146px 152px" w={5} />
        <Body c={c} />
        <ellipse cx={82} cy={150} rx={14} ry={10} fill="#3f3a44" />
        <ellipse cx={126} cy={162} rx={12} ry={9} fill="#3f3a44" />
        {shirt && <Shirt color={shirt} />}
        <Feet c="#5c4f55" />
        <Shape>
          <path d="M66 52 Q54 28 70 20 Q68 36 80 46 Z" fill="#f3d9a4" />
          <path d="M134 52 Q146 28 130 20 Q132 36 120 46 Z" fill="#f3d9a4" />
          <ellipse cx={44} cy={80} rx={21} ry={11} fill={c} transform="rotate(-18 44 80)" />
          <ellipse cx={156} cy={80} rx={21} ry={11} fill={c} transform="rotate(18 156 80)" />
        </Shape>
        <Head c={c} />
        <ellipse cx={124} cy={64} rx={15} ry={11} fill="#3f3a44" />
        <Eyes y={84} />
        <ellipse cx={100} cy={118} rx={33} ry={20} fill="#ffc2cf" stroke={INK} strokeWidth={SW} />
        <ellipse cx={88} cy={116} rx={4} ry={5.5} fill="#d9778d" />
        <ellipse cx={112} cy={116} rx={4} ry={5.5} fill="#d9778d" />
        <Line d="M93 128 Q100 133 107 128" w={3} />
        <Cheeks y={98} dx={42} />
      </>
    ),
  },
  sheep: {
    base: '#ffffff',
    draw: ({ c, shirt }) => {
      const wool = Array.from({ length: 11 }, (_, i) => {
        const a = (i / 11) * Math.PI * 2;
        return [100 + Math.cos(a) * 44, 152 + Math.sin(a) * 30] as const;
      });
      return (
        <>
          {wool.map(([x, y], i) => (
            <circle key={i} cx={x} cy={y} r={16} fill={c} stroke={INK} strokeWidth={SW} />
          ))}
          <ellipse cx={100} cy={152} rx={46} ry={32} fill={c} />
          {shirt && <Shirt color={shirt} />}
          <Feet c="#5c4a4f" y={186} />
          <Shape>
            <ellipse cx={48} cy={94} rx={21} ry={10} fill="#e8bfa0" transform="rotate(20 48 94)" />
            <ellipse cx={152} cy={94} rx={21} ry={10} fill="#e8bfa0" transform="rotate(-20 152 94)" />
          </Shape>
          <Head c="#f9e4cc" r={48} cy={98} />
          <Shape>
            <circle cx={76} cy={56} r={16} fill={c} />
            <circle cx={124} cy={56} r={16} fill={c} />
            <circle cx={100} cy={48} r={18} fill={c} />
          </Shape>
          <Eyes y={96} dx={19} />
          <Line d="M94 112 Q100 117 106 112 M100 116 L100 120 M93 122 Q100 127 107 122" w={3} />
          <Cheeks y={112} dx={32} />
        </>
      );
    },
  },
  pig: {
    base: '#ffb5c8',
    draw: ({ c, shirt }) => (
      <>
        <Line d="M148 150 q16 -4 13 -15 q-3 -9 -9 -4 q-6 5 2 10 q9 6 15 -3" w={4} />
        <Body c={c} />
        {shirt && <Shirt color={shirt} />}
        <Feet c="#ff8fab" />
        <Shape>
          <path d="M54 64 L56 28 L88 46 Z" fill="#ff8fab" />
          <path d="M146 64 L144 28 L112 46 Z" fill="#ff8fab" />
        </Shape>
        <Head c={c} />
        <Eyes y={84} />
        <ellipse cx={100} cy={112} rx={22} ry={15} fill="#ff8fab" stroke={INK} strokeWidth={SW} />
        <ellipse cx={93} cy={112} rx={3.8} ry={5.5} fill={INK} />
        <ellipse cx={107} cy={112} rx={3.8} ry={5.5} fill={INK} />
        <Line d="M94 133 Q100 137 106 133" w={3} />
        <Cheeks y={104} dx={40} />
      </>
    ),
  },
  elephant: {
    base: '#a9bdd3',
    draw: ({ c, shirt }) => (
      <>
        <Line d="M148 156 Q166 164 160 180" w={4} />
        <Body c={c} />
        {shirt && <Shirt color={shirt} />}
        <Feet c={c} />
        <Shape>
          <ellipse cx={44} cy={96} rx={34} ry={41} fill={c} />
          <ellipse cx={156} cy={96} rx={34} ry={41} fill={c} />
        </Shape>
        <ellipse cx={44} cy={96} rx={21} ry={28} fill="#f4b8c8" />
        <ellipse cx={156} cy={96} rx={21} ry={28} fill="#f4b8c8" />
        <Head c={c} r={52} />
        <path
          d="M88 100 Q86 136 98 150 Q108 158 120 150 Q116 145 108 144 Q102 132 112 100 Z"
          fill={c}
          stroke={INK}
          strokeWidth={SW}
          strokeLinejoin="round"
        />
        <Line d="M92 126 L101 126 M94 136 L104 136" w={2.5} />
        <Eyes y={82} dx={24} />
        <Cheeks y={104} dx={38} />
      </>
    ),
  },
  lion: {
    base: '#ffd27a',
    draw: ({ c, shirt }) => {
      const mane = Array.from({ length: 12 }, (_, i) => {
        const a = (i / 12) * Math.PI * 2;
        return [100 + Math.cos(a) * 58, 92 + Math.sin(a) * 58] as const;
      });
      return (
        <>
          <Tail d="M146 154 Q178 160 172 126" c={c} origin="146px 154px" w={6} />
          <circle cx={172} cy={122} r={10} fill="#e98a2b" stroke={INK} strokeWidth={SW} />
          <Body c={c} />
          {shirt && <Shirt color={shirt} />}
          <Feet c={c} />
          {mane.map(([x, y], i) => (
            <circle key={i} cx={x} cy={y} r={19} fill="#e98a2b" stroke={INK} strokeWidth={SW} />
          ))}
          <circle cx={100} cy={92} r={62} fill="#e98a2b" />
          <Shape>
            <circle cx={64} cy={52} r={12} fill={c} />
            <circle cx={136} cy={52} r={12} fill={c} />
          </Shape>
          <Head c={c} r={48} cy={94} />
          <circle cx={90} cy={113} r={12} fill="#fff3d6" />
          <circle cx={110} cy={113} r={12} fill="#fff3d6" />
          <Eyes y={88} dx={18} />
          <path d="M92 102 L108 102 L100 111 Z" fill="#8a5a44" stroke={INK} strokeWidth={2} strokeLinejoin="round" />
          <Line d="M94 125 Q100 129 106 125" w={3} />
          <Cheeks y={108} dx={32} />
        </>
      );
    },
  },
  monkey: {
    base: '#a86b45',
    draw: ({ c, shirt }) => (
      <>
        <Tail d="M146 162 Q182 160 178 128 Q174 110 158 120" c={c} origin="146px 162px" w={8} />
        <Body c={c} />
        {shirt ? <Shirt color={shirt} /> : <ellipse cx={100} cy={158} rx={28} ry={22} fill="#f6d3aa" />}
        <Feet c={c} />
        <Shape>
          <circle cx={44} cy={92} r={19} fill={c} />
          <circle cx={156} cy={92} r={19} fill={c} />
        </Shape>
        <circle cx={44} cy={92} r={10} fill="#f6d3aa" />
        <circle cx={156} cy={92} r={10} fill="#f6d3aa" />
        <Head c={c} r={52} />
        <g fill="#f6d3aa">
          <circle cx={83} cy={90} r={21} />
          <circle cx={117} cy={90} r={21} />
          <ellipse cx={100} cy={114} rx={33} ry={23} />
        </g>
        <Eyes y={90} dx={16} />
        <circle cx={96} cy={108} r={2.5} fill={INK} />
        <circle cx={104} cy={108} r={2.5} fill={INK} />
        <Line d="M87 118 Q100 129 113 118" />
        <Cheeks y={114} dx={34} />
      </>
    ),
  },
  panda: {
    base: '#ffffff',
    draw: ({ c, shirt }) => (
      <>
        <Body c={c} />
        {shirt ? (
          <Shirt color={shirt} />
        ) : (
          <g fill="#3f3a44">
            <ellipse cx={58} cy={150} rx={14} ry={23} transform="rotate(25 58 150)" />
            <ellipse cx={142} cy={150} rx={14} ry={23} transform="rotate(-25 142 150)" />
          </g>
        )}
        <Feet c="#3f3a44" />
        <Shape>
          <circle cx={56} cy={46} r={17} fill="#3f3a44" />
          <circle cx={144} cy={46} r={17} fill="#3f3a44" />
        </Shape>
        <Head c={c} r={56} cy={92} />
        <ellipse cx={78} cy={94} rx={15} ry={20} fill="#3f3a44" transform="rotate(30 78 94)" />
        <ellipse cx={122} cy={94} rx={15} ry={20} fill="#3f3a44" transform="rotate(-30 122 94)" />
        <Eyes y={93} dx={22} onDark />
        <ellipse cx={100} cy={111} rx={7} ry={5} fill="#3f3a44" />
        <Line d="M92 119 Q100 125 108 119" w={3} />
        <Cheeks y={114} dx={42} />
      </>
    ),
  },
  frog: {
    base: '#7ed36b',
    draw: ({ c, shirt }) => (
      <>
        <Body c={c} cy={156} rx={52} ry={34} />
        {shirt ? <Shirt color={shirt} /> : <ellipse cx={100} cy={160} rx={32} ry={22} fill="#dff5cf" />}
        <Feet c={c} />
        <Shape>
          <circle cx={66} cy={64} r={23} fill={c} />
          <circle cx={134} cy={64} r={23} fill={c} />
        </Shape>
        <ellipse cx={100} cy={100} rx={64} ry={44} fill={c} stroke={INK} strokeWidth={SW} />
        <circle cx={66} cy={64} r={20.5} fill={c} />
        <circle cx={134} cy={64} r={20.5} fill={c} />
        <circle cx={66} cy={64} r={14} fill="#fff" />
        <circle cx={134} cy={64} r={14} fill="#fff" />
        <Eyes y={64} dx={34} />
        <circle cx={92} cy={96} r={2.5} fill={INK} />
        <circle cx={108} cy={96} r={2.5} fill={INK} />
        <Line d="M68 110 Q100 134 132 110" />
        <Cheeks y={112} dx={48} />
      </>
    ),
  },
  horse: {
    base: '#c98b5a',
    draw: ({ c, shirt }) => (
      <>
        <Tail d="M146 150 Q178 150 170 182" c="#6b4a3a" origin="146px 150px" w={12} />
        <Body c={c} />
        {shirt && <Shirt color={shirt} />}
        <Feet c="#5c4a4f" />
        <Shape>
          <path d="M60 58 L62 18 L88 40 Z" fill={c} />
          <path d="M140 58 L138 18 L112 40 Z" fill={c} />
        </Shape>
        <path d="M66 46 L67 28 L80 40 Z" fill="#f0c9a6" />
        <path d="M134 46 L133 28 L120 40 Z" fill="#f0c9a6" />
        <ellipse cx={100} cy={90} rx={50} ry={56} fill={c} stroke={INK} strokeWidth={SW} />
        <Shape>
          <path d="M74 50 Q84 26 100 38 Q112 22 128 46 Q114 44 104 56 Q96 44 74 50 Z" fill="#6b4a3a" />
        </Shape>
        <ellipse cx={100} cy={124} rx={34} ry={22} fill="#f0d2b0" stroke={INK} strokeWidth={SW} />
        <ellipse cx={88} cy={122} rx={4} ry={5.5} fill={INK} />
        <ellipse cx={112} cy={122} rx={4} ry={5.5} fill={INK} />
        <Line d="M92 134 Q100 139 108 134" w={3} />
        <Eyes y={84} dx={22} />
        <Cheeks y={104} dx={40} />
      </>
    ),
  },
  squirrel: {
    base: '#d98a4e',
    draw: ({ c, shirt }) => (
      <>
        <Tail d="M136 166 Q178 156 166 100 Q158 68 134 76" c={c} origin="136px 166px" w={26} />
        <Line d="M146 148 Q166 128 158 102" w={4} color="#f6d3aa" />
        <Body c={c} cy={154} rx={46} ry={36} />
        {shirt ? (
          <Shirt color={shirt} />
        ) : (
          <>
            <ellipse cx={100} cy={160} rx={28} ry={24} fill="#f6d3aa" />
            <ellipse cx={100} cy={150} rx={13} ry={11} fill="#a0663a" stroke={INK} strokeWidth={3} />
            <path d="M85 144 Q100 128 115 144 Z" fill="#6b4a3a" stroke={INK} strokeWidth={3} strokeLinejoin="round" />
            <Shape>
              <ellipse cx={80} cy={152} rx={9} ry={11} fill={c} />
              <ellipse cx={120} cy={152} rx={9} ry={11} fill={c} />
            </Shape>
          </>
        )}
        <Feet c={c} />
        <Shape>
          <path d="M58 70 L62 26 L90 50 Z" fill={c} />
          <path d="M142 70 L138 26 L110 50 Z" fill={c} />
        </Shape>
        <Line d="M62 26 L58 16 M62 26 L66 15 M138 26 L142 16 M138 26 L134 15" w={3} />
        <Head c={c} r={50} cy={92} />
        <ellipse cx={100} cy={112} rx={28} ry={20} fill="#f6d3aa" />
        <Eyes y={88} dx={20} />
        <ellipse cx={100} cy={104} rx={6} ry={4.5} fill={INK} />
        <Line d="M100 108 L100 112 M92 112 Q96 117 100 112 Q104 117 108 112" w={3} />
        <rect x={95.5} y={114} width={9} height={8} rx={2} fill="#fff" stroke={INK} strokeWidth={2.5} />
        <Cheeks y={110} dx={34} />
      </>
    ),
  },
  giraffe: {
    base: '#ffd26a',
    draw: ({ c, shirt }) => (
      <>
        <Tail d="M142 160 Q164 166 160 184" c={c} origin="142px 160px" w={4} />
        <Body c={c} cy={160} rx={48} ry={32} />
        <path d="M80 140 L82 74 H118 L120 140 Z" fill={c} stroke={INK} strokeWidth={SW} strokeLinejoin="round" />
        <ellipse cx={100} cy={136} rx={22} ry={10} fill={c} />
        <g fill="#d9893a">
          <ellipse cx={92} cy={96} rx={7} ry={6} />
          <ellipse cx={108} cy={114} rx={7} ry={6} />
          <ellipse cx={94} cy={128} rx={6} ry={5} />
          <ellipse cx={72} cy={160} rx={9} ry={7} />
          <ellipse cx={128} cy={156} rx={9} ry={7} />
          <ellipse cx={104} cy={172} rx={8} ry={6} />
        </g>
        {shirt && <Shirt color={shirt} />}
        <Feet c="#8a5a44" />
        <Line d="M86 34 L84 14 M114 34 L116 14" w={6} />
        <circle cx={84} cy={13} r={7} fill="#a0663a" stroke={INK} strokeWidth={3} />
        <circle cx={116} cy={13} r={7} fill="#a0663a" stroke={INK} strokeWidth={3} />
        <Shape>
          <ellipse cx={56} cy={52} rx={16} ry={8} fill={c} transform="rotate(-20 56 52)" />
          <ellipse cx={144} cy={52} rx={16} ry={8} fill={c} transform="rotate(20 144 52)" />
        </Shape>
        <ellipse cx={100} cy={60} rx={40} ry={36} fill={c} stroke={INK} strokeWidth={SW} />
        <ellipse cx={100} cy={80} rx={28} ry={16} fill="#ffe9b0" stroke={INK} strokeWidth={3} />
        <circle cx={92} cy={78} r={2.5} fill={INK} />
        <circle cx={108} cy={78} r={2.5} fill={INK} />
        <Line d="M94 88 Q100 92 106 88" w={3} />
        <Eyes y={54} dx={18} />
        <Cheeks y={72} dx={34} />
      </>
    ),
  },
  penguin: {
    base: '#3f4a5c',
    draw: ({ c, shirt }) => (
      <>
        <Shape>
          <ellipse cx={44} cy={136} rx={13} ry={30} fill={c} transform="rotate(22 44 136)" />
          <ellipse cx={156} cy={136} rx={13} ry={30} fill={c} transform="rotate(-22 156 136)" />
        </Shape>
        <ellipse cx={100} cy={124} rx={60} ry={66} fill={c} stroke={INK} strokeWidth={SW} />
        <ellipse cx={100} cy={146} rx={42} ry={42} fill="#fff" />
        <circle cx={82} cy={92} r={23} fill="#fff" />
        <circle cx={118} cy={92} r={23} fill="#fff" />
        <ellipse cx={100} cy={112} rx={34} ry={22} fill="#fff" />
        {shirt && <Shirt color={shirt} />}
        <Feet c="#ff9f1c" y={188} />
        <Eyes y={92} dx={18} />
        <path d="M88 106 L112 106 L100 120 Z" fill="#ff9f1c" stroke={INK} strokeWidth={3} strokeLinejoin="round" />
        <Cheeks y={112} dx={34} />
      </>
    ),
  },
  turtle: {
    base: '#b9e08a',
    draw: ({ c, shirt }) => (
      <>
        <Shape>
          <ellipse cx={38} cy={162} rx={20} ry={12} fill={c} transform="rotate(-20 38 162)" />
          <ellipse cx={162} cy={162} rx={20} ry={12} fill={c} transform="rotate(20 162 162)" />
        </Shape>
        <Feet c={c} y={186} />
        <path d="M30 168 Q30 104 100 104 Q170 104 170 168 Z" fill="#5fae5c" stroke={INK} strokeWidth={SW} strokeLinejoin="round" />
        <rect x={26} y={160} width={148} height={16} rx={8} fill="#f5c26b" stroke={INK} strokeWidth={SW} />
        {shirt ? (
          <Shirt color={shirt} />
        ) : (
          <g fill="#7fc66b" stroke={INK} strokeWidth={3} strokeLinejoin="round">
            <path d="M84 124 L116 124 L124 142 L116 158 L84 158 L76 142 Z" />
            <path d="M50 150 L64 128 L72 142 L66 158 Z" />
            <path d="M150 150 L136 128 L128 142 L134 158 Z" />
          </g>
        )}
        <Head c={c} r={44} cy={78} />
        <Eyes y={72} dx={18} />
        <Line d="M88 94 Q100 104 112 94" />
        <Cheeks y={90} dx={30} />
      </>
    ),
  },
  bird: {
    base: '#4d96ff',
    draw: ({ c }) => (
      <>
        <path d="M146 140 L178 122 L172 152 Z" fill={c} stroke={INK} strokeWidth={SW} strokeLinejoin="round" />
        <path d="M94 72 Q86 50 104 48 Q98 60 108 70 Z" fill={c} stroke={INK} strokeWidth={SW} strokeLinejoin="round" />
        <ellipse cx={100} cy={124} rx={60} ry={56} fill={c} stroke={INK} strokeWidth={SW} />
        <ellipse cx={100} cy={146} rx={36} ry={26} fill="#fff" opacity={0.5} />
        <Shape>
          <ellipse cx={46} cy={132} rx={13} ry={24} fill={c} transform="rotate(25 46 132)" />
          <ellipse cx={154} cy={132} rx={13} ry={24} fill={c} transform="rotate(-25 154 132)" />
        </Shape>
        <Line d="M86 178 L84 192 M114 178 L116 192" w={5} color="#ff9f1c" />
        <Eyes y={108} dx={19} onDark={isDark(c)} />
        <path d="M90 120 L110 120 L100 133 Z" fill="#ffb020" stroke={INK} strokeWidth={3} strokeLinejoin="round" />
        <Cheeks y={126} dx={36} />
      </>
    ),
  },
};

export function baseColor(species: Species) {
  return ART[species].base;
}

export function AnimalArt({ species, color, shirt }: { species: Species; color?: string; shirt?: string }) {
  const art = ART[species];
  return <>{art.draw({ c: color ?? art.base, shirt })}</>;
}
