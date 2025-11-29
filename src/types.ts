export type GameState =
  | 'SPIN'
  | 'GUESS'
  | 'PRIZE_DECISION'
  | 'PLUS_SELECTION'
  | 'PHONE_CALL'
  | 'CASKET_SELECTION'; // <-- Новое состояние

export interface Player {
  id: number;
  name: string;
  avatar: string;
  score: number;
}

export interface Question {
  question: string;
  word: string;
}
