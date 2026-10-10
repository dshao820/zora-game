import type { ComponentType, ReactNode } from 'react';

export type GameId = 'numbers' | 'colors' | 'animals' | 'challenges';

export interface ModeDef {
  /** 同時作為進度紀錄的 key */
  id: string;
  label: string;
  color: string;
  icon: ReactNode;
  Component: ComponentType;
}

export interface GameDef {
  id: GameId;
  title: string;
  color: string;
  icon: ReactNode;
  /** 只有一個模式時直接進入，不顯示模式選單 */
  modes: ModeDef[];
}
