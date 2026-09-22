import VerticalInsurancePage from "@/components/insurance/VerticalInsurancePage";
import BrandName from "@/components/BrandName";
import arthurBtp from "@/assets/mascotte/arthur-btp.webp";
import { DECENNALE_HOWTO_STEPS } from "@/data/decennaleHowToSteps";
import {
  DecennaleHowItWorks,
  DecennaleQuiEstConcerne,
  DecennaleDureeEtGaranties,
  DecennaleAttestationSanction,
  DecennaleSourcesNote,
} from "@/components/insurance/DecennaleGuideSections";
import { addHowToSchema } from "@/utils/seoUtils";

// Schéma WebPage avec citation des sources du contenu de fond (même pattern
// que /assurance-velo, /assurance-sans-permis et /assurance-camping-car).
// Sources lues le 22 septembre 2026.
const decennaleWebPageSchema = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  "@id": "https://www.jemassuremoinscher.fr/assurance-decennale#webpage",
  "url": "https://www.jemassuremoinscher.fr/assurance-decennale",
  "name": "Assurance décennale BTP",
  "inLanguage": "fr-FR",
  "dateModified": "2026-09-22",
  "citation": [
    { "@type": "CreativeWork", "name": "Code des assurances — article L241-1", "url": "https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000006795912" },
    { "@type": "CreativeWork", "name": "Loi n° 78-12 du 4 janvier 1978 relative à la responsabilité et à l'assurance dans le domaine de la construction", "url": "https://www.legifrance.gouv.fr/loda/id/JORFTEXT000000522720" },
    { "@type": "CreativeWork", "name": "Code civil — article 1792", "url": "https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000006443502" },
    { "@type": "CreativeWork", "name": "Code civil — article 1792-1", "url": "https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000006443512" },
    { "@type": "CreativeWork", "name": "Code civil — article 1792-4-1", "url": "https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000019017055" },
    { "@type": "CreativeWork", "name": "Cour de cassation, assemblée plénière, 12 juillet 1991, pourvoi n° 90-13.602, publié au bulletin", "url": "https://www.legifrance.gouv.fr/affichJuriJudi.do?idTexte=JURITEXT000007027156" },
    { "@type": "CreativeWork", "name": "Code des assurances — article L243-2", "url": "https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000031010272" },
    { "@type": "CreativeWork", "name": "Code des assurances — article L243-3", "url": "https://www.legifrance.gouv.fr/loda/article_lc/LEGIARTI000006796023" },
    { "@type": "CreativeWork", "name": "SMABTP — Assurance décennale des professionnels du BTP", "url": "https://www.smabtp.fr/sma/assurance/besoins/assurance-decennale" },
  ],
};

// Même source que la section visible « Comment comparer… » (DecennaleHowItWorks) :
// le schéma ne peut pas diverger du contenu affiché.
const decennaleHowToSchema = addHowToSchema({
  name: "Comment comparer son assurance décennale",
  description: "Les quatre étapes du formulaire de devis pour comparer des assurances décennales avec un conseiller",
  totalTime: "PT2M",
  steps: DECENNALE_HOWTO_STEPS,
});

const AssuranceDecennale = () => (
  <VerticalInsurancePage
    slug="decennale"
    extraSchemas={[decennaleWebPageSchema, decennaleHowToSchema]}
    extraSection={
      <>
        <DecennaleHowItWorks />
        <DecennaleQuiEstConcerne />
        <DecennaleDureeEtGaranties />
        <DecennaleAttestationSanction />
        <DecennaleSourcesNote />
      </>
    }
    breadcrumbLabel="Garantie Décennale BTP"
    heroImage={arthurBtp}
    heroAlt="Arthur garantie décennale BTP"
    heroTitle="Assurance décennale BTP obligatoire"
    heroSubtitle="Maçon, plombier, électricien, artisan du bâtiment… Comparez les offres de plusieurs assureurs pour votre attestation décennale."
    seoTitle="Assurance décennale BTP 2026 | Comparateur artisans"
    seoDescription="Comparez les assurances décennales pour artisans du BTP. Qui est concerné, durée, attestation, sanctions : tout ce qu'il faut savoir."
    canonical="https://www.jemassuremoinscher.fr/assurance-decennale"
    keyword="assurance décennale"
    keywords="assurance décennale, garantie décennale, RC décennale, assurance artisan BTP, sous-traitant décennale"
    insuranceType="decennale"
    courtierProduct="decennale"
    serviceName="Assurance Décennale BTP"
    serviceDescription="Comparateur d'assurance décennale pour artisans et entreprises du bâtiment. Attestation rapide, tarifs négociés."
    productCategory="Assurance Professionnelle"
    expertiseLabel="assurance décennale"
    faqs={[
      { question: "La décennale est-elle obligatoire ?", answer: "Oui, pour toute personne dont la responsabilité décennale peut être engagée sur le fondement des articles 1792 et suivants du Code civil (article L241-1 du Code des assurances), depuis la loi Spinetta de 1978. Cela concerne les artisans et entreprises liés directement au maître d'ouvrage par un contrat de louage d'ouvrage (article 1792-1) — pas les sous-traitants au sens strict, voir plus bas." },
      { question: "Combien coûte une décennale ?", answer: "Le prix dépend du métier exercé (maçon, électricien…), du chiffre d'affaires, de l'expérience et de la sinistralité, et varie d'un assureur à l'autre. Nous ne publions pas de fourchette de prix : comparez des devis établis pour votre situation." },
      { question: "Quelle est la durée de la garantie ?", answer: "10 ans à compter de la réception des travaux (article 1792-4-1 du Code civil). Elle couvre les dommages qui compromettent la solidité de l'ouvrage ou qui, affectant l'un de ses éléments constitutifs ou d'équipement, le rendent impropre à sa destination (article 1792)." },
      { question: "Puis-je démarrer mes chantiers sans attestation ?", answer: "Non. L'attestation doit être jointe aux devis et factures (article L243-2 du Code des assurances). Ne pas être assuré est puni de six mois d'emprisonnement et de 75 000 € d'amende, ou de l'une de ces deux peines seulement (article L243-3)." },
      { question: "Un sous-traitant doit-il souscrire une garantie décennale ?", answer: "Pas légalement. L'article 1792-1 du Code civil réserve la qualité de « constructeur » à celui qui est lié au maître de l'ouvrage par un contrat direct — un sous-traitant est lié à l'entreprise principale, pas au maître d'ouvrage. La Cour de cassation l'a confirmé en assemblée plénière (12 juillet 1991) : l'action du maître d'ouvrage contre un sous-traitant n'est pas soumise au régime décennal. En pratique, une entreprise principale peut néanmoins l'exiger par contrat." },
      { question: "Quelles sont les autres garanties légales du BTP ?", answer: "Trois autres garanties encadrent un chantier : le parfait achèvement (1 an après réception, non assurable), le bon fonctionnement ou biennale (2 ans, pour les équipements dissociables) et l'assurance dommages-ouvrage, souscrite par le maître d'ouvrage lui-même, pas par l'artisan (selon SMABTP)." },
    ]}
    enBrefFacts={[
      <><BrandName /> compare les assureurs spécialistes décennale BTP.</>,
      "Attestation décennale en 48h après validation du dossier.",
      "Tous corps de métier : maçon, plombier, électricien, couvreur, plaquiste…",
      "Le tarif dépend du métier, du chiffre d'affaires et de l'expérience.",
    ]}
    ctaTitle="Prêt à obtenir votre attestation décennale ?"
    ctaDescription="Devis gratuit en 2 minutes pour artisans et entreprises du BTP."
  />
);
export default AssuranceDecennale;
