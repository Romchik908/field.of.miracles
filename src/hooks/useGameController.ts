import { useEffect, useState } from 'react';
import { KEY_MAP } from '../constants/gameData';
import type { GameSaveData } from '../types';
import { useDrum } from './useDrum';
import { useGame } from './useGame';
// import { KEY_MAP } from '../constants';
// import { GameSaveData } from '../types';

// Секретные хоткеи (ALT + ...)
const CHEAT_KEYS: Record<string, string | number> = {
  Digit1: 1000,
  Digit2: 'x2',
  KeyP: 'П',
  KeyB: 'БАНКРОТ',
  KeyS: 'Ш',
  Equal: '+',
};

export const useGameController = (initialData: GameSaveData | null) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<'WIN' | 'PRIZE' | 'PHONE' | 'CASKET'>('WIN');

  const [phoneHint, setPhoneHint] = useState('');
  const [casketResult, setCasketResult] = useState<'win' | 'empty' | null>(null);
  const [isWordGuessModalOpen, setIsWordGuessModalOpen] = useState(false);

  const [isCheatAnimationEnabled, setIsCheatAnimationEnabled] = useState(true);

  const [pendingTarget, setPendingTarget] = useState<string | number | null>(null);

  const game = useGame(initialData);
  const handleDrumStop = (sector: string | number) => game.handleSector(sector);
  const drum = useDrum(handleDrumStop);

  const executeSpin = () => {
    if (pendingTarget !== null) {
      drum.spinTo(pendingTarget);
      setPendingTarget(null);
    } else {
      drum.spin();
    }
  };

  const cheatSector = (sector: string | number, forceAnimation = false) => {
    if (drum.isSpinning) return;
    if (isCheatAnimationEnabled || forceAnimation) {
      setPendingTarget(sector);
    } else {
      game.handleSector(sector);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.altKey && CHEAT_KEYS[e.code]) {
        e.preventDefault();
        cheatSector(CHEAT_KEYS[e.code], true);
        return;
      }

      if (isModalOpen || isWordGuessModalOpen) return;

      if (e.code === 'Space') {
        e.preventDefault();
        return;
      }

      if (game.gameState !== 'GUESS') return;

      let letter = '';
      if (/^[А-ЯЁа-яё]$/.test(e.key)) letter = e.key.toUpperCase();
      else if (KEY_MAP[e.code]) letter = KEY_MAP[e.code];

      if (letter) onGuessLetter(letter);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    game.gameState,
    isModalOpen,
    isWordGuessModalOpen,
    drum.isSpinning,
    game.guessedLetters,
    isCheatAnimationEnabled,
  ]);

  const onGuessLetter = (letter: string) => {
    const result = game.handleGuess(letter);
    if (result === 'WIN') {
      setModalType('WIN');
      setIsModalOpen(true);
    }
  };

  const onWordGuess = (word: string) => {
    setIsWordGuessModalOpen(false);
    const result = game.handleWordGuess(word);
    if (result === 'WIN') {
      setModalType('WIN');
      setIsModalOpen(true);
    }
  };

  const onLetterClick = (index: number) => {
    if (game.gameState === 'PLUS_SELECTION') {
      game.handlePlusAction(index);
      if (game.checkWin()) {
        setModalType('WIN');
        setIsModalOpen(true);
      }
    }
  };

  const onPrizeChoice = (take: boolean) => {
    const result = game.handlePrizeDecision(take);
    setIsModalOpen(false);
    if (result.status === 'TOOK_PRIZE') {
      setTimeout(() => game.switchPlayer(result.newEliminated), 2000);
    }
  };

  const onPhoneEnd = () => {
    setIsModalOpen(false);
    game.setMessage('Друг дал подсказку. Ваш ход!');
    game.setGameState('GUESS');
  };

  const onCasketChoice = () => {
    const isWin = Math.random() > 0.5;
    setCasketResult(isWin ? 'win' : 'empty');
    setTimeout(() => {
      setIsModalOpen(false);
      setCasketResult(null);
      game.finishCaskets();
    }, 2000);
  };

  const onCasketFinish = () => {
    setIsModalOpen(false);
    game.finishCaskets();
  };

  // Обработчик завершения выбора призов
  const onPrizeShopFinish = (ids: number[]) => {
    game.finishPrizeSelection(ids);
  };

  const startNextRound = () => {
    game.nextLevel();
    setIsModalOpen(false);
    drum.setCurrentSector(null);
  };

  useEffect(() => {
    if (game.gameState === 'PRIZE_DECISION') {
      setModalType('PRIZE');
      setIsModalOpen(true);
    }
    if (game.gameState === 'PHONE_CALL') {
      const missingLetters = game.currentQuestion.word
        .split('')
        .filter((l) => !game.guessedLetters.includes(l));
      const randomMissing = missingLetters.length > 0 ? missingLetters[0] : 'А';
      const hint =
        Math.random() > 0.5
          ? randomMissing
          : 'АБВГДЕЖЗИКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯ'[Math.floor(Math.random() * 32)];
      setPhoneHint(hint);
      setModalType('PHONE');
      setIsModalOpen(true);
    }
    if (game.gameState === 'CASKET_SELECTION') {
      setCasketResult(null);
      setModalType('CASKET');
      setIsModalOpen(true);
    }
  }, [game.gameState]);

  return {
    rawState: game.rawState,
    gameData: {
      ...game,
      question: game.currentQuestion.question,
      word: game.currentQuestion.word,
      wonPrizesIds: game.wonPrizesIds,
    },
    drumData: { rotation: drum.rotation, isSpinning: drum.isSpinning },
    debug: {
      isCheatAnimationEnabled,
      toggleCheatAnimation: () => setIsCheatAnimationEnabled((prev) => !prev),
      pendingTarget,
    },
    actions: {
      spinDrum: executeSpin,
      guessLetter: onGuessLetter,
      clickBoardLetter: onLetterClick,
      prizeChoice: onPrizeChoice,
      endPhoneCall: onPhoneEnd,
      casketChoice: onCasketChoice,
      casketFinish: onCasketFinish,
      finishPrizeShop: onPrizeShopFinish, // <-- НОВЫЙ ЭКШЕН
      closeModal: () => setIsModalOpen(false),
      nextRound: startNextRound,
      cheatSector,
    },
    wordModal: {
      isOpen: isWordGuessModalOpen,
      open: () => setIsWordGuessModalOpen(true),
      close: () => setIsWordGuessModalOpen(false),
      submit: onWordGuess,
    },
    modal: {
      isOpen: isModalOpen,
      type: modalType,
      phoneHint,
      casketResult,
      winnerIndex: game.activePlayerIndex,
      winnerName: game.players[game.activePlayerIndex]?.name,
      word: game.currentQuestion.word,
    },
  };
};
