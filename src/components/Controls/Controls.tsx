import React from 'react';
import styles from './Controls.module.scss';

interface Props {
  gameState: string;
  message: string;
  onGuess: (letter: string) => void;
}

export const Controls: React.FC<Props> = ({ gameState, message }) => {
  return (
    <div className={styles.controlsArea}>
      <div className={styles.statusMessage}>{message}</div>

      <div className={styles.bottomHints}>
        {gameState === 'SPIN' && <span>Нажмите ПРОБЕЛ или кликните по барабану</span>}
        {gameState === 'GUESS' && <span>Нажмите букву на клавиатуре... (Раскладка не важна)</span>}
      </div>
    </div>
  );
};
