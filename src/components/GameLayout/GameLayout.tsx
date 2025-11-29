import React from 'react';
import { Button, Modal, Spinner } from '@skbkontur/react-ui';
import { Wheel } from '../Wheel/Wheel';
import { Scoreboard } from '../Scoreboard/Scoreboard';
import { GameBoard } from '../GameBoard/GameBoard';
import { Controls } from '../Controls/Controls';
import { useGameContext } from '../../context/GameContext';
import { DebugPanel } from '../DebugPanel/DebugPanel';
import { WinnerScreen } from '../WinnerScreen/WinnerScreen'; // Импортируем экран победы
import styles from './GameLayout.module.scss';

export const GameLayout: React.FC = () => {
  // Получаем контроллер из контекста
  const { controller } = useGameContext();
  const { gameData, drumData, actions, modal } = controller;

  const modalTextStyle = { color: '#333' };
  const canSpin = gameData.gameState === 'SPIN' && !drumData.isSpinning;

  // Компонент шкатулки
  const Casket = ({ onClick, result }: { onClick: () => void; result: 'win' | 'empty' | null }) => {
    const isDisabled = result !== null;
    const content = result === 'win' ? '💰' : result === 'empty' ? '💨' : '?';

    return (
      <div
        onClick={() => !isDisabled && onClick()}
        style={{
          width: '100px',
          height: '90px',
          background: result ? '#f0f0f0' : 'linear-gradient(to bottom, #8B4513, #CD853F)',
          border: '4px solid #5D4037',
          borderRadius: '10px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '40px',
          cursor: isDisabled ? 'default' : 'pointer',
          boxShadow: '0 5px 15px rgba(0,0,0,0.5)',
          transition: 'transform 0.2s',
          transform: isDisabled ? 'scale(1)' : 'scale(1.05)',
        }}
      >
        {content}
      </div>
    );
  };

  // Рендер контента для стандартных модалок (Приз, Звонок, Шкатулки)
  // WIN здесь больше нет, он обрабатывается отдельно
  const renderModalContent = () => {
    switch (modal.type) {
      case 'PRIZE':
        return (
          <div style={modalTextStyle}>
            <Modal.Header>Сектор ПРИЗ!</Modal.Header>
            <Modal.Body>
              <p>
                Вы можете забрать приз и закончить игру (для текущего игрока), либо отказаться и
                продолжить угадывать буквы.
              </p>
              <div style={{ fontSize: '50px', textAlign: 'center', margin: '20px 0' }}>🎁</div>
            </Modal.Body>
            <Modal.Footer panel>
              <div
                style={{ display: 'flex', gap: '20px', justifyContent: 'center', width: '100%' }}
              >
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

      case 'CASKET':
        return (
          <div style={modalTextStyle}>
            <Modal.Header>ДВЕ ШКАТУЛКИ!</Modal.Header>
            <Modal.Body>
              <div style={{ textAlign: 'center', marginBottom: 20 }}>
                {modal.casketResult === 'win' && (
                  <h3 style={{ color: 'green' }}>Поздравляем! Там деньги!</h3>
                )}
                {modal.casketResult === 'empty' && <h3 style={{ color: 'gray' }}>Увы, пусто...</h3>}
                {!modal.casketResult && <p>Вы угадали 3 буквы подряд! Выберите шкатулку:</p>}
              </div>
              <div
                style={{ display: 'flex', gap: '40px', justifyContent: 'center', padding: '20px' }}
              >
                <Casket onClick={actions.casketChoice} result={modal.casketResult} />
                <Casket onClick={actions.casketChoice} result={modal.casketResult} />
              </div>
            </Modal.Body>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className={styles.appContainer}>
      {/* --- ПОЛНОЭКРАННЫЙ ОВЕРЛЕЙ ПОБЕДЫ --- */}
      {modal.isOpen && modal.type === 'WIN' && (
        <WinnerScreen
          winnerName={modal.winnerName}
          // Находим игрока в списке, чтобы взять его аватар и очки
          winnerAvatar={gameData.players.find((p) => p.name === modal.winnerName)?.avatar}
          score={gameData.players.find((p) => p.name === modal.winnerName)?.score || 0}
          word={modal.word}
          onNext={actions.nextRound}
        />
      )}

      {/* --- ОСНОВНОЙ ИНТЕРФЕЙС ИГРЫ --- */}

      <div className={styles.scoreboardLayer}>
        <Scoreboard
          players={gameData.players}
          activePlayerIndex={gameData.activePlayerIndex}
          eliminatedIndices={gameData.eliminatedPlayers}
        />
      </div>

      <div
        className={`${styles.drumLayer} ${canSpin ? styles.clickable : ''}`}
        onClick={() => canSpin && actions.spinDrum()}
      >
        <div className={styles.drumCropWindow}>
          <div className={styles.drumWrapper}>
            <div
              className={styles.wheelContainer}
              style={{ transform: `rotate(${drumData.rotation}deg)` }}
            >
              <Wheel />
            </div>
          </div>
        </div>
        <div className={styles.arrow}>▼</div>
      </div>

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

      {/* --- ОБЫЧНЫЕ МОДАЛКИ (Приз, Телефон, Шкатулки) --- */}
      {/* Рендерим только если открыто И тип не WIN */}
      {modal.isOpen && modal.type !== 'WIN' && (
        <Modal onClose={() => {}} width={500}>
          {renderModalContent()}
        </Modal>
      )}

      {/* Панель отладки */}
      <DebugPanel />
    </div>
  );
};
