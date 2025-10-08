import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";

interface SevenDifferencesPuzzleProps {
  onSolve: () => void;
}

export const SevenDifferencesPuzzle = ({ onSolve }: SevenDifferencesPuzzleProps) => {
  const [foundDifferences, setFoundDifferences] = useState<number[]>([]);
  
  const differences = [
    { id: 1, x: 20, y: 30, label: "Cadre photo" },
    { id: 2, x: 50, y: 25, label: "Horloge" },
    { id: 3, x: 70, y: 40, label: "Plante" },
    { id: 4, x: 30, y: 60, label: "Tapis" },
    { id: 5, x: 60, y: 70, label: "Lampe" },
    { id: 6, x: 80, y: 50, label: "Poster" },
    { id: 7, x: 40, y: 80, label: "Vase" },
  ];

  const handleClick = (diffId: number) => {
    if (!foundDifferences.includes(diffId)) {
      const newFound = [...foundDifferences, diffId];
      setFoundDifferences(newFound);
      
      if (newFound.length === 7) {
        setTimeout(onSolve, 500);
      }
    }
  };

  return (
    <div className="bg-card rounded-3xl p-8 cartoon-shadow">
      <div className="flex items-center gap-3 mb-6">
        <Eye className="w-8 h-8 text-primary" />
        <h3 className="text-2xl font-bold text-foreground">Jeu des 7 Différences</h3>
      </div>

      <div className="mb-6 text-center">
        <p className="text-lg text-muted-foreground mb-2">
          Trouvez les différences entre la vraie salle et la scène fake
        </p>
        <p className="text-3xl font-bold text-primary">
          {foundDifferences.length} / 7
        </p>
      </div>

      <div className="relative bg-secondary/20 rounded-2xl aspect-video overflow-hidden mb-6">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20" />
        
        {differences.map((diff) => (
          <button
            key={diff.id}
            onClick={() => handleClick(diff.id)}
            className={`absolute w-16 h-16 rounded-full border-4 transition-all ${
              foundDifferences.includes(diff.id)
                ? "bg-green-500/50 border-green-500 scale-0"
                : "bg-transparent border-transparent hover:border-accent hover:bg-accent/20"
            }`}
            style={{ left: `${diff.x}%`, top: `${diff.y}%` }}
            disabled={foundDifferences.includes(diff.id)}
          />
        ))}
      </div>

      <div className="grid grid-cols-2 gap-2 text-sm">
        {differences.map((diff) => (
          <div
            key={diff.id}
            className={`p-2 rounded-lg ${
              foundDifferences.includes(diff.id)
                ? "bg-green-500/20 text-green-700 line-through"
                : "bg-secondary/10 text-muted-foreground"
            }`}
          >
            {diff.label}
          </div>
        ))}
      </div>
    </div>
  );
};
