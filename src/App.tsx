import { DARK_THEME, ThemeContext } from '@skbkontur/react-ui';
import { GameLayout } from './components/GameLayout/GameLayout';
import { IntroScreen } from './components/IntroScreen/IntroScreen';
import { ManualSetup } from './components/ManualSetup/ManualSetup';
import { GameProvider, useGameContext } from './context/GameContext';

const AppContent = () => {
  const { appState } = useGameContext();

  if (appState === 'WELCOME') return <IntroScreen />;
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
