import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, AlertTriangle, Sparkles } from "lucide-react";

interface FactCheckPuzzleProps {
  falseStatements: string[];
  correctFacts: string[];
  onSolve: () => void;
}

export const FactCheckPuzzle = ({ falseStatements, correctFacts, onSolve }: FactCheckPuzzleProps) => {
  const [selectedMatches, setSelectedMatches] = useState<Record<number, number>>({});
  const [selectedFalse, setSelectedFalse] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);

  // Create misleading metrics for each correct fact (to make it harder)
  const factMetrics = correctFacts.map((_, idx) => ({
    popularity: Math.floor(Math.random() * 100) + 1,
    shares: Math.floor(Math.random() * 10000) + 1000,
    trend: idx % 2 === 0 ? "↑" : "↓"
  }));

  const selectFalse = (falseIdx: number) => {
    setSelectedFalse(falseIdx);
  };

  const selectCorrect = (correctIdx: number) => {
    if (selectedFalse === null) return;
    
    setSelectedMatches({
      ...selectedMatches,
      [selectedFalse]: correctIdx
    });
    setSelectedFalse(null);
    setShowFeedback(false);
  };

  const removeMatch = (falseIdx: number) => {
    const newMatches = { ...selectedMatches };
    delete newMatches[falseIdx];
    setSelectedMatches(newMatches);
  };

  const handleSubmit = () => {
    setSubmitted(true);
    setShowFeedback(true);
    
    // Check if all matches are correct
    const allCorrect = Object.entries(selectedMatches).every(
      ([falseIdx, correctIdx]) => parseInt(falseIdx) === correctIdx
    );
    
    const allMatched = Object.keys(selectedMatches).length === falseStatements.length;
    
    if (allCorrect && allMatched) {
      setTimeout(onSolve, 1500);
    }
  };

  const handleReset = () => {
    setSubmitted(false);
    setShowFeedback(false);
  };

  const correctCount = Object.entries(selectedMatches).filter(
    ([falseIdx, correctIdx]) => parseInt(falseIdx) === correctIdx
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
          Associez chaque fausse info avec sa correction scientifique
        </p>
        <Badge variant="outline">
          Matches: {Object.keys(selectedMatches).length}/{falseStatements.length}
        </Badge>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Left Column: False Statements */}
        <div className="space-y-3">
          <h3 className="font-bold text-sm flex items-center gap-2">
            <XCircle className="w-4 h-4 text-red-500" />
            Fausses Informations
          </h3>
          
          {falseStatements.map((statement, falseIdx) => {
            const isMatched = selectedMatches[falseIdx] !== undefined;
            const isSelected = selectedFalse === falseIdx;
            const matchedCorrectIdx = selectedMatches[falseIdx];
            const isCorrectMatch = submitted && matchedCorrectIdx === falseIdx;

            return (
              <Card
                key={falseIdx}
                className={`p-3 cursor-pointer transition-all ${
                  isSelected
                    ? "border-2 border-primary bg-primary/10"
                    : isMatched
                    ? submitted && isCorrectMatch
                      ? "border-2 border-green-500 bg-green-500/10"
                      : submitted
                      ? "border-2 border-destructive bg-destructive/10"
                      : "border-2 border-blue-500 bg-blue-500/10"
                    : "border-border hover:border-primary/50"
                }`}
                onClick={() => !submitted && !isMatched && selectFalse(falseIdx)}
              >
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <div className="text-xs font-bold text-red-600 dark:text-red-400">
                      #{falseIdx + 1}
                    </div>
                    {isMatched && !submitted && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 px-2 text-xs"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeMatch(falseIdx);
                        }}
                      >
                        ✕
                      </Button>
                    )}
                  </div>
                  <p className="text-sm">{statement}</p>
                  
                  {isMatched && (
                    <div className="pt-2 border-t border-border">
                      <div className="text-xs text-muted-foreground mb-1">
                        Associé avec:
                      </div>
                      <div className="text-xs font-medium">
                        Fait #{matchedCorrectIdx + 1}
                      </div>
                    </div>
                  )}
                </div>
              </Card>
            );
          })}
        </div>

        {/* Right Column: Correct Facts */}
        <div className="space-y-3">
          <h3 className="font-bold text-sm flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-green-500" />
            Faits Scientifiques
          </h3>
          
          {correctFacts.map((fact, correctIdx) => {
            const isAlreadyUsed = Object.values(selectedMatches).includes(correctIdx);
            const metrics = factMetrics[correctIdx];

            return (
              <Card
                key={correctIdx}
                className={`p-3 ${
                  isAlreadyUsed && !submitted
                    ? "opacity-50 cursor-not-allowed"
                    : selectedFalse !== null
                    ? "cursor-pointer hover:border-primary border-2 border-transparent"
                    : "cursor-default opacity-60"
                } transition-all`}
                onClick={() => {
                  if (!submitted && selectedFalse !== null && !isAlreadyUsed) {
                    selectCorrect(correctIdx);
                  }
                }}
              >
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <div className="text-xs font-bold text-green-600 dark:text-green-400">
                      Fait #{correctIdx + 1}
                    </div>
                    {!submitted && (
                      <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                        <Sparkles className="w-3 h-3" />
                        {metrics.popularity}%
                      </div>
                    )}
                  </div>
                  <p className="text-sm">{fact}</p>
                  
                  {!submitted && (
                    <div className="flex items-center gap-3 text-[10px] text-muted-foreground pt-2 border-t border-border">
                      <span>{metrics.trend} {metrics.shares.toLocaleString()} partages</span>
                    </div>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      </div>

      {showFeedback && (
        <Card className={`p-4 ${isSuccess ? 'bg-green-500/10 border-green-500' : 'bg-destructive/10 border-destructive'}`}>
          <div className="text-center space-y-2">
            {isSuccess ? (
              <>
                <div className="text-3xl">✅</div>
                <p className="font-bold text-green-500 text-lg">
                  Parfait ! Toutes les corrections sont exactes !
                </p>
                <p className="text-xs text-muted-foreground">
                  Leur crédibilité est détruite. La vérité est affichée.
                </p>
              </>
            ) : (
              <>
                <div className="text-3xl">❌</div>
                <p className="font-bold text-destructive text-lg">
                  {correctCount}/{falseStatements.length} associations correctes
                </p>
                <p className="text-xs text-muted-foreground">
                  💡 Indice: Chaque fausse info #{"{"}n{"}"} correspond au fait #{"{"}n{"}"}
                </p>
              </>
            )}
          </div>
        </Card>
      )}

      {!submitted && selectedFalse !== null && (
        <div className="text-center text-sm text-primary animate-pulse">
          👆 Sélectionnez un fait scientifique pour l'associer
        </div>
      )}

      <div className="flex gap-2">
        <Button
          onClick={handleSubmit}
          disabled={Object.keys(selectedMatches).length !== falseStatements.length || submitted}
          className="flex-1"
          size="lg"
        >
          Valider les Corrections ({Object.keys(selectedMatches).length}/{falseStatements.length})
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

      <div className="text-xs text-center text-muted-foreground space-y-1">
        <p>💡 Cliquez sur une fausse info, puis sur le fait correspondant</p>
        <p>⚠️ Les métriques de popularité sont trompeuses !</p>
      </div>
    </div>
  );
};
