// reCAPTCHA v3 client helper.
// Lazily injects the Google script and returns a fresh token for the given action.
// Site key is public — safe to embed.
export const RECAPTCHA_SITE_KEY = "6LdZFfMsAAAAAHZkv7f5kjZHHM-DRst_XiJOjmEh";

declare global {
  interface Window {
    grecaptcha?: {
      ready: (cb: () => void) => void;
      execute: (siteKey: string, opts: { action: string }) => Promise<string>;
    };
  }
}

let loaderPromise: Promise<void> | null = null;

function loadScript(): Promise<void> {
  if (typeof window === "undefined") return Promise.reject(new Error("SSR"));
  if (window.grecaptcha) return Promise.resolve();
  if (loaderPromise) return loaderPromise;
  loaderPromise = new Promise((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>(
      'script[data-recaptcha="v3"]'
    );
    if (existing) {
      existing.addEventListener("load", () => resolve());
      existing.addEventListener("error", () => reject(new Error("recaptcha load failed")));
      return;
    }
    const s = document.createElement("script");
    s.src = `https://www.google.com/recaptcha/api.js?render=${RECAPTCHA_SITE_KEY}`;
    s.async = true;
    s.defer = true;
    s.dataset.recaptcha = "v3";
    s.onload = () => resolve();
    s.onerror = () => reject(new Error("recaptcha load failed"));
    document.head.appendChild(s);
  });
  return loaderPromise;
}

/** Précharge le script (à l'affichage de l'étape coordonnées) pour ne pas le
 *  télécharger au moment du clic. Sans effet si déjà chargé ; erreurs ignorées. */
export function preloadRecaptcha(): void {
  loadScript().catch(() => {});
}

const CAPTCHA_TIMEOUT_MS = 8000;

export async function getCaptchaToken(action = "submit"): Promise<string> {
  const tokenPromise = (async () => {
    await loadScript();
    return await new Promise<string>((resolve, reject) => {
      if (!window.grecaptcha) return reject(new Error("grecaptcha unavailable"));
      window.grecaptcha.ready(async () => {
        try {
          const token = await window.grecaptcha!.execute(RECAPTCHA_SITE_KEY, { action });
          resolve(token);
        } catch (e) {
          reject(e);
        }
      });
    });
  })();
  // Délai maximal : un script Google lent ou bloqué ne doit pas figer l'envoi.
  return await Promise.race([
    tokenPromise,
    new Promise<string>((_, reject) => setTimeout(() => reject(new Error("recaptcha timeout")), CAPTCHA_TIMEOUT_MS)),
  ]);
}

import { supabase } from "@/integrations/supabase/client";
import { reportSiteError } from "@/lib/siteErrorLog";

/**
 * Wrapper around supabase.functions.invoke('send-quote-email') that attaches
 * a fresh reCAPTCHA v3 token in the x-captcha-token header. The token is
 * verified server-side using RECAPTCHA_SECRET_KEY.
 */
export async function invokeSendQuoteEmail(body: Record<string, unknown>, action = "send_quote_email") {
  let token = "";
  try {
    token = await getCaptchaToken(action);
  } catch (e) {
    console.warn("reCAPTCHA token fetch failed", e);
  }
  if (!token) {
    // Sans jeton, send-quote-email répond 401 et n'envoie AUCUN email
    // (ni au prospect ni à contact@) : on le trace pour le voir.
    reportSiteError({ type: "edge_function", message: "send-quote-email : jeton reCAPTCHA indisponible (envoi refusé en 401)", context: { action } });
  }
  const result = await supabase.functions.invoke("send-quote-email", {
    body,
    headers: token ? { "x-captcha-token": token } : undefined,
  });
  if (result.error) {
    // functions.invoke ne lève pas d'exception : sans ce log, un 401/403 passait inaperçu.
    reportSiteError({ type: "edge_function", message: `send-quote-email en échec : ${result.error.message}`, context: { action, hasToken: !!token } });
  }
  return result;
}
