import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Leaf, Check, X } from "lucide-react";

interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

interface BiodiversityQuizPuzzleProps {
  questions: QuizQuestion[];
  onSolve: () => void;
}

export const BiodiversityQuizPuzzle = ({ questions, onSolve }: BiodiversityQuizPuzzleProps) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);

  const handleAnswerSelect = (index: number) => {
    if (showFeedback) return;
    setSelectedAnswer(index);
  };

  const handleSubmit = () => {
    if (selectedAnswer === null) return;

    setShowFeedback(true);
    const isCorrect = selectedAnswer === questions[currentQuestion].correctAnswer;

    if (isCorrect) {
      setCorrectCount(correctCount + 1);
      
      setTimeout(() => {
        if (currentQuestion + 1 >= questions.length) {
          // All questions answered correctly
          if (correctCount + 1 === questions.length) {
            onSolve();
          }
        } else {
          setCurrentQuestion(currentQuestion + 1);
          setSelectedAnswer(null);
          setShowFeedback(false);
        }
      }, 2000);
    } else {
      setTimeout(() => {
        setSelectedAnswer(null);
        setShowFeedback(false);
      }, 2000);
    }
  };

  const question = questions[currentQuestion];

  return (
    <div className="bg-card border-2 border-primary/30 rounded-lg p-8 cartoon-shadow animate-fade-in-up">
      <div className="flex items-center gap-3 mb-6">
        <Leaf className="w-8 h-8 text-primary animate-pulse-glow" />
        <h3 className="text-3xl font-bold neon-cyan font-mono">Quiz Biodiversité</h3>
      </div>

      <div className="mb-6 bg-primary/10 border-2 border-primary rounded-lg p-4">
        <p className="text-sm text-muted-foreground mb-1 font-mono">Question {currentQuestion + 1}/{questions.length}</p>
        <p className="text-foreground font-semibold font-mono">Score: {correctCount}/{questions.length}</p>
      </div>

      <div className="bg-muted/50 border-2 border-border rounded-lg p-6 mb-6">
        <p className="text-lg font-semibold text-foreground mb-4 font-mono">{question.question}</p>
      </div>

      <div className="space-y-3 mb-6">
        {question.options.map((option, index) => {
          const isSelected = selectedAnswer === index;
          const isCorrect = index === question.correctAnswer;
          const showCorrect = showFeedback && isCorrect;
          const showIncorrect = showFeedback && isSelected && !isCorrect;

          return (
            <Button
              key={index}
              onClick={() => handleAnswerSelect(index)}
              disabled={showFeedback}
              variant={isSelected ? "default" : "outline"}
              className={`w-full h-auto py-4 px-6 text-left justify-start items-center rounded-lg transition-all font-mono border-2 ${
                showCorrect ? "bg-primary hover:bg-primary text-primary-foreground border-primary animate-pulse-glow" :
                showIncorrect ? "bg-destructive hover:bg-destructive text-destructive-foreground border-destructive" : 
                "border-border hover:border-primary"
              }`}
            >
              <span className="flex-1">{option}</span>
              {showCorrect && <Check className="w-5 h-5 ml-2" />}
              {showIncorrect && <X className="w-5 h-5 ml-2" />}
            </Button>
          );
        })}
      </div>

      {showFeedback && (
        <div className={`rounded-lg p-4 mb-4 border-2 ${
          selectedAnswer === question.correctAnswer 
            ? "bg-primary/10 border-primary" 
            : "bg-destructive/10 border-destructive"
        }`}>
          <p className="text-sm text-foreground font-mono">{question.explanation}</p>
        </div>
      )}

      <Button
        onClick={handleSubmit}
        disabled={selectedAnswer === null || showFeedback}
        className="w-full py-6 text-lg font-mono bg-primary hover:bg-primary/90 animate-pulse-glow"
      >
        VALIDER
      </Button>
    </div>
  );
};