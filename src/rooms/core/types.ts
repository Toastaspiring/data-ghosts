// Core TypeScript interfaces for the room system

export interface Position {
  x: number;
  y: number;
}

export interface Size {
  width: number;
  height: number;
}

export interface Bounds {
  x: number;
  y: number;
  w: number;
  h: number;
}

export interface ThemeConfig {
  primary: {
    neon: string;
    glow: string;
    dark: string;
  };
  environment: 'underwater' | 'archaeological' | 'mountain' | 'space';
  ambientSound?: string;
  backgroundMusic?: string;
}

export interface LayoutConfig {
  background: string;
  width: number;
  height: number;
  zones: ZoneConfig[];
  effects?: EffectConfig[];
}

export interface ZoneConfig {
  id: string;
  bounds: Bounds;
  theme?: string;
  interactive?: boolean;
}

export interface EffectConfig {
  type: 'particles' | 'animation' | 'ambient';
  config: Record<string, any>;
}

export interface ValidationConfig {
  type: 'exact' | 'pattern' | 'range' | 'custom';
  correctAnswer?: any;
  correctSequence?: any[];
  correctPattern?: any;
  validator?: (input: any) => boolean;
  attempts?: number;
}

export interface RewardConfig {
  type: 'clue' | 'unlock' | 'item' | 'score' | 'crossRoom';
  data?: any;
  elementIds?: string[];
  targetRoom?: string;
  clueData?: CrossRoomClue;
}

export interface CrossRoomClue {
  sourceRoom: string;
  targetRoom: string;
  clueType: string;
  value: any;
  description: string;
}

export interface PuzzleConfig {
  id: string;
  type: PuzzleType;
  difficulty: 1 | 2 | 3 | 4 | 5;
  timeLimit?: number;
  component: string;
  data: Record<string, any>;
  validation: ValidationConfig;
  hints?: string[];
  rewards: RewardConfig[];
}

export interface ElementConfig {
  id: string;
  type: ElementType;
  name: string;
  description: string;
  position: Position;
  size: Size;
  component?: string;
  puzzle?: PuzzleConfig;
  dependencies: string[];
  rewards: RewardConfig[];
  isUnlocked?: boolean;
  isSolved?: boolean;
}

export interface AudioConfig {
  ambient?: string;
  background?: string;
  effects: Record<string, string>;
  volume: {
    master: number;
    ambient: number;
    effects: number;
  };
}

export interface TimingConfig {
  totalTime?: number; // in seconds
  puzzleTimeouts: Record<string, number>;
  hintCooldowns: Record<string, number>;
}

export interface RoomConfig {
  id: string;
  name: string;
  description: string;
  theme: ThemeConfig;
  layout: LayoutConfig;
  elements: ElementConfig[];
  audio: AudioConfig;
  timing: TimingConfig;
  metadata: {
    difficulty: 1 | 2 | 3 | 4 | 5;
    estimatedTime: number; // in minutes
    minPlayers: number;
    maxPlayers: number;
    tags: string[];
  };
}

export interface RoomState {
  config: RoomConfig;
  elementStates: Record<string, ElementState>;
  discoveredClues: Clue[];
  inventory: InventoryItem[];
  progress: {
    percentage: number;
    elementsCompleted: number;
    totalElements: number;
    timeElapsed: number;
  };
  status: 'loading' | 'ready' | 'playing' | 'paused' | 'completed' | 'failed';
}

export interface ElementState {
  id: string;
  isUnlocked: boolean;
  isSolved: boolean;
  isActive: boolean;
  attempts: number;
  hintsUsed: number;
  timeSpent: number;
  lastInteraction?: Date;
  puzzleState?: any;
}

export interface Clue {
  id: string;
  sourceElement: string;
  sourceRoom: string;
  type: 'local' | 'crossRoom' | 'shared';
  title: string;
  description: string;
  data: any;
  discoveredAt: Date;
  isShared?: boolean;
}

export interface InventoryItem {
  id: string;
  name: string;
  description: string;
  type: 'tool' | 'document' | 'sample' | 'key' | 'data';
  icon: string;
  obtainedFrom: string;
  obtainedAt: Date;
}

export interface PuzzleState {
  id: string;
  config: PuzzleConfig;
  status: 'idle' | 'active' | 'solved' | 'failed' | 'timeout';
  attempts: number;
  hintsUsed: number;
  timeSpent: number;
  startedAt?: Date;
  completedAt?: Date;
  currentInput?: any;
  validationResult?: ValidationResult;
}

export interface ValidationResult {
  isValid: boolean;
  score?: number;
  feedback?: string;
  hints?: string[];
  nextStep?: string;
}

export interface ProgressUpdate {
  roomId: string;
  playerId: string;
  percentage: number;
  elementsCompleted: string[];
  newClues: Clue[];
  timeElapsed: number;
  timestamp: Date;
}

export interface RoomResults {
  roomId: string;
  playerId: string;
  completed: boolean;
  score: number;
  timeElapsed: number;
  elementsCompleted: string[];
  cluesDiscovered: Clue[];
  hintsUsed: number;
  attempts: Record<string, number>;
  finalState: RoomState;
}

export interface GameState {
  rooms: Record<string, RoomState>;
  players: Record<string, PlayerState>;
  sharedClues: Clue[];
  globalProgress: number;
  gameStatus: 'lobby' | 'playing' | 'completed' | 'abandoned';
  startedAt?: Date;
  completedAt?: Date;
  totalTime: number;
}

export interface PlayerState {
  id: string;
  name: string;
  currentRoom: string | null;
  assignedRoom?: string;
  score: number;
  completedRooms: string[];
  discoveredClues: Clue[];
  inventory: InventoryItem[];
  status: 'idle' | 'playing' | 'completed';
  lastActivity: Date;
}

// Enums and Types

export type ElementType = 
  | 'equipment' 
  | 'document' 
  | 'specimen' 
  | 'computer' 
  | 'tool' 
  | 'artifact'
  | 'sample'
  | 'device'
  | 'terminal';

export type PuzzleType = 
  | 'pattern' 
  | 'code' 
  | 'analysis' 
  | 'sequence' 
  | 'collaboration'
  | 'mini-game'
  | 'memory'
  | 'logic'
  | 'spatial'
  | 'temporal';

export type InteractionType = 
  | 'click' 
  | 'hover' 
  | 'drag' 
  | 'long-press'
  | 'double-click'
  | 'gesture';

export type AnimationType = 
  | 'glow' 
  | 'pulse' 
  | 'float' 
  | 'shake'
  | 'fade'
  | 'slide'
  | 'scale'
  | 'rotate';

// Event Types

export interface RoomEvent {
  type: string;
  roomId: string;
  playerId: string;
  timestamp: Date;
  data: any;
}

export interface ElementInteractionEvent extends RoomEvent {
  type: 'element-interaction';
  data: {
    elementId: string;
    interactionType: InteractionType;
    elementState: ElementState;
  };
}

export interface PuzzleSolvedEvent extends RoomEvent {
  type: 'puzzle-solved';
  data: {
    puzzleId: string;
    elementId: string;
    solution: any;
    attempts: number;
    timeSpent: number;
    score: number;
  };
}

export interface ClueDiscoveredEvent extends RoomEvent {
  type: 'clue-discovered';
  data: {
    clue: Clue;
    elementId: string;
  };
}

export interface ProgressUpdateEvent extends RoomEvent {
  type: 'progress-update';
  data: ProgressUpdate;
}

export interface RoomCompletedEvent extends RoomEvent {
  type: 'room-completed';
  data: RoomResults;
}

// Component Props Types

export interface RoomEngineProps {
  roomId: string;
  playerId: string;
  config?: RoomConfig;
  initialState?: Partial<RoomState>;
  onProgress?: (progress: ProgressUpdate) => void;
  onComplete?: (results: RoomResults) => void;
  onError?: (error: Error) => void;
  onEvent?: (event: RoomEvent) => void;
}

export interface InteractiveElementProps {
  config: ElementConfig;
  state: ElementState;
  position: Position;
  size: Size;
  theme: ThemeConfig;
  onInteract: (elementId: string, interactionType: InteractionType) => void;
  isHighlighted?: boolean;
  animationType?: AnimationType;
}

export interface PuzzleEngineProps {
  config: PuzzleConfig;
  state: PuzzleState;
  sharedData: Record<string, any>;
  onSolve: (solution: any, results: ValidationResult) => void;
  onHint: () => void;
  onProgress: (progress: any) => void;
  onError: (error: Error) => void;
}

export interface RoomLayoutProps {
  config: LayoutConfig;
  elements: ElementConfig[];
  elementStates: Record<string, ElementState>;
  theme: ThemeConfig;
  onElementInteract: (elementId: string, interactionType: InteractionType) => void;
}

// Utility Types

export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

export type OptionalExcept<T, K extends keyof T> = Partial<T> & Pick<T, K>;

export type EventHandler<T extends RoomEvent> = (event: T) => void;

export type StateUpdater<T> = (prevState: T) => T;

export type ConfigValidator<T> = (config: T) => { isValid: boolean; errors?: string[] };