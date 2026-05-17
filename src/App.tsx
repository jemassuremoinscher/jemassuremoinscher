import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Routes, Route, Navigate } from "react-router-dom";
import React, { lazy, Suspense } from "react";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { LanguageProvider } from "@/contexts/LanguageContext";
import CookieBanner from "@/components/CookieBanner";
import GlobalSchemas from "@/components/seo/GlobalSchemas";

// Lazy load non-critical global components
const AIChatbot = lazy(() => import("@/components/chatbot/AIChatbot").then(m => ({ default: m.AIChatbot })));
const ReadingProgressBar = lazy(() => import("@/components/ReadingProgressBar"));
const ContractOptimizerWidget = lazy(() => import("@/components/optimizer/ContractOptimizerWidget"));
const SkipToMain = lazy(() => import("@/components/SkipToMain"));
const RouteTracker = lazy(() => import("@/components/RouteTracker"));
const StickyCTA = lazy(() => import("@/components/StickyCTA"));
const GlobalMdReveal = lazy(() => import("@/components/motion/GlobalMdReveal"));

// Auth-protected routes wrapper — lazy loaded to avoid Supabase init on public pages
const AuthProvider = lazy(() => import("@/contexts/AuthContext").then(m => ({ default: m.AuthProvider })));

// Lazy load pages for better performance
const Index = lazy(() => import("./pages/Index"));
const Auth = lazy(() => import("./pages/Auth"));
const Admin = lazy(() => import("./pages/Admin"));
const Commercial = lazy(() => import("./pages/Commercial"));
const LandingAds = lazy(() => import("./pages/LandingAds"));
const LandingAuto = lazy(() => import("./pages/landing/LandingAuto"));
const LandingSante = lazy(() => import("./pages/landing/LandingSante"));
const LandingHabitation = lazy(() => import("./pages/landing/LandingHabitation"));
const LandingMoto = lazy(() => import("./pages/landing/LandingMoto"));
const LandingAnimaux = lazy(() => import("./pages/landing/LandingAnimaux"));
const LandingPret = lazy(() => import("./pages/landing/LandingPret"));
const LandingVie = lazy(() => import("./pages/landing/LandingVie"));
const LandingPrevoyance = lazy(() => import("./pages/landing/LandingPrevoyance"));
const LandingRCPro = lazy(() => import("./pages/landing/LandingRCPro"));
const LandingGLI = lazy(() => import("./pages/landing/LandingGLI"));
const LandingPNO = lazy(() => import("./pages/landing/LandingPNO"));
const LandingMRP = lazy(() => import("./pages/landing/LandingMRP"));
const LandingAccrobranche = lazy(() => import("./pages/landing/LandingAccrobranche"));
const LandingMoniteurSport = lazy(() => import("./pages/landing/LandingMoniteurSport"));
const LandingEvenementiel = lazy(() => import("./pages/landing/LandingEvenementiel"));
const LandingCordisteBTP = lazy(() => import("./pages/landing/LandingCordisteBTP"));
const LandingVtc = lazy(() => import("./pages/landing/LandingVtc"));
const LandingAutoEntrepreneur = lazy(() => import("./pages/landing/LandingAutoEntrepreneur"));
const LandingSenior = lazy(() => import("./pages/landing/LandingSenior"));
const LandingScooter = lazy(() => import("./pages/landing/LandingScooter"));
const LandingRcProMicroEntreprise = lazy(() => import("./pages/landing/LandingRcProMicroEntreprise"));
const LandingRestaurant = lazy(() => import("./pages/landing/LandingRestaurant"));
const LandingCoachSportif = lazy(() => import("./pages/landing/LandingCoachSportif"));
const LandingPhotographe = lazy(() => import("./pages/landing/LandingPhotographe"));
const LandingInfluenceur = lazy(() => import("./pages/landing/LandingInfluenceur"));
const LandingDrone = lazy(() => import("./pages/landing/LandingDrone"));
const LandingDecennale = lazy(() => import("./pages/landing/LandingDecennale"));
const LandingFlotteAuto = lazy(() => import("./pages/landing/LandingFlotteAuto"));
const LandingMutuelleEntreprise = lazy(() => import("./pages/landing/LandingMutuelleEntreprise"));
const LandingCyber = lazy(() => import("./pages/landing/LandingCyber"));
const LandingSansPermis = lazy(() => import("./pages/landing/LandingSansPermis"));
const LandingCampingCar = lazy(() => import("./pages/landing/LandingCampingCar"));
const LandingVelo = lazy(() => import("./pages/landing/LandingVelo"));
const LandingProtectionJuridique = lazy(() => import("./pages/landing/LandingProtectionJuridique"));
const LandingAutoTemporaire = lazy(() => import("./pages/landing/LandingAutoTemporaire"));
const AssuranceAutoMalusse = lazy(() => import("./pages/seo/AssuranceAutoMalusse"));
const AssuranceJeuneConducteur = lazy(() => import("./pages/seo/AssuranceJeuneConducteur"));
const MutuelleTNS = lazy(() => import("./pages/seo/MutuelleTNS"));
const CategorieAutoSEO = lazy(() => import("./pages/seo/CategorieAutoSEO"));
const AssuranceTrottinetteElectrique = lazy(() => import("./pages/seo/AssuranceTrottinetteElectrique"));
const AssuranceAutoPermisEtranger = lazy(() => import("./pages/seo/AssuranceAutoPermisEtranger"));
const AssuranceEmprunteurSEO = lazy(() => import("./pages/seo/AssuranceEmprunteurSEO"));
const Comparateur = lazy(() => import("./pages/Comparateur"));

const AssuranceAuto = lazy(() => import("./pages/AssuranceAuto"));
const AssuranceSante = lazy(() => import("./pages/AssuranceSante"));
const AssuranceAnimaux = lazy(() => import("./pages/AssuranceAnimaux"));
const AssuranceHabitation = lazy(() => import("./pages/AssuranceHabitation"));
const AssurancePret = lazy(() => import("./pages/AssurancePret"));
const AssuranceMoto = lazy(() => import("./pages/AssuranceMoto"));
const AssuranceVie = lazy(() => import("./pages/AssuranceVie"));
const AssurancePrevoyance = lazy(() => import("./pages/AssurancePrevoyance"));
const AssuranceMRP = lazy(() => import("./pages/AssuranceMRP"));
const AssuranceRCPro = lazy(() => import("./pages/AssuranceRCPro"));
const AssuranceExpatries = lazy(() => import("./pages/AssuranceExpatries"));
const AssuranceMetiersAtypiques = lazy(() => import("./pages/AssuranceMetiersAtypiques"));
const AssuranceGLI = lazy(() => import("./pages/AssuranceGLI"));
const AssurancePNO = lazy(() => import("./pages/AssurancePNO"));
const GestionLocative = lazy(() => import("./pages/GestionLocative"));
const QuiSommesNous = lazy(() => import("./pages/QuiSommesNous"));
const NosPartenaires = lazy(() => import("./pages/NosPartenaires"));
const AvisClients = lazy(() => import("./pages/AvisClients"));
const Blog = lazy(() => import("./pages/Blog"));
const BlogArticle = lazy(() => import("./pages/BlogArticle"));
const BlogPreview = lazy(() => import("./pages/BlogPreview"));
const Glossaire = lazy(() => import("./pages/Glossaire"));
const GlossaireTerme = lazy(() => import("./pages/GlossaireTerme"));
const PolitiqueCookies = lazy(() => import("./pages/PolitiqueCookies"));
const MentionsLegales = lazy(() => import("./pages/MentionsLegales"));
const CGU = lazy(() => import("./pages/CGU"));
const PolitiqueConfidentialite = lazy(() => import("./pages/PolitiqueConfidentialite"));
const Contact = lazy(() => import("./pages/Contact"));
const FAQ = lazy(() => import("./pages/FAQ"));
const NewsletterGestion = lazy(() => import("./pages/NewsletterGestion"));
const PlanDuSite = lazy(() => import("./pages/PlanDuSite"));
const SourcesEtMethodologie = lazy(() => import("./pages/SourcesEtMethodologie"));
const NotFound = lazy(() => import("./pages/NotFound"));
const Merci = lazy(() => import("./pages/Merci"));
const LlmsTxt = lazy(() => import("./pages/LlmsTxt"));
const CalculateurBonusMalus = lazy(() => import("./pages/outils/CalculateurBonusMalus"));
const RegionalInsurancePage = lazy(() => import("./pages/regional/RegionalInsurancePage"));
const DuelPage = lazy(() => import("./pages/comparatif/DuelPage"));
const NicheProfilePage = lazy(() => import("./pages/profil/NicheProfilePage"));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      gcTime: 10 * 60 * 1000,
    },
  },
});

// Wrapper that lazily loads AuthProvider only for protected routes
const AuthRoute = ({ children }: { children: React.ReactNode }) => (
  <Suspense fallback={
    <div className="min-h-screen flex items-center justify-center" role="status" aria-live="polite">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      <span className="sr-only">Chargement en cours...</span>
    </div>
  }>
    <AuthProvider>
      {children}
    </AuthProvider>
  </Suspense>
);

const App = () => {
  const [showDeferredWidgets, setShowDeferredWidgets] = React.useState(false);

  React.useEffect(() => {
    const idleWindow = window as Window & {
      requestIdleCallback?: (callback: IdleRequestCallback, options?: IdleRequestOptions) => number;
      cancelIdleCallback?: (handle: number) => void;
    };

    let timeoutId: number | null = null;
    let idleId: number | null = null;

    const mountWidgets = () => setShowDeferredWidgets(true);

    if (typeof idleWindow.requestIdleCallback === "function") {
      idleId = idleWindow.requestIdleCallback(mountWidgets, { timeout: 2500 });
    } else {
      timeoutId = window.setTimeout(mountWidgets, 1200);
    }

    return () => {
      if (idleId !== null && typeof idleWindow.cancelIdleCallback === "function") {
        idleWindow.cancelIdleCallback(idleId);
      }
      if (timeoutId !== null) {
        clearTimeout(timeoutId);
      }
    };
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <LanguageProvider>
        <TooltipProvider>
          <Toaster />
          <GlobalSchemas />
          <Suspense fallback={null}>
            <RouteTracker />
          </Suspense>
          <Suspense fallback={null}>
            <GlobalMdReveal />
          </Suspense>
          <Suspense fallback={null}>
            <ReadingProgressBar />
          </Suspense>
          <Suspense fallback={null}>
            <SkipToMain />
          </Suspense>
          <ErrorBoundary>
            <Suspense fallback={
              <div className="min-h-screen flex items-center justify-center" role="status" aria-live="polite">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                <span className="sr-only">Chargement en cours...</span>
              </div>
            }>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/auth" element={<AuthRoute><Auth /></AuthRoute>} />
                <Route path="/admin" element={<AuthRoute><Admin /></AuthRoute>} />
                <Route path="/commercial" element={<AuthRoute><Commercial /></AuthRoute>} />
                <Route path="/landing/assurance" element={<LandingAds />} />
                <Route path="/landing/auto" element={<LandingAuto />} />
                <Route path="/landing/sante" element={<LandingSante />} />
                <Route path="/landing/habitation" element={<LandingHabitation />} />
                <Route path="/landing/moto" element={<LandingMoto />} />
                <Route path="/landing/animaux" element={<LandingAnimaux />} />
                <Route path="/landing/pret" element={<LandingPret />} />
                <Route path="/landing/vie" element={<LandingVie />} />
                <Route path="/landing/prevoyance" element={<LandingPrevoyance />} />
                <Route path="/landing/rc-pro" element={<LandingRCPro />} />
                <Route path="/landing/gli" element={<LandingGLI />} />
                <Route path="/landing/pno" element={<LandingPNO />} />
                <Route path="/landing/mrp" element={<LandingMRP />} />
                <Route path="/landing/accrobranche" element={<LandingAccrobranche />} />
                <Route path="/landing/moniteur-sport" element={<LandingMoniteurSport />} />
                <Route path="/landing/evenementiel" element={<LandingEvenementiel />} />
                <Route path="/landing/cordiste-btp" element={<LandingCordisteBTP />} />
                <Route path="/landing/vtc" element={<LandingVtc />} />
                <Route path="/landing/auto-entrepreneur" element={<LandingAutoEntrepreneur />} />
                <Route path="/landing/senior" element={<LandingSenior />} />
                <Route path="/landing/scooter" element={<LandingScooter />} />
                <Route path="/landing/rc-pro-micro-entreprise" element={<LandingRcProMicroEntreprise />} />
                <Route path="/landing/restaurant" element={<LandingRestaurant />} />
                <Route path="/landing/coach-sportif" element={<LandingCoachSportif />} />
                <Route path="/landing/photographe" element={<LandingPhotographe />} />
                <Route path="/landing/influenceur" element={<LandingInfluenceur />} />
                <Route path="/landing/drone" element={<LandingDrone />} />
                <Route path="/comparateur" element={<Comparateur />} />
                <Route path="/assurance-auto-malusse" element={<AssuranceAutoMalusse />} />
                <Route path="/assurance-auto-jeune-conducteur" element={<AssuranceJeuneConducteur />} />
                <Route path="/mutuelle-tns" element={<MutuelleTNS />} />
                <Route path="/assurance-auto-comparatif" element={<CategorieAutoSEO />} />
                <Route path="/assurance-trottinette-electrique" element={<AssuranceTrottinetteElectrique />} />
                <Route path="/assurance-auto-permis-etranger" element={<AssuranceAutoPermisEtranger />} />
                <Route path="/assurance-emprunteur" element={<AssuranceEmprunteurSEO />} />
                <Route path="/assurance-auto/:department" element={<RegionalInsurancePage />} />
                <Route path="/assurance-auto" element={<AssuranceAuto />} />
                <Route path="/assurance-sante" element={<AssuranceSante />} />
                <Route path="/assurance-moto" element={<AssuranceMoto />} />
                <Route path="/assurance-habitation" element={<AssuranceHabitation />} />
                <Route path="/assurance-pret" element={<AssurancePret />} />
                <Route path="/assurance-prevoyance" element={<AssurancePrevoyance />} />
                <Route path="/assurance-animaux" element={<AssuranceAnimaux />} />
                <Route path="/assurance-vie" element={<AssuranceVie />} />
                <Route path="/assurance-expatries" element={<AssuranceExpatries />} />
                <Route path="/assurance-mrp" element={<AssuranceMRP />} />
                <Route path="/assurance-rc-pro" element={<AssuranceRCPro />} />
                <Route path="/assurance-metiers-atypiques" element={<AssuranceMetiersAtypiques />} />
                <Route path="/assurance-gli" element={<AssuranceGLI />} />
                <Route path="/assurance-pno" element={<AssurancePNO />} />
                <Route path="/gestion-locative" element={<GestionLocative />} />
                <Route path="/qui-sommes-nous" element={<QuiSommesNous />} />
                <Route path="/nos-partenaires" element={<NosPartenaires />} />
                <Route path="/avis-clients" element={<AvisClients />} />
                <Route path="/blog" element={<Blog />} />
                <Route path="/blog/:slug" element={<BlogArticle />} />
                <Route path="/blog-preview" element={<BlogPreview />} />
                <Route path="/blog-preview/:slug" element={<BlogArticle />} />
                <Route path="/glossaire" element={<Glossaire />} />
                <Route path="/glossaire/:slug" element={<GlossaireTerme />} />
                <Route path="/politique-cookies" element={<PolitiqueCookies />} />
                <Route path="/mentions-legales" element={<MentionsLegales />} />
                <Route path="/cgu" element={<CGU />} />
                <Route path="/politique-confidentialite" element={<PolitiqueConfidentialite />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/faq" element={<FAQ />} />
                <Route path="/newsletter-gestion" element={<NewsletterGestion />} />
                <Route path="/plan-du-site" element={<PlanDuSite />} />
                <Route path="/sources-et-methodologie" element={<SourcesEtMethodologie />} />
                <Route path="/merci" element={<Merci />} />
                <Route path="/outils/calculateur-bonus-malus" element={<CalculateurBonusMalus />} />
                <Route path="/comparatif/:slug" element={<DuelPage />} />
                <Route path="/comparatif" element={<DuelPage />} />
                <Route path="/profil/:slug" element={<NicheProfilePage />} />
                <Route path="/profil" element={<NicheProfilePage />} />
                <Route path="/llms.txt" element={<LlmsTxt />} />

                {/* Legacy slug redirects (mirrors public/.htaccess for Lovable hosting) */}
                <Route path="/landing" element={<Navigate to="/comparateur" replace />} />
                <Route path="/blog/guide-choisir-assurance-auto-2024" element={<Navigate to="/blog/guide-choisir-assurance-auto-2026" replace />} />
                <Route path="/blog/loi-lemoine-assurance-emprunteur-2024" element={<Navigate to="/blog/loi-lemoine-assurance-emprunteur-2026" replace />} />
                <Route path="/blog/resiliation-assurance-droits-2024" element={<Navigate to="/blog/resiliation-assurance-droits-2026" replace />} />
                <Route path="/blog/mutuelle-sante-reduire-frais-medicaux-2024" element={<Navigate to="/blog/mutuelle-sante-reduire-frais-medicaux-2026" replace />} />
                <Route path="/blog/assurance-jeune-conducteur-2025-moins-cher" element={<Navigate to="/blog/assurance-jeune-conducteur-2026-moins-cher" replace />} />
                <Route path="/blog/comparatif-habitation-2025" element={<Navigate to="/blog/comparatif-habitation-2026" replace />} />
                <Route path="/blog/droits-des-assures-2025" element={<Navigate to="/blog/droits-des-assures-2026" replace />} />
                <Route path="/blog/loi-lemoine-2025" element={<Navigate to="/blog/loi-lemoine-2026" replace />} />
                <Route path="/blog/meilleure-assurance-auto-2025" element={<Navigate to="/blog/meilleure-assurance-auto-2026" replace />} />
                <Route path="/blog/meilleure-assurance-auto-2025-comparatif" element={<Navigate to="/blog/meilleure-assurance-auto-2026-comparatif" replace />} />
                <Route path="/blog/nouvelle-reglementation-assurance-2025" element={<Navigate to="/blog/nouvelle-reglementation-assurance-2026" replace />} />
                <Route path="/blog/top-10-meilleures-mutuelles-sante-2025" element={<Navigate to="/blog/top-10-meilleures-mutuelles-sante-2026" replace />} />
                <Route path="/blog/top-mutuelles-sante-2025" element={<Navigate to="/blog/top-mutuelles-sante-2026" replace />} />
                <Route path="/blog/accident-seul-sans-tiers-declarer-ou-reparer" element={<Navigate to="/blog/accident-seul-sans-tiers-declarer-reparer" replace />} />
                <Route path="/blog/arnaques-assurance-courantes-2026" element={<Navigate to="/blog/5-arnaques-assurance-courantes-2026" replace />} />
                <Route path="/blog/fausse-declaration-assurance-risques-sanctions" element={<Navigate to="/blog/fausse-declaration-assurance-risques-reels" replace />} />
                <Route path="/blog/loi-hamon-2026-resilier-3-clics-apres-un-an" element={<Navigate to="/blog/loi-hamon-2026-resilier-assurance-3-clics" replace />} />
                <Route path="/blog/non-lieu-assurance-aucun-assureur-bct" element={<Navigate to="/blog/non-lieu-assurance-aucun-assureur-role-bct" replace />} />
                <Route path="/blog/voiture-immobilisee-garage-arreter-assurance" element={<Navigate to="/blog/voiture-immobilisee-garage-arreter-assurer" replace />} />

                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </ErrorBoundary>
          <Suspense fallback={null}>
            <CookieBanner />
          </Suspense>
          <Suspense fallback={null}>
            <StickyCTA />
          </Suspense>
          {showDeferredWidgets && (
            <>
              <Suspense fallback={null}>
                <AIChatbot />
              </Suspense>
              <Suspense fallback={null}>
                <ContractOptimizerWidget />
              </Suspense>
            </>
          )}
        </TooltipProvider>
      </LanguageProvider>
    </QueryClientProvider>
  );
};

export default App;
