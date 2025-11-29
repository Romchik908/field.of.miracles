import React, { useState } from 'react';
import { Button, Select, Input, Gapped } from '@skbkontur/react-ui';
import { useGameContext } from '../../context/GameContext';
import styles from './ManualSetup.module.scss';
import { initialPlayers } from '../../constants/gameData';
import type { Player, GameSaveData } from '../../types';

export const ManualSetup: React.FC = () => {
  const { startManualGame, goToWelcome } = useGameContext();

  // Выбор раунда: 0, 1, 2 или 3 (Финал)
  const [selectedRound, setSelectedRound] = useState(0);

  // Данные победителей. Изначально берем дефолтных лидеров троек.
  const [winner1, setWinner1] = useState<Player>({ ...initialPlayers[0], score: 1000 });
  const [winner2, setWinner2] = useState<Player>({ ...initialPlayers[3], score: 1000 });
  const [winner3, setWinner3] = useState<Player>({ ...initialPlayers[6], score: 1000 });

  const handleStart = () => {
    const finalists: Player[] = [];
    // Собираем финалистов в зависимости от того, какой этап мы настраиваем
    if (selectedRound > 0) finalists.push(winner1);
    if (selectedRound > 1) finalists.push(winner2);
    if (selectedRound > 2) finalists.push(winner3);

    const data: GameSaveData = {
      roundIndex: selectedRound,
      allPlayers: initialPlayers,
      finalists: finalists,
      activePlayerLocalIndex: 0,
      guessedLetters: [],
      eliminatedLocalIndices: [],
      gameState: 'SPIN',
      currentSectorValue: null,
      consecutiveGuesses: 0,
    };

    startManualGame(data);
  };

  const rounds = [
    { label: 'Раунд 1 (Игроки 1-3)', value: 0 },
    { label: 'Раунд 2 (Игроки 4-6)', value: 1 },
    { label: 'Раунд 3 (Игроки 7-9)', value: 2 },
    { label: 'ФИНАЛ', value: 3 },
  ];

  // Хелпер для безопасного ввода очков (Защита от NaN и текста)
  const handleScoreChange = (value: string, setter: (p: Player) => void, currentPlayer: Player) => {
    // 1. Если пусто — ставим 0
    if (value === '') {
      setter({ ...currentPlayer, score: 0 });
      return;
    }
    // 2. Проверяем, что введены только цифры
    if (/^\d+$/.test(value)) {
      // Убираем ведущие нули (кроме случая когда просто "0")
      const numVal = parseInt(value, 10);
      setter({ ...currentPlayer, score: numVal });
    }
    // 3. Если введен текст — ничего не делаем (игнорируем ввод)
  };

  // Хелпер для рендера блока выбора победителя
  const renderWinnerSelect = (
    label: string,
    winnerState: Player,
    setWinnerState: (p: Player) => void,
    playerOptions: Player[], // Список доступных игроков для этого селекта
  ) => (
    <div className={styles.winnerBlock}>
      <h4>{label}</h4>
      <Gapped>
        {/* СЕЛЕКТ ИГРОКА */}
        <Select<Player>
          items={playerOptions}
          value={winnerState}
          renderItem={(p) => p.name}
          renderValue={(p) => p.name}
          onValueChange={(newPlayer) => {
            // При смене игрока сохраняем введенные очки, но меняем имя/аватар/id
            setWinnerState({ ...newPlayer, score: winnerState.score });
          }}
          width={200}
        />

        {/* ИНПУТ ОЧКОВ (Безопасный) */}
        <Input
          value={String(winnerState.score)}
          onValueChange={(v) => handleScoreChange(v, setWinnerState, winnerState)}
          placeholder="Очки"
          width={100}
        />
      </Gapped>
    </div>
  );

  return (
    <div className={styles.container}>
      <h2>Аварийное восстановление</h2>

      <div className={styles.form}>
        <label>С какого этапа начать?</label>

        <Select
          items={rounds}
          value={rounds.find((r) => r.value === selectedRound)}
          renderItem={(item) => item.label}
          renderValue={(item) => item.label}
          onValueChange={(item) => setSelectedRound(item.value)}
          width="100%"
        />

        {/* 
            Логика отображения полей:
            Для Раунда 2 нам нужно знать победителя Раунда 1.
            Для Раунда 3 — победителей 1 и 2.
            Для Финала — победителей 1, 2 и 3.
        */}

        {selectedRound > 0 &&
          renderWinnerSelect(
            'Победитель 1 раунда:',
            winner1,
            setWinner1,
            initialPlayers.slice(0, 3), // Только игроки 1-3
          )}

        {selectedRound > 1 &&
          renderWinnerSelect(
            'Победитель 2 раунда:',
            winner2,
            setWinner2,
            initialPlayers.slice(3, 6), // Только игроки 4-6
          )}

        {selectedRound > 2 &&
          renderWinnerSelect(
            'Победитель 3 раунда:',
            winner3,
            setWinner3,
            initialPlayers.slice(6, 9), // Только игроки 7-9
          )}

        <div className={styles.actions}>
          <Button onClick={goToWelcome}>Назад</Button>
          <Button use="success" size="large" onClick={handleStart}>
            ЗАПУСТИТЬ
          </Button>
        </div>
      </div>
    </div>
  );
};
