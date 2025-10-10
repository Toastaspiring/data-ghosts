import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Eye, Bot, User, CheckCircle, XCircle } from "lucide-react";

interface Account {
  id: number;
  username: string;
  watchTime: string;
  engagement: string;
  location: string;
  device: string;
  isBot: boolean;
}

interface ViewAnalysisPuzzleProps {
  totalViews: number;
  botThreshold: number;
  onSolve: () => void;
}

export const ViewAnalysisPuzzle = ({ totalViews, botThreshold, onSolve }: ViewAnalysisPuzzleProps) => {
  const [selectedBots, setSelectedBots] = useState<Set<number>>(new Set());
  const [submitted, setSubmitted] = useState(false);
  const [showResults, setShowResults] = useState(false);

  // Generate accounts - mix of real and bot accounts
  const [accounts] = useState<Account[]>([
    { id: 1, username: "user_8547", watchTime: "2s", engagement: "0%", location: "Mumbai, India", device: "Android 12", isBot: true },
    { id: 2, username: "sarah_martin", watchTime: "45s", engagement: "5.2%", location: "Paris, France", device: "iPhone 14", isBot: false },
    { id: 3, username: "bot_3429", watchTime: "1s", engagement: "0.1%", location: "Mumbai, India", device: "Android 12", isBot: true },
    { id: 4, username: "alex_jones22", watchTime: "38s", engagement: "3.8%", location: "London, UK", device: "Samsung S23", isBot: false },
    { id: 5, username: "view_2847", watchTime: "3s", engagement: "0%", location: "Mumbai, India", device: "Android 12", isBot: true },
    { id: 6, username: "maria_silva", watchTime: "52s", engagement: "6.1%", location: "São Paulo, Brazil", device: "iPhone 13", isBot: false },
    { id: 7, username: "guest_5892", watchTime: "2s", engagement: "0.2%", location: "Mumbai, India", device: "Android 12", isBot: true },
    { id: 8, username: "john_smith91", watchTime: "41s", engagement: "4.5%", location: "New York, USA", device: "iPhone 15", isBot: false },
    { id: 9, username: "acc_9234", watchTime: "1s", engagement: "0%", location: "Delhi, India", device: "Android 11", isBot: true },
    { id: 10, username: "emma_white", watchTime: "48s", engagement: "5.8%", location: "Toronto, Canada", device: "Pixel 8", isBot: false },
  ]);

  const toggleBot = (id: number) => {
    if (submitted) return;
    const newSelected = new Set(selectedBots);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedBots(newSelected);
  };

  const handleSubmit = () => {
    setSubmitted(true);
    setShowResults(true);
    
    // Check if correctly identified bots
    const correctBots = accounts.filter(acc => acc.isBot).map(acc => acc.id);
    const correctlyIdentified = correctBots.filter(id => selectedBots.has(id)).length;
    const accuracy = (correctlyIdentified / correctBots.length) * 100;
    
    if (accuracy >= 80) { // Need 80% accuracy (4 out of 5 bots)
      setTimeout(() => onSolve(), 1500);
    }
  };

  const getAccountStatus = (account: Account) => {
    if (!showResults) return null;
    const selected = selectedBots.has(account.id);
    if (account.isBot && selected) return "correct";
    if (!account.isBot && !selected) return "correct";
    if (account.isBot && !selected) return "missed";
    return "wrong";
  };

  const correctBots = accounts.filter(acc => acc.isBot).length;
  const correctlySelected = accounts.filter(acc => acc.isBot && selectedBots.has(acc.id)).length;

  return (
    <div className="space-y-6 p-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold neon-cyan flex items-center justify-center gap-2">
          <Eye className="w-6 h-6" />
          Détection de Comptes Bots
        </h2>
        <p className="text-muted-foreground">
          Identifiez les comptes suspects parmi les viewers
        </p>
        <div className="flex gap-2 justify-center">
          <Badge variant="outline">
            Total: {totalViews.toLocaleString()} vues
          </Badge>
          <Badge variant={correctlySelected >= 4 ? "default" : "destructive"}>
            Bots trouvés: {correctlySelected}/{correctBots}
          </Badge>
        </div>
      </div>

      <Card className="p-4 bg-accent/10 border-accent/30 space-y-2">
        <h3 className="font-bold text-accent">🔍 Indices pour détecter les bots:</h3>
        <ul className="text-sm space-y-1 text-muted-foreground">
          <li>• Temps de visionnage très court (&lt;5s)</li>
          <li>• Engagement quasi nul (0-0.2%)</li>
          <li>• Localisation répétitive</li>
          <li>• Noms génériques (user_XXXX, bot_XXXX)</li>
        </ul>
      </Card>

      <div className="space-y-2 max-h-96 overflow-y-auto">
        {accounts.map((account) => {
          const isSelected = selectedBots.has(account.id);
          const status = getAccountStatus(account);
          
          return (
            <Card
              key={account.id}
              className={`p-4 cursor-pointer transition-all ${
                isSelected ? "border-primary bg-primary/10" : "hover:border-primary/50"
              } ${
                status === "correct" ? "border-green-500 bg-green-500/10" :
                status === "wrong" ? "border-red-500 bg-red-500/10" :
                status === "missed" ? "border-yellow-500 bg-yellow-500/10" : ""
              }`}
              onClick={() => toggleBot(account.id)}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-2">
                    {showResults && account.isBot ? <Bot className="w-4 h-4 text-red-500" /> : <User className="w-4 h-4" />}
                    <span className="font-bold">{account.username}</span>
                    {isSelected && !showResults && <CheckCircle className="w-4 h-4 text-primary" />}
                    {showResults && status === "correct" && <CheckCircle className="w-4 h-4 text-green-500" />}
                    {showResults && status === "wrong" && <XCircle className="w-4 h-4 text-red-500" />}
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                    <div>⏱️ Temps: {account.watchTime}</div>
                    <div>📊 Engagement: {account.engagement}</div>
                    <div>📍 {account.location}</div>
                    <div>📱 {account.device}</div>
                  </div>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {showResults && (
        <Card className="p-4 bg-muted/50 text-center">
          <p className="font-bold">
            Précision: {Math.round((correctlySelected / correctBots) * 100)}%
          </p>
          {correctlySelected >= 4 ? (
            <p className="text-green-500">✅ Fraude exposée avec succès!</p>
          ) : (
            <p className="text-red-500">❌ Pas assez de bots identifiés (min 80%)</p>
          )}
        </Card>
      )}

      <Button
        onClick={handleSubmit}
        disabled={submitted || selectedBots.size === 0}
        className="w-full"
        size="lg"
      >
        {submitted ? "Analyse Terminée" : `Exposer ${selectedBots.size} Compte(s) Bot`}
      </Button>
    </div>
  );
};
