import React from 'react';
import styles from './Casket.module.scss';

interface CasketProps {
  onClick: () => void;
  result: 'win' | 'empty' | null;
}

export const Casket: React.FC<CasketProps> = ({ onClick, result }) => {
  const isDisabled = result !== null;
  const content = result === 'win' ? '💰' : result === 'empty' ? '💨' : '?';

  return (
    <div
      className={`${styles.container} ${isDisabled ? styles.disabled : ''}`}
      onClick={() => !isDisabled && onClick()}
    >
      {content}
    </div>
  );
};
