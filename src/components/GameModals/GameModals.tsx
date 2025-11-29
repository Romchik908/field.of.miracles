import React from 'react';
import { Button, Modal, Spinner } from '@skbkontur/react-ui';
import { useGameContext } from '../../context/GameContext';
import { Casket } from '../Casket/Casket';
import styles from './GameModals.module.scss';

export const GameModals: React.FC = () => {
  const { controller } = useGameContext();
  const { actions, modal } = controller;

  if (!modal.isOpen) return null;

  // WIN обрабатывается отдельно
  if (modal.type === 'WIN') return null;

  const renderContent = () => {
    switch (modal.type) {
      case 'PRIZE':
        return (
          <div className={styles.modalContent}>
            <Modal.Header>Сектор ПРИЗ!</Modal.Header>
            <Modal.Body>
              <p>
                Вы можете забрать приз и закончить игру (для текущего игрока), либо отказаться и
                продолжить угадывать буквы.
              </p>
              <div className={styles.prizeIcon}>🎁</div>
            </Modal.Body>
            <Modal.Footer panel>
              <div className={styles.footerButtons}>
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
          <div className={styles.modalContent}>
            <Modal.Header>Звонок другу</Modal.Header>
            <Modal.Body>
              <div className={styles.phoneContainer}>
                <p>Гудки...</p>
                <Spinner type="normal" caption="Звоним..." />
                <div className={styles.phoneHint}>
                  <p>Друг кричит в трубку:</p>
                  <p className={styles.hintText}>"Я думаю это буква {modal.phoneHint}!"</p>
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
          <div className={styles.modalContent}>
            <Modal.Header>ДВЕ ШКАТУЛКИ!</Modal.Header>
            <Modal.Body>
              <div className={styles.casketText}>
                {modal.casketResult === 'win' && (
                  <h3 className={styles.winText}>Поздравляем! Там деньги!</h3>
                )}
                {modal.casketResult === 'empty' && (
                  <h3 className={styles.loseText}>Увы, пусто...</h3>
                )}
                {!modal.casketResult && <p>Вы угадали 3 буквы подряд! Выберите шкатулку:</p>}
              </div>
              <div className={styles.casketContainer}>
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
    <Modal onClose={() => {}} width={500}>
      {renderContent()}
    </Modal>
  );
};
