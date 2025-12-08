import { useState, useEffect } from 'react';
import { useGameContext } from '../context/GameContext';

export const useSpinAnimationLogic = () => {
  const { controller } = useGameContext();
  const { gameData, drumData, actions, modal, debug } = controller;

  const [isAnimating, setIsAnimating] = useState(false);
  const [animStartPos, setAnimStartPos] = useState({ top: 0, left: 0, width: 70 });

  const canSpin = gameData.gameState === 'SPIN' && !drumData.isSpinning && !isAnimating;

  const handleStartSpinning = () => {
    if (!canSpin) return;

    const activeIndex = gameData.activePlayerIndex;
    const avatarEl = document.getElementById(`player-avatar-${activeIndex}`);

    if (avatarEl) {
      const rect = avatarEl.getBoundingClientRect();
      setAnimStartPos({
        top: rect.top,
        left: rect.left,
        width: rect.width,
      });
    } else {
      setAnimStartPos({ top: window.innerHeight / 2, left: 100, width: 70 });
    }

    setIsAnimating(true);
  };

  useEffect(() => {
    if (debug.cheatSignal && canSpin) {
      console.log(debug.cheatSignal);
      actions.consumeCheatSignal();

      handleStartSpinning();
    }
  }, [debug.cheatSignal, canSpin]);

  useEffect(() => {
    const handleSpace = (e: KeyboardEvent) => {
      if (e.code === 'Space' && !modal.isOpen) {
        e.preventDefault();
        handleStartSpinning();
      }
    };
    window.addEventListener('keydown', handleSpace);
    return () => window.removeEventListener('keydown', handleSpace);
  }, [canSpin, modal.isOpen]);

  return {
    isAnimating,
    setIsAnimating,
    animStartPos,
    handleStartSpinning,
    canSpin,
    onRealSpin: actions.spinDrum,
    avatarUrl: gameData.players[gameData.activePlayerIndex]?.avatar,
  };
};
