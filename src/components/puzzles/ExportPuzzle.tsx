import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Download, AlertTriangle } from "lucide-react";

interface ExportPuzzleProps {
  onSolve: () => void;
}

export const ExportPuzzle = ({ onSolve }: ExportPuzzleProps) => {
  const [resolution, setResolution] = useState("1080p");
  const [bitrate, setBitrate] = useState(8000);
  const [codec, setCodec] = useState("H.264");
  const [framerate, setFramerate] = useState(60);

  const handleSubmit = () => {
    if (resolution === "240p" && bitrate <= 1000) {
      onSolve();
    }
  };

  const qualityScore = () => {
    let score = 100;
    if (resolution === "240p") score -= 40;
    else if (resolution === "360p") score -= 30;
    else if (resolution === "480p") score -= 20;
    
    if (bitrate <= 1000) score -= 40;
    else if (bitrate <= 2000) score -= 20;
    
    if (codec !== "H.264") score -= 20;
    
    return Math.max(0, score);
  };

  const quality = qualityScore();
  const isDegraded = resolution === "240p" && bitrate <= 1000;

  return (
    <div className="space-y-6 p-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold neon-cyan flex items-center justify-center gap-2">
          <Download className="w-6 h-6" />
          Paramètres d'Export
        </h2>
        <p className="text-muted-foreground">
          Choisissez les pires réglages pour une qualité déplorable
        </p>
        <Badge variant={quality <= 20 ? "destructive" : "secondary"}>
          Qualité: {quality}%
        </Badge>
      </div>

      <Card className="p-6 space-y-6">
        {/* Resolution */}
        <div className="space-y-3">
          <h3 className="font-bold">Résolution</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {["240p", "360p", "480p", "720p", "1080p"].map((res) => (
              <Button
                key={res}
                variant={resolution === res ? "default" : "outline"}
                onClick={() => setResolution(res)}
                className={resolution === "240p" && res === "240p" ? "border-red-500" : ""}
              >
                {res}
              </Button>
            ))}
          </div>
        </div>

        {/* Bitrate */}
        <div className="space-y-3">
          <h3 className="font-bold">Bitrate (kbps)</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {[500, 1000, 2000, 4000, 8000].map((rate) => (
              <Button
                key={rate}
                variant={bitrate === rate ? "default" : "outline"}
                onClick={() => setBitrate(rate)}
                className={bitrate <= 1000 && rate <= 1000 ? "border-red-500" : ""}
              >
                {rate}
              </Button>
            ))}
          </div>
        </div>

        {/* Codec */}
        <div className="space-y-3">
          <h3 className="font-bold">Codec</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {["H.264", "H.265", "MPEG-1", "DivX"].map((c) => (
              <Button
                key={c}
                variant={codec === c ? "default" : "outline"}
                onClick={() => setCodec(c)}
              >
                {c}
              </Button>
            ))}
          </div>
        </div>

        {/* Framerate */}
        <div className="space-y-3">
          <h3 className="font-bold">Framerate (fps)</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {[15, 24, 30, 60].map((fps) => (
              <Button
                key={fps}
                variant={framerate === fps ? "default" : "outline"}
                onClick={() => setFramerate(fps)}
              >
                {fps} fps
              </Button>
            ))}
          </div>
        </div>
      </Card>

      {/* Preview */}
      <Card className="p-6 space-y-3">
        <h3 className="font-bold text-center">Aperçu de l'Export</h3>
        <div
          className="aspect-video rounded-lg overflow-hidden relative"
          style={{
            imageRendering: resolution === "240p" ? "pixelated" : "auto",
            filter: bitrate <= 1000 ? "blur(2px)" : "none",
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-blue-900 to-purple-900 flex items-center justify-center text-6xl">
            🎬
          </div>
          {resolution === "240p" && (
            <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" />
          )}
        </div>
        <div className="text-center text-sm space-y-1">
          <p className="font-mono">{resolution} • {bitrate}kbps • {codec} • {framerate}fps</p>
          <p className={quality <= 20 ? "text-red-500 font-bold" : "text-muted-foreground"}>
            Qualité: {quality <= 20 ? "Déplorable" : quality <= 50 ? "Médiocre" : "Acceptable"}
          </p>
        </div>
      </Card>

      {isDegraded && (
        <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-4 text-center animate-pulse">
          <AlertTriangle className="w-6 h-6 mx-auto mb-2 text-red-500" />
          <p className="font-bold text-red-600 dark:text-red-400">
            Qualité catastrophique ! Parfait pour le sabotage.
          </p>
        </div>
      )}

      <Button
        onClick={handleSubmit}
        disabled={!isDegraded}
        className="w-full"
        size="lg"
      >
        Lancer l'Export
      </Button>
    </div>
  );
};
