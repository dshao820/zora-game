import { AnimatePresence, motion } from 'motion/react';
import { GameButton } from './GameButton';
import { NextIcon } from './icons';

/** 學習模式的「下一個」大按鈕，出現時輕輕跳動吸引注意 */
export function NextButton({ show, onClick }: { show: boolean; onClick: () => void }) {
  return (
    <div className="absolute bottom-[max(20px,env(safe-area-inset-bottom))] right-5 z-10">
      <AnimatePresence>
        {show && (
          <motion.div
            initial={{ scale: 0, rotate: -30 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 15 }}
          >
            <GameButton
              className="pulse-soft size-28 rounded-full border-[5px] border-white bg-[#bbf7d0] shadow-[0_8px_0_rgba(74,59,63,0.18)]"
              onClick={onClick}
              aria-label="下一個"
            >
              <NextIcon size={72} />
            </GameButton>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
