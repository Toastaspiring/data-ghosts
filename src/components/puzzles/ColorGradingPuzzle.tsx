import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Palette } from "lucide-react";

interface ColorGradingPuzzleProps {
  onSolve: () => void;
}

export const ColorGradingPuzzle = ({ onSolve }: ColorGradingPuzzleProps) => {
  const [saturation, setSaturation] = useState([50]);
  const [contrast, setContrast] = useState([100]);
  const [temperature, setTemperature] = useState([6500]);
  const [tint, setTint] = useState([0]);

  const handleSubmit = () => {
    if (saturation[0] >= 120 && contrast[0] >= 150 && 
        (temperature[0] <= 4000 || temperature[0] >= 9000)) {
      onSolve();
    }
  };

  const isExtreme = saturation[0] >= 120 && contrast[0] >= 150 && 
                    (temperature[0] <= 4000 || temperature[0] >= 9000);

  return (
    <div className="space-y-6 p-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold neon-cyan flex items-center justify-center gap-2">
          <Palette className="w-6 h-6" />
          Station de Color Grading
        </h2>
        <p className="text-muted-foreground">
          Poussez les réglages à l'extrême pour ruiner les couleurs
        </p>
        <Badge variant={isExtreme ? "destructive" : "secondary"}>
          {isExtreme ? "Réglages Catastrophiques ✓" : "Réglages Normaux"}
        </Badge>
      </div>

      <Card className="p-6 space-y-6">
        {/* Saturation */}
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="font-medium">Saturation</span>
            <Badge variant={saturation[0] >= 120 ? "destructive" : "outline"}>
              {saturation[0]}%
            </Badge>
          </div>
          <Slider
            value={saturation}
            onValueChange={setSaturation}
            min={0}
            max={200}
            step={5}
          />
        </div>

        {/* Contrast */}
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="font-medium">Contraste</span>
            <Badge variant={contrast[0] >= 150 ? "destructive" : "outline"}>
              {contrast[0]}%
            </Badge>
          </div>
          <Slider
            value={contrast}
            onValueChange={setContrast}
            min={0}
            max={200}
            step={5}
          />
        </div>

        {/* Temperature */}
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="font-medium">Température</span>
            <Badge variant={temperature[0] <= 4000 || temperature[0] >= 9000 ? "destructive" : "outline"}>
              {temperature[0]}K
            </Badge>
          </div>
          <Slider
            value={temperature}
            onValueChange={setTemperature}
            min={2000}
            max={10000}
            step={100}
          />
        </div>

        {/* Tint */}
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="font-medium">Teinte</span>
            <Badge variant="outline">
              {tint[0] > 0 ? "+" : ""}{tint[0]}
            </Badge>
          </div>
          <Slider
            value={tint}
            onValueChange={setTint}
            min={-100}
            max={100}
            step={5}
          />
        </div>
      </Card>

      {/* Preview */}
      <Card className="p-6 overflow-hidden">
        <div
          className="aspect-video rounded-lg transition-all"
          style={{
            filter: `saturate(${saturation[0]}%) contrast(${contrast[0]}%) hue-rotate(${tint[0]}deg)`,
            background: `linear-gradient(135deg, 
              hsl(${temperature[0] / 100}, 70%, 50%), 
              hsl(${(temperature[0] / 100) + 60}, 70%, 50%))`,
          }}
        >
          <div className="h-full flex items-center justify-center text-4xl">
            🎬
          </div>
        </div>
        <p className="text-center text-sm text-muted-foreground mt-3">
          Aperçu des réglages appliqués
        </p>
      </Card>

      <Button
        onClick={handleSubmit}
        disabled={!isExtreme}
        className="w-full"
        size="lg"
      >
        Appliquer les Réglages
      </Button>
    </div>
  );
};
