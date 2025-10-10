import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Key, Eye, StickyNote } from "lucide-react";

interface PasswordDiscoveryPuzzleProps {
  correctPassword: string;
  hints: string[];
  onSolve: () => void;
}

export const PasswordDiscoveryPuzzle = ({ correctPassword, hints, onSolve }: PasswordDiscoveryPuzzleProps) => {
  const [password, setPassword] = useState("");
  const [attempts, setAttempts] = useState(0);
  const [showPostIt, setShowPostIt] = useState(false);

  const handleSubmit = () => {
    setAttempts(attempts + 1);
    if (password.toLowerCase() === correctPassword.toLowerCase()) {
      onSolve();
    }
  };

  return (
    <div className="space-y-6 p-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold neon-cyan flex items-center justify-center gap-2">
          <Key className="w-6 h-6" />
          Découverte du Mot de Passe
        </h2>
        <p className="text-muted-foreground">
          Cherchez le mot de passe laissé par le monteur
        </p>
        {attempts > 0 && (
          <Badge variant="outline">Tentatives: {attempts}</Badge>
        )}
      </div>

      {/* Office Scene */}
      <Card className="p-6 bg-gradient-to-br from-gray-800 to-gray-900 relative overflow-hidden">
        <div className="text-center space-y-4">
          <div className="text-6xl mb-4">🖥️</div>
          <h3 className="font-bold text-white">Bureau du Monteur</h3>
          
          {/* Interactive elements */}
          <div className="grid grid-cols-2 gap-4 mt-4">
            <Button
              variant="outline"
              onClick={() => setShowPostIt(true)}
              className="h-24 bg-yellow-400/20 border-yellow-400 hover:bg-yellow-400/30"
            >
              <div className="text-center">
                <StickyNote className="w-6 h-6 mx-auto mb-2 text-yellow-400" />
                <span className="text-xs">Post-it sur l'écran</span>
              </div>
            </Button>

            <Button
              variant="outline"
              className="h-24 bg-blue-500/20 border-blue-500"
              disabled
            >
              <div className="text-center">
                <div className="text-2xl mb-2">⌨️</div>
                <span className="text-xs">Clavier</span>
              </div>
            </Button>

            <Button
              variant="outline"
              className="h-24 bg-purple-500/20 border-purple-500"
              disabled
            >
              <div className="text-center">
                <div className="text-2xl mb-2">📁</div>
                <span className="text-xs">Documents</span>
              </div>
            </Button>

            <Button
              variant="outline"
              className="h-24 bg-green-500/20 border-green-500"
              disabled
            >
              <div className="text-center">
                <div className="text-2xl mb-2">🔖</div>
                <span className="text-xs">Signets</span>
              </div>
            </Button>
          </div>
        </div>
      </Card>

      {/* Post-it Reveal */}
      {showPostIt && (
        <Card className="p-6 bg-yellow-400/20 border-2 border-yellow-400 animate-bounce">
          <div className="text-center space-y-2">
            <StickyNote className="w-8 h-8 mx-auto text-yellow-400" />
            <h3 className="font-bold">Post-it trouvé!</h3>
            <div className="p-4 bg-yellow-400/30 rounded-lg font-mono text-lg">
              {correctPassword}
            </div>
            <p className="text-sm text-muted-foreground">
              Le mot de passe est écrit sur le post-it !
            </p>
          </div>
        </Card>
      )}

      {/* Hints */}
      {!showPostIt && attempts > 0 && (
        <Card className="p-4 space-y-2">
          <h3 className="font-bold flex items-center gap-2">
            <Eye className="w-4 h-4" />
            Indices
          </h3>
          {hints.slice(0, attempts).map((hint, idx) => (
            <p key={idx} className="text-sm text-muted-foreground">
              💡 {hint}
            </p>
          ))}
        </Card>
      )}

      {/* Password Input */}
      <div className="space-y-3">
        <Input
          type="text"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Entrez le mot de passe..."
          className="text-center text-lg font-mono"
          onKeyPress={(e) => e.key === "Enter" && handleSubmit()}
        />
        <Button
          onClick={handleSubmit}
          disabled={!password}
          className="w-full"
          size="lg"
        >
          Valider le Mot de Passe
        </Button>
      </div>
    </div>
  );
};
