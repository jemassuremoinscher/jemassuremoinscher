import { CheckCircle, XCircle, Zap, Building2, Eye, Heart } from "lucide-react";
import { motion } from "framer-motion";
import arthurThumbsUp from "@/assets/mascotte/arthur-thumbs-up.png";

const WhyUsComparison = () => {
  const comparisonData = [
    {
      feature: "Rapidité",
      icon: Zap,
      us: "Devis en 2 minutes",
      usValue: true,
      them: "Jusqu'à 15 minutes",
      themValue: false,
    },
    {
      feature: "Nombre d'assureurs",
      icon: Building2,
      us: "50+ partenaires",
      usValue: true,
      them: "10-20 assureurs",
      themValue: false,
    },
    {
      feature: "Transparence des prix",
      icon: Eye,
      us: "Prix affichés sans surprise",
      usValue: true,
      them: "Frais cachés fréquents",
      themValue: false,
    },
    {
      feature: "Mascotte préférée",
      icon: Heart,
      us: "Arthur, le super-héros !",
      usValue: true,
      them: "Aucune mascotte 😢",
      themValue: false,
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <section
      className="py-12 md:py-16 bg-muted/30"
      aria-labelledby="why-us-title"
    >
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <h2
            id="why-us-title"
            className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground mb-3"
          >
            Pourquoi nous ?
          </h2>
          <p className="text-muted-foreground max-w-md mx-auto">
            Découvrez ce qui nous différencie des autres comparateurs
          </p>
        </motion.div>

        {/* Desktop Table */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="hidden md:block max-w-4xl mx-auto"
        >
          <div className="bg-card rounded-2xl shadow-lg border border-border/50 overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border/50">
                  <th className="p-4 text-left text-muted-foreground font-medium">
                    Critères
                  </th>
                  <th className="p-4 text-center bg-primary/5">
                    <div className="flex flex-col items-center gap-1">
                      <span className="text-lg font-bold text-primary">
                        jemassuremoinscher
                      </span>
                      <span className="text-xs text-muted-foreground">
                        Notre service
                      </span>
                    </div>
                  </th>
                  <th className="p-4 text-center">
                    <div className="flex flex-col items-center gap-1">
                      <span className="text-lg font-semibold text-muted-foreground">
                        Autres comparateurs
                      </span>
                      <span className="text-xs text-muted-foreground">
                        Concurrence
                      </span>
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody>
                {comparisonData.map((row, index) => (
                  <tr
                    key={row.feature}
                    className={`border-b border-border/30 last:border-b-0 ${
                      index % 2 === 0 ? "bg-background/50" : ""
                    }`}
                  >
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
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Mobile Cards */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="md:hidden space-y-4"
        >
          {comparisonData.map((row) => (
            <motion.div
              key={row.feature}
              variants={itemVariants}
              className="bg-card rounded-xl shadow-sm border border-border/50 overflow-hidden"
            >
              {/* Feature Header */}
              <div className="flex items-center gap-3 p-4 bg-muted/50 border-b border-border/30">
                <div className="p-2 rounded-lg bg-primary/10">
                  <row.icon className="w-4 h-4 text-primary" />
                </div>
                <span className="font-bold text-foreground">{row.feature}</span>
              </div>

              {/* Comparison */}
              <div className="grid grid-cols-2 divide-x divide-border/30">
                {/* Us */}
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

                {/* Them */}
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
            </motion.div>
          ))}
        </motion.div>

        {/* Arthur Mascot with Speech Bubble */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="flex flex-col md:flex-row items-center justify-center gap-4 mt-10"
        >
          <div className="relative">
            <motion.img
              src={arthurThumbsUp}
              alt="Arthur, votre mascotte"
              className="w-20 h-auto md:w-24"
              loading="lazy"
              decoding="async"
              animate={{ y: [0, -5, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            />
          </div>

          {/* Speech Bubble */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="relative bg-accent/10 border border-accent/30 rounded-xl px-5 py-3 max-w-sm"
          >
            <div className="absolute -left-2 top-1/2 -translate-y-1/2 w-3 h-3 bg-accent/10 border-l border-b border-accent/30 transform rotate-45 hidden md:block" />
            <p className="text-sm md:text-base font-medium text-foreground">
              💡 Saviez-vous que{" "}
              <span className="text-primary font-bold">9 clients sur 10</span>{" "}
              économisent{" "}
              <span className="text-accent font-bold">250€ par an</span> ?
            </p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default WhyUsComparison;
