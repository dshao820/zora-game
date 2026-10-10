import { motion } from 'motion/react';
import { useEffect } from 'react';
import type { GameDef } from '../games/types';
import { useReplay } from '../hooks/useReplay';
import { useMountGuard } from '../hooks/useMountGuard';
import { useSpeech } from '../hooks/useSpeech';
import { u } from '../lib/ui';
import { CARD_BTN, GameButton } from './GameButton';

/** 每個遊戲的模式選單：三個大按鈕 */
export function ModePicker({ game, onPick }: { game: GameDef; onPick: (modeId: string) => void }) {
  const say = useSpeech();
  const ready = useMountGuard();
  const intro = `${game.title}！你想玩哪一個呢？`;
  useEffect(() => {
    void say(intro);
  }, [say, intro]);
  useReplay(() => void say(intro));

  return (
    <div className="flex size-full flex-col items-center justify-center gap-[3vmin] px-4">
      <div className="flex flex-wrap items-stretch justify-center" style={{ gap: u(3) }}>
        {game.modes.map((m, i) => (
          <motion.div key={m.id} initial={{ y: 60, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: i * 0.1, type: 'spring', stiffness: 220, damping: 18 }}>
            <GameButton
              className={`${CARD_BTN} flex-col gap-2 p-3`}
              style={{ width: `max(150px, ${u(24)})`, height: `max(170px, ${u(28)})`, background: m.color }}
              onClick={() => ready() && onPick(m.id)}
              aria-label={m.label}
            >
              <div className="flex flex-1 items-center justify-center">{m.icon}</div>
              <span className="rounded-full bg-white/80 px-4 py-1 font-black text-[#4a3b3f]" style={{ fontSize: `max(18px, ${u(2.4)})` }}>
                {m.label}
              </span>
            </GameButton>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
