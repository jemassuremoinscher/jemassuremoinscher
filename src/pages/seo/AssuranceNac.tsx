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
import { NAC_FAQ, NAC_META, NAC_SOURCES, NAC_TITLE } from "@/data/nacPage";

// /assurance-nac : règles de détention, d'acquisition et d'identification
// (fiche F34922 de service-public.gouv.fr) et ce que prévoit le seul des trois
// contrats du pilier qui accepte des NAC (décision du 2 octobre 2026 : aucune
// autre source contrat). Aucun prix, aucune économie promise, aucun nom
// d'assureur dans le texte (seulement dans les sources). FAQ visible et
// JSON-LD FAQPage identiques ; BreadcrumbList émis une seule fois, par le
// composant Breadcrumbs. Même gabarit que /assurance-chaton.

const CANONICAL = "https://www.jemassuremoinscher.fr/assurance-nac";

const AssuranceNac = () => {
  const navigate = useNavigate();
  const faqSchema = addFAQSchema(NAC_FAQ);

  return (
    <div className="min-h-screen">
      <SEOOptimized
        title={NAC_TITLE}
        description={NAC_META}
        keyword="assurance NAC"
        keywords="assurance NAC, assurance lapin, assurance furet, assurance perroquet, mutuelle NAC"
        canonical={CANONICAL}
        ogTitle={NAC_TITLE}
        ogDescription={NAC_META}
        twitterDescription={NAC_META}
        jsonLd={[faqSchema]}
      />
      <Header />
      <Breadcrumbs items={[{ label: "Assurance Animaux", href: "/assurance-animaux" }, { label: "Assurance NAC" }]} />
      <main id="main-content">
        <section className="relative pt-6 pb-10 md:pt-8 md:pb-14">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <ArthurHero
                imageSrc={arthurAnimals}
                imageAlt="Arthur avec des animaux"
                title="Assurance NAC : ce que prévoient les contrats santé animale"
                subtitle="Détention, acquisition, identification, espèces et âges acceptés, délais de carence : les règles officielles et ce que prévoient les contrats examinés."
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
              Lapin, furet, cobaye, perroquet : avant de chercher une assurance pour un nouvel animal de compagnie (NAC),
              il faut connaître les règles qui encadrent sa détention et son acquisition. Cette page rassemble ces
              règles et ce que prévoient les contrats d'assurance santé animale que nous avons examinés.
            </p>
            <p>
              Les règles viennent de la fiche officielle F34922 de service-public.gouv.fr. Côté assurance, nous avons
              examiné les documents d'information de trois contrats d'assurance santé animale distribués en France,
              listés dans les sources. <strong>Parmi ces trois contrats, un seul accepte des NAC</strong> : toutes les
              informations d'assurance propres aux NAC présentées ici viennent de ce seul document. Elles ne décrivent
              pas l'ensemble du marché. Les notions générales (taux de remboursement, plafond, franchise) sont
              expliquées dans notre guide <Link to="/assurance-animaux">assurance chien et chat</Link>.
            </p>

            <h2 id="definition">1. Qu'est-ce qu'un NAC ?</h2>
            <p>
              Selon la fiche F34922, les NAC sont des « espèces animales, autres que les chiens et les chats (qui sont
              des carnivores domestiques), détenues par une personne pour son agrément ». Il peut s'agir de mammifères,
              de rongeurs, d'oiseaux, de reptiles, de batraciens, de poissons, etc.
            </p>
            <p>
              Un NAC peut appartenir à une espèce domestique ou à une espèce non domestique. La liste des espèces
              domestiques est fixée par un arrêté ministériel ; toute espèce qui n'y figure pas est non domestique. Les
              règles de détention ne sont pas les mêmes dans les deux cas.
            </p>
            <p>
              La fiche signale aussi que la loi n° 2021-1539 prévoit qu'à terme, parmi les animaux d'espèces non
              domestiques, seuls ceux qui figurent sur une liste fixée par arrêté pourront être détenus comme animaux de
              compagnie. À la date de vérification de la fiche (3 octobre 2025), cette disposition attendait encore un
              décret d'application.
            </p>

            <h2 id="detention">2. Détenir un animal non domestique : libre, déclaration ou autorisation</h2>
            <p>
              Selon la même fiche, un arrêté ministériel (annexe 2) classe les espèces non domestiques en trois
              catégories :
            </p>
            <ul>
              <li>
                <strong>détention libre</strong>, sans formalité (colonne a du tableau de l'annexe) ;
              </li>
              <li>
                <strong>détention soumise à déclaration</strong> au préfet du département du lieu de détention
                (colonne b) ;
              </li>
              <li>
                <strong>détention soumise à autorisation</strong> et à la détention d'un certificat de capacité pour
                l'entretien de ces animaux (colonne c) : le lieu d'hébergement constitue alors un établissement
                d'élevage, et pour certaines espèces c'est le cas même si vous ne détenez qu'un seul animal.
              </li>
            </ul>
            <p>
              Pour certaines espèces, la détention n'est libre, ou soumise à simple déclaration, qu'en dessous d'un
              certain nombre d'animaux. Certaines espèces sont interdites. La fiche précise aussi que la vente d'un
              animal non domestique par un particulier est interdite, et qu'un détenteur d'espèces soumises à
              déclaration ou à autorisation doit tenir un registre des entrées et sorties des animaux.
            </p>
            <p>
              Avant d'acquérir un animal, vérifiez donc le classement de son espèce. La fiche renvoie, pour les
              démarches, à la direction départementale de la protection des populations (DDPP) de votre département.
            </p>

            <h2 id="acquisition">3. Acquérir un NAC : les documents remis</h2>
            <h3>Animal d'espèce domestique</h3>
            <p>Dans la partie de la fiche consacrée aux animaux d'espèce domestique :</p>
            <ul>
              <li>vous recevez une attestation de cession du refuge, de l'éleveur ou du vendeur ;</li>
              <li>
                pour un furet ou un lapin, vous signez un certificat d'engagement et de connaissance des besoins
                spécifiques de l'espèce, avec une mention manuscrite ; la cession ne peut avoir lieu qu'après un délai
                de réflexion minimum de 7 jours après la délivrance de ce certificat ;
              </li>
              <li>
                pour un furet, l'animal doit obligatoirement être identifié au fichier national d'identification des
                carnivores domestiques (I-Cad), et le changement de détenteur est fait lors de la cession ;
              </li>
              <li>
                pour un autre animal, vous recevez un document d'information sur les caractéristiques et les besoins
                de l'animal contenant également, au besoin, des conseils d'éducation.
              </li>
            </ul>
            <p>
              Selon l'animal, d'autres obligations peuvent s'appliquer, par exemple certains vaccins. La fiche conseille
              de vous renseigner auprès de la DDPP avant l'acquisition.
            </p>
            <h3>Animal d'espèce non domestique</h3>
            <ul>
              <li>
                une attestation de cession, dont le contenu dépend du statut de l'espèce ; pour une espèce qui n'est ni
                protégée ni soumise à déclaration ou à autorisation, elle peut prendre la forme d'une facture ;
              </li>
              <li>
                un document d'information en français : espèce, statut de protection, longévité, taille adulte,
                comportement, régime alimentaire, conditions d'hébergement, estimation du coût d'entretien moyen annuel
                hors frais de santé, entre autres. Il comporte la mention : « Afin de préserver la vie sauvage,
                l'animal dont vous venez de faire l'acquisition ne doit pas être relâché dans le milieu naturel ».
              </li>
            </ul>

            <h2 id="identification">4. L'identification</h2>
            <p>Selon la fiche F34922, sauf mention contraire :</p>
            <ul>
              <li>
                le furet doit être identifié à l'I-Cad avant sa cession ; selon l'article L212-10 du code rural et de
                la pêche maritime, l'identification est aussi obligatoire, en dehors de toute cession, « pour les
                furets âgés de plus de sept mois nés après le 1er novembre 2021 » ;
              </li>
              <li>
                un mammifère, un oiseau, un reptile ou un amphibien appartenant à une espèce protégée doit être marqué
                et inscrit au fichier national d'identification des animaux d'espèces non domestiques (I-Fap) avant de
                vous être cédé : tatouage ou puce électronique pour les mammifères, bague ou puce pour les oiseaux,
                puce pour les reptiles et les amphibiens (des photographies peuvent remplacer le marquage quand il est
                impossible, sur justificatif d'un vétérinaire) ;
              </li>
              <li>
                pensez à mettre à jour vos coordonnées à l'I-Fap et à y signaler la mort ou le vol de l'animal.
              </li>
            </ul>
            <p>
              Côté assurance, le seul contrat examiné qui accepte des NAC exclut les animaux non identifiés et non
              désignés aux dispositions particulières.
            </p>

            <h2 id="assurance">5. Assurer un NAC : ce que prévoient les contrats examinés</h2>
            <p>
              Parmi les trois contrats d'assurance santé animale examinés, <strong>un seul accepte des NAC</strong>.
              Les deux autres ne couvrent que les chiens et les chats. Dans le contrat qui les accepte, le document
              d'information exclut, selon l'âge à la date d'effet :
            </p>
            <ul>
              <li>les furets de moins de 3 mois et de plus de 2 ans ;</li>
              <li>les lapins, cobayes et chinchillas de moins de 3 mois et de plus de 3 ans ;</li>
              <li>les perroquets de moins de 3 mois et de plus de 10 ans.</li>
            </ul>
            <p>
              Ce document ne cite pas d'autres NAC. Il ne permet donc pas de savoir si un autre animal (rat, hamster,
              autre oiseau, reptile…) peut être assuré : posez la question avant de souscrire.
            </p>
            <p>Dans ce même contrat :</p>
            <ul>
              <li>
                le taux de prise en charge va de 60 à 100 %, le plafond de remboursement de 400 à 4 000 € et la
                franchise annuelle de 0 à 75 €, selon la formule et l'espèce ; le document ne détaille pas ces montants
                par espèce, ils figurent dans les dispositions particulières ;
              </li>
              <li>
                les délais de carence sont de 48 heures pour un accident, 45 jours pour une maladie et 6 mois pour une
                intervention chirurgicale à la suite d'une maladie ;
              </li>
              <li>
                les options décès et responsabilité civile décrites dans le document visent les chiens et les chats,
                pas les NAC.
              </li>
            </ul>

            <h2 id="exclusions">6. Les exclusions à connaître</h2>
            <p>Le document d'information de ce contrat exclut notamment :</p>
            <ul>
              <li>
                les maladies et accidents survenus ou constatés avant la souscription, ou pendant les délais de
                carence, ainsi que leurs suites ;
              </li>
              <li>les anomalies constitutionnelles et les pathologies congénitales ou héréditaires ;</li>
              <li>les maladies qui auraient normalement pu être évitées par des vaccins préventifs ;</li>
              <li>
                en dehors de son forfait prévention, les stérilisations de convenance et les castrations non
                consécutives à une pathologie ;
              </li>
              <li>les frais de visite et de médicaments consécutifs à un trouble du comportement.</li>
            </ul>

            <h2 id="verifier">7. Avant de souscrire : les points à vérifier</h2>
            <ol>
              <li>la détention de votre animal est-elle libre, déclarée ou autorisée, selon son espèce ?</li>
              <li>l'espèce est-elle acceptée par le contrat, et à quel âge ?</li>
              <li>l'animal est-il identifié comme le contrat l'exige ?</li>
              <li>quels sont les délais de carence pour l'accident, la maladie et la chirurgie ?</li>
              <li>quels sont le taux de remboursement, le plafond et la franchise prévus pour cette espèce ?</li>
              <li>quelles exclusions s'appliquent, en particulier pour les affections congénitales ou héréditaires ?</li>
            </ol>
            <p>
              Un conseiller peut vous aider à lire les documents d'information et à vérifier si une proposition couvre
              votre animal. Le formulaire de demande se trouve sur notre page assurance chien et chat.
            </p>
            <div className="not-prose my-8 text-center">
              <Button asChild size="lg" className="rounded-full font-bold px-8">
                <Link to="/assurance-animaux">Remplir le formulaire</Link>
              </Button>
            </div>

            <h2 id="faq">Questions fréquentes</h2>
            <div className="not-prose space-y-6">
              {NAC_FAQ.map((item) => (
                <div key={item.question}>
                  <h3 className="text-lg font-semibold text-foreground">{item.question}</h3>
                  <p className="mt-2 text-muted-foreground leading-relaxed">{item.answer}</p>
                </div>
              ))}
            </div>

            <h2 id="sources">Sources</h2>
            <p>
              Les informations d'assurance propres aux NAC viennent du seul des trois documents d'information
              ci-dessous qui accepte des NAC (Santévet) ; les deux autres sont cités parce qu'ils ne couvrent que les
              chiens et les chats. Elles ne décrivent pas l'ensemble du marché.
            </p>
            <ul>
              {NAC_SOURCES.map((s) => (
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

export default AssuranceNac;
