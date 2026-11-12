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
  /** 小朋友已經在「動物朋友」看過幾位朋友（用來顯示「有新朋友」提示） */
  friendsSeen: number;
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
  friendsSeen: 0,
  settings: defaultSettings(),
});

const count = (v: unknown) => Math.max(0, Math.floor(Number(v) || 0));
const list = <T,>(v: T[] | undefined): T[] => (Array.isArray(v) ? v : []);

export function loadProgress(): Progress {
  const d = defaultProgress();
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return d;
    const data = JSON.parse(raw) as Partial<Progress>;
    const settings = { ...d.settings, ...data.settings };
    if (!(settings.difficulty in DIFFICULTIES)) settings.difficulty = 'beginner';
    const learned = data.learned ?? d.learned;
    return {
      stars: count(data.stars),
      // 資料損壞時不能超過一顆星星需要的題數，否則進度點會壞掉
      taskProgress: Math.min(count(data.taskProgress), 4),
      totalTasks: count(data.totalTasks),
      modeCompletions: { ...data.modeCompletions },
      learned: {
        numbers: list(learned.numbers),
        colors: list(learned.colors),
        animals: list(learned.animals),
      },
      friendsSeen: count(data.friendsSeen),
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
