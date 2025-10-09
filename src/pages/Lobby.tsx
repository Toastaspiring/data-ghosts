import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useAudioManager } from "@/hooks/useAudioManager";
import { supabase } from "@/integrations/supabase/client";
import { Copy, Crown, User, CheckCircle, Circle, Play, Volume2 } from "lucide-react";
import { RealtimeChannel } from "@supabase/supabase-js";

interface Player {
  id: string;
  name: string;
  ready: boolean;
  score: number;
  isHost?: boolean;
}

interface Lobby {
  id: string;
  name: string;
  code: string | number;
  status: string;
  players: Player[];
  max_players: number;
}

const Lobby = () => {
  const { lobbyId } = useParams<{ lobbyId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { playMusic, isAudioUnlocked } = useAudioManager();
  const [lobby, setLobby] = useState<Lobby | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [playerId] = useState(sessionStorage.getItem("playerId") || "");
  const [musicTransitioning, setMusicTransitioning] = useState(false);

  // Initialize lobby music with cool transition effect
  useEffect(() => {
    const initializeLobbyMusic = async () => {
      setMusicTransitioning(true);
      
      // Add visual feedback for music transition
      const musicTransition = () => {
        setTimeout(() => {
          playMusic('lobby');
          setMusicTransitioning(false);
        }, 600); // Delay to sync with fade transition
      };

      if (isAudioUnlocked) {
        musicTransition();
      } else {
        // If audio isn't unlocked yet, still trigger the visual effect
        setTimeout(() => {
          setMusicTransitioning(false);
        }, 800);
      }
    };

    if (!isLoading) {
      initializeLobbyMusic();
    }
  }, [isLoading, playMusic, isAudioUnlocked]);

  useEffect(() => {
    if (!lobbyId || !playerId) {
      navigate("/");
      return;
    }

    let channel: RealtimeChannel;

    const fetchLobby = async () => {
      const { data, error } = await supabase
        .from("lobbies")
        .select("*")
        .eq("id", lobbyId)
        .single();

      if (error || !data) {
        toast({
          title: "Erreur",
          description: "Lobby introuvable",
          variant: "destructive",
        });
        navigate("/");
        return;
      }

      setLobby(data as any);
      setIsLoading(false);
    };

    fetchLobby();

    // Subscribe to realtime updates
    channel = supabase
      .channel(`lobby-${lobbyId}`)
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "lobbies",
          filter: `id=eq.${lobbyId}`,
        },
        (payload) => {
          console.log("🔔 Lobby update received:", payload.new);
          setLobby(payload.new as Lobby);
          
          // Navigate based on game state phase
          const newGameState = payload.new.game_state as any;
          console.log("🎮 Game state:", newGameState);
          
          if (newGameState?.phase === "room_selection") {
            console.log("✅ Navigating to room selection");
            setMusicTransitioning(true);
            setTimeout(() => {
              playMusic('roomSelection');
            }, 300);
            setTimeout(() => {
              navigate(`/room-selection/${lobbyId}`);
            }, 800);
          } else if (payload.new.status === "playing") {
            console.log("✅ Navigating to game");
            navigate(`/game/${lobbyId}`);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [lobbyId, playerId, navigate, toast]);

  const copyLobbyCode = () => {
    if (lobby?.code) {
      navigator.clipboard.writeText(lobby.code.toString());
      toast({
        title: "Code copié !",
        description: "Le code du lobby a été copié dans le presse-papier",
      });
    }
  };

  const toggleReady = async () => {
    if (!lobby || !playerId) return;

    const updatedPlayers = lobby.players.map((player) =>
      player.id === playerId ? { ...player, ready: !player.ready } : player
    );

    const { error } = await supabase
      .from("lobbies")
      .update({ players: updatedPlayers as any })
      .eq("id", lobby.id);

    if (error) {
      toast({
        title: "Erreur",
        description: "Impossible de changer le statut",
        variant: "destructive",
      });
    }
  };

  const startGame = async () => {
    if (!lobby || !playerId) return;

    const currentPlayer = lobby.players.find((p) => p.id === playerId);
    if (!currentPlayer?.isHost) {
      toast({
        title: "Erreur",
        description: "Seul l'hôte peut démarrer la partie",
        variant: "destructive",
      });
      return;
    }

    const allReady = lobby.players.every((p) => p.ready || p.isHost);
    if (!allReady) {
      toast({
        title: "Attention",
        description: "Tous les joueurs doivent être prêts",
        variant: "destructive",
      });
      return;
    }

    // Update game state to trigger navigation for all players
    const { error } = await supabase
      .from("lobbies")
      .update({ 
        game_state: { phase: "room_selection" }
      })
      .eq("id", lobby.id);

    if (error) {
      console.error("Error starting game:", error);
      toast({
        title: "Erreur",
        description: "Impossible de démarrer la partie",
        variant: "destructive",
      });
      return;
    }

    // Add cool music transition before navigation
    setMusicTransitioning(true);
    
    // Play room selection music with transition effect
    setTimeout(() => {
      playMusic('roomSelection');
    }, 300);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-pulse-soft text-4xl mb-4">🌍</div>
          <p className="text-muted-foreground">Chargement...</p>
        </div>
      </div>
    );
  }

  if (!lobby) return null;

  const currentPlayer = lobby.players.find((p) => p.id === playerId);
  const isHost = currentPlayer?.isHost || false;
  const allReady = lobby.players.every((p) => p.ready || p.isHost);

  return (
    <div className="min-h-screen bg-background p-4 relative overflow-hidden">
      {/* Animated Background Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0ff_1px,transparent_1px),linear-gradient(to_bottom,#0ff_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_110%)] opacity-10" />
      
      {/* Music Transition Visual Effect */}
      {musicTransitioning && (
        <div className="absolute inset-0 z-20 pointer-events-none">
          <div className="absolute top-8 right-8 flex items-center gap-3 bg-primary/20 border-2 border-primary px-4 py-2 rounded-lg animate-pulse-glow">
            <Volume2 className="w-5 h-5 text-primary animate-pulse" />
            <span className="text-sm font-mono text-primary">Synchronisation audio...</span>
          </div>
          <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-secondary/5 to-accent/5 animate-pulse" />
        </div>
      )}
      
      <div className="container mx-auto max-w-4xl py-8 relative z-10">
        {/* Lobby Header */}
        <div className="bg-card border-2 border-primary/30 rounded-lg p-8 cartoon-shadow mb-6 animate-fade-in-up">
          <h1 className="text-5xl font-bold text-center mb-4 neon-cyan font-mono">
            {lobby.name}
          </h1>

          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="bg-primary/20 border-2 border-primary px-8 py-4 rounded-lg animate-pulse-glow">
              <p className="text-sm text-muted-foreground mb-1 font-mono">CODE D'ACCÈS</p>
              <div className="flex items-center gap-2">
                <span className="text-4xl font-bold tracking-[0.3em] neon-cyan font-mono">
                  {lobby.code.toString()}
                </span>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={copyLobbyCode}
                  className="hover:bg-primary/10 border border-primary/50 hover:border-primary transition-all"
                >
                  <Copy className="h-4 w-4 text-primary" />
                </Button>
              </div>
            </div>
          </div>

          <p className="text-center text-muted-foreground font-mono">
            <span className="text-primary">→</span> En attente des hackers • {lobby.players.length}/3
          </p>
        </div>

        {/* Players List */}
        <div className="bg-card border-2 border-secondary/30 rounded-lg p-8 cartoon-shadow mb-6">
          <h2 className="text-3xl font-bold mb-6 neon-purple font-mono">ÉQUIPE DATA GHOSTS</h2>
          <div className="space-y-4">
            {lobby.players.map((player) => (
              <div
                key={player.id}
                className="flex items-center justify-between p-4 bg-muted/50 border-2 border-border hover:border-primary rounded-lg transition-all hover:scale-105"
              >
                <div className="flex items-center gap-3">
                  <div className="bg-primary/20 border-2 border-primary w-14 h-14 rounded-lg flex items-center justify-center animate-pulse-glow">
                    <User className="w-7 h-7 text-primary" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-foreground font-mono">{player.name}</span>
                      {player.isHost && (
                        <Crown className="w-5 h-5 text-accent" />
                      )}
                    </div>
                    {player.id === playerId && (
                      <span className="text-xs text-primary font-mono">• VOUS</span>
                    )}
                  </div>
                </div>

                {player.ready || player.isHost ? (
                  <CheckCircle className="w-7 h-7 text-primary animate-pulse" />
                ) : (
                  <Circle className="w-7 h-7 text-muted-foreground" />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-4">
          {!currentPlayer?.isHost && (
            <Button
              onClick={toggleReady}
              className={`w-full py-7 text-lg font-mono transition-all hover:scale-105 ${
                currentPlayer?.ready
                  ? "bg-primary hover:bg-primary/90 text-primary-foreground animate-pulse-glow"
                  : "bg-muted hover:bg-muted/80 text-foreground border-2 border-primary"
              }`}
            >
              {currentPlayer?.ready ? "✓ PRÊT POUR LA MISSION" : "SE PRÉPARER"}
            </Button>
          )}

          {isHost && (
            <Button
              onClick={startGame}
              disabled={!allReady}
              className="w-full bg-accent hover:bg-accent/90 text-accent-foreground py-7 text-lg font-mono transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed animate-pulse-glow"
            >
              <Play className="mr-2 h-6 w-6" />
              LANCER L'OPÉRATION
            </Button>
          )}

          <Button
            variant="outline"
            onClick={() => navigate("/")}
            className="w-full py-7 text-lg font-mono border-2 border-border hover:border-destructive hover:text-destructive transition-all"
          >
            QUITTER LA MISSION
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Lobby;
