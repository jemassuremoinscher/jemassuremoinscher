import { Card } from "@/components/ui/card";
import { Car, Heart, Home, CreditCard, Users } from "lucide-react";
import heroImage from "@/assets/hero-insurance.jpg";
import { Link } from "react-router-dom";

const categories = [
  { icon: Car, label: "AUTO", color: "text-primary", link: "/assurance-auto" },
  { icon: Heart, label: "SANTÉ", color: "text-primary", link: "/assurance-sante" },
  { icon: Users, label: "ANIMAUX", color: "text-primary", link: "/assurance-animaux" },
  { icon: Home, label: "HABITATION", color: "text-primary", link: "/assurance-habitation" },
  { icon: CreditCard, label: "PRÊT", color: "text-primary", link: "/assurance-pret" },
];

const Hero = () => {
  return (
    <section className="relative min-h-[700px] flex items-center overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-primary/95 via-primary/85 to-primary/40" />
      </div>

      {/* Animated Geometric Shapes */}
      <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-accent/20 transform skew-x-[-8deg] translate-x-1/4 animate-pulse" />
      <div className="absolute left-1/4 top-20 w-32 h-32 bg-accent/10 rounded-full blur-3xl animate-float" />
      <div className="absolute right-1/4 bottom-20 w-48 h-48 bg-secondary/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }} />

      {/* Content */}
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl py-20">
          <p className="text-primary-foreground/90 text-lg font-semibold mb-4 uppercase tracking-wider animate-fade-in">
            ✨ Comparateur Assurance
          </p>
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-primary-foreground mb-6 leading-tight animate-fade-in" style={{ animationDelay: '0.1s' }}>
            COMPAREZ<br />
            <span className="text-gradient bg-gradient-to-r from-accent via-secondary to-accent bg-clip-text text-transparent">
              ÉCONOMISEZ
            </span>
          </h1>
          <div className="inline-block mb-12 animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <p className="text-2xl md:text-3xl font-bold text-primary-foreground">
              EN MOYENNE <span className="text-accent border-b-4 border-accent px-2 inline-block transform hover:scale-110 transition-transform">947€</span> PAR AN*
            </p>
          </div>

          {/* Category Cards */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 animate-fade-in" style={{ animationDelay: '0.3s' }}>
            {categories.map((category, index) => (
              <Link key={index} to={category.link}>
                <Card className="p-6 hover-lift cursor-pointer group bg-card/95 backdrop-blur-sm border-2 border-transparent hover:border-accent/50">
                  <div className="flex flex-col items-center gap-3">
                    <div className="p-3 rounded-full bg-primary/5 group-hover:bg-accent/20 transition-all duration-300 group-hover:scale-110">
                      <category.icon className={`h-8 w-8 ${category.color} group-hover:text-accent transition-colors`} />
                    </div>
                    <span className="font-bold text-sm text-card-foreground group-hover:text-accent transition-colors">{category.label}</span>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
