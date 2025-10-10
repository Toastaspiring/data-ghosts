import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sparkles } from "lucide-react";

interface TransitionPuzzleProps {
  elegantTransitions: string[];
  tackyTransitions: string[];
  clipsCount: number;
  tackyPercentage: number;
  onSolve: () => void;
}

export const TransitionPuzzle = ({
  elegantTransitions,
  tackyTransitions,
  clipsCount,
  tackyPercentage,
  onSolve,
}: TransitionPuzzleProps) => {
  const [transitions, setTransitions] = useState<string[]>(
    Array(clipsCount).fill(elegantTransitions[0])
  );

  const updateTransition = (clipIdx: number, transition: string) => {
    const newTransitions = [...transitions];
    newTransitions[clipIdx] = transition;
    setTransitions(newTransitions);
  };

  const tackyCount = transitions.filter(t => tackyTransitions.includes(t)).length;
  const tackyPercent = (tackyCount / clipsCount) * 100;

  const handleSubmit = () => {
    if (tackyPercent >= tackyPercentage) {
      onSolve();
    }
  };

  const transitionEmojis: Record<string, string> = {
    "Fade": "🌫️",
    "Dissolve": "💫",
    "Cut": "✂️",
    "Wipe": "↔️",
    "Star Wipe": "⭐",
    "Heart Dissolve": "💖",
    "Spinning Cube": "🎲",
    "Checkerboard": "🏁",
    "Zoom Burst": "💥",
    "Page Peel": "📄",
  };

  return (
    <div className="space-y-6 p-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold neon-cyan flex items-center justify-center gap-2">
          <Sparkles className="w-6 h-6" />
          Effets de Transition
        </h2>
        <p className="text-muted-foreground">
          Utilisez au moins {tackyPercentage}% de transitions ringardes
        </p>
        <Badge variant={tackyPercent >= tackyPercentage ? "destructive" : "secondary"}>
          Transitions Ringardes: {tackyPercent.toFixed(0)}% ({tackyCount}/{clipsCount})
        </Badge>
      </div>

      <div className="grid gap-3">
        {Array.from({ length: clipsCount }).map((_, idx) => (
          <Card key={idx} className="p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-medium">Clip {idx + 1} → {idx + 2}</span>
              <div className="flex items-center gap-2">
                <span className="text-2xl">{transitionEmojis[transitions[idx]]}</span>
                <Badge variant={tackyTransitions.includes(transitions[idx]) ? "destructive" : "outline"}>
                  {transitions[idx]}
                </Badge>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              {[...elegantTransitions, ...tackyTransitions].map((transition) => (
                <Button
                  key={transition}
                  variant={transitions[idx] === transition ? "default" : "outline"}
                  size="sm"
                  onClick={() => updateTransition(idx, transition)}
                  className="text-xs"
                >
                  {transitionEmojis[transition]} {transition}
                </Button>
              ))}
            </div>
          </Card>
        ))}
      </div>

      <Card className="p-4 bg-gradient-to-r from-purple-500/20 to-pink-500/20">
        <div className="text-center">
          <div className="text-4xl mb-2">🎬</div>
          <div className="font-bold">Aperçu du Style</div>
          <div className="text-sm text-muted-foreground">
            {tackyPercent >= tackyPercentage 
              ? "Totalement ringard ! Parfait pour saboter." 
              : "Pas assez ringard encore..."}
          </div>
        </div>
      </Card>

      <Button
        onClick={handleSubmit}
        disabled={tackyPercent < tackyPercentage}
        className="w-full"
        size="lg"
      >
        Appliquer les Transitions
      </Button>
    </div>
  );
};
