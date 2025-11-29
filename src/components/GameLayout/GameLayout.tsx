import React from 'react';
import { Button, Modal, Spinner } from '@skbkontur/react-ui';
import { Wheel } from '../Wheel/Wheel';
import { Scoreboard } from '../Scoreboard/Scoreboard';
import { GameBoard } from '../GameBoard/GameBoard';
import { Controls } from '../Controls/Controls';
import { useGameContext } from '../../context/GameContext';
import { DebugPanel } from '../DebugPanel/DebugPanel';
import styles from './GameLayout.module.scss';

export const GameLayout: React.FC = () => {
  const { gameData, drumData, actions, modal } = useGameContext();

  const modalTextStyle = { color: '#333' };

  // Проверка: можно ли сейчас крутить барабан (нужно для кликабельности)
  const canSpin = gameData.gameState === 'SPIN' && !drumData.isSpinning;

  const renderModalContent = () => {
    switch (modal.type) {
      case 'WIN':
        return (
          <div style={modalTextStyle}>
            <Modal.Header>Победа!</Modal.Header>
            <Modal.Body>
              {/* Выводим имя победителя и угаданное слово */}
              <p>
                Победитель: <b>{modal.winnerName}</b>!
              </p>
              <p>
                Слово: <b>{modal.word}</b>
              </p>
            </Modal.Body>
            <Modal.Footer>
              <Button onClick={actions.nextRound} use="primary">
                Далее
              </Button>
            </Modal.Footer>
          </div>
        );

      case 'PRIZE':
        return (
          <div style={modalTextStyle}>
            <Modal.Header>Сектор ПРИЗ!</Modal.Header>
            <Modal.Body>
              <p>
                Вы можете забрать приз и закончить игру (для текущего игрока), либо отказаться и продолжить угадывать
                буквы.
              </p>
              <div style={{ fontSize: '50px', textAlign: 'center', margin: '20px 0' }}>🎁</div>
            </Modal.Body>
            <Modal.Footer panel>
              {/* Кнопки с отступом и центрированием */}
              <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', width: '100%' }}>
                <Button onClick={() => actions.prizeChoice(true)} use="primary" size="medium">
                  Забрать ПРИЗ
                </Button>
                <Button onClick={() => actions.prizeChoice(false)} size="medium">
                  Играть дальше
                </Button>
              </div>
            </Modal.Footer>
          </div>
        );

      case 'PHONE':
        return (
          <div style={modalTextStyle}>
            <Modal.Header>Звонок другу</Modal.Header>
            <Modal.Body>
              <div style={{ textAlign: 'center' }}>
                <p>Гудки...</p>
                <Spinner type="normal" caption="Звоним..." />
                <div style={{ marginTop: 20 }}>
                  <p>Друг кричит в трубку:</p>
                  <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#fca311' }}>
                    "Я думаю это буква {modal.phoneHint}!"
                  </p>
                </div>
              </div>
            </Modal.Body>
            <Modal.Footer>
              <Button onClick={actions.endPhoneCall} use="primary">
                Спасибо, друг
              </Button>
            </Modal.Footer>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className={styles.appContainer}>
      {/* 1. СЛОЙ ИГРОКОВ */}
      <div className={styles.scoreboardLayer}>
        <Scoreboard
          players={gameData.players}
          activePlayerIndex={gameData.activePlayerIndex}
          // Передаем массив индексов выбывших игроков для стилизации
          eliminatedIndices={gameData.eliminatedPlayers}
        />
      </div>

      {/* 2. СЛОЙ БАРАБАНА */}
      <div
        className={`${styles.drumLayer} ${canSpin ? styles.clickable : ''}`}
        // Клик по барабану запускает вращение (альтернатива пробелу)
        onClick={() => canSpin && actions.spinDrum()}
      >
        <div className={styles.drumCropWindow}>
          <div className={styles.drumWrapper}>
            <div className={styles.wheelContainer} style={{ transform: `rotate(${drumData.rotation}deg)` }}>
              <Wheel />
            </div>
          </div>
        </div>

        <div className={styles.arrow}>▼</div>
      </div>

      {/* 3. ЦЕНТРАЛЬНЫЙ СЛОЙ */}
      <div className={styles.centerLayer}>
        <div className={styles.wordSection}>
          <GameBoard
            word={gameData.word}
            guessedLetters={gameData.guessedLetters}
            // Обработчик для сектора "+"
            onLetterClick={actions.clickBoardLetter}
            // Интерактивность только в режиме выбора буквы
            isInteractive={gameData.gameState === 'PLUS_SELECTION'}
          />
        </div>

        <div className={styles.bottomSection}>
          <div className={styles.questionBox}>{gameData.question}</div>

          <Controls gameState={gameData.gameState} message={gameData.message} onGuess={actions.guessLetter} />
        </div>
      </div>

      {/* МОДАЛЬНЫЕ ОКНА */}
      {modal.isOpen && (
        <Modal onClose={() => {}} width={500}>
          {renderModalContent()}
        </Modal>
      )}

      {/* ДЕБАГ ПАНЕЛЬ */}
      <DebugPanel />
    </div>
  );
};
