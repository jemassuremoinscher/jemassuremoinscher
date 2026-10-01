import { useCallback, useEffect, useState } from "react";
import type { Factor } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

// Double authentification, phase 1 : état du compte connecté et mode global
// (app_settings.mfa_mode via get_mfa_mode(), migration
// 20261002000200_mfa_phase1.sql). Si la migration n'est pas appliquée ou si
// l'appel échoue, le mode vaut 'off' : rien ne s'active.

export type MfaMode = "off" | "warn" | "enforce";
export type Aal = "aal1" | "aal2" | null;

// Fonctions SQL ajoutées par la migration, absentes des types générés.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const mfaRpc = (fn: string, args?: Record<string, unknown>) => (supabase.rpc as any)(fn, args);

export async function fetchMfaMode(): Promise<MfaMode> {
  try {
    const { data, error } = await mfaRpc("get_mfa_mode");
    if (error) return "off";
    return data === "warn" || data === "enforce" ? data : "off";
  } catch {
    return "off";
  }
}

export interface MfaStatus {
  loading: boolean;
  mode: MfaMode;
  currentLevel: Aal;
  // 'aal2' si le compte a au moins un facteur vérifié.
  nextLevel: Aal;
  factors: Factor[];
  verifiedFactors: Factor[];
  refresh: () => Promise<void>;
}

export function useMfaStatus(): MfaStatus {
  const { user, loading: authLoading } = useAuth();
  // Compte pour lequel l'état a été lu : tant qu'il diffère du compte
  // connecté, l'état est "en cours". Un refresh() ultérieur (après un
  // enrôlement) ne repasse pas en chargement, pour ne pas démonter l'écran.
  const [checkedFor, setCheckedFor] = useState<string | null>(null);
  const [mode, setMode] = useState<MfaMode>("off");
  const [currentLevel, setCurrentLevel] = useState<Aal>(null);
  const [nextLevel, setNextLevel] = useState<Aal>(null);
  const [factors, setFactors] = useState<Factor[]>([]);

  const refresh = useCallback(async () => {
    if (!user) return;
    const [m, aal, list] = await Promise.all([
      fetchMfaMode(),
      supabase.auth.mfa.getAuthenticatorAssuranceLevel().catch(() => null),
      supabase.auth.mfa.listFactors().catch(() => null),
    ]);
    setMode(m);
    setCurrentLevel((aal?.data?.currentLevel as Aal) ?? null);
    setNextLevel((aal?.data?.nextLevel as Aal) ?? null);
    setFactors(list?.data?.all ?? []);
    setCheckedFor(user.id);
  }, [user]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return {
    loading: authLoading || (!!user && checkedFor !== user.id),
    mode,
    currentLevel,
    nextLevel,
    factors,
    verifiedFactors: factors.filter((f) => f.status === "verified"),
    refresh,
  };
}
