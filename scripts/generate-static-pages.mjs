import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const baseUrl = "https://www.jemassuremoinscher.fr";

const pages = [
  {
    route: "/contact",
    outputDir: "contact",
    title: "Contact | jemassuremoinscher.fr",
    description: "Contactez jemassuremoinscher.fr par email ou formulaire. Réponse sous 30 minutes, service 100% en ligne.",
    h1: "Contact jemassuremoinscher.fr",
    intro: "Besoin d'aide pour comparer vos assurances ou finaliser votre demande ? Notre équipe vous répond rapidement, avec un accompagnement 100% en ligne.",
    sections: [
      {
        title: "Nous contacter",
        body: "Écrivez-nous à contact@jemassuremoinscher.fr pour toute question sur un devis, un contrat ou une demande d'information.",
      },
      {
        title: "Délais de réponse",
        body: "Page Contact : réponse sous 30 minutes pendant les horaires d'ouverture, avec suivi par un conseiller expert.",
      },
      {
        title: "Notre siège",
        body: "2, rue d'Angleterre 06000 Nice. Service 100% en ligne pour toute la France.",
      },
    ],
    ctaLabel: "Accéder au comparateur",
    ctaHref: "/comparateur",
  },
  {
    route: "/blog",
    outputDir: "blog",
    title: "Blog assurance | Guides et conseils 2026",
    description: "Retrouvez nos guides, conseils pratiques et actualités pour choisir une assurance moins chère en France.",
    h1: "Blog assurance",
    intro: "Explorez nos articles pour comparer les contrats, comprendre les garanties et suivre les évolutions du marché de l'assurance en France.",
    sections: [
      {
        title: "Guides pratiques",
        list: [
          { label: "Guide choisir assurance auto 2026", href: "/blog/guide-choisir-assurance-auto-2026" },
          { label: "Comparatif assurance habitation 2026", href: "/blog/comparatif-habitation-2026" },
          { label: "Top mutuelles santé 2026", href: "/blog/top-mutuelles-sante-2026" },
        ],
      },
      {
        title: "Articles populaires",
        list: [
          { label: "Loi Hamon 2026 : résilier en 3 clics", href: "/blog/loi-hamon-2026-resilier-assurance-3-clics" },
          { label: "Loi Lemoine 2026", href: "/blog/loi-lemoine-2026" },
          { label: "Meilleure assurance auto 2026", href: "/blog/meilleure-assurance-auto-2026" },
        ],
      },
      {
        title: "Ressources complémentaires",
        body: "Consultez aussi notre glossaire assurance, nos comparatifs et notre page contact pour être accompagné dans votre recherche.",
      },
    ],
    ctaLabel: "Voir tous les comparatifs",
    ctaHref: "/comparateur",
  },
  {
    route: "/glossaire",
    outputDir: "glossaire",
    title: "Glossaire assurance | Définitions essentielles",
    description: "Consultez les définitions des principaux termes d'assurance : franchise, sinistre, responsabilité civile, tiers et plus.",
    h1: "Glossaire assurance",
    intro: "Retrouvez les définitions claires des mots-clés de l'assurance pour mieux comparer les garanties et comprendre vos contrats.",
    sections: [
      {
        title: "Termes à connaître",
        list: [
          { label: "Responsabilité civile", href: "/glossaire/responsabilite-civile" },
          { label: "Sinistre", href: "/glossaire/sinistre" },
          { label: "Ticket modérateur", href: "/glossaire/ticket-moderateur" },
          { label: "Tiers", href: "/glossaire/tiers" },
          { label: "Tous risques", href: "/glossaire/tous-risques" },
          { label: "Vétusté", href: "/glossaire/vetuste" },
        ],
      },
      {
        title: "Pourquoi utiliser ce glossaire ?",
        body: "Avant de demander un devis, comprendre les notions essentielles aide à choisir une couverture adaptée et à éviter les mauvaises surprises en cas de sinistre.",
      },
    ],
    ctaLabel: "Comparer les assurances",
    ctaHref: "/comparateur",
  },
];

const renderSection = (section) => {
  if (section.list) {
    return `
      <section>
        <h2>${section.title}</h2>
        <ul>
          ${section.list.map((item) => `<li><a href="${item.href}">${item.label}</a></li>`).join("")}
        </ul>
      </section>`;
  }

  return `
    <section>
      <h2>${section.title}</h2>
      <p>${section.body}</p>
    </section>`;
};

const renderPage = (page) => `<!doctype html>
<html lang="fr">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${page.title}</title>
    <meta name="description" content="${page.description}" />
    <meta name="robots" content="index,follow,max-snippet:-1,max-image-preview:large,max-video-preview:-1" />
    <link rel="canonical" href="${baseUrl}${page.route}" />
    <style>
      body { margin: 0; font-family: system-ui, -apple-system, Segoe UI, Roboto, sans-serif; color: #111827; background: #ffffff; }
      .seo-shell { max-width: 900px; margin: 0 auto; padding: 2rem 1rem; line-height: 1.65; }
      h1 { font-size: clamp(1.75rem, 3vw, 2.5rem); margin: 0 0 1rem; }
      h2 { font-size: 1.25rem; margin: 1.5rem 0 0.75rem; }
      ul { padding-left: 1.25rem; }
      li { margin-bottom: 0.5rem; }
      a { color: #1d4ed8; }
      .cta { display: inline-block; margin-top: 1rem; font-weight: 600; }
    </style>
  </head>
  <body>
    <noscript>
      <main class="seo-shell">
        <h1>${page.h1}</h1>
        <p>${page.intro}</p>
        ${page.sections.map(renderSection).join("")}
        <p><a class="cta" href="${page.ctaHref}">${page.ctaLabel}</a></p>
      </main>
    </noscript>

    <div id="root">
      <main class="seo-shell">
        <h1>${page.h1}</h1>
        <p>${page.intro}</p>
        ${page.sections.map(renderSection).join("")}
        <p><a class="cta" href="${page.ctaHref}">${page.ctaLabel}</a></p>
      </main>
    </div>

    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>`;

for (const page of pages) {
  const outputPath = path.join(process.cwd(), page.outputDir, "index.html");
  await mkdir(path.dirname(outputPath), { recursive: true });
  await writeFile(outputPath, renderPage(page), "utf8");
}