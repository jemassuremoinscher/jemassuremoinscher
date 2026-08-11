/**
 * Hero content — single source of truth for the homepage slogan.
 *
 * ✏️ Modifiez ces valeurs pour changer le texte du Hero, des meta tags
 * et des partages sociaux SANS toucher au code des composants.
 *
 * Note : pour mettre à jour les meta title/description/OG dans index.html,
 * ce fichier est aussi consommé par src/components/SEOOptimized.tsx pour
 * la homepage (override runtime côté React).
 */

export const heroContent = {
  /** Slogan principal — affiché dans le <h1> du Hero (3 lignes) */
  slogan: {
    line1: "En 2 minutes, économisez jusqu'à 280€/an",
    line2Prefix: "sur votre assurance grâce à ",
    line2Highlight: "Arthur",
    line2Suffix: ".",
    line3: "Devis gratuit en 2 minutes.", // mis en jaune + ondulation
  },

  /** Bulle Arthur (à droite du Hero, desktop) */
  arthurBubble: "Hello, moi c'est Arthur 👋",

  /** Texte alternatif de l'image Arthur */
  arthurImageAlt:
    "Arthur mascotte jemassuremoinscher, guide pour comparer assurance auto, habitation et santé",

  /** Meta SEO de la homepage — alimente <title>, <meta description>, OG, Twitter */
  seo: {
    title: "Économisez jusqu'à 280€/an sur votre assurance | Devis 2 min",
    description:
      "Économisez jusqu'à 280€/an sur votre assurance avec Arthur. 70+ assureurs et 2 500+ agences locales en 2 minutes. Gratuit, sans engagement.",
    ogTitle: "Économisez jusqu'à 280€/an sur votre assurance avec Arthur",
    ogDescription:
      "70+ assureurs et 2 500+ agences locales comparés en 2 minutes avec Arthur. Économisez jusqu'à 280€/an. Devis gratuit, sans engagement.",
    twitterTitle: "Économisez jusqu'à 280€/an | Devis assurance 2 min",
    twitterDescription:
      "Avec Arthur, comparez 70+ assureurs et 2 500+ agences locales (auto, santé, habitation) en 2 min et économisez jusqu'à 280€/an.",
  },
} as const;

export type HeroContent = typeof heroContent;
