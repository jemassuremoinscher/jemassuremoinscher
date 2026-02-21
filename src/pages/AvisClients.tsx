import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import { Star, Quote } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { addBreadcrumbSchema, addAggregateRatingSchema } from "@/utils/seoUtils";
import { useLanguage } from "@/contexts/LanguageContext";
import arthurThumbsUp from "@/assets/mascotte/arthur-thumbs-up.png";
import arthurFlying from "@/assets/mascotte/arthur-flying.png";

const AvisClients = () => {
  const { t } = useLanguage();

  const testimonials = [
    {
      name: "Marie D.",
      rating: 5,
      text: t('testimonials.t1.text'),
      date: "Il y a 2 jours",
      type: t('insurance.auto')
    },
    {
      name: "Pierre M.",
      rating: 5,
      text: t('testimonials.t3.text'),
      date: "Il y a 1 semaine",
      type: t('insurance.health')
    },
    {
      name: "Sophie L.",
      rating: 5,
      text: t('testimonials.t2.text'),
      date: "Il y a 2 semaines",
      type: t('insurance.home')
    },
    {
      name: "Thomas B.",
      rating: 4,
      text: "Bon service dans l'ensemble. La comparaison est rapide et les devis sont précis. J'aurais aimé avoir encore plus d'options pour personnaliser mon contrat.",
      date: "Il y a 3 semaines",
      type: t('insurance.auto')
    },
    {
      name: "Julie R.",
      rating: 5,
      text: t('testimonials.t6.text'),
      date: "Il y a 1 mois",
      type: t('insurance.pets')
    },
    {
      name: "Laurent K.",
      rating: 5,
      text: t('testimonials.t5.text'),
      date: "Il y a 1 mois",
      type: t('insurance.loan')
    }
  ];

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
    <div className="min-h-screen bg-background">
      <SEO 
        title="Avis Clients - Témoignages et Retours d'Expérience | jemassuremoinscher"
        description="Découvrez les avis de nos clients sur notre comparateur d'assurance. Note moyenne de 4.9/5 sur 2 547 avis vérifiés."
        keywords="avis clients, témoignages assurance, retour expérience, satisfaction client"
        canonical="https://www.jemassuremoinscher.fr/avis-clients"
        jsonLd={[breadcrumbSchema, ratingSchema]}
      />
      <Header />
      
      <main>
        {/* Hero */}
        <section className="relative bg-gradient-to-br from-primary via-primary/90 to-primary/80 overflow-hidden">
          <div className="container mx-auto px-4 py-14 md:py-20">
            <div className="max-w-[65%] sm:max-w-[70%] md:max-w-2xl relative z-10">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
                {t('reviewsPage.title')}
              </h1>
              <p className="text-base md:text-lg text-white/80 leading-relaxed">
                {t('reviewsPage.subtitle')}
              </p>
            </div>
            <img
              src={arthurThumbsUp}
              alt=""
              aria-hidden="true"
              className="absolute right-4 md:right-12 bottom-0 h-24 sm:h-32 md:h-48 lg:h-56 object-contain opacity-90 pointer-events-none select-none"
            />
          </div>
        </section>

        <div className="container mx-auto px-4 py-10 md:py-14">
          <div className="max-w-5xl mx-auto space-y-10">

            {/* Rating summary */}
            <div className="glass-card p-8 rounded-[2rem] text-center">
              <div className="flex items-center justify-center gap-1 mb-3">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} className="w-8 h-8 fill-secondary text-secondary" />
                ))}
              </div>
              <div className="text-4xl font-black text-foreground mb-1">4.8/5</div>
              <p className="text-muted-foreground">sur <span className="font-semibold text-foreground">250</span> {t('reviewsPage.verifiedReviews')}</p>
              {/* Google logo */}
              <div className="flex items-center justify-center gap-2 mt-3">
                <svg viewBox="0 0 24 24" className="w-5 h-5" aria-hidden="true">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                <span className="text-sm text-muted-foreground">Google Reviews</span>
              </div>
            </div>

            {/* Testimonials grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {testimonials.map((testimonial, index) => (
                <div
                  key={index}
                  className="glass-card p-6 rounded-[2rem] hover:shadow-[var(--shadow-hover)] transition-all duration-300"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-bold text-foreground">{testimonial.name}</h3>
                      <p className="text-xs text-muted-foreground">{testimonial.date}</p>
                    </div>
                    <Badge variant="outline" className="rounded-full text-xs">{testimonial.type}</Badge>
                  </div>
                  
                  <div className="flex mb-3 gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        className={`w-4 h-4 ${i < testimonial.rating ? 'fill-secondary text-secondary' : 'text-muted'}`} 
                      />
                    ))}
                  </div>
                  
                  <p className="text-muted-foreground text-sm leading-relaxed">{testimonial.text}</p>
                </div>
              ))}
            </div>

            {/* Share your review */}
            <div className="glass-card p-8 md:p-10 rounded-[2rem] bg-gradient-to-br from-primary/5 to-accent/5 text-center">
              <Quote className="w-10 h-10 text-primary/20 mx-auto mb-4" />
              <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-3">
                {t('reviewsPage.shareTitle')}
              </h2>
              <p className="text-muted-foreground max-w-lg mx-auto">
                {t('reviewsPage.shareDesc')}
              </p>
            </div>

            {/* CTA */}
            <div className="relative bg-gradient-to-r from-primary to-primary/80 rounded-[2rem] p-8 md:p-12 text-center overflow-visible">
              <div className="relative z-10">
                <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
                  {t('reviewsPage.ctaTitle')}
                </h2>
                <p className="text-white/80 mb-6 max-w-xl mx-auto">
                  {t('reviewsPage.ctaDesc')}
                </p>
                <a
                  href="/comparateur"
                  className="inline-flex items-center gap-2 bg-secondary hover:bg-secondary/90 text-secondary-foreground font-bold px-8 py-4 rounded-full text-lg transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  {t('insPage.compareNowBtn')}
                </a>
              </div>
              <img
                src={arthurFlying}
                alt=""
                aria-hidden="true"
                className="absolute -top-10 right-4 md:right-12 h-16 sm:h-24 md:h-36 object-contain pointer-events-none select-none"
              />
            </div>

          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default AvisClients;
