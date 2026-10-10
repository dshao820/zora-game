import { useEffect, useRef, useState } from 'react';
import { GearIcon } from './icons';

const HOLD_MS = 3000;

/**
 * 隱藏的家長入口：小齒輪必須「按住 3 秒」才會打開，避免幼兒誤觸。
 */
export function ParentGate({ onOpen }: { onOpen: () => void }) {
  const [holding, setHolding] = useState(false);
  const timer = useRef<number | undefined>(undefined);

  const start = () => {
    setHolding(true);
    timer.current = window.setTimeout(() => {
      setHolding(false);
      onOpen();
    }, HOLD_MS);
  };
  const cancel = () => {
    window.clearTimeout(timer.current);
    setHolding(false);
  };
  useEffect(() => () => window.clearTimeout(timer.current), []);

  const r = 26;
  const circ = 2 * Math.PI * r;

  return (
    <button
      type="button"
      aria-label="家長設定（按住三秒）"
      title="家長設定：按住 3 秒"
      className="absolute bottom-[max(12px,env(safe-area-inset-bottom))] left-3 z-30 flex size-16 items-center justify-center rounded-full bg-white/40 opacity-60"
      onPointerDown={start}
      onPointerUp={cancel}
      onPointerLeave={cancel}
      onPointerCancel={cancel}
      onContextMenu={(e) => e.preventDefault()}
    >
      <GearIcon size={36} />
      <svg className="absolute inset-0" viewBox="0 0 64 64" aria-hidden>
        <circle
          cx="32"
          cy="32"
          r={r}
          fill="none"
          stroke="#4d96ff"
          strokeWidth="5"
          strokeLinecap="round"
          strokeDasharray={circ}
          strokeDashoffset={holding ? 0 : circ}
          transform="rotate(-90 32 32)"
          style={{ transition: holding ? `stroke-dashoffset ${HOLD_MS}ms linear` : 'none' }}
        />
      </svg>
    </button>
  );
}
