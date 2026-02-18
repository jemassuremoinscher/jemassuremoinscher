import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { useCookieConsent } from "@/hooks/useCookieConsent";
import { addBreadcrumbSchema } from "@/utils/seoUtils";

const PolitiqueCookies = () => {
  const { resetConsent } = useCookieConsent();

  const breadcrumbSchema = addBreadcrumbSchema([
    { name: "Accueil", url: "https://www.jemassuremoinscher.fr/" },
    { name: "Politique de Cookies", url: "https://www.jemassuremoinscher.fr/politique-cookies" }
  ]);

  return (
    <div className="min-h-screen flex flex-col">
      <SEO
        title="Politique de Cookies - Gestion et Préférences | jemassuremoinscher"
        description="Consultez notre politique de cookies RGPD : types de cookies utilisés, gestion de vos préférences, durée de conservation. Contrôlez vos données personnelles."
        keywords="politique cookies, gestion cookies, RGPD, confidentialité, données personnelles"
        canonical="https://www.jemassuremoinscher.fr/politique-cookies"
        jsonLd={breadcrumbSchema}
      />
      <Header />
      
      <main className="flex-1 py-12 bg-gray-50">
        <div className="container mx-auto px-4 max-w-4xl">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">Politique de Cookies</h1>
          
          <div className="bg-white rounded-lg shadow-sm p-8 space-y-6">
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Qu'est-ce qu'un cookie ?</h2>
              <p className="text-gray-600 leading-relaxed">
                Un cookie est un petit fichier texte stocké sur votre ordinateur ou appareil mobile lorsque vous visitez notre site web. Les cookies nous permettent de reconnaître votre appareil et de mémoriser vos préférences.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Types de cookies utilisés</h2>
              
              <div className="space-y-4">
                <div className="border-l-4 border-primary pl-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">1. Cookies nécessaires</h3>
                  <p className="text-gray-600">
                    Ces cookies sont essentiels au fonctionnement du site. Ils permettent des fonctionnalités de base comme la navigation sur le site et l'accès aux zones sécurisées. Le site ne peut pas fonctionner correctement sans ces cookies.
                  </p>
                  <ul className="list-disc list-inside mt-2 text-gray-600 space-y-1">
                    <li>Mémorisation de vos préférences de cookies</li>
                    <li>Gestion de session utilisateur</li>
                    <li>Sécurité et prévention de la fraude</li>
                  </ul>
                </div>

                <div className="border-l-4 border-blue-500 pl-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">2. Cookies analytiques</h3>
                  <p className="text-gray-600">
                    Ces cookies nous aident à comprendre comment les visiteurs interagissent avec notre site web en collectant et rapportant des informations de manière anonyme.
                  </p>
                  <ul className="list-disc list-inside mt-2 text-gray-600 space-y-1">
                    <li>Analyse du trafic et des pages visitées</li>
                    <li>Temps passé sur chaque page</li>
                    <li>Parcours utilisateur sur le site</li>
                  </ul>
                </div>

                <div className="border-l-4 border-green-500 pl-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">3. Cookies marketing</h3>
                  <p className="text-gray-600">
                    Ces cookies sont utilisés pour suivre les visiteurs sur différents sites web. Le but est d'afficher des publicités pertinentes et engageantes pour l'utilisateur individuel.
                  </p>
                  <ul className="list-disc list-inside mt-2 text-gray-600 space-y-1">
                    <li>Personnalisation des annonces</li>
                    <li>Mesure de l'efficacité des campagnes</li>
                    <li>Reciblage publicitaire</li>
                  </ul>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Gestion de vos préférences</h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                Vous pouvez à tout moment modifier vos préférences de cookies en cliquant sur le bouton ci-dessous. Notez que le blocage de certains types de cookies peut avoir un impact sur votre expérience sur notre site.
              </p>
              <Button
                onClick={resetConsent}
                className="bg-primary hover:bg-primary/90"
              >
                Gérer mes préférences de cookies
              </Button>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Durée de conservation</h2>
              <p className="text-gray-600 leading-relaxed">
                Les cookies ont différentes durées de vie :
              </p>
              <ul className="list-disc list-inside mt-2 text-gray-600 space-y-1">
                <li><strong>Cookies de session :</strong> Supprimés automatiquement lorsque vous fermez votre navigateur</li>
                <li><strong>Cookies persistants :</strong> Restent sur votre appareil jusqu'à leur date d'expiration ou jusqu'à ce que vous les supprimiez</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Vos droits</h2>
              <p className="text-gray-600 leading-relaxed">
                Conformément au RGPD, vous disposez des droits suivants :
              </p>
              <ul className="list-disc list-inside mt-2 text-gray-600 space-y-1">
                <li>Droit d'accès à vos données personnelles</li>
                <li>Droit de rectification de vos données</li>
                <li>Droit à l'effacement de vos données</li>
                <li>Droit à la limitation du traitement</li>
                <li>Droit d'opposition au traitement</li>
                <li>Droit à la portabilité de vos données</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Contact</h2>
              <p className="text-gray-600 leading-relaxed">
                Pour toute question concernant notre politique de cookies ou pour exercer vos droits, vous pouvez nous contacter à l'adresse : <a href="mailto:contact@jemassuremoinscher.fr" className="text-primary hover:underline">contact@jemassuremoinscher.fr</a>
              </p>
            </section>

            <section className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">
                <strong>Dernière mise à jour :</strong> {new Date().toLocaleDateString('fr-FR')}
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
