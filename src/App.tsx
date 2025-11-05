import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import AssuranceAuto from "./pages/AssuranceAuto";
import AssuranceSante from "./pages/AssuranceSante";
import AssuranceAnimaux from "./pages/AssuranceAnimaux";
import AssuranceHabitation from "./pages/AssuranceHabitation";
import AssurancePret from "./pages/AssurancePret";
import QuiSommesNous from "./pages/QuiSommesNous";
import NosPartenaires from "./pages/NosPartenaires";
import AvisClients from "./pages/AvisClients";
import Blog from "./pages/Blog";
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
          <Route path="/qui-sommes-nous" element={<QuiSommesNous />} />
          <Route path="/nos-partenaires" element={<NosPartenaires />} />
          <Route path="/avis-clients" element={<AvisClients />} />
          <Route path="/blog" element={<Blog />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
