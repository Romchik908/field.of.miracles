import { useState, useEffect } from 'react';
import { useGame } from './useGame';
import { useDrum } from './useDrum';
import { KEY_MAP } from '../constants/gameData';

export const useGameController = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<'WIN' | 'PRIZE' | 'PHONE' | 'CASKET'>('WIN');

  // Состояние для текста подсказки при звонке
  const [phoneHint, setPhoneHint] = useState('');

  // Состояние результата шкатулки (победа или пусто)
  const [casketResult, setCasketResult] = useState<'win' | 'empty' | null>(null);

  const [isCheatAnimationEnabled, setIsCheatAnimationEnabled] = useState(true);

  const game = useGame();
  const handleDrumStop = (sector: string | number) => game.handleSector(sector);
  const drum = useDrum(handleDrumStop);

  const cheatSector = (sector: string | number) => {
    if (drum.isSpinning) return;
    if (isCheatAnimationEnabled) drum.spinTo(sector);
    else game.handleSector(sector);
  };

  // Обработка клавиатуры
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Стелс-читы (Alt + ...)
      // (Код читов опущен для краткости, так как он не влияет на ошибку, но вы можете оставить тот, что был раньше)
      // Для примера оставим только базовые проверки:

      if (isModalOpen) return;

      if (e.code === 'Space') {
        e.preventDefault();
        if (game.gameState === 'SPIN' && !drum.isSpinning) drum.spin();
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
  }, [game.gameState, isModalOpen, drum.isSpinning, game.guessedLetters]);

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

  const startNextRound = () => {
    game.nextLevel();
    setIsModalOpen(false);
    drum.setCurrentSector(null);
  };

  // --- ВОТ ЗДЕСЬ БЫЛА ОШИБКА (восстановлена логика звонка) ---
  useEffect(() => {
    // 1. Приз
    if (game.gameState === 'PRIZE_DECISION') {
      setModalType('PRIZE');
      setIsModalOpen(true);
    }

    // 2. Звонок другу
    if (game.gameState === 'PHONE_CALL') {
      // Ищем буквы, которые еще не открыты
      const missingLetters = game.currentQuestion.word
        .split('')
        .filter((l) => !game.guessedLetters.includes(l));

      // Выбираем случайную неоткрытую букву (или 'А', если вдруг массив пуст)
      const randomMissing =
        missingLetters.length > 0
          ? missingLetters[Math.floor(Math.random() * missingLetters.length)]
          : 'А';

      // Друг может ошибиться (50% шанс)
      const hint =
        Math.random() > 0.5
          ? randomMissing
          : 'АБВГДЕЖЗИКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯ'[Math.floor(Math.random() * 32)];

      // ВОТ ЗДЕСЬ МЫ ИСПОЛЬЗУЕМ setPhoneHint
      setPhoneHint(hint);
      setModalType('PHONE');
      setIsModalOpen(true);
    }

    // 3. Шкатулки
    if (game.gameState === 'CASKET_SELECTION') {
      setCasketResult(null);
      setModalType('CASKET');
      setIsModalOpen(true);
    }
  }, [game.gameState]); // Зависимость только от gameState достаточно, данные внутри обновятся

  return {
    gameData: { ...game, question: game.currentQuestion.question, word: game.currentQuestion.word },
    drumData: { rotation: drum.rotation, isSpinning: drum.isSpinning },
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
      casketChoice: onCasketChoice,
      closeModal: () => setIsModalOpen(false),
      nextRound: startNextRound,
      cheatSector,
    },
    modal: {
      isOpen: isModalOpen,
      type: modalType,
      phoneHint, // Теперь переменная используется в UI
      casketResult,
      winnerIndex: game.activePlayerIndex,
      winnerName: game.players[game.activePlayerIndex]?.name,
      word: game.currentQuestion.word,
    },
  };
};
