import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import CookieBanner from "@/components/CookieBanner";
import Index from "./pages/Index";
import AssuranceAuto from "./pages/AssuranceAuto";
import AssuranceSante from "./pages/AssuranceSante";
import AssuranceAnimaux from "./pages/AssuranceAnimaux";
import AssuranceHabitation from "./pages/AssuranceHabitation";
import AssurancePret from "./pages/AssurancePret";
import AssuranceMoto from "./pages/AssuranceMoto";
import AssurancePrevoyance from "./pages/AssurancePrevoyance";
import AssuranceMRP from "./pages/AssuranceMRP";
import AssuranceRCPro from "./pages/AssuranceRCPro";
import QuiSommesNous from "./pages/QuiSommesNous";
import NosPartenaires from "./pages/NosPartenaires";
import AvisClients from "./pages/AvisClients";
import Blog from "./pages/Blog";
import PolitiqueCookies from "./pages/PolitiqueCookies";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/assurance-auto" element={<AssuranceAuto />} />
          <Route path="/assurance-sante" element={<AssuranceSante />} />
          <Route path="/assurance-animaux" element={<AssuranceAnimaux />} />
          <Route path="/assurance-habitation" element={<AssuranceHabitation />} />
          <Route path="/assurance-pret" element={<AssurancePret />} />
          <Route path="/assurance-moto" element={<AssuranceMoto />} />
          <Route path="/assurance-prevoyance" element={<AssurancePrevoyance />} />
          <Route path="/assurance-mrp" element={<AssuranceMRP />} />
          <Route path="/assurance-rc-pro" element={<AssuranceRCPro />} />
          <Route path="/qui-sommes-nous" element={<QuiSommesNous />} />
          <Route path="/nos-partenaires" element={<NosPartenaires />} />
          <Route path="/avis-clients" element={<AvisClients />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/politique-cookies" element={<PolitiqueCookies />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
        <CookieBanner />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
