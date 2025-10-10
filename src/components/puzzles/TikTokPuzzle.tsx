import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

interface TikTokPuzzleProps {
  originalHashtags: string[];
  sabotageHashtags: string[];
  onSolve: () => void;
}

export const TikTokPuzzle = ({ originalHashtags, sabotageHashtags, onSolve }: TikTokPuzzleProps) => {
  const [matches, setMatches] = useState<Record<string, string>>({});
  const [viralScore, setViralScore] = useState(0);
  const [showFeedback, setShowFeedback] = useState(false);
  
  const hashtagData = originalHashtags.map((tag, idx) => ({
    original: tag,
    views: Math.floor(Math.random() * 10) + 1,
    trending: idx < 3
  }));

  const handleMatch = (original: string, sabotage: string) => {
    const newMatches = { ...matches, [original]: sabotage };
    setMatches(newMatches);
    calculateScore(newMatches);
    setShowFeedback(false);
  };
  
  const calculateScore = (currentMatches: Record<string, string>) => {
    let score = 0;
    Object.entries(currentMatches).forEach(([original, sabotage]) => {
      const data = hashtagData.find(h => h.original === original);
      if (data?.trending && sabotageHashtags.includes(sabotage)) {
        score += 20;
      }
    });
    setViralScore(score);
  };
  
  const handleSubmit = () => {
    setShowFeedback(true);
    if (viralScore >= 80) {
      setTimeout(onSolve, 1500);
    }
  };

  return (
    <div className="bg-card rounded-3xl p-8 cartoon-shadow">
      <h3 className="text-2xl font-bold text-foreground mb-4 text-center">
        Sabotage Viral TikTok
      </h3>
      <p className="text-center text-muted-foreground mb-6 text-sm">
        Associez les hashtags tendance avec des alternatives anti-virales
      </p>

      <div className="mb-6 bg-secondary/20 rounded-lg p-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium">Score de Destruction Virale</span>
          <span className="text-lg font-bold">{viralScore}%</span>
        </div>
        <div className="w-full bg-secondary/30 rounded-full h-3">
          <div 
            className={`h-3 rounded-full transition-all ${viralScore >= 80 ? 'bg-green-500' : 'bg-destructive'}`}
            style={{ width: `${viralScore}%` }}
          />
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-6">
        <div>
          <h4 className="font-semibold mb-3 text-sm">Hashtags Tendance (à saboter)</h4>
          <div className="space-y-2">
            {hashtagData.filter(h => h.trending).map((data) => (
              <div key={data.original} className="bg-secondary/30 p-3 rounded-lg">
                <div className="font-mono text-sm">{data.original}</div>
                <div className="text-xs text-muted-foreground">{data.views}M vues</div>
                {matches[data.original] && (
                  <div className="mt-2 text-xs text-green-400">→ {matches[data.original]}</div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div>
          <h4 className="font-semibold mb-3 text-sm">Alternatives Anti-Virales</h4>
          <div className="space-y-2">
            {sabotageHashtags.map((tag) => (
              <Button
                key={tag}
                variant="outline"
                size="sm"
                className="w-full justify-start font-mono text-xs"
                onClick={() => {
                  const unmatched = hashtagData.find(h => h.trending && !matches[h.original]);
                  if (unmatched) handleMatch(unmatched.original, tag);
                }}
                disabled={Object.values(matches).includes(tag)}
              >
                {tag}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {showFeedback && viralScore < 80 && (
        <p className="mb-4 text-center text-destructive text-sm">
          Score insuffisant ! Assurez-vous d'associer tous les hashtags tendance.
        </p>
      )}

      <Button 
        onClick={handleSubmit}
        disabled={Object.keys(matches).length === 0}
        className="w-full"
        size="lg"
      >
        Lancer le Sabotage ({Object.keys(matches).length} remplacements)
      </Button>
    </div>
  );
};
