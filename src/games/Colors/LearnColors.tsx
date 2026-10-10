import { motion, useAnimationControls } from 'motion/react';
import { useEffect, useRef, useState } from 'react';
import { Balloon } from '../../components/Balloon';
import { NextButton } from '../../components/NextButton';
import { useFeedback } from '../../hooks/useFeedback';
import { useLevel } from '../../hooks/useLevel';
import { useReplay } from '../../hooks/useReplay';
import { useRound } from '../../hooks/useRound';
import { audio } from '../../lib/audio';
import { u } from '../../lib/ui';
import { ColorLabel } from './ColorLabel';

export const MODE_ID = 'colors-learn';

/** 模式 A：認識顏色 —— 大氣球漂浮，點一下會彈跳並噴出同色星星 */
export default function LearnColors() {
  const { colors } = useLevel();
  const { say, completeTask, markLearned, burstFrom } = useFeedback();
  const { round, next } = useRound();
  const color = colors[round % colors.length];
  const sentence = `這是${color.name}！`;
  const [tapped, setTapped] = useState(false);
  const ref = useRef<HTMLButtonElement>(null);
  const controls = useAnimationControls();

  useEffect(() => {
    setTapped(false);
    markLearned('colors', color.id);
    void say(sentence);
  }, [round]);

  useReplay(() => void say(sentence));

  const tap = () => {
    audio.play('boing');
    burstFrom(ref.current, color.hex);
    void controls.start({ scale: [1, 1.25, 0.9, 1.08, 1], rotate: [0, -8, 8, 0], transition: { duration: 0.7 } });
    void say(sentence);
    setTapped(true);
  };

  const goNext = async () => {
    setTapped(false);
    await completeTask(MODE_ID);
    next();
  };

  return (
    <div className="flex size-full flex-col items-center justify-center" style={{ gap: u(2) }}>
      <motion.div key={round} initial={{ y: '60vh' }} animate={{ y: 0 }} transition={{ type: 'spring', stiffness: 80, damping: 14 }}>
        <div className="float">
          <motion.button ref={ref} type="button" animate={controls} onClick={tap} aria-label={color.name} className="block">
            <Balloon color={color.hex} size={`max(160px, ${u(26)})`} />
          </motion.button>
        </div>
      </motion.div>
      <ColorLabel color={color} big />
      <NextButton show={tapped} onClick={goNext} />
    </div>
  );
}
