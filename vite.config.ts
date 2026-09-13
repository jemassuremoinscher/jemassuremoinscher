import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { readdirSync, statSync, existsSync } from "node:fs";
import { componentTagger } from "lovable-tagger";
import { ViteImageOptimizer } from "vite-plugin-image-optimizer";
import { imagetools } from "vite-imagetools";

// Auto-discover every <root>/<...>/index.html so vite emits dist/<route>/index.html
// for each pre-rendered route. The root index.html is always included.
const EXCLUDED_TOP_LEVEL_DIRS = new Set([
  "node_modules",
  "dist",
  "public",
  "src",
  "supabase",
  "scripts",
  "test-hosting-paths",
  ".git",
  ".lovable",
  ".vercel",
  ".vscode",
  "mem",
]);

const discoverHtmlEntries = (rootDir: string): Record<string, string> => {
  const entries: Record<string, string> = {
    main: path.resolve(rootDir, "index.html"),
  };

  const walk = (dir: string) => {
    // Register this dir's own index.html if present
    const indexHtml = path.join(dir, "index.html");
    if (existsSync(indexHtml)) {
      const rel = path.relative(rootDir, dir).replace(/\\/g, "/");
      if (rel) {
        const key = rel.replace(/[^a-zA-Z0-9]+/g, "_");
        entries[key] = indexHtml;
      }
    }
    // Recurse into subdirectories
    let children: string[] = [];
    try { children = readdirSync(dir); } catch { return; }
    for (const name of children) {
      if (name.startsWith(".")) continue;
      const full = path.join(dir, name);
      let st;
      try { st = statSync(full); } catch { continue; }
      if (st.isDirectory()) walk(full);
    }
  };

  for (const name of readdirSync(rootDir)) {
    if (EXCLUDED_TOP_LEVEL_DIRS.has(name)) continue;
    if (name.startsWith(".")) continue;
    const full = path.join(rootDir, name);
    let st;
    try { st = statSync(full); } catch { continue; }
    if (st.isDirectory()) walk(full);
  }

  return entries;
};

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const seoRouteEntries = discoverHtmlEntries(__dirname);

  return {
    server: {
      host: "::",
      port: 8080,
    },
    plugins: [
      react(),
      mode === "development" && componentTagger(),
      imagetools(),
      ViteImageOptimizer({
        png: { quality: 70 },
        jpeg: { quality: 70 },
        jpg: { quality: 70 },
        webp: { quality: 75 },
      }),
    ].filter(Boolean),
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    build: {
      rollupOptions: {
        input: seoRouteEntries,
        output: {
          manualChunks: {
            'react-vendor': ['react', 'react-dom', 'react-router-dom'],
            'i18n-fr': ['./src/i18n/fr'],
            'ui-components': [
              '@radix-ui/react-accordion',
              '@radix-ui/react-dialog',
              '@radix-ui/react-popover',
              '@radix-ui/react-select',
              '@radix-ui/react-tabs',
            ],
            'icons': ['lucide-react'],
            // Pas de chunk nommé pour recharts (retiré le 2026-09-13) : un
            // manualChunks statique force Rollup à injecter un <script> pour
            // ce chunk sur les ~100 entrées HTML générées par
            // discoverHtmlEntries (une par page pré-rendue), y compris les
            // pages publiques qui ne l'utilisent jamais (recharts n'est
            // importé que sous /admin — CrmDashboard, FinancePage,
            // MarketingPage, GoogleAnalyticsDashboard, GoogleAdsCampaignCharts,
            // ChartsSection). Sans entrée manuelle, Rollup le regroupe
            // naturellement dans les chunks async de ces composants déjà
            // lazy-loadés (411 Ko en moins sur chaque page publique).
            'carousel': ['embla-carousel-react', 'embla-carousel-autoplay'],
            'animation': ['framer-motion'],
            'forms': ['react-hook-form', '@hookform/resolvers', 'zod'],
            'supabase': ['@supabase/supabase-js'],
          },
        },
      },
      chunkSizeWarningLimit: 1000,
      target: 'es2020',
      cssMinify: true,
      cssCodeSplit: true,
      minify: 'esbuild',
      reportCompressedSize: false,
    },
  };
});
