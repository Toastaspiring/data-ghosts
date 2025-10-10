import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Shield, AlertCircle, CheckCircle, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

interface CaptchaPuzzleProps {
  images?: any[];
  instruction?: string;
  onSolve: () => void;
}

// Glitch characters that can randomly appear
const GLITCH_CHARS = ['@', '#', '$', '%', '&', '*', '!', '?', '█', '▓', '▒', '░', '◆', '◇', '○', '●'];

// Generate a random captcha code
const generateCaptchaCode = () => {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // Removed confusing chars like I, O, 0, 1
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
};

// Apply glitch effect to text
const applyGlitchEffect = (text: string, glitchLevel: number): string => {
  return text.split('').map((char, index) => {
    // Randomly replace characters with glitch chars
    if (Math.random() < glitchLevel) {
      return GLITCH_CHARS[Math.floor(Math.random() * GLITCH_CHARS.length)];
    }
    
    // Randomly shift character position (visually)
    if (Math.random() < glitchLevel * 0.5) {
      return char;
    }
    
    return char;
  }).join('');
};

export const CaptchaPuzzle = ({ onSolve }: CaptchaPuzzleProps) => {
  const [captchaCode] = useState(generateCaptchaCode());
  const [displayedText, setDisplayedText] = useState(captchaCode);
  const [input, setInput] = useState("");
  const [attempts, setAttempts] = useState(0);
  const [glitchIntensity, setGlitchIntensity] = useState(0.3);
  const [submitted, setSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [showHint, setShowHint] = useState(false);

  // Constantly change the displayed text with glitch effect
  useEffect(() => {
    const interval = setInterval(() => {
      const glitched = applyGlitchEffect(captchaCode, glitchIntensity);
      setDisplayedText(glitched);
    }, 150); // Change every 150ms

    return () => clearInterval(interval);
  }, [captchaCode, glitchIntensity]);

  // Increase glitch intensity over time
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (glitchIntensity < 0.6) {
        setGlitchIntensity(prev => Math.min(prev + 0.05, 0.6));
      }
    }, 3000);

    return () => clearTimeout(timeout);
  }, [glitchIntensity]);

  const handleSubmit = () => {
    setSubmitted(true);
    
    const isValid = input.toUpperCase() === captchaCode.toUpperCase();
    setIsCorrect(isValid);
    
    if (isValid) {
      setTimeout(() => onSolve(), 1000);
    } else {
      setAttempts(prev => prev + 1);
      
      // Show hint after 2 failed attempts
      if (attempts >= 1) {
        setShowHint(true);
      }
      
      setTimeout(() => {
        setSubmitted(false);
        setInput("");
      }, 2000);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && input.length >= 4 && !submitted) {
      handleSubmit();
    }
  };

  return (
    <div className="bg-card border-2 border-primary/30 rounded-lg p-8 cartoon-shadow animate-fade-in-up">
      <div className="flex items-center gap-3 mb-6">
        <Shield className="w-8 h-8 text-primary animate-pulse-glow" />
        <h3 className="text-2xl font-bold neon-cyan font-mono">Captcha de Sécurité Corrompu</h3>
      </div>
      
      <div className="mb-6">
        <p className="text-lg text-center mb-2">
          🔓 Déchiffrez le code malgré la corruption du système
        </p>
        <p className="text-sm text-muted-foreground text-center">
          Le texte va constamment se glitcher - concentrez-vous sur les vraies lettres !
        </p>
      </div>

      {/* Glitched Captcha Display */}
      <div className="relative bg-black/80 border-2 border-primary/50 rounded-lg p-8 mb-6 overflow-hidden">
        {/* Scan lines effect */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="scan-lines h-full w-full opacity-20" />
        </div>
        
        {/* Glitch overlay */}
        <div className="absolute inset-0 pointer-events-none animate-pulse">
          <div className="bg-primary/5 w-full h-1/3 animate-slide-down" />
        </div>
        
        {/* Captcha text */}
        <p className={cn(
          "text-6xl font-mono font-bold text-center tracking-[0.5em] select-none relative z-10",
          "neon-cyan animate-glitch"
        )}>
          {displayedText}
        </p>
        
        {/* Random noise pixels */}
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-primary animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`
              }}
            />
          ))}
        </div>
      </div>

      {/* Hint section */}
      {showHint && (
        <div className="mb-4 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg animate-fade-in-up">
          <div className="flex items-start gap-2">
            <AlertCircle className="w-5 h-5 text-yellow-400 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-yellow-400 mb-1">Indice :</p>
              <p className="text-sm">
                Regardez attentivement pendant quelques secondes. Le vrai code apparaît entre les glitchs. 
                Il y a <strong>{captchaCode.length} caractères</strong>.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Input section */}
      <div className="space-y-4">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value.toUpperCase())}
          onKeyPress={handleKeyPress}
          placeholder="ENTREZ LE CODE..."
          className={cn(
            "py-6 text-2xl text-center font-mono tracking-widest bg-input border-2",
            "focus:border-primary uppercase",
            submitted && (isCorrect ? "border-green-500" : "border-red-500")
          )}
          maxLength={captchaCode.length}
          disabled={submitted}
        />
        
        {/* Feedback message */}
        {submitted && (
          <div className={cn(
            "text-center font-semibold py-3 px-4 rounded-lg flex items-center justify-center gap-2",
            isCorrect ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"
          )}>
            {isCorrect ? (
              <>
                <CheckCircle className="w-5 h-5" />
                <span>✓ Accès Autorisé ! Téléphone Déverrouillé...</span>
              </>
            ) : (
              <>
                <AlertCircle className="w-5 h-5" />
                <span>✗ Code Incorrect. Tentative {attempts + 1}/∞</span>
              </>
            )}
          </div>
        )}
        
        <Button
          onClick={handleSubmit}
          disabled={input.length < 4 || submitted}
          className={cn(
            "w-full py-6 text-lg font-mono animate-pulse-glow transition-all",
            "bg-primary hover:bg-primary/90"
          )}
        >
          <Zap className="w-5 h-5 mr-2" />
          DÉCHIFFRER ET VALIDER
        </Button>
        
        {/* Stats */}
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>Tentatives: {attempts}</span>
          <span>Code: {captchaCode.length} caractères</span>
        </div>
      </div>

      {/* Add custom CSS for glitch animation */}
      <style>{`
        @keyframes glitch {
          0% { transform: translate(0); }
          20% { transform: translate(-2px, 2px); }
          40% { transform: translate(-2px, -2px); }
          60% { transform: translate(2px, 2px); }
          80% { transform: translate(2px, -2px); }
          100% { transform: translate(0); }
        }
        
        .animate-glitch {
          animation: glitch 0.3s infinite;
        }
        
        .scan-lines {
          background: linear-gradient(
            to bottom,
            transparent 50%,
            rgba(0, 255, 255, 0.1) 50%
          );
          background-size: 100% 4px;
        }
        
        @keyframes slide-down {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(300%); }
        }
        
        .animate-slide-down {
          animation: slide-down 3s linear infinite;
        }
      `}</style>
    </div>
  );
};
