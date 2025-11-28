import { useState } from 'react';
import { gameData } from '../constants/gameData';
import type { GameState, Player } from '../types';

export const useGame = () => {
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [guessedLetters, setGuessedLetters] = useState<string[]>([]);
  const [players, setPlayers] = useState<Player[]>([
    { id: 1, score: 0 },
    { id: 2, score: 0 },
    { id: 3, score: 0 },
  ]);
  const [activePlayerIndex, setActivePlayerIndex] = useState(0);

  // Новое состояние: список индексов выбывших игроков
  const [eliminatedPlayers, setEliminatedPlayers] = useState<number[]>([]);

  const [gameState, setGameState] = useState<GameState>('SPIN');
  const [message, setMessage] = useState('Вращайте барабан!');
  const [currentSectorValue, setCurrentSectorValue] = useState<string | number | null>(null);

  const currentQuestion = gameData[currentWordIndex];

  // --- Вспомогательные функции ---

  const nextLevel = () => {
    setCurrentWordIndex((prev) => (prev + 1) % gameData.length);
    setGuessedLetters([]);
    setEliminatedPlayers([]); // Возвращаем всех в игру
    setGameState('SPIN');
    setMessage('Новый раунд!');
    setCurrentSectorValue(null);
  };

  const switchPlayer = (currentEliminated = eliminatedPlayers) => {
    // Ищем следующего активного игрока
    let nextIndex = (activePlayerIndex + 1) % players.length;
    let attempts = 0;

    // Крутим цикл, пока не найдем не выбывшего игрока
    while (currentEliminated.includes(nextIndex) && attempts < players.length) {
      nextIndex = (nextIndex + 1) % players.length;
      attempts++;
    }

    // Если все выбыли (по идее такого быть не должно, но вдруг)
    if (attempts === players.length) {
      nextLevel();
      return;
    }

    setActivePlayerIndex(nextIndex);
    setGameState('SPIN');
    setMessage(`Ход игрока ${players[nextIndex].id}. Вращайте!`);
    setCurrentSectorValue(null);
  };

  const checkWin = (currentGuessed = guessedLetters) => {
    return currentQuestion.word.split('').every((char) => currentGuessed.includes(char));
  };

  // --- Обработка секторов ---
  const handleSector = (sector: string | number) => {
    setCurrentSectorValue(sector);

    if (sector === 'БАНКРОТ') {
      setPlayers((prev) => {
        const newP = [...prev];
        newP[activePlayerIndex].score = 0;
        return newP;
      });
      setMessage('БАНКРОТ! Очки сгорели. Переход хода.');
      setTimeout(() => switchPlayer(), 2000);
      return;
    }
    // ... остальной код секторов без изменений (П, +, Ш, x2) ...
    if (sector === 'П') {
      setMessage('Сектор ПРИЗ! Что выберете?');
      setGameState('PRIZE_DECISION');
      return;
    }

    if (sector === '+') {
      setMessage('Сектор ПЛЮС! Откройте любую букву на табло.');
      setGameState('PLUS_SELECTION');
      return;
    }

    if (sector === 'Ш') {
      setMessage('Сектор ШАНС! Звонок другу... Соединяем...');
      setGameState('PHONE_CALL');
      return;
    }

    if (sector === 'x2') {
      setMessage('Сектор x2! Угадывайте букву.');
    } else {
      setMessage(`Сектор ${sector} очков! Называйте букву.`);
    }

    setGameState('GUESS');
  };

  // --- Обработка Приза ---
  const handlePrizeDecision = (takePrize: boolean) => {
    if (takePrize) {
      setMessage(`Игрок ${activePlayerIndex + 1} забрал ПРИЗ и выбывает из раунда!`);

      // Добавляем текущего игрока в список выбывших
      const newEliminated = [...eliminatedPlayers, activePlayerIndex];
      setEliminatedPlayers(newEliminated);

      // Передаем ход следующему, кто остался
      // Возвращаем спец статус, чтобы контроллер знал, что делать
      return { status: 'TOOK_PRIZE', newEliminated };
    } else {
      setMessage('Игрок отказался от приза. Называйте букву!');
      setGameState('GUESS');
      return { status: 'REFUSED', newEliminated: eliminatedPlayers };
    }
  };

  // --- handleGuess (без изменений, кроме вызова switchPlayer) ---
  const handleGuess = (letter: string): 'ALREADY' | 'WRONG' | 'CORRECT' | 'WIN' => {
    const normalizedLetter = letter.toUpperCase();

    if (guessedLetters.includes(normalizedLetter)) {
      setMessage('Эта буква уже была! Переход хода.');
      setTimeout(() => switchPlayer(), 1500);
      return 'ALREADY';
    }

    const newGuessed = [...guessedLetters, normalizedLetter];
    setGuessedLetters(newGuessed);

    if (currentQuestion.word.includes(normalizedLetter)) {
      const count = currentQuestion.word.split('').filter((char) => char === normalizedLetter).length;

      setPlayers((prevPlayers) => {
        const newPlayers = [...prevPlayers];
        const player = { ...newPlayers[activePlayerIndex] };
        if (typeof currentSectorValue === 'number') player.score += currentSectorValue * count;
        else if (currentSectorValue === 'x2') player.score *= 2;
        newPlayers[activePlayerIndex] = player;
        return newPlayers;
      });

      const isWin = currentQuestion.word.split('').every((char) => newGuessed.includes(char));
      if (isWin) return 'WIN';

      setMessage(`Открыто букв: ${count}! Вращайте снова.`);
      setGameState('SPIN');
      return 'CORRECT';
    } else {
      setMessage('Такой буквы нет! Переход хода.');
      setTimeout(() => switchPlayer(), 1500);
      return 'WRONG';
    }
  };

  // Остальные методы без изменений (handlePlusAction и т.д.)
  const handlePlusAction = (index: number) => {
    const letter = currentQuestion.word[index];
    if (guessedLetters.includes(letter)) return;

    const newGuessed = [...guessedLetters, letter];
    setGuessedLetters(newGuessed);

    setMessage(`Открыта буква ${letter}! Вращайте барабан.`);
    setGameState('SPIN');
  };

  return {
    players,
    activePlayerIndex,
    currentQuestion,
    guessedLetters,
    gameState,
    message,
    currentSectorValue,
    eliminatedPlayers, // Экспортируем, если нужно для UI (например, закрасить игрока)
    setGameState,
    setMessage,
    handleGuess,
    handleSector,
    handlePlusAction,
    handlePrizeDecision,
    switchPlayer,
    checkWin,
    nextLevel,
  };
};
