import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Microscope } from "lucide-react";

interface PatternAnalysisPuzzleProps {
  targetPattern: number[];
  onSolve: () => void;
}

export const PatternAnalysisPuzzle = ({ targetPattern, onSolve }: PatternAnalysisPuzzleProps) => {
  const [selectedPattern, setSelectedPattern] = useState<number[]>([]);

  const addToPattern = (num: number) => {
    if (selectedPattern.length < targetPattern.length) {
      setSelectedPattern([...selectedPattern, num]);
    }
  };

  const clearLast = () => {
    setSelectedPattern(selectedPattern.slice(0, -1));
  };

  const handleSubmit = () => {
    if (JSON.stringify(selectedPattern) === JSON.stringify(targetPattern)) {
      onSolve();
    }
  };

  return (
    <div className="space-y-6 p-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold neon-cyan flex items-center justify-center gap-2">
          <Microscope className="w-6 h-6" />
          Analyse de Motif Cellulaire
        </h2>
        <p className="text-muted-foreground">
          Reproduisez le motif de division cellulaire
        </p>
      </div>

      <Card className="p-6 bg-gradient-to-br from-blue-900/30 to-cyan-900/30">
        <h3 className="font-bold mb-4 text-center">Motif Observé</h3>
        <div className="flex justify-center gap-2 flex-wrap">
          {targetPattern.map((num, idx) => (
            <div
              key={idx}
              className="w-12 h-12 rounded-full bg-cyan-500/30 border-2 border-cyan-500 flex items-center justify-center font-bold text-xl"
            >
              {num}
            </div>
          ))}
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="font-bold mb-4 text-center">Votre Séquence</h3>
        <div className="flex justify-center gap-2 flex-wrap min-h-[3rem]">
          {selectedPattern.map((num, idx) => (
            <div
              key={idx}
              className="w-12 h-12 rounded-full bg-primary/30 border-2 border-primary flex items-center justify-center font-bold text-xl animate-scale-in"
            >
              {num}
            </div>
          ))}
          {selectedPattern.length === 0 && (
            <p className="text-muted-foreground text-sm self-center">
              Commencez à sélectionner les chiffres
            </p>
          )}
        </div>
        <Badge className="mx-auto block w-fit mt-3">
          {selectedPattern.length} / {targetPattern.length}
        </Badge>
      </Card>

      <div className="grid grid-cols-4 gap-3">
        {[1, 2, 3, 4].map((num) => (
          <Button
            key={num}
            onClick={() => addToPattern(num)}
            disabled={selectedPattern.length >= targetPattern.length}
            size="lg"
            className="h-16 text-2xl"
          >
            {num}
          </Button>
        ))}
      </div>

      <div className="flex gap-2">
        <Button
          onClick={clearLast}
          variant="outline"
          disabled={selectedPattern.length === 0}
          className="flex-1"
        >
          ← Effacer Dernier
        </Button>
        <Button
          onClick={() => setSelectedPattern([])}
          variant="outline"
          disabled={selectedPattern.length === 0}
          className="flex-1"
        >
          🗑️ Tout Effacer
        </Button>
      </div>

      <Button
        onClick={handleSubmit}
        disabled={selectedPattern.length !== targetPattern.length}
        className="w-full"
        size="lg"
      >
        Valider le Motif
      </Button>
    </div>
  );
};
