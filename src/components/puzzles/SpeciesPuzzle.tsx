import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface SpeciesPuzzleProps {
  organisms: Array<{ name: string; depth: number; luminescence: boolean; quantum: boolean }>;
  correctAnswers: string[];
  onSolve: () => void;
}

export const SpeciesPuzzle = ({ organisms, correctAnswers, onSolve }: SpeciesPuzzleProps) => {
  const [selected, setSelected] = useState<string[]>([]);
  const [showFeedback, setShowFeedback] = useState(false);
  
  const allOrganisms = [
    ...organisms,
    { name: "Méduse Phosphorique", depth: 1500, luminescence: true, quantum: false },
    { name: "Algue Quantique", depth: 2500, luminescence: false, quantum: true },
    { name: "Krill Lumineux", depth: 800, luminescence: true, quantum: false },
    { name: "Éponge Abyssale", depth: 3000, luminescence: false, quantum: false },
  ];

  const toggleOrganism = (name: string) => {
    setSelected(selected.includes(name) ? selected.filter(n => n !== name) : [...selected, name]);
  };

  const handleSubmit = () => {
    setShowFeedback(true);
    if (JSON.stringify(selected.sort()) === JSON.stringify(correctAnswers.sort())) {
      setTimeout(onSolve, 1000);
    }
  };

  return (
    <div className="space-y-6 p-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold neon-cyan">Classification des Espèces</h2>
        <p className="text-sm text-muted-foreground">
          Sélectionnez tous les organismes quantiques à 2000m+ de profondeur
        </p>
        <Badge variant="outline">Sélectionnés: {selected.length}</Badge>
      </div>

      <div className="grid gap-3">
        {allOrganisms.map((org) => (
          <Card
            key={org.name}
            className={`p-4 cursor-pointer ${selected.includes(org.name) ? "border-primary border-2" : ""}`}
            onClick={() => toggleOrganism(org.name)}
          >
            <h3 className="font-bold text-sm">{org.name}</h3>
            <div className="flex gap-2 mt-2 flex-wrap">
              <Badge variant="outline" className="text-xs">{org.depth}m</Badge>
              {org.luminescence && <Badge className="text-xs bg-blue-500">Bioluminescent</Badge>}
              {org.quantum && <Badge variant="destructive" className="text-xs">Propriétés Quantiques</Badge>}
            </div>
          </Card>
        ))}
      </div>

      {showFeedback && selected.length > 0 && JSON.stringify(selected.sort()) !== JSON.stringify(correctAnswers.sort()) && (
        <div className="bg-destructive/20 border border-destructive rounded-lg p-3 text-center">
          <p className="text-sm text-destructive">
            Sélection incorrecte - Vérifiez les critères: quantum ET profondeur 2000m+
          </p>
        </div>
      )}

      <Button onClick={handleSubmit} disabled={selected.length === 0} className="w-full" size="lg">
        Valider la Classification
      </Button>
    </div>
  );
};
