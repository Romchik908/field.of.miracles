export type GameState = 'SPIN' | 'GUESS' | 'PRIZE_DECISION' | 'PLUS_SELECTION' | 'PHONE_CALL';

export interface Player {
  id: number; // Уникальный ID
  name: string;
  avatar: string; // URL картинки
  score: number;
}

export interface Question {
  question: string;
  word: string;
}
