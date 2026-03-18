export interface InsurerDuelProfile {
  slug: string;
  name: string;
  logo: string;
  prixMoyen: number;
  franchise: number;
  assistance0km: boolean;
  avisNote: number;
  avisCount: number;
  rapiditeRemboursement: string; // "24h", "48h", "5 jours"
  rapiditeJours: number;
  pointsForts: string[];
  pointsFaibles: string[];
}

export interface DuelConfig {
  slug: string; // e.g. "maif-vs-macif"
  insurerA: InsurerDuelProfile;
  insurerB: InsurerDuelProfile;
}

// Use static imports for real logos
import logoMaif from "@/assets/logos/maif.png";
import logoMacif from "@/assets/logos/macif-new.png";
import logoAxa from "@/assets/logos/axa.png";
import logoAllianz from "@/assets/logos/allianz.png";
import logoDirectAssurance from "@/assets/logos/direct-assurance-new.png";
import logoMaaf from "@/assets/logos/maaf.webp";
import logoGmf from "@/assets/logos/gmf-new.png";
import logoMatmut from "@/assets/logos/matmut-new.jpg";
import logoMma from "@/assets/logos/mma-new.webp";
import logoGroupama from "@/assets/logos/groupama.png";
import logoOlivier from "@/assets/logos/lolivier.png";
import logoLuko from "@/assets/logos/luko.png";

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
    pointsForts: ["Service client réputé", "Garantie corporelle étendue", "Protection du bonus"],
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
    pointsForts: ["Marque internationale", "Large gamme de produits", "Application mobile complète"],
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
    logo: "/src/assets/logos/matmut-new.jpg",
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
    logo: "/src/assets/logos/mma-new.webp",
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
    logo: "/src/assets/logos/groupama.png",
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
    logo: "/src/assets/logos/lolivier.png",
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
    logo: "/src/assets/logos/luko.png",
    prixMoyen: 420,
    franchise: 200,
    assistance0km: true,
    avisNote: 4.5,
    avisCount: 1500,
    rapiditeRemboursement: "24h",
    rapiditeJours: 1,
    pointsForts: ["Remboursement ultra-rapide", "100% digital", "Prix très bas"],
    pointsFaibles: ["Jeune assureur", "Moins de garanties premium"],
  },
};

// Popular duel combinations
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
];

export function getDuelBySlug(slug: string): DuelConfig | null {
  const parts = slug.split("-vs-");
  if (parts.length !== 2) return null;
  const a = insurerProfiles[parts[0]];
  const b = insurerProfiles[parts[1]];
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
