import { useState, useCallback } from 'react';
import { drumSectors } from '../constants/gameData';

export const useDrum = (onStop: (sector: string | number) => void) => {
  const [rotation, setRotation] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);
  const [currentSector, setCurrentSector] = useState<string | number | null>(null);

  const spin = useCallback(() => {
    if (isSpinning) return;

    setIsSpinning(true);
    setCurrentSector(null);

    // --- ИЗМЕНЕНИЕ ЗДЕСЬ ---
    // Было: Math.floor(Math.random() * 3) + 2; (от 2 до 4 оборотов)
    // Стало: от 1 до 2 оборотов.
    // Барабан сделает всего 1 или 2 полных круга за 5 секунд.
    const randomSpins = Math.floor(Math.random() * 2) + 1;

    const randomAngle = Math.floor(Math.random() * 360);
    const newRotation = rotation + randomSpins * 360 + randomAngle;

    setRotation(newRotation);

    // Таймер остается 5 секунд (5000мс), чтобы анимация была медленной и плавной
    setTimeout(() => {
      setIsSpinning(false);

      const anglePerSector = 360 / drumSectors.length;
      const normalizedRotation = newRotation % 360;

      // Формула для стрелки СНИЗУ (+180 градусов)
      const effectiveAngle = (360 - normalizedRotation + 180 + anglePerSector / 2) % 360;

      const pointerIndex = Math.floor(effectiveAngle / anglePerSector);
      const sector = drumSectors[pointerIndex];

      setCurrentSector(sector);
      onStop(sector);
    }, 5000);
  }, [rotation, isSpinning, onStop]);

  return { rotation, isSpinning, currentSector, spin, setCurrentSector };
};
