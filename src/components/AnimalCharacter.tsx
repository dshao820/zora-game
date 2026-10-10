import { motion, type TargetAndTransition, type Transition } from 'motion/react';
import { useMemo } from 'react';
import type { Species } from '../data/animals';
import { SPECIES_NAMES } from '../data/animals';
import { isDark } from '../data/colors';
import { AnimalArt } from './AnimalArt';

export type AnimalAnim = 'idle' | 'jump' | 'dance' | 'spin' | 'nod' | 'happy' | 'shake' | 'swim' | 'none';

const ANIMS: Record<AnimalAnim, { target: TargetAndTransition; transition: Transition }> = {
  none: { target: { y: 0, rotate: 0, x: 0, scaleY: 1 }, transition: { duration: 0.2 } },
  idle: {
    target: { y: [0, -5, 0], scaleY: [1, 1.02, 1] },
    transition: { duration: 2.6, repeat: Infinity, ease: 'easeInOut' },
  },
  jump: {
    target: { y: [0, -70, 0, -18, 0], scaleY: [1, 1.06, 0.9, 1.02, 1] },
    transition: { duration: 0.75, ease: 'easeOut' },
  },
  dance: {
    target: { rotate: [0, -12, 12, -12, 12, 0], y: [0, -24, 0, -24, 0, 0] },
    transition: { duration: 1.3, ease: 'easeInOut' },
  },
  spin: {
    target: { rotate: [0, 360], y: [0, -40, 0] },
    transition: { duration: 0.9, ease: 'easeInOut' },
  },
  nod: {
    target: { rotate: [0, 7, -5, 4, 0] },
    transition: { duration: 0.7 },
  },
  happy: {
    target: { y: [0, -40, 0, -20, 0], rotate: [0, -8, 8, -4, 0] },
    transition: { duration: 0.9 },
  },
  shake: {
    target: { x: [0, -14, 14, -10, 10, 0] },
    transition: { duration: 0.5 },
  },
  swim: {
    target: { y: [0, 8, 0], rotate: [-5, 5, -5] },
    transition: { duration: 1.6, repeat: Infinity, ease: 'easeInOut' },
  },
};

interface Props {
  species: Species;
  size?: string | number;
  /** 改變身體顏色（小小挑戰的顏色題） */
  color?: string;
  /** 穿上衣服的顏色 */
  shirt?: string;
  anim?: AnimalAnim;
  /** 改變這個值可以重新播放同一個動畫 */
  animKey?: number | string;
  /** 動畫延遲（秒），讓一排動物依序跳動 */
  delay?: number;
  wag?: boolean;
  className?: string;
  label?: string;
}

export function AnimalCharacter({
  species,
  size = 160,
  color,
  shirt,
  anim = 'idle',
  animKey = 0,
  delay = 0,
  wag = false,
  className = '',
  label,
}: Props) {
  const { target, transition } = ANIMS[anim];
  // 每隻動物眨眼時間錯開，比較自然
  const blinkDelay = useMemo(() => `${-Math.random() * 5}s`, []);
  const classes = ['select-none', wag ? 'aa-wag' : '', color && isDark(color) ? 'aa-dark' : '', className].join(' ');

  return (
    <motion.div
      key={`${anim}-${animKey}`}
      className={classes}
      style={{ width: size, height: size, transformOrigin: '50% 90%' }}
      animate={target}
      transition={{ ...transition, delay }}
      role="img"
      aria-label={label ?? SPECIES_NAMES[species]}
    >
      <svg viewBox="0 0 200 200" width="100%" height="100%" style={{ overflow: 'visible', ['--bd' as string]: blinkDelay }}>
        <AnimalArt species={species} color={color} shirt={shirt} />
      </svg>
    </motion.div>
  );
}
