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
        title="Mentions Légales - jemassuremoinscher.fr"
        description="Mentions légales et informations juridiques de jemassuremoinscher.fr." />
      
      
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
                  <p><strong>{t('mentionsLegales.raisonSociale')}</strong> jemassuremoinscher.fr</p>
                  <p><strong>{t('mentionsLegales.formeJuridique')}</strong> {t('mentionsLegales.formeJuridiqueVal')}</p>
                  <p><strong>{t('mentionsLegales.capital')}</strong> 10 000 €</p>
                  <p><strong>{t('mentionsLegales.siege')}</strong> 2, rue d'Angleterre 06000 Nice</p>
                  <p><strong>{t('mentionsLegales.rcs')}</strong> {t('mentionsLegales.rcsVal')}</p>
                  <p><strong>{t('mentionsLegales.siret')}</strong> {t('mentionsLegales.siretVal')}</p>
                  <p><strong>{t('mentionsLegales.email')}</strong> contact@jemassuremoinscher.fr</p>
                  <p><strong>{t('mentionsLegales.telephone')}</strong> 04 93 88 16 84</p>
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

              <Card>
                <CardHeader>
                  <CardTitle>Notre engagement envers vous</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p>
                    En tant que courtier, votre satisfaction est notre priorité. Si malgré nos efforts, vous estimez que notre service ne vous a pas donné entière satisfaction, nous mettons à votre disposition une procédure simple et gratuite pour nous faire part de votre mécontentement.
                  </p>

                  <div>
                    <h3 className="font-semibold text-foreground mb-2">1. Comment nous contacter ?</h3>
                    <p className="mb-2">Pour toute réclamation, vous pouvez contacter notre service dédié :</p>
                    <ul className="list-disc list-inside space-y-1 ml-2">
                      <li><strong>Par email :</strong> contact@jemassuremoinscher.fr</li>
                      <li><strong>Par courrier :</strong> 2, rue d'Angleterre 06000 Nice</li>
                      <li><strong>Par téléphone :</strong> 04 93 88 16 84</li>
                    </ul>
                    <p className="mt-2">
                      Nous nous engageons à accuser réception de votre réclamation sous 10 jours ouvrables et à vous apporter une réponse définitive sous un délai maximum de 2 mois.
                    </p>
                  </div>

                  <div>
                    <h3 className="font-semibold text-foreground mb-2">2. Le Médiateur de l'Assurance</h3>
                    <p>
                      Si la réponse apportée ne vous satisfait pas, ou si le délai de 2 mois est dépassé, vous avez le droit de saisir gratuitement le Médiateur de l'Assurance (indépendamment de notre cabinet). C'est une autorité neutre qui aide à résoudre les litiges à l'amiable.
                    </p>
                    <ul className="list-disc list-inside space-y-1 ml-2 mt-2">
                      <li><strong>En ligne :</strong>{' '}
                        <a href="https://www.mediation-assurance.org" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">www.mediation-assurance.org</a>
                      </li>
                      <li><strong>Par courrier :</strong> LMA, TSA 50110, 75441 Paris Cedex 09</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="font-semibold text-foreground mb-2">3. Autorité de contrôle</h3>
                    <p>
                      En tant que courtier, notre activité est placée sous le contrôle de l'<strong>ACPR</strong> (Autorité de Contrôle Prudentiel et de Résolution) : 4 Place de Budapest, CS 92459, 75436 Paris Cedex 09.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </>);

};

export default MentionsLegales;
