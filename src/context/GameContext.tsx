import React, { createContext, useContext, type ReactNode } from 'react';
import { useGameController } from '../hooks/useGameController';

// 1. Автоматически определяем тип того, что возвращает наш хук-контроллер
type GameContextType = ReturnType<typeof useGameController>;

// 2. Создаем контекст
const GameContext = createContext<GameContextType | null>(null);

// 3. Создаем Провайдер (Обертку)
export const GameProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Инициализируем всю логику игры здесь
  const controller = useGameController();

  return <GameContext.Provider value={controller}>{children}</GameContext.Provider>;
};

// 4. Создаем хук для удобного доступа к контексту
export const useGameContext = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGameContext должен использоваться внутри GameProvider');
  }
  return context;
};
