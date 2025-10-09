import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { 
  Microscope, 
  FileText, 
  TestTube, 
  Monitor, 
  Wrench, 
  Mountain,
  Lock,
  Check,
  Star
} from "lucide-react";
import { 
  BaliMarineRoomSVG, 
  SantoriniArchaeologicalRoomSVG, 
  MachuPicchuConservationRoomSVG 
} from "@/components/rooms/SVGRoomLayouts";

export interface InteractiveElement {
  id: string;
  name: string;
  description: string;
  position: { x: number; y: number }; // Percentage positioning
  size: { width: number; height: number }; // Percentage sizing
  type: 'equipment' | 'document' | 'specimen' | 'computer' | 'tool' | 'artifact';
  requiresUnlock?: string[]; // IDs of elements that must be solved first
  isUnlocked: boolean;
  isSolved: boolean;
  puzzleType: 'mini-game' | 'code' | 'pattern' | 'sequence' | 'analysis' | 'collaboration';
  difficulty: 1 | 2 | 3 | 4 | 5;
  rewardInfo?: string; // Information/clue revealed when solved
  crossRoomClue?: {
    roomId: string;
    clueType: string;
    value: string;
  };
}

export interface RoomState {
  id: string;
  name: string;
  theme: string;
  backgroundImage: string;
  ambientSound?: string;
  elements: InteractiveElement[];
  completedPuzzles: string[];
  discoveredClues: string[];
  progressPercentage: number;
}

interface InteractiveRoomProps {
  roomData: RoomState;
  playerName: string;
  sharedClues: Record<string, any>;
  onPuzzleSolved: (elementId: string, reward: any) => void;
  onClueDiscovered: (clue: any) => void;
  onProgress: (percentage: number) => void;
}

// Function to get the appropriate icon component for each element
const getEquipmentIcon = (type: string) => {
  const iconProps = { size: 20, className: "text-current" };
  
  switch (type) {
    case 'equipment': return <Microscope {...iconProps} />;
    case 'document': return <FileText {...iconProps} />;
    case 'specimen': return <TestTube {...iconProps} />;
    case 'computer': return <Monitor {...iconProps} />;
    case 'tool': return <Wrench {...iconProps} />;
    case 'artifact': return <Mountain {...iconProps} />;
    default: return <Microscope {...iconProps} />;
  }
};

export const InteractiveRoom = ({
  roomData,
  playerName,
  sharedClues,
  onPuzzleSolved,
  onClueDiscovered,
  onProgress
}: InteractiveRoomProps) => {
  const [selectedElement, setSelectedElement] = useState<InteractiveElement | null>(null);
  const [roomState, setRoomState] = useState<RoomState>(roomData);
  const [showPuzzleModal, setShowPuzzleModal] = useState(false);
  const { toast } = useToast();

  // Update progress when puzzles are solved
  useEffect(() => {
    const solvedCount = roomState.elements.filter(el => el.isSolved).length;
    const progress = (solvedCount / roomState.elements.length) * 100;
    setRoomState(prev => ({ ...prev, progressPercentage: progress }));
    onProgress(progress);
  }, [roomState.elements, onProgress]);

  // Check for newly unlocked elements
  useEffect(() => {
    setRoomState(prev => ({
      ...prev,
      elements: prev.elements.map(element => {
        if (element.requiresUnlock && !element.isUnlocked) {
          const allRequiredSolved = element.requiresUnlock.every(reqId =>
            prev.elements.find(el => el.id === reqId)?.isSolved
          );
          if (allRequiredSolved) {
            toast({
              title: "New Equipment Unlocked!",
              description: `${element.name} is now accessible`,
            });
            return { ...element, isUnlocked: true };
          }
        }
        return element;
      })
    }));
  }, [roomState.elements, toast]);

  const handleElementClick = (element: InteractiveElement) => {
    if (!element.isUnlocked) {
      toast({
        title: "Equipment Locked",
        description: "You need to solve other puzzles first to access this equipment.",
        variant: "destructive",
      });
      return;
    }

    if (element.isSolved) {
      toast({
        title: "Already Completed",
        description: "This puzzle has been solved. Check your clues for the information.",
      });
      return;
    }

    setSelectedElement(element);
    setShowPuzzleModal(true);
  };

  const handlePuzzleSolved = (reward: any) => {
    if (!selectedElement) return;

    // Update element state
    setRoomState(prev => ({
      ...prev,
      elements: prev.elements.map(el =>
        el.id === selectedElement.id ? { ...el, isSolved: true } : el
      ),
      completedPuzzles: [...prev.completedPuzzles, selectedElement.id]
    }));

    // Handle rewards and clues
    if (selectedElement.rewardInfo) {
      setRoomState(prev => ({
        ...prev,
        discoveredClues: [...prev.discoveredClues, selectedElement.rewardInfo!]
      }));
      onClueDiscovered({
        source: selectedElement.name,
        info: selectedElement.rewardInfo,
        roomId: roomState.id
      });
    }

    // Handle cross-room clues
    if (selectedElement.crossRoomClue) {
      onClueDiscovered({
        ...selectedElement.crossRoomClue,
        source: selectedElement.name,
        sourceRoom: roomState.id
      });
    }

    onPuzzleSolved(selectedElement.id, reward);
    setShowPuzzleModal(false);
    setSelectedElement(null);

    toast({
      title: "Puzzle Solved!",
      description: `You've successfully completed ${selectedElement.name}`,
    });
  };

  return (
    <div className="relative w-full h-screen overflow-hidden room-transition-enter bg-background">
      {/* Animated Background Grid - matching landing page */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0ff_1px,transparent_1px),linear-gradient(to_bottom,#0ff_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_110%)] opacity-10" />
      
      {/* Matrix Rain Effect */}
      <div className="matrix-rain absolute inset-0 opacity-5" />
      
      {/* SVG Room Layout */}
      <div className="absolute inset-0 z-10">
        {roomState.id === 'bali-marine' && (
          <BaliMarineRoomSVG 
            roomId={roomState.id}
            elements={roomState.elements} 
            onElementClick={handleElementClick} 
          />
        )}
        {roomState.id === 'santorini-archaeological' && (
          <SantoriniArchaeologicalRoomSVG 
            roomId={roomState.id}
            elements={roomState.elements} 
            onElementClick={handleElementClick} 
          />
        )}
        {roomState.id === 'machu-picchu-conservation' && (
          <MachuPicchuConservationRoomSVG 
            roomId={roomState.id}
            elements={roomState.elements} 
            onElementClick={handleElementClick} 
          />
        )}
      </div>
      
      {/* Room Progress Header */}
      <div className="absolute top-4 left-4 right-4 z-20">
        <div className="bg-black/90 backdrop-blur-sm rounded-lg p-4 border border-cyan-500/30 progress-glow">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-xl font-bold text-white holographic-text">{roomState.name}</h2>
            <Badge variant="outline" className="text-white border-white animate-pulse-glow">
              {playerName}
            </Badge>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <Progress value={roomState.progressPercentage} className="h-2 progress-glow" />
            </div>
            <span className="text-sm text-white">
              {roomState.completedPuzzles.length}/{roomState.elements.length} Complete
            </span>
          </div>
        </div>
      </div>

      {/* Interactive Elements */}
      {roomState.elements.map((element) => (
        <button
          key={element.id}
          className={`absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-300 hover:scale-110 group ${
            element.isUnlocked 
              ? element.isSolved 
                ? 'opacity-60 ring-2 ring-green-500' 
                : 'opacity-90 hover:opacity-100 ring-2 ring-blue-500 equipment-active equipment-ping hover:equipment-hover'
              : 'opacity-30 cursor-not-allowed ring-2 ring-red-500'
          }`}
          style={{
            left: `${element.position.x}%`,
            top: `${element.position.y}%`,
            width: `${element.size.width}%`,
            height: `${element.size.height}%`,
          }}
          onClick={() => handleElementClick(element)}
        >
          {/* Element Visual */}
          <div className={`w-full h-full bg-gradient-to-br from-cyan-400/30 to-blue-600/30 rounded-lg border-2 border-current backdrop-blur-sm flex flex-col items-center justify-center p-2 status-indicator ${
            element.puzzleType === 'collaboration' ? 'collaboration-highlight' : ''
          }`}>
            <div className={`mb-1 ${element.isUnlocked ? 
              (element.isSolved ? "text-green-400" : "text-cyan-400") : 
              "text-red-400"
            }`}>
              {getEquipmentIcon(element.type)}
            </div>
            <span className="text-xs font-bold text-center text-white drop-shadow-lg holographic-text">
              {element.name}
            </span>
            {element.difficulty && (
              <div className="flex gap-1 mt-1">
                {Array.from({ length: element.difficulty }, (_, i) => (
                  <Star key={i} size={8} className="text-yellow-400 fill-current animate-pulse" />
                ))}
              </div>
            )}
            
            {/* Equipment status overlay */}
            {!element.isUnlocked && (
              <div className="absolute inset-0 bg-red-900/50 rounded-lg flex items-center justify-center">
                <div className="flex items-center gap-1">
                  <Lock size={12} className="text-red-200" />
                  <span className="text-red-200 text-xs font-bold">LOCKED</span>
                </div>
              </div>
            )}
            
            {element.isSolved && (
              <div className="absolute -top-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                <Check size={12} className="text-white" />
              </div>
            )}
          </div>
        </button>
      ))}

      {/* Clues Panel */}
      <div className="absolute bottom-4 right-4 w-80 max-h-96 z-20">
        <div className="bg-card/90 backdrop-blur-sm rounded-lg p-4 border border-border cartoon-shadow">
          <h3 className="text-lg font-bold text-foreground mb-3 font-mono neon-cyan">Discovered Clues</h3>
          <ScrollArea className="h-32">
            {roomState.discoveredClues.length === 0 ? (
              <p className="text-sm text-muted-foreground font-mono">No clues discovered yet...</p>
            ) : (
              <div className="space-y-2">
                {roomState.discoveredClues.map((clue, index) => (
                  <div key={index} className="bg-primary/10 border border-primary/30 rounded p-2">
                    <p className="text-xs text-foreground font-mono">{clue}</p>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>
        </div>
      </div>

      {/* Shared Clues Panel */}
      <div className="absolute bottom-4 left-4 w-80 max-h-96 z-20">
        <div className="bg-card/90 backdrop-blur-sm rounded-lg p-4 border border-border cartoon-shadow">
          <h3 className="text-lg font-bold text-foreground mb-3 font-mono neon-purple">Team Intel</h3>
          <ScrollArea className="h-32">
            {Object.keys(sharedClues).length === 0 ? (
              <p className="text-sm text-muted-foreground font-mono">No team intel yet...</p>
            ) : (
              <div className="space-y-2">
                {Object.entries(sharedClues).map(([key, clue]: [string, any]) => (
                  <div key={key} className="bg-secondary/10 border border-secondary/30 rounded p-2">
                    <p className="text-xs text-secondary font-mono">From {clue.sourceRoom}: {clue.info}</p>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>
        </div>
      </div>

      {/* Puzzle Modal */}
      <Dialog open={showPuzzleModal} onOpenChange={setShowPuzzleModal}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto modal-enter border-cyan-500/30 bg-black/95 backdrop-blur-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 holographic-text">
              {selectedElement?.name}
              <Badge variant="outline" className="animate-pulse-glow flex items-center gap-1">
                <span>Difficulty:</span>
                {Array.from({ length: selectedElement?.difficulty || 1 }, (_, i) => (
                  <Star key={i} size={12} className="text-yellow-400 fill-current" />
                ))}
              </Badge>
            </DialogTitle>
          </DialogHeader>
          
          {selectedElement && (
            <div className="space-y-4">
              <p className="text-muted-foreground">{selectedElement.description}</p>
              
              {/* Here we'll render different puzzle components based on type */}
              <div className="min-h-[300px] border rounded-lg p-4 bg-muted/50 border-cyan-500/20 scan-lines">
                <PuzzleRenderer
                  element={selectedElement}
                  sharedClues={sharedClues}
                  onSolved={handlePuzzleSolved}
                />
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

// Import specialized puzzle components
import {
  PatternPuzzle,
  CodePuzzle,
  AnalysisPuzzle,
  SequencePuzzle,
  CollaborationPuzzle,
  MiniGamePuzzle
} from "@/components/puzzles/SpecializedPuzzles";

// Puzzle renderer that selects the appropriate component based on puzzle type
const PuzzleRenderer = ({ element, sharedClues, onSolved }: {
  element: InteractiveElement;
  sharedClues: Record<string, any>;
  onSolved: (reward: any) => void;
}) => {
  const puzzleProps = { element, sharedClues, onSolved };

  switch (element.puzzleType) {
    case 'pattern':
      return <PatternPuzzle {...puzzleProps} />;
    case 'code':
      return <CodePuzzle {...puzzleProps} />;
    case 'analysis':
      return <AnalysisPuzzle {...puzzleProps} />;
    case 'sequence':
      return <SequencePuzzle {...puzzleProps} />;
    case 'collaboration':
      return <CollaborationPuzzle {...puzzleProps} />;
    case 'mini-game':
      return <MiniGamePuzzle {...puzzleProps} />;
    default:
      return (
        <div className="text-center py-8">
          <h3 className="text-lg font-bold mb-4">{String(element.puzzleType).toUpperCase()} Puzzle</h3>
          <p className="text-muted-foreground mb-4">
            Puzzle type not yet implemented: {element.puzzleType}
          </p>
          <Button onClick={() => onSolved({ info: element.rewardInfo })}>
            Skip (Development)
          </Button>
        </div>
      );
  }
};