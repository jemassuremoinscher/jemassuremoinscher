import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { Sparkles, Workflow, Award, Layers } from "lucide-react";

const SEOContent = () => {
  const { t } = useLanguage();

  return (
    <section className="py-12 md:py-16 bg-background border-t border-border/30 section-lazy">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* En-tête de section */}
        <div className="max-w-3xl mx-auto text-center mb-10 md:mb-12">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            Guide complet 2026
          </span>
          <h2 className="text-2xl md:text-4xl font-bold text-foreground mb-3">
            {t('seoContent.title')}
          </h2>
          <div className="w-16 h-1 bg-accent mx-auto rounded-full" />
        </div>

        {/* Bloc d'intro premium - garde p1 et p2 intacts pour le SEO */}
        <div className="max-w-4xl mx-auto mb-10 md:mb-14">
          <div className="bg-muted/40 border-l-4 border-primary p-5 md:p-7 space-y-4 text-sm md:text-base text-muted-foreground leading-relaxed">
            <p>
              {t('seoContent.p1')}{' '}
              Consultez notre <Link to="/blog" className="text-primary hover:underline font-medium">blog assurance</Link> pour
              des guides détaillés sur chaque type de contrat, ou explorez
              le <Link to="/glossaire" className="text-primary hover:underline font-medium">glossaire de l'assurance</Link> pour
              comprendre les termes techniques. Vous pouvez aussi <Link to="/comparatif" className="text-primary hover:underline font-medium">comparer les assureurs face à face</Link> dans nos duels détaillés.
            </p>
            <p>{t('seoContent.p2')}</p>
          </div>
        </div>

        {/* 3 cartes thématiques GEO - reprennent H3 + paragraphes complets */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-12 md:mb-16">
          {/* Carte 1 — Comment ça marche */}
          <article className="bg-card border border-border/60 p-6 md:p-7 transition-all duration-300 hover:shadow-[var(--shadow-hover)] flex flex-col">
            <div className="w-11 h-11 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
              <Workflow className="w-5 h-5 text-primary" aria-hidden="true" />
            </div>
            <h3 className="text-lg md:text-xl font-bold text-foreground mb-3 leading-tight">
              {t('seoContent.h3_1')}
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed flex-1">
              {t('seoContent.p3')}{' '}
              Utilisez notre <Link to="/outils/calculateur-bonus-malus" className="text-primary hover:underline font-medium">calculateur de bonus-malus</Link> pour
              estimer votre coefficient avant de comparer. Pour les profils atypiques (résilié, malussé, retrait de permis), consultez nos <Link to="/profil" className="text-primary hover:underline font-medium">solutions profils spéciaux</Link>.
            </p>
          </article>

          {/* Carte 2 — Pourquoi nous choisir */}
          <article className="bg-card border border-border/60 p-6 md:p-7 transition-all duration-300 hover:shadow-[var(--shadow-hover)] flex flex-col">
            <div className="w-11 h-11 rounded-lg bg-accent/10 flex items-center justify-center mb-4">
              <Award className="w-5 h-5 text-accent" aria-hidden="true" />
            </div>
            <h3 className="text-lg md:text-xl font-bold text-foreground mb-3 leading-tight">
              {t('seoContent.h3_2')}
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed flex-1">
              {t('seoContent.p4')}
            </p>
          </article>

          {/* Carte 3 — Toutes les assurances */}
          <article className="bg-card border border-border/60 p-6 md:p-7 transition-all duration-300 hover:shadow-[var(--shadow-hover)] flex flex-col">
            <div className="w-11 h-11 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
              <Layers className="w-5 h-5 text-primary" aria-hidden="true" />
            </div>
            <h3 className="text-lg md:text-xl font-bold text-foreground mb-3 leading-tight">
              {t('seoContent.h3_3')}
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed flex-1">
              {t('seoContent.p5')}{' '}
              Découvrez les <Link to="/avis-clients" className="text-primary hover:underline font-medium">avis de nos clients</Link> et
              ce que disent nos <Link to="/nos-partenaires" className="text-primary hover:underline font-medium">70+ assureurs partenaires</Link>.
            </p>
          </article>
        </div>

        {/* Internal links for SEO - All insurance products */}
        <div className="pt-8 border-t border-border/30">
          <h3 className="text-xl md:text-2xl font-bold text-foreground mb-6 text-center">
            {t('seoContent.linksTitle')}
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
            {/* Particuliers */}
            <div className="bg-muted/40 border border-border/40 p-4 md:p-5">
              <div className="flex items-center gap-2 mb-3">
                <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10 text-primary">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                </span>
                <h4 className="text-sm font-semibold text-foreground">Assurances Particuliers</h4>
              </div>
              <div className="flex flex-wrap gap-1.5">
                <Link to="/assurance-auto" className="inline-block text-xs font-medium px-3 py-1.5 rounded-full bg-background border border-border/60 text-muted-foreground hover:text-primary hover:border-primary/40 hover:bg-primary/5 transition-colors">{t('seoContent.linkAuto')}</Link>
                <Link to="/assurance-moto" className="inline-block text-xs font-medium px-3 py-1.5 rounded-full bg-background border border-border/60 text-muted-foreground hover:text-primary hover:border-primary/40 hover:bg-primary/5 transition-colors">{t('seoContent.linkMoto')}</Link>
                <Link to="/assurance-habitation" className="inline-block text-xs font-medium px-3 py-1.5 rounded-full bg-background border border-border/60 text-muted-foreground hover:text-primary hover:border-primary/40 hover:bg-primary/5 transition-colors">{t('seoContent.linkHabitation')}</Link>
                <Link to="/assurance-sante" className="inline-block text-xs font-medium px-3 py-1.5 rounded-full bg-background border border-border/60 text-muted-foreground hover:text-primary hover:border-primary/40 hover:bg-primary/5 transition-colors">{t('seoContent.linkSante')}</Link>
                <Link to="/assurance-animaux" className="inline-block text-xs font-medium px-3 py-1.5 rounded-full bg-background border border-border/60 text-muted-foreground hover:text-primary hover:border-primary/40 hover:bg-primary/5 transition-colors">{t('seoContent.linkAnimaux')}</Link>
                <Link to="/assurance-vie" className="inline-block text-xs font-medium px-3 py-1.5 rounded-full bg-background border border-border/60 text-muted-foreground hover:text-primary hover:border-primary/40 hover:bg-primary/5 transition-colors">{t('seoContent.linkVie')}</Link>
                <Link to="/assurance-pret" className="inline-block text-xs font-medium px-3 py-1.5 rounded-full bg-background border border-border/60 text-muted-foreground hover:text-primary hover:border-primary/40 hover:bg-primary/5 transition-colors">{t('seoContent.linkPret')}</Link>
                <Link to="/assurance-prevoyance" className="inline-block text-xs font-medium px-3 py-1.5 rounded-full bg-background border border-border/60 text-muted-foreground hover:text-primary hover:border-primary/40 hover:bg-primary/5 transition-colors">{t('seoContent.linkPrevoyance')}</Link>
              </div>
            </div>

            {/* Professionnels */}
            <div className="bg-muted/40 border border-border/40 p-4 md:p-5">
              <div className="flex items-center gap-2 mb-3">
                <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10 text-primary">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="14" x="2" y="7" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>
                </span>
                <h4 className="text-sm font-semibold text-foreground">Professionnels & Propriétaires</h4>
              </div>
              <div className="flex flex-wrap gap-1.5">
                <Link to="/assurance-rc-pro" className="inline-block text-xs font-medium px-3 py-1.5 rounded-full bg-background border border-border/60 text-muted-foreground hover:text-primary hover:border-primary/40 hover:bg-primary/5 transition-colors">{t('seoContent.linkRCPro')}</Link>
                <Link to="/assurance-mrp" className="inline-block text-xs font-medium px-3 py-1.5 rounded-full bg-background border border-border/60 text-muted-foreground hover:text-primary hover:border-primary/40 hover:bg-primary/5 transition-colors">Assurance MRP</Link>
                <Link to="/assurance-pno" className="inline-block text-xs font-medium px-3 py-1.5 rounded-full bg-background border border-border/60 text-muted-foreground hover:text-primary hover:border-primary/40 hover:bg-primary/5 transition-colors">Assurance PNO</Link>
                <Link to="/assurance-gli" className="inline-block text-xs font-medium px-3 py-1.5 rounded-full bg-background border border-border/60 text-muted-foreground hover:text-primary hover:border-primary/40 hover:bg-primary/5 transition-colors">Garantie Loyers Impayés</Link>
              </div>
            </div>

            {/* Profils Spéciaux */}
            <div className="bg-muted/40 border border-border/40 p-4 md:p-5">
              <div className="flex items-center gap-2 mb-3">
                <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-accent/10 text-accent">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"/></svg>
                </span>
                <h4 className="text-sm font-semibold text-foreground">Profils Spéciaux</h4>
              </div>
              <div className="flex flex-wrap gap-1.5">
                <Link to="/profil/resilie-non-paiement" className="inline-block text-xs font-medium px-3 py-1.5 rounded-full bg-background border border-border/60 text-muted-foreground hover:text-primary hover:border-primary/40 hover:bg-primary/5 transition-colors">Résilié pour non-paiement</Link>
                <Link to="/profil/retrait-permis" className="inline-block text-xs font-medium px-3 py-1.5 rounded-full bg-background border border-border/60 text-muted-foreground hover:text-primary hover:border-primary/40 hover:bg-primary/5 transition-colors">Retrait de permis</Link>
                <Link to="/profil/frequence-sinistres" className="inline-block text-xs font-medium px-3 py-1.5 rounded-full bg-background border border-border/60 text-muted-foreground hover:text-primary hover:border-primary/40 hover:bg-primary/5 transition-colors">Multi-sinistré (3+)</Link>
                <Link to="/profil/sans-antecedents" className="inline-block text-xs font-medium px-3 py-1.5 rounded-full bg-background border border-border/60 text-muted-foreground hover:text-primary hover:border-primary/40 hover:bg-primary/5 transition-colors">Sans antécédents</Link>
                <Link to="/profil/jeune-conducteur-voiture-puissante" className="inline-block text-xs font-medium px-3 py-1.5 rounded-full bg-background border border-border/60 text-muted-foreground hover:text-primary hover:border-primary/40 hover:bg-primary/5 transition-colors">Jeune + voiture puissante</Link>
                <Link to="/profil" className="inline-block text-xs font-medium px-3 py-1.5 rounded-full bg-primary/10 border border-primary/30 text-primary hover:bg-primary/20 transition-colors">Tous les profils →</Link>
              </div>
            </div>

            {/* Comparatifs & SEO */}
            <div className="bg-muted/40 border border-border/40 p-4 md:p-5">
              <div className="flex items-center gap-2 mb-3">
                <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10 text-primary">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 3h5v5"/><path d="M8 3H3v5"/><path d="M12 22v-8.3a4 4 0 0 0-1.172-2.872L3 3"/><path d="m15 9 6-6"/></svg>
                </span>
                <h4 className="text-sm font-semibold text-foreground">Comparatifs Assureurs</h4>
              </div>
              <div className="flex flex-wrap gap-1.5">
                <Link to="/comparatif/maif-vs-macif" className="inline-block text-xs font-medium px-3 py-1.5 rounded-full bg-background border border-border/60 text-muted-foreground hover:text-primary hover:border-primary/40 hover:bg-primary/5 transition-colors">MAIF vs Macif</Link>
                <Link to="/comparatif/axa-vs-allianz" className="inline-block text-xs font-medium px-3 py-1.5 rounded-full bg-background border border-border/60 text-muted-foreground hover:text-primary hover:border-primary/40 hover:bg-primary/5 transition-colors">AXA vs Allianz</Link>
                <Link to="/comparatif/direct-assurance-vs-l-olivier" className="inline-block text-xs font-medium px-3 py-1.5 rounded-full bg-background border border-border/60 text-muted-foreground hover:text-primary hover:border-primary/40 hover:bg-primary/5 transition-colors">Direct Assurance vs L'Olivier</Link>
                <Link to="/comparatif/luko-vs-alan" className="inline-block text-xs font-medium px-3 py-1.5 rounded-full bg-background border border-border/60 text-muted-foreground hover:text-primary hover:border-primary/40 hover:bg-primary/5 transition-colors">Luko vs Alan</Link>
                <Link to="/comparatif" className="inline-block text-xs font-medium px-3 py-1.5 rounded-full bg-primary/10 border border-primary/30 text-primary hover:bg-primary/20 transition-colors">Tous les comparatifs →</Link>
              </div>
            </div>

            {/* Pages Spécialisées */}
            <div className="bg-muted/40 border border-border/40 p-4 md:p-5">
              <div className="flex items-center gap-2 mb-3">
                <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-accent/10 text-accent">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H19a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H6.5a1 1 0 0 1 0-5H20"/></svg>
                </span>
                <h4 className="text-sm font-semibold text-foreground">Pages Spécialisées</h4>
              </div>
              <div className="flex flex-wrap gap-1.5">
                <Link to="/assurance-auto-malus" className="inline-block text-xs font-medium px-3 py-1.5 rounded-full bg-background border border-border/60 text-muted-foreground hover:text-primary hover:border-primary/40 hover:bg-primary/5 transition-colors">Assurance auto malussé</Link>
                <Link to="/assurance-auto-jeune-conducteur" className="inline-block text-xs font-medium px-3 py-1.5 rounded-full bg-background border border-border/60 text-muted-foreground hover:text-primary hover:border-primary/40 hover:bg-primary/5 transition-colors">Jeune conducteur</Link>
                <Link to="/assurance-trottinette-electrique" className="inline-block text-xs font-medium px-3 py-1.5 rounded-full bg-background border border-border/60 text-muted-foreground hover:text-primary hover:border-primary/40 hover:bg-primary/5 transition-colors">Trottinette électrique</Link>
                <Link to="/assurance-auto-permis-etranger" className="inline-block text-xs font-medium px-3 py-1.5 rounded-full bg-background border border-border/60 text-muted-foreground hover:text-primary hover:border-primary/40 hover:bg-primary/5 transition-colors">Permis étranger</Link>
                <Link to="/assurance-emprunteur" className="inline-block text-xs font-medium px-3 py-1.5 rounded-full bg-background border border-border/60 text-muted-foreground hover:text-primary hover:border-primary/40 hover:bg-primary/5 transition-colors">Assurance emprunteur</Link>
                <Link to="/mutuelle-tns" className="inline-block text-xs font-medium px-3 py-1.5 rounded-full bg-background border border-border/60 text-muted-foreground hover:text-primary hover:border-primary/40 hover:bg-primary/5 transition-colors">Mutuelle TNS</Link>
              </div>
            </div>

            {/* Outils & Ressources */}
            <div className="bg-muted/40 border border-border/40 p-4 md:p-5">
              <div className="flex items-center gap-2 mb-3">
                <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10 text-primary">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>
                </span>
                <h4 className="text-sm font-semibold text-foreground">Outils & Ressources</h4>
              </div>
              <div className="flex flex-wrap gap-1.5">
                <Link to="/comparateur" className="inline-block text-xs font-medium px-3 py-1.5 rounded-full bg-background border border-border/60 text-muted-foreground hover:text-primary hover:border-primary/40 hover:bg-primary/5 transition-colors">{t('seoContent.linkComparateur')}</Link>
                <Link to="/outils/calculateur-bonus-malus" className="inline-block text-xs font-medium px-3 py-1.5 rounded-full bg-background border border-border/60 text-muted-foreground hover:text-primary hover:border-primary/40 hover:bg-primary/5 transition-colors">Calculateur Bonus-Malus</Link>
                <Link to="/blog" className="inline-block text-xs font-medium px-3 py-1.5 rounded-full bg-background border border-border/60 text-muted-foreground hover:text-primary hover:border-primary/40 hover:bg-primary/5 transition-colors">{t('seoContent.linkBlog')}</Link>
                <Link to="/glossaire" className="inline-block text-xs font-medium px-3 py-1.5 rounded-full bg-background border border-border/60 text-muted-foreground hover:text-primary hover:border-primary/40 hover:bg-primary/5 transition-colors">{t('seoContent.linkGlossaire')}</Link>
                <Link to="/avis-clients" className="inline-block text-xs font-medium px-3 py-1.5 rounded-full bg-background border border-border/60 text-muted-foreground hover:text-primary hover:border-primary/40 hover:bg-primary/5 transition-colors">Avis clients</Link>
                <Link to="/nos-partenaires" className="inline-block text-xs font-medium px-3 py-1.5 rounded-full bg-background border border-border/60 text-muted-foreground hover:text-primary hover:border-primary/40 hover:bg-primary/5 transition-colors">Nos partenaires</Link>
                <Link to="/contact" className="inline-block text-xs font-medium px-3 py-1.5 rounded-full bg-background border border-border/60 text-muted-foreground hover:text-primary hover:border-primary/40 hover:bg-primary/5 transition-colors">Contact</Link>
                <Link to="/qui-sommes-nous" className="inline-block text-xs font-medium px-3 py-1.5 rounded-full bg-background border border-border/60 text-muted-foreground hover:text-primary hover:border-primary/40 hover:bg-primary/5 transition-colors">Qui sommes-nous ?</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SEOContent;
