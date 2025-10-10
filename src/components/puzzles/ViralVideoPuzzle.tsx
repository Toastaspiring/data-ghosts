import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Video, TrendingUp, AlertCircle, CheckCircle2 } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface ViralVideoPuzzleProps {
  requiredElements: {
    trending_hashtag: string;
    background_style: string;
    editing_trick: string;
  };
  onSolve: () => void;
}

interface ContentChoice {
  id: string;
  label: string;
  effectiveness: number; // Hidden score
  category: string;
}

export const ViralVideoPuzzle = ({ requiredElements, onSolve }: ViralVideoPuzzleProps) => {
  const [selectedStyle, setSelectedStyle] = useState<string>("");
  const [selectedHashtags, setSelectedHashtags] = useState<string[]>([]);
  const [selectedTransition, setSelectedTransition] = useState<string>("");
  const [selectedMusic, setSelectedMusic] = useState<string>("");
  const [selectedTiming, setSelectedTiming] = useState<string>("");
  const [submitted, setSubmitted] = useState(false);
  const [attempts, setAttempts] = useState(0);

  // Content options with hidden effectiveness scores
  const contentStyles: ContentChoice[] = [
    { id: "dance-challenge", label: "🕺 Dance Challenge", effectiveness: 85, category: "style" },
    { id: "product-review", label: "📦 Product Review", effectiveness: 45, category: "style" },
    { id: "life-hack", label: "💡 Life Hack Tutorial", effectiveness: 70, category: "style" },
    { id: "react-video", label: "😱 Reaction Video", effectiveness: 60, category: "style" },
    { id: "before-after", label: "✨ Before/After Transform", effectiveness: 90, category: "style" },
  ];

  const hashtagOptions: ContentChoice[] = [
    { id: "fyp", label: "#FYP", effectiveness: 75, category: "hashtag" },
    { id: "viral", label: "#Viral", effectiveness: 30, category: "hashtag" }, // Overused!
    { id: "trending", label: "#Trending2025", effectiveness: 85, category: "hashtag" },
    { id: "aesthetic", label: "#Aesthetic", effectiveness: 55, category: "hashtag" },
    { id: "motivation", label: "#MotivationMonday", effectiveness: 40, category: "hashtag" },
    { id: "funny", label: "#Funny", effectiveness: 70, category: "hashtag" },
  ];

  const transitionOptions: ContentChoice[] = [
    { id: "jump-cut", label: "✂️ Jump Cut", effectiveness: 50, category: "transition" },
    { id: "smooth-zoom", label: "🔍 Smooth Zoom", effectiveness: 80, category: "transition" },
    { id: "flash", label: "⚡ Flash Transition", effectiveness: 65, category: "transition" },
    { id: "spin", label: "🌀 360° Spin", effectiveness: 45, category: "transition" },
  ];

  const musicOptions: ContentChoice[] = [
    { id: "trending-sound", label: "🎵 Son Tendance (1.2M uses)", effectiveness: 90, category: "music" },
    { id: "popular-song", label: "🎧 Chanson Populaire (500K uses)", effectiveness: 60, category: "music" },
    { id: "original-audio", label: "🎤 Audio Original", effectiveness: 40, category: "music" },
    { id: "viral-remix", label: "🔥 Remix Viral (2M uses)", effectiveness: 50, category: "music" }, // Too saturated
  ];

  const timingOptions: ContentChoice[] = [
    { id: "morning", label: "🌅 Matin (6h-9h)", effectiveness: 55, category: "timing" },
    { id: "lunch", label: "🍽️ Midi (12h-14h)", effectiveness: 75, category: "timing" },
    { id: "evening", label: "🌆 Soir (18h-21h)", effectiveness: 90, category: "timing" },
    { id: "night", label: "🌙 Nuit (22h-2h)", effectiveness: 70, category: "timing" },
  ];

  const toggleHashtag = (id: string) => {
    if (selectedHashtags.includes(id)) {
      setSelectedHashtags(selectedHashtags.filter(h => h !== id));
    } else if (selectedHashtags.length < 3) {
      setSelectedHashtags([...selectedHashtags, id]);
    }
  };

  const calculateViralScore = () => {
    let score = 0;
    
    const style = contentStyles.find(s => s.id === selectedStyle);
    if (style) score += style.effectiveness * 0.3;
    
    selectedHashtags.forEach(hashtagId => {
      const hashtag = hashtagOptions.find(h => h.id === hashtagId);
      if (hashtag) score += (hashtag.effectiveness / 3) * 0.25;
    });
    
    const transition = transitionOptions.find(t => t.id === selectedTransition);
    if (transition) score += transition.effectiveness * 0.15;
    
    const music = musicOptions.find(m => m.id === selectedMusic);
    if (music) score += music.effectiveness * 0.2;
    
    const timing = timingOptions.find(t => t.id === selectedTiming);
    if (timing) score += timing.effectiveness * 0.1;
    
    return Math.floor(score);
  };

  const handleSubmit = () => {
    if (!selectedStyle || selectedHashtags.length < 3 || !selectedTransition || !selectedMusic || !selectedTiming) {
      return;
    }
    
    setSubmitted(true);
    setAttempts(prev => prev + 1);
    
    const score = calculateViralScore();
    if (score >= 75) {
      setTimeout(onSolve, 2000);
    }
  };

  const handleReset = () => {
    setSubmitted(false);
  };

  const currentScore = submitted ? calculateViralScore() : 0;
  const isSuccess = currentScore >= 75;
  const canSubmit = selectedStyle && selectedHashtags.length === 3 && selectedTransition && selectedMusic && selectedTiming;

  return (
    <div className="space-y-6 p-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold neon-cyan flex items-center justify-center gap-2">
          <Video className="w-6 h-6" />
          Création Vidéo Virale
        </h2>
        <p className="text-muted-foreground text-sm">
          Combinez les bons éléments pour créer une vidéo virale
        </p>
        <Badge variant="outline">
          Tentatives: {attempts}/5
        </Badge>
      </div>

      {/* Style de Contenu */}
      <Card className="p-4 space-y-3">
        <h3 className="font-bold text-sm">Style de Contenu</h3>
        <Select value={selectedStyle} onValueChange={setSelectedStyle} disabled={submitted}>
          <SelectTrigger>
            <SelectValue placeholder="Choisir un style..." />
          </SelectTrigger>
          <SelectContent>
            {contentStyles.map(style => (
              <SelectItem key={style.id} value={style.id}>
                {style.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </Card>

      {/* Hashtags */}
      <Card className="p-4 space-y-3">
        <h3 className="font-bold text-sm">Hashtags (sélectionnez 3)</h3>
        <div className="grid grid-cols-2 gap-2">
          {hashtagOptions.map(hashtag => {
            const isSelected = selectedHashtags.includes(hashtag.id);
            return (
              <Button
                key={hashtag.id}
                variant={isSelected ? "default" : "outline"}
                size="sm"
                onClick={() => toggleHashtag(hashtag.id)}
                disabled={submitted || (!isSelected && selectedHashtags.length >= 3)}
                className="text-xs justify-start"
              >
                {hashtag.label}
              </Button>
            );
          })}
        </div>
        <p className="text-xs text-muted-foreground">
          💡 Astuce: Les hashtags les plus utilisés ne sont pas toujours les meilleurs
        </p>
      </Card>

      {/* Transition */}
      <Card className="p-4 space-y-3">
        <h3 className="font-bold text-sm">Transition Vidéo</h3>
        <Select value={selectedTransition} onValueChange={setSelectedTransition} disabled={submitted}>
          <SelectTrigger>
            <SelectValue placeholder="Choisir une transition..." />
          </SelectTrigger>
          <SelectContent>
            {transitionOptions.map(transition => (
              <SelectItem key={transition.id} value={transition.id}>
                {transition.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </Card>

      {/* Musique */}
      <Card className="p-4 space-y-3">
        <h3 className="font-bold text-sm">Audio / Musique</h3>
        <Select value={selectedMusic} onValueChange={setSelectedMusic} disabled={submitted}>
          <SelectTrigger>
            <SelectValue placeholder="Choisir un audio..." />
          </SelectTrigger>
          <SelectContent>
            {musicOptions.map(music => (
              <SelectItem key={music.id} value={music.id}>
                {music.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <p className="text-xs text-muted-foreground">
          💡 Le son le plus viral n'est pas toujours celui avec le plus d'utilisations
        </p>
      </Card>

      {/* Timing */}
      <Card className="p-4 space-y-3">
        <h3 className="font-bold text-sm">Heure de Publication</h3>
        <div className="grid grid-cols-2 gap-2">
          {timingOptions.map(timing => {
            const isSelected = selectedTiming === timing.id;
            return (
              <Button
                key={timing.id}
                variant={isSelected ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedTiming(timing.id)}
                disabled={submitted}
                className="text-xs"
              >
                {timing.label}
              </Button>
            );
          })}
        </div>
      </Card>

      {/* Feedback après soumission */}
      {submitted && (
        <Card className={`p-6 ${isSuccess ? 'bg-green-500/10 border-green-500' : 'bg-destructive/10 border-destructive'}`}>
          <div className="space-y-3">
            <div className="flex items-center gap-2 justify-center">
              {isSuccess ? (
                <>
                  <CheckCircle2 className="w-6 h-6 text-green-500" />
                  <span className="font-bold text-green-500 text-lg">🔥 Vidéo Virale !</span>
                </>
              ) : (
                <>
                  <AlertCircle className="w-6 h-6 text-destructive" />
                  <span className="font-bold text-destructive text-lg">📉 Échec Viral</span>
                </>
              )}
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">{currentScore}/100</div>
              <div className="text-sm text-muted-foreground">
                {isSuccess 
                  ? "Votre vidéo explose ! Les influenceurs sont détrônés." 
                  : "Score insuffisant (minimum 75). Analysez vos choix et réessayez."}
              </div>
            </div>
            
            {!isSuccess && (
              <div className="text-xs space-y-1 text-muted-foreground text-center">
                <p>💡 Conseil: Cherchez l'équilibre, pas les extrêmes</p>
                <p>🎯 Les tendances saturées sont moins efficaces</p>
              </div>
            )}
          </div>
        </Card>
      )}

      <div className="flex gap-2">
        <Button
          onClick={handleSubmit}
          disabled={!canSubmit || submitted}
          className="flex-1"
          size="lg"
        >
          <TrendingUp className="w-4 h-4 mr-2" />
          Publier la Vidéo
        </Button>
        
        {submitted && !isSuccess && attempts < 5 && (
          <Button
            onClick={handleReset}
            variant="outline"
            size="lg"
          >
            Réessayer
          </Button>
        )}
      </div>
    </div>
  );
};
