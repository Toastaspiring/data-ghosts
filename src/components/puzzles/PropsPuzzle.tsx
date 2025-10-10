import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowUp, ArrowDown, Shuffle } from "lucide-react";

interface PropsPuzzleProps {
  correctOrder: string[];
  onSolve: () => void;
}

export const PropsPuzzle = ({ correctOrder, onSolve }: PropsPuzzleProps) => {
  const [currentOrder, setCurrentOrder] = useState<string[]>([...correctOrder].sort(() => Math.random() - 0.5));
  const [showHint, setShowHint] = useState(false);

  const propIcons: Record<string, string> = {
    vase: "🏺",
    book: "📖",
    lamp: "🔦",
    photo: "🖼️",
    clock: "⏰",
  };

  const moveUp = (index: number) => {
    if (index === 0) return;
    const newOrder = [...currentOrder];
    [newOrder[index], newOrder[index - 1]] = [newOrder[index - 1], newOrder[index]];
    setCurrentOrder(newOrder);
  };

  const moveDown = (index: number) => {
    if (index === currentOrder.length - 1) return;
    const newOrder = [...currentOrder];
    [newOrder[index], newOrder[index + 1]] = [newOrder[index + 1], newOrder[index]];
    setCurrentOrder(newOrder);
  };

  const handleSubmit = () => {
    const isWrong = currentOrder.join() !== correctOrder.join();
    if (isWrong) {
      onSolve();
    } else {
      setShowHint(true);
    }
  };

  return (
    <div className="space-y-6 p-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold neon-cyan">Manipulation d'Accessoires</h2>
        <p className="text-muted-foreground">
          Replacez les accessoires dans le MAUVAIS ordre pour ruiner la continuité
        </p>
        <Badge variant="outline">
          Objectif: Créer un désordre maximal
        </Badge>
      </div>

      <Card className="p-6 space-y-3">
        {currentOrder.map((prop, index) => (
          <div
            key={index}
            className="flex items-center gap-4 p-4 bg-muted/50 rounded-lg border-2 border-border hover:border-primary transition-colors"
          >
            <div className="text-4xl">{propIcons[prop]}</div>
            <div className="flex-1">
              <div className="font-bold capitalize">{prop}</div>
              <div className="text-sm text-muted-foreground">Position {index + 1}</div>
            </div>
            <div className="flex flex-col gap-1">
              <Button
                size="sm"
                variant="outline"
                onClick={() => moveUp(index)}
                disabled={index === 0}
              >
                <ArrowUp className="w-4 h-4" />
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => moveDown(index)}
                disabled={index === currentOrder.length - 1}
              >
                <ArrowDown className="w-4 h-4" />
              </Button>
            </div>
          </div>
        ))}
      </Card>

      {showHint && (
        <div className="bg-yellow-500/10 border border-yellow-500/50 rounded-lg p-4 text-center">
          <p className="text-yellow-600 dark:text-yellow-400">
            💡 Astuce: L'ordre actuel ressemble trop à l'original ! Mélangez plus !
          </p>
        </div>
      )}

      <Button
        onClick={handleSubmit}
        className="w-full"
        size="lg"
      >
        <Shuffle className="w-4 h-4 mr-2" />
        Valider le Désordre
      </Button>

      <div className="text-xs text-center text-muted-foreground">
        Utilisez les flèches pour déplacer les objets. Plus c'est chaotique, mieux c'est !
      </div>
    </div>
  );
};
