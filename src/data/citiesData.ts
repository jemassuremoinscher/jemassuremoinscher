export interface CityData {
  slug: string;
  name: string;
  code: string; // parent department code
  departmentSlug?: string;
  avgPriceAuto: number;
  uniqueContent: string;
  localFaq: { question: string; answer: string }[];
  stats: { label: string; value: string }[];
  source: string;
}

export const cities: CityData[] = [
  {
    slug: "marseille",
    name: "Marseille",
    code: "13",
    departmentSlug: "bouches-du-rhone",
    avgPriceAuto: 1100,
    uniqueContent: "<p>Marseille détient un record dont ses habitants se passeraient : c'est <strong>la ville la plus chère de France pour l'assurance auto</strong>, avec une prime moyenne d'environ <strong>1 030 à 1 165 €/an</strong> selon les baromètres 2026. Un jeune conducteur au tiers peut y dépasser <strong>1 460 €/an</strong>. Ce n'est pas une fatalité.</p><h3>Pourquoi Marseille coûte si cher</h3><p>La ville affiche des taux de vol et de vandalisme parmi les plus élevés du pays — les Bouches-du-Rhône concentrent à elles seules 7,6 % des vols de voitures de France. Les assureurs traduisent ce risque par une surprime, mais ne le chiffrent pas tous pareil : c'est là qu'un comparateur fait la différence.</p><h3>L'arrondissement change tout</h3><p>À Marseille, votre code postal fait le prix. Entre les quartiers Sud (13008, 13009) et certains secteurs centraux ou Nord, l'écart peut être considérable. Donnez toujours votre adresse exacte.</p><h3>Adapter la formule</h3><p>Sur un véhicule ancien exposé, une formule au tiers + vol/incendie est souvent plus rationnelle qu'un tous risques coûteux. Antivol, stationnement fermé et gravage sont valorisés par les assureurs.</p>",
    localFaq: [
      { question: "Pourquoi l'assurance auto est-elle si chère à Marseille ?", answer: "Marseille est la ville la plus chère de France (~1 030–1 165 €/an) à cause d'un taux de vol et de vandalisme parmi les plus élevés du pays, que les assureurs répercutent en surprime." },
      { question: "Quel arrondissement de Marseille paie le plus cher ?", answer: "Les écarts entre arrondissements sont parmi les plus importants de France : votre adresse exacte (code postal) est décisive dans le calcul de la prime." },
      { question: "Comment assurer une voiture à Marseille sans se ruiner ?", answer: "Comparer plusieurs assureurs, adapter la formule à la valeur du véhicule, sécuriser le stationnement et installer un antivol reconnu." },
    ],
    stats: [
      { label: "Prime moyenne", value: "~1 030–1 165 €/an" },
      { label: "Classement national", value: "n°1 ville la + chère" },
      { label: "Jeune conducteur (tiers)", value: ">1 460 €/an" },
    ],
    source: "Sources : baromètres assurance auto 2026 ; France Assureurs (vols).",
  },
  {
    slug: "nice",
    name: "Nice",
    code: "06",
    departmentSlug: "alpes-maritimes",
    avgPriceAuto: 1000,
    uniqueContent: "<p>Cinquième ville de France et cœur de la Côte d'Azur, Nice figure <strong>parmi les villes les plus chères de France pour l'assurance auto</strong>, avec une prime moyenne <strong>proche de 1 000 €/an</strong>. Densité urbaine, tourisme de masse et parc automobile de valeur en sont la cause — mais on peut agir.</p><h3>Le stationnement, source n°1 de petits sinistres</h3><p>Entre le Vieux-Nice, le centre et la Promenade des Anglais, se garer relève du sport et les sinistres matériels (portières, rétroviseurs, rayures) sont fréquents. Une formule intégrant le bris de glace évite de payer ces réparations de sa poche.</p><h3>Vol et vandalisme urbains</h3><p>Comme toute grande ville touristique, Nice connaît un niveau de vol supérieur à la moyenne. Un parking sécurisé et un antivol reconnu sont valorisés par les assureurs.</p><h3>Un accompagnement de proximité</h3><p>Notre société est implantée à Nice : au-delà du comparateur, nous connaissons le terrain azuréen. Pour aller plus loin, consultez notre guide des Alpes-Maritimes.</p>",
    localFaq: [
      { question: "Combien coûte l'assurance auto à Nice ?", answer: "Environ 1 000 €/an en moyenne, soit nettement plus que la moyenne nationale, en raison de la densité urbaine, du tourisme et de la valeur du parc automobile. Comparer reste le meilleur moyen d'obtenir le juste prix." },
      { question: "Comment réduire sa prime auto à Nice ?", answer: "Stationnement sécurisé, antivol reconnu, formule ajustée à la valeur du véhicule et comparaison de plusieurs assureurs." },
    ],
    stats: [
      { label: "Prime moyenne", value: "~1 000 €/an" },
      { label: "vs moyenne nationale", value: "+50 % environ" },
      { label: "Profil résilié", value: "~72 €/mois" },
    ],
    source: "Sources : baromètres assurance auto 2026 ; France Assureurs.",
  },
  {
    slug: "aix-en-provence",
    name: "Aix-en-Provence",
    code: "13",
    departmentSlug: "bouches-du-rhone",
    avgPriceAuto: 886,
    uniqueContent: "<p>À une trentaine de kilomètres de Marseille, Aix-en-Provence est pourtant la <strong>2e ville la plus chère de France pour l'assurance auto</strong> (~886 €/an) — élevé, mais moins que Marseille. Deux traits locaux structurent le marché aixois : une forte population étudiante et un mode de vie périurbain.</p><h3>Une ville étudiante = beaucoup de jeunes conducteurs</h3><p>Aix concentre une population estudiantine importante, donc de nombreux conducteurs novices soumis à la surprime « jeune conducteur ». Conduite accompagnée, statut de conducteur secondaire et modèle peu puissant sont les leviers les plus efficaces la première année.</p><h3>Un mode de vie périurbain</h3><p>Beaucoup d'Aixois font quotidiennement le trajet vers Marseille : ce kilométrage pèse sur la prime. Les petits rouleurs, eux, ont intérêt à examiner l'assurance au kilomètre.</p><h3>« À 30 minutes de Marseille, on paie moins »</h3><p>Le risque de vol y est plus faible qu'à Marseille intra-muros, d'où des tarifs souvent inférieurs pour un profil comparable. Encore faut-il comparer.</p>",
    localFaq: [
      { question: "L'assurance auto est-elle moins chère à Aix qu'à Marseille ?", answer: "Oui, sensiblement, pour un profil comparable (~886 €/an à Aix), car le risque de vol et de vandalisme y est plus faible qu'à Marseille. Mais Aix reste la 2e ville la plus chère de France." },
      { question: "Quelle assurance pour un étudiant à Aix-en-Provence ?", answer: "Une formule adaptée aux jeunes conducteurs : conduite accompagnée valorisée, statut de conducteur secondaire, ou assurance au kilomètre pour les petits rouleurs." },
    ],
    stats: [
      { label: "Prime moyenne", value: "~886 €/an" },
      { label: "Classement national", value: "2e ville la + chère" },
      { label: "vs Marseille", value: "sensiblement moins cher" },
    ],
    source: "Sources : baromètres assurance auto 2026 ; France Assureurs.",
  },
];

export function getCityBySlug(slug: string): CityData | undefined {
  return cities.find(c => c.slug === slug);
}
