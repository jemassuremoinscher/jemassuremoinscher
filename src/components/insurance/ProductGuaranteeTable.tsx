import { Helmet } from "react-helmet-async";

/**
 * ProductGuaranteeTable
 * --------------------------------------------------------------
 * Tableau comparatif INTRA-PRODUIT (formules d'un même type d'assurance).
 * Différent de GuaranteeTable qui compare entre types (auto/moto/santé…).
 *
 * Objectif SEO/GEO : fournir un <table> HTML sémantique propre et facilement
 * extractible par les LLMs (ChatGPT, Perplexity, Gemini) avec garanties +
 * niveaux de couverture par formule.
 *
 * Aucun nouveau token de couleur. Réutilise strictement le design system
 * (border-border, bg-muted, text-emerald-600, text-muted-foreground).
 */

export type ProductKey =
  | "auto"
  | "moto"
  | "habitation"
  | "sante"
  | "animaux"
  | "pno"
  | "gli"
  | "mrp"
  | "rc-pro"
  | "pret"
  | "prevoyance"
  | "metiers-atypiques"
  | "gestion-locative"
  | "trottinette";

interface FormulaColumn {
  key: string;
  label: string;
  /** Tarif indicatif affiché en sous-titre de colonne */
  price?: string;
}

interface GuaranteeRow {
  /** Nom de la garantie */
  name: string;
  /** Valeur par colonne (clé = FormulaColumn.key) */
  values: Record<string, string>;
}

interface ProductTableData {
  title: string;
  intro: string;
  columns: FormulaColumn[];
  rows: GuaranteeRow[];
  /** Note légale / source */
  footnote?: string;
}

const DATA: Record<ProductKey, ProductTableData> = {
  auto: {
    title: "Garanties par formule — Assurance Auto",
    intro:
      "Comparatif des garanties incluses selon la formule choisie. Tarifs indicatifs constatés sur les devis 2025-2026 de nos 25+ assureurs partenaires.",
    columns: [
      { key: "tiers", label: "Au tiers", price: "dès 25€/mois" },
      { key: "intermediaire", label: "Tiers +", price: "dès 38€/mois" },
      { key: "tousrisques", label: "Tous risques", price: "dès 55€/mois" },
    ],
    rows: [
      { name: "Responsabilité civile", values: { tiers: "Incluse", intermediaire: "Incluse", tousrisques: "Incluse" } },
      { name: "Défense pénale & recours", values: { tiers: "Incluse", intermediaire: "Incluse", tousrisques: "Incluse" } },
      { name: "Vol & incendie", values: { tiers: "—", intermediaire: "Incluse", tousrisques: "Incluse" } },
      { name: "Bris de glace", values: { tiers: "—", intermediaire: "Incluse", tousrisques: "Incluse" } },
      { name: "Catastrophes naturelles & technologiques", values: { tiers: "Incluse", intermediaire: "Incluse", tousrisques: "Incluse" } },
      { name: "Dommages tous accidents", values: { tiers: "—", intermediaire: "—", tousrisques: "Incluse" } },
      { name: "Assistance 0 km", values: { tiers: "Option", intermediaire: "Option", tousrisques: "Incluse" } },
      { name: "Véhicule de remplacement", values: { tiers: "Option", intermediaire: "Option", tousrisques: "Incluse" } },
      { name: "Garantie conducteur", values: { tiers: "Option", intermediaire: "Incluse", tousrisques: "Incluse" } },
    ],
    footnote: "Économie moyenne constatée : 320€/an. Franchise dommages : 150 à 500€ selon contrat.",
  },
  moto: {
    title: "Garanties par formule — Assurance Moto",
    intro: "Couvertures pour 2-roues, scooters et motos selon la formule. Tarifs dès 15€/mois.",
    columns: [
      { key: "tiers", label: "Au tiers", price: "dès 15€/mois" },
      { key: "intermediaire", label: "Tiers +", price: "dès 28€/mois" },
      { key: "tousrisques", label: "Tous risques", price: "dès 45€/mois" },
    ],
    rows: [
      { name: "Responsabilité civile", values: { tiers: "Incluse", intermediaire: "Incluse", tousrisques: "Incluse" } },
      { name: "Défense pénale & recours", values: { tiers: "Incluse", intermediaire: "Incluse", tousrisques: "Incluse" } },
      { name: "Vol & tentative de vol", values: { tiers: "—", intermediaire: "Incluse", tousrisques: "Incluse" } },
      { name: "Incendie", values: { tiers: "—", intermediaire: "Incluse", tousrisques: "Incluse" } },
      { name: "Équipements du pilote (casque, blouson)", values: { tiers: "—", intermediaire: "Option", tousrisques: "Incluse" } },
      { name: "Dommages tous accidents", values: { tiers: "—", intermediaire: "—", tousrisques: "Incluse" } },
      { name: "Assistance 0 km", values: { tiers: "Option", intermediaire: "Option", tousrisques: "Incluse" } },
      { name: "Garantie conducteur", values: { tiers: "Option", intermediaire: "Incluse", tousrisques: "Incluse" } },
    ],
    footnote: "Tarifs variables selon cylindrée, usage et bonus-malus.",
  },
  habitation: {
    title: "Garanties par formule — Assurance Habitation",
    intro: "MRH propriétaire ou locataire, appartement ou maison. Tarifs dès 3€/mois.",
    columns: [
      { key: "essentielle", label: "Essentielle", price: "dès 3€/mois" },
      { key: "confort", label: "Confort", price: "dès 12€/mois" },
      { key: "premium", label: "Premium", price: "dès 22€/mois" },
    ],
    rows: [
      { name: "Responsabilité civile vie privée", values: { essentielle: "Incluse", confort: "Incluse", premium: "Incluse" } },
      { name: "Incendie & explosion", values: { essentielle: "Incluse", confort: "Incluse", premium: "Incluse" } },
      { name: "Dégâts des eaux", values: { essentielle: "Incluse", confort: "Incluse", premium: "Incluse" } },
      { name: "Vol & vandalisme", values: { essentielle: "—", confort: "Incluse", premium: "Incluse" } },
      { name: "Bris de glace (vitres, miroirs)", values: { essentielle: "—", confort: "Incluse", premium: "Incluse" } },
      { name: "Catastrophes naturelles", values: { essentielle: "Incluse", confort: "Incluse", premium: "Incluse" } },
      { name: "Objets de valeur (bijoux, art)", values: { essentielle: "—", confort: "Option", premium: "Incluse" } },
      { name: "Assistance habitation 24/7", values: { essentielle: "Option", confort: "Incluse", premium: "Incluse" } },
      { name: "Protection juridique", values: { essentielle: "Option", confort: "Option", premium: "Incluse" } },
    ],
    footnote: "Loi Hamon : résiliation à tout moment après 1 an de souscription.",
  },
  sante: {
    title: "Niveaux de remboursement — Mutuelle Santé",
    intro: "Niveaux de prise en charge selon la formule choisie. Tarifs dès 20€/mois selon âge et besoins.",
    columns: [
      { key: "eco", label: "Économique", price: "dès 20€/mois" },
      { key: "equilibre", label: "Équilibre", price: "dès 40€/mois" },
      { key: "renforcee", label: "Renforcée", price: "dès 75€/mois" },
    ],
    rows: [
      { name: "Hospitalisation (honoraires)", values: { eco: "100%", equilibre: "200%", renforcee: "300%" } },
      { name: "Chambre particulière", values: { eco: "—", equilibre: "60€/jour", renforcee: "100€/jour" } },
      { name: "Soins courants (généraliste)", values: { eco: "100%", equilibre: "150%", renforcee: "200%" } },
      { name: "Spécialistes (secteur 2)", values: { eco: "100%", equilibre: "200%", renforcee: "300%" } },
      { name: "Optique (verres + monture / 2 ans)", values: { eco: "100€", equilibre: "250€", renforcee: "400€" } },
      { name: "Dentaire (prothèses)", values: { eco: "125%", equilibre: "250%", renforcee: "400%" } },
      { name: "Orthodontie (- 16 ans)", values: { eco: "125%", equilibre: "250%", renforcee: "400%" } },
      { name: "Médecines douces (ostéo, acupuncture)", values: { eco: "—", equilibre: "150€/an", renforcee: "300€/an" } },
      { name: "Tiers payant intégral", values: { eco: "Incluse", equilibre: "Incluse", renforcee: "Incluse" } },
    ],
    footnote: "Pourcentages exprimés sur la base de remboursement Sécurité sociale (BR). 100% Santé inclus dans tous les niveaux.",
  },
  animaux: {
    title: "Garanties par formule — Assurance Animaux",
    intro: "Couverture chien, chat et NAC. Tarifs dès 8€/mois selon l'espèce, l'âge et la race.",
    columns: [
      { key: "essentielle", label: "Essentielle", price: "dès 8€/mois" },
      { key: "confort", label: "Confort", price: "dès 18€/mois" },
      { key: "premium", label: "Premium", price: "dès 35€/mois" },
    ],
    rows: [
      { name: "Taux de remboursement", values: { essentielle: "60%", confort: "80%", premium: "100%" } },
      { name: "Plafond annuel", values: { essentielle: "1 200€", confort: "2 000€", premium: "2 500€" } },
      { name: "Maladie", values: { essentielle: "Incluse", confort: "Incluse", premium: "Incluse" } },
      { name: "Accident", values: { essentielle: "Incluse", confort: "Incluse", premium: "Incluse" } },
      { name: "Chirurgie & hospitalisation", values: { essentielle: "Incluse", confort: "Incluse", premium: "Incluse" } },
      { name: "Médicaments prescrits", values: { essentielle: "Incluse", confort: "Incluse", premium: "Incluse" } },
      { name: "Examens & analyses", values: { essentielle: "Option", confort: "Incluse", premium: "Incluse" } },
      { name: "Prévention (vaccins, vermifuge)", values: { essentielle: "—", confort: "50€/an", premium: "100€/an" } },
      { name: "Assistance animaux", values: { essentielle: "Option", confort: "Incluse", premium: "Incluse" } },
    ],
    footnote: "Délai de carence standard : 7 jours pour accident, 45 jours pour maladie.",
  },
  pno: {
    title: "Garanties — Assurance PNO (Propriétaire Non Occupant)",
    intro: "Obligatoire en copropriété depuis la loi Alur (2014). Tarifs dès 5€/mois.",
    columns: [
      { key: "base", label: "Essentielle", price: "dès 5€/mois" },
      { key: "complete", label: "Complète", price: "dès 12€/mois" },
    ],
    rows: [
      { name: "Responsabilité civile propriétaire", values: { base: "Incluse", complete: "Incluse" } },
      { name: "Recours des locataires & voisins", values: { base: "Incluse", complete: "Incluse" } },
      { name: "Incendie & explosion", values: { base: "Incluse", complete: "Incluse" } },
      { name: "Dégâts des eaux", values: { base: "Incluse", complete: "Incluse" } },
      { name: "Catastrophes naturelles", values: { base: "Incluse", complete: "Incluse" } },
      { name: "Vandalisme & vol mobilier", values: { base: "—", complete: "Incluse" } },
      { name: "Loyers impayés (carence locative)", values: { base: "—", complete: "Option" } },
      { name: "Protection juridique bailleur", values: { base: "Option", complete: "Incluse" } },
    ],
    footnote: "Obligation légale loi Alur — article 9-1 de la loi du 10 juillet 1965.",
  },
  gli: {
    title: "Garanties — Garantie Loyers Impayés (GLI)",
    intro: "Protection du bailleur contre impayés et dégradations. Coût : 2,5% à 3,5% du loyer charges comprises.",
    columns: [
      { key: "standard", label: "Standard", price: "2,5% du loyer" },
      { key: "premium", label: "Premium", price: "3,5% du loyer" },
    ],
    rows: [
      { name: "Loyers impayés (charges incluses)", values: { standard: "Jusqu'à 70 000€", premium: "Illimité" } },
      { name: "Détériorations immobilières", values: { standard: "7 700€", premium: "10 000€" } },
      { name: "Frais de procédure & honoraires d'avocat", values: { standard: "Incluse", premium: "Incluse" } },
      { name: "Frais de contentieux", values: { standard: "Incluse", premium: "Incluse" } },
      { name: "Vacance locative entre deux locataires", values: { standard: "—", premium: "3 mois" } },
      { name: "Départs prématurés du locataire", values: { standard: "Option", premium: "Incluse" } },
      { name: "Délai de carence", values: { standard: "3 mois", premium: "2 mois" } },
    ],
    footnote: "Sélection du locataire selon critères de solvabilité (revenus ≥ 2,85x le loyer charges comprises).",
  },
  mrp: {
    title: "Garanties — Multirisque Professionnelle (MRP)",
    intro: "Protection des locaux, biens et activité professionnelle. Tarifs sur devis selon CA et secteur.",
    columns: [
      { key: "essentielle", label: "Essentielle" },
      { key: "confort", label: "Confort" },
      { key: "premium", label: "Premium" },
    ],
    rows: [
      { name: "Responsabilité civile professionnelle", values: { essentielle: "Incluse", confort: "Incluse", premium: "Incluse" } },
      { name: "Incendie, explosion, foudre", values: { essentielle: "Incluse", confort: "Incluse", premium: "Incluse" } },
      { name: "Dégâts des eaux", values: { essentielle: "Incluse", confort: "Incluse", premium: "Incluse" } },
      { name: "Vol & vandalisme", values: { essentielle: "Option", confort: "Incluse", premium: "Incluse" } },
      { name: "Bris de glace & enseignes", values: { essentielle: "Option", confort: "Incluse", premium: "Incluse" } },
      { name: "Marchandises & stocks", values: { essentielle: "Option", confort: "Incluse", premium: "Incluse" } },
      { name: "Pertes d'exploitation", values: { essentielle: "—", confort: "Option", premium: "Incluse" } },
      { name: "Bris de matériel informatique", values: { essentielle: "—", confort: "Option", premium: "Incluse" } },
      { name: "Protection juridique pro", values: { essentielle: "Option", confort: "Incluse", premium: "Incluse" } },
    ],
    footnote: "Tarifs adaptés selon secteur (commerce, artisanat, restauration, services).",
  },
  "rc-pro": {
    title: "Garanties — Responsabilité Civile Professionnelle",
    intro: "Couverture des dommages causés aux tiers dans l'exercice de l'activité. Tarifs sur devis.",
    columns: [
      { key: "base", label: "Base" },
      { key: "etendue", label: "Étendue" },
      { key: "premium", label: "Premium" },
    ],
    rows: [
      { name: "Dommages corporels causés aux tiers", values: { base: "1 M€", etendue: "5 M€", premium: "10 M€" } },
      { name: "Dommages matériels & immatériels", values: { base: "300 K€", etendue: "1 M€", premium: "3 M€" } },
      { name: "Faute professionnelle", values: { base: "Incluse", etendue: "Incluse", premium: "Incluse" } },
      { name: "Atteinte aux données / cyber", values: { base: "—", etendue: "Option", premium: "Incluse" } },
      { name: "Protection juridique professionnelle", values: { base: "Option", etendue: "Incluse", premium: "Incluse" } },
      { name: "Défense pénale du dirigeant", values: { base: "Option", etendue: "Incluse", premium: "Incluse" } },
      { name: "Reprise antérieure (rétroactivité)", values: { base: "—", etendue: "5 ans", premium: "Illimitée" } },
    ],
    footnote: "Obligatoire pour les professions réglementées (santé, droit, expertise comptable, BTP, conseil).",
  },
  pret: {
    title: "Garanties — Assurance Emprunteur Immobilier",
    intro: "Délégation d'assurance emprunteur (loi Lemoine). Économie moyenne : 5 000 à 15 000€ sur la durée du prêt.",
    columns: [
      { key: "base", label: "Base légale" },
      { key: "renforcee", label: "Renforcée" },
    ],
    rows: [
      { name: "Décès", values: { base: "Incluse", renforcee: "Incluse" } },
      { name: "Perte Totale et Irréversible d'Autonomie (PTIA)", values: { base: "Incluse", renforcee: "Incluse" } },
      { name: "Invalidité Permanente Totale (IPT)", values: { base: "Incluse", renforcee: "Incluse" } },
      { name: "Invalidité Permanente Partielle (IPP)", values: { base: "Option", renforcee: "Incluse" } },
      { name: "Incapacité Temporaire de Travail (ITT)", values: { base: "Option", renforcee: "Incluse" } },
      { name: "Perte d'emploi", values: { base: "—", renforcee: "Option" } },
      { name: "Quotité (couverture)", values: { base: "100%", renforcee: "100% à 200%" } },
      { name: "Suppression questionnaire santé (loi Lemoine)", values: { base: "Si prêt < 200 000€", renforcee: "Si prêt < 200 000€" } },
    ],
    footnote: "Loi Lemoine (2022) : changement possible à tout moment, sans frais. Suppression du questionnaire santé sous conditions.",
  },
  prevoyance: {
    title: "Garanties — Assurance Prévoyance",
    intro: "Maintien de revenus en cas d'arrêt de travail, invalidité ou décès. Indispensable pour TNS.",
    columns: [
      { key: "essentielle", label: "Essentielle" },
      { key: "complete", label: "Complète" },
      { key: "premium", label: "Premium" },
    ],
    rows: [
      { name: "Indemnités journalières (IJ) arrêt de travail", values: { essentielle: "30€/jour", complete: "80€/jour", premium: "150€/jour" } },
      { name: "Capital décès", values: { essentielle: "30 000€", complete: "100 000€", premium: "300 000€" } },
      { name: "Rente conjoint", values: { essentielle: "Option", complete: "Incluse", premium: "Incluse" } },
      { name: "Rente éducation enfants", values: { essentielle: "Option", complete: "Incluse", premium: "Incluse" } },
      { name: "Invalidité permanente partielle (IPP)", values: { essentielle: "Incluse", complete: "Incluse", premium: "Incluse" } },
      { name: "Invalidité permanente totale (IPT)", values: { essentielle: "Incluse", complete: "Incluse", premium: "Incluse" } },
      { name: "Frais d'obsèques", values: { essentielle: "—", complete: "5 000€", premium: "10 000€" } },
    ],
    footnote: "Loi Madelin : déductibilité fiscale des cotisations pour TNS (BNC, BIC, gérants majoritaires).",
  },
  "metiers-atypiques": {
    title: "Garanties — Métiers atypiques & risques aggravés",
    intro: "Couvertures spécialisées pour activités refusées par les assureurs généralistes (sports outdoor, BTP en hauteur, événementiel).",
    columns: [
      { key: "rcpro", label: "RC Pro spécialisée" },
      { key: "complete", label: "Pack Complet" },
    ],
    rows: [
      { name: "RC exploitation activité atypique", values: { rcpro: "Incluse", complete: "Incluse" } },
      { name: "RC encadrement / pratiquants", values: { rcpro: "Incluse", complete: "Incluse" } },
      { name: "Dommages aux équipements (cordes, harnais, structures)", values: { rcpro: "Option", complete: "Incluse" } },
      { name: "Travail en hauteur (cordistes, élagage)", values: { rcpro: "Incluse", complete: "Incluse" } },
      { name: "Événementiel (chapiteaux, tribunes, scène)", values: { rcpro: "Incluse", complete: "Incluse" } },
      { name: "Annulation / report d'événement", values: { rcpro: "—", complete: "Option" } },
      { name: "Protection juridique pro", values: { rcpro: "Option", complete: "Incluse" } },
      { name: "Multirisque locaux / matériel pro", values: { rcpro: "—", complete: "Incluse" } },
    ],
    footnote: "Taux de placement supérieur à 92% via 20 assureurs spécialisés (Hiscox, Albingia, MMA Pro Sport, Markel…).",
  },
  "gestion-locative": {
    title: "Garanties — Gestion Locative & Protection Bailleur",
    intro: "Couverture complète pour propriétaires bailleurs. Combine GLI, PNO et protection juridique.",
    columns: [
      { key: "essentielle", label: "Essentielle" },
      { key: "premium", label: "Premium" },
    ],
    rows: [
      { name: "Loyers impayés (GLI)", values: { essentielle: "Jusqu'à 70 000€", premium: "Illimité" } },
      { name: "Dégradations locatives", values: { essentielle: "7 700€", premium: "10 000€" } },
      { name: "Vacance locative", values: { essentielle: "—", premium: "3 mois" } },
      { name: "Frais de contentieux & avocat", values: { essentielle: "Incluse", premium: "Incluse" } },
      { name: "Assurance PNO (responsabilité civile bailleur)", values: { essentielle: "Incluse", premium: "Incluse" } },
      { name: "Protection juridique baux", values: { essentielle: "Option", premium: "Incluse" } },
      { name: "Assistance gestion (états des lieux, quittances)", values: { essentielle: "Option", premium: "Incluse" } },
    ],
    footnote: "Cumulable avec déduction fiscale des primes au régime réel d'imposition.",
  },
  trottinette: {
    title: "Garanties par formule — Assurance Trottinette Électrique",
    intro: "EDPM (RC obligatoire depuis 2019). Tarifs dès 2,90€/mois.",
    columns: [
      { key: "essentielle", label: "Essentielle", price: "dès 2,90€/mois" },
      { key: "confort", label: "Confort", price: "5-7€/mois" },
      { key: "tousrisques", label: "Tous risques", price: "8-12€/mois" },
    ],
    rows: [
      { name: "Responsabilité civile obligatoire", values: { essentielle: "Incluse", confort: "Incluse", tousrisques: "Incluse" } },
      { name: "Dommages aux tiers", values: { essentielle: "Incluse", confort: "Incluse", tousrisques: "Incluse" } },
      { name: "Individuelle conducteur", values: { essentielle: "—", confort: "Incluse", tousrisques: "Incluse" } },
      { name: "Assistance dépannage 24/7", values: { essentielle: "—", confort: "Incluse", tousrisques: "Incluse" } },
      { name: "Protection juridique", values: { essentielle: "—", confort: "Incluse", tousrisques: "Incluse" } },
      { name: "Vol (antivol homologué)", values: { essentielle: "—", confort: "—", tousrisques: "Incluse" } },
      { name: "Casse accidentelle", values: { essentielle: "—", confort: "—", tousrisques: "Incluse" } },
      { name: "Vandalisme & bris", values: { essentielle: "—", confort: "—", tousrisques: "Incluse" } },
      { name: "Couverture Europe", values: { essentielle: "—", confort: "—", tousrisques: "Incluse" } },
    ],
    footnote: "Prix constatés en France, mis à jour janvier 2026. RC obligatoire depuis 2019 (décret n°2019-1082).",
  },
};

interface ProductGuaranteeTableProps {
  product: ProductKey;
}

const ProductGuaranteeTable = ({ product }: ProductGuaranteeTableProps) => {
  const data = DATA[product];
  if (!data) return null;

  // JSON-LD Dataset pour aider l'extraction LLM/SEO
  const datasetSchema = {
    "@context": "https://schema.org",
    "@type": "Dataset",
    name: data.title,
    description: data.intro,
    creator: { "@type": "Organization", name: "jemassuremoinscher.fr" },
    temporalCoverage: "2026",
    keywords: [data.title, ...data.columns.map((c) => c.label), ...data.rows.map((r) => r.name)],
  };

  return (
    <>
      <Helmet>
        <script type="application/ld+json">{JSON.stringify(datasetSchema)}</script>
      </Helmet>
      <section
        className="max-w-5xl mx-auto mb-12"
        aria-labelledby={`product-guarantees-${product}`}
        data-ai-description={`Tableau comparatif des garanties par formule pour ${data.title}.`}
      >
        <h2
          id={`product-guarantees-${product}`}
          className="text-xl md:text-2xl font-bold text-foreground mb-2"
        >
          {data.title}
        </h2>
        <p className="text-sm text-muted-foreground mb-6">{data.intro}</p>

        {/* Desktop / tablet : table sémantique */}
        <div className="hidden md:block overflow-hidden rounded-2xl border border-primary/15 bg-card shadow-elevation-2">
          <table className="w-full text-sm border-collapse">
            <caption className="sr-only">{data.title}</caption>
            <thead>
              <tr className="bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10">
                <th scope="col" className="text-left p-4 font-bold text-foreground text-sm uppercase tracking-wide">
                  Garantie
                </th>
                {data.columns.map((col) => (
                  <th
                    key={col.key}
                    scope="col"
                    className="p-4 text-center font-bold text-foreground text-sm uppercase tracking-wide border-l border-primary/10"
                  >
                    <div className="text-primary">{col.label}</div>
                    {col.price && (
                      <div className="text-[11px] font-medium text-muted-foreground mt-1 normal-case tracking-normal">
                        {col.price}
                      </div>
                    )}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.rows.map((row, i) => (
                <tr
                  key={row.name}
                  className={`group transition-colors duration-200 ${
                    i % 2 === 0 ? "bg-background" : "bg-primary/[0.04]"
                  } hover:bg-primary/[0.08] border-t border-border/30`}
                >
                  <th scope="row" className="text-left p-3.5 font-medium text-foreground group-hover:text-primary transition-colors">
                    {row.name}
                  </th>
                  {data.columns.map((col) => {
                    const val = row.values[col.key] ?? "—";
                    const isIncluded = val === "Incluse";
                    const isOption = val === "Option";
                    const isDash = val === "—";
                    return (
                      <td
                        key={col.key}
                        className="p-3.5 text-center text-sm border-l border-border/20"
                      >
                        {isIncluded ? (
                          <span className="inline-flex items-center gap-1 text-success font-semibold">
                            <span aria-hidden="true">✓</span> Incluse
                          </span>
                        ) : isOption ? (
                          <span className="inline-flex items-center rounded-full bg-secondary/20 text-foreground px-2.5 py-0.5 text-[11px] font-semibold">
                            Option
                          </span>
                        ) : isDash ? (
                          <span className="text-muted-foreground/40" aria-label="Non disponible">—</span>
                        ) : (
                          <span className="text-foreground font-semibold">{val}</span>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile : cards lisibles */}
        <div className="md:hidden space-y-3">
          {data.rows.map((row, i) => (
            <div
              key={row.name}
              className={`rounded-2xl border border-primary/15 p-4 transition-colors ${
                i % 2 === 0 ? "bg-card" : "bg-primary/[0.04]"
              }`}
            >
              <p className="font-semibold text-foreground text-sm mb-3 pb-2 border-b border-border/30">
                {row.name}
              </p>
              <div className="grid grid-cols-1 gap-y-2">
                {data.columns.map((col) => {
                  const val = row.values[col.key] ?? "—";
                  const isIncluded = val === "Incluse";
                  const isOption = val === "Option";
                  const isDash = val === "—";
                  return (
                    <div key={col.key} className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground font-medium">
                        {col.label}
                      </span>
                      {isIncluded ? (
                        <span className="text-success font-semibold">✓ Incluse</span>
                      ) : isOption ? (
                        <span className="inline-flex items-center rounded-full bg-secondary/20 text-foreground px-2 py-0.5 text-[10px] font-semibold">
                          Option
                        </span>
                      ) : isDash ? (
                        <span className="text-muted-foreground/40">—</span>
                      ) : (
                        <span className="text-foreground font-semibold">{val}</span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {data.footnote && (
          <p className="text-xs text-muted-foreground mt-4 italic">{data.footnote}</p>
        )}
      </section>
    </>
  );
};

export default ProductGuaranteeTable;
