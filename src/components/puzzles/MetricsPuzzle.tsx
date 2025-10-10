import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { TrendingDown, Heart, Share2, Bookmark, Users } from "lucide-react";

interface Metric {
  name: string;
  current: number;
  target: number;
}

interface MetricsPuzzleProps {
  metrics: Metric[];
  reductionFactor: number;
  onSolve: () => void;
}

export const MetricsPuzzle = ({ metrics, reductionFactor, onSolve }: MetricsPuzzleProps) => {
  const [values, setValues] = useState<Record<string, number>>(
    Object.fromEntries(metrics.map(m => [m.name, m.current]))
  );

  const updateValue = (name: string, value: number[]) => {
    setValues({ ...values, [name]: value[0] });
  };

  const handleSubmit = () => {
    const allReduced = metrics.every(m => values[m.name] <= m.current / reductionFactor);
    if (allReduced) {
      onSolve();
    }
  };

  const icons: Record<string, any> = {
    likes: Heart,
    shares: Share2,
    saves: Bookmark,
    follows: Users,
  };

  const totalReduction = metrics.reduce((sum, m) => {
    const reduction = ((m.current - values[m.name]) / m.current) * 100;
    return sum + reduction;
  }, 0) / metrics.length;

  return (
    <div className="space-y-6 p-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold neon-cyan flex items-center justify-center gap-2">
          <TrendingDown className="w-6 h-6" />
          Manipulation des Métriques
        </h2>
        <p className="text-muted-foreground">
          Réduisez toutes les métriques d'au moins {((1 - 1/reductionFactor) * 100).toFixed(0)}%
        </p>
        <Badge variant={totalReduction >= 90 ? "destructive" : "secondary"}>
          Réduction Moyenne: {totalReduction.toFixed(0)}%
        </Badge>
      </div>

      <div className="space-y-4">
        {metrics.map((metric) => {
          const Icon = icons[metric.name] || TrendingDown;
          const currentValue = values[metric.name];
          const reductionPercent = ((metric.current - currentValue) / metric.current) * 100;
          const isTarget = currentValue <= metric.target;

          return (
            <Card key={metric.name} className="p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Icon className="w-5 h-5 text-primary" />
                  <div>
                    <div className="font-medium capitalize">{metric.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {currentValue.toLocaleString()} / {metric.current.toLocaleString()}
                    </div>
                  </div>
                </div>
                <Badge variant={isTarget ? "destructive" : "secondary"}>
                  -{reductionPercent.toFixed(0)}%
                </Badge>
              </div>

              <Slider
                value={[currentValue]}
                onValueChange={(value) => updateValue(metric.name, value)}
                min={0}
                max={metric.current}
                step={metric.current / 100}
                className="w-full"
              />

              <div className="flex justify-between text-xs text-muted-foreground">
                <span>0</span>
                <span className="text-destructive font-bold">
                  Objectif: {metric.target.toLocaleString()}
                </span>
                <span>{metric.current.toLocaleString()}</span>
              </div>
            </Card>
          );
        })}
      </div>

      <Card className="p-6 bg-gradient-to-br from-red-500/20 to-orange-500/20">
        <div className="text-center space-y-2">
          <div className="text-5xl">📉</div>
          <div className="font-bold">Impact Global</div>
          <div className="text-3xl font-bold text-destructive">
            -{totalReduction.toFixed(0)}%
          </div>
          <p className="text-sm text-muted-foreground">
            Réduction moyenne de toutes les métriques
          </p>
        </div>
      </Card>

      <Button
        onClick={handleSubmit}
        disabled={totalReduction < 90}
        className="w-full"
        size="lg"
      >
        Appliquer le Sabotage
      </Button>
    </div>
  );
};
