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
    <div className="bg-card rounded-3xl p-8 cartoon-shadow">
      <div className="flex items-center gap-3 mb-6">
        <Shield className="w-8 h-8 text-primary" />
        <h3 className="text-2xl font-bold text-foreground">Captcha de Sécurité</h3>
      </div>
      
      <div className="bg-accent/10 rounded-2xl p-6 mb-6 border-2 border-dashed border-accent">
        <p className="text-4xl font-mono font-bold text-center tracking-widest text-foreground select-none">
          {captchaText}
        </p>
      </div>

      <div className="space-y-4">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && handleSubmit()}
          placeholder="Entrez le code..."
          className="rounded-xl py-6 text-lg text-center font-mono"
          maxLength={captchaText.length}
        />
        <Button
          onClick={handleSubmit}
          disabled={!input.trim()}
          className="w-full rounded-xl py-6 text-lg"
        >
          Vérifier
        </Button>
      </div>
    </div>
  );
};
