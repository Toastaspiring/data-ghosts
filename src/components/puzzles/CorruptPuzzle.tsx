import { useState } from "react";
import { Button } from "@/components/ui/button";
import { DollarSign, UserX, FileX } from "lucide-react";

interface CorruptPuzzleProps {
  options: string[];
  correctAnswer: string;
  onSolve: () => void;
}

export const CorruptPuzzle = ({ options, correctAnswer, onSolve }: CorruptPuzzleProps) => {
  const [selected, setSelected] = useState<string | null>(null);

  const getIcon = (option: string) => {
    switch (option) {
      case "argent":
        return <DollarSign className="w-8 h-8" />;
      case "otage":
        return <UserX className="w-8 h-8" />;
      case "licence":
        return <FileX className="w-8 h-8" />;
      default:
        return null;
    }
  };

  const getLabel = (option: string) => {
    switch (option) {
      case "argent":
        return "Soudoyer avec de l'argent";
      case "otage":
        return "Retenir sa famille en otage";
      case "licence":
        return "Supprimer les licences logicielles";
      default:
        return option;
    }
  };

  const handleSelect = (option: string) => {
    setSelected(option);
    if (option === correctAnswer) {
      setTimeout(onSolve, 1000);
    }
  };

  return (
    <div className="bg-card rounded-3xl p-8 cartoon-shadow">
      <h3 className="text-2xl font-bold text-foreground mb-6 text-center">
        Comment corrompre le monteur ?
      </h3>

      <div className="grid gap-4">
        {options.map((option) => (
          <Button
            key={option}
            onClick={() => handleSelect(option)}
            variant={selected === option ? "default" : "outline"}
            className="h-auto py-6 flex items-center gap-4 text-lg justify-start"
            disabled={selected !== null}
          >
            {getIcon(option)}
            <span className="flex-1 text-left">{getLabel(option)}</span>
          </Button>
        ))}
      </div>

      {selected && selected !== correctAnswer && (
        <p className="mt-4 text-center text-destructive font-semibold">
          Mauvais choix ! Le monteur a résisté...
        </p>
      )}
    </div>
  );
};
