import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { NOTIF_TYPES, NotifType, NotifPrefs, loadPrefs, savePrefs, resetPrefs } from "@/lib/notificationPrefs";
import { useLeadNotifications } from "@/hooks/useLeadNotifications";
import { toast } from "sonner";
import { Bell, RotateCcw, Send, Sparkles } from "lucide-react";

export default function NotificationSettings() {
  const { user, isAdmin } = useAuth();
  const uid = user?.id ?? "anon";
  const [prefs, setPrefs] = useState<NotifPrefs>(() => loadPrefs(uid));
  const { sendTestNotification } = useLeadNotifications({
    enabled: true,
    userId: user?.id,
    isSupervisor: isAdmin,
  });
  const [permission, setPermission] = useState<NotificationPermission>(
    typeof window !== "undefined" && "Notification" in window ? Notification.permission : "default",
  );

  useEffect(() => {
    setPrefs(loadPrefs(uid));
  }, [uid]);

  const update = (patch: Partial<NotifPrefs>) => {
    const next = { ...prefs, ...patch };
    setPrefs(next);
    savePrefs(uid, next);
  };

  const toggleType = (t: NotifType) => {
    update({ types: { ...prefs.types, [t]: !prefs.types[t] } });
  };

  const groups: Record<string, NotifType[]> = {};
  (Object.keys(NOTIF_TYPES) as NotifType[]).forEach((k) => {
    const g = NOTIF_TYPES[k].group;
    (groups[g] ||= []).push(k);
  });

  const doTest = async () => {
    const ok = await sendTestNotification();
    setPermission(Notification.permission);
    if (ok) toast.success("Notification de test envoyée");
    else toast.error("Autorise d'abord les notifications dans le navigateur");
  };

  return (
    <div className="mx-auto max-w-3xl space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Notifications</h1>
        <p className="text-sm text-slate-500">
          Choisis quels événements déclenchent une notification Chrome.
        </p>
      </div>

      <div className="rounded-3xl border border-[#E9D5FF] bg-white p-5">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 text-sm font-semibold text-slate-800">
              <Bell className="h-4 w-4 text-[#7C3AED]" />
              Permission navigateur
            </div>
            <p className="text-xs text-slate-500">
              État actuel :{" "}
              <span className={permission === "granted" ? "text-green-600" : "text-orange-600"}>
                {permission}
              </span>
            </p>
          </div>
          <button
            type="button"
            onClick={doTest}
            className="inline-flex items-center gap-2 rounded-full bg-[#7C3AED] px-4 py-2 text-sm font-medium text-white hover:bg-[#6D28D9]"
          >
            <Send className="h-4 w-4" /> Tester la notification
          </button>
        </div>
      </div>

      {Object.entries(groups).map(([group, types]) => (
        <div key={group} className="rounded-3xl border border-[#E9D5FF] bg-white p-5">
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-[#5B21B6]">{group}</h2>
          <div className="divide-y divide-slate-100">
            {types.map((t) => (
              <label key={t} className="flex items-center justify-between py-3 text-sm">
                <span className="text-slate-700">{NOTIF_TYPES[t].label}</span>
                <input
                  type="checkbox"
                  checked={!!prefs.types[t]}
                  onChange={() => toggleType(t)}
                  className="h-5 w-9 cursor-pointer appearance-none rounded-full bg-slate-300 transition-colors checked:bg-[#7C3AED] relative
                    after:absolute after:left-0.5 after:top-0.5 after:h-4 after:w-4 after:rounded-full after:bg-white after:transition-transform
                    checked:after:translate-x-4"
                />
              </label>
            ))}
          </div>
        </div>
      ))}

      <div className="rounded-3xl border border-[#E9D5FF] bg-white p-5">
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-[#5B21B6]">Anti-spam</h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <label className="text-sm">
            <span className="mb-1 block text-slate-600">Dédoublonnage (min)</span>
            <input
              type="number"
              min={1}
              max={60}
              value={Math.round(prefs.dedupWindowMs / 60000)}
              onChange={(e) => update({ dedupWindowMs: Number(e.target.value) * 60000 })}
              className="w-full rounded-xl border border-[#E9D5FF] px-3 py-2"
            />
            <p className="mt-1 text-[11px] text-slate-500">Même événement ignoré pendant N minutes.</p>
          </label>
          <label className="text-sm">
            <span className="mb-1 block text-slate-600">Seuil rafale</span>
            <input
              type="number"
              min={2}
              max={20}
              value={prefs.burstThreshold}
              onChange={(e) => update({ burstThreshold: Number(e.target.value) })}
              className="w-full rounded-xl border border-[#E9D5FF] px-3 py-2"
            />
            <p className="mt-1 text-[11px] text-slate-500">Au-delà, on regroupe.</p>
          </label>
          <label className="text-sm">
            <span className="mb-1 block text-slate-600">Fenêtre rafale (s)</span>
            <input
              type="number"
              min={1}
              max={120}
              value={Math.round(prefs.burstWindowMs / 1000)}
              onChange={(e) => update({ burstWindowMs: Number(e.target.value) * 1000 })}
              className="w-full rounded-xl border border-[#E9D5FF] px-3 py-2"
            />
            <p className="mt-1 text-[11px] text-slate-500">Durée d'observation de la rafale.</p>
          </label>
        </div>
      </div>

      <button
        type="button"
        onClick={() => {
          resetPrefs(uid);
          setPrefs(loadPrefs(uid));
          toast("Préférences réinitialisées");
        }}
        className="inline-flex items-center gap-2 rounded-full border border-[#E9D5FF] px-4 py-2 text-sm text-slate-600 hover:bg-[#FAF5FF]"
      >
        <RotateCcw className="h-4 w-4" /> Réinitialiser
      </button>
    </div>
  );
}
