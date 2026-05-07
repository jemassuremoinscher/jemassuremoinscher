import { Star, Scale, Eye } from "lucide-react";
import oriasLogo from "@/assets/logos/orias.jpg";

const TrustRow = () => {
  return (
    <section className="py-12 md:py-16 bg-muted/40" aria-label="Pourquoi nous faire confiance">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-stretch">
          {/* Google */}
          <article className="rounded-3xl bg-card p-6 text-center shadow-[0_4px_16px_-6px_rgba(0,0,0,0.08)] hover:shadow-[0_12px_28px_-10px_rgba(0,0,0,0.15)] hover:-translate-y-1 transition-all border border-border/40">
            <div className="mx-auto mb-3 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-white border border-border/40">
              <svg viewBox="0 0 48 48" className="h-7 w-7" aria-hidden="true">
                <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
                <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
                <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
                <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
              </svg>
            </div>
            <h3 className="font-bold text-base text-foreground">4,9/5</h3>
            <div className="flex justify-center gap-0.5 mt-1.5" aria-label="Note 5 sur 5">
              {[0,1,2,3,4].map(i => (
                <Star key={i} className="h-4 w-4 fill-[#f5b80a] text-[#f5b80a]" />
              ))}
            </div>
            <p className="text-xs text-muted-foreground mt-1.5">247+ avis vérifiés</p>
          </article>

          {/* Orias */}
          <article className="rounded-3xl bg-card p-6 text-center shadow-[0_4px_16px_-6px_rgba(0,0,0,0.08)] hover:shadow-[0_12px_28px_-10px_rgba(0,0,0,0.15)] hover:-translate-y-1 transition-all border border-border/40">
            <div className="mx-auto mb-3 inline-flex h-12 w-auto items-center justify-center px-2">
              <img src={oriasLogo} alt="Logo Orias" className="h-10 w-auto object-contain" loading="lazy" decoding="async" />
            </div>
            <h3 className="font-bold text-base text-foreground">Orias certifié</h3>
            <p className="text-xs font-mono text-primary font-semibold mt-1">N° 24 XXX XXX</p>
            <a href="https://www.orias.fr" target="_blank" rel="noopener noreferrer" className="text-[11px] text-muted-foreground hover:text-primary underline underline-offset-2 mt-1 inline-block">
              Vérifier sur orias.fr →
            </a>
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
