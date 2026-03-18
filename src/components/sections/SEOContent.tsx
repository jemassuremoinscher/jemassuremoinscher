import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";

const SEOContent = () => {
  const { t } = useLanguage();

  return (
    <section className="py-12 md:py-16 bg-background border-t border-border/30 section-lazy">
      <div className="container mx-auto px-4 max-w-4xl">
        <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-6">
          {t('seoContent.title')}
        </h2>
        
        <div className="prose prose-sm md:prose-base max-w-none text-muted-foreground space-y-4">
          <p>
            {t('seoContent.p1')}{' '}
            Consultez notre <Link to="/blog" className="text-primary hover:underline font-medium">blog assurance</Link> pour
            des guides détaillés sur chaque type de contrat, ou explorez
            le <Link to="/glossaire" className="text-primary hover:underline font-medium">glossaire de l'assurance</Link> pour
            comprendre les termes techniques. Vous pouvez aussi <Link to="/comparatif" className="text-primary hover:underline font-medium">comparer les assureurs face à face</Link> dans nos duels détaillés.
          </p>
          <p>{t('seoContent.p2')}</p>
          
          <h3 className="text-lg md:text-xl font-semibold text-foreground mt-8 mb-3">
            {t('seoContent.h3_1')}
          </h3>
          <p>
            {t('seoContent.p3')}{' '}
            Utilisez notre <Link to="/outils/calculateur-bonus-malus" className="text-primary hover:underline font-medium">calculateur de bonus-malus</Link> pour
            estimer votre coefficient avant de comparer. Pour les profils atypiques (résilié, malussé, retrait de permis), consultez nos <Link to="/profil" className="text-primary hover:underline font-medium">solutions profils spéciaux</Link>.
          </p>
          
          <h3 className="text-lg md:text-xl font-semibold text-foreground mt-8 mb-3">
            {t('seoContent.h3_2')}
          </h3>
          <p>{t('seoContent.p4')}</p>
          
          <h3 className="text-lg md:text-xl font-semibold text-foreground mt-8 mb-3">
            {t('seoContent.h3_3')}
          </h3>
          <p>
            {t('seoContent.p5')}{' '}
            Découvrez les <Link to="/avis-clients" className="text-primary hover:underline font-medium">avis de nos clients</Link> et
            ce que disent nos <Link to="/nos-partenaires" className="text-primary hover:underline font-medium">50+ assureurs partenaires</Link>.
          </p>

          {/* Internal links for SEO - All insurance products */}
          <div className="mt-8 pt-6 border-t border-border/30">
            <h3 className="text-lg font-semibold text-foreground mb-4">
              {t('seoContent.linksTitle')}
            </h3>

            <h4 className="text-sm font-medium text-foreground mb-2">Assurances Particuliers</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-4">
              <Link to="/assurance-auto" className="text-primary hover:underline text-sm">{t('seoContent.linkAuto')}</Link>
              <Link to="/assurance-moto" className="text-primary hover:underline text-sm">{t('seoContent.linkMoto')}</Link>
              <Link to="/assurance-habitation" className="text-primary hover:underline text-sm">{t('seoContent.linkHabitation')}</Link>
              <Link to="/assurance-sante" className="text-primary hover:underline text-sm">{t('seoContent.linkSante')}</Link>
              <Link to="/assurance-animaux" className="text-primary hover:underline text-sm">{t('seoContent.linkAnimaux')}</Link>
              <Link to="/assurance-vie" className="text-primary hover:underline text-sm">{t('seoContent.linkVie')}</Link>
              <Link to="/assurance-pret" className="text-primary hover:underline text-sm">{t('seoContent.linkPret')}</Link>
              <Link to="/assurance-prevoyance" className="text-primary hover:underline text-sm">{t('seoContent.linkPrevoyance')}</Link>
            </div>

            <h4 className="text-sm font-medium text-foreground mb-2">Assurances Professionnels & Propriétaires</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-4">
              <Link to="/assurance-rc-pro" className="text-primary hover:underline text-sm">{t('seoContent.linkRCPro')}</Link>
              <Link to="/assurance-mrp" className="text-primary hover:underline text-sm">Assurance MRP</Link>
              <Link to="/assurance-pno" className="text-primary hover:underline text-sm">Assurance PNO</Link>
              <Link to="/assurance-gli" className="text-primary hover:underline text-sm">Garantie Loyers Impayés</Link>
            </div>

            <h4 className="text-sm font-medium text-foreground mb-2">Profils Spéciaux — Solutions Dédiées</h4>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mb-4">
              <Link to="/profil/resilie-non-paiement" className="text-primary hover:underline text-sm">Résilié pour non-paiement</Link>
              <Link to="/profil/retrait-permis" className="text-primary hover:underline text-sm">Retrait de permis</Link>
              <Link to="/profil/frequence-sinistres" className="text-primary hover:underline text-sm">Multi-sinistré (3+)</Link>
              <Link to="/profil/sans-antecedents" className="text-primary hover:underline text-sm">Sans antécédents</Link>
              <Link to="/profil/jeune-conducteur-voiture-puissante" className="text-primary hover:underline text-sm">Jeune + voiture puissante</Link>
              <Link to="/profil" className="text-primary hover:underline text-sm">Tous les profils spéciaux →</Link>
            </div>

            <h4 className="text-sm font-medium text-foreground mb-2">Comparatifs Assureurs</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-4">
              <Link to="/comparatif/maif-vs-macif" className="text-primary hover:underline text-sm">MAIF vs Macif</Link>
              <Link to="/comparatif/axa-vs-allianz" className="text-primary hover:underline text-sm">AXA vs Allianz</Link>
              <Link to="/comparatif/direct-assurance-vs-l-olivier" className="text-primary hover:underline text-sm">Direct Assurance vs L'Olivier</Link>
              <Link to="/comparatif/luko-vs-alan" className="text-primary hover:underline text-sm">Luko vs Alan</Link>
              <Link to="/comparatif" className="text-primary hover:underline text-sm">Tous les comparatifs →</Link>
            </div>

            <h4 className="text-sm font-medium text-foreground mb-2">Pages SEO Spécialisées</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-4">
              <Link to="/assurance-auto-malusse" className="text-primary hover:underline text-sm">Assurance auto malussé</Link>
              <Link to="/assurance-auto-jeune-conducteur" className="text-primary hover:underline text-sm">Jeune conducteur</Link>
              <Link to="/assurance-trottinette-electrique" className="text-primary hover:underline text-sm">Trottinette électrique</Link>
              <Link to="/assurance-auto-permis-etranger" className="text-primary hover:underline text-sm">Permis étranger</Link>
              <Link to="/assurance-emprunteur" className="text-primary hover:underline text-sm">Assurance emprunteur</Link>
              <Link to="/mutuelle-tns" className="text-primary hover:underline text-sm">Mutuelle TNS</Link>
            </div>

            <h4 className="text-sm font-medium text-foreground mb-2">Outils & Ressources</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              <Link to="/comparateur" className="text-primary hover:underline text-sm">{t('seoContent.linkComparateur')}</Link>
              <Link to="/outils/calculateur-bonus-malus" className="text-primary hover:underline text-sm">Calculateur Bonus-Malus</Link>
              <Link to="/blog" className="text-primary hover:underline text-sm">{t('seoContent.linkBlog')}</Link>
              <Link to="/glossaire" className="text-primary hover:underline text-sm">{t('seoContent.linkGlossaire')}</Link>
              <Link to="/avis-clients" className="text-primary hover:underline text-sm">Avis clients</Link>
              <Link to="/nos-partenaires" className="text-primary hover:underline text-sm">Nos partenaires</Link>
              <Link to="/contact" className="text-primary hover:underline text-sm">Contact</Link>
              <Link to="/qui-sommes-nous" className="text-primary hover:underline text-sm">Qui sommes-nous</Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SEOContent;
