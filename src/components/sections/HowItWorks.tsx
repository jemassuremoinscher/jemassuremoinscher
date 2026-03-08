import { ClipboardList, Search, CheckCircle, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import arthurRunning from "@/assets/mascotte/arthur-running-coin.png";

const HowItWorks = () => {
  const { t } = useLanguage();

  const steps = [
    {
      number: "1",
      icon: ClipboardList,
      title: t('howItWorks.step1.title'),
      description: t('howItWorks.step1.description'),
      gradient: "bg-gradient-to-br from-primary to-primary/70",
      color: "bg-primary",
    },
    {
      number: "2",
      icon: Search,
      title: t('howItWorks.step2.title'),
      description: t('howItWorks.step2.description'),
      gradient: "bg-gradient-to-br from-accent to-accent/70",
      color: "bg-accent",
    },
    {
      number: "3",
      icon: CheckCircle,
      title: t('howItWorks.step3.title'),
      description: t('howItWorks.step3.description'),
      gradient: "bg-gradient-to-br from-primary/80 to-accent/80",
      color: "bg-primary",
    },
  ];

  return (
    <section className="py-16 md:py-24 bg-gradient-to-b from-background via-muted/20 to-background">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12 md:mb-16"
        >
          <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold text-foreground mb-3">
            {t('howItWorks.title')}
          </h2>
          <p className="text-muted-foreground max-w-md mx-auto text-lg">
            {t('howItWorks.subtitle')}
          </p>
        </motion.div>

        {/* Horizontal stacking cards */}
        <div className="relative -mx-4 px-4">
          <div className="flex items-stretch overflow-x-auto pb-6 snap-x snap-mandatory scrollbar-hide pl-4 md:pl-0 md:justify-center">
            {steps.map((step, index) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, x: 40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.12 }}
                whileHover={{ y: -6, rotate: -1 }}
                className="group flex-shrink-0 w-[78vw] md:w-[340px] snap-center"
                style={{
                  zIndex: steps.length - index,
                  marginLeft: index === 0 ? '0' : '-24px',
                }}
              >
                <div className="relative overflow-hidden rounded-3xl border border-border/40 bg-card shadow-[0_8px_32px_-8px_hsl(var(--primary)/0.12)] backdrop-blur-sm transition-all duration-500 hover:shadow-[0_24px_64px_-12px_hsl(var(--primary)/0.3)] hover:border-primary/30 h-full">
                  {/* Decorative gradient orbs */}
                  <div className={`absolute -top-20 -right-20 w-60 h-60 rounded-full ${step.gradient} opacity-20 blur-3xl group-hover:opacity-40 transition-opacity duration-500`} />
                  <div className={`absolute -bottom-16 -left-16 w-40 h-40 rounded-full ${step.gradient} opacity-10 blur-2xl`} />

                  <div className="relative z-10 p-7 md:p-8 flex flex-col h-full min-h-[300px]">
                    {/* Top row: step number badge + big number */}
                    <div className="flex items-center justify-between mb-5">
                      <div className={`w-10 h-10 rounded-full ${step.color} text-white font-black text-lg flex items-center justify-center shadow-lg`}>
                        {step.number}
                      </div>
                      <span className="text-6xl font-black text-foreground/[0.04] select-none leading-none">
                        0{step.number}
                      </span>
                    </div>

                    {/* Icon */}
                    <div className={`w-16 h-16 rounded-2xl ${step.gradient} flex items-center justify-center shadow-lg mb-5 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500`}>
                      <step.icon className="w-8 h-8 text-white" />
                    </div>

                    {/* Content */}
                    <h3 className="text-lg md:text-xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors duration-300 leading-tight">
                      {step.title}
                    </h3>
                    <p className="text-muted-foreground text-sm leading-relaxed flex-grow">
                      {step.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Arthur Mascot */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="flex justify-center mt-12"
        >
          <div className="flex items-center gap-4 bg-accent/10 rounded-full px-6 py-3 border border-accent/30">
            <motion.img
              src={arthurRunning}
              alt="Arthur mascotte"
              className="w-12 h-auto"
              width={48}
              height={60}
              loading="lazy"
              decoding="async"
              animate={{ x: [0, 5, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
            <p className="text-sm md:text-base font-medium text-foreground">
              <span className="text-accent font-bold">Arthur</span> {t('howItWorks.arthurCta')}
            </p>
            <ArrowRight className="w-5 h-5 text-accent" />
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default HowItWorks;
