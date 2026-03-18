export interface RouteConfig {
  path: string;
  changefreq: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority: number;
}

// Configuration centralisée de toutes les routes du site
export const SITE_URL = "https://www.jemassuremoinscher.fr";

// Pages principales
export const routes: RouteConfig[] = [
  // Homepage
  { path: "/", changefreq: "daily", priority: 1.0 },

  // Main Pages
  { path: "/comparateur", changefreq: "weekly", priority: 0.9 },
  { path: "/blog", changefreq: "daily", priority: 0.9 },
  { path: "/contact", changefreq: "monthly", priority: 0.7 },
  { path: "/qui-sommes-nous", changefreq: "monthly", priority: 0.6 },
  { path: "/nos-partenaires", changefreq: "monthly", priority: 0.6 },
  { path: "/avis-clients", changefreq: "weekly", priority: 0.8 },
  { path: "/gestion-locative", changefreq: "weekly", priority: 0.8 },
  { path: "/glossaire", changefreq: "weekly", priority: 0.8 },
  { path: "/plan-du-site", changefreq: "monthly", priority: 0.5 },

  // Insurance Product Pages - High Priority
  { path: "/assurance-auto", changefreq: "weekly", priority: 0.9 },
  { path: "/assurance-moto", changefreq: "weekly", priority: 0.9 },
  { path: "/assurance-habitation", changefreq: "weekly", priority: 0.9 },
  { path: "/assurance-sante", changefreq: "weekly", priority: 0.9 },
  { path: "/assurance-vie", changefreq: "weekly", priority: 0.9 },
  { path: "/assurance-pret", changefreq: "weekly", priority: 0.8 },
  { path: "/assurance-animaux", changefreq: "weekly", priority: 0.9 },
  { path: "/assurance-pno", changefreq: "weekly", priority: 0.7 },
  { path: "/assurance-gli", changefreq: "weekly", priority: 0.9 },
  { path: "/assurance-mrp", changefreq: "weekly", priority: 0.7 },
  { path: "/assurance-prevoyance", changefreq: "weekly", priority: 0.7 },
  { path: "/assurance-rc-pro", changefreq: "weekly", priority: 0.9 },

  // SEO Pages
  { path: "/assurance-auto-malusse", changefreq: "weekly", priority: 0.8 },
  { path: "/assurance-auto-jeune-conducteur", changefreq: "weekly", priority: 0.8 },
  { path: "/mutuelle-tns", changefreq: "weekly", priority: 0.8 },
  { path: "/assurance-auto-comparatif", changefreq: "weekly", priority: 0.8 },
  { path: "/assurance-trottinette-electrique", changefreq: "weekly", priority: 0.8 },
  { path: "/assurance-auto-permis-etranger", changefreq: "weekly", priority: 0.8 },
  { path: "/assurance-emprunteur", changefreq: "weekly", priority: 0.8 },

  // Profils Spéciaux
  { path: "/profil", changefreq: "weekly", priority: 0.8 },
  { path: "/profil/resilie-non-paiement", changefreq: "weekly", priority: 0.8 },
  { path: "/profil/retrait-permis", changefreq: "weekly", priority: 0.8 },
  { path: "/profil/frequence-sinistres", changefreq: "weekly", priority: 0.8 },
  { path: "/profil/sans-antecedents", changefreq: "weekly", priority: 0.8 },
  { path: "/profil/jeune-conducteur-voiture-puissante", changefreq: "weekly", priority: 0.8 },

  // Comparatifs / Duels
  { path: "/comparatif", changefreq: "weekly", priority: 0.8 },
  { path: "/comparatif/maif-vs-macif", changefreq: "monthly", priority: 0.7 },
  { path: "/comparatif/axa-vs-allianz", changefreq: "monthly", priority: 0.7 },
  { path: "/comparatif/direct-assurance-vs-l-olivier", changefreq: "monthly", priority: 0.7 },
  { path: "/comparatif/luko-vs-alan", changefreq: "monthly", priority: 0.7 },
  { path: "/comparatif/groupama-vs-gmf", changefreq: "monthly", priority: 0.7 },
  { path: "/comparatif/matmut-vs-mma", changefreq: "monthly", priority: 0.7 },
  { path: "/comparatif/maaf-vs-matmut", changefreq: "monthly", priority: 0.7 },
  { path: "/comparatif/generali-vs-axa", changefreq: "monthly", priority: 0.7 },
  { path: "/comparatif/april-vs-alan", changefreq: "monthly", priority: 0.7 },
  { path: "/comparatif/swiss-life-vs-generali", changefreq: "monthly", priority: 0.7 },
  { path: "/comparatif/abeille-vs-groupama", changefreq: "monthly", priority: 0.7 },
  { path: "/comparatif/alan-vs-harmonie-mutuelle", changefreq: "monthly", priority: 0.7 },

  // Outils
  { path: "/outils/calculateur-bonus-malus", changefreq: "monthly", priority: 0.7 },

  // Landing Pages
  { path: "/landing/assurance", changefreq: "weekly", priority: 0.8 },
  { path: "/landing/auto", changefreq: "weekly", priority: 0.7 },
  { path: "/landing/sante", changefreq: "weekly", priority: 0.7 },
  { path: "/landing/habitation", changefreq: "weekly", priority: 0.7 },
  { path: "/landing/moto", changefreq: "weekly", priority: 0.7 },
  { path: "/landing/animaux", changefreq: "weekly", priority: 0.7 },
  { path: "/landing/pret", changefreq: "weekly", priority: 0.7 },
  { path: "/landing/vie", changefreq: "weekly", priority: 0.7 },
  { path: "/landing/prevoyance", changefreq: "weekly", priority: 0.7 },
  { path: "/landing/rc-pro", changefreq: "weekly", priority: 0.7 },
  { path: "/landing/gli", changefreq: "weekly", priority: 0.7 },
  { path: "/landing/pno", changefreq: "weekly", priority: 0.7 },
  { path: "/landing/mrp", changefreq: "weekly", priority: 0.7 },

  // Legal Pages
  { path: "/mentions-legales", changefreq: "yearly", priority: 0.3 },
  { path: "/politique-confidentialite", changefreq: "yearly", priority: 0.3 },
  { path: "/politique-cookies", changefreq: "monthly", priority: 0.5 },
  { path: "/cgu", changefreq: "yearly", priority: 0.3 },
];

// Blog articles — all slugs from blogArticles.ts + blogArticles2026.ts
export const blogArticles: RouteConfig[] = [
  // Legacy articles
  { path: "/blog/mutuelle-sante-reduire-frais-medicaux-2024", changefreq: "monthly", priority: 0.7 },
  { path: "/blog/assurance-auto-jeune-conducteur-astuces", changefreq: "monthly", priority: 0.7 },
  { path: "/blog/resiliation-assurance-droits-2024", changefreq: "monthly", priority: 0.7 },
  { path: "/blog/loi-lemoine-assurance-emprunteur-2024", changefreq: "monthly", priority: 0.8 },
  { path: "/blog/loi-hamon-resiliation-assurance", changefreq: "monthly", priority: 0.8 },
  { path: "/blog/guide-choisir-assurance-auto-2024", changefreq: "monthly", priority: 0.8 },
  { path: "/blog/assurance-habitation-garanties-indispensables", changefreq: "monthly", priority: 0.8 },
  { path: "/blog/top-5-erreurs-assurance-habitation", changefreq: "monthly", priority: 0.7 },
  { path: "/blog/assurance-animaux-comparatif-2024", changefreq: "monthly", priority: 0.7 },
  { path: "/blog/mutuelle-dentaire-remboursement-optimal", changefreq: "monthly", priority: 0.7 },
  { path: "/blog/assurance-pret-immobilier-deleguation", changefreq: "monthly", priority: 0.7 },
  { path: "/blog/comparatif-mutuelle-sante-seniors", changefreq: "monthly", priority: 0.7 },
  { path: "/blog/choisir-mutuelle-sante-2024", changefreq: "monthly", priority: 0.7 },
  { path: "/blog/10-conseils-economiser-assurances", changefreq: "monthly", priority: 0.7 },
  { path: "/blog/bien-choisir-mutuelle-sante", changefreq: "monthly", priority: 0.7 },

  // 2025 articles
  { path: "/blog/meilleure-assurance-auto-2025-comparatif", changefreq: "monthly", priority: 0.9 },
  { path: "/blog/top-10-meilleures-mutuelles-sante-2025", changefreq: "monthly", priority: 0.9 },
  { path: "/blog/assurance-jeune-conducteur-2025-moins-cher", changefreq: "monthly", priority: 0.9 },
  { path: "/blog/meilleure-assurance-auto-2025", changefreq: "monthly", priority: 0.8 },
  { path: "/blog/top-mutuelles-sante-2025", changefreq: "monthly", priority: 0.8 },
  { path: "/blog/comparatif-habitation-2025", changefreq: "monthly", priority: 0.8 },
  { path: "/blog/loi-lemoine-2025", changefreq: "monthly", priority: 0.8 },
  { path: "/blog/nouvelle-reglementation-assurance-2025", changefreq: "monthly", priority: 0.7 },
  { path: "/blog/droits-des-assures-2025", changefreq: "monthly", priority: 0.7 },

  // 2026 articles
  { path: "/blog/assurance-auto-resiliation-non-paiement-guide", changefreq: "monthly", priority: 0.8 },
  { path: "/blog/jeune-conducteur-voiture-puissante-110-chevaux", changefreq: "monthly", priority: 0.8 },
  { path: "/blog/assurance-malus-eleve-compagnies-2026", changefreq: "monthly", priority: 0.8 },
  { path: "/blog/seniors-75-ans-assurance-auto-prime-basse", changefreq: "monthly", priority: 0.8 },
  { path: "/blog/permis-conduire-etranger-assurance-auto-france", changefreq: "monthly", priority: 0.8 },
  { path: "/blog/assurance-auto-resilie-alcool-stupefiants", changefreq: "monthly", priority: 0.8 },
  { path: "/blog/conducteur-secondaire-assurance-auto-bonne-idee", changefreq: "monthly", priority: 0.8 },
  { path: "/blog/top-10-voitures-occasion-moins-cheres-assurer-2026", changefreq: "monthly", priority: 0.8 },
  { path: "/blog/assurance-au-kilometre-pay-as-you-drive-rentable", changefreq: "monthly", priority: 0.8 },
  { path: "/blog/supprimer-options-inutiles-contrat-habitation", changefreq: "monthly", priority: 0.8 },
  { path: "/blog/franchise-elevee-prime-basse-simulateur-choix", changefreq: "monthly", priority: 0.8 },
  { path: "/blog/regrouper-contrats-auto-maison-reduction-reelle", changefreq: "monthly", priority: 0.8 },
  { path: "/blog/assurance-auto-connectee-boitiers-intelligents-prix", changefreq: "monthly", priority: 0.8 },
  { path: "/blog/hausse-tarifs-assurance-2026-comment-contrer", changefreq: "monthly", priority: 0.8 },
  { path: "/blog/demenagement-prevenir-assureur-couverture", changefreq: "monthly", priority: 0.8 },
  { path: "/blog/assurance-colocation-contrat-unique-ou-individuel", changefreq: "monthly", priority: 0.8 },
  { path: "/blog/teletravail-assurance-habitation-materiel-pro-couvert", changefreq: "monthly", priority: 0.8 },
  { path: "/blog/sous-location-airbnb-risques-caches-assurance", changefreq: "monthly", priority: 0.8 },
  { path: "/blog/assurance-panneaux-photovoltaiques-installation", changefreq: "monthly", priority: 0.8 },
  { path: "/blog/degat-des-eaux-voisins-constat-amiable-2026", changefreq: "monthly", priority: 0.8 },
  { path: "/blog/assurance-pno-obligatoire-louer-bien", changefreq: "monthly", priority: 0.8 },
  { path: "/blog/assurance-voiture-electrique-bonus-ecologiques-2026", changefreq: "monthly", priority: 0.8 },
  { path: "/blog/trottinettes-electriques-edpm-assurance-obligatoire", changefreq: "monthly", priority: 0.8 },
  { path: "/blog/velos-cargos-vae-protection-vol-urbain", changefreq: "monthly", priority: 0.8 },
  { path: "/blog/recharge-domicile-assurance-borne-recharge", changefreq: "monthly", priority: 0.8 },
  { path: "/blog/covoiturage-regulier-extension-garantie-passagers", changefreq: "monthly", priority: 0.8 },
  { path: "/blog/loi-hamon-2026-resilier-3-clics-apres-un-an", changefreq: "monthly", priority: 0.8 },
  { path: "/blog/vente-vehicule-suspendre-assurance-jour-j", changefreq: "monthly", priority: 0.8 },
  { path: "/blog/certificat-assurance-dematerialise-fin-vignette-verte", changefreq: "monthly", priority: 0.8 },
  { path: "/blog/non-lieu-assurance-aucun-assureur-bct", changefreq: "monthly", priority: 0.8 },
  { path: "/blog/voiture-immobilisee-garage-arreter-assurance", changefreq: "monthly", priority: 0.8 },
  { path: "/blog/heritage-vehicule-assurer-voiture-deces", changefreq: "monthly", priority: 0.8 },
  { path: "/blog/reste-a-charge-zero-100-sante-lunettes-dents-2026", changefreq: "monthly", priority: 0.8 },
  { path: "/blog/mutuelle-etudiante-contrat-parents-ou-individuel", changefreq: "monthly", priority: 0.8 },
  { path: "/blog/auto-entrepreneur-mutuelle-protection-optimale", changefreq: "monthly", priority: 0.8 },
  { path: "/blog/assurance-emprunteur-changer-assurance-pret-immobilier", changefreq: "monthly", priority: 0.8 },
  { path: "/blog/medecines-douces-mutuelles-osteopathie-hypnose", changefreq: "monthly", priority: 0.8 },
  { path: "/blog/fausse-declaration-assurance-risques-sanctions", changefreq: "monthly", priority: 0.8 },
  { path: "/blog/arnaques-assurance-courantes-2026", changefreq: "monthly", priority: 0.8 },
  { path: "/blog/accident-seul-sans-tiers-declarer-ou-reparer", changefreq: "monthly", priority: 0.8 },
];

// Glossary terms
export const glossaryTerms: RouteConfig[] = [
  { path: "/glossaire/franchise", changefreq: "monthly", priority: 0.7 },
  { path: "/glossaire/prime-assurance", changefreq: "monthly", priority: 0.7 },
  { path: "/glossaire/sinistre", changefreq: "monthly", priority: 0.7 },
  { path: "/glossaire/bonus-malus", changefreq: "monthly", priority: 0.7 },
  { path: "/glossaire/indemnisation", changefreq: "monthly", priority: 0.7 },
  { path: "/glossaire/tiers", changefreq: "monthly", priority: 0.7 },
  { path: "/glossaire/tous-risques", changefreq: "monthly", priority: 0.7 },
  { path: "/glossaire/constat-amiable", changefreq: "monthly", priority: 0.7 },
  { path: "/glossaire/loi-hamon", changefreq: "monthly", priority: 0.7 },
  { path: "/glossaire/loi-lemoine", changefreq: "monthly", priority: 0.7 },
  { path: "/glossaire/mutuelle-sante", changefreq: "monthly", priority: 0.7 },
  { path: "/glossaire/ticket-moderateur", changefreq: "monthly", priority: 0.7 },
  { path: "/glossaire/tiers-payant", changefreq: "monthly", priority: 0.7 },
  { path: "/glossaire/responsabilite-civile", changefreq: "monthly", priority: 0.7 },
  { path: "/glossaire/assurance-emprunteur", changefreq: "monthly", priority: 0.7 },
  { path: "/glossaire/degat-des-eaux", changefreq: "monthly", priority: 0.7 },
  { path: "/glossaire/garantie-decennale", changefreq: "monthly", priority: 0.7 },
  { path: "/glossaire/assurance-pno", changefreq: "monthly", priority: 0.7 },
  { path: "/glossaire/garantie-loyers-impayes", changefreq: "monthly", priority: 0.7 },
  { path: "/glossaire/rc-pro", changefreq: "monthly", priority: 0.7 },
  { path: "/glossaire/prevoyance", changefreq: "monthly", priority: 0.7 },
  { path: "/glossaire/vetuste", changefreq: "monthly", priority: 0.7 },
  { path: "/glossaire/delai-de-carence", changefreq: "monthly", priority: 0.7 },
  { path: "/glossaire/avenant", changefreq: "monthly", priority: 0.7 },
  { path: "/glossaire/assurance-vie", changefreq: "monthly", priority: 0.7 },
];
