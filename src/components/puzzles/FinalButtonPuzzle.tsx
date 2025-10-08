import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Bomb } from "lucide-react";

interface FinalButtonPuzzleProps {
  clicksRequired: number;
  countdownDuration: number;
  onSolve: () => void;
}

export const FinalButtonPuzzle = ({ clicksRequired, countdownDuration, onSolve }: FinalButtonPuzzleProps) => {
  const [clicks, setClicks] = useState(0);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [exploded, setExploded] = useState(false);

  useEffect(() => {
    if (clicks >= clicksRequired && countdown === null) {
      setCountdown(countdownDuration);
    }
  }, [clicks, clicksRequired, countdown, countdownDuration]);

  useEffect(() => {
    if (countdown !== null && countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else if (countdown === 0) {
      setExploded(true);
      setTimeout(onSolve, 2000);
    }
  }, [countdown, onSolve]);

  const handleClick = () => {
    if (countdown === null) {
      setClicks((prev) => prev + 1);
    }
  };

  if (exploded) {
    return (
      <div className="bg-card rounded-3xl p-8 cartoon-shadow text-center">
        <div className="text-8xl mb-6 animate-bounce">💥</div>
        <h2 className="text-4xl font-bold text-destructive mb-4">BOOM !</h2>
        <p className="text-xl text-muted-foreground">Vous vous êtes échappés !</p>
      </div>
    );
  }

  if (countdown !== null) {
    return (
      <div className="bg-card rounded-3xl p-8 cartoon-shadow text-center">
        <Bomb className="w-24 h-24 text-destructive mx-auto mb-6 animate-pulse" />
        <div className="text-8xl font-bold text-destructive mb-4 animate-pulse-soft">
          {countdown}
        </div>
        <p className="text-2xl text-muted-foreground">Compte à rebours activé...</p>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-3xl p-8 cartoon-shadow text-center">
      <Bomb className="w-24 h-24 text-primary mx-auto mb-6" />
      <h3 className="text-3xl font-bold text-foreground mb-6">
        Le Bouton Rouge Final
      </h3>
      
      <div className="mb-8">
        <div className="text-6xl font-bold text-primary mb-2">
          {clicks}/{clicksRequired}
        </div>
        <p className="text-muted-foreground">clics</p>
      </div>

      <Button
        onClick={handleClick}
        className="w-full h-32 text-3xl bg-destructive hover:bg-destructive/90 text-destructive-foreground rounded-2xl animate-pulse-soft"
      >
        CLIQUEZ ICI !
      </Button>

      <p className="mt-6 text-muted-foreground">
        Spammez le bouton aussi vite que possible !
      </p>
    </div>
  );
};
