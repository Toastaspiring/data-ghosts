import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sparkles } from "lucide-react";

interface Meme {
  name: string;
  cringe_level: number;
  viral_potential: number;
}

interface MemePuzzleProps {
  memes: Meme[];
  targetCringe: number;
  onSolve: () => void;
}

export const MemePuzzle = ({ memes, targetCringe, onSolve }: MemePuzzleProps) => {
  const [selectedMemes, setSelectedMemes] = useState<Meme[]>([]);
  const [showHint, setShowHint] = useState(false);

  const totalCringe = selectedMemes.reduce((sum, meme) => sum + meme.cringe_level, 0);

  const toggleMeme = (meme: Meme) => {
    if (selectedMemes.find(m => m.name === meme.name)) {
      setSelectedMemes(selectedMemes.filter(m => m.name !== meme.name));
    } else {
      setSelectedMemes([...selectedMemes, meme]);
    }
  };

  const handleSubmit = () => {
    if (totalCringe >= targetCringe) {
      onSolve();
    } else {
      setShowHint(true);
    }
  };

  return (
    <div className="space-y-6 p-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold neon-cyan">Injection de Memes Brainrot</h2>
        <p className="text-muted-foreground">
          Sélectionnez les memes les plus cringe pour maximiser le sabotage
        </p>
        <div className="flex justify-center gap-4 text-sm">
          <Badge variant="outline">Cringe Total: {totalCringe}/{targetCringe}</Badge>
          <Badge variant={totalCringe >= targetCringe ? "default" : "secondary"}>
            {totalCringe >= targetCringe ? "Objectif Atteint ✓" : "Continuez..."}
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {memes.map((meme) => {
          const isSelected = selectedMemes.find(m => m.name === meme.name);
          return (
            <Card
              key={meme.name}
              className={`p-4 cursor-pointer transition-all hover:scale-105 ${
                isSelected ? "border-primary border-2 bg-primary/10" : "border-border"
              }`}
              onClick={() => toggleMeme(meme)}
            >
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Sparkles className={`w-4 h-4 ${isSelected ? "text-primary" : "text-muted-foreground"}`} />
                  <h3 className="font-bold">{meme.name}</h3>
                </div>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Cringe:</span>
                    <Badge variant="destructive">{meme.cringe_level}/10</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Viral:</span>
                    <Badge variant="secondary">{meme.viral_potential}/10</Badge>
                  </div>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {showHint && (
        <div className="bg-yellow-500/10 border border-yellow-500/50 rounded-lg p-4 text-center">
          <p className="text-yellow-600 dark:text-yellow-400">
            💡 Astuce: Skibidi Toilet et Ohio sont les plus cringe ! Vous avez besoin de plus de cringe.
          </p>
        </div>
      )}

      <Button
        onClick={handleSubmit}
        disabled={selectedMemes.length === 0}
        className="w-full"
        size="lg"
      >
        Injecter les Memes ({selectedMemes.length} sélectionnés)
      </Button>
    </div>
  );
};
