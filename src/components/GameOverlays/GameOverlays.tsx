import { Button, Input, Modal, Spinner } from '@skbkontur/react-ui';
import React, { useState } from 'react';
import { useGameContext } from '../../context/GameContext';
import { FullScreenEvent } from '../FullScreenEvent/FullScreenEvent';
import { PrizeShop } from '../PrizeShop/PrizeShop';
import { PrizeSummary } from '../PrizeSummary/PrizeSummary';
import { WinnerScreen } from '../WinnerScreen/WinnerScreen';
import styles from './GameOverlays.module.scss';

export const GameOverlays: React.FC = () => {
  const { controller } = useGameContext();
  const { gameData, actions, modal, wordModal } = controller;

  const [wordInputValue, setWordInputValue] = useState('');

  if (gameData.gameState === 'PRIZE_SUMMARY') {
    return <PrizeSummary wonPrizesIds={gameData.wonPrizesIds} />;
  }

  if (gameData.gameState === 'PRIZE_SHOP') {
    return (
      <PrizeShop
        playerScore={gameData.players[gameData.activePlayerIndex]?.score || 0}
        onFinish={actions.finishPrizeShop}
      />
    );
  }

  if (modal.isOpen && modal.type === 'WIN') {
    const isSuperGame = gameData.roundIndex === 3;
    return (
      <WinnerScreen
        winnerName={modal.winnerName}
        winnerAvatar={gameData.players.find((p) => p.name === modal.winnerName)?.avatar}
        score={gameData.players.find((p) => p.name === modal.winnerName)?.score || 0}
        word={modal.word}
        onNext={actions.nextRound}
        isSuperGame={isSuperGame}
      />
    );
  }

  if (modal.isOpen && modal.type === 'PRIZE') {
    return (
      <FullScreenEvent
        title="СЕКТОР ПРИЗ!"
        icon="🎁"
        description="Игрок может забрать приз и покинуть игру, либо отказаться и продолжить."
        actions={
          <>
            <Button onClick={() => actions.prizeChoice(true)} use="primary" size="large">
              ЗАБРАТЬ ПРИЗ
            </Button>
            <Button onClick={() => actions.prizeChoice(false)} size="large">
              ИГРАТЬ ДАЛЬШЕ
            </Button>
          </>
        }
      />
    );
  }

  if (modal.isOpen && modal.type === 'CASKET') {
    return (
      <FullScreenEvent
        title="ДВЕ ШКАТУЛКИ"
        icon="🧳"
        description="В студию вносятся две шкатулки! Выберите одну из них (в реальности). Если угадали — продолжаем с деньгами."
        actions={
          <Button onClick={actions.casketFinish} use="primary" size="large">
            ПРОДОЛЖИТЬ ИГРУ
          </Button>
        }
      />
    );
  }

  if (modal.isOpen && modal.type === 'PHONE') {
    return (
      <Modal onClose={() => {}} width={500}>
        <div className={styles.modalContent}>
          <Modal.Header>Звонок другу</Modal.Header>
          <Modal.Body>
            <div className={styles.phoneContainer}>
              <p>Гудки...</p>
              <Spinner type="normal" caption="Звоним..." />
              <div className={styles.phoneHint}>
                <p>Друг кричит в трубку:</p>
                <p className={styles.phoneHintText}>"Я думаю это буква {modal.phoneHint}!"</p>
              </div>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={actions.endPhoneCall} use="primary">
              Спасибо, друг
            </Button>
          </Modal.Footer>
        </div>
      </Modal>
    );
  }

  if (wordModal.isOpen) {
    return (
      <Modal onClose={wordModal.close} width={400}>
        <div className={styles.modalContent}>
          <Modal.Header>Назвать слово целиком</Modal.Header>
          <Modal.Body>
            <p>
              Внимание! Если вы ошибетесь, вы <b>выбываете</b> из текущего раунда!
            </p>
            <Input
              value={wordInputValue}
              onValueChange={setWordInputValue}
              size="large"
              width="100%"
              autoFocus
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  wordModal.submit(wordInputValue);
                  setWordInputValue('');
                }
              }}
            />
          </Modal.Body>
          <Modal.Footer panel>
            <Button
              onClick={() => {
                wordModal.submit(wordInputValue);
                setWordInputValue('');
              }}
              use="primary"
            >
              Ответить
            </Button>
          </Modal.Footer>
        </div>
      </Modal>
    );
  }

  return null;
};
