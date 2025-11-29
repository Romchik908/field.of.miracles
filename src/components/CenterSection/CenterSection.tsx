import React from 'react';
import { GameBoard } from '../GameBoard/GameBoard';
import { Controls } from '../Controls/Controls';
import { useGameContext } from '../../context/GameContext';
import styles from './CenterSection.module.scss'; // <-- Свои стили

export const CenterSection: React.FC = () => {
  const { controller } = useGameContext();
  const { gameData, actions } = controller;

  return (
    <div className={styles.centerLayer}>
      <div className={styles.wordSection}>
        <GameBoard
          word={gameData.word}
          guessedLetters={gameData.guessedLetters}
          onLetterClick={actions.clickBoardLetter}
          isInteractive={gameData.gameState === 'PLUS_SELECTION'}
        />
      </div>

      <div className={styles.bottomSection}>
        <div className={styles.questionBox}>{gameData.question}</div>

        <Controls
          gameState={gameData.gameState}
          message={gameData.message}
          onGuess={actions.guessLetter}
        />
      </div>
    </div>
  );
};
