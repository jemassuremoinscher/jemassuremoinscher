import { Bell, BellOff, Search, LogOut, Inbox } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { useEffect, useState, useCallback } from "react";
import { useLeadNotifications } from "@/hooks/useLeadNotifications";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export function CrmHeader({
  query,
  onQueryChange,
}: {
  query: string;
  onQueryChange: (v: string) => void;
}) {
  const { user, signOut, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [enabled, setEnabled] = useState<boolean>(() => {
    if (typeof window === "undefined" || !("Notification" in window)) return false;
    const stored = localStorage.getItem("crm.notifications.enabled");
    // Auto-activate si permission déjà accordée (sauf refus explicite précédent)
    if (stored === null && Notification.permission === "granted") return true;
    return stored === "1" && Notification.permission === "granted";
  });
  const [permission, setPermission] = useState<NotificationPermission>(
    typeof window !== "undefined" && "Notification" in window ? Notification.permission : "default"
  );

  const { requestPermission } = useLeadNotifications({
    enabled: enabled && !!user,
    userId: user?.id,
    isSupervisor: isAdmin,
  });

  useEffect(() => {
    localStorage.setItem("crm.notifications.enabled", enabled ? "1" : "0");
  }, [enabled]);

  // Réactive automatiquement si l'utilisateur autorise dans les paramètres Chrome pendant la session
  useEffect(() => {
    if (!("Notification" in window)) return;
    const check = () => {
      const p = Notification.permission;
      setPermission(p);
      if (p === "granted" && !enabled && localStorage.getItem("crm.notifications.enabled") !== "0") {
        setEnabled(true);
      }
      if (p !== "granted" && enabled) {
        setEnabled(false);
      }
    };
    const onVis = () => document.visibilityState === "visible" && check();
    document.addEventListener("visibilitychange", onVis);
    window.addEventListener("focus", check);
    const iv = setInterval(check, 5000);
    return () => {
      document.removeEventListener("visibilitychange", onVis);
      window.removeEventListener("focus", check);
      clearInterval(iv);
    };
  }, [enabled]);


  const toggle = async () => {
    if (!("Notification" in window)) {
      toast.error("Notifications non supportées par ce navigateur");
      return;
    }
    if (!enabled) {
      const perm = await requestPermission();
      setPermission(perm ?? Notification.permission);
      if (perm === "granted") {
        setEnabled(true);
        toast.success("Notifications activées — tu recevras une alerte à chaque nouveau lead");
      } else {
        toast.error("Autorise les notifications dans le navigateur pour activer cette fonction");
      }
    } else {
      setEnabled(false);
      toast("Notifications désactivées");
    }
  };

  const initials = (user?.email ?? "?").split("@")[0].slice(0, 2).toUpperCase();

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
        onClick={toggle}
        className={`relative grid h-10 w-10 place-items-center rounded-full transition ${
          enabled
            ? "bg-[#7C3AED] text-white hover:bg-[#6D28D9]"
            : "text-slate-500 hover:bg-[#F3E8FF] hover:text-[#5B21B6]"
        }`}
        aria-label={enabled ? "Désactiver les notifications de leads" : "Activer les notifications de leads"}
        title={enabled ? "Notifications actives (nouveaux leads)" : "Activer les notifications Chrome"}
      >
        {enabled ? <Bell className="h-4 w-4" /> : <BellOff className="h-4 w-4" />}
        {enabled && (
          <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-green-400 ring-2 ring-white" />
        )}
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
