import React from 'react';
import { ArrowLeft, Clock, Trophy, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

interface RoomHeaderProps {
  roomName: string;
  description: string;
  progress: {
    percentage: number;
    completed: number;
    total: number;
    timeElapsed: number;
  };
  onExit: () => void;
  className?: string;
}

export const RoomHeader: React.FC<RoomHeaderProps> = ({
  roomName,
  description,
  progress,
  onExit,
  className
}) => {
  // Format time elapsed
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <header className={cn(
      "bg-background/95 backdrop-blur-sm border-b border-primary/20",
      "px-6 py-4 relative z-20",
      // Cyberpunk styling
      "shadow-[0_0_20px_rgba(0,255,255,0.1)]",
      className
    )}>
      {/* Top Row */}
      <div className="flex items-center justify-between mb-4">
        {/* Left: Exit button and room info */}
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="sm"
            onClick={onExit}
            className="neon-border hover:neon-glow transition-all duration-300"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Exit Room
          </Button>
          
          <div className="space-y-1">
            <h1 className="text-xl font-bold font-mono neon-cyan">
              {roomName}
            </h1>
            <p className="text-sm text-muted-foreground">
              {description}
            </p>
          </div>
        </div>

        {/* Right: Statistics */}
        <div className="flex items-center gap-6">
          {/* Progress */}
          <div className="flex items-center gap-2">
            <Trophy className="w-4 h-4 text-primary" />
            <span className="font-mono text-sm">
              {progress.completed}/{progress.total}
            </span>
            <Badge variant="outline" className="neon-border">
              {Math.round(progress.percentage)}%
            </Badge>
          </div>

          {/* Time */}
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-accent" />
            <span className="font-mono text-sm">
              {formatTime(progress.timeElapsed)}
            </span>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground font-mono">Investigation Progress</span>
          <span className="text-primary font-mono">{Math.round(progress.percentage)}% Complete</span>
        </div>
        <Progress 
          value={progress.percentage} 
          className="h-2 neon-border"
        />
      </div>

      {/* Neon glow effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-accent/5 pointer-events-none" />
    </header>
  );
};

export default RoomHeader;