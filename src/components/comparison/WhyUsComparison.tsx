import { Zap, Building2, Gift } from "lucide-react";
import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";

const WhyUsComparison = () => {
  const { t } = useLanguage();

  const items = [
    { icon: Zap, title: t('whyUs.speedUs'), desc: t('whyUs.speed') },
    { icon: Building2, title: t('whyUs.insurerCountUs'), desc: t('whyUs.insurerCount') },
    { icon: Gift, title: t('whyUs.freeServiceTitle'), desc: t('whyUs.freeService') },
  ];

  return (
    <section className="py-8 md:py-12 bg-muted/30 section-lazy" aria-labelledby="why-us-title">
      <div className="container mx-auto px-4">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-6 md:mb-8">
          <h2 id="why-us-title" className="text-2xl md:text-3xl font-bold text-foreground mb-2">
            {t('whyUs.title')}
          </h2>
          <p className="text-muted-foreground max-w-md mx-auto">{t('whyUs.subtitle')}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto mb-8 grid grid-cols-1 sm:grid-cols-3 gap-4"
        >
          {items.map((item) => (
            <div key={item.title} className="bg-card rounded-2xl shadow-sm border border-border/50 p-5 flex flex-col items-center text-center gap-2">
              <div className="p-3 rounded-full bg-primary/10">
                <item.icon className="w-6 h-6 text-primary" />
              </div>
              <p className="font-bold text-foreground">{item.title}</p>
              <p className="text-sm text-muted-foreground">{item.desc}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default WhyUsComparison;
