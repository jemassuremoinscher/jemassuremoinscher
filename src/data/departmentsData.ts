export interface DepartmentData {
  code: string;
  name: string;
  slug: string;
  avgPriceAuto: number;
  avgPriceSante: number;
  avgPriceHabitation: number;
  topInsurers: { name: string; price: number; logo: string }[];
  uniqueContent?: string;
  localFaq?: { question: string; answer: string }[];
  stats?: { label: string; value: string }[];
  source?: string;
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

// Contenus locaux uniques (anti-thin) par département
const localOverrides: Record<string, { uniqueContent: string; localFaq: { question: string; answer: string }[] }> = {
  "alpes-maritimes": {
    uniqueContent: "<p>Assurer sa voiture dans les Alpes-Maritimes coûte plus cher que la moyenne française, et ce n'est pas un hasard : le département figure <strong>parmi les plus chers de France</strong> pour l'assurance auto. Densité urbaine sur le littoral, parc automobile haut de gamme et aléas climatiques méditerranéens se cumulent.</p><h3>Un parc automobile parmi les plus chers de France</h3><p>De Cannes à Menton en passant par Nice et Antibes, la concentration de véhicules haut de gamme est bien supérieure à la moyenne nationale. Résultat : des primes tous risques élevées et un vol davantage ciblé sur le littoral. Sur un véhicule de valeur, la garantie vol et la valeur à neuf méritent une attention particulière.</p><h3>Le cas des frontaliers Monaco et Italie</h3><p>Beaucoup de résidents du 06 travaillent à Monaco ou franchissent la frontière italienne. Cet usage transfrontalier doit être déclaré : vérifiez la couverture des trajets hors de France, la franchise à l'étranger et l'assistance au-delà de la frontière.</p><h3>Arrière-pays et climat</h3><p>Les routes de montagne de la Vésubie et de la Roya imposent des conditions de conduite hivernales : une assistance 0 km est utile. Enfin, la tempête Alex d'octobre 2020 a rappelé la vulnérabilité du département : la garantie catastrophes naturelles n'est pas théorique ici.</p>",
    localFaq: [
      { question: "Pourquoi l'assurance auto est-elle plus chère dans les Alpes-Maritimes ?", answer: "Densité urbaine, valeur élevée du parc automobile, taux de vol supérieur à la moyenne sur le littoral et exposition climatique tirent les tarifs vers le haut. Le 06 figure parmi les départements les plus chers de France." },
      { question: "Dois-je déclarer un usage frontalier vers Monaco ?", answer: "Oui. Un trajet quotidien vers Monaco est un usage à déclarer, sans quoi l'assureur pourrait réduire ou refuser sa prise en charge en cas de sinistre." },
      { question: "Comment payer moins cher dans le 06 ?", answer: "Comparer plusieurs assureurs, adapter la formule à l'âge réel du véhicule et déclarer un stationnement sécurisé sont les leviers les plus efficaces." },
    ],
  },
  "bouches-du-rhone": {
    uniqueContent: "<p>Les Bouches-du-Rhône sont <strong>le département le plus cher de France pour l'assurance auto</strong>, avec une prime moyenne d'environ 880 €/an. Le département détient aussi un triste record : il concentre à lui seul près de <strong>7,6 % de l'ensemble des vols de voitures du pays</strong> (source : France Assureurs). Comprendre ces facteurs permet de ne pas subir sa prime.</p><h3>L'effet Marseille</h3><p>Deuxième ville de France, Marseille concentre une sinistralité (vol, vandalisme, accidents) qui pèse sur toute la moyenne départementale. Même à Aix, Arles ou dans le pays d'Aubagne, vous subissez indirectement cette pression — d'où l'intérêt de comparer, car les assureurs ne pondèrent pas tous ce risque de la même façon.</p><h3>Des écarts de prix considérables selon la commune</h3><p>Pour un même profil, la prime varie fortement entre le centre de Marseille, une commune résidentielle d'Aix et un village de Camargue. Ici, le code postal est l'un des critères les plus déterminants du tarif.</p><h3>Zones industrielles et mistral</h3><p>Autour de l'étang de Berre et de Fos, les trajets pendulaires augmentent le kilométrage et l'exposition au risque routier. Le mistral, lui, provoque chutes d'objets et grêle : les garanties tempête et catastrophes naturelles ne sont pas accessoires.</p>",
    localFaq: [
      { question: "Le 13 est-il vraiment le département le plus cher pour l'assurance auto ?", answer: "Oui. Les baromètres 2026 le placent en tête des départements français, avec une prime moyenne autour de 880 €/an, tiré notamment par la sinistralité marseillaise et un taux de vol record (7,6 % des vols nationaux)." },
      { question: "Pourquoi de tels écarts de prix dans les Bouches-du-Rhône ?", answer: "Parce que le risque varie énormément d'une commune à l'autre : votre adresse exacte pèse fortement sur la prime, davantage que dans la plupart des départements." },
    ],
  },
  "var": {
    uniqueContent: "<p>Le Var figure <strong>parmi les départements les plus chers de France</strong> pour l'assurance auto. Le territoire a deux visages : un littoral touristique saturé l'été et un intérieur exposé aux inondations. Deux réalités qui doivent guider le choix des garanties.</p><h3>Le sur-risque estival</h3><p>De juin à septembre, la population et le trafic explosent sur la côte (Toulon, Hyères, Saint-Tropez). Cette densification saisonnière augmente accrochages, sinistres de stationnement et vols.</p><h3>Les inondations : un risque récurrent</h3><p>Le Var a connu des épisodes marquants (catastrophe de la Dracénie en 2010, inondations de 2019-2020). Un véhicule peut être déclaré irréparable après une simple immersion : vérifiez la garantie catastrophes naturelles et le véhicule de remplacement, surtout en zone basse.</p><h3>Véhicules de loisir</h3><p>Le Var compte une forte proportion de camping-cars et de vans aménagés, qui relèvent de contrats spécifiques.</p>",
    localFaq: [
      { question: "L'assurance auto augmente-t-elle l'été dans le Var ?", answer: "Le tarif d'un contrat annuel ne change pas d'un mois à l'autre, mais le sur-risque estival est déjà intégré dans les primes des zones touristiques, ce qui contribue à faire du Var l'un des départements les plus chers." },
      { question: "Suis-je couvert si ma voiture est inondée dans le Var ?", answer: "Uniquement avec la garantie catastrophes naturelles (déclenchée par arrêté) ou une garantie dommages adaptée. À vérifier absolument dans ce département." },
    ],
  },
};

departments.forEach(d => {
  const o = localOverrides[d.slug];
  if (o) {
    d.uniqueContent = o.uniqueContent;
    d.localFaq = o.localFaq;
  }
});

export function getDepartmentBySlug(slug: string): DepartmentData | undefined {
  return departments.find(d => d.slug === slug);
}

export function getDepartmentByCode(code: string): DepartmentData | undefined {
  return departments.find(d => d.code === code);
}
