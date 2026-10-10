import { DIFFICULTIES, type Difficulty } from '../data/difficulty';

export type LearnKind = 'numbers' | 'colors' | 'animals';

export interface Settings {
  /** 畫面上方的總音效開關 */
  muted: boolean;
  music: boolean;
  voice: boolean;
  sfx: boolean;
  difficulty: Difficulty;
  /** 家長指定的語音，null = 自動挑選 */
  voiceURI: string | null;
}

export interface Progress {
  stars: number;
  /** 距離下一顆星星已完成的題數（0～4） */
  taskProgress: number;
  totalTasks: number;
  modeCompletions: Record<string, number>;
  learned: { numbers: number[]; colors: string[]; animals: string[] };
  settings: Settings;
}

const KEY = 'animal-learning-adventure:v1';

export const defaultSettings = (): Settings => ({
  muted: false,
  music: true,
  voice: true,
  sfx: true,
  difficulty: 'beginner',
  voiceURI: null,
});

export const defaultProgress = (): Progress => ({
  stars: 0,
  taskProgress: 0,
  totalTasks: 0,
  modeCompletions: {},
  learned: { numbers: [], colors: [], animals: [] },
  settings: defaultSettings(),
});

export function loadProgress(): Progress {
  const d = defaultProgress();
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return d;
    const data = JSON.parse(raw) as Partial<Progress>;
    const settings = { ...d.settings, ...data.settings };
    if (!(settings.difficulty in DIFFICULTIES)) settings.difficulty = 'beginner';
    return {
      stars: Number(data.stars) || 0,
      taskProgress: Number(data.taskProgress) || 0,
      totalTasks: Number(data.totalTasks) || 0,
      modeCompletions: { ...data.modeCompletions },
      learned: { ...d.learned, ...data.learned },
      settings,
    };
  } catch {
    return d;
  }
}

export function saveProgress(p: Progress) {
  try {
    localStorage.setItem(KEY, JSON.stringify(p));
  } catch {
    // 私密瀏覽或容量不足時忽略，遊戲仍可正常進行
  }
}
