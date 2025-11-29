import { ThemeContext, DARK_THEME } from '@skbkontur/react-ui';
import { GameProvider, useGameContext } from './context/GameContext';
import { GameLayout } from './components/GameLayout/GameLayout';
import { WelcomeScreen } from './components/WelcomeScreen/WelcomeScreen';
import { ManualSetup } from './components/ManualSetup/ManualSetup';

const AppContent = () => {
  // Убрали { controller }, оставили только appState, который нужен для роутинга
  const { appState } = useGameContext();

  if (appState === 'WELCOME') return <WelcomeScreen />;
  if (appState === 'MANUAL_SETUP') return <ManualSetup />;

  return <GameLayout />;
};

function App() {
  return (
    <ThemeContext.Provider value={DARK_THEME}>
      <GameProvider>
        <AppContent />
      </GameProvider>
    </ThemeContext.Provider>
  );
}

export default App;
