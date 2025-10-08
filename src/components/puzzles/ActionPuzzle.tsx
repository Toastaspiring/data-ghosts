import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Flame, Droplets } from "lucide-react";

interface ActionPuzzleProps {
  actionType: string;
  onSolve: () => void;
}

export const ActionPuzzle = ({ actionType, onSolve }: ActionPuzzleProps) => {
  const [activated, setActivated] = useState(false);

  const handleAction = () => {
    setActivated(true);
    setTimeout(onSolve, 1500);
  };

  if (actionType === "fire_alarm") {
    return (
      <div className="bg-card rounded-3xl p-8 cartoon-shadow text-center">
        <Flame className="w-24 h-24 text-destructive mx-auto mb-6" />
        <h3 className="text-2xl font-bold text-foreground mb-6">
          Déclencher l'Alarme Incendie
        </h3>
        
        {!activated ? (
          <Button
            onClick={handleAction}
            className="w-full h-24 text-2xl bg-destructive hover:bg-destructive/90 text-destructive-foreground rounded-2xl"
          >
            🔥 ALARME 🔥
          </Button>
        ) : (
          <div className="animate-pulse-soft">
            <p className="text-3xl font-bold text-destructive mb-4">🚨 ALARME ACTIVÉE 🚨</p>
            <p className="text-lg text-muted-foreground">Tout le monde évacue la salle !</p>
          </div>
        )}
      </div>
    );
  }

  if (actionType === "spill_water") {
    return (
      <div className="bg-card rounded-3xl p-8 cartoon-shadow text-center">
        <Droplets className="w-24 h-24 text-blue-500 mx-auto mb-6" />
        <h3 className="text-2xl font-bold text-foreground mb-6">
          Renverser de l'Eau
        </h3>
        
        {!activated ? (
          <Button
            onClick={handleAction}
            className="w-full h-24 text-2xl rounded-2xl bg-blue-500 hover:bg-blue-600 text-white"
          >
            💧 Renverser le Verre 💧
          </Button>
        ) : (
          <div className="animate-pulse-soft">
            <p className="text-3xl font-bold text-blue-500 mb-4">💦 MATÉRIEL DÉTRUIT 💦</p>
            <p className="text-lg text-muted-foreground">L'ordinateur est hors service !</p>
          </div>
        )}
      </div>
    );
  }

  return null;
};
