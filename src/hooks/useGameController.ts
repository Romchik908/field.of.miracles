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

// Секретные хоткеи (ALT + ...)
const CHEAT_KEYS: Record<string, string | number> = {
  Digit1: 1000,
  Digit2: 'x2',
  KeyP: 'П', // Alt + P = Приз
  KeyB: 'БАНКРОТ', // Alt + B = Банкрот
  KeyS: 'Ш', // Alt + S = Шанс (Звонок)
  Equal: '+', // Alt + = Плюс
};

export const useGameController = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<'WIN' | 'PRIZE' | 'PHONE'>('WIN');
  const [phoneHint, setPhoneHint] = useState('');

  // Состояние чекбокса из дебаг-панели
  const [isCheatAnimationEnabled, setIsCheatAnimationEnabled] = useState(true);

  const game = useGame();

  const handleDrumStop = (sector: string | number) => {
    game.handleSector(sector);
  };

  const drum = useDrum(handleDrumStop);

  // --- ЧИТ-ФУНКЦИЯ ---
  const cheatSector = (sector: string | number) => {
    if (drum.isSpinning) return;

    if (isCheatAnimationEnabled) {
      // КРУТИМ КРАСИВО (для стелса или если галочка стоит)
      drum.spinTo(sector);
    } else {
      // МГНОВЕННО (для быстрой отладки)
      game.handleSector(sector);
    }
  };

  // --- ОБРАБОТЧИК КЛАВИАТУРЫ ---
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // 0. СТЕЛС-ЧИТЫ (ALT + КЛАВИША)
      // Работают ВСЕГДА с анимацией, чтобы зрители не спалили
      if (e.altKey && CHEAT_KEYS[e.code]) {
        e.preventDefault();
        // Принудительно вызываем с анимацией
        if (!drum.isSpinning) drum.spinTo(CHEAT_KEYS[e.code]);
        return;
      }

      if (isModalOpen) return;

      // 1. ВРАЩЕНИЕ (ПРОБЕЛ)
      if (e.code === 'Space') {
        e.preventDefault();
        if (game.gameState === 'SPIN' && !drum.isSpinning) {
          drum.spin();
        }
        return;
      }

      // 2. ВВОД БУКВЫ
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

  // ... (Остальные функции без изменений: onGuessLetter, onLetterClick и т.д.) ...
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
    // Передаем состояние чекбокса и сеттер наружу
    debug: {
      isCheatAnimationEnabled,
      toggleCheatAnimation: () => setIsCheatAnimationEnabled((prev) => !prev),
    },
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
      winnerIndex: game.activePlayerIndex, // Индекс текущего победителя
      winnerName: game.players[game.activePlayerIndex].name, // <--- ИМЯ ПОБЕДИТЕЛЯ
      word: game.currentQuestion.word,
    },
  };
};
