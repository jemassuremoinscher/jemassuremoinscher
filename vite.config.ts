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
    contact: path.resolve(__dirname, "contact/index.html"),
    blog: path.resolve(__dirname, "blog/index.html"),
    glossaire: path.resolve(__dirname, "glossaire/index.html"),
    // Glossaire terms
    glossaireRc: path.resolve(__dirname, "glossaire/responsabilite-civile/index.html"),
    glossaireSinistre: path.resolve(__dirname, "glossaire/sinistre/index.html"),
    glossaireTicket: path.resolve(__dirname, "glossaire/ticket-moderateur/index.html"),
    glossaireTiers: path.resolve(__dirname, "glossaire/tiers/index.html"),
    glossaireTousRisques: path.resolve(__dirname, "glossaire/tous-risques/index.html"),
    glossaireVetuste: path.resolve(__dirname, "glossaire/vetuste/index.html"),
    // Utility pages
    nosPartenaires: path.resolve(__dirname, "nos-partenaires/index.html"),
    calculateurBonusMalus: path.resolve(__dirname, "outils/calculateur-bonus-malus/index.html"),
    // mutuelle-tns static shell removed — handled by SPA route to avoid duplicate FAQPage JSON-LD
    // Blog articles — static HTML shells for SEO crawlers
    blogAccident: path.resolve(__dirname, "blog/accident-seul-sans-tiers-declarer-reparer/index.html"),
    blogArnaques: path.resolve(__dirname, "blog/5-arnaques-assurance-courantes-2026/index.html"),
    blogFausseDeclaration: path.resolve(__dirname, "blog/fausse-declaration-assurance-risques-reels/index.html"),
    blogVoitureGarage: path.resolve(__dirname, "blog/voiture-immobilisee-garage-arreter-assurer/index.html"),
    blogBct: path.resolve(__dirname, "blog/non-lieu-assurance-aucun-assureur-role-bct/index.html"),
    blogLoiHamon: path.resolve(__dirname, "blog/loi-hamon-2026-resilier-assurance-3-clics/index.html"),
    blogGuideAuto: path.resolve(__dirname, "blog/guide-choisir-assurance-auto-2026/index.html"),
    blogMeilleureAuto: path.resolve(__dirname, "blog/meilleure-assurance-auto-2026/index.html"),
    blogTopMutuelles: path.resolve(__dirname, "blog/top-mutuelles-sante-2026/index.html"),
    blogComparatifHab: path.resolve(__dirname, "blog/comparatif-habitation-2026/index.html"),
    blogDroitsAssures: path.resolve(__dirname, "blog/droits-des-assures-2026/index.html"),
    blogLoiLemoine: path.resolve(__dirname, "blog/loi-lemoine-2026/index.html"),
    blogNouvelleReglem: path.resolve(__dirname, "blog/nouvelle-reglementation-assurance-2026/index.html"),
    blogTop10Mutuelles: path.resolve(__dirname, "blog/top-10-meilleures-mutuelles-sante-2026/index.html"),
    blogJeuneConducteur: path.resolve(__dirname, "blog/assurance-jeune-conducteur-2026-moins-cher/index.html"),
    blogResiliation: path.resolve(__dirname, "blog/resiliation-assurance-droits-2026/index.html"),
    blogLoiLemoineEmpr: path.resolve(__dirname, "blog/loi-lemoine-assurance-emprunteur-2026/index.html"),
    blogMutuelleFrais: path.resolve(__dirname, "blog/mutuelle-sante-reduire-frais-medicaux-2026/index.html"),
    blogMeilleureAutoComp: path.resolve(__dirname, "blog/meilleure-assurance-auto-2026-comparatif/index.html"),
    blogDegatEaux: path.resolve(__dirname, "blog/degat-des-eaux-voisins-constat-amiable-2026/index.html"),
    blogPnoObligatoire: path.resolve(__dirname, "blog/assurance-pno-obligatoire-louer-bien/index.html"),
    blogColocation: path.resolve(__dirname, "blog/assurance-colocation-contrat-unique-ou-individuel/index.html"),
    blogMalusEleve: path.resolve(__dirname, "blog/assurance-malus-eleve-compagnies-2026/index.html"),
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
