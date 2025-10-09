import React, { useState } from 'react';
import { ElementConfig, ElementState, InteractionType } from '../../core/types';
import { cn } from '@/lib/utils';
import { 
  Search, 
  Play, 
  MousePointer, 
  Eye, 
  Hand, 
  Zap,
  Lock,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

interface InteractiveElementProps {
  element: ElementConfig;
  elementState: ElementState;
  isActive: boolean;
  canvasSize: { width: number; height: number };
  onInteract: (elementId: string, interactionType: InteractionType) => void;
}

export const InteractiveElement: React.FC<InteractiveElementProps> = ({
  element,
  elementState,
  isActive,
  canvasSize,
  onInteract
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  // Calculate position as percentage
  const positionStyle = {
    left: `${(element.position.x / canvasSize.width) * 100}%`,
    top: `${(element.position.y / canvasSize.height) * 100}%`,
    width: `${(element.size.width / canvasSize.width) * 100}%`,
    height: `${(element.size.height / canvasSize.height) * 100}%`,
  };

  // Get appropriate icon based on element type
  const getElementIcon = () => {
    switch (element.type) {
      case 'equipment': return <Search className="w-4 h-4" />;
      case 'computer': return <Hand className="w-4 h-4" />;
      case 'terminal': return <Eye className="w-4 h-4" />;
      case 'device': return <Zap className="w-4 h-4" />;
      case 'specimen': return <MousePointer className="w-4 h-4" />;
      case 'document': return <Play className="w-4 h-4" />;
      case 'artifact': return <Search className="w-4 h-4" />;
      case 'sample': return <MousePointer className="w-4 h-4" />;
      case 'tool': return <Hand className="w-4 h-4" />;
      default: return <MousePointer className="w-4 h-4" />;
    }
  };

  // Get status icon
  const getStatusIcon = () => {
    if (!elementState.isUnlocked) return <Lock className="w-3 h-3 text-muted-foreground" />;
    if (elementState.isSolved) return <CheckCircle className="w-3 h-3 text-green-400" />;
    if (elementState.attempts > 0) return <AlertCircle className="w-3 h-3 text-yellow-400" />;
    return null;
  };

  // Handle interaction
  const handleClick = () => {
    if (!elementState.isUnlocked) return;
    onInteract(element.id, 'click' as InteractionType);
  };

  // Handle tooltip
  const handleMouseEnter = () => {
    setIsHovered(true);
    setTimeout(() => setShowTooltip(true), 500);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setShowTooltip(false);
  };

  return (
    <div
      className={cn(
        "absolute cursor-pointer transition-all duration-300 group",
        "flex items-center justify-center",
        // Base styling
        "bg-primary/20 backdrop-blur-sm rounded-md",
        "border border-primary/40",
        // States
        !elementState.isUnlocked && "opacity-50 cursor-not-allowed bg-muted/20 border-muted/40",
        elementState.isSolved && "bg-green-400/20 border-green-400/40",
        isActive && "ring-2 ring-primary ring-offset-2 ring-offset-background",
        // Hover effects
        elementState.isUnlocked && "hover:bg-primary/30 hover:border-primary/60 hover:scale-110",
        elementState.isUnlocked && "hover:shadow-[0_0_20px_rgba(0,255,255,0.3)]",
        // Pulse animation for available elements
        elementState.isUnlocked && !elementState.isSolved && "animate-pulse"
      )}
      style={positionStyle}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Element Icon */}
      <div className={cn(
        "flex items-center justify-center",
        "text-primary group-hover:text-primary-foreground transition-colors duration-300",
        !elementState.isUnlocked && "text-muted-foreground",
        elementState.isSolved && "text-green-400"
      )}>
        {getElementIcon()}
      </div>

      {/* Status Indicator */}
      <div className="absolute -top-1 -right-1">
        {getStatusIcon()}
      </div>

      {/* Glow Effect */}
      {elementState.isUnlocked && !elementState.isSolved && (
        <div className="absolute inset-0 bg-primary/20 rounded-md animate-ping" />
      )}

      {/* Tooltip */}
      {showTooltip && isHovered && (
        <div className={cn(
          "absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2",
          "px-3 py-2 bg-background/95 backdrop-blur-sm rounded-md",
          "border border-primary/40 shadow-lg z-50",
          "min-w-max max-w-xs"
        )}>
          <div className="space-y-1">
            <h4 className="text-sm font-semibold font-mono text-primary">
              {element.name}
            </h4>
            <p className="text-xs text-foreground/80">
              {element.description}
            </p>
            {elementState.attempts > 0 && (
              <p className="text-xs text-yellow-400 font-mono">
                Attempts: {elementState.attempts}
              </p>
            )}
            {elementState.hintsUsed > 0 && (
              <p className="text-xs text-blue-400 font-mono">
                Hints used: {elementState.hintsUsed}
              </p>
            )}
          </div>
          
          {/* Tooltip Arrow */}
          <div className="absolute top-full left-1/2 transform -translate-x-1/2">
            <div className="border-4 border-transparent border-t-primary/40" />
          </div>
        </div>
      )}

      {/* Interaction Hint */}
      {isHovered && elementState.isUnlocked && !elementState.isSolved && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="bg-background/90 backdrop-blur-sm px-2 py-1 rounded text-xs font-mono text-primary border border-primary/40">
            Click to examine {element.type}
          </div>
        </div>
      )}
    </div>
  );
};

export default InteractiveElement;