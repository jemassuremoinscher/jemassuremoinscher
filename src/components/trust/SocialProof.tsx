import { Card } from "@/components/ui/card";
import { Users, Star, TrendingUp, Award } from "lucide-react";
import { useEffect, useState } from "react";

interface Stat {
  icon: typeof Users;
  value: number;
  suffix: string;
  label: string;
  color: string;
}

const stats: Stat[] = [
  {
    icon: Users,
    value: 52847,
    suffix: "+",
    label: "Clients satisfaits",
    color: "text-primary",
  },
  {
    icon: Star,
    value: 4.8,
    suffix: "/5",
    label: "Note moyenne",
    color: "text-accent",
  },
  {
    icon: TrendingUp,
    value: 947,
    suffix: "€",
    label: "Économie moyenne",
    color: "text-primary",
  },
  {
    icon: Award,
    value: 120,
    suffix: "+",
    label: "Assureurs partenaires",
    color: "text-accent",
  },
];

const CountUp = ({ end, duration = 2000, suffix = "" }: { end: number; duration?: number; suffix?: string }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime: number | null = null;
    const startValue = 0;
    
    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);
      
      const currentCount = startValue + (end - startValue) * progress;
      setCount(currentCount);
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setCount(end);
      }
    };
    
    requestAnimationFrame(animate);
  }, [end, duration]);

  return (
    <span>
      {end % 1 !== 0 ? count.toFixed(1) : Math.floor(count)}
      {suffix}
    </span>
  );
};

export const SocialProof = () => {
  return (
    <section className="py-16 bg-gradient-to-b from-muted/30 to-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ils nous font <span className="text-primary">confiance</span>
          </h2>
          <p className="text-muted-foreground text-lg">
            Des milliers de Français économisent chaque jour avec jemassurmoinscher
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <Card
              key={index}
              className="p-6 text-center hover-lift transition-all"
              role="region"
              aria-label={`${stat.label}: ${stat.value}${stat.suffix}`}
            >
              <div className="flex flex-col items-center gap-4">
                <div className="bg-primary/10 p-4 rounded-full">
                  <stat.icon className={`h-8 w-8 ${stat.color}`} aria-hidden="true" />
                </div>
                <div>
                  <div className={`text-3xl md:text-4xl font-bold ${stat.color}`}>
                    <CountUp end={stat.value} suffix={stat.suffix} />
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">{stat.label}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Real testimonials preview */}
        <div className="mt-12 grid md:grid-cols-3 gap-6">
          {[
            { name: "Marie L.", city: "Paris", text: "J'ai économisé 380€ sur mon assurance auto en 5 minutes !", rating: 5 },
            { name: "Thomas D.", city: "Lyon", text: "Service rapide et efficace. Je recommande vivement !", rating: 5 },
            { name: "Sophie M.", city: "Marseille", text: "Comparaison claire et devis personnalisé. Parfait !", rating: 5 },
          ].map((testimonial, index) => (
            <Card key={index} className="p-6">
              <div className="flex gap-1 mb-3">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-accent text-accent" aria-hidden="true" />
                ))}
              </div>
              <p className="text-sm italic mb-4">"{testimonial.text}"</p>
              <div className="flex items-center gap-3">
                <div className="bg-primary/10 w-10 h-10 rounded-full flex items-center justify-center">
                  <span className="font-semibold text-primary">
                    {testimonial.name.charAt(0)}
                  </span>
                </div>
                <div>
                  <p className="font-semibold text-sm">{testimonial.name}</p>
                  <p className="text-xs text-muted-foreground">{testimonial.city}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
