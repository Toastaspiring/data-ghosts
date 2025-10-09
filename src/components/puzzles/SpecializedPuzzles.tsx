import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { InteractiveElement } from "@/components/rooms/InteractiveRoom";

interface PuzzleComponentProps {
  element: InteractiveElement;
  sharedClues: Record<string, any>;
  onSolved: (reward: any) => void;
}

// Pattern Recognition Puzzle - For microscopes, coral samples, etc.
export const PatternPuzzle = ({ element, onSolved }: PuzzleComponentProps) => {
  const [selectedPattern, setSelectedPattern] = useState<number[]>([]);
  const [targetPattern] = useState([1, 3, 2, 4, 1, 3]); // Coral bleaching pattern
  const [attempts, setAttempts] = useState(0);
  const maxAttempts = 3;

  const patterns = [
    { id: 1, color: "bg-red-500", label: "Severe Bleaching" },
    { id: 2, color: "bg-yellow-500", label: "Mild Stress" },
    { id: 3, color: "bg-blue-500", label: "Healthy" },
    { id: 4, color: "bg-gray-500", label: "Dead Coral" }
  ];

  const handlePatternClick = (patternId: number) => {
    if (selectedPattern.length < targetPattern.length) {
      setSelectedPattern([...selectedPattern, patternId]);
    }
  };

  const checkPattern = () => {
    if (JSON.stringify(selectedPattern) === JSON.stringify(targetPattern)) {
      onSolved({ 
        type: "pattern", 
        success: true, 
        info: element.rewardInfo,
        data: selectedPattern 
      });
    } else {
      setAttempts(attempts + 1);
      if (attempts + 1 >= maxAttempts) {
        // Provide hint after failed attempts
        onSolved({ 
          type: "pattern", 
          success: false, 
          hint: "The pattern follows: Severe → Healthy → Mild → Dead → Severe → Healthy" 
        });
      } else {
        setSelectedPattern([]);
      }
    }
  };

  return (
    <Card className="bg-background/95 backdrop-blur-md border-primary/30 cartoon-shadow">
      <CardHeader>
        <CardTitle className="neon-cyan font-mono">Coral Bleaching Pattern Analysis</CardTitle>
        <p className="text-sm text-muted-foreground font-mono">
          Identify the sequence of coral health states observed in the samples
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-2">
          {patterns.map((pattern) => (
            <Button
              key={pattern.id}
              variant="outline"
              className={`${pattern.color} text-white hover:opacity-80 hover:scale-105 transition-all duration-300 font-mono border-2 hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]`}
              onClick={() => handlePatternClick(pattern.id)}
            >
              {pattern.label}
            </Button>
          ))}
        </div>
        
        <div className="space-y-2">
          <h4 className="font-semibold neon-cyan font-mono">Selected Pattern:</h4>
          <div className="flex gap-2">
            {selectedPattern.map((patternId, index) => {
              const pattern = patterns.find(p => p.id === patternId);
              return (
                <div key={index} className={`w-8 h-8 rounded border-2 border-cyan-400/50 ${pattern?.color} animate-pulse-glow`} />
              );
            })}
            {Array.from({ length: targetPattern.length - selectedPattern.length }, (_, i) => (
              <div key={`empty-${i}`} className="w-8 h-8 rounded border border-dashed border-gray-400 bg-background/20" />
            ))}
          </div>
        </div>

        <div className="flex justify-between items-center">
          <Badge variant="outline" className="border-secondary/50 text-secondary font-mono">
            Attempts: {attempts}/{maxAttempts}
          </Badge>
          <div className="space-x-2">
            <Button variant="outline" onClick={() => setSelectedPattern([])} className="border-primary/50 text-primary hover:bg-primary/20 font-mono">
              Clear
            </Button>
            <Button 
              onClick={checkPattern}
              disabled={selectedPattern.length !== targetPattern.length}
              className="bg-primary hover:bg-primary/90 text-primary-foreground font-mono animate-pulse-glow"
            >
              Analyze Pattern
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Code Breaking Puzzle - For databases, ancient texts, etc.
export const CodePuzzle = ({ element, sharedClues, onSolved }: PuzzleComponentProps) => {
  const [codeInput, setCodeInput] = useState("");
  const [hints, setHints] = useState<string[]>([]);
  const [attempts, setAttempts] = useState(0);
  
  // The code is derived from shared clues if available
  const correctCode = element.id === "specimen-archive" ? "ALG847" : 
                     element.id === "ancient-texts" ? "POSEIDON" : "LINEAR3600";

  useEffect(() => {
    // Provide hints based on shared clues
    const availableHints = [];
    if (Object.keys(sharedClues).length > 0) {
      availableHints.push("Check the team intel for relevant codes or numbers");
    }
    if (element.id === "ancient-texts") {
      availableHints.push("The answer relates to the god of the sea in Greek mythology");
    }
    setHints(availableHints);
  }, [sharedClues, element.id]);

  const handleSubmit = () => {
    if (codeInput.toUpperCase() === correctCode) {
      onSolved({ 
        type: "code", 
        success: true, 
        info: element.rewardInfo,
        code: correctCode 
      });
    } else {
      setAttempts(attempts + 1);
      if (attempts >= 2) {
        setHints(prev => [...prev, `The code contains ${correctCode.length} characters`]);
      }
    }
  };

  return (
    <Card className="bg-background/95 backdrop-blur-md border-primary/30 cartoon-shadow">
      <CardHeader>
        <CardTitle className="neon-cyan font-mono">Access Code Required</CardTitle>
        <p className="text-sm text-muted-foreground font-mono">
          Enter the access code to unlock {element.name}
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Input
            placeholder="Enter access code..."
            value={codeInput}
            onChange={(e) => setCodeInput(e.target.value)}
            className="font-mono text-center uppercase bg-background/50 border-primary/30 text-primary placeholder:text-primary/50 focus:border-primary focus:ring-primary/50"
          />
          <Button onClick={handleSubmit} className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-mono animate-pulse-glow">
            Submit Code
          </Button>
        </div>

        {hints.length > 0 && (
          <div className="space-y-2">
            <h4 className="font-semibold neon-cyan font-mono">Hints:</h4>
            {hints.map((hint, index) => (
              <p key={index} className="text-sm text-cyan-300 bg-primary/20 border border-primary/30 p-2 rounded font-mono">
                {hint}
              </p>
            ))}
          </div>
        )}

        <Badge variant="outline" className="border-secondary/50 text-secondary font-mono">
          Attempts: {attempts}
        </Badge>
      </CardContent>
    </Card>
  );
};

// Analysis Puzzle - For pH meters, soil analysis, etc.
export const AnalysisPuzzle = ({ element, onSolved }: PuzzleComponentProps) => {
  const [measurements, setMeasurements] = useState<number[]>([]);
  const [currentReading, setCurrentReading] = useState(7.0);
  const [analysisComplete, setAnalysisComplete] = useState(false);

  const targetReadings = element.id === "ph-meter" ? [7.2, 6.8, 6.5, 6.1] : [15.2, 18.7, 22.1, 19.8];
  const unit = element.id === "ph-meter" ? "pH" : "°C";
  const description = element.id === "ph-meter" ? "pH Levels" : "Temperature Readings";

  const takeMeasurement = () => {
    if (measurements.length < targetReadings.length) {
      setMeasurements([...measurements, currentReading]);
      // Auto-advance to next target reading with some variance
      if (measurements.length + 1 < targetReadings.length) {
        const nextTarget = targetReadings[measurements.length + 1];
        setCurrentReading(nextTarget + (Math.random() - 0.5) * 0.4);
      }
    }
  };

  const analyzeData = () => {
    // Check if measurements are close to targets
    const isAccurate = measurements.every((reading, index) => 
      Math.abs(reading - targetReadings[index]) < 0.3
    );

    if (isAccurate) {
      setAnalysisComplete(true);
      onSolved({ 
        type: "analysis", 
        success: true, 
        info: element.rewardInfo,
        data: measurements 
      });
    }
  };

  return (
    <Card className="bg-background/95 backdrop-blur-md border-primary/30 cartoon-shadow">
      <CardHeader>
        <CardTitle className="neon-cyan font-mono">{description} Analysis</CardTitle>
        <p className="text-sm text-muted-foreground font-mono">
          Take {targetReadings.length} measurements to complete the analysis
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-center">
          <div className="text-4xl font-mono bg-black/80 text-green-400 p-4 rounded border-2 border-green-400/50 neon-green animate-pulse-glow">
            {currentReading.toFixed(1)} {unit}
          </div>
          <Button 
            onClick={takeMeasurement} 
            disabled={measurements.length >= targetReadings.length}
            className="mt-2 bg-primary hover:bg-primary/90 text-primary-foreground font-mono animate-pulse-glow"
          >
            Take Measurement
          </Button>
        </div>

        <Progress value={(measurements.length / targetReadings.length) * 100} className="progress-glow" />

        <div className="space-y-2">
          <h4 className="font-semibold neon-cyan font-mono">Recorded Measurements:</h4>
          <div className="grid grid-cols-4 gap-2">
            {measurements.map((measurement, index) => (
              <div key={index} className="bg-background/50 border border-primary/30 p-2 rounded text-center text-primary font-mono">
                {measurement.toFixed(1)} {unit}
              </div>
            ))}
          </div>
        </div>

        {measurements.length === targetReadings.length && !analysisComplete && (
          <Button onClick={analyzeData} className="w-full bg-secondary hover:bg-secondary/90 text-secondary-foreground font-mono animate-pulse-glow">
            Complete Analysis
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

// Sequence Puzzle - For temperature probes, water systems, etc.
export const SequencePuzzle = ({ element, onSolved }: PuzzleComponentProps) => {
  const [sequence, setSequence] = useState<string[]>([]);
  const [availableSteps] = useState([
    "Initialize System",
    "Calibrate Sensors", 
    "Begin Data Collection",
    "Apply Temperature Correction",
    "Validate Readings",
    "Generate Report"
  ]);
  const [correctSequence] = useState([0, 1, 2, 3, 4, 5]);

  const addToSequence = (stepIndex: number) => {
    if (!sequence.includes(stepIndex.toString())) {
      setSequence([...sequence, stepIndex.toString()]);
    }
  };

  const removeFromSequence = (index: number) => {
    setSequence(sequence.filter((_, i) => i !== index));
  };

  const checkSequence = () => {
    const userSequence = sequence.map(Number);
    if (JSON.stringify(userSequence) === JSON.stringify(correctSequence)) {
      onSolved({ 
        type: "sequence", 
        success: true, 
        info: element.rewardInfo,
        sequence: userSequence 
      });
    } else {
      setSequence([]);
    }
  };

  return (
    <Card className="bg-background/95 backdrop-blur-md border-primary/30 cartoon-shadow">
      <CardHeader>
        <CardTitle className="neon-cyan font-mono">Equipment Operating Sequence</CardTitle>
        <p className="text-sm text-muted-foreground font-mono">
          Arrange the steps in the correct order to operate the equipment
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-2">
          {availableSteps.map((step, index) => (
            <Button
              key={index}
              variant="outline"
              onClick={() => addToSequence(index)}
              disabled={sequence.includes(index.toString())}
              className="text-left border-primary/30 text-primary hover:bg-primary/20 hover:scale-105 transition-all duration-300 font-mono hover:drop-shadow-[0_0_8px_rgba(6,182,212,0.5)]"
            >
              {index + 1}. {step}
            </Button>
          ))}
        </div>

        <div className="space-y-2">
          <h4 className="font-semibold neon-cyan font-mono">Current Sequence:</h4>
          <div className="space-y-1">
            {sequence.map((stepIndex, index) => (
              <div key={index} className="flex items-center justify-between bg-background/50 border border-primary/30 p-2 rounded">
                <span className="text-primary font-mono">{index + 1}. {availableSteps[parseInt(stepIndex)]}</span>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => removeFromSequence(index)}
                  className="text-red-400 hover:text-red-300 hover:bg-red-400/20"
                >
                  ✕
                </Button>
              </div>
            ))}
          </div>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setSequence([])} className="border-secondary/50 text-secondary hover:bg-secondary/20 font-mono">
            Clear All
          </Button>
          <Button 
            onClick={checkSequence}
            disabled={sequence.length !== availableSteps.length}
            className="bg-primary hover:bg-primary/90 text-primary-foreground font-mono animate-pulse-glow"
          >
            Execute Sequence
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

// Collaboration Puzzle - Requires input from other players/rooms
export const CollaborationPuzzle = ({ element, sharedClues, onSolved }: PuzzleComponentProps) => {
  const [playerInputs, setPlayerInputs] = useState<Record<string, string>>({});
  const [requiredClues] = useState(2); // Number of clues needed from other rooms
  const [hasEnoughClues, setHasEnoughClues] = useState(false);

  useEffect(() => {
    setHasEnoughClues(Object.keys(sharedClues).length >= requiredClues);
  }, [sharedClues, requiredClues]);

  const handleInputChange = (player: string, value: string) => {
    setPlayerInputs(prev => ({ ...prev, [player]: value }));
  };

  const submitCollaboration = () => {
    if (hasEnoughClues && Object.keys(playerInputs).length >= 1) {
      onSolved({ 
        type: "collaboration", 
        success: true, 
        info: element.rewardInfo,
        playerInputs,
        sharedClues 
      });
    }
  };

  return (
    <Card className="bg-background/95 backdrop-blur-md border-primary/30 cartoon-shadow">
      <CardHeader>
        <CardTitle className="neon-cyan font-mono">Team Collaboration Required</CardTitle>
        <p className="text-sm text-muted-foreground font-mono">
          This puzzle requires information from other research stations
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <h4 className="font-semibold neon-purple font-mono">Shared Team Intel:</h4>
          {Object.keys(sharedClues).length === 0 ? (
            <p className="text-muted-foreground font-mono animate-pulse">Waiting for data from other stations...</p>
          ) : (
            <div className="space-y-2">
              {Object.entries(sharedClues).map(([key, clue]: [string, any]) => (
                <div key={key} className="bg-secondary/20 border border-secondary/30 p-3 rounded font-mono">
                  <strong className="text-secondary">From {clue.sourceRoom}:</strong> 
                  <span className="text-secondary/90"> {clue.info || clue.value}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-2">
          <h4 className="font-semibold neon-cyan font-mono">Your Analysis:</h4>
          <Input
            placeholder="Enter your findings based on the shared intel..."
            value={playerInputs.current || ""}
            onChange={(e) => handleInputChange("current", e.target.value)}
            className="font-mono bg-background/50 border-primary/30 text-primary placeholder:text-primary/50 focus:border-primary focus:ring-primary/50"
          />
        </div>

        <div className="flex items-center justify-between">
          <Badge variant={hasEnoughClues ? "default" : "secondary"} className="font-mono">
            Intel: {Object.keys(sharedClues).length}/{requiredClues}
          </Badge>
          <Button 
            onClick={submitCollaboration}
            disabled={!hasEnoughClues || !playerInputs.current}
            className="bg-primary hover:bg-primary/90 text-primary-foreground font-mono animate-pulse-glow"
          >
            Submit Collaborative Analysis
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

// Mini-game placeholder - For sonar, ground radar, etc.
export const MiniGamePuzzle = ({ element, onSolved }: PuzzleComponentProps) => {
  const [gameProgress, setGameProgress] = useState(0);
  const [gameActive, setGameActive] = useState(false);

  const startGame = () => {
    setGameActive(true);
    setGameProgress(0);
    
    // Simulate mini-game progress
    const interval = setInterval(() => {
      setGameProgress(prev => {
        if (prev >= 100) {
          setGameActive(false);
          clearInterval(interval);
          onSolved({ 
            type: "mini-game", 
            success: true, 
            info: element.rewardInfo,
            score: 100 
          });
          return 100;
        }
        return prev + 10;
      });
    }, 500);
  };

  return (
    <Card className="bg-background/95 backdrop-blur-md border-primary/30 cartoon-shadow">
      <CardHeader>
        <CardTitle className="neon-cyan font-mono">{element.name} Operation</CardTitle>
        <p className="text-sm text-muted-foreground font-mono">
          Interactive equipment operation simulation
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-center">
          <div className="w-32 h-32 mx-auto bg-gradient-to-br from-cyan-400/50 to-purple-600/50 rounded-full flex items-center justify-center mb-4 border-2 border-primary/50 animate-pulse-glow">
            <div className="text-primary font-bold text-2xl font-mono">
              {gameActive ? "⚡" : "▶️"}
            </div>
          </div>
          
          {gameActive && (
            <Progress value={gameProgress} className="mb-4 progress-glow" />
          )}
          
          <Button 
            onClick={startGame} 
            disabled={gameActive}
            size="lg"
            className="bg-primary hover:bg-primary/90 text-primary-foreground font-mono animate-pulse-glow"
          >
            {gameActive ? "Running..." : "Start Equipment"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};