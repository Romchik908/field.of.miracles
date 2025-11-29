import { Button } from '@skbkontur/react-ui';
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
}

export const WinnerScreen: React.FC<Props> = ({
  winnerName,
  winnerAvatar,
  score,
  word,
  onNext,
}) => {
  const { width, height } = useSize();

  return (
    <div className={styles.container}>
      {/* Конфетти на весь экран */}
      <Confetti
        width={width}
        height={height}
        numberOfPieces={300}
        gravity={0.15}
        colors={['#fca311', '#ffffff', '#e63946', '#457b9d']}
      />

      <div className={styles.card}>
        <div className={styles.title}>Победитель раунда</div>

        <div className={styles.avatarWrapper}>
          <div className={styles.glow} />
          <img src={winnerAvatar} alt={winnerName} className={styles.avatar} />
        </div>

        <div className={styles.name}>{winnerName}</div>
        <div className={styles.score}>{score} очков</div>

        <div className={styles.wordInfo}>
          Угадал слово: <b>{word}</b>
        </div>

        <Button onClick={onNext} use="primary" size="large">
          ПРОДОЛЖИТЬ
        </Button>
      </div>
    </div>
  );
};
