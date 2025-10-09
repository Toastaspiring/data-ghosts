import { useState, useEffect } from 'react';
import { audioManager } from '@/lib/audioManager';

export const useAudioManager = () => {
  const [isAudioUnlocked, setIsAudioUnlocked] = useState(audioManager.getIsUnlocked());

  useEffect(() => {
    const handleUnlock = (unlocked: boolean) => {
      setIsAudioUnlocked(unlocked);
    };

    audioManager.addListener(handleUnlock);

    return () => {
      audioManager.removeListener(handleUnlock);
    };
  }, []);

  return { 
    isAudioUnlocked,
    playMusic: audioManager.playMusic.bind(audioManager),
    playMusicFromUrl: audioManager.playMusicFromUrl.bind(audioManager),
    stopMusic: audioManager.stopMusic.bind(audioManager),
    unlockAudio: audioManager.unlockAudio.bind(audioManager)
  };
};