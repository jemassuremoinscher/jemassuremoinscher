import { CheckCircle, XCircle, Zap, Building2, Eye, Heart, Star, Shield, Gift, MessageCircle, Scale, FileCheck, BadgeCheck } from "lucide-react";
import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import arthurThumbsUp from "@/assets/mascotte/arthur-thumbsup-coin.webp";
import arthurThinking from "@/assets/mascotte/arthur-detective.webp";
import oriasLogo from "@/assets/logos/orias.jpg";
import geoContent from "@/data/geo-content.json";

const WhyUsComparison = () => {
  const { t } = useLanguage();

  const comparisonData = [
    { feature: t('whyUs.speed'), icon: Zap, us: t('whyUs.speedUs'), usValue: true, them: t('whyUs.speedThem'), themValue: false },
    { feature: t('whyUs.insurerCount'), icon: Building2, us: t('whyUs.insurerCountUs'), usValue: true, them: t('whyUs.insurerCountThem'), themValue: false },
    { feature: t('whyUs.transparency'), icon: Eye, us: t('whyUs.transparencyUs'), usValue: true, them: t('whyUs.transparencyThem'), themValue: false },
    { feature: t('whyUs.mascot'), icon: Heart, us: t('whyUs.mascotUs'), usValue: true, them: t('whyUs.mascotThem'), themValue: false },
  ];

  const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1 } } };
  const itemVariants = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } };

  return (
    <section className="py-12 md:py-20 bg-muted/30 section-lazy" aria-labelledby="why-us-title">
      <div className="container mx-auto px-4">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-10">
          <h2 id="why-us-title" className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground mb-3">
            {t('whyUs.title')}
          </h2>
          <p className="text-muted-foreground max-w-md mx-auto">{t('whyUs.subtitle')}</p>
        </motion.div>

        {/* Desktop Table */}
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="hidden md:block max-w-4xl mx-auto mb-12">
          <div className="bg-card rounded-2xl shadow-lg border border-border/50 overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border/50">
                  <th className="p-4 text-left text-muted-foreground font-medium">{t('whyUs.criteria')}</th>
                  <th className="p-4 text-center bg-primary/5">
                    <span className="text-lg font-bold"><span className="text-primary">jemassure</span><span className="text-accent">moinscher</span><span className="text-primary">.fr</span></span>
                  </th>
                  <th className="p-4 text-center">
                    <span className="text-lg font-semibold text-muted-foreground">{t('whyUs.others')}</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {comparisonData.map((row, index) => (
                  <tr key={row.feature} className={`border-b border-border/30 last:border-b-0 ${index % 2 === 0 ? "bg-background/50" : ""}`}>
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-primary/10"><row.icon className="w-4 h-4 text-primary" /></div>
                        <span className="font-medium text-foreground">{row.feature}</span>
                      </div>
                    </td>
                    <td className="p-4 text-center bg-primary/5">
                      <div className="flex items-center justify-center gap-2">
                        <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                        <span className="text-sm font-medium text-foreground">{row.us}</span>
                      </div>
                    </td>
                    <td className="p-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <XCircle className="w-5 h-5 text-destructive/70 flex-shrink-0" />
                        <span className="text-sm text-muted-foreground">{row.them}</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Mobile Slide Cards */}
        <div className="md:hidden relative -mx-4 px-4 mb-10">
          <div className="flex gap-4 overflow-x-auto pb-6 snap-x snap-mandatory scrollbar-hide">
            {comparisonData.map((row, index) => (
              <motion.div
                key={row.feature}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="flex-shrink-0 w-[85%] snap-center"
              >
                <div className="bg-card rounded-2xl shadow-sm border border-border/50 overflow-hidden h-full">
                  <div className="flex items-center gap-3 p-4 bg-muted/50 border-b border-border/30">
                    <div className="p-2 rounded-lg bg-primary/10"><row.icon className="w-4 h-4 text-primary" /></div>
                    <span className="font-bold text-foreground">{row.feature}</span>
                  </div>
                  <div className="p-4 space-y-3">
                    <div className="bg-primary/5 rounded-lg p-3">
                      <p className="text-xs font-semibold mb-1.5 uppercase tracking-wide"><span className="text-primary">jemassure</span><span className="text-accent">moinscher</span><span className="text-primary">.fr</span></p>
                      <div className="flex items-start gap-2">
                        <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                        <span className="text-sm font-medium text-foreground">{row.us}</span>
                      </div>
                    </div>
                    <div className="rounded-lg p-3">
                      <p className="text-xs text-muted-foreground font-medium mb-1.5 uppercase tracking-wide">{t('whyUs.othersMobile')}</p>
                      <div className="flex items-start gap-2">
                        <XCircle className="w-5 h-5 text-destructive/70 flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-muted-foreground">{row.them}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Arthur Speech Bubble */}
        <motion.div initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} className="flex flex-col md:flex-row items-center justify-center gap-4 mb-12">
          <img src={arthurThumbsUp} alt="Arthur" className="w-20 h-auto md:w-24 animate-hero-float" width={96} height={120} loading="lazy" decoding="async" />
          <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: 0.3 }} className="relative bg-accent/10 border border-accent/30 rounded-xl px-5 py-3 max-w-sm">
            <div className="absolute -left-2 top-1/2 -translate-y-1/2 w-3 h-3 bg-accent/10 border-l border-b border-accent/30 transform rotate-45 hidden md:block" />
            <p className="text-sm md:text-base font-medium text-foreground">
              💡 {t('whyUs.didYouKnow')}{" "}
              <span className="text-primary font-bold">{t('whyUs.9outOf10')}</span>{" "}
              {t('whyUs.save')}{" "}
              <span className="text-accent font-bold">250€ {t('whyUs.perYear')}</span>&nbsp;avec{" "}
              <span className="text-primary font-bold">jemassure</span><span className="text-accent font-bold">moinscher</span><span className="text-primary font-bold">.fr</span>
            </p>
          </motion.div>
        </motion.div>

      </div>
    </section>
  );
};

export default WhyUsComparison;