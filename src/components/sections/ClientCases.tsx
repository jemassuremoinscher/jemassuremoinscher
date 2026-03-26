import { Car, Home, Stethoscope } from "lucide-react";
import { motion } from "framer-motion";

const cases = [
  {
    name: "Marc",
    initial: "M",
    icon: Car,
    badge: "Auto",
    gradient: "bg-gradient-to-br from-primary to-primary/70",
    title: "BMW importée assurée en 5 min",
    description:
      "Marc a assuré sa BMW série 3 importée d'Allemagne pour son trajet quotidien vers Lyon. Grâce à notre comparateur, il a trouvé une couverture tous risques adaptée aux véhicules d'import.",
    saving: "340",
    duration: "5 minutes",
  },
  {
    name: "Sophie",
    initial: "S",
    icon: Home,
    badge: "Habitation",
    gradient: "bg-gradient-to-br from-accent to-accent/70",
    title: "Dégât des eaux couvert, -180€/an",
    description:
      "Sophie, locataire dans le 11e à Paris, a changé d'assurance habitation après un dégât des eaux mal géré. Sa nouvelle couverture inclut une garantie rééquipement à neuf.",
    saving: "180",
    duration: "3 minutes",
  },
  {
    name: "Thomas",
    initial: "T",
    icon: Stethoscope,
    badge: "Santé",
    gradient: "bg-gradient-to-br from-primary/80 to-accent/80",
    title: "Mutuelle famille, optique remboursée",
    description:
      "Thomas cherchait une mutuelle famille couvrant 2 enfants avec un bon remboursement optique. Il a comparé 12 mutuelles et trouvé 220€ d'économie annuelle sans perte de garanties.",
    saving: "220",
    duration: "4 minutes",
  },
] as const;

const ClientCases = () => {
  return (
    <section
      className="py-16 md:py-20 bg-background section-lazy"
      aria-labelledby="client-cases-title"
      data-ai-description="Cas clients réels anonymisés montrant des exemples concrets d'économies réalisées via le comparateur jemassuremoinscher.fr sur l'assurance auto, habitation et santé."
    >
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10 md:mb-14"
        >
          <h2
            id="client-cases-title"
            className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground mb-3"
          >
            Ils ont changé d'assurance avec nous
          </h2>
          <p className="text-muted-foreground max-w-md mx-auto">
            Des cas réels, des économies concrètes.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-5xl mx-auto">
          {cases.map((c, index) => (
            <motion.article
              key={c.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.12 }}
              className="group relative overflow-hidden rounded-2xl border border-border/40 bg-card shadow-sm hover:shadow-lg transition-shadow duration-300"
            >
              {/* Decorative gradient orb */}
              <div
                className={`absolute -top-16 -right-16 w-48 h-48 rounded-full ${c.gradient} opacity-10 blur-3xl group-hover:opacity-20 transition-opacity duration-500`}
                aria-hidden="true"
              />

              <div className="relative z-10 p-6 md:p-7 flex flex-col h-full min-h-[280px]">
                {/* Header: avatar + badge */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-full ${c.gradient} flex items-center justify-center text-white font-bold text-sm shadow-sm`}
                    >
                      {c.initial}
                    </div>
                    <span className="font-semibold text-foreground">
                      {c.name}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 bg-muted/50 rounded-full px-2.5 py-1">
                    <c.icon className="w-3.5 h-3.5 text-primary" />
                    <span className="text-[11px] font-medium text-muted-foreground">
                      {c.badge}
                    </span>
                  </div>
                </div>

                {/* Title */}
                <h3 className="text-base md:text-lg font-bold text-foreground mb-2 leading-tight">
                  {c.title}
                </h3>

                {/* Description */}
                <p className="text-sm text-muted-foreground leading-relaxed mb-5 flex-grow">
                  {c.description}
                </p>

                {/* Stats row */}
                <div className="flex items-center gap-4 pt-4 border-t border-border/30">
                  <div>
                    <p className="text-xl font-black text-accent font-serif">
                      -{c.saving}€
                      <span className="text-xs font-sans font-medium text-muted-foreground">
                        /an
                      </span>
                    </p>
                    <p className="text-[11px] text-muted-foreground">
                      d'économie
                    </p>
                  </div>
                  <div className="w-px h-8 bg-border/50" aria-hidden="true" />
                  <div>
                    <p className="text-sm font-bold text-foreground">
                      {c.duration}
                    </p>
                    <p className="text-[11px] text-muted-foreground">
                      de comparaison
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
