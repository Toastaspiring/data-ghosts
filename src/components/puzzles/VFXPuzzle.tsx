import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Layers, Eye } from "lucide-react";

interface EffectLayer {
  name: string;
  transparency: number;
}

interface VFXPuzzleProps {
  layers: EffectLayer[];
  targetTransparency: number;
  onSolve: () => void;
}

export const VFXPuzzle = ({ layers: initialLayers, targetTransparency, onSolve }: VFXPuzzleProps) => {
  const [layers, setLayers] = useState<EffectLayer[]>(initialLayers);
  const [showPreview, setShowPreview] = useState(false);

  const updateTransparency = (index: number, value: number[]) => {
    const newLayers = [...layers];
    newLayers[index] = { ...newLayers[index], transparency: value[0] };
    setLayers(newLayers);
  };

  const handleSubmit = () => {
    const hasHighTransparency = layers.some(layer => layer.transparency >= targetTransparency);
    if (hasHighTransparency) {
      onSolve();
    }
  };

  const layerIcons: Record<string, string> = {
    background: "🌄",
    cgi_character: "🤖",
    lighting: "💡",
    compositing: "🎬",
  };

  return (
    <div className="space-y-6 p-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold neon-cyan flex items-center justify-center gap-2">
          <Layers className="w-6 h-6" />
          Effets Spéciaux Exposés
        </h2>
        <p className="text-muted-foreground">
          Augmentez la transparence d'au moins une couche à {targetTransparency}% pour révéler les trucages
        </p>
      </div>

      <div className="space-y-4">
        {layers.map((layer, idx) => (
          <Card key={idx} className="p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="text-3xl">{layerIcons[layer.name] || "📄"}</div>
                <div>
                  <div className="font-medium capitalize">{layer.name.replace(/_/g, " ")}</div>
                  <div className="text-sm text-muted-foreground">
                    Transparence: {layer.transparency}%
                  </div>
                </div>
              </div>
              <Badge variant={layer.transparency >= targetTransparency ? "destructive" : "secondary"}>
                {layer.transparency >= targetTransparency ? "Exposé ✓" : "Caché"}
              </Badge>
            </div>

            <Slider
              value={[layer.transparency]}
              onValueChange={(value) => updateTransparency(idx, value)}
              min={0}
              max={100}
              step={5}
              className="w-full"
            />

            {/* Visual preview of transparency */}
            <div className="relative h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg overflow-hidden">
              <div
                className="absolute inset-0 bg-black transition-all"
                style={{ opacity: 1 - layer.transparency / 100 }}
              />
              <div className="absolute inset-0 flex items-center justify-center text-white font-bold">
                {layer.name.replace(/_/g, " ").toUpperCase()}
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Button
        variant="outline"
        onClick={() => setShowPreview(!showPreview)}
        className="w-full"
      >
        <Eye className="w-4 h-4 mr-2" />
        {showPreview ? "Masquer" : "Prévisualiser"} le Résultat
      </Button>

      {showPreview && (
        <Card className="p-6 bg-gradient-to-br from-purple-900 to-blue-900">
          <div className="text-center text-white space-y-2">
            <p className="font-bold">Aperçu des Effets</p>
            <div className="relative h-40 rounded-lg overflow-hidden bg-black/50">
              {layers.map((layer, idx) => (
                <div
                  key={idx}
                  className="absolute inset-0 flex items-center justify-center text-4xl"
                  style={{
                    opacity: 1 - layer.transparency / 100,
                    zIndex: layers.length - idx,
                  }}
                >
                  {layerIcons[layer.name]}
                </div>
              ))}
            </div>
          </div>
        </Card>
      )}

      <Button
        onClick={handleSubmit}
        disabled={!layers.some(l => l.transparency >= targetTransparency)}
        className="w-full"
        size="lg"
      >
        Exposer les Trucages
      </Button>
    </div>
  );
};
