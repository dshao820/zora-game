import { AnimatePresence, motion } from 'motion/react';
import { useEffect, useRef, useState } from 'react';
import { AnimalCharacter } from '../../components/AnimalCharacter';
import { NextButton } from '../../components/NextButton';
import { NumberTile } from '../../components/NumberTile';
import { NUMBER_TINTS, numberWord, quantityWord } from '../../data/numbers';
import { useFeedback } from '../../hooks/useFeedback';
import { useLevel } from '../../hooks/useLevel';
import { useReplay } from '../../hooks/useReplay';
import { useRound } from '../../hooks/useRound';
import { audio } from '../../lib/audio';
import { crowdSize, u } from '../../lib/ui';

export const MODE_ID = 'numbers-learn';

/** 模式 A：認識數字 —— 大數字＋對應數量的動物，點動物一起數 */
export default function LearnNumbers() {
  const { numbers, animals } = useLevel();
  const { say, completeTask, markLearned, burstFrom } = useFeedback();
  const { round, next, isCurrent } = useRound();
  const n = numbers[round % numbers.length];
  const animal = animals[round % animals.length];
  const sentence = `${numberWord(n)}！這裡有${quantityWord(n)}隻${animal.name}！`;

  /** 依點擊順序記錄被數到的動物 */
  const [counted, setCounted] = useState<number[]>([]);
  const [bumps, setBumps] = useState<number[]>([]);
  const [done, setDone] = useState(false);
  const tileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setCounted([]);
    setBumps(Array(n).fill(0));
    setDone(false);
    markLearned('numbers', n);
    void say(sentence);
  }, [round]);

  useReplay(() => void say(sentence));

  const tapAnimal = (i: number) => {
    audio.play('boing');
    setBumps((b) => b.map((v, j) => (j === i ? v + 1 : v)));
    const pos = counted.indexOf(i);
    if (pos !== -1) {
      void say(numberWord(pos + 1));
      return;
    }
    const list = [...counted, i];
    setCounted(list);
    if (list.length < n) {
      void say(numberWord(list.length));
      return;
    }
    const r = round;
    void (async () => {
      await say(numberWord(n));
      if (!isCurrent(r)) return;
      audio.play('sparkle');
      burstFrom(tileRef.current, NUMBER_TINTS[n]);
      await say(`${numberWord(n)}！你好棒！`);
      if (isCurrent(r)) setDone(true);
    })();
  };

  const goNext = async () => {
    setDone(false);
    await completeTask(MODE_ID);
    next();
  };

  const size = crowdSize(n, 17);

  return (
    <div className="flex size-full flex-col items-center justify-center" style={{ gap: u(3) }}>
      <motion.div
        ref={tileRef}
        key={`tile-${round}`}
        initial={{ scale: 0, rotate: -20 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: 'spring', stiffness: 200, damping: 12 }}
      >
        <NumberTile n={n} size={`max(150px, ${u(22)})`} />
      </motion.div>

      <div className="flex max-w-[95vw] flex-wrap items-end justify-center" style={{ gap: u(1.5), rowGap: u(4) }}>
        {Array.from({ length: n }, (_, i) => {
          const pos = counted.indexOf(i);
          const bump = bumps[i] ?? 0;
          return (
            <button
              key={`${round}-${i}`}
              type="button"
              className="relative flex flex-col items-center"
              onClick={() => tapAnimal(i)}
              aria-label={`${animal.name} ${i + 1}`}
            >
              <AnimatePresence>
                {pos !== -1 && (
                  <motion.span
                    initial={{ scale: 0, y: 10 }}
                    animate={{ scale: 1, y: 0 }}
                    className="absolute -top-2 z-10 flex size-12 items-center justify-center rounded-full border-4 border-white bg-[#ff9f43] text-2xl font-black text-white shadow"
                  >
                    {pos + 1}
                  </motion.span>
                )}
              </AnimatePresence>
              <AnimalCharacter
                species={animal.id}
                size={size}
                anim={done ? 'dance' : 'jump'}
                animKey={done ? `done-${i}` : `${round}-${bump}`}
                delay={done ? i * 0.08 : bump === 0 ? 0.5 + i * 0.3 : 0}
              />
            </button>
          );
        })}
      </div>

      <NextButton show={done} onClick={goNext} />
    </div>
  );
}
