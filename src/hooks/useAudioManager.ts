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

  return { isAudioUnlocked };
};