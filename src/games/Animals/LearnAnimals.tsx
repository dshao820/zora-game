import { motion } from 'motion/react';
import { useEffect, useState } from 'react';
import { AnimalCharacter } from '../../components/AnimalCharacter';
import { NextButton } from '../../components/NextButton';
import { playAnimalSound } from '../../hooks/useAudio';
import { useFeedback } from '../../hooks/useFeedback';
import { useLevel } from '../../hooks/useLevel';
import { useReplay } from '../../hooks/useReplay';
import { useRound } from '../../hooks/useRound';
import { audio } from '../../lib/audio';
import { u } from '../../lib/ui';

export const MODE_ID = 'animals-learn';

/** 模式 A：認識動物 —— 說出名字、播放叫聲，點一下動物會開心搖尾巴 */
export default function LearnAnimals() {
  const { animals } = useLevel();
  const { say, completeTask, markLearned } = useFeedback();
  const { round, next, isCurrent } = useRound();
  const animal = animals[round % animals.length];
  const [ready, setReady] = useState(false);
  const [bump, setBump] = useState(0);
  const [wag, setWag] = useState(false);

  const introduce = async (r: number) => {
    await say(`這是${animal.name}！`);
    if (!isCurrent(r)) return;
    setBump((b) => b + 1);
    await playAnimalSound(animal);
    if (isCurrent(r)) setReady(true);
  };

  useEffect(() => {
    setReady(false);
    setBump(0);
    markLearned('animals', animal.id);
    void introduce(round);
  }, [round]);

  useReplay(() => void introduce(round));

  useEffect(() => {
    if (!wag) return;
    const t = window.setTimeout(() => setWag(false), 1500);
    return () => window.clearTimeout(t);
  }, [wag, bump]);

  const tap = () => {
    audio.play('boing');
    setBump((b) => b + 1);
    setWag(true);
    void playAnimalSound(animal);
  };

  const goNext = async () => {
    setReady(false);
    await completeTask(MODE_ID);
    next();
  };

  return (
    <div className="flex size-full flex-col items-center justify-center" style={{ gap: u(2) }}>
      <motion.button
        key={round}
        type="button"
        onClick={tap}
        aria-label={animal.name}
        initial={{ x: '-70vw', rotate: -20 }}
        animate={{ x: 0, rotate: 0 }}
        transition={{ type: 'spring', stiffness: 90, damping: 13 }}
      >
        <AnimalCharacter
          species={animal.id}
          size={`max(220px, ${u(36)})`}
          anim={bump === 0 ? 'idle' : bump % 3 === 0 ? 'spin' : 'happy'}
          animKey={bump}
          wag={wag}
        />
      </motion.button>
      <span className="rounded-full bg-white/90 px-6 py-2 text-4xl font-black text-[#4a3b3f] shadow">{animal.name}</span>
      <NextButton show={ready} onClick={goNext} />
    </div>
  );
}
