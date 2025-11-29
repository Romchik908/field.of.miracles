import React from 'react';
import type { Player } from '../../types';
import styles from './Scoreboard.module.scss';

interface Props {
  players: Player[];
  activePlayerIndex: number;
  eliminatedIndices: number[];
}

export const Scoreboard: React.FC<Props> = ({ players, activePlayerIndex, eliminatedIndices }) => {
  return (
    <div className={styles.scoreboard}>
      {players.map((player, index) => {
        const isEliminated = eliminatedIndices.includes(index);
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
            <img
              id={`player-avatar-${index}`}
              src={player.avatar}
              alt={player.name}
              className={styles.avatar}
            />
            <div className={styles.scoreWrapper}>
              <span className={styles.score}>{player.score}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
};
