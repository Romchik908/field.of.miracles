import React from 'react';
import Confetti from 'react-confetti';
import { useSize } from '../../hooks/useSize';
import styles from './WinnerScreen.module.scss';

interface Props {
  winnerName: string;
  winnerAvatar?: string;
  score: number;
  word: string;
  onNext: () => void;
  isSuperGame?: boolean;
}

export const WinnerScreen: React.FC<Props> = ({
  winnerName,
  winnerAvatar,
  score,
  word,
  isSuperGame,
}) => {
  const { width, height } = useSize();

  return (
    <div className={styles.container}>
      <Confetti
        width={width}
        height={height}
        numberOfPieces={isSuperGame ? 600 : 300}
        gravity={0.15}
        colors={
          isSuperGame
            ? ['#FFD700', '#FFA500', '#FFFFFF']
            : ['#fca311', '#ffffff', '#e63946', '#457b9d']
        }
      />

      <div className={`${styles.card} ${isSuperGame ? styles.superWin : ''}`}>
        <div className={styles.title}>
          {isSuperGame ? '🏆 ПОБЕДИТЕЛЬ СУПЕРИГРЫ 🏆' : 'Победитель раунда'}
        </div>

        <div className={styles.avatarWrapper}>
          <div className={styles.glow} />
          <img src={winnerAvatar} alt={winnerName} className={styles.avatar} />
        </div>

        <div className={styles.name}>{winnerName}</div>
        <div className={styles.score}>{score} очков</div>

        <div className={styles.wordInfo}>
          Угадал слово: <b>{word}</b>
        </div>
      </div>
    </div>
  );
};
