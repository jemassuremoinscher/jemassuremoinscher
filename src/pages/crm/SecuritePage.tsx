import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { KeyRound, Loader2, ShieldCheck, Smartphone, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useMfa } from "@/components/auth/MfaGate";
import { mfaRpc, MfaMode, useMfaStatus } from "@/hooks/useMfaStatus";

// /admin/securite : enrôlement TOTP (QR code + code), facteurs du compte,
// deuxième facteur proposé, et pour l'admin le réglage mfa_mode et l'état
// des comptes. Phase 1 : aucune politique RLS ni vérification côté Edge
// Functions.

type Enrollment = { factorId: string; qr: string; secret: string };

type OverviewRow = {
  user_id: string;
  email: string | null;
  roles: string[];
  verified_factors: number;
  last_aal1_access: string | null;
};

const MODES: { id: MfaMode; label: string; desc: string }[] = [
  { id: "off", label: "Désactivé", desc: "Aucune invitation ni journalisation. Les comptes enrôlés saisissent quand même leur code." },
  { id: "warn", label: "Avertissement", desc: "Bandeau d'invitation et journalisation des accès sans code (aal1)." },
  {
    id: "enforce",
    label: "Bloquant (interface)",
    desc: "Les comptes sans facteur sont envoyés vers cette page. Le blocage côté base arrivera en phase 2.",
  },
];

// Le QR code renvoyé est un SVG brut ou déjà une URL data:.
const qrSrc = (qr: string) => (qr.startsWith("data:") ? qr : `data:image/svg+xml;utf-8,${encodeURIComponent(qr)}`);

// Message clair si l'enrôlement échoue (TOTP non activée sur la plateforme
// le plus souvent). Aucun changement n'est fait sur le compte dans ce cas.
function enrollErrorMessage(message: string): string {
  const m = message.toLowerCase();
  if (m.includes("disabled") || m.includes("not enabled") || m.includes("mfa_totp_enroll_not_enabled")) {
    return "La double authentification n'est pas activée sur la plateforme (Lovable Cloud). Aucun changement n'a été fait sur votre compte. Transmettez ce message à Paul.";
  }
  if (m.includes("aal2")) {
    return "Pour ajouter un appareil, reconnectez-vous en saisissant d'abord le code de votre appareil actuel.";
  }
  if (m.includes("friendly name") || m.includes("already exists")) {
    return "Ce nom d'appareil est déjà utilisé sur votre compte. Choisissez-en un autre.";
  }
  return `L'activation a échoué. Aucun changement n'a été fait sur votre compte. Détail à transmettre à Paul : ${message}`;
}

export default function SecuritePage() {
  const { isAdmin } = useAuth();
  // Contexte partagé avec la garde (MfaGate) ; repli sur un état local si la
  // page est montée hors garde.
  const fromGate = useMfa();
  const local = useMfaStatus();
  const status = fromGate ?? local;

  const [name, setName] = useState("");
  const [enrollment, setEnrollment] = useState<Enrollment | null>(null);
  const [code, setCode] = useState("");
  const [busy, setBusy] = useState(false);
  const [enrollError, setEnrollError] = useState<string | null>(null);
  const [justEnrolled, setJustEnrolled] = useState(false);

  const verified = status.verifiedFactors;
  const suggestedName = verified.length === 0 ? "Téléphone principal" : "Deuxième appareil";

  const startEnroll = async () => {
    setBusy(true);
    setEnrollError(null);
    try {
      // Nettoie un enrôlement abandonné (facteur non vérifié).
      for (const f of status.factors.filter((x) => x.status !== "verified")) {
        await supabase.auth.mfa.unenroll({ factorId: f.id }).catch(() => undefined);
      }
      const { data, error } = await supabase.auth.mfa.enroll({
        factorType: "totp",
        friendlyName: (name.trim() || suggestedName).slice(0, 60),
        issuer: "jemassuremoinscher.fr",
      });
      if (error || !data) {
        setEnrollError(enrollErrorMessage(error?.message ?? "réponse vide"));
        return;
      }
      setEnrollment({ factorId: data.id, qr: data.totp.qr_code, secret: data.totp.secret });
      setCode("");
    } catch (e) {
      setEnrollError(enrollErrorMessage(e instanceof Error ? e.message : String(e)));
    } finally {
      setBusy(false);
    }
  };

  const confirmEnroll = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!enrollment) return;
    const clean = code.replace(/\s/g, "");
    if (!/^\d{6}$/.test(clean)) {
      toast.error("Saisissez les 6 chiffres affichés par l'application.");
      return;
    }
    setBusy(true);
    const { error } = await supabase.auth.mfa.challengeAndVerify({ factorId: enrollment.factorId, code: clean });
    setBusy(false);
    if (error) {
      toast.error("Code incorrect ou expiré. Attendez le code suivant et réessayez.");
      setCode("");
      return;
    }
    toast.success("Appareil enregistré");
    setEnrollment(null);
    setName("");
    setJustEnrolled(true);
    await status.refresh();
  };

  const cancelEnroll = async () => {
    if (enrollment) await supabase.auth.mfa.unenroll({ factorId: enrollment.factorId }).catch(() => undefined);
    setEnrollment(null);
    setCode("");
    await status.refresh();
  };

  const removeFactor = async (factorId: string, label: string) => {
    if (!confirm(`Retirer l'appareil « ${label} » ?`)) return;
    const { error } = await supabase.auth.mfa.unenroll({ factorId });
    if (error) {
      toast.error(
        error.message.toLowerCase().includes("aal2")
          ? "Reconnectez-vous avec votre code avant de retirer un appareil."
          : `Retrait impossible : ${error.message}`,
      );
      return;
    }
    toast.success("Appareil retiré");
    await status.refresh();
  };

  return (
    <div className="flex flex-1 flex-col overflow-y-auto px-6 py-6">
      <div className="flex items-start gap-3">
        <div className="rounded-2xl bg-[#F5F3FF] p-2.5 dark:bg-[#262140]">
          <ShieldCheck className="h-5 w-5 text-[#7C3AED] dark:text-[#C4B5FD]" />
        </div>
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-50">Sécurité</h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Double authentification : un code à 6 chiffres (Google Authenticator, Microsoft Authenticator,
            1Password…) en plus du mot de passe.
          </p>
        </div>
      </div>

      <section className="mt-6 max-w-3xl rounded-3xl border border-[#E9D5FF] bg-white p-6 dark:border-[#362B54] dark:bg-[#1E1B2E]">
        <h2 className="text-lg font-semibold">Mes appareils</h2>
        {status.loading ? (
          <Loader2 className="mt-4 h-5 w-5 animate-spin text-[#7C3AED]" />
        ) : verified.length === 0 ? (
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">Aucun appareil enregistré.</p>
        ) : (
          <ul className="mt-3 divide-y divide-slate-100 dark:divide-[#362B54]">
            {verified.map((f) => (
              <li key={f.id} className="flex items-center gap-3 py-2 text-sm">
                <Smartphone className="h-4 w-4 text-slate-500" />
                <span className="flex-1">{f.friendly_name || "Application d'authentification"}</span>
                <span className="text-xs text-slate-500">
                  ajouté le {new Date(f.created_at).toLocaleDateString("fr-FR")}
                </span>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => removeFactor(f.id, f.friendly_name || "appareil")}
                  className="rounded-full border-red-200 text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40"
                >
                  <Trash2 className="mr-1 h-3.5 w-3.5" />
                  Retirer
                </Button>
              </li>
            ))}
          </ul>
        )}

        {(justEnrolled || verified.length === 1) && !enrollment && (
          <div className="mt-4 rounded-2xl bg-amber-50 px-4 py-3 text-sm text-amber-900">
            <div className="font-medium">Ajoutez un deuxième appareil</div>
            Enregistrez un deuxième facteur (autre téléphone ou gestionnaire de mots de passe) pour ne pas perdre
            l'accès si vous perdez ce téléphone. Il sera obligatoire pour l'administrateur avant le mode bloquant.
          </div>
        )}

        {!enrollment && !status.loading && (
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={suggestedName}
              className="max-w-xs rounded-full"
              aria-label="Nom de l'appareil"
            />
            <Button onClick={startEnroll} disabled={busy} className="rounded-full bg-[#7C3AED] hover:bg-[#6D28D9]">
              {busy ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <KeyRound className="mr-2 h-4 w-4" />}
              {verified.length === 0 ? "Activer la double authentification" : "Ajouter un appareil"}
            </Button>
          </div>
        )}

        {enrollError && (
          <div role="alert" className="mt-4 rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">
            {enrollError}
          </div>
        )}

        {enrollment && (
          <form onSubmit={confirmEnroll} className="mt-4 grid gap-4 sm:grid-cols-[200px_1fr]">
            <img
              src={qrSrc(enrollment.qr)}
              alt="QR code à scanner avec l'application d'authentification"
              className="h-[200px] w-[200px] rounded-xl border border-slate-200 bg-white p-2"
            />
            <div className="space-y-3 text-sm">
              <p>1. Scannez le QR code avec votre application d'authentification.</p>
              <p>
                Ou saisissez la clé : <code className="break-all rounded bg-slate-100 px-1.5 py-0.5 text-xs dark:bg-[#13111C]">{enrollment.secret}</code>
              </p>
              <p className="text-xs text-slate-500">
                Conservez cette clé hors ligne (coffre ou gestionnaire de mots de passe) : elle permet de recréer le
                code si le téléphone est perdu.
              </p>
              <p>2. Saisissez le code à 6 chiffres affiché :</p>
              <div className="flex gap-2">
                <Input
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  maxLength={7}
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="123456"
                  className="max-w-[140px] text-center tracking-[0.3em]"
                  aria-label="Code à 6 chiffres"
                />
                <Button type="submit" disabled={busy} className="rounded-full">
                  {busy ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                  Valider
                </Button>
                <Button type="button" variant="ghost" onClick={cancelEnroll} disabled={busy}>
                  Annuler
                </Button>
              </div>
            </div>
          </form>
        )}
      </section>

      {isAdmin && <AdminSection mode={status.mode} onModeChanged={status.refresh} />}
    </div>
  );
}

function AdminSection({ mode, onModeChanged }: { mode: MfaMode; onModeChanged: () => Promise<void> }) {
  const [rows, setRows] = useState<OverviewRow[]>([]);
  const [unavailable, setUnavailable] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    const { data, error } = await mfaRpc("get_mfa_overview");
    if (error) {
      setUnavailable(
        error.code === "PGRST202"
          ? "Réglage indisponible : les migrations 20261003000200_app_settings.sql et 20261003000400_mfa_phase1.sql ne sont pas appliquées. Le mode reste « Désactivé »."
          : `Lecture impossible : ${error.message}`,
      );
      return;
    }
    setUnavailable(null);
    setRows((data ?? []) as OverviewRow[]);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const changeMode = async (next: MfaMode) => {
    if (next === mode) return;
    if (!confirm(`Passer la double authentification en mode « ${MODES.find((m) => m.id === next)?.label} » ?`)) return;
    setSaving(true);
    const { error } = await mfaRpc("set_mfa_mode", { p_mode: next });
    setSaving(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Réglage enregistré");
    await onModeChanged();
    await load();
  };

  return (
    <section className="mt-6 max-w-3xl rounded-3xl border border-[#E9D5FF] bg-white p-6 dark:border-[#362B54] dark:bg-[#1E1B2E]">
      <h2 className="text-lg font-semibold">Réglage pour tous les comptes (admin)</h2>
      {unavailable ? (
        <p className="mt-2 text-sm text-amber-800">{unavailable}</p>
      ) : (
        <>
          <div className="mt-3 grid gap-2 sm:grid-cols-3">
            {MODES.map((m) => (
              <button
                key={m.id}
                type="button"
                disabled={saving}
                onClick={() => changeMode(m.id)}
                className={`rounded-2xl border px-3 py-2 text-left text-sm ${
                  m.id === mode
                    ? "border-[#7C3AED] bg-[#F5F3FF] dark:bg-[#262140]"
                    : "border-slate-200 hover:border-[#C4B5FD] dark:border-[#362B54]"
                }`}
              >
                <div className="font-medium">{m.label}</div>
                <div className="mt-1 text-xs text-slate-500 dark:text-slate-400">{m.desc}</div>
              </button>
            ))}
          </div>
          <p className="mt-2 text-xs text-slate-500">
            Le mode bloquant exige deux appareils enregistrés sur votre compte et une connexion avec code.
          </p>

          <table className="mt-4 w-full text-sm">
            <thead className="text-left text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">
              <tr>
                <th className="py-1">Compte</th>
                <th className="py-1">Rôles</th>
                <th className="py-1 text-right">Appareils</th>
                <th className="py-1 pl-4">Dernier accès sans code</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-[#362B54]">
              {rows.map((r) => (
                <tr key={r.user_id}>
                  <td className="py-1">{r.email ?? r.user_id}</td>
                  <td className="py-1 text-xs">{r.roles.join(", ")}</td>
                  <td className={`py-1 text-right ${r.verified_factors === 0 ? "text-amber-700" : ""}`}>
                    {r.verified_factors}
                  </td>
                  <td className="py-1 pl-4 text-xs text-slate-500">
                    {r.last_aal1_access ? new Date(r.last_aal1_access).toLocaleString("fr-FR") : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </section>
  );
}
