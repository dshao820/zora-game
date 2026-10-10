import { AnimatePresence, motion } from 'motion/react';
import { useSpeechState } from '../hooks/useSpeech';

/** 裝置沒有中文語音（或家長關閉語音）時，用字幕顯示語音內容 */
export function Caption() {
  const { caption, fallback } = useSpeechState();
  const show = fallback && caption;
  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-4 z-40 flex justify-center px-4" style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
      <AnimatePresence>
        {show && (
          <motion.div
            key={caption}
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10 }}
            className="rounded-3xl border-4 border-[#4a3b3f] bg-white px-6 py-3 text-2xl font-bold text-[#4a3b3f] shadow-lg sm:text-3xl"
            role="status"
          >
            {caption}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
