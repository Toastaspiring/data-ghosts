import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Hash, TrendingDown } from "lucide-react";

interface HashtagPuzzleProps {
  originalHashtags: string[];
  sabotageOptions: string[][];
  targetReduction: number;
  onSolve: () => void;
}

export const HashtagPuzzle = ({ originalHashtags, sabotageOptions, targetReduction, onSolve }: HashtagPuzzleProps) => {
  const [replacements, setReplacements] = useState<Record<number, number>>({});
  const [showViews, setShowViews] = useState(true);

  const reductionFactor = Object.keys(replacements).length * 0.25;
  const viewReduction = Math.floor(reductionFactor * 100);

  const selectReplacement = (hashtagIndex: number, optionIndex: number) => {
    setReplacements({
      ...replacements,
      [hashtagIndex]: optionIndex,
    });
  };

  const handleSubmit = () => {
    if (reductionFactor >= targetReduction / 100) {
      onSolve();
    }
  };

  return (
    <div className="space-y-6 p-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold neon-cyan flex items-center justify-center gap-2">
          <Hash className="w-6 h-6" />
          Sabotage des Hashtags
        </h2>
        <p className="text-muted-foreground">
          Remplacez les hashtags tendance par des alternatives ringardes
        </p>
        <div className="flex justify-center gap-4">
          <Badge variant="outline">
            Remplacés: {Object.keys(replacements).length}/{originalHashtags.length}
          </Badge>
          <Badge variant={viewReduction >= targetReduction ? "destructive" : "secondary"}>
            <TrendingDown className="w-3 h-3 mr-1" />
            Réduction: {viewReduction}%
          </Badge>
        </div>
      </div>

      <div className="space-y-4">
        {originalHashtags.map((hashtag, idx) => {
          const selectedOption = replacements[idx];
          const hasReplacement = selectedOption !== undefined;

          return (
            <Card key={idx} className="p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="text-2xl font-bold text-primary">#</div>
                  <div>
                    <div className="font-medium line-through text-muted-foreground">{hashtag}</div>
                    {hasReplacement && (
                      <div className="font-bold text-destructive">
                        {sabotageOptions[idx][selectedOption]}
                      </div>
                    )}
                  </div>
                </div>
                <Badge variant={hasReplacement ? "destructive" : "outline"}>
                  {hasReplacement ? "Saboté" : "Original"}
                </Badge>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {sabotageOptions[idx].map((option, optIdx) => (
                  <Button
                    key={optIdx}
                    variant={selectedOption === optIdx ? "default" : "outline"}
                    size="sm"
                    onClick={() => selectReplacement(idx, optIdx)}
                    className="text-xs"
                  >
                    {option}
                  </Button>
                ))}
              </div>
            </Card>
          );
        })}
      </div>

      {showViews && (
        <Card className="p-4 bg-gradient-to-r from-blue-500/10 to-purple-500/10">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-muted-foreground">Vues estimées</div>
              <div className="text-2xl font-bold line-through text-muted-foreground">5,000,000</div>
              <div className="text-3xl font-bold text-destructive">
                {Math.floor(5000000 * (1 - reductionFactor)).toLocaleString()}
              </div>
            </div>
            <div className="text-right">
              <div className="text-4xl">📉</div>
              <div className="text-sm text-destructive font-bold">-{viewReduction}%</div>
            </div>
          </div>
        </Card>
      )}

      <Button
        onClick={handleSubmit}
        disabled={Object.keys(replacements).length === 0}
        className="w-full"
        size="lg"
      >
        Appliquer les Hashtags Sabotés
      </Button>
    </div>
  );
};
