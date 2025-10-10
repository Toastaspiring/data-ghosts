import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Volume2, Play, Pause } from "lucide-react";

interface AudioSyncPuzzleProps {
  videoClips: number;
  targetDesync: number;
  onSolve: () => void;
}

export const AudioSyncPuzzle = ({ videoClips, targetDesync, onSolve }: AudioSyncPuzzleProps) => {
  const [clipOffsets, setClipOffsets] = useState<number[]>(Array(videoClips).fill(0));
  const [playingClip, setPlayingClip] = useState<number | null>(null);
  const [showHint, setShowHint] = useState(false);

  const updateOffset = (clipIndex: number, value: number[]) => {
    const newOffsets = [...clipOffsets];
    newOffsets[clipIndex] = value[0];
    setClipOffsets(newOffsets);
  };

  const handleSubmit = () => {
    const maxDesync = Math.max(...clipOffsets.map(Math.abs));
    if (maxDesync >= targetDesync) {
      onSolve();
    } else {
      setShowHint(true);
    }
  };

  const togglePlay = (clipIndex: number) => {
    setPlayingClip(playingClip === clipIndex ? null : clipIndex);
  };

  return (
    <div className="space-y-6 p-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold neon-cyan flex items-center justify-center gap-2">
          <Volume2 className="w-6 h-6" />
          Système de Doublage Audio
        </h2>
        <p className="text-muted-foreground">
          Désynchronisez l'audio d'au moins {targetDesync}ms pour rendre les vidéos inutilisables
        </p>
        <Badge variant="outline">
          Désync Max: {Math.max(...clipOffsets.map(Math.abs))}ms / {targetDesync}ms
        </Badge>
      </div>

      <div className="space-y-4">
        {Array.from({ length: videoClips }).map((_, idx) => (
          <Card key={idx} className="p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Button
                  size="sm"
                  variant={playingClip === idx ? "default" : "outline"}
                  onClick={() => togglePlay(idx)}
                >
                  {playingClip === idx ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                </Button>
                <div>
                  <div className="font-medium">Clip vidéo {idx + 1}</div>
                  <div className="text-sm text-muted-foreground">
                    Décalage: {clipOffsets[idx] > 0 ? "+" : ""}{clipOffsets[idx]}ms
                  </div>
                </div>
              </div>
              <Badge variant={Math.abs(clipOffsets[idx]) >= targetDesync ? "destructive" : "secondary"}>
                {Math.abs(clipOffsets[idx]) >= targetDesync ? "Désynchronisé ✓" : "Synchronisé"}
              </Badge>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>-1000ms (tôt)</span>
                <span>0ms (sync)</span>
                <span>+1000ms (tard)</span>
              </div>
              <Slider
                value={[clipOffsets[idx]]}
                onValueChange={(value) => updateOffset(idx, value)}
                min={-1000}
                max={1000}
                step={50}
                className="w-full"
              />
            </div>

            {/* Visual sync indicator */}
            <div className="relative h-12 bg-muted rounded-lg overflow-hidden">
              <div
                className="absolute top-0 left-1/2 w-1 h-full bg-primary opacity-30"
                style={{ transform: "translateX(-50%)" }}
              />
              <div
                className="absolute top-1/2 h-2 w-2 rounded-full bg-blue-500 transition-all"
                style={{
                  left: `${((clipOffsets[idx] + 1000) / 2000) * 100}%`,
                  transform: "translate(-50%, -50%)",
                }}
              />
              {playingClip === idx && (
                <div className="absolute inset-0 animate-pulse bg-primary/10" />
              )}
            </div>
          </Card>
        ))}
      </div>

      {showHint && (
        <div className="bg-yellow-500/10 border border-yellow-500/50 rounded-lg p-4 text-center">
          <p className="text-yellow-600 dark:text-yellow-400">
            💡 Poussez au moins un curseur au-delà de {targetDesync}ms dans n'importe quelle direction !
          </p>
        </div>
      )}

      <Button
        onClick={handleSubmit}
        className="w-full"
        size="lg"
      >
        Appliquer la Désynchronisation
      </Button>
    </div>
  );
};
