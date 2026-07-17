// Vercel Serverless Function — fetches the latest Google Place Details (rating, total, reviews)
// for our Business Profile. The API key is read server-side only.
// Cached at the edge for 24h with 12h SWR.
// Always returns 200 with { fallback: true } on failure so the browser never
// logs a red 500 and the frontend can gracefully fall back to static values.

export default async function handler(req: any, res: any) {
  const placeId = "ChIJEW-5W2jRzRIRDhndqH-zyMs";
  const key = process.env.GOOGLE_PLACES_API_KEY;

  const fallback = (reason: string) => {
    // Cache the fallback briefly at the edge so a missing key doesn't hammer this route.
    res.setHeader("Cache-Control", "s-maxage=300, stale-while-revalidate=300");
    return res.status(200).json({ fallback: true, error: reason, rating: null, total: 0, reviews: [] });
  };

  if (!key) return fallback("missing_key");

  const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=rating,user_ratings_total,reviews&language=fr&reviews_sort=newest&key=${key}`;

  try {
    const r = await fetch(url);
    const data = await r.json();
    if (data.status !== "OK") return fallback(data.status || "api_error");
    const x = data.result || {};
    res.setHeader("Cache-Control", "s-maxage=86400, stale-while-revalidate=43200");
    return res.status(200).json({
      rating: x.rating ?? null,
      total: x.user_ratings_total ?? 0,
      reviews: (x.reviews || []).map((v: any) => ({
        author: v.author_name,
        rating: v.rating,
        text: v.text,
        relativeTime: v.relative_time_description,
        profilePhoto: v.profile_photo_url,
        authorUrl: v.author_url,
      })),
    });
  } catch {
    return fallback("fetch_failed");
  }
}
