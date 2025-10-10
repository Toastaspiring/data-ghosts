import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface CorruptionChoicePuzzleProps {
  methods: Array<{ name: string; cost: string; reliability: string; suspicion: string; effectiveness: string; illegal?: boolean }>;
  onSolve: () => void;
}

export const CorruptionChoicePuzzle = ({ methods, onSolve }: CorruptionChoicePuzzleProps) => {
  const [selected, setSelected] = useState<number | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [feedback, setFeedback] = useState("");
  
  const calculateScore = (method: typeof methods[0]) => {
    const costValue = parseInt(method.cost) || 50;
    const reliabilityValue = parseInt(method.reliability) || 50;
    const suspicionValue = parseInt(method.suspicion) || 50;
    const effectivenessValue = parseInt(method.effectiveness) || 50;
    
    return (effectivenessValue * 2 + reliabilityValue) - (costValue + suspicionValue);
  };
  
  const handleSubmit = () => {
    if (selected === null) return;
    
    const chosenMethod = methods[selected];
    const score = calculateScore(chosenMethod);
    
    if (score > 75) {
      setFeedback("Excellent choix stratégique !");
      setTimeout(onSolve, 1000);
    } else if (score > 50) {
      setFeedback("Méthode risquée - Trop de suspicion ou coût élevé");
    } else {
      setFeedback("Échec - Cette méthode est trop inefficace ou dangereuse");
    }
  };

  return (
    <div className="space-y-6 p-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold neon-cyan">Choix de Corruption</h2>
        <p className="text-muted-foreground">Analysez les facteurs pour choisir la méthode optimale</p>
        <Button 
          variant="ghost" 
          size="sm"
          onClick={() => setShowDetails(!showDetails)}
          className="text-xs"
        >
          {showDetails ? "Masquer" : "Afficher"} l'efficacité
        </Button>
      </div>

      <div className="grid gap-4">
        {methods.map((method, idx) => (
          <Card
            key={idx}
            className={`p-4 cursor-pointer ${selected === idx ? "border-primary border-2" : ""}`}
            onClick={() => setSelected(idx)}
          >
            <h3 className="font-bold">{method.name}</h3>
            {method.illegal && <Badge variant="destructive" className="mt-2">Illégal</Badge>}
            <div className="grid grid-cols-2 gap-2 mt-3 text-sm">
              <div>Coût: {method.cost}</div>
              <div>Fiabilité: {method.reliability}</div>
              <div>Suspicion: {method.suspicion}</div>
              {showDetails && <div>Efficacité: {method.effectiveness}</div>}
              {!showDetails && <div>Efficacité: ???</div>}
            </div>
          </Card>
        ))}
      </div>

      {feedback && (
        <div className={`text-center p-3 rounded-lg ${feedback.includes("Excellent") ? "bg-green-500/20 text-green-400" : "bg-destructive/20 text-destructive"}`}>
          {feedback}
        </div>
      )}

      <Button onClick={handleSubmit} disabled={selected === null} className="w-full" size="lg">
        Analyser et Exécuter
      </Button>
    </div>
  );
};
