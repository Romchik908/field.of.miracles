import { useState, useCallback } from 'react';
import { drumSectors } from '../constants/gameData';

export const useDrum = (onStop: (sector: string | number) => void) => {
  const [rotation, setRotation] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);
  const [currentSector, setCurrentSector] = useState<string | number | null>(null);

  const finishSpin = useCallback(
    (finalRotation: number, callbackSector?: string | number) => {
      setTimeout(() => {
        setIsSpinning(false);

        const anglePerSector = 360 / drumSectors.length;
        const normalizedRotation = finalRotation % 360;

        const effectiveAngle = (360 - normalizedRotation + 180 + anglePerSector / 2) % 360;
        const pointerIndex = Math.floor(effectiveAngle / anglePerSector);

        const sector = callbackSector !== undefined ? callbackSector : drumSectors[pointerIndex];

        setCurrentSector(sector);
        onStop(sector);
      }, 5000);
    },
    [onStop],
  );

  const spin = useCallback(() => {
    if (isSpinning) return;
    setIsSpinning(true);
    setCurrentSector(null);

    const randomSpins = Math.floor(Math.random() * 2) + 1;
    const randomAngle = Math.floor(Math.random() * 360);
    const newRotation = rotation + randomSpins * 360 + randomAngle;

    setRotation(newRotation);
    finishSpin(newRotation);
  }, [rotation, isSpinning, finishSpin]);

  const spinTo = useCallback(
    (targetValue: string | number) => {
      if (isSpinning) return;
      setIsSpinning(true);
      setCurrentSector(null);

      const matchingIndices = drumSectors
        .map((val, idx) => (val === targetValue ? idx : -1))
        .filter((idx) => idx !== -1);

      if (matchingIndices.length === 0) {
        console.error('Сектор не найден:', targetValue);
        setIsSpinning(false);
        return;
      }

      const targetIndex = matchingIndices[Math.floor(Math.random() * matchingIndices.length)];

      const anglePerSector = 360 / drumSectors.length;
      const sectorAngle = targetIndex * anglePerSector;

      let targetRotation = 180 - sectorAngle;

      const randomSpins = Math.floor(Math.random() * 2) + 1;
      targetRotation += randomSpins * 360;

      const randomOffset = (Math.random() - 0.5) * (anglePerSector * 0.8);

      while (targetRotation < rotation + 360) {
        targetRotation += 360;
      }

      const finalRotation = targetRotation + randomOffset;

      setRotation(finalRotation);
      finishSpin(finalRotation, targetValue);
    },
    [rotation, isSpinning, finishSpin],
  );

  return { rotation, isSpinning, currentSector, spin, spinTo, setCurrentSector };
};
