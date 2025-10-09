import React, { useState, useEffect } from 'react';
import { RoomProvider } from './RoomProvider';
import { RoomConfig, RoomEngineProps, InteractionType } from './types';
import { useToast } from '@/hooks/use-toast';

// Import room layout component (will create this next)
import { RoomLayout } from '../components/layout/RoomLayout';

interface RoomEngineState {
  isInitialized: boolean;
  isLoading: boolean;
  error: Error | null;
  activePuzzle: string | null;
  activeElement: string | null;
}

export const RoomEngine: React.FC<RoomEngineProps> = ({
  roomId,
  playerId,
  config,
  initialState,
  onProgress,
  onComplete,
  onError,
  onEvent
}) => {
  const [engineState, setEngineState] = useState<RoomEngineState>({
    isInitialized: false,
    isLoading: true,
    error: null,
    activePuzzle: null,
    activeElement: null
  });

  const [roomConfig, setRoomConfig] = useState<RoomConfig | null>(config || null);
  const { toast } = useToast();

  // Load room configuration if not provided
  useEffect(() => {
    const loadRoomConfig = async () => {
      if (config) {
        setRoomConfig(config);
        setEngineState(prev => ({
          ...prev,
          isInitialized: true,
          isLoading: false
        }));
        return;
      }

      try {
        setEngineState(prev => ({ ...prev, isLoading: true }));
        
        // Load from configuration registry (will implement this)
        const loadedConfig = await import(`../rooms/${roomId}/config`);
        setRoomConfig(loadedConfig.default);
        
        setEngineState(prev => ({
          ...prev,
          isInitialized: true,
          isLoading: false
        }));
      } catch (error) {
        const err = error instanceof Error ? error : new Error('Failed to load room configuration');
        setEngineState(prev => ({
          ...prev,
          error: err,
          isLoading: false
        }));
        
        if (onError) {
          onError(err);
        }
        
        toast({
          title: "Room Loading Error",
          description: `Failed to load room ${roomId}: ${err.message}`,
          variant: "destructive"
        });
      }
    };

    loadRoomConfig();
  }, [roomId, config, onError, toast]);

  // Handle element interactions
  const handleElementInteract = (elementId: string, interactionType: InteractionType) => {
    setEngineState(prev => ({
      ...prev,
      activeElement: elementId
    }));

    // Logic to open puzzle modal or handle interaction
    const element = roomConfig?.elements.find(el => el.id === elementId);
    if (element?.puzzle) {
      setEngineState(prev => ({
        ...prev,
        activePuzzle: element.puzzle!.id
      }));
    }

    // Emit interaction event
    if (onEvent) {
      onEvent({
        type: 'element-interaction',
        roomId,
        playerId,
        timestamp: new Date(),
        data: {
          elementId,
          interactionType,
          elementState: {
            id: elementId,
            isUnlocked: true, // Will get from room state
            isSolved: false, // Will get from room state
            isActive: true,
            attempts: 0,
            hintsUsed: 0,
            timeSpent: 0
          }
        }
      });
    }
  };

  // Handle puzzle completion
  const handlePuzzleComplete = (puzzleId: string, solution: any) => {
    setEngineState(prev => ({
      ...prev,
      activePuzzle: null,
      activeElement: null
    }));

    toast({
      title: "Puzzle Solved!",
      description: "Great work! You've made progress in the investigation.",
    });
  };

  // Handle errors
  const handleError = (error: Error) => {
    setEngineState(prev => ({
      ...prev,
      error
    }));
    
    if (onError) {
      onError(error);
    }
    
    toast({
      title: "Room Error",
      description: error.message,
      variant: "destructive"
    });
  };

  // Loading state
  if (engineState.isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
          <div className="space-y-2">
            <h3 className="text-lg font-semibold neon-cyan font-mono">Loading Room</h3>
            <p className="text-sm text-muted-foreground font-mono">Initializing {roomId}...</p>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (engineState.error || !roomConfig) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4 max-w-md">
          <div className="text-6xl text-destructive">⚠️</div>
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-destructive font-mono">Room Error</h3>
            <p className="text-sm text-muted-foreground">
              {engineState.error?.message || 'Room configuration not found'}
            </p>
            <button 
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-primary text-primary-foreground rounded font-mono hover:bg-primary/90"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <RoomProvider
      config={roomConfig}
      playerId={playerId}
      autoSave={true}
      onProgress={onProgress}
      onComplete={onComplete}
      onError={handleError}
      onEvent={onEvent}
    >
      <div className="min-h-screen bg-background relative overflow-hidden">
        {/* Cyberpunk Background Effects */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#0ff_1px,transparent_1px),linear-gradient(to_bottom,#0ff_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_110%)] opacity-10" />
        <div className="matrix-rain absolute inset-0 opacity-5" />
        
        {/* Room Layout */}
        <RoomLayout 
          onElementInteract={handleElementInteract}
          activePuzzle={engineState.activePuzzle}
          activeElement={engineState.activeElement}
          onPuzzleComplete={handlePuzzleComplete}
        />
      </div>
    </RoomProvider>
  );
};

export default RoomEngine;