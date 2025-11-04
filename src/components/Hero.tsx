import { Card } from "@/components/ui/card";
import { Car, Heart, Home, CreditCard, Users } from "lucide-react";
import heroImage from "@/assets/hero-insurance.jpg";

const categories = [
  { icon: Car, label: "AUTO", color: "text-primary" },
  { icon: Heart, label: "SANTÉ", color: "text-primary" },
  { icon: Users, label: "ANIMAUX", color: "text-primary" },
  { icon: Home, label: "HABITATION", color: "text-primary" },
  { icon: CreditCard, label: "PRÊT", color: "text-primary" },
];

const Hero = () => {
  return (
    <section className="relative min-h-[600px] flex items-center overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-primary/95 via-primary/90 to-transparent" />
      </div>

      {/* Geometric Shape */}
      <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-accent/20 transform skew-x-[-8deg] translate-x-1/4" />

      {/* Content */}
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl py-16">
          <p className="text-primary-foreground/90 text-lg font-medium mb-4 uppercase tracking-wide">
            Comparateur Assurance
          </p>
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-primary-foreground mb-6 leading-tight">
            COMPAREZ<br />
            ÉCONOMISEZ
          </h1>
          <div className="inline-block mb-12">
            <p className="text-2xl md:text-3xl font-bold text-primary-foreground">
              EN MOYENNE <span className="text-accent border-b-4 border-accent">947€</span> PAR AN*
            </p>
          </div>

          {/* Category Cards */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {categories.map((category, index) => (
              <Card
                key={index}
                className="p-6 hover:shadow-[var(--shadow-hover)] transition-all duration-300 cursor-pointer group bg-card"
              >
                <div className="flex flex-col items-center gap-3">
                  <div className="p-3 rounded-full bg-primary/5 group-hover:bg-primary/10 transition-colors">
                    <category.icon className={`h-8 w-8 ${category.color}`} />
                  </div>
                  <span className="font-bold text-sm text-card-foreground">{category.label}</span>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
