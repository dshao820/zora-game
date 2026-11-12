import { motion } from 'motion/react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { AnimalCharacter } from '../../components/AnimalCharacter';
import { CARD_BTN, GameButton } from '../../components/GameButton';
import { QuestionIcon } from '../../components/icons';
import type { AnimalId, AnimalInfo } from '../../data/animals';
import type { Difficulty } from '../../data/difficulty';
import { useFeedback, useShake } from '../../hooks/useFeedback';
import { useLevel } from '../../hooks/useLevel';
import { useReplay } from '../../hooks/useReplay';
import { useRound } from '../../hooks/useRound';
import { audio } from '../../lib/audio';
import { sample, shuffle, wait } from '../../lib/random';
import { u } from '../../lib/ui';

export const MODE_ID = 'challenges-memory';
const PROMPT = '翻開卡片，找到兩隻一樣的動物！';

/** 依難度決定幾組配對、卡片大小與排列（直向／橫向都排得下） */
const BOARDS: Record<Difficulty, { pairs: number; size: number; cols: string }> = {
  beginner: { pairs: 3, size: 20, cols: 'grid-cols-2 landscape:grid-cols-3' },
  intermediate: { pairs: 4, size: 16, cols: 'grid-cols-2 landscape:grid-cols-4' },
  advanced: { pairs: 6, size: 13, cols: 'grid-cols-3 landscape:grid-cols-6' },
};

interface Card {
  key: number;
  animal: AnimalInfo;
}

/**
 * 翻翻樂：翻開兩張卡片，找到一樣的動物。
 * 翻錯不扣分，卡片會自己蓋回去；全部找到算完成一題。
 */
export default function MemoryMatch() {
  const { animals, difficulty } = useLevel();
  const { say, success, markLearned, burstFrom } = useFeedback();
  const { round, locked, setLocked, next, isCurrent } = useRound();
  const shaker = useShake();
  const board = BOARDS[difficulty];
  /** 目前翻開、還沒配對成功的卡片（最多兩張） */
  const [open, setOpen] = useState<number[]>([]);
  const [matched, setMatched] = useState<AnimalId[]>([]);
  /** 兩張不一樣的卡片還沒蓋回去之前，先不能翻別張 */
  const busy = useRef(false);

  const cards = useMemo<Card[]>(
    () => shuffle(sample(animals, board.pairs).flatMap((a) => [a, a])).map((animal, key) => ({ key, animal })),
    [round, animals, board],
  );

  useEffect(() => {
    setOpen([]);
    setMatched([]);
    busy.current = false;
    void say(PROMPT);
  }, [round]);

  useReplay(() => void say(PROMPT));

  const flip = async (card: Card) => {
    if (locked || busy.current || open.includes(card.key) || matched.includes(card.animal.id)) return;
    const r = round;
    const { id, name } = card.animal;
    audio.play('pop');

    if (open.length === 0) {
      setOpen([card.key]);
      void say(`${name}！`);
      return;
    }

    const first = cards[open[0]];
    if (first.animal.id === id) {
      const found = [...matched, id];
      setOpen([]);
      setMatched(found);
      markLearned('animals', id);
      burstFrom(shaker.get(first.key));
      burstFrom(shaker.get(card.key));
      if (found.length < board.pairs) {
        audio.play('correct');
        await say(`找到了！兩隻${name}！`);
        return;
      }
      setLocked(true);
      await success(MODE_ID, null, '全部找到了！你好棒！');
      if (isCurrent(r)) next();
      return;
    }

    // 不一樣：讓小朋友看清楚兩張卡片，再一起蓋回去
    busy.current = true;
    setOpen([first.key, card.key]);
    await Promise.all([say(`${name}！`), wait(1100)]);
    if (!isCurrent(r)) return;
    audio.play('swish');
    setOpen([]);
    busy.current = false;
  };

  const size = `max(76px, ${u(board.size)})`;

  return (
    <div className="flex size-full items-center justify-center px-3">
      <div className={`grid ${board.cols}`} style={{ gap: u(2) }}>
        {cards.map((card) => {
          const done = matched.includes(card.animal.id);
          const faceUp = done || open.includes(card.key);
          return (
            <motion.div
              key={`${round}-${card.key}`}
              ref={shaker.register(card.key)}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: card.key * 0.05, type: 'spring', stiffness: 240, damping: 16 }}
            >
              <GameButton
                className={`${CARD_BTN} p-0 ${done ? 'border-[#86efac]! bg-[#dcfce7]!' : faceUp ? '' : 'bg-[#bfdbfe]!'}`}
                style={{ width: size, height: size }}
                onClick={() => void flip(card)}
                aria-label={faceUp ? card.animal.name : '蓋著的卡片'}
                sound={null}
              >
                <motion.div
                  key={faceUp ? 'front' : 'back'}
                  className="flex size-full items-center justify-center"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 0.18 }}
                >
                  {faceUp ? (
                    <AnimalCharacter
                      species={card.animal.id}
                      size={`calc(${size} * 0.8)`}
                      anim={done ? 'dance' : 'none'}
                      animKey={done ? 1 : 0}
                    />
                  ) : (
                    <QuestionIcon size="55%" />
                  )}
                </motion.div>
              </GameButton>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
