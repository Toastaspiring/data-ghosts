import { RoomConfig } from './core/types';

// Import all room configurations
import { tiktokFarmConfig } from './rooms/tiktok-farm/config';
import { fakeScenesConfig } from './rooms/fake-scenes/config';
import { videoEditorsConfig } from './rooms/video-editors/config';
import { finalDestructionConfig } from './rooms/final-destruction/config';

// Room mapping for assignment numbers
export const ROOM_CONFIGS: Record<number, RoomConfig> = {
  1: tiktokFarmConfig,
  2: fakeScenesConfig,
  3: videoEditorsConfig,
  4: finalDestructionConfig
};

// Get room config by assignment number
export const getRoomConfig = (roomNumber: number): RoomConfig | null => {
  return ROOM_CONFIGS[roomNumber] || null;
};

// Get room config by room ID
export const getRoomConfigById = (roomId: string): RoomConfig | null => {
  return Object.values(ROOM_CONFIGS).find(config => config.id === roomId) || null;
};

// Get room number by room ID
export const getRoomNumber = (roomId: string): number | null => {
  const entry = Object.entries(ROOM_CONFIGS).find(([_, config]) => config.id === roomId);
  return entry ? parseInt(entry[0]) : null;
};