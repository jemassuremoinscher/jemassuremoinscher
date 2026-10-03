/**
 * QA des tunnels de devis (npm run qa:funnels) — test E2E Playwright.
 *
 * Parcourt toutes les étapes des tunnels animaux, trottinette, vélo, moto 50cc,
 * auto et comparateur, puis le formulaire de /landing/trottinette, en 390x844
 * et 1280x800. AUCUNE ÉCRITURE : toute requête autre que GET/HEAD/OPTIONS vers
 * /rest/v1/* ou /functions/v1/* reçoit une réponse 200 simulée.
 *
 * Contrôles : zéro erreur console, zéro pageerror, zéro requête en échec (hors
 * simulées) ; à l'étape contact, 3 vignettes toutes en « prix » ou toutes en
 * « Sur devis », vignette mise en avant = formule choisie, logos chargés et
 * dans le pool autorisé du produit (animaux : 3 logos distincts), bouton
 * d'envoi visible sans défilement, aucun « Meilleur prix », « temps réel »,
 * « garanti », « immédiat » dans le tunnel ; tableau de garanties trottinette
 * et sa note ; LCP et CLS de cinq pages (signalés si LCP > 2,5 s ou CLS > 0,1).
 *
 * Usage :
 *   npm run build && npm run qa:funnels                 # build local (dist/)
 *   npm run qa:funnels -- --base=https://www.jemassuremoinscher.fr
 * Rapport et captures : docs/qa/<horodatage>/ (dossier ignoré par git).
 */
import http from "node:http";
import path from "node:path";
import { createReadStream, existsSync, mkdirSync, readFileSync, statSync, writeFileSync } from "node:fs";

const rootDir = process.cwd();
const distDir = path.join(rootDir, "dist");
const argBase = process.argv.find((a) => a.startsWith("--base="))?.slice(7);
const stamp = new Date().toISOString().replace(/[:.]/g, "-").slice(0, 19);
const outDir = path.join(rootDir, "docs", "qa", `${stamp}${argBase ? "-prod" : "-local"}`);
mkdirSync(outDir, { recursive: true });

// « Meilleur prix » n'est interdit que comme BADGE de vignette (décision du
// 3 octobre 2026) : contrôlé sur les vignettes seulement (TEASER_FORBIDDEN).
const FORBIDDEN = [/temps réel/i, /\bgaranti\b/i, /immédiat/i];
const TEASER_FORBIDDEN = [/meilleur prix/i];
const VIEWPORTS = [
  { name: "mobile", width: 390, height: 844, isMobile: true, hasTouch: true },
  { name: "desktop", width: 1280, height: 800, isMobile: false, hasTouch: false },
];
// Choix forcés par champ (sinon : 2e option à l'étape formule, 1re ailleurs).
const FUNNELS = [
  { key: "animaux", path: "/assurance-animaux", type: "animaux" },
  { key: "trottinette", path: "/assurance-trottinette", type: "trottinette", table: true },
  { key: "velo", path: "/assurance-velo", type: "velo" },
  { key: "moto-50cc", path: "/assurance-scooter-50cc", type: "moto", prefer: { engineSize: "50" } },
  { key: "auto", path: "/assurance-auto", type: "auto" },
  { key: "comparateur", path: "/comparateur", type: "habitation", prefer: { insuranceType: "habitation" } },
  { key: "auto-temporaire", path: "/assurance-auto-temporaire", type: "auto_temporaire" },
];
const PERF_PAGES = ["/assurance-animaux", "/assurance-trottinette", "/assurance-velo", "/assurance-scooter-50cc", "/landing/trottinette"];
const TROTTINETTE_NOTE =
  "Ce tableau décrit le contrat d'entrée de gamme mis en avant sur cette page (document d'information d'un contrat du marché, 2025). Les garanties vol, casse et assistance dépendent de l'assureur : un conseiller vous présente ce que chaque contrat inclut ou exclut.";
const TROTTINETTE_VOL = "Non incluse dans ce contrat ; proposée par d'autres assureurs, selon leurs conditions";

// ─── Pools de logos autorisés, lus depuis la source (comme verify-teasers) ───
const loadPools = async () => {
  const { createServer } = await import("vite");
  const vite = await createServer({
    configFile: false,
    root: rootDir,
    resolve: { alias: { "@": path.join(rootDir, "src") } },
    plugins: [{
      name: "stub-assets",
      enforce: "pre",
      resolveId(id) { if (/\.(jpg|jpeg|png|webp|svg|gif|avif)(\?.*)?$/.test(id)) return "\0stub:" + id; },
      load(id) { if (id.startsWith("\0stub:")) return `export default ${JSON.stringify(id.slice(6))};`; },
    }],
    server: { middlewareMode: true },
    optimizeDeps: { noDiscovery: true, include: [] },
    logLevel: "silent",
  });
  try {
    const { teaserPrices } = await vite.ssrLoadModule(path.join(rootDir, "src/components/forms/teaserPrices.ts"));
    const pools = {};
    for (const [type, entry] of Object.entries(teaserPrices)) {
      pools[type] = new Set(entry.prices.flatMap((p) => p.logoPool.map(logoKey)));
      for (const src of entry.prices.flatMap((p) => p.logoPool)) {
        const raw = String(src).split("?")[0].replace(/^[\s\S]*stub:/, "");
        const file = path.isAbsolute(raw) ? raw : path.join(rootDir, raw.replace(/^@\//, "src/"));
        if (!existsSync(file)) continue;
        const ext = path.extname(file).slice(1).replace("jpg", "jpeg");
        INLINE_LOGOS.set(`data:image/${ext === "svg" ? "svg+xml" : ext};base64,${readFileSync(file).toString("base64")}`, logoKey(src));
      }
    }
    return pools;
  } finally {
    await vite.close();
  }
};
// "/assets/santevet-AbC12.png", "@/assets/logos/santevet.png" ou un data: URI
// d'un logo intégré par Vite → "santevet"
const INLINE_LOGOS = new Map();
function logoKey(src) {
  if (String(src).startsWith("data:")) return INLINE_LOGOS.get(String(src)) || "logo-intégré-inconnu";
  const base = path.basename(String(src).split("?")[0]).replace(/\.(png|webp|jpg|jpeg|svg|avif)$/, "");
  // Hash Vite (8 caractères, alphabet base64url) seulement sur les URL du build.
  return /\/assets\/[^/]+$/.test(String(src)) && !/\/src\/assets\//.test(String(src)) ? base.replace(/-[A-Za-z0-9_-]{8}$/, "") : base;
}

// ─── Serveur local : sert dist/ comme Vercel (route → <route>/index.html) ────
const MIME = { ".html": "text/html; charset=utf-8", ".js": "text/javascript", ".css": "text/css", ".json": "application/json", ".svg": "image/svg+xml", ".png": "image/png", ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".webp": "image/webp", ".avif": "image/avif", ".woff2": "font/woff2", ".woff": "font/woff", ".ico": "image/x-icon", ".txt": "text/plain; charset=utf-8", ".xml": "application/xml" };
const startServer = () => new Promise((resolve) => {
  const server = http.createServer((req, res) => {
    const urlPath = decodeURIComponent((req.url || "/").split("?")[0]);
    let file = path.join(distDir, urlPath);
    if (!file.startsWith(distDir)) { res.writeHead(403).end(); return; }
    if (existsSync(file) && statSync(file).isDirectory()) file = path.join(file, "index.html");
    if (!existsSync(file)) file = path.join(distDir, "index.html");
    res.writeHead(200, { "content-type": MIME[path.extname(file)] || "application/octet-stream" });
    createReadStream(file).pipe(res);
  });
  server.listen(4321, "127.0.0.1", () => resolve(server));
});

const resolveChromium = (chromium) => {
  for (const p of [process.env.PRERENDER_CHROMIUM, process.env.CHROME_PATH].filter(Boolean)) if (existsSync(p)) return p;
  try { const p = chromium.executablePath(); if (p && existsSync(p)) return p; } catch { /* ignore */ }
  return null;
};

// ─── Bruit tiers ignoré (liste explicite, décision du 3 octobre 2026) ────────
// Seuls ces motifs, propres à l'iframe reCAPTCHA de Google, sont ignorés ;
// tout le reste (console, pageerror, requête en échec ou annulée) est une
// erreur. Chaque occurrence ignorée est listée dans le rapport.
const IGNORED = [
  { kind: "console", pattern: /^Framing 'https:\/\/www\.google\.com\/' violates the following report-only Content Security Policy directive: "frame-ancestors 'self'"/, reason: "alerte CSP report-only de l'iframe reCAPTCHA (Google)" },
  // Rapports CSP envoyés par Google à csp.withgoogle.com (tous chemins /csp/* :
  // frame-ancestors, script-inclusions…), bloqués par ORB (décision du 3 octobre 2026).
  { kind: "request", pattern: /^POST https:\/\/csp\.withgoogle\.com\/csp\/.* — net::ERR_BLOCKED_BY_ORB$/, reason: "rapport CSP de Google (csp.withgoogle.com/csp/*) bloqué par ORB" },
  { kind: "request", pattern: /^POST https:\/\/www\.google\.com\/recaptcha\/api2\/clr\?.* — net::ERR_ABORTED$/, reason: "annulation de la télémétrie reCAPTCHA api2/clr" },
];
const ignoredBy = (kind, text) => IGNORED.find((i) => i.kind === kind && i.pattern.test(text));

// ─── Contexte instrumenté : écritures simulées, erreurs collectées ───────────
const isWrite = (req) => /\/(rest|functions)\/v1\//.test(req.url()) && !["GET", "HEAD", "OPTIONS"].includes(req.method());
async function newInstrumentedPage(browser, vp) {
  const context = await browser.newContext({ viewport: { width: vp.width, height: vp.height }, isMobile: vp.isMobile, hasTouch: vp.hasTouch, locale: "fr-FR" });
  const log = { consoleErrors: [], pageErrors: [], failed: [], ignored: [], simulated: [] };
  await context.route(/\/(rest|functions)\/v1\//, async (route) => {
    const req = route.request();
    if (!isWrite(req)) return route.continue();
    log.simulated.push({ method: req.method(), url: req.url().replace(/\?.*$/, ""), body: req.postData()?.slice(0, 2000) || "" });
    return route.fulfill({
      status: 200,
      headers: { "content-type": "application/json", "access-control-allow-origin": "*", "access-control-allow-headers": "*", "access-control-allow-methods": "*" },
      body: /\/functions\/v1\//.test(req.url()) ? "{}" : "[]",
    });
  });
  const page = await context.newPage();
  page.on("console", (m) => {
    if (m.type() !== "error") return;
    const text = m.text();
    const ig = ignoredBy("console", text);
    if (ig) log.ignored.push(`${ig.reason} : ${text.slice(0, 160)}`);
    else log.consoleErrors.push(text.slice(0, 300));
  });
  page.on("pageerror", (e) => log.pageErrors.push(String(e?.message || e).slice(0, 300)));
  page.on("requestfailed", (r) => {
    if (isWrite(r)) return;
    const line = `${r.method()} ${r.url()} — ${r.failure()?.errorText || "échec"}`;
    const ig = ignoredBy("request", line);
    if (ig) log.ignored.push(`${ig.reason} : ${line.slice(0, 160)}`);
    else log.failed.push(line.slice(0, 260));
  });
  page.on("response", (r) => {
    if (r.status() >= 400 && !isWrite(r.request())) log.failed.push(`${r.request().method()} ${r.url().slice(0, 160)} — HTTP ${r.status()}`);
  });
  return { context, page, log };
}

// ─── Parcours d'un tunnel MultiStepQuoteForm ────────────────────────────────
const FILL = { postalCode: "75011", age: "35", vehicleYear: "2018", activityDescription: "Activité de test pour la QA" };
async function runFunnel(browser, base, funnel, vp, pools) {
  const { context, page, log } = await newInstrumentedPage(browser, vp);
  const r = { funnel: funnel.key, viewport: vp.name, steps: [], problems: [], contact: null };
  try {
    await page.goto(base + funnel.path, { waitUntil: "domcontentloaded", timeout: 45000 });
    await refuseCookies(page);
    if (funnel.table) await checkTrottinetteTable(page, r);
    await page.waitForSelector("[data-funnel-step]", { timeout: 30000 });
    await page.locator("[data-funnel-step]").first().scrollIntoViewIfNeeded();
    let chosenFormuleIndex = null;
    let chosenFormuleLabel = null;
    for (let guard = 0; guard < 40; guard += 1) {
      const stepEl = page.locator("[data-funnel-step]").first();
      const id = await stepEl.getAttribute("data-funnel-step");
      const type = await stepEl.getAttribute("data-funnel-step-type");
      const field = (await stepEl.getAttribute("data-funnel-field")) || "";
      const index = Number(await stepEl.getAttribute("data-funnel-step-index"));
      r.steps.push(`${index}:${id}`);
      if (type === "contact") break;
      if (type === "callback") { r.problems.push(`étape callback inattendue (${id})`); break; }
      if (type === "card-select") {
        const options = stepEl.locator("[data-funnel-option]");
        await options.first().waitFor({ timeout: 10000 });
        const values = await options.evaluateAll((els) => els.map((e) => e.getAttribute("data-funnel-option")));
        let pick = 0;
        if (funnel.prefer?.[field] && values.includes(funnel.prefer[field])) pick = values.indexOf(funnel.prefer[field]);
        else if (field === "coverageLevel" && values.length > 1) pick = 1;
        if (field === "coverageLevel") {
          chosenFormuleIndex = pick;
          chosenFormuleLabel = await options.nth(pick).getAttribute("data-funnel-option-label");
        }
        await options.nth(pick).click();
      } else if (type === "input") {
        const input = stepEl.locator("input").first();
        await input.fill(FILL[field] || "35");
        await stepEl.locator("[data-funnel-continue]").click();
      } else if (type === "vehicle-select") {
        await stepEl.locator("[data-funnel-vehicle]").first().click();
      }
      // searching : avance seule (~3,2 s)
      await page.waitForFunction(
        (prev) => {
          const el = document.querySelector("[data-funnel-step]");
          return el && Number(el.getAttribute("data-funnel-step-index")) > prev;
        },
        index,
        { timeout: 15000 },
      );
    }
    await page.waitForSelector("[data-teaser-card]", { timeout: 15000 });
    // Laisse le temps au défilement automatique de l'étape contact (~350 ms + smooth).
    await page.waitForTimeout(1500);
    await page.screenshot({ path: path.join(outDir, `${funnel.key}-${vp.name}-contact.png`), fullPage: false });
    const c = await page.evaluate(() => {
      const cards = [...document.querySelectorAll("[data-teaser-card]")];
      const submit = document.querySelector("[data-funnel-submit]");
      const rect = submit?.getBoundingClientRect();
      const container = document.querySelector("[data-funnel-step]")?.closest("section, form, .container, div") || document.body;
      return {
        names: cards.map((c) => c.getAttribute("data-teaser-card")),
        modes: cards.map((c) => c.getAttribute("data-teaser-mode")),
        highlights: cards.map((c) => c.getAttribute("data-teaser-highlight") === "true"),
        logos: [...document.querySelectorAll("[data-teaser-logo]")].map((i) => ({ src: i.getAttribute("src"), w: i.naturalWidth, complete: i.complete })),
        // Visible et non recouvert (barre fixe, bannière) : l'élément au
        // centre du bouton doit être le bouton lui-même.
        submitInView: !!rect && rect.top >= 0 && rect.bottom <= window.innerHeight
          && !!submit.contains(document.elementFromPoint(rect.left + rect.width / 2, rect.top + rect.height / 2)),
        funnelText: container.innerText,
        teaserText: cards.map((c) => c.innerText).join(" | "),
      };
    });
    // Logos lazy : on les fait charger (défilement) avant de lire naturalWidth.
    await page.locator("[data-teaser-card]").last().scrollIntoViewIfNeeded();
    await page.waitForTimeout(1200);
    c.logos = await page.evaluate(() => [...document.querySelectorAll("[data-teaser-logo]")].map((i) => ({ src: i.getAttribute("src"), w: i.naturalWidth })));
    r.contact = { names: c.names, modes: c.modes, highlights: c.highlights, logos: c.logos.map((l) => logoKey(l.src)), submitInView: c.submitInView };
    if (c.names.length !== 3) r.problems.push(`${c.names.length} vignettes au lieu de 3`);
    if (new Set(c.modes).size > 1) r.problems.push(`vignettes mélangées prix / sur devis : ${c.modes.join(", ")}`);
    // Produits sans prix publié : trois « Sur devis » attendus.
    if (["animaux", "trottinette", "auto_temporaire"].includes(funnel.type) && c.modes.some((m) => m !== "devis")) {
      r.problems.push(`${funnel.type} : trois « Sur devis » attendus (${c.modes.join(", ")})`);
    }
    const expectedHighlight = chosenFormuleIndex ?? 0;
    const hi = c.highlights.indexOf(true);
    if (c.highlights.filter(Boolean).length !== 1 || hi !== expectedHighlight) r.problems.push(`vignette mise en avant ${hi} (attendue ${expectedHighlight})`);
    // Noms des vignettes = libellés de l'étape formule (règle (d) du verrou) :
    // la vignette mise en avant porte le libellé de la formule choisie.
    if (chosenFormuleLabel !== null && c.names[hi] !== chosenFormuleLabel) {
      r.problems.push(`vignette mise en avant « ${c.names[hi]} » ≠ formule choisie « ${chosenFormuleLabel} »`);
    }
    const pool = pools[funnel.type] || new Set();
    for (const l of c.logos) {
      if (!(l.w > 0)) r.problems.push(`logo non chargé : ${l.src}`);
      if (!pool.has(logoKey(l.src))) r.problems.push(`logo hors pool ${funnel.type} : ${logoKey(l.src)}`);
    }
    // Trois logos d'assureurs différents pour tous les produits (decision du
    // 3 octobre 2026), sauf trottinette (logo April seul, en attente de Paul).
    const insurer = (src) => logoKey(src).replace(/-(new|moto)$/, "");
    if (funnel.type !== "trottinette" && new Set(c.logos.map((l) => insurer(l.src))).size !== c.logos.length) {
      r.problems.push(`logos non distincts (${c.logos.map((l) => insurer(l.src)).join(", ")})`);
    }
    if (!c.submitInView) r.problems.push("bouton d'envoi hors du viewport (ou recouvert) à l'arrivée sur l'étape contact");
    for (const re of FORBIDDEN) if (re.test(c.funnelText)) r.problems.push(`texte interdit dans le tunnel : ${re}`);
    for (const re of TEASER_FORBIDDEN) if (re.test(c.teaserText)) r.problems.push(`badge interdit sur une vignette : ${re}`);
    // Garanties affichées au verso des vignettes (même règle que
    // verify-teasers (e)/(f)) : on retourne chaque carte et on lit son texte.
    const cards = page.locator("[data-teaser-card]");
    for (let i = 0; i < (await cards.count()); i += 1) {
      const card = cards.nth(i);
      const name = await card.getAttribute("data-teaser-card");
      await card.click();
      await page.waitForTimeout(350);
      const back = await card.innerText();
      if (/imm[ée]diat/i.test(back)) r.problems.push(`vignette « ${name} » : promesse d'immédiateté`);
      if (/^au tiers|\bseule\b|\buniquement\b/i.test(name) && /\b(casse|incendie|dommages|bris de glace|assistance)\b/i.test(back.replace(name, ""))) {
        r.problems.push(`vignette « ${name} » : garantie hors formule au verso`);
      }
      await card.click();
      await page.waitForTimeout(350);
    }
    await page.locator("#msf-name").scrollIntoViewIfNeeded();

    // Envoi (écritures simulées)
    await page.fill("#msf-name", "Test QA Tunnel");
    await page.fill("#msf-email", "qa-funnels@example.test");
    await page.fill("#msf-phone", "0600000000");
    await page.click("#msf-terms");
    await page.click("[data-funnel-submit]");
    await page.waitForTimeout(4000);
    const realWrites = log.simulated.length;
    r.submit = { simulatedWrites: realWrites };
    if (realWrites === 0) r.problems.push("aucune écriture interceptée à l'envoi (envoi non déclenché ?)");
  } catch (e) {
    r.problems.push(`exception : ${String(e?.message || e).split("\n")[0].slice(0, 200)}`);
    try { await page.screenshot({ path: path.join(outDir, `${funnel.key}-${vp.name}-erreur.png`) }); } catch { /* ignore */ }
  }
  finish(r, log);
  await context.close();
  return r;
}

async function refuseCookies(page) {
  const btn = page.getByRole("button", { name: "Tout refuser" });
  try {
    await btn.first().click({ timeout: 6000 });
  } catch {
    /* bannière absente (déjà refusée ou non affichée) */
  }
}

// Tableau de garanties /assurance-trottinette et sa note (sections différées :
// on fait défiler toute la page pour les monter).
async function checkTrottinetteTable(page, r) {
  for (let y = 0; y < 30; y += 1) {
    const done = await page.evaluate(() => {
      window.scrollBy(0, window.innerHeight * 0.8);
      return window.scrollY + window.innerHeight >= document.body.scrollHeight - 5;
    });
    await page.waitForTimeout(250);
    if (done) break;
  }
  await page.waitForTimeout(800);
  const t = await page.evaluate(() => ({
    note: document.querySelector("[data-guarantee-table-note]")?.textContent?.trim() || "",
    table: !!document.querySelector("table"),
    body: document.body.innerText,
  }));
  if (!t.table) r.problems.push("tableau de garanties absent");
  if (t.note !== TROTTINETTE_NOTE) r.problems.push("note sous le tableau absente ou différente");
  if (!t.body.includes(TROTTINETTE_VOL)) r.problems.push("valeur « Vol » du tableau absente");
  r.table = { present: t.table, note: t.note === TROTTINETTE_NOTE };
  await page.evaluate(() => window.scrollTo(0, 0));
}

// ─── Formulaire de /landing/trottinette (SimplifiedLeadForm) ────────────────
async function runLanding(browser, base, vp) {
  const { context, page, log } = await newInstrumentedPage(browser, vp);
  const r = { funnel: "landing-trottinette", viewport: vp.name, steps: ["formulaire"], problems: [] };
  try {
    await page.goto(base + "/landing/trottinette", { waitUntil: "domcontentloaded", timeout: 45000 });
    await refuseCookies(page);
    await page.waitForSelector("form #fullName", { timeout: 30000 });
    const form = page.locator("form:has(#fullName)");
    await form.scrollIntoViewIfNeeded();
    const text = await form.evaluate((f) => f.closest("div")?.innerText || f.innerText);
    for (const re of FORBIDDEN) if (re.test(text)) r.problems.push(`texte interdit dans le formulaire : ${re}`);
    await page.fill("#fullName", "Test QA Landing");
    await page.fill("#email", "qa-funnels@example.test");
    await page.fill("#phone", "06 00 00 00 00");
    await page.screenshot({ path: path.join(outDir, `landing-trottinette-${vp.name}.png`) });
    await form.locator("button[type=submit]").click();
    await page.waitForTimeout(4000);
    const insert = log.simulated.find((s) => /insurance_quotes/.test(s.url));
    r.submit = { simulatedWrites: log.simulated.length };
    if (!insert) r.problems.push("insertion insurance_quotes non interceptée");
    else if (!/"source_page":"\/landing\/trottinette"/.test(insert.body)) r.problems.push("source_page absent de quote_data");
    const fn = log.simulated.find((s) => /send-quote-email/.test(s.url));
    if (fn && !/source_page/.test(fn.body)) r.problems.push("source_page absent des details de send-quote-email");
    const after = await page.evaluate(() => document.body.innerText);
    for (const re of FORBIDDEN) if (re.test(after.slice(0, 20000)) && !re.test(text)) r.problems.push(`texte interdit après envoi : ${re}`);
  } catch (e) {
    r.problems.push(`exception : ${String(e?.message || e).split("\n")[0].slice(0, 200)}`);
  }
  finish(r, log);
  await context.close();
  return r;
}

function finish(r, log) {
  r.simulated = log.simulated.map((s) => `${s.method} ${s.url}`);
  r.consoleErrors = log.consoleErrors;
  r.pageErrors = log.pageErrors;
  r.failed = [...new Set(log.failed)];
  r.ignored = [...new Set(log.ignored)];
  if (log.consoleErrors.length) r.problems.push(`${log.consoleErrors.length} erreur(s) console`);
  if (log.pageErrors.length) r.problems.push(`${log.pageErrors.length} pageerror`);
  if (r.failed.length) r.problems.push(`${r.failed.length} requête(s) en échec`);
}

// ─── LCP / CLS ───────────────────────────────────────────────────────────────
async function measure(browser, base, p, vp) {
  const context = await browser.newContext({ viewport: { width: vp.width, height: vp.height }, isMobile: vp.isMobile, hasTouch: vp.hasTouch });
  await context.route(/\/(rest|functions)\/v1\//, (route) => (isWrite(route.request()) ? route.fulfill({ status: 200, body: "[]" }) : route.continue()));
  const page = await context.newPage();
  await page.addInitScript(() => {
    window.__lcp = 0; window.__cls = 0;
    new PerformanceObserver((l) => { for (const e of l.getEntries()) window.__lcp = e.startTime; }).observe({ type: "largest-contentful-paint", buffered: true });
    new PerformanceObserver((l) => { for (const e of l.getEntries()) if (!e.hadRecentInput) window.__cls += e.value; }).observe({ type: "layout-shift", buffered: true });
  });
  await page.goto(base + p, { waitUntil: "load", timeout: 45000 });
  await page.waitForTimeout(5000);
  const m = await page.evaluate(() => ({ lcp: Math.round(window.__lcp), cls: Math.round(window.__cls * 1000) / 1000 }));
  await context.close();
  return { page: p, viewport: vp.name, ...m, flag: m.lcp > 2500 || m.cls > 0.1 };
}

// ─── Main ────────────────────────────────────────────────────────────────────
const main = async () => {
  const { chromium } = await import("playwright-core");
  const executablePath = resolveChromium(chromium);
  if (!executablePath) { console.error("[qa:funnels] Chromium introuvable (npx playwright install chromium)."); process.exit(1); }
  let server = null;
  let base = argBase;
  if (!base) {
    if (!existsSync(path.join(distDir, "index.html"))) { console.error("[qa:funnels] dist/ introuvable — npm run build d'abord."); process.exit(1); }
    server = await startServer();
    base = "http://127.0.0.1:4321";
  }
  const pools = await loadPools();
  const browser = await chromium.launch({ executablePath, headless: true });
  const results = [];
  const perf = [];
  try {
    for (const vp of VIEWPORTS) {
      for (const f of FUNNELS) {
        const r = await runFunnel(browser, base, f, vp, pools);
        console.log(`[qa:funnels] ${r.funnel} ${r.viewport} : ${r.problems.length ? "ÉCHEC — " + r.problems.join(" ; ") : "OK"}`);
        results.push(r);
      }
      const l = await runLanding(browser, base, vp);
      console.log(`[qa:funnels] ${l.funnel} ${l.viewport} : ${l.problems.length ? "ÉCHEC — " + l.problems.join(" ; ") : "OK"}`);
      results.push(l);
      for (const p of PERF_PAGES) {
        const m = await measure(browser, base, p, vp);
        console.log(`[qa:funnels] perf ${m.page} ${m.viewport} : LCP ${m.lcp} ms, CLS ${m.cls}${m.flag ? "  ← au-delà du seuil" : ""}`);
        perf.push(m);
      }
    }
  } finally {
    await browser.close();
    server?.close();
  }
  const failed = results.filter((r) => r.problems.length);
  const md = [
    `# QA des tunnels de devis — ${stamp} (${argBase ? "production " + argBase : "build local"})`,
    "",
    `Écritures : toutes simulées (POST/PATCH/DELETE vers /rest/v1/* et /functions/v1/* → 200 simulé).`,
    "",
    `## Résultat : ${failed.length === 0 ? "OK" : `${failed.length} parcours en échec`}`,
    "",
    "| Tunnel | Viewport | Étapes | Vignettes (nom / mode / mise en avant) | Logos | Écritures simulées | Problèmes |",
    "|---|---|---|---|---|---|---|",
    ...results.map((r) => `| ${r.funnel} | ${r.viewport} | ${r.steps.length} | ${r.contact ? r.contact.names.map((n, i) => `${n} / ${r.contact.modes[i]}${r.contact.highlights[i] ? " / ★" : ""}`).join("<br>") : "—"} | ${r.contact ? r.contact.logos.join(", ") : "—"} | ${r.submit?.simulatedWrites ?? 0} | ${r.problems.join("<br>") || "aucun"} |`),
    "",
    "## Performance (LCP / CLS, sans interaction, 5 s après load)",
    "",
    "| Page | Viewport | LCP (ms) | CLS | Seuil dépassé |",
    "|---|---|---|---|---|",
    ...perf.map((m) => `| ${m.page} | ${m.viewport} | ${m.lcp} | ${m.cls} | ${m.flag ? "**oui**" : "non"} |`),
    "",
    "## Détail des erreurs",
    "",
    ...results.flatMap((r) => (r.consoleErrors.length || r.pageErrors.length || r.failed.length)
      ? [`### ${r.funnel} (${r.viewport})`, ...r.consoleErrors.map((e) => `- console : ${e}`), ...r.pageErrors.map((e) => `- pageerror : ${e}`), ...r.failed.map((e) => `- requête : ${e}`), ""]
      : []),
    "",
    "## Bruit tiers ignoré (liste IGNORED du script, non compté comme erreur)",
    "",
    ...results.flatMap((r) => r.ignored?.length
      ? [`- ${r.funnel} (${r.viewport}) : ${r.ignored.join(" ; ")}`]
      : []),
  ].join("\n");
  writeFileSync(path.join(outDir, "rapport.md"), md);
  writeFileSync(path.join(outDir, "resultats.json"), JSON.stringify({ results, perf }, null, 2));
  console.log(`[qa:funnels] Rapport : ${path.relative(rootDir, path.join(outDir, "rapport.md"))}`);
  process.exit(failed.length ? 1 : 0);
};

main().catch((e) => { console.error(e); process.exit(1); });
