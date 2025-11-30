import { Button } from '@skbkontur/react-ui';
import React, { useState } from 'react';
import { PRIZES } from '../../constants/prizes';
import styles from './PrizeShop.module.scss';

interface Props {
  playerScore: number;
  onFinish: (selectedIds: number[]) => void;
}

export const PrizeShop: React.FC<Props> = ({ playerScore, onFinish }) => {
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  const currentTotal = selectedIds.reduce((sum, id) => {
    const item = PRIZES.find((p) => p.id === id);
    return sum + (item ? item.price : 0);
  }, 0);

  const remainingBalance = playerScore - currentTotal;

  const toggleItem = (id: number, price: number) => {
    if (selectedIds.includes(id)) {
      setSelectedIds((prev) => prev.filter((i) => i !== id));
    } else {
      if (remainingBalance >= price) {
        setSelectedIds((prev) => [...prev, id]);
      }
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Подарки в студию!</h1>
        <div className={styles.balance}>
          Ваши очки: <span>{remainingBalance}</span> (Всего: {playerScore})
        </div>
      </div>

      <div className={styles.grid}>
        {PRIZES.map((prize) => {
          const isSelected = selectedIds.includes(prize.id);
          const canAfford = remainingBalance >= prize.price;
          const isDisabled = !isSelected && !canAfford;

          return (
            <div
              key={prize.id}
              className={`
                ${styles.card} 
                ${isSelected ? styles.selected : ''} 
                ${isDisabled ? styles.disabled : ''}
              `}
              onClick={() => !isDisabled && toggleItem(prize.id, prize.price)}
            >
              <div className={styles.icon}>{prize.image}</div>
              <div className={styles.name}>{prize.name}</div>
              <div className={styles.price}>{prize.price} очков</div>
            </div>
          );
        })}
      </div>

      <div className={styles.footer}>
        <div className={styles.total}>Выбрано на: {currentTotal}</div>
        <Button onClick={() => onFinish(selectedIds)} use="success" size="large">
          ЗАВЕРШИТЬ ИГРУ
        </Button>
      </div>
    </div>
  );
};
