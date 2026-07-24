import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { CrmSidebar } from "./CrmSidebar";
import { CrmHeader } from "./CrmHeader";

export default function CrmLayout() {
  const { user, isAdmin, loading } = useAuth();
  const navigate = useNavigate();
  const [query, setQuery] = useState("");

  useEffect(() => {
    if (!loading && !user) navigate("/auth");
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="grid min-h-screen place-items-center bg-[#FAF5FF]">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#E9D5FF] border-t-[#7C3AED]" />
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>CRM · jemassuremoinscher.fr</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      <div className="flex min-h-screen w-full bg-[#FAF5FF]/40 font-sans text-slate-800">
        <CrmSidebar isAdmin={isAdmin} />
        <div className="flex min-w-0 flex-1 flex-col">
          <CrmHeader query={query} onQueryChange={setQuery} />
          <main className="flex flex-1 flex-col overflow-hidden">
            <Outlet context={{ query }} />
          </main>
        </div>
      </div>
    </>
  );
}
