import { Button } from '@skbkontur/react-ui';
import React from 'react';
import { useGameContext } from '../../context/GameContext';
import { hasSavedGame } from '../../utils/storage';
import { IntroBackground } from '../IntroBackground/IntroBackground';
import styles from './IntroScreen.module.scss';

export const IntroScreen: React.FC = () => {
  const { startNewGame, continueGame, goToManualSetup } = useGameContext();
  const canContinue = hasSavedGame();

  const titleWord1 = 'Поле';
  const titleWord2 = 'Чудес';
  // Обновленный текст
  const subtitleText = 'ЭКСТЕРН ШОУ';

  // Рендер букв заголовка (Поле Чудес)
  const renderTitleChars = (word: string, startDelay: number) => {
    return word.split('').map((char, index) => (
      <span
        key={`${word}-${index}`}
        className={styles.char}
        style={{ animationDelay: `${startDelay + index * 0.1}s` }}
      >
        {char}
      </span>
    ));
  };

  // Рендер букв подзаголовка
  const renderSubtitleChars = () => {
    // Начинаем анимацию, когда заголовок уже появился (через ~1.5с)
    const baseDelay = 1.5;

    return subtitleText.split('').map((char, index) => {
      // Пробел оставляем как есть
      if (char === ' ') return <span key={index} style={{ width: '15px' }}></span>;

      return (
        <span
          key={index}
          className={styles.subChar}
          style={{ animationDelay: `${baseDelay + index * 0.05}s` }}
        >
          {char}
        </span>
      );
    });
  };

  return (
    <IntroBackground>
      <div className={styles.container}>
        <div className={styles.contentWrapper}>
          {/* Логотип: Playfair Display */}
          <div className={styles.title}>
            <div style={{ display: 'flex' }}>{renderTitleChars(titleWord1, 0.2)}</div>

            <div style={{ display: 'flex' }}>
              {renderTitleChars(titleWord2, 0.2 + titleWord1.length * 0.1)}
            </div>
          </div>

          {/* Подзаголовок: Lab Grotesque (Montserrat) */}
          <div className={styles.subtitle}>{renderSubtitleChars()}</div>
        </div>

        {/* Меню кнопок */}
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
    </IntroBackground>
  );
};
