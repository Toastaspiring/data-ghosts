import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { ArrowLeft, LogIn } from "lucide-react";

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
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Button
          variant="ghost"
          onClick={() => navigate("/")}
          className="mb-6 text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Retour
        </Button>

        <div className="bg-card rounded-3xl p-8 cartoon-shadow">
          <div className="flex items-center justify-center mb-6">
            <div className="bg-secondary/20 w-16 h-16 rounded-full flex items-center justify-center">
              <LogIn className="w-8 h-8 text-secondary" />
            </div>
          </div>

          <h1 className="text-3xl font-bold text-center mb-8 text-foreground">
            Rejoindre un Lobby
          </h1>

          <div className="space-y-6">
            <div>
              <Label htmlFor="lobbyCode" className="text-foreground">
                Code du Lobby
              </Label>
              <Input
                id="lobbyCode"
                placeholder="123456"
                value={lobbyCode}
                onChange={(e) => setLobbyCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                className="mt-2 rounded-xl text-center text-2xl tracking-widest font-bold"
                maxLength={6}
              />
            </div>

            <div>
              <Label htmlFor="playerName" className="text-foreground">
                Votre Nom
              </Label>
              <Input
                id="playerName"
                placeholder="Explorateur"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                className="mt-2 rounded-xl"
                maxLength={20}
              />
            </div>

            <Button
              onClick={handleJoinLobby}
              disabled={isLoading}
              className="w-full bg-secondary hover:bg-secondary/90 text-secondary-foreground rounded-xl py-6 text-lg transition-all hover:scale-105"
            >
              {isLoading ? "Connexion..." : "Rejoindre"}
            </Button>
          </div>

          <div className="mt-6 p-4 bg-muted rounded-xl">
            <p className="text-sm text-muted-foreground text-center">
              Entrez le code à 6 chiffres partagé par l'hôte
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JoinLobby;
