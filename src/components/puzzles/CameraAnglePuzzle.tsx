import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Camera, AlertCircle, CheckCircle2 } from "lucide-react";

interface CameraAngle {
  angle: number;
  possible: boolean;
  reason: string;
}

interface CameraAnglePuzzleProps {
  angles: CameraAngle[];
  targetCount: number;
  onSolve: () => void;
}

export const CameraAnglePuzzle = ({ angles, targetCount, onSolve }: CameraAnglePuzzleProps) => {
  const [selectedAngles, setSelectedAngles] = useState<number[]>([]);
  const [revealedReasons, setRevealedReasons] = useState<Set<number>>(new Set());
  const [attempts, setAttempts] = useState(0);

  const toggleAngle = (angle: number) => {
    if (selectedAngles.includes(angle)) {
      setSelectedAngles(selectedAngles.filter(a => a !== angle));
    } else {
      setSelectedAngles([...selectedAngles, angle]);
    }
  };

  const revealReason = (angle: number) => {
    setRevealedReasons(new Set([...revealedReasons, angle]));
  };

  const handleSubmit = () => {
    setAttempts(attempts + 1);
    const impossibleAngles = angles.filter(a => !a.possible).map(a => a.angle);
    const correctlySelected = selectedAngles.filter(a => impossibleAngles.includes(a));
    
    if (correctlySelected.length >= targetCount && selectedAngles.length === targetCount) {
      onSolve();
    }
  };

  return (
    <div className="space-y-6 p-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold neon-cyan flex items-center justify-center gap-2">
          <Camera className="w-6 h-6" />
          Analyse d'Angles de Caméra
        </h2>
        <p className="text-muted-foreground">
          Identifiez les {targetCount} angles impossibles qui révèlent la supercherie
        </p>
        <Badge variant="outline">
          Sélectionnés: {selectedAngles.length}/{targetCount}
        </Badge>
      </div>

      <div className="grid gap-3">
        {angles.map((angleData) => {
          const isSelected = selectedAngles.includes(angleData.angle);
          const isRevealed = revealedReasons.has(angleData.angle);
          
          return (
            <Card
              key={angleData.angle}
              className={`p-4 cursor-pointer transition-all ${
                isSelected ? "border-primary border-2 bg-primary/10" : "border-border"
              }`}
              onClick={() => toggleAngle(angleData.angle)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="text-2xl font-bold text-primary">
                    {angleData.angle}°
                  </div>
                  <div className="flex-1">
                    <div className="font-medium">Angle de caméra</div>
                    {isRevealed && (
                      <div className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                        {angleData.possible ? (
                          <CheckCircle2 className="w-3 h-3 text-green-500" />
                        ) : (
                          <AlertCircle className="w-3 h-3 text-red-500" />
                        )}
                        {angleData.reason}
                      </div>
                    )}
                  </div>
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={(e) => {
                    e.stopPropagation();
                    revealReason(angleData.angle);
                  }}
                  disabled={isRevealed}
                >
                  {isRevealed ? "Révélé" : "Analyser"}
                </Button>
              </div>
            </Card>
          );
        })}
      </div>

      {attempts > 0 && selectedAngles.length !== targetCount && (
        <div className="bg-yellow-500/10 border border-yellow-500/50 rounded-lg p-4 text-center">
          <p className="text-yellow-600 dark:text-yellow-400">
            💡 Vous devez sélectionner exactement {targetCount} angles. Analysez-les pour voir les raisons !
          </p>
        </div>
      )}

      <Button
        onClick={handleSubmit}
        disabled={selectedAngles.length !== targetCount}
        className="w-full"
        size="lg"
      >
        Valider ({selectedAngles.length} angles sélectionnés)
      </Button>
    </div>
  );
};
