import { useMemo } from 'react';
import { ANIMALS } from '../data/animals';
import { COLORS } from '../data/colors';
import { DIFFICULTIES } from '../data/difficulty';
import { range } from '../lib/random';
import { useGameProgress } from './useGameProgress';

/** 依家長設定的難度，回傳目前可用的數字、顏色、動物 */
export function useLevel() {
  const { settings } = useGameProgress();
  return useMemo(() => {
    const def = DIFFICULTIES[settings.difficulty];
    return {
      difficulty: settings.difficulty,
      numbers: range(1, def.numberMax),
      colors: COLORS.slice(0, def.colorCount),
      animals: ANIMALS.slice(0, def.animalCount),
    };
  }, [settings.difficulty]);
}
