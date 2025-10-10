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
import FinalDestruction from "./pages/FinalDestruction";
import Leaderboard from "./pages/Leaderboard";
import NotFound from "./pages/NotFound";
import { audioManager } from "./lib/audioManager";
import { GlobalAudioVisualizer } from "./components/GlobalAudioVisualizer";
import { AudioPermissionModal } from "./components/ui/AudioPermissionModal";
import { useAudioPermission } from "./hooks/useAudioPermission";

const queryClient = new QueryClient();

const App = () => {
  const { showPermissionModal, grantPermission, denyPermission } = useAudioPermission();

  useEffect(() => {
    // Show audio permission modal on every page load
    const timer = setTimeout(() => {
      audioManager.forceShowPermissionModal();
    }, 1000); // 1 second after page load

    return () => clearTimeout(timer);
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <AudioPermissionModal 
          isOpen={showPermissionModal}
          onAllow={grantPermission}
          onDeny={denyPermission}
        />
        <BrowserRouter>
          <GlobalAudioVisualizer>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/create-lobby" element={<CreateLobby />} />
              <Route path="/join-lobby" element={<JoinLobby />} />
              <Route path="/lobby/:lobbyId" element={<Lobby />} />
              <Route path="/room-selection/:lobbyId" element={<RoomSelection />} />
              <Route path="/game/:lobbyId" element={<Game />} />
              <Route path="/final-destruction/:lobbyId" element={<FinalDestruction />} />
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
