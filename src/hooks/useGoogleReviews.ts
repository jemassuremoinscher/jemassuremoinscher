import { useEffect, useState } from "react";

export interface GoogleReviewsSummary {
  rating: number;
  total: number;
}

const CACHE_KEY = "google_reviews_summary_v1";
const CACHE_TTL_MS = 24 * 60 * 60 * 1000; // 24h
const FAIL_KEY = "google_reviews_failed_v1";
const FAIL_TTL_MS = 60 * 60 * 1000; // 1h — avoid re-hitting a broken endpoint

const isFailCached = () => {
  if (typeof window === "undefined") return false;
  try {
    const raw = sessionStorage.getItem(FAIL_KEY);
    if (!raw) return false;
    const ts = Number(raw);
    return Number.isFinite(ts) && Date.now() - ts < FAIL_TTL_MS;
  } catch {
    return false;
  }
};

/**
 * Fetches the live Google Business Profile rating + review count from the
 * /api/google-reviews serverless function. Cached in sessionStorage for 24h.
 * Silently caches failures for 1h so a broken/misconfigured endpoint doesn't
 * spam requests on every homepage render.
 */
export const useGoogleReviews = (): GoogleReviewsSummary | null => {
  const [data, setData] = useState<GoogleReviewsSummary | null>(() => {
    if (typeof window === "undefined") return null;
    try {
      const raw = sessionStorage.getItem(CACHE_KEY);
      if (!raw) return null;
      const parsed = JSON.parse(raw) as { ts: number; data: GoogleReviewsSummary };
      if (Date.now() - parsed.ts > CACHE_TTL_MS) return null;
      return parsed.data;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    let cancelled = false;
    if (data) return;
    if (isFailCached()) return;

    const markFail = () => {
      try {
        sessionStorage.setItem(FAIL_KEY, String(Date.now()));
      } catch {
        /* ignore */
      }
    };

    fetch("/api/google-reviews")
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error("api"))))
      .then((d: { rating: number | null; total: number; fallback?: boolean }) => {
        if (cancelled) return;
        if (!d || d.fallback || !d.rating || !d.total) {
          markFail();
          return;
        }
        const summary: GoogleReviewsSummary = { rating: d.rating, total: d.total };
        setData(summary);
        try {
          sessionStorage.setItem(CACHE_KEY, JSON.stringify({ ts: Date.now(), data: summary }));
        } catch {
          /* ignore quota */
        }
      })
      .catch(() => {
        if (!cancelled) markFail();
      });
    return () => {
      cancelled = true;
    };
  }, [data]);

  return data;
};
