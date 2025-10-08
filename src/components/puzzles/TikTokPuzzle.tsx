import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Hash, Check } from "lucide-react";

interface TikTokPuzzleProps {
  originalHashtags: string[];
  sabotageHashtags: string[];
  onSolve: () => void;
}

export const TikTokPuzzle = ({ originalHashtags, sabotageHashtags, onSolve }: TikTokPuzzleProps) => {
  const [replacedCount, setReplacedCount] = useState(0);
  const [hashtags, setHashtags] = useState(originalHashtags);

  const handleReplace = (index: number) => {
    if (index < sabotageHashtags.length) {
      const newHashtags = [...hashtags];
      newHashtags[index] = sabotageHashtags[index];
      setHashtags(newHashtags);
      
      const newCount = replacedCount + 1;
      setReplacedCount(newCount);
      
      if (newCount === originalHashtags.length) {
        setTimeout(onSolve, 500);
      }
    }
  };

  return (
    <div className="bg-card border-2 border-primary/30 rounded-lg p-8 cartoon-shadow animate-fade-in-up">
      <div className="flex items-center gap-3 mb-6">
        <Hash className="w-8 h-8 text-primary animate-pulse-glow" />
        <h3 className="text-3xl font-bold neon-cyan font-mono">Sabotage des Hashtags</h3>
      </div>

      <div className="space-y-4">
        {hashtags.map((hashtag, index) => (
          <div key={index} className="flex items-center gap-4 bg-muted/50 border-2 border-border hover:border-primary rounded-lg p-4 transition-all">
            <span className="text-2xl font-bold flex-1 text-foreground font-mono">{hashtag}</span>
            {hashtag === originalHashtags[index] ? (
              <Button
                onClick={() => handleReplace(index)}
                variant="outline"
                className="border-2 border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground font-mono"
              >
                SABOTER
              </Button>
            ) : (
              <Check className="w-6 h-6 text-primary animate-pulse" />
            )}
          </div>
        ))}
      </div>

      <div className="mt-6 text-center text-muted-foreground font-mono">
        <span className="text-primary">{replacedCount}</span>/{originalHashtags.length} hashtags sabotés
      </div>
    </div>
  );
};
