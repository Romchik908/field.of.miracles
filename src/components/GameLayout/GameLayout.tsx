import React from 'react';
import { useGameContext } from '../../context/GameContext';
import { useSpinAnimationLogic } from '../../hooks/useSpinAnimationLogic';

// Компоненты-блоки
import { CenterSection } from '../CenterSection/CenterSection'; // <-- Используем!
import { DebugPanel } from '../DebugPanel/DebugPanel';
import { DrumSection } from '../DrumSection/DrumSection';
import { GameOverlays } from '../GameOverlays/GameOverlays';
import { Scoreboard } from '../Scoreboard/Scoreboard';
import { SpinAnimation } from '../SpinAnimation/SpinAnimation';
import { WinnerScreen } from '../WinnerScreen/WinnerScreen';

import styles from './GameLayout.module.scss';

export const GameLayout: React.FC = () => {
  const { controller } = useGameContext();
  const { gameData, actions, modal } = controller;

  const {
    isAnimating,
    setIsAnimating,
    animStartPos,
    handleStartSpinning,
    canSpin,
    onRealSpin,
    avatarUrl,
  } = useSpinAnimationLogic();

  return (
    <div className={styles.appContainer}>
      {/* 1. Анимация персонажа (поверх всего в момент вращения) */}
      {isAnimating && (
        <SpinAnimation
          avatarUrl={avatarUrl}
          startPos={animStartPos}
          onSpinStart={onRealSpin}
          onAnimationEnd={() => setIsAnimating(false)}
        />
      )}

      {/* 2. Экран победы (самый верхний слой перекрытия) */}
      {modal.isOpen && modal.type === 'WIN' && (
        <WinnerScreen
          winnerName={modal.winnerName}
          winnerAvatar={gameData.players.find((p) => p.name === modal.winnerName)?.avatar}
          score={gameData.players.find((p) => p.name === modal.winnerName)?.score || 0}
          word={modal.word}
          onNext={actions.nextRound}
        />
      )}

      {/* 3. Оверлеи и модалки (Приз, Шкатулки, Ввод слова и т.д.) */}
      <GameOverlays />

      {/* 4. ОСНОВНОЙ ИНТЕРФЕЙС */}

      {/* Слева: Список игроков */}
      <div className={styles.scoreboardLayer}>
        <Scoreboard
          players={gameData.players}
          activePlayerIndex={gameData.activePlayerIndex}
          eliminatedIndices={gameData.eliminatedPlayers}
        />
      </div>

      {/* Сверху: Барабан */}
      <DrumSection canSpin={canSpin} onSpinClick={handleStartSpinning} />

      {/* Центр: Доска, Вопрос, Управление */}
      <CenterSection />

      {/* Утилиты */}
      <DebugPanel />
    </div>
  );
};
