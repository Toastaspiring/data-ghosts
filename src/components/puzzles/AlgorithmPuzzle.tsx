import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Code, Check, AlertTriangle, TrendingDown } from "lucide-react";

interface AlgorithmParameter {
  name: string;
  current: number;
  target: number;
}

interface AlgorithmPuzzleProps {
  parameters?: AlgorithmParameter[];
  threshold?: number;
  onSolve: () => void;
}

export const AlgorithmPuzzle = ({ parameters = [], threshold = 0.3, onSolve }: AlgorithmPuzzleProps) => {
  const [paramValues, setParamValues] = useState<{ [key: string]: number }>(
    parameters.reduce((acc, param) => ({ ...acc, [param.name]: param.current }), {})
  );
  const [submitted, setSubmitted] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);

  if (!parameters.length) {
    return <div className="p-6 text-center text-muted-foreground">Chargement du puzzle...</div>;
  }

  const handleSliderChange = (paramName: string, value: number[]) => {
    if (submitted) return;
    setParamValues(prev => ({ ...prev, [paramName]: value[0] }));
  };

  const handleReset = () => {
    setParamValues(parameters.reduce((acc, param) => ({ ...acc, [param.name]: param.current }), {}));
    setSubmitted(false);
    setShowFeedback(false);
  };

  const handleSubmit = () => {
    setSubmitted(true);
    setShowFeedback(true);

    const allBelowThreshold = Object.values(paramValues).every(val => val <= threshold);

    if (allBelowThreshold) {
      setTimeout(() => onSolve(), 1500);
    }
  };

  const formatParamName = (name: string) => {
    return name.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  const allBelowThreshold = Object.values(paramValues).every(val => val <= threshold);
  const countCorrect = Object.values(paramValues).filter(val => val <= threshold).length;

  return (
    <div className="space-y-6 p-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold neon-cyan flex items-center justify-center gap-2">
          <Code className="w-6 h-6 text-primary" />
          Sabotage de l'Algorithme
        </h2>
        <p className="text-muted-foreground text-sm">
          Réduisez tous les paramètres en dessous de {(threshold * 100).toFixed(0)}% pour saboter les recommandations
        </p>
        <Badge variant="outline">
          <TrendingDown className="w-3 h-3 mr-1" />
          {countCorrect}/{parameters.length} paramètres sabotés
        </Badge>
      </div>

      <div className="bg-destructive/10 border-2 border-destructive rounded-lg p-4">
        <p className="text-sm text-destructive font-semibold text-center">
          ⚠️ Réduisez l'impact de leurs vidéos virales néfastes
        </p>
      </div>

      <div className="space-y-4">
        {parameters.map((param, idx) => {
          const currentValue = paramValues[param.name];
          const isCorrect = currentValue <= threshold;
          
          return (
            <Card
              key={param.name}
              className={`p-4 transition-all ${
                submitted && isCorrect
                  ? "border-2 border-green-500 bg-green-500/10"
                  : submitted && !isCorrect
                  ? "border-2 border-destructive bg-destructive/10"
                  : "border-border"
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="font-mono text-sm font-bold">
                    {formatParamName(param.name)}
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={isCorrect ? "default" : "destructive"}>
                      {(currentValue * 100).toFixed(0)}%
                    </Badge>
                    {submitted && isCorrect && <Check className="w-4 h-4 text-green-500" />}
                    {submitted && !isCorrect && <AlertTriangle className="w-4 h-4 text-destructive" />}
                  </div>
                </div>
                
                <Slider
                  value={[currentValue]}
                  onValueChange={(value) => handleSliderChange(param.name, value)}
                  min={0}
                  max={1}
                  step={0.05}
                  disabled={submitted}
                  className="w-full"
                />
                
                <div className="flex justify-between text-xs text-muted-foreground font-mono">
                  <span>0%</span>
                  <span className="text-destructive font-bold">
                    Objectif: &lt; {(threshold * 100).toFixed(0)}%
                  </span>
                  <span>100%</span>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {showFeedback && (
        <Card className={`p-4 ${allBelowThreshold ? 'bg-green-500/10 border-green-500' : 'bg-destructive/10 border-destructive'}`}>
          <div className="text-center space-y-2">
            {allBelowThreshold ? (
              <>
                <Check className="w-12 h-12 text-green-500 mx-auto" />
                <p className="font-bold text-green-500 text-lg">
                  Algorithme saboté avec succès !
                </p>
                <p className="text-xs text-muted-foreground">
                  Leurs vidéos n'apparaîtront plus dans les recommandations.
                </p>
              </>
            ) : (
              <>
                <AlertTriangle className="w-12 h-12 text-red-400 mx-auto" />
                <p className="font-bold text-destructive text-lg">
                  {countCorrect} sur {parameters.length} paramètres corrects
                </p>
                <p className="text-xs text-muted-foreground">
                  💡 Tous les paramètres doivent être en dessous de {(threshold * 100).toFixed(0)}%
                </p>
              </>
            )}
          </div>
        </Card>
      )}

      <div className="flex gap-2">
        <Button
          onClick={handleSubmit}
          disabled={submitted}
          className="flex-1"
          size="lg"
        >
          Valider le Sabotage
        </Button>
        
        {submitted && !allBelowThreshold && (
          <Button
            onClick={handleReset}
            variant="outline"
            size="lg"
          >
            Réessayer
          </Button>
        )}
      </div>

      <div className="text-xs text-center text-muted-foreground space-y-1">
        <p>💡 Plus les valeurs sont basses, moins les vidéos sont recommandées</p>
        <p>⚠️ L'engagement et la durée de vue sont les paramètres clés</p>
      </div>
    </div>
  );
};