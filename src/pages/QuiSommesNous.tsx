import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Shield, Award, Users, TrendingUp, Heart, Zap } from "lucide-react";
import arthurThumbsUp from "@/assets/mascotte/arthur-thumbs-up.png";
import arthurFlying from "@/assets/mascotte/arthur-flying.png";
import arthurThinking from "@/assets/mascotte/arthur-thinking.png";

const QuiSommesNous = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main>
        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-primary via-primary/90 to-primary/80 overflow-hidden">
          <div className="container mx-auto px-4 py-16 md:py-24">
            <div className="max-w-[65%] sm:max-w-[70%] md:max-w-3xl relative z-10">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
                Qui sommes-nous ?
              </h1>
              <p className="text-lg md:text-xl text-white/85 leading-relaxed">
                jemassuremoinscher.fr est votre partenaire de confiance pour trouver les meilleures offres d'assurance adaptées à vos besoins.
              </p>
            </div>
            {/* Arthur thumbs up - hero accent */}
            <img 
              src={arthurThumbsUp} 
              alt="" 
              aria-hidden="true"
              className="absolute right-4 md:right-12 bottom-0 h-24 sm:h-32 md:h-56 lg:h-64 object-contain opacity-90 pointer-events-none select-none"
            />
          </div>
        </section>

        <div className="container mx-auto px-4 py-12 md:py-16">
          <div className="max-w-5xl mx-auto space-y-16">

            {/* Stats bar */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { value: "50 000+", label: "Utilisateurs" },
                { value: "35%", label: "D'économies en moyenne" },
                { value: "10+", label: "Années d'expérience" },
                { value: "4.8/5", label: "Satisfaction client" },
              ].map((stat) => (
                <div key={stat.label} className="glass-card p-5 rounded-[2rem] text-center">
                  <div className="text-2xl md:text-3xl font-bold text-primary">{stat.value}</div>
                  <div className="text-sm text-muted-foreground mt-1">{stat.label}</div>
                </div>
              ))}
            </div>

            {/* Mission & Expertise cards */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="glass-card p-8 rounded-[2rem] hover:shadow-[var(--shadow-hover)] transition-all duration-300">
                <Shield className="w-10 h-10 text-primary mb-4" />
                <h3 className="text-xl font-bold mb-3 text-foreground">Notre mission</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Simplifier la comparaison des assurances et vous faire économiser sur vos contrats en toute transparence. Nous croyons que chacun mérite d'être bien assuré sans payer trop cher.
                </p>
              </div>

              <div className="glass-card p-8 rounded-[2rem] hover:shadow-[var(--shadow-hover)] transition-all duration-300">
                <Award className="w-10 h-10 text-primary mb-4" />
                <h3 className="text-xl font-bold mb-3 text-foreground">Notre expertise</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Plus de 10 ans d'expérience dans le domaine de l'assurance avec des experts dédiés à votre service, disponibles pour vous accompagner dans chaque étape.
                </p>
              </div>

              <div className="glass-card p-8 rounded-[2rem] hover:shadow-[var(--shadow-hover)] transition-all duration-300">
                <Users className="w-10 h-10 text-primary mb-4" />
                <h3 className="text-xl font-bold mb-3 text-foreground">Notre communauté</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Plus de 50 000 utilisateurs nous font confiance pour leurs comparaisons d'assurance. Rejoignez une communauté qui économise intelligemment.
                </p>
              </div>

              <div className="glass-card p-8 rounded-[2rem] hover:shadow-[var(--shadow-hover)] transition-all duration-300">
                <TrendingUp className="w-10 h-10 text-primary mb-4" />
                <h3 className="text-xl font-bold mb-3 text-foreground">Nos résultats</h3>
                <p className="text-muted-foreground leading-relaxed">
                  En moyenne, nos utilisateurs économisent 35% sur leurs contrats d'assurance grâce à notre comparateur intelligent.
                </p>
              </div>
            </div>

            {/* Values section with Arthur thinking */}
            <div className="relative glass-card p-8 md:p-12 rounded-[2rem] bg-gradient-to-br from-primary/5 to-accent/5 overflow-visible">
              <div className="md:pr-40">
                <h2 className="text-2xl md:text-3xl font-bold mb-6 text-foreground">Nos valeurs</h2>
                <ul className="space-y-4">
                  {[
                    { icon: Heart, title: "Transparence", desc: "Nous vous présentons toutes les offres sans parti pris" },
                    { icon: Shield, title: "Indépendance", desc: "Notre service est gratuit et impartial" },
                    { icon: Zap, title: "Simplicité", desc: "Un processus de comparaison clair et rapide" },
                    { icon: Users, title: "Accompagnement", desc: "Notre équipe est là pour vous guider à chaque étape" },
                  ].map(({ icon: Icon, title, desc }) => (
                    <li key={title} className="flex items-start gap-3">
                      <div className="mt-0.5 h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                        <Icon className="h-4 w-4 text-primary" />
                      </div>
                      <span className="text-muted-foreground">
                        <strong className="text-foreground">{title} :</strong> {desc}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
              {/* Arthur thinking - decorative */}
              <img 
                src={arthurThinking} 
                alt="" 
                aria-hidden="true"
                className="hidden md:block absolute -right-4 -bottom-4 h-48 object-contain opacity-80 pointer-events-none select-none"
              />
            </div>

            {/* CTA section with Arthur flying */}
            <div className="relative bg-gradient-to-r from-primary to-primary/80 rounded-[2rem] p-8 md:p-12 text-center overflow-visible">
              <div className="relative z-10">
                <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
                  Prêt à économiser sur vos assurances ?
                </h2>
                <p className="text-white/80 mb-6 max-w-xl mx-auto">
                  Comparez les meilleures offres en quelques clics et trouvez l'assurance qui vous correspond.
                </p>
                <a 
                  href="/comparateur" 
                  className="inline-flex items-center gap-2 bg-secondary hover:bg-secondary/90 text-secondary-foreground font-bold px-8 py-4 rounded-full text-lg transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  Comparer maintenant
                </a>
              </div>
              <img 
                src={arthurFlying} 
                alt="" 
                aria-hidden="true"
                className="absolute -top-8 sm:-top-12 right-2 md:right-12 h-16 sm:h-24 md:h-36 object-contain pointer-events-none select-none"
              />
            </div>

          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default QuiSommesNous;
