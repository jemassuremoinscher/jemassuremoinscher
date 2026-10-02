import { Link, useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Breadcrumbs from "@/components/Breadcrumbs";
import SEOOptimized from "@/components/SEOOptimized";
import ArthurHero from "@/components/insurance/ArthurHero";
import { Button } from "@/components/ui/button";
import { addFAQSchema } from "@/utils/seoUtils";
import { ORIAS_NUMBER } from "@/config/site";
import arthurAnimals from "@/assets/mascotte/arthur-animals.webp";
import { CHATON_FAQ, CHATON_META, CHATON_SOURCES, CHATON_TITLE } from "@/data/chatonPage";

// /assurance-chaton : règles d'acquisition et d'identification (fiche F34877
// de service-public.gouv.fr) et points d'assurance propres au chaton, tirés
// des trois documents d'information du pilier. Rien sur la vaccination des
// chatons en dehors de ces sources. Aucun prix, aucune économie promise,
// aucun nom d'assureur dans le texte (seulement dans les sources). FAQ
// visible et JSON-LD FAQPage identiques ; BreadcrumbList émis une seule fois,
// par le composant Breadcrumbs. Même gabarit que /assurance-chiot.

const CANONICAL = "https://www.jemassuremoinscher.fr/assurance-chaton";

const AssuranceChaton = () => {
  const navigate = useNavigate();
  const faqSchema = addFAQSchema(CHATON_FAQ);

  return (
    <div className="min-h-screen">
      <SEOOptimized
        title={CHATON_TITLE}
        description={CHATON_META}
        keyword="assurance chaton"
        keywords="assurance chaton, assurer un chaton, mutuelle chaton, chaton stérilisation assurance, chaton carence"
        canonical={CANONICAL}
        ogTitle={CHATON_TITLE}
        ogDescription={CHATON_META}
        twitterDescription={CHATON_META}
        jsonLd={[faqSchema]}
      />
      <Header />
      <Breadcrumbs items={[{ label: "Assurance Animaux", href: "/assurance-animaux" }, { label: "Assurance chaton" }]} />
      <main id="main-content">
        <section className="relative pt-6 pb-10 md:pt-8 md:pb-14">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <ArthurHero
                imageSrc={arthurAnimals}
                imageAlt="Arthur avec des animaux"
                title="Assurance chaton : quand et comment assurer son chaton"
                subtitle="Âge minimum, identification, délais de carence, maladies héréditaires et stérilisation : ce que prévoient la loi et les contrats."
                ctaLabel="Demander un devis"
                onCtaClick={() => navigate("/assurance-animaux")}
                savingsValue="Sources citées"
                savingsLabel="service-public.gouv.fr et trois contrats"
              />
            </div>
          </div>
        </section>

        <div className="container mx-auto px-4 py-12">
          <article className="max-w-3xl mx-auto mb-16 prose prose-slate dark:prose-invert prose-headings:scroll-mt-24">
            <p className="lead">
              Accueillir un chaton, c'est d'abord respecter quelques règles fixées par la loi, puis choisir, si vous le
              souhaitez, une assurance santé pour ses frais vétérinaires. Cette page rassemble ces deux sujets.
            </p>
            <p>
              Les règles viennent de la fiche officielle F34877 de service-public.gouv.fr. Les informations sur
              l'assurance viennent des documents d'information de trois contrats d'assurance chien et chat distribués en
              France, listés dans les sources : elles valent pour ces trois contrats et ne décrivent pas tout le marché.
              Les notions générales (taux de remboursement, plafond, franchise) sont expliquées dans notre guide{" "}
              <Link to="/assurance-animaux">assurance chien et chat</Link>.
            </p>

            <h2 id="avant-arrivee">1. Avant l'arrivée du chaton : ce que prévoit la loi</h2>
            <p>D'après la fiche F34877 de service-public.gouv.fr :</p>
            <ul>
              <li>
                <strong>Où l'acquérir</strong> : un chaton s'achète auprès d'un éleveur ou d'un vendeur, ou s'adopte
                auprès d'une association ou d'une fondation de protection animale. Un particulier ne peut vendre qu'un
                chat adulte ; un particulier qui vend les chatons de sa chatte est considéré comme éleveur. Depuis le 1er
                janvier 2024, la vente de chats en animalerie est interdite : les animaleries peuvent seulement présenter à
                l'adoption des chats confiés par des associations ou des fondations.
              </li>
              <li>
                <strong>L'âge minimum</strong> : le chaton doit avoir au moins 8 semaines (2 mois) au moment de
                l'acquisition, qu'elle soit payante ou gratuite.
              </li>
              <li>
                <strong>Le certificat d'engagement et de connaissance</strong> : vous le signez, avec une mention
                manuscrite, avant de recevoir le chaton. La fiche prévoit 7 jours entre sa délivrance et l'acquisition,
                « le temps de vous accorder un délai de réflexion après lecture des informations contenues dans le
                certificat ». « À la fin de ce délai seulement, vous pourrez acquérir votre animal si vous jugez que vous
                serez capable de répondre à ses besoins durant toute sa vie. » La personne qui vous cède le chaton
                « vérifie également que ce certificat vous a été délivré depuis au moins 7 jours ». Le certificat rappelle
                les besoins de l'animal, l'obligation d'identification et les implications financières et logistiques de
                sa garde tout au long de sa vie.
              </li>
              <li>
                <strong>Les documents remis</strong> : la fiche en cite trois.
                <ul>
                  <li>une attestation de cession ;</li>
                  <li>
                    un certificat vétérinaire de moins de 3 mois, établi après examen de l'animal ; il mentionne
                    notamment son identification et, le cas échéant, ses vaccinations, sa stérilisation et, pour un chat
                    de race, la copie de sa déclaration de naissance au livre officiel des origines félines (LOOF) ;
                  </li>
                  <li>
                    un « document d'information sur les caractéristiques et les besoins de l'animal contenant également,
                    au besoin, des conseils d'éducation », que la fiche mentionne « si vous avez déjà acquis un animal de
                    la même espèce et présenté votre certificat d'engagement et de connaissance pour cette précédente
                    acquisition ».
                  </li>
                </ul>
              </li>
            </ul>
            <h3>Vérifier l'annonce</h3>
            <p>
              Selon la même fiche, toute offre de cession d'un chaton, payante ou gratuite, doit notamment indiquer son
              numéro d'identification, son âge, son sexe, son lieu de naissance, son inscription ou non au LOOF et, pour
              un éleveur, ses numéros Siren et Siret (ou, s'il en est dispensé, le numéro de la portée au livre
              généalogique). Seuls les éleveurs et les vendeurs peuvent publier sur internet une annonce de vente ; un
              particulier ne peut y proposer un animal que gratuitement. Sur les sites autorisés à diffuser ces offres,
              l'annonce publiée doit porter la mention « annonce vérifiée ». Avant d'acheter, vous pouvez aussi vérifier
              qu'un éleveur est inscrit au répertoire Sirene, ou que le numéro de portée annoncé correspond à une portée
              déclarée au LOOF.
            </p>

            <h2 id="identification">2. L'identification du chaton</h2>
            <p>Selon la même fiche :</p>
            <ul>
              <li>
                un chaton ne peut pas être cédé sans être identifié, par puce électronique ou tatouage, au fichier
                national d'identification des carnivores domestiques (Icad) ; l'identification est faite par la personne
                qui cède l'animal, à ses frais ;
              </li>
              <li>
                au moment de la cession, elle vous remet un document attestant l'identification et adresse à l'Icad,
                dans les 8 jours, le document de changement de propriétaire ; l'Icad vous envoie ensuite la carte
                d'identification à votre nom ;
              </li>
              <li>
                pour un chaton né chez vous, l'identification est obligatoire pour les chats de plus de 7 mois ; elle est
                faite par un vétérinaire ou un tatoueur habilité, qui vous remet une attestation provisoire et informe
                l'Icad dans les 8 jours ; l'un des trois contrats examinés exclut les frais de puce électronique et de
                tatouage ;
              </li>
              <li>pensez à signaler à l'Icad tout changement d'adresse ou de numéro de téléphone.</li>
            </ul>
            <p>
              Selon la fiche de service-public.gouv.fr, le fait de détenir un chien ou un chat non identifié né après le
              1er janvier 2012 peut être puni d'une amende de 750 €.
            </p>
            <p>
              Côté assurance, l'un des trois contrats examinés exclut les animaux non identifiés : un chaton identifié
              avant la souscription évite cette difficulté.
            </p>

            <h2 id="age">3. À partir de quel âge assurer son chaton ?</h2>
            <p>
              Dans les trois contrats examinés, un chat peut être assuré à partir de 2 mois, l'âge minimum fixé pour son
              acquisition. L'âge maximal à la souscription, de 5 ans à moins de 10 ans selon le contrat, la formule et
              parfois la race, ne pose pas de difficulté pour un chaton.
            </p>
            <p>
              Souscrire tôt a un intérêt pratique : les délais de carence s'écoulent pendant que le chaton est jeune, et
              un problème de santé qui apparaît après la carence n'est pas antérieur à la souscription.
            </p>
            <p>
              Souscrire tôt ne garantit pas la prise en charge : lisez les exclusions et les délais de carence du
              contrat.
            </p>

            <h2 id="carence">4. Souscrire tôt : les délais de carence</h2>
            <p>
              Le délai de carence est la période qui suit la souscription pendant laquelle un problème de santé n'est
              pas pris en charge. Dans les contrats examinés :
            </p>
            <ul>
              <li>
                <strong>accident</strong> : 48 heures dans l'un des contrats ; un autre ne prévoit de délai d'attente que
                pour la maladie ;
              </li>
              <li>
                <strong>maladie</strong> : 45 jours dans les deux contrats qui le chiffrent, le troisième renvoyant à sa
                notice ;
              </li>
              <li>
                <strong>chirurgie liée à une maladie</strong> : jusqu'à 6 mois dans l'un des contrats.
              </li>
            </ul>
            <p>
              Selon les contrats, un problème apparu pendant la carence peut ensuite rester exclu. Souscrire avant les
              premiers soins importants permet que ce délai soit passé le jour où vous en aurez besoin.
            </p>

            <h2 id="hereditaire">5. Maladies congénitales et héréditaires</h2>
            <p>
              Les trois contrats examinés excluent les affections congénitales ou héréditaires. Même si une telle
              affection n'apparaît qu'après la souscription, ces contrats ne la couvrent pas.
            </p>
            <p>
              Si votre chaton est de race et que cette race est connue pour certaines prédispositions, demandez avant de
              signer comment le contrat les traite, et lisez la rubrique « Qu'est-ce qui n'est pas assuré ? » du document
              d'information.
            </p>

            <h2 id="sterilisation">6. Stérilisation et prévention</h2>
            <p>
              La stérilisation et la castration, quand elles ne font pas suite à une maladie, ne relèvent ni de l'accident
              ni de la maladie. Dans les contrats examinés, elles ne sont prises en charge que dans un cadre précis :
            </p>
            <ul>
              <li>
                l'un exclut les stérilisations de convenance et les castrations non consécutives à une pathologie en
                dehors de son forfait prévention, qui va de 30 à 150 € par an selon la formule ;
              </li>
              <li>
                un autre propose une option prévention qui couvre certains soins, dont la stérilisation ou la castration,
                le vaccin, le vermifuge et les antiparasitaires ;
              </li>
              <li>
                le troisième prend en charge les frais de stérilisation dans certaines de ses formules et les exclut dans
                les autres.
              </li>
            </ul>
            <p>
              Deux des trois contrats excluent aussi, au moins dans certaines formules, les frais liés aux maladies qui
              auraient pu être évitées par les vaccins préventifs ; pour les chats, l'un d'eux cite le typhus, le coryza
              et la calicivirose. Ce n'est pas une règle générale : vérifiez cette clause dans votre contrat.
            </p>

            <h2 id="comparer">7. Comparer les offres pour un chaton</h2>
            <p>Pour comparer deux propositions, regardez pour chacune :</p>
            <ol>
              <li>l'âge minimal et les conditions d'adhésion, dont l'identification ;</li>
              <li>les délais de carence pour l'accident, la maladie et la chirurgie ;</li>
              <li>les exclusions, en particulier les affections congénitales et héréditaires ;</li>
              <li>la prise en charge de la stérilisation : forfait, option ou formule ;</li>
              <li>la clause sur les maladies évitables par les vaccins ;</li>
              <li>le taux de remboursement, le plafond annuel et la franchise ;</li>
              <li>les règles prévues quand l'animal vieillit.</li>
            </ol>
            <p>
              Un conseiller peut vous aider à lire les documents d'information et à comparer les propositions adaptées à
              votre chaton. Le formulaire de demande se trouve sur notre page assurance chien et chat. Si vous accueillez
              aussi un chien, consultez notre page <Link to="/assurance-chiot">assurance chiot</Link>.
            </p>
            <div className="not-prose my-8 text-center">
              <Button asChild size="lg" className="rounded-full font-bold px-8">
                <Link to="/assurance-animaux">Remplir le formulaire</Link>
              </Button>
            </div>

            <h2 id="faq">Questions fréquentes</h2>
            <div className="not-prose space-y-6">
              {CHATON_FAQ.map((item) => (
                <div key={item.question}>
                  <h3 className="text-lg font-semibold text-foreground">{item.question}</h3>
                  <p className="mt-2 text-muted-foreground leading-relaxed">{item.answer}</p>
                </div>
              ))}
            </div>

            <h2 id="sources">Sources</h2>
            <p>
              Les fourchettes de garanties viennent des trois documents d'information ci-dessous. Elles valent pour ces
              trois contrats et ne décrivent pas l'ensemble du marché.
            </p>
            <ul>
              {CHATON_SOURCES.map((s) => (
                <li key={s.url}>
                  <a href={s.url} target="_blank" rel="noopener noreferrer">
                    {s.label}
                  </a>{" "}
                  (consulté le {s.consulted})
                </li>
              ))}
            </ul>
            <p className="text-sm text-muted-foreground">
              Rédigé par L'équipe jemassuremoinscher.fr, courtier en assurance immatriculé à l'ORIAS sous le n°{" "}
              {ORIAS_NUMBER}.
            </p>
          </article>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AssuranceChaton;
