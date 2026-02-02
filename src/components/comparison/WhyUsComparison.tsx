import { CheckCircle, XCircle, Zap, Building2, Eye, Heart, Star, Shield, Gift, MessageCircle } from "lucide-react";
import { motion } from "framer-motion";
import arthurThumbsUp from "@/assets/mascotte/arthur-thumbs-up.png";
import arthurThinking from "@/assets/mascotte/arthur-thinking.png";
const WhyUsComparison = () => {
  const comparisonData = [{
    feature: "Rapidité",
    icon: Zap,
    us: "Devis en 2 minutes",
    usValue: true,
    them: "Jusqu'à 15 minutes",
    themValue: false
  }, {
    feature: "Nombre d'assureurs",
    icon: Building2,
    us: "50+ partenaires",
    usValue: true,
    them: "10-20 assureurs",
    themValue: false
  }, {
    feature: "Transparence des prix",
    icon: Eye,
    us: "Prix affichés sans surprise",
    usValue: true,
    them: "Frais cachés fréquents",
    themValue: false
  }, {
    feature: "Mascotte préférée",
    icon: Heart,
    us: "Arthur, le super-héros !",
    usValue: true,
    them: "Aucune mascotte 😢",
    themValue: false
  }];
  const containerVariants = {
    hidden: {
      opacity: 0
    },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  const itemVariants = {
    hidden: {
      opacity: 0,
      y: 20
    },
    visible: {
      opacity: 1,
      y: 0
    }
  };
  return <section className="py-12 md:py-20 bg-muted/30" aria-labelledby="why-us-title">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <motion.div initial={{
        opacity: 0,
        y: 20
      }} whileInView={{
        opacity: 1,
        y: 0
      }} viewport={{
        once: true
      }} className="text-center mb-10">
          <h2 id="why-us-title" className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground mb-3">
            Pourquoi nous choisir ?
          </h2>
          <p className="text-muted-foreground max-w-md mx-auto">
            Découvrez ce qui nous différencie des autres comparateurs
          </p>
        </motion.div>

        {/* Desktop Table */}
        <motion.div initial={{
        opacity: 0,
        y: 30
      }} whileInView={{
        opacity: 1,
        y: 0
      }} viewport={{
        once: true
      }} className="hidden md:block max-w-4xl mx-auto mb-12">
          <div className="bg-card rounded-2xl shadow-lg border border-border/50 overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border/50">
                  <th className="p-4 text-left text-muted-foreground font-medium">
                    Critères
                  </th>
                  <th className="p-4 text-center bg-primary/5">
                    <span className="text-lg font-bold text-primary">
                      jemassuremoinscher
                    </span>
                  </th>
                  <th className="p-4 text-center">
                    <span className="text-lg font-semibold text-muted-foreground">
                      Autres comparateurs
                    </span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {comparisonData.map((row, index) => <tr key={row.feature} className={`border-b border-border/30 last:border-b-0 ${index % 2 === 0 ? "bg-background/50" : ""}`}>
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-primary/10">
                          <row.icon className="w-4 h-4 text-primary" />
                        </div>
                        <span className="font-medium text-foreground">
                          {row.feature}
                        </span>
                      </div>
                    </td>
                    <td className="p-4 text-center bg-primary/5">
                      <div className="flex items-center justify-center gap-2">
                        <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                        <span className="text-sm font-medium text-foreground">
                          {row.us}
                        </span>
                      </div>
                    </td>
                    <td className="p-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <XCircle className="w-5 h-5 text-destructive/70 flex-shrink-0" />
                        <span className="text-sm text-muted-foreground">
                          {row.them}
                        </span>
                      </div>
                    </td>
                  </tr>)}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Mobile Cards */}
        <motion.div variants={containerVariants} initial="hidden" whileInView="visible" viewport={{
        once: true
      }} className="md:hidden space-y-4 mb-10">
          {comparisonData.map(row => <motion.div key={row.feature} variants={itemVariants} className="bg-card rounded-xl shadow-sm border border-border/50 overflow-hidden">
              <div className="flex items-center gap-3 p-4 bg-muted/50 border-b border-border/30">
                <div className="p-2 rounded-lg bg-primary/10">
                  <row.icon className="w-4 h-4 text-primary" />
                </div>
                <span className="font-bold text-foreground">{row.feature}</span>
              </div>
              <div className="grid grid-cols-2 divide-x divide-border/30">
                <div className="p-4 bg-primary/5">
                  <p className="text-xs text-primary font-semibold mb-2 uppercase tracking-wide">
                    jemassuremoinscher
                  </p>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                    <span className="text-sm font-medium text-foreground">
                      {row.us}
                    </span>
                  </div>
                </div>
                <div className="p-4">
                  <p className="text-xs text-muted-foreground font-medium mb-2 uppercase tracking-wide">
                    Autres
                  </p>
                  <div className="flex items-start gap-2">
                    <XCircle className="w-5 h-5 text-destructive/70 flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-muted-foreground">
                      {row.them}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>)}
        </motion.div>

        {/* Arthur Speech Bubble */}
        <motion.div initial={{
        opacity: 0,
        scale: 0.9
      }} whileInView={{
        opacity: 1,
        scale: 1
      }} viewport={{
        once: true
      }} className="flex flex-col md:flex-row items-center justify-center gap-4 mb-12">
          <div className="relative">
            <motion.img src={arthurThumbsUp} alt="Arthur mascotte jemassuremoinscher - votre guide pour une assurance moins chère" className="w-20 h-auto md:w-24" loading="lazy" decoding="async" animate={{
            y: [0, -5, 0]
          }} transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }} />
          </div>
          <motion.div initial={{
          opacity: 0,
          x: -20
        }} whileInView={{
          opacity: 1,
          x: 0
        }} viewport={{
          once: true
        }} transition={{
          delay: 0.3
        }} className="relative bg-accent/10 border border-accent/30 rounded-xl px-5 py-3 max-w-sm">
            <div className="absolute -left-2 top-1/2 -translate-y-1/2 w-3 h-3 bg-accent/10 border-l border-b border-accent/30 transform rotate-45 hidden md:block" />
            <p className="text-sm md:text-base font-medium text-foreground">
              💡 Saviez-vous que{" "}
              <span className="text-primary font-bold">9 clients sur 10</span>{" "}
              économisent{" "}
              <span className="text-accent font-bold">250€ par an</span> ?
            </p>
          </motion.div>
        </motion.div>

        {/* Bento Grid - Social Proof */}
        <motion.div variants={containerVariants} initial="hidden" whileInView="visible" viewport={{
        once: true
      }} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 max-w-5xl mx-auto">
          {/* Trustpilot Rating */}
          <motion.div variants={itemVariants} className="md:col-span-2 lg:col-span-2 bg-card rounded-xl p-6 md:p-8 shadow-sm border border-border/50 hover:shadow-md transition-shadow">
            <div className="flex flex-col items-center md:items-start gap-4">
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map(star => <Star key={star} className={`w-6 h-6 md:w-7 md:h-7 ${star <= 4 ? "fill-yellow-400 text-yellow-400" : "fill-yellow-400/80 text-yellow-400/80"}`} />)}
              </div>
              <div className="text-center md:text-left">
                <p className="text-3xl md:text-4xl font-black text-foreground mb-1">
                  4.8<span className="text-xl text-muted-foreground">/5</span>
                </p>
                <p className="text-sm md:text-base text-muted-foreground">
                  sur Google Reviews • +250 avis
                </p>
              </div>
            </div>
          </motion.div>

          {/* Free Service */}
          <motion.div variants={itemVariants} className="bg-gradient-to-br from-accent/10 to-accent/5 rounded-xl p-6 shadow-sm border border-accent/20 hover:shadow-md transition-shadow">
            <div className="flex flex-col items-center text-center gap-3">
              <div className="p-3 rounded-full bg-accent/20">
                <Gift className="w-6 h-6 text-accent" />
              </div>
              <div>
                <p className="text-lg md:text-xl font-bold text-foreground">
                  Service 100%
                </p>
                <p className="text-2xl md:text-3xl font-black text-accent">
                  Gratuit
                </p>
              </div>
            </div>
          </motion.div>

          {/* Secure Data */}
          <motion.div variants={itemVariants} className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-xl p-6 shadow-sm border border-primary/20 hover:shadow-md transition-shadow">
            <div className="flex flex-col items-center text-center gap-3">
              <div className="p-3 rounded-full bg-primary/20">
                <Shield className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-lg md:text-xl font-bold text-foreground">
                  Données
                </p>
                <p className="text-2xl md:text-3xl font-black text-primary">
                  Sécurisées
                </p>
              </div>
            </div>
          </motion.div>

          {/* Arthur Mascot Card */}
          <motion.div variants={itemVariants} className="md:col-span-2 lg:col-span-4 bg-gradient-to-r from-primary to-primary/90 rounded-xl p-6 md:p-8 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex flex-col md:flex-row items-center gap-4 md:gap-8">
              <motion.img src={arthurThinking} alt="Arthur mascotte jemassuremoinscher réfléchit - trouvez une assurance moins chère" className="w-20 h-auto md:w-28" loading="lazy" decoding="async" animate={{
              y: [0, -5, 0]
            }} transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }} />
              <div className="flex-1 text-center md:text-left">
                <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
                  <MessageCircle className="w-5 h-5 text-accent" />
                  <span className="text-primary-foreground/80 text-sm font-medium">
                    Arthur vous dit :
                  </span>
                </div>
                <p className="text-xl md:text-2xl lg:text-3xl font-bold text-primary-foreground">
                  "Je négocie pour vous les{" "}
                  <span className="text-accent">meilleurs tarifs</span> !"
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>;
};
export default WhyUsComparison;