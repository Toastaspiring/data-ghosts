# Data Ghosts - Room System Blueprint v2.0

## 🎯 Vision
Complete redesign of the room system to create a modular, scalable, and immersive escape room experience with cyberpunk aesthetics and environmental storytelling.

## 📋 Current State Analysis

### Problems with Current Implementation:
1. **Monolithic Components**: Large, tightly coupled room components
2. **Mixed Concerns**: UI, game logic, and data management in same files
3. **Hardcoded Values**: Room configurations scattered across multiple files
4. **Inconsistent Theming**: Different styling approaches across components
5. **Limited Reusability**: Components cannot be easily extended or reused
6. **Complex State Management**: Shared state scattered across multiple components
7. **Poor Separation**: No clear distinction between room logic and presentation

### Current File Structure:
```
src/components/rooms/
├── InteractiveRoom.tsx (392 lines - TOO LARGE)
├── RoomManager.tsx (317 lines - MIXED CONCERNS)
└── SVGRoomLayouts.tsx (550+ lines - MONOLITHIC)

src/data/
└── roomConfigurations.ts (STATIC CONFIG)

src/components/puzzles/
├── SpecializedPuzzles.tsx (500+ lines)
└── [Individual puzzle components]
```

## 🏗️ New Architecture Design

### Core Principles:
1. **Single Responsibility**: Each component has one clear purpose
2. **Composition over Inheritance**: Build complex rooms from simple components
3. **Configurable**: All room behavior driven by configuration files
4. **Testable**: Pure functions and clear interfaces
5. **Cyberpunk Consistent**: Unified theming system
6. **Performance**: Lazy loading and optimized rendering

### New Directory Structure:
```
src/rooms/
├── core/                           # Core room system
│   ├── types.ts                    # All TypeScript interfaces
│   ├── RoomEngine.tsx              # Main room coordinator
│   ├── RoomProvider.tsx            # Context for room state
│   └── hooks/
│       ├── useRoomState.ts         # Room state management
│       ├── useRoomProgress.ts      # Progress tracking
│       ├── useRoomAudio.ts         # Audio management
│       └── useRoomTimer.ts         # Timer functionality
├── components/                     # Reusable room components
│   ├── layout/
│   │   ├── RoomContainer.tsx       # Base room layout
│   │   ├── RoomHeader.tsx          # Header with progress/timer
│   │   ├── RoomCanvas.tsx          # SVG/Canvas for room visuals
│   │   └── RoomSidebar.tsx         # Clues/inventory panel
│   ├── elements/
│   │   ├── InteractiveElement.tsx  # Base interactive element
│   │   ├── Equipment.tsx           # Equipment-specific element
│   │   ├── Document.tsx            # Document-specific element
│   │   ├── Specimen.tsx            # Specimen-specific element
│   │   └── Computer.tsx            # Computer-specific element
│   ├── ui/
│   │   ├── ProgressBar.tsx         # Room progress indicator
│   │   ├── CluePanel.tsx           # Individual clue display
│   │   ├── InventorySlot.tsx       # Inventory item display
│   │   └── StatusIndicator.tsx     # Element status (locked/solved)
│   └── modals/
│       ├── PuzzleModal.tsx         # Container for puzzles
│       ├── ClueModal.tsx           # Clue examination modal
│       └── HintModal.tsx           # Hint system modal
├── rooms/                          # Individual room implementations
│   ├── bali-marine/
│   │   ├── index.tsx               # Room export
│   │   ├── BaliMarineRoom.tsx      # Main room component
│   │   ├── config.ts               # Room configuration
│   │   ├── layout.svg              # Room layout assets
│   │   └── components/
│   │       ├── CoralMicroscope.tsx # Room-specific components
│   │       ├── PHTester.tsx
│   │       └── SpecimenArchive.tsx
│   ├── santorini-archaeological/
│   │   ├── index.tsx
│   │   ├── SantoriniRoom.tsx
│   │   ├── config.ts
│   │   ├── layout.svg
│   │   └── components/
│   │       ├── CarbonDating.tsx
│   │       ├── PotteryAnalysis.tsx
│   │       └── GroundRadar.tsx
│   └── machu-picchu-conservation/
│       ├── index.tsx
│       ├── MachuPicchuRoom.tsx
│       ├── config.ts
│       ├── layout.svg
│       └── components/
│           ├── PlantSequencer.tsx
│           ├── SoilAnalyzer.tsx
│           └── WeatherStation.tsx
├── puzzles/                        # Puzzle system
│   ├── core/
│   │   ├── PuzzleEngine.tsx        # Puzzle coordinator
│   │   ├── PuzzleProvider.tsx      # Puzzle state context
│   │   └── types.ts                # Puzzle interfaces
│   ├── base/
│   │   ├── BasePuzzle.tsx          # Abstract puzzle component
│   │   ├── AnalysisPuzzle.tsx      # Data analysis puzzle base
│   │   ├── PatternPuzzle.tsx       # Pattern recognition base
│   │   ├── CodePuzzle.tsx          # Code breaking base
│   │   ├── SequencePuzzle.tsx      # Sequence ordering base
│   │   └── CollabPuzzle.tsx        # Collaboration puzzle base
│   └── implementations/
│       ├── coral-analysis/
│       ├── pottery-decoding/
│       ├── plant-sequencing/
│       └── [specific puzzle implementations]
├── game/                           # Game management
│   ├── GameManager.tsx             # Overall game coordinator
│   ├── TimerManager.tsx            # Game timer management
│   ├── ScoreManager.tsx            # Scoring system
│   └── SaveManager.tsx             # Save/load functionality
└── shared/                         # Shared utilities
    ├── theme/
    │   ├── cyberpunk.ts            # Cyberpunk theme config
    │   ├── animations.ts           # Animation definitions
    │   └── effects.ts              # Visual effects
    ├── utils/
    │   ├── roomUtils.ts            # Room utility functions
    │   ├── puzzleUtils.ts          # Puzzle utility functions
    │   └── stateUtils.ts           # State management utilities
    └── constants/
        ├── gameConstants.ts        # Game-wide constants
        ├── roomConstants.ts        # Room-specific constants
        └── puzzleConstants.ts      # Puzzle-specific constants
```

## 🔧 Implementation Plan

### Phase 1: Core Foundation (Days 1-2)
- [ ] Create new directory structure
- [ ] Define all TypeScript interfaces in `core/types.ts`
- [ ] Implement RoomEngine as the main coordinator
- [ ] Create RoomProvider for state management
- [ ] Build base hooks for room functionality

### Phase 2: Base Components (Days 3-4)
- [ ] Create reusable layout components
- [ ] Implement base interactive elements
- [ ] Build UI components with cyberpunk theme
- [ ] Create modal system for puzzles/clues

### Phase 3: Puzzle System (Days 5-6)
- [ ] Design puzzle engine architecture
- [ ] Create base puzzle components
- [ ] Implement specific puzzle types
- [ ] Add puzzle validation and scoring

### Phase 4: Integration & Polish (Days 10-11)
- [ ] Integrate rooms with game manager
- [ ] Implement cross-room collaboration
- [ ] Add save/load functionality
- [ ] Performance optimization
- [ ] Final testing and bug fixes

## 📝 Detailed Component Specifications

### 1. Core Types (`core/types.ts`)
```typescript
// Room Configuration
interface RoomConfig {
  id: string;
  name: string;
  theme: ThemeConfig;
  layout: LayoutConfig;
  elements: ElementConfig[];
  puzzles: PuzzleConfig[];
  audio: AudioConfig;
  timing: TimingConfig;
}

// Interactive Elements
interface ElementConfig {
  id: string;
  type: ElementType;
  position: Position;
  size: Size;
  component: string; // Component name to render
  puzzle?: PuzzleConfig;
  dependencies: string[]; // Required elements
  rewards: RewardConfig[];
}

// Puzzle Configuration
interface PuzzleConfig {
  id: string;
  type: PuzzleType;
  difficulty: 1 | 2 | 3 | 4 | 5;
  timeLimit?: number;
  component: string; // Puzzle component name
  data: Record<string, any>; // Puzzle-specific data
  validation: ValidationConfig;
}
```

### 2. Room Engine (`core/RoomEngine.tsx`)
```typescript
interface RoomEngineProps {
  roomId: string;
  playerId: string;
  onComplete: (results: RoomResults) => void;
  onProgress: (progress: ProgressUpdate) => void;
}

// Central coordinator that:
// - Loads room configuration
// - Manages room state
// - Coordinates element interactions
// - Handles puzzle flow
// - Tracks progress and timing
```

### 3. Base Interactive Element (`components/elements/InteractiveElement.tsx`)
```typescript
interface InteractiveElementProps {
  config: ElementConfig;
  isUnlocked: boolean;
  isSolved: boolean;
  onInteract: (elementId: string) => void;
  position: Position;
  size: Size;
}

// Reusable base component that:
// - Renders element visual representation
// - Handles click/hover interactions
// - Shows locked/solved states
// - Applies cyberpunk styling
// - Manages animations
```

### 4. Puzzle Engine (`puzzles/core/PuzzleEngine.tsx`)
```typescript
interface PuzzleEngineProps {
  puzzleConfig: PuzzleConfig;
  sharedData: Record<string, any>;
  onSolve: (solution: PuzzleSolution) => void;
  onHint: () => void;
}

// Central puzzle coordinator that:
// - Loads appropriate puzzle component
// - Manages puzzle state
// - Handles solution validation
// - Tracks attempts and hints
// - Provides puzzle results
```

## 🎨 Theme System

### Cyberpunk Theme Configuration (`shared/theme/cyberpunk.ts`)
```typescript
export const cyberpunkTheme = {
  colors: {
    primary: {
      neon: '#00ffff',
      glow: 'rgba(0, 255, 255, 0.5)',
      dark: '#006666'
    },
    secondary: {
      neon: '#ff6600',
      glow: 'rgba(255, 102, 0, 0.5)',
      dark: '#663300'
    },
    accent: {
      neon: '#00ff00',
      glow: 'rgba(0, 255, 0, 0.5)',
      dark: '#006600'
    },
    background: {
      primary: '#0a0a0a',
      secondary: '#1a1a1a',
      glass: 'rgba(0, 0, 0, 0.8)'
    }
  },
  animations: {
    glow: 'animate-pulse-glow',
    hover: 'hover:scale-105 transition-all duration-300',
    float: 'animate-float'
  },
  effects: {
    neonText: 'neon-cyan',
    glassPanel: 'backdrop-blur-md bg-background/95',
    gridBackground: 'bg-[linear-gradient(to_right,#0ff_1px,transparent_1px)]'
  }
};
```

## 🧪 Room-Specific Configurations

### Bali Marine Room (`rooms/bali-marine/config.ts`)
```typescript
export const baliMarineConfig: RoomConfig = {
  id: 'bali-marine',
  name: 'Bali Marine Research Station',
  theme: {
    primary: cyberpunkTheme.colors.primary,
    environment: 'underwater',
    ambientSound: 'underwater-ambience.mp3'
  },
  layout: {
    background: 'oceanGradient',
    width: 1920,
    height: 1080,
    zones: [
      { id: 'microscope-area', bounds: { x: 200, y: 300, w: 400, h: 300 } },
      { id: 'specimen-storage', bounds: { x: 800, y: 200, w: 300, h: 400 } },
      { id: 'analysis-station', bounds: { x: 1200, y: 400, w: 500, h: 300 } }
    ]
  },
  elements: [
    {
      id: 'coral-microscope',
      type: 'equipment',
      position: { x: 25, y: 40 },
      size: { width: 8, height: 12 },
      component: 'CoralMicroscope',
      puzzle: {
        id: 'coral-pattern-analysis',
        type: 'pattern',
        difficulty: 3,
        component: 'CoralPatternPuzzle',
        data: { patterns: CORAL_PATTERNS },
        validation: { correctSequence: [1, 3, 2, 4] }
      },
      dependencies: [],
      rewards: [
        { type: 'clue', data: 'Coral bleaching follows temperature cycles' },
        { type: 'unlock', elementIds: ['specimen-archive'] }
      ]
    }
    // ... more elements
  ]
};
```

## 🔄 State Management Flow

### Room State Flow:
1. **Room Initialization**: Load room config, initialize elements
2. **Element Interaction**: Player clicks element → Check if unlocked → Open puzzle modal
3. **Puzzle Solving**: Puzzle component validates solution → Update element state → Trigger rewards
4. **Progress Update**: Calculate room progress → Update UI → Check completion
5. **Cross-Room Sync**: Share clues/data with other rooms via global state

### Data Flow Diagram:
```
RoomEngine ←→ RoomProvider ←→ useRoomState
     ↓              ↓              ↓
PuzzleEngine ←→ PuzzleProvider ←→ usePuzzleState
     ↓              ↓              ↓
Individual   ←→ Element State ←→ Progress
Components                       Tracking
```

## 📊 Success Metrics

### Performance Goals:
- Room loading time: < 2 seconds
- Element interaction response: < 100ms
- Puzzle modal opening: < 500ms
- Memory usage: < 100MB per room

### Code Quality Goals:
- Component complexity: < 100 lines per component
- Test coverage: > 80%
- TypeScript strict mode: 100% compliance
- ESLint/Prettier: 0 warnings

### User Experience Goals:
- Intuitive navigation: Users find elements without hints
- Engaging puzzles: 70%+ completion rate per puzzle
- Responsive design: Works on all screen sizes
- Consistent theming: Seamless visual experience

## 🧪 Testing Strategy

### Unit Tests:
- Room engine logic
- Puzzle validation functions
- State management hooks
- Utility functions

### Integration Tests:
- Room component interactions
- Puzzle flow end-to-end
- Cross-room data sharing
- Progress tracking

### E2E Tests:
- Complete room playthrough
- Multi-player scenarios
- Save/load functionality
- Error handling

## 🚀 Migration Strategy

### Step 1: Parallel Development
- Build new system alongside existing
- Create feature flags for switching
- Maintain backward compatibility

### Step 2: Gradual Migration
- Migrate Bali Marine room first
- Test thoroughly in production
- Gather user feedback and iterate

### Step 3: Complete Transition
- Migrate remaining rooms
- Remove old code
- Optimize and polish

## 📚 Documentation Requirements

### Developer Documentation:
- Component API documentation
- Room configuration guide
- Puzzle creation tutorial
- Theme customization guide

### User Documentation:
- Room interaction guide
- Puzzle solving tips
- Accessibility features
- Troubleshooting guide

---

*This blueprint serves as the foundation for rebuilding the Data Ghosts room system. Each phase should be implemented incrementally with thorough testing and validation.*
