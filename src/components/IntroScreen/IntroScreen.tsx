import { Button } from '@skbkontur/react-ui';
import React from 'react';
import { useGameContext } from '../../context/GameContext';
import { hasSavedGame } from '../../utils/storage';
import styles from './IntroScreen.module.scss';

export const IntroScreen: React.FC = () => {
  const { startNewGame, continueGame, goToManualSetup } = useGameContext();
  const canContinue = hasSavedGame();

  const titleWord1 = 'Поле';
  const titleWord2 = 'Чудес';

  const subtitleText = 'КАПИТАЛ ШОУ';

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

  const renderSubtitleChars = () => {
    const baseDelay = 2.5;

    return subtitleText.split('').map((char, index) => {
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
        <div className={styles.title}>
          <div style={{ display: 'flex' }}>{renderTitleChars(titleWord1, 0.5)}</div>
          <div style={{ display: 'flex' }}>
            {renderTitleChars(titleWord2, 0.5 + titleWord1.length * 0.2)}
          </div>
        </div>
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
