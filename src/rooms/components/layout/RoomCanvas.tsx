import React, { useState, useRef } from 'react';
import { InteractionType, LayoutConfig, ElementConfig, RoomState } from '../../core/types';
import { InteractiveElement } from '../elements/InteractiveElement';
import { cn } from '@/lib/utils';

interface RoomCanvasProps {
  layout: LayoutConfig;
  elements: ElementConfig[];
  roomState: RoomState;
  onElementInteract: (elementId: string, interactionType: InteractionType) => void;
  activeElement?: string | null;
  className?: string;
}

export const RoomCanvas: React.FC<RoomCanvasProps> = ({
  layout,
  elements,
  roomState,
  onElementInteract,
  activeElement,
  className
}) => {
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });
  const canvasRef = useRef<HTMLDivElement>(null);

  // Handle canvas click (for zoom)
  const handleCanvasClick = (event: React.MouseEvent) => {
    if (event.target === event.currentTarget) {
      const rect = event.currentTarget.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / rect.width) * 100;
      const y = ((event.clientY - rect.top) / rect.height) * 100;
      
      setZoomPosition({ x, y });
      setIsZoomed(!isZoomed);
    }
  };

  // Reset zoom
  const resetZoom = () => {
    setIsZoomed(false);
    setZoomPosition({ x: 50, y: 50 });
  };

  return (
    <div className={cn(
      "relative w-full h-full overflow-hidden",
      "bg-background rounded-lg border border-primary/20",
      "shadow-[0_0_20px_rgba(0,255,255,0.1)]",
      className
    )}>
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-all duration-500 ease-out"
        style={{
          backgroundImage: `url(${layout.background})`,
          transform: isZoomed ? `scale(2) translate(${50 - zoomPosition.x}%, ${50 - zoomPosition.y}%)` : 'scale(1)',
          transformOrigin: 'center'
        }}
      />

      {/* Overlay effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background/20" />
      
      {/* Interactive Canvas */}
      <div 
        ref={canvasRef}
        className="relative w-full h-full cursor-crosshair"
        style={{
          width: layout.width,
          height: layout.height,
          maxWidth: '100%',
          maxHeight: '100%'
        }}
        onClick={handleCanvasClick}
      >
        {/* Zone overlays */}
        {layout.zones?.map((zone) => (
          <div
            key={zone.id}
            className={cn(
              "absolute border border-primary/30 rounded-md",
              "bg-primary/5 backdrop-blur-sm",
              zone.interactive && "hover:bg-primary/10 transition-colors duration-300"
            )}
            style={{
              left: `${(zone.bounds.x / layout.width) * 100}%`,
              top: `${(zone.bounds.y / layout.height) * 100}%`,
              width: `${(zone.bounds.w / layout.width) * 100}%`,
              height: `${(zone.bounds.h / layout.height) * 100}%`,
            }}
          />
        ))}

        {/* Interactive Elements */}
        {elements.map((element) => {
          const elementState = roomState.elementStates[element.id];
          if (!elementState?.isUnlocked) return null;

          return (
            <InteractiveElement
              key={element.id}
              element={element}
              elementState={elementState}
              isActive={activeElement === element.id}
              canvasSize={{ width: layout.width, height: layout.height }}
              onInteract={onElementInteract}
            />
          );
        })}
      </div>

      {/* Zoom Controls */}
      <div className="absolute top-4 right-4 flex gap-2">
        <button
          onClick={resetZoom}
          className={cn(
            "px-3 py-1 bg-background/80 backdrop-blur-sm rounded",
            "border border-primary/30 text-xs font-mono",
            "hover:bg-primary/10 transition-colors duration-300"
          )}
        >
          {isZoomed ? 'Reset Zoom' : 'Click to Zoom'}
        </button>
      </div>

      {/* Active Element Highlight */}
      {activeElement && (
        <div className="absolute inset-0 bg-primary/5 backdrop-blur-[1px] pointer-events-none" />
      )}
    </div>
  );
};

export default RoomCanvas;