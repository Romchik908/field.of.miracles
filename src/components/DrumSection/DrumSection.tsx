import React from 'react';
import { useGameContext } from '../../context/GameContext';
import { Wheel } from '../Wheel/Wheel';
import styles from './DrumSection.module.scss';

interface DrumSectionProps {
  canSpin: boolean;
  onSpinClick: () => void;
}

export const DrumSection: React.FC<DrumSectionProps> = ({ canSpin, onSpinClick }) => {
  const { controller } = useGameContext();
  const { drumData } = controller;

  return (
    <div
      className={`${styles.drumLayer} ${canSpin ? styles.clickable : ''}`}
      onClick={() => canSpin && onSpinClick()}
    >
      <div className={styles.drumCropWindow}>
        <div className={styles.drumWrapper}>
          <div
            className={styles.wheelContainer}
            style={{ transform: `rotate(${drumData.rotation}deg)` }}
          >
            <Wheel />
          </div>
        </div>
      </div>

      <div className={styles.arrow}>▼</div>
    </div>
  );
};
