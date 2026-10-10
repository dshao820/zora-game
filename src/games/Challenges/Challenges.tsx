import { motion } from 'motion/react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { AnimalCharacter } from '../../components/AnimalCharacter';
import { CARD_BTN, GameButton } from '../../components/GameButton';
import { PRAISE } from '../../data/phrases';
import { useFeedback, useShake } from '../../hooks/useFeedback';
import { useLevel } from '../../hooks/useLevel';
import { useReplay } from '../../hooks/useReplay';
import { useRound } from '../../hooks/useRound';
import { pick } from '../../lib/random';
import { u } from '../../lib/ui';
import { makeChallenge, type Challenge } from './generators';

export const MODE_ID = 'challenges';

/**
 * 小小挑戰：數字＋顏色＋動物綜合題。
 * 沒有時間限制、不扣分、可無限重試；每 5 題得到一顆星星（共用獎勵系統）。
 */
export default function Challenges() {
  const level = useLevel();
  const { say, success, retry } = useFeedback();
  const { round, locked, setLocked, next, isCurrent } = useRound();
  const shaker = useShake();
  const prevKind = useRef<Challenge['kind'] | undefined>(undefined);
  const [winner, setWinner] = useState<string | null>(null);

  const q = useMemo(() => {
    const c = makeChallenge(level, prevKind.current);
    prevKind.current = c.kind;
    return c;
  }, [round, level]);

  useEffect(() => {
    setWinner(null);
    void say(q.prompt);
  }, [round]);

  useReplay(() => void say(q.prompt));

  const choose = async (key: string) => {
    if (locked) return;
    const r = round;
    const o = q.options.find((x) => x.key === key)!;
    if (key === q.answer) {
      setLocked(true);
      setWinner(key);
      await success(MODE_ID, shaker.get(key), `${pick(PRAISE)}就是${o.describe}！`, o.color?.hex);
      if (isCurrent(r)) next();
      return;
    }
    shaker.shake(key);
    await retry(`這是${o.describe}喔！再試試看！`);
  };

  const single = q.kind === 'colorAnimal';

  return (
    <div className="flex size-full items-center justify-center px-3" style={{ gap: u(3) }}>
      {q.options.map((o, i) => {
        const size = single ? `max(120px, ${u(22)})` : `max(56px, ${u(o.count <= 1 ? 16 : o.count <= 2 ? 12 : o.count <= 3 ? 10 : 8)})`;
        return (
          <motion.div
            key={`${round}-${o.key}`}
            ref={shaker.register(o.key)}
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: i * 0.12, type: 'spring', stiffness: 200, damping: 16 }}
          >
            <GameButton
              className={`${CARD_BTN} p-3 ${winner === o.key ? 'border-[#86efac]! bg-[#dcfce7]!' : ''}`}
              style={{ width: `max(110px, ${u(single ? 24 : 26)})`, minHeight: `max(150px, ${u(single ? 26 : 30)})` }}
              onClick={() => void choose(o.key)}
              aria-label={o.describe}
              sound="pop"
            >
              <div className="flex flex-wrap items-center justify-center" style={{ gap: u(0.6) }}>
                {Array.from({ length: o.count }, (_, k) => (
                  <AnimalCharacter
                    key={k}
                    species={o.species}
                    color={o.color?.hex}
                    size={size}
                    anim={winner === o.key ? 'dance' : 'idle'}
                    animKey={winner === o.key ? 1 : 0}
                    delay={k * 0.08}
                  />
                ))}
              </div>
            </GameButton>
          </motion.div>
        );
      })}
    </div>
  );
}
