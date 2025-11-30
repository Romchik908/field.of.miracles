import { Button } from '@skbkontur/react-ui';
import React from 'react';
import styles from './Controls.module.scss';

interface Props {
  gameState: string;
  message: string;
  onGuess: (letter: string) => void;
  onWordGuessClick: () => void; // <-- Новый проп
}

export const Controls: React.FC<Props> = ({ gameState, message, onWordGuessClick }) => {
  return (
    <div className={styles.controlsArea}>
      <div className={styles.statusMessage}>{message}</div>

      {gameState === 'SPIN' && (
        <div className={styles.keyboardHint}>
          Нажмите <b>ПРОБЕЛ</b> или кликните по барабану
        </div>
      )}

      {gameState === 'GUESS' && (
        <>
          <div className={styles.keyboardHint}>Нажмите букву на клавиатуре...</div>

          <div style={{ marginTop: 15 }}>
            <Button onClick={onWordGuessClick} use="danger">
              Я НАЗОВУ СЛОВО!
            </Button>
          </div>
        </>
      )}
    </div>
  );
};
