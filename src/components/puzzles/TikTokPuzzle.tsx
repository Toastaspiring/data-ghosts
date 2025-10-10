import { useState } from "react";
import { Button } from "@/components/ui/button";
import { TrendingUp, ArrowRight } from "lucide-react";

interface TikTokPuzzleProps {
  originalHashtags: string[];
  sabotageHashtags: string[];
  onSolve: () => void;
}

export const TikTokPuzzle = ({ originalHashtags, sabotageHashtags, onSolve }: TikTokPuzzleProps) => {
  const [selectedOriginal, setSelectedOriginal] = useState<string | null>(null);
  const [matches, setMatches] = useState<Record<string, string>>({});
  const [showFeedback, setShowFeedback] = useState(false);
  
  const hashtagData = originalHashtags.slice(0, 5).map((tag, idx) => ({
    original: tag,
    views: idx < 3 ? Math.floor(Math.random() * 5) + 8 : Math.floor(Math.random() * 3) + 2,
    trending: idx < 3
  }));

  const handleOriginalClick = (hashtag: string) => {
    setSelectedOriginal(hashtag);
    setShowFeedback(false);
  };

  const handleSabotageClick = (sabotage: string) => {
    if (!selectedOriginal) return;
    
    const newMatches = { ...matches, [selectedOriginal]: sabotage };
    setMatches(newMatches);
    setSelectedOriginal(null);
  };

  const calculateScore = () => {
    let score = 0;
    const trendingCount = hashtagData.filter(h => h.trending).length;
    
    hashtagData.forEach((data) => {
      if (data.trending && matches[data.original]) {
        score += Math.floor(100 / trendingCount);
      }
    });
    
    return score;
  };
  
  const handleSubmit = () => {
    setShowFeedback(true);
    const score = calculateScore();
    if (score >= 80) {
      setTimeout(onSolve, 1500);
    }
  };

  const currentScore = calculateScore();
  const trendingHashtags = hashtagData.filter(h => h.trending);

  return (
    <div className="bg-card rounded-3xl p-8 cartoon-shadow">
      <h3 className="text-2xl font-bold text-foreground mb-4 text-center">
        Sabotage Viral TikTok
      </h3>
      <p className="text-center text-muted-foreground mb-6 text-sm">
        1. Cliquez sur un hashtag tendance<br/>
        2. Cliquez sur une alternative anti-virale pour l'associer
      </p>

      <div className="mb-6 bg-secondary/20 rounded-lg p-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium">Score de Destruction Virale</span>
          <span className="text-lg font-bold">{currentScore}%</span>
        </div>
        <div className="w-full bg-secondary/30 rounded-full h-3">
          <div 
            className={`h-3 rounded-full transition-all ${currentScore >= 80 ? 'bg-green-500' : 'bg-destructive'}`}
            style={{ width: `${currentScore}%` }}
          />
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-6">
        <div>
          <h4 className="font-semibold mb-3 text-sm flex items-center gap-2">
            <TrendingUp className="w-4 h-4" />
            Hashtags Tendance
          </h4>
          <div className="space-y-2">
            {trendingHashtags.map((data) => (
              <Button
                key={data.original}
                variant={selectedOriginal === data.original ? "default" : "outline"}
                size="sm"
                className="w-full justify-between"
                onClick={() => handleOriginalClick(data.original)}
              >
                <div className="text-left">
                  <div className="font-mono text-sm">{data.original}</div>
                  <div className="text-xs opacity-70">{data.views}M vues</div>
                </div>
                {matches[data.original] && (
                  <div className="flex items-center gap-1 text-xs">
                    <ArrowRight className="w-3 h-3" />
                    {matches[data.original]}
                  </div>
                )}
              </Button>
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
                onClick={() => handleSabotageClick(tag)}
                disabled={!selectedOriginal || Object.values(matches).includes(tag)}
              >
                {tag}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {showFeedback && currentScore < 80 && (
        <p className="mb-4 text-center text-destructive text-sm">
          Score: {currentScore}% - Il faut au moins 80% ! Associez tous les hashtags tendance.
        </p>
      )}

      <Button 
        onClick={handleSubmit}
        disabled={Object.keys(matches).length !== trendingHashtags.length}
        className="w-full"
        size="lg"
      >
        Lancer le Sabotage ({Object.keys(matches).length}/{trendingHashtags.length})
      </Button>
    </div>
  );
};
