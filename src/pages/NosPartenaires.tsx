import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Partners from "@/components/Partners";
import { Shield, Award, HeadphonesIcon, MapPin, Check } from "lucide-react";
import arthurThumbsUp from "@/assets/mascotte/arthur-thumbs-up.png";
import arthurFlying from "@/assets/mascotte/arthur-flying.png";
import { useLanguage } from "@/contexts/LanguageContext";

const NosPartenaires = () => {
  const { t } = useLanguage();

  const criteria = [
    { icon: Shield, title: t('partnersPage.financial'), desc: t('partnersPage.financialDesc') },
    { icon: Award, title: t('partnersPage.competitive'), desc: t('partnersPage.competitiveDesc') },
    { icon: HeadphonesIcon, title: t('partnersPage.customerService'), desc: t('partnersPage.customerServiceDesc') },
    { icon: MapPin, title: t('partnersPage.national'), desc: t('partnersPage.nationalDesc') },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main>
        {/* Hero */}
        <section className="relative bg-gradient-to-br from-primary via-primary/90 to-primary/80 overflow-hidden">
          <div className="container mx-auto px-4 py-14 md:py-20">
            <div className="max-w-[65%] sm:max-w-[70%] md:max-w-2xl relative z-10 text-center md:text-left">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
                {t('partnersPage.title')}
              </h1>
              <p className="text-base md:text-lg text-white/80 leading-relaxed">
                {t('partnersPage.subtitle')}
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

        {/* Partners slider */}
        <Partners />

        <div className="container mx-auto px-4 py-12 md:py-16 space-y-12">
          {/* Criteria grid */}
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground text-center mb-8">
              {t('partnersPage.whyTitle')}
            </h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {criteria.map(({ icon: Icon, title, desc }) => (
                <div key={title} className="glass-card p-6 rounded-[2rem] hover:shadow-[var(--shadow-hover)] transition-all duration-300">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="text-lg font-bold text-foreground mb-2">{title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Engagement block */}
          <div className="max-w-4xl mx-auto glass-card p-8 md:p-10 rounded-[2rem] bg-gradient-to-br from-primary/5 to-accent/5">
            <h2 className="text-xl md:text-2xl font-bold text-foreground mb-4">{t('partnersPage.commitmentTitle')}</h2>
            <p className="text-muted-foreground mb-5 leading-relaxed">
              {t('partnersPage.commitmentDesc')}
            </p>
            <ul className="space-y-3">
              {[
                t('partnersPage.commitment1'),
                t('partnersPage.commitment2'),
                t('partnersPage.commitment3'),
                t('partnersPage.commitment4'),
              ].map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <div className="mt-0.5 h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <Check className="h-3.5 w-3.5 text-primary" />
                  </div>
                  <span className="text-muted-foreground">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* CTA */}
          <div className="relative bg-gradient-to-r from-primary to-primary/80 rounded-[2rem] p-8 md:p-12 text-center max-w-4xl mx-auto overflow-visible">
            <div className="relative z-10">
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
                {t('partnersPage.ctaTitle')}
              </h2>
              <p className="text-white/80 mb-6 max-w-xl mx-auto">
                {t('partnersPage.ctaDesc')}
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
      </main>

      <Footer />
    </div>
  );
};

export default NosPartenaires;
