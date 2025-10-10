import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Eye, Check, X } from "lucide-react";

interface ClickPoint {
  x: number;
  y: number;
}

interface SceneAnalysisPuzzleProps {
  targetDifferences: number;
  onSolve: () => void;
}

export const SceneAnalysisPuzzle = ({ targetDifferences, onSolve }: SceneAnalysisPuzzleProps) => {
  const [foundDifferences, setFoundDifferences] = useState<ClickPoint[]>([]);
  const [wrongClicks, setWrongClicks] = useState(0);
  const canvasRef = useRef<HTMLDivElement>(null);

  // Predefined difference locations (normalized 0-1 coordinates)
  const differences = [
    { x: 0.25, y: 0.3, label: "Éclairage incohérent" },
    { x: 0.65, y: 0.4, label: "Ombre inversée" },
    { x: 0.45, y: 0.6, label: "Reflet manquant" },
    { x: 0.8, y: 0.25, label: "Couleur température" },
    { x: 0.15, y: 0.7, label: "Profondeur fausse" },
    { x: 0.55, y: 0.15, label: "Accessoire déplacé" },
    { x: 0.35, y: 0.85, label: "Angle impossible" },
  ];

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (foundDifferences.length >= targetDifferences) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;

    // Check if click is near a difference (within 0.08 radius)
    const foundDiff = differences.find((diff, idx) => {
      if (foundDifferences.some(f => Math.abs(f.x - diff.x) < 0.05 && Math.abs(f.y - diff.y) < 0.05)) {
        return false; // Already found
      }
      const distance = Math.sqrt(Math.pow(x - diff.x, 2) + Math.pow(y - diff.y, 2));
      return distance < 0.08;
    });

    if (foundDiff) {
      const newFound = [...foundDifferences, { x: foundDiff.x, y: foundDiff.y }];
      setFoundDifferences(newFound);
      if (newFound.length >= targetDifferences) {
        setTimeout(onSolve, 500);
      }
    } else {
      setWrongClicks(wrongClicks + 1);
    }
  };

  return (
    <div className="space-y-4 p-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold neon-cyan flex items-center justify-center gap-2">
          <Eye className="w-6 h-6" />
          Analyse de Scène
        </h2>
        <p className="text-muted-foreground">
          Trouvez les {targetDifferences} incohérences qui révèlent la supercherie
        </p>
        <div className="flex justify-center gap-4">
          <Badge variant="default" className="gap-1">
            <Check className="w-3 h-3" />
            Trouvées: {foundDifferences.length}/{targetDifferences}
          </Badge>
          <Badge variant="destructive" className="gap-1">
            <X className="w-3 h-3" />
            Erreurs: {wrongClicks}
          </Badge>
        </div>
      </div>

      <Card className="relative">
        <div
          ref={canvasRef}
          onClick={handleClick}
          className="relative w-full aspect-video bg-gradient-to-br from-purple-900 via-blue-900 to-cyan-900 cursor-crosshair overflow-hidden"
          style={{
            backgroundImage: "radial-gradient(circle at 50% 50%, rgba(255,255,255,0.1) 1px, transparent 1px)",
            backgroundSize: "20px 20px",
          }}
        >
          {/* Found differences markers */}
          {foundDifferences.map((point, idx) => (
            <div
              key={idx}
              className="absolute animate-pulse"
              style={{
                left: `${point.x * 100}%`,
                top: `${point.y * 100}%`,
                transform: "translate(-50%, -50%)",
              }}
            >
              <div className="w-12 h-12 rounded-full border-4 border-green-500 bg-green-500/20 flex items-center justify-center">
                <Check className="w-6 h-6 text-green-500" />
              </div>
            </div>
          ))}

          {/* Visual hints for remaining differences */}
          {differences.map((diff, idx) => {
            const isFound = foundDifferences.some(
              f => Math.abs(f.x - diff.x) < 0.05 && Math.abs(f.y - diff.y) < 0.05
            );
            if (!isFound) {
              return (
                <div
                  key={idx}
                  className="absolute w-2 h-2 rounded-full bg-red-500/30 animate-pulse"
                  style={{
                    left: `${diff.x * 100}%`,
                    top: `${diff.y * 100}%`,
                    transform: "translate(-50%, -50%)",
                    animationDelay: `${idx * 0.3}s`,
                  }}
                />
              );
            }
            return null;
          })}
        </div>
      </Card>

      <div className="grid grid-cols-2 gap-2 text-sm">
        {differences.slice(0, foundDifferences.length).map((diff, idx) => (
          <div key={idx} className="flex items-center gap-2 text-green-500">
            <Check className="w-4 h-4" />
            <span>{diff.label}</span>
          </div>
        ))}
      </div>

      {wrongClicks >= 5 && (
        <div className="bg-yellow-500/10 border border-yellow-500/50 rounded-lg p-3 text-center text-sm">
          <p className="text-yellow-600 dark:text-yellow-400">
            💡 Les zones suspectes clignotent légèrement. Regardez les ombres et les reflets !
          </p>
        </div>
      )}
    </div>
  );
};
