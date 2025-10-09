// Audio Configuration
// You can replace these URLs with your own sound files in public/sounds/

export const SOUND_EFFECTS = {
  // Button Sounds
  buttonClick: "/sounds/click.wav",
  buttonHover: "/sounds/hover.wav",
  
  // UI Sounds
  success: "/sounds/success.mp3",
  typing: "/sounds/keyboard.wav",
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
  landing: "/sounds/landing-cyberpunk.mp3",
  lobby: "/sounds/lobby-tech-house.mp3", // Cool tech-house beat for lobby waiting
  roomSelection: "/sounds/mission-briefing.mp3", // Tension building for room selection
  game: "/sounds/loop-cyber.wav", // Use existing loop-cyber for game music
  leaderboard: "/sounds/victory-celebration.mp3", // Triumphant music for results
} as const;

// Audio Settings
export const AUDIO_CONFIG = {
  // Volume levels (0.0 to 1.0)
  sfxVolume: 0.5,
  musicVolume: 0.4, // Slightly higher volume for better lobby experience
  
  // Fade durations (in ms) - Enhanced for cooler transitions
  musicFadeIn: 1200, // Longer fade in for smoother transitions
  musicFadeOut: 900, // Slightly longer fade out for professional feel
  
  // Music loop settings
  musicLoop: true,
  
  // Enable/disable audio
  sfxEnabled: true,
  musicEnabled: true,
} as const;

export type SoundEffect = keyof typeof SOUND_EFFECTS;
export type BackgroundMusic = keyof typeof BACKGROUND_MUSIC;
