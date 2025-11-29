import { useState, useCallback } from 'react';
import { drumSectors } from '../constants/gameData';

export const useDrum = (onStop: (sector: string | number) => void) => {
  const [rotation, setRotation] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);
  const [currentSector, setCurrentSector] = useState<string | number | null>(null);

  // Общая функция завершения вращения
  const finishSpin = useCallback(
    (finalRotation: number, callbackSector?: string | number) => {
      setTimeout(() => {
        setIsSpinning(false);

        const anglePerSector = 360 / drumSectors.length;
        const normalizedRotation = finalRotation % 360;

        // Формула для стрелки СНИЗУ (+180 градусов)
        const effectiveAngle = (360 - normalizedRotation + 180 + anglePerSector / 2) % 360;
        const pointerIndex = Math.floor(effectiveAngle / anglePerSector);

        // Если мы читерили, берем то, что заказывали (на случай микро-погрешностей математики),
        // иначе берем то, что реально выпало по математике
        const sector = callbackSector !== undefined ? callbackSector : drumSectors[pointerIndex];

        setCurrentSector(sector);
        onStop(sector);
      }, 5000); // Время анимации
    },
    [onStop],
  );

  // 1. Случайное вращение (Честная игра)
  const spin = useCallback(() => {
    if (isSpinning) return;
    setIsSpinning(true);
    setCurrentSector(null);

    const randomSpins = Math.floor(Math.random() * 2) + 1; // 1-2 оборота
    const randomAngle = Math.floor(Math.random() * 360);
    const newRotation = rotation + randomSpins * 360 + randomAngle;

    setRotation(newRotation);
    finishSpin(newRotation);
  }, [rotation, isSpinning, finishSpin]);

  // 2. Подкрученное вращение (ЧИТЫ)
  const spinTo = useCallback(
    (targetValue: string | number) => {
      if (isSpinning) return;
      setIsSpinning(true);
      setCurrentSector(null);

      // 1. Находим все индексы секторов с таким значением
      const matchingIndices = drumSectors
        .map((val, idx) => (val === targetValue ? idx : -1))
        .filter((idx) => idx !== -1);

      if (matchingIndices.length === 0) {
        console.error('Сектор не найден:', targetValue);
        setIsSpinning(false);
        return;
      }

      // 2. Выбираем случайный из подходящих секторов (чтобы не палиться одним местом)
      const targetIndex = matchingIndices[Math.floor(Math.random() * matchingIndices.length)];

      // 3. Рассчитываем угол
      const anglePerSector = 360 / drumSectors.length;
      // Целевой угол сектора (центр сектора)
      const sectorAngle = targetIndex * anglePerSector;

      // Нам нужно, чтобы этот угол оказался ВНИЗУ (180 градусов)
      // Текущий CSS rotate крутит по часовой.
      // Чтобы сектор N оказался внизу, нужно повернуть колесо на: 180 - sectorAngle.
      let targetRotation = 180 - sectorAngle;

      // Добавляем полные обороты (для зрелищности)
      const randomSpins = Math.floor(Math.random() * 2) + 1;
      targetRotation += randomSpins * 360;

      // Добавляем немного рандома внутри сектора (чтобы стрелка не била идеально в центр каждый раз)
      // Сдвиг в пределах 40% от ширины сектора в обе стороны
      const randomOffset = (Math.random() - 0.5) * (anglePerSector * 0.8);

      // Корректируем, чтобы колесо всегда крутилось вперед (добавляем 360, пока не станет больше текущего)
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
