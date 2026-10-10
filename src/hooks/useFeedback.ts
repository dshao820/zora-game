import { animate } from 'motion/react';
import { useCallback, useMemo, useRef } from 'react';
import { PRAISE, RETRY } from '../data/phrases';
import { audio } from '../lib/audio';
import { pick } from '../lib/random';
import { useGameProgress } from './useGameProgress';
import { useSpeech } from './useSpeech';

/** 答對／答錯的共用回饋流程 */
export function useFeedback() {
  const say = useSpeech();
  const { completeTask, burstFrom, markLearned } = useGameProgress();

  /** 答對：音效＋星星粒子＋語音鼓勵，接著記錄完成一題（可能觸發星星獎勵） */
  const success = useCallback(
    async (modeId: string, el: Element | null, line = pick(PRAISE), color?: string) => {
      audio.play('correct');
      burstFrom(el, color);
      await say(line);
      await completeTask(modeId);
    },
    [say, burstFrom, completeTask],
  );

  /** 答錯：溫和的提示音＋鼓勵再試，不扣分 */
  const retry = useCallback(
    async (line = pick(RETRY)) => {
      audio.play('tryAgain');
      await say(line);
    },
    [say],
  );

  return { say, success, retry, completeTask, burstFrom, markLearned };
}

/** 讓選項輕輕搖晃（綁在外層 div 上，避免和按鈕本身的縮放動畫衝突） */
export function useShake() {
  const refs = useRef(new Map<string | number, HTMLElement>());
  return useMemo(
    () => ({
      register: (key: string | number) => (el: HTMLElement | null) => {
        if (el) refs.current.set(key, el);
        else refs.current.delete(key);
      },
      shake: (key: string | number) => {
        const el = refs.current.get(key);
        if (el) void animate(el, { x: [0, -14, 14, -10, 10, 0], rotate: [0, -3, 3, -2, 2, 0] }, { duration: 0.5 });
      },
      get: (key: string | number) => refs.current.get(key) ?? null,
    }),
    [],
  );
}
