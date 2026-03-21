import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import { ViteImageOptimizer } from "vite-plugin-image-optimizer";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const seoRouteEntries = {
    main: path.resolve(__dirname, "index.html"),
    assuranceAuto: path.resolve(__dirname, "assurance-auto/index.html"),
    assuranceMoto: path.resolve(__dirname, "assurance-moto/index.html"),
    assuranceHabitation: path.resolve(__dirname, "assurance-habitation/index.html"),
    assuranceSante: path.resolve(__dirname, "assurance-sante/index.html"),
    assuranceAnimaux: path.resolve(__dirname, "assurance-animaux/index.html"),
    assurancePret: path.resolve(__dirname, "assurance-pret/index.html"),
    assuranceVie: path.resolve(__dirname, "assurance-vie/index.html"),
    assurancePrevoyance: path.resolve(__dirname, "assurance-prevoyance/index.html"),
    assuranceRcPro: path.resolve(__dirname, "assurance-rc-pro/index.html"),
    assuranceMrp: path.resolve(__dirname, "assurance-mrp/index.html"),
    assurancePno: path.resolve(__dirname, "assurance-pno/index.html"),
    assuranceGli: path.resolve(__dirname, "assurance-gli/index.html"),
  };

  return {
    server: {
      host: "::",
      port: 8080,
    },
    plugins: [
      react(),
      mode === "development" && componentTagger(),
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
            'charts': ['recharts'],
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
    },
  };
});
