import { Button } from '@skbkontur/react-ui';
import React from 'react';
import Confetti from 'react-confetti';
import { PRIZES } from '../../constants/prizes';
import { useSize } from '../../hooks/useSize';
import styles from './PrizeSummary.module.scss';

interface Props {
  wonPrizesIds: number[];
}

export const PrizeSummary: React.FC<Props> = ({ wonPrizesIds }) => {
  const { width, height } = useSize();

  const myPrizes = PRIZES.filter((p) => wonPrizesIds.includes(p.id));

  const handleRestart = () => {
    localStorage.clear();
    window.location.reload();
  };

  return (
    <div className={styles.container}>
      <Confetti width={width} height={height} numberOfPieces={200} />
      <h1 className={styles.title}>Поздравляем!</h1>
      <div className={styles.subtitle}>Вы выиграли следующие призы:</div>
      <div className={styles.grid}>
        {myPrizes.length > 0 ? (
          myPrizes.map((prize, i) => (
            <div key={prize.id} className={styles.card} style={{ animationDelay: `${i * 0.1}s` }}>
              <div className={styles.icon}>{prize.image}</div>
              <div className={styles.name}>{prize.name}</div>
            </div>
          ))
        ) : (
          <div className={styles.subtitle}>Ничего не выбрано... но главное — участие!</div>
        )}
      </div>
      <div className={styles.footer}>
        <Button onClick={handleRestart} use="primary" size="large">
          НАЧАТЬ НОВУЮ ИГРУ
        </Button>
      </div>
    </div>
  );
};
