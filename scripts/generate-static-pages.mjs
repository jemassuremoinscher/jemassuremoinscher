import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const geoContentPath = path.join(process.cwd(), "src/data/geo-content.json");
const geoContent = JSON.parse(await readFile(geoContentPath, "utf8"));

const { baseUrl, staticPages: pages } = geoContent;

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