import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, AlertTriangle } from "lucide-react";

interface FactCheckPuzzleProps {
  falseStatements: string[];
  correctFacts: string[];
  onSolve: () => void;
}

export const FactCheckPuzzle = ({ falseStatements, correctFacts, onSolve }: FactCheckPuzzleProps) => {
  const [corrections, setCorrections] = useState<Record<number, number>>({});
  const [showHints, setShowHints] = useState(false);

  const toggleCorrection = (falseIdx: number, correctIdx: number) => {
    if (corrections[falseIdx] === correctIdx) {
      const newCorrections = { ...corrections };
      delete newCorrections[falseIdx];
      setCorrections(newCorrections);
    } else {
      setCorrections({
        ...corrections,
        [falseIdx]: correctIdx,
      });
    }
  };

  const handleSubmit = () => {
    // Check if all statements are corrected
    const allCorrected = Object.keys(corrections).length === falseStatements.length;
    const allCorrect = Object.entries(corrections).every(([falseIdx, correctIdx]) => {
      return parseInt(falseIdx) === correctIdx;
    });

    if (allCorrected && allCorrect) {
      onSolve();
    } else {
      setShowHints(true);
    }
  };

  return (
    <div className="space-y-6 p-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold neon-cyan flex items-center justify-center gap-2">
          <AlertTriangle className="w-6 h-6 text-yellow-500" />
          Correction des Fausses Infos
        </h2>
        <p className="text-muted-foreground">
          Remplacez chaque fausse information par le fait scientifique correct
        </p>
        <Badge variant="outline">
          Corrigées: {Object.keys(corrections).length}/{falseStatements.length}
        </Badge>
      </div>

      <div className="space-y-6">
        {falseStatements.map((falseStatement, falseIdx) => {
          const selectedCorrection = corrections[falseIdx];
          const hasCorrection = selectedCorrection !== undefined;

          return (
            <Card key={falseIdx} className="p-4 space-y-4">
              {/* False Statement */}
              <div className="flex items-start gap-3 p-3 bg-red-500/10 border border-red-500/50 rounded-lg">
                <XCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <div className="text-sm font-medium text-red-600 dark:text-red-400">
                    Fausse Information
                  </div>
                  <div className="text-sm">{falseStatement}</div>
                </div>
              </div>

              {/* Arrow */}
              <div className="text-center text-2xl">⬇️</div>

              {/* Correction Options */}
              <div className="space-y-2">
                <div className="text-sm font-medium">Sélectionnez le fait correct:</div>
                <div className="grid gap-2">
                  {correctFacts.map((correctFact, correctIdx) => {
                    const isSelected = selectedCorrection === correctIdx;
                    const isCorrect = falseIdx === correctIdx;

                    return (
                      <Button
                        key={correctIdx}
                        variant={isSelected ? "default" : "outline"}
                        className={`justify-start text-left h-auto py-3 ${
                          isSelected ? "border-2 border-primary" : ""
                        }`}
                        onClick={() => toggleCorrection(falseIdx, correctIdx)}
                      >
                        <CheckCircle className={`w-4 h-4 mr-2 flex-shrink-0 ${
                          isSelected ? "text-primary-foreground" : "text-muted-foreground"
                        }`} />
                        <span className="flex-1">{correctFact}</span>
                      </Button>
                    );
                  })}
                </div>
              </div>

              {/* Status Badge */}
              {hasCorrection && (
                <div className="flex items-center gap-2 p-2 bg-green-500/10 border border-green-500/50 rounded-lg">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="text-sm text-green-600 dark:text-green-400">
                    Correction appliquée
                  </span>
                </div>
              )}
            </Card>
          );
        })}
      </div>

      {showHints && (
        <div className="bg-yellow-500/10 border border-yellow-500/50 rounded-lg p-4 text-center space-y-2">
          <p className="text-yellow-600 dark:text-yellow-400 font-bold">
            💡 Astuce: Associez chaque fausse info avec le fait qui la contredit directement
          </p>
          <p className="text-sm text-muted-foreground">
            Les faits corrects suivent le même ordre que les fausses informations
          </p>
        </div>
      )}

      <Button
        onClick={handleSubmit}
        disabled={Object.keys(corrections).length !== falseStatements.length}
        className="w-full"
        size="lg"
      >
        Publier les Corrections ({Object.keys(corrections).length}/{falseStatements.length})
      </Button>
    </div>
  );
};
