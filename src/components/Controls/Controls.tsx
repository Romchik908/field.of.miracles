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
      {gameState === 'SPIN' && (
        <div className={styles.keyboardHint}>
          Нажмите <b>ПРОБЕЛ</b> или кликните по барабану
        </div>
      )}
      {gameState === 'GUESS' && (
        <div className={styles.keyboardHint}>
          Нажмите букву на клавиатуре...
          <br />
          <span style={{ fontSize: '0.8em', opacity: 0.7 }}>(Раскладка не важна)</span>
        </div>
      )}
    </div>
  );
};
