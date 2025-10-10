import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, CheckCircle2, Hammer } from "lucide-react";

interface AlarmActivationPuzzleProps {
  sequence: string[];
  onSolve: () => void;
}

export const AlarmActivationPuzzle = ({ sequence, onSolve }: AlarmActivationPuzzleProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [glassBroken, setGlassBroken] = useState(false);
  const [leverPulled, setLeverPulled] = useState(false);
  const [confirmed, setConfirmed] = useState(false);

  const steps = [
    {
      id: "BREAK_GLASS",
      title: "Casser la Vitre",
      icon: Hammer,
      description: "Brisez la vitre de protection pour accéder au levier",
      action: () => setGlassBroken(true),
      completed: glassBroken,
    },
    {
      id: "PULL_LEVER",
      title: "Tirer le Levier",
      icon: AlertTriangle,
      description: "Tirez le levier d'alarme vers le bas",
      action: () => setLeverPulled(true),
      completed: leverPulled,
      disabled: !glassBroken,
    },
    {
      id: "CONFIRM_EVACUATION",
      title: "Confirmer l'Évacuation",
      icon: CheckCircle2,
      description: "Confirmez l'évacuation de la salle 2",
      action: () => {
        setConfirmed(true);
        setTimeout(onSolve, 1000);
      },
      completed: confirmed,
      disabled: !leverPulled,
    },
  ];

  return (
    <div className="space-y-6 p-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold neon-cyan flex items-center justify-center gap-2">
          <AlertTriangle className="w-6 h-6 text-red-500" />
          Alarme Incendie
        </h2>
        <p className="text-muted-foreground">
          Suivez la procédure d'urgence pour évacuer la salle 2
        </p>
        <Badge variant="destructive" className="animate-pulse">
          ⚠️ PROCÉDURE D'URGENCE
        </Badge>
      </div>

      <Card className="p-6 bg-red-950/20 border-red-500/50">
        <div className="space-y-4">
          {steps.map((step, idx) => {
            const StepIcon = step.icon;
            const isActive = currentStep === idx;
            const isCompleted = step.completed;

            return (
              <div
                key={step.id}
                className={`relative flex items-start gap-4 p-4 rounded-lg transition-all ${
                  isCompleted
                    ? "bg-green-500/20 border-2 border-green-500"
                    : isActive
                    ? "bg-primary/20 border-2 border-primary"
                    : "bg-muted/50 border-2 border-border"
                } ${step.disabled ? "opacity-50" : ""}`}
              >
                <div
                  className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center ${
                    isCompleted
                      ? "bg-green-500 text-white"
                      : isActive
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {isCompleted ? (
                    <CheckCircle2 className="w-6 h-6" />
                  ) : (
                    <StepIcon className="w-6 h-6" />
                  )}
                </div>

                <div className="flex-1 space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold">
                      {idx + 1}. {step.title}
                    </h3>
                    {isCompleted && (
                      <Badge variant="default">Complété</Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">{step.description}</p>

                  {!isCompleted && !step.disabled && (
                    <Button
                      onClick={() => {
                        step.action();
                        if (idx < steps.length - 1) {
                          setCurrentStep(idx + 1);
                        }
                      }}
                      variant={isActive ? "default" : "outline"}
                      size="sm"
                      className="mt-2"
                    >
                      {step.id === "BREAK_GLASS" && "🔨 Briser"}
                      {step.id === "PULL_LEVER" && "🔽 Tirer"}
                      {step.id === "CONFIRM_EVACUATION" && "✓ Confirmer"}
                    </Button>
                  )}

                  {step.disabled && (
                    <p className="text-xs text-yellow-600 dark:text-yellow-400">
                      Complétez l'étape précédente d'abord
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {glassBroken && (
        <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-4 text-center animate-pulse">
          <p className="text-red-600 dark:text-red-400 font-bold">
            🚨 ALERTE: Vitre brisée - Alarme en cours d'activation
          </p>
        </div>
      )}

      {confirmed && (
        <div className="bg-green-500/10 border border-green-500/50 rounded-lg p-4 text-center">
          <p className="text-green-600 dark:text-green-400 font-bold">
            ✅ Évacuation confirmée - La salle 2 est maintenant accessible
          </p>
        </div>
      )}
    </div>
  );
};
