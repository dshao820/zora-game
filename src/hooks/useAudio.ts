import { useMemo } from 'react';
import { audio, type Sfx } from '../lib/audio';
import { speech } from '../lib/speech';
import type { AnimalInfo } from '../data/animals';

/** 播放動物叫聲：有錄音檔就播錄音，沒有就用語音念出叫聲 */
export async function playAnimalSound(animal: AnimalInfo): Promise<void> {
  if (animal.soundUrl && (await audio.playClip(animal.soundUrl))) return;
  await speech.speak(animal.sound);
}

export function useAudio() {
  return useMemo(
    () => ({
      play: (s: Sfx) => audio.play(s),
      playAnimal: playAnimalSound,
    }),
    [],
  );
}
