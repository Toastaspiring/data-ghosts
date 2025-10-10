import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, CheckCircle2 } from "lucide-react";

interface AnachronismPuzzleProps {
  timePeriod: string;
  modernItems: string[];
  periodItems: string[];
  targetCount: number;
  onSolve: () => void;
}

export const AnachronismPuzzle = ({
  timePeriod,
  modernItems,
  periodItems,
  targetCount,
  onSolve,
}: AnachronismPuzzleProps) => {
  const [selectedItems, setSelectedItems] = useState<string[]>([]);

  const itemEmojis: Record<string, string> = {
    smartphone: "📱",
    laptop: "💻",
    electric_light: "💡",
    plastic_bottle: "🍾",
    sneakers: "👟",
    candle: "🕯️",
    scroll: "📜",
    sword: "⚔️",
    goblet: "🍷",
    tapestry: "🎨",
  };

  const toggleItem = (item: string) => {
    if (selectedItems.includes(item)) {
      setSelectedItems(selectedItems.filter(i => i !== item));
    } else {
      setSelectedItems([...selectedItems, item]);
    }
  };

  const handleSubmit = () => {
    const allModern = selectedItems.every(item => modernItems.includes(item));
    if (allModern && selectedItems.length >= targetCount) {
      onSolve();
    }
  };

  const allItems = [...modernItems, ...periodItems];

  return (
    <div className="space-y-6 p-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold neon-cyan flex items-center justify-center gap-2">
          <Clock className="w-6 h-6" />
          Défauts de Décor Anachronique
        </h2>
        <p className="text-muted-foreground">
          Placez {targetCount} objets modernes dans une scène {timePeriod}
        </p>
        <Badge variant="outline">
          Sélectionnés: {selectedItems.length}/{targetCount}
        </Badge>
      </div>

      <Card className="p-6 bg-gradient-to-br from-amber-950/30 to-orange-950/30 border-amber-700/50">
        <div className="text-center mb-4">
          <h3 className="text-lg font-bold text-amber-400">Scène: {timePeriod}</h3>
          <p className="text-sm text-muted-foreground">Sélectionnez les objets à placer dans le décor</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {allItems.map((item) => {
            const isSelected = selectedItems.includes(item);
            const isModern = modernItems.includes(item);

            return (
              <Card
                key={item}
                className={`p-4 cursor-pointer transition-all hover:scale-105 ${
                  isSelected
                    ? "border-primary border-2 bg-primary/20"
                    : "border-border bg-card"
                }`}
                onClick={() => toggleItem(item)}
              >
                <div className="text-center space-y-2">
                  <div className="text-4xl">{itemEmojis[item]}</div>
                  <div className="text-sm font-medium capitalize">
                    {item.replace(/_/g, " ")}
                  </div>
                  {isSelected && (
                    <CheckCircle2 className="w-5 h-5 mx-auto text-primary" />
                  )}
                  {isModern && (
                    <Badge variant="destructive" className="text-xs">
                      Moderne
                    </Badge>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      </Card>

      {selectedItems.length >= targetCount && !selectedItems.every(item => modernItems.includes(item)) && (
        <div className="bg-yellow-500/10 border border-yellow-500/50 rounded-lg p-4 text-center">
          <p className="text-yellow-600 dark:text-yellow-400">
            💡 Vous avez sélectionné des objets d'époque ! Choisissez uniquement des objets modernes.
          </p>
        </div>
      )}

      <Button
        onClick={handleSubmit}
        disabled={selectedItems.length < targetCount}
        className="w-full"
        size="lg"
      >
        Placer dans le Décor ({selectedItems.length} objets)
      </Button>
    </div>
  );
};
