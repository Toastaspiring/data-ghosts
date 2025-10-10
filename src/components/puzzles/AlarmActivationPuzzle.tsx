import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { AlertTriangle, CheckCircle2, Hammer, Shield, Clock, Brain, Zap, Lock, Unlock, Settings } from "lucide-react";

interface AlarmActivationPuzzleProps {
  sequence: string[];
  onSolve: () => void;
}

export const AlarmActivationPuzzle = ({ sequence, onSolve }: AlarmActivationPuzzleProps) => {
  // Phase management
  const [currentPhase, setCurrentPhase] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(300); // 5 minutes total
  const [overallProgress, setOverallProgress] = useState(0);

  // Phase 1: Security Bypass
  const [emergencyCode, setEmergencyCode] = useState("");
  const [codeAttempts, setCodeAttempts] = useState(0);
  const [codeUnlocked, setCodeUnlocked] = useState(false);
  const [showCodeHint, setShowCodeHint] = useState(false);

  // Phase 2: System Diagnostics
  const [diagnosticsRunning, setDiagnosticsRunning] = useState(false);
  const [diagnosticProgress, setDiagnosticProgress] = useState(0);
  const [systemStatus, setSystemStatus] = useState<Record<string, boolean>>({});
  const [diagnosticsComplete, setDiagnosticsComplete] = useState(false);

  // Phase 3: Safety Protocol
  const [protocolChecks, setProtocolChecks] = useState<Record<string, boolean>>({});
  const [protocolQuizAnswers, setProtocolQuizAnswers] = useState<Record<string, string>>({});
  const [protocolComplete, setProtocolComplete] = useState(false);

  // Phase 4: Manual Override
  const [wireSequence, setWireSequence] = useState<string[]>([]);
  const [currentWire, setCurrentWire] = useState(0);
  const [overrideProgress, setOverrideProgress] = useState(0);
  const [finalActivation, setFinalActivation] = useState(false);

  // Timer countdown
  useEffect(() => {
    if (timeRemaining > 0 && !finalActivation) {
      const timer = setTimeout(() => setTimeRemaining(prev => prev - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [timeRemaining, finalActivation]);

  // Calculate overall progress
  useEffect(() => {
    const phaseWeights = [25, 25, 25, 25]; // Each phase worth 25%
    let progress = 0;
    
    if (codeUnlocked) progress += phaseWeights[0];
    if (diagnosticsComplete) progress += phaseWeights[1];
    if (protocolComplete) progress += phaseWeights[2];
    if (finalActivation) progress += phaseWeights[3];
    
    setOverallProgress(progress);
    
    if (progress === 100) {
      setTimeout(() => onSolve(), 2000);
    }
  }, [codeUnlocked, diagnosticsComplete, protocolComplete, finalActivation, onSolve]);

  // Emergency codes (hidden in comments/hints)
  const validCodes = ["FIRE-7734", "EVAC-911", "EMRG-2024"];
  const correctCode = "FIRE-7734"; // F-I-R-E upside down + year

  // Phase 1: Security Bypass
  const handleCodeSubmit = () => {
    if (emergencyCode.toUpperCase() === correctCode) {
      setCodeUnlocked(true);
      setCurrentPhase(1);
    } else {
      setCodeAttempts(prev => prev + 1);
      if (codeAttempts >= 2) {
        setShowCodeHint(true);
      }
      setEmergencyCode("");
    }
  };

  // Phase 2: System Diagnostics
  const runDiagnostics = () => {
    setDiagnosticsRunning(true);
    setDiagnosticProgress(0);
    
    const systems = ['power_grid', 'smoke_detection', 'sprinkler_network', 'emergency_lights', 'evacuation_routes'];
    const newStatus: Record<string, boolean> = {};
    
    const interval = setInterval(() => {
      setDiagnosticProgress(prev => {
        const newProgress = prev + 2;
        
        // Simulate system checks
        if (newProgress >= 20 && !newStatus.power_grid) newStatus.power_grid = Math.random() > 0.3;
        if (newProgress >= 40 && !newStatus.smoke_detection) newStatus.smoke_detection = Math.random() > 0.2;
        if (newProgress >= 60 && !newStatus.sprinkler_network) newStatus.sprinkler_network = Math.random() > 0.4;
        if (newProgress >= 80 && !newStatus.emergency_lights) newStatus.emergency_lights = Math.random() > 0.1;
        if (newProgress >= 100 && !newStatus.evacuation_routes) newStatus.evacuation_routes = Math.random() > 0.2;
        
        setSystemStatus({...newStatus});
        
        if (newProgress >= 100) {
          clearInterval(interval);
          setDiagnosticsRunning(false);
          
          // Check if we need to fix any systems
          const failedSystems = Object.entries(newStatus).filter(([_, status]) => !status);
          if (failedSystems.length === 0) {
            setDiagnosticsComplete(true);
            setCurrentPhase(2);
          }
        }
        
        return newProgress;
      });
    }, 100);
  };

  const fixSystem = (systemName: string) => {
    setSystemStatus(prev => ({
      ...prev,
      [systemName]: true
    }));
    
    // Check if all systems are now working
    const allWorking = Object.values({...systemStatus, [systemName]: true}).every(status => status);
    if (allWorking) {
      setDiagnosticsComplete(true);
      setCurrentPhase(2);
    }
  };

  // Phase 3: Safety Protocol Quiz
  const protocolQuestions = [
    {
      id: 'evacuation_time',
      question: 'Temps maximum d\'évacuation pour un bâtiment de cette taille?',
      options: ['2 minutes', '5 minutes', '10 minutes', '15 minutes'],
      correct: '5 minutes'
    },
    {
      id: 'priority_order',
      question: 'Ordre de priorité d\'évacuation?',
      options: ['Enfants, Handicapés, Adultes', 'Handicapés, Enfants, Adultes', 'Adultes, Enfants, Handicapés', 'Tous ensemble'],
      correct: 'Handicapés, Enfants, Adultes'
    },
    {
      id: 'assembly_point',
      question: 'Distance minimum du point de rassemblement?',
      options: ['10m du bâtiment', '25m du bâtiment', '50m du bâtiment', '100m du bâtiment'],
      correct: '50m du bâtiment'
    }
  ];

  const handleProtocolAnswer = (questionId: string, answer: string) => {
    setProtocolQuizAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  const validateProtocol = () => {
    const allCorrect = protocolQuestions.every(q => 
      protocolQuizAnswers[q.id] === q.correct
    );
    
    if (allCorrect) {
      setProtocolComplete(true);
      setCurrentPhase(3);
      
      // Generate random wire sequence for final phase
      const wires = ['RED', 'BLUE', 'GREEN', 'YELLOW', 'WHITE'];
      const sequence = wires.sort(() => Math.random() - 0.5).slice(0, 4);
      setWireSequence(sequence);
    }
  };

  // Phase 4: Manual Override
  const handleWireConnection = (wire: string) => {
    if (wire === wireSequence[currentWire]) {
      setCurrentWire(prev => prev + 1);
      setOverrideProgress(prev => prev + 25);
      
      if (currentWire + 1 >= wireSequence.length) {
        setFinalActivation(true);
      }
    } else {
      // Wrong wire - reset sequence
      setCurrentWire(0);
      setOverrideProgress(0);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const phases = [
    { name: 'Sécurité', icon: Lock, complete: codeUnlocked },
    { name: 'Diagnostic', icon: Settings, complete: diagnosticsComplete },
    { name: 'Protocole', icon: Shield, complete: protocolComplete },
    { name: 'Override', icon: Zap, complete: finalActivation }
  ];

  return (
    <div className="space-y-6 p-6 max-h-[80vh] overflow-y-auto">
      {/* Header with progress and timer */}
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-bold neon-cyan flex items-center justify-center gap-2">
          <AlertTriangle className="w-8 h-8 text-red-500" />
          Système d'Alarme Avancé
        </h2>
        
        <div className="flex gap-4 justify-center items-center flex-wrap">
          <Badge variant={timeRemaining > 180 ? "secondary" : timeRemaining > 60 ? "default" : "destructive"}>
            <Clock className="w-4 h-4 mr-1" />
            {formatTime(timeRemaining)}
          </Badge>
          <Badge variant="outline">
            Progression: {overallProgress}%
          </Badge>
          <Badge variant={currentPhase === 3 ? "default" : "secondary"}>
            Phase {currentPhase + 1}/4
          </Badge>
        </div>

        <Progress value={overallProgress} className="h-3" />
        
        {/* Phase indicators */}
        <div className="flex justify-center gap-2">
          {phases.map((phase, idx) => {
            const PhaseIcon = phase.icon;
            return (
              <div
                key={idx}
                className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs ${
                  phase.complete
                    ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                    : idx === currentPhase
                    ? 'bg-primary/20 text-primary border border-primary/30'
                    : 'bg-muted/20 text-muted-foreground border border-muted/30'
                }`}
              >
                <PhaseIcon className="w-3 h-3" />
                {phase.name}
                {phase.complete && <CheckCircle2 className="w-3 h-3" />}
              </div>
            );
          })}
        </div>
      </div>

      {/* Phase 1: Security Bypass */}
      {currentPhase === 0 && (
        <Card className="p-6 bg-red-950/20 border-red-500/50">
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <Lock className="w-5 h-5 text-red-400" />
              <h3 className="text-xl font-bold text-red-400">Phase 1: Contournement Sécuritaire</h3>
            </div>
            
            <p className="text-sm text-muted-foreground mb-4">
              Entrez le code d'urgence pour déverrouiller le système d'alarme avancé.
            </p>
            
            <div className="space-y-3">
              <div className="flex gap-2">
                <Input
                  type="text"
                  placeholder="Code d'urgence..."
                  value={emergencyCode}
                  onChange={(e) => setEmergencyCode(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleCodeSubmit()}
                  className="font-mono uppercase"
                  maxLength={8}
                />
                <Button onClick={handleCodeSubmit} variant="destructive">
                  Valider
                </Button>
              </div>
              
              {codeAttempts > 0 && (
                <p className="text-xs text-yellow-400">
                  ❌ Code incorrect ({codeAttempts}/3 tentatives)
                </p>
              )}
              
              {showCodeHint && (
                <Card className="p-3 bg-yellow-500/10 border-yellow-500/30">
                  <p className="text-xs text-yellow-400">
                    💡 Indice: Le code contient "FIRE" dans un format spécial + année courante
                  </p>
                  <p className="text-xs text-yellow-400 mt-1">
                    Pensez à comment "FIRE" pourrait s'écrire avec des chiffres...
                  </p>
                </Card>
              )}
            </div>
          </div>
        </Card>
      )}

      {/* Phase 2: System Diagnostics */}
      {currentPhase === 1 && (
        <Card className="p-6 bg-blue-950/20 border-blue-500/50">
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <Settings className="w-5 h-5 text-blue-400" />
              <h3 className="text-xl font-bold text-blue-400">Phase 2: Diagnostic Système</h3>
            </div>
            
            <p className="text-sm text-muted-foreground mb-4">
              Vérifiez tous les systèmes de sécurité avant l'activation de l'alarme.
            </p>
            
            {!diagnosticsRunning && !diagnosticsComplete && (
              <Button onClick={runDiagnostics} className="w-full" variant="outline">
                <Brain className="w-4 h-4 mr-2" />
                Lancer Diagnostic Complet
              </Button>
            )}
            
            {diagnosticsRunning && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Scan en cours...</span>
                  <span>{diagnosticProgress}%</span>
                </div>
                <Progress value={diagnosticProgress} className="h-2" />
              </div>
            )}
            
            {Object.keys(systemStatus).length > 0 && (
              <div className="space-y-2">
                <h4 className="font-semibold text-sm">État des Systèmes:</h4>
                {Object.entries(systemStatus).map(([system, status]) => (
                  <div key={system} className="flex items-center justify-between p-2 bg-muted/20 rounded">
                    <span className="text-sm capitalize">
                      {system.replace('_', ' ')}
                    </span>
                    <div className="flex items-center gap-2">
                      {status ? (
                        <Badge variant="default" className="bg-green-500">✓ OK</Badge>
                      ) : (
                        <div className="flex gap-2">
                          <Badge variant="destructive">❌ Échec</Badge>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => fixSystem(system)}
                          >
                            Réparer
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </Card>
      )}

      {/* Phase 3: Safety Protocol Quiz */}
      {currentPhase === 2 && (
        <Card className="p-6 bg-green-950/20 border-green-500/50">
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <Shield className="w-5 h-5 text-green-400" />
              <h3 className="text-xl font-bold text-green-400">Phase 3: Protocole de Sécurité</h3>
            </div>
            
            <p className="text-sm text-muted-foreground mb-4">
              Répondez correctement aux questions de sécurité pour continuer.
            </p>
            
            <div className="space-y-4">
              {protocolQuestions.map((question) => (
                <div key={question.id} className="space-y-2">
                  <p className="font-semibold text-sm">{question.question}</p>
                  <div className="grid grid-cols-2 gap-2">
                    {question.options.map((option) => (
                      <Button
                        key={option}
                        variant={protocolQuizAnswers[question.id] === option ? "default" : "outline"}
                        size="sm"
                        onClick={() => handleProtocolAnswer(question.id, option)}
                        className="text-xs justify-start"
                      >
                        {option}
                      </Button>
                    ))}
                  </div>
                </div>
              ))}
              
              {Object.keys(protocolQuizAnswers).length === protocolQuestions.length && (
                <Button onClick={validateProtocol} className="w-full" variant="default">
                  Valider Protocole de Sécurité
                </Button>
              )}
            </div>
          </div>
        </Card>
      )}

      {/* Phase 4: Manual Override */}
      {currentPhase === 3 && (
        <Card className="p-6 bg-purple-950/20 border-purple-500/50">
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <Zap className="w-5 h-5 text-purple-400" />
              <h3 className="text-xl font-bold text-purple-400">Phase 4: Override Manuel</h3>
            </div>
            
            <p className="text-sm text-muted-foreground mb-4">
              Connectez les fils dans l'ordre exact pour activer l'alarme manuellement.
            </p>
            
            {wireSequence.length > 0 && (
              <div className="space-y-4">
                <div className="text-center">
                  <p className="text-sm font-semibold mb-2">
                    Séquence requise: {wireSequence.join(' → ')}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Fil actuel: {currentWire + 1}/{wireSequence.length}
                  </p>
                  <Progress value={overrideProgress} className="h-2 mt-2" />
                </div>
                
                <div className="grid grid-cols-5 gap-2">
                  {['RED', 'BLUE', 'GREEN', 'YELLOW', 'WHITE'].map((wire) => (
                    <Button
                      key={wire}
                      onClick={() => handleWireConnection(wire)}
                      variant="outline"
                      className={`h-12 ${
                        wire === 'RED' ? 'border-red-500 text-red-400' :
                        wire === 'BLUE' ? 'border-blue-500 text-blue-400' :
                        wire === 'GREEN' ? 'border-green-500 text-green-400' :
                        wire === 'YELLOW' ? 'border-yellow-500 text-yellow-400' :
                        'border-gray-500 text-gray-400'
                      } ${wireSequence.slice(0, currentWire).includes(wire) ? 'bg-green-500/20' : ''}`}
                      disabled={finalActivation}
                    >
                      {wire}
                    </Button>
                  ))}
                </div>
                
                {currentWire > 0 && currentWire < wireSequence.length && (
                  <p className="text-xs text-center text-yellow-400">
                    Prochain fil: {wireSequence[currentWire]}
                  </p>
                )}
              </div>
            )}
          </div>
        </Card>
      )}

      {/* Success State */}
      {finalActivation && (
        <Card className="p-6 bg-green-500/20 border-green-500/50 animate-pulse">
          <div className="text-center space-y-3">
            <CheckCircle2 className="w-12 h-12 text-green-400 mx-auto" />
            <h3 className="text-xl font-bold text-green-400">🚨 ALARME ACTIVÉE 🚨</h3>
            <p className="text-green-400">
              Évacuation de la salle 2 en cours - Accès sécurisé débloqué
            </p>
            <div className="flex justify-center gap-2 mt-4">
              <Badge variant="default" className="bg-green-500 animate-pulse">
                ✅ Système Activé
              </Badge>
              <Badge variant="outline" className="border-green-500 text-green-400">
                🔓 Salle 2 Accessible
              </Badge>
            </div>
          </div>
        </Card>
      )}

      {/* Time Warning */}
      {timeRemaining < 60 && !finalActivation && (
        <Card className="p-4 bg-red-500/20 border-red-500/50 animate-pulse">
          <p className="text-red-400 text-center font-bold">
            ⚠️ TEMPS CRITIQUE: {formatTime(timeRemaining)} restant!
          </p>
        </Card>
      )}
    </div>
  );
};
