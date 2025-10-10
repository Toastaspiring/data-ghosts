import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Settings2, AlertTriangle, CheckCircle2, TrendingDown } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface AlgorithmParameter {
  name: string;
  current: number;
  min: number;
  max: number;
  target: number;
  weight: number;
  linkedTo: string[];
}

interface AlgorithmPuzzleProps {
  parameters: AlgorithmParameter[];
  threshold: number;
  maxTotalScore?: number;
  constraints?: Array<{ params: string[]; rule: string }>;
  onSolve: () => void;
}

export const AlgorithmPuzzle = ({ 
  parameters, 
  threshold, 
  maxTotalScore = 180,
  constraints = [],
  onSolve 
}: AlgorithmPuzzleProps) => {
  const [paramValues, setParamValues] = useState<Record<string, number>>(
    parameters.reduce((acc, p) => ({ ...acc, [p.name]: p.current }), {})
  );
  const [showHint, setShowHint] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [lastAdjusted, setLastAdjusted] = useState<string | null>(null);

  // Apply interdependencies when a parameter changes
  useEffect(() => {
    if (!lastAdjusted) return;

    const updatedValues = { ...paramValues };
    const adjustedParam = parameters.find(p => p.name === lastAdjusted);
    
    if (!adjustedParam) return;

    // Apply linked effects
    adjustedParam.linkedTo.forEach(linkedName => {
      const linkedParam = parameters.find(p => p.name === linkedName);
      if (!linkedParam) return;

      const currentValue = updatedValues[linkedName];
      const adjustedValue = updatedValues[lastAdjusted];
      const adjustedParamOriginal = adjustedParam.current;

      // If we lowered the adjusted param, linked params increase
      if (adjustedValue < adjustedParamOriginal * 0.7) {
        const increase = Math.min(
          (adjustedParamOriginal - adjustedValue) * 0.3,
          linkedParam.max - currentValue
        );
        updatedValues[linkedName] = Math.min(
          linkedParam.max,
          Math.round(currentValue + increase)
        );
      }
    });

    // Apply constraint-based adjustments
    constraints.forEach(constraint => {
      if (constraint.params.includes(lastAdjusted)) {
        // Share velocity / viral coefficient constraint
        if (constraint.params.includes('share_velocity') && constraint.params.includes('viral_coefficient')) {
          if (updatedValues['share_velocity'] < 30 && updatedValues['viral_coefficient']) {
            updatedValues['viral_coefficient'] = Math.max(
              0,
              updatedValues['viral_coefficient'] - 20
            );
          }
        }

        // Comment density / interaction score balance constraint
        if (constraint.params.includes('comment_density') && constraint.params.includes('interaction_score')) {
          const diff = Math.abs(updatedValues['comment_density'] - updatedValues['interaction_score']);
          if (diff > 10) {
            const target = updatedValues['comment_density'];
            updatedValues['interaction_score'] = Math.max(
              0,
              Math.min(100, target + (updatedValues['interaction_score'] > target ? 10 : -10))
            );
          }
        }
      }
    });

    setParamValues(updatedValues);
    setLastAdjusted(null);
  }, [lastAdjusted, parameters, constraints]);

  const handleParamChange = (paramName: string, value: number[]) => {
    setParamValues(prev => ({ ...prev, [paramName]: value[0] }));
    setLastAdjusted(paramName);
  };

  const calculateTotalScore = () => {
    return parameters.reduce((sum, p) => {
      return sum + (paramValues[p.name] * p.weight);
    }, 0);
  };

  const getParameterStatus = (param: AlgorithmParameter) => {
    const value = paramValues[param.name];
    if (value <= threshold) return "success";
    if (value <= threshold * 1.5) return "warning";
    return "danger";
  };

  const totalScore = calculateTotalScore();
  const allUnderThreshold = parameters.every(p => paramValues[p.name] <= threshold);
  const scoreValid = totalScore <= maxTotalScore;
  const canSolve = allUnderThreshold && scoreValid;

  const handleSubmit = () => {
    setAttempts(prev => prev + 1);
    
    if (canSolve) {
      onSolve();
    } else {
      setShowHint(true);
    }
  };

  const getParamDisplayName = (name: string) => {
    return name
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <div className="flex items-center gap-3">
          <Settings2 className="w-8 h-8 text-primary" />
          <div className="flex-1">
            <CardTitle className="text-2xl">Manipulation d'Algorithme</CardTitle>
            <CardDescription>
              Ajustez les paramètres pour saboter la recommandation (tous ≤ {threshold})
            </CardDescription>
          </div>
        </div>
        
        <div className="mt-4 grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <div className="text-sm text-muted-foreground">Score Total Pondéré</div>
            <div className="flex items-center gap-2">
              <span className={`text-2xl font-bold ${scoreValid ? 'text-green-600' : 'text-red-600'}`}>
                {Math.round(totalScore)}
              </span>
              <span className="text-muted-foreground">/ {maxTotalScore}</span>
            </div>
            <Progress value={(totalScore / maxTotalScore) * 100} className="h-2" />
          </div>

          <div className="space-y-1">
            <div className="text-sm text-muted-foreground">Paramètres Valides</div>
            <div className="flex items-center gap-2">
              <span className={`text-2xl font-bold ${allUnderThreshold ? 'text-green-600' : 'text-orange-600'}`}>
                {parameters.filter(p => paramValues[p.name] <= threshold).length}
              </span>
              <span className="text-muted-foreground">/ {parameters.length}</span>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Constraints Display */}
        {constraints.length > 0 && (
          <div className="p-4 bg-orange-50 dark:bg-orange-950/20 rounded-lg border border-orange-200 dark:border-orange-800">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="w-5 h-5 text-orange-600" />
              <span className="font-semibold text-sm">Contraintes Système</span>
            </div>
            <ul className="space-y-1 text-xs text-muted-foreground">
              {constraints.map((constraint, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <TrendingDown className="w-3 h-3 mt-0.5 shrink-0" />
                  <span>{constraint.rule}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Parameters Grid */}
        <div className="grid gap-4">
          {parameters.map((param) => {
            const value = paramValues[param.name];
            const status = getParameterStatus(param);
            const isLinked = param.linkedTo.length > 0;

            return (
              <div 
                key={param.name} 
                className={`p-4 rounded-lg border-2 transition-all ${
                  status === 'success' 
                    ? 'border-green-500 bg-green-50 dark:bg-green-950/20' 
                    : status === 'warning'
                    ? 'border-orange-500 bg-orange-50 dark:bg-orange-950/20'
                    : 'border-red-500 bg-red-50 dark:bg-red-950/20'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-sm">
                      {getParamDisplayName(param.name)}
                    </span>
                    {isLinked && (
                      <Badge variant="outline" className="text-xs">
                        Lié à {param.linkedTo.length}
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-muted-foreground">
                      Poids: {param.weight}x
                    </span>
                    <Badge 
                      variant={status === 'success' ? 'default' : 'destructive'}
                      className="font-mono"
                    >
                      {value}
                    </Badge>
                  </div>
                </div>

                <Slider
                  value={[value]}
                  onValueChange={(val) => handleParamChange(param.name, val)}
                  min={param.min}
                  max={param.max}
                  step={1}
                  className="w-full"
                />

                <div className="flex justify-between mt-2 text-xs text-muted-foreground">
                  <span>{param.min}</span>
                  <span className="font-semibold text-primary">
                    Cible: ≤ {param.target}
                  </span>
                  <span>{param.max}</span>
                </div>

                {isLinked && (
                  <div className="mt-2 text-xs text-muted-foreground italic">
                    ⚡ Affecte: {param.linkedTo.map(getParamDisplayName).join(', ')}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Status Messages */}
        {showHint && attempts > 0 && (
          <div className="p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <div className="text-sm space-y-2">
              <p className="font-semibold">💡 Indices après {attempts} tentative(s):</p>
              {!allUnderThreshold && (
                <p>• Certains paramètres sont encore au-dessus de {threshold}</p>
              )}
              {!scoreValid && (
                <p>• Votre score total ({Math.round(totalScore)}) dépasse {maxTotalScore}</p>
              )}
              <p className="text-xs text-muted-foreground mt-2">
                Astuce: Les paramètres liés s'influencent mutuellement. Ajustez-les dans le bon ordre !
              </p>
            </div>
          </div>
        )}

        {canSolve && (
          <div className="p-4 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200 dark:border-green-800">
            <div className="flex items-center gap-2 text-green-700 dark:text-green-400">
              <CheckCircle2 className="w-5 h-5" />
              <span className="font-semibold">Configuration valide ! Validez pour saboter l'algorithme.</span>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3">
          <Button
            onClick={handleSubmit}
            className="flex-1"
            disabled={!canSolve && attempts > 0}
          >
            {canSolve ? 'Valider le Sabotage' : 'Tester la Configuration'}
          </Button>
          
          {!showHint && attempts > 0 && (
            <Button
              variant="outline"
              onClick={() => setShowHint(true)}
            >
              Voir Indices
            </Button>
          )}
        </div>

        <div className="text-center text-xs text-muted-foreground">
          Tentatives: {attempts}
        </div>
      </CardContent>
    </Card>
  );
};
