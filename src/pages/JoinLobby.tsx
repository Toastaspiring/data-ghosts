import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { ArrowLeft, Lock, Shield } from "lucide-react";

const JoinLobby = () => {
  const [lobbyCode, setLobbyCode] = useState("");
  const [playerName, setPlayerName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleJoinLobby = async () => {
    if (!lobbyCode.trim() || !playerName.trim()) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs",
        variant: "destructive",
      });
      return;
    }

    if (lobbyCode.length !== 6) {
      toast({
        title: "Erreur",
        description: "Le code doit contenir 6 chiffres",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      // Find lobby by code
      const { data: lobby, error: findError } = await supabase
        .from("lobbies")
        .select("*")
        .eq("code", parseInt(lobbyCode))
        .single();

      if (findError || !lobby) {
        toast({
          title: "Lobby introuvable",
          description: "Vérifiez le code et réessayez",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }

      // Check if lobby is full
      const currentPlayers = Array.isArray(lobby.players) ? lobby.players : [];
      const maxPlayers = (lobby as any).max_players || 3;
      if (currentPlayers.length >= maxPlayers) {
        toast({
          title: "Lobby complet",
          description: "Ce lobby a atteint le nombre maximum de joueurs",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }

      // Check if lobby has already started
      if (lobby.status !== "waiting") {
        toast({
          title: "Partie en cours",
          description: "Ce lobby a déjà commencé la partie",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }

      // Add player to lobby
      const playerId = crypto.randomUUID();
      const updatedPlayers = [
        ...currentPlayers,
        {
          id: playerId,
          name: playerName,
          ready: false,
          score: 0,
          isHost: false,
        },
      ];

      const { error: updateError } = await supabase
        .from("lobbies")
        .update({ players: updatedPlayers as any })
        .eq("id", lobby.id);

      if (updateError) throw updateError;

      toast({
        title: "Lobby rejoint !",
        description: `Bienvenue dans ${lobby.name}`,
      });

      // Store player info in sessionStorage
      sessionStorage.setItem("playerId", playerId);
      sessionStorage.setItem("playerName", playerName);

      navigate(`/lobby/${lobby.id}`);
    } catch (error) {
      console.error("Error joining lobby:", error);
      toast({
        title: "Erreur",
        description: "Impossible de rejoindre le lobby",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated Background Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0ff_1px,transparent_1px),linear-gradient(to_bottom,#0ff_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_110%)] opacity-10" />
      
      <div className="w-full max-w-md relative z-10">
        <Button
          variant="ghost"
          onClick={() => navigate("/")}
          className="mb-6 text-muted-foreground hover:text-secondary font-mono border border-border hover:border-secondary transition-all"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Retour
        </Button>

        <div className="bg-card border-2 border-secondary/30 rounded-lg p-8 cartoon-shadow animate-fade-in-up">
          <div className="flex items-center justify-center mb-6">
            <div className="bg-secondary/20 w-20 h-20 rounded-lg flex items-center justify-center animate-pulse-glow">
              <Lock className="w-10 h-10 text-secondary" />
            </div>
          </div>

          <h1 className="text-4xl font-bold text-center mb-2 neon-purple font-mono">
            REJOINDRE ÉQUIPE
          </h1>
          <p className="text-center text-muted-foreground mb-8 font-mono text-sm">
            Entrer le code d'accès sécurisé
          </p>

          <div className="space-y-6">
            <div>
              <Label htmlFor="lobbyCode" className="text-foreground font-mono flex items-center gap-2">
                <Lock className="w-4 h-4 text-secondary" />
                Code d'Accès
              </Label>
              <Input
                id="lobbyCode"
                placeholder="000000"
                value={lobbyCode}
                onChange={(e) => setLobbyCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                className="mt-2 bg-input border-border focus:border-secondary text-center text-3xl tracking-[0.5em] font-bold font-mono neon-purple"
                maxLength={6}
              />
            </div>

            <div>
              <Label htmlFor="playerName" className="text-foreground font-mono flex items-center gap-2">
                <Shield className="w-4 h-4 text-secondary" />
                Nom de Code (Hacker)
              </Label>
              <Input
                id="playerName"
                placeholder="Ghost_002"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                className="mt-2 bg-input border-border focus:border-secondary font-mono"
                maxLength={20}
              />
            </div>

            <Button
              onClick={handleJoinLobby}
              disabled={isLoading}
              className="w-full bg-secondary hover:bg-secondary/90 text-secondary-foreground py-6 text-lg font-mono transition-all hover:scale-105 animate-pulse-glow"
            >
              {isLoading ? "CONNEXION..." : "ACCÉDER À LA MISSION"}
            </Button>
          </div>

          <div className="mt-6 p-4 bg-muted/50 border border-border rounded-lg">
            <p className="text-sm text-muted-foreground text-center font-mono">
              <span className="text-secondary">→</span> Code fourni par le chef d'équipe
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JoinLobby;
