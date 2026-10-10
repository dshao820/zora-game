import { motion } from 'motion/react';
import { TASKS_PER_STAR, useGameProgress } from '../hooks/useGameProgress';
import { StarIcon } from './icons';

/** 上方中央：星星數量＋距離下一顆星星的進度點 */
export function StarBar() {
  const { progress } = useGameProgress();
  return (
    <div
      className="flex items-center gap-2 rounded-full bg-white/85 px-4 py-2 shadow-[0_5px_0_rgba(74,59,63,0.12)]"
      aria-label={`${progress.stars} 顆星星`}
    >
      <motion.div
        id="star-target"
        key={progress.stars}
        initial={{ scale: 1 }}
        animate={{ scale: [1, 1.5, 1], rotate: [0, 20, 0] }}
        transition={{ duration: 0.6 }}
        className="flex"
      >
        <StarIcon size={44} />
      </motion.div>
      <span className="min-w-[1.5ch] text-3xl font-black tabular-nums text-[#4a3b3f]">{progress.stars}</span>
      <div className="ml-1 flex gap-1.5" aria-hidden>
        {Array.from({ length: TASKS_PER_STAR }, (_, i) => (
          <motion.span
            key={i}
            animate={{ scale: i < progress.taskProgress ? 1 : 0.75 }}
            className={`block size-3.5 rounded-full border-[3px] border-[#4a3b3f] ${
              i < progress.taskProgress ? 'bg-[#ffd93d]' : 'bg-white'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
