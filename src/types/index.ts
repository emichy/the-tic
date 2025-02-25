import { ReactNode } from 'react';

export type GameIcon = {
  icon: ReactNode;
  name: string;
};

export type Square = number | null;
export type Board = Square[];
export type GameMode = 'single' | 'multi' | null;
export type GameState = 'selecting-mode' | 'selecting-difficulty' | 'selecting-icon-1' | 'selecting-icon-2' | 'playing';
export type Difficulty = 'easy' | 'hard' | null;