import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { Link, Navigate, useLocation } from "react-router-dom";
import { ShieldCheck, X } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { mfaRpc, MfaStatus, useMfaStatus } from "@/hooks/useMfaStatus";

// Garde double authentification des espaces connectés (CRM, commercial).
// PHASE 1 : contrôle côté interface uniquement, aucune politique RLS ni
// vérification dans les Edge Functions.
// - Compte avec un facteur vérifié, session en aal1 -> /auth/mfa (code),
//   quel que soit le mode : un compte enrôlé passe toujours par son code.
// - mode 'warn' : accès aal1 journalisé (log_mfa_access, une fois par
//   session d'onglet ; le serveur limite à une ligne / 10 min) et bandeau.
// - mode 'enforce' : compte sans facteur -> /admin/securite pour s'enrôler.
// - mode 'off' (défaut) : rien d'autre.

const SECURITY_PATH = "/admin/securite";

const MfaContext = createContext<MfaStatus | null>(null);

export const useMfa = () => useContext(MfaContext);

export default function MfaGate({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const status = useMfaStatus();
  const location = useLocation();

  const needsCode = !!user && status.currentLevel === "aal1" && status.nextLevel === "aal2";
  const mustEnroll =
    !!user && status.mode === "enforce" && status.verifiedFactors.length === 0 && location.pathname !== SECURITY_PATH;

  useEffect(() => {
    if (!user || status.loading || status.mode !== "warn" || status.currentLevel !== "aal1") return;
    const key = `mfa-access-logged:${user.id}`;
    try {
      if (sessionStorage.getItem(key)) return;
      sessionStorage.setItem(key, "1");
    } catch {
      /* stockage indisponible : le serveur limite de toute façon */
    }
    mfaRpc("log_mfa_access", { p_path: location.pathname }).then(
      () => undefined,
      () => undefined,
    );
  }, [user, status.loading, status.mode, status.currentLevel, location.pathname]);

  if (user && status.loading) {
    return (
      <div className="grid min-h-screen place-items-center bg-[#FAF5FF]">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#E9D5FF] border-t-[#7C3AED]" />
      </div>
    );
  }

  if (needsCode) {
    return <Navigate to="/auth/mfa" replace state={{ from: location.pathname + location.search }} />;
  }
  if (mustEnroll) {
    return <Navigate to={SECURITY_PATH} replace />;
  }

  return <MfaContext.Provider value={status}>{children}</MfaContext.Provider>;
}

// Bandeau d'invitation, en mode 'warn' ou 'enforce', pour un compte sans
// facteur vérifié. Masquable pour la session en mode 'warn'.
export function MfaBanner() {
  const status = useMfa();
  const location = useLocation();
  const [hidden, setHidden] = useState(() => {
    try {
      return sessionStorage.getItem("mfa-banner-hidden") === "1";
    } catch {
      return false;
    }
  });

  if (!status || status.loading || status.mode === "off" || status.verifiedFactors.length > 0) return null;
  if (location.pathname === SECURITY_PATH) return null;
  if (hidden && status.mode === "warn") return null;

  return (
    <div className="mx-6 mt-4 flex items-center gap-3 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
      <ShieldCheck className="h-5 w-5 shrink-0" />
      <div className="flex-1">
        Protégez l'accès au CRM : activez la double authentification (un code à 6 chiffres sur votre téléphone en
        plus du mot de passe).
      </div>
      <Link
        to={SECURITY_PATH}
        className="shrink-0 rounded-full bg-[#7C3AED] px-4 py-1.5 text-xs font-medium text-white"
      >
        Activer
      </Link>
      {status.mode === "warn" && (
        <button
          type="button"
          aria-label="Masquer pour cette session"
          onClick={() => {
            setHidden(true);
            try {
              sessionStorage.setItem("mfa-banner-hidden", "1");
            } catch {
              /* ignore */
            }
          }}
          className="shrink-0 rounded-full p-1 hover:bg-amber-100"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}
