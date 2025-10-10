import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ImageIcon, AlertTriangle } from "lucide-react";

interface BTSImage {
  filename: string;
  impact: "high" | "medium" | "low";
}

interface BTSPuzzleProps {
  images: BTSImage[];
  minImpact: "high" | "medium" | "low";
  targetCount: number;
  onSolve: () => void;
}

export const BTSPuzzle = ({ images, minImpact, targetCount, onSolve }: BTSPuzzleProps) => {
  const [selectedImages, setSelectedImages] = useState<BTSImage[]>([]);
  const [showHint, setShowHint] = useState(false);

  const toggleImage = (image: BTSImage) => {
    if (selectedImages.find(img => img.filename === image.filename)) {
      setSelectedImages(selectedImages.filter(img => img.filename !== image.filename));
    } else {
      setSelectedImages([...selectedImages, image]);
    }
  };

  const handleSubmit = () => {
    const highImpactCount = selectedImages.filter(img => img.impact === "high").length;
    if (highImpactCount >= targetCount) {
      onSolve();
    } else {
      setShowHint(true);
    }
  };

  const impactColors = {
    high: "destructive",
    medium: "default",
    low: "secondary",
  } as const;

  const imagePreview: Record<string, string> = {
    "greenscreen_setup.jpg": "🎬",
    "lighting_rig.jpg": "💡",
    "crew_visible.jpg": "👥",
    "script_notes.jpg": "📝",
    "fake_props.jpg": "🎭",
  };

  return (
    <div className="space-y-6 p-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold neon-cyan flex items-center justify-center gap-2">
          <ImageIcon className="w-6 h-6" />
          Révélation des Coulisses
        </h2>
        <p className="text-muted-foreground">
          Sélectionnez {targetCount} images à fort impact pour exposer la supercherie
        </p>
        <Badge variant="outline">
          Sélectionnées: {selectedImages.length} | Impact High: {selectedImages.filter(i => i.impact === "high").length}/{targetCount}
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {images.map((image) => {
          const isSelected = selectedImages.find(img => img.filename === image.filename);

          return (
            <Card
              key={image.filename}
              className={`p-4 cursor-pointer transition-all hover:scale-105 ${
                isSelected ? "border-primary border-2 bg-primary/10" : "border-border"
              }`}
              onClick={() => toggleImage(image)}
            >
              <div className="space-y-3">
                <div className="aspect-video bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg flex items-center justify-center text-6xl">
                  {imagePreview[image.filename]}
                </div>
                <div className="space-y-2">
                  <div className="font-medium text-sm truncate">{image.filename}</div>
                  <div className="flex items-center justify-between">
                    <Badge variant={impactColors[image.impact]}>
                      Impact: {image.impact.toUpperCase()}
                    </Badge>
                    {image.impact === "high" && (
                      <AlertTriangle className="w-4 h-4 text-red-500" />
                    )}
                  </div>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {showHint && (
        <div className="bg-yellow-500/10 border border-yellow-500/50 rounded-lg p-4 text-center">
          <p className="text-yellow-600 dark:text-yellow-400">
            💡 Vous devez sélectionner {targetCount} images avec un impact HIGH. Les images du green screen et de l'équipe sont les plus révélatrices !
          </p>
        </div>
      )}

      <Button
        onClick={handleSubmit}
        disabled={selectedImages.length < targetCount}
        className="w-full"
        size="lg"
      >
        Publier les Coulisses ({selectedImages.length} images)
      </Button>

      <div className="text-xs text-center text-muted-foreground space-y-1">
        <p>🎬 Green Screen Setup - Impact: HIGH</p>
        <p>👥 Crew Visible - Impact: HIGH</p>
        <p>💡 Lighting Rig - Impact: MEDIUM</p>
      </div>
    </div>
  );
};
