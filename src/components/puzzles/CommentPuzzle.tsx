import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { MessageSquare, Check, X } from "lucide-react";

interface CommentPuzzleProps {
  requiredWords: string[];
  targetCount: number;
  onSolve: () => void;
}

export const CommentPuzzle = ({ requiredWords, targetCount, onSolve }: CommentPuzzleProps) => {
  const [comments, setComments] = useState<string[]>([]);
  const [currentComment, setCurrentComment] = useState("");
  const [usedWords, setUsedWords] = useState<Set<string>>(new Set());

  const addComment = () => {
    if (currentComment.trim().length < 5) return;
    
    const newComments = [...comments, currentComment.trim()];
    setComments(newComments);
    
    // Update used words
    const allText = newComments.join(" ").toLowerCase();
    const newUsedWords = new Set<string>();
    requiredWords.forEach(word => {
      if (allText.includes(word.toLowerCase())) {
        newUsedWords.add(word);
      }
    });
    setUsedWords(newUsedWords);
    
    setCurrentComment("");
  };

  const handleSubmit = () => {
    const allWordsUsed = requiredWords.every(word => usedWords.has(word));
    if (comments.length >= targetCount && allWordsUsed) {
      onSolve();
    }
  };

  const isWordUsed = (word: string) => usedWords.has(word);
  const allWordsUsed = requiredWords.every(word => usedWords.has(word));

  return (
    <div className="space-y-6 p-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold neon-cyan flex items-center justify-center gap-2">
          <MessageSquare className="w-6 h-6" />
          Gestion des Commentaires
        </h2>
        <p className="text-muted-foreground">
          Écrivez {targetCount} commentaires négatifs en utilisant TOUS les mots requis
        </p>
        <div className="flex gap-2 justify-center">
          <Badge variant={comments.length >= targetCount ? "default" : "secondary"}>
            Commentaires: {comments.length}/{targetCount}
          </Badge>
          <Badge variant={allWordsUsed ? "default" : "destructive"}>
            Mots: {usedWords.size}/{requiredWords.length}
          </Badge>
        </div>
      </div>

      <Card className="p-4 space-y-3 bg-accent/10 border-accent/30">
        <h3 className="font-bold text-accent">Mots Requis (à utiliser TOUS)</h3>
        <div className="flex flex-wrap gap-2">
          {requiredWords.map((word, idx) => (
            <Badge
              key={idx}
              variant={isWordUsed(word) ? "default" : "outline"}
              className="text-sm"
            >
              {isWordUsed(word) ? <Check className="w-3 h-3 mr-1" /> : <X className="w-3 h-3 mr-1" />}
              {word}
            </Badge>
          ))}
        </div>
      </Card>

      <Card className="p-4 space-y-3">
        <h3 className="font-bold">Écrire un Commentaire</h3>
        <Textarea
          value={currentComment}
          onChange={(e) => setCurrentComment(e.target.value)}
          placeholder="Écrivez un commentaire négatif utilisant les mots requis..."
          className="min-h-24"
          maxLength={300}
        />
        <Button 
          onClick={addComment} 
          disabled={currentComment.trim().length < 5}
          className="w-full"
        >
          Ajouter Commentaire
        </Button>
      </Card>

      <Card className="p-4 bg-muted/50 max-h-60 overflow-y-auto">
        <h3 className="font-bold mb-3 sticky top-0 bg-muted/95 pb-2">
          Commentaires Écrits ({comments.length})
        </h3>
        <div className="space-y-2">
          {comments.map((comment, idx) => (
            <div key={idx} className="p-2 bg-card rounded text-sm border border-border">
              💬 {comment}
            </div>
          ))}
        </div>
      </Card>

      <Button
        onClick={handleSubmit}
        disabled={comments.length < targetCount || !allWordsUsed}
        className="w-full"
        size="lg"
      >
        Publier {comments.length} Commentaires
        {!allWordsUsed && " (Mots manquants!)"}
      </Button>
    </div>
  );
};
