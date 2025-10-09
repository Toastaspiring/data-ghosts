import React, { createContext, useContext, ReactNode } from 'react';
import { RoomConfig, RoomState } from './types';
import { useRoomState, UseRoomStateReturn } from './hooks/useRoomState';

interface RoomContextValue extends UseRoomStateReturn {
  config: RoomConfig;
  playerId: string;
}

const RoomContext = createContext<RoomContextValue | null>(null);

interface RoomProviderProps {
  children: ReactNode;
  config: RoomConfig;
  playerId: string;
  autoSave?: boolean;
  onProgress?: (progress: any) => void;
  onComplete?: (results: any) => void;
  onError?: (error: Error) => void;
  onEvent?: (event: any) => void;
}

export const RoomProvider: React.FC<RoomProviderProps> = ({
  children,
  config,
  playerId,
  autoSave = true,
  onProgress,
  onComplete,
  onError,
  onEvent
}) => {
  const roomStateHook = useRoomState(config, playerId, {
    autoSave,
    onProgress,
    onEvent
  });

  // Check for room completion
  React.useEffect(() => {
    const { roomState, getCompletedElements, getTotalElements } = roomStateHook;
    
    if (getCompletedElements().length === getTotalElements() && onComplete) {
      const results = {
        roomId: config.id,
        playerId,
        completed: true,
        score: getCompletedElements().length * 100,
        timeElapsed: roomState.progress.timeElapsed,
        elementsCompleted: getCompletedElements(),
        cluesDiscovered: roomState.discoveredClues,
        hintsUsed: Object.values(roomState.elementStates).reduce((sum, state) => sum + state.hintsUsed, 0),
        attempts: Object.values(roomState.elementStates).reduce((acc, state) => {
          acc[state.id] = state.attempts;
          return acc;
        }, {} as Record<string, number>),
        finalState: roomState
      };
      
      onComplete(results);
    }
  }, [roomStateHook.roomState, roomStateHook.getCompletedElements, roomStateHook.getTotalElements, config.id, playerId, onComplete]);

  // Handle errors
  React.useEffect(() => {
    if (roomStateHook.error && onError) {
      onError(roomStateHook.error);
    }
  }, [roomStateHook.error, onError]);

  const contextValue: RoomContextValue = {
    ...roomStateHook,
    config,
    playerId
  };

  return (
    <RoomContext.Provider value={contextValue}>
      {children}
    </RoomContext.Provider>
  );
};

export const useRoom = (): RoomContextValue => {
  const context = useContext(RoomContext);
  if (!context) {
    throw new Error('useRoom must be used within a RoomProvider');
  }
  return context;
};

// Additional hooks for specific room data
export const useRoomConfig = () => {
  const { config } = useRoom();
  return config;
};

export const useRoomProgress = () => {
  const { roomState, calculateProgress, getCompletedElements, getTotalElements } = useRoom();
  return {
    percentage: roomState.progress.percentage,
    completed: getCompletedElements().length,
    total: getTotalElements(),
    timeElapsed: roomState.progress.timeElapsed,
    calculate: calculateProgress
  };
};

export const useRoomElements = () => {
  const { 
    roomState, 
    getElementState, 
    getUnlockedElements, 
    getSolvedElements, 
    getAvailableElements,
    unlockElement,
    solveElement,
    updateElementState
  } = useRoom();
  
  return {
    elements: roomState.config.elements,
    elementStates: roomState.elementStates,
    getState: getElementState,
    getUnlocked: getUnlockedElements,
    getSolved: getSolvedElements,
    getAvailable: getAvailableElements,
    unlock: unlockElement,
    solve: solveElement,
    update: updateElementState
  };
};

export const useRoomClues = () => {
  const { roomState, addClue } = useRoom();
  
  return {
    clues: roomState.discoveredClues,
    localClues: roomState.discoveredClues.filter(clue => clue.type === 'local'),
    sharedClues: roomState.discoveredClues.filter(clue => clue.type === 'shared'),
    crossRoomClues: roomState.discoveredClues.filter(clue => clue.type === 'crossRoom'),
    add: addClue
  };
};

export const useRoomInventory = () => {
  const { roomState, addInventoryItem } = useRoom();
  
  return {
    items: roomState.inventory,
    tools: roomState.inventory.filter(item => item.type === 'tool'),
    documents: roomState.inventory.filter(item => item.type === 'document'),
    samples: roomState.inventory.filter(item => item.type === 'sample'),
    keys: roomState.inventory.filter(item => item.type === 'key'),
    data: roomState.inventory.filter(item => item.type === 'data'),
    add: addInventoryItem
  };
};