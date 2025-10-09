import { useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import CreateLobby from "./pages/CreateLobby";
import JoinLobby from "./pages/JoinLobby";
import Lobby from "./pages/Lobby";
import RoomSelection from "./pages/RoomSelection";
import Game from "./pages/Game";
import Leaderboard from "./pages/Leaderboard";
import NotFound from "./pages/NotFound";
import { audioManager } from "./lib/audioManager";
import { GlobalAudioVisualizer } from "./components/GlobalAudioVisualizer";

const queryClient = new QueryClient();

const App = () => {
  useEffect(() => {
    // Immediately try to unlock audio when app loads
    console.log("🚀 App mounted, attempting immediate audio unlock...");
    audioManager.unlockAudio();
    
    // Set up additional interaction listeners as fallback
    const handleInteraction = (event: Event) => {
      console.log(`🎯 App-level interaction: ${event.type}`);
      audioManager.unlockAudio();
    };

    // Listen to various interaction events
    const events = ['click', 'keydown', 'touchstart', 'mousedown'];
    events.forEach(event => {
      window.addEventListener(event, handleInteraction, { once: true, passive: true });
    });

    // Cleanup function
    return () => {
      events.forEach(event => {
        window.removeEventListener(event, handleInteraction);
      });
    };
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <GlobalAudioVisualizer>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/create-lobby" element={<CreateLobby />} />
              <Route path="/join-lobby" element={<JoinLobby />} />
              <Route path="/lobby/:lobbyId" element={<Lobby />} />
              <Route path="/room-selection/:lobbyId" element={<RoomSelection />} />
              <Route path="/game/:lobbyId" element={<Game />} />
              <Route path="/leaderboard/:lobbyId" element={<Leaderboard />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </GlobalAudioVisualizer>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
