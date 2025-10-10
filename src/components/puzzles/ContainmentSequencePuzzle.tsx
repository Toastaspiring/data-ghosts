import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Shield, CheckCircle, Lock } from "lucide-react";

interface ContainmentSequencePuzzleProps {
  sequence: string[];
  onSolve: () => void;
}

export const ContainmentSequencePuzzle = ({ sequence, onSolve }: ContainmentSequencePuzzleProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [completed, setCompleted] = useState<string[]>([]);

  const steps = [
    { id: "INIT", label: "Initialiser le champ de confinement", icon: "🔌" },
    { id: "QUANTUM", label: "Ajuster les stabilisateurs quantiques", icon: "⚛️" },
    { id: "TEMPORAL", label: "Engager les verrous temporels", icon: "⏰" },
    { id: "RELEASE", label: "Libérer le spécimen en sécurité", icon: "🔓" },
  ];

  const handleStepClick = (stepId: string, idx: number) => {
    if (idx === currentStep && stepId === sequence[idx]) {
      setCompleted([...completed, stepId]);
      if (idx === sequence.length - 1) {
        setTimeout(() => onSolve(), 500);
      } else {
        setCurrentStep(idx + 1);
      }
    }
  };

  return (
    <div className="space-y-6 p-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold neon-cyan flex items-center justify-center gap-2">
          <Shield className="w-6 h-6" />
          Séquence de Confinement Bio
        </h2>
        <p className="text-muted-foreground">
          Suivez le protocole de confinement dans le bon ordre
        </p>
        <Badge variant="outline">
          Étapes: {completed.length}/{steps.length}
        </Badge>
      </div>

      <div className="space-y-4">
        {steps.map((step, idx) => {
          const isCompleted = completed.includes(step.id);
          const isCurrent = currentStep === idx;
          const isLocked = idx > currentStep;

          return (
            <Card
              key={step.id}
              className={`p-6 transition-all ${
                isCompleted
                  ? "bg-green-500/20 border-green-500"
                  : isCurrent
                  ? "bg-primary/20 border-primary border-2 animate-pulse"
                  : "bg-muted/50 border-border opacity-50"
              }`}
            >
              <div className="flex items-center gap-4">
                <div className="text-4xl">{step.icon}</div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold">Étape {idx + 1}</span>
                    {isCompleted && (
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    )}
                    {isLocked && (
                      <Lock className="w-5 h-5 text-muted-foreground" />
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    {step.label}
                  </p>
                </div>
                <Button
                  onClick={() => handleStepClick(step.id, idx)}
                  disabled={!isCurrent || isCompleted}
                  variant={isCurrent ? "default" : "outline"}
                >
                  {isCompleted ? "✓ Fait" : isCurrent ? "Exécuter" : "Attente"}
                </Button>
              </div>
            </Card>
          );
        })}
      </div>

      {completed.length > 0 && (
        <div className="bg-green-500/10 border border-green-500/50 rounded-lg p-4 text-center">
          <p className="text-green-600 dark:text-green-400 font-bold">
            ✅ {completed.length} étape(s) complétée(s)
          </p>
        </div>
      )}

      {completed.length === sequence.length && (
        <div className="bg-cyan-500/10 border border-cyan-500/50 rounded-lg p-4 text-center animate-pulse">
          <p className="text-cyan-600 dark:text-cyan-400 font-bold text-lg">
            🎉 Séquence de confinement complétée avec succès !
          </p>
        </div>
      )}
    </div>
  );
};
