import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Users, Zap, TrendingDown, AlertTriangle, Link2Off, Brain, Calculator, Target } from "lucide-react";
import { toast } from "sonner";

interface Influencer {
  id: number;
  name: string;
  followers: number;
  influence: number;
  connections: number[];
  isIsolated: boolean;
  cascadeMultiplier: number;
  viralCoefficient: number; // New: affects viral spread
  contentType: string; // New: determines interaction rules
  algorithmWeight: number; // New: affects recommendation algorithm
}

interface Connection {
  from: number;
  to: number;
  strength: number;
  broken: boolean;
  contentSynergy: number; // New: bonus when content types match
  crossPromotion: boolean; // New: affects algorithm boost
}

interface AlgorithmState {
  engagement_bias: number;
  content_diversity: number;
  network_centrality: number;
  viral_threshold: number;
}

interface InfluencerNetworkPuzzleProps {
  targetIsolation: number;
  maxMoves: number;
  timeLimit: number;
  onSolve: () => void;
}

export const InfluencerNetworkPuzzle = ({
  targetIsolation,
  maxMoves,
  timeLimit,
  onSolve
}: InfluencerNetworkPuzzleProps) => {
  const [influencers, setInfluencers] = useState<Influencer[]>([
    { 
      id: 1, 
      name: "@FashionQueen", 
      followers: 2500000, 
      influence: 95, 
      connections: [2, 3, 4], 
      isIsolated: false, 
      cascadeMultiplier: 1.5,
      viralCoefficient: 0.8,
      contentType: "Fashion",
      algorithmWeight: 0.9
    },
    { 
      id: 2, 
      name: "@TechGuru", 
      followers: 1800000, 
      influence: 85, 
      connections: [1, 3, 5, 6], 
      isIsolated: false, 
      cascadeMultiplier: 1.2,
      viralCoefficient: 0.6,
      contentType: "Tech",
      algorithmWeight: 0.7
    },
    { 
      id: 3, 
      name: "@FitnessKing", 
      followers: 3200000, 
      influence: 98, 
      connections: [1, 2, 4, 5], 
      isIsolated: false, 
      cascadeMultiplier: 1.8,
      viralCoefficient: 0.9,
      contentType: "Fitness",
      algorithmWeight: 0.85
    },
    { 
      id: 4, 
      name: "@FoodieLife", 
      followers: 1500000, 
      influence: 75, 
      connections: [1, 3, 6], 
      isIsolated: false, 
      cascadeMultiplier: 1.0,
      viralCoefficient: 0.7,
      contentType: "Food",
      algorithmWeight: 0.6
    },
    { 
      id: 5, 
      name: "@TravelVibes", 
      followers: 2100000, 
      influence: 88, 
      connections: [2, 3, 6], 
      isIsolated: false, 
      cascadeMultiplier: 1.3,
      viralCoefficient: 0.85,
      contentType: "Travel",
      algorithmWeight: 0.75
    },
    { 
      id: 6, 
      name: "@ComedyCentral", 
      followers: 2800000, 
      influence: 92, 
      connections: [2, 4, 5], 
      isIsolated: false, 
      cascadeMultiplier: 1.4,
      viralCoefficient: 0.95,
      contentType: "Comedy",
      algorithmWeight: 0.8
    }
  ]);

  const [connections, setConnections] = useState<Connection[]>([
    { from: 1, to: 2, strength: 80, broken: false, contentSynergy: 0.3, crossPromotion: false },
    { from: 1, to: 3, strength: 90, broken: false, contentSynergy: 0.4, crossPromotion: true },
    { from: 1, to: 4, strength: 70, broken: false, contentSynergy: 0.6, crossPromotion: false },
    { from: 2, to: 3, strength: 85, broken: false, contentSynergy: 0.2, crossPromotion: true },
    { from: 2, to: 5, strength: 75, broken: false, contentSynergy: 0.5, crossPromotion: false },
    { from: 2, to: 6, strength: 78, broken: false, contentSynergy: 0.1, crossPromotion: true },
    { from: 3, to: 4, strength: 82, broken: false, contentSynergy: 0.5, crossPromotion: false },
    { from: 3, to: 5, strength: 88, broken: false, contentSynergy: 0.7, crossPromotion: true },
    { from: 4, to: 6, strength: 72, broken: false, contentSynergy: 0.4, crossPromotion: false },
    { from: 5, to: 6, strength: 80, broken: false, contentSynergy: 0.3, crossPromotion: true }
  ]);

  const [algorithmState, setAlgorithmState] = useState<AlgorithmState>({
    engagement_bias: 0.7,
    content_diversity: 0.6,
    network_centrality: 0.8,
    viral_threshold: 0.75
  });

  const [movesLeft, setMovesLeft] = useState(maxMoves);
  const [selectedConnection, setSelectedConnection] = useState<number | null>(null);
  const [timeRemaining, setTimeRemaining] = useState(timeLimit);
  const [gameOver, setGameOver] = useState(false);
  const [showCascade, setShowCascade] = useState<number[]>([]);
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [currentPhase, setCurrentPhase] = useState<'analysis' | 'action'>('analysis');

  useEffect(() => {
    if (timeRemaining <= 0 || gameOver) return;
    
    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          setGameOver(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeRemaining, gameOver]);

  // New: Complex algorithm calculation
  const calculateViralPotential = () => {
    let totalViral = 0;
    influencers.forEach(inf => {
      if (inf.isIsolated) return;
      
      const activeConnections = connections.filter(
        c => !c.broken && (c.from === inf.id || c.to === inf.id)
      );
      
      const networkBoost = activeConnections.reduce((sum, conn) => {
        const partner = influencers.find(p => 
          p.id === (conn.from === inf.id ? conn.to : conn.from)
        );
        if (!partner) return sum;
        
        const synergyBonus = conn.contentSynergy * 0.5;
        const crossPromoBonus = conn.crossPromotion ? 0.3 : 0;
        const algorithmBonus = partner.algorithmWeight * algorithmState.content_diversity;
        
        return sum + (conn.strength / 100) * (1 + synergyBonus + crossPromoBonus + algorithmBonus);
      }, 0);
      
      const centralityScore = (activeConnections.length / inf.connections.length) * algorithmState.network_centrality;
      const viralScore = inf.viralCoefficient * inf.influence * (1 + networkBoost) * centralityScore * algorithmState.engagement_bias;
      
      totalViral += viralScore;
    });
    
    return totalViral;
  };

  // New: Strategic depth calculation
  const calculateStrategicDepth = () => {
    const contentTypes = [...new Set(influencers.map(i => i.contentType))];
    const typeDistribution = contentTypes.map(type => {
      const typeInfluencers = influencers.filter(i => i.contentType === type && !i.isIsolated);
      return typeInfluencers.length;
    });
    
    const diversity = typeDistribution.filter(count => count > 0).length / contentTypes.length;
    const crossPromotions = connections.filter(c => !c.broken && c.crossPromotion).length;
    const algorithmEfficiency = (algorithmState.engagement_bias + algorithmState.content_diversity + algorithmState.network_centrality) / 3;
    
    return {
      diversity: diversity * 100,
      crossPromotions,
      algorithmEfficiency: algorithmEfficiency * 100,
      strategicComplexity: diversity * crossPromotions * algorithmEfficiency * 100
    };
  };

  const calculateIsolationScore = () => {
    const isolated = influencers.filter(inf => {
      const activeConnections = connections.filter(
        conn => !conn.broken && (conn.from === inf.id || conn.to === inf.id)
      );
      return activeConnections.length === 0;
    });
    return (isolated.length / influencers.length) * 100;
  };

  const calculateNetworkFragmentation = () => {
    const viralPotential = calculateViralPotential();
    const maxPossibleViral = influencers.reduce((sum, inf) => 
      sum + (inf.viralCoefficient * inf.influence * inf.connections.length * 0.8), 0
    );
    
    const viralReduction = (1 - (viralPotential / maxPossibleViral)) * 100;
    const { strategicComplexity } = calculateStrategicDepth();
    const algorithmDisruption = (1 - algorithmState.viral_threshold) * 100;
    
    // New complex scoring: must understand multiple factors
    return Math.min(100, (viralReduction * 0.4) + (strategicComplexity * 0.3) + (algorithmDisruption * 0.3));
  };

  // New: Enhanced cascade with strategic considerations
  const applyCascadeEffect = (brokenConnId: number, affectedIds: Set<number>) => {
    const brokenConn = connections[brokenConnId];
    const strength = brokenConn.strength;
    
    // Get the influencers involved
    const inf1 = influencers.find(i => i.id === brokenConn.from);
    const inf2 = influencers.find(i => i.id === brokenConn.to);
    
    if (!inf1 || !inf2) return;

    // Complex cascade logic based on content synergy and cross-promotion
    if (strength > 80 || brokenConn.crossPromotion) {
      const cascadeIntensity = (strength / 100) * brokenConn.contentSynergy * 
        Math.max(inf1.cascadeMultiplier, inf2.cascadeMultiplier);
      
      [brokenConn.from, brokenConn.to].forEach(infId => {
        const influencer = influencers.find(i => i.id === infId);
        if (!influencer) return;

        connections.forEach((conn, idx) => {
          if (conn.broken || idx === brokenConnId) return;
          if (conn.from !== infId && conn.to !== infId) return;
          
          // Strategic cascade: affects similar content types more
          const partner = influencers.find(p => 
            p.id === (conn.from === infId ? conn.to : conn.from)
          );
          if (!partner) return;
          
          const contentSimilarity = influencer.contentType === partner.contentType ? 1.5 : 1.0;
          const algorithmPenalty = (1 - partner.algorithmWeight) * 2;
          const cascadeChance = cascadeIntensity * contentSimilarity * algorithmPenalty * 0.6;
          
          if (Math.random() < cascadeChance) {
            affectedIds.add(idx);
          }
        });
      });
      
      // Update algorithm state based on broken connection
      setAlgorithmState(prev => ({
        ...prev,
        content_diversity: Math.max(0.1, prev.content_diversity - brokenConn.contentSynergy * 0.1),
        network_centrality: Math.max(0.1, prev.network_centrality - (strength / 100) * 0.05),
        viral_threshold: Math.max(0.3, prev.viral_threshold - (brokenConn.crossPromotion ? 0.1 : 0.05))
      }));
    }
  };

  // New: Strategic analysis requirement
  const conductAnalysis = () => {
    const viralPotential = calculateViralPotential();
    const { diversity, crossPromotions, algorithmEfficiency, strategicComplexity } = calculateStrategicDepth();
    
    setShowAnalysis(true);
    toast.info("📊 Analyse du réseau en cours...", { duration: 2000 });
    
    setTimeout(() => {
      if (strategicComplexity > 150 && diversity > 60 && crossPromotions >= 4) {
        setCurrentPhase('action');
        toast.success("🧠 Analyse complète ! Vous pouvez maintenant agir stratégiquement.");
      } else {
        toast.error("❌ Analyse insuffisante ! Étudiez mieux les interconnexions.");
      }
    }, 3000);
  };

  const breakConnection = (connIdx: number) => {
    if (movesLeft <= 0 || gameOver || currentPhase !== 'action') return;

    const newConnections = [...connections];
    const affectedIds = new Set<number>();
    
    // Break the selected connection
    newConnections[connIdx] = { ...newConnections[connIdx], broken: true };
    
    // Apply complex cascade effects
    applyCascadeEffect(connIdx, affectedIds);
    
    // Break cascaded connections with strategic feedback
    if (affectedIds.size > 0) {
      setShowCascade(Array.from(affectedIds));
      setTimeout(() => {
        affectedIds.forEach(idx => {
          newConnections[idx] = { ...newConnections[idx], broken: true };
        });
        setConnections(newConnections);
        setShowCascade([]);
        
        const cascadeTypes = Array.from(affectedIds).map(idx => {
          const conn = newConnections[idx];
          const inf1 = influencers.find(i => i.id === conn.from);
          const inf2 = influencers.find(i => i.id === conn.to);
          return `${inf1?.contentType}-${inf2?.contentType}`;
        });
        
        toast.success(`💥 Cascade stratégique! ${affectedIds.size} connexions: ${cascadeTypes.join(', ')}`);
      }, 1200);
    }
    
    setConnections(newConnections);
    setMovesLeft(movesLeft - 1);
    setSelectedConnection(null);

    // Update influencer isolation status
    const updatedInfluencers = influencers.map(inf => {
      const activeConns = newConnections.filter(
        c => !c.broken && (c.from === inf.id || c.to === inf.id)
      );
      return { ...inf, isIsolated: activeConns.length === 0 };
    });
    setInfluencers(updatedInfluencers);

    // Enhanced win condition - requires strategic understanding
    const isolationScore = (updatedInfluencers.filter(i => i.isIsolated).length / influencers.length) * 100;
    const fragmentation = calculateNetworkFragmentation();
    const viralPotential = calculateViralPotential();
    const { strategicComplexity } = calculateStrategicDepth();
    
    // Complex win condition: must achieve multiple objectives
    const viralReductionSuccess = viralPotential < 1000; // Reduce viral potential significantly
    const diversityDestroyed = strategicComplexity < 50; // Break content diversity
    const algorithmCrippled = algorithmState.viral_threshold < 0.5; // Damage algorithm
    
    if ((isolationScore >= targetIsolation || fragmentation >= 75) && 
        (viralReductionSuccess || diversityDestroyed || algorithmCrippled)) {
      setGameOver(true);
      setTimeout(() => {
        toast.success("🎯 Analyse stratégique réussie ! Réseau d'influence détruit !");
        onSolve();
      }, 1000);
    } else if (movesLeft <= 1) {
      setGameOver(true);
      toast.error("❌ Échec stratégique - L'analyse était insuffisante pour optimiser vos mouvements");
    }
  };

  const isolationScore = calculateIsolationScore();
  const fragmentationScore = calculateNetworkFragmentation();
  const viralPotential = calculateViralPotential();
  const { diversity, crossPromotions, algorithmEfficiency, strategicComplexity } = calculateStrategicDepth();

  return (
    <div className="space-y-6 p-6 max-h-[80vh] overflow-y-auto">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold neon-cyan flex items-center justify-center gap-2">
          <Brain className="w-6 h-6" />
          Analyse Stratégique du Réseau
        </h2>
        <p className="text-sm text-muted-foreground">
          Analysez d'abord, puis sabotez stratégiquement les connexions influenceurs
        </p>
        <div className="flex gap-2 justify-center items-center flex-wrap">
          <Badge variant={currentPhase === 'action' ? "default" : "secondary"}>
            {currentPhase === 'analysis' ? '🔍 Phase d\'Analyse' : '⚡ Phase d\'Action'}
          </Badge>
          <Badge variant={movesLeft > 2 ? "default" : "destructive"}>
            <Zap className="w-3 h-3 mr-1" />
            {movesLeft} mouvements
          </Badge>
          <Badge variant={timeRemaining > 60 ? "secondary" : "destructive"}>
            ⏱️ {Math.floor(timeRemaining / 60)}:{(timeRemaining % 60).toString().padStart(2, '0')}
          </Badge>
        </div>
      </div>

      {currentPhase === 'analysis' && (
        <Card className="p-4 bg-blue-500/10 border-blue-500/30">
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center gap-2">
              <Calculator className="w-5 h-5 text-blue-400" />
              <h3 className="font-bold text-blue-400">Analyse Stratégique Requise</h3>
            </div>
            <p className="text-sm">
              Vous devez d'abord analyser le réseau pour comprendre les interconnexions complexes, 
              les synergies de contenu, et l'impact algorithmique avant de pouvoir agir efficacement.
            </p>
            <Button 
              onClick={conductAnalysis}
              className="bg-blue-600 hover:bg-blue-700 text-white"
              disabled={showAnalysis}
            >
              {showAnalysis ? '🔄 Analyse en cours...' : '🧠 Commencer l\'Analyse'}
            </Button>
          </div>
        </Card>
      )}

      {showAnalysis && (
        <Card className="p-4 bg-purple-500/10 border-purple-500/30">
          <div className="space-y-3">
            <h3 className="font-bold text-purple-400 flex items-center gap-2">
              <Target className="w-4 h-4" />
              Métriques Analytiques Avancées
            </h3>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="space-y-1">
                <div className="flex justify-between">
                  <span>Potentiel Viral:</span>
                  <span className={viralPotential > 2000 ? "text-red-400" : "text-green-400"}>
                    {viralPotential.toFixed(0)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Diversité Contenu:</span>
                  <span className={diversity > 60 ? "text-red-400" : "text-green-400"}>
                    {diversity.toFixed(0)}%
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Cross-Promotions:</span>
                  <span className={crossPromotions >= 4 ? "text-red-400" : "text-green-400"}>
                    {crossPromotions}
                  </span>
                </div>
              </div>
              <div className="space-y-1">
                <div className="flex justify-between">
                  <span>Efficacité Algo:</span>
                  <span className={algorithmEfficiency > 70 ? "text-red-400" : "text-green-400"}>
                    {algorithmEfficiency.toFixed(0)}%
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Complexité:</span>
                  <span className={strategicComplexity > 150 ? "text-red-400" : "text-green-400"}>
                    {strategicComplexity.toFixed(0)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Seuil Viral:</span>
                  <span className={algorithmState.viral_threshold > 0.7 ? "text-red-400" : "text-green-400"}>
                    {(algorithmState.viral_threshold * 100).toFixed(0)}%
                  </span>
                </div>
              </div>
            </div>
          </div>
        </Card>
      )}

      <Card className="p-4 bg-accent/10 border-accent/30">
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm font-semibold">Isolation du Réseau</span>
            <span className="text-sm">{isolationScore.toFixed(0)}% / {targetIsolation}%</span>
          </div>
          <Progress value={isolationScore} className="h-2" />
          
          <div className="flex justify-between items-center">
            <span className="text-sm font-semibold">Fragmentation Stratégique</span>
            <span className="text-sm">{fragmentationScore.toFixed(0)}% / 75%</span>
          </div>
          <Progress value={fragmentationScore} className="h-2" />
        </div>
      </Card>

      <Card className="p-4 bg-destructive/10 border-destructive/30">
        <div className="flex items-start gap-2">
          <AlertTriangle className="w-4 h-4 text-destructive mt-0.5" />
          <div className="text-xs space-y-1">
            <p className="font-bold text-destructive">⚠️ Règles Stratégiques Complexes:</p>
            <p>• Analysez d'abord: diversité contenu &gt;60%, cross-promotions ≥4, complexité &gt;150</p>
            <p>• Cassades basées sur synergies de contenu et algorithme</p>
            <p>• Victoire: Isolation OU fragmentation + (viral &lt;1000 OU diversité &lt;50 OU algo &lt;50%)</p>
            <p>• Chaque connexion a: force, synergie contenu, boost cross-promotion</p>
          </div>
        </div>
      </Card>

      <div className="space-y-3">
        <h3 className="font-bold flex items-center gap-2">
          <Users className="w-4 h-4" />
          Influenceurs ({influencers.filter(i => i.isIsolated).length}/6 isolés)
        </h3>
        <div className="grid grid-cols-2 gap-3">
          {influencers.map((inf) => {
            const activeConns = connections.filter(
              c => !c.broken && (c.from === inf.id || c.to === inf.id)
            ).length;
            
            return (
              <Card
                key={inf.id}
                className={`p-3 transition-all ${
                  inf.isIsolated 
                    ? "border-green-500 bg-green-500/10" 
                    : "border-muted"
                }`}
              >
                <div className="space-y-2">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-bold text-sm">{inf.name}</h4>
                      <p className="text-xs text-muted-foreground">
                        {(inf.followers / 1000000).toFixed(1)}M followers
                      </p>
                    </div>
                    <Badge variant={inf.isIsolated ? "default" : "outline"} className="text-xs">
                      {inf.isIsolated ? "ISOLÉ" : `${activeConns} liens`}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">Influence: {inf.influence}</span>
                    <span className="text-primary">×{inf.cascadeMultiplier} cascade</span>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </div>

      <div className="space-y-3">
        <h3 className="font-bold">🔗 Connexions ({connections.filter(c => !c.broken).length}/{connections.length} actives)</h3>
        <div className="space-y-2 max-h-64 overflow-y-auto">
          {connections.map((conn, idx) => {
            const from = influencers.find(i => i.id === conn.from);
            const to = influencers.find(i => i.id === conn.to);
            const isSelected = selectedConnection === idx;
            const isCascading = showCascade.includes(idx);
            
            if (!from || !to) return null;

            return (
              <Card
                key={idx}
                className={`p-3 transition-all cursor-pointer ${
                  conn.broken 
                    ? "opacity-40 border-muted bg-muted/20" 
                    : isSelected
                    ? "border-primary bg-primary/10"
                    : isCascading
                    ? "border-orange-500 bg-orange-500/20 animate-pulse"
                    : "hover:border-primary/50"
                }`}
                onClick={() => !conn.broken && !gameOver && setSelectedConnection(isSelected ? null : idx)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 text-sm">
                      <span className={conn.broken ? "line-through" : ""}>
                        {from.name} ↔ {to.name}
                      </span>
                      <Badge 
                        variant={conn.strength > 80 ? "destructive" : "outline"}
                        className="text-xs"
                      >
                        {conn.strength}% fort
                      </Badge>
                    </div>
                  </div>
                  {isSelected && !conn.broken && (
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={(e) => {
                        e.stopPropagation();
                        breakConnection(idx);
                      }}
                      disabled={movesLeft <= 0 || gameOver}
                    >
                      Briser
                    </Button>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      </div>

      {gameOver && (
        <Card className="p-4 bg-muted/50 text-center">
          {isolationScore >= targetIsolation || fragmentationScore >= 75 ? (
            <div className="space-y-2">
              <p className="font-bold text-green-500 text-lg">✅ Réseau Détruit!</p>
              <p className="text-sm">Isolation: {isolationScore.toFixed(0)}% | Fragmentation: {fragmentationScore.toFixed(0)}%</p>
            </div>
          ) : (
            <p className="text-red-500 font-bold">❌ Échec - Le réseau reste trop solide</p>
          )}
        </Card>
      )}
    </div>
  );
};
