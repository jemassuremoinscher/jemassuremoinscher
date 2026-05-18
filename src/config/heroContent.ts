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
    line1: "Comparez votre assurance",
    line2Prefix: "avec ",
    line2Highlight: "Arthur",
    line2Suffix: ", et payez moins cher,",
    line3: "sans compromis.", // mis en jaune + ondulation
  },

  /** Bulle Arthur (à droite du Hero, desktop) */
  arthurBubble: "Hello, moi c'est Arthur 👋",

  /** Texte alternatif de l'image Arthur */
  arthurImageAlt:
    "Arthur mascotte jemassuremoinscher, guide pour comparer assurance auto, habitation et santé",

  /** Meta SEO de la homepage — alimente <title>, <meta description>, OG, Twitter */
  seo: {
    title: "Comparez votre assurance avec Arthur | Devis 2 min",
    description:
      "Comparez votre assurance avec Arthur et payez moins cher, sans compromis. 50+ assureurs comparés en 2 minutes. Gratuit et sans engagement.",
    ogTitle: "Comparez votre assurance avec Arthur | Je m'assure moins cher",
    ogDescription:
      "Avec Arthur, comparez 50+ assureurs en 2 min et payez moins cher, sans compromis. Devis gratuit, sans engagement.",
    twitterTitle: "Comparez votre assurance avec Arthur | Devis gratuit 2 min",
    twitterDescription:
      "Avec Arthur, comparez 50+ assureurs (auto, santé, habitation) en 2 min. Économisez jusqu'à 40%, sans compromis.",
  },
} as const;

export type HeroContent = typeof heroContent;
