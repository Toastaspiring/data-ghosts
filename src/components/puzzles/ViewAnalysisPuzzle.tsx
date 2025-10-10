import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Eye, Activity, MapPin, Smartphone } from "lucide-react";

interface ViewAnalysisPuzzleProps {
  totalViews: number;
  botThreshold: number;
  onSolve: () => void;
}

export const ViewAnalysisPuzzle = ({ totalViews, botThreshold, onSolve }: ViewAnalysisPuzzleProps) => {
  const [analyzed, setAnalyzed] = useState(false);
  const [botPercentage] = useState(82); // Precomputed result
  const [showDetails, setShowDetails] = useState(false);

  const metrics = [
    { label: "Temps de visionnage moyen", organic: "45s", bot: "2s", icon: Activity },
    { label: "Taux d'engagement", organic: "4.2%", bot: "0.1%", icon: Eye },
    { label: "Diversité géographique", organic: "85%", bot: "8%", icon: MapPin },
    { label: "Variété d'appareils", organic: "92%", bot: "12%", icon: Smartphone },
  ];

  const handleAnalyze = () => {
    setAnalyzed(true);
    setTimeout(() => {
      if (botPercentage >= botThreshold) {
        onSolve();
      }
    }, 2000);
  };

  return (
    <div className="space-y-6 p-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold neon-cyan flex items-center justify-center gap-2">
          <Eye className="w-6 h-6" />
          Détection de Vues Gonflées
        </h2>
        <p className="text-muted-foreground">
          Analysez les patterns pour exposer les vues artificielles
        </p>
        <div className="text-3xl font-bold text-primary">
          {totalViews.toLocaleString()} vues
        </div>
      </div>

      {!analyzed ? (
        <>
          <Card className="p-6 space-y-4">
            <h3 className="font-bold">Indicateurs à Analyser</h3>
            <div className="space-y-3">
              {metrics.map((metric, idx) => {
                const Icon = metric.icon;
                return (
                  <div key={idx} className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                    <Icon className="w-5 h-5 text-primary" />
                    <span className="flex-1 text-sm">{metric.label}</span>
                  </div>
                );
              })}
            </div>
          </Card>

          <Button onClick={handleAnalyze} className="w-full" size="lg">
            🔍 Lancer l'Analyse
          </Button>
        </>
      ) : (
        <>
          <Card className="p-6 space-y-4">
            <div className="text-center space-y-2">
              <div className="text-6xl">🤖</div>
              <h3 className="text-2xl font-bold text-destructive">{botPercentage}% de Bots Détectés</h3>
              <Progress value={botPercentage} className="h-4" />
            </div>
          </Card>

          <Card className="p-4 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-bold">Détails de l'Analyse</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowDetails(!showDetails)}
              >
                {showDetails ? "Masquer" : "Afficher"}
              </Button>
            </div>

            {showDetails && (
              <div className="space-y-2">
                {metrics.map((metric, idx) => {
                  const Icon = metric.icon;
                  return (
                    <div key={idx} className="p-3 bg-muted rounded-lg space-y-2">
                      <div className="flex items-center gap-2">
                        <Icon className="w-4 h-4" />
                        <span className="text-sm font-medium">{metric.label}</span>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div className="p-2 bg-green-500/10 border border-green-500/50 rounded">
                          <div className="text-muted-foreground">Organique</div>
                          <div className="font-bold text-green-600">{metric.organic}</div>
                        </div>
                        <div className="p-2 bg-red-500/10 border border-red-500/50 rounded">
                          <div className="text-muted-foreground">Détecté</div>
                          <div className="font-bold text-red-600">{metric.bot}</div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </Card>

          <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-4 text-center animate-pulse">
            <p className="font-bold text-red-600 dark:text-red-400">
              🚨 FRAUDE DÉTECTÉE: {Math.floor(totalViews * botPercentage / 100).toLocaleString()} vues artificielles
            </p>
          </div>
        </>
      )}
    </div>
  );
};
