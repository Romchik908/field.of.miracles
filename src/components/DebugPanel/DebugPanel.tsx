import React from 'react';
import { Button } from '@skbkontur/react-ui';
import { useGameContext } from '../../context/GameContext';

export const DebugPanel: React.FC = () => {
  const { actions } = useGameContext();

  const style: React.CSSProperties = {
    position: 'fixed',
    bottom: 10,
    right: 10,
    background: 'rgba(0,0,0,0.8)',
    padding: 10,
    borderRadius: 8,
    display: 'flex',
    gap: 5,
    flexWrap: 'wrap',
    maxWidth: 300,
    zIndex: 1000,
    border: '1px solid #555',
  };

  const cheats = [
    { label: '1000', val: 1000 },
    { label: 'x2', val: 'x2' },
    { label: '+', val: '+' },
    { label: 'Шанс', val: 'Ш' },
    { label: 'Приз', val: 'П' },
    { label: 'Банкрот', val: 'БАНКРОТ' },
  ];

  return (
    <div style={style}>
      <div style={{ width: '100%', color: '#aaa', fontSize: 12, marginBottom: 5 }}>DEBUG: Вызвать сектор</div>
      {cheats.map((c) => (
        <Button key={c.label} onClick={() => actions.cheatSector(c.val)} size="small">
          {c.label}
        </Button>
      ))}
    </div>
  );
};
