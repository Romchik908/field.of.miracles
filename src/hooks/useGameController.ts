import { useState, useEffect, useCallback, useRef } from 'react';
import { useGame } from './useGame';
import { useDrum } from './useDrum';
import { KEY_MAP } from '../constants/gameData';
import type { GameSaveData } from '../types';

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

  const [isCheatAnimationEnabled, setIsCheatAnimationEnabled] = useState(true);

  const [pendingTarget, setPendingTarget] = useState<{ val: string | number; id: number } | null>(
    null,
  );
  const targetRef = useRef<string | number | null>(null);

  const game = useGame(initialData);
  const handleDrumStop = (sector: string | number) => game.handleSector(sector);
  const drum = useDrum(handleDrumStop);

  const executeSpin = useCallback(() => {
    if (targetRef.current !== null) {
      drum.spinTo(targetRef.current);
      targetRef.current = null;
    } else {
      drum.spin();
    }
  }, [drum]);

  const cheatSector = (sector: string | number, forceAnimation = false) => {
    if (drum.isSpinning) return;

    if (isCheatAnimationEnabled || forceAnimation) {
      targetRef.current = sector;
      setPendingTarget({ val: sector, id: Date.now() });
    } else {
      game.handleSector(sector);
    }
  };

  const consumeCheatSignal = useCallback(() => {
    setPendingTarget(null);
  }, []);

  useEffect(() => {
    if (game.gameState !== 'SPIN') {
      targetRef.current = null;
      setPendingTarget(null);
    }
  }, [game.gameState]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // 0. ЧИТЫ
      if (e.altKey && CHEAT_KEYS[e.code]) {
        e.preventDefault();
        cheatSector(CHEAT_KEYS[e.code], true);
        return;
      }

      // 1. МОДАЛКИ
      if (isModalOpen) {
        if (modalType === 'PRIZE') {
          if (e.code === 'Enter') onPrizeChoice(true);
          if (e.code === 'Escape') onPrizeChoice(false);
        }
        if (modalType === 'PHONE') {
          if (e.code === 'Enter') onPhoneEnd();
          if (e.code === 'Escape') onChanceRefuse();
        }
        if (modalType === 'CASKET') {
          if (e.code === 'Enter') {
            onCasketFinish();
          }
        }
        if (modalType === 'WIN') {
          if (e.code === 'Enter') startNextRound();
        }
        return;
      }

      // 2. ПРОБЕЛ
      if (e.code === 'Space') {
        e.preventDefault();
        return;
      }

      // 3. ВВОД БУКВЫ
      if (game.gameState === 'GUESS') {
        if (e.altKey) {
          if (e.code === 'KeyW') {
            e.preventDefault();
            const res = game.handleWordGuessResult(true);
            if (res === 'WIN') {
              setModalType('WIN');
              setIsModalOpen(true);
            }
          }
          if (e.code === 'KeyE') {
            e.preventDefault();
            game.handleWordGuessResult(false);
          }
          return;
        }

        let letter = '';
        if (/^[А-ЯЁа-яё]$/.test(e.key)) letter = e.key.toUpperCase();
        else if (KEY_MAP[e.code]) letter = KEY_MAP[e.code];

        if (letter) onGuessLetter(letter);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    game.gameState,
    isModalOpen,
    drum.isSpinning,
    game.guessedLetters,
    isCheatAnimationEnabled,
    casketResult,
  ]);

  // --- ACTIONS ---

  const onGuessLetter = (letter: string) => {
    const result = game.handleGuess(letter);
    if (result === 'WIN') {
      setModalType('WIN');
      setIsModalOpen(true);
    }
  };

  // --- ИСПРАВЛЕННЫЙ МЕТОД ДЛЯ КЛИКА ПО БУКВЕ (+) ---
  const onLetterClick = (index: number) => {
    if (game.gameState === 'PLUS_SELECTION') {
      // Получаем результат из хука useGame
      const result = game.handlePlusAction(index);

      if (result === 'WIN') {
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

  const onChanceRefuse = () => {
    setIsModalOpen(false);
    game.handleChanceRefusal();
  };

  const onCasketChoice = () => {
    const isWin = Math.random() > 0.5;
    setCasketResult(isWin ? 'win' : 'empty');
  };

  const onCasketFinish = () => {
    setIsModalOpen(false);
    game.finishCaskets();
  };

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
      cheatSignal: pendingTarget,
    },
    actions: {
      spinDrum: executeSpin,
      guessLetter: onGuessLetter,
      clickBoardLetter: onLetterClick, // Используем обновленную версию
      prizeChoice: onPrizeChoice,
      endPhoneCall: onPhoneEnd,
      casketChoice: onCasketChoice,
      casketFinish: onCasketFinish,
      finishPrizeShop: onPrizeShopFinish,
      closeModal: () => setIsModalOpen(false),
      nextRound: startNextRound,
      cheatSector,
      consumeCheatSignal,
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
