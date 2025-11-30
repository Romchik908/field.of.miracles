import { useState, useMemo, useEffect } from 'react';
import { initialPlayers, gameQuestions } from '../constants/gameData';
import type { GameSaveData, Player, GameState } from '../types';

export const useGame = (initialData: GameSaveData | null) => {
  const [roundIndex, setRoundIndex] = useState(initialData?.roundIndex ?? 0);
  const [allPlayers, setAllPlayers] = useState<Player[]>(initialData?.allPlayers ?? initialPlayers);
  const [finalists, setFinalists] = useState<Player[]>(initialData?.finalists ?? []);
  const [activePlayerLocalIndex, setActivePlayerLocalIndex] = useState(
    initialData?.activePlayerLocalIndex ?? 0,
  );
  const [guessedLetters, setGuessedLetters] = useState<string[]>(initialData?.guessedLetters ?? []);
  const [eliminatedLocalIndices, setEliminatedLocalIndices] = useState<number[]>(
    initialData?.eliminatedLocalIndices ?? [],
  );
  const [consecutiveGuesses, setConsecutiveGuesses] = useState(
    initialData?.consecutiveGuesses ?? 0,
  );

  const [wonPrizesIds, setWonPrizesIds] = useState<number[]>(initialData?.wonPrizesIds ?? []);

  const [gameState, setGameState] = useState<GameState>(initialData?.gameState ?? 'SPIN');
  const [message, setMessage] = useState(initialData ? 'Игра восстановлена!' : 'Вращайте барабан!');
  const [currentSectorValue, setCurrentSectorValue] = useState<string | number | null>(
    initialData?.currentSectorValue ?? null,
  );

  useEffect(() => {
    if (initialData) {
      setRoundIndex(initialData.roundIndex);
      setAllPlayers(initialData.allPlayers);
      setFinalists(initialData.finalists);
      setActivePlayerLocalIndex(initialData.activePlayerLocalIndex);
      setGuessedLetters(initialData.guessedLetters);
      setEliminatedLocalIndices(initialData.eliminatedLocalIndices);
      setConsecutiveGuesses(initialData.consecutiveGuesses);
      setWonPrizesIds(initialData.wonPrizesIds || []);
      setGameState(initialData.gameState);
      setCurrentSectorValue(initialData.currentSectorValue);

      if (initialData.gameState === 'GUESS') setMessage('Игра восстановлена! Называйте букву.');
      else if (initialData.gameState === 'SPIN')
        setMessage('Игра восстановлена! Вращайте барабан.');
      else if (initialData.gameState === 'PRIZE_SHOP') setMessage('Магазин призов!');
      else if (initialData.gameState === 'PRIZE_SUMMARY') setMessage('Поздравляем с победой!');
      else setMessage('Игра восстановлена!');
    } else {
      setRoundIndex(0);
      setAllPlayers(initialPlayers);
      setFinalists([]);
      setActivePlayerLocalIndex(0);
      setGuessedLetters([]);
      setEliminatedLocalIndices([]);
      setConsecutiveGuesses(0);
      setWonPrizesIds([]);
      setGameState('SPIN');
      setCurrentSectorValue(null);
      setMessage('Вращайте барабан!');
    }
  }, [initialData]);

  const currentQuestion = gameQuestions[roundIndex] || gameQuestions[0];

  const currentPlayers = useMemo(() => {
    if (roundIndex < 3) {
      const start = roundIndex * 3;
      return allPlayers.slice(start, start + 3);
    } else {
      return finalists;
    }
  }, [roundIndex, allPlayers, finalists]);

  const activePlayer = currentPlayers[activePlayerLocalIndex] || currentPlayers[0];

  const switchPlayer = (currentEliminated = eliminatedLocalIndices) => {
    setConsecutiveGuesses(0);
    let nextIndex = (activePlayerLocalIndex + 1) % currentPlayers.length;
    let attempts = 0;
    while (currentEliminated.includes(nextIndex) && attempts < currentPlayers.length) {
      nextIndex = (nextIndex + 1) % currentPlayers.length;
      attempts++;
    }
    if (attempts === currentPlayers.length) return;

    setActivePlayerLocalIndex(nextIndex);
    setGameState('SPIN');
    setMessage(`Ход игрока ${currentPlayers[nextIndex].name}. Вращайте!`);
    setCurrentSectorValue(null);
  };

  const nextLevel = () => {
    const winner = currentPlayers[activePlayerLocalIndex];
    if (roundIndex < 3) setFinalists((prev) => [...prev, winner]);

    if (roundIndex < 3) {
      setRoundIndex((prev) => prev + 1);
      setGuessedLetters([]);
      setEliminatedLocalIndices([]);
      setActivePlayerLocalIndex(0);
      setConsecutiveGuesses(0);
      setGameState('SPIN');
      setMessage(
        roundIndex === 2
          ? 'ФИНАЛ! Играют победители!'
          : `Раунд ${roundIndex + 2}! Новая тройка игроков.`,
      );
      setCurrentSectorValue(null);
    } else {
      setFinalists((prev) => [...prev, winner]);
      setMessage(`ПОБЕДИТЕЛЬ СУПЕРИГРЫ: ${winner.name}!`);
      setGameState('PRIZE_SHOP');
    }
  };

  const addScore = (points: number, isDouble: boolean = false) => {
    const targetId = activePlayer.id;
    setAllPlayers((prev) =>
      prev.map((p) => {
        if (p.id === targetId) return { ...p, score: isDouble ? p.score * 2 : p.score + points };
        return p;
      }),
    );
    if (roundIndex === 3) {
      setFinalists((prev) =>
        prev.map((p) => {
          if (p.id === targetId) return { ...p, score: isDouble ? p.score * 2 : p.score + points };
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
      setConsecutiveGuesses(0);
      setMessage('БАНКРОТ! Очки сгорели. Переход хода.');
      setTimeout(() => switchPlayer(), 2000);
      return;
    }
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

  const handleGuess = (letter: string): 'ALREADY' | 'WRONG' | 'CORRECT' | 'WIN' | 'CASKETS' => {
    const normalizedLetter = letter.toUpperCase();
    if (guessedLetters.includes(normalizedLetter)) {
      setMessage('Эта буква уже была! Переход хода.');
      setTimeout(() => switchPlayer(), 1500);
      return 'ALREADY';
    }

    const newGuessed = [...guessedLetters, normalizedLetter];
    setGuessedLetters(newGuessed);

    if (currentQuestion.word.includes(normalizedLetter)) {
      const count = currentQuestion.word
        .split('')
        .filter((char) => char === normalizedLetter).length;

      if (typeof currentSectorValue === 'number') addScore(currentSectorValue * count);
      else if (currentSectorValue === 'x2') addScore(0, true);

      const isWin = currentQuestion.word.split('').every((char) => newGuessed.includes(char));
      if (isWin) return 'WIN';

      const newStreak = consecutiveGuesses + 1;
      if (newStreak === 3) {
        setConsecutiveGuesses(0);
        setMessage('Три буквы подряд! ДВЕ ШКАТУЛКИ!');
        setGameState('CASKET_SELECTION');
        return 'CASKETS';
      } else {
        setConsecutiveGuesses(newStreak);
        setMessage(`Открыто букв: ${count}! Вращайте снова.`);
        setGameState('SPIN');
        return 'CORRECT';
      }
    } else {
      setMessage('Такой буквы нет! Переход хода.');
      setConsecutiveGuesses(0);
      setTimeout(() => switchPlayer(), 1500);
      return 'WRONG';
    }
  };

  const handleWordGuess = (wordInput: string): 'WIN' | 'WRONG' => {
    const normalizedInput = wordInput.toUpperCase().trim();

    if (normalizedInput === currentQuestion.word) {
      if (typeof currentSectorValue === 'number') {
        addScore(currentSectorValue);
      } else if (currentSectorValue === 'x2') {
        addScore(0, true);
      }

      setGuessedLetters(currentQuestion.word.split(''));
      return 'WIN';
    } else {
      setMessage(`Неправильно! Игрок ${activePlayer.name} выбывает из раунда.`);
      const newEliminated = [...eliminatedLocalIndices, activePlayerLocalIndex];
      setEliminatedLocalIndices(newEliminated);
      setTimeout(() => switchPlayer(newEliminated), 2000);
      return 'WRONG';
    }
  };

  const finishCaskets = () => {
    setMessage('Продолжаем игру! Вращайте барабан.');
    setGameState('SPIN');
  };

  const finishPrizeSelection = (ids: number[]) => {
    setWonPrizesIds(ids);
    setGameState('PRIZE_SUMMARY');
    setMessage('Отличный выбор! Игра завершена.');
  };

  const handlePlusAction = (index: number) => {
    const letter = currentQuestion.word[index];
    if (guessedLetters.includes(letter)) return;
    const newGuessed = [...guessedLetters, letter];
    setGuessedLetters(newGuessed);
    setMessage(`Открыта буква ${letter}! Вращайте барабан.`);
    setGameState('SPIN');
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

  const checkWin = () =>
    currentQuestion.word.split('').every((char) => guessedLetters.includes(char));

  return {
    roundIndex,
    players: currentPlayers,
    activePlayerIndex: activePlayerLocalIndex,
    currentQuestion,
    guessedLetters,
    gameState,
    message,
    currentSectorValue,
    eliminatedPlayers: eliminatedLocalIndices,
    wonPrizesIds,
    setGameState,
    setMessage,
    handleGuess,
    handleWordGuess,
    handleSector,
    handlePlusAction,
    handlePrizeDecision,
    finishCaskets,
    finishPrizeSelection,
    switchPlayer,
    checkWin,
    nextLevel,
    rawState: {
      roundIndex,
      allPlayers,
      finalists,
      activePlayerLocalIndex,
      guessedLetters,
      eliminatedLocalIndices,
      gameState,
      currentSectorValue,
      consecutiveGuesses,
      wonPrizesIds,
    },
  };
};
