import { useCallback, useState } from 'react';
import { drumSectors } from '../constants/gameData';

export const useDrum = (onStop: (sector: string | number) => void) => {
  const [rotation, setRotation] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);
  const [currentSector, setCurrentSector] = useState<string | number | null>(null);

  const spin = useCallback(() => {
    if (isSpinning) return;

    setIsSpinning(true);
    setCurrentSector(null);

    // 1. Генерируем случайное вращение
    // От 5 до 10 полных оборотов + случайный угол остановки
    const randomSpins = Math.floor(Math.random() * 5) + 5;
    const randomAngle = Math.floor(Math.random() * 360);

    // Прибавляем к текущему, чтобы вращение было плавным и продолжалось, а не сбрасывалось
    const newRotation = rotation + randomSpins * 360 + randomAngle;

    setRotation(newRotation);

    // 2. Ждем окончания анимации CSS (5 секунд)
    setTimeout(() => {
      setIsSpinning(false);

      // 3. Вычисляем выпавший сектор
      const anglePerSector = 360 / drumSectors.length;
      const normalizedRotation = newRotation % 360;

      // Формула расчета индекса:
      // (360 - normalizedRotation) -> инвертируем, так как вращение по часовой, а массив секторов тоже по часовой (относительно стрелки колесо движется против)
      // + 180 -> ВАЖНО: сдвигаем точку отсчета на 180 градусов, так как стрелка теперь СНИЗУ
      // + (anglePerSector / 2) -> сдвигаем на пол-сектора, чтобы определять центр сектора, а не край
      const effectiveAngle = (360 - normalizedRotation + 180 + anglePerSector / 2) % 360;

      const pointerIndex = Math.floor(effectiveAngle / anglePerSector);

      const sector = drumSectors[pointerIndex];
      setCurrentSector(sector);

      // Передаем результат в контроллер игры
      onStop(sector);
    }, 5000);
  }, [rotation, isSpinning, onStop]);

  return { rotation, isSpinning, currentSector, spin, setCurrentSector };
};
