import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, AlertTriangle, HelpCircle, Brain } from "lucide-react";

interface FactCheckPuzzleProps {
  falseStatements: string[];
  correctFacts: string[];
  onSolve: () => void;
}

interface FactOption {
  text: string;
  isCorrect: boolean;
  credibilityScore: number;
  originalIndex?: number;
}

// Generate deceptive options for each false statement
const generateOptionsForStatement = (falseIdx: number, correctFact: string): FactOption[] => {
  // Generate plausible-sounding but incorrect alternatives
  const deceptiveOptions: Record<number, string[]> = {
    0: [ // Vaccins
      "Les vaccins contiennent des traces de métaux qui peuvent affecter le cerveau",
      "Les vaccins sont sûrs mais causent des effets secondaires à long terme",
      "Les vaccins naturels sont plus efficaces que les vaccins chimiques"
    ],
    1: [ // Terre
      "La Terre a une forme légèrement ovale selon les dernières études",
      "La Terre est cylindrique selon des documents déclassifiés",
      "La Terre est plate aux pôles mais ronde à l'équateur"
    ],
    2: [ // 5G
      "Le 5G affaiblit le système immunitaire à long terme",
      "Le 5G utilise des fréquences dangereuses selon certains experts",
      "Le 5G nécessite plus de recherches avant d'être considéré sûr"
    ],
    3: [ // Chemtrails
      "Les traînées contiennent des produits chimiques pour contrôler la météo",
      "Les avions relâchent parfois des agents de géo-ingénierie",
      "Les traînées persistent à cause de la pollution atmosphérique"
    ]
  };

  const deceptive = deceptiveOptions[falseIdx] || [
    "Cette affirmation est partiellement vraie",
    "Des études récentes montrent des résultats mitigés",
    "La vérité se trouve entre les deux positions"
  ];

  // Mix correct fact with deceptive ones
  const options: FactOption[] = [
    { text: correctFact, isCorrect: true, credibilityScore: 70 },
    ...deceptive.map((text, idx) => ({ 
      text, 
      isCorrect: false, 
      credibilityScore: 85 - (idx * 10)
    }))
  ];

  // Shuffle but remember original positions
  return options
    .map((opt, idx) => ({ ...opt, originalIndex: idx }))
    .sort(() => Math.random() - 0.5);
};

export const FactCheckPuzzle = ({ falseStatements, correctFacts, onSolve }: FactCheckPuzzleProps) => {
  const [corrections, setCorrections] = useState<Record<number, number>>({});
  const [submitted, setSubmitted] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [hintsUsed, setHintsUsed] = useState<Set<number>>(new Set());

  // Memoize options generation to prevent re-shuffling on each render
  const allOptions = useMemo(() => {
    return falseStatements.map((_, idx) => 
      generateOptionsForStatement(idx, correctFacts[idx] || "")
    );
  }, [falseStatements, correctFacts]);

  const toggleCorrection = (falseIdx: number, optionIdx: number) => {
    if (submitted) return;
    
    if (corrections[falseIdx] === optionIdx) {
      const newCorrections = { ...corrections };
      delete newCorrections[falseIdx];
      setCorrections(newCorrections);
    } else {
      setCorrections({
        ...corrections,
        [falseIdx]: optionIdx,
      });
    }
    setShowFeedback(false);
  };

  const useHint = (falseIdx: number) => {
    setHintsUsed(new Set([...hintsUsed, falseIdx]));
  };

  const calculateScore = () => {
    let correct = 0;
    Object.entries(corrections).forEach(([falseIdx, optionIdx]) => {
      const options = allOptions[Number(falseIdx)];
      if (options && options[optionIdx]) {
        const option = options[optionIdx];
        if (option.isCorrect) correct++;
      }
    });
    return correct;
  };

  const handleSubmit = () => {
    setSubmitted(true);
    setShowFeedback(true);
    
    const score = calculateScore();
    if (score === falseStatements.length) {
      setTimeout(onSolve, 2000);
    }
  };

  const handleReset = () => {
    setSubmitted(false);
    setShowFeedback(false);
    setCorrections({});
  };

  const correctCount = calculateScore();
  const isSuccess = correctCount === falseStatements.length;

  return (
    <div className="space-y-6 p-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold neon-cyan flex items-center justify-center gap-2">
          <Brain className="w-6 h-6 text-purple-500" />
          Fact-Checking des Infos
        </h2>
        <p className="text-muted-foreground text-sm">
          Identifiez la vraie correction parmi les alternatives trompeuses
        </p>
        <div className="flex justify-center gap-2">
          <Badge variant="outline">
            {Object.keys(corrections).length}/{falseStatements.length}
          </Badge>
          {hintsUsed.size > 0 && (
            <Badge variant="secondary">
              <HelpCircle className="w-3 h-3 mr-1" />
              {hintsUsed.size} indices utilisés
            </Badge>
          )}
        </div>
      </div>

      <div className="space-y-6">
        {falseStatements.map((falseStatement, falseIdx) => {
          const selectedOptionIdx = corrections[falseIdx];
          const hasCorrection = selectedOptionIdx !== undefined;
          const options = allOptions[falseIdx];
          const isHintUsed = hintsUsed.has(falseIdx);
          
          // Safety check: if options are not generated yet, skip rendering
          if (!options || options.length === 0) {
            return null;
          }
          
          let selectedOption: FactOption | undefined;
          if (hasCorrection && options[selectedOptionIdx]) {
            selectedOption = options[selectedOptionIdx];
          }

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
                    <div className="text-sm font-medium">{falseStatement}</div>
                  </div>
                </div>
                
                {!submitted && !isHintUsed && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => useHint(falseIdx)}
                    className="text-xs"
                  >
                    <HelpCircle className="w-3 h-3 mr-1" />
                    Indice
                  </Button>
                )}
              </div>

              {/* Hint */}
              {isHintUsed && !submitted && (
                <div className="text-xs text-yellow-600 dark:text-yellow-400 p-2 bg-yellow-500/10 rounded border border-yellow-500/30">
                  💡 Attention: Les faits qui semblent les plus crédibles sont parfois trompeurs
                </div>
              )}

              {/* Arrow */}
              <div className="text-center text-xl">⬇️</div>

              {/* Correction Options */}
              <div className="space-y-2">
                <div className="text-sm font-medium">Choisissez la correction scientifique:</div>
                <div className="grid gap-2">
                  {options.map((option, optionIdx) => {
                    const isSelected = selectedOptionIdx === optionIdx;
                    const showResult = submitted && isSelected;

                    return (
                      <Button
                        key={optionIdx}
                        variant={isSelected ? "default" : "outline"}
                        className={`justify-start text-left h-auto py-3 ${
                          isSelected ? "border-2 border-primary" : ""
                        } ${
                          showResult && option.isCorrect
                            ? "bg-green-500/20 border-green-500" 
                            : showResult && !option.isCorrect
                            ? "bg-destructive/20 border-destructive" 
                            : ""
                        }`}
                        onClick={() => toggleCorrection(falseIdx, optionIdx)}
                        disabled={submitted}
                      >
                        <div className="flex items-start gap-2 flex-1">
                          <CheckCircle className={`w-4 h-4 flex-shrink-0 mt-0.5 ${
                            showResult && option.isCorrect
                              ? "text-green-500"
                              : isSelected 
                              ? "text-primary-foreground" 
                              : "text-muted-foreground"
                          }`} />
                          <span className="flex-1 text-sm">{option.text}</span>
                        </div>
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
                    Réponse sélectionnée
                  </span>
                </div>
              )}

              {/* Show if wrong after submission */}
              {submitted && selectedOption && !selectedOption.isCorrect && (
                <div className="text-xs text-destructive p-2 bg-destructive/10 rounded border border-destructive/30">
                  ❌ Cette option est trompeuse. Cherchez le fait scientifique pur, sans nuance.
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
                <div className="text-3xl">✅</div>
                <p className="font-bold text-green-500 text-lg">
                  Parfait ! Fact-checking réussi !
                </p>
                <p className="text-xs text-muted-foreground">
                  Leur crédibilité est détruite. Les vraies infos sont affichées.
                </p>
              </>
            ) : (
              <>
                <div className="text-3xl">🧐</div>
                <p className="font-bold text-destructive text-lg">
                  {correctCount}/{falseStatements.length} corrections exactes
                </p>
                <p className="text-xs text-muted-foreground">
                  Les options marquées en rouge sont incorrectes. Cherchez les faits sans compromis.
                </p>
              </>
            )}
          </div>
        </Card>
      )}

      <div className="text-xs text-center text-muted-foreground space-y-1 mb-4">
        <p>⚠️ Les alternatives plausibles ne sont pas toujours vraies</p>
        <p>🎯 Cherchez la réponse scientifique pure, sans "peut-être" ou "certains disent"</p>
      </div>

      <div className="flex gap-2">
        <Button
          onClick={handleSubmit}
          disabled={Object.keys(corrections).length !== falseStatements.length || submitted}
          className="flex-1"
          size="lg"
        >
          Valider les Corrections ({Object.keys(corrections).length}/{falseStatements.length})
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
