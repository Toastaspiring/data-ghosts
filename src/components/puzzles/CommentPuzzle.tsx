import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, Copy } from "lucide-react";

interface CommentPuzzleProps {
  templates: string[];
  targetCount: number;
  onSolve: () => void;
}

export const CommentPuzzle = ({ templates, targetCount, onSolve }: CommentPuzzleProps) => {
  const [comments, setComments] = useState<string[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState(0);

  const variations = [
    "", "!!!", "???", " 😂", " 🤡", " smh", " fr fr", " no cap"
  ];

  const generateComment = () => {
    const template = templates[selectedTemplate];
    const variation = variations[Math.floor(Math.random() * variations.length)];
    const newComment = template + variation;
    setComments([...comments, newComment]);
  };

  const generateBatch = () => {
    const newComments = [];
    for (let i = 0; i < 10; i++) {
      const template = templates[Math.floor(Math.random() * templates.length)];
      const variation = variations[Math.floor(Math.random() * variations.length)];
      newComments.push(template + variation);
    }
    setComments([...comments, ...newComments]);
  };

  const handleSubmit = () => {
    if (comments.length >= targetCount) {
      onSolve();
    }
  };

  return (
    <div className="space-y-6 p-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold neon-cyan flex items-center justify-center gap-2">
          <MessageSquare className="w-6 h-6" />
          Gestion des Commentaires
        </h2>
        <p className="text-muted-foreground">
          Générez {targetCount} commentaires négatifs pour ruiner leur réputation
        </p>
        <Badge variant={comments.length >= targetCount ? "default" : "secondary"}>
          Commentaires: {comments.length}/{targetCount}
        </Badge>
      </div>

      <Card className="p-4 space-y-3">
        <h3 className="font-bold">Templates de Commentaires</h3>
        <div className="grid gap-2">
          {templates.map((template, idx) => (
            <Button
              key={idx}
              variant={selectedTemplate === idx ? "default" : "outline"}
              onClick={() => setSelectedTemplate(idx)}
              className="justify-start text-left h-auto py-2"
            >
              {template}
            </Button>
          ))}
        </div>
      </Card>

      <div className="flex gap-2">
        <Button onClick={generateComment} className="flex-1">
          <Copy className="w-4 h-4 mr-2" />
          Générer 1
        </Button>
        <Button onClick={generateBatch} variant="secondary" className="flex-1">
          Générer x10
        </Button>
      </div>

      <Card className="p-4 bg-muted/50 max-h-60 overflow-y-auto">
        <h3 className="font-bold mb-3 sticky top-0 bg-muted/95 pb-2">
          Commentaires Générés ({comments.length})
        </h3>
        <div className="space-y-2">
          {comments.slice(-20).map((comment, idx) => (
            <div key={idx} className="p-2 bg-card rounded text-sm border border-border">
              💬 {comment}
            </div>
          ))}
        </div>
      </Card>

      <Button
        onClick={handleSubmit}
        disabled={comments.length < targetCount}
        className="w-full"
        size="lg"
      >
        Publier {comments.length} Commentaires Négatifs
      </Button>
    </div>
  );
};
