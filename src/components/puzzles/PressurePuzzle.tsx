import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Gauge } from "lucide-react";

interface PressurePuzzleProps {
  targetPressure: number;
  safetyRange: { min: number; max: number };
  onSolve: () => void;
}

export const PressurePuzzle = ({ targetPressure, safetyRange, onSolve }: PressurePuzzleProps) => {
  const [pressure, setPressure] = useState(180);

  const adjustPressure = (amount: number) => {
    const newPressure = Math.max(0, Math.min(300, pressure + amount));
    setPressure(newPressure);
  };

  const handleSubmit = () => {
    if (pressure >= safetyRange.min && pressure <= safetyRange.max) {
      onSolve();
    }
  };

  const isInRange = pressure >= safetyRange.min && pressure <= safetyRange.max;
  const isDangerous = pressure < safetyRange.min - 20 || pressure > safetyRange.max + 20;

  return (
    <div className="space-y-6 p-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold neon-cyan flex items-center justify-center gap-2">
          <Gauge className="w-6 h-6" />
          Calibration de Pression
        </h2>
        <p className="text-muted-foreground">
          Ajustez la pression entre {safetyRange.min} et {safetyRange.max} bar
        </p>
      </div>

      {/* Pressure Gauge */}
      <Card className="p-8">
        <div className="relative w-full aspect-square max-w-xs mx-auto">
          <svg viewBox="0 0 200 200" className="w-full h-full">
            {/* Background arc */}
            <path
              d="M 30 170 A 85 85 0 0 1 170 170"
              fill="none"
              stroke="hsl(var(--muted))"
              strokeWidth="20"
            />
            {/* Pressure arc */}
            <path
              d="M 30 170 A 85 85 0 0 1 170 170"
              fill="none"
              stroke={isDangerous ? "hsl(0, 70%, 50%)" : isInRange ? "hsl(120, 70%, 50%)" : "hsl(45, 70%, 50%)"}
              strokeWidth="20"
              strokeDasharray={`${(pressure / 300) * 439.8} 439.8`}
              className="transition-all duration-300"
            />
            {/* Center display */}
            <text
              x="100"
              y="110"
              textAnchor="middle"
              className="text-4xl font-bold fill-primary"
            >
              {pressure}
            </text>
            <text
              x="100"
              y="135"
              textAnchor="middle"
              className="text-sm fill-muted-foreground"
            >
              bar
            </text>
          </svg>
        </div>

        <div className="text-center mt-6 space-y-2">
          <Badge variant={isInRange ? "default" : isDangerous ? "destructive" : "secondary"} className="text-lg">
            {isInRange ? "✓ Zone Sûre" : isDangerous ? "⚠️ Danger" : "Ajustement Requis"}
          </Badge>
        </div>
      </Card>

      {/* Controls */}
      <Card className="p-6 space-y-4">
        <h3 className="font-bold text-center">Contrôles de Pression</h3>
        <div className="grid grid-cols-2 gap-3">
          <Button
            onClick={() => adjustPressure(50)}
            variant="outline"
            size="lg"
            className="h-16"
          >
            <div className="text-center">
              <div className="text-2xl">⬆️</div>
              <div className="text-xs">+50 bar</div>
            </div>
          </Button>
          <Button
            onClick={() => adjustPressure(25)}
            variant="outline"
            size="lg"
            className="h-16"
          >
            <div className="text-center">
              <div className="text-xl">⬆</div>
              <div className="text-xs">+25 bar</div>
            </div>
          </Button>
          <Button
            onClick={() => adjustPressure(-25)}
            variant="outline"
            size="lg"
            className="h-16"
          >
            <div className="text-center">
              <div className="text-xl">⬇</div>
              <div className="text-xs">-25 bar</div>
            </div>
          </Button>
          <Button
            onClick={() => adjustPressure(-50)}
            variant="outline"
            size="lg"
            className="h-16"
          >
            <div className="text-center">
              <div className="text-2xl">⬇️</div>
              <div className="text-xs">-50 bar</div>
            </div>
          </Button>
        </div>
        <Button
          onClick={() => adjustPressure(10)}
          variant="ghost"
          size="sm"
          className="w-full"
        >
          Ajustement Fin (+10 bar)
        </Button>
      </Card>

      <Button
        onClick={handleSubmit}
        disabled={!isInRange}
        className="w-full"
        size="lg"
      >
        Verrouiller la Pression
      </Button>
    </div>
  );
};
