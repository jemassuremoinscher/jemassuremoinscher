import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SEOOptimized from '@/components/SEOOptimized';
import Breadcrumbs from '@/components/Breadcrumbs';
import { Link } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { MultiStepQuoteForm } from '@/components/forms/MultiStepQuoteForm';

const Comparateur = () => {
  const { t } = useLanguage();
  return (
    <>
       <SEOOptimized
        title="Comparateur d'Assurances — Comparez 70+ Assureurs"
        description="Comparez gratuitement plus de 70 assureurs auto, moto, habitation et santé. Économisez jusqu'à 40% sur votre assurance en 2 minutes."
        keyword="comparateur d'assurances"
        keywords="assurance moins chère, changer d'assurance, comparaison assurance gratuit"
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "SoftwareApplication",
          "name": "Comparateur d'Assurance Moins Chère",
          "operatingSystem": "All",
          "applicationCategory": "FinanceApplication",
          "offers": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "EUR"
          }
        }}
       />
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <Breadcrumbs items={[{ label: t('comparatorPage.breadcrumb') }]} />
        <main className="flex-1">
          <div className="container mx-auto px-4 py-10">
            <h1 className="sr-only">Comparateur d'assurances en ligne — Comparez 70+ assureurs gratuitement</h1>
            <div className="min-h-[480px]">
              <MultiStepQuoteForm insuranceType="comparateur" />
            </div>
          </div>

          {/* SEO Internal Links Section */}
          <section className="container mx-auto px-4 py-10">
            <h2 className="text-2xl font-bold text-foreground mb-6">{t('comparatorPage.compareByType')}</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              <Link to="/assurance-auto" className="text-primary hover:underline font-medium">{t('footer.autoInsurance')}</Link>
              <Link to="/assurance-moto" className="text-primary hover:underline font-medium">{t('footer.motoInsurance')}</Link>
              <Link to="/assurance-habitation" className="text-primary hover:underline font-medium">{t('footer.homeInsurance')}</Link>
              <Link to="/assurance-sante" className="text-primary hover:underline font-medium">{t('footer.healthInsurance')}</Link>
              <Link to="/assurance-pret" className="text-primary hover:underline font-medium">{t('footer.loanInsurance')}</Link>
              <Link to="/assurance-vie" className="text-primary hover:underline font-medium">{t('footer.lifeInsurance')}</Link>
              <Link to="/assurance-animaux" className="text-primary hover:underline font-medium">{t('footer.petInsurance')}</Link>
              <Link to="/assurance-prevoyance" className="text-primary hover:underline font-medium">{t('footer.prevoyanceInsurance')}</Link>
              <Link to="/assurance-rc-pro" className="text-primary hover:underline font-medium">{t('footer.rcProInsurance')}</Link>
              <Link to="/assurance-mrp" className="text-primary hover:underline font-medium">{t('footer.mrpInsurance')}</Link>
              <Link to="/assurance-pno" className="text-primary hover:underline font-medium">{t('footer.pnoInsurance')}</Link>
              <Link to="/assurance-gli" className="text-primary hover:underline font-medium">{t('footer.gliInsurance')}</Link>
            </div>

            <h2 className="text-2xl font-bold text-foreground mt-10 mb-6">{t('comparatorPage.usefulResources')}</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <Link to="/blog" className="text-primary hover:underline font-medium">{t('comparatorPage.blogGuides')}</Link>
              <Link to="/contact" className="text-primary hover:underline font-medium">{t('comparatorPage.contactUs')}</Link>
              <Link to="/nos-partenaires" className="text-primary hover:underline font-medium">{t('footer.ourPartners')}</Link>
              <Link to="/avis-clients" className="text-primary hover:underline font-medium">{t('comparatorPage.customerReviews')}</Link>
              <Link to="/qui-sommes-nous" className="text-primary hover:underline font-medium">{t('footer.whoAreWe')}</Link>
              <Link to="/glossaire" className="text-primary hover:underline font-medium">{t('footer.glossary')}</Link>
            </div>

            <div className="mt-10 prose prose-sm max-w-none text-muted-foreground">
              <h3 className="text-lg font-semibold text-foreground">{t('comparatorPage.howItWorksTitle')}</h3>
              <p>{t('comparatorPage.howItWorksDesc')}</p>
            </div>
          </section>
        </main>
        <Footer />
      </div>
    </>
  );
};

export default Comparateur;
