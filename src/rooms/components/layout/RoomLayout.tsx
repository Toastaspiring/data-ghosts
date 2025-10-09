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

  const handlePuzzleComplete = (puzzleId: string, solution: any) => {
    if (solution && !completedPuzzles.includes(puzzleId)) {
      const newCompletedPuzzles = [...completedPuzzles, puzzleId];
      setCompletedPuzzles(newCompletedPuzzles);
      
      // Check if all puzzles are now complete
      if (newCompletedPuzzles.length === config.elements.length) {
        // Generate room code from config or use a default
        const code = config.metadata?.tags?.[0] || `CODE-${config.id.substring(0, 4).toUpperCase()}`;
        setRoomCode(code);
        setShowCodeReveal(true);
        
        toast.success('🎉 Toutes les missions terminées !', {
          description: 'Vous avez débloqué le code de la salle !'
        });
        
        // Navigate to final room after a delay
        setTimeout(() => {
          toast.info('Transfert vers la salle de contrôle...', {
            duration: 2000
          });
          setTimeout(() => {
            // Navigate to final room (room 4)
            navigate(`/game/${lobbyId}/room/final-destruction`);
          }, 2000);
        }, 5000);
      }
    }
    onPuzzleComplete(puzzleId, solution);
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

        {/* Enhanced Puzzle Modal */}
        {activePuzzle && (
          <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
            <Card className="max-w-4xl w-full max-h-[90vh] overflow-auto border-primary cartoon-shadow animate-fade-in-up">
              <CardHeader className="hero-gradient">
                <CardTitle className="flex items-center justify-between neon-cyan font-mono text-2xl">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                      <Play className="w-4 h-4 text-background" />
                    </div>
                    Mission Active
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handlePuzzleComplete(activePuzzle, null)}
                    className="border-primary/50 hover:border-primary"
                  >
                    Fermer
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8">
                <div className="text-center">
                  <div className="text-8xl mb-6 animate-float">🧩</div>
                  <h3 className="text-3xl font-semibold mb-4 neon-cyan font-mono">Interface de Puzzle</h3>
                  <p className="text-muted-foreground mb-6 text-lg">
                    Cette interface sera remplacée par les composants de puzzle spécifiques.
                    Pour l'instant, vous pouvez simuler la résolution du puzzle.
                  </p>
                  <div className="flex gap-4 justify-center">
                    <Button 
                      onClick={() => handlePuzzleComplete(activePuzzle, { solved: true })}
                      className="bg-primary hover:bg-primary/90 text-lg px-8 py-3 animate-pulse-glow"
                    >
                      <CheckCircle2 className="w-5 h-5 mr-2" />
                      Simuler Résolution
                    </Button>
                    <Button 
                      variant="outline"
                      onClick={() => handlePuzzleComplete(activePuzzle, null)}
                      className="text-lg px-8 py-3"
                    >
                      Abandonner
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Code Reveal Modal */}
        {showCodeReveal && (
          <div className="fixed inset-0 bg-black/95 flex items-center justify-center z-50 p-4 backdrop-blur-md">
            <Card className="max-w-2xl w-full border-green-500 cartoon-shadow animate-scale-in">
              <CardHeader className="bg-gradient-to-r from-green-500/20 to-primary/20 border-b border-green-500/50">
                <CardTitle className="flex items-center gap-3 neon-cyan font-mono text-3xl justify-center">
                  <Unlock className="w-10 h-10 text-green-500 animate-pulse" />
                  Code Débloqué !
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8">
                <div className="text-center space-y-6">
                  <div className="text-6xl mb-6 animate-bounce">🎉</div>
                  <h3 className="text-2xl font-semibold mb-4 text-green-500">
                    Félicitations ! Toutes les missions sont terminées !
                  </h3>
                  <p className="text-muted-foreground mb-6 text-lg">
                    Vous avez débloqué le code de cette salle. Notez-le bien, vous en aurez besoin dans la salle de contrôle finale.
                  </p>
                  
                  {/* Code Display */}
                  <div className="bg-background/50 border-2 border-green-500 rounded-lg p-8 mb-6">
                    <div className="text-sm text-muted-foreground mb-2 font-mono">CODE DE LA SALLE</div>
                    <div className="text-6xl font-bold font-mono neon-cyan tracking-widest animate-pulse-glow">
                      {roomCode}
                    </div>
                  </div>
                  
                  <div className="flex flex-col gap-3 text-sm text-muted-foreground">
                    <div className="flex items-center justify-center gap-2">
                      <Clock className="w-4 h-4" />
                      <span>Transfert automatique vers la salle de contrôle finale dans quelques secondes...</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default RoomLayout;