import { Bell, Search, LogOut } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";

export function CrmHeader({
  query,
  onQueryChange,
}: {
  query: string;
  onQueryChange: (v: string) => void;
}) {
  const { user, signOut, isAdmin } = useAuth();
  const navigate = useNavigate();
  const initials = (user?.email ?? "?")
    .split("@")[0]
    .slice(0, 2)
    .toUpperCase();

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-[#E9D5FF] bg-white/80 px-6 backdrop-blur">
      <div className="relative flex-1 max-w-xl">
        <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <input
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          placeholder="Rechercher un prospect, un email, un téléphone…"
          className="w-full rounded-full border border-[#E9D5FF] bg-[#FAF5FF]/60 py-2.5 pl-11 pr-4 text-sm text-slate-800 placeholder:text-slate-400 focus:border-[#7C3AED] focus:bg-white focus:outline-none focus:ring-4 focus:ring-[#F3E8FF]"
          aria-label="Recherche globale"
        />
      </div>

      <button
        type="button"
        className="grid h-10 w-10 place-items-center rounded-full text-slate-500 hover:bg-[#F3E8FF] hover:text-[#5B21B6]"
        aria-label="Notifications"
      >
        <Bell className="h-4 w-4" />
      </button>

      <div className="flex items-center gap-3">
        <div className="text-right leading-tight">
          <div className="text-xs font-semibold text-slate-800">
            {user?.email?.split("@")[0]}
          </div>
          <div className="text-[11px] uppercase tracking-wide text-[#7C3AED]">
            {isAdmin ? "Admin" : "Commercial"}
          </div>
        </div>
        <div className="grid h-10 w-10 place-items-center rounded-full bg-[#7C3AED] text-sm font-semibold text-white">
          {initials}
        </div>
        <button
          type="button"
          onClick={async () => {
            await signOut();
            navigate("/");
          }}
          className="grid h-10 w-10 place-items-center rounded-full text-slate-500 hover:bg-slate-100"
          aria-label="Déconnexion"
        >
          <LogOut className="h-4 w-4" />
        </button>
      </div>
    </header>
  );
}
