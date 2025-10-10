import { AUDIO_CONFIG, BACKGROUND_MUSIC, BackgroundMusic } from "@/config/sounds";

type Listener = (isUnlocked: boolean) => void;
type PermissionCallback = (showPrompt: boolean) => void;

class AudioManager {
  private static instance: AudioManager;
  private audioContext: AudioContext | null = null;
  private backgroundMusic: HTMLAudioElement | null = null;
  private mediaSource: MediaElementAudioSourceNode | null = null;
  private isUnlocked = false;
  private musicQueue: BackgroundMusic | null = null;
  private listeners: Listener[] = [];
  private permissionCallbacks: PermissionCallback[] = [];
  private userDeniedAudio = false;
  private permissionRequested = false;

  private constructor() {
    // Private constructor for singleton pattern
    // Always start fresh on page load - let modal show every time
  }

  public static getInstance(): AudioManager {
    if (!AudioManager.instance) {
      AudioManager.instance = new AudioManager();
    }
    return AudioManager.instance;
  }

  public getIsUnlocked = () => this.isUnlocked;

  public getAudioContext = () => this.audioContext;
  
  public getBackgroundMusic = () => this.backgroundMusic;

  public getMediaSource = () => this.mediaSource;

  public getUserDeniedAudio = () => this.userDeniedAudio;

  public addPermissionCallback(callback: PermissionCallback) {
    this.permissionCallbacks.push(callback);
  }

  public removePermissionCallback(callback: PermissionCallback) {
    this.permissionCallbacks = this.permissionCallbacks.filter(c => c !== callback);
  }

  private notifyPermissionCallbacks(showPrompt: boolean) {
    for (const callback of this.permissionCallbacks) {
      callback(showPrompt);
    }
  }

  public requestAudioPermission() {
    if (this.isUnlocked || this.userDeniedAudio || this.permissionRequested) {
      return;
    }
    
    this.permissionRequested = true;
    this.notifyPermissionCallbacks(true);
  }

  public forceShowPermissionModal() {
    // Force show modal unconditionally on page load
    this.permissionRequested = true;
    this.notifyPermissionCallbacks(true);
  }

  public grantAudioPermission() {
    this.userDeniedAudio = false;
    this.unlockAudio();
    this.notifyPermissionCallbacks(false);
    // Don't save to session storage - always ask on refresh
  }

  public denyAudioPermission() {
    this.userDeniedAudio = true;
    this.permissionRequested = true;
    this.notifyPermissionCallbacks(false);
    // Don't save to session storage - always ask on refresh
  }

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
    if (this.isUnlocked && this.audioContext) {
      // If already unlocked, just resume the audio context if suspended
      if (this.audioContext.state === 'suspended') {
        this.audioContext.resume();
      }
      return;
    }
    
    try {
      // Create audio context if we don't have one
      if (!this.audioContext) {
        this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      
      // Resume if suspended
      if (this.audioContext.state === 'suspended') {
        this.audioContext.resume();
      }
      
      // Play a silent sound to truly unlock audio
      const buffer = this.audioContext.createBuffer(1, 1, 22050);
      const source = this.audioContext.createBufferSource();
      source.buffer = buffer;
      source.connect(this.audioContext.destination);
      source.start();
      
      this.isUnlocked = true;

      if (this.musicQueue) {
        this.playMusic(this.musicQueue);
        this.musicQueue = null;
      }
      this.notifyListeners();
    } catch (error) {
      // If we still can't unlock, just fail silently
      // The permission modal should handle this
    }
  }

  public playMusic(musicKey: BackgroundMusic) {
    // If user denied audio, don't play
    if (this.userDeniedAudio) {
      return;
    }

    // If not unlocked, request permission
    if (!this.isUnlocked) {
      this.musicQueue = musicKey;
      this.requestAudioPermission();
      return;
    }

    // Resume audio context if it's suspended
    if (this.audioContext && this.audioContext.state === 'suspended') {
      this.audioContext.resume().then(() => {
        this.playMusic(musicKey); // Retry after resuming
      });
      return;
    }

    if (this.backgroundMusic && this.backgroundMusic.src.includes(BACKGROUND_MUSIC[musicKey])) {
      return;
    }

    if (this.backgroundMusic) {
      console.log("🔄 Stopping current music and starting new one");
      this.fadeOut(this.backgroundMusic, AUDIO_CONFIG.musicFadeOut, () => {
        this.backgroundMusic?.pause();
        this.startNewMusic(musicKey);
      });
    } else {
      console.log("🎵 Starting new music:", musicKey);
      this.startNewMusic(musicKey);
    }
  }

  private startNewMusic(musicKey: BackgroundMusic) {
    const musicUrl = BACKGROUND_MUSIC[musicKey];
    console.log("🎼 Starting new music:", musicKey, "URL:", musicUrl);
    
    this.backgroundMusic = new Audio(musicUrl);
    this.backgroundMusic.loop = AUDIO_CONFIG.musicLoop;
    this.backgroundMusic.volume = 0;

    // Create media source for Web Audio API if we have an audio context
    if (this.audioContext) {
      try {
        // Always create a new media source for new music
        console.log("🎧 Creating media source for Web Audio API");
        this.mediaSource = this.audioContext.createMediaElementSource(this.backgroundMusic);
        this.mediaSource.connect(this.audioContext.destination);
        console.log("✅ Media source created and connected");
      } catch (error) {
        console.warn("❌ Could not create media source:", error);
      }
    } else {
      console.warn("⚠️ No audio context available for media source");
    }

    console.log("▶️ Attempting to play music...");
    this.backgroundMusic.play().then(() => {
      console.log("🎉 Music started successfully, fading in...");
      this.fadeIn(this.backgroundMusic!, AUDIO_CONFIG.musicFadeIn, AUDIO_CONFIG.musicVolume);
    }).catch(error => {
      console.error("💥 Error playing background music:", error);
    });
  }

  public stopMusic() {
    if (this.backgroundMusic) {
      this.fadeOut(this.backgroundMusic, AUDIO_CONFIG.musicFadeOut, () => {
        this.backgroundMusic?.pause();
        this.backgroundMusic = null;
        this.mediaSource = null; // Reset media source when stopping music
      });
    }
  }

  public playMusicFromUrl(musicUrl: string) {
    // If user denied audio, don't play
    if (this.userDeniedAudio) {
      return;
    }
    
    if (!this.isUnlocked) {
      // Request permission instead of trying to auto-unlock
      this.requestAudioPermission();
      return;
    }

    // Resume audio context if it's suspended
    if (this.audioContext && this.audioContext.state === 'suspended') {
      this.audioContext.resume().then(() => {
        this.playMusicFromUrl(musicUrl); // Retry after resuming
      });
      return;
    }

    // Check if this music is already playing
    if (this.backgroundMusic && this.backgroundMusic.src.includes(musicUrl)) {
      console.log("🎶 Music already playing:", musicUrl);
      return;
    }

    // Fade out current music and start new one
    if (this.backgroundMusic) {
      console.log(`🔄 Fading out current music and starting new music: ${musicUrl}`);
      this.fadeOut(this.backgroundMusic, AUDIO_CONFIG.musicFadeOut, () => {
        this.backgroundMusic?.pause();
        this.startMusicFromUrl(musicUrl);
      });
    } else {
      console.log("🎵 Starting new music:", musicUrl);
      this.startMusicFromUrl(musicUrl);
    }
  }

  private startMusicFromUrl(musicUrl: string) {
    console.log("🎼 Starting music from URL:", musicUrl);
    
    this.backgroundMusic = new Audio(musicUrl);
    this.backgroundMusic.loop = AUDIO_CONFIG.musicLoop;
    this.backgroundMusic.volume = 0;

    // Create media source for Web Audio API if we have an audio context
    if (this.audioContext) {
      try {
        console.log("🎧 Creating media source for Web Audio API");
        this.mediaSource = this.audioContext.createMediaElementSource(this.backgroundMusic);
        this.mediaSource.connect(this.audioContext.destination);
        console.log("✅ Media source created and connected");
      } catch (error) {
        console.warn("❌ Could not create media source:", error);
      }
    } else {
      console.warn("⚠️ No audio context available for media source");
    }

    console.log("▶️ Attempting to play music...");
    this.backgroundMusic.play().then(() => {
      console.log("🎉 Music started successfully, fading in...");
      this.fadeIn(this.backgroundMusic!, AUDIO_CONFIG.musicFadeIn, AUDIO_CONFIG.musicVolume);
    }).catch(error => {
      console.error("💥 Error playing background music:", error);
    });
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