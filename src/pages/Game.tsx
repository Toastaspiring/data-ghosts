import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { RoomProvider } from "@/rooms/core/RoomProvider";
import { RoomLayout } from "@/rooms/components/layout/RoomLayout";
import { getRoomConfig } from "@/rooms/roomLoader";
import { InteractionType } from "@/rooms/core/types";

interface Player {
  id: string;
  name: string;
  score: number;
}

interface Lobby {
  id: string;
  name: string;
  players: Player[];
  status: string;
  player_assignments?: Record<string, number>;
}

const Game = () => {
  const { lobbyId } = useParams<{ lobbyId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [lobby, setLobby] = useState<Lobby | null>(null);
  const [playerName, setPlayerName] = useState("");
  const [playerId] = useState(sessionStorage.getItem("playerId") || "");
  const [activePuzzle, setActivePuzzle] = useState<string | null>(null);
  const [activeElement, setActiveElement] = useState<string | null>(null);

  useEffect(() => {
    if (!lobbyId || !playerId) {
      navigate("/");
      return;
    }

    const fetchLobby = async () => {
      const { data: lobbyData, error } = await supabase
        .from("lobbies")
        .select("*")
        .eq("id", lobbyId)
        .single();

      if (error || !lobbyData) {
        toast({
          title: "Error",
          description: "Game not found",
          variant: "destructive",
        });
        navigate("/");
        return;
      }

      setLobby(lobbyData as any);
      
      // Find current player's name
      const currentPlayer = (lobbyData as any).players.find((p: Player) => p.id === playerId);
      if (currentPlayer) {
        setPlayerName(currentPlayer.name);
      }
    };

    fetchLobby();

    // Subscribe to lobby updates
    const channel = supabase
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

          if (newData.status === "finished") {
            navigate(`/leaderboard/${lobbyId}`);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [lobbyId, playerId, navigate, toast]);

  const handleElementInteract = (elementId: string, interactionType: InteractionType) => {
    console.log("Element interaction:", elementId, interactionType);
    setActiveElement(elementId);
    setActivePuzzle(elementId);
  };

  const handlePuzzleComplete = (puzzleId: string, solution: any) => {
    console.log("Puzzle completed:", puzzleId, solution);
    setActivePuzzle(null);
    setActiveElement(null);
    
    if (solution) {
      toast({
        title: "Mission Completed!",
        description: "Great work, agent. Moving to next objective.",
      });
    }
  };

  const handleGameComplete = async () => {
    if (!lobby) return;

    // Update lobby status to finished
    await supabase.from("lobbies").update({
      status: "finished"
    }).eq("id", lobby.id);

    // Create leaderboard entry
    await supabase.from("leaderboard").insert([{
      lobby_id: lobby.id,
      player_names: lobby.players.map((p: Player) => p.name) as any,
      score: 1000, // Base completion score
      time_taken: 1800, // 30 minutes max
      finished_at: new Date().toISOString(),
    }]);

    navigate(`/leaderboard/${lobbyId}`);
  };

  if (!lobby || !playerName) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4 animate-pulse">🌐</div>
          <h2 className="text-2xl font-bold mb-2 neon-cyan font-mono">Connecting to Global Network...</h2>
          <p className="text-muted-foreground">Establishing secure connection to research stations</p>
        </div>
      </div>
    );
  }

  // Show loading screen for other players if game hasn't started
  if (lobby.status !== "playing") {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4 animate-pulse">⏳</div>
          <h2 className="text-2xl font-bold mb-2 neon-cyan font-mono">Waiting for Mission Start</h2>
          <p className="text-muted-foreground mb-4">Game will begin when host starts the mission</p>
          <Button 
            onClick={() => navigate(`/lobby/${lobbyId}`)}
            variant="outline"
            className="border-primary text-primary hover:bg-primary hover:text-background"
          >
            Return to Lobby
          </Button>
        </div>
      </div>
    );
  }

  // Get assigned room for this player
  const assignedRoomNumber = lobby.player_assignments?.[playerId] || 1;
  const roomConfig = getRoomConfig(assignedRoomNumber);

  if (!roomConfig) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">❌</div>
          <h2 className="text-2xl font-bold mb-2 text-destructive">Room Configuration Error</h2>
          <p className="text-muted-foreground mb-4">Unable to load room configuration</p>
          <Button 
            onClick={() => navigate(`/lobby/${lobbyId}`)}
            variant="outline"
          >
            Return to Lobby
          </Button>
        </div>
      </div>
    );
  }

  return (
    <RoomProvider
      config={roomConfig}
      playerId={playerId}
      onComplete={handleGameComplete}
      onError={(error) => {
        console.error("Room error:", error);
        toast({
          title: "Room Error",
          description: error.message,
          variant: "destructive",
        });
      }}
    >
      <RoomLayout
        onElementInteract={handleElementInteract}
        activePuzzle={activePuzzle}
        activeElement={activeElement}
        onPuzzleComplete={handlePuzzleComplete}
      />
    </RoomProvider>
  );
};

export default Game;