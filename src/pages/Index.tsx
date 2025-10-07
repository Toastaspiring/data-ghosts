import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Plane, Users, Trophy } from "lucide-react";
import heroImage from "@/assets/hero-travel.jpg";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div 
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: `url(${heroImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        <div className="absolute inset-0 hero-gradient opacity-80" />
        
        <div className="relative container mx-auto px-4 py-20 text-center">
          <div className="animate-float inline-block mb-6">
            <Plane className="w-16 h-16 text-primary" strokeWidth={1.5} />
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold text-foreground mb-6">
            Escape Game<br />
            <span className="text-primary">Tourisme</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-2xl mx-auto">
            Partez à l'aventure avec vos amis ! Résolvez des énigmes sur les monuments du monde entier.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button
              size="lg"
              onClick={() => navigate("/create-lobby")}
              className="bg-primary hover:bg-primary/90 text-primary-foreground text-lg px-8 py-6 rounded-2xl cartoon-shadow transition-all hover:scale-105"
            >
              <Users className="mr-2 h-5 w-5" />
              Créer un Lobby
            </Button>
            
            <Button
              size="lg"
              variant="outline"
              onClick={() => navigate("/join-lobby")}
              className="border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground text-lg px-8 py-6 rounded-2xl transition-all hover:scale-105"
            >
              Rejoindre un Lobby
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-card rounded-3xl p-8 cartoon-shadow text-center hover:scale-105 transition-transform">
            <div className="bg-secondary/20 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="w-10 h-10 text-secondary" />
            </div>
            <h3 className="text-2xl font-bold mb-3 text-card-foreground">Jusqu'à 3 Joueurs</h3>
            <p className="text-muted-foreground">
              Créez un lobby et invitez jusqu'à 2 amis pour une aventure collaborative
            </p>
          </div>

          <div className="bg-card rounded-3xl p-8 cartoon-shadow text-center hover:scale-105 transition-transform">
            <div className="bg-accent/20 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Plane className="w-10 h-10 text-accent" />
            </div>
            <h3 className="text-2xl font-bold mb-3 text-card-foreground">Thème Tourisme</h3>
            <p className="text-muted-foreground">
              Découvrez des énigmes sur les monuments et destinations célèbres du monde
            </p>
          </div>

          <div className="bg-card rounded-3xl p-8 cartoon-shadow text-center hover:scale-105 transition-transform">
            <div className="bg-primary/20 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Trophy className="w-10 h-10 text-primary" />
            </div>
            <h3 className="text-2xl font-bold mb-3 text-card-foreground">Leaderboard</h3>
            <p className="text-muted-foreground">
              Comparez vos scores et voyez qui sont les meilleurs explorateurs
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="bg-gradient-to-r from-primary to-secondary rounded-3xl p-12 text-center cartoon-shadow">
          <h2 className="text-4xl font-bold text-primary-foreground mb-6">
            Prêt à commencer l'aventure ?
          </h2>
          <p className="text-xl text-primary-foreground/90 mb-8 max-w-2xl mx-auto">
            Créez votre lobby maintenant et partagez le code avec vos amis !
          </p>
          <Button
            size="lg"
            variant="secondary"
            onClick={() => navigate("/create-lobby")}
            className="bg-card hover:bg-card/90 text-foreground text-lg px-8 py-6 rounded-2xl transition-all hover:scale-105"
          >
            Commencer Maintenant
          </Button>
        </div>
      </section>
    </div>
  );
};

export default Index;
