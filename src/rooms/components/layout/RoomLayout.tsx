import React, { useEffect, useState } from 'react';
import { InteractionType } from '../../core/types';
import { useRoom, useRoomProgress, useRoomClues, useRoomInventory } from '../../core/RoomProvider';
import { useAudioManager } from '@/hooks/useAudioManager';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Clock, Target, Trophy, AlertCircle, ArrowLeft, Lightbulb, Lock, Play, CheckCircle2, Zap, Unlock } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { WaitingModal } from '@/components/rooms/WaitingModal';
import { PuzzleModal } from '../puzzles/PuzzleModal';
import { RealtimeChannel } from '@supabase/supabase-js';

interface RoomLayoutProps {
  onElementInteract: (elementId: string, interactionType: InteractionType) => void;
  activePuzzle: string | null;
  activeElement: string | null;
  onPuzzleComplete: (puzzleId: string, solution: any) => void;
}

interface RoomLayoutProps {
  onElementInteract: (elementId: string, interactionType: InteractionType) => void;
  activePuzzle: string | null;
  activeElement: string | null;
  onPuzzleComplete: (puzzleId: string, solution: any) => void;
}

export const RoomLayout: React.FC<RoomLayoutProps> = ({
  onElementInteract,
  activePuzzle,
  activeElement,
  onPuzzleComplete
}) => {
  const { config, roomState, exitRoom } = useRoom();
  const progress = useRoomProgress();
  const { clues } = useRoomClues();
  const { items: inventory } = useRoomInventory();
  const { playMusicFromUrl, unlockAudio, isAudioUnlocked } = useAudioManager();
  const navigate = useNavigate();
  const { lobbyId } = useParams();
  const [timeRemaining, setTimeRemaining] = useState(2700); // 45 minutes
  const [audioInitialized, setAudioInitialized] = useState(false);
  const [completedPuzzles, setCompletedPuzzles] = useState<string[]>([]);
  const [showCodeReveal, setShowCodeReveal] = useState(false);
  const [roomCode, setRoomCode] = useState<string>('');
  const [showWaitingModal, setShowWaitingModal] = useState(false);
  const [playersStatus, setPlayersStatus] = useState<Array<{id: string, name: string, completed: boolean, ready?: boolean}>>([]);
  const [playerId] = useState(sessionStorage.getItem("playerId") || "");
  const [isLoadingPuzzles, setIsLoadingPuzzles] = useState(true);

  // Load completed puzzles from database on mount
  useEffect(() => {
    const loadCompletedPuzzles = async () => {
      if (!lobbyId || !playerId) return;
      
      try {
        const { data: lobbyData } = await supabase
          .from('lobbies')
          .select('completed_puzzles, game_state')
          .eq('id', lobbyId)
          .single();
        
        if (lobbyData) {
          // Get player-specific completed puzzles
          const allCompletedPuzzles = (lobbyData.completed_puzzles as any) || {};
          const playerCompletedPuzzles = allCompletedPuzzles[playerId] || [];
          setCompletedPuzzles(playerCompletedPuzzles);
          
          // Check if player already finished all puzzles
          const gameState = (lobbyData as any).game_state || {};
          const completedPlayers = gameState.completed_players || {};
          if (completedPlayers[playerId]?.completed) {
            setRoomCode(completedPlayers[playerId].code || '');
            setShowWaitingModal(true);
          }
        }
      } catch (error) {
        console.error('Error loading completed puzzles:', error);
      } finally {
        setIsLoadingPuzzles(false);
      }
    };
    
    loadCompletedPuzzles();
  }, [lobbyId, playerId]);

  // Enhanced audio initialization with retry mechanism
  useEffect(() => {
    const initializeRoomAudio = async () => {
      if (audioInitialized || !config.audio?.background) return;
      
      try {
        console.log('🎵 Initializing room audio...');
        
        // Ensure audio is unlocked first
        unlockAudio();
        
        // Wait a bit for audio context to be ready
        setTimeout(() => {
          if (isAudioUnlocked) {
            console.log('🎶 Playing room background music:', config.audio.background);
            playMusicFromUrl(config.audio.background);
            setAudioInitialized(true);
          } else {
            console.log('🔒 Audio still locked, will retry on user interaction');
            // Set up click handler to retry audio
            const handleUserInteraction = () => {
              unlockAudio();
              setTimeout(() => {
                if (config.audio?.background) {
                  playMusicFromUrl(config.audio.background);
                  setAudioInitialized(true);
                }
              }, 100);
              document.removeEventListener('click', handleUserInteraction);
              document.removeEventListener('touchstart', handleUserInteraction);
            };
            
            document.addEventListener('click', handleUserInteraction);
            document.addEventListener('touchstart', handleUserInteraction);
          }
        }, 500);
        
      } catch (error) {
        console.warn('❌ Could not initialize room audio:', error);
      }
    };

    initializeRoomAudio();
  }, [config.audio?.background, playMusicFromUrl, unlockAudio, isAudioUnlocked, audioInitialized]);

  // Timer countdown
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 0) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getTimeColor = (seconds: number) => {
    if (seconds < 300) return 'text-destructive'; // Last 5 minutes
    if (seconds < 600) return 'text-orange-500'; // Last 10 minutes
    return 'text-primary';
  };

  // All puzzles are unlocked from the start
  const isPuzzleUnlocked = (elementId: string) => {
    return true; // All puzzles can be done in any order
  };

  // Realtime subscription to track all players' completion
  useEffect(() => {
    if (!lobbyId) return;

    let channel: RealtimeChannel;

    const setupRealtimeSubscription = async () => {
      // Fetch initial lobby state
      const { data: lobbyData } = await supabase
        .from('lobbies')
        .select('players, game_state')
        .eq('id', lobbyId)
        .single();

      if (lobbyData) {
        const gameState = (lobbyData as any).game_state || {};
        const completedPlayers = gameState.completed_players || {};
        const players = (lobbyData.players as any[]) || [];
        
        const status = players.map(player => ({
          id: player.id,
          name: player.name,
          completed: completedPlayers[player.id]?.completed || false,
          ready: completedPlayers[player.id]?.ready || false
        }));
        
        setPlayersStatus(status);
      }

      // Subscribe to changes
      channel = supabase
        .channel(`lobby-completion-${lobbyId}`)
        .on(
          'postgres_changes',
          {
            event: 'UPDATE',
            schema: 'public',
            table: 'lobbies',
            filter: `id=eq.${lobbyId}`,
          },
          (payload) => {
            const newData = payload.new as any;
            const gameState = newData.game_state || {};
            const completedPlayers = gameState.completed_players || {};
            const players = newData.players || [];
            
            const status = players.map((player: any) => ({
              id: player.id,
              name: player.name,
              completed: completedPlayers[player.id]?.completed || false,
              ready: completedPlayers[player.id]?.ready || false
            }));
            
            setPlayersStatus(status);

            // Check if all players are ready
            const allCompleted = status.every((p: any) => p.completed);
            const allReady = status.every((p: any) => p.ready);
            if (allCompleted && allReady && status.length > 0) {
              toast.success('🚀 Toute l\'équipe est prête !');
              
              // Navigate to final destruction instead of assigning room 5
              setTimeout(() => {
                window.location.href = `/final-destruction/${lobbyId}`;
              }, 2000);
            }
          }
        )
        .subscribe();
    };

    setupRealtimeSubscription();

    return () => {
      if (channel) supabase.removeChannel(channel);
    };
  }, [lobbyId, navigate]);

  const handlePuzzleComplete = async (puzzleId: string, solution: any) => {
    if (solution && !completedPuzzles.includes(puzzleId)) {
      const newCompletedPuzzles = [...completedPuzzles, puzzleId];
      setCompletedPuzzles(newCompletedPuzzles);
      
      // Save individual puzzle completion to database
      if (lobbyId && playerId) {
        try {
          const { data: lobbyData } = await supabase
            .from('lobbies')
            .select('completed_puzzles')
            .eq('id', lobbyId)
            .single();
          
          if (lobbyData) {
            const allCompletedPuzzles = (lobbyData.completed_puzzles as any) || {};
            allCompletedPuzzles[playerId] = newCompletedPuzzles;
            
            await supabase
              .from('lobbies')
              .update({ completed_puzzles: allCompletedPuzzles })
              .eq('id', lobbyId);
            
            console.log(`✓ Puzzle ${puzzleId} saved to database for player ${playerId}`);
          }
        } catch (error) {
          console.error('Error saving puzzle completion:', error);
        }
      }
      
      // Show success toast for individual puzzle
      toast.success('✓ Mission Terminée !', {
        description: `Puzzle "${puzzleId}" résolu avec succès`
      });
      
      // Check if all puzzles are now complete
      if (newCompletedPuzzles.length === config.elements.length) {
        // Generate room code from config or use a default
        const code = config.metadata?.tags?.[0] || `CODE-${config.id.substring(0, 4).toUpperCase()}`;
        setRoomCode(code);
        
        toast.success('🎉 Toutes les missions terminées !', {
          description: 'Vous avez débloqué le code de la salle !'
        });

        // Update database to mark player as completed
        if (lobbyId && playerId) {
          const { data: lobbyData } = await supabase
            .from('lobbies')
            .select('game_state, players')
            .eq('id', lobbyId)
            .single();

          if (lobbyData) {
            const gameState = (lobbyData as any).game_state || {};
            const completedPlayers = gameState.completed_players || {};
            
            completedPlayers[playerId] = {
              completed: true,
              ready: false,
              code: code,
              completedAt: new Date().toISOString()
            };

            await supabase
              .from('lobbies')
              .update({ 
                game_state: { ...gameState, completed_players: completedPlayers }
              })
              .eq('id', lobbyId);

            // Update local players status
            const players = (lobbyData.players as any[]) || [];
            const status = players.map(player => ({
              id: player.id,
              name: player.name,
              completed: completedPlayers[player.id]?.completed || false,
              ready: completedPlayers[player.id]?.ready || false
            }));
            setPlayersStatus(status);
          }
        }

        // Show waiting modal
        setShowWaitingModal(true);
      }
    }
    onPuzzleComplete(puzzleId, solution);
  };

  const handleReady = async () => {
    if (!lobbyId || !playerId) return;

    const { data: lobbyData } = await supabase
      .from('lobbies')
      .select('game_state')
      .eq('id', lobbyId)
      .single();

    if (lobbyData) {
      const gameState = (lobbyData as any).game_state || {};
      const completedPlayers = gameState.completed_players || {};
      
      if (completedPlayers[playerId]) {
        completedPlayers[playerId].ready = true;
      }

      await supabase
        .from('lobbies')
        .update({
          game_state: { ...gameState, completed_players: completedPlayers }
        })
        .eq('id', lobbyId);

      toast.success('✓ Prêt !', {
        description: 'En attente des autres joueurs...'
      });
    }
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Enhanced Cyberpunk Background Effects */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0ff_1px,transparent_1px),linear-gradient(to_bottom,#0ff_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_110%)] opacity-10" />
      
      {/* Animated Matrix Rain */}
      <div className="absolute inset-0 matrix-rain opacity-20 pointer-events-none" />
      
      {/* Scan Lines Effect */}
      <div className="absolute inset-0 scan-lines opacity-30 pointer-events-none" />
      
      {/* Floating Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-primary/30 rounded-full animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${3 + Math.random() * 2}s`
            }}
          />
        ))}
      </div>
      
      <div className="relative z-10 p-4">
        {/* Enhanced Header */}
        <div className="mb-6 animate-fade-in-up">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div>
                <h1 className="text-4xl font-bold neon-cyan font-mono typing-effect">
                  {config.name}
                </h1>
                <p className="text-muted-foreground font-mono text-lg mt-2">
                  {config.description}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              {/* Audio Status Indicator */}
              {config.audio?.background && (
                <Card className={`border-accent/30 transition-all duration-500 ${audioInitialized ? 'animate-pulse-glow' : ''}`}>
                  <CardContent className="p-3">
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${audioInitialized ? 'bg-green-500 animate-pulse' : 'bg-yellow-500'}`} />
                      <span className="text-sm font-mono">
                        {audioInitialized ? 'Audio OK' : 'Loading...'}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              )}
              
              {/* Enhanced Timer */}
              <Card className="border-primary/30 cartoon-shadow">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <Clock className="w-5 h-5 text-primary animate-pulse" />
                    <span className={`text-2xl font-mono font-bold ${getTimeColor(timeRemaining)}`}>
                      {formatTime(timeRemaining)}
                    </span>
                  </div>
                </CardContent>
              </Card>
              
              {/* Enhanced Progress */}
              <Card className="border-secondary/30 cartoon-shadow">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <Trophy className="w-5 h-5 text-secondary" />
                    <span className="text-xl font-mono neon-purple">
                      {completedPuzzles.length}/{config.elements.length}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
          
          <div className="mt-4">
            <Progress 
              value={(completedPuzzles.length / config.elements.length) * 100} 
              className="h-3 cartoon-shadow animate-pulse-glow" 
            />
          </div>
        </div>

        {/* Enhanced Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Enhanced Puzzles Column */}
          <div className="lg:col-span-2 space-y-4 animate-slide-in-left">
            <Card className="border-primary/30 cartoon-shadow">
              <CardHeader className="hero-gradient">
                <CardTitle className="flex items-center gap-2 neon-cyan font-mono text-2xl">
                  <Target className="w-6 h-6" />
                  Missions
                </CardTitle>
                <CardDescription className="text-lg">
                  Complétez les missions dans n'importe quel ordre
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                {isLoadingPuzzles ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                  </div>
                ) : (
                  <div className="grid gap-4">
                  {config.elements.map((element, index) => {
                    const isCompleted = completedPuzzles.includes(element.id);
                    const isUnlocked = true; // All puzzles unlocked
                    const isActive = activeElement === element.id;
                    const isCurrent = !isCompleted && isActive;
                    
                    return (
                      <Card 
                        key={element.id}
                        className={`cursor-pointer transition-all duration-500 hover:scale-105 transform ${
                          isActive ? 'border-primary ring-2 ring-primary/50 animate-pulse-glow' :
                          isCompleted ? 'border-green-500 bg-green-500/10 cartoon-shadow' :
                          'border-secondary/50 hover:border-secondary'
                        }`}
                        onClick={() => {
                          if (!isCompleted) {
                            onElementInteract(element.id, 'click');
                          }
                        }}
                      >
                        <CardContent className="p-6">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                              <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-xl ${
                                isCompleted ? 'bg-green-500 text-background' :
                                isActive ? 'bg-accent text-background animate-pulse' :
                                'bg-secondary/20 text-secondary'
                              }`}>
                                {isCompleted ? (
                                  <CheckCircle2 className="w-6 h-6" />
                                ) : isActive ? (
                                  <Play className="w-6 h-6" />
                                ) : (
                                  index + 1
                                )}
                              </div>
                              <div>
                                <h3 className="font-semibold font-mono text-lg">{element.name}</h3>
                                <p className="text-sm text-muted-foreground">{element.description}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              {isCompleted && (
                                <Badge variant="default" className="bg-green-500 animate-pulse">
                                  ✓ Terminé
                                </Badge>
                              )}
                              {isActive && !isCompleted && (
                                <Badge variant="outline" className="border-primary text-primary animate-pulse">
                                  Actif
                                </Badge>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Enhanced Sidebar - Clues & Inventory */}
          <div className="space-y-4 animate-slide-in-right">

            {/* Enhanced Clues */}
            {clues.length > 0 && (
              <Card className="border-accent/30 cartoon-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 neon-purple font-mono">
                    <Lightbulb className="w-5 h-5 animate-pulse" />
                    Indices ({clues.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {clues.slice(0, 5).map((clue, index) => (
                      <div key={index} className="p-4 bg-muted/50 rounded-lg border border-accent/20 hover:border-accent/50 transition-all duration-300">
                        <p className="text-sm font-mono leading-relaxed">{clue.description}</p>
                        <Badge variant="outline" className="mt-2 text-xs border-accent/50">
                          {clue.type}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Enhanced Inventory */}
            {inventory.length > 0 && (
              <Card className="border-accent/30 cartoon-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 neon-purple font-mono">
                    Inventaire ({inventory.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {inventory.map((item, index) => (
                      <div key={index} className="p-4 bg-muted/50 rounded-lg border border-accent/20 hover:border-accent/50 transition-all duration-300">
                        <h4 className="font-semibold text-sm">{item.name}</h4>
                        <p className="text-xs text-muted-foreground mt-1">{item.description}</p>
                        <Badge variant="outline" className="mt-2 text-xs border-accent/50">
                          {item.type}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Enhanced Game Status */}
            <Card className="border-muted/30 cartoon-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 font-mono">
                  <AlertCircle className="w-5 h-5 text-primary animate-pulse" />
                  Statut de Mission
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm font-mono">
                  <div className="flex justify-between items-center p-2 bg-muted/30 rounded">
                    <span>Progression:</span>
                    <span className="text-primary font-bold">
                      {((completedPuzzles.length / config.elements.length) * 100).toFixed(0)}%
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-muted/30 rounded">
                    <span>Temps écoulé:</span>
                    <span className="text-secondary">{formatTime((2700 - timeRemaining))}</span>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-muted/30 rounded">
                    <span>Missions:</span>
                    <span className="text-accent font-bold">{completedPuzzles.length}/{config.elements.length}</span>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-muted/30 rounded">
                    <span>Audio:</span>
                    <span className={audioInitialized ? 'text-green-500' : 'text-yellow-500'}>
                      {audioInitialized ? '🔊 Actif' : '🔇 Chargement...'}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Puzzle Modal */}
        {activePuzzle && (() => {
          const element = config?.elements.find(el => el.puzzle?.id === activePuzzle);
          if (!element?.puzzle) return null;
          
          return (
            <PuzzleModal
              puzzle={element.puzzle}
              isOpen={true}
              onClose={() => handlePuzzleComplete(activePuzzle, null)}
              onComplete={handlePuzzleComplete}
            />
          );
        })()}

        {/* Waiting Modal */}
        <WaitingModal 
          open={showWaitingModal}
          players={playersStatus}
          roomCode={roomCode}
          currentPlayerId={playerId}
          onReady={handleReady}
        />
      </div>
    </div>
  );
};

export default RoomLayout;