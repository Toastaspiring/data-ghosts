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
    <div className="bg-card rounded-3xl p-8 cartoon-shadow">
      <div className="flex items-center gap-3 mb-6">
        <Code className="w-8 h-8 text-primary" />
        <h3 className="text-2xl font-bold text-foreground">Décodage d'Algorithme</h3>
      </div>

      <div className="mb-6 bg-destructive/10 border-2 border-destructive rounded-xl p-4">
        <p className="text-sm text-muted-foreground mb-2">⚠️ Contexte Environnemental</p>
        <p className="text-foreground font-semibold">
          70% des récifs coralliens de Bali sont endommagés par le tourisme de masse
        </p>
      </div>

      <div className="bg-secondary/20 rounded-2xl p-6 mb-6">
        <p className="text-sm text-muted-foreground mb-3">Algorithme de viralité détecté:</p>
        {algorithm.map((line, idx) => (
          <div key={idx} className="font-mono text-sm text-foreground mb-2 bg-background/50 p-2 rounded">
            {line}
          </div>
        ))}
      </div>

      <div className="mb-6">
        <p className="text-center text-muted-foreground mb-3">
          Entrez la séquence correcte pour saboter l'algorithme
        </p>
        <div className="flex gap-2 justify-center mb-4">
          {Array.from({ length: correctSequence.length }).map((_, idx) => (
            <div
              key={idx}
              className="w-16 h-16 rounded-xl border-2 border-primary flex items-center justify-center text-2xl font-bold bg-card"
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
            className="h-16 text-2xl font-bold"
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
          className="flex-1 rounded-xl py-6"
        >
          Réinitialiser
        </Button>
        <Button
          onClick={handleSubmit}
          disabled={userSequence.length !== correctSequence.length}
          className="flex-1 rounded-xl py-6"
        >
          Valider
        </Button>
      </div>

      {attempts > 0 && (
        <div className="mt-4 text-center text-destructive">
          Tentatives échouées: {attempts}
        </div>
      )}
    </div>
  );
};