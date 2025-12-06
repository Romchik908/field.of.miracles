import React from 'react';
import { useGameContext } from '../../context/GameContext';
import { FullScreenEvent } from '../FullScreenEvent/FullScreenEvent';
import { PrizeShop } from '../PrizeShop/PrizeShop';
import { PrizeSummary } from '../PrizeSummary/PrizeSummary';
import { WinnerScreen } from '../WinnerScreen/WinnerScreen';

export const GameOverlays: React.FC = () => {
  const { controller } = useGameContext();
  const { gameData, actions, modal } = controller;

  // 0. ЭКРАН ИТОГОВ (Самый финал)
  if (gameData.gameState === 'PRIZE_SUMMARY') {
    return <PrizeSummary wonPrizesIds={gameData.wonPrizesIds} />;
  }

  // 1. МАГАЗИН ПРИЗОВ
  if (gameData.gameState === 'PRIZE_SHOP') {
    return (
      <PrizeShop
        playerScore={gameData.players[gameData.activePlayerIndex]?.score || 0}
        onFinish={actions.finishPrizeShop}
      />
    );
  }

  // 2. ПОБЕДА (Раунд или Финал)
  if (modal.isOpen && modal.type === 'WIN') {
    const isSuperGame = gameData.roundIndex === 3;
    return (
      <WinnerScreen
        winnerName={modal.winnerName}
        winnerAvatar={gameData.players.find((p) => p.name === modal.winnerName)?.avatar}
        score={gameData.players.find((p) => p.name === modal.winnerName)?.score || 0}
        word={modal.word}
        onNext={actions.nextRound}
        isSuperGame={isSuperGame}
      />
    );
  }

  // 3. ПОЛНОЭКРАННЫЕ СОБЫТИЯ

  // СЕКТОР ПРИЗ
  if (modal.isOpen && modal.type === 'PRIZE') {
    return <FullScreenEvent title="СЕКТОР ПРИЗ!" icon="🎁" />;
  }

  // ДВЕ ШКАТУЛКИ (Оффлайн режим)
  if (modal.isOpen && modal.type === 'CASKET') {
    return <FullScreenEvent title="ДВЕ ШКАТУЛКИ" icon="🧳" />;
  }

  // ТЕЛЕФОН / ШАНС
  if (modal.isOpen && modal.type === 'PHONE') {
    return <FullScreenEvent title="СЕКТОР ШАНС" icon="📞" />;
  }

  return null;
};
