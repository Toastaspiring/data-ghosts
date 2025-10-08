import { Users, Trophy, MapPin } from "lucide-react";

interface Player {
  id: string;
  name: string;
  score: number;
  assignedRoom?: number;
}

interface PlayerDashboardProps {
  players: Player[];
  currentPlayerId: string;
}

export const PlayerDashboard = ({ players, currentPlayerId }: PlayerDashboardProps) => {
  return (
    <div className="bg-card rounded-3xl p-6 cartoon-shadow mb-6">
      <div className="flex items-center gap-3 mb-4">
        <Users className="w-6 h-6 text-primary" />
        <h3 className="text-xl font-bold text-foreground">Équipe Data Ghosts</h3>
      </div>

      <div className="grid gap-3">
        {players.map((player) => {
          const isCurrentPlayer = player.id === currentPlayerId;
          
          return (
            <div
              key={player.id}
              className={`flex items-center justify-between p-4 rounded-xl transition-all ${
                isCurrentPlayer
                  ? "bg-primary/20 border-2 border-primary"
                  : "bg-secondary/10"
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  isCurrentPlayer ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground"
                }`}>
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-semibold text-foreground">
                    {player.name}
                    {isCurrentPlayer && " (Vous)"}
                  </p>
                  {player.assignedRoom && (
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <MapPin className="w-3 h-3" />
                      <span>Salle {player.assignedRoom}</span>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Trophy className="w-4 h-4 text-accent" />
                <span className="text-xl font-bold text-primary">{player.score}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};