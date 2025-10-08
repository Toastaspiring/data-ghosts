import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Shield, Users, Target, Zap, Globe, AlertTriangle, Code, Lock, Volume2, VolumeX } from "lucide-react";
import { useEffect, useState } from "react";
import { useBackgroundMusic } from "@/hooks/useAudio";
import { AudioButton } from "@/components/ui/AudioButton";
import { AudioVisualizer } from "@/components/ui/AudioVisualizer";
import { audioManager } from "@/lib/audioManager";

const Index = () => {
  const navigate = useNavigate();
  const [typedText, setTypedText] = useState("");
  const [visualizerKey, setVisualizerKey] = useState(0);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isMusicMuted, setIsMusicMuted] = useState(false);
  const fullText = "Data Ghosts";

  // Play landing page background music
  useBackgroundMusic("landing");

  // Force visualizer remount when returning to page
  useEffect(() => {
    setVisualizerKey(prev => prev + 1);
    
    // Add a click handler to reactivate audio if needed
    const handlePageClick = () => {
      console.log("📱 Page clicked, checking audio state...");
      
      const isUnlocked = audioManager.getIsUnlocked();
      const audioContext = audioManager.getAudioContext();
      
      console.log("🔓 Audio unlocked:", isUnlocked);
      console.log("🎧 Audio context state:", audioContext?.state);
      
      if (!isUnlocked || (audioContext && audioContext.state === 'suspended')) {
        console.log("🔄 Attempting to reactivate audio...");
        audioManager.unlockAudio();
      }
    };

    // Add click listener to reactivate audio
    document.addEventListener('click', handlePageClick, { once: true });
    
    return () => {
      document.removeEventListener('click', handlePageClick);
    };
  }, []);

  useEffect(() => {
    let index = 0;
    const timer = setInterval(() => {
      if (index <= fullText.length) {
        setTypedText(fullText.slice(0, index));
        index++;
      } else {
        clearInterval(timer);
      }
    }, 150);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">      
      {/* Scanning Effect - Full Page */}
      <div className="scan-lines fixed inset-0 pointer-events-none z-20" />
      
      {/* Music Control Button */}
      <button
        onClick={() => {
          if (isMusicMuted) {
            audioManager.unlockAudio();
            setIsMusicMuted(false);
          } else {
            audioManager.stopMusic();
            setIsMusicMuted(true);
          }
        }}
        className="fixed top-4 right-4 z-50 bg-background/80 border border-border rounded-lg p-3 hover:bg-background transition-all"
      >
        {isMusicMuted ? (
          <VolumeX className="w-5 h-5 text-muted-foreground" />
        ) : (
          <Volume2 className="w-5 h-5 text-primary" />
        )}
      </button>
      
      {/* Left Sidebar Visualizer - Full Height */}
      <div className="fixed left-0 top-0 h-screen w-32 flex items-center justify-center z-30">
        <AudioVisualizer 
          key={`left-${visualizerKey}`}
          barCount={80}
          barHeight={120}
          barWidth={3}
          barGap={0}
          fullHeight={true}
          mirrored={true}
          className="opacity-60 transform rotate-90"
        />
      </div>

      {/* Right Sidebar Visualizer - Full Height */}
      <div className="fixed right-0 top-0 h-screen w-32 flex items-center justify-center z-30">
        <AudioVisualizer 
          key={`right-${visualizerKey}`}
          barCount={80}
          barHeight={120}
          barWidth={3}
          barGap={0}
          fullHeight={true}
          mirrored={true}
          className="opacity-60 transform -rotate-90"
        />
      </div>

      {/* Animated Background Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0ff_1px,transparent_1px),linear-gradient(to_bottom,#0ff_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_110%)] opacity-10" />
      
      {/* Matrix Rain Effect */}
      <div className="matrix-rain absolute inset-0 opacity-5" />

      {/* Slide Container */}
      <div className="relative w-full h-screen overflow-hidden">
        {/* Slide Navigation Dots */}
        <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-40 flex gap-2">
          {[0, 1, 2, 3].map((slide) => (
            <button
              key={slide}
              onClick={() => setCurrentSlide(slide)}
              className={`w-3 h-3 rounded-full transition-all ${
                currentSlide === slide ? 'bg-primary' : 'bg-border'
              }`}
            />
          ))}
        </div>

        {/* Slide Content */}
        <div 
          className="flex w-[400%] h-full transition-transform duration-700 ease-in-out"
          style={{ transform: `translateX(-${currentSlide * 25}%)` }}
        >
          {/* Slide 1: Hero */}
          <div className="w-1/4 h-full flex items-center justify-center">
            <div className="container mx-auto px-4 text-center">
              {/* Alert Banner */}
              <div className="animate-fade-in-up mb-8 flex justify-center">
                <div className="inline-flex items-center gap-2 bg-destructive/20 border border-destructive/50 rounded-full px-6 py-2 backdrop-blur-sm">
                  <AlertTriangle className="w-4 h-4 text-destructive animate-pulse" />
                  <span className="text-sm font-mono text-destructive">MISSION CRITIQUE: Publication virale imminente</span>
                </div>
              </div>

              {/* Main Title */}
              <div className="inline-flex items-center gap-3 mb-6 animate-float">
                <Shield className="w-12 h-12 neon-cyan" />
              </div>
              
              <h1 className="text-6xl md:text-8xl font-bold mb-4">
                <span className="neon-cyan font-mono tracking-tight">
                  {typedText}
                  <span className="animate-pulse">_</span>
                </span>
              </h1>
              
              <p className="text-2xl md:text-3xl text-secondary mb-8 font-mono">
                Opération Insta-Vibe
              </p>

              <div className="max-w-3xl mx-auto mb-12">
                <p className="text-lg text-muted-foreground leading-relaxed">
                  <span className="text-primary font-semibold">Infiltrez</span> le conglomérat d'influenceurs,{" "}
                  <span className="text-secondary font-semibold">sabotez</span> leur algorithme de viralité, et{" "}
                  <span className="text-accent font-semibold">révélez</span> l'impact réel avant qu'il soit trop tard.
                </p>
              </div>

              <button
                onClick={() => setCurrentSlide(1)}
                className="bg-primary hover:bg-primary/90 text-primary-foreground text-lg px-8 py-4 rounded-lg font-mono transition-all hover:scale-105 animate-pulse-glow"
              >
                Découvrir l'Opération →
              </button>
            </div>
          </div>

          {/* Slide 2: Mission Details */}
          <div className="w-1/4 h-full flex items-center justify-center">
            <div className="container mx-auto px-4 text-center">
              <h2 className="text-4xl font-bold mb-16 neon-cyan font-mono">
                MODE OPÉRATOIRE
              </h2>

              <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
                {[
                  {
                    icon: Users,
                    title: "Missions Parallèles",
                    description: "3 hackers, 3 salles simultanées. Chaque membre infiltre une destination différente.",
                    color: "primary",
                  },
                  {
                    icon: Target,
                    title: "Collecte de Tokens",
                    description: "Résolvez des énigmes techniques pour récupérer les tokens cachés dans les systèmes.",
                    color: "secondary",
                  },
                  {
                    icon: Shield,
                    title: "Salle Finale",
                    description: "Regroupez les 3 tokens pour accéder au Control Hub et désactiver l'algorithme viral.",
                    color: "accent",
                  },
                ].map((feature, idx) => (
                  <div
                    key={idx}
                    className="group bg-card border border-border rounded-lg p-8 hover:border-primary transition-all hover:scale-105 animate-fade-in-up"
                  >
                    <div className={`w-16 h-16 rounded-lg bg-${feature.color}/20 flex items-center justify-center mb-6 group-hover:animate-pulse-glow mx-auto`}>
                      <feature.icon className={`w-8 h-8 text-${feature.color}`} />
                    </div>
                    <h3 className="text-2xl font-bold mb-4 text-foreground font-mono">{feature.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
                  </div>
                ))}
              </div>

              <button
                onClick={() => setCurrentSlide(2)}
                className="mt-12 bg-secondary hover:bg-secondary/90 text-secondary-foreground text-lg px-8 py-4 rounded-lg font-mono transition-all hover:scale-105"
              >
                Voir les Destinations →
              </button>
            </div>
          </div>

          {/* Slide 3: Destinations */}
          <div className="w-1/4 h-full flex items-center justify-center">
            <div className="container mx-auto px-4 text-center">
              <h2 className="text-4xl font-bold mb-16 neon-purple font-mono">
                CIBLES: DESTINATIONS FRAGILES
              </h2>

              <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
                {[
                  {
                    name: "Bali",
                    threat: "Récifs coralliens détruits",
                    impact: "70% endommagés",
                    color: "from-primary to-secondary",
                  },
                  {
                    name: "Santorin",
                    threat: "Érosion des falaises",
                    impact: "Capacité +300%",
                    color: "from-secondary to-accent",
                  },
                  {
                    name: "Machu Picchu",
                    threat: "Piétinement excessif",
                    impact: "5000 vs 2500/jour",
                    color: "from-accent to-destructive",
                  },
                ].map((destination, idx) => (
                  <div
                    key={idx}
                    className="bg-card border-2 border-border rounded-lg p-6 hover:border-primary transition-all hover:scale-105 glitch"
                  >
                    <div className={`h-2 rounded-full bg-gradient-to-r ${destination.color} mb-4`} />
                    <h3 className="text-2xl font-bold mb-3 text-foreground font-mono">{destination.name}</h3>
                    <div className="space-y-2">
                      <div className="flex items-start gap-2">
                        <AlertTriangle className="w-4 h-4 text-destructive mt-1 flex-shrink-0" />
                        <p className="text-sm text-muted-foreground">{destination.threat}</p>
                      </div>
                      <div className="bg-destructive/20 border border-destructive/50 rounded px-3 py-2">
                        <p className="text-sm font-mono text-destructive font-semibold">{destination.impact}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <button
                onClick={() => setCurrentSlide(3)}
                className="mt-12 bg-accent hover:bg-accent/90 text-accent-foreground text-lg px-8 py-4 rounded-lg font-mono transition-all hover:scale-105"
              >
                Commencer la Mission →
              </button>
            </div>
          </div>

          {/* Slide 4: CTA */}
          <div className="w-1/4 h-full flex items-center justify-center">
            <div className="container mx-auto px-4 text-center">
              <div className="bg-gradient-to-r from-primary/20 via-secondary/20 to-accent/20 border-2 border-primary rounded-lg p-12 backdrop-blur-sm relative overflow-hidden max-w-4xl mx-auto">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(0,255,255,0.1),transparent_50%)]" />
                
                <div className="relative z-10">
                  <div className="inline-flex items-center gap-2 bg-primary/20 border border-primary rounded-full px-4 py-2 mb-6">
                    <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                    <span className="text-sm font-mono text-primary">SYSTÈME EN LIGNE</span>
                  </div>

                  <h2 className="text-5xl font-bold mb-6 neon-cyan font-mono">
                    REJOIGNEZ L'OPÉRATION
                  </h2>
                  
                  <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                    Le temps presse. L'algorithme viral sera publié dans quelques heures.
                    <br />
                    <span className="text-primary font-semibold">Votre mission commence maintenant.</span>
                  </p>
                  
                  <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                    <AudioButton
                      size="lg"
                      onClick={() => navigate("/create-lobby")}
                      className="group bg-primary hover:bg-primary/90 text-primary-foreground text-xl px-12 py-8 rounded-lg font-mono animate-pulse-glow transition-all hover:scale-110"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                      <Code className="mr-2 h-6 w-6" />
                      LANCER L'INFILTRATION
                    </AudioButton>
                    
                    <AudioButton
                      size="lg"
                      variant="outline"
                      onClick={() => navigate("/join-lobby")}
                      className="group border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground text-xl px-12 py-8 rounded-lg font-mono transition-all hover:scale-110"
                    >
                      <Lock className="mr-2 h-6 w-6" />
                      REJOINDRE ÉQUIPE
                    </AudioButton>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer with hover reveal */}
      <div className="fixed bottom-0 left-0 right-0 z-30">
        {/* Left hover trigger area */}
        <div className="group absolute bottom-0 left-0 w-1/3 h-16">
          <div className="h-full w-full" />
          <footer className="absolute bottom-0 left-0 right-0 border-t border-border py-4 bg-background/80 backdrop-blur-sm transform translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in-out">
            <div className="container mx-auto px-4 text-center">
              <p className="text-muted-foreground font-mono text-sm">
                Data Ghosts © 2025 | Opération Insta-Vibe | <span className="text-primary">Mission Critique</span>
              </p>
            </div>
          </footer>
        </div>
        
        {/* Right hover trigger area */}
        <div className="group absolute bottom-0 right-0 w-1/3 h-16">
          <div className="h-full w-full" />
          <footer className="absolute bottom-0 left-0 right-0 border-t border-border py-4 bg-background/80 backdrop-blur-sm transform translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in-out">
            <div className="container mx-auto px-4 text-center">
              <p className="text-muted-foreground font-mono text-sm">
                Data Ghosts © 2025 | Opération Insta-Vibe | <span className="text-primary">Mission Critique</span>
              </p>
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
};

export default Index;
