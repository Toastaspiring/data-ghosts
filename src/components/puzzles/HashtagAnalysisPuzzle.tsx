import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Hash, TrendingUp } from "lucide-react";

interface HashtagAnalysisPuzzleProps {
  trendingHashtags: string[];
  avoidHashtags: string[];
  neutralHashtags: string[];
  onSolve: () => void;
}

export const HashtagAnalysisPuzzle = ({ 
  trendingHashtags, 
  avoidHashtags, 
  neutralHashtags, 
  onSolve 
}: HashtagAnalysisPuzzleProps) => {
  const [selectedHashtags, setSelectedHashtags] = useState<string[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);

  const allHashtags = [...trendingHashtags, ...avoidHashtags, ...neutralHashtags];

  const toggleHashtag = (hashtag: string) => {
    if (selectedHashtags.includes(hashtag)) {
      setSelectedHashtags(selectedHashtags.filter(h => h !== hashtag));
    } else if (selectedHashtags.length < trendingHashtags.length) {
      setSelectedHashtags([...selectedHashtags, hashtag]);
    }
    setShowFeedback(false);
  };

  const getHashtagType = (hashtag: string) => {
    if (trendingHashtags.includes(hashtag)) return "trending";
    if (avoidHashtags.includes(hashtag)) return "avoid";
    return "neutral";
  };
  
  const getHashtagMetrics = (hashtag: string) => {
    const type = getHashtagType(hashtag);
    // Intentionally misleading: avoid hashtags have HIGHER numbers
    const baseViews = type === "trending" ? 6 : type === "avoid" ? 11 : 3;
    const baseEngagement = type === "trending" ? 75 : type === "avoid" ? 85 : 45;
    const growth = type === "trending" ? 120 : type === "avoid" ? 95 : 60;
    
    return {
      views: `${baseViews + Math.floor(Math.random() * 2)}.${Math.floor(Math.random() * 9)}M`,
      engagement: `${baseEngagement + Math.floor(Math.random() * 10)}%`,
      growth: `+${growth + Math.floor(Math.random() * 20)}%`
    };
  };

  const handleSubmit = () => {
    setSubmitted(true);
    setShowFeedback(true);
    
    const allTrending = selectedHashtags.every(h => trendingHashtags.includes(h));
    const hasCorrectCount = selectedHashtags.length === trendingHashtags.length;
    
    if (allTrending && hasCorrectCount) {
      setTimeout(onSolve, 1500);
    }
  };

  return (
    <div className="space-y-6 p-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold neon-cyan flex items-center justify-center gap-2">
          <Hash className="w-6 h-6" />
          Analyse des Hashtags
        </h2>
        <p className="text-muted-foreground">
          Identifiez les hashtags tendance pour la vidéo virale
        </p>
        <Badge variant="outline">
          Sélectionnés: {selectedHashtags.length}/{trendingHashtags.length}
        </Badge>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {allHashtags.map((hashtag) => {
          const isSelected = selectedHashtags.includes(hashtag);
          const type = getHashtagType(hashtag);
          const metrics = getHashtagMetrics(hashtag);
          const showType = submitted && isSelected;
          
          return (
            <Card
              key={hashtag}
              className={`p-4 cursor-pointer transition-all ${
                isSelected ? "border-primary border-2 bg-primary/10" : "border-border"
              }`}
              onClick={() => !submitted && toggleHashtag(hashtag)}
            >
              <div className="space-y-2">
                <div className="text-lg font-bold text-primary text-center">{hashtag}</div>
                
                {!showType ? (
                  <div className="space-y-1 text-xs text-muted-foreground">
                    <div className="flex justify-between">
                      <span>Vues:</span>
                      <span className="font-semibold">{metrics.views}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Engagement:</span>
                      <span className="font-semibold">{metrics.engagement}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Croissance:</span>
                      <span className="font-semibold text-green-500">{metrics.growth}</span>
                    </div>
                  </div>
                ) : (
                  <div className="text-center">
                    {type === "trending" && (
                      <Badge variant="default" className="gap-1">
                        <TrendingUp className="w-3 h-3" />
                        Tendance ✓
                      </Badge>
                    )}
                    {type === "avoid" && (
                      <Badge variant="destructive">À Éviter ✗</Badge>
                    )}
                    {type === "neutral" && (
                      <Badge variant="secondary">Neutre ✗</Badge>
                    )}
                  </div>
                )}
              </div>
            </Card>
          );
        })}
      </div>

      {showFeedback && (
        <div className="text-center space-y-2">
          {selectedHashtags.every(h => trendingHashtags.includes(h)) && 
           selectedHashtags.length === trendingHashtags.length ? (
            <p className="text-green-500 font-semibold">
              ✓ Parfait ! Tous les hashtags tendance identifiés !
            </p>
          ) : (
            <p className="text-destructive font-semibold">
              ✗ Erreur ! Les hashtags avec les plus gros chiffres ne sont pas toujours les bons.
              <br/>
              <span className="text-xs">Astuce: Les vraies tendances ont une croissance régulière, pas explosive.</span>
            </p>
          )}
        </div>
      )}

      <Button
        onClick={handleSubmit}
        disabled={selectedHashtags.length !== trendingHashtags.length}
        className="w-full"
        size="lg"
      >
        Confirmer les Hashtags
      </Button>
    </div>
  );
};
