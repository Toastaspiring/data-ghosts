import { AUDIO_CONFIG, BACKGROUND_MUSIC, BackgroundMusic } from "@/config/sounds";

type Listener = (isUnlocked: boolean) => void;

class AudioManager {
  private static instance: AudioManager;
  private audioContext: AudioContext | null = null;
  private backgroundMusic: HTMLAudioElement | null = null;
  private isUnlocked = false;
  private musicQueue: BackgroundMusic | null = null;
  private listeners: Listener[] = [];

  private constructor() {
    // Private constructor for singleton pattern
  }

  public static getInstance(): AudioManager {
    if (!AudioManager.instance) {
      AudioManager.instance = new AudioManager();
    }
    return AudioManager.instance;
  }

  public getIsUnlocked = () => this.isUnlocked;

  public addListener(listener: Listener) {
    this.listeners.push(listener);
    listener(this.isUnlocked);
  }

  public removeListener(listener: Listener) {
    this.listeners = this.listeners.filter(l => l !== listener);
  }

  private notifyListeners() {
    for (const listener of this.listeners) {
      listener(this.isUnlocked);
    }
  }

  public unlockAudio() {
    if (this.isUnlocked) return;
    this.isUnlocked = true;
    this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();

    if (this.musicQueue) {
      this.playMusic(this.musicQueue);
      this.musicQueue = null;
    }
    this.notifyListeners();
  }

  public playMusic(musicKey: BackgroundMusic) {
    if (!this.isUnlocked) {
      this.musicQueue = musicKey;
      return;
    }

    if (this.backgroundMusic && this.backgroundMusic.src.includes(BACKGROUND_MUSIC[musicKey])) {
      return;
    }

    if (this.backgroundMusic) {
      this.fadeOut(this.backgroundMusic, AUDIO_CONFIG.musicFadeOut, () => {
        this.backgroundMusic?.pause();
        this.startNewMusic(musicKey);
      });
    } else {
      this.startNewMusic(musicKey);
    }
  }

  private startNewMusic(musicKey: BackgroundMusic) {
    const musicUrl = BACKGROUND_MUSIC[musicKey];
    this.backgroundMusic = new Audio(musicUrl);
    this.backgroundMusic.loop = AUDIO_CONFIG.musicLoop;
    this.backgroundMusic.volume = 0;

    this.backgroundMusic.play().then(() => {
      this.fadeIn(this.backgroundMusic!, AUDIO_CONFIG.musicFadeIn, AUDIO_CONFIG.musicVolume);
    }).catch(error => {
      console.error("Error playing background music:", error);
    });
  }

  public stopMusic() {
    if (this.backgroundMusic) {
      this.fadeOut(this.backgroundMusic, AUDIO_CONFIG.musicFadeOut, () => {
        this.backgroundMusic?.pause();
        this.backgroundMusic = null;
      });
    }
  }

  private fadeIn(audio: HTMLAudioElement, duration: number, targetVolume: number) {
    let volume = 0;
    audio.volume = volume;
    const fadeSteps = 50;
    const stepDuration = duration / fadeSteps;
    const volumeStep = targetVolume / fadeSteps;

    const fadeInterval = setInterval(() => {
      volume += volumeStep;
      if (volume >= targetVolume) {
        audio.volume = targetVolume;
        clearInterval(fadeInterval);
      } else {
        audio.volume = volume;
      }
    }, stepDuration);
  }

  private fadeOut(audio: HTMLAudioElement, duration: number, callback: () => void) {
    let volume = audio.volume;
    const fadeSteps = 50;
    const stepDuration = duration / fadeSteps;
    const volumeStep = volume / fadeSteps;

    const fadeInterval = setInterval(() => {
      volume -= volumeStep;
      if (volume <= 0) {
        audio.volume = 0;
        clearInterval(fadeInterval);
        callback();
      } else {
        audio.volume = volume;
      }
    }, stepDuration);
  }
}

export const audioManager = AudioManager.getInstance();