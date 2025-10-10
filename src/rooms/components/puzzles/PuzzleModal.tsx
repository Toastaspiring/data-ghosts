import React, { useState, useEffect } from 'react';
import { PuzzleConfig } from '../../core/types';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { 
  X, 
  Clock, 
  Target, 
  AlertCircle, 
  CheckCircle,
  Lightbulb,
  RotateCcw
} from 'lucide-react';

// Import all puzzle components
import * as PuzzleComponents from '@/components/puzzles';

interface PuzzleModalProps {
  puzzle: PuzzleConfig;
  isOpen: boolean;
  onClose: () => void;
  onComplete: (puzzleId: string, solution: any) => void;
  className?: string;
}

export const PuzzleModal: React.FC<PuzzleModalProps> = ({
  puzzle,
  isOpen,
  onClose,
  onComplete,
  className
}) => {
  const [attempts, setAttempts] = useState(0);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [currentHint, setCurrentHint] = useState<string | null>(null);
  const [solution, setSolution] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Timer effect
  useEffect(() => {
    if (!isOpen) return;
    
    const timer = setInterval(() => {
      setTimeElapsed(prev => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [isOpen]);

  // Format time
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Get difficulty color
  const getDifficultyColor = (level: number) => {
    switch (level) {
      case 1: return 'bg-green-500/20 text-green-400 border-green-500/40';
      case 2: return 'bg-blue-500/20 text-blue-400 border-blue-500/40';
      case 3: return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/40';
      case 4: return 'bg-orange-500/20 text-orange-400 border-orange-500/40';
      case 5: return 'bg-red-500/20 text-red-400 border-red-500/40';
      default: return 'bg-primary/20 text-primary border-primary/40';
    }
  };

  // Calculate progress (if time limit exists)
  const getTimeProgress = () => {
    if (!puzzle.timeLimit) return 100;
    return Math.max(0, ((puzzle.timeLimit - timeElapsed) / puzzle.timeLimit) * 100);
  };

  // Handle hint request
  const useHint = () => {
    if (hintsUsed >= (puzzle.hints?.length || 0)) return;
    
    const nextHint = puzzle.hints?.[hintsUsed];
    if (nextHint) {
      setCurrentHint(nextHint);
      setHintsUsed(prev => prev + 1);
    }
  };

  // Handle submission - Not used in most puzzles since they call onComplete directly
  const handleSubmit = async () => {
    if (!solution) return;
    
    setIsSubmitting(true);
    setError(null);
    
    try {
      // Validate solution based on puzzle configuration
      const isValid = validateSolution(solution);
      
      if (isValid) {
        onComplete(puzzle.id, { solved: true, solution });
        onClose();
      } else {
        setAttempts(prev => prev + 1);
        setError('Incorrect solution. Please try again.');
        
        // Check if max attempts reached
        if (puzzle.validation?.attempts && attempts + 1 >= puzzle.validation.attempts) {
          setError('Maximum attempts reached. Puzzle failed.');
          setTimeout(() => onClose(), 2000);
        }
      }
    } catch (err) {
      setError('An error occurred while validating your solution.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Validate solution (simplified - would be more complex in real implementation)
  const validateSolution = (userSolution: any): boolean => {
    if (!puzzle.validation) return true; // If no validation defined, accept
    
    const { validation } = puzzle;
    
    switch (validation.type) {
      case 'exact':
        return userSolution === validation.correctAnswer;
      case 'pattern':
        if (validation.correctPattern && Array.isArray(userSolution)) {
          return JSON.stringify(userSolution) === JSON.stringify(validation.correctPattern);
        }
        return false;
      case 'custom':
        if (validation.validator) {
          try {
            return validation.validator(userSolution);
          } catch {
            return false;
          }
        }
        return false;
      default:
        return true; // Accept if validation type unknown
    }
  };

  // Reset puzzle
  const resetPuzzle = () => {
    setAttempts(0);
    setHintsUsed(0);
    setTimeElapsed(0);
    setCurrentHint(null);
    setSolution(null);
    setError(null);
  };

  // Check if time limit exceeded
  const isTimeUp = puzzle.timeLimit && timeElapsed >= puzzle.timeLimit;

  // Render the appropriate puzzle component
  const renderPuzzleComponent = () => {
    const componentName = puzzle.component;
    const PuzzleComponent = (PuzzleComponents as any)[componentName];

    if (!PuzzleComponent) {
      return (
        <div className="p-6 bg-background/50 backdrop-blur-sm rounded-md border border-primary/20">
          <div className="text-center space-y-4">
            <AlertCircle className="w-16 h-16 text-yellow-400 mx-auto" />
            <h3 className="text-lg font-semibold">Puzzle Component Not Found</h3>
            <p className="text-muted-foreground">
              Component "{componentName}" is not implemented yet.
            </p>
            <p className="text-sm text-muted-foreground">
              Puzzle Type: {puzzle.type}
            </p>
          </div>
        </div>
      );
    }

    // Map puzzle data to component props
    const puzzleProps: any = {
      ...puzzle.data,
      onSolve: () => {
        onComplete(puzzle.id, { solved: true });
        onClose();
      },
    };

    return <PuzzleComponent {...puzzleProps} />;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className={cn(
        "max-w-4xl max-h-[90vh] overflow-y-auto",
        "bg-background/95 backdrop-blur-sm border border-primary/40",
        "shadow-[0_0_40px_rgba(0,255,255,0.2)]",
        className
      )}>
        <DialogHeader className="space-y-4 border-b border-primary/20 pb-4">
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <DialogTitle className="text-xl font-bold font-mono neon-cyan">
                {puzzle.id.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
              </DialogTitle>
              <div className="flex items-center gap-2">
                <Badge className={getDifficultyColor(puzzle.difficulty)}>
                  Difficulty: {puzzle.difficulty}/5
                </Badge>
                {puzzle.timeLimit && (
                  <Badge variant="outline" className="neon-border">
                    <Clock className="w-3 h-3 mr-1" />
                    {formatTime(puzzle.timeLimit - timeElapsed)}
                  </Badge>
                )}
              </div>
            </div>
            
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onClose}
              className="neon-border"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>

          {/* Timer Progress Bar */}
          {puzzle.timeLimit && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Time Remaining</span>
                <span className={cn(
                  "font-mono",
                  getTimeProgress() < 25 && "text-red-400",
                  getTimeProgress() < 50 && getTimeProgress() >= 25 && "text-yellow-400"
                )}>
                  {formatTime(Math.max(0, puzzle.timeLimit - timeElapsed))}
                </span>
              </div>
              <Progress 
                value={getTimeProgress()} 
                className={cn(
                  "h-2",
                  getTimeProgress() < 25 && "bg-red-500/20",
                  getTimeProgress() < 50 && getTimeProgress() >= 25 && "bg-yellow-500/20"
                )}
              />
            </div>
          )}
        </DialogHeader>

        {/* Puzzle Content */}
        <div className="space-y-6 py-4">
          {/* Current Hint Display */}
          {currentHint && (
            <div className="p-4 bg-yellow-400/10 border border-yellow-400/30 rounded-md">
              <div className="flex items-start gap-2">
                <Lightbulb className="w-4 h-4 text-yellow-400 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-yellow-400 mb-1">Hint {hintsUsed}</h4>
                  <p className="text-sm">{currentHint}</p>
                </div>
              </div>
            </div>
          )}

          {/* Error Display */}
          {error && (
            <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-md">
              <div className="flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-red-400 mt-0.5" />
                <p className="text-sm text-red-400">{error}</p>
              </div>
            </div>
          )}

          {/* Puzzle Component */}
          <div className="min-h-[300px]">
            {renderPuzzleComponent()}
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-primary/20 pt-4 space-y-4">
          {/* Statistics */}
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>Attempts: {attempts}</span>
            <span>Hints Used: {hintsUsed}/{puzzle.hints?.length || 0}</span>
            <span>Time: {formatTime(timeElapsed)}</span>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-between">
            <div className="flex gap-2">
              {puzzle.hints && hintsUsed < puzzle.hints.length && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={useHint}
                  className="neon-border"
                >
                  <Lightbulb className="w-4 h-4 mr-2" />
                  Use Hint
                </Button>
              )}
              
              <Button
                variant="outline"
                size="sm"
                onClick={resetPuzzle}
                className="neon-border"
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Reset
              </Button>
            </div>

            <div className="flex gap-2">
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={!solution || isSubmitting || isTimeUp}
                className="neon-glow"
              >
                {isSubmitting ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                ) : (
                  <CheckCircle className="w-4 h-4 mr-2" />
                )}
                Submit Solution
              </Button>
            </div>
          </div>
        </div>

        {/* Time Up Overlay */}
        {isTimeUp && (
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center">
            <div className="text-center space-y-4">
              <AlertCircle className="w-16 h-16 text-red-400 mx-auto" />
              <h3 className="text-xl font-bold text-red-400">Time's Up!</h3>
              <p className="text-muted-foreground">
                You've run out of time for this puzzle.
              </p>
              <Button onClick={onClose} variant="outline">
                Close
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default PuzzleModal;