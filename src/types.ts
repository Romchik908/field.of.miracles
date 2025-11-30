export type GameState =
  | 'SPIN'
  | 'GUESS'
  | 'PRIZE_DECISION'
  | 'PLUS_SELECTION'
  | 'PHONE_CALL'
  | 'CASKET_SELECTION'
  | 'PRIZE_SHOP'
  | 'PRIZE_SUMMARY';

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

export interface GameSaveData {
  roundIndex: number;
  allPlayers: Player[];
  finalists: Player[];
  activePlayerLocalIndex: number;
  guessedLetters: string[];
  eliminatedLocalIndices: number[];
  gameState: GameState;
  currentSectorValue: string | number | null;
  consecutiveGuesses: number;
  wonPrizesIds: number[];
}
