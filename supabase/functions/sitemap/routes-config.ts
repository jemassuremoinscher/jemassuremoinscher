export interface RouteConfig {
  path: string;
  lastmod: string;
  changefreq: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority: number;
}

// Configuration centralisée de toutes les routes du site
export const SITE_URL = "https://www.jemassuremoinscher.fr";

export const routes: RouteConfig[] = [
  // Homepage
  {
    path: "/",
    lastmod: "2025-11-11",
    changefreq: "daily",
    priority: 1.0,
  },
  
  // Main Pages
  {
    path: "/comparateur",
    lastmod: "2025-11-11",
    changefreq: "weekly",
    priority: 0.9,
  },
  {
    path: "/comparateur-garanties",
    lastmod: "2025-11-11",
    changefreq: "weekly",
    priority: 0.9,
  },
  {
    path: "/blog",
    lastmod: "2025-11-11",
    changefreq: "daily",
    priority: 0.9,
  },
  {
    path: "/contact",
    lastmod: "2025-11-11",
    changefreq: "monthly",
    priority: 0.7,
  },
  {
    path: "/qui-sommes-nous",
    lastmod: "2025-11-11",
    changefreq: "monthly",
    priority: 0.6,
  },
  {
    path: "/nos-partenaires",
    lastmod: "2025-11-11",
    changefreq: "monthly",
    priority: 0.6,
  },
  {
    path: "/avis-clients",
    lastmod: "2025-11-11",
    changefreq: "weekly",
    priority: 0.8,
  },
  {
    path: "/gestion-locative",
    lastmod: "2025-11-11",
    changefreq: "daily",
    priority: 0.8,
  },
  {
    path: "/plan-du-site",
    lastmod: "2025-11-11",
    changefreq: "monthly",
    priority: 0.5,
  },
  
  // Insurance Pages - High Priority
  {
    path: "/assurance-auto",
    lastmod: "2025-11-11",
    changefreq: "weekly",
    priority: 0.9,
  },
  {
    path: "/assurance-moto",
    lastmod: "2025-11-11",
    changefreq: "daily",
    priority: 0.9,
  },
  {
    path: "/assurance-habitation",
    lastmod: "2025-11-11",
    changefreq: "weekly",
    priority: 0.9,
  },
  {
    path: "/assurance-sante",
    lastmod: "2025-11-11",
    changefreq: "weekly",
    priority: 0.9,
  },
  {
    path: "/assurance-vie",
    lastmod: "2025-11-11",
    changefreq: "daily",
    priority: 0.9,
  },
  {
    path: "/assurance-pret",
    lastmod: "2025-11-11",
    changefreq: "weekly",
    priority: 0.8,
  },
  {
    path: "/assurance-animaux",
    lastmod: "2025-11-11",
    changefreq: "daily",
    priority: 0.9,
  },
  {
    path: "/assurance-pno",
    lastmod: "2025-11-11",
    changefreq: "weekly",
    priority: 0.7,
  },
  {
    path: "/assurance-gli",
    lastmod: "2025-11-11",
    changefreq: "daily",
    priority: 0.9,
  },
  {
    path: "/assurance-mrp",
    lastmod: "2025-11-11",
    changefreq: "weekly",
    priority: 0.7,
  },
  {
    path: "/assurance-prevoyance",
    lastmod: "2025-11-11",
    changefreq: "weekly",
    priority: 0.7,
  },
  {
    path: "/assurance-rc-pro",
    lastmod: "2025-11-11",
    changefreq: "daily",
    priority: 0.9,
  },
  
  // Landing Pages
  {
    path: "/landing/assurance",
    lastmod: "2025-11-11",
    changefreq: "weekly",
    priority: 0.8,
  },
  {
    path: "/landing/auto",
    lastmod: "2025-11-11",
    changefreq: "weekly",
    priority: 0.7,
  },
  {
    path: "/landing/sante",
    lastmod: "2025-11-11",
    changefreq: "weekly",
    priority: 0.7,
  },
  {
    path: "/landing/habitation",
    lastmod: "2025-11-11",
    changefreq: "weekly",
    priority: 0.7,
  },
  {
    path: "/landing/moto",
    lastmod: "2025-11-11",
    changefreq: "weekly",
    priority: 0.7,
  },
  {
    path: "/landing/animaux",
    lastmod: "2025-11-11",
    changefreq: "weekly",
    priority: 0.7,
  },
  {
    path: "/landing/pret",
    lastmod: "2025-11-11",
    changefreq: "weekly",
    priority: 0.7,
  },
  {
    path: "/landing/vie",
    lastmod: "2025-11-11",
    changefreq: "weekly",
    priority: 0.7,
  },
  {
    path: "/landing/prevoyance",
    lastmod: "2025-11-11",
    changefreq: "weekly",
    priority: 0.7,
  },
  {
    path: "/landing/rc-pro",
    lastmod: "2025-11-11",
    changefreq: "weekly",
    priority: 0.7,
  },
  {
    path: "/landing/gli",
    lastmod: "2025-11-11",
    changefreq: "weekly",
    priority: 0.7,
  },
  {
    path: "/landing/pno",
    lastmod: "2025-11-11",
    changefreq: "weekly",
    priority: 0.7,
  },
  {
    path: "/landing/mrp",
    lastmod: "2025-11-11",
    changefreq: "weekly",
    priority: 0.7,
  },
  
  // Legal Pages
  {
    path: "/mentions-legales",
    lastmod: "2025-11-11",
    changefreq: "yearly",
    priority: 0.3,
  },
  {
    path: "/politique-confidentialite",
    lastmod: "2025-11-11",
    changefreq: "yearly",
    priority: 0.3,
  },
  {
    path: "/politique-cookies",
    lastmod: "2025-11-11",
    changefreq: "monthly",
    priority: 0.5,
  },
  {
    path: "/cgu",
    lastmod: "2025-11-11",
    changefreq: "yearly",
    priority: 0.3,
  },
];

// Articles de blog - seront fusionnés avec les routes principales
export const blogArticles: RouteConfig[] = [
  {
    path: "/blog/meilleure-assurance-auto-2025-comparatif",
    lastmod: "2025-11-11",
    changefreq: "weekly",
    priority: 0.9,
  },
  {
    path: "/blog/top-10-meilleures-mutuelles-sante-2025",
    lastmod: "2025-11-11",
    changefreq: "weekly",
    priority: 0.9,
  },
  {
    path: "/blog/assurance-jeune-conducteur-2025-moins-cher",
    lastmod: "2025-01-08",
    changefreq: "weekly",
    priority: 0.9,
  },
  {
    path: "/blog/loi-lemoine-assurance-emprunteur-2024",
    lastmod: "2024-01-15",
    changefreq: "monthly",
    priority: 0.8,
  },
  {
    path: "/blog/loi-hamon-resiliation-assurance",
    lastmod: "2024-01-12",
    changefreq: "monthly",
    priority: 0.8,
  },
  {
    path: "/blog/guide-choisir-assurance-auto-2024",
    lastmod: "2024-01-10",
    changefreq: "monthly",
    priority: 0.8,
  },
  {
    path: "/blog/assurance-habitation-garanties-indispensables",
    lastmod: "2025-11-11",
    changefreq: "weekly",
    priority: 0.8,
  },
  {
    path: "/blog/top-5-erreurs-assurance-habitation",
    lastmod: "2024-01-06",
    changefreq: "monthly",
    priority: 0.7,
  },
  {
    path: "/blog/assurance-animaux-comparatif-2024",
    lastmod: "2024-01-05",
    changefreq: "monthly",
    priority: 0.7,
  },
  {
    path: "/blog/mutuelle-dentaire-remboursement-optimal",
    lastmod: "2024-01-03",
    changefreq: "monthly",
    priority: 0.7,
  },
  {
    path: "/blog/assurance-pret-immobilier-deleguation",
    lastmod: "2024-01-02",
    changefreq: "monthly",
    priority: 0.7,
  },
  {
    path: "/blog/comparatif-mutuelle-sante-seniors",
    lastmod: "2024-01-01",
    changefreq: "monthly",
    priority: 0.7,
  },
  {
    path: "/blog/choisir-mutuelle-sante-2024",
    lastmod: "2023-12-28",
    changefreq: "monthly",
    priority: 0.7,
  },
];
