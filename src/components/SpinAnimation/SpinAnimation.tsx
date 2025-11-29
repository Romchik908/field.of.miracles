import React, { useEffect } from 'react';
import styles from './SpinAnimation.module.scss';

interface Props {
  avatarUrl: string;
  startPos: { top: number; left: number; width: number }; // Новые пропсы
  onSpinStart: () => void;
  onAnimationEnd: () => void;
}

export const SpinAnimation: React.FC<Props> = ({
  avatarUrl,
  startPos,
  onSpinStart,
  onAnimationEnd,
}) => {
  useEffect(() => {
    const spinTimer = setTimeout(() => {
      onSpinStart();
    }, 1000);

    const endTimer = setTimeout(() => {
      onAnimationEnd();
    }, 1100);

    return () => {
      clearTimeout(spinTimer);
      clearTimeout(endTimer);
    };
  }, [onSpinStart, onAnimationEnd]);

  const customStyles = {
    '--start-top': `${startPos.top}px`,
    '--start-left': `${startPos.left}px`,
    '--start-width': `${startPos.width}px`,
  } as React.CSSProperties;

  return (
    <div className={styles.container} style={customStyles}>
      <div className={styles.avatarWrapper}>
        <img src={avatarUrl} alt="player" className={styles.avatar} />
        <div className={styles.hand}>🫱</div>
      </div>
    </div>
  );
};
