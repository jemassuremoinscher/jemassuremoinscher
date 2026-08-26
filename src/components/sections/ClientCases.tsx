import { Car, Home, Stethoscope } from "lucide-react";
import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";

const ClientCases = () => {
  const { t } = useLanguage();

  const cases = [
    {
      key: "marc",
      icon: Car,
      gradient: "bg-gradient-to-br from-primary to-primary/70",
      saving: "340",
    },
    {
      key: "sophie",
      icon: Home,
      gradient: "bg-gradient-to-br from-accent to-accent/70",
      saving: "180",
    },
    {
      key: "thomas",
      icon: Stethoscope,
      gradient: "bg-gradient-to-br from-primary/80 to-accent/80",
      saving: "220",
    },
  ] as const;

  return (
    <section
      className="py-10 md:py-12 bg-background section-lazy"
      aria-labelledby="client-cases-title"
    >
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-6 md:mb-8"
        >
          <h2
            id="client-cases-title"
            className="text-2xl md:text-3xl font-bold text-foreground mb-2"
          >
            {t("clientCases.title")}
          </h2>
          <p className="text-muted-foreground max-w-md mx-auto">
            {t("clientCases.subtitle")}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-5xl mx-auto">
          {cases.map((c, index) => (
            <motion.article
              key={c.key}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.12 }}
              className="group relative overflow-hidden rounded-2xl border border-border/40 bg-card shadow-sm hover:shadow-lg transition-shadow duration-300"
            >
              <div
                className={`absolute -top-16 -right-16 w-48 h-48 rounded-full ${c.gradient} opacity-10 blur-3xl group-hover:opacity-20 transition-opacity duration-500`}
                aria-hidden="true"
              />
              <div className="relative z-10 p-5 md:p-6 flex flex-col h-full min-h-[220px]">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-full ${c.gradient} flex items-center justify-center text-white font-bold text-sm shadow-sm`}
                    >
                      {t(`clientCases.${c.key}.initial`)}
                    </div>
                    <span className="font-semibold text-foreground">
                      {t(`clientCases.${c.key}.name`)}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 bg-muted/50 rounded-full px-2.5 py-1">
                    <c.icon className="w-3.5 h-3.5 text-primary" />
                    <span className="text-[11px] font-medium text-muted-foreground">
                      {t(`clientCases.${c.key}.badge`)}
                    </span>
                  </div>
                </div>
                <h3 className="text-base md:text-lg font-bold text-foreground mb-2 leading-tight">
                  {t(`clientCases.${c.key}.title`)}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed mb-5 flex-grow">
                  {t(`clientCases.${c.key}.description`)}
                </p>
                <div className="flex items-center gap-4 pt-4 border-t border-border/30">
                  <div>
                    <p className="text-xl font-black text-accent font-serif">
                      -{c.saving}€
                      <span className="text-xs font-sans font-medium text-muted-foreground">
                        {t("clientCases.perYear")}
                      </span>
                    </p>
                    <p className="text-[11px] text-muted-foreground">
                      {t("clientCases.savings")}
                    </p>
                  </div>
                  <div className="w-px h-8 bg-border/50" aria-hidden="true" />
                  <div>
                    <p className="text-sm font-bold text-foreground">
                      {t(`clientCases.${c.key}.duration`)}
                    </p>
                    <p className="text-[11px] text-muted-foreground">
                      {t("clientCases.comparisonTime")}
                    </p>
                  </div>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ClientCases;
