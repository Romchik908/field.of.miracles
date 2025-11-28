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
      {/* Сообщение от игры (кто ходит, сколько очков) */}
      <div className={styles.statusMessage}>{message}</div>

      {/* Подсказка для стадии ВРАЩЕНИЯ */}
      {gameState === 'SPIN' && (
        <div className={styles.keyboardHint}>
          Нажмите <b>ПРОБЕЛ</b> или кликните по барабану
        </div>
      )}

      {/* Подсказка для стадии УГАДЫВАНИЯ */}
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
