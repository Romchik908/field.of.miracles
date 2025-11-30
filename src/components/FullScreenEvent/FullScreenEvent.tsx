import React from 'react';
import styles from './FullScreenEvent.module.scss';

interface Props {
  title: string;
  icon: string;
  description?: string;
  actions?: React.ReactNode;
}

export const FullScreenEvent: React.FC<Props> = ({ title, icon, description, actions }) => {
  return (
    <div className={styles.overlay}>
      <div className={styles.icon}>{icon}</div>
      <h1 className={styles.title}>{title}</h1>
      {description && <p className={styles.description}>{description}</p>}
      {actions && <div className={styles.buttons}>{actions}</div>}
    </div>
  );
};
