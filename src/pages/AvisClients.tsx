import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import { Star, Quote } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { addBreadcrumbSchema, addAggregateRatingSchema } from "@/utils/seoUtils";

const testimonials = [
  {
    name: "Marie D.",
    rating: 5,
    text: "Service excellent ! J'ai économisé 400€ sur mon assurance auto en quelques minutes. Le processus est très simple et les conseillers sont très réactifs.",
    date: "Il y a 2 jours"
  },
  {
    name: "Pierre M.",
    rating: 5,
    text: "Très satisfait de la comparaison. J'ai trouvé une mutuelle santé bien plus avantageuse que mon ancienne assurance. Je recommande vivement !",
    date: "Il y a 1 semaine"
  },
  {
    name: "Sophie L.",
    rating: 5,
    text: "Comparateur très complet avec de nombreux assureurs. La comparaison est claire et transparente. J'ai pu changer d'assurance habitation facilement.",
    date: "Il y a 2 semaines"
  },
  {
    name: "Thomas B.",
    rating: 4,
    text: "Bon service dans l'ensemble. La comparaison est rapide et les devis sont précis. J'aurais aimé avoir encore plus d'options pour personnaliser mon contrat.",
    date: "Il y a 3 semaines"
  },
  {
    name: "Julie R.",
    rating: 5,
    text: "Parfait pour comparer les assurances animaux ! J'ai trouvé une offre idéale pour mon chien avec un excellent rapport qualité-prix.",
    date: "Il y a 1 mois"
  },
  {
    name: "Laurent K.",
    rating: 5,
    text: "Interface intuitive et résultats immédiats. J'ai pu souscrire à mon assurance prêt en ligne sans difficulté. Gain de temps considérable !",
    date: "Il y a 1 mois"
  }
];

const AvisClients = () => {
  const breadcrumbSchema = addBreadcrumbSchema([
    { name: "Accueil", url: "https://www.jemassuremoinscher.fr/" },
    { name: "Avis Clients", url: "https://www.jemassuremoinscher.fr/avis-clients" }
  ]);

  const ratingSchema = addAggregateRatingSchema(
    "jemassuremoinscher",
    4.9,
    2547
  );

  return (
    <div className="min-h-screen">
      <SEO 
        title="Avis Clients - Témoignages et Retours d'Expérience | jemassuremoinscher"
        description="Découvrez les avis de nos clients sur notre comparateur d'assurance. Note moyenne de 4.9/5 sur 2 547 avis vérifiés. Témoignages authentiques sur nos services."
        keywords="avis clients, témoignages assurance, retour expérience, satisfaction client, comparateur avis"
        canonical="https://www.jemassuremoinscher.fr/avis-clients"
        jsonLd={[breadcrumbSchema, ratingSchema]}
      />
      <Header />
      
      <main className="container mx-auto px-4 py-16">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              Avis clients
            </h1>
            <p className="text-lg text-muted-foreground mb-4">
              Découvrez ce que nos utilisateurs pensent de notre service de comparaison
            </p>
            <div className="flex items-center justify-center gap-2 text-xl">
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} className="w-6 h-6 fill-primary text-primary" />
                ))}
              </div>
              <span className="font-bold text-foreground">4.9/5</span>
              <span className="text-muted-foreground">sur 2 547 avis</span>
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-bold text-foreground">{testimonial.name}</h3>
                      <p className="text-sm text-muted-foreground">{testimonial.date}</p>
                    </div>
                    <Quote className="w-8 h-8 text-primary/20" />
                  </div>
                  
                  <div className="flex mb-3">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        className={`w-4 h-4 ${i < testimonial.rating ? 'fill-primary text-primary' : 'text-muted'}`} 
                      />
                    ))}
                  </div>
                  
                  <p className="text-muted-foreground">{testimonial.text}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="mt-16 bg-gradient-to-br from-primary/10 to-accent/10 p-8 rounded-xl text-center">
            <h2 className="text-2xl font-bold mb-4">Vous aussi, partagez votre expérience !</h2>
            <p className="text-muted-foreground mb-6">
              Votre avis compte et nous aide à améliorer notre service pour mieux vous servir.
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default AvisClients;
