import { useLocation } from "react-router-dom";
import { AudioVisualizer } from "@/components/ui/AudioVisualizer";
import { useBackgroundMusic } from "@/hooks/useAudio";
import { useState, useEffect } from "react";
import type { BackgroundMusic } from "@/config/sounds";

interface GlobalAudioVisualizerProps {
  children: React.ReactNode;
}

export const GlobalAudioVisualizer = ({ children }: GlobalAudioVisualizerProps) => {
  const location = useLocation();
  const [visualizerKey, setVisualizerKey] = useState(0);

  // Define routes where visualizer should NOT appear
  const excludeVisualizerRoutes = [
    '/lobby',      // Waiting room and beyond
    '/room-selection',
    '/game',
    '/leaderboard'
  ];

  // Check if current route should show visualizer
  const shouldShowVisualizer = !excludeVisualizerRoutes.some(route => 
    location.pathname.startsWith(route)
  );

  // Determine which music to play based on current route
  const getCurrentMusic = (): BackgroundMusic | null => {
    const path = location.pathname;
    
    if (path.startsWith('/game/')) {
      return "game"; // Game music
    } else if (path.startsWith('/room-selection/')) {
      return "roomSelection"; // Room selection music
    } else if (path.startsWith('/leaderboard/')) {
      return "leaderboard"; // Victory music
    } else if (path.startsWith('/lobby/')) {
      return "lobby"; // Lobby ambient music
    } else if (shouldShowVisualizer) {
      return "landing"; // Landing music for pre-lobby pages
    }
    
    return null; // No music
  };

  // Global music management with route-based music selection
  useBackgroundMusic(getCurrentMusic());

  // Reset visualizer key when route changes to ensure fresh connection
  useEffect(() => {
    if (shouldShowVisualizer) {
      setVisualizerKey(prev => prev + 1);
    }
  }, [location.pathname, shouldShowVisualizer]);

  return (
    <div className="relative min-h-screen">
      {/* Global Audio Visualizers - Only show on landing and lobby creation pages */}
      {shouldShowVisualizer && (
        <>
          {/* Left Sidebar Visualizer - Full Height */}
          <div className="fixed left-0 top-0 h-screen w-32 flex items-center justify-center z-30 pointer-events-none">
            <AudioVisualizer 
              key={`left-${visualizerKey}`}
              barCount={80}
              barHeight={120}
              barWidth={3}
              barGap={0}
              fullHeight={true}
              mirrored={true}
              className="opacity-60 transform rotate-90"
            />
          </div>

          {/* Right Sidebar Visualizer - Full Height */}
          <div className="fixed right-0 top-0 h-screen w-32 flex items-center justify-center z-30 pointer-events-none">
            <AudioVisualizer 
              key={`right-${visualizerKey}`}
              barCount={80}
              barHeight={120}
              barWidth={3}
              barGap={0}
              fullHeight={true}
              mirrored={true}
              className="opacity-60 transform -rotate-90"
            />
          </div>
        </>
      )}
      
      {/* Page Content */}
      {children}
    </div>
  );
};