import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";
import CookieBanner from "@/components/CookieBanner";
import { AIChatbot } from "@/components/chatbot/AIChatbot";
import SkipToMain from "@/components/SkipToMain";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { LanguageProvider } from "@/contexts/LanguageContext";

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
const AssuranceGLI = lazy(() => import("./pages/AssuranceGLI"));
const AssurancePNO = lazy(() => import("./pages/AssurancePNO"));
const GestionLocative = lazy(() => import("./pages/GestionLocative"));
const QuiSommesNous = lazy(() => import("./pages/QuiSommesNous"));
const NosPartenaires = lazy(() => import("./pages/NosPartenaires"));
const AvisClients = lazy(() => import("./pages/AvisClients"));
const Blog = lazy(() => import("./pages/Blog"));
const BlogArticle = lazy(() => import("./pages/BlogArticle"));
const PolitiqueCookies = lazy(() => import("./pages/PolitiqueCookies"));
const MentionsLegales = lazy(() => import("./pages/MentionsLegales"));
const CGU = lazy(() => import("./pages/CGU"));
const PolitiqueConfidentialite = lazy(() => import("./pages/PolitiqueConfidentialite"));
const Contact = lazy(() => import("./pages/Contact"));
const NewsletterGestion = lazy(() => import("./pages/NewsletterGestion"));
const PlanDuSite = lazy(() => import("./pages/PlanDuSite"));
const NotFound = lazy(() => import("./pages/NotFound"));

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <LanguageProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <SkipToMain />
          <ErrorBoundary>
            <Suspense fallback={
              <div className="min-h-screen flex items-center justify-center" role="status" aria-live="polite">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                <span className="sr-only">Chargement en cours...</span>
              </div>
            }>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/auth" element={<Auth />} />
                <Route path="/admin" element={<Admin />} />
                <Route path="/commercial" element={<Commercial />} />
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
                <Route path="/comparateur" element={<Comparateur />} />
                
                <Route path="/assurance-auto" element={<AssuranceAuto />} />
                <Route path="/assurance-sante" element={<AssuranceSante />} />
                <Route path="/assurance-moto" element={<AssuranceMoto />} />
                <Route path="/assurance-habitation" element={<AssuranceHabitation />} />
                <Route path="/assurance-pret" element={<AssurancePret />} />
                <Route path="/assurance-prevoyance" element={<AssurancePrevoyance />} />
                <Route path="/assurance-animaux" element={<AssuranceAnimaux />} />
                <Route path="/assurance-vie" element={<AssuranceVie />} />
                <Route path="/assurance-mrp" element={<AssuranceMRP />} />
                <Route path="/assurance-rc-pro" element={<AssuranceRCPro />} />
                <Route path="/assurance-gli" element={<AssuranceGLI />} />
                <Route path="/assurance-pno" element={<AssurancePNO />} />
                <Route path="/gestion-locative" element={<GestionLocative />} />
                <Route path="/qui-sommes-nous" element={<QuiSommesNous />} />
                <Route path="/nos-partenaires" element={<NosPartenaires />} />
                <Route path="/avis-clients" element={<AvisClients />} />
                <Route path="/blog" element={<Blog />} />
                <Route path="/blog/:slug" element={<BlogArticle />} />
                <Route path="/politique-cookies" element={<PolitiqueCookies />} />
                <Route path="/mentions-legales" element={<MentionsLegales />} />
                <Route path="/cgu" element={<CGU />} />
                <Route path="/politique-confidentialite" element={<PolitiqueConfidentialite />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/newsletter-gestion" element={<NewsletterGestion />} />
                <Route path="/plan-du-site" element={<PlanDuSite />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </ErrorBoundary>
          <CookieBanner />
          <AIChatbot />
        </BrowserRouter>
      </TooltipProvider>
    </LanguageProvider>
  </QueryClientProvider>
);

export default App;
