// Добавляем новые состояния
export type GameState =
  | 'SPIN' // Вращение
  | 'GUESS' // Ввод буквы
  | 'PRIZE_DECISION' // Игрок решает: приз или игра
  | 'PLUS_SELECTION' // Игрок должен кликнуть на закрытую букву
  | 'PHONE_CALL'; // Идет "звонок" другу

export interface Player {
  id: number;
  score: number;
}

export interface Question {
  question: string;
  word: string;
}
