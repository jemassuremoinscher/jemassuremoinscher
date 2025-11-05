import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";
import CookieBanner from "@/components/CookieBanner";
import { AIChatbot } from "@/components/chatbot/AIChatbot";
import SkipToMain from "@/components/SkipToMain";

// Lazy load pages for better performance
const Index = lazy(() => import("./pages/Index"));
const Auth = lazy(() => import("./pages/Auth"));
const Admin = lazy(() => import("./pages/Admin"));
const LandingAds = lazy(() => import("./pages/LandingAds"));
const Comparateur = lazy(() => import("./pages/Comparateur"));
const ComparateurGaranties = lazy(() => import("./pages/ComparateurGaranties"));
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
const NotFound = lazy(() => import("./pages/NotFound"));

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <SkipToMain />
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
            <Route path="/landing/assurance" element={<LandingAds />} />
            <Route path="/comparateur" element={<Comparateur />} />
            <Route path="/comparateur-garanties" element={<ComparateurGaranties />} />
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
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
        <CookieBanner />
        <AIChatbot />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
