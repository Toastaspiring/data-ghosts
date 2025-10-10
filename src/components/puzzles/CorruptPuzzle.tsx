import { useState } from "react";
import { Button } from "@/components/ui/button";
import { DollarSign, UserX, FileX, Check } from "lucide-react";

interface CorruptMethod {
  id: string;
  label: string;
  icon: any;
  power: number;
  stealth: number;
}

interface CorruptPuzzleProps {
  options: string[];
  correctAnswer: string;
  onSolve: () => void;
}

export const CorruptPuzzle = ({ options, correctAnswer, onSolve }: CorruptPuzzleProps) => {
  const [selectedMethods, setSelectedMethods] = useState<string[]>([]);
  const [corruptionPower, setCorruptionPower] = useState(0);
  const [showFeedback, setShowFeedback] = useState(false);
  
  const methods: CorruptMethod[] = [
    { id: "argent", label: "Soudoyer avec de l'argent", icon: DollarSign, power: 30, stealth: 60 },
    { id: "otage", label: "Retenir sa famille en otage", icon: UserX, power: 95, stealth: 10 },
    { id: "licence", label: "Supprimer les licences logicielles", icon: FileX, power: 50, stealth: 80 },
    { id: "blackmail", label: "Chantage avec photos compromettantes", icon: UserX, power: 70, stealth: 50 },
    { id: "threat", label: "Menaces anonymes", icon: UserX, power: 60, stealth: 40 },
    { id: "fake_evidence", label: "Fausses preuves de malversation", icon: FileX, power: 80, stealth: 70 },
  ];

  const toggleMethod = (methodId: string) => {
    if (selectedMethods.includes(methodId)) {
      const newSelected = selectedMethods.filter(id => id !== methodId);
      setSelectedMethods(newSelected);
      calculatePower(newSelected);
    } else {
      const newSelected = [...selectedMethods, methodId];
      setSelectedMethods(newSelected);
      calculatePower(newSelected);
    }
    setShowFeedback(false);
  };
  
  const calculatePower = (selected: string[]) => {
    const totalPower = selected.reduce((sum, id) => {
      const method = methods.find(m => m.id === id);
      return sum + (method?.power || 0);
    }, 0);
    setCorruptionPower(totalPower);
  };
  
  const handleSubmit = () => {
    setShowFeedback(true);
    if (corruptionPower >= 100 && selectedMethods.some(id => methods.find(m => m.id === id)?.stealth! > 60)) {
      setTimeout(onSolve, 1500);
    }
  };

  return (
    <div className="bg-card rounded-3xl p-8 cartoon-shadow">
      <h3 className="text-2xl font-bold text-foreground mb-4 text-center">
        Stratégie de Corruption
      </h3>
      <p className="text-center text-muted-foreground mb-6 text-sm">
        Combinez des méthodes pour atteindre 100% de puissance avec discrétion
      </p>

      <div className="mb-6 bg-secondary/20 rounded-lg p-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium">Puissance de Corruption</span>
          <span className="text-lg font-bold">{corruptionPower}%</span>
        </div>
        <div className="w-full bg-secondary/30 rounded-full h-3">
          <div 
            className={`h-3 rounded-full transition-all ${corruptionPower >= 100 ? 'bg-green-500' : 'bg-primary'}`}
            style={{ width: `${Math.min(corruptionPower, 100)}%` }}
          />
        </div>
      </div>

      <div className="grid gap-3 mb-6">
        {methods.map((method) => {
          const Icon = method.icon;
          const isSelected = selectedMethods.includes(method.id);
          return (
            <Button
              key={method.id}
              onClick={() => toggleMethod(method.id)}
              variant={isSelected ? "default" : "outline"}
              className="h-auto py-4 flex items-center gap-3 text-left justify-start"
            >
              <Icon className="w-6 h-6 shrink-0" />
              <span className="flex-1">{method.label}</span>
              {isSelected && <Check className="w-5 h-5" />}
            </Button>
          );
        })}
      </div>

      {showFeedback && corruptionPower < 100 && (
        <p className="mb-4 text-center text-destructive text-sm font-semibold">
          Puissance insuffisante - Combinez plusieurs méthodes !
        </p>
      )}

      {showFeedback && corruptionPower >= 100 && !selectedMethods.some(id => methods.find(m => m.id === id)?.stealth! > 60) && (
        <p className="mb-4 text-center text-destructive text-sm font-semibold">
          Trop visible ! Ajoutez une méthode plus discrète.
        </p>
      )}

      <Button 
        onClick={handleSubmit}
        disabled={selectedMethods.length === 0}
        className="w-full"
        size="lg"
      >
        Exécuter le Plan
      </Button>
    </div>
  );
};
