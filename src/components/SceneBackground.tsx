import { memo } from 'react';

/** 背景場景：藍天、白雲、太陽、山丘、草地、樹木、小花、蝴蝶 */

function Cloud() {
  return (
    <g fill="#fff" opacity={0.95}>
      <circle cx="0" cy="0" r="36" />
      <circle cx="44" cy="-20" r="48" />
      <circle cx="96" cy="-2" r="38" />
      <rect x="0" y="-6" width="96" height="42" rx="21" />
    </g>
  );
}

function Tree({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <rect x="-15" y="-20" width="30" height="100" rx="12" fill="#b07a4f" />
      <circle cx="0" cy="-70" r="72" fill="#6cc46a" />
      <circle cx="-56" cy="-26" r="46" fill="#5fb85e" />
      <circle cx="56" cy="-30" r="50" fill="#5fb85e" />
      <circle cx="-20" cy="-96" r="26" fill="#7fd27c" opacity="0.7" />
      <circle cx="-30" cy="-60" r="9" fill="#ef5350" />
      <circle cx="30" cy="-90" r="9" fill="#ef5350" />
      <circle cx="40" cy="-30" r="9" fill="#ef5350" />
    </g>
  );
}

function Flower({ x, y, c }: { x: number; y: number; c: string }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <path d="M0 0 V28" stroke="#4f9e4c" strokeWidth="5" strokeLinecap="round" />
      {[0, 72, 144, 216, 288].map((a) => (
        <circle key={a} cx="0" cy="-11" r="9" fill={c} transform={`rotate(${a})`} />
      ))}
      <circle cx="0" cy="0" r="7" fill="#ffd93d" />
    </g>
  );
}

function Butterfly({ x, y, c, dur, delay }: { x: number; y: number; c: string; dur: number; delay: number }) {
  return (
    <g className="butterfly" style={{ animationDuration: `${dur}s`, animationDelay: `${delay}s` }}>
      <g transform={`translate(${x} ${y})`}>
        <g className="bfly-wing">
          <ellipse cx="-11" cy="-6" rx="12" ry="15" fill={c} stroke="#4a3b3f" strokeWidth="3" />
          <ellipse cx="11" cy="-6" rx="12" ry="15" fill={c} stroke="#4a3b3f" strokeWidth="3" />
          <ellipse cx="-8" cy="12" rx="8" ry="9" fill={c} stroke="#4a3b3f" strokeWidth="3" />
          <ellipse cx="8" cy="12" rx="8" ry="9" fill={c} stroke="#4a3b3f" strokeWidth="3" />
        </g>
        <rect x="-3" y="-14" width="6" height="30" rx="3" fill="#4a3b3f" />
      </g>
    </g>
  );
}

export const SceneBackground = memo(function SceneBackground({ rich }: { rich: boolean }) {
  return (
    <div className="pointer-events-none absolute inset-0" aria-hidden>
      <svg className="size-full" viewBox="0 0 1280 800" preserveAspectRatio="xMidYMax slice">
        <defs>
          <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#9fdcff" />
            <stop offset="0.75" stopColor="#e3f6ff" />
          </linearGradient>
        </defs>
        <rect width="1280" height="800" fill="url(#sky)" />

        <g transform="translate(1150 100)">
          <g className="sun-rays">
            {Array.from({ length: 12 }, (_, i) => (
              <rect key={i} x="-6" y="-92" width="12" height="26" rx="6" fill="#ffe27a" transform={`rotate(${i * 30})`} />
            ))}
          </g>
          <circle r="56" fill="#ffe27a" stroke="#ffc94d" strokeWidth="6" />
        </g>

        {[
          { y: 110, s: 1, dur: 110, delay: -20 },
          { y: 190, s: 0.7, dur: 140, delay: -80 },
          { y: 70, s: 0.85, dur: 125, delay: -55 },
          { y: 240, s: 0.55, dur: 160, delay: -120 },
        ].map((c, i) => (
          <g key={i} className="cloud" style={{ animationDuration: `${c.dur}s`, animationDelay: `${c.delay}s` }}>
            <g transform={`translate(0 ${c.y}) scale(${c.s})`}>
              <Cloud />
            </g>
          </g>
        ))}

        <ellipse cx="260" cy="760" rx="560" ry="230" fill="#c6ebb0" />
        <ellipse cx="1060" cy="770" rx="600" ry="250" fill="#b4e3a0" />

        {rich ? (
          <>
            <Tree x={110} y={600} s={1.1} />
            <Tree x={1180} y={610} s={1.2} />
            <Tree x={300} y={590} s={0.6} />
          </>
        ) : (
          <>
            <Tree x={70} y={620} s={0.8} />
            <Tree x={1220} y={630} s={0.85} />
          </>
        )}

        <path d="M0 650 Q320 610 640 640 T1280 630 V800 H0 Z" fill="#94d882" />
        <path d="M0 700 Q400 670 760 700 T1280 690 V800 H0 Z" fill="#86cf74" />

        {rich && (
          <>
            {[
              [200, 700, '#ff8fc7'], [380, 720, '#ffffff'], [560, 690, '#a374f5'], [760, 715, '#ff8fc7'],
              [930, 700, '#ffffff'], [1080, 725, '#ff9f43'], [60, 730, '#ffffff'], [1240, 740, '#a374f5'],
            ].map(([x, y, c], i) => (
              <Flower key={i} x={x as number} y={y as number} c={c as string} />
            ))}
            <Butterfly x={300} y={420} c="#ffb3c7" dur={16} delay={0} />
            <Butterfly x={900} y={360} c="#c4b5fd" dur={19} delay={-6} />
          </>
        )}
        {!rich && (
          <>
            <Flower x={180} y={730} c="#ff8fc7" />
            <Flower x={1110} y={735} c="#ffffff" />
            <Butterfly x={1000} y={300} c="#ffe27a" dur={22} delay={-4} />
          </>
        )}
      </svg>
    </div>
  );
});
