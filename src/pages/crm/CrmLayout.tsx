import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useAdminTheme } from "@/hooks/useAdminTheme";
import { CrmSidebar } from "./CrmSidebar";
import { CrmHeader } from "./CrmHeader";
import arthurWatermark from "@/assets/mascotte/arthur-thumbs-up.webp";

export default function CrmLayout() {
  const { user, isAdmin, loading } = useAuth();
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  // Classe `dark` posée ici, scopée à ce sous-arbre — jamais sur <html>, pour
  // ne pas affecter le thème du site public (voir useAdminTheme.ts).
  const { isDark, toggle: toggleTheme } = useAdminTheme();

  useEffect(() => {
    if (!loading && !user) navigate("/auth");
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className={`grid min-h-screen place-items-center bg-[#FAF5FF] dark:bg-[#13111C] ${isDark ? "dark" : ""}`}>
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#E9D5FF] dark:border-[#362B54] border-t-[#7C3AED] dark:border-t-[#C4B5FD]" />
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>CRM · jemassuremoinscher.fr</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      <div className={`flex min-h-screen w-full bg-[#FAF5FF]/40 dark:bg-[#13111C] font-sans text-slate-800 dark:text-slate-100 ${isDark ? "dark" : ""}`}>
        <CrmSidebar isAdmin={isAdmin} />
        <div className="relative flex min-w-0 flex-1 flex-col">
          <CrmHeader query={query} onQueryChange={setQuery} isDark={isDark} onToggleTheme={toggleTheme} />
          {/* Filigrane Arthur global — toutes les pages admin */}
          <div
            aria-hidden="true"
            className="pointer-events-none fixed inset-0 z-0 flex items-center justify-center"
          >
            <img
              src={arthurWatermark}
              alt=""
              className="h-[85vh] w-auto select-none opacity-[0.06]"
              style={{ background: "transparent" }}
            />
          </div>
          <main className="relative z-10 flex flex-1 flex-col overflow-hidden">
            <Outlet context={{ query }} />
          </main>
        </div>
      </div>
    </>
  );
}
