import { motion } from 'motion/react';
import { useEffect, useState } from 'react';
import type { Species } from '../data/animals';
import { wait } from '../lib/random';
import { speech } from '../lib/speech';
import { AnimalCharacter } from './AnimalCharacter';
import { GameButton } from './GameButton';
import { PlayIcon } from './icons';

const TITLE = '動物數字樂園';
const TRIO: Species[] = ['dog', 'panda', 'rabbit'];

function Title() {
  return (
    <h1 className="flex flex-wrap justify-center font-black text-[#4a3b3f]" style={{ fontSize: 'clamp(40px, 8vmin, 84px)' }}>
      {[...TITLE].map((ch, i) => (
        <motion.span
          key={i}
          className="inline-block [text-shadow:0_5px_0_#fff,0_8px_0_rgba(74,59,63,0.15)]"
          initial={{ y: -40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: i * 0.08, type: 'spring', stiffness: 300, damping: 12 }}
        >
          {ch}
        </motion.span>
      ))}
    </h1>
  );
}

/**
 * 啟動流程：載入中（等語音清單）→ 大大的播放鍵
 * 第一次點擊播放鍵時解鎖瀏覽器的音訊與語音。
 */
export function LoadingScreen({ onStart }: { onStart: () => void }) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let alive = true;
    void Promise.all([speech.waitForVoices(), wait(1200), document.fonts?.ready]).then(() => alive && setReady(true));
    return () => {
      alive = false;
    };
  }, []);

  return (
    <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-[4vmin] p-6">
      <Title />
      <div className="flex items-end gap-[3vmin]">
        {TRIO.map((s, i) => (
          <AnimalCharacter key={s} species={s} size="clamp(90px, 18vmin, 200px)" anim={ready ? 'idle' : 'jump'} animKey={ready ? 0 : i} delay={i * 0.12} />
        ))}
      </div>
      <div className="flex h-36 items-center">
        {ready ? (
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 260, damping: 12 }}>
            <GameButton
              className="pulse-soft size-36 rounded-full border-[6px] border-white bg-[#ff9f43] shadow-[0_10px_0_rgba(74,59,63,0.2)]"
              onClick={onStart}
              aria-label="開始玩"
            >
              <PlayIcon size={88} />
            </GameButton>
          </motion.div>
        ) : (
          <div className="h-6 w-64 overflow-hidden rounded-full border-4 border-white bg-white/60" role="progressbar" aria-label="載入中">
            <motion.div className="h-full rounded-full bg-[#ffd93d]" initial={{ width: '5%' }} animate={{ width: '100%' }} transition={{ duration: 1.2 }} />
          </div>
        )}
      </div>
    </div>
  );
}
