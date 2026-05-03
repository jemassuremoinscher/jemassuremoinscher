import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

let cache: Set<string> | null = null;
let inflight: Promise<Set<string>> | null = null;

export const fetchPublishedDraftSlugs = (): Promise<Set<string>> => {
  if (cache) return Promise.resolve(cache);
  if (inflight) return inflight;
  inflight = supabase
    .from("published_drafts")
    .select("slug")
    .then(({ data }) => {
      cache = new Set((data || []).map((r: { slug: string }) => r.slug));
      inflight = null;
      return cache;
    });
  return inflight;
};

export const invalidatePublishedDraftsCache = () => {
  cache = null;
  inflight = null;
};

export const usePublishedDraftSlugs = () => {
  const [slugs, setSlugs] = useState<Set<string>>(cache || new Set());
  useEffect(() => {
    let mounted = true;
    fetchPublishedDraftSlugs().then((s) => mounted && setSlugs(new Set(s)));
    return () => {
      mounted = false;
    };
  }, []);
  return slugs;
};
