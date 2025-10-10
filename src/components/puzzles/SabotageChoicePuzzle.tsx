import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Shield, Zap } from "lucide-react";

interface Method {
  name: string;
  risk: string;
  effectiveness: string;
  stealth: string;
  consequence: string;
}

interface SabotageChoicePuzzleProps {
  methods: Method[];
  onSolve: () => void;
}

export const SabotageChoicePuzzle = ({ methods, onSolve }: SabotageChoicePuzzleProps) => {
  const [selectedMethod, setSelectedMethod] = useState<number | null>(null);
  const [showDetails, setShowDetails] = useState<Set<number>>(new Set());

  const getRiskColor = (risk: string) => {
    if (risk === "high") return "destructive";
    if (risk === "medium") return "default";
    return "secondary";
  };

  const toggleDetails = (idx: number) => {
    const newDetails = new Set(showDetails);
    if (newDetails.has(idx)) {
      newDetails.delete(idx);
    } else {
      newDetails.add(idx);
    }
    setShowDetails(newDetails);
  };

  const handleSubmit = () => {
    if (selectedMethod === 1) { // "Être discret - couper l'alimentation"
      onSolve();
    }
  };

  return (
    <div className="space-y-6 p-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold neon-cyan">Choix de Sabotage</h2>
        <p className="text-muted-foreground">
          Choisissez la méthode optimale : efficace mais discrète
        </p>
      </div>

      <div className="grid gap-4">
        {methods.map((method, idx) => {
          const isSelected = selectedMethod === idx;
          const showDetail = showDetails.has(idx);

          return (
            <Card
              key={idx}
              className={`p-4 cursor-pointer transition-all ${
                isSelected ? "border-primary border-2 bg-primary/10" : "border-border"
              }`}
              onClick={() => setSelectedMethod(idx)}
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <h3 className="font-bold text-lg">{method.name}</h3>
                    <div className="flex gap-2 mt-2">
                      <Badge variant={getRiskColor(method.risk)}>
                        Risque: {method.risk}
                      </Badge>
                      <Badge variant="outline">
                        Efficacité: {method.effectiveness}
                      </Badge>
                      <Badge variant="outline">
                        Discrétion: {method.stealth}
                      </Badge>
                    </div>
                  </div>
                  {isSelected && <Shield className="w-6 h-6 text-primary" />}
                </div>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleDetails(idx);
                  }}
                  className="w-full"
                >
                  {showDetail ? "Masquer" : "Voir"} les détails
                </Button>

                {showDetail && (
                  <div className="p-3 bg-muted rounded-lg space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4" />
                      <span className="font-medium">Conséquence:</span>
                    </div>
                    <p className="text-muted-foreground">{method.consequence}</p>
                  </div>
                )}
              </div>
            </Card>
          );
        })}
      </div>

      <div className="bg-blue-500/10 border border-blue-500/50 rounded-lg p-4">
        <p className="text-sm text-blue-600 dark:text-blue-400">
          💡 Objectif: Trouvez l'équilibre entre efficacité et discrétion pour continuer la mission sans attirer l'attention.
        </p>
      </div>

      <Button
        onClick={handleSubmit}
        disabled={selectedMethod === null}
        className="w-full"
        size="lg"
      >
        <Zap className="w-4 h-4 mr-2" />
        Exécuter le Sabotage
      </Button>
    </div>
  );
};
