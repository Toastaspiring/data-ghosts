import React, { useState } from 'react';
import { RoomEngine } from '../core/RoomEngine';
import { roomConfigs, gameFlow, gameIntro } from './index';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface InstaVibeGameProps {
  playerId: string;
  onComplete?: (results: any) => void;
  onError?: (error: Error) => void;
}

export const InstaVibeGame: React.FC<InstaVibeGameProps> = ({
  playerId,
  onComplete,
  onError
}) => {
  const [currentRoom, setCurrentRoom] = useState<string | null>(null);
  const [completedRooms, setCompletedRooms] = useState<string[]>([]);
  const [roomCodes, setRoomCodes] = useState<Record<string, string>>({});
  const [showIntro, setShowIntro] = useState(true);

  // Room information
  const rooms = [
    {
      id: 'tiktok-farm',
      name: 'La Ferme TikTok',
      description: 'Sabotez la production de vidéos virales',
      difficulty: 3,
      estimatedTime: 20,
      icon: '🎬',
      code: '2847'
    },
    {
      id: 'fake-scenes', 
      name: 'Les Scènes Fake',
      description: 'Perturbez les faux décors et éclairages',
      difficulty: 3,
      estimatedTime: 18,
      icon: '🎭',
      code: '1593'
    },
    {
      id: 'video-editors',
      name: 'Salle des Monteurs', 
      description: 'Corrompez les éditeurs et sabotez le matériel',
      difficulty: 4,
      estimatedTime: 25,
      icon: '🎞️',
      code: '7629'
    },
    {
      id: 'final-destruction',
      name: 'Destruction Finale',
      description: 'Détruisez Insta-Vibe avec les 3 codes',
      difficulty: 3,
      estimatedTime: 8,
      icon: '💥',
      code: 'ALL'
    }
  ];

  // Handle room completion
  const handleRoomComplete = (roomId: string, results: any) => {
    setCompletedRooms(prev => [...prev, roomId]);
    
    // Store room code
    const room = rooms.find(r => r.id === roomId);
    if (room && room.code !== 'ALL') {
      setRoomCodes(prev => ({...prev, [roomId]: room.code}));
    }
    
    setCurrentRoom(null);
    
    // Check if all rooms completed
    if (completedRooms.length + 1 >= rooms.length) {
      onComplete?.(results);
    }
  };

  // Handle room entry
  const handleEnterRoom = async (roomId: string) => {
    // Check requirements for final room
    if (roomId === 'final-destruction') {
      const requiredRooms = ['tiktok-farm', 'fake-scenes', 'video-editors'];
      const missing = requiredRooms.filter(id => !completedRooms.includes(id));
      
      if (missing.length > 0) {
        alert(`Vous devez d'abord compléter: ${missing.map(id => rooms.find(r => r.id === id)?.name).join(', ')}`);
        return;
      }
    }
    
    setCurrentRoom(roomId);
  };

  // Render intro screen
  if (showIntro) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="max-w-4xl w-full">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold neon-cyan font-mono">
              {gameIntro.title}
            </CardTitle>
            <CardDescription className="text-lg mt-4">
              Mission d'infiltration chez Insta-Vibe
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* Company Image */}
            <div className="flex justify-center">
              <div className="w-64 h-48 bg-muted rounded-lg flex items-center justify-center">
                <span className="text-6xl">🏢</span>
              </div>
            </div>
            
            {/* Description */}
            <div className="prose prose-invert max-w-none">
              <p className="text-center text-muted-foreground whitespace-pre-line">
                {gameIntro.description}
              </p>
            </div>
            
            {/* Characters */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {gameIntro.characters.map((character, index) => (
                <Card key={index} className="text-center">
                  <CardContent className="pt-6">
                    <div className="w-16 h-16 bg-primary/20 rounded-full mx-auto mb-3 flex items-center justify-center text-2xl">
                      🕵️
                    </div>
                    <h3 className="font-semibold">{character.name}</h3>
                    <p className="text-sm text-muted-foreground">{character.speciality}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            <div className="text-center">
              <Button 
                onClick={() => setShowIntro(false)}
                size="lg"
                className="neon-glow"
              >
                Commencer la Mission
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Render current room
  if (currentRoom) {
    return (
      <div className="min-h-screen">
        <RoomEngine
          roomId={currentRoom}
          playerId={playerId}
          onComplete={(results) => handleRoomComplete(currentRoom, results)}
          onError={onError}
        />
      </div>
    );
  }

  // Render room selection
  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold neon-cyan font-mono mb-4">
            Sélection de Salle
          </h1>
          <p className="text-muted-foreground">
            Choisissez votre prochaine cible de sabotage
          </p>
        </div>

        {/* Progress */}
        <div className="mb-8">
          <div className="flex items-center justify-center gap-4 mb-4">
            <span className="text-sm text-muted-foreground">Progression:</span>
            <span className="font-mono text-primary">
              {completedRooms.length}/{rooms.length} salles complétées
            </span>
          </div>
          
          {/* Collected codes */}
          {Object.keys(roomCodes).length > 0 && (
            <div className="text-center">
              <span className="text-sm text-muted-foreground">Codes collectés: </span>
              {Object.entries(roomCodes).map(([roomId, code]) => (
                <Badge key={roomId} variant="outline" className="ml-2">
                  {code}
                </Badge>
              ))}
            </div>
          )}
        </div>

        {/* Room Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {rooms.map((room) => {
            const isCompleted = completedRooms.includes(room.id);
            const canEnter = room.id !== 'final-destruction' || 
                           ['tiktok-farm', 'fake-scenes', 'video-editors'].every(id => 
                             completedRooms.includes(id));
            
            return (
              <Card 
                key={room.id}
                className={`relative transition-all duration-300 ${
                  isCompleted ? 'bg-green-500/20 border-green-500/40' :
                  canEnter ? 'hover:bg-primary/10 hover:border-primary/40 cursor-pointer' :
                  'opacity-50 cursor-not-allowed'
                }`}
                onClick={() => canEnter && !isCompleted && handleEnterRoom(room.id)}
              >
                <CardHeader>
                  <div className="text-center">
                    <div className="text-4xl mb-2">{room.icon}</div>
                    <CardTitle className="text-lg font-mono">
                      {room.name}
                    </CardTitle>
                  </div>
                </CardHeader>
                
                <CardContent>
                  <CardDescription className="text-center mb-4">
                    {room.description}
                  </CardDescription>
                  
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between">
                      <span>Difficulté:</span>
                      <span>{'⭐'.repeat(room.difficulty)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Temps estimé:</span>
                      <span>{room.estimatedTime}min</span>
                    </div>
                  </div>
                  
                  {isCompleted && (
                    <Badge className="w-full mt-4 bg-green-500/20 text-green-400">
                      ✅ Complétée
                    </Badge>
                  )}
                  
                  {!canEnter && !isCompleted && room.id === 'final-destruction' && (
                    <Badge variant="destructive" className="w-full mt-4">
                      🔒 Codes requis
                    </Badge>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Instructions */}
        <div className="mt-8 text-center text-sm text-muted-foreground">
          <p>💡 Conseil: Certaines salles fournissent des indices utiles pour les autres !</p>
        </div>
      </div>
    </div>
  );
};

export default InstaVibeGame;