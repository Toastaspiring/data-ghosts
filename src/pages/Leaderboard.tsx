import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { Trophy, Medal, Home, Zap } from "lucide-react";

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
    if (index === 0) return <Trophy className="w-10 h-10 text-primary animate-pulse-glow" />;
    if (index === 1) return <Medal className="w-10 h-10 text-secondary" />;
    if (index === 2) return <Medal className="w-10 h-10 text-accent" />;
    return <span className="text-2xl font-bold text-muted-foreground font-mono">#{index + 1}</span>;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-pulse-glow text-6xl mb-4">
            <Trophy className="w-20 h-20 text-primary mx-auto" />
          </div>
          <p className="text-muted-foreground font-mono">Chargement du classement...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4 relative overflow-hidden">
      {/* Animated Background Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0ff_1px,transparent_1px),linear-gradient(to_bottom,#0ff_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_110%)] opacity-10" />
      
      <div className="container mx-auto max-w-4xl py-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="animate-float inline-block mb-4">
            <div className="bg-primary/20 w-24 h-24 rounded-lg flex items-center justify-center animate-pulse-glow">
              <Trophy className="w-14 h-14 text-primary" />
            </div>
          </div>
          <h1 className="text-6xl font-bold mb-4 neon-cyan font-mono">
            CLASSEMENT GLOBAL
          </h1>
          <p className="text-xl text-muted-foreground font-mono">
            <Zap className="inline w-5 h-5 text-accent mr-2" />
            Les meilleurs Data Ghosts
          </p>
        </div>

        {/* Leaderboard */}
        <div className="bg-card border-2 border-primary/30 rounded-lg p-8 cartoon-shadow mb-6">
          {entries.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-lg text-muted-foreground font-mono">
                Aucune mission terminée pour le moment
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {entries.map((entry, index) => (
                <div
                  key={entry.id}
                  className={`flex items-center gap-4 p-6 rounded-lg transition-all hover:scale-105 border-2 ${
                    index === 0
                      ? "bg-gradient-to-r from-primary/20 to-primary/10 border-primary animate-pulse-glow"
                      : index === 1
                      ? "bg-gradient-to-r from-secondary/20 to-secondary/10 border-secondary"
                      : index === 2
                      ? "bg-gradient-to-r from-accent/20 to-accent/10 border-accent"
                      : "bg-muted/50 border-border"
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
                            className="bg-primary/20 border border-primary text-primary px-3 py-1 rounded text-sm font-semibold font-mono"
                          >
                            {name}
                          </span>
                        ))}
                    </div>
                    <div className="flex gap-4 text-sm text-muted-foreground font-mono">
                      <span className="flex items-center gap-1">
                        <Zap className="w-4 h-4 text-accent" />
                        Score: {entry.score}
                      </span>
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
            className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground py-6 text-lg font-mono transition-all hover:scale-105 animate-pulse-glow"
          >
            <Home className="mr-2 h-5 w-5" />
            RETOUR AU MENU
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;
