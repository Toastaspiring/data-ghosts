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
  const [revealedTypes, setRevealedTypes] = useState<Set<string>>(new Set());

  const allHashtags = [...trendingHashtags, ...avoidHashtags, ...neutralHashtags];

  const toggleHashtag = (hashtag: string) => {
    if (selectedHashtags.includes(hashtag)) {
      setSelectedHashtags(selectedHashtags.filter(h => h !== hashtag));
    } else if (selectedHashtags.length < 4) {
      setSelectedHashtags([...selectedHashtags, hashtag]);
      setRevealedTypes(new Set([...revealedTypes, hashtag]));
    }
  };

  const getHashtagType = (hashtag: string) => {
    if (trendingHashtags.includes(hashtag)) return "trending";
    if (avoidHashtags.includes(hashtag)) return "avoid";
    return "neutral";
  };
  
  const getHashtagMetrics = (hashtag: string) => {
    const type = getHashtagType(hashtag);
    const baseViews = type === "trending" ? 8 : type === "avoid" ? 9 : 4;
    const baseLikes = type === "trending" ? 500 : type === "avoid" ? 600 : 300;
    const baseShares = type === "trending" ? 200 : type === "avoid" ? 250 : 100;
    
    return {
      views: `${baseViews + Math.floor(Math.random() * 3)}M`,
      likes: `${baseLikes + Math.floor(Math.random() * 200)}K`,
      shares: `${baseShares + Math.floor(Math.random() * 100)}K`
    };
  };

  const handleSubmit = () => {
    const allTrending = selectedHashtags.every(h => trendingHashtags.includes(h));
    if (allTrending && selectedHashtags.length === trendingHashtags.length) {
      onSolve();
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
          
          return (
            <Card
              key={hashtag}
              className={`p-4 cursor-pointer transition-all ${
                isSelected ? "border-primary border-2 bg-primary/10" : "border-border"
              }`}
              onClick={() => toggleHashtag(hashtag)}
            >
              <div className="text-center space-y-2">
                <div className="text-2xl font-bold text-primary">{hashtag}</div>
                {type === "trending" && (
                  <Badge variant="default" className="gap-1">
                    <TrendingUp className="w-3 h-3" />
                    Tendance
                  </Badge>
                )}
                {type === "avoid" && (
                  <Badge variant="destructive">À Éviter</Badge>
                )}
                {type === "neutral" && (
                  <Badge variant="secondary">Neutre</Badge>
                )}
              </div>
            </Card>
          );
        })}
      </div>

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
