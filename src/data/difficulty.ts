export type Difficulty = 'beginner' | 'intermediate' | 'advanced';

export interface DifficultyDef {
  label: string;
  numberMax: number;
  colorCount: number;
  animalCount: number;
}

export const DIFFICULTIES: Record<Difficulty, DifficultyDef> = {
  beginner: { label: '初級', numberMax: 3, colorCount: 4, animalCount: 6 },
  intermediate: { label: '中級', numberMax: 5, colorCount: 6, animalCount: 12 },
  advanced: { label: '進階', numberMax: 10, colorCount: 9, animalCount: 18 },
};

export const DIFFICULTY_ORDER: Difficulty[] = ['beginner', 'intermediate', 'advanced'];
