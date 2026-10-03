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
import {
  CHAT_APPART_FAQ,
  CHAT_APPART_META,
  CHAT_APPART_SOURCES,
  CHAT_APPART_TITLE,
} from "@/data/chatAppartementPage";

// /assurance-chat-appartement : bail (F2693), dommages causés à autrui
// (F17603), identification (L212-10, F34877) et ce que prévoient les trois
// contrats du pilier. Aucun risque de santé propre au chat d'intérieur (aucune
// source). Dégâts au logement loué : seulement « vérifiez votre contrat
// habitation ». Aucun prix, aucune économie promise, aucun nom d'assureur dans
// le texte. FAQ visible et JSON-LD FAQPage identiques ; BreadcrumbList émis
// une seule fois, par le composant Breadcrumbs. Même gabarit que
// /assurance-chaton.

const CANONICAL = "https://www.jemassuremoinscher.fr/assurance-chat-appartement";

const AssuranceChatAppartement = () => {
  const navigate = useNavigate();
  const faqSchema = addFAQSchema(CHAT_APPART_FAQ);

  return (
    <div className="min-h-screen">
      <SEOOptimized
        title={CHAT_APPART_TITLE}
        description={CHAT_APPART_META}
        keyword="assurance chat d'appartement"
        keywords="assurance chat appartement, chat d'intérieur assurance, chat locataire, responsabilité civile chat"
        canonical={CANONICAL}
        ogTitle={CHAT_APPART_TITLE}
        ogDescription={CHAT_APPART_META}
        twitterDescription={CHAT_APPART_META}
        jsonLd={[faqSchema]}
      />
      <Header />
      <Breadcrumbs
        items={[{ label: "Assurance Animaux", href: "/assurance-animaux" }, { label: "Assurance chat d'appartement" }]}
      />
      <main id="main-content">
        <section className="relative pt-6 pb-10 md:pt-8 md:pb-14">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <ArthurHero
                imageSrc={arthurAnimals}
                imageAlt="Arthur avec des animaux"
                title="Chat d'appartement : quelle assurance, quelles règles ?"
                subtitle="Location, dommages causés à autrui, identification et assurance santé : ce que prévoient la loi et les contrats."
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
              Un chat qui vit en appartement soulève trois questions d'assurance différentes : ce que permet le bail
              si vous êtes locataire, qui paie les dommages que le chat cause à d'autres personnes, et ce que couvre
              une assurance santé pour ses frais vétérinaires.
            </p>
            <p>
              Les règles viennent des fiches officielles de service-public.gouv.fr et du code rural, listés dans les
              sources. Les informations sur l'assurance santé viennent des documents d'information de trois contrats
              d'assurance chien et chat distribués en France : elles valent pour ces trois contrats et ne décrivent pas
              tout le marché. Les notions générales (taux de remboursement, plafond, franchise) sont expliquées dans
              notre guide <Link to="/assurance-animaux">assurance chien et chat</Link>.
            </p>

            <h2 id="location">1. Avoir un chat dans un logement loué</h2>
            <p>Selon la fiche F2693 de service-public.gouv.fr, tout dépend du type de location :</p>
            <ul>
              <li>
                <strong>logement loué comme résidence principale</strong>, vide ou meublé : le locataire peut détenir
                un ou plusieurs animaux de compagnie, à condition de respecter la tranquillité du voisinage ; le bail
                peut seulement interdire la détention d'un chien dangereux de 1re catégorie ;
              </li>
              <li>
                <strong>meublé de tourisme</strong> : le loueur peut indiquer dans le contrat de location que la
                présence de tout animal est interdite.
              </li>
            </ul>
            <p>
              La même fiche précise que le locataire qui détient un ou plusieurs animaux est responsable des dégâts et
              des troubles anormaux de voisinage qu'ils causent.
            </p>
            <p>
              Si votre chat abîme le logement que vous louez, vérifiez votre contrat habitation pour savoir ce qu'il
              prévoit. Notre page <Link to="/assurance-habitation">assurance habitation</Link> présente ce type de
              contrat.
            </p>

            <h2 id="dommages">2. Les dommages causés à d'autres personnes</h2>
            <p>Selon la fiche F17603 de service-public.gouv.fr :</p>
            <ul>
              <li>
                l'assurance responsabilité civile n'est obligatoire que pour les chiens de 1re et 2e catégorie ; pour un
                chat, aucune assurance n'est obligatoire ;
              </li>
              <li>
                vous êtes en revanche responsable des dommages matériels et corporels que votre chat peut causer à un
                tiers, qu'il soit sous votre garde ou qu'il se soit échappé ou égaré ;
              </li>
              <li>
                en pratique, votre assurance multirisque habitation ou votre assurance automobile comprend une garantie
                responsabilité civile qui permet de couvrir les dommages pouvant être causés par votre animal ;
              </li>
              <li>
                sans assurance responsabilité civile, vous devez dédommager vous-même les dégradations et dommages.
              </li>
            </ul>
            <p>
              Dans les trois contrats d'assurance santé examinés, la seule option responsabilité civile prévue concerne
              les dommages causés par un chien. Pour un chat, ce sont les garanties responsabilité civile décrites
              ci-dessus qui permettent de couvrir ces dommages.
            </p>

            <h2 id="identification">3. L'identification, même pour un chat qui ne sort pas</h2>
            <p>
              Selon l'article L212-10 du code rural et de la pêche maritime, un chat doit être identifié avant toute
              cession, et, en dehors de toute cession, dès qu'il a plus de sept mois. Vivre en appartement ne change
              rien à cette obligation. La fiche F34877 de service-public.gouv.fr détaille les démarches ; elles sont
              reprises dans notre page <Link to="/assurance-chaton">assurance chaton</Link>.
            </p>
            <p>
              Côté assurance, l'un des trois contrats examinés exclut les animaux non identifiés.
            </p>

            <h2 id="sante">4. L'assurance santé dans les contrats examinés</h2>
            <h3>Une formule dédiée aux chats d'intérieur</h3>
            <p>
              L'un des contrats propose une formule dédiée aux chats d'intérieur. Son document d'information la cite
              une seule fois, dans les garanties complémentaires : « Alimentation thérapeutique (dans les formules Cat
              Indoor et Optimal). Remboursement de 20 % des factures allant de 50 € à 200 € par an. » Il ne détaille
              pas d'autres garanties propres à cette formule.
            </p>
            <h3>Les points qui concernent tout chat</h3>
            <ul>
              <li>
                <strong>âge à la souscription</strong> : à partir de 2 mois dans les trois contrats ; l'âge maximal va
                de 5 ans à moins de 10 ans selon le contrat, la formule et, pour l'un d'eux, la race ;
              </li>
              <li>
                <strong>délais de carence</strong> : 48 heures pour un accident dans l'un des contrats, 45 jours pour
                une maladie dans les deux contrats qui le chiffrent, et jusqu'à 6 mois pour une chirurgie liée à une
                maladie dans l'un d'eux ;
              </li>
              <li>
                <strong>troubles du comportement</strong> : deux des trois contrats en excluent les frais, l'un les
                frais de visite et de médicaments, l'autre les frais médicamenteux ;
              </li>
              <li>
                <strong>détartrage</strong> : traité différemment selon le contrat. L'un rembourse le détartrage
                thérapeutique après 2 ans d'adhésion, un autre l'inclut dans son option prévention, le troisième exclut
                le détartrage à but esthétique ;
              </li>
              <li>
                <strong>affections congénitales ou héréditaires</strong> : exclues par les trois contrats, même
                lorsqu'elles apparaissent après la souscription.
              </li>
            </ul>

            <h2 id="comparer">5. Les points à comparer</h2>
            <ol>
              <li>la garantie responsabilité civile de votre contrat habitation, pour les dommages causés à autrui ;</li>
              <li>ce que ce contrat prévoit pour les dégâts causés au logement loué ;</li>
              <li>l'âge maximal à la souscription et les délais de carence de l'assurance santé ;</li>
              <li>les exclusions : troubles du comportement, affections congénitales et héréditaires ;</li>
              <li>le détartrage, la prévention et l'alimentation thérapeutique : garantie, option ou exclusion ;</li>
              <li>le taux de remboursement, le plafond annuel et la franchise.</li>
            </ol>
            <p>
              Un conseiller peut vous aider à lire les documents d'information et à comparer les propositions adaptées
              à votre chat. Le formulaire de demande se trouve sur notre page assurance chien et chat.
            </p>
            <div className="not-prose my-8 text-center">
              <Button asChild size="lg" className="rounded-full font-bold px-8">
                <Link to="/assurance-animaux">Remplir le formulaire</Link>
              </Button>
            </div>

            <h2 id="faq">Questions fréquentes</h2>
            <div className="not-prose space-y-6">
              {CHAT_APPART_FAQ.map((item) => (
                <div key={item.question}>
                  <h3 className="text-lg font-semibold text-foreground">{item.question}</h3>
                  <p className="mt-2 text-muted-foreground leading-relaxed">{item.answer}</p>
                </div>
              ))}
            </div>

            <h2 id="sources">Sources</h2>
            <p>
              Les informations sur l'assurance santé viennent des trois documents d'information ci-dessous. Elles
              valent pour ces trois contrats et ne décrivent pas l'ensemble du marché.
            </p>
            <ul>
              {CHAT_APPART_SOURCES.map((s) => (
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

export default AssuranceChatAppartement;
