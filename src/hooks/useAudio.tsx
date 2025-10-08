import { useEffect, useRef, useCallback } from "react";
import { SOUND_EFFECTS, AUDIO_CONFIG, SoundEffect, BackgroundMusic } from "@/config/sounds";
import { audioManager } from "@/lib/audioManager";

export const useAudio = () => {
  const soundCache = useRef<Map<string, HTMLAudioElement>>(new Map());

  const preloadSound = useCallback((soundKey: SoundEffect) => {
    const soundUrl = SOUND_EFFECTS[soundKey];
    if (!soundCache.current.has(soundUrl)) {
      const audio = new Audio(soundUrl);
      audio.volume = AUDIO_CONFIG.sfxVolume;
      audio.preload = "auto";
      soundCache.current.set(soundUrl, audio);
    }
  }, []);

  const playSound = useCallback((soundKey: SoundEffect) => {
    if (!AUDIO_CONFIG.sfxEnabled) return;

    try {
      const soundUrl = SOUND_EFFECTS[soundKey];
      let audio = soundCache.current.get(soundUrl);

      if (!audio) {
        audio = new Audio(soundUrl);
        audio.volume = AUDIO_CONFIG.sfxVolume;
        soundCache.current.set(soundUrl, audio);
      }

      const audioClone = audio.cloneNode() as HTMLAudioElement;
      audioClone.volume = AUDIO_CONFIG.sfxVolume;
      audioClone.play().catch((error) => {
        console.warn("Error playing sound:", error);
      });
    } catch (error) {
      console.warn("Error playing sound:", error);
    }
  }, []);

  return { playSound, preloadSound };
};

export const useBackgroundMusic = (musicKey: BackgroundMusic | null) => {
  useEffect(() => {
    if (musicKey && AUDIO_CONFIG.musicEnabled) {
      audioManager.playMusic(musicKey);
    }

    return () => {
      // The decision to stop music is now managed by the next component's useBackgroundMusic hook
    };
  }, [musicKey]);
};

export const stopAllMusic = () => {
  audioManager.stopMusic();
};
