import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";

const SEOContent = () => {
  const { t } = useLanguage();

  return (
    <section className="py-12 md:py-16 bg-background border-t border-border/30">
      <div className="container mx-auto px-4 max-w-4xl">
        <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-6">
          {t('seoContent.title')}
        </h2>
        
        <div className="prose prose-sm md:prose-base max-w-none text-muted-foreground space-y-4">
          <p>{t('seoContent.p1')}</p>
          <p>{t('seoContent.p2')}</p>
          
          <h3 className="text-lg md:text-xl font-semibold text-foreground mt-8 mb-3">
            {t('seoContent.h3_1')}
          </h3>
          <p>{t('seoContent.p3')}</p>
          
          <h3 className="text-lg md:text-xl font-semibold text-foreground mt-8 mb-3">
            {t('seoContent.h3_2')}
          </h3>
          <p>{t('seoContent.p4')}</p>
          
          <h3 className="text-lg md:text-xl font-semibold text-foreground mt-8 mb-3">
            {t('seoContent.h3_3')}
          </h3>
          <p>{t('seoContent.p5')}</p>

          {/* Internal links for SEO */}
          <div className="mt-8 pt-6 border-t border-border/30">
            <h3 className="text-lg font-semibold text-foreground mb-4">
              {t('seoContent.linksTitle')}
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              <Link to="/assurance-auto" className="text-primary hover:underline text-sm">{t('seoContent.linkAuto')}</Link>
              <Link to="/assurance-sante" className="text-primary hover:underline text-sm">{t('seoContent.linkSante')}</Link>
              <Link to="/assurance-habitation" className="text-primary hover:underline text-sm">{t('seoContent.linkHabitation')}</Link>
              <Link to="/assurance-moto" className="text-primary hover:underline text-sm">{t('seoContent.linkMoto')}</Link>
              <Link to="/assurance-animaux" className="text-primary hover:underline text-sm">{t('seoContent.linkAnimaux')}</Link>
              <Link to="/assurance-vie" className="text-primary hover:underline text-sm">{t('seoContent.linkVie')}</Link>
              <Link to="/assurance-pret" className="text-primary hover:underline text-sm">{t('seoContent.linkPret')}</Link>
              <Link to="/assurance-prevoyance" className="text-primary hover:underline text-sm">{t('seoContent.linkPrevoyance')}</Link>
              <Link to="/assurance-rc-pro" className="text-primary hover:underline text-sm">{t('seoContent.linkRCPro')}</Link>
              <Link to="/comparateur" className="text-primary hover:underline text-sm">{t('seoContent.linkComparateur')}</Link>
              <Link to="/blog" className="text-primary hover:underline text-sm">{t('seoContent.linkBlog')}</Link>
              <Link to="/glossaire" className="text-primary hover:underline text-sm">{t('seoContent.linkGlossaire')}</Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SEOContent;
