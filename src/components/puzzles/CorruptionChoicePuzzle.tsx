import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface CorruptionChoicePuzzleProps {
  methods: Array<{ name: string; cost: string; reliability: string; suspicion: string; effectiveness: string; illegal?: boolean }>;
  onSolve: () => void;
}

export const CorruptionChoicePuzzle = ({ methods, onSolve }: CorruptionChoicePuzzleProps) => {
  const [selected, setSelected] = useState<number | null>(null);

  return (
    <div className="space-y-6 p-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold neon-cyan">Choix de Corruption</h2>
        <p className="text-muted-foreground">Choisissez la méthode optimale</p>
      </div>

      <div className="grid gap-4">
        {methods.map((method, idx) => (
          <Card
            key={idx}
            className={`p-4 cursor-pointer ${selected === idx ? "border-primary border-2" : ""}`}
            onClick={() => setSelected(idx)}
          >
            <h3 className="font-bold">{method.name}</h3>
            {method.illegal && <Badge variant="destructive" className="mt-2">Illégal</Badge>}
            <div className="grid grid-cols-2 gap-2 mt-3 text-sm">
              <div>Coût: {method.cost}</div>
              <div>Fiabilité: {method.reliability}</div>
              <div>Suspicion: {method.suspicion}</div>
              <div>Efficacité: {method.effectiveness}</div>
            </div>
          </Card>
        ))}
      </div>

      <Button onClick={() => selected === 2 && onSolve()} disabled={selected === null} className="w-full" size="lg">
        Exécuter la Corruption
      </Button>
    </div>
  );
};
