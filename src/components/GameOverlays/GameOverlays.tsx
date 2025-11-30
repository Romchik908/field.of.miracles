import React, { useState } from 'react';
import { Button, Modal, Spinner, Input } from '@skbkontur/react-ui';
import { useGameContext } from '../../context/GameContext';
import { WinnerScreen } from '../WinnerScreen/WinnerScreen';
import { FullScreenEvent } from '../FullScreenEvent/FullScreenEvent';

export const GameOverlays: React.FC = () => {
  const { controller } = useGameContext();
  const { gameData, actions, modal, wordModal } = controller;

  const [wordInputValue, setWordInputValue] = useState('');

  // 1. ПОБЕДА (Самый высокий приоритет)
  if (modal.isOpen && modal.type === 'WIN') {
    return (
      <WinnerScreen
        winnerName={modal.winnerName}
        winnerAvatar={gameData.players.find((p) => p.name === modal.winnerName)?.avatar}
        score={gameData.players.find((p) => p.name === modal.winnerName)?.score || 0}
        word={modal.word}
        onNext={actions.nextRound}
      />
    );
  }

  // 2. ПОЛНОЭКРАННЫЕ СОБЫТИЯ (Приз, Шкатулки)
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
        description="В студию вносятся две шкатулки! В одной — деньги, другая пустая. Выберите одну из них (в реальности). Угадали?"
        actions={
          <Button onClick={actions.casketFinish} use="primary" size="large">
            ПРОДОЛЖИТЬ ИГРУ
          </Button>
        }
      />
    );
  }

  // 3. ОБЫЧНЫЕ МОДАЛКИ (Телефон)
  if (modal.isOpen && modal.type === 'PHONE') {
    return (
      <Modal onClose={() => {}} width={500}>
        <div style={{ color: '#333' }}>
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
      </Modal>
    );
  }

  // 4. МОДАЛКА ВВОДА СЛОВА
  if (wordModal.isOpen) {
    return (
      <Modal onClose={wordModal.close} width={400}>
        <div style={{ color: '#333' }}>
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
