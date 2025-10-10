import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollText, AlertCircle, CheckCircle } from "lucide-react";

interface ContractPuzzleProps {
  clauses: string[];
  violations: string[];
  onSolve: () => void;
}

export const ContractPuzzle = ({ clauses, violations, onSolve }: ContractPuzzleProps) => {
  const [selectedViolations, setSelectedViolations] = useState<number[]>([]);
  const [showHint, setShowHint] = useState(false);

  const toggleViolation = (idx: number) => {
    if (selectedViolations.includes(idx)) {
      setSelectedViolations(selectedViolations.filter(i => i !== idx));
    } else {
      setSelectedViolations([...selectedViolations, idx]);
    }
  };

  const handleSubmit = () => {
    if (selectedViolations.length === violations.length && 
        selectedViolations.every((_, i) => selectedViolations.includes(i))) {
      onSolve();
    } else {
      setShowHint(true);
    }
  };

  return (
    <div className="space-y-6 p-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold neon-cyan flex items-center justify-center gap-2">
          <ScrollText className="w-6 h-6" />
          Analyse de Contrat
        </h2>
        <p className="text-muted-foreground">
          Identifiez toutes les violations de licence pour suspendre leur accès
        </p>
        <Badge variant="outline">
          Violations Trouvées: {selectedViolations.length}/{violations.length}
        </Badge>
      </div>

      <Card className="p-6 bg-amber-500/5 border-amber-500/30">
        <h3 className="font-bold mb-4">📜 Clauses du Contrat</h3>
        <div className="space-y-2 text-sm">
          {clauses.map((clause, idx) => (
            <div key={idx} className="p-2 bg-card rounded border border-border">
              {idx + 1}. {clause}
            </div>
          ))}
        </div>
      </Card>

      <div className="space-y-3">
        <h3 className="font-bold flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-red-500" />
          Violations Détectées
        </h3>
        {violations.map((violation, idx) => {
          const isSelected = selectedViolations.includes(idx);

          return (
            <Card
              key={idx}
              className={`p-4 cursor-pointer transition-all ${
                isSelected ? "border-destructive border-2 bg-destructive/10" : "border-border"
              }`}
              onClick={() => toggleViolation(idx)}
            >
              <div className="flex items-start gap-3">
                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                  isSelected ? "border-destructive bg-destructive" : "border-border"
                }`}>
                  {isSelected && <CheckCircle className="w-4 h-4 text-white" />}
                </div>
                <div className="flex-1">
                  <p className="text-sm">{violation}</p>
                </div>
                {isSelected && (
                  <Badge variant="destructive">Sélectionné</Badge>
                )}
              </div>
            </Card>
          );
        })}
      </div>

      {showHint && selectedViolations.length < violations.length && (
        <div className="bg-yellow-500/10 border border-yellow-500/50 rounded-lg p-4 text-center">
          <p className="text-yellow-600 dark:text-yellow-400">
            💡 Vous devez identifier TOUTES les violations. Relisez attentivement le contrat !
          </p>
        </div>
      )}

      <Button
        onClick={handleSubmit}
        disabled={selectedViolations.length === 0}
        className="w-full"
        size="lg"
      >
        Suspendre la Licence ({selectedViolations.length} violations)
      </Button>
    </div>
  );
};
