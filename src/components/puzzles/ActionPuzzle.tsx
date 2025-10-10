import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Flame, Droplets } from "lucide-react";

interface ActionPuzzleProps {
  actionType: string;
  onSolve: () => void;
}

export const ActionPuzzle = ({ actionType, onSolve }: ActionPuzzleProps) => {
  const [activated, setActivated] = useState(false);
  const [confirmText, setConfirmText] = useState("");
  const [showConsequences, setShowConsequences] = useState(false);
  const [holdProgress, setHoldProgress] = useState(0);
  const [isHolding, setIsHolding] = useState(false);

  const handleConfirm = () => {
    if (actionType === "fire_alarm" && confirmText.toUpperCase() !== "EVACUATE") return;
    if (actionType === "spill_water" && confirmText.toUpperCase() !== "DESTROY") return;
    setShowConsequences(true);
  };

  const handleHoldStart = () => {
    if (!showConsequences) return;
    setIsHolding(true);
    let progress = 0;
    const interval = setInterval(() => {
      progress += 2;
      setHoldProgress(progress);
      if (progress >= 100) {
        clearInterval(interval);
        setActivated(true);
        setTimeout(onSolve, 1500);
      }
    }, 60);
  };

  const handleHoldEnd = () => {
    setIsHolding(false);
    setHoldProgress(0);
  };

  if (actionType === "fire_alarm") {
    return (
      <div className="bg-card rounded-3xl p-8 cartoon-shadow text-center space-y-6">
        <Flame className="w-24 h-24 text-destructive mx-auto" />
        <h3 className="text-2xl font-bold text-foreground">
          Déclencher l'Alarme Incendie
        </h3>
        
        {!activated ? (
          <>
            {!showConsequences ? (
              <div className="space-y-4">
                <div className="bg-destructive/10 border border-destructive rounded-lg p-4 text-sm">
                  <p className="font-semibold mb-2">⚠️ AVERTISSEMENT ÉTHIQUE</p>
                  <p>Cette action affectera ~50 personnes dans le bâtiment</p>
                  <p className="mt-2 text-xs text-muted-foreground">Tapez "EVACUATE" pour confirmer</p>
                </div>
                <Input
                  value={confirmText}
                  onChange={(e) => setConfirmText(e.target.value)}
                  placeholder="Tapez EVACUATE..."
                  className="text-center font-mono uppercase"
                />
                <Button
                  onClick={handleConfirm}
                  disabled={confirmText.toUpperCase() !== "EVACUATE"}
                  variant="destructive"
                  className="w-full"
                >
                  Confirmer l'Action
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="bg-destructive/20 rounded-lg p-4">
                  <p className="text-sm mb-4">Maintenez le bouton pendant 3 secondes</p>
                  <div className="w-full bg-secondary/30 rounded-full h-3 mb-4">
                    <div 
                      className="h-3 bg-destructive rounded-full transition-all"
                      style={{ width: `${holdProgress}%` }}
                    />
                  </div>
                </div>
                <Button
                  onMouseDown={handleHoldStart}
                  onMouseUp={handleHoldEnd}
                  onMouseLeave={handleHoldEnd}
                  className="w-full h-24 text-2xl bg-destructive hover:bg-destructive/90 text-destructive-foreground rounded-2xl"
                >
                  🔥 TENIR POUR ACTIVER 🔥
                </Button>
              </div>
            )}
          </>
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
      <div className="bg-card rounded-3xl p-8 cartoon-shadow text-center space-y-6">
        <Droplets className="w-24 h-24 text-blue-500 mx-auto" />
        <h3 className="text-2xl font-bold text-foreground">
          Renverser de l'Eau
        </h3>
        
        {!activated ? (
          <>
            {!showConsequences ? (
              <div className="space-y-4">
                <div className="bg-blue-500/10 border border-blue-500 rounded-lg p-4 text-sm">
                  <p className="font-semibold mb-2">⚠️ DESTRUCTION MATÉRIELLE</p>
                  <p>Équipement de montage professionnel (~50,000€)</p>
                  <p className="mt-2 text-xs text-muted-foreground">Tapez "DESTROY" pour confirmer</p>
                </div>
                <Input
                  value={confirmText}
                  onChange={(e) => setConfirmText(e.target.value)}
                  placeholder="Tapez DESTROY..."
                  className="text-center font-mono uppercase"
                />
                <Button
                  onClick={handleConfirm}
                  disabled={confirmText.toUpperCase() !== "DESTROY"}
                  className="w-full bg-blue-500 hover:bg-blue-600"
                >
                  Confirmer la Destruction
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="bg-blue-500/20 rounded-lg p-4">
                  <p className="text-sm mb-4">Maintenez le bouton pendant 3 secondes</p>
                  <div className="w-full bg-secondary/30 rounded-full h-3 mb-4">
                    <div 
                      className="h-3 bg-blue-500 rounded-full transition-all"
                      style={{ width: `${holdProgress}%` }}
                    />
                  </div>
                </div>
                <Button
                  onMouseDown={handleHoldStart}
                  onMouseUp={handleHoldEnd}
                  onMouseLeave={handleHoldEnd}
                  className="w-full h-24 text-2xl rounded-2xl bg-blue-500 hover:bg-blue-600 text-white"
                >
                  💧 TENIR POUR RENVERSER 💧
                </Button>
              </div>
            )}
          </>
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
