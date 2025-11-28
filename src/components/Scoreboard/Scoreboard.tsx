import React from 'react';
import type { Player } from '../../types';
import styles from './Scoreboard.module.scss';

interface Props {
  players: Player[];
  activePlayerIndex: number;
}

export const Scoreboard: React.FC<Props> = ({ players, activePlayerIndex }) => {
  return (
    <div className={styles.scoreboard}>
      <h3>Игроки</h3>
      {players.map((player, index) => (
        <div key={player.id} className={`${styles.playerCard} ${index === activePlayerIndex ? styles.active : ''}`}>
          <span>Игрок {player.id}</span>
          <span className={styles.score}>{player.score}</span>
        </div>
      ))}
    </div>
  );
};
