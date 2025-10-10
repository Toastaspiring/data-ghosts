import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, CheckCircle, TrendingUp, Users, Eye } from "lucide-react";

interface EngagementData {
  account: string;
  followers: number;
  avgViews: number;
  avgLikes: number;
  avgComments: number;
  isFake: boolean;
  reason?: string;
}

interface EngagementPatternPuzzleProps {
  accounts: EngagementData[];
  onSolve: () => void;
}

export const EngagementPatternPuzzle = ({ accounts = [], onSolve }: EngagementPatternPuzzleProps) => {
  const [selectedAccounts, setSelectedAccounts] = useState<Set<number>>(new Set());
  const [submitted, setSubmitted] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);

  if (!accounts.length) {
    return <div className="p-6 text-center text-muted-foreground">Chargement du puzzle...</div>;
  }

  const toggleAccount = (index: number) => {
    if (submitted) return;
    
    const newSelected = new Set(selectedAccounts);
    if (newSelected.has(index)) {
      newSelected.delete(index);
    } else {
      newSelected.add(index);
    }
    setSelectedAccounts(newSelected);
  };

  const handleSubmit = () => {
    setSubmitted(true);
    setShowFeedback(true);

    const correctSelections = accounts
      .map((acc, idx) => ({ ...acc, idx }))
      .filter(acc => acc.isFake)
      .map(acc => acc.idx);

    const isCorrect = 
      correctSelections.every(idx => selectedAccounts.has(idx)) &&
      selectedAccounts.size === correctSelections.length;

    if (isCorrect) {
      setTimeout(() => onSolve(), 1500);
    }
  };

  const handleReset = () => {
    setSubmitted(false);
    setShowFeedback(false);
  };

  const calculateEngagementRate = (account: EngagementData) => {
    return ((account.avgLikes + account.avgComments) / account.avgViews * 100).toFixed(2);
  };

  const correctCount = Array.from(selectedAccounts).filter(idx => accounts[idx].isFake).length;
  const isSuccess = correctCount === accounts.filter(a => a.isFake).length && 
                    selectedAccounts.size === accounts.filter(a => a.isFake).length;

  return (
    <div className="space-y-6 p-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold neon-cyan flex items-center justify-center gap-2">
          <TrendingUp className="w-6 h-6 text-yellow-500" />
          Détection d'Engagement Gonflé
        </h2>
        <p className="text-muted-foreground text-sm">
          Identifiez les comptes avec des métriques d'engagement suspectes
        </p>
        <Badge variant="outline">
          Sélectionnés: {selectedAccounts.size}
        </Badge>
      </div>

      <div className="grid gap-4">
        {accounts.map((account, idx) => {
          const isSelected = selectedAccounts.has(idx);
          const isCorrect = submitted && account.isFake === isSelected;
          const engagementRate = calculateEngagementRate(account);

          return (
            <Card
              key={idx}
              className={`p-4 cursor-pointer transition-all ${
                isSelected && !submitted
                  ? "border-2 border-primary bg-primary/10"
                  : submitted && isCorrect && account.isFake
                  ? "border-2 border-green-500 bg-green-500/10"
                  : submitted && !isCorrect
                  ? "border-2 border-destructive bg-destructive/10"
                  : "border-border hover:border-primary/50"
              }`}
              onClick={() => toggleAccount(idx)}
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <h3 className="font-bold text-lg glitch-text">{account.account}</h3>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Users className="w-4 h-4" />
                      {account.followers.toLocaleString()} abonnés
                    </div>
                  </div>
                  {isSelected && !submitted && (
                    <Badge variant="destructive">
                      <AlertTriangle className="w-3 h-3 mr-1" />
                      Suspect
                    </Badge>
                  )}
                  {isSuccess && account.isFake && (
                    <Badge variant="destructive">
                      FAKE
                    </Badge>
                  )}
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                  <div className="space-y-1">
                    <div className="text-muted-foreground text-xs">Vues Moy.</div>
                    <div className="font-bold flex items-center gap-1">
                      <Eye className="w-3 h-3" />
                      {account.avgViews.toLocaleString()}
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-muted-foreground text-xs">Likes Moy.</div>
                    <div className="font-bold">❤️ {account.avgLikes.toLocaleString()}</div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-muted-foreground text-xs">Comments Moy.</div>
                    <div className="font-bold">💬 {account.avgComments.toLocaleString()}</div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-muted-foreground text-xs">Taux Engagement</div>
                    <div className="font-bold text-primary">{engagementRate}%</div>
                  </div>
                </div>

                {isSuccess && account.isFake && account.reason && (
                  <div className="pt-3 border-t border-border text-xs text-red-400">
                    🔍 {account.reason}
                  </div>
                )}
              </div>
            </Card>
          );
        })}
      </div>

      {showFeedback && (
        <Card className={`p-4 ${isSuccess ? 'bg-green-500/10 border-green-500' : 'bg-destructive/10 border-destructive'}`}>
          <div className="text-center space-y-2">
            {isSuccess ? (
              <>
                <CheckCircle className="w-12 h-12 text-green-500 mx-auto" />
                <p className="font-bold text-green-500 text-lg">
                  Parfait ! Vous avez identifié tous les comptes fake !
                </p>
                <p className="text-xs text-muted-foreground">
                  Leur supercherie est exposée au grand jour.
                </p>
              </>
            ) : (
              <>
                <AlertTriangle className="w-12 h-12 text-red-400 mx-auto" />
                <p className="font-bold text-destructive text-lg">
                  {correctCount} sur {accounts.filter(a => a.isFake).length} comptes fake détectés
                </p>
                <p className="text-xs text-muted-foreground">
                  💡 Indice: Regardez les ratios entre vues, likes et commentaires
                </p>
              </>
            )}
          </div>
        </Card>
      )}

      <div className="flex gap-2">
        <Button
          onClick={handleSubmit}
          disabled={selectedAccounts.size === 0 || submitted}
          className="flex-1"
          size="lg"
        >
          Valider la Sélection
        </Button>
        
        {submitted && !isSuccess && (
          <Button
            onClick={handleReset}
            variant="outline"
            size="lg"
          >
            Réessayer
          </Button>
        )}
      </div>

      <div className="text-xs text-center text-muted-foreground space-y-1">
        <p>💡 Un taux d'engagement anormalement élevé peut être suspect</p>
        <p>⚠️ Ratio likes/vues &gt; 50% = probablement des bots</p>
        <p>🔍 Beaucoup de vues mais peu de commentaires = achat de vues</p>
      </div>

      <style>{`
        .glitch-text {
          position: relative;
          animation: glitch 3s infinite;
          display: inline-block;
        }

        @keyframes glitch {
          0%, 92%, 100% {
            transform: translate(0);
            filter: blur(0);
            text-shadow: none;
          }
          93% {
            transform: translate(-1px, 1px);
            filter: blur(0.3px);
            text-shadow: 1px 0 rgba(255, 0, 80, 0.4), -1px 0 rgba(37, 244, 238, 0.4);
          }
          94% {
            transform: translate(1px, -1px);
            filter: blur(0.3px);
            text-shadow: -1px 0 rgba(255, 0, 80, 0.4), 1px 0 rgba(37, 244, 238, 0.4);
          }
        }
      `}</style>
    </div>
  );
};