import React from 'react';
import { cn } from '@/lib/utils';

interface RoomContainerProps {
  children: React.ReactNode;
  className?: string;
}

export const RoomContainer: React.FC<RoomContainerProps> = ({
  children,
  className
}) => {
  return (
    <div className={cn(
      "min-h-screen bg-background text-foreground relative overflow-hidden",
      "flex flex-col",
      // Cyberpunk styling
      "border border-primary/20 shadow-[0_0_20px_rgba(0,255,255,0.1)]",
      className
    )}>
      {/* Background grid pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0ff_1px,transparent_1px),linear-gradient(to_bottom,#0ff_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_110%)] opacity-5" />
      
      {/* Matrix rain effect */}
      <div className="matrix-rain absolute inset-0 opacity-3" />
      
      {/* Neon glow effects */}
      <div className="absolute top-0 left-0 w-32 h-32 bg-primary/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-0 right-0 w-48 h-48 bg-accent/20 rounded-full blur-3xl animate-pulse delay-1000" />
      
      {/* Content */}
      <div className="relative z-10 flex-1 flex flex-col">
        {children}
      </div>
    </div>
  );
};

export default RoomContainer;