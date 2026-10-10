import { motion } from 'motion/react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { AnimalCharacter } from '../../components/AnimalCharacter';
import { CARD_BTN, GameButton } from '../../components/GameButton';
import { ShirtIcon } from '../../components/icons';
import { useFeedback, useShake } from '../../hooks/useFeedback';
import { useLevel } from '../../hooks/useLevel';
import { useReplay } from '../../hooks/useReplay';
import { useRound } from '../../hooks/useRound';
import { audio } from '../../lib/audio';
import { pick, sample, shuffle } from '../../lib/random';
import { u } from '../../lib/ui';
import { ColorLabel } from './ColorLabel';

export const MODE_ID = 'colors-dress';
const WHITE = '#ffffff';

/** 模式 C：幫動物穿上指定顏色的衣服 */
export default function DressUp() {
  const { colors, animals } = useLevel();
  const { say, success, retry, markLearned } = useFeedback();
  const { round, locked, setLocked, next, isCurrent } = useRound();
  const shaker = useShake();
  const animalRef = useRef<HTMLDivElement>(null);
  const [shirt, setShirt] = useState(WHITE);
  const [dance, setDance] = useState(0);

  const q = useMemo(() => {
    // 衣服一開始是白色，所以白色不當選項
    const pool = colors.filter((c) => c.id !== 'white');
    const target = pick(pool);
    const options = shuffle([target, ...sample(pool.filter((c) => c.id !== target.id), 2)]);
    return { animal: pick(animals), target, options };
  }, [round, colors, animals]);

  const prompt = `幫${q.animal.name}穿上${q.target.name}衣服！`;

  useEffect(() => {
    setShirt(WHITE);
    setDance(0);
    void say(prompt);
  }, [round]);

  useReplay(() => void say(prompt));

  const choose = async (id: string) => {
    if (locked) return;
    const r = round;
    const c = q.options.find((o) => o.id === id)!;
    if (c.id === q.target.id) {
      setLocked(true);
      markLearned('colors', c.id);
      audio.play('swish');
      setShirt(c.hex);
      setDance(1);
      await success(MODE_ID, animalRef.current, `哇！${q.animal.name}穿上${c.name}的衣服了！好漂亮！`, c.hex);
      if (isCurrent(r)) next();
      return;
    }
    shaker.shake(id);
    await retry(`這是${c.name}喔！我們要找${q.target.name}！`);
  };

  return (
    <div className="flex size-full flex-col items-center justify-center" style={{ gap: u(3) }}>
      <motion.div ref={animalRef} key={round} initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 200, damping: 14 }}>
        <AnimalCharacter
          species={q.animal.id}
          size={`max(180px, ${u(30)})`}
          shirt={shirt}
          anim={dance ? 'dance' : 'idle'}
          animKey={`${round}-${dance}`}
          wag={dance > 0}
        />
      </motion.div>

      <div className="flex flex-wrap justify-center" style={{ gap: u(4) }}>
        {q.options.map((c, i) => (
          <motion.div
            key={`${round}-${c.id}`}
            ref={shaker.register(c.id)}
            initial={{ y: 60, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 + i * 0.1 }}
          >
            <GameButton
              className={`${CARD_BTN} flex-col gap-1 p-3`}
              style={{ width: `max(110px, ${u(17)})`, height: `max(120px, ${u(19)})` }}
              onClick={() => void choose(c.id)}
              aria-label={c.name}
              sound="pop"
            >
              <ShirtIcon size="70%" color={c.hex} />
              <ColorLabel color={c} />
            </GameButton>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
