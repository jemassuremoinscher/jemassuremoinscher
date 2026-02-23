import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SEOOptimized from '@/components/SEOOptimized';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, Lock, Eye, Database, UserCheck } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const PolitiqueConfidentialite = () => {
  const { t, language } = useLanguage();

  return (
    <>
      <SEOOptimized 
        title="Politique de Confidentialité - jemassuremoinscher"
        description="Politique de confidentialité et protection des données personnelles."
        noindex
      />
      
      <div className="min-h-screen flex flex-col">
        <Header />
        
        <main id="main-content" className="flex-grow bg-gray-50 py-12">
          <div className="container mx-auto px-4 max-w-4xl">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                <Shield className="h-8 w-8 text-primary" />
              </div>
              <h1 className="text-4xl font-bold text-gray-900 mb-4">{t('privacy.title')}</h1>
              <p className="text-muted-foreground">
                {t('privacy.lastUpdate')} {new Date().toLocaleDateString(language === 'fr' ? 'fr-FR' : 'en-GB')}
              </p>
            </div>
            
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Eye className="h-5 w-5 text-primary" />
                    {t('privacy.intro.title')}
                  </CardTitle>
                </CardHeader>
                <CardContent><p>{t('privacy.intro.p1')}</p></CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Database className="h-5 w-5 text-primary" />
                    {t('privacy.s1.title')}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <p><strong>{t('privacy.s1.responsable')}</strong> jemassuremoinscher</p>
                  <p><strong>{t('privacy.s1.adresse')}</strong> {t('privacy.s1.adresseVal')}</p>
                  <p><strong>{t('privacy.s1.email')}</strong> contact@jemassuremoinscher.fr</p>
                  <p><strong>{t('privacy.s1.dpo')}</strong> {t('privacy.s1.dpoVal')}</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader><CardTitle>{t('privacy.s2.title')}</CardTitle></CardHeader>
                <CardContent>
                  <p className="font-semibold mb-2">{t('privacy.s2.intro')}</p>
                  <div className="space-y-3">
                    <div>
                      <p className="font-semibold text-sm">{t('privacy.s2.identification')}</p>
                      <ul className="list-disc pl-6 text-sm space-y-1">
                        <li>{t('privacy.s2.id1')}</li>
                        <li>{t('privacy.s2.id2')}</li>
                        <li>{t('privacy.s2.id3')}</li>
                        <li>{t('privacy.s2.id4')}</li>
                      </ul>
                    </div>
                    <div>
                      <p className="font-semibold text-sm">{t('privacy.s2.devis')}</p>
                      <ul className="list-disc pl-6 text-sm space-y-1">
                        <li>{t('privacy.s2.devis1')}</li>
                        <li>{t('privacy.s2.devis2')}</li>
                        <li>{t('privacy.s2.devis3')}</li>
                        <li>{t('privacy.s2.devis4')}</li>
                      </ul>
                    </div>
                    <div>
                      <p className="font-semibold text-sm">{t('privacy.s2.navigation')}</p>
                      <ul className="list-disc pl-6 text-sm space-y-1">
                        <li>{t('privacy.s2.nav1')}</li>
                        <li>{t('privacy.s2.nav2')}</li>
                        <li>{t('privacy.s2.nav3')}</li>
                        <li>{t('privacy.s2.nav4')}</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader><CardTitle>{t('privacy.s3.title')}</CardTitle></CardHeader>
                <CardContent>
                  <p className="mb-2">{t('privacy.s3.intro')}</p>
                  <ul className="list-disc pl-6 space-y-1">
                    <li>{t('privacy.s3.li1')}</li>
                    <li>{t('privacy.s3.li2')}</li>
                    <li>{t('privacy.s3.li3')}</li>
                    <li>{t('privacy.s3.li4')}</li>
                    <li>{t('privacy.s3.li5')}</li>
                    <li>{t('privacy.s3.li6')}</li>
                    <li>{t('privacy.s3.li7')}</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader><CardTitle>{t('privacy.s4.title')}</CardTitle></CardHeader>
                <CardContent>
                  <p className="mb-2">{t('privacy.s4.intro')}</p>
                  <ul className="list-disc pl-6 space-y-1">
                    <li><strong>{t('privacy.s4.li1label')}</strong> {t('privacy.s4.li1')}</li>
                    <li><strong>{t('privacy.s4.li2label')}</strong> {t('privacy.s4.li2')}</li>
                    <li><strong>{t('privacy.s4.li3label')}</strong> {t('privacy.s4.li3')}</li>
                    <li><strong>{t('privacy.s4.li4label')}</strong> {t('privacy.s4.li4')}</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader><CardTitle>{t('privacy.s5.title')}</CardTitle></CardHeader>
                <CardContent>
                  <p className="mb-2">{t('privacy.s5.intro')}</p>
                  <ul className="list-disc pl-6 space-y-1">
                    <li>{t('privacy.s5.li1')}</li>
                    <li>{t('privacy.s5.li2')}</li>
                    <li>{t('privacy.s5.li3')}</li>
                  </ul>
                  <p className="mt-3 text-sm text-muted-foreground">{t('privacy.s5.note')}</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader><CardTitle>{t('privacy.s6.title')}</CardTitle></CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    <li><strong>{t('privacy.s6.li1label')}</strong> {t('privacy.s6.li1')}</li>
                    <li><strong>{t('privacy.s6.li2label')}</strong> {t('privacy.s6.li2')}</li>
                    <li><strong>{t('privacy.s6.li3label')}</strong> {t('privacy.s6.li3')}</li>
                    <li><strong>{t('privacy.s6.li4label')}</strong> {t('privacy.s6.li4')}</li>
                    <li><strong>{t('privacy.s6.li5label')}</strong> {t('privacy.s6.li5')}</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <UserCheck className="h-5 w-5 text-primary" />
                    {t('privacy.s7.title')}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="mb-2">{t('privacy.s7.intro')}</p>
                  <ul className="list-disc pl-6 space-y-1">
                    <li><strong>{t('privacy.s7.li1label')}</strong> {t('privacy.s7.li1')}</li>
                    <li><strong>{t('privacy.s7.li2label')}</strong> {t('privacy.s7.li2')}</li>
                    <li><strong>{t('privacy.s7.li3label')}</strong> {t('privacy.s7.li3')}</li>
                    <li><strong>{t('privacy.s7.li4label')}</strong> {t('privacy.s7.li4')}</li>
                    <li><strong>{t('privacy.s7.li5label')}</strong> {t('privacy.s7.li5')}</li>
                    <li><strong>{t('privacy.s7.li6label')}</strong> {t('privacy.s7.li6')}</li>
                    <li><strong>{t('privacy.s7.li7label')}</strong> {t('privacy.s7.li7')}</li>
                  </ul>
                  
                  <div className="mt-4 p-3 bg-primary/10 rounded-lg">
                    <p className="font-semibold text-sm">{t('privacy.s7.exercice')}</p>
                    <p className="text-sm mt-1">{t('privacy.s7.exerciceEmail')}</p>
                    <p className="text-sm">{t('privacy.s7.exerciceCourrier')}</p>
                  </div>

                  <p className="mt-3 text-sm text-muted-foreground">{t('privacy.s7.cnil')}</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Lock className="h-5 w-5 text-primary" />
                    {t('privacy.s8.title')}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="mb-2">{t('privacy.s8.intro')}</p>
                  <ul className="list-disc pl-6 space-y-1">
                    <li>{t('privacy.s8.li1')}</li>
                    <li>{t('privacy.s8.li2')}</li>
                    <li>{t('privacy.s8.li3')}</li>
                    <li>{t('privacy.s8.li4')}</li>
                    <li>{t('privacy.s8.li5')}</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader><CardTitle>{t('privacy.s9.title')}</CardTitle></CardHeader>
                <CardContent>
                  <p>
                    {t('privacy.s9.p1')}{' '}
                    <a href="/politique-cookies" className="text-primary hover:underline">{t('privacy.s9.link')}</a>.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader><CardTitle>{t('privacy.s10.title')}</CardTitle></CardHeader>
                <CardContent><p>{t('privacy.s10.p1')}</p></CardContent>
              </Card>

              <Card>
                <CardHeader><CardTitle>{t('privacy.s11.title')}</CardTitle></CardHeader>
                <CardContent><p>{t('privacy.s11.p1')}</p></CardContent>
              </Card>

              <Card>
                <CardHeader><CardTitle>{t('privacy.s12.title')}</CardTitle></CardHeader>
                <CardContent>
                  <p>{t('privacy.s12.p1')}</p>
                  <div className="mt-3 space-y-1">
                    <p><strong>{t('privacy.s12.email')}</strong> contact@jemassuremoinscher.fr</p>
                    <p><strong>{t('privacy.s12.dpo')}</strong> {t('privacy.s12.dpoVal')}</p>
                    <p><strong>{t('privacy.s12.contactPage')}</strong> <a href="/contact" className="text-primary hover:underline">{t('privacy.s12.contactLink')}</a></p>
                  </div>
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

export default PolitiqueConfidentialite;