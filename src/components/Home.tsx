import { motion } from 'motion/react';
import { useEffect } from 'react';
import { GAME_ORDER, GAMES } from '../games/registry';
import type { GameId } from '../games/types';
import { useReplay } from '../hooks/useReplay';
import { useMountGuard } from '../hooks/useMountGuard';
import { useSpeech } from '../hooks/useSpeech';
import { u } from '../lib/ui';
import { AnimalCharacter } from './AnimalCharacter';
import { CARD_BTN, GameButton } from './GameButton';

const TITLE = '動物數字樂園';

/** 首頁：標題＋四個大型遊戲入口，角落有會眨眼的動物 */
export function Home({ greeting, onOpen }: { greeting: string; onOpen: (id: GameId) => void }) {
  const say = useSpeech();
  const ready = useMountGuard();
  useEffect(() => {
    void say(greeting);
  }, [say, greeting]);
  useReplay(() => void say(greeting));

  return (
    <div className="relative flex size-full flex-col items-center justify-center" style={{ gap: u(4) }}>
      <h1 className="flex flex-wrap justify-center px-2 font-black text-[#4a3b3f]" style={{ fontSize: `clamp(36px, ${u(6.5)}, 88px)` }}>
        {[...TITLE].map((ch, i) => (
          <motion.span
            key={i}
            className="inline-block [text-shadow:0_5px_0_#fff,0_8px_0_rgba(74,59,63,0.15)]"
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 2.4, repeat: Infinity, delay: i * 0.15, ease: 'easeInOut' }}
          >
            {ch}
          </motion.span>
        ))}
      </h1>

      <div className="z-10 grid grid-cols-2 sm:flex sm:flex-wrap sm:justify-center" style={{ gap: u(3) }}>
        {GAME_ORDER.map((id, i) => {
          const g = GAMES[id];
          return (
            <motion.div
              key={id}
              initial={{ y: 80, opacity: 0, rotate: -6 }}
              animate={{ y: 0, opacity: 1, rotate: 0 }}
              transition={{ delay: 0.15 + i * 0.1, type: 'spring', stiffness: 200, damping: 15 }}
            >
              <GameButton
                className={`${CARD_BTN} flex-col gap-1 p-3`}
                style={{ width: `max(140px, ${u(21)})`, height: `max(150px, ${u(24)})`, background: g.color }}
                onClick={() => ready() && onOpen(id)}
                aria-label={g.title}
                sound="pop"
              >
                <div className="flex w-full flex-1 items-center justify-center">{g.icon}</div>
                <span className="rounded-full bg-white/85 px-3 py-1 font-black text-[#4a3b3f]" style={{ fontSize: `max(18px, ${u(2.3)})` }}>
                  {g.title}
                </span>
              </GameButton>
            </motion.div>
          );
        })}
      </div>

      {/* 角落探頭的動物 */}
      <div className="pointer-events-none absolute -bottom-2 left-[8%] max-sm:hidden">
        <AnimalCharacter species="dog" size={u(13)} />
      </div>
      <div className="pointer-events-none absolute -bottom-2 right-[6%] flex items-end max-sm:hidden">
        <AnimalCharacter species="cat" size={u(11)} />
        <AnimalCharacter species="chick" size={u(8)} />
      </div>
    </div>
  );
}
