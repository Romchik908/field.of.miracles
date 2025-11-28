import { useState, useEffect } from 'react';
import { useGame } from './useGame';
import { useDrum } from './useDrum';

const KEY_MAP: Record<string, string> = {
  KeyQ: 'Й',
  KeyW: 'Ц',
  KeyE: 'У',
  KeyR: 'К',
  KeyT: 'Е',
  KeyY: 'Н',
  KeyU: 'Г',
  KeyI: 'Ш',
  KeyO: 'Щ',
  KeyP: 'З',
  BracketLeft: 'Х',
  BracketRight: 'Ъ',
  KeyA: 'Ф',
  KeyS: 'Ы',
  KeyD: 'В',
  KeyF: 'А',
  KeyG: 'П',
  KeyH: 'Р',
  KeyJ: 'О',
  KeyK: 'Л',
  KeyL: 'Д',
  Semicolon: 'Ж',
  Quote: 'Э',
  KeyZ: 'Я',
  KeyX: 'Ч',
  KeyC: 'С',
  KeyV: 'М',
  KeyB: 'И',
  KeyN: 'Т',
  KeyM: 'Ь',
  Comma: 'Б',
  Period: 'Ю',
  Backquote: 'Ё',
};

export const useGameController = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<'WIN' | 'PRIZE' | 'PHONE'>('WIN');
  const [phoneHint, setPhoneHint] = useState('');

  const game = useGame();

  const handleDrumStop = (sector: string | number) => {
    game.handleSector(sector);
  };

  const drum = useDrum(handleDrumStop);

  const cheatSector = (sector: string | number) => {
    if (drum.isSpinning) return;
    game.handleSector(sector);
  };

  // --- ОБРАБОТЧИК КЛАВИАТУРЫ ---
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Игнорируем ввод, если модалка открыта
      if (isModalOpen) return;

      // 1. ЛОГИКА ПРОБЕЛА (ВРАЩЕНИЕ)
      if (e.code === 'Space') {
        // Предотвращаем скролл страницы при нажатии пробела
        e.preventDefault();

        // Если сейчас стадия вращения и барабан стоит - крутим
        if (game.gameState === 'SPIN' && !drum.isSpinning) {
          drum.spin();
        }
        return;
      }

      // 2. ЛОГИКА БУКВ (УГАДЫВАНИЕ)
      if (game.gameState !== 'GUESS') return;

      let letter = '';
      if (/^[А-ЯЁа-яё]$/.test(e.key)) {
        letter = e.key.toUpperCase();
      } else if (KEY_MAP[e.code]) {
        letter = KEY_MAP[e.code];
      }

      if (letter) {
        onGuessLetter(letter);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [game.gameState, isModalOpen, drum.isSpinning, game.guessedLetters]);

  // --- ЛОГИКА ИГРЫ ---

  const onGuessLetter = (letter: string) => {
    const result = game.handleGuess(letter);
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
      setTimeout(() => {
        game.switchPlayer(result.newEliminated);
      }, 2000);
    }
  };

  const onPhoneEnd = () => {
    setIsModalOpen(false);
    game.setMessage('Друг дал подсказку. Ваш ход!');
    game.setGameState('GUESS');
  };

  const startNextRound = () => {
    game.nextLevel();
    setIsModalOpen(false);
    drum.setCurrentSector(null);
  };

  // Следим за изменением состояния для открытия модалок
  useEffect(() => {
    if (game.gameState === 'PRIZE_DECISION') {
      setModalType('PRIZE');
      setIsModalOpen(true);
    }
    if (game.gameState === 'PHONE_CALL') {
      const missingLetters = game.currentQuestion.word.split('').filter((l) => !game.guessedLetters.includes(l));
      const randomMissing = missingLetters.length > 0 ? missingLetters[0] : 'А';
      const hint =
        Math.random() > 0.5 ? randomMissing : 'АБВГДЕЖЗИКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯ'[Math.floor(Math.random() * 32)];
      setPhoneHint(hint);
      setModalType('PHONE');
      setIsModalOpen(true);
    }
  }, [game.gameState]);

  return {
    gameData: { ...game, question: game.currentQuestion.question, word: game.currentQuestion.word },
    drumData: { rotation: drum.rotation, isSpinning: drum.isSpinning },
    actions: {
      spinDrum: drum.spin,
      guessLetter: onGuessLetter,
      clickBoardLetter: onLetterClick,
      prizeChoice: onPrizeChoice,
      endPhoneCall: onPhoneEnd,
      closeModal: () => setIsModalOpen(false),
      nextRound: startNextRound,
      cheatSector,
    },
    modal: {
      isOpen: isModalOpen,
      type: modalType,
      phoneHint,
      winnerIndex: game.activePlayerIndex,
      word: game.currentQuestion.word,
    },
  };
};
