import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useLocation, useNavigate } from "react-router-dom";
import type { Factor } from "@supabase/supabase-js";
import { KeyRound, Loader2, LogOut } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

// Deuxième étape de connexion : code TOTP après le mot de passe, pour un
// compte qui a au moins un facteur vérifié (session aal1 -> aal2).
export default function AuthMfa() {
  const { user, loading, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: string } | null)?.from || "/admin";
  const [factors, setFactors] = useState<Factor[]>([]);
  const [factorId, setFactorId] = useState("");
  const [code, setCode] = useState("");
  const [checking, setChecking] = useState(true);
  const [verifying, setVerifying] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (loading) return;
    if (!user) {
      navigate("/auth", { replace: true });
      return;
    }
    (async () => {
      const { data: aal } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel();
      // Déjà en aal2, ou aucun facteur vérifié : rien à saisir ici.
      if (aal?.currentLevel === "aal2" || aal?.nextLevel !== "aal2") {
        navigate(from, { replace: true });
        return;
      }
      const { data: list } = await supabase.auth.mfa.listFactors();
      const verified = (list?.totp ?? []).filter((f) => f.status === "verified");
      setFactors(verified);
      setFactorId(verified[0]?.id ?? "");
      setChecking(false);
    })();
  }, [user, loading, navigate, from]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const clean = code.replace(/\s/g, "");
    if (!/^\d{6}$/.test(clean)) {
      setError("Saisissez les 6 chiffres affichés par votre application.");
      return;
    }
    setVerifying(true);
    setError(null);
    const { error: err } = await supabase.auth.mfa.challengeAndVerify({ factorId, code: clean });
    setVerifying(false);
    if (err) {
      setError("Code incorrect ou expiré. Attendez le code suivant et réessayez.");
      setCode("");
      return;
    }
    navigate(from, { replace: true });
  };

  const logout = async () => {
    await signOut();
    navigate("/auth", { replace: true });
  };

  return (
    <>
      <Helmet>
        <title>Code de sécurité | jemassuremoinscher.fr</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-primary/5 via-background to-accent/5 p-4">
        <Card className="w-full max-w-md p-8">
          <div className="mb-6 flex flex-col items-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
              <KeyRound className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-2xl font-bold">Code de sécurité</h1>
            <p className="mt-2 text-center text-sm text-muted-foreground">
              Saisissez le code à 6 chiffres affiché par votre application d'authentification.
            </p>
          </div>

          {checking ? (
            <div className="flex justify-center py-6">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
            </div>
          ) : (
            <form onSubmit={submit} className="space-y-4">
              {factors.length > 1 && (
                <div className="space-y-2">
                  <Label htmlFor="mfa-factor">Appareil</Label>
                  <select
                    id="mfa-factor"
                    value={factorId}
                    onChange={(e) => setFactorId(e.target.value)}
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  >
                    {factors.map((f) => (
                      <option key={f.id} value={f.id}>
                        {f.friendly_name || "Application d'authentification"}
                      </option>
                    ))}
                  </select>
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="mfa-code">Code</Label>
                <Input
                  id="mfa-code"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  autoFocus
                  maxLength={7}
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="123456"
                  className="text-center text-lg tracking-[0.4em]"
                />
              </div>
              {error && <p className="text-sm text-red-600">{error}</p>}
              <Button type="submit" className="w-full" disabled={verifying || !factorId}>
                {verifying ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                Valider
              </Button>
              <p className="text-center text-xs text-muted-foreground">
                Téléphone indisponible ? Utilisez votre deuxième appareil s'il est enregistré, sinon contactez
                l'administrateur.
              </p>
            </form>
          )}

          <button
            type="button"
            onClick={logout}
            className="mx-auto mt-6 flex items-center gap-1 text-xs text-muted-foreground hover:underline"
          >
            <LogOut className="h-3.5 w-3.5" />
            Se déconnecter
          </button>
        </Card>
      </div>
    </>
  );
}
