import { useEffect, useRef, useCallback } from "react";
import { SOUND_EFFECTS, BACKGROUND_MUSIC, AUDIO_CONFIG, SoundEffect, BackgroundMusic } from "@/config/sounds";

// Global audio instances for background music
let currentMusic: HTMLAudioElement | null = null;
let musicFadeInterval: NodeJS.Timeout | null = null;

export const useAudio = () => {
  const soundCache = useRef<Map<string, HTMLAudioElement>>(new Map());

  // Preload sound effect
  const preloadSound = useCallback((soundKey: SoundEffect) => {
    const soundUrl = SOUND_EFFECTS[soundKey];
    if (!soundCache.current.has(soundUrl)) {
      const audio = new Audio(soundUrl);
      audio.volume = AUDIO_CONFIG.sfxVolume;
      audio.preload = "auto";
      soundCache.current.set(soundUrl, audio);
    }
  }, []);

  // Play sound effect
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

      // Clone the audio to allow multiple simultaneous plays
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

// Hook for background music management
export const useBackgroundMusic = (musicKey: BackgroundMusic | null) => {
  useEffect(() => {
    if (!musicKey || !AUDIO_CONFIG.musicEnabled) {
      return;
    }

    const musicUrl = BACKGROUND_MUSIC[musicKey];

    // Fade out current music
    const fadeOutAndPlay = () => {
      if (currentMusic && !currentMusic.paused) {
        fadeOut(currentMusic, AUDIO_CONFIG.musicFadeOut, () => {
          currentMusic?.pause();
          currentMusic = null;
          playNewMusic(musicUrl);
        });
      } else {
        playNewMusic(musicUrl);
      }
    };

    fadeOutAndPlay();

    // Cleanup on unmount
    return () => {
      if (currentMusic) {
        fadeOut(currentMusic, AUDIO_CONFIG.musicFadeOut, () => {
          currentMusic?.pause();
          currentMusic = null;
        });
      }
    };
  }, [musicKey]);
};

// Helper function to play new music
const playNewMusic = (musicUrl: string) => {
  try {
    const audio = new Audio(musicUrl);
    audio.volume = 0;
    audio.loop = AUDIO_CONFIG.musicLoop;

    audio.play().then(() => {
      currentMusic = audio;
      fadeIn(audio, AUDIO_CONFIG.musicFadeIn, AUDIO_CONFIG.musicVolume);
    }).catch((error) => {
      console.warn("Error playing music:", error);
    });
  } catch (error) {
    console.warn("Error creating music:", error);
  }
};

// Fade in function
const fadeIn = (audio: HTMLAudioElement, duration: number, targetVolume: number) => {
  const steps = 20;
  const stepDuration = duration / steps;
  const volumeStep = targetVolume / steps;
  let currentStep = 0;

  if (musicFadeInterval) clearInterval(musicFadeInterval);

  musicFadeInterval = setInterval(() => {
    currentStep++;
    audio.volume = Math.min(volumeStep * currentStep, targetVolume);

    if (currentStep >= steps) {
      if (musicFadeInterval) clearInterval(musicFadeInterval);
      musicFadeInterval = null;
    }
  }, stepDuration);
};

// Fade out function
const fadeOut = (audio: HTMLAudioElement, duration: number, callback?: () => void) => {
  const steps = 20;
  const stepDuration = duration / steps;
  const initialVolume = audio.volume;
  const volumeStep = initialVolume / steps;
  let currentStep = 0;

  if (musicFadeInterval) clearInterval(musicFadeInterval);

  musicFadeInterval = setInterval(() => {
    currentStep++;
    audio.volume = Math.max(initialVolume - volumeStep * currentStep, 0);

    if (currentStep >= steps) {
      if (musicFadeInterval) clearInterval(musicFadeInterval);
      musicFadeInterval = null;
      if (callback) callback();
    }
  }, stepDuration);
};

// Stop all music
export const stopAllMusic = () => {
  if (currentMusic) {
    fadeOut(currentMusic, AUDIO_CONFIG.musicFadeOut, () => {
      currentMusic?.pause();
      currentMusic = null;
    });
  }
};
