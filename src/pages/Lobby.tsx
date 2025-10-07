import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Copy, Crown, User, CheckCircle, Circle, Play } from "lucide-react";
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
  const [lobby, setLobby] = useState<Lobby | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [playerId] = useState(sessionStorage.getItem("playerId") || "");

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
          setLobby(payload.new as Lobby);
          
          // If game has started, navigate to game page
          if (payload.new.status === "playing") {
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

    const { error } = await supabase
      .from("lobbies")
      .update({
        status: "playing",
        started_at: new Date().toISOString(),
        timer_started_at: new Date().toISOString(),
      })
      .eq("id", lobby.id);

    if (error) {
      toast({
        title: "Erreur",
        description: "Impossible de démarrer la partie",
        variant: "destructive",
      });
    }
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
    <div className="min-h-screen bg-background p-4">
      <div className="container mx-auto max-w-4xl py-8">
        {/* Lobby Header */}
        <div className="bg-card rounded-3xl p-8 cartoon-shadow mb-6">
          <h1 className="text-4xl font-bold text-center mb-4 text-foreground">
            {lobby.name}
          </h1>

          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="bg-primary/20 px-6 py-3 rounded-xl">
              <p className="text-sm text-muted-foreground mb-1">Code du Lobby</p>
              <div className="flex items-center gap-2">
                <span className="text-3xl font-bold tracking-widest text-primary">
                  {lobby.code.toString()}
                </span>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={copyLobbyCode}
                  className="hover:bg-primary/10"
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          <p className="text-center text-muted-foreground">
            En attente des joueurs • {lobby.players.length}/{lobby.max_players}
          </p>
        </div>

        {/* Players List */}
        <div className="bg-card rounded-3xl p-8 cartoon-shadow mb-6">
          <h2 className="text-2xl font-bold mb-6 text-foreground">Joueurs</h2>
          <div className="space-y-4">
            {lobby.players.map((player) => (
              <div
                key={player.id}
                className="flex items-center justify-between p-4 bg-muted rounded-xl"
              >
                <div className="flex items-center gap-3">
                  <div className="bg-primary/20 w-12 h-12 rounded-full flex items-center justify-center">
                    <User className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-foreground">{player.name}</span>
                      {player.isHost && (
                        <Crown className="w-4 h-4 text-accent" />
                      )}
                    </div>
                    {player.id === playerId && (
                      <span className="text-xs text-muted-foreground">Vous</span>
                    )}
                  </div>
                </div>

                {player.ready || player.isHost ? (
                  <CheckCircle className="w-6 h-6 text-green-500" />
                ) : (
                  <Circle className="w-6 h-6 text-muted-foreground" />
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
              className={`w-full py-6 rounded-xl text-lg transition-all hover:scale-105 ${
                currentPlayer?.ready
                  ? "bg-green-500 hover:bg-green-600 text-white"
                  : "bg-primary hover:bg-primary/90 text-primary-foreground"
              }`}
            >
              {currentPlayer?.ready ? "Prêt ✓" : "Je suis prêt !"}
            </Button>
          )}

          {isHost && (
            <Button
              onClick={startGame}
              disabled={!allReady}
              className="w-full bg-accent hover:bg-accent/90 text-accent-foreground py-6 rounded-xl text-lg transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Play className="mr-2 h-5 w-5" />
              Commencer la Partie
            </Button>
          )}

          <Button
            variant="outline"
            onClick={() => navigate("/")}
            className="w-full rounded-xl py-6 text-lg border-2"
          >
            Quitter le Lobby
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Lobby;
