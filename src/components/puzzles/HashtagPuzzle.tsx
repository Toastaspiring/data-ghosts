import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Hash, TrendingDown, AlertCircle } from "lucide-react";

interface HashtagPuzzleProps {
  originalHashtags: string[];
  sabotageOptions: string[][];
  targetReduction: number;
  onSolve: () => void;
}

interface OptionMetrics {
  effectiveness: number; // How well it sabotages (0-100)
  suspicion: number; // How obvious it is (0-100)
  engagement: string; // Fake engagement rate
  reach: string; // Fake reach number
}

export const HashtagPuzzle = ({ originalHashtags, sabotageOptions, targetReduction, onSolve }: HashtagPuzzleProps) => {
  const [replacements, setReplacements] = useState<Record<number, number>>({});
  const [submitted, setSubmitted] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);

  // Generate effectiveness values for each option (some are better than others)
  const optionEffectiveness: OptionMetrics[][] = sabotageOptions.map((options, hashIdx) => 
    options.map((_, optIdx) => {
      // First option is usually best (most boring/sabotaging)
      // Last option is worst (too obvious/not effective)
      const baseEffectiveness = optIdx === 0 ? 85 : optIdx === 1 ? 60 : 30;
      const baseSuspicion = optIdx === 0 ? 20 : optIdx === 1 ? 45 : 80;
      
      return {
        effectiveness: baseEffectiveness + Math.floor(Math.random() * 15),
        suspicion: baseSuspicion + Math.floor(Math.random() * 20),
        // Misleading metrics - higher numbers don't mean better sabotage
        engagement: `${Math.floor(Math.random() * 50) + 20}%`,
        reach: `${Math.floor(Math.random() * 500) + 100}K`
      };
    })
  );

  const calculateSabotageScore = () => {
    let totalEffectiveness = 0;
    let totalSuspicion = 0;
    
    Object.entries(replacements).forEach(([hashIdx, optIdx]) => {
      const metrics = optionEffectiveness[Number(hashIdx)][optIdx];
      totalEffectiveness += metrics.effectiveness;
      totalSuspicion += metrics.suspicion;
    });
    
    const avgEffectiveness = totalEffectiveness / Object.keys(replacements).length;
    const avgSuspicion = totalSuspicion / Object.keys(replacements).length;
    
    // Good sabotage = high effectiveness, low suspicion
    const score = avgEffectiveness - (avgSuspicion * 0.5);
    return Math.max(0, Math.floor(score));
  };

  const selectReplacement = (hashtagIndex: number, optionIndex: number) => {
    if (submitted) return;
    
    setReplacements({
      ...replacements,
      [hashtagIndex]: optionIndex,
    });
    setShowFeedback(false);
  };

  const handleSubmit = () => {
    setSubmitted(true);
    setShowFeedback(true);
    
    const score = calculateSabotageScore();
    if (score >= 60 && Object.keys(replacements).length === originalHashtags.length) {
      setTimeout(onSolve, 1500);
    }
  };

  const currentScore = submitted ? calculateSabotageScore() : 0;
  const isSuccess = currentScore >= 60;

  return (
    <div className="space-y-6 p-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold neon-cyan flex items-center justify-center gap-2">
          <Hash className="w-6 h-6" />
          Sabotage des Hashtags
        </h2>
        <p className="text-muted-foreground text-sm">
          Choisissez les alternatives les plus discrètes et efficaces
        </p>
        <Badge variant="outline">
          Remplacés: {Object.keys(replacements).length}/{originalHashtags.length}
        </Badge>
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
                {hasReplacement && submitted && (
                  <div className="text-xs space-y-1 text-right">
                    <Badge variant={
                      optionEffectiveness[idx][selectedOption].effectiveness > 70 
                        ? "default" 
                        : "secondary"
                    }>
                      Efficacité: {optionEffectiveness[idx][selectedOption].effectiveness}%
                    </Badge>
                    <Badge variant={
                      optionEffectiveness[idx][selectedOption].suspicion < 40 
                        ? "default" 
                        : "destructive"
                    }>
                      Suspicion: {optionEffectiveness[idx][selectedOption].suspicion}%
                    </Badge>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {sabotageOptions[idx].map((option, optIdx) => {
                  const metrics = optionEffectiveness[idx][optIdx];
                  
                  return (
                    <div key={optIdx} className="space-y-1">
                      <Button
                        variant={selectedOption === optIdx ? "default" : "outline"}
                        size="sm"
                        onClick={() => selectReplacement(idx, optIdx)}
                        className="w-full text-xs"
                        disabled={submitted}
                      >
                        {option}
                      </Button>
                      {!submitted && (
                        <div className="text-[10px] text-muted-foreground text-center space-y-0.5">
                          <div>📊 Engagement: {metrics.engagement}</div>
                          <div>👥 Portée: {metrics.reach}</div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </Card>
          );
        })}
      </div>

      {showFeedback && (
        <Card className={`p-4 ${isSuccess ? 'bg-green-500/10 border-green-500' : 'bg-destructive/10 border-destructive'}`}>
          <div className="space-y-2">
            <div className="flex items-center gap-2 justify-center">
              {isSuccess ? (
                <>
                  <TrendingDown className="w-5 h-5 text-green-500" />
                  <span className="font-bold text-green-500">Sabotage Réussi !</span>
                </>
              ) : (
                <>
                  <AlertCircle className="w-5 h-5 text-destructive" />
                  <span className="font-bold text-destructive">Sabotage Insuffisant</span>
                </>
              )}
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold">{currentScore}/100</div>
              <div className="text-xs text-muted-foreground mt-1">
                {isSuccess 
                  ? "Les hashtags sabotés sont discrets et efficaces !" 
                  : "Score minimum requis: 60. Choisissez des options plus discrètes et ennuyeuses."}
              </div>
            </div>
          </div>
        </Card>
      )}

      <div className="text-xs text-center text-muted-foreground space-y-1">
        <p>💡 Astuce: Les options avec l'engagement le plus élevé ne sont pas toujours les meilleures</p>
        <p>🎯 Objectif: Maximiser l'efficacité, minimiser la suspicion</p>
      </div>

      <Button
        onClick={handleSubmit}
        disabled={Object.keys(replacements).length !== originalHashtags.length || submitted}
        className="w-full"
        size="lg"
      >
        {submitted ? "Sabotage en cours..." : "Lancer le Sabotage"}
      </Button>
    </div>
  );
};
