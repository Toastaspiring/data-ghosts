import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Shield, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface CaptchaImage {
  src: string;
  isTarget: boolean;
}

interface CaptchaPuzzleProps {
  images?: CaptchaImage[];
  instruction?: string;
  onSolve: () => void;
}

export const CaptchaPuzzle = ({ 
  images = [], 
  instruction = "Sélectionnez toutes les images correspondantes",
  onSolve 
}: CaptchaPuzzleProps) => {
  const [selectedIndices, setSelectedIndices] = useState<number[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  const handleImageClick = (index: number) => {
    if (submitted) return;
    
    setSelectedIndices(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  const handleSubmit = () => {
    setSubmitted(true);
    
    // Check if selected images match target images
    const correctIndices = images
      .map((img, idx) => img.isTarget ? idx : -1)
      .filter(idx => idx !== -1);
    
    const isValid = 
      selectedIndices.length === correctIndices.length &&
      selectedIndices.every(idx => correctIndices.includes(idx));
    
    setIsCorrect(isValid);
    
    if (isValid) {
      setTimeout(() => onSolve(), 1000);
    } else {
      setTimeout(() => {
        setSubmitted(false);
        setSelectedIndices([]);
      }, 2000);
    }
  };

  return (
    <div className="bg-card border-2 border-primary/30 rounded-lg p-8 cartoon-shadow animate-fade-in-up">
      <div className="flex items-center gap-3 mb-6">
        <Shield className="w-8 h-8 text-primary animate-pulse-glow" />
        <h3 className="text-2xl font-bold neon-cyan font-mono">Captcha de Sécurité</h3>
      </div>
      
      <div className="mb-6">
        <p className="text-lg font-semibold text-center mb-4">
          {instruction}
        </p>
      </div>

      {/* Image Grid */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {images.map((image, index) => (
          <Card
            key={index}
            className={cn(
              "relative aspect-square cursor-pointer transition-all duration-300 overflow-hidden",
              "border-2 hover:scale-105",
              selectedIndices.includes(index) && !submitted && "border-primary ring-4 ring-primary/30",
              submitted && image.isTarget && selectedIndices.includes(index) && "border-green-500 ring-4 ring-green-500/30",
              submitted && !image.isTarget && selectedIndices.includes(index) && "border-red-500 ring-4 ring-red-500/30",
              submitted && "cursor-not-allowed"
            )}
            onClick={() => handleImageClick(index)}
          >
            <div className="w-full h-full bg-muted flex items-center justify-center">
              {/* Placeholder for images - in real implementation, use actual images */}
              <div className="text-6xl opacity-50">
                {image.isTarget ? "🚗" : "🌳"}
              </div>
            </div>
            
            {/* Selection indicator */}
            {selectedIndices.includes(index) && (
              <div className={cn(
                "absolute top-2 right-2 w-8 h-8 rounded-full flex items-center justify-center",
                submitted 
                  ? image.isTarget 
                    ? "bg-green-500" 
                    : "bg-red-500"
                  : "bg-primary"
              )}>
                <CheckCircle className="w-5 h-5 text-background" />
              </div>
            )}
          </Card>
        ))}
      </div>

      {/* Submit Button */}
      <div className="space-y-4">
        {submitted && (
          <div className={cn(
            "text-center font-semibold py-2 px-4 rounded-lg",
            isCorrect ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"
          )}>
            {isCorrect ? "✓ Correct ! Accès autorisé..." : "✗ Incorrect. Réessayez..."}
          </div>
        )}
        
        <Button
          onClick={handleSubmit}
          disabled={selectedIndices.length === 0 || submitted}
          className="w-full py-6 text-lg font-mono bg-primary hover:bg-primary/90 animate-pulse-glow"
        >
          VÉRIFIER
        </Button>
      </div>
    </div>
  );
};
