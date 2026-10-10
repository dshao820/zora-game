import { AnimatePresence, motion } from 'motion/react';
import { useEffect, useMemo, useRef, useState } from 'react';
import type { Species } from '../data/animals';
import { COLORS } from '../data/colors';
import { CELEBRATION, STAR_EARNED } from '../data/phrases';
import { useGameProgress, type Burst } from '../hooks/useGameProgress';
import { audio } from '../lib/audio';
import { speech } from '../lib/speech';
import { AnimalCharacter } from './AnimalCharacter';
import { Balloon } from './Balloon';
import { GameButton } from './GameButton';
import { CheckIcon, StarIcon } from './icons';

const PALETTE = COLORS.filter((c) => c.id !== 'black' && c.id !== 'white').map((c) => c.hex);

/** 答對時從元素位置噴出的星星與泡泡 */
function StarBurst({ x, y, color }: Burst) {
  const parts = useMemo(
    () =>
      Array.from({ length: 12 }, (_, i) => {
        const a = (i / 12) * Math.PI * 2 + Math.random() * 0.4;
        const d = 90 + Math.random() * 80;
        return { dx: Math.cos(a) * d, dy: Math.sin(a) * d, star: i % 3 !== 2, s: 28 + Math.random() * 22, r: Math.random() * 180 };
      }),
    [],
  );
  return (
    <>
      {parts.map((p, i) => (
        <motion.div
          key={i}
          className="absolute"
          style={{ left: x - p.s / 2, top: y - p.s / 2, width: p.s, height: p.s }}
          initial={{ x: 0, y: 0, scale: 0, opacity: 1 }}
          animate={{ x: p.dx, y: p.dy, scale: [0, 1.2, 0.9], opacity: [1, 1, 0], rotate: p.r }}
          transition={{ duration: 1.1, ease: 'easeOut' }}
        >
          {p.star ? (
            <StarIcon size="100%" fill={color} />
          ) : (
            <span className="block size-full rounded-full border-[3px] border-white/90 bg-white/40" />
          )}
        </motion.div>
      ))}
    </>
  );
}

/** 得到一顆星星：大星星出現後飛進上方的星星計數 */
function StarReward({ onDone }: { onDone: () => void }) {
  const speechDone = useRef<Promise<void>>(Promise.resolve());
  const target = useMemo(() => {
    const el = document.getElementById('star-target');
    const r = el?.getBoundingClientRect();
    const cx = window.innerWidth / 2;
    const cy = window.innerHeight * 0.45;
    return r ? { dx: r.left + r.width / 2 - cx, dy: r.top + r.height / 2 - cy } : { dx: 0, dy: -cy };
  }, []);

  useEffect(() => {
    audio.play('sparkle');
    speechDone.current = speech.speak(STAR_EARNED);
  }, []);

  return (
    <motion.div className="pointer-events-none fixed inset-0 z-50" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <div className="absolute inset-0 bg-white/30" />
      <motion.div
        className="absolute left-1/2 top-[45%] -ml-[90px] -mt-[90px] size-[180px]"
        initial={{ scale: 0, rotate: -90 }}
        animate={{ scale: [0, 1.5, 1.3, 0.25], rotate: [-90, 0, 0, 360], x: [0, 0, 0, target.dx], y: [0, 0, 0, target.dy] }}
        transition={{ duration: 2.2, times: [0, 0.3, 0.65, 1], ease: 'easeInOut' }}
        onAnimationComplete={() => {
          audio.play('pop');
          void speechDone.current.then(onDone);
        }}
      >
        <div className="sun-rays absolute -inset-16 rounded-full bg-[radial-gradient(circle,rgba(255,217,61,0.55),transparent_65%)]" />
        <StarIcon size="100%" />
      </motion.div>
    </motion.div>
  );
}

/** 收集 5 顆星星的慶祝畫面：彩虹、氣球、彩紙、跳舞的動物 */
function Celebration({ stars, onDone }: { stars: number; onDone: () => void }) {
  const [canClose, setCanClose] = useState(false);
  const [beat, setBeat] = useState(0);
  const confetti = useMemo(
    () =>
      Array.from({ length: 44 }, (_, i) => ({
        left: Math.random() * 100,
        delay: Math.random() * 2.5,
        dur: 3 + Math.random() * 2.5,
        color: PALETTE[i % PALETTE.length],
        round: i % 3 === 0,
      })),
    [],
  );
  const balloons = useMemo(
    () => Array.from({ length: 7 }, (_, i) => ({ left: 4 + i * 14 + Math.random() * 4, delay: Math.random() * 1.8, color: PALETTE[(i * 2) % PALETTE.length] })),
    [],
  );
  const dancers: Species[] = ['rabbit', 'panda', 'duck'];

  useEffect(() => {
    audio.play('fanfare');
    let alive = true;
    void speech.speak(CELEBRATION).then(() => alive && setCanClose(true));
    const beatTimer = window.setInterval(() => setBeat((b) => b + 1), 1400);
    const autoClose = window.setTimeout(onDone, 12000);
    return () => {
      alive = false;
      window.clearInterval(beatTimer);
      window.clearTimeout(autoClose);
    };
  }, [onDone]);

  return (
    <motion.div
      className="fixed inset-0 z-50 overflow-hidden bg-sky-100/80 backdrop-blur-[2px]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      role="dialog"
      aria-label="完成挑戰"
    >
      <motion.svg
        viewBox="0 0 400 210"
        className="absolute left-1/2 top-[12%] w-[min(90vw,900px)] -translate-x-1/2"
        initial={{ scaleY: 0, opacity: 0 }}
        animate={{ scaleY: 1, opacity: 1 }}
        transition={{ duration: 1, ease: 'easeOut' }}
        style={{ transformOrigin: 'bottom' }}
        aria-hidden
      >
        {['#ef5350', '#ff9f43', '#ffd93d', '#5cc46b', '#4d96ff', '#a374f5'].map((c, i) => (
          <path key={c} d={`M${20 + i * 14} 210 A${180 - i * 14} ${180 - i * 14} 0 0 1 ${380 - i * 14} 210`} fill="none" stroke={c} strokeWidth="15" />
        ))}
      </motion.svg>

      {confetti.map((c, i) => (
        <span
          key={i}
          className="confetti-piece"
          style={{
            left: `${c.left}%`,
            background: c.color,
            animationDelay: `${c.delay}s`,
            animationDuration: `${c.dur}s`,
            borderRadius: c.round ? '50%' : '3px',
          }}
        />
      ))}

      {balloons.map((b, i) => (
        <div key={i} className="balloon-rise absolute bottom-0" style={{ left: `${b.left}%`, animationDelay: `${b.delay}s` }}>
          <Balloon color={b.color} size="clamp(60px, 9vmin, 110px)" />
        </div>
      ))}

      <div className="absolute inset-x-0 top-[34%] flex flex-col items-center gap-4">
        <motion.div
          className="flex items-center gap-3 rounded-full bg-white px-8 py-3 shadow-xl"
          initial={{ scale: 0 }}
          animate={{ scale: [0, 1.2, 1] }}
          transition={{ delay: 0.5, duration: 0.7 }}
        >
          <StarIcon size={70} />
          <span className="text-6xl font-black text-[#4a3b3f]">{stars}</span>
        </motion.div>
        <div className="flex items-end gap-[3vmin]">
          {dancers.map((s, i) => (
            <AnimalCharacter key={s} species={s} size="clamp(110px, 20vmin, 220px)" anim="dance" animKey={beat} delay={i * 0.15} />
          ))}
        </div>
        <AnimatePresence>
          {canClose && (
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 260, damping: 14 }}>
              <GameButton
                className="pulse-soft size-28 rounded-full border-[5px] border-white bg-[#bbf7d0] shadow-[0_8px_0_rgba(74,59,63,0.18)]"
                onClick={onDone}
                aria-label="繼續玩"
              >
                <CheckIcon size={70} />
              </GameButton>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

export function RewardAnimation() {
  const { reward, finishReward, bursts, progress } = useGameProgress();
  return (
    <>
      <div className="pointer-events-none fixed inset-0 z-[60]">
        {bursts.map((b) => (
          <StarBurst key={b.id} {...b} />
        ))}
      </div>
      <AnimatePresence>
        {reward?.type === 'star' && <StarReward key={reward.id} onDone={finishReward} />}
        {reward?.type === 'celebrate' && <Celebration key={reward.id} stars={progress.stars} onDone={finishReward} />}
      </AnimatePresence>
    </>
  );
}
