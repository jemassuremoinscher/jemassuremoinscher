// Types de notifications disponibles
export const NOTIF_TYPES = {
  lead_quote: { label: "Nouveau devis (site)", group: "Leads", default: true },
  lead_callback: { label: "Nouvelle demande de rappel", group: "Leads", default: true },
  lead_transfer: { label: "Transfert chatbot", group: "Leads", default: true },
  deal_new: { label: "Nouveau deal créé/assigné", group: "Deals", default: true },
  deal_stage: { label: "Changement d'étape d'un deal", group: "Deals", default: true },
  deal_reassign: { label: "Réassignation d'un deal", group: "Deals", default: true },
  task_new: { label: "Nouvelle tâche assignée", group: "Tâches", default: true },
  task_reassign: { label: "Tâche réassignée", group: "Tâches", default: true },
  task_update: { label: "Tâche modifiée", group: "Tâches", default: true },
  task_done: { label: "Tâche complétée", group: "Tâches", default: true },
} as const;

export type NotifType = keyof typeof NOTIF_TYPES;

export interface NotifPrefs {
  types: Record<NotifType, boolean>;
  // Anti-spam
  dedupWindowMs: number; // fenêtre pendant laquelle un même event (type+entity) est ignoré
  burstThreshold: number; // à partir de N events du même type en burstWindow → groupé
  burstWindowMs: number;
}

const DEFAULTS: NotifPrefs = {
  types: Object.fromEntries(
    Object.entries(NOTIF_TYPES).map(([k, v]) => [k, v.default]),
  ) as Record<NotifType, boolean>,
  dedupWindowMs: 5 * 60 * 1000,
  burstThreshold: 3,
  burstWindowMs: 10 * 1000,
};

const key = (userId: string) => `notif-prefs:${userId}`;

export function loadPrefs(userId: string): NotifPrefs {
  if (typeof window === "undefined") return DEFAULTS;
  try {
    const raw = localStorage.getItem(key(userId));
    if (!raw) return DEFAULTS;
    const parsed = JSON.parse(raw) as Partial<NotifPrefs>;
    return {
      ...DEFAULTS,
      ...parsed,
      types: { ...DEFAULTS.types, ...(parsed.types ?? {}) },
    };
  } catch {
    return DEFAULTS;
  }
}

export function savePrefs(userId: string, prefs: NotifPrefs) {
  if (typeof window === "undefined") return;
  localStorage.setItem(key(userId), JSON.stringify(prefs));
  window.dispatchEvent(new CustomEvent("notif-prefs-changed", { detail: { userId } }));
}

export function resetPrefs(userId: string) {
  savePrefs(userId, DEFAULTS);
}
