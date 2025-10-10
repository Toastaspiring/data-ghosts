import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Flame, Zap, Skull, CheckCircle, Trophy, Terminal, Lock, AlertTriangle, Users } from "lucide-react";
import { useAudioManager } from "@/hooks/useAudioManager";

interface Player {
  id: string;
  name: string;
  score: number;
  isHost?: boolean;
}

interface Lobby {
  id: string;
  name: string;
  players: Player[];
  status: string;
  game_state?: any;
}

interface CodeSlot {
  id: string;
  name: string;
  filled: boolean;
  code?: string;
}

const FinalDestruction = () => {
  const { lobbyId } = useParams<{ lobbyId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { playMusic, isAudioUnlocked } = useAudioManager();
  const [lobby, setLobby] = useState<Lobby | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [playerId] = useState(sessionStorage.getItem("playerId") || "");
  const [destructionStarted, setDestructionStarted] = useState(false);
  const [destructionComplete, setDestructionComplete] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showTeamNameModal, setShowTeamNameModal] = useState(false);
  const [teamName, setTeamName] = useState("");
  const [pageTrembling, setPageTrembling] = useState(false);
  const [completionTime, setCompletionTime] = useState<string>("");
  const [playerRoomAssignment, setPlayerRoomAssignment] = useState<number | null>(null);
  
  // Code management - map codes to room numbers
  const [availableCodes] = useState([
    { id: "tiktok", name: "Code TikTok", value: "ALM-001", roomNumber: 1 },
    { id: "scenes", name: "Code Scènes", value: "FLR-002", roomNumber: 2 }, 
    { id: "editing", name: "Code Montage", value: "VID-003", roomNumber: 3 }
  ]);
  
  const [codeSlots, setCodeSlots] = useState<CodeSlot[]>([
    { id: "slot1", name: "SLOT 1", filled: false },
    { id: "slot2", name: "SLOT 2", filled: false },
    { id: "slot3", name: "SLOT 3", filled: false }
  ]);
  
  const [draggedCode, setDraggedCode] = useState<string | null>(null);

  // Check if all slots are filled
  const allSlotsFilled = codeSlots.every(slot => slot.filled);

  // Initialize dramatic music
  useEffect(() => {
    if (!isLoading && isAudioUnlocked) {
      // Play intense final destruction music
      playMusic('gameOver'); // or create a specific final-destruction track
    }
  }, [isLoading, playMusic, isAudioUnlocked]);

  useEffect(() => {
    if (!lobbyId || !playerId) {
      navigate("/");
      return;
    }

    const fetchLobby = async () => {
      const { data, error } = await supabase
        .from("lobbies")
        .select("*")
        .eq("id", lobbyId)
        .single();

      if (error) {
        console.error("Error fetching lobby:", error);
        toast({
          title: "Erreur",
          description: "Impossible de charger les données du lobby",
          variant: "destructive",
        });
        navigate("/");
        return;
      }

      setLobby(data as any);
      setIsLoading(false);

      // Check if destruction has already been triggered
      const gameState = (data.game_state as any) || {};
      if (gameState.destruction_started) {
        setDestructionStarted(true);
      }
      if (gameState.destruction_complete) {
        setDestructionComplete(true);
      }
      // Load existing completion time if available
      if (gameState.game_completion_time) {
        setCompletionTime(gameState.game_completion_time);
      }
      // Load existing team name if available
      if (gameState.team_name) {
        setTeamName(gameState.team_name);
      }
      
      // Get player's room assignment
      const playerAssignments = (data as any).player_assignments || {};
      const assignedRoom = playerAssignments[playerId];
      if (assignedRoom) {
        setPlayerRoomAssignment(assignedRoom);
      }
    };

    fetchLobby();

    // Subscribe to real-time updates
    const channel = supabase
      .channel(`final-destruction-${lobbyId}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'lobbies',
          filter: `id=eq.${lobbyId}`,
        },
        (payload) => {
          const newData = payload.new as any;
          setLobby(newData);
          
          const gameState = newData.game_state || {};
          if (gameState.destruction_started && !destructionStarted) {
            setDestructionStarted(true);
            toast({
              title: "💥 DESTRUCTION INITIÉE !",
              description: "Le bâtiment Insta-Vibe commence à s'effondrer...",
            });
          }
          if (gameState.destruction_complete && !destructionComplete) {
            setDestructionComplete(true);
            setShowSuccessModal(true);
            toast({
              title: "🏆 MISSION ACCOMPLIE !",
              description: "Insta-Vibe a été définitivement détruite !",
            });
            // Navigate to leaderboard after destruction
            setTimeout(() => {
              navigate(`/leaderboard/${lobbyId}`);
            }, 3000);
          }
          // Update completion time if available
          if (gameState.game_completion_time && gameState.game_completion_time !== completionTime) {
            setCompletionTime(gameState.game_completion_time);
          }
          // Update team name if available
          if (gameState.team_name && gameState.team_name !== teamName) {
            setTeamName(gameState.team_name);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [lobbyId, playerId, navigate, toast]);

  // Calculate completion time
  const calculateCompletionTime = (gameState: any) => {
    const startTime = gameState?.game_start_time;
    if (!startTime) return "Temps non disponible";
    
    const start = new Date(startTime);
    const end = new Date();
    const diffMs = end.getTime() - start.getTime();
    
    const minutes = Math.floor(diffMs / (1000 * 60));
    const seconds = Math.floor((diffMs % (1000 * 60)) / 1000);
    
    return `${minutes}m ${seconds}s`;
  };

  const initiateDestruction = async () => {
    if (!lobby || !allSlotsFilled) return;

    // Check if current player is the host
    const currentPlayer = lobby.players?.find((p: Player) => p.id === playerId);
    const isHost = currentPlayer?.isHost || false;

    if (!isHost) {
      toast({
        title: "Permission refusée",
        description: "Seul le chef d'équipe peut nommer l'équipe",
        variant: "destructive",
      });
      return;
    }

    // Show team name modal for the host
    setShowTeamNameModal(true);
  };

  const confirmDestruction = async () => {
    if (!lobby || !teamName.trim()) return;

    // Close team name modal
    setShowTeamNameModal(false);

    // Calculate completion time
    const completionTimeStr = calculateCompletionTime(lobby.game_state);
    setCompletionTime(completionTimeStr);

    // Start page trembling effect
    setPageTrembling(true);

    const { error } = await supabase
      .from("lobbies")
      .update({
        game_state: {
          ...(lobby.game_state as any),
          destruction_started: true,
          game_completion_time: completionTimeStr,
          game_end_time: new Date().toISOString(),
          team_name: teamName.trim()
        }
      })
      .eq("id", lobby.id);

    if (error) {
      console.error("Error starting destruction:", error);
      toast({
        title: "Erreur",
        description: "Impossible de déclencher la destruction",
        variant: "destructive",
      });
      setPageTrembling(false);
      return;
    }

    // After 3 seconds, complete the destruction and show success modal
    setTimeout(async () => {
      const gameState = lobby.game_state as any;
      const startTime = gameState?.game_start_time;
      const endTime = new Date().toISOString();

      // Update lobby completion
      await supabase
        .from("lobbies")
        .update({
          game_state: {
            ...gameState,
            destruction_started: true,
            destruction_complete: true,
            game_completion_time: completionTimeStr,
            game_end_time: endTime,
            team_name: teamName.trim()
          }
        })
        .eq("id", lobby.id);

      // Insert team entry into leaderboard table with custom team name
      if (startTime) {
        await supabase
          .from("leaderboard")
          .insert({
            team_name: teamName.trim(),
            started_at: startTime,
            finished_at: endTime,
            lobby_id: lobby.id
          });
      }
      
      setPageTrembling(false);
      setDestructionComplete(true);
      setShowSuccessModal(true);
    }, 3000);
  };

  // Drag and drop handlers
  const handleDragStart = (e: React.DragEvent, codeId: string) => {
    const code = availableCodes.find(c => c.id === codeId);
    
    // Check if player has permission to drag this code
    if (code && playerRoomAssignment !== code.roomNumber) {
      e.preventDefault();
      toast({
        title: "Permission refusée",
        description: `Seul l'agent de la salle ${code.roomNumber} peut manipuler ce code`,
        variant: "destructive",
      });
      return;
    }
    
    setDraggedCode(codeId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, slotId: string) => {
    e.preventDefault();
    if (!draggedCode) return;

    const draggedCodeObj = availableCodes.find(code => code.id === draggedCode);
    if (!draggedCodeObj) return;

    // Check if slot is already filled
    const targetSlot = codeSlots.find(slot => slot.id === slotId);
    if (targetSlot?.filled) return;

    // Update slots
    setCodeSlots(prev => prev.map(slot => 
      slot.id === slotId 
        ? { ...slot, filled: true, code: draggedCodeObj.value }
        : slot
    ));

    setDraggedCode(null);
    
    // Play success sound effect
    toast({
      title: "Code inséré !",
      description: `${draggedCodeObj.name} installé avec succès`,
    });
  };

  const resetSlot = (slotId: string) => {
    setCodeSlots(prev => prev.map(slot => 
      slot.id === slotId 
        ? { ...slot, filled: false, code: undefined }
        : slot
    ));
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4 animate-pulse">💥</div>
          <h2 className="text-2xl font-bold mb-2 neon-cyan font-mono">Préparation de la destruction finale...</h2>
          <p className="text-muted-foreground">Chargement des explosifs</p>
        </div>
      </div>
    );
  }

  if (!lobby) return null;

  return (
    <div className={`min-h-screen bg-background p-4 relative overflow-hidden ${pageTrembling ? 'trembling-everything' : ''}`}>
      {/* Animated Background Effects */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ff0000_1px,transparent_1px),linear-gradient(to_bottom,#ff0000_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_110%)] opacity-20" />
      
      {/* Page Trembling Effect */}
      {pageTrembling && (
        <div className="absolute inset-0 bg-red-500/30 animate-pulse pointer-events-none" />
      )}

      <div className="container mx-auto max-w-6xl py-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-destructive/20 border border-destructive rounded-full px-4 py-2 mb-6">
            <Terminal className="w-5 h-5 text-destructive animate-pulse" />
            <span className="text-sm font-mono text-destructive">CONSOLE DE DESTRUCTION FINALE</span>
          </div>
          
          <h1 className="text-5xl font-bold mb-4 neon-red font-mono">
            💥 TERMINAL DE DESTRUCTION 💥
          </h1>
          <p className="text-xl text-muted-foreground font-mono">
            Glissez les 3 codes dans les slots pour activer la séquence de destruction
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Side: Available Codes */}
          <div>
            <Card className="border-2 border-primary/30 bg-primary/5">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-primary font-mono flex items-center gap-2">
                  <Lock className="w-6 h-6" />
                  CODES RÉCUPÉRÉS
                </CardTitle>
                <CardDescription>
                  Glissez chaque code vers les slots de la console
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {availableCodes.map((code) => {
                    const isUsed = codeSlots.some(slot => slot.code === code.value);
                    const canDrag = playerRoomAssignment === code.roomNumber;
                    const isDragDisabled = isUsed || destructionStarted || !canDrag;
                    
                    return (
                      <div
                        key={code.id}
                        draggable={!isDragDisabled}
                        onDragStart={(e) => handleDragStart(e, code.id)}
                        className={`p-4 border-2 rounded-lg transition-all ${
                          isUsed 
                            ? 'border-muted bg-muted/20 opacity-50 cursor-not-allowed' 
                            : canDrag
                            ? 'border-green-500/50 bg-green-500/10 hover:bg-green-500/20 hover:scale-105 cursor-move'
                            : 'border-orange-500/50 bg-orange-500/10 opacity-60 cursor-not-allowed'
                        }`}
                        title={!canDrag ? `Seul l'agent de la salle ${code.roomNumber} peut utiliser ce code` : ''}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="flex items-center gap-2">
                              <div className="font-bold text-green-400 font-mono">{code.name}</div>
                              <Badge variant={canDrag ? "default" : "secondary"} className="text-xs">
                                Salle {code.roomNumber}
                              </Badge>
                            </div>
                            <div className="text-sm text-muted-foreground font-mono">{code.value}</div>
                            {!canDrag && !isUsed && (
                              <div className="text-xs text-orange-400 mt-1">
                                🔒 Permission requise
                              </div>
                            )}
                          </div>
                          <div className="flex flex-col items-center gap-1">
                            <CheckCircle className={`w-6 h-6 ${isUsed ? 'text-green-500' : canDrag ? 'text-green-400' : 'text-muted-foreground'}`} />
                            {canDrag && !isUsed && (
                              <div className="text-xs text-green-400">✓ Autorisé</div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Team Status */}
            <Card className="border-2 border-secondary/30 mt-6">
              <CardHeader>
                <CardTitle className="text-xl font-bold neon-cyan font-mono">
                  ÉQUIPE DATA GHOSTS
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {lobby?.players.map((player) => (
                    <div
                      key={player.id}
                      className="flex items-center justify-between p-3 bg-muted/50 border border-border rounded-lg"
                    >
                      <div className="flex items-center gap-2">
                        <Skull className="w-5 h-5 text-primary" />
                        <span className="font-mono">{player.name}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Trophy className="w-4 h-4 text-accent" />
                        <span className="font-bold text-accent">{player.score}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Side: Destruction Console */}
          <div>
            <Card className="border-2 border-destructive/50 bg-destructive/5">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-destructive font-mono flex items-center gap-2">
                  <Terminal className="w-6 h-6" />
                  CONSOLE DE DESTRUCTION
                </CardTitle>
                <CardDescription>
                  Insérez les 3 codes pour déverrouiller la destruction
                </CardDescription>
              </CardHeader>
              <CardContent>
                {/* Code Slots */}
                <div className="space-y-4 mb-6">
                  {codeSlots.map((slot) => (
                    <div
                      key={slot.id}
                      onDragOver={handleDragOver}
                      onDrop={(e) => handleDrop(e, slot.id)}
                      onClick={() => slot.filled && resetSlot(slot.id)}
                      className={`p-6 border-2 border-dashed rounded-lg min-h-[80px] flex items-center justify-center transition-all cursor-pointer ${
                        slot.filled
                          ? 'border-green-500 bg-green-500/20 hover:bg-green-500/30'
                          : 'border-destructive/50 bg-destructive/10 hover:bg-destructive/20'
                      }`}
                    >
                      {slot.filled ? (
                        <div className="text-center">
                          <div className="font-bold text-green-400 font-mono text-lg">{slot.code}</div>
                          <div className="text-xs text-muted-foreground">Cliquez pour retirer</div>
                        </div>
                      ) : (
                        <div className="text-center text-muted-foreground">
                          <div className="font-mono">{slot.name}</div>
                          <div className="text-xs">Glissez un code ici</div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Status Indicator */}
                <div className={`p-4 border-2 rounded-lg text-center mb-6 ${
                  allSlotsFilled 
                    ? 'border-green-500 bg-green-500/20' 
                    : 'border-yellow-500 bg-yellow-500/20'
                }`}>
                  <div className="flex items-center justify-center gap-2 mb-2">
                    {allSlotsFilled ? (
                      <CheckCircle className="w-6 h-6 text-green-400" />
                    ) : (
                      <AlertTriangle className="w-6 h-6 text-yellow-400" />
                    )}
                    <span className="font-bold font-mono">
                      {allSlotsFilled ? "SYSTÈME ARMÉ" : `${codeSlots.filter(s => s.filled).length}/3 CODES INSÉRÉS`}
                    </span>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {allSlotsFilled 
                      ? "Prêt pour la destruction finale" 
                      : "Insérez tous les codes pour continuer"
                    }
                  </div>
                </div>

                {/* Destruction Button */}
                <Button 
                  onClick={initiateDestruction}
                  disabled={!allSlotsFilled || destructionStarted}
                  className={`w-full h-16 text-xl font-bold font-mono transition-all ${
                    allSlotsFilled && !destructionStarted
                      ? 'bg-red-600 hover:bg-red-700 text-white animate-pulse hover:scale-105'
                      : 'bg-muted text-muted-foreground cursor-not-allowed'
                  }`}
                >
                  {destructionStarted ? (
                    <>
                      <Zap className="mr-3 h-8 w-8 animate-spin" />
                      DESTRUCTION EN COURS...
                    </>
                  ) : allSlotsFilled ? (
                    <>
                      <Flame className="mr-3 h-8 w-8" />
                      DÉCLENCHER LA DESTRUCTION
                      <Flame className="ml-3 h-8 w-8" />
                    </>
                  ) : (
                    <>
                      <Lock className="mr-3 h-6 w-6" />
                      INSÉREZ TOUS LES CODES
                    </>
                  )}
                </Button>

                {/* Host Information */}
                {allSlotsFilled && !destructionStarted && (() => {
                  const currentPlayer = lobby?.players?.find((p: Player) => p.id === playerId);
                  const isHost = currentPlayer?.isHost || false;
                  const hostPlayer = lobby?.players?.find((p: Player) => p.isHost);
                  
                  return (
                    <div className="mt-4 p-3 border border-border rounded-lg bg-muted/20">
                      <div className="flex items-center gap-2 text-sm">
                        <Users className="w-4 h-4" />
                        {isHost ? (
                          <span className="text-green-400 font-mono">
                            Vous êtes le chef d'équipe - Vous pouvez nommer votre équipe !
                          </span>
                        ) : (
                          <span className="text-muted-foreground font-mono">
                            Seul le chef d'équipe ({hostPlayer?.name}) peut déclencher la destruction
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })()}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Emergency Actions */}
        <div className="mt-8 text-center">
          <Button
            variant="outline"
            onClick={() => navigate("/")}
            className="border-2 border-border hover:border-destructive hover:text-destructive transition-all font-mono"
          >
            RETOUR AU MENU PRINCIPAL
          </Button>
        </div>
      </div>

      {/* Team Name Modal */}
      <Dialog open={showTeamNameModal} onOpenChange={() => {}}>
        <DialogContent className="max-w-lg border-2 border-primary">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-primary font-mono text-center">
              🏷️ NOMMEZ VOTRE ÉQUIPE
            </DialogTitle>
            <DialogDescription className="text-center">
              En tant que chef d'équipe, choisissez le nom qui apparaîtra dans le classement
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="teamName" className="text-sm font-medium font-mono">
                Nom de l'équipe
              </Label>
              <Input
                id="teamName"
                value={teamName}
                onChange={(e) => setTeamName(e.target.value)}
                placeholder="Les Data Ghosts Suprêmes"
                className="font-mono"
                maxLength={50}
                autoFocus
              />
              <div className="text-xs text-muted-foreground">
                Maximum 50 caractères
              </div>
            </div>

            <div className="bg-destructive/10 border border-destructive/30 rounded-lg p-4">
              <div className="flex items-center gap-2 text-destructive font-mono">
                <AlertTriangle className="w-4 h-4" />
                <span className="text-sm font-bold">ATTENTION</span>
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                Une fois confirmé, la destruction sera immédiatement déclenchée et votre équipe sera ajoutée au classement.
              </p>
            </div>

            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => setShowTeamNameModal(false)}
                className="flex-1"
              >
                Annuler
              </Button>
              <Button
                onClick={confirmDestruction}
                disabled={!teamName.trim()}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white font-mono"
              >
                <Flame className="mr-2 h-4 w-4" />
                CONFIRMER & DÉTRUIRE
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Success Modal */}
      <Dialog open={showSuccessModal} onOpenChange={() => {}}>
        <DialogContent className="max-w-2xl border-2 border-green-500">
          <DialogHeader>
            <DialogTitle className="text-3xl font-bold text-green-400 font-mono text-center">
              🏆 MISSION ACCOMPLIE ! 🏆
            </DialogTitle>
            <DialogDescription className="text-center text-lg">
              Insta-Vibe a été définitivement détruite !
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6">
            {/* Mission Completion Time - Primary Focus */}
            <div className="bg-green-500/10 border-2 border-green-500/50 rounded-lg p-8 text-center">
              <h3 className="text-2xl font-bold text-green-400 mb-6 font-mono">TEMPS DE MISSION</h3>
              <div className="mb-4">
                <div className="text-6xl font-bold text-green-400 font-mono">{completionTime}</div>
                <div className="text-lg text-muted-foreground mt-2">Temps total de l'équipe</div>
              </div>
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div className="text-center">
                  <div className="text-xl font-bold text-green-400">{lobby?.players.length || 0}</div>
                  <div className="text-muted-foreground">Agents</div>
                </div>
                <div className="text-center">
                  <div className="text-xl font-bold text-green-400">3</div>
                  <div className="text-muted-foreground">Codes</div>
                </div>
                <div className="text-center">
                  <div className="text-xl font-bold text-green-400">
                    {lobby?.players.reduce((sum, p) => sum + p.score, 0) || 0}
                  </div>
                  <div className="text-muted-foreground">Score</div>
                </div>
              </div>
            </div>

            {/* Team Summary */}
            <div className="bg-card border border-border rounded-lg p-6">
              <h3 className="text-xl font-bold text-primary mb-4 font-mono text-center">
                ÉQUIPE {teamName || lobby?.name}
              </h3>
              <div className="text-center">
                <div className="text-lg text-muted-foreground mb-3">
                  Mission accomplie avec succès !
                </div>
                <div className="flex justify-center items-center gap-2 text-green-400">
                  <CheckCircle className="w-5 h-5" />
                  <span className="font-mono">Tous les objectifs atteints</span>
                </div>
              </div>
            </div>

            <div className="text-center space-y-4">
              <Button 
                onClick={() => navigate(`/leaderboard/${lobbyId}`)}
                className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-3"
              >
                VOIR LE CLASSEMENT GLOBAL
              </Button>
              <Button 
                variant="outline"
                onClick={() => navigate("/")}
                className="px-8 py-3"
              >
                RETOUR AU MENU
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default FinalDestruction;