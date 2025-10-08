import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Home } from "lucide-react";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background relative overflow-hidden">
      {/* Animated Background Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0ff_1px,transparent_1px),linear-gradient(to_bottom,#0ff_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_110%)] opacity-10" />
      
      <div className="text-center relative z-10 p-8">
        <div className="inline-flex items-center justify-center w-32 h-32 rounded-lg bg-destructive/20 border-2 border-destructive mb-8 animate-pulse-glow">
          <AlertTriangle className="w-16 h-16 text-destructive" />
        </div>

        <h1 className="mb-4 text-8xl font-bold neon-pink font-mono glitch">404</h1>
        <p className="mb-4 text-2xl text-muted-foreground font-mono">ACCÈS REFUSÉ</p>
        <p className="mb-8 text-lg text-muted-foreground font-mono">
          La page demandée n'existe pas dans le système
        </p>
        
        <Button
          onClick={() => navigate("/")}
          className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-6 text-lg font-mono transition-all hover:scale-105 animate-pulse-glow"
        >
          <Home className="mr-2 h-5 w-5" />
          RETOUR AU MENU PRINCIPAL
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
