import React from 'react';
import { drumSectors } from '../../constants/gameData';

// Данные с картинки (40 секторов)
// Порядок по часовой стрелке

// Конфигурация
const RADIUS = 400; // Радиус колеса
const TEXT_RADIUS = 340; // Где стоит текст
const SECTOR_ANGLE = 360 / drumSectors.length; // 9 градусов

export const Wheel: React.FC = () => {
  // Функция для создания пути сектора (кусочка пирога)
  const createSectorPath = () => {
    const angle = (2 * Math.PI) / drumSectors.length;
    // Сдвигаем углы, чтобы сектор был центрирован относительно 0 градусов
    const startAngle = -angle / 2;
    const endAngle = angle / 2;

    const x1 = RADIUS * Math.sin(startAngle);
    const y1 = -RADIUS * Math.cos(startAngle);
    const x2 = RADIUS * Math.sin(endAngle);
    const y2 = -RADIUS * Math.cos(endAngle);

    // SVG команда: Move to 0,0 -> Line to start -> Arc to end -> Close
    return `M 0 0 L ${x1} ${y1} A ${RADIUS} ${RADIUS} 0 0 1 ${x2} ${y2} Z`;
  };

  return (
    <svg viewBox="-410 -410 820 820" width="100%" height="100%" style={{ overflow: 'visible' }}>
      {/* Тень колеса для красоты */}
      <circle r={RADIUS} fill="rgba(0,0,0,0.2)" transform="translate(5, 5)" />

      {/* Внешняя обводка */}
      <circle r={RADIUS + 5} fill="#ddd" stroke="#999" strokeWidth="2" />

      {/* Генерация секторов */}
      {drumSectors.map((sector, i) => {
        const isBlue = i % 2 !== 0; // Чередование цветов
        const bgColor = isBlue ? '#2a3b90' : '#ffffff';
        const textColor = isBlue ? '#ffffff' : '#2a3b90';

        return (
          <g key={i} transform={`rotate(${i * SECTOR_ANGLE})`}>
            {/* Сам сектор (треугольник/дуга) */}
            <path d={createSectorPath()} fill={bgColor} stroke="#ccc" strokeWidth="1" />

            {/* Текст значения */}
            <text
              x="0"
              y={-TEXT_RADIUS}
              fill={textColor}
              textAnchor="middle"
              dominantBaseline="middle"
              fontSize="24"
              fontWeight="bold"
              fontFamily="Arial, sans-serif"
              /* 
                 ИЗМЕНЕНИЕ ЗДЕСЬ:
                 rotate(180, 0, -TEXT_RADIUS)
                 Мы вращаем текст на 180 градусов вокруг его собственной точки привязки.
                 Теперь "верх" букв смотрит в центр круга.
                 Благодаря этому, когда сектор оказывается внизу (у стрелки), текст читается правильно.
              */
              transform={`rotate(180, 0, ${-TEXT_RADIUS})`}
            >
              {sector}
            </text>
          </g>
        );
      })}

      {/* Центральная заглушка */}
      <circle r="40" fill="#333" stroke="#555" strokeWidth="3" />
      <circle r="10" fill="#fca311" />
    </svg>
  );
};
