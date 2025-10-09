import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useAudioManager } from "@/hooks/useAudioManager";
import { supabase } from "@/integrations/supabase/client";
import { MapPin, Users, Check, Play, Volume2 } from "lucide-react";
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
  players: Player[];
  status: string;
  player_assignments?: Record<string, number>;
}

interface Room {
  number: number;
  name: string;
  description: string;
  threat: string;
  color: string;
}

const rooms: Room[] = [
  {
    number: 1,
    name: "La Ferme TikTok - Bali",
    description: "Sabotez la production de TikToks promotionnels pour les récifs coralliens de Bali",
    threat: "Désinformation touristique massive",
    color: "from-pink-500 to-cyan-400",
  },
  {
    number: 2,
    name: "Les Scènes Fake - Santorin", 
    description: "Perturbez les faux décors utilisés pour créer des TikToks trompeurs de Santorin",
    threat: "Manipulation visuelle des falaises",
    color: "from-green-500 to-emerald-400",
  },
  {
    number: 3,
    name: "Salle des Monteurs - Machu Picchu",
    description: "Corrompez le montage des TikToks du Machu Picchu pour révéler la surpopulation",
    threat: "Dissimulation de la dégradation",
    color: "from-purple-500 to-violet-400",
  },
];

const RoomSelection = () => {
  const { lobbyId } = useParams<{ lobbyId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { playMusic, isAudioUnlocked } = useAudioManager();
  const [lobby, setLobby] = useState<Lobby | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [playerId] = useState(sessionStorage.getItem("playerId") || "");
  const [selectedRoom, setSelectedRoom] = useState<number | null>(null);
  const [draggedPlayerId, setDraggedPlayerId] = useState<string | null>(null);
  const [dragOverRoom, setDragOverRoom] = useState<number | null>(null);
  const [musicTransitioning, setMusicTransitioning] = useState(false);

  // Initialize room selection music
  useEffect(() => {
    const initializeRoomSelectionMusic = async () => {
      setMusicTransitioning(true);
      
      setTimeout(() => {
        if (isAudioUnlocked) {
          playMusic('roomSelection');
        }
        setMusicTransitioning(false);
      }, 400);
    };

    if (!isLoading) {
      initializeRoomSelectionMusic();
    }
  }, [isLoading, playMusic, isAudioUnlocked]);

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
      
      // Set selected room if already assigned
      if (data.player_assignments && data.player_assignments[playerId]) {
        setSelectedRoom(data.player_assignments[playerId]);
      }
      
      setIsLoading(false);
    };

    fetchLobby();

    // Subscribe to realtime updates
    channel = supabase
      .channel(`room-selection-${lobbyId}`)
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
          
          // If player assignment exists, update selected room
          if (newData.player_assignments && newData.player_assignments[playerId]) {
            setSelectedRoom(newData.player_assignments[playerId]);
          }
          
          // If game has started, navigate to game page
          if (newData.status === "playing") {
            navigate(`/game/${lobbyId}`);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [lobbyId, playerId, navigate, toast]);

  const handleRoomSelect = async (roomNumber: number | null, targetPlayerId: string) => {
    if (!lobby) return;

    const currentAssignments = lobby.player_assignments || {};
    
    // If roomNumber is null, we're unassigning the player
    if (roomNumber === null) {
      const updatedAssignments = { ...currentAssignments };
      delete updatedAssignments[targetPlayerId];
      
      const { error } = await supabase
        .from("lobbies")
        .update({ player_assignments: updatedAssignments })
        .eq("id", lobby.id);

      if (error) {
        toast({
          title: "Erreur",
          description: "Impossible de désassigner le joueur",
          variant: "destructive",
        });
      }
      return;
    }
    
    // Check if room is already taken by someone else
    const roomOccupantId = Object.keys(currentAssignments).find(
      (id) => currentAssignments[id] === roomNumber
    );
    if (roomOccupantId && roomOccupantId !== targetPlayerId) {
      toast({
        title: "Salle occupée",
        description: "Cette salle a déjà été choisie par un autre agent",
        variant: "destructive",
      });
      return;
    }

    // Update player's room assignment
    const updatedAssignments = {
      ...currentAssignments,
      [targetPlayerId]: roomNumber,
    };

    const { error } = await supabase
      .from("lobbies")
      .update({ player_assignments: updatedAssignments as any })
      .eq("id", lobby.id);

    if (error) {
      toast({
        title: "Erreur",
        description: "Impossible de sélectionner la salle",
        variant: "destructive",
      });
      return;
    }

    if (targetPlayerId === playerId) {
      setSelectedRoom(roomNumber);
      toast({
        title: "Salle sélectionnée !",
        description: `Vous avez choisi ${rooms.find(r => r.number === roomNumber)?.name}`,
      });
    }
  };

  const handleDragStart = (e: React.DragEvent, pId: string) => {
    if (pId !== playerId) return; // Only allow dragging own card
    setDraggedPlayerId(pId);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragEnd = () => {
    setDraggedPlayerId(null);
    setDragOverRoom(null);
  };

  const handleDragOver = (e: React.DragEvent, roomNumber: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    setDragOverRoom(roomNumber);
  };

  const handleDragLeave = () => {
    setDragOverRoom(null);
  };

  const handleDrop = async (e: React.DragEvent, roomNumber: number) => {
    e.preventDefault();
    setDragOverRoom(null);
    
    if (!draggedPlayerId || draggedPlayerId !== playerId) return;
    
    await handleRoomSelect(roomNumber, draggedPlayerId);
    setDraggedPlayerId(null);
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

    const assignments = lobby.player_assignments || {};
    const assignedCount = Object.keys(assignments).length;

    if (assignedCount !== lobby.players.length) {
      toast({
        title: "Attention",
        description: "Tous les joueurs doivent choisir une salle",
        variant: "destructive",
      });
      return;
    }

    // Add music transition effect before starting game
    setMusicTransitioning(true);
    
    // Start game music transition
    setTimeout(() => {
      playMusic('game');
    }, 300);

    const { error } = await supabase
      .from("lobbies")
      .update({ 
        status: "playing",
        parallel_mode: true 
      })
      .eq("id", lobby.id);

    if (error) {
      toast({
        title: "Erreur",
        description: "Impossible de démarrer la partie",
        variant: "destructive",
      });
      setMusicTransitioning(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-pulse-glow text-4xl mb-4">
            <MapPin className="w-20 h-20 text-primary mx-auto" />
          </div>
          <p className="text-muted-foreground font-mono">Chargement...</p>
        </div>
      </div>
    );
  }

  if (!lobby) return null;

  const currentPlayer = lobby.players.find((p) => p.id === playerId);
  const isHost = currentPlayer?.isHost || false;
  const assignments = lobby.player_assignments || {};
  const allAssigned = Object.keys(assignments).length === lobby.players.length;

  // Get player name for each room
  const getRoomPlayer = (roomNumber: number) => {
    const playerId = Object.keys(assignments).find(
      (id) => assignments[id] === roomNumber
    );
    return lobby.players.find((p) => p.id === playerId);
  };

  return (
    <div className="min-h-screen bg-background p-4 relative overflow-hidden">
      {/* Animated Background Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0ff_1px,transparent_1px),linear-gradient(to_bottom,#0ff_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_110%)] opacity-10" />
      
      {/* Music Transition Visual Effect */}
      {musicTransitioning && (
        <div className="absolute inset-0 z-20 pointer-events-none">
          <div className="absolute top-8 right-8 flex items-center gap-3 bg-secondary/20 border-2 border-secondary px-4 py-2 rounded-lg animate-pulse-glow">
            <Volume2 className="w-5 h-5 text-secondary animate-pulse" />
            <span className="text-sm font-mono text-secondary">Mission briefing...</span>
          </div>
          <div className="absolute inset-0 bg-gradient-to-r from-secondary/5 via-accent/5 to-primary/5 animate-pulse" />
        </div>
      )}
      
      <div className="container mx-auto max-w-6xl py-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-primary/20 border border-primary rounded-full px-4 py-2 mb-6">
            <MapPin className="w-5 h-5 text-primary animate-pulse" />
            <span className="text-sm font-mono text-primary">PHASE DE SÉLECTION</span>
          </div>
          
          <h1 className="text-5xl font-bold mb-4 neon-cyan font-mono">
            CHOISISSEZ VOTRE MISSION
          </h1>
          <p className="text-xl text-muted-foreground font-mono">
            Chaque agent doit infiltrer une salle différente pour détruire Insta-Vibe
          </p>
        </div>

        {/* Unassigned Players Pool */}
        <div 
          className="bg-card border-2 border-primary/30 rounded-lg p-6 mb-8 transition-all"
          onDragOver={(e) => {
            e.preventDefault();
            e.dataTransfer.dropEffect = "move";
            setDragOverRoom(-1); // Use -1 to indicate unassigned area
          }}
          onDragLeave={() => setDragOverRoom(null)}
          onDrop={async (e) => {
            e.preventDefault();
            setDragOverRoom(null);
            
            if (!draggedPlayerId || draggedPlayerId !== playerId) return;
            
            // Unassign the player by setting their room to null
            await handleRoomSelect(null, draggedPlayerId);
            setDraggedPlayerId(null);
          }}
          style={{
            borderColor: dragOverRoom === -1 ? 'var(--primary)' : undefined,
            backgroundColor: dragOverRoom === -1 ? 'rgba(var(--primary-rgb), 0.1)' : undefined,
          }}
        >
          <h2 className="text-xl font-bold mb-4 neon-cyan font-mono flex items-center gap-2">
            <Users className="w-5 h-5" />
            AGENTS EN ATTENTE
          </h2>
          <div className="flex flex-wrap gap-4">
            {lobby.players
              .filter((player) => !assignments[player.id])
              .map((player) => (
                <div
                  key={player.id}
                  draggable={player.id === playerId}
                  onDragStart={(e) => handleDragStart(e, player.id)}
                  onDragEnd={handleDragEnd}
                  className={`bg-gradient-to-r from-primary/20 to-secondary/20 border-2 border-primary rounded-lg p-4 flex items-center gap-3 min-w-[200px] transition-all ${
                    player.id === playerId
                      ? "cursor-grab active:cursor-grabbing hover:scale-105 hover:shadow-lg hover:shadow-primary/50"
                      : "opacity-70 cursor-not-allowed"
                  } ${draggedPlayerId === player.id ? "opacity-50 scale-95" : ""}`}
                >
                  <div className="bg-primary/30 border-2 border-primary w-12 h-12 rounded-lg flex items-center justify-center">
                    <Users className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground font-mono">
                      {player.name}
                    </p>
                    <p className="text-xs text-muted-foreground font-mono">
                      {player.id === playerId ? "Glissez vers une mission" : "En attente"}
                    </p>
                  </div>
                </div>
              ))}
            {lobby.players.filter((player) => !assignments[player.id]).length === 0 && (
              <p className="text-muted-foreground font-mono text-sm">
                Tous les agents ont été assignés à une mission
              </p>
            )}
          </div>
        </div>

        {/* Rooms Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {rooms.map((room) => {
            const assignedPlayer = getRoomPlayer(room.number);
            const isSelected = selectedRoom === room.number;
            const isTaken = !!assignedPlayer;
            const isDragOver = dragOverRoom === room.number;

            return (
              <div
                key={room.number}
                onDragOver={(e) => handleDragOver(e, room.number)}
                onDragLeave={handleDragLeave}
                onDrop={(e) => handleDrop(e, room.number)}
                className={`bg-card border-2 rounded-lg p-6 transition-all ${
                  isDragOver
                    ? "border-primary scale-105 bg-primary/5 shadow-lg shadow-primary/50"
                    : isSelected
                    ? "border-primary scale-105"
                    : isTaken
                    ? "border-muted"
                    : "border-border hover:border-primary/50"
                }`}
              >
                <div className={`h-2 rounded-full bg-gradient-to-r ${room.color} mb-4`} />
                
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-2xl font-bold text-foreground font-mono">
                    {room.name}
                  </h3>
                  {isSelected && (
                    <Check className="w-6 h-6 text-primary animate-pulse" />
                  )}
                </div>

                <p className="text-muted-foreground mb-4 font-mono text-sm">
                  {room.description}
                </p>

                <div className="bg-destructive/20 border border-destructive/50 rounded px-3 py-2 mb-4">
                  <p className="text-sm font-mono text-destructive font-semibold">
                    {room.threat}
                  </p>
                </div>

                {/* Drop Zone / Assigned Player */}
                <div
                  className={`min-h-[80px] rounded-lg border-2 border-dashed flex items-center justify-center transition-all ${
                    isDragOver
                      ? "border-primary bg-primary/10 scale-105"
                      : assignedPlayer
                      ? "border-primary bg-primary/5"
                      : "border-muted-foreground/30 bg-muted/30"
                  }`}
                >
                  {assignedPlayer ? (
                    <div 
                      className="flex items-center gap-3 p-3 cursor-move"
                      draggable
                      onDragStart={(e) => handleDragStart(e, assignedPlayer.id)}
                    >
                      <div className="bg-primary/30 border-2 border-primary w-10 h-10 rounded-lg flex items-center justify-center">
                        <Users className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-semibold text-foreground font-mono">
                          {assignedPlayer.name}
                        </p>
                        <p className="text-xs text-muted-foreground font-mono">
                          {assignedPlayer.id === playerId ? "Vous" : "Assigné"}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground font-mono text-center px-4">
                      {isDragOver ? "Déposez ici" : "Glissez un agent ici"}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Actions */}
        {isHost && (
          <Button
            onClick={startGame}
            disabled={!allAssigned}
            className="w-full bg-accent hover:bg-accent/90 text-accent-foreground py-7 text-lg font-mono transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed animate-pulse-glow"
          >
            <Play className="mr-2 h-6 w-6" />
            LANCER L'OPÉRATION
          </Button>
        )}

        {!isHost && (
          <div className="text-center">
            <p className="text-muted-foreground font-mono">
              {allAssigned
                ? "En attente du chef d'équipe..."
                : "Sélectionnez votre salle pour continuer"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RoomSelection;
