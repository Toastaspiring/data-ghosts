import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Video, Hash, Clock, Zap } from "lucide-react";

interface ViralVideoPuzzleProps {
  requiredElements: {
    trending_hashtag: string;
    background_style: string;
    editing_trick: string;
  };
  onSolve: () => void;
}

export const ViralVideoPuzzle = ({ requiredElements, onSolve }: ViralVideoPuzzleProps) => {
  const [hashtags, setHashtags] = useState<string[]>([]);
  const [currentHashtag, setCurrentHashtag] = useState("");
  const [duration, setDuration] = useState([20]);
  const [engagementHooks, setEngagementHooks] = useState<string[]>([]);
  const [trendFactor, setTrendFactor] = useState<"low" | "medium" | "high">("low");

  const addHashtag = () => {
    if (currentHashtag && hashtags.length < 5) {
      setHashtags([...hashtags, currentHashtag]);
      setCurrentHashtag("");
    }
  };

  const toggleHook = (hook: string) => {
    if (engagementHooks.includes(hook)) {
      setEngagementHooks(engagementHooks.filter(h => h !== hook));
    } else {
      setEngagementHooks([...engagementHooks, hook]);
    }
  };

  const availableHooks = [
    "🎵 Trending Audio",
    "❓ Question initiale",
    "🤯 Plot Twist",
    "💬 Call to Action",
    "🔥 Controversy",
  ];

  const handleSubmit = () => {
    if (hashtags.length >= 3 && engagementHooks.length >= 2 && trendFactor === "high") {
      onSolve();
    }
  };

  const viralScore = (hashtags.length * 20) + (engagementHooks.length * 25) + 
                     (trendFactor === "high" ? 30 : trendFactor === "medium" ? 15 : 0);

  return (
    <div className="space-y-6 p-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold neon-cyan flex items-center justify-center gap-2">
          <Video className="w-6 h-6" />
          Création Vidéo Virale
        </h2>
        <p className="text-muted-foreground">
          Créez une vidéo qui surpasse les influenceurs
        </p>
        <Badge variant={viralScore >= 80 ? "default" : "secondary"}>
          Score Viral: {viralScore}/100
        </Badge>
      </div>

      {/* Hashtags Section */}
      <Card className="p-4 space-y-3">
        <div className="flex items-center gap-2">
          <Hash className="w-5 h-5 text-primary" />
          <h3 className="font-bold">Hashtags ({hashtags.length}/5)</h3>
        </div>
        <div className="flex gap-2">
          <Input
            value={currentHashtag}
            onChange={(e) => setCurrentHashtag(e.target.value)}
            placeholder="#TrendingHashtag"
            onKeyPress={(e) => e.key === "Enter" && addHashtag()}
          />
          <Button onClick={addHashtag} disabled={hashtags.length >= 5}>
            Ajouter
          </Button>
        </div>
        <div className="flex flex-wrap gap-2">
          {hashtags.map((tag, idx) => (
            <Badge key={idx} variant="default" className="text-sm">
              {tag}
            </Badge>
          ))}
        </div>
        {hashtags.length < 3 && (
          <p className="text-xs text-yellow-600 dark:text-yellow-400">
            Minimum 3 hashtags requis
          </p>
        )}
      </Card>

      {/* Duration Section */}
      <Card className="p-4 space-y-3">
        <div className="flex items-center gap-2">
          <Clock className="w-5 h-5 text-primary" />
          <h3 className="font-bold">Durée: {duration[0]}s</h3>
        </div>
        <Slider
          value={duration}
          onValueChange={setDuration}
          min={5}
          max={60}
          step={5}
          className="w-full"
        />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>5s</span>
          <span className="text-primary font-bold">15-30s (optimal)</span>
          <span>60s</span>
        </div>
      </Card>

      {/* Engagement Hooks */}
      <Card className="p-4 space-y-3">
        <div className="flex items-center gap-2">
          <Zap className="w-5 h-5 text-primary" />
          <h3 className="font-bold">Hooks d'Engagement ({engagementHooks.length}/2+)</h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {availableHooks.map((hook) => {
            const isSelected = engagementHooks.includes(hook);
            return (
              <Button
                key={hook}
                variant={isSelected ? "default" : "outline"}
                onClick={() => toggleHook(hook)}
                className="justify-start"
              >
                {hook}
              </Button>
            );
          })}
        </div>
      </Card>

      {/* Trend Factor */}
      <Card className="p-4 space-y-3">
        <h3 className="font-bold">Facteur Tendance</h3>
        <div className="grid grid-cols-3 gap-2">
          {(["low", "medium", "high"] as const).map((level) => (
            <Button
              key={level}
              variant={trendFactor === level ? "default" : "outline"}
              onClick={() => setTrendFactor(level)}
              className="capitalize"
            >
              {level}
            </Button>
          ))}
        </div>
      </Card>

      {/* Preview */}
      <Card className="p-6 bg-gradient-to-br from-pink-500/20 to-cyan-500/20">
        <div className="text-center space-y-2">
          <div className="text-6xl">🎬</div>
          <div className="font-bold">Prévisualisation</div>
          <div className="text-sm text-muted-foreground">
            {duration[0]}s • {hashtags.length} hashtags • {engagementHooks.length} hooks
          </div>
          <Badge variant={viralScore >= 80 ? "default" : "secondary"} className="text-lg">
            {viralScore >= 80 ? "🔥 Viral!" : "📈 En cours..."}
          </Badge>
        </div>
      </Card>

      <Button
        onClick={handleSubmit}
        disabled={hashtags.length < 3 || engagementHooks.length < 2 || trendFactor !== "high"}
        className="w-full"
        size="lg"
      >
        Publier la Vidéo
      </Button>
    </div>
  );
};
