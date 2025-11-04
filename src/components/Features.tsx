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
    <section className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="mb-12">
          <p className="text-accent font-semibold text-sm uppercase tracking-wide mb-2">Nos engagements</p>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground">
            Pourquoi choisir Le Comparateur Assurance ?
          </h2>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <Card key={index} className="p-6 hover:shadow-[var(--shadow-hover)] transition-all duration-300 bg-card">
              <div className="flex flex-col items-center text-center gap-4">
                <div className="p-4 rounded-full bg-primary/10">
                  <feature.icon className="h-8 w-8 text-primary" />
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-2 text-card-foreground">{feature.title}</h3>
                  <p className="text-muted-foreground text-sm">{feature.description}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
