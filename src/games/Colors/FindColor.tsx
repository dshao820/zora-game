import { motion } from 'motion/react';
import { useEffect, useMemo, useState } from 'react';
import { Balloon } from '../../components/Balloon';
import { useFeedback, useShake } from '../../hooks/useFeedback';
import { useLevel } from '../../hooks/useLevel';
import { useReplay } from '../../hooks/useReplay';
import { useRound } from '../../hooks/useRound';
import { audio } from '../../lib/audio';
import { pick, sample } from '../../lib/random';
import { u } from '../../lib/ui';
import { ColorLabel } from './ColorLabel';

export const MODE_ID = 'colors-find';

/** 模式 B：找出指定顏色的氣球，答對氣球飛上天 */
export default function FindColor() {
  const { colors } = useLevel();
  const { say, success, retry, markLearned } = useFeedback();
  const { round, locked, setLocked, next, isCurrent } = useRound();
  const shaker = useShake();
  const [flying, setFlying] = useState<string | null>(null);

  const q = useMemo(() => {
    const options = sample(colors, 3);
    return { options, target: pick(options) };
  }, [round, colors]);

  const prompt = `請找到${q.target.name}的氣球！`;

  useEffect(() => {
    setFlying(null);
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
      audio.play('whoosh');
      const el = shaker.get(id);
      setFlying(id);
      audio.play('cheer');
      await success(MODE_ID, el, `答對了！這是${c.name}的氣球！`, c.hex);
      if (isCurrent(r)) next();
      return;
    }
    shaker.shake(id);
    await retry(`這是${c.name}喔！請找到${q.target.name}的氣球！`);
  };

  return (
    <div className="flex size-full items-center justify-center pb-[4vh]" style={{ gap: u(6) }}>
      {q.options.map((c, i) => (
        <div key={`${round}-${c.id}`} ref={shaker.register(c.id)} className="flex flex-col items-center gap-3">
          <motion.div
            initial={{ y: '70vh' }}
            animate={flying === c.id ? { y: '-120vh', rotate: [0, -6, 6, 0] } : { y: 0 }}
            transition={flying === c.id ? { duration: 2.2, ease: 'easeIn' } : { delay: i * 0.15, type: 'spring', stiffness: 70, damping: 13 }}
          >
            <div className="float" style={{ animationDelay: `${-i * 0.9}s` }}>
              <motion.button
                type="button"
                className="block"
                whileTap={{ scale: 0.92 }}
                onClick={() => {
                  audio.play('pop');
                  void choose(c.id);
                }}
                aria-label={c.name}
              >
                <Balloon color={c.hex} size={`max(110px, ${u(18)})`} />
              </motion.button>
            </div>
          </motion.div>
          <motion.div animate={{ opacity: flying === c.id ? 0 : 1 }}>
            <ColorLabel color={c} />
          </motion.div>
        </div>
      ))}
    </div>
  );
}
