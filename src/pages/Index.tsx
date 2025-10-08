import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Shield, Users, Target, Zap, Globe, AlertTriangle, Code, Lock } from "lucide-react";
import { useEffect, useState } from "react";

const Index = () => {
  const navigate = useNavigate();
  const [typedText, setTypedText] = useState("");
  const fullText = "Data Ghosts";

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
      {/* Animated Background Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0ff_1px,transparent_1px),linear-gradient(to_bottom,#0ff_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_110%)] opacity-10" />
      
      {/* Matrix Rain Effect */}
      <div className="matrix-rain absolute inset-0 opacity-5" />

      {/* Hero Section */}
      <section className="relative container mx-auto px-4 pt-20 pb-32">
        <div className="scan-lines absolute inset-0 pointer-events-none" />
        
        {/* Alert Banner */}
        <div className="animate-fade-in-up mb-8 flex justify-center">
          <div className="inline-flex items-center gap-2 bg-destructive/20 border border-destructive/50 rounded-full px-6 py-2 backdrop-blur-sm">
            <AlertTriangle className="w-4 h-4 text-destructive animate-pulse" />
            <span className="text-sm font-mono text-destructive">MISSION CRITIQUE: Publication virale imminente</span>
          </div>
        </div>

        {/* Main Title */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-3 mb-6 animate-float">
            <Shield className="w-12 h-12 neon-cyan" />
          </div>
          
          <h1 className="text-6xl md:text-8xl font-bold mb-4">
            <span className="neon-cyan font-mono tracking-tight">
              {typedText}
              <span className="animate-pulse">_</span>
            </span>
          </h1>
          
          <p className="text-2xl md:text-3xl text-secondary mb-4 font-mono">
            Opération Insta-Vibe
          </p>

          <div className="max-w-3xl mx-auto mb-12">
            <p className="text-lg text-muted-foreground leading-relaxed">
              <span className="text-primary font-semibold">Infiltrez</span> le conglomérat d'influenceurs,{" "}
              <span className="text-secondary font-semibold">sabotez</span> leur algorithme de viralité, et{" "}
              <span className="text-accent font-semibold">révélez</span> l'impact réel avant qu'il soit trop tard.
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-in-up">
            <Button
              size="lg"
              onClick={() => navigate("/create-lobby")}
              className="group bg-primary hover:bg-primary/90 text-primary-foreground text-lg px-10 py-7 rounded-lg font-mono relative overflow-hidden transition-all hover:scale-105 animate-pulse-glow"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
              <Code className="mr-2 h-5 w-5" />
              CRÉER MISSION
            </Button>
            
            <Button
              size="lg"
              variant="outline"
              onClick={() => navigate("/join-lobby")}
              className="group border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground text-lg px-10 py-7 rounded-lg font-mono transition-all hover:scale-105"
            >
              <Lock className="mr-2 h-5 w-5" />
              REJOINDRE ÉQUIPE
            </Button>
          </div>
        </div>

        {/* Mission Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto mt-16">
          {[
            { label: "Destinations", value: "3", icon: Globe },
            { label: "Hackers", value: "3", icon: Users },
            { label: "Tokens", value: "3", icon: Target },
            { label: "Algorithmes", value: "∞", icon: Zap },
          ].map((stat, idx) => (
            <div
              key={idx}
              className="bg-card border border-border rounded-lg p-6 text-center hover:border-primary transition-all hover:scale-105 glitch"
              style={{ animationDelay: `${idx * 0.1}s` }}
            >
              <stat.icon className="w-6 h-6 text-primary mx-auto mb-2" />
              <div className="text-3xl font-bold text-foreground font-mono">{stat.value}</div>
              <div className="text-sm text-muted-foreground font-mono">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="relative container mx-auto px-4 py-20">
        <h2 className="text-4xl font-bold text-center mb-16 neon-cyan font-mono">
          MODE OPÉRATOIRE
        </h2>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              icon: Users,
              title: "Missions Parallèles",
              description: "3 hackers, 3 salles simultanées. Chaque membre infiltre une destination différente.",
              color: "primary",
              delay: "0s",
            },
            {
              icon: Target,
              title: "Collecte de Tokens",
              description: "Résolvez des énigmes techniques pour récupérer les tokens cachés dans les systèmes.",
              color: "secondary",
              delay: "0.2s",
            },
            {
              icon: Shield,
              title: "Salle Finale",
              description: "Regroupez les 3 tokens pour accéder au Control Hub et désactiver l'algorithme viral.",
              color: "accent",
              delay: "0.4s",
            },
          ].map((feature, idx) => (
            <div
              key={idx}
              className="group bg-card border border-border rounded-lg p-8 hover:border-primary transition-all hover:scale-105 animate-fade-in-up"
              style={{ animationDelay: feature.delay }}
            >
              <div className={`w-16 h-16 rounded-lg bg-${feature.color}/20 flex items-center justify-center mb-6 group-hover:animate-pulse-glow`}>
                <feature.icon className={`w-8 h-8 text-${feature.color}`} />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-foreground font-mono">{feature.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Destinations Section */}
      <section className="relative container mx-auto px-4 py-20">
        <h2 className="text-4xl font-bold text-center mb-16 neon-purple font-mono">
          CIBLES: DESTINATIONS FRAGILES
        </h2>

        <div className="grid md:grid-cols-3 gap-6">
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
      </section>

      {/* CTA Final Section */}
      <section className="relative container mx-auto px-4 py-20">
        <div className="bg-gradient-to-r from-primary/20 via-secondary/20 to-accent/20 border-2 border-primary rounded-lg p-12 text-center backdrop-blur-sm relative overflow-hidden">
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
            
            <Button
              size="lg"
              onClick={() => navigate("/create-lobby")}
              className="bg-primary hover:bg-primary/90 text-primary-foreground text-xl px-12 py-8 rounded-lg font-mono animate-pulse-glow transition-all hover:scale-110"
            >
              <Code className="mr-2 h-6 w-6" />
              LANCER L'INFILTRATION
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative border-t border-border py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-muted-foreground font-mono text-sm">
            Data Ghosts © 2025 | Opération Insta-Vibe | <span className="text-primary">Mission Critique</span>
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
