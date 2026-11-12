import { motion } from 'motion/react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { AnimalCharacter } from '../../components/AnimalCharacter';
import { CARD_BTN, GameButton } from '../../components/GameButton';
import { EarIcon } from '../../components/icons';
import { ANIMALS, type AnimalId, type AnimalInfo } from '../../data/animals';
import { playAnimalSound } from '../../hooks/useAudio';
import { useFeedback, useShake } from '../../hooks/useFeedback';
import { useLevel } from '../../hooks/useLevel';
import { useReplay } from '../../hooks/useReplay';
import { useRound } from '../../hooks/useRound';
import { audio } from '../../lib/audio';
import { createDeck, sample, shuffle } from '../../lib/random';
import { u } from '../../lib/ui';

export const MODE_ID = 'animals-sound';
const QUESTION = '是哪一隻動物在叫呢？';

/** 模式 B：聽聲音找動物 */
export default function SoundQuiz() {
  const { animals } = useLevel();
  const { say, retry, completeTask, burstFrom, markLearned } = useFeedback();
  const { round, locked, setLocked, next, isCurrent } = useRound();
  const shaker = useShake();
  const [jump, setJump] = useState<AnimalId | null>(null);
  const [draw] = useState(createDeck<AnimalInfo>);
  /** 每次出題或作答就加一，讓還在進行中的「出題語音」知道自己已經過時 */
  const turn = useRef(0);

  const q = useMemo(() => {
    let pool = animals.filter((a) => a.hasCall);
    if (pool.length < 3) pool = ANIMALS.filter((a) => a.hasCall).slice(0, 3);
    const target = draw(pool);
    const options = shuffle([target, ...sample(pool.filter((a) => a.id !== target.id), 2)]);
    return { options, target };
  }, [round, animals]);

  const ask = async () => {
    const t = ++turn.current;
    await playAnimalSound(q.target);
    // 叫聲還沒播完小朋友就作答了：不要再念題目，以免蓋掉答對／答錯的回饋
    if (turn.current === t) await say(QUESTION);
  };

  useEffect(() => {
    setJump(null);
    void ask();
  }, [round]);

  useReplay(() => void ask());

  const choose = async (id: AnimalId) => {
    if (locked) return;
    turn.current += 1;
    const r = round;
    const a = q.options.find((o) => o.id === id)!;
    if (id === q.target.id) {
      setLocked(true);
      setJump(id);
      markLearned('animals', id);
      audio.play('correct');
      burstFrom(shaker.get(id));
      await say(`對了！是${a.name}！`);
      if (!isCurrent(r)) return;
      await playAnimalSound(a);
      await completeTask(MODE_ID);
      if (isCurrent(r)) next();
      return;
    }
    shaker.shake(id);
    await retry(`這是${a.name}喔！再聽一次！`);
    if (isCurrent(r)) await playAnimalSound(q.target);
  };

  return (
    <div className="flex size-full flex-col items-center justify-center" style={{ gap: u(4) }}>
      <GameButton
        className="pulse-soft size-32 rounded-full border-[5px] border-white bg-[#fde68a] shadow-[0_8px_0_rgba(74,59,63,0.18)]"
        onClick={() => void playAnimalSound(q.target)}
        aria-label="再聽一次叫聲"
        sound={null}
      >
        <EarIcon size={80} />
      </GameButton>

      <div className="flex flex-wrap justify-center" style={{ gap: u(3) }}>
        {q.options.map((a, i) => (
          <motion.div
            key={`${round}-${a.id}`}
            ref={shaker.register(a.id)}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: i * 0.12, type: 'spring', stiffness: 220, damping: 14 }}
          >
            <GameButton
              className={`${CARD_BTN} flex-col p-2`}
              style={{ width: `max(130px, ${u(22)})` }}
              onClick={() => void choose(a.id)}
              aria-label={a.name}
              sound="pop"
            >
              <AnimalCharacter species={a.id} size={`max(110px, ${u(19)})`} anim={jump === a.id ? 'jump' : 'idle'} animKey={jump === a.id ? 1 : 0} />
              <span className="text-2xl font-black text-[#4a3b3f]">{a.name}</span>
            </GameButton>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
