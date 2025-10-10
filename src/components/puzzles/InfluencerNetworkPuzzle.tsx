import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Users, Zap, TrendingDown, AlertTriangle, Link2Off } from "lucide-react";
import { toast } from "sonner";

interface Influencer {
  id: number;
  name: string;
  followers: number;
  influence: number;
  connections: number[];
  isIsolated: boolean;
  cascadeMultiplier: number;
}

interface Connection {
  from: number;
  to: number;
  strength: number;
  broken: boolean;
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
    { id: 1, name: "@FashionQueen", followers: 2500000, influence: 95, connections: [2, 3, 4], isIsolated: false, cascadeMultiplier: 1.5 },
    { id: 2, name: "@TechGuru", followers: 1800000, influence: 85, connections: [1, 3, 5, 6], isIsolated: false, cascadeMultiplier: 1.2 },
    { id: 3, name: "@FitnessKing", followers: 3200000, influence: 98, connections: [1, 2, 4, 5], isIsolated: false, cascadeMultiplier: 1.8 },
    { id: 4, name: "@FoodieLife", followers: 1500000, influence: 75, connections: [1, 3, 6], isIsolated: false, cascadeMultiplier: 1.0 },
    { id: 5, name: "@TravelVibes", followers: 2100000, influence: 88, connections: [2, 3, 6], isIsolated: false, cascadeMultiplier: 1.3 },
    { id: 6, name: "@ComedyCentral", followers: 2800000, influence: 92, connections: [2, 4, 5], isIsolated: false, cascadeMultiplier: 1.4 }
  ]);

  const [connections, setConnections] = useState<Connection[]>([
    { from: 1, to: 2, strength: 80, broken: false },
    { from: 1, to: 3, strength: 90, broken: false },
    { from: 1, to: 4, strength: 70, broken: false },
    { from: 2, to: 3, strength: 85, broken: false },
    { from: 2, to: 5, strength: 75, broken: false },
    { from: 2, to: 6, strength: 78, broken: false },
    { from: 3, to: 4, strength: 82, broken: false },
    { from: 3, to: 5, strength: 88, broken: false },
    { from: 4, to: 6, strength: 72, broken: false },
    { from: 5, to: 6, strength: 80, broken: false }
  ]);

  const [movesLeft, setMovesLeft] = useState(maxMoves);
  const [selectedConnection, setSelectedConnection] = useState<number | null>(null);
  const [timeRemaining, setTimeRemaining] = useState(timeLimit);
  const [gameOver, setGameOver] = useState(false);
  const [showCascade, setShowCascade] = useState<number[]>([]);

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
    const totalPossibleConnections = connections.length;
    const brokenConnections = connections.filter(c => c.broken).length;
    const avgInfluence = influencers.reduce((sum, inf) => {
      const activeConns = connections.filter(
        c => !c.broken && (c.from === inf.id || c.to === inf.id)
      ).length;
      return sum + (inf.influence * (1 - activeConns / inf.connections.length));
    }, 0) / influencers.length;
    
    return ((brokenConnections / totalPossibleConnections) * 50) + (avgInfluence * 0.5);
  };

  const applyCascadeEffect = (brokenConnId: number, affectedIds: Set<number>) => {
    const brokenConn = connections[brokenConnId];
    const strength = brokenConn.strength;

    // Cascade: breaking a strong connection (>80) damages adjacent connections
    if (strength > 80) {
      const affectedInfluencers = [brokenConn.from, brokenConn.to];
      
      affectedInfluencers.forEach(infId => {
        const influencer = influencers.find(i => i.id === infId);
        if (!influencer) return;

        const adjacentConnections = connections
          .map((c, idx) => ({ conn: c, idx }))
          .filter(({ conn }) => 
            !conn.broken && 
            (conn.from === infId || conn.to === infId) &&
            connections.indexOf(conn) !== brokenConnId
          );

        // Apply cascade damage based on multiplier
        adjacentConnections.forEach(({ conn, idx }) => {
          const damageChance = influencer.cascadeMultiplier * (strength / 100) * 0.4;
          if (Math.random() < damageChance) {
            affectedIds.add(idx);
          }
        });
      });
    }
  };

  const breakConnection = (connIdx: number) => {
    if (movesLeft <= 0 || gameOver) return;

    const newConnections = [...connections];
    const affectedIds = new Set<number>();
    
    // Break the selected connection
    newConnections[connIdx] = { ...newConnections[connIdx], broken: true };
    
    // Apply cascade effects
    applyCascadeEffect(connIdx, affectedIds);
    
    // Break cascaded connections with visual feedback
    if (affectedIds.size > 0) {
      setShowCascade(Array.from(affectedIds));
      setTimeout(() => {
        affectedIds.forEach(idx => {
          newConnections[idx] = { ...newConnections[idx], broken: true };
        });
        setConnections(newConnections);
        setShowCascade([]);
        toast.success(`💥 Cascade! ${affectedIds.size} connexions supplémentaires brisées!`);
      }, 800);
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

    // Check win condition
    const isolationScore = (updatedInfluencers.filter(i => i.isIsolated).length / influencers.length) * 100;
    const fragmentation = calculateNetworkFragmentation();
    
    if (isolationScore >= targetIsolation || fragmentation >= 75) {
      setGameOver(true);
      setTimeout(() => {
        toast.success("🎯 Réseau complètement fragmenté!");
        onSolve();
      }, 1000);
    } else if (movesLeft <= 1) {
      setGameOver(true);
      toast.error("❌ Mouvements épuisés - réseau encore trop solide");
    }
  };

  const isolationScore = calculateIsolationScore();
  const fragmentationScore = calculateNetworkFragmentation();

  return (
    <div className="space-y-6 p-6 max-h-[80vh] overflow-y-auto">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold neon-cyan flex items-center justify-center gap-2">
          <Link2Off className="w-6 h-6" />
          Sabotage du Réseau Influenceur
        </h2>
        <p className="text-sm text-muted-foreground">
          Brisez stratégiquement les connexions pour isoler les influenceurs
        </p>
        <div className="flex gap-2 justify-center items-center flex-wrap">
          <Badge variant={movesLeft > 2 ? "default" : "destructive"}>
            <Zap className="w-3 h-3 mr-1" />
            {movesLeft} mouvements
          </Badge>
          <Badge variant={timeRemaining > 30 ? "secondary" : "destructive"}>
            ⏱️ {Math.floor(timeRemaining / 60)}:{(timeRemaining % 60).toString().padStart(2, '0')}
          </Badge>
          <Badge variant={fragmentationScore >= 75 ? "default" : "outline"}>
            <TrendingDown className="w-3 h-3 mr-1" />
            Fragmentation: {fragmentationScore.toFixed(0)}%
          </Badge>
        </div>
      </div>

      <Card className="p-4 bg-accent/10 border-accent/30">
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm font-semibold">Isolation du Réseau</span>
            <span className="text-sm">{isolationScore.toFixed(0)}% / {targetIsolation}%</span>
          </div>
          <Progress value={isolationScore} className="h-2" />
          
          <div className="flex justify-between items-center">
            <span className="text-sm font-semibold">Fragmentation Globale</span>
            <span className="text-sm">{fragmentationScore.toFixed(0)}% / 75%</span>
          </div>
          <Progress value={fragmentationScore} className="h-2" />
        </div>
      </Card>

      <Card className="p-4 bg-destructive/10 border-destructive/30">
        <div className="flex items-start gap-2">
          <AlertTriangle className="w-4 h-4 text-destructive mt-0.5" />
          <div className="text-xs space-y-1">
            <p className="font-bold text-destructive">⚠️ Règles Complexes:</p>
            <p>• Briser une connexion forte (&gt;80) peut déclencher des cascades</p>
            <p>• Les cascades endommagent les connexions adjacentes aléatoirement</p>
            <p>• Chaque influenceur a un multiplicateur de cascade unique</p>
            <p>• Isolez {targetIsolation}% des influenceurs OU atteignez 75% de fragmentation</p>
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
