import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { ArrowLeft, Shield, Code } from "lucide-react";
import { AudioButton } from "@/components/ui/AudioButton";

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
    <div className="min-h-screen bg-background flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated Background Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0ff_1px,transparent_1px),linear-gradient(to_bottom,#0ff_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_110%)] opacity-10" />
      
      <div className="w-full max-w-md relative z-10">
        <Button
          variant="ghost"
          onClick={() => navigate("/")}
          className="mb-6 text-muted-foreground hover:text-primary font-mono border border-border hover:border-primary transition-all"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Retour
        </Button>

        <div className="bg-card border-2 border-primary/30 rounded-lg p-8 cartoon-shadow animate-fade-in-up">
          <div className="flex items-center justify-center mb-6">
            <div className="bg-primary/20 w-20 h-20 rounded-lg flex items-center justify-center animate-pulse-glow">
              <Shield className="w-10 h-10 text-primary" />
            </div>
          </div>

          <h1 className="text-4xl font-bold text-center mb-2 neon-cyan font-mono">
            CRÉER MISSION
          </h1>
          <p className="text-center text-muted-foreground mb-8 font-mono text-sm">
            Initialiser une nouvelle opération
          </p>

          <div className="space-y-6">
            <div>
              <Label htmlFor="lobbyName" className="text-foreground font-mono flex items-center gap-2">
                <Code className="w-4 h-4 text-primary" />
                Nom de la Mission
              </Label>
              <Input
                id="lobbyName"
                placeholder="Operation Ghost Protocol"
                value={lobbyName}
                onChange={(e) => setLobbyName(e.target.value)}
                className="mt-2 bg-input border-border focus:border-primary font-mono"
                maxLength={50}
              />
            </div>

            <div>
              <Label htmlFor="playerName" className="text-foreground font-mono flex items-center gap-2">
                <Shield className="w-4 h-4 text-secondary" />
                Nom de Code (Hacker)
              </Label>
              <Input
                id="playerName"
                placeholder="Ghost_001"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                className="mt-2 bg-input border-border focus:border-primary font-mono"
                maxLength={20}
              />
            </div>

            <AudioButton
              onClick={handleCreateLobby}
              disabled={isLoading}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-6 text-lg font-mono transition-all hover:scale-105 animate-pulse-glow"
            >
              {isLoading ? "INITIALISATION..." : "DÉMARRER OPÉRATION"}
            </AudioButton>
          </div>

          <div className="mt-6 p-4 bg-muted/50 border border-border rounded-lg">
            <p className="text-sm text-muted-foreground text-center font-mono">
              <span className="text-primary">→</span> Code à 6 chiffres généré automatiquement
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateLobby;
