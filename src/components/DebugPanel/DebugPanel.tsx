import React from 'react';
import { Button, Checkbox } from '@skbkontur/react-ui';
import { useGameContext } from '../../context/GameContext';
import styles from './DebugPanel.module.scss';

export const DebugPanel: React.FC = () => {
  // ИСПРАВЛЕНИЕ:
  // Раньше было: const { actions, debug } = useGameContext();
  // Теперь данные лежат внутри объекта controller
  const { controller } = useGameContext();
  const { actions, debug } = controller;

  const cheats = [
    { label: '1000', val: 1000 },
    { label: 'x2', val: 'x2' },
    { label: '+', val: '+' },
    { label: 'Шанс', val: 'Ш' },
    { label: 'Приз', val: 'П' },
  ];

  return (
    <div className={styles.panel}>
      <div className={styles.header}>Debug Control (Alt + Key)</div>

      <Checkbox checked={debug.isCheatAnimationEnabled} onValueChange={debug.toggleCheatAnimation}>
        Включить анимацию
      </Checkbox>

      <div className={styles.buttonsRow}>
        {cheats.map((c) => (
          <Button key={c.label} onClick={() => actions.cheatSector(c.val)}>
            {c.label}
          </Button>
        ))}
      </div>
    </div>
  );
};
