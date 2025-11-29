import React, { createContext, useContext, useEffect, useState } from 'react';
import { useGameController } from '../hooks/useGameController';
import type { GameSaveData } from '../types';
import { clearGame, loadGame, saveGame } from '../utils/storage';

interface GameContextType {
  controller: ReturnType<typeof useGameController>;
  appState: 'WELCOME' | 'GAME' | 'MANUAL_SETUP';
  goToWelcome: () => void;
  startNewGame: () => void;
  continueGame: () => void;
  startManualGame: (data: GameSaveData) => void;
  goToManualSetup: () => void;
}

const GameContext = createContext<GameContextType | null>(null);

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [appState, setAppState] = useState<'WELCOME' | 'GAME' | 'MANUAL_SETUP'>('WELCOME');
  const [initialData, setInitialData] = useState<GameSaveData | null>(null);
  const controller = useGameController(initialData);

  useEffect(() => {
    if (appState === 'GAME') {
      const dataToSave: GameSaveData = {
        roundIndex: controller.rawState.roundIndex,
        allPlayers: controller.rawState.allPlayers,
        finalists: controller.rawState.finalists,
        activePlayerLocalIndex: controller.rawState.activePlayerLocalIndex,
        guessedLetters: controller.gameData.guessedLetters,
        eliminatedLocalIndices: controller.rawState.eliminatedLocalIndices,
        gameState: controller.gameData.gameState,
        currentSectorValue: controller.gameData.currentSectorValue,
        consecutiveGuesses: controller.rawState.consecutiveGuesses,
      };
      saveGame(dataToSave);
    }
  }, [controller.rawState, appState]);

  const startNewGame = () => {
    clearGame();
    setInitialData(null);
    setAppState('GAME');
  };

  const continueGame = () => {
    const saved = loadGame();
    if (saved) {
      setInitialData(saved);
      setAppState('GAME');
    }
  };

  const startManualGame = (data: GameSaveData) => {
    clearGame();
    setInitialData(data);
    setAppState('GAME');
  };

  return (
    <GameContext.Provider
      value={{
        controller,
        appState,
        goToWelcome: () => setAppState('WELCOME'),
        startNewGame,
        continueGame,
        startManualGame,
        goToManualSetup: () => setAppState('MANUAL_SETUP'),
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

export const useGameContext = () => {
  const context = useContext(GameContext);
  if (!context) throw new Error('useGameContext must be used within GameProvider');
  return context;
};
