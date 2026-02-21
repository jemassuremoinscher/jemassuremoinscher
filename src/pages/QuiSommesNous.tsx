import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Shield, Award, Users, TrendingUp, Heart, Zap } from "lucide-react";
import arthurThumbsUp from "@/assets/mascotte/arthur-thumbs-up.png";
import arthurFlying from "@/assets/mascotte/arthur-flying.png";
import arthurThinking from "@/assets/mascotte/arthur-thinking.png";
import { useLanguage } from "@/contexts/LanguageContext";

const QuiSommesNous = () => {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main>
        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-primary via-primary/90 to-primary/80 overflow-hidden">
          <div className="container mx-auto px-4 py-16 md:py-24">
            <div className="max-w-[65%] sm:max-w-[70%] md:max-w-3xl relative z-10">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
                {t('aboutPage.title')}
              </h1>
              <p className="text-lg md:text-xl text-white/85 leading-relaxed">
                {t('aboutPage.subtitle')}
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
                { value: "50 000+", label: t('aboutPage.users') },
                { value: "35%", label: t('aboutPage.savings') },
                { value: "10+", label: t('aboutPage.experience') },
                { value: "4.8/5", label: t('aboutPage.satisfaction') },
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
                <h3 className="text-xl font-bold mb-3 text-foreground">{t('aboutPage.missionTitle')}</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {t('aboutPage.missionDesc')}
                </p>
              </div>

              <div className="glass-card p-8 rounded-[2rem] hover:shadow-[var(--shadow-hover)] transition-all duration-300">
                <Award className="w-10 h-10 text-primary mb-4" />
                <h3 className="text-xl font-bold mb-3 text-foreground">{t('aboutPage.expertiseTitle')}</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {t('aboutPage.expertiseDesc')}
                </p>
              </div>

              <div className="glass-card p-8 rounded-[2rem] hover:shadow-[var(--shadow-hover)] transition-all duration-300">
                <Users className="w-10 h-10 text-primary mb-4" />
                <h3 className="text-xl font-bold mb-3 text-foreground">{t('aboutPage.communityTitle')}</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {t('aboutPage.communityDesc')}
                </p>
              </div>

              <div className="glass-card p-8 rounded-[2rem] hover:shadow-[var(--shadow-hover)] transition-all duration-300">
                <TrendingUp className="w-10 h-10 text-primary mb-4" />
                <h3 className="text-xl font-bold mb-3 text-foreground">{t('aboutPage.resultsTitle')}</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {t('aboutPage.resultsDesc')}
                </p>
              </div>
            </div>

            {/* Values section with Arthur thinking */}
            <div className="relative glass-card p-8 md:p-12 rounded-[2rem] bg-gradient-to-br from-primary/5 to-accent/5 overflow-visible">
              <div className="md:pr-40">
                <h2 className="text-2xl md:text-3xl font-bold mb-6 text-foreground">{t('aboutPage.valuesTitle')}</h2>
                <ul className="space-y-4">
                  {[
                    { icon: Heart, title: t('aboutPage.transparency'), desc: t('aboutPage.transparencyDesc') },
                    { icon: Shield, title: t('aboutPage.independence'), desc: t('aboutPage.independenceDesc') },
                    { icon: Zap, title: t('aboutPage.simplicity'), desc: t('aboutPage.simplicityDesc') },
                    { icon: Users, title: t('aboutPage.support'), desc: t('aboutPage.supportDesc') },
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
                  {t('aboutPage.ctaTitle')}
                </h2>
                <p className="text-white/80 mb-6 max-w-xl mx-auto">
                  {t('aboutPage.ctaDesc')}
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
