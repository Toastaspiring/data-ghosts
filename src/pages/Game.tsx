import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Timer, Lightbulb, Trophy } from "lucide-react";
import { RealtimeChannel } from "@supabase/supabase-js";

interface Riddle {
  id: string;
  title: string;
  description: string;
  question: string;
  answer: string;
  hint: string | null;
  category: string;
  order_index: number;
}

interface Player {
  id: string;
  name: string;
  score: number;
}

interface Lobby {
  id: string;
  name: string;
  players: Player[];
  current_riddle?: number;
  timer_started_at?: string;
  status: string;
}

const Game = () => {
  const { lobbyId } = useParams<{ lobbyId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [lobby, setLobby] = useState<Lobby | null>(null);
  const [riddles, setRiddles] = useState<Riddle[]>([]);
  const [currentRiddleIndex, setCurrentRiddleIndex] = useState(0);
  const [answer, setAnswer] = useState("");
  const [showHint, setShowHint] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [playerId] = useState(sessionStorage.getItem("playerId") || "");

  useEffect(() => {
    if (!lobbyId || !playerId) {
      navigate("/");
      return;
    }

    let channel: RealtimeChannel;
    let timerInterval: NodeJS.Timeout;

    const fetchData = async () => {
      // Fetch lobby
      const { data: lobbyData, error: lobbyError } = await supabase
        .from("lobbies")
        .select("*")
        .eq("id", lobbyId)
        .single();

      if (lobbyError || !lobbyData) {
        toast({
          title: "Erreur",
          description: "Partie introuvable",
          variant: "destructive",
        });
        navigate("/");
        return;
      }

      setLobby(lobbyData as any);
      setCurrentRiddleIndex((lobbyData as any).current_riddle || 0);

      // Fetch riddles
      const { data: riddlesData, error: riddlesError } = await (supabase as any)
        .from("riddles")
        .select("*")
        .order("order_index", { ascending: true });

      if (riddlesError || !riddlesData) {
        toast({
          title: "Erreur",
          description: "Impossible de charger les énigmes",
          variant: "destructive",
        });
        return;
      }

      setRiddles(riddlesData as any);

      // Start timer
      if ((lobbyData as any).timer_started_at) {
        timerInterval = setInterval(() => {
          const start = new Date((lobbyData as any).timer_started_at).getTime();
          const now = new Date().getTime();
          setElapsedTime(Math.floor((now - start) / 1000));
        }, 1000);
      }
    };

    fetchData();

    // Subscribe to realtime updates
    channel = supabase
      .channel(`game-${lobbyId}`)
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "lobbies",
          filter: `id=eq.${lobbyId}`,
        },
        (payload) => {
          const newData = payload.new as any;
          setLobby(newData as Lobby);
          setCurrentRiddleIndex(newData.current_riddle || 0);

          // If game is finished, navigate to leaderboard
          if (newData.status === "finished") {
            navigate(`/leaderboard/${lobbyId}`);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
      if (timerInterval) clearInterval(timerInterval);
    };
  }, [lobbyId, playerId, navigate, toast]);

  const normalizeAnswer = (str: string) => {
    return str
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .trim();
  };

  const handleSubmitAnswer = async () => {
    if (!lobby || !riddles.length || !answer.trim()) return;

    const currentRiddle = riddles[currentRiddleIndex];
    const isCorrect =
      normalizeAnswer(answer) === normalizeAnswer(currentRiddle.answer);

    if (isCorrect) {
      toast({
        title: "Bravo ! 🎉",
        description: "Réponse correcte !",
      });

      // Update player score
      const updatedPlayers = lobby.players.map((player) =>
        player.id === playerId
          ? { ...player, score: player.score + 100 }
          : player
      );

      // Check if this was the last riddle
      const nextRiddleIndex = currentRiddleIndex + 1;
      const isLastRiddle = nextRiddleIndex >= riddles.length;

      const updates: any = {
        players: updatedPlayers,
        current_riddle: nextRiddleIndex,
      };

      if (isLastRiddle) {
        updates.status = "finished";

        // Save to leaderboard
        await supabase.from("leaderboard").insert([{
          lobby_id: lobby.id,
          player_names: lobby.players.map((p) => p.name) as any,
          score: updatedPlayers.reduce((sum, p) => sum + p.score, 0),
          time_taken: elapsedTime,
          finished_at: new Date().toISOString(),
        }]);
      }

      await supabase.from("lobbies").update(updates).eq("id", lobby.id);

      setAnswer("");
      setShowHint(false);
    } else {
      toast({
        title: "Incorrect",
        description: "Essayez encore !",
        variant: "destructive",
      });
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  if (!lobby || !riddles.length) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-pulse-soft text-4xl mb-4">🎮</div>
          <p className="text-muted-foreground">Chargement du jeu...</p>
        </div>
      </div>
    );
  }

  if (currentRiddleIndex >= riddles.length) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Trophy className="w-20 h-20 text-accent mx-auto mb-4 animate-pulse-soft" />
          <h1 className="text-4xl font-bold mb-4 text-foreground">Terminé !</h1>
          <p className="text-muted-foreground">Redirection...</p>
        </div>
      </div>
    );
  }

  const currentRiddle = riddles[currentRiddleIndex];

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="container mx-auto max-w-3xl py-8">
        {/* Game Header */}
        <div className="flex justify-between items-center mb-6">
          <div className="bg-card rounded-2xl px-6 py-3 cartoon-shadow">
            <div className="flex items-center gap-2">
              <Timer className="w-5 h-5 text-primary" />
              <span className="text-2xl font-bold text-foreground">
                {formatTime(elapsedTime)}
              </span>
            </div>
          </div>

          <div className="bg-card rounded-2xl px-6 py-3 cartoon-shadow">
            <p className="text-sm text-muted-foreground mb-1">Énigme</p>
            <p className="text-xl font-bold text-foreground">
              {currentRiddleIndex + 1} / {riddles.length}
            </p>
          </div>
        </div>

        {/* Players Scores */}
        <div className="bg-card rounded-3xl p-6 cartoon-shadow mb-6">
          <div className="flex justify-around">
            {lobby.players.map((player) => (
              <div key={player.id} className="text-center">
                <p className="text-sm text-muted-foreground mb-1">{player.name}</p>
                <p className="text-2xl font-bold text-primary">{player.score}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Riddle Card */}
        <div className="bg-card rounded-3xl p-8 cartoon-shadow mb-6">
          <div className="mb-4">
            <span className="inline-block bg-secondary/20 text-secondary px-4 py-2 rounded-full text-sm font-semibold">
              {currentRiddle.category}
            </span>
          </div>

          <h2 className="text-3xl font-bold mb-4 text-foreground">
            {currentRiddle.title}
          </h2>

          <p className="text-lg text-muted-foreground mb-6">
            {currentRiddle.description}
          </p>

          <div className="bg-primary/10 rounded-2xl p-6 mb-6">
            <p className="text-xl font-semibold text-foreground">
              {currentRiddle.question}
            </p>
          </div>

          {showHint && currentRiddle.hint && (
            <div className="bg-accent/10 rounded-2xl p-4 mb-6 border-2 border-accent">
              <div className="flex items-start gap-2">
                <Lightbulb className="w-5 h-5 text-accent flex-shrink-0 mt-1" />
                <p className="text-accent-foreground">{currentRiddle.hint}</p>
              </div>
            </div>
          )}

          <div className="space-y-4">
            <Input
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSubmitAnswer()}
              placeholder="Votre réponse..."
              className="rounded-xl py-6 text-lg"
            />

            <div className="flex gap-3">
              <Button
                onClick={handleSubmitAnswer}
                disabled={!answer.trim()}
                className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl py-6 text-lg transition-all hover:scale-105"
              >
                Valider
              </Button>

              {currentRiddle.hint && !showHint && (
                <Button
                  onClick={() => setShowHint(true)}
                  variant="outline"
                  className="border-2 border-accent text-accent hover:bg-accent hover:text-accent-foreground rounded-xl px-6"
                >
                  <Lightbulb className="w-5 h-5" />
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Game;
