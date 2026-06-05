import VerticalInsurancePage from "@/components/insurance/VerticalInsurancePage";
import BrandName from "@/components/BrandName";
import arthurDetective from "@/assets/mascotte/arthur-detective.webp";

const AssuranceCyber = () => (
  <VerticalInsurancePage
    slug="cyber"
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
    productKey="rc-pro"
    serviceName="Assurance Cyber-risques"
    serviceDescription="Comparateur d'assurance cyber pour entreprises. Couverture ransomware, RGPD, fraude, perte d'exploitation IT."
    productCategory="Assurance Professionnelle"
    expertiseLabel="assurance cyber"
    faqs={[
      { question: "Quels risques couvre une cyber-assurance ?", answer: "Ransomware, vol/fuite de données, atteinte RGPD, fraude au président, intrusion système, perte d'exploitation IT, frais d'experts (forensic, négociation, juridique, PR)." },
      { question: "Combien coûte une assurance cyber ?", answer: "À partir de 600€/an pour une TPE, 2 000–10 000€/an pour une PME, et davantage selon le CA, le secteur et le niveau de garantie." },
      { question: "Faut-il un audit cyber préalable ?", answer: "Oui, les assureurs exigent un questionnaire technique (MFA, sauvegardes, EDR, plan de continuité). Une bonne hygiène cyber réduit fortement la prime." },
      { question: "L'assurance paie-t-elle la rançon ?", answer: "Cela dépend du contrat et de la juridiction. La tendance est plutôt à financer la récupération (forensic, restauration) plutôt que la rançon, et à exclure si négociation avec entité sanctionnée." },
    ]}
    enBrefFacts={[
      <><BrandName /> compare les assurances cyber TPE et PME.</>,
      "Couverture ransomware, RGPD, fraude au président, perte d'exploitation IT.",
      "Cellule de crise H24 incluse : forensic, juridique, communication.",
      "Tarifs dès 600€/an pour une TPE.",
    ]}
    ctaTitle="Prêt à protéger votre entreprise contre les cyber-risques ?"
    ctaDescription="Devis cyber gratuit en 2 minutes pour TPE et PME."
  />
);
export default AssuranceCyber;
