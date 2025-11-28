import React from 'react';
import styles from './GameBoard.module.scss';

interface Props {
  word: string;
  guessedLetters: string[];
  onLetterClick?: (index: number) => void;
  isInteractive?: boolean;
}

export const GameBoard: React.FC<Props> = ({ word, guessedLetters, onLetterClick, isInteractive }) => {
  return (
    <div className={styles.wordBoard}>
      {word.split('').map((char, i) => {
        const isOpen = guessedLetters.includes(char);

        return (
          <div
            // ВАЖНО: word в ключе сбрасывает компонент при смене слова
            key={`${word}-${i}`}
            className={`${styles.letterBox} ${isOpen ? styles.open : ''}`}
            onClick={() => isInteractive && !isOpen && onLetterClick?.(i)}
            style={{ cursor: isInteractive && !isOpen ? 'pointer' : 'default' }}
          >
            {char}
          </div>
        );
      })}
    </div>
  );
};
