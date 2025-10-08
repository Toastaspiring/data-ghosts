import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Shield } from "lucide-react";

interface CaptchaPuzzleProps {
  captchaText: string;
  onSolve: () => void;
}

export const CaptchaPuzzle = ({ captchaText, onSolve }: CaptchaPuzzleProps) => {
  const [input, setInput] = useState("");

  const handleSubmit = () => {
    if (input.toUpperCase() === captchaText.toUpperCase()) {
      onSolve();
    }
  };

  return (
    <div className="bg-card border-2 border-primary/30 rounded-lg p-8 cartoon-shadow animate-fade-in-up">
      <div className="flex items-center gap-3 mb-6">
        <Shield className="w-8 h-8 text-primary animate-pulse-glow" />
        <h3 className="text-3xl font-bold neon-cyan font-mono">Captcha de Sécurité</h3>
      </div>
      
      <div className="bg-muted/50 border-2 border-dashed border-accent rounded-lg p-6 mb-6">
        <p className="text-5xl font-mono font-bold text-center tracking-widest neon-cyan select-none">
          {captchaText}
        </p>
      </div>

      <div className="space-y-4">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && handleSubmit()}
          placeholder="Entrez le code..."
          className="py-6 text-lg text-center font-mono bg-input border-2 border-border focus:border-primary"
          maxLength={captchaText.length}
        />
        <Button
          onClick={handleSubmit}
          disabled={!input.trim()}
          className="w-full py-6 text-lg font-mono bg-primary hover:bg-primary/90 animate-pulse-glow"
        >
          VÉRIFIER
        </Button>
      </div>
    </div>
  );
};
