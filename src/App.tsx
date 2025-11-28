import { GameLayout } from './components/GameLayout/GameLayout';
import { GameProvider } from './context/GameContext';

function App() {
  return (
    <GameProvider>
      <GameLayout />
    </GameProvider>
  );
}

export default App;
