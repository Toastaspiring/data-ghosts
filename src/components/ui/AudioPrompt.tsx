import { useAudioManager } from "@/hooks/useAudioManager";
import { VolumeX, MousePointerClick } from "lucide-react";

export const AudioPrompt = () => {
  const { isAudioUnlocked } = useAudioManager();

  if (isAudioUnlocked) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className="flex items-center gap-3 bg-background border border-border rounded-lg p-4 shadow-lg animate-pulse">
        <VolumeX className="w-6 h-6 text-muted-foreground" />
        <div className="flex flex-col">
          <p className="font-bold text-foreground">Son Muet</p>
          <p className="text-sm text-muted-foreground">Cliquez n'importe où pour activer</p>
        </div>
        <MousePointerClick className="w-6 h-6 text-primary animate-bounce" />
      </div>
    </div>
  );
};