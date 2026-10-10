import { motion } from 'motion/react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { AnimalCharacter } from '../../components/AnimalCharacter';
import { GameButton } from '../../components/GameButton';
import { NumberTile } from '../../components/NumberTile';
import { NUMBER_TINTS, numberWord, quantityWord } from '../../data/numbers';
import { PRAISE } from '../../data/phrases';
import { useFeedback, useShake } from '../../hooks/useFeedback';
import { useLevel } from '../../hooks/useLevel';
import { useReplay } from '../../hooks/useReplay';
import { useRound } from '../../hooks/useRound';
import { audio } from '../../lib/audio';
import { pick, sample } from '../../lib/random';
import { crowdSize, u } from '../../lib/ui';

export const MODE_ID = 'numbers-count';

/** 模式 B：數數看 —— 看動物，選出正確數量 */
export default function CountQuiz() {
  const { numbers, animals } = useLevel();
  const { say, success, retry, markLearned } = useFeedback();
  const { round, locked, setLocked, next, isCurrent } = useRound();
  const shaker = useShake();
  const wrongCount = useRef(0);
  const [dance, setDance] = useState(0);
  /** 一起數的時候，目前數到第幾隻 */
  const [pointer, setPointer] = useState(-1);

  const q = useMemo(() => {
    const n = pick(numbers);
    const animal = pick(animals);
    const options = [n, ...sample(numbers.filter((x) => x !== n), 2)].sort((a, b) => a - b);
    return { n, animal, options };
  }, [round, numbers, animals]);

  const prompt = `數數看，有幾隻${q.animal.name}？`;

  useEffect(() => {
    wrongCount.current = 0;
    setPointer(-1);
    setDance(0);
    void say(prompt);
  }, [round]);

  useReplay(() => void say(prompt));

  /** 答錯兩次後，帶著小朋友一隻一隻數 */
  const countTogether = async (r: number) => {
    setLocked(true);
    await say('我們一起數一數！');
    for (let i = 0; i < q.n; i++) {
      if (!isCurrent(r)) return;
      setPointer(i);
      audio.play('pop');
      await say(numberWord(i + 1));
    }
    if (!isCurrent(r)) return;
    setPointer(-1);
    setLocked(false);
    await say(`有幾隻${q.animal.name}呢？`);
  };

  const choose = async (v: number) => {
    if (locked) return;
    const r = round;
    if (v === q.n) {
      setLocked(true);
      setDance((d) => d + 1);
      markLearned('numbers', v);
      await success(MODE_ID, shaker.get(v), `${pick(PRAISE)}有${quantityWord(q.n)}隻${q.animal.name}！`, NUMBER_TINTS[v]);
      if (isCurrent(r)) next();
      return;
    }
    shaker.shake(v);
    wrongCount.current += 1;
    await retry();
    if (wrongCount.current >= 2 && isCurrent(r)) await countTogether(r);
  };

  const size = crowdSize(q.n, 15);

  return (
    <div className="flex size-full flex-col items-center justify-center" style={{ gap: u(4) }}>
      <div
        className="flex min-h-[30%] max-w-[95vw] flex-wrap items-end justify-center rounded-[2.5rem] bg-white/50 px-6 py-4"
        style={{ gap: u(1.5) }}
      >
        {Array.from({ length: q.n }, (_, i) => (
          <div key={`${round}-${i}`} className="relative flex flex-col items-center">
            {pointer === i && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-3 z-10 flex size-12 items-center justify-center rounded-full border-4 border-white bg-[#ff9f43] text-2xl font-black text-white"
              >
                {i + 1}
              </motion.span>
            )}
            <AnimalCharacter
              species={q.animal.id}
              size={size}
              anim={dance ? 'dance' : pointer === i ? 'jump' : 'idle'}
              animKey={dance ? `${round}-d${dance}` : `${round}-${pointer === i}`}
              delay={dance ? i * 0.08 : 0}
            />
          </div>
        ))}
      </div>

      <div className="flex flex-wrap justify-center" style={{ gap: u(4) }}>
        {q.options.map((v, i) => (
          <motion.div
            key={`${round}-${v}`}
            ref={shaker.register(v)}
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 + i * 0.1 }}
          >
            <GameButton className="rounded-[28%] p-0" onClick={() => void choose(v)} aria-label={`${v}`} sound="pop">
              <NumberTile n={v} size={`max(110px, ${u(17)})`} />
            </GameButton>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
