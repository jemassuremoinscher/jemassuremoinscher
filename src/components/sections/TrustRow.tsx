import { Star, Scale, Eye } from "lucide-react";
import oriasLogo from "@/assets/logos/orias.jpg";

const TrustRow = () => {
  return (
    <section className="py-12 md:py-16 bg-muted/40" aria-label="Pourquoi nous faire confiance">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-stretch">
          {/* Google */}
          <article className="rounded-3xl bg-card p-6 text-center shadow-[0_4px_16px_-6px_rgba(0,0,0,0.08)] hover:shadow-[0_12px_28px_-10px_rgba(0,0,0,0.15)] hover:-translate-y-1 transition-all border border-border/40">
            <div className="mx-auto mb-3 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10">
              <Star className="h-6 w-6 fill-[#f5b80a] text-[#f5b80a]" />
            </div>
            <h3 className="font-bold text-base text-foreground">4,9/5 Google Reviews</h3>
            <p className="text-xs text-muted-foreground mt-1">247+ avis vérifiés</p>
          </article>

          {/* Orias */}
          <article className="rounded-3xl bg-card p-6 text-center shadow-[0_4px_16px_-6px_rgba(0,0,0,0.08)] hover:shadow-[0_12px_28px_-10px_rgba(0,0,0,0.15)] hover:-translate-y-1 transition-all border border-border/40">
            <div className="mx-auto mb-3 inline-flex h-12 w-auto items-center justify-center px-2">
              <img src={oriasLogo} alt="Logo Orias" className="h-10 w-auto object-contain" loading="lazy" decoding="async" />
            </div>
            <h3 className="font-bold text-base text-foreground">Orias certifié</h3>
            <p className="text-xs text-muted-foreground mt-1">Courtier immatriculé</p>
          </article>

          {/* Indépendant */}
          <article className="rounded-3xl bg-card p-6 text-center shadow-[0_4px_16px_-6px_rgba(0,0,0,0.08)] hover:shadow-[0_12px_28px_-10px_rgba(0,0,0,0.15)] hover:-translate-y-1 transition-all border border-border/40">
            <div className="mx-auto mb-3 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <Scale className="h-6 w-6" />
            </div>
            <h3 className="font-bold text-base text-foreground">100% indépendant</h3>
            <p className="text-xs text-muted-foreground mt-1">Aucun assureur actionnaire</p>
          </article>

          {/* Transparence */}
          <article className="rounded-3xl bg-card p-6 text-center shadow-[0_4px_16px_-6px_rgba(0,0,0,0.08)] hover:shadow-[0_12px_28px_-10px_rgba(0,0,0,0.15)] hover:-translate-y-1 transition-all border border-border/40">
            <div className="mx-auto mb-3 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <Eye className="h-6 w-6" />
            </div>
            <h3 className="font-bold text-base text-foreground">Transparence totale</h3>
            <p className="text-xs text-muted-foreground mt-1">Commissions affichées</p>
          </article>
        </div>
      </div>
    </section>
  );
};

export default TrustRow;
