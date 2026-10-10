import { AnimatePresence, motion } from 'motion/react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { AnimalCharacter } from '../../components/AnimalCharacter';
import { NumberTile } from '../../components/NumberTile';
import { NUMBER_TINTS, numberWord, quantityWord } from '../../data/numbers';
import { useFeedback, useShake } from '../../hooks/useFeedback';
import { useLevel } from '../../hooks/useLevel';
import { useReplay } from '../../hooks/useReplay';
import { useRound } from '../../hooks/useRound';
import { audio } from '../../lib/audio';
import { sample, shuffle } from '../../lib/random';
import { u } from '../../lib/ui';

export const MODE_ID = 'numbers-match';
const PROMPT = '把數字拖到一樣多的動物那裡！也可以先點數字，再點動物喔！';
/** 拖曳吸附範圍：放在群組附近就算數，不需要精準 */
const SNAP_PADDING = 60;

/** 模式 C：數字配對 —— 拖曳（或點擊）數字到數量相同的動物群組 */
export default function NumberMatch() {
  const { numbers, animals } = useLevel();
  const { say, success, retry, markLearned, burstFrom } = useFeedback();
  const { round, locked, setLocked, next, isCurrent } = useRound();
  const shaker = useShake();
  const groupRefs = useRef(new Map<number, HTMLDivElement>());
  /** 拖曳結束時 motion 仍可能觸發 onTap，用時間戳記忽略 */
  const lastDragAt = useRef(0);

  const puzzle = useMemo(() => {
    const nums = sample(numbers, 3).sort((a, b) => a - b);
    const species = sample(animals, 3);
    const groups = shuffle(nums).map((n, i) => ({ n, animal: species[i] }));
    return { nums, groups };
  }, [round, numbers, animals]);

  const [matched, setMatched] = useState<number[]>([]);
  const [selected, setSelected] = useState<number | null>(null);
  const [hover, setHover] = useState<number | null>(null);
  const [dance, setDance] = useState<Record<number, number>>({});

  useEffect(() => {
    setMatched([]);
    setSelected(null);
    setHover(null);
    setDance({});
    void say(PROMPT);
  }, [round]);

  useReplay(() => void say(PROMPT));

  const groupAt = (x: number, y: number) => {
    for (const [n, el] of groupRefs.current) {
      const r = el.getBoundingClientRect();
      if (x >= r.left - SNAP_PADDING && x <= r.right + SNAP_PADDING && y >= r.top - SNAP_PADDING && y <= r.bottom + SNAP_PADDING) return n;
    }
    return null;
  };

  const attempt = async (num: number, groupN: number) => {
    if (locked || matched.includes(groupN)) return;
    setSelected(null);
    setHover(null);
    const r = round;
    const group = puzzle.groups.find((g) => g.n === groupN)!;
    if (num !== groupN) {
      shaker.shake(`g${groupN}`);
      await retry(`再試試看！這裡有${quantityWord(groupN)}隻${group.animal.name}喔！`);
      return;
    }
    const list = [...matched, num];
    setMatched(list);
    setDance((d) => ({ ...d, [num]: (d[num] ?? 0) + 1 }));
    markLearned('numbers', num);
    audio.play('pop');
    burstFrom(groupRefs.current.get(num) ?? null, NUMBER_TINTS[num]);
    if (list.length < puzzle.nums.length) {
      await say(`${numberWord(num)}！${quantityWord(num)}隻${group.animal.name}！`);
      return;
    }
    setLocked(true);
    setDance(Object.fromEntries(puzzle.nums.map((x) => [x, 99])));
    await success(MODE_ID, null, '全部配對好了！你好棒！');
    if (isCurrent(r)) next();
  };

  const tapGroup = (n: number) => {
    if (selected !== null) {
      void attempt(selected, n);
    } else if (!matched.includes(n)) {
      audio.play('boing');
      setDance((d) => ({ ...d, [n]: (d[n] ?? 0) + 1 }));
      void say('先選一個數字喔！');
    }
  };

  const tileSize = `max(96px, ${u(14)})`;

  return (
    <div className="flex size-full items-center justify-center px-3" style={{ gap: u(6) }}>
      {/* 左側：數字卡 */}
      <div className="flex flex-col" style={{ gap: u(2.5) }}>
        {puzzle.nums.map((n) => (
          <div key={`${round}-${n}`} style={{ width: tileSize, height: tileSize }}>
            {!matched.includes(n) && (
              <motion.div
                className="cursor-grab touch-none active:cursor-grabbing"
                drag
                dragSnapToOrigin
                dragElastic={0.9}
                dragMomentum={false}
                whileDrag={{ scale: 1.12, zIndex: 30 }}
                animate={{ scale: selected === n ? 1.12 : 1, rotate: selected === n ? -4 : 0 }}
                style={{ position: 'relative', zIndex: selected === n ? 20 : 1 }}
                onDragStart={() => {
                  lastDragAt.current = performance.now();
                  audio.play('pop');
                  setSelected(null);
                }}
                onDrag={(_, info) => setHover(groupAt(info.point.x - window.scrollX, info.point.y - window.scrollY))}
                onDragEnd={(_, info) => {
                  lastDragAt.current = performance.now();
                  const g = groupAt(info.point.x - window.scrollX, info.point.y - window.scrollY);
                  setHover(null);
                  if (g !== null) void attempt(n, g);
                }}
                onTap={() => {
                  if (performance.now() - lastDragAt.current < 400) return;
                  audio.play('tap');
                  setSelected(selected === n ? null : n);
                  if (selected !== n) void say(`${numberWord(n)}！`);
                }}
                role="button"
                aria-label={`數字 ${n}`}
                aria-pressed={selected === n}
              >
                <div className={`rounded-[28%] ${selected === n ? 'ring-8 ring-[#ff9f43]' : ''}`}>
                  <NumberTile n={n} size={tileSize} />
                </div>
              </motion.div>
            )}
          </div>
        ))}
      </div>

      {/* 右側：動物群組 */}
      <div className="flex flex-1 flex-col" style={{ gap: u(2.5), maxWidth: u(62) }}>
        {puzzle.groups.map(({ n, animal }) => {
          const done = matched.includes(n);
          const active = hover === n || (selected !== null && !matched.includes(selected) && !done);
          return (
            <div key={`${round}-g${n}`} ref={shaker.register(`g${n}`)}>
              <motion.div
                ref={(el: HTMLDivElement | null) => {
                  if (el) groupRefs.current.set(n, el);
                  else groupRefs.current.delete(n);
                }}
                role="button"
                aria-label={`${animal.name}群組`}
                onClick={() => tapGroup(n)}
                animate={{ scale: hover === n ? 1.05 : 1 }}
                className={`relative flex cursor-pointer items-center justify-center rounded-[2rem] border-[5px] px-3 transition-colors ${
                  done ? 'border-[#86efac] bg-[#dcfce7]' : active ? 'border-[#ff9f43] bg-white' : 'border-white bg-white/80'
                } shadow-[0_8px_0_rgba(74,59,63,0.12)]`}
                style={{ minHeight: tileSize, paddingRight: done ? `calc(${tileSize} * 0.8)` : undefined }}
              >
                <div className="flex flex-wrap items-center justify-center py-1" style={{ gap: u(0.5) }}>
                  {Array.from({ length: n }, (_, i) => (
                    <AnimalCharacter
                      key={i}
                      species={animal.id}
                      size={`max(44px, ${u(n > 5 ? 6.5 : 9)})`}
                      anim={dance[n] ? 'jump' : 'none'}
                      animKey={dance[n] ?? 0}
                      delay={i * 0.06}
                    />
                  ))}
                </div>
                <AnimatePresence>
                  {done && (
                    <motion.div
                      className="absolute right-2"
                      initial={{ scale: 0, rotate: -40 }}
                      animate={{ scale: 0.7, rotate: 0 }}
                      transition={{ type: 'spring', stiffness: 400, damping: 14 }}
                    >
                      <NumberTile n={n} size={tileSize} dots={false} />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
