import { supabase } from "@/integrations/supabase/client";

export type SiteErrorType =
  | "form_submit"
  | "callback_submit"
  | "runtime"
  | "route_not_found"
  | "chunk_load"
  | "edge_function";

interface ReportInput {
  type: SiteErrorType;
  message?: string;
  insuranceType?: string;
  context?: Record<string, unknown>;
  pagePath?: string;
}

// Avoid flooding the log with the same error in a burst
const recent = new Map<string, number>();
const DEDUPE_MS = 60_000;

// Bruit connu : extensions de navigateur, scripts tiers et faux positifs.
// Ces messages ne viennent pas de notre code et ne doivent pas créer d'alerte.
const IGNORED_PATTERNS: RegExp[] = [
  /extension/i,
  /talisman/i,
  /metamask|phantom|coinbase|ethereum|solana|web3|wallet/i,
  /ResizeObserver loop/i,
  /chrome-extension:|moz-extension:|safari-extension:/i,
  /Script error\.?$/i,
  /Non-Error promise rejection captured/i,
];

function isIgnorableError(message: string): boolean {
  return IGNORED_PATTERNS.some((re) => re.test(message));
}

/**
 * Fire-and-forget error reporting to the back-office alert feed.
 * Never throws and never blocks the UI.
 */
export function reportSiteError({ type, message, insuranceType, context, pagePath }: ReportInput): void {
  try {
    const path = pagePath ?? (typeof window !== "undefined" ? window.location.pathname : "unknown");
    const key = `${type}|${path}|${(message ?? "").slice(0, 120)}`;
    const now = Date.now();
    const last = recent.get(key);
    if (last && now - last < DEDUPE_MS) return;
    recent.set(key, now);

    void supabase
      .from("site_error_log")
      .insert({
        page_path: path.slice(0, 300),
        error_type: type,
        message: (message ?? "").slice(0, 2000) || null,
        insurance_type: insuranceType ?? null,
        context: (context ?? {}) as never,
        user_agent: typeof navigator !== "undefined" ? navigator.userAgent.slice(0, 400) : null,
      })
      .then(() => undefined, () => undefined);
  } catch {
    /* never break the app because of logging */
  }
}

let installed = false;

/** Installs global listeners for uncaught runtime errors and failed chunk loads. */
export function installGlobalErrorReporter(): void {
  if (installed || typeof window === "undefined") return;
  installed = true;

  window.addEventListener("error", (event) => {
    const msg = event.message || String(event.error ?? "");
    if (!msg) return;
    const isChunk = /Loading chunk|dynamically imported module|Importing a module script failed/i.test(msg);
    reportSiteError({
      type: isChunk ? "chunk_load" : "runtime",
      message: msg,
      context: { filename: (event as ErrorEvent).filename, line: (event as ErrorEvent).lineno },
    });
  });

  window.addEventListener("unhandledrejection", (event) => {
    const reason = (event as PromiseRejectionEvent).reason;
    const msg = reason instanceof Error ? reason.message : String(reason ?? "");
    if (!msg || msg === "undefined") return;
    reportSiteError({ type: "runtime", message: msg, context: { kind: "unhandledrejection" } });
  });
}
