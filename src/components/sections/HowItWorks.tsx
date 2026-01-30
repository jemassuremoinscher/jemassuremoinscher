import { ClipboardList, Search, CheckCircle, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import arthurRunning from "@/assets/mascotte/arthur-running.png";

const HowItWorks = () => {
  const steps = [
    {
      number: "1",
      icon: ClipboardList,
      title: "Je remplis mon profil",
      description: "En 2 minutes, décrivez vos besoins en assurance.",
    },
    {
      number: "2",
      icon: Search,
      title: "Je compare les offres",
      description: "Arthur analyse 50+ assureurs pour vous.",
    },
    {
      number: "3",
      icon: CheckCircle,
      title: "Je souscris en ligne",
      description: "Choisissez la meilleure offre et souscrivez.",
    },
  ];

  return (
    <section className="py-16 md:py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        {/* Section Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12 md:mb-16"
        >
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground mb-3">
            Comment ça marche ?
          </h2>
          <p className="text-muted-foreground max-w-md mx-auto">
            Comparer ses assurances n'a jamais été aussi simple
          </p>
        </motion.div>

        {/* Steps Container */}
        <div className="max-w-4xl mx-auto">
          {/* Desktop Layout */}
          <div className="hidden md:flex items-start justify-between relative">
            {/* Connecting Line */}
            <div className="absolute top-16 left-[15%] right-[15%] h-1 bg-gradient-to-r from-primary via-accent to-primary rounded-full" />

            {steps.map((step, index) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                className="flex flex-col items-center text-center w-1/3 relative z-10"
              >
                {/* Step Number Circle */}
                <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground font-black text-xl flex items-center justify-center mb-4 shadow-lg">
                  {step.number}
                </div>

                {/* Icon */}
                <div className="w-20 h-20 rounded-2xl bg-card shadow-md border border-border/50 flex items-center justify-center mb-4">
                  <step.icon className="w-10 h-10 text-primary" />
                </div>

                {/* Content */}
                <h3 className="text-lg font-bold text-foreground mb-2">
                  {step.title}
                </h3>
                <p className="text-sm text-muted-foreground max-w-[200px]">
                  {step.description}
                </p>
              </motion.div>
            ))}
          </div>

          {/* Mobile Layout */}
          <div className="md:hidden space-y-6">
            {steps.map((step, index) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="relative"
              >
                <div className="flex items-start gap-4">
                  {/* Left: Number + Connector */}
                  <div className="flex flex-col items-center">
                    <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground font-bold text-lg flex items-center justify-center shadow-md">
                      {step.number}
                    </div>
                    {index < steps.length - 1 && (
                      <div className="w-0.5 h-16 bg-gradient-to-b from-primary to-accent mt-2" />
                    )}
                  </div>

                  {/* Right: Content */}
                  <div className="flex-1 bg-card rounded-xl p-4 shadow-sm border border-border/50">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="p-2 rounded-lg bg-primary/10">
                        <step.icon className="w-5 h-5 text-primary" />
                      </div>
                      <h3 className="font-bold text-foreground">{step.title}</h3>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {step.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
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
                alt="Arthur mascotte jemassuremoinscher court - assurance moins chère en 2 minutes"
                className="w-12 h-auto"
                loading="lazy"
                decoding="async"
                animate={{ x: [0, 5, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
              <p className="text-sm md:text-base font-medium text-foreground">
                <span className="text-accent font-bold">Arthur</span> s'occupe de tout !
              </p>
              <ArrowRight className="w-5 h-5 text-accent" />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;