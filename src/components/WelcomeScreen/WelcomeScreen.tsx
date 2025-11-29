import React from 'react';
import { Button } from '@skbkontur/react-ui';
import { hasSavedGame } from '../../utils/storage';
import { useGameContext } from '../../context/GameContext';
import styles from './WelcomeScreen.module.scss';

export const WelcomeScreen: React.FC = () => {
  const { startNewGame, continueGame, goToManualSetup } = useGameContext();
  const canContinue = hasSavedGame();

  return (
    <div className={styles.container}>
      <div className={styles.logo}>
        {/* Тут можно SVG логотип или просто текст с анимацией */}
        <h1 className={styles.title}>ПОЛЕ ЧУДЕС</h1>
        <div className={styles.subtitle}>Турнирная версия</div>
      </div>

      <div className={styles.menu}>
        {canContinue && (
          <Button onClick={continueGame} use="primary" size="large" width="100%">
            ПРОДОЛЖИТЬ ИГРУ
          </Button>
        )}

        <Button onClick={startNewGame} size="large" width="100%">
          НОВАЯ ИГРА
        </Button>

        <Button onClick={goToManualSetup} size="medium" width="100%">
          НАСТРОИТЬ РАУНД (Сбой)
        </Button>
      </div>
    </div>
  );
};
