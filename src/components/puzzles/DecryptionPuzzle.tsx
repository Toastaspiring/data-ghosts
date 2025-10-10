import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Lock, Unlock } from "lucide-react";

interface DecryptionPuzzleProps {
  encryptedText: string;
  cipher: string;
  correctAnswer: string;
  onSolve: () => void;
}

export const DecryptionPuzzle = ({ encryptedText, cipher, correctAnswer, onSolve }: DecryptionPuzzleProps) => {
  const [decrypted, setDecrypted] = useState("");
  const [showHint, setShowHint] = useState(false);

  const rot13 = (str: string) => {
    return str.replace(/[a-zA-Z]/g, (char) => {
      const start = char <= 'Z' ? 65 : 97;
      return String.fromCharCode(((char.charCodeAt(0) - start + 13) % 26) + start);
    });
  };

  const applyDecryption = () => {
    if (cipher === "ROT13") {
      setDecrypted(rot13(encryptedText));
    }
  };

  const handleSubmit = () => {
    if (decrypted.toUpperCase().trim() === correctAnswer.toUpperCase().trim()) {
      onSolve();
    }
  };

  return (
    <div className="space-y-6 p-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold neon-cyan flex items-center justify-center gap-2">
          <Lock className="w-6 h-6" />
          Déchiffrement de Données
        </h2>
        <p className="text-muted-foreground">
          Déchiffrez le message encodé avec {cipher}
        </p>
      </div>

      <Card className="p-6 bg-red-950/20 border-red-500/30">
        <div className="flex items-center gap-2 mb-3">
          <Lock className="w-5 h-5 text-red-500" />
          <h3 className="font-bold">Texte Chiffré</h3>
        </div>
        <p className="font-mono text-lg break-all bg-black/30 p-4 rounded">
          {encryptedText}
        </p>
      </Card>

      <div className="flex gap-2">
        <Button
          onClick={applyDecryption}
          variant="outline"
          className="flex-1"
        >
          🔧 Appliquer {cipher}
        </Button>
        <Button
          onClick={() => setShowHint(true)}
          variant="ghost"
        >
          💡 Indice
        </Button>
      </div>

      {decrypted && (
        <Card className="p-6 bg-green-950/20 border-green-500/30 animate-fade-in">
          <div className="flex items-center gap-2 mb-3">
            <Unlock className="w-5 h-5 text-green-500" />
            <h3 className="font-bold">Texte Déchiffré</h3>
          </div>
          <p className="font-mono text-lg break-all bg-black/30 p-4 rounded">
            {decrypted}
          </p>
        </Card>
      )}

      {showHint && (
        <div className="bg-yellow-500/10 border border-yellow-500/50 rounded-lg p-4">
          <p className="text-yellow-600 dark:text-yellow-400 text-sm">
            💡 ROT13 est un chiffrement par substitution simple qui décale chaque lettre de 13 positions dans l'alphabet.
          </p>
        </div>
      )}

      <div className="space-y-3">
        <Input
          value={decrypted}
          onChange={(e) => setDecrypted(e.target.value)}
          placeholder="Entrez le texte déchiffré..."
          className="font-mono"
        />
        <Button
          onClick={handleSubmit}
          disabled={!decrypted}
          className="w-full"
          size="lg"
        >
          Valider le Déchiffrement
        </Button>
      </div>
    </div>
  );
};
