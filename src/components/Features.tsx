import { Shield, Users, TrendingUp, Award } from "lucide-react";
import { Card } from "@/components/ui/card";

const features = [
  {
    icon: Shield,
    title: "120 assureurs",
    description: "Le panel le plus large du web",
  },
  {
    icon: Users,
    title: "+ 10 millions d'internautes",
    description: "Accompagnés",
  },
  {
    icon: TrendingUp,
    title: "Comparaison des garanties",
    description: "ET du rapport qualité-prix",
  },
  {
    icon: Award,
    title: "Service gratuit",
    description: "Et sans engagement",
  },
];

const Features = () => {
  return (
    <section className="py-20 bg-gradient-to-b from-muted/30 to-background relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="mb-16 text-center">
          <p className="text-accent font-semibold text-sm uppercase tracking-wide mb-3 animate-fade-in">Nos engagements</p>
          <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-4 animate-fade-in" style={{ animationDelay: '0.1s' }}>
            Pourquoi choisir<br />
            <span className="text-primary">Le Comparateur Assurance</span> ?
          </h2>
          <div className="w-24 h-1 bg-accent mx-auto rounded-full animate-fade-in" style={{ animationDelay: '0.2s' }} />
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="animate-fade-in hover-lift"
              style={{ animationDelay: `${0.1 * (index + 1)}s` }}
            >
              <Card className="p-8 h-full card-gradient border-2 border-transparent hover:border-primary/20 transition-all duration-300">
                <div className="flex flex-col items-center text-center gap-4">
                  <div className="p-5 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 shadow-lg">
                    <feature.icon className="h-10 w-10 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-bold text-xl mb-3 text-card-foreground">{feature.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
                  </div>
                </div>
              </Card>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
