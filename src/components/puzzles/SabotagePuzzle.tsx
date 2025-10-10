import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Check } from "lucide-react";

interface SabotageOption {
  method: string;
  stealth: string;
  damage: string;
  recovery_time: string;
}

interface SabotagePuzzleProps {
  options: SabotageOption[];
  onSolve: () => void;
}

export const SabotagePuzzle = ({ options, onSolve }: SabotagePuzzleProps) => {
  const [selectedMethods, setSelectedMethods] = useState<number[]>([]);
  const [showHint, setShowHint] = useState(false);

  const toggleMethod = (idx: number) => {
    if (selectedMethods.includes(idx)) {
      setSelectedMethods(selectedMethods.filter(i => i !== idx));
    } else {
      setSelectedMethods([...selectedMethods, idx]);
    }
  };

  const handleSubmit = () => {
    // Optimal: cable disconnection (0) + file deletion (2)
    if (selectedMethods.includes(0) && selectedMethods.includes(2)) {
      onSolve();
    } else {
      setShowHint(true);
    }
  };

  const getStealthColor = (stealth: string) => {
    if (stealth === "high") return "default";
    if (stealth === "medium") return "secondary";
    return "destructive";
  };

  return (
    <div className="space-y-6 p-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold neon-cyan flex items-center justify-center gap-2">
          <AlertTriangle className="w-6 h-6 text-orange-500" />
          Sabotage du Matériel
        </h2>
        <p className="text-muted-foreground">
          Choisissez les méthodes de sabotage les plus efficaces et discrètes
        </p>
        <Badge variant="outline">
          Méthodes Sélectionnées: {selectedMethods.length}
        </Badge>
      </div>

      <div className="grid gap-4">
        {options.map((option, idx) => {
          const isSelected = selectedMethods.includes(idx);

          return (
            <Card
              key={idx}
              className={`p-4 cursor-pointer transition-all ${
                isSelected ? "border-primary border-2 bg-primary/10" : "border-border"
              }`}
              onClick={() => toggleMethod(idx)}
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                      isSelected ? "border-primary bg-primary" : "border-border"
                    }`}>
                      {isSelected && <Check className="w-4 h-4 text-white" />}
                    </div>
                    <div>
                      <h3 className="font-bold">{option.method}</h3>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 text-xs">
                  <div>
                    <div className="text-muted-foreground">Discrétion</div>
                    <Badge variant={getStealthColor(option.stealth)} className="mt-1">
                      {option.stealth}
                    </Badge>
                  </div>
                  <div>
                    <div className="text-muted-foreground">Dégâts</div>
                    <Badge variant="outline" className="mt-1">
                      {option.damage}
                    </Badge>
                  </div>
                  <div>
                    <div className="text-muted-foreground">Récupération</div>
                    <Badge variant="secondary" className="mt-1">
                      {option.recovery_time}
                    </Badge>
                  </div>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {showHint && (
        <div className="bg-yellow-500/10 border border-yellow-500/50 rounded-lg p-4 text-center">
          <p className="text-yellow-600 dark:text-yellow-400">
            💡 Combinez la discrétion ET l'impact maximum. Débrancher + Supprimer = Optimal !
          </p>
        </div>
      )}

      <Button
        onClick={handleSubmit}
        disabled={selectedMethods.length === 0}
        className="w-full"
        size="lg"
      >
        Exécuter le Sabotage ({selectedMethods.length} méthodes)
      </Button>
    </div>
  );
};
