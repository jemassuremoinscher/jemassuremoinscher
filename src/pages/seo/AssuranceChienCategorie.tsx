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
  CHIEN_CATEGORIE_FAQ,
  CHIEN_CATEGORIE_META,
  CHIEN_CATEGORIE_TITLE,
  F1839_TEXTES,
  F1839_URL,
} from "@/data/chienCategoriePage";

// /assurance-chien-categorie-1-2 : obligations du détenteur d'un chien de
// 1re ou 2e catégorie, d'après la seule fiche F1839 de service-public.gouv.fr.
// Aucun prix, aucune peine de prison ni amende autre que celle du défaut
// d'assurance (450 € au maximum). FAQ visible et JSON-LD FAQPage identiques.

const CANONICAL = "https://www.jemassuremoinscher.fr/assurance-chien-categorie-1-2";

const AssuranceChienCategorie = () => {
  const navigate = useNavigate();
  // BreadcrumbList : émis par le composant Breadcrumbs.
  const faqSchema = addFAQSchema(CHIEN_CATEGORIE_FAQ);

  return (
    <div className="min-h-screen">
      <SEOOptimized
        title={CHIEN_CATEGORIE_TITLE}
        description={CHIEN_CATEGORIE_META}
        keyword="chien de catégorie assurance"
        keywords="chien catégorie 1, chien catégorie 2, permis de détention chien, assurance responsabilité civile chien catégorisé"
        canonical={CANONICAL}
        ogTitle={CHIEN_CATEGORIE_TITLE}
        ogDescription={CHIEN_CATEGORIE_META}
        twitterDescription={CHIEN_CATEGORIE_META}
        jsonLd={[faqSchema]}
      />
      <Header />
      <Breadcrumbs
        items={[
          { label: "Assurance Animaux", href: "/assurance-animaux" },
          { label: "Chien de 1re ou 2e catégorie" },
        ]}
      />
      <main id="main-content">
        <section className="relative pt-6 pb-10 md:pt-8 md:pb-14">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <ArthurHero
                imageSrc={arthurAnimals}
                imageAlt="Arthur avec des animaux"
                title="Chien de 1re ou 2e catégorie : obligations et assurance"
                subtitle="Permis de détention, identification, vaccination, évaluation comportementale et assurance responsabilité civile : ce que prévoit la réglementation."
                ctaLabel="Être rappelé par un conseiller"
                onCtaClick={() => navigate("/contact")}
                savingsValue="Sources officielles"
                savingsLabel="fiche F1839 de service-public.gouv.fr"
              />
            </div>
          </div>
        </section>

        <div className="container mx-auto px-4 py-12">
          <article className="max-w-3xl mx-auto mb-16 prose prose-slate dark:prose-invert prose-headings:scroll-mt-24">
            <p className="lead">
              Certains chiens, considérés comme pouvant être dangereux, sont soumis à une réglementation spécifique. Ils
              sont classés en deux catégories : les chiens d'attaque (1re catégorie) et les chiens de garde et de
              défense (2e catégorie). Leur propriétaire ou détenteur doit respecter des obligations précises, dont une
              assurance responsabilité civile.
            </p>
            <p>
              Cette page résume ces obligations d'après la fiche officielle F1839 de service-public.gouv.fr, consultée
              le 2 octobre 2026. Pour l'assurance santé de votre chien (frais vétérinaires), qui reste facultative,
              consultez notre guide <Link to="/assurance-animaux">assurance chien et chat</Link>.
            </p>

            <h2 id="categories">1. Quels chiens sont concernés ?</h2>
            <h3>Les chiens de 1re catégorie (chiens d'attaque)</h3>
            <p>
              Ce sont des chiens issus de croisements assimilables, par leurs caractéristiques morphologiques, aux chiens
              des races American Staffordshire terrier (communément appelés pit-bulls), Mastiff (communément appelés
              boerbulls) et Tosa. Ces chiens n'ont pas de pedigree. Leurs éléments de reconnaissance sont définis par
              arrêté.
            </p>
            <p>
              Il n'est plus possible d'acheter, de vendre ou de donner un chien de 1re catégorie, ni d'en importer ou d'en
              introduire en métropole, dans les départements et régions d'outre-mer, à Saint-Barthélemy, à Saint-Martin ou
              à Saint-Pierre-et-Miquelon.
            </p>
            <h3>Les chiens de 2e catégorie (chiens de garde et de défense)</h3>
            <p>
              Ce sont les chiens des races American Staffordshire terrier, Rottweiler et Tosa, qui ont un pedigree. La
              catégorie comprend aussi les chiens issus de croisements assimilables, par leurs caractéristiques
              morphologiques, aux chiens de race Rottweiler : ces derniers n'ont pas de pedigree.
            </p>
            <p>
              Un chien de race est un chien inscrit au livre généalogique des origines françaises (LOF), tenu par la
              Société Centrale Canine, ou à un livre étranger reconnu par elle. Seul un vétérinaire est compétent pour
              déterminer le type racial d'un animal : en cas de doute, la fiche recommande de se procurer une attestation
              vétérinaire, qui pourra être présentée aux forces de l'ordre en cas de contrôle.
            </p>
            <p>
              À noter : si les chiens catégorisés sont par défaut considérés comme dangereux, un chien dangereux n'est pas
              forcément un chien catégorisé.
            </p>

            <h2 id="qui-peut-detenir">2. Qui peut détenir un chien de catégorie ?</h2>
            <p>Vous n'avez pas le droit de détenir un chien de 1re ou de 2e catégorie si :</p>
            <ul>
              <li>vous êtes mineur ;</li>
              <li>vous êtes majeur en tutelle, sauf autorisation du juge des tutelles ;</li>
              <li>
                vous avez été condamné pour un crime, ou à une peine d'emprisonnement avec ou sans sursis pour un délit
                inscrit au bulletin n° 2 du casier judiciaire (ou dans un document équivalent pour une personne étrangère) ;
              </li>
              <li>la propriété ou la garde d'un chien vous a été retirée.</li>
            </ul>

            <h2 id="obligations">3. Les obligations du propriétaire ou du détenteur</h2>
            <h3>L'identification</h3>
            <p>
              Le chien doit être identifié par puce électronique au fichier national d'identification des carnivores
              domestiques (Icad), ce qui lui attribue un numéro unique et enregistre les nom et adresse de son
              propriétaire. Pensez à mettre vos coordonnées à jour sur le site de l'Icad si elles changent.
            </p>
            <h3>La vaccination antirabique</h3>
            <p>
              Le chien doit être vacciné contre la rage, même si vous habitez un département indemne de rage. La
              primovaccination peut être faite à partir de 3 mois et n'est valable qu'après 21 jours. Seul le passeport
              européen pour animal de compagnie, établi par le vétérinaire, certifie la vaccination, y compris si l'animal
              ne quitte pas la France. La fréquence des rappels y est indiquée.
            </p>
            <h3>L'évaluation comportementale</h3>
            <p>
              Entre 8 mois et 1 an, le chien doit faire l'objet d'une évaluation comportementale par un vétérinaire agréé.
              Elle est aussi obligatoire si le chien mord quelqu'un.
            </p>
            <h3>La stérilisation (1re catégorie uniquement)</h3>
            <p>
              Un chien de 1re catégorie doit obligatoirement être stérilisé. La stérilisation donne lieu à un certificat
              vétérinaire.
            </p>
            <h3>L'attestation d'aptitude</h3>
            <p>
              Le détenteur doit suivre une formation d'une journée sur l'éducation et le comportement des chiens et sur la
              prévention des accidents, avec une partie théorique et une partie pratique. Le formateur délivre ensuite une
              attestation d'aptitude, dont un second exemplaire est adressé au préfet du département de résidence. Les frais
              de formation sont à votre charge ; la liste des formateurs agréés est disponible auprès de la mairie ou de la
              direction départementale de la protection des populations. L'attestation est attachée à la personne, pas au
              chien : en cas de cession, le nouveau propriétaire doit obtenir la sienne.
            </p>
            <h3>L'assurance responsabilité civile</h3>
            <p>
              Vous devez avoir une assurance responsabilité civile qui garantit les éventuels dommages que votre chien
              pourrait causer à des tiers. Les membres de votre famille sont considérés comme des tiers. L'absence
              d'assurance est passible d'une <strong>amende de 450 € au maximum</strong>.
            </p>

            <h2 id="permis">4. Le permis de détention</h2>
            <p>
              La détention d'un chien de 1re ou de 2e catégorie est soumise à un permis de détention délivré par le maire
              de la commune de résidence ou, à Paris, par la préfecture de police. Le permis est gratuit, et une demande
              doit être faite pour chaque chien.
            </p>
            <ul>
              <li>
                <strong>Chien de moins de 8 mois</strong> : l'évaluation comportementale n'a pas encore eu lieu ; un
                permis provisoire est délivré, valable jusqu'aux 12 mois du chien (formulaire cerfa n° 13997).
              </li>
              <li>
                <strong>Permis définitif</strong> : il doit être demandé avant les 12 mois du chien (formulaire cerfa
                n° 13996).
              </li>
            </ul>
            <p>Le dossier comprend :</p>
            <ul>
              <li>
                la copie du passeport européen du chien, qui justifie son identification à l'Icad, sa vaccination
                antirabique en cours de validité et, pour la 1re catégorie, sa stérilisation ;
              </li>
              <li>
                l'<strong>attestation de responsabilité civile</strong>, qui justifie que vous êtes couvert par un contrat
                d'assurance si votre chien cause des dommages à un tiers ;
              </li>
              <li>l'attestation d'aptitude obtenue à l'issue de la formation ;</li>
              <li>pour le permis définitif, les conclusions de l'évaluation comportementale ;</li>
              <li>pour un éleveur, le justificatif de sa certification professionnelle.</li>
            </ul>
            <p>
              Le permis se retire avec l'original du passeport européen du chien. Le maire peut refuser le permis si les
              résultats de l'évaluation comportementale le justifient. Une fois le permis accordé, vous devez en permanence
              tenir à jour le vaccin antirabique et détenir une assurance responsabilité civile. Si vous changez de commune,
              présentez votre permis à la mairie de votre nouveau domicile.
            </p>
            <p>
              Sans permis, le maire peut vous mettre en demeure de régulariser la situation dans un délai d'un mois ; à
              défaut, il peut ordonner le placement de l'animal en fourrière.
            </p>

            <h2 id="lieux-publics">5. Dans les lieux publics et les immeubles</h2>
            <ul>
              <li>
                <strong>1re catégorie</strong> : l'accès aux transports en commun, aux lieux publics (sauf la voie
                publique) et aux locaux ouverts au public est interdit, tout comme le stationnement dans les parties
                communes des immeubles collectifs. Sur la voie publique et dans les parties communes, le chien doit être
                tenu en laisse et muselé.
              </li>
              <li>
                <strong>2e catégorie</strong> : le chien doit être tenu en laisse et muselé sur la voie publique, dans les
                parties communes des immeubles collectifs, dans les lieux publics, dans les locaux ouverts au public et dans
                les transports en commun.
              </li>
            </ul>

            <h2 id="assurance">6. L'assurance responsabilité civile en pratique</h2>
            <p>
              L'obligation porte sur la responsabilité civile : couvrir les dommages que le chien peut causer à d'autres
              personnes, y compris aux membres de votre famille. Elle ne concerne pas les frais vétérinaires de votre
              chien, dont l'assurance reste facultative.
            </p>
            <p>Avant de constituer votre dossier de permis :</p>
            <ol>
              <li>
                vérifiez dans votre contrat actuel, par exemple votre assurance habitation, s'il comprend une garantie
                responsabilité civile et si elle couvre un chien de 1re ou de 2e catégorie ;
              </li>
              <li>demandez à votre assureur l'attestation de responsabilité civile exigée pour le permis ;</li>
              <li>si votre contrat ne couvre pas votre chien, souscrivez une garantie qui le prévoit ;</li>
              <li>conservez cette assurance tant que vous détenez le chien : c'est une condition du permis.</li>
            </ol>
            <p>
              Un conseiller peut vous aider à vérifier votre contrat actuel et l'attestation demandée pour le permis.
            </p>
            <div className="not-prose my-8 text-center">
              <Button asChild size="lg" className="rounded-full font-bold px-8">
                <Link to="/contact">Être rappelé par un conseiller</Link>
              </Button>
            </div>

            <h2 id="faq">Questions fréquentes</h2>
            <div className="not-prose space-y-6">
              {CHIEN_CATEGORIE_FAQ.map((item) => (
                <div key={item.question}>
                  <h3 className="text-lg font-semibold text-foreground">{item.question}</h3>
                  <p className="mt-2 text-muted-foreground leading-relaxed">{item.answer}</p>
                </div>
              ))}
            </div>

            <h2 id="source">Source</h2>
            <p>
              <a href={F1839_URL} target="_blank" rel="noopener noreferrer">
                Service-public.gouv.fr : « Avoir un chien de catégorie : quelles sont les règles ? » (fiche F1839)
              </a>{" "}
              (consultée le 2 octobre 2026).
            </p>
            <p>Textes de référence cités par cette fiche :</p>
            <ul>
              {F1839_TEXTES.map((texte) => (
                <li key={texte}>{texte}</li>
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

export default AssuranceChienCategorie;
