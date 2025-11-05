import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";
import CookieBanner from "@/components/CookieBanner";

// Lazy load pages for better performance
const Index = lazy(() => import("./pages/Index"));
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
        <Suspense fallback={
          <div className="min-h-screen flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        }>
          <Routes>
            <Route path="/" element={<Index />} />
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
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
