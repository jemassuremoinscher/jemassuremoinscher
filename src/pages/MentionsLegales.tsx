import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SEOOptimized from '@/components/SEOOptimized';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';

const MentionsLegales = () => {
  const { t } = useLanguage();

  return (
    <>
      <SEOOptimized 
        title="Mentions Légales - jemassuremoinscher"
        description="Mentions légales et informations juridiques de jemassuremoinscher."
        noindex
      />
      
      <div className="min-h-screen flex flex-col">
        <Header />
        
        <main id="main-content" className="flex-grow bg-gray-50 py-12">
          <div className="container mx-auto px-4 max-w-4xl">
            <h1 className="text-4xl font-bold text-gray-900 mb-8">{t('mentionsLegales.title')}</h1>
            
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>{t('mentionsLegales.editeur')}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <p><strong>{t('mentionsLegales.raisonSociale')}</strong> jemassuremoinscher</p>
                  <p><strong>{t('mentionsLegales.formeJuridique')}</strong> {t('mentionsLegales.formeJuridiqueVal')}</p>
                  <p><strong>{t('mentionsLegales.capital')}</strong> 10 000 €</p>
                  <p><strong>{t('mentionsLegales.siege')}</strong> {t('mentionsLegales.siegeVal')}</p>
                  <p><strong>{t('mentionsLegales.rcs')}</strong> {t('mentionsLegales.rcsVal')}</p>
                  <p><strong>{t('mentionsLegales.siret')}</strong> {t('mentionsLegales.siretVal')}</p>
                  <p><strong>{t('mentionsLegales.email')}</strong> contact@jemassuremoinscher.fr</p>
                  <p><strong>{t('mentionsLegales.telephone')}</strong> {t('mentionsLegales.telephoneVal')}</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>{t('mentionsLegales.directeur')}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>{t('mentionsLegales.directeurNom')}</p>
                  <p>{t('mentionsLegales.directeurFonction')}</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>{t('mentionsLegales.hebergement')}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <p><strong>{t('mentionsLegales.hebergeur')}</strong> {t('mentionsLegales.hebergeurVal')}</p>
                  <p><strong>{t('mentionsLegales.hebergeurAdresse')}</strong> {t('mentionsLegales.hebergeurAdresseVal')}</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>{t('mentionsLegales.activite')}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>{t('mentionsLegales.activiteDesc')}</p>
                  <p className="mt-2">{t('mentionsLegales.activiteDesc2')}</p>
                  <p className="mt-2">
                    <strong>{t('mentionsLegales.orias')}</strong> {t('mentionsLegales.oriasVal')}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>{t('mentionsLegales.propriete')}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>{t('mentionsLegales.proprieteDesc')}</p>
                  <p className="mt-2">{t('mentionsLegales.proprieteDesc2')}</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>{t('mentionsLegales.cookies')}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>
                    {t('mentionsLegales.cookiesDesc')}{' '}
                    <a href="/politique-cookies" className="text-primary hover:underline">{t('mentionsLegales.cookiesLink1')}</a>
                    {' '}{t('mentionsLegales.and')}{' '}
                    <a href="/politique-confidentialite" className="text-primary hover:underline">{t('mentionsLegales.cookiesLink2')}</a>.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>{t('mentionsLegales.responsabilite')}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>{t('mentionsLegales.responsabiliteDesc')}</p>
                  <p className="mt-2">{t('mentionsLegales.responsabiliteDesc2')}</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>{t('mentionsLegales.mediation')}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>{t('mentionsLegales.mediationDesc')}</p>
                  <p className="mt-2">{t('mentionsLegales.mediationDesc2')}</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default MentionsLegales;