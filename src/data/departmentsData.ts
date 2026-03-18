export interface DepartmentData {
  code: string;
  name: string;
  slug: string;
  avgPriceAuto: number;
  avgPriceSante: number;
  avgPriceHabitation: number;
  topInsurers: { name: string; price: number; logo: string }[];
}

// Moyenne nationale de référence
export const NATIONAL_AVG_AUTO = 620;
export const NATIONAL_AVG_SANTE = 45;
export const NATIONAL_AVG_HABITATION = 180;

// Seed déterministe basé sur le code département
function seededVariation(code: string, base: number, range: number): number {
  let hash = 0;
  for (let i = 0; i < code.length; i++) {
    hash = ((hash << 5) - hash) + code.charCodeAt(i);
    hash |= 0;
  }
  const factor = ((Math.abs(hash) % 1000) / 1000) * range * 2 - range;
  return Math.round(base + factor);
}

const logoMap: Record<string, string> = {
  "Direct Assurance": "/src/assets/logos/direct-assurance-new.png",
  "Allianz": "/src/assets/logos/allianz.png",
  "Axa": "/src/assets/logos/axa.png",
  "MAIF": "/src/assets/logos/maif.png",
  "Macif": "/src/assets/logos/macif-new.png",
  "MAAF": "/src/assets/logos/maaf.webp",
  "GMF": "/src/assets/logos/gmf-new.png",
  "Matmut": "/src/assets/logos/matmut-new.jpg",
  "MMA": "/src/assets/logos/mma-new.webp",
  "Groupama": "/src/assets/logos/groupama.png",
  "Luko": "/src/assets/logos/luko.png",
  "L'Olivier": "/src/assets/logos/lolivier.png",
};

const insurerPool = [
  "Direct Assurance", "Allianz", "Axa", "MAIF", "Macif",
  "MAAF", "GMF", "Matmut", "MMA", "Groupama", "Luko", "L'Olivier"
];

function getTopInsurers(code: string, avgPrice: number): { name: string; price: number; logo: string }[] {
  let hash = 0;
  for (let i = 0; i < code.length; i++) {
    hash = ((hash << 5) - hash) + code.charCodeAt(i);
    hash |= 0;
  }
  const shuffled = [...insurerPool].sort((a, b) => {
    const ha = Math.abs((hash * a.charCodeAt(0)) % 1000);
    const hb = Math.abs((hash * b.charCodeAt(0)) % 1000);
    return ha - hb;
  });
  return shuffled.slice(0, 3).map((name, i) => ({
    name,
    price: Math.round(avgPrice * (0.78 + i * 0.08 + (Math.abs(hash + i) % 50) / 500)),
    logo: logoMap[name] || "/src/assets/logos/allianz.png",
  }));
}

const rawDepartments: [string, string][] = [
  ["01", "Ain"], ["02", "Aisne"], ["03", "Allier"], ["04", "Alpes-de-Haute-Provence"],
  ["05", "Hautes-Alpes"], ["06", "Alpes-Maritimes"], ["07", "Ardèche"], ["08", "Ardennes"],
  ["09", "Ariège"], ["10", "Aube"], ["11", "Aude"], ["12", "Aveyron"],
  ["13", "Bouches-du-Rhône"], ["14", "Calvados"], ["15", "Cantal"], ["16", "Charente"],
  ["17", "Charente-Maritime"], ["18", "Cher"], ["19", "Corrèze"], ["21", "Côte-d'Or"],
  ["22", "Côtes-d'Armor"], ["23", "Creuse"], ["24", "Dordogne"], ["25", "Doubs"],
  ["26", "Drôme"], ["27", "Eure"], ["28", "Eure-et-Loir"], ["29", "Finistère"],
  ["30", "Gard"], ["31", "Haute-Garonne"], ["32", "Gers"], ["33", "Gironde"],
  ["34", "Hérault"], ["35", "Ille-et-Vilaine"], ["36", "Indre"], ["37", "Indre-et-Loire"],
  ["38", "Isère"], ["39", "Jura"], ["40", "Landes"], ["41", "Loir-et-Cher"],
  ["42", "Loire"], ["43", "Haute-Loire"], ["44", "Loire-Atlantique"], ["45", "Loiret"],
  ["46", "Lot"], ["47", "Lot-et-Garonne"], ["48", "Lozère"], ["49", "Maine-et-Loire"],
  ["50", "Manche"], ["51", "Marne"], ["52", "Haute-Marne"], ["53", "Mayenne"],
  ["54", "Meurthe-et-Moselle"], ["55", "Meuse"], ["56", "Morbihan"], ["57", "Moselle"],
  ["58", "Nièvre"], ["59", "Nord"], ["60", "Oise"], ["61", "Orne"],
  ["62", "Pas-de-Calais"], ["63", "Puy-de-Dôme"], ["64", "Pyrénées-Atlantiques"],
  ["65", "Hautes-Pyrénées"], ["66", "Pyrénées-Orientales"], ["67", "Bas-Rhin"],
  ["68", "Haut-Rhin"], ["69", "Rhône"], ["70", "Haute-Saône"], ["71", "Saône-et-Loire"],
  ["72", "Sarthe"], ["73", "Savoie"], ["74", "Haute-Savoie"], ["75", "Paris"],
  ["76", "Seine-Maritime"], ["77", "Seine-et-Marne"], ["78", "Yvelines"],
  ["79", "Deux-Sèvres"], ["80", "Somme"], ["81", "Tarn"], ["82", "Tarn-et-Garonne"],
  ["83", "Var"], ["84", "Vaucluse"], ["85", "Vendée"], ["86", "Vienne"],
  ["87", "Haute-Vienne"], ["88", "Vosges"], ["89", "Yonne"], ["90", "Territoire de Belfort"],
  ["91", "Essonne"], ["92", "Hauts-de-Seine"], ["93", "Seine-Saint-Denis"],
  ["94", "Val-de-Marne"], ["95", "Val-d'Oise"],
  ["971", "Guadeloupe"], ["972", "Martinique"], ["973", "Guyane"],
  ["974", "La Réunion"], ["976", "Mayotte"],
];

function toSlug(name: string): string {
  return name
    .toLowerCase()
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/['']/g, "-")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export const departments: DepartmentData[] = rawDepartments.map(([code, name]) => {
  const avgPriceAuto = seededVariation(code, NATIONAL_AVG_AUTO, 150);
  return {
    code,
    name,
    slug: toSlug(name),
    avgPriceAuto,
    avgPriceSante: seededVariation(code + "s", NATIONAL_AVG_SANTE, 15),
    avgPriceHabitation: seededVariation(code + "h", NATIONAL_AVG_HABITATION, 60),
    topInsurers: getTopInsurers(code, avgPriceAuto),
  };
});

export function getDepartmentBySlug(slug: string): DepartmentData | undefined {
  return departments.find(d => d.slug === slug);
}

export function getDepartmentByCode(code: string): DepartmentData | undefined {
  return departments.find(d => d.code === code);
}
