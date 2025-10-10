import { useState, useEffect } from 'react';
import { audioManager } from '@/lib/audioManager';

export const useAudioPermission = () => {
  const [showPermissionModal, setShowPermissionModal] = useState(false);
  const [userDeniedAudio, setUserDeniedAudio] = useState(false);

  useEffect(() => {
    const handlePermissionCallback = (showPrompt: boolean) => {
      setShowPermissionModal(showPrompt);
    };

    // Update denied state
    setUserDeniedAudio(audioManager.getUserDeniedAudio());

    audioManager.addPermissionCallback(handlePermissionCallback);

    return () => {
      audioManager.removePermissionCallback(handlePermissionCallback);
    };
  }, []);

  const grantPermission = () => {
    audioManager.grantAudioPermission();
    setShowPermissionModal(false);
    setUserDeniedAudio(false);
  };

  const denyPermission = () => {
    audioManager.denyAudioPermission();
    setShowPermissionModal(false);
    setUserDeniedAudio(true);
  };

  return {
    showPermissionModal,
    userDeniedAudio,
    grantPermission,
    denyPermission
  };
};