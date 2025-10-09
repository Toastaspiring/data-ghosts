import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle, Clock, User } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';

interface Player {
  id: string;
  name: string;
  completed: boolean;
  ready?: boolean;
}

interface WaitingModalProps {
  open: boolean;
  players: Player[];
  roomCode: string;
  currentPlayerId: string;
  onReady: () => void;
}

export const WaitingModal: React.FC<WaitingModalProps> = ({ open, players, roomCode, currentPlayerId, onReady }) => {
  const completedCount = players.filter(p => p.completed).length;
  const readyCount = players.filter(p => p.ready).length;
  const totalPlayers = players.length;
  const progress = (completedCount / totalPlayers) * 100;
  const currentPlayer = players.find(p => p.id === currentPlayerId);
  const isCurrentPlayerReady = currentPlayer?.ready || false;
  const allReady = readyCount === totalPlayers;

  return (
    <Dialog open={open}>
      <DialogContent className="max-w-md border-2 border-primary/30 cartoon-shadow">
        <DialogHeader>
          <DialogTitle className="text-3xl font-mono neon-cyan text-center">
            🎉 Mission Accomplie !
          </DialogTitle>
          <DialogDescription className="text-center text-lg font-mono mt-2">
            Code de la salle: <span className="text-primary font-bold text-xl">{roomCode}</span>
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm font-mono">
              <span>Équipe en attente</span>
              <span className="text-primary">{completedCount}/{totalPlayers}</span>
            </div>
            <Progress value={progress} className="h-3 animate-pulse-glow" />
          </div>

          {/* Players Status */}
          <div className="space-y-3">
            {players.map((player) => (
              <Card 
                key={player.id}
                className={`border-2 transition-all ${
                  player.completed 
                    ? 'border-green-500 bg-green-500/10' 
                    : 'border-secondary/30'
                }`}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                     <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        player.completed 
                          ? 'bg-green-500 text-background' 
                          : 'bg-secondary/20 text-secondary'
                      }`}>
                        <User className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="font-semibold font-mono">{player.name}</div>
                        {player.completed && (
                          <div className={`text-xs ${player.ready ? 'text-green-500' : 'text-muted-foreground'}`}>
                            {player.ready ? '✓ Ready' : 'Waiting...'}
                          </div>
                        )}
                      </div>
                    </div>
                    {player.completed ? (
                      player.ready ? (
                        <CheckCircle className="w-6 h-6 text-green-500" />
                      ) : (
                        <Clock className="w-6 h-6 text-yellow-500 animate-pulse" />
                      )
                    ) : (
                      <Clock className="w-6 h-6 text-muted-foreground animate-spin" />
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Room Code Display */}
          <div className="text-center p-6 bg-primary/10 border-2 border-primary/30 rounded-lg">
            <div className="text-sm text-muted-foreground mb-2 font-mono">Code de la salle:</div>
            <div className="text-4xl font-bold font-mono neon-cyan tracking-wider">
              {roomCode}
            </div>
          </div>

          {/* Ready Button */}
          {completedCount === totalPlayers && !isCurrentPlayerReady && (
            <Button 
              onClick={onReady}
              className="w-full h-14 text-lg font-bold"
              variant="default"
            >
              Je suis prêt(e) ! 🚀
            </Button>
          )}

          {/* Waiting Message */}
          <div className="text-center p-4 bg-primary/10 border border-primary/30 rounded-lg">
            <p className="font-mono text-sm text-muted-foreground">
              {completedCount !== totalPlayers
                ? "⏳ En attente des autres hackers..."
                : allReady
                ? "🚀 Transfert vers la salle de contrôle..."
                : `⏳ En attente... (${readyCount}/${totalPlayers} prêts)`}
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
