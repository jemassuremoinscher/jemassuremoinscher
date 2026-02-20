import { Card, CardContent } from "@/components/ui/card";
import { Star, Quote } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const Testimonials = () => {
  const { t } = useLanguage();

  const testimonials = [
    { name: "Marie Dubois", location: "Paris", rating: 5, text: t('testimonials.t1.text'), insurance: t('testimonials.t1.insurance') },
    { name: "Pierre Martin", location: "Lyon", rating: 5, text: t('testimonials.t2.text'), insurance: t('testimonials.t2.insurance') },
    { name: "Sophie Laurent", location: "Marseille", rating: 5, text: t('testimonials.t3.text'), insurance: t('testimonials.t3.insurance') },
    { name: "Thomas Petit", location: "Toulouse", rating: 4, text: t('testimonials.t4.text'), insurance: t('testimonials.t4.insurance') },
    { name: "Julie Bernard", location: "Nantes", rating: 5, text: t('testimonials.t5.text'), insurance: t('testimonials.t5.insurance') },
    { name: "Lucas Rousseau", location: "Bordeaux", rating: 5, text: t('testimonials.t6.text'), insurance: t('testimonials.t6.insurance') },
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">
            {t('testimonials.title')}
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            {t('testimonials.subtitle')}
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

                <p className="text-muted-foreground mb-6 leading-relaxed">
                  "{testimonial.text}"
                </p>

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

        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 text-center animate-fade-in" style={{ animationDelay: '0.2s' }}>
          <div>
            <p className="text-4xl font-bold text-accent mb-2">4.8/5</p>
            <p className="text-muted-foreground">{t('testimonials.avgRating')}</p>
          </div>
          <div>
            <p className="text-4xl font-bold text-accent mb-2">15 000+</p>
            <p className="text-muted-foreground">{t('testimonials.satisfiedClients')}</p>
          </div>
          <div>
            <p className="text-4xl font-bold text-accent mb-2">98%</p>
            <p className="text-muted-foreground">{t('testimonials.satisfactionRate')}</p>
          </div>
          <div>
            <p className="text-4xl font-bold text-accent mb-2">947€</p>
            <p className="text-muted-foreground">{t('testimonials.avgSavings')}</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
