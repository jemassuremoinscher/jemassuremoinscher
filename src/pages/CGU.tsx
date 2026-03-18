import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SEOOptimized from '@/components/SEOOptimized';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';

const CGU = () => {
  const { t, language } = useLanguage();

  return (
    <>
      <SEOOptimized 
        title="CGU - jemassuremoinscher.fr"
        description="Conditions générales d'utilisation du service jemassuremoinscher.fr."
        noindex
      />
      
      <div className="min-h-screen flex flex-col">
        <Header />
        
        <main id="main-content" className="flex-grow bg-gray-50 py-12">
          <div className="container mx-auto px-4 max-w-4xl">
            <h1 className="text-4xl font-bold text-gray-900 mb-8">{t('cgu.title')}</h1>
            
            <p className="text-muted-foreground mb-6">{t('cgu.lastUpdate')} {new Date().toLocaleDateString(language === 'fr' ? 'fr-FR' : 'en-GB')}</p>
            
            <div className="space-y-6">
              <Card>
                <CardHeader><CardTitle>{t('cgu.s1.title')}</CardTitle></CardHeader>
                <CardContent>
                  <p>{t('cgu.s1.p1')}</p>
                  <p className="mt-2">{t('cgu.s1.p2')}</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader><CardTitle>{t('cgu.s2.title')}</CardTitle></CardHeader>
                <CardContent>
                  <p>{t('cgu.s2.p1')}</p>
                  <p className="mt-2">{t('cgu.s2.p2')}</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader><CardTitle>{t('cgu.s3.title')}</CardTitle></CardHeader>
                <CardContent>
                  <p>{t('cgu.s3.p1')}</p>
                  <p className="mt-2"><strong>{t('cgu.s3.p2')}</strong></p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader><CardTitle>{t('cgu.s4.title')}</CardTitle></CardHeader>
                <CardContent>
                  <p>{t('cgu.s4.p1')}</p>
                  <ul className="list-disc pl-6 mt-2 space-y-1">
                    <li>{t('cgu.s4.li1')}</li>
                    <li>{t('cgu.s4.li2')}</li>
                    <li>{t('cgu.s4.li3')}</li>
                    <li>{t('cgu.s4.li4')}</li>
                    <li>{t('cgu.s4.li5')}</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader><CardTitle>{t('cgu.s5.title')}</CardTitle></CardHeader>
                <CardContent>
                  <p>{t('cgu.s5.p1')}</p>
                  <p className="mt-2">
                    {t('cgu.s5.p2')}{' '}
                    <a href="/politique-confidentialite" className="text-primary hover:underline">{t('cgu.s5.link')}</a>.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader><CardTitle>{t('cgu.s6.title')}</CardTitle></CardHeader>
                <CardContent>
                  <p>{t('cgu.s6.p1')}</p>
                  <p className="mt-2">{t('cgu.s6.p2')}</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader><CardTitle>{t('cgu.s7.title')}</CardTitle></CardHeader>
                <CardContent>
                  <p>{t('cgu.s7.p1')}</p>
                  <ul className="list-disc pl-6 mt-2 space-y-1">
                    <li>{t('cgu.s7.li1')}</li>
                    <li>{t('cgu.s7.li2')}</li>
                    <li>{t('cgu.s7.li3')}</li>
                    <li>{t('cgu.s7.li4')}</li>
                    <li>{t('cgu.s7.li5')}</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader><CardTitle>{t('cgu.s8.title')}</CardTitle></CardHeader>
                <CardContent><p>{t('cgu.s8.p1')}</p></CardContent>
              </Card>

              <Card>
                <CardHeader><CardTitle>{t('cgu.s9.title')}</CardTitle></CardHeader>
                <CardContent>
                  <p>{t('cgu.s9.p1')}</p>
                  <p className="mt-2">{t('cgu.s9.p2')}</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader><CardTitle>{t('cgu.s10.title')}</CardTitle></CardHeader>
                <CardContent>
                  <p>{t('cgu.s10.p1')}</p>
                  <p className="mt-2">{t('cgu.s10.p2')}</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader><CardTitle>{t('cgu.s11.title')}</CardTitle></CardHeader>
                <CardContent>
                  <p>
                    {t('cgu.s11.p1')}{' '}
                    <a href="/contact" className="text-primary hover:underline">{t('cgu.s11.link')}</a>.
                  </p>
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

export default CGU;