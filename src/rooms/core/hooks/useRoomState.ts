import { useState, useEffect, useCallback, useRef } from 'react';
import { 
  RoomState, 
  RoomConfig, 
  ElementState, 
  ProgressUpdate,
  RoomEvent,
  ElementInteractionEvent,
  PuzzleSolvedEvent,
  ClueDiscoveredEvent,
  Clue,
  RewardConfig,
  StateUpdater
} from '../types';

interface UseRoomStateOptions {
  autoSave?: boolean;
  saveInterval?: number;
  onProgress?: (progress: ProgressUpdate) => void;
  onEvent?: (event: RoomEvent) => void;
}

export interface UseRoomStateReturn {
  roomState: RoomState;
  isLoading: boolean;
  error: Error | null;
  
  // State updates
  updateElementState: (elementId: string, updater: StateUpdater<ElementState>) => void;
  unlockElement: (elementId: string) => void;
  solveElement: (elementId: string, rewards?: RewardConfig[]) => void;
  addClue: (clue: Clue) => void;
  addInventoryItem: (item: any) => void;
  
  // Progress tracking
  calculateProgress: () => number;
  getCompletedElements: () => string[];
  getTotalElements: () => number;
  
  // Time management
  updateTimeElapsed: (seconds: number) => void;
  
  // Element queries
  getElementState: (elementId: string) => ElementState | undefined;
  getUnlockedElements: () => ElementState[];
  getSolvedElements: () => ElementState[];
  getAvailableElements: () => ElementState[];
  
  // Save/Load
  saveState: () => void;
  loadState: (savedState: Partial<RoomState>) => void;
  resetState: () => void;
  
  // Navigation
  exitRoom: () => void;
}

export const useRoomState = (
  config: RoomConfig,
  playerId: string,
  options: UseRoomStateOptions = {}
): UseRoomStateReturn => {
  const {
    autoSave = false,
    saveInterval = 30000, // 30 seconds
    onProgress,
    onEvent
  } = options;

  // Initialize room state
  const [roomState, setRoomState] = useState<RoomState>(() => {
    const initialElementStates: Record<string, ElementState> = {};
    
    config.elements.forEach(element => {
      initialElementStates[element.id] = {
        id: element.id,
        isUnlocked: element.isUnlocked ?? (element.dependencies.length === 0),
        isSolved: element.isSolved ?? false,
        isActive: false,
        attempts: 0,
        hintsUsed: 0,
        timeSpent: 0,
        lastInteraction: undefined,
        puzzleState: undefined
      };
    });

    return {
      config,
      elementStates: initialElementStates,
      discoveredClues: [],
      inventory: [],
      progress: {
        percentage: 0,
        elementsCompleted: 0,
        totalElements: config.elements.length,
        timeElapsed: 0
      },
      status: 'ready'
    };
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  
  // Refs for stable callbacks
  const onProgressRef = useRef(onProgress);
  const onEventRef = useRef(onEvent);
  
  useEffect(() => {
    onProgressRef.current = onProgress;
    onEventRef.current = onEvent;
  });

  // Auto-save functionality
  useEffect(() => {
    if (!autoSave) return;

    const interval = setInterval(() => {
      saveState();
    }, saveInterval);

    return () => clearInterval(interval);
  }, [autoSave, saveInterval]);

  // Calculate progress whenever element states change
  useEffect(() => {
    const solvedCount = Object.values(roomState.elementStates).filter(state => state.isSolved).length;
    const percentage = (solvedCount / roomState.config.elements.length) * 100;
    
    setRoomState(prev => ({
      ...prev,
      progress: {
        ...prev.progress,
        percentage,
        elementsCompleted: solvedCount
      }
    }));

    // Emit progress event
    if (onProgressRef.current) {
      const progressUpdate: ProgressUpdate = {
        roomId: config.id,
        playerId,
        percentage,
        elementsCompleted: Object.keys(roomState.elementStates).filter(id => 
          roomState.elementStates[id].isSolved
        ),
        newClues: roomState.discoveredClues,
        timeElapsed: roomState.progress.timeElapsed,
        timestamp: new Date()
      };
      
      onProgressRef.current(progressUpdate);
    }
  }, [roomState.elementStates, config.id, playerId, roomState.discoveredClues, roomState.progress.timeElapsed]);

  // Emit events
  const emitEvent = useCallback((event: RoomEvent) => {
    if (onEventRef.current) {
      onEventRef.current(event);
    }
  }, []);

  // Update element state
  const updateElementState = useCallback((elementId: string, updater: StateUpdater<ElementState>) => {
    setRoomState(prev => {
      const currentState = prev.elementStates[elementId];
      if (!currentState) return prev;

      const newState = updater(currentState);
      
      return {
        ...prev,
        elementStates: {
          ...prev.elementStates,
          [elementId]: newState
        }
      };
    });
  }, []);

  // Unlock element
  const unlockElement = useCallback((elementId: string) => {
    updateElementState(elementId, state => ({
      ...state,
      isUnlocked: true,
      lastInteraction: new Date()
    }));

    // Check and unlock dependent elements
    const element = config.elements.find(el => el.id === elementId);
    if (element?.isSolved) {
      config.elements.forEach(el => {
        if (el.dependencies.includes(elementId)) {
          const allDependenciesSolved = el.dependencies.every(depId => {
            const depState = roomState.elementStates[depId];
            return depState?.isSolved;
          });
          
          if (allDependenciesSolved) {
            updateElementState(el.id, state => ({
              ...state,
              isUnlocked: true
            }));
          }
        }
      });
    }
  }, [config.elements, roomState.elementStates, updateElementState]);

  // Solve element and apply rewards
  const solveElement = useCallback((elementId: string, rewards: RewardConfig[] = []) => {
    updateElementState(elementId, state => ({
      ...state,
      isSolved: true,
      isActive: false,
      lastInteraction: new Date()
    }));

    // Apply rewards
    rewards.forEach(reward => {
      switch (reward.type) {
        case 'unlock':
          reward.elementIds?.forEach(id => unlockElement(id));
          break;
        case 'clue':
          if (reward.data) {
            const clue: Clue = {
              id: `${elementId}-${Date.now()}`,
              sourceElement: elementId,
              sourceRoom: config.id,
              type: 'local',
              title: reward.data.title || 'Discovery',
              description: reward.data.description || reward.data,
              data: reward.data,
              discoveredAt: new Date(),
              isShared: false
            };
            addClue(clue);
          }
          break;
        case 'item':
          if (reward.data) {
            addInventoryItem({
              id: `${elementId}-item-${Date.now()}`,
              name: reward.data.name,
              description: reward.data.description,
              type: reward.data.type || 'tool',
              icon: reward.data.icon || 'package',
              obtainedFrom: elementId,
              obtainedAt: new Date()
            });
          }
          break;
      }
    });

    // Emit puzzle solved event
    const event: PuzzleSolvedEvent = {
      type: 'puzzle-solved',
      roomId: config.id,
      playerId,
      timestamp: new Date(),
      data: {
        puzzleId: `${elementId}-puzzle`,
        elementId,
        solution: 'solved',
        attempts: roomState.elementStates[elementId]?.attempts || 0,
        timeSpent: roomState.elementStates[elementId]?.timeSpent || 0,
        score: 100
      }
    };
    emitEvent(event);
  }, [config.id, playerId, roomState.elementStates, updateElementState, unlockElement, emitEvent]);

  // Add clue
  const addClue = useCallback((clue: Clue) => {
    setRoomState(prev => ({
      ...prev,
      discoveredClues: [...prev.discoveredClues, clue]
    }));

    // Emit clue discovered event
    const event: ClueDiscoveredEvent = {
      type: 'clue-discovered',
      roomId: config.id,
      playerId,
      timestamp: new Date(),
      data: {
        clue,
        elementId: clue.sourceElement
      }
    };
    emitEvent(event);
  }, [config.id, playerId, emitEvent]);

  // Add inventory item
  const addInventoryItem = useCallback((item: any) => {
    setRoomState(prev => ({
      ...prev,
      inventory: [...prev.inventory, item]
    }));
  }, []);

  // Calculate progress
  const calculateProgress = useCallback(() => {
    const solvedCount = Object.values(roomState.elementStates).filter(state => state.isSolved).length;
    return (solvedCount / config.elements.length) * 100;
  }, [roomState.elementStates, config.elements.length]);

  // Get completed elements
  const getCompletedElements = useCallback(() => {
    return Object.keys(roomState.elementStates).filter(id => 
      roomState.elementStates[id].isSolved
    );
  }, [roomState.elementStates]);

  // Get total elements
  const getTotalElements = useCallback(() => {
    return config.elements.length;
  }, [config.elements.length]);

  // Update time elapsed
  const updateTimeElapsed = useCallback((seconds: number) => {
    setRoomState(prev => ({
      ...prev,
      progress: {
        ...prev.progress,
        timeElapsed: seconds
      }
    }));
  }, []);

  // Element queries
  const getElementState = useCallback((elementId: string) => {
    return roomState.elementStates[elementId];
  }, [roomState.elementStates]);

  const getUnlockedElements = useCallback(() => {
    return Object.values(roomState.elementStates).filter(state => state.isUnlocked);
  }, [roomState.elementStates]);

  const getSolvedElements = useCallback(() => {
    return Object.values(roomState.elementStates).filter(state => state.isSolved);
  }, [roomState.elementStates]);

  const getAvailableElements = useCallback(() => {
    return Object.values(roomState.elementStates).filter(state => 
      state.isUnlocked && !state.isSolved
    );
  }, [roomState.elementStates]);

  // Save state
  const saveState = useCallback(() => {
    try {
      const saveData = {
        roomId: config.id,
        playerId,
        state: roomState,
        timestamp: new Date().toISOString()
      };
      
      localStorage.setItem(`room-state-${config.id}-${playerId}`, JSON.stringify(saveData));
    } catch (error) {
      console.error('Failed to save room state:', error);
      setError(new Error('Failed to save room state'));
    }
  }, [config.id, playerId, roomState]);

  // Load state
  const loadState = useCallback((savedState: Partial<RoomState>) => {
    setRoomState(prev => ({
      ...prev,
      ...savedState
    }));
  }, []);

  // Reset state
  const resetState = useCallback(() => {
    setRoomState(prev => {
      const resetElementStates: Record<string, ElementState> = {};
      
      config.elements.forEach(element => {
        resetElementStates[element.id] = {
          id: element.id,
          isUnlocked: element.isUnlocked ?? (element.dependencies.length === 0),
          isSolved: element.isSolved ?? false,
          isActive: false,
          attempts: 0,
          hintsUsed: 0,
          timeSpent: 0,
          lastInteraction: undefined,
          puzzleState: undefined
        };
      });

      return {
        ...prev,
        elementStates: resetElementStates,
        discoveredClues: [],
        inventory: [],
        progress: {
          percentage: 0,
          elementsCompleted: 0,
          totalElements: config.elements.length,
          timeElapsed: 0
        },
        status: 'ready'
      };
    });
  }, [config]);

  // Exit room function
  const exitRoom = useCallback(() => {
    // Save current state before exiting
    saveState();
    
    // Navigate back (this would be handled by parent application)
    if (window.history.length > 1) {
      window.history.back();
    } else {
      window.location.href = '/';
    }
  }, [saveState]);

  // Try to load saved state on mount
  useEffect(() => {
    try {
      const savedData = localStorage.getItem(`room-state-${config.id}-${playerId}`);
      if (savedData) {
        const { state } = JSON.parse(savedData);
        if (state && state.config.id === config.id) {
          loadState(state);
        }
      }
    } catch (error) {
      console.warn('Failed to load saved room state:', error);
    }
  }, [config.id, playerId, loadState]);

  return {
    roomState,
    isLoading,
    error,
    
    // State updates
    updateElementState,
    unlockElement,
    solveElement,
    addClue,
    addInventoryItem,
    
    // Progress tracking
    calculateProgress,
    getCompletedElements,
    getTotalElements,
    
    // Time management
    updateTimeElapsed,
    
    // Element queries
    getElementState,
    getUnlockedElements,
    getSolvedElements,
    getAvailableElements,
    
    // Save/Load
    saveState,
    loadState,
    resetState,
    
    // Navigation
    exitRoom
  };
};