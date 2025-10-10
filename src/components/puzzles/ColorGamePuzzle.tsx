import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Palette } from "lucide-react";

interface ColorGamePuzzleProps {
  targetColor: string;
  onSolve: () => void;
}

export const ColorGamePuzzle = ({ targetColor, onSolve }: ColorGamePuzzleProps) => {
  const [r, setR] = useState(0);
  const [g, setG] = useState(255);
  const [b, setB] = useState(0);
  const [showTarget, setShowTarget] = useState(true);
  const [attempts, setAttempts] = useState(0);
  
  const currentColor = `rgb(${r}, ${g}, ${b})`;
  
  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : { r: 0, g: 0, b: 0 };
  };
  
  const targetRgb = hexToRgb(targetColor);
  
  useState(() => {
    setTimeout(() => setShowTarget(false), 3000);
  });

  const checkMatch = () => {
    setAttempts(attempts + 1);
    const tolerance = 10;
    const match = Math.abs(r - targetRgb.r) <= tolerance &&
                  Math.abs(g - targetRgb.g) <= tolerance &&
                  Math.abs(b - targetRgb.b) <= tolerance;
    
    if (match) {
      setTimeout(onSolve, 500);
    }
  };

  return (
    <div className="bg-card border-2 border-primary/30 rounded-lg p-8 cartoon-shadow animate-fade-in-up">
      <div className="flex items-center gap-3 mb-6">
        <Palette className="w-8 h-8 text-primary animate-pulse-glow" />
        <h3 className="text-3xl font-bold neon-cyan font-mono">Jeu de Couleurs du Fond Vert</h3>
      </div>

      <div className="mb-6 grid grid-cols-2 gap-4">
        <div className="relative">
          <div
            className="w-full h-32 rounded-lg cartoon-shadow border-2 border-border"
            style={{ backgroundColor: showTarget ? targetColor : "#1a1a1a" }}
          />
          <p className="text-center mt-2 text-xs text-muted-foreground font-mono">
            {showTarget ? "Couleur Cible (mémorisez!)" : "Couleur cachée"}
          </p>
        </div>
        <div className="relative">
          <div
            className="w-full h-32 rounded-lg cartoon-shadow transition-colors duration-150 border-2 border-primary"
            style={{ backgroundColor: currentColor }}
          />
          <p className="text-center mt-2 text-xs text-muted-foreground font-mono">
            Votre Réglage
          </p>
        </div>
      </div>

      <div className="space-y-4 mb-6">
        <div>
          <div className="flex justify-between mb-1">
            <label className="text-sm font-mono">Rouge (R)</label>
            <span className="text-sm font-mono font-bold">{r}</span>
          </div>
          <input
            type="range"
            min="0"
            max="255"
            value={r}
            onChange={(e) => setR(Number(e.target.value))}
            className="w-full h-2 rounded-lg appearance-none cursor-pointer"
            style={{ 
              background: `linear-gradient(to right, #000 0%, rgb(${r}, 0, 0) 100%)`
            }}
          />
        </div>

        <div>
          <div className="flex justify-between mb-1">
            <label className="text-sm font-mono">Vert (G)</label>
            <span className="text-sm font-mono font-bold">{g}</span>
          </div>
          <input
            type="range"
            min="0"
            max="255"
            value={g}
            onChange={(e) => setG(Number(e.target.value))}
            className="w-full h-2 rounded-lg appearance-none cursor-pointer"
            style={{ 
              background: `linear-gradient(to right, #000 0%, rgb(0, ${g}, 0) 100%)`
            }}
          />
        </div>

        <div>
          <div className="flex justify-between mb-1">
            <label className="text-sm font-mono">Bleu (B)</label>
            <span className="text-sm font-mono font-bold">{b}</span>
          </div>
          <input
            type="range"
            min="0"
            max="255"
            value={b}
            onChange={(e) => setB(Number(e.target.value))}
            className="w-full h-2 rounded-lg appearance-none cursor-pointer"
            style={{ 
              background: `linear-gradient(to right, #000 0%, rgb(0, 0, ${b}) 100%)`
            }}
          />
        </div>
      </div>

      {attempts > 2 && (
        <p className="text-center mb-4 text-xs text-muted-foreground">
          Astuce: Tolérance de ±10 sur chaque canal RGB
        </p>
      )}

      <Button
        onClick={checkMatch}
        className="w-full h-12 text-lg font-mono"
      >
        Vérifier la Correspondance
      </Button>

      <p className="text-center mt-3 text-xs text-muted-foreground">
        Tentatives: {attempts}
      </p>
    </div>
  );
};
