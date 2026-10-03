/**
 * Chantier i18n, étape 2 : sortie FRANÇAISE d'un module de données, en JSON
 * stable, pour vérifier qu'une extraction vers des clés i18n ne change pas
 * le texte au mot près (comparer le JSON avant et après).
 *
 * Usage : node scripts/i18n/dump-module-fr.mjs <module> <export> [appel]
 *   appel = "t" : l'export est une fonction appelée avec t (français) ;
 *   sinon l'export est lu tel quel.
 * Icônes, images et fonctions sont remplacées par leur nom ; RegExp par sa source.
 */
import path from "node:path";

const rootDir = process.cwd();
const [, , modPath, exportName, call] = process.argv;
const { createServer } = await import("vite");
const stubAssets = {
  name: "stub-assets",
  enforce: "pre",
  resolveId(id) {
    if (/\.(jpg|jpeg|png|webp|svg|gif|avif)(\?.*)?$/.test(id)) return "\0stub:" + id;
  },
  load(id) {
    if (id.startsWith("\0stub:")) return `export default ${JSON.stringify(id.slice(6).split("?")[0].split("/").pop())};`;
  },
};
const vite = await createServer({
  configFile: false, root: rootDir, resolve: { alias: { "@": path.join(rootDir, "src") } },
  plugins: [stubAssets], server: { middlewareMode: true }, optimizeDeps: { noDiscovery: true, include: [] }, logLevel: "silent",
});
try {
  const fr = (await vite.ssrLoadModule(path.join(rootDir, "src/i18n/fr.ts"))).default;
  const t = (key, vars) => {
    let raw = fr[key] ?? key;
    for (const [k, v] of Object.entries(vars || {})) raw = raw.replace(new RegExp(`\\{${k}\\}`, "g"), String(v));
    return raw;
  };
  const mod = await vite.ssrLoadModule(path.join(rootDir, modPath));
  let value = mod[exportName];
  if (call === "t") value = value(t);
  const seen = new WeakSet();
  const out = JSON.stringify(value, (k, v) => {
    if (v instanceof RegExp) return `RegExp(${v.source})`;
    if (typeof v === "function") return `fn:${v.displayName || v.name || "anonyme"}`;
    if (v && typeof v === "object" && v.$$typeof) return `composant:${v.displayName || v.render?.displayName || "?"}`;
    if (v && typeof v === "object") { if (seen.has(v)) return "[réf]"; seen.add(v); }
    return v;
  }, 1);
  process.stdout.write(out + "\n");
} finally {
  await vite.close();
}
