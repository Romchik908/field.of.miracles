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
      <circle r={RADIUS} fill="rgba(0,0,0,0.2)" transform="translate(5, 5)" />
      <circle r={RADIUS + 5} fill="#ddd" stroke="#999" strokeWidth="2" />
      {drumSectors.map((sector, i) => {
        const isBlue = i % 2 !== 0;
        const bgColor = isBlue ? '#2a3b90' : '#ffffff';
        const textColor = isBlue ? '#ffffff' : '#2a3b90';

        return (
          <g key={i} transform={`rotate(${i * SECTOR_ANGLE})`}>
            <path d={createSectorPath()} fill={bgColor} stroke="#ccc" strokeWidth="1" />
            <text
              x="0"
              y={-TEXT_RADIUS}
              fill={textColor}
              textAnchor="middle"
              dominantBaseline="middle"
              fontSize="24"
              fontWeight="bold"
              fontFamily="Arial, sans-serif"
              transform={`rotate(180, 0, ${-TEXT_RADIUS})`}
            >
              {sector}
            </text>
          </g>
        );
      })}
      <circle r="40" fill="#333" stroke="#555" strokeWidth="3" />
      <circle r="10" fill="#fca311" />
    </svg>
  );
};
