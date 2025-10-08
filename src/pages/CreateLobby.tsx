import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { ArrowLeft, Users } from "lucide-react";

const CreateLobby = () => {
  const [lobbyName, setLobbyName] = useState("");
  const [playerName, setPlayerName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const generateLobbyCode = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
  };

  const handleCreateLobby = async () => {
    if (!lobbyName.trim() || !playerName.trim()) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const code = generateLobbyCode();
      const playerId = crypto.randomUUID();

      const { data, error } = await supabase
        .from("lobbies")
        .insert([{
          name: lobbyName,
          code: parseInt(code),
          solution: "voyage",
          status: "waiting",
          players: [{
            id: playerId,
            name: playerName,
            ready: false,
            score: 0,
            isHost: true,
          }] as any,
          game_state: {
            riddles: [],
            totalTime: 0,
          } as any,
          current_room: 1,
        }])
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Lobby créé !",
        description: `Code du lobby : ${code}`,
      });

      // Store player info in sessionStorage
      sessionStorage.setItem("playerId", playerId);
      sessionStorage.setItem("playerName", playerName);

      navigate(`/lobby/${data.id}`);
    } catch (error) {
      console.error("Error creating lobby:", error);
      toast({
        title: "Erreur",
        description: "Impossible de créer le lobby",
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
            <div className="bg-primary/20 w-16 h-16 rounded-full flex items-center justify-center">
              <Users className="w-8 h-8 text-primary" />
            </div>
          </div>

          <h1 className="text-3xl font-bold text-center mb-8 text-foreground">
            Créer un Lobby
          </h1>

          <div className="space-y-6">
            <div>
              <Label htmlFor="lobbyName" className="text-foreground">
                Nom du Lobby
              </Label>
              <Input
                id="lobbyName"
                placeholder="Aventuriers du Monde"
                value={lobbyName}
                onChange={(e) => setLobbyName(e.target.value)}
                className="mt-2 rounded-xl"
                maxLength={50}
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
              onClick={handleCreateLobby}
              disabled={isLoading}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl py-6 text-lg transition-all hover:scale-105"
            >
              {isLoading ? "Création..." : "Créer le Lobby"}
            </Button>
          </div>

          <div className="mt-6 p-4 bg-muted rounded-xl">
            <p className="text-sm text-muted-foreground text-center">
              Un code à 6 chiffres sera généré pour que vos amis puissent rejoindre
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateLobby;
