import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEOOptimized from "@/components/SEOOptimized";
import { Button } from "@/components/ui/button";
import { useCookieConsent } from "@/hooks/useCookieConsent";
import { addBreadcrumbSchema } from "@/utils/seoUtils";
import { useLanguage } from "@/contexts/LanguageContext";

const PolitiqueCookies = () => {
  const { resetConsent } = useCookieConsent();
  const { t, language } = useLanguage();

  const breadcrumbSchema = addBreadcrumbSchema([
    { name: "Accueil", url: "https://www.jemassuremoinscher.fr/" },
    { name: "Politique de Cookies", url: "https://www.jemassuremoinscher.fr/politique-cookies" }
  ]);

  return (
    <div className="min-h-screen flex flex-col">
      <SEOOptimized
        title="Politique de Cookies | jemassuremoinscher.fr"
        description="Politique de cookies RGPD : types, gestion, préférences. Contrôlez vos données."
        canonical="https://www.jemassuremoinscher.fr/politique-cookies"
        jsonLd={breadcrumbSchema}
        noindex
      />
      <Header />
      
      <main className="flex-1 py-12 bg-gray-50">
        <div className="container mx-auto px-4 max-w-4xl">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">{t('cookiePolicy.title')}</h1>
          
          <div className="bg-white rounded-lg shadow-sm p-8 space-y-6">
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">{t('cookiePolicy.whatIs')}</h2>
              <p className="text-gray-600 leading-relaxed">{t('cookiePolicy.whatIsDesc')}</p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">{t('cookiePolicy.types')}</h2>
              <div className="space-y-4">
                <div className="border-l-4 border-primary pl-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{t('cookiePolicy.necessary.title')}</h3>
                  <p className="text-gray-600">{t('cookiePolicy.necessary.desc')}</p>
                  <ul className="list-disc list-inside mt-2 text-gray-600 space-y-1">
                    <li>{t('cookiePolicy.necessary.li1')}</li>
                    <li>{t('cookiePolicy.necessary.li2')}</li>
                    <li>{t('cookiePolicy.necessary.li3')}</li>
                  </ul>
                </div>

                <div className="border-l-4 border-blue-500 pl-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{t('cookiePolicy.analytics.title')}</h3>
                  <p className="text-gray-600">{t('cookiePolicy.analytics.desc')}</p>
                  <ul className="list-disc list-inside mt-2 text-gray-600 space-y-1">
                    <li>{t('cookiePolicy.analytics.li1')}</li>
                    <li>{t('cookiePolicy.analytics.li2')}</li>
                    <li>{t('cookiePolicy.analytics.li3')}</li>
                  </ul>
                </div>

                <div className="border-l-4 border-green-500 pl-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{t('cookiePolicy.marketing.title')}</h3>
                  <p className="text-gray-600">{t('cookiePolicy.marketing.desc')}</p>
                  <ul className="list-disc list-inside mt-2 text-gray-600 space-y-1">
                    <li>{t('cookiePolicy.marketing.li1')}</li>
                    <li>{t('cookiePolicy.marketing.li2')}</li>
                    <li>{t('cookiePolicy.marketing.li3')}</li>
                  </ul>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">{t('cookiePolicy.manage')}</h2>
              <p className="text-gray-600 leading-relaxed mb-4">{t('cookiePolicy.manageDesc')}</p>
              <Button onClick={resetConsent} className="bg-primary hover:bg-primary/90">
                {t('cookiePolicy.manageBtn')}
              </Button>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">{t('cookiePolicy.duration')}</h2>
              <p className="text-gray-600 leading-relaxed">{t('cookiePolicy.durationDesc')}</p>
              <ul className="list-disc list-inside mt-2 text-gray-600 space-y-1">
                <li><strong>{t('cookiePolicy.session')}</strong> {t('cookiePolicy.sessionDesc')}</li>
                <li><strong>{t('cookiePolicy.persistent')}</strong> {t('cookiePolicy.persistentDesc')}</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">{t('cookiePolicy.rights')}</h2>
              <p className="text-gray-600 leading-relaxed">{t('cookiePolicy.rightsDesc')}</p>
              <ul className="list-disc list-inside mt-2 text-gray-600 space-y-1">
                <li>{t('cookiePolicy.right1')}</li>
                <li>{t('cookiePolicy.right2')}</li>
                <li>{t('cookiePolicy.right3')}</li>
                <li>{t('cookiePolicy.right4')}</li>
                <li>{t('cookiePolicy.right5')}</li>
                <li>{t('cookiePolicy.right6')}</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">{t('cookiePolicy.contact')}</h2>
              <p className="text-gray-600 leading-relaxed">
                {t('cookiePolicy.contactDesc')}{' '}
                <a href="mailto:contact@jemassuremoinscher.fr" className="text-primary hover:underline">contact@jemassuremoinscher.fr</a>
              </p>
            </section>

            <section className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">
                <strong>{t('cookiePolicy.lastUpdate')}</strong> {new Date().toLocaleDateString(language === 'fr' ? 'fr-FR' : 'en-GB')}
              </p>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default PolitiqueCookies;