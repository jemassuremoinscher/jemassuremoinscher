import VerticalInsurancePage from "@/components/insurance/VerticalInsurancePage";
import BrandName from "@/components/BrandName";
import arthurDetective from "@/assets/mascotte/arthur-detective.webp";
import { CyberObligationEtDelai, CyberSourcesNote } from "@/components/insurance/CyberGuideSections";

// Citation de source ajoutée le 2026-09-24 (traitement léger). Sources lues
// le même jour.
const cyberWebPageSchema = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  "@id": "https://www.jemassuremoinscher.fr/assurance-cyber#webpage",
  "url": "https://www.jemassuremoinscher.fr/assurance-cyber",
  "name": "Assurance cyber-risques pour entreprises",
  "inLanguage": "fr-FR",
  "dateModified": "2026-09-24",
  "citation": [
    { "@type": "CreativeWork", "name": "Code des assurances — article L12-10-1", "url": "https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000047048152" },
  ],
};

const AssuranceCyber = () => (
  <VerticalInsurancePage
    slug="cyber"
    extraSchemas={[cyberWebPageSchema]}
    extraSection={
      <>
        <CyberObligationEtDelai />
        <CyberSourcesNote />
      </>
    }
    breadcrumbLabel="Assurance Cyber-risques"
    heroImage={arthurDetective}
    heroAlt="Arthur assurance cyber"
    heroTitle="Assurance cyber-risques pour entreprises"
    heroSubtitle="Ransomware, fuite RGPD, fraude au président, perte d'exploitation IT… Couvrez votre entreprise contre les menaces numériques 2026."
    seoTitle="Assurance cyber-risques entreprise 2026 | Comparateur"
    seoDescription="Comparez les assurances cyber pour entreprises. Ransomware, RGPD, fraude, perte d'exploitation. Devis gratuit en 2 min."
    canonical="https://www.jemassuremoinscher.fr/assurance-cyber"
    keyword="assurance cyber"
    keywords="assurance cyber, assurance cyber-risques, ransomware, RGPD, fuite de données"
    insuranceType="cyber"
    courtierProduct="cyber"
    serviceName="Assurance Cyber-risques"
    serviceDescription="Comparateur d'assurance cyber pour entreprises. Couverture ransomware, RGPD, fraude, perte d'exploitation IT."
    productCategory="Assurance Professionnelle"
    expertiseLabel="assurance cyber"
    faqs={[
      { question: "Quels risques couvre une cyber-assurance ?", answer: "Ransomware, vol/fuite de données, atteinte RGPD, fraude au président, intrusion système, perte d'exploitation IT, frais d'experts (forensic, négociation, juridique, PR)." },
      { question: "Combien coûte une assurance cyber ?", answer: "Le prix dépend de la taille de l'entreprise, de son chiffre d'affaires, de son secteur, de son niveau de sécurité informatique et des garanties choisies. Nous ne publions pas de fourchette de prix : comparez des devis établis pour votre situation." },
      { question: "Faut-il un audit cyber préalable ?", answer: "Oui, les assureurs exigent un questionnaire technique (MFA, sauvegardes, EDR, plan de continuité). Une bonne hygiène cyber réduit fortement la prime." },
      { question: "L'assurance paie-t-elle la rançon ?", answer: "Cela dépend du contrat et de la juridiction. La tendance est plutôt à financer la récupération (forensic, restauration) plutôt que la rançon, et à exclure si négociation avec entité sanctionnée." },
      { question: "La cyber-assurance est-elle obligatoire ?", answer: "Non, aucun texte n'impose aux TPE/PME de la souscrire. Mais si vous en avez une, l'indemnisation en cas d'attaque malveillante est conditionnée au dépôt d'une plainte dans les 72 heures suivant la connaissance de l'attaque (Code des assurances, art. L12-10-1, issu de la loi LOPMI du 24 janvier 2023)." },
    ]}
    enBrefFacts={[
      <><BrandName /> compare les assurances cyber TPE et PME.</>,
      "Couverture ransomware, RGPD, fraude au président, perte d'exploitation IT.",
      "Selon les contrats : assistance en cas d'incident (analyse forensique, conseil juridique, communication de crise).",
      "Le tarif dépend de la taille de l'entreprise, de son secteur et de son niveau de sécurité informatique.",
    ]}
    ctaTitle="Prêt à protéger votre entreprise contre les cyber-risques ?"
    ctaDescription="Devis cyber gratuit en 2 minutes pour TPE et PME."
  />
);
export default AssuranceCyber;
