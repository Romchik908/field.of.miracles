import type { GameSaveData } from '../types';

const STORAGE_KEY = 'pole_chudes_autosave';

export const saveGame = (data: GameSaveData) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (e) {
    console.error('Failed to save game', e);
  }
};

export const loadGame = (): GameSaveData | null => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : null;
  } catch (e) {
    console.error('Failed to load game', e);
    return null;
  }
};

export const clearGame = () => {
  localStorage.removeItem(STORAGE_KEY);
};

export const hasSavedGame = (): boolean => {
  return !!localStorage.getItem(STORAGE_KEY);
};
