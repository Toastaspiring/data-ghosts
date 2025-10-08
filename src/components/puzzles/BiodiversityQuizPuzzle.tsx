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
    <div className="bg-card rounded-3xl p-8 cartoon-shadow">
      <div className="flex items-center gap-3 mb-6">
        <Leaf className="w-8 h-8 text-primary" />
        <h3 className="text-2xl font-bold text-foreground">Quiz Biodiversité</h3>
      </div>

      <div className="mb-6 bg-primary/10 border-2 border-primary rounded-xl p-4">
        <p className="text-sm text-muted-foreground mb-1">Question {currentQuestion + 1}/{questions.length}</p>
        <p className="text-foreground font-semibold">Score: {correctCount}/{questions.length}</p>
      </div>

      <div className="bg-secondary/20 rounded-2xl p-6 mb-6">
        <p className="text-lg font-semibold text-foreground mb-4">{question.question}</p>
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
              className={`w-full h-auto py-4 px-6 text-left justify-start items-center rounded-xl transition-all ${
                showCorrect ? "bg-green-500 hover:bg-green-500 text-white" :
                showIncorrect ? "bg-destructive hover:bg-destructive text-destructive-foreground" : ""
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
        <div className={`rounded-xl p-4 mb-4 ${
          selectedAnswer === question.correctAnswer 
            ? "bg-green-500/10 border-2 border-green-500" 
            : "bg-destructive/10 border-2 border-destructive"
        }`}>
          <p className="text-sm text-foreground">{question.explanation}</p>
        </div>
      )}

      <Button
        onClick={handleSubmit}
        disabled={selectedAnswer === null || showFeedback}
        className="w-full rounded-xl py-6 text-lg"
      >
        Valider
      </Button>
    </div>
  );
};