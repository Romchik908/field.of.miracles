import { useState, useMemo } from 'react';
import { initialPlayers, gameQuestions } from '../constants/gameData';
import type { Player, GameState } from '../types';

export const useGame = () => {
  // Текущий номер раунда (0, 1, 2 - отборочные, 3 - финал)
  const [roundIndex, setRoundIndex] = useState(0);

  // Общий список всех игроков (их очки будут копиться здесь)
  const [allPlayers, setAllPlayers] = useState<Player[]>(initialPlayers);

  // Список победителей прошлых раундов
  const [finalists, setFinalists] = useState<Player[]>([]);

  // Индекс активного игрока ВНУТРИ текущей тройки (0, 1 или 2)
  const [activePlayerLocalIndex, setActivePlayerLocalIndex] = useState(0);

  const [guessedLetters, setGuessedLetters] = useState<string[]>([]);
  const [eliminatedLocalIndices, setEliminatedLocalIndices] = useState<number[]>([]); // Кто выбыл в текущем раунде (взял приз)

  const [gameState, setGameState] = useState<GameState>('SPIN');
  const [message, setMessage] = useState('Вращайте барабан!');
  const [currentSectorValue, setCurrentSectorValue] = useState<string | number | null>(null);

  // --- ВЫЧИСЛЯЕМЫЕ ЗНАЧЕНИЯ ---

  const currentQuestion = gameQuestions[roundIndex];

  // Определяем, кто играет прямо сейчас
  const currentPlayers = useMemo(() => {
    if (roundIndex < 3) {
      // Отборочные раунды: берем по 3 игрока из общего списка
      const start = roundIndex * 3;
      return allPlayers.slice(start, start + 3);
    } else {
      // Финал: играют победители
      return finalists;
    }
  }, [roundIndex, allPlayers, finalists]);

  // Глобальный ID активного игрока (для обновления очков)
  const activePlayer = currentPlayers[activePlayerLocalIndex];

  // --- ЛОГИКА ---

  const switchPlayer = (currentEliminated = eliminatedLocalIndices) => {
    let nextIndex = (activePlayerLocalIndex + 1) % currentPlayers.length;
    let attempts = 0;

    // Ищем живого игрока
    while (currentEliminated.includes(nextIndex) && attempts < currentPlayers.length) {
      nextIndex = (nextIndex + 1) % currentPlayers.length;
      attempts++;
    }

    if (attempts === currentPlayers.length) {
      // Все выбыли? Такого быть не должно, но если что - рестарт раунда
      return;
    }

    setActivePlayerLocalIndex(nextIndex);
    setGameState('SPIN');
    const nextPlayerName = currentPlayers[nextIndex].name;
    setMessage(`Ход игрока ${nextPlayerName}. Вращайте!`);
    setCurrentSectorValue(null);
  };

  // Переход к следующему этапу турнира
  const nextLevel = () => {
    // 1. Определяем победителя текущего раунда (текущий активный игрок)
    const winner = currentPlayers[activePlayerLocalIndex];

    // 2. Если это был отборочный раунд - добавляем в финалисты
    if (roundIndex < 3) {
      setFinalists((prev) => [...prev, winner]);
    }

    // 3. Переключаем раунд
    if (roundIndex < 3) {
      setRoundIndex((prev) => prev + 1);

      // Сброс состояния для нового раунда
      setGuessedLetters([]);
      setEliminatedLocalIndices([]);
      setActivePlayerLocalIndex(0);
      setGameState('SPIN');
      setMessage(roundIndex === 2 ? 'ФИНАЛ! Играют победители!' : `Раунд ${roundIndex + 2}! Новая тройка игроков.`);
      setCurrentSectorValue(null);
    } else {
      // ЭТО БЫЛ ФИНАЛ
      setMessage(`ТУРНИР ЗАВЕРШЕН! Победитель: ${winner.name}!`);
      setGameState('SPIN'); // Или сделать состояние GAME_OVER
    }
  };

  // Функция начисления очков (обновляем глобальный стейт allPlayers или finalists)
  const addScore = (points: number, isDouble: boolean = false) => {
    const targetId = activePlayer.id;

    // Обновляем общий список (чтобы сохранить прогресс)
    setAllPlayers((prev) =>
      prev.map((p) => {
        if (p.id === targetId) {
          return { ...p, score: isDouble ? p.score * 2 : p.score + points };
        }
        return p;
      }),
    );

    // Если это финал, обновляем и список финалистов (так как он отдельный стейт)
    if (roundIndex === 3) {
      setFinalists((prev) =>
        prev.map((p) => {
          if (p.id === targetId) {
            return { ...p, score: isDouble ? p.score * 2 : p.score + points };
          }
          return p;
        }),
      );
    }
  };

  const resetScore = () => {
    const targetId = activePlayer.id;
    setAllPlayers((prev) => prev.map((p) => (p.id === targetId ? { ...p, score: 0 } : p)));
    if (roundIndex === 3) {
      setFinalists((prev) => prev.map((p) => (p.id === targetId ? { ...p, score: 0 } : p)));
    }
  };

  const handleSector = (sector: string | number) => {
    setCurrentSectorValue(sector);

    if (sector === 'БАНКРОТ') {
      resetScore();
      setMessage('БАНКРОТ! Очки сгорели. Переход хода.');
      setTimeout(() => switchPlayer(), 2000);
      return;
    }
    // ... логика секторов (П, +, Ш) аналогична ...
    if (sector === 'П') {
      setMessage('Сектор ПРИЗ!');
      setGameState('PRIZE_DECISION');
      return;
    }
    if (sector === '+') {
      setMessage('Сектор ПЛЮС!');
      setGameState('PLUS_SELECTION');
      return;
    }
    if (sector === 'Ш') {
      setMessage('Сектор ШАНС!');
      setGameState('PHONE_CALL');
      return;
    }
    if (sector === 'x2') {
      setMessage('Сектор x2!');
    } else {
      setMessage(`Сектор ${sector} очков!`);
    }
    setGameState('GUESS');
  };

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

      if (typeof currentSectorValue === 'number') addScore(currentSectorValue * count);
      else if (currentSectorValue === 'x2') addScore(0, true);

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

  const handlePrizeDecision = (takePrize: boolean) => {
    if (takePrize) {
      setMessage(`Игрок ${activePlayer.name} забрал ПРИЗ и выбывает!`);
      const newEliminated = [...eliminatedLocalIndices, activePlayerLocalIndex];
      setEliminatedLocalIndices(newEliminated);
      return { status: 'TOOK_PRIZE', newEliminated };
    } else {
      setMessage('Отказ от приза. Называйте букву!');
      setGameState('GUESS');
      return { status: 'REFUSED', newEliminated: eliminatedLocalIndices };
    }
  };

  // Остальные методы (handlePlusAction и checkWin) тоже используют currentQuestion и activePlayer
  const handlePlusAction = (index: number) => {
    const letter = currentQuestion.word[index];
    if (guessedLetters.includes(letter)) return;
    const newGuessed = [...guessedLetters, letter];
    setGuessedLetters(newGuessed);
    setMessage(`Открыта буква ${letter}! Вращайте барабан.`);
    setGameState('SPIN');
  };

  const checkWin = () => currentQuestion.word.split('').every((char) => guessedLetters.includes(char));

  return {
    players: currentPlayers, // Отдаем только текущую тройку
    activePlayerIndex: activePlayerLocalIndex,
    currentQuestion,
    guessedLetters,
    gameState,
    message,
    currentSectorValue,
    eliminatedPlayers: eliminatedLocalIndices,
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
