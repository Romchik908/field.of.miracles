import React from 'react';
import styles from './Scoreboard.module.scss';
import type { Player } from '../../types';

interface Props {
  players: Player[];
  activePlayerIndex: number;
}

export const Scoreboard: React.FC<Props> = ({ players, activePlayerIndex }) => {
  return (
    <div className={styles.scoreboard}>
      {players.map((player, index) => (
        <div key={player.id} className={`${styles.playerCard} ${index === activePlayerIndex ? styles.active : ''}`}>
          {/* Имя сверху */}
          <span className={styles.name}>{player.name}</span>

          {/* Аватарка по центру */}
          <img src={player.avatar} alt={player.name} className={styles.avatar} />

          {/* Очки снизу */}
          <div className={styles.scoreWrapper}>
            <span className={styles.score}>{player.score}</span>
          </div>
        </div>
      ))}
    </div>
  );
};
