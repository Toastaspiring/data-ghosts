import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Timer, Lightbulb, Trophy, Lock } from "lucide-react";
import { RealtimeChannel } from "@supabase/supabase-js";
import { CaptchaPuzzle } from "@/components/puzzles/CaptchaPuzzle";
import { TikTokPuzzle } from "@/components/puzzles/TikTokPuzzle";
import { ColorGamePuzzle } from "@/components/puzzles/ColorGamePuzzle";
import { CorruptPuzzle } from "@/components/puzzles/CorruptPuzzle";
import { VideoTimecodePuzzle } from "@/components/puzzles/VideoTimecodePuzzle";
import { FinalButtonPuzzle } from "@/components/puzzles/FinalButtonPuzzle";
import { ActionPuzzle } from "@/components/puzzles/ActionPuzzle";
import { SevenDifferencesPuzzle } from "@/components/puzzles/SevenDifferencesPuzzle";
import { AlgorithmPuzzle } from "@/components/puzzles/AlgorithmPuzzle";
import { BiodiversityQuizPuzzle } from "@/components/puzzles/BiodiversityQuizPuzzle";
import { PlayerDashboard } from "@/components/PlayerDashboard";

interface Room {
  id: string;
  room_number: number;
  title: string;
  description: string;
  theme: string;
  code_reward: string | null;
  order_index: number;
}

interface Puzzle {
  id: string;
  room_id: string;
  title: string;
  description: string;
  puzzle_type: string;
  puzzle_data: any;
  answer: string | null;
  hint: string | null;
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
  current_room: number;
  collected_codes: string[];
  completed_puzzles: string[];
  timer_started_at?: string;
  status: string;
  hints_used: number;
  last_hint_time: string | null;
  parallel_mode?: boolean;
  player_assignments?: Record<string, number>;
}

const Game = () => {
  const { lobbyId } = useParams<{ lobbyId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [lobby, setLobby] = useState<Lobby | null>(null);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [currentRoomPuzzles, setCurrentRoomPuzzles] = useState<Puzzle[]>([]);
  const [currentPuzzleIndex, setCurrentPuzzleIndex] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [playerId] = useState(sessionStorage.getItem("playerId") || "");
  const [codeInput, setCodeInput] = useState("");

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

      // Fetch all rooms
      const { data: roomsData, error: roomsError } = await supabase
        .from("rooms")
        .select("*")
        .order("order_index", { ascending: true });

      if (roomsError || !roomsData) {
        toast({
          title: "Erreur",
          description: "Impossible de charger les salles",
          variant: "destructive",
        });
        return;
      }

      setRooms(roomsData as Room[]);

      // Fetch puzzles for current room
      const currentRoom = roomsData.find((r) => r.room_number === (lobbyData as any).current_room);
      if (currentRoom) {
        const { data: puzzlesData, error: puzzlesError } = await supabase
          .from("puzzles")
          .select("*")
          .eq("room_id", currentRoom.id)
          .order("order_index", { ascending: true });

        if (!puzzlesError && puzzlesData) {
          setCurrentRoomPuzzles(puzzlesData as Puzzle[]);
        }
      }

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

  const handlePuzzleSolved = async () => {
    if (!lobby || !currentRoomPuzzles.length) return;

    const currentPuzzle = currentRoomPuzzles[currentPuzzleIndex];
    const completedPuzzles = [...lobby.completed_puzzles, currentPuzzle.id];

    // Update player score
    const updatedPlayers = lobby.players.map((player) =>
      player.id === playerId
        ? { ...player, score: player.score + 100 }
        : player
    );

    // Check if all puzzles in current room are completed
    if (currentPuzzleIndex + 1 >= currentRoomPuzzles.length) {
      const currentRoom = rooms.find((r) => r.room_number === lobby.current_room);
      const collectedCodes = currentRoom?.code_reward 
        ? [...lobby.collected_codes, currentRoom.code_reward]
        : lobby.collected_codes;

      toast({
        title: "Salle Terminée ! 🎉",
        description: currentRoom?.code_reward 
          ? `Code obtenu: ${currentRoom.code_reward}`
          : "Passez à la salle suivante !",
      });

      // Move to next room or finish
      const nextRoom = lobby.current_room + 1;
      if (nextRoom > 4) {
        // Game finished
        await supabase.from("leaderboard").insert([{
          lobby_id: lobby.id,
          player_names: lobby.players.map((p) => p.name) as any,
          score: updatedPlayers.reduce((sum, p) => sum + p.score, 0),
          time_taken: elapsedTime,
          finished_at: new Date().toISOString(),
        }]);

        await supabase.from("lobbies").update({
          status: "finished",
          players: updatedPlayers as any,
          collected_codes: collectedCodes as any,
          completed_puzzles: completedPuzzles as any,
        }).eq("id", lobby.id);
      } else {
        await supabase.from("lobbies").update({
          current_room: nextRoom,
          players: updatedPlayers as any,
          collected_codes: collectedCodes as any,
          completed_puzzles: completedPuzzles as any,
        }).eq("id", lobby.id);

        // Reload puzzles for new room
        const newRoom = rooms.find((r) => r.room_number === nextRoom);
        if (newRoom) {
          const { data: puzzlesData } = await supabase
            .from("puzzles")
            .select("*")
            .eq("room_id", newRoom.id)
            .order("order_index", { ascending: true });

          if (puzzlesData) {
            setCurrentRoomPuzzles(puzzlesData as Puzzle[]);
            setCurrentPuzzleIndex(0);
          }
        }
      }
    } else {
      // Move to next puzzle in room
      setCurrentPuzzleIndex(currentPuzzleIndex + 1);
      await supabase.from("lobbies").update({
        players: updatedPlayers as any,
        completed_puzzles: completedPuzzles as any,
      }).eq("id", lobby.id);

      toast({
        title: "Bravo ! 🎉",
        description: "Énigme résolue !",
      });
    }

    setShowHint(false);
  };

  const handleCodeSubmit = async () => {
    if (!lobby) return;

    if (lobby.collected_codes.includes(codeInput)) {
      toast({
        title: "Code déjà utilisé",
        description: "Ce code a déjà été entré",
        variant: "destructive",
      });
      return;
    }

    const expectedCodes = ["2847", "9153", "6294"];
    if (!expectedCodes.includes(codeInput)) {
      toast({
        title: "Code incorrect",
        description: "Ce code n'est pas valide",
        variant: "destructive",
      });
      return;
    }

    const newCodes = [...lobby.collected_codes, codeInput];
    await supabase.from("lobbies").update({
      collected_codes: newCodes as any,
    }).eq("id", lobby.id);

    setCodeInput("");
    toast({
      title: "Code accepté ! ✅",
      description: `Codes: ${newCodes.length}/3`,
    });

    // If all 3 codes are collected, allow access to room 4
    if (newCodes.length === 3) {
      await supabase.from("lobbies").update({
        current_room: 4,
      }).eq("id", lobby.id);

      const room4 = rooms.find((r) => r.room_number === 4);
      if (room4) {
        const { data: puzzlesData } = await supabase
          .from("puzzles")
          .select("*")
          .eq("room_id", room4.id)
          .order("order_index", { ascending: true });

        if (puzzlesData) {
          setCurrentRoomPuzzles(puzzlesData as Puzzle[]);
          setCurrentPuzzleIndex(0);
        }
      }
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  if (!lobby || !rooms.length) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-pulse-soft text-4xl mb-4">🎮</div>
          <p className="text-muted-foreground">Chargement du jeu...</p>
        </div>
      </div>
    );
  }

  // Phase 3: Check if player is in parallel mode and get assigned room
  const assignedRoom = lobby?.parallel_mode && lobby.player_assignments 
    ? lobby.player_assignments[playerId] 
    : null;

  // Phase 3: In parallel mode, show only assigned room
  const displayRoom = assignedRoom || lobby.current_room;
  const currentRoom = rooms.find((r) => r.room_number === displayRoom);
  const currentPuzzle = currentRoomPuzzles[currentPuzzleIndex];

  // Phase 3: Add assigned room to players for display
  const playersWithRooms = lobby.players.map(player => ({
    ...player,
    assignedRoom: lobby.parallel_mode && lobby.player_assignments 
      ? lobby.player_assignments[player.id] 
      : undefined
  }));

  // Render puzzle based on type
  const renderPuzzle = () => {
    if (!currentPuzzle) return null;

    const puzzleData = currentPuzzle.puzzle_data;

    switch (currentPuzzle.puzzle_type) {
      case "captcha":
        return <CaptchaPuzzle captchaText={puzzleData.captcha_text} onSolve={handlePuzzleSolved} />;
      
      case "tiktok":
        return (
          <TikTokPuzzle
            originalHashtags={puzzleData.original_hashtags}
            sabotageHashtags={puzzleData.sabotage_hashtags}
            onSolve={handlePuzzleSolved}
          />
        );
      
      case "7differences":
        return <SevenDifferencesPuzzle onSolve={handlePuzzleSolved} />;
      
      case "color-game":
        return (
          <ColorGamePuzzle
            targetColor={puzzleData.target_color}
            onSolve={handlePuzzleSolved}
          />
        );
      
      case "corrupt":
        return (
          <CorruptPuzzle
            options={puzzleData.options}
            correctAnswer={currentPuzzle.answer || ""}
            onSolve={handlePuzzleSolved}
          />
        );
      
      case "video-timecode":
        return (
          <VideoTimecodePuzzle
            correctTime={puzzleData.correct_time}
            password={puzzleData.password}
            onSolve={handlePuzzleSolved}
          />
        );
      
      case "action":
        return <ActionPuzzle actionType={puzzleData.action_type} onSolve={handlePuzzleSolved} />;
      
      case "final-button":
        return (
          <FinalButtonPuzzle
            clicksRequired={puzzleData.clicks_required}
            countdownDuration={puzzleData.countdown_duration}
            onSolve={handlePuzzleSolved}
          />
        );
      
      case "algorithm":
        return (
          <AlgorithmPuzzle
            algorithm={puzzleData.algorithm}
            correctSequence={puzzleData.correct_sequence}
            onSolve={handlePuzzleSolved}
          />
        );
      
      case "biodiversity-quiz":
        return (
          <BiodiversityQuizPuzzle
            questions={puzzleData.questions}
            onSolve={handlePuzzleSolved}
          />
        );
      
      default:
        return null;
    }
  };

  // Room 4 requires codes
  if (lobby.current_room === 4 && lobby.collected_codes.length < 3) {
    return (
      <div className="min-h-screen bg-background p-4 relative overflow-hidden">
        {/* Animated Background Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#0ff_1px,transparent_1px),linear-gradient(to_bottom,#0ff_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_110%)] opacity-10" />
        
        <div className="container mx-auto max-w-3xl py-8 flex items-center justify-center min-h-[80vh] relative z-10">
          <div className="bg-card border-2 border-destructive rounded-lg p-12 cartoon-shadow text-center w-full animate-fade-in-up">
            <Lock className="w-32 h-32 text-destructive mx-auto mb-6 animate-pulse-glow" />
            <h1 className="text-5xl font-bold mb-6 neon-pink font-mono">ACCÈS REFUSÉ</h1>
            <p className="text-xl text-muted-foreground mb-8 font-mono">
              Vous devez collecter les 3 tokens des salles précédentes
              <br />
              pour accéder au Control Hub
            </p>
            
            <div className="mb-8">
              <p className="text-lg text-muted-foreground mb-4 font-mono">ENTRER TOKEN:</p>
              <div className="flex gap-4 max-w-md mx-auto">
                <Input
                  value={codeInput}
                  onChange={(e) => setCodeInput(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleCodeSubmit()}
                  placeholder="TOKEN_****"
                  className="bg-input border-2 border-border focus:border-primary py-6 text-lg text-center font-mono"
                  maxLength={4}
                />
                <Button
                  onClick={handleCodeSubmit}
                  disabled={codeInput.length !== 4}
                  className="bg-primary hover:bg-primary/90 py-6 px-8 font-mono"
                >
                  VALIDER
                </Button>
              </div>
            </div>

            <div className="flex justify-center gap-4">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className={`w-20 h-20 rounded-lg flex items-center justify-center text-2xl font-bold border-2 font-mono ${
                    lobby.collected_codes.length >= i
                      ? "bg-primary/20 text-primary border-primary animate-pulse-glow"
                      : "bg-muted/50 text-muted-foreground border-border"
                  }`}
                >
                  {lobby.collected_codes.length >= i ? "✓" : "?"}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4 relative overflow-hidden">
      {/* Animated Background Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0ff_1px,transparent_1px),linear-gradient(to_bottom,#0ff_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_110%)] opacity-10" />
      
      <div className="container mx-auto max-w-3xl py-8 relative z-10">
        {/* Game Header */}
        <div className="flex justify-between items-center mb-6">
          <div className="bg-card border-2 border-primary px-6 py-3 cartoon-shadow animate-pulse-glow rounded-lg">
            <div className="flex items-center gap-2">
              <Timer className="w-5 h-5 text-primary" />
              <span className="text-3xl font-bold neon-cyan font-mono">
                {formatTime(elapsedTime)}
              </span>
            </div>
          </div>

          <div className="bg-card border-2 border-secondary px-6 py-3 cartoon-shadow rounded-lg">
            <p className="text-sm text-muted-foreground mb-1 font-mono">SALLE</p>
            <p className="text-2xl font-bold neon-purple font-mono text-center">
              {lobby.current_room} / 4
            </p>
          </div>
        </div>

        {/* Room Info */}
        {currentRoom && (
          <div className="bg-card border-2 border-primary/30 rounded-lg p-6 cartoon-shadow mb-6">
            {lobby.parallel_mode && assignedRoom && (
              <div className="mb-4 bg-primary/10 border-2 border-primary rounded-lg p-3">
                <p className="text-sm font-semibold text-primary font-mono">
                  🎯 VOTRE MISSION: SALLE {assignedRoom}
                </p>
              </div>
            )}
            <h2 className="text-3xl font-bold text-foreground mb-2 font-mono">{currentRoom.title}</h2>
            <p className="text-muted-foreground">{currentRoom.description}</p>
            <div className="mt-4 flex gap-2">
              <span className="text-sm text-primary font-semibold font-mono bg-primary/10 px-3 py-1 rounded border border-primary">
                ÉNIGME {currentPuzzleIndex + 1}/{currentRoomPuzzles.length}
              </span>
            </div>
          </div>
        )}

        {/* Phase 3: Player Dashboard */}
        {lobby.parallel_mode ? (
          <PlayerDashboard players={playersWithRooms} currentPlayerId={playerId} />
        ) : (
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
        )}

        {/* Puzzle */}
        {renderPuzzle()}

        {/* Hint Button */}
        {currentPuzzle?.hint && !showHint && (
          <Button
            onClick={() => setShowHint(true)}
            variant="outline"
            className="w-full mt-4 border-2 border-accent text-accent hover:bg-accent hover:text-accent-foreground py-6 font-mono transition-all hover:scale-105"
          >
            <Lightbulb className="w-5 h-5 mr-2" />
            AFFICHER INDICE
          </Button>
        )}

        {showHint && currentPuzzle?.hint && (
          <div className="bg-accent/10 rounded-lg p-4 mt-4 border-2 border-accent animate-fade-in-up">
            <div className="flex items-start gap-2">
              <Lightbulb className="w-5 h-5 text-accent flex-shrink-0 mt-1" />
              <p className="text-accent-foreground font-mono">{currentPuzzle.hint}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Game;
