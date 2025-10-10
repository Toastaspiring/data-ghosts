import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, AlertTriangle, Eye, EyeOff } from "lucide-react";

interface FactCheckPuzzleProps {
  falseStatements: string[];
  correctFacts: string[];
  onSolve: () => void;
}

export const FactCheckPuzzle = ({ falseStatements, correctFacts, onSolve }: FactCheckPuzzleProps) => {
  const [corrections, setCorrections] = useState<Record<number, number>>({});
  const [submitted, setSubmitted] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [revealedStatements, setRevealedStatements] = useState<Set<number>>(new Set());

  // Shuffle correct facts to make it harder (but keep same order for validation)
  const shuffledIndices = [0, 1, 2, 3].sort(() => Math.random() - 0.5);
  const shuffledFacts = shuffledIndices.map(i => ({
    text: correctFacts[i],
    originalIndex: i
  }));

  const toggleCorrection = (falseIdx: number, shuffledIdx: number) => {
    if (submitted) return;
    
    const originalCorrectIdx = shuffledFacts[shuffledIdx].originalIndex;
    
    if (corrections[falseIdx] === originalCorrectIdx) {
      const newCorrections = { ...corrections };
      delete newCorrections[falseIdx];
      setCorrections(newCorrections);
    } else {
      setCorrections({
        ...corrections,
        [falseIdx]: originalCorrectIdx,
      });
    }
    setShowFeedback(false);
  };

  const revealStatement = (falseIdx: number) => {
    setRevealedStatements(new Set([...revealedStatements, falseIdx]));
  };

  const handleSubmit = () => {
    setSubmitted(true);
    setShowFeedback(true);
    
    const allCorrected = Object.keys(corrections).length === falseStatements.length;
    const allCorrect = Object.entries(corrections).every(([falseIdx, correctIdx]) => {
      return parseInt(falseIdx) === correctIdx;
    });

    if (allCorrected && allCorrect) {
      setTimeout(onSolve, 1500);
    }
  };

  const handleReset = () => {
    setSubmitted(false);
    setShowFeedback(false);
  };

  const correctCount = Object.entries(corrections).filter(([falseIdx, correctIdx]) => 
    parseInt(falseIdx) === correctIdx
  ).length;

  const isSuccess = correctCount === falseStatements.length;

  return (
    <div className="space-y-6 p-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold neon-cyan flex items-center justify-center gap-2">
          <AlertTriangle className="w-6 h-6 text-yellow-500" />
          Correction des Fausses Infos
        </h2>
        <p className="text-muted-foreground text-sm">
          Identifiez la bonne correction pour chaque fausse information
        </p>
        <Badge variant="outline">
          Corrigées: {Object.keys(corrections).length}/{falseStatements.length}
        </Badge>
      </div>

      <div className="space-y-6">
        {falseStatements.map((falseStatement, falseIdx) => {
          const selectedCorrectionIdx = corrections[falseIdx];
          const hasCorrection = selectedCorrectionIdx !== undefined;
          const isRevealed = revealedStatements.has(falseIdx);
          const isCorrectChoice = submitted && selectedCorrectionIdx === falseIdx;

          return (
            <Card key={falseIdx} className="p-4 space-y-4">
              {/* False Statement */}
              <div className="flex items-start justify-between gap-3 p-3 bg-red-500/10 border border-red-500/50 rounded-lg">
                <div className="flex items-start gap-3 flex-1">
                  <XCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <div className="text-xs font-medium text-red-600 dark:text-red-400 mb-1">
                      Fausse Information #{falseIdx + 1}
                    </div>
                    <div className="text-sm">{falseStatement}</div>
                  </div>
                </div>
                
                {!isRevealed && !submitted && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => revealStatement(falseIdx)}
                    className="text-xs"
                  >
                    <Eye className="w-3 h-3 mr-1" />
                    Indice
                  </Button>
                )}
              </div>

              {/* Hint */}
              {isRevealed && !submitted && (
                <div className="text-xs text-yellow-600 dark:text-yellow-400 p-2 bg-yellow-500/10 rounded">
                  💡 La bonne correction correspond au numéro de cette fausse info
                </div>
              )}

              {/* Arrow */}
              <div className="text-center text-2xl">⬇️</div>

              {/* Correction Options - SHUFFLED */}
              <div className="space-y-2">
                <div className="text-sm font-medium">Sélectionnez le fait correct:</div>
                <div className="grid gap-2">
                  {shuffledFacts.map((fact, shuffledIdx) => {
                    const isSelected = selectedCorrectionIdx === fact.originalIndex;

                    return (
                      <Button
                        key={shuffledIdx}
                        variant={isSelected ? "default" : "outline"}
                        className={`justify-start text-left h-auto py-3 ${
                          isSelected ? "border-2 border-primary" : ""
                        } ${
                          submitted && isSelected && isCorrectChoice 
                            ? "bg-green-500/20 border-green-500" 
                            : submitted && isSelected 
                            ? "bg-destructive/20 border-destructive" 
                            : ""
                        }`}
                        onClick={() => toggleCorrection(falseIdx, shuffledIdx)}
                        disabled={submitted}
                      >
                        <CheckCircle className={`w-4 h-4 mr-2 flex-shrink-0 ${
                          submitted && isSelected && isCorrectChoice
                            ? "text-green-500"
                            : isSelected 
                            ? "text-primary-foreground" 
                            : "text-muted-foreground"
                        }`} />
                        <span className="flex-1">{fact.text}</span>
                      </Button>
                    );
                  })}
                </div>
              </div>

              {/* Status Badge */}
              {hasCorrection && !submitted && (
                <div className="flex items-center gap-2 p-2 bg-blue-500/10 border border-blue-500/50 rounded-lg">
                  <CheckCircle className="w-4 h-4 text-blue-500" />
                  <span className="text-xs text-blue-600 dark:text-blue-400">
                    Correction sélectionnée
                  </span>
                </div>
              )}
            </Card>
          );
        })}
      </div>

      {showFeedback && (
        <Card className={`p-4 ${isSuccess ? 'bg-green-500/10 border-green-500' : 'bg-destructive/10 border-destructive'}`}>
          <div className="text-center space-y-2">
            {isSuccess ? (
              <>
                <div className="text-2xl">✅</div>
                <p className="font-bold text-green-500">
                  Parfait ! Toutes les corrections sont exactes !
                </p>
                <p className="text-xs text-muted-foreground">
                  Leur crédibilité est ruinée.
                </p>
              </>
            ) : (
              <>
                <div className="text-2xl">❌</div>
                <p className="font-bold text-destructive">
                  {correctCount}/{falseStatements.length} corrections exactes
                </p>
                <p className="text-xs text-muted-foreground">
                  Vérifiez les options en rouge. Chaque fausse info a une correction correspondante.
                </p>
              </>
            )}
          </div>
        </Card>
      )}

      <div className="flex gap-2">
        <Button
          onClick={handleSubmit}
          disabled={Object.keys(corrections).length !== falseStatements.length || submitted}
          className="flex-1"
          size="lg"
        >
          Publier les Corrections ({Object.keys(corrections).length}/{falseStatements.length})
        </Button>
        
        {submitted && !isSuccess && (
          <Button
            onClick={handleReset}
            variant="outline"
            size="lg"
          >
            Réessayer
          </Button>
        )}
      </div>
    </div>
  );
};
