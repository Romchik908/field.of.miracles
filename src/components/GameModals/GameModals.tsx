import { Button, Modal, Spinner } from '@skbkontur/react-ui';
import React from 'react';
import { useGameContext } from '../../context/GameContext';
import styles from './GameModals.module.scss';

export const GameModals: React.FC = () => {
  const { controller } = useGameContext();
  const { actions, modal } = controller;

  if (!modal.isOpen) return null;

  if (['WIN', 'PRIZE', 'CASKET'].includes(modal.type)) return null;

  const renderContent = () => {
    switch (modal.type) {
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
