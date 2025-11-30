import React from 'react';
import { Button } from '@skbkontur/react-ui';
import { hasSavedGame } from '../../utils/storage';
import { useGameContext } from '../../context/GameContext';
import styles from './IntroScreen.module.scss';

export const IntroScreen: React.FC = () => {
  const { startNewGame, continueGame, goToManualSetup } = useGameContext();
  const canContinue = hasSavedGame();

  const titleWord1 = 'Поле';
  const titleWord2 = 'Чудес';

  // Текст подзаголовка целиком (чтобы распределить space-between)
  // Добавляем пробел в массив, но в верстке он будет невидимым, просто занимать место или отступ
  const subtitleText = 'КАПИТАЛ ШОУ';

  // Рендер зажигающихся букв заголовка
  const renderTitleChars = (word: string, startDelay: number) => {
    return word.split('').map((char, index) => (
      <span
        key={`${word}-${index}`}
        className={styles.char}
        style={{ animationDelay: `${startDelay + index * 0.2}s` }}
      >
        {char}
      </span>
    ));
  };

  // Рендер букв подзаголовка (появляются после заголовка)
  const renderSubtitleChars = () => {
    // Вычисляем, когда закончится анимация заголовка
    // (Поле + Чудес = 9 букв * 0.2с = 1.8с + 0.5с старт = ~2.3с)
    const baseDelay = 2.5;

    return subtitleText.split('').map((char, index) => {
      // Если пробел - рендерим пустой span, он тоже участвует в распределении места
      if (char === ' ') return <span key={index} style={{ width: '20px' }}></span>;

      return (
        <span
          key={index}
          className={styles.subChar}
          style={{ animationDelay: `${baseDelay + index * 0.1}s` }}
        >
          {char}
        </span>
      );
    });
  };

  return (
    <div className={styles.container}>
      <div className={styles.rays} />

      <div className={styles.contentWrapper}>
        {/* ПОЛЕ ЧУДЕС */}
        <div className={styles.title}>
          <div style={{ display: 'flex' }}>{renderTitleChars(titleWord1, 0.5)}</div>

          <div style={{ display: 'flex' }}>
            {renderTitleChars(titleWord2, 0.5 + titleWord1.length * 0.2)}
          </div>
        </div>

        {/* КАПИТАЛ ШОУ (Растянуто на всю ширину) */}
        <div className={styles.subtitle}>{renderSubtitleChars()}</div>
      </div>

      <div className={styles.menu}>
        {canContinue && (
          <Button onClick={continueGame} use="primary" size="large" width="100%">
            ПРОДОЛЖИТЬ
          </Button>
        )}

        <Button onClick={startNewGame} size="large" width="100%">
          НОВАЯ ИГРА
        </Button>

        <Button onClick={goToManualSetup} size="medium" width="100%">
          НАСТРОИТЬ РАУНД
        </Button>
      </div>
    </div>
  );
};
