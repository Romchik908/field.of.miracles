import { DARK_THEME, ThemeContext } from '@skbkontur/react-ui';
import { GameLayout } from './components/GameLayout/GameLayout';
import { GameProvider } from './context/GameContext';

function App() {
  return (
    <ThemeContext.Provider value={DARK_THEME}>
      <GameProvider>
        <GameLayout />
      </GameProvider>
    </ThemeContext.Provider>
  );
}

export default App;
