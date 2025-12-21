import { useCallback } from 'react';
import spin from '../sounds/spin.mp3';
import correct from '../sounds/correct.mp3';
import wrong from '../sounds/wrong.mp3';
import win from '../sounds/win.mp3';

type SoundConfig = Record<
  'spin' | 'correct' | 'wrong' | 'win' | 'sector',
  { path: string; duration?: number }
>;

const SOUND_CONFIG: SoundConfig = {
  spin: { path: spin, duration: 7 },
  correct: { path: correct },
  wrong: { path: wrong },
  win: { path: win },
  sector: { path: spin, duration: 5 },
};

export const useGameSounds = () => {
  const playSound = useCallback((name: 'spin' | 'correct' | 'wrong' | 'win' | 'sector') => {
    try {
      const audioConfig = SOUND_CONFIG[name];
      const audio = new Audio(audioConfig.path);
      console.log(audio);
      audio.volume = 0.1; // Громкость 50%
      audio.play().catch((e) => console.warn('Audio play failed', e));
      if (audioConfig.duration) {
        window.setTimeout(() => {
          audio.pause();
          audio.currentTime = 0;
        }, audioConfig.duration * 1000);
      }
    } catch (e) {
      console.error('Audio error', e);
    }
  }, []);

  return { playSound };
};
