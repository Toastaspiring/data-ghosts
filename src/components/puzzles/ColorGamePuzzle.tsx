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
    <div className="bg-card rounded-3xl p-8 cartoon-shadow">
      <div className="flex items-center gap-3 mb-6">
        <Palette className="w-8 h-8 text-primary" />
        <h3 className="text-2xl font-bold text-foreground">Jeu de Couleurs du Fond Vert</h3>
      </div>

      <div className="mb-8">
        <div
          className="w-full h-48 rounded-2xl cartoon-shadow transition-colors duration-300"
          style={{ backgroundColor: currentColor }}
        />
        <p className="text-center mt-4 text-muted-foreground">
          Ajustez la lumière pour ruiner l'éclairage
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {colors.map((color) => (
          <Button
            key={color.value}
            onClick={() => handleColorClick(color.value)}
            className="h-20 text-lg"
            style={{
              backgroundColor: color.value,
              color: color.value === "#FFFF00" ? "#000" : "#fff",
            }}
          >
            {color.name}
          </Button>
        ))}
      </div>
    </div>
  );
};
