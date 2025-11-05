import { Card, CardContent } from "@/components/ui/card";
import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    name: "Marie Dubois",
    location: "Paris",
    rating: 5,
    text: "J'ai économisé 450€ sur mon assurance auto en quelques clics ! Le service est rapide et les offres sont vraiment compétitives. Je recommande vivement.",
    insurance: "Assurance Auto"
  },
  {
    name: "Pierre Martin",
    location: "Lyon",
    rating: 5,
    text: "Excellent comparateur ! J'ai trouvé une assurance habitation 30% moins chère que mon ancienne. Le processus est simple et sans engagement.",
    insurance: "Assurance Habitation"
  },
  {
    name: "Sophie Laurent",
    location: "Marseille",
    rating: 5,
    text: "Très satisfaite ! En 2 minutes j'ai comparé plusieurs mutuelles santé et j'ai trouvé celle qui correspond parfaitement à mes besoins. Un vrai gain de temps.",
    insurance: "Assurance Santé"
  },
  {
    name: "Thomas Petit",
    location: "Toulouse",
    rating: 4,
    text: "Service efficace et gratuit. J'ai pu comparer toutes les assurances moto du marché facilement. Les conseillers sont disponibles si besoin.",
    insurance: "Assurance Moto"
  },
  {
    name: "Julie Bernard",
    location: "Nantes",
    rating: 5,
    text: "Je ne pensais pas économiser autant sur mon assurance de prêt ! Le comparateur m'a fait gagner plus de 800€ par an. Merci !",
    insurance: "Assurance Prêt"
  },
  {
    name: "Lucas Rousseau",
    location: "Bordeaux",
    rating: 5,
    text: "Parfait pour trouver la meilleure assurance pour mon chien. Les tarifs sont transparents et j'ai reçu mon devis instantanément.",
    insurance: "Assurance Animaux"
  }
];

const Testimonials = () => {
  return (
    <section className="py-20 bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">
            Ils nous font confiance
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Découvrez les avis de nos clients satisfaits qui ont économisé sur leurs assurances
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in" style={{ animationDelay: '0.1s' }}>
          {testimonials.map((testimonial, index) => (
            <Card 
              key={index} 
              className="hover-lift bg-card border-2 hover:border-accent/30 transition-all duration-300"
            >
              <CardContent className="p-6">
                <div className="mb-4">
                  <Quote className="h-8 w-8 text-accent/30" />
                </div>
                
                {/* Rating */}
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-5 w-5 ${
                        i < testimonial.rating
                          ? "text-accent fill-accent"
                          : "text-muted"
                      }`}
                    />
                  ))}
                </div>

                {/* Testimonial Text */}
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  "{testimonial.text}"
                </p>

                {/* Author Info */}
                <div className="border-t border-border pt-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-foreground">{testimonial.name}</p>
                      <p className="text-sm text-muted-foreground">{testimonial.location}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-medium text-accent">{testimonial.insurance}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Trust Stats */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 text-center animate-fade-in" style={{ animationDelay: '0.2s' }}>
          <div>
            <p className="text-4xl font-bold text-accent mb-2">4.8/5</p>
            <p className="text-muted-foreground">Note moyenne</p>
          </div>
          <div>
            <p className="text-4xl font-bold text-accent mb-2">15 000+</p>
            <p className="text-muted-foreground">Clients satisfaits</p>
          </div>
          <div>
            <p className="text-4xl font-bold text-accent mb-2">98%</p>
            <p className="text-muted-foreground">Taux de satisfaction</p>
          </div>
          <div>
            <p className="text-4xl font-bold text-accent mb-2">947€</p>
            <p className="text-muted-foreground">Économie moyenne</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
