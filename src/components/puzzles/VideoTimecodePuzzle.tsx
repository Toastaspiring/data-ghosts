import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Play, Pause } from "lucide-react";

interface VideoTimecodePuzzleProps {
  correctTime: string;
  password: string;
  onSolve: () => void;
}

export const VideoTimecodePuzzle = ({ correctTime, password, onSolve }: VideoTimecodePuzzleProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentTime((prev) => {
          if (prev >= 120) return 0;
          return prev + 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const handlePause = () => {
    setIsPlaying(false);
    const timeString = formatTime(currentTime);
    if (timeString === correctTime) {
      setShowPassword(true);
      setTimeout(onSolve, 2000);
    }
  };

  return (
    <div className="bg-card rounded-3xl p-8 cartoon-shadow">
      <h3 className="text-2xl font-bold text-foreground mb-6 text-center">
        Trouvez le bon timecode
      </h3>

      <div className="bg-secondary/20 rounded-2xl p-8 mb-6">
        <div className="text-6xl font-mono font-bold text-center mb-4 text-foreground">
          {formatTime(currentTime)}
        </div>
        
        {showPassword && (
          <div className="bg-accent/20 rounded-xl p-4 border-2 border-accent animate-pulse-soft">
            <p className="text-center text-xl font-bold text-foreground">
              Mot de passe: {password}
            </p>
          </div>
        )}
      </div>

      <div className="flex gap-4">
        {!isPlaying ? (
          <Button
            onClick={() => setIsPlaying(true)}
            className="flex-1 h-16 text-lg"
          >
            <Play className="w-6 h-6 mr-2" />
            Lire
          </Button>
        ) : (
          <Button
            onClick={handlePause}
            variant="destructive"
            className="flex-1 h-16 text-lg"
          >
            <Pause className="w-6 h-6 mr-2" />
            Pause
          </Button>
        )}
      </div>

      <p className="text-center mt-4 text-muted-foreground text-sm">
        Mettez en pause au bon moment pour révéler le mot de passe
      </p>
    </div>
  );
};
