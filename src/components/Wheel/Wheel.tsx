import React from 'react';
import { drumSectors } from '../../constants/gameData';

const RADIUS = 400;
const TEXT_RADIUS = 340;
const SECTOR_ANGLE = 360 / drumSectors.length;

export const Wheel: React.FC = () => {
  const createSectorPath = () => {
    const angle = (2 * Math.PI) / drumSectors.length;
    const startAngle = -angle / 2;
    const endAngle = angle / 2;

    const x1 = RADIUS * Math.sin(startAngle);
    const y1 = -RADIUS * Math.cos(startAngle);
    const x2 = RADIUS * Math.sin(endAngle);
    const y2 = -RADIUS * Math.cos(endAngle);

    return `M 0 0 L ${x1} ${y1} A ${RADIUS} ${RADIUS} 0 0 1 ${x2} ${y2} Z`;
  };

  return (
    <svg viewBox="-410 -410 820 820" width="100%" height="100%" style={{ overflow: 'visible' }}>
      {/* Тень колеса */}
      <circle r={RADIUS} fill="rgba(0,0,0,0.3)" transform="translate(5, 5)" />

      {/* Ободок */}
      <circle r={RADIUS + 5} fill="#ddd" stroke="#fff" strokeWidth="4" />

      {drumSectors.map((sector, i) => {
        const isOrange = i % 2 === 0;
        // НОВЫЕ ЦВЕТА: Оранжевый #FF6200 и Белый
        const bgColor = isOrange ? '#FF6200' : '#ffffff';
        const textColor = isOrange ? '#ffffff' : '#FF6200';

        return (
          <g key={i} transform={`rotate(${i * SECTOR_ANGLE})`}>
            <path d={createSectorPath()} fill={bgColor} stroke="#e0e0e0" strokeWidth="1" />
            <text
              x="0"
              y={-TEXT_RADIUS}
              fill={textColor}
              textAnchor="middle"
              dominantBaseline="middle"
              fontSize="32" // Чуть крупнее, т.к. секторов меньше
              fontWeight="bold"
              fontFamily="Arial, sans-serif"
              transform={`rotate(180, 0, ${-TEXT_RADIUS})`}
            >
              {sector}
            </text>
          </g>
        );
      })}

      {/* ЦЕНТРАЛЬНАЯ ЧАСТЬ УБРАНА (оставим маленькую точку оси) */}
      <circle r="15" fill="#333" stroke="#555" strokeWidth="2" />
    </svg>
  );
};
