import { useState, useCallback } from 'react';
import { drumSectors } from '../constants/gameData';

export const useDrum = (onStop: (sector: string | number) => void) => {
  const [rotation, setRotation] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);
  const [currentSector, setCurrentSector] = useState<string | number | null>(null);

  // Общая функция завершения
  const finishSpin = useCallback(
    (_: number, callbackSector: string | number) => {
      setTimeout(() => {
        setIsSpinning(false);
        setCurrentSector(callbackSector);
        onStop(callbackSector);
      }, 5000);
    },
    [onStop],
  );

  // 1. Случайное вращение (Честное, но БЕЗ секторов "Ш")
  const spin = useCallback(() => {
    if (isSpinning) return;
    setIsSpinning(true);
    setCurrentSector(null);

    // Исключаем 'Ш' из доступных индексов для рандома
    const validIndices = drumSectors
      .map((val, idx) => (val === 'Ш' ? -1 : idx))
      .filter((idx) => idx !== -1);

    const targetIndex = validIndices[Math.floor(Math.random() * validIndices.length)];

    // Расчет угла
    const anglePerSector = 360 / drumSectors.length;
    const sectorAngle = targetIndex * anglePerSector;

    // 180 - т.к. стрелка внизу
    let targetRotation = 180 - sectorAngle;

    // 1-2 оборота (тяжелый барабан)
    const randomSpins = Math.floor(Math.random() * 2) + 1;
    targetRotation += randomSpins * 360;

    // Рандом внутри сектора
    const randomOffset = (Math.random() - 0.5) * (anglePerSector * 0.8);

    while (targetRotation < rotation + 360) {
      targetRotation += 360;
    }

    const finalRotation = targetRotation + randomOffset;

    setRotation(finalRotation);
    finishSpin(finalRotation, drumSectors[targetIndex]);
  }, [rotation, isSpinning, finishSpin]);

  // 2. Чит-вращение (В любую цель)
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
