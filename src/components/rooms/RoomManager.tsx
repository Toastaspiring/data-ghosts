import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { InteractiveRoom, RoomState } from "@/components/rooms/InteractiveRoom";
import { BaliMarineResearchRoom, SantoriniArchaeologicalRoom, MachuPicchuConservationRoom } from "@/data/roomConfigurations";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface GameState {
  rooms: Record<string, RoomState>;
  sharedClues: Record<string, any>;
  globalProgress: number;
  missionComplete: boolean;
  timeRemaining: number; // in minutes
  playersInRooms: Record<string, string[]>;
}

interface RoomManagerProps {
  playerName: string;
  gameId: string;
  onGameComplete: () => void;
}

export const RoomManager = ({ playerName, gameId, onGameComplete }: RoomManagerProps) => {
  const [gameState, setGameState] = useState<GameState>({
    rooms: {
      'bali-marine': { ...BaliMarineResearchRoom },
      'santorini-archaeological': { ...SantoriniArchaeologicalRoom },
      'machu-picchu-conservation': { ...MachuPicchuConservationRoom }
    },
    sharedClues: {},
    globalProgress: 0,
    missionComplete: false,
    timeRemaining: 45, // 45 minutes
    playersInRooms: {
      'bali-marine': [],
      'santorini-archaeological': [],
      'machu-picchu-conservation': []
    }
  });

  const [currentRoom, setCurrentRoom] = useState<string>('bali-marine');
  const [showMissionBrief, setShowMissionBrief] = useState(true);
  const [showVictoryScreen, setShowVictoryScreen] = useState(false);
  const { toast } = useToast();

  // Timer countdown
  useEffect(() => {
    const timer = setInterval(() => {
      setGameState(prev => {
        if (prev.timeRemaining <= 0) {
          clearInterval(timer);
          return prev;
        }
        return { ...prev, timeRemaining: prev.timeRemaining - 1/60 }; // Decrease by 1 second
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Check for mission completion
  useEffect(() => {
    const allRoomsProgress = Object.values(gameState.rooms).map(room => room.progressPercentage);
    const averageProgress = allRoomsProgress.reduce((sum, progress) => sum + progress, 0) / allRoomsProgress.length;
    
    setGameState(prev => ({ ...prev, globalProgress: averageProgress }));

    // Check win condition
    if (averageProgress >= 90 && Object.keys(gameState.sharedClues).length >= 6) {
      if (!gameState.missionComplete) {
        setGameState(prev => ({ ...prev, missionComplete: true }));
        setShowVictoryScreen(true);
        toast({
          title: "Mission Complete!",
          description: "You've successfully uncovered the connection between all three sites!",
        });
      }
    }
  }, [gameState.rooms, gameState.sharedClues, gameState.missionComplete, toast]);

  const handlePuzzleSolved = (roomId: string, elementId: string, reward: any) => {
    setGameState(prev => ({
      ...prev,
      rooms: {
        ...prev.rooms,
        [roomId]: {
          ...prev.rooms[roomId],
          elements: prev.rooms[roomId].elements.map(el =>
            el.id === elementId ? { ...el, isSolved: true } : el
          )
        }
      }
    }));

    toast({
      title: "Discovery Made!",
      description: `New information discovered in ${gameState.rooms[roomId].name}`,
    });
  };

  const handleClueDiscovered = (clue: any) => {
    const clueKey = `${clue.sourceRoom || currentRoom}-${Date.now()}`;
    setGameState(prev => ({
      ...prev,
      sharedClues: {
        ...prev.sharedClues,
        [clueKey]: clue
      }
    }));

    toast({
      title: "Intel Shared!",
      description: "New information has been added to the team database",
    });
  };

  const handleRoomProgress = (roomId: string, percentage: number) => {
    setGameState(prev => ({
      ...prev,
      rooms: {
        ...prev.rooms,
        [roomId]: {
          ...prev.rooms[roomId],
          progressPercentage: percentage
        }
      }
    }));
  };

  const switchRoom = (roomId: string) => {
    setCurrentRoom(roomId);
    toast({
      title: "Switching Locations",
      description: `Connecting to ${gameState.rooms[roomId].name}...`,
    });
  };

  const formatTime = (minutes: number) => {
    const hrs = Math.floor(minutes / 60);
    const mins = Math.floor(minutes % 60);
    const secs = Math.floor((minutes % 1) * 60);
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const MissionBriefing = () => (
    <Dialog open={showMissionBrief} onOpenChange={setShowMissionBrief}>
      <DialogContent className="max-w-4xl bg-background/95 backdrop-blur-md border-primary/30">
        <DialogHeader>
          <DialogTitle className="text-2xl neon-cyan font-mono">URGENT: Global Environmental Crisis</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="bg-destructive/20 border border-destructive/50 rounded-lg p-4">
            <h3 className="font-bold text-destructive font-mono mb-2">⚠️ MISSION CRITICAL</h3>
            <p className="text-destructive font-mono">
              Environmental anomalies detected at three research stations worldwide. 
              Your team has 45 minutes to uncover the connection and prevent ecological disaster.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-card border border-primary/30 rounded-lg p-4 cartoon-shadow">
              <h4 className="font-bold text-primary mb-2 font-mono">🌊 Bali Marine Station</h4>
              <p className="text-sm text-muted-foreground font-mono">Coral bleaching accelerating. Marine ecosystems failing.</p>
            </div>
            
            <div className="bg-card border border-secondary/30 rounded-lg p-4 cartoon-shadow">
              <h4 className="font-bold text-secondary mb-2 font-mono">🏛️ Santorini Archaeological</h4>
              <p className="text-sm text-muted-foreground font-mono">Ancient artifacts revealing patterns of civilization collapse.</p>
            </div>
            
            <div className="bg-card border border-accent/30 rounded-lg p-4 cartoon-shadow">
              <h4 className="font-bold text-accent mb-2 font-mono">🏔️ Machu Picchu Conservation</h4>
              <p className="text-sm text-muted-foreground font-mono">Climate data showing unprecedented changes in highland ecosystems.</p>
            </div>
          </div>

          <div className="bg-primary/20 border border-primary/50 rounded-lg p-4">
            <h3 className="font-bold text-primary font-mono mb-2">🎯 KEY OBJECTIVES</h3>
            <ul className="list-disc list-inside text-primary space-y-1 font-mono text-sm">
              <li>Investigate interactive equipment and analyze findings</li>
              <li>Share critical information between research stations</li>
              <li>Solve interconnected puzzles to reveal the connection</li>
              <li>Complete the mission before time runs out</li>
            </ul>
          </div>

          <Button 
            onClick={() => setShowMissionBrief(false)} 
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-mono animate-pulse-glow" 
            size="lg"
          >
            Begin Investigation →
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );

  const VictoryScreen = () => (
    <Dialog open={showVictoryScreen} onOpenChange={setShowVictoryScreen}>
      <DialogContent className="max-w-2xl bg-background/95 backdrop-blur-md border-primary/30">
        <DialogHeader>
          <DialogTitle className="text-2xl neon-cyan font-mono text-center">🎉 MISSION ACCOMPLISHED! 🎉</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 text-center">
          <div className="text-6xl animate-float">�</div>
          <p className="text-lg text-foreground font-mono">
            Your team successfully uncovered the ancient pattern connecting all three locations!
          </p>
          <div className="bg-primary/20 border border-primary/30 rounded-lg p-4">
            <h3 className="font-bold text-primary mb-2 font-mono">🔬 THE DISCOVERY</h3>
            <p className="text-primary font-mono text-sm">
              The environmental crises are part of a 3,600-year cycle first recorded by ancient civilizations. 
              By combining modern science with ancient wisdom, your team has identified the solution to prevent 
              the next catastrophic event.
            </p>
          </div>
          <Button 
            onClick={onGameComplete} 
            size="lg"
            className="bg-primary hover:bg-primary/90 text-primary-foreground font-mono animate-pulse-glow"
          >
            Return to Lobby →
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );

  return (
    <div className="min-h-screen bg-background text-foreground relative overflow-hidden">
      {/* Animated Background Grid - matching landing page */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0ff_1px,transparent_1px),linear-gradient(to_bottom,#0ff_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_110%)] opacity-10" />
      
      {/* Matrix Rain Effect */}
      <div className="matrix-rain absolute inset-0 opacity-5" />
      
      <MissionBriefing />
      <VictoryScreen />
      
      {/* Game Header */}
      <div className="absolute top-0 left-0 right-0 z-30 bg-background/90 backdrop-blur-sm border-b border-border">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-bold neon-cyan font-mono">Global Crisis Investigation</h1>
            <div className="inline-flex items-center gap-2 bg-primary/20 border border-primary/50 rounded-full px-4 py-1 backdrop-blur-sm">
              <span className="text-sm font-mono text-primary">Agent: {playerName}</span>
            </div>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="text-center">
              <div className="text-sm text-muted-foreground mb-1 font-mono">MISSION PROGRESS</div>
              <div className="bg-card border-2 border-primary/30 rounded-lg p-2 cartoon-shadow">
                <Progress value={gameState.globalProgress} className="w-32 progress-glow" />
                <div className="text-xs text-primary font-mono mt-1">{gameState.globalProgress.toFixed(0)}%</div>
              </div>
            </div>
            
            <div className="text-center">
              <div className="text-sm text-muted-foreground mb-1 font-mono">TIME REMAINING</div>
              <div className={`bg-card border-2 border-primary/30 rounded-lg p-3 cartoon-shadow ${gameState.timeRemaining < 5 ? 'animate-pulse-glow border-destructive' : ''}`}>
                <div className={`text-2xl font-mono font-bold ${gameState.timeRemaining < 5 ? 'text-destructive neon-pink' : 'neon-cyan'}`}>
                  {formatTime(gameState.timeRemaining)}
                </div>
              </div>
            </div>
            
            <div className="text-center">
              <div className="text-sm text-muted-foreground mb-1 font-mono">INTEL GATHERED</div>
              <div className="bg-card border-2 border-secondary/30 rounded-lg p-3 cartoon-shadow">
                <div className="text-2xl font-bold neon-purple font-mono">
                  {Object.keys(gameState.sharedClues).length}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Room Selector */}
      <div className="absolute top-20 left-4 z-30">
        <div className="bg-card/90 backdrop-blur-sm border border-border rounded-lg p-2">
          <Tabs value={currentRoom} onValueChange={switchRoom} orientation="vertical">
            <TabsList className="grid w-48 grid-rows-3 bg-background/50">
              <TabsTrigger value="bali-marine" className="text-left font-mono justify-start data-[state=active]:bg-primary/20 data-[state=active]:text-primary">
                🌊 Bali Marine
              </TabsTrigger>
              <TabsTrigger value="santorini-archaeological" className="text-left font-mono justify-start data-[state=active]:bg-secondary/20 data-[state=active]:text-secondary">
                🏛️ Santorini Site
              </TabsTrigger>
              <TabsTrigger value="machu-picchu-conservation" className="text-left font-mono justify-start data-[state=active]:bg-accent/20 data-[state=active]:text-accent">
                🏔️ Machu Picchu Lab
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      {/* Current Room */}
      <div className="pt-20">
        <InteractiveRoom
          roomData={gameState.rooms[currentRoom]}
          playerName={playerName}
          sharedClues={gameState.sharedClues}
          onPuzzleSolved={(elementId, reward) => handlePuzzleSolved(currentRoom, elementId, reward)}
          onClueDiscovered={handleClueDiscovered}
          onProgress={(percentage) => handleRoomProgress(currentRoom, percentage)}
        />
      </div>
    </div>
  );
};