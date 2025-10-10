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

  const toggleOrganism = (name: string) => {
    setSelected(selected.includes(name) ? selected.filter(n => n !== name) : [...selected, name]);
  };

  const handleSubmit = () => {
    if (JSON.stringify(selected.sort()) === JSON.stringify(correctAnswers.sort())) {
      onSolve();
    }
  };

  return (
    <div className="space-y-6 p-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold neon-cyan">Classification des Espèces</h2>
        <Badge variant="outline">Sélectionnés: {selected.length}/{correctAnswers.length}</Badge>
      </div>

      <div className="grid gap-3">
        {organisms.map((org) => (
          <Card
            key={org.name}
            className={`p-4 cursor-pointer ${selected.includes(org.name) ? "border-primary border-2" : ""}`}
            onClick={() => toggleOrganism(org.name)}
          >
            <h3 className="font-bold">{org.name}</h3>
            <div className="flex gap-2 mt-2">
              <Badge variant="outline">{org.depth}m</Badge>
              {org.luminescence && <Badge>Luminescent</Badge>}
              {org.quantum && <Badge variant="destructive">Quantum</Badge>}
            </div>
          </Card>
        ))}
      </div>

      <Button onClick={handleSubmit} disabled={selected.length !== correctAnswers.length} className="w-full" size="lg">
        Valider la Classification
      </Button>
    </div>
  );
};
