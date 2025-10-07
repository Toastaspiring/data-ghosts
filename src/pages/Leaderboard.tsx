import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { Trophy, Medal, Home } from "lucide-react";

interface LeaderboardEntry {
  id: number;
  player_names: string[];
  score: number;
  time_taken: number;
  finished_at: string;
}

const Leaderboard = () => {
  const { lobbyId } = useParams<{ lobbyId: string }>();
  const navigate = useNavigate();
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      const { data, error } = await supabase
        .from("leaderboard")
        .select("*")
        .order("score", { ascending: false })
        .order("time_taken", { ascending: true })
        .limit(10);

      if (!error && data) {
        setEntries(data as any);
      }
      setIsLoading(false);
    };

    fetchLeaderboard();
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const getMedalIcon = (index: number) => {
    if (index === 0) return <Trophy className="w-8 h-8 text-yellow-500" />;
    if (index === 1) return <Medal className="w-8 h-8 text-gray-400" />;
    if (index === 2) return <Medal className="w-8 h-8 text-amber-700" />;
    return <span className="text-2xl font-bold text-muted-foreground">#{index + 1}</span>;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-pulse-soft text-4xl mb-4">🏆</div>
          <p className="text-muted-foreground">Chargement du classement...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="container mx-auto max-w-4xl py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="animate-float inline-block mb-4">
            <Trophy className="w-20 h-20 text-accent" />
          </div>
          <h1 className="text-5xl font-bold mb-4 text-foreground">
            Classement Général
          </h1>
          <p className="text-xl text-muted-foreground">
            Les meilleurs explorateurs du monde
          </p>
        </div>

        {/* Leaderboard */}
        <div className="bg-card rounded-3xl p-8 cartoon-shadow mb-6">
          {entries.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-lg text-muted-foreground">
                Aucune partie terminée pour le moment
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {entries.map((entry, index) => (
                <div
                  key={entry.id}
                  className={`flex items-center gap-4 p-6 rounded-2xl transition-all hover:scale-105 ${
                    index === 0
                      ? "bg-gradient-to-r from-yellow-500/20 to-amber-500/20 border-2 border-yellow-500/50"
                      : index === 1
                      ? "bg-gradient-to-r from-gray-400/20 to-gray-500/20 border-2 border-gray-400/50"
                      : index === 2
                      ? "bg-gradient-to-r from-amber-700/20 to-amber-800/20 border-2 border-amber-700/50"
                      : "bg-muted"
                  }`}
                >
                  <div className="flex-shrink-0 w-16 flex justify-center">
                    {getMedalIcon(index)}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap gap-2 mb-2">
                      {Array.isArray(entry.player_names) &&
                        entry.player_names.map((name, i) => (
                          <span
                            key={i}
                            className="bg-primary/20 text-primary px-3 py-1 rounded-full text-sm font-semibold"
                          >
                            {name}
                          </span>
                        ))}
                    </div>
                    <div className="flex gap-4 text-sm text-muted-foreground">
                      <span>Score: {entry.score}</span>
                      <span>Temps: {formatTime(entry.time_taken)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-4">
          <Button
            onClick={() => navigate("/")}
            className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl py-6 text-lg transition-all hover:scale-105"
          >
            <Home className="mr-2 h-5 w-5" />
            Retour à l'Accueil
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;
