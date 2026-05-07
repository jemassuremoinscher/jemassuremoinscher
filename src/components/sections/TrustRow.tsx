import { Star, ShieldCheck, Scale, Eye } from "lucide-react";
import arthurMascot from "@/assets/mascotte/arthur-wink-thumbsup.webp";

const items = [
  {
    icon: Star,
    title: "4,9/5 Google Reviews",
    desc: "247+ avis vérifiés",
    accent: true,
  },
  {
    icon: ShieldCheck,
    title: "Orias certifié",
    desc: "Courtier immatriculé n° 22000XXX",
  },
  {
    icon: Scale,
    title: "100% indépendant",
    desc: "Aucun assureur actionnaire",
  },
  {
    icon: Eye,
    title: "Transparence totale",
    desc: "Commissions affichées, pas de pression",
  },
];

const TrustRow = () => {
  return (
    <section className="py-12 md:py-16 bg-muted/40" aria-label="Pourquoi nous faire confiance">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 items-stretch">
          {items.map((it) => (
            <article
              key={it.title}
              className="md:col-span-1 group rounded-3xl bg-card p-5 md:p-6 text-center shadow-[0_4px_16px_-6px_rgba(0,0,0,0.08)] hover:shadow-[0_12px_28px_-10px_rgba(0,0,0,0.15)] hover:-translate-y-1 transition-all border border-border/40"
            >
              <div className="mx-auto mb-3 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary group-hover:bg-primary/20 transition-colors">
                <it.icon className={`h-6 w-6 ${it.accent ? "fill-[#f5b80a] text-[#f5b80a]" : ""}`} />
              </div>
              <h3 className="font-bold text-sm md:text-base text-foreground">{it.title}</h3>
              <p className="text-xs text-muted-foreground mt-1">{it.desc}</p>
            </article>
          ))}

          {/* Arthur, dernière "carte" */}
          <article className="md:col-span-1 rounded-3xl bg-gradient-to-br from-primary to-primary/80 p-5 md:p-6 text-center shadow-[0_4px_16px_-6px_rgba(0,0,0,0.15)] hover:shadow-[0_12px_28px_-10px_rgba(0,0,0,0.25)] transition-all flex flex-col items-center justify-center">
            <img
              src={arthurMascot}
              alt="Arthur, votre mascotte conseil"
              className="h-16 w-auto object-contain mb-2 drop-shadow-lg"
              loading="lazy"
              decoding="async"
            />
            <p className="text-xs md:text-sm font-bold text-white">À votre écoute</p>
            <p className="text-[11px] text-white/80 mt-0.5">Rappel sous 2h</p>
          </article>
        </div>
      </div>
    </section>
  );
};

export default TrustRow;
