import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Code, Check, X } from "lucide-react";

interface AlgorithmPuzzleProps {
  algorithm: string[];
  correctSequence: string[];
  onSolve: () => void;
}

export const AlgorithmPuzzle = ({ algorithm, correctSequence, onSolve }: AlgorithmPuzzleProps) => {
  const [userSequence, setUserSequence] = useState<string[]>([]);
  const [attempts, setAttempts] = useState(0);

  const handleNumberClick = (num: string) => {
    if (userSequence.length < correctSequence.length) {
      const newSequence = [...userSequence, num];
      setUserSequence(newSequence);
    }
  };

  const handleReset = () => {
    setUserSequence([]);
  };

  const handleSubmit = () => {
    if (JSON.stringify(userSequence) === JSON.stringify(correctSequence)) {
      setTimeout(onSolve, 500);
    } else {
      setAttempts(attempts + 1);
      setUserSequence([]);
    }
  };

  return (
    <div className="bg-card border-2 border-primary/30 rounded-lg p-8 cartoon-shadow animate-fade-in-up">
      <div className="flex items-center gap-3 mb-6">
        <Code className="w-8 h-8 text-primary animate-pulse-glow" />
        <h3 className="text-3xl font-bold neon-cyan font-mono">Décodage d'Algorithme</h3>
      </div>

      <div className="mb-6 bg-destructive/10 border-2 border-destructive rounded-lg p-4">
        <p className="text-sm text-muted-foreground mb-2 font-mono">⚠️ Contexte Environnemental</p>
        <p className="text-foreground font-semibold font-mono">
          70% des récifs coralliens de Bali sont endommagés par le tourisme de masse
        </p>
      </div>

      <div className="bg-muted/50 border-2 border-border rounded-lg p-6 mb-6">
        <p className="text-sm text-muted-foreground mb-3 font-mono">Algorithme de viralité détecté:</p>
        {algorithm.map((line, idx) => (
          <div key={idx} className="font-mono text-sm text-foreground mb-2 bg-background/50 p-2 rounded border border-border">
            {line}
          </div>
        ))}
      </div>

      <div className="mb-6">
        <p className="text-center text-muted-foreground mb-3 font-mono">
          Entrez la séquence correcte pour saboter l'algorithme
        </p>
        <div className="flex gap-2 justify-center mb-4">
          {Array.from({ length: correctSequence.length }).map((_, idx) => (
            <div
              key={idx}
              className="w-16 h-16 rounded-lg border-2 border-primary flex items-center justify-center text-2xl font-bold bg-card font-mono neon-cyan"
            >
              {userSequence[idx] || "?"}
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3 mb-6">
        {["1", "2", "3", "4", "5", "6", "7", "8", "9"].map((num) => (
          <Button
            key={num}
            onClick={() => handleNumberClick(num)}
            disabled={userSequence.length >= correctSequence.length}
            className="h-16 text-2xl font-bold font-mono border-2 border-border hover:border-primary transition-all"
            variant="outline"
          >
            {num}
          </Button>
        ))}
      </div>

      <div className="flex gap-3">
        <Button
          onClick={handleReset}
          variant="outline"
          className="flex-1 py-6 font-mono border-2 border-border hover:border-destructive"
        >
          RÉINITIALISER
        </Button>
        <Button
          onClick={handleSubmit}
          disabled={userSequence.length !== correctSequence.length}
          className="flex-1 py-6 font-mono bg-primary hover:bg-primary/90 animate-pulse-glow"
        >
          VALIDER
        </Button>
      </div>

      {attempts > 0 && (
        <div className="mt-4 text-center text-destructive font-mono">
          Tentatives échouées: {attempts}
        </div>
      )}
    </div>
  );
};