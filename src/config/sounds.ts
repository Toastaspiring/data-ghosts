// Audio Configuration
// You can replace these URLs with your own sound files in public/sounds/

export const SOUND_EFFECTS = {
  // Button Sounds
  buttonClick: "/sounds/button-click.mp3",
  buttonHover: "/sounds/button-hover.mp3",
  
  // UI Sounds
  success: "/sounds/success.mp3",
  error: "/sounds/error.mp3",
  notification: "/sounds/notification.mp3",
  
  // Game Sounds
  puzzleSolved: "/sounds/puzzle-solved.mp3",
  codeEnter: "/sounds/code-enter.mp3",
  roomUnlock: "/sounds/room-unlock.mp3",
  tokenCollected: "/sounds/token-collected.mp3",
} as const;

export const BACKGROUND_MUSIC = {
  // Page-specific music
  landing: "/sounds/music/landing-cyberpunk.mp3",
  lobby: "/sounds/music/lobby-ambient.mp3",
  roomSelection: "/sounds/music/room-selection-tense.mp3",
  game: "/sounds/music/game-intense.mp3",
  leaderboard: "/sounds/music/leaderboard-victory.mp3",
} as const;

// Audio Settings
export const AUDIO_CONFIG = {
  // Volume levels (0.0 to 1.0)
  sfxVolume: 0.5,
  musicVolume: 0.3,
  
  // Fade durations (in ms)
  musicFadeIn: 1000,
  musicFadeOut: 800,
  
  // Music loop settings
  musicLoop: true,
  
  // Enable/disable audio
  sfxEnabled: true,
  musicEnabled: true,
} as const;

export type SoundEffect = keyof typeof SOUND_EFFECTS;
export type BackgroundMusic = keyof typeof BACKGROUND_MUSIC;
