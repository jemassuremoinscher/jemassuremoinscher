import { useEffect, useState } from "react";

export interface GoogleReviewsSummary {
  rating: number;
  total: number;
}

const CACHE_KEY = "google_reviews_summary_v1";
const CACHE_TTL_MS = 24 * 60 * 60 * 1000; // 24h

/**
 * Fetches the live Google Business Profile rating + review count from the
 * /api/google-reviews serverless function. Cached in sessionStorage for 24h.
 * Returns null until the first successful fetch — callers should fall back
 * to their default static values.
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
    fetch("/api/google-reviews")
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error("api"))))
      .then((d: { rating: number | null; total: number }) => {
        if (cancelled) return;
        if (!d || !d.rating || !d.total) return;
        const summary: GoogleReviewsSummary = { rating: d.rating, total: d.total };
        setData(summary);
        try {
          sessionStorage.setItem(CACHE_KEY, JSON.stringify({ ts: Date.now(), data: summary }));
        } catch {
          /* ignore quota */
        }
      })
      .catch(() => {
        /* silent fallback */
      });
    return () => {
      cancelled = true;
    };
  }, [data]);

  return data;
};
