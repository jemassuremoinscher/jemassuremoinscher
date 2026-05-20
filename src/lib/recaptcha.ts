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

export async function getCaptchaToken(action = "submit"): Promise<string> {
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
}

import { supabase } from "@/integrations/supabase/client";

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
  return supabase.functions.invoke("send-quote-email", {
    body,
    headers: token ? { "x-captcha-token": token } : undefined,
  });
}
