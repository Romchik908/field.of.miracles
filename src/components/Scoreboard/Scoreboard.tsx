import React from 'react';
import styles from './Scoreboard.module.scss';
import type { Player } from '../../types';

interface Props {
  players: Player[];
  activePlayerIndex: number;
  eliminatedIndices: number[]; // Добавили проп
}

export const Scoreboard: React.FC<Props> = ({ players, activePlayerIndex, eliminatedIndices }) => {
  return (
    <div className={styles.scoreboard}>
      {players.map((player, index) => {
        // Проверяем, выбыл ли игрок
        const isEliminated = eliminatedIndices.includes(index);
        // Проверяем, активен ли (только если не выбыл)
        const isActive = !isEliminated && index === activePlayerIndex;

        return (
          <div
            key={player.id}
            className={`
              ${styles.playerCard} 
              ${isActive ? styles.active : ''}
              ${isEliminated ? styles.eliminated : ''}
            `}
          >
            <span className={styles.name}>{player.name}</span>

            <img src={player.avatar} alt={player.name} className={styles.avatar} />

            <div className={styles.scoreWrapper}>
              <span className={styles.score}>{player.score}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
};
