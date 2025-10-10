import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Volume2, VolumeX } from "lucide-react";

interface AudioMixPuzzleProps {
  onSolve: () => void;
}

export const AudioMixPuzzle = ({ onSolve }: AudioMixPuzzleProps) => {
  const [dialogue, setDialogue] = useState([-6]);
  const [music, setMusic] = useState([-20]);
  const [effects, setEffects] = useState([-15]);
  const [ambiance, setAmbiance] = useState([-25]);

  const handleSubmit = () => {
    if (dialogue[0] <= -30 || music[0] >= -5) {
      onSolve();
    }
  };

  const isImbalanced = dialogue[0] <= -30 || music[0] >= -5;

  return (
    <div className="space-y-6 p-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold neon-cyan flex items-center justify-center gap-2">
          <Volume2 className="w-6 h-6" />
          Table de Mixage Audio
        </h2>
        <p className="text-muted-foreground">
          Déséquilibrez les niveaux pour rendre l'audio inexploitable
        </p>
        <Badge variant={isImbalanced ? "destructive" : "secondary"}>
          {isImbalanced ? "Déséquilibré ✓" : "Équilibré"}
        </Badge>
      </div>

      <Card className="p-6 space-y-6">
        {/* Dialogue */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="font-medium">🎤 Dialogue</span>
              {dialogue[0] <= -30 && <VolumeX className="w-4 h-4 text-red-500" />}
            </div>
            <Badge variant={dialogue[0] <= -30 ? "destructive" : "outline"}>
              {dialogue[0]} dB
            </Badge>
          </div>
          <Slider
            value={dialogue}
            onValueChange={setDialogue}
            min={-60}
            max={0}
            step={1}
          />
        </div>

        {/* Music */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="font-medium">🎵 Music</span>
              {music[0] >= -5 && <Volume2 className="w-4 h-4 text-red-500" />}
            </div>
            <Badge variant={music[0] >= -5 ? "destructive" : "outline"}>
              {music[0]} dB
            </Badge>
          </div>
          <Slider
            value={music}
            onValueChange={setMusic}
            min={-60}
            max={0}
            step={1}
          />
        </div>

        {/* Effects */}
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="font-medium">🔊 Effets</span>
            <Badge variant="outline">{effects[0]} dB</Badge>
          </div>
          <Slider
            value={effects}
            onValueChange={setEffects}
            min={-60}
            max={0}
            step={1}
          />
        </div>

        {/* Ambiance */}
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="font-medium">🌊 Ambiance</span>
            <Badge variant="outline">{ambiance[0]} dB</Badge>
          </div>
          <Slider
            value={ambiance}
            onValueChange={setAmbiance}
            min={-60}
            max={0}
            step={1}
          />
        </div>
      </Card>

      {/* Visual Meters */}
      <Card className="p-4 bg-black/50">
        <div className="grid grid-cols-4 gap-4 h-40">
          {[
            { value: dialogue[0], label: "D", color: dialogue[0] <= -30 ? "bg-red-500" : "bg-green-500" },
            { value: music[0], label: "M", color: music[0] >= -5 ? "bg-red-500" : "bg-blue-500" },
            { value: effects[0], label: "E", color: "bg-yellow-500" },
            { value: ambiance[0], label: "A", color: "bg-purple-500" },
          ].map((track, idx) => (
            <div key={idx} className="flex flex-col items-center gap-2">
              <div className="text-xs font-bold">{track.label}</div>
              <div className="flex-1 w-8 bg-muted rounded-full overflow-hidden flex flex-col-reverse">
                <div
                  className={`${track.color} transition-all`}
                  style={{ height: `${((track.value + 60) / 60) * 100}%` }}
                />
              </div>
              <div className="text-xs">{track.value}</div>
            </div>
          ))}
        </div>
      </Card>

      <Button
        onClick={handleSubmit}
        disabled={!isImbalanced}
        className="w-full"
        size="lg"
      >
        Appliquer le Mixage
      </Button>
    </div>
  );
};
