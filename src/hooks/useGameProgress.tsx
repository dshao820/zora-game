import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { audio } from '../lib/audio';
import { speech } from '../lib/speech';
import { defaultProgress, loadProgress, saveProgress, type LearnKind, type Progress, type Settings } from '../lib/storage';

/** 每完成 5 題（一個小關卡）得到一顆星星 */
export const TASKS_PER_STAR = 5;
/** 每 5 顆星星出現一次慶祝畫面 */
export const STARS_PER_CELEBRATION = 5;

export interface RewardEvent {
  id: number;
  type: 'star' | 'celebrate';
}

export interface Burst {
  id: number;
  x: number;
  y: number;
  color: string;
}

interface ProgressContext {
  progress: Progress;
  settings: Settings;
  /** 完成一題。若得到星星會先播放獎勵動畫，動畫結束後 Promise 才完成 */
  completeTask: (modeId: string) => Promise<void>;
  markLearned: (kind: LearnKind, value: string | number) => void;
  updateSettings: (patch: Partial<Settings>) => void;
  resetProgress: () => void;
  reward: RewardEvent | null;
  finishReward: () => void;
  bursts: Burst[];
  /** 在畫面某個元素上噴出星星 */
  burstFrom: (el: Element | null, color?: string) => void;
}

const Ctx = createContext<ProgressContext | null>(null);

export function ProgressProvider({ children }: { children: ReactNode }) {
  const [progress, setProgress] = useState<Progress>(loadProgress);
  const ref = useRef(progress);
  const [reward, setReward] = useState<RewardEvent | null>(null);
  const resolveReward = useRef<(() => void) | null>(null);
  const [bursts, setBursts] = useState<Burst[]>([]);

  const commit = useCallback((next: Progress) => {
    ref.current = next;
    setProgress(next);
    saveProgress(next);
  }, []);

  // 設定同步到音效/語音引擎
  const { muted, music, sfx, voice, voiceURI } = progress.settings;
  useEffect(() => speech.setPreferredVoice(voiceURI), [voiceURI]);
  useEffect(() => {
    audio.setMuted(muted);
    audio.setMusic(music);
    audio.setSfx(sfx);
    speech.setEnabled(voice && !muted);
  }, [muted, music, sfx, voice]);

  // 語音播放時降低背景音樂
  useEffect(() => speech.subscribe(() => audio.duck(speech.getSnapshot().speaking)), []);

  const completeTask = useCallback(
    (modeId: string) => {
      const prev = ref.current;
      let taskProgress = prev.taskProgress + 1;
      let stars = prev.stars;
      let type: RewardEvent['type'] | null = null;
      if (taskProgress >= TASKS_PER_STAR) {
        taskProgress = 0;
        stars += 1;
        type = stars % STARS_PER_CELEBRATION === 0 ? 'celebrate' : 'star';
      }
      commit({
        ...prev,
        stars,
        taskProgress,
        totalTasks: prev.totalTasks + 1,
        modeCompletions: { ...prev.modeCompletions, [modeId]: (prev.modeCompletions[modeId] ?? 0) + 1 },
      });
      if (!type) return Promise.resolve();
      const rewardType = type;
      return new Promise<void>((resolve) => {
        resolveReward.current?.();
        resolveReward.current = resolve;
        setReward({ id: Date.now(), type: rewardType });
      });
    },
    [commit],
  );

  const finishReward = useCallback(() => {
    const r = resolveReward.current;
    resolveReward.current = null;
    setReward(null);
    r?.();
  }, []);

  const markLearned = useCallback(
    (kind: LearnKind, value: string | number) => {
      const prev = ref.current;
      const list = prev.learned[kind] as (string | number)[];
      if (list.includes(value)) return;
      commit({ ...prev, learned: { ...prev.learned, [kind]: [...list, value] } });
    },
    [commit],
  );

  const updateSettings = useCallback(
    (patch: Partial<Settings>) => {
      const prev = ref.current;
      commit({ ...prev, settings: { ...prev.settings, ...patch } });
    },
    [commit],
  );

  const resetProgress = useCallback(() => {
    commit({ ...defaultProgress(), settings: ref.current.settings });
  }, [commit]);

  const burstFrom = useCallback((el: Element | null, color = '#ffd93d') => {
    if (!el) return;
    const r = el.getBoundingClientRect();
    const b: Burst = { id: Math.random(), x: r.left + r.width / 2, y: r.top + r.height / 2, color };
    setBursts((list) => [...list, b]);
    window.setTimeout(() => setBursts((list) => list.filter((x) => x.id !== b.id)), 1300);
  }, []);

  const value = useMemo<ProgressContext>(
    () => ({
      progress,
      settings: progress.settings,
      completeTask,
      markLearned,
      updateSettings,
      resetProgress,
      reward,
      finishReward,
      bursts,
      burstFrom,
    }),
    [progress, completeTask, markLearned, updateSettings, resetProgress, reward, finishReward, bursts, burstFrom],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useGameProgress() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useGameProgress must be used inside <ProgressProvider>');
  return ctx;
}
