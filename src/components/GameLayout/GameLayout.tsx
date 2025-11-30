import React from 'react';
import { useGameContext } from '../../context/GameContext';
import { useSpinAnimationLogic } from '../../hooks/useSpinAnimationLogic';
import { CenterSection } from '../CenterSection/CenterSection';
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
      {isAnimating && (
        <SpinAnimation
          avatarUrl={avatarUrl}
          startPos={animStartPos}
          onSpinStart={onRealSpin}
          onAnimationEnd={() => setIsAnimating(false)}
        />
      )}
      {modal.isOpen && modal.type === 'WIN' && (
        <WinnerScreen
          winnerName={modal.winnerName}
          winnerAvatar={gameData.players.find((p) => p.name === modal.winnerName)?.avatar}
          score={gameData.players.find((p) => p.name === modal.winnerName)?.score || 0}
          word={modal.word}
          onNext={actions.nextRound}
        />
      )}
      <GameOverlays />
      <div className={styles.scoreboardLayer}>
        <Scoreboard
          players={gameData.players}
          activePlayerIndex={gameData.activePlayerIndex}
          eliminatedIndices={gameData.eliminatedPlayers}
        />
      </div>
      <DrumSection canSpin={canSpin} onSpinClick={handleStartSpinning} />
      <CenterSection />
      <DebugPanel />
    </div>
  );
};
