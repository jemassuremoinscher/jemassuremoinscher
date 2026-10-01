import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEOOptimized from "@/components/SEOOptimized";
import { Button } from "@/components/ui/button";
import { useCookieConsent } from "@/hooks/useCookieConsent";
import { addBreadcrumbSchema } from "@/utils/seoUtils";
import { useLanguage } from "@/contexts/LanguageContext";

// Date de la dernière révision du texte (et non la date du jour).
const LAST_UPDATE = { fr: "2 octobre 2026", en: "2 October 2026" };

type Lang = "fr" | "en";
interface Tracker {
  name: string;
  provider: Record<Lang, string>;
  purpose: Record<Lang, string>;
  duration: Record<Lang, string>;
}

// Liste vérifiée le 2026-10-02 : code du site (stockage local et de session),
// loader analytics (scripts/analytics-loader.snippet.html), documentation
// Google (_ga, _ga_<id>, _gcl_au), script Clarity 0.8.70 (_clck 365 j,
// _clsk 1 j), documentation et script Meta (_fbc, _fbp : 90 j). Les cookies
// déposés par Google reCAPTCHA et sur les domaines Microsoft ont une durée
// fixée par ces éditeurs, non publiée par cookie dans leur documentation.
const TRACKERS: { category: "necessary" | "analytics" | "marketing"; items: Tracker[] }[] = [
  {
    category: "necessary",
    items: [
      {
        name: "cookie-consent",
        provider: { fr: "jemassuremoinscher.fr (stockage local)", en: "jemassuremoinscher.fr (local storage)" },
        purpose: { fr: "Mémorise votre choix de cookies", en: "Stores your cookie choice" },
        duration: { fr: "6 mois", en: "6 months" },
      },
      {
        name: "language",
        provider: { fr: "jemassuremoinscher.fr (stockage local)", en: "jemassuremoinscher.fr (local storage)" },
        purpose: { fr: "Mémorise la langue choisie, si vous en changez", en: "Stores the language you chose, if you change it" },
        duration: { fr: "Jusqu'à effacement dans votre navigateur", en: "Until you clear it in your browser" },
      },
      {
        name: "qfe_session_id",
        provider: { fr: "jemassuremoinscher.fr (stockage de session)", en: "jemassuremoinscher.fr (session storage)" },
        purpose: {
          fr: "Identifiant aléatoire pour mesurer les étapes du formulaire de devis (mesure interne, aucun outil tiers)",
          en: "Random identifier used to measure quote form steps (internal measurement, no third party)",
        },
        duration: { fr: "Jusqu'à la fermeture de l'onglet", en: "Until the tab is closed" },
      },
      {
        name: "chat-opened, exit_intent_lead_magnet_shown, google_reviews_failed_v1",
        provider: { fr: "jemassuremoinscher.fr (stockage de session)", en: "jemassuremoinscher.fr (session storage)" },
        purpose: {
          fr: "Évitent de réafficher une fenêtre déjà vue ou un bloc en échec",
          en: "Avoid showing again a window already seen or a failed block",
        },
        duration: { fr: "Jusqu'à la fermeture de l'onglet", en: "Until the tab is closed" },
      },
      {
        name: "Google reCAPTCHA v3",
        provider: { fr: "Google (google.com)", en: "Google (google.com)" },
        purpose: {
          fr: "Protection anti-spam, chargée uniquement à l'étape des coordonnées du formulaire de devis",
          en: "Anti-spam protection, loaded only at the contact details step of the quote form",
        },
        duration: { fr: "Fixée par Google", en: "Set by Google" },
      },
      {
        name: "sb-…-auth-token",
        provider: { fr: "jemassuremoinscher.fr (stockage local)", en: "jemassuremoinscher.fr (local storage)" },
        purpose: { fr: "Session de l'espace administrateur (collaborateurs uniquement)", en: "Admin area session (staff only)" },
        duration: { fr: "Jusqu'à la déconnexion", en: "Until sign-out" },
      },
    ],
  },
  {
    category: "analytics",
    items: [
      {
        name: "_ga",
        provider: { fr: "Google Analytics", en: "Google Analytics" },
        purpose: { fr: "Distingue les visiteurs", en: "Distinguishes visitors" },
        duration: { fr: "2 ans", en: "2 years" },
      },
      {
        name: "_ga_<id>",
        provider: { fr: "Google Analytics", en: "Google Analytics" },
        purpose: { fr: "Conserve l'état de la session", en: "Keeps session state" },
        duration: { fr: "2 ans", en: "2 years" },
      },
      {
        name: "_clck",
        provider: { fr: "Microsoft Clarity", en: "Microsoft Clarity" },
        purpose: { fr: "Identifiant Clarity propre à ce site", en: "Clarity identifier for this site" },
        duration: { fr: "1 an", en: "1 year" },
      },
      {
        name: "_clsk",
        provider: { fr: "Microsoft Clarity", en: "Microsoft Clarity" },
        purpose: { fr: "Regroupe les pages vues en une session", en: "Groups page views into one session" },
        duration: { fr: "1 jour", en: "1 day" },
      },
      {
        name: "CLID, MUID, ANONCHK, MR, SM",
        provider: { fr: "Microsoft (clarity.ms, bing.com)", en: "Microsoft (clarity.ms, bing.com)" },
        purpose: {
          fr: "Identification du navigateur et synchronisation entre domaines Microsoft",
          en: "Browser identification and sync across Microsoft domains",
        },
        duration: { fr: "Fixée par Microsoft", en: "Set by Microsoft" },
      },
    ],
  },
  {
    category: "marketing",
    items: [
      {
        name: "_gcl_au",
        provider: { fr: "Google Ads", en: "Google Ads" },
        purpose: { fr: "Mesure des conversions publicitaires", en: "Ad conversion measurement" },
        duration: { fr: "90 jours", en: "90 days" },
      },
      {
        name: "_fbp",
        provider: { fr: "Meta (Facebook, Instagram)", en: "Meta (Facebook, Instagram)" },
        purpose: { fr: "Identifiant du navigateur pour le pixel Meta", en: "Browser identifier for the Meta pixel" },
        duration: { fr: "90 jours", en: "90 days" },
      },
      {
        name: "_fbc",
        provider: { fr: "Meta (Facebook, Instagram)", en: "Meta (Facebook, Instagram)" },
        purpose: { fr: "Mémorise le clic sur une publicité Meta", en: "Stores the click on a Meta ad" },
        duration: { fr: "90 jours", en: "90 days" },
      },
    ],
  },
];

const PolitiqueCookies = () => {
  const { resetConsent } = useCookieConsent();
  const { t, language } = useLanguage();
  const lang: Lang = language === "en" ? "en" : "fr";

  const breadcrumbSchema = addBreadcrumbSchema([
    { name: "Accueil", url: "https://www.jemassuremoinscher.fr/" },
    { name: "Politique de Cookies", url: "https://www.jemassuremoinscher.fr/politique-cookies" }
  ]);

  return (
    <div className="min-h-screen flex flex-col">
      <SEOOptimized
        title={t("seo.cookies.title")}
        description={t("seo.cookies.description")}
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
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">{t('cookiePolicy.list.title')}</h2>
              <p className="text-gray-600 leading-relaxed mb-4">{t('cookiePolicy.list.intro')}</p>
              {TRACKERS.map((group) => (
                <div key={group.category} className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{t(`cookiePolicy.list.${group.category}`)}</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-gray-600 border border-gray-200">
                      <thead className="bg-gray-100 text-gray-900">
                        <tr>
                          <th className="px-3 py-2">{t('cookiePolicy.list.name')}</th>
                          <th className="px-3 py-2">{t('cookiePolicy.list.provider')}</th>
                          <th className="px-3 py-2">{t('cookiePolicy.list.purpose')}</th>
                          <th className="px-3 py-2">{t('cookiePolicy.list.duration')}</th>
                        </tr>
                      </thead>
                      <tbody>
                        {group.items.map((item) => (
                          <tr key={item.name} className="border-t border-gray-200 align-top">
                            <td className="px-3 py-2 font-mono text-xs break-words">{item.name}</td>
                            <td className="px-3 py-2">{item.provider[lang]}</td>
                            <td className="px-3 py-2">{item.purpose[lang]}</td>
                            <td className="px-3 py-2">{item.duration[lang]}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ))}
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
                <strong>{t('cookiePolicy.lastUpdate')}</strong> {LAST_UPDATE[lang]}
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