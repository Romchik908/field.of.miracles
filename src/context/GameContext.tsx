import React, { createContext, useContext, useState, useEffect } from 'react';
import { useGameController } from '../hooks/useGameController';
import { loadGame, saveGame, clearGame } from '../utils/storage';
import type { GameSaveData } from '../types';

// Тип контекста
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

  // Состояние для инициализации игры (null = дефолт)
  const [initialData, setInitialData] = useState<GameSaveData | null>(null);

  // Инициализируем контроллер с данными (если есть)
  const controller = useGameController(initialData);

  // --- АВТОСОХРАНЕНИЕ ---
  useEffect(() => {
    if (appState === 'GAME') {
      // Собираем данные из контроллера для сохранения
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
  }, [controller.rawState, appState]); // Сохраняем при любом изменении стейта

  const startNewGame = () => {
    clearGame();
    setInitialData(null); // Сброс в дефолт
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
    clearGame(); // Чистим старое автосохранение
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
