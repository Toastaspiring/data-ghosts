import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Palette } from "lucide-react";

interface ColorGamePuzzleProps {
  targetColor: string;
  onSolve: () => void;
}

export const ColorGamePuzzle = ({ targetColor, onSolve }: ColorGamePuzzleProps) => {
  const [currentColor, setCurrentColor] = useState("#00FF00");

  const colors = [
    { name: "Vert", value: "#00FF00" },
    { name: "Bleu", value: "#0000FF" },
    { name: "Jaune", value: "#FFFF00" },
    { name: "Rouge", value: "#FF0000" },
  ];

  const handleColorClick = (color: string) => {
    setCurrentColor(color);
    if (color === targetColor) {
      setTimeout(onSolve, 500);
    }
  };

  return (
    <div className="bg-card border-2 border-primary/30 rounded-lg p-8 cartoon-shadow animate-fade-in-up">
      <div className="flex items-center gap-3 mb-6">
        <Palette className="w-8 h-8 text-primary animate-pulse-glow" />
        <h3 className="text-3xl font-bold neon-cyan font-mono">Jeu de Couleurs du Fond Vert</h3>
      </div>

      <div className="mb-8">
        <div
          className="w-full h-48 rounded-lg cartoon-shadow transition-colors duration-300 border-2 border-border"
          style={{ backgroundColor: currentColor }}
        />
        <p className="text-center mt-4 text-muted-foreground font-mono">
          Ajustez la lumière pour ruiner l'éclairage
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {colors.map((color) => (
          <Button
            key={color.value}
            onClick={() => handleColorClick(color.value)}
            className="h-20 text-lg font-mono border-2 transition-all hover:scale-105"
            style={{
              backgroundColor: color.value,
              color: color.value === "#FFFF00" ? "#000" : "#fff",
              borderColor: currentColor === color.value ? "#0ff" : "transparent"
            }}
          >
            {color.name}
          </Button>
        ))}
      </div>
    </div>
  );
};
