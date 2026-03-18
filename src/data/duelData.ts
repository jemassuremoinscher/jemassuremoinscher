export interface InsurerDuelProfile {
  slug: string;
  name: string;
  logo: string;
  prixMoyen: number;
  franchise: number;
  assistance0km: boolean;
  avisNote: number;
  avisCount: number;
  rapiditeRemboursement: string;
  rapiditeJours: number;
  pointsForts: string[];
  pointsFaibles: string[];
}

export interface DuelConfig {
  slug: string;
  insurerA: InsurerDuelProfile;
  insurerB: InsurerDuelProfile;
}

// Static imports for logos
import logoMaif from "@/assets/logos/maif.webp";
import logoMacif from "@/assets/logos/macif-new.png";
import logoAxa from "@/assets/logos/axa.webp";
import logoAllianz from "@/assets/logos/allianz.webp";
import logoDirectAssurance from "@/assets/logos/direct-assurance-new.webp";
import logoMaaf from "@/assets/logos/maaf.webp";
import logoGmf from "@/assets/logos/gmf-new.png";
import logoMatmut from "@/assets/logos/matmut.webp";
import logoMma from "@/assets/logos/mma-new.webp";
import logoGroupama from "@/assets/logos/groupama.png";
import logoOlivier from "@/assets/logos/lolivier.webp";
import logoLuko from "@/assets/logos/luko.png";
import logoGenerali from "@/assets/logos/generali-new.png";
import logoApril from "@/assets/logos/april-new.png";
import logoSwissLife from "@/assets/logos/swisslife.webp";
import logoAbeille from "@/assets/logos/abeille.webp";
import logoAlan from "@/assets/logos/alan-new.webp";
import logoHarmonie from "@/assets/logos/harmonie-mutuelle.png";
import logoAcheel from "@/assets/logos/acheel.webp";
import logoAg2r from "@/assets/logos/ag2r.png";

const insurerProfiles: Record<string, InsurerDuelProfile> = {
  maif: {
    slug: "maif",
    name: "MAIF",
    logo: logoMaif,
    prixMoyen: 580,
    franchise: 250,
    assistance0km: true,
    avisNote: 4.6,
    avisCount: 3200,
    rapiditeRemboursement: "48h",
    rapiditeJours: 2,
    pointsForts: ["Service client réputé n°1", "Garantie corporelle étendue", "Protection du bonus"],
    pointsFaibles: ["Pas le moins cher", "Réseau d'agences limité"],
  },
  macif: {
    slug: "macif",
    name: "Macif",
    logo: logoMacif,
    prixMoyen: 620,
    franchise: 300,
    assistance0km: true,
    avisNote: 4.3,
    avisCount: 2800,
    rapiditeRemboursement: "72h",
    rapiditeJours: 3,
    pointsForts: ["Assistance panne 0km", "Réseau d'agences étendu", "Protection familiale"],
    pointsFaibles: ["Franchise élevée", "Remboursement plus lent"],
  },
  axa: {
    slug: "axa",
    name: "AXA",
    logo: logoAxa,
    prixMoyen: 650,
    franchise: 350,
    assistance0km: false,
    avisNote: 4.1,
    avisCount: 4500,
    rapiditeRemboursement: "5 jours",
    rapiditeJours: 5,
    pointsForts: ["Leader européen", "Large gamme de produits", "Application mobile complète"],
    pointsFaibles: ["Prix élevé", "Pas d'assistance 0km de base"],
  },
  allianz: {
    slug: "allianz",
    name: "Allianz",
    logo: logoAllianz,
    prixMoyen: 640,
    franchise: 300,
    assistance0km: false,
    avisNote: 4.2,
    avisCount: 3800,
    rapiditeRemboursement: "72h",
    rapiditeJours: 3,
    pointsForts: ["Protection juridique incluse", "Bris de glace avantageux", "Réseau européen"],
    pointsFaibles: ["Assistance 0km en option", "Tarifs premium"],
  },
  "direct-assurance": {
    slug: "direct-assurance",
    name: "Direct Assurance",
    logo: logoDirectAssurance,
    prixMoyen: 450,
    franchise: 400,
    assistance0km: false,
    avisNote: 3.8,
    avisCount: 2100,
    rapiditeRemboursement: "5 jours",
    rapiditeJours: 5,
    pointsForts: ["Prix très compétitif", "Souscription 100% en ligne", "Réductions digitales -15%"],
    pointsFaibles: ["Pas d'agence physique", "Service client téléphonique uniquement"],
  },
  maaf: {
    slug: "maaf",
    name: "MAAF",
    logo: logoMaaf,
    prixMoyen: 560,
    franchise: 200,
    assistance0km: true,
    avisNote: 4.4,
    avisCount: 3500,
    rapiditeRemboursement: "48h",
    rapiditeJours: 2,
    pointsForts: ["Franchise basse", "Assistance dépannage incluse", "Bon rapport qualité/prix"],
    pointsFaibles: ["Application mobile basique", "Options limitées"],
  },
  gmf: {
    slug: "gmf",
    name: "GMF",
    logo: logoGmf,
    prixMoyen: 590,
    franchise: 280,
    assistance0km: true,
    avisNote: 4.3,
    avisCount: 2600,
    rapiditeRemboursement: "48h",
    rapiditeJours: 2,
    pointsForts: ["Garantie accessoires", "Protection juridique", "Tarifs fonctionnaires avantageux"],
    pointsFaibles: ["Réservé aux fonctionnaires à l'origine", "Moins connu"],
  },
  matmut: {
    slug: "matmut",
    name: "Matmut",
    logo: logoMatmut,
    prixMoyen: 610,
    franchise: 320,
    assistance0km: true,
    avisNote: 4.2,
    avisCount: 2900,
    rapiditeRemboursement: "72h",
    rapiditeJours: 3,
    pointsForts: ["Garantie du conducteur étendue", "Réseau d'agences dense", "Catastrophes naturelles"],
    pointsFaibles: ["Franchise moyenne", "Remboursement en 3 jours"],
  },
  mma: {
    slug: "mma",
    name: "MMA",
    logo: logoMma,
    prixMoyen: 670,
    franchise: 350,
    assistance0km: false,
    avisNote: 4.0,
    avisCount: 2400,
    rapiditeRemboursement: "5 jours",
    rapiditeJours: 5,
    pointsForts: ["Protection familiale complète", "Assistance internationale", "Options premium"],
    pointsFaibles: ["Prix élevé", "Remboursement lent"],
  },
  groupama: {
    slug: "groupama",
    name: "Groupama",
    logo: logoGroupama,
    prixMoyen: 630,
    franchise: 300,
    assistance0km: true,
    avisNote: 4.1,
    avisCount: 2700,
    rapiditeRemboursement: "72h",
    rapiditeJours: 3,
    pointsForts: ["Assistance voyage", "Garantie valeur à neuf", "Réseau rural étendu"],
    pointsFaibles: ["Prix au-dessus de la moyenne", "Application mobile limitée"],
  },
  "l-olivier": {
    slug: "l-olivier",
    name: "L'Olivier Assurance",
    logo: logoOlivier,
    prixMoyen: 480,
    franchise: 350,
    assistance0km: false,
    avisNote: 4.0,
    avisCount: 1800,
    rapiditeRemboursement: "5 jours",
    rapiditeJours: 5,
    pointsForts: ["Prix compétitif", "100% en ligne", "Devis rapide"],
    pointsFaibles: ["Pas d'agence", "Options de garanties limitées"],
  },
  luko: {
    slug: "luko",
    name: "Luko",
    logo: logoLuko,
    prixMoyen: 420,
    franchise: 200,
    assistance0km: true,
    avisNote: 4.5,
    avisCount: 1500,
    rapiditeRemboursement: "24h",
    rapiditeJours: 1,
    pointsForts: ["Remboursement ultra-rapide 24h", "100% digital", "Prix très bas"],
    pointsFaibles: ["Jeune assureur", "Moins de garanties premium"],
  },
  // ─── 8 nouveaux assureurs ─────────────────────────────────────────────
  generali: {
    slug: "generali",
    name: "Generali",
    logo: logoGenerali,
    prixMoyen: 660,
    franchise: 350,
    assistance0km: false,
    avisNote: 4.0,
    avisCount: 3100,
    rapiditeRemboursement: "5 jours",
    rapiditeJours: 5,
    pointsForts: ["Solidité financière top 3 Europe", "Gamme complète pro & particulier", "Assurance vie reconnue"],
    pointsFaibles: ["Tarifs élevés segment auto", "Assistance 0km absente"],
  },
  april: {
    slug: "april",
    name: "April",
    logo: logoApril,
    prixMoyen: 520,
    franchise: 280,
    assistance0km: true,
    avisNote: 4.3,
    avisCount: 1900,
    rapiditeRemboursement: "48h",
    rapiditeJours: 2,
    pointsForts: ["Courtier indépendant multi-compagnies", "Spécialiste santé & prévoyance", "Souscription digitale rapide"],
    pointsFaibles: ["Moins connu du grand public", "Réseau physique limité"],
  },
  "swiss-life": {
    slug: "swiss-life",
    name: "Swiss Life",
    logo: logoSwissLife,
    prixMoyen: 700,
    franchise: 400,
    assistance0km: false,
    avisNote: 4.1,
    avisCount: 2200,
    rapiditeRemboursement: "5 jours",
    rapiditeJours: 5,
    pointsForts: ["N°1 assurance patrimoniale", "Prévoyance haut de gamme", "Conseil en gestion de patrimoine"],
    pointsFaibles: ["Tarifs premium élevés", "Pas d'offre auto low-cost"],
  },
  abeille: {
    slug: "abeille",
    name: "Abeille Assurances",
    logo: logoAbeille,
    prixMoyen: 600,
    franchise: 300,
    assistance0km: true,
    avisNote: 4.1,
    avisCount: 2500,
    rapiditeRemboursement: "72h",
    rapiditeJours: 3,
    pointsForts: ["Réseau d'agents généraux dense", "Historique Aviva solide", "Offre multi-produits"],
    pointsFaibles: ["Transition de marque récente", "Digital en retard"],
  },
  alan: {
    slug: "alan",
    name: "Alan",
    logo: logoAlan,
    prixMoyen: 490,
    franchise: 250,
    assistance0km: true,
    avisNote: 4.7,
    avisCount: 1400,
    rapiditeRemboursement: "24h",
    rapiditeJours: 1,
    pointsForts: ["UX/UI best-in-class", "Remboursement en 24h", "Transparence totale des prix"],
    pointsFaibles: ["Spécialisé santé, auto limité", "Jeune entreprise"],
  },
  harmonie: {
    slug: "harmonie",
    name: "Harmonie Mutuelle",
    logo: logoHarmonie,
    prixMoyen: 570,
    franchise: 260,
    assistance0km: true,
    avisNote: 4.3,
    avisCount: 3400,
    rapiditeRemboursement: "48h",
    rapiditeJours: 2,
    pointsForts: ["1ère mutuelle de France", "Réseau de soins étendu", "Prévention santé intégrée"],
    pointsFaibles: ["Principalement santé/prévoyance", "Auto en second plan"],
  },
  acheel: {
    slug: "acheel",
    name: "Acheel",
    logo: logoAcheel,
    prixMoyen: 410,
    franchise: 300,
    assistance0km: false,
    avisNote: 4.2,
    avisCount: 900,
    rapiditeRemboursement: "48h",
    rapiditeJours: 2,
    pointsForts: ["100% digital nouvelle génération", "Prix ultra-compétitifs", "Souscription en 3 min"],
    pointsFaibles: ["Très jeune assureur", "Peu de recul sur les sinistres"],
  },
  ag2r: {
    slug: "ag2r",
    name: "AG2R La Mondiale",
    logo: logoAg2r,
    prixMoyen: 620,
    franchise: 300,
    assistance0km: true,
    avisNote: 4.0,
    avisCount: 2600,
    rapiditeRemboursement: "72h",
    rapiditeJours: 3,
    pointsForts: ["Spécialiste retraite & prévoyance", "Accompagnement personnalisé", "Solidité financière"],
    pointsFaibles: ["Interface digitale ancienne", "Offre auto limitée"],
  },
};

// Popular duel combinations (20 duels couvrant les 20 assureurs)
const popularDuels: [string, string][] = [
  ["maif", "macif"],
  ["axa", "allianz"],
  ["direct-assurance", "l-olivier"],
  ["maaf", "gmf"],
  ["matmut", "mma"],
  ["maif", "axa"],
  ["macif", "groupama"],
  ["direct-assurance", "luko"],
  ["gmf", "matmut"],
  ["allianz", "maaf"],
  ["axa", "maaf"],
  ["maif", "gmf"],
  // Nouveaux duels avec les 8 ajoutés
  ["generali", "axa"],
  ["april", "alan"],
  ["acheel", "direct-assurance"],
  ["abeille", "groupama"],
  ["harmonie", "ag2r"],
  ["swiss-life", "generali"],
  ["luko", "acheel"],
  ["alan", "april"],
];

export function getDuelBySlug(slug: string): DuelConfig | null {
  // Handle multi-hyphen slugs like "direct-assurance-vs-l-olivier"
  const vsIndex = slug.indexOf("-vs-");
  if (vsIndex === -1) return null;
  const slugA = slug.substring(0, vsIndex);
  const slugB = slug.substring(vsIndex + 4);
  const a = insurerProfiles[slugA];
  const b = insurerProfiles[slugB];
  if (!a || !b) return null;
  return { slug, insurerA: a, insurerB: b };
}

export function getAllDuels(): DuelConfig[] {
  return popularDuels.map(([a, b]) => ({
    slug: `${a}-vs-${b}`,
    insurerA: insurerProfiles[a],
    insurerB: insurerProfiles[b],
  }));
}

export function getAllInsurerSlugs(): string[] {
  return Object.keys(insurerProfiles);
}

export function getInsurerBySlug(slug: string): InsurerDuelProfile | undefined {
  return insurerProfiles[slug];
}
