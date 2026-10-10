import { motion } from 'motion/react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { AnimalCharacter } from '../../components/AnimalCharacter';
import { CARD_BTN, GameButton } from '../../components/GameButton';
import { HabitatArt } from '../../components/HabitatArt';
import { HABITATS, type AnimalInfo, type HabitatId } from '../../data/animals';
import { useFeedback, useShake } from '../../hooks/useFeedback';
import { useLevel } from '../../hooks/useLevel';
import { useReplay } from '../../hooks/useReplay';
import { useRound } from '../../hooks/useRound';
import { audio } from '../../lib/audio';
import { createDeck, sample, shuffle } from '../../lib/random';
import { u } from '../../lib/ui';

export const MODE_ID = 'animals-home';
const ALL_HABITATS = Object.keys(HABITATS) as HabitatId[];

/** 模式 C：動物找朋友 —— 幫動物找到牠的家，答對後動物走進去 */
export default function AnimalHome() {
  const { animals } = useLevel();
  const { say, success, retry, markLearned } = useFeedback();
  const { round, locked, setLocked, next, isCurrent } = useRound();
  const shaker = useShake();
  const animalRef = useRef<HTMLDivElement>(null);
  const [move, setMove] = useState<{ x: number; y: number; habitat: HabitatId } | null>(null);
  const [draw] = useState(createDeck<AnimalInfo>);

  const q = useMemo(() => {
    const animal = draw(animals);
    const options = shuffle([animal.habitat, ...sample(ALL_HABITATS.filter((h) => h !== animal.habitat), 2)]);
    return { animal, options };
  }, [round, animals]);

  const prompt = q.animal.habitatQuestion;

  useEffect(() => {
    setMove(null);
    void say(prompt);
  }, [round]);

  useReplay(() => void say(prompt));

  const choose = async (h: HabitatId) => {
    if (locked) return;
    const r = round;
    if (h === q.animal.habitat) {
      setLocked(true);
      markLearned('animals', q.animal.id);
      const from = animalRef.current?.getBoundingClientRect();
      const to = shaker.get(h)?.getBoundingClientRect();
      if (from && to) {
        setMove({
          x: to.left + to.width / 2 - (from.left + from.width / 2),
          y: to.top + to.height * 0.45 - (from.top + from.height / 2),
          habitat: h,
        });
      }
      audio.play(h === 'pond' ? 'splash' : 'boing');
      await success(MODE_ID, shaker.get(h), q.animal.habitatPraise);
      if (isCurrent(r)) next();
      return;
    }
    shaker.shake(h);
    await retry(`這是${HABITATS[h].name}喔！再想想看！`);
  };

  return (
    <div className="flex size-full flex-col items-center justify-center" style={{ gap: u(4) }}>
      <motion.div
        ref={animalRef}
        key={round}
        className="relative z-10"
        initial={{ scale: 0, y: -40 }}
        animate={move ? { x: move.x, y: move.y, scale: 0.55 } : { x: 0, y: 0, scale: 1 }}
        transition={move ? { duration: 1.1, ease: 'easeInOut' } : { type: 'spring', stiffness: 200, damping: 14 }}
      >
        <AnimalCharacter
          species={q.animal.id}
          size={`max(170px, ${u(26)})`}
          anim={move ? (move.habitat === 'pond' ? 'swim' : 'happy') : 'idle'}
          animKey={move ? 1 : 0}
          delay={move ? 1 : 0}
          wag={!!move}
        />
      </motion.div>

      <div className="flex flex-wrap justify-center" style={{ gap: u(3) }}>
        {q.options.map((h, i) => (
          <motion.div
            key={`${round}-${h}`}
            ref={shaker.register(h)}
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 + i * 0.1 }}
          >
            <GameButton
              className={`${CARD_BTN} flex-col gap-1 overflow-hidden p-2`}
              style={{ width: `max(140px, ${u(24)})` }}
              onClick={() => void choose(h)}
              aria-label={HABITATS[h].name}
              sound="pop"
            >
              <HabitatArt id={h} />
              <span className="text-2xl font-black text-[#4a3b3f]">{HABITATS[h].name}</span>
            </GameButton>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
