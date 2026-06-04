import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Star, ExternalLink } from "lucide-react";
import { GOOGLE_REVIEWS_PUBLIC_URL } from "@/config/site";

interface GoogleReview {
  author: string;
  rating: number;
  text: string;
  relativeTime: string;
  profilePhoto?: string;
  authorUrl?: string;
}

interface GoogleReviewsData {
  rating: number | null;
  total: number;
  reviews: GoogleReview[];
}

const GoogleLogo = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5" aria-hidden="true">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
  </svg>
);

const Stars = ({ value }: { value: number }) => (
  <div className="flex gap-0.5" aria-label={`${value} étoiles sur 5`}>
    {[0, 1, 2, 3, 4].map((i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${i < Math.round(value) ? "fill-secondary text-secondary" : "text-muted"}`}
        aria-hidden="true"
      />
    ))}
  </div>
);

interface Props {
  /** Inject AggregateRating JSON-LD (only on pages where it makes sense). */
  injectJsonLd?: boolean;
  /** Optional override of the section title. */
  title?: string;
}

const AvisGoogle = ({ injectJsonLd = true, title = "Avis Google vérifiés" }: Props) => {
  const [data, setData] = useState<GoogleReviewsData | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/google-reviews")
      .then((r) => {
        if (!r.ok) throw new Error("api_error");
        return r.json();
      })
      .then((d: GoogleReviewsData) => {
        if (cancelled) return;
        if (!d || (d as any).error || !d.rating || !d.total) {
          setError(true);
          return;
        }
        setData(d);
      })
      .catch(() => !cancelled && setError(true));
    return () => {
      cancelled = true;
    };
  }, []);

  // Hard fail-safe: never break the page, never display fake data.
  if (error || !data || !data.rating || !data.total) return null;

  const ratingLabel = data.rating.toFixed(1);

  return (
    <section className="py-12 md:py-16" aria-labelledby="avis-google-title">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          {/* Summary */}
          <div className="glass-card p-8 rounded-[2rem] text-center mb-8">
            <div className="flex items-center justify-center mb-3">
              <Stars value={data.rating} />
            </div>
            <div className="text-4xl font-black text-foreground mb-1">{ratingLabel}/5</div>
            <p className="text-muted-foreground">
              sur <span className="font-semibold text-foreground">{data.total.toLocaleString("fr-FR")}</span> avis Google
            </p>
            <div className="flex items-center justify-center gap-2 mt-3">
              <GoogleLogo />
              <span className="text-sm text-muted-foreground">Avis Google</span>
            </div>
            <div className="mt-5">
              <a
                href={GOOGLE_REVIEWS_PUBLIC_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
              >
                Voir tous les avis sur Google
                <ExternalLink className="h-4 w-4" aria-hidden="true" />
              </a>
            </div>
          </div>

          <h2 id="avis-google-title" className="sr-only">
            {title}
          </h2>

          {/* Reviews grid */}
          {data.reviews.length > 0 && (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {data.reviews.map((rv, i) => (
                <article
                  key={i}
                  className="glass-card p-6 rounded-[2rem] hover:shadow-[var(--shadow-hover)] transition-all duration-300"
                >
                  <header className="flex items-start gap-3 mb-3">
                    {rv.profilePhoto ? (
                      <img
                        src={rv.profilePhoto}
                        alt=""
                        width={40}
                        height={40}
                        loading="lazy"
                        className="w-10 h-10 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-sm font-semibold text-muted-foreground">
                        {rv.author?.[0] ?? "?"}
                      </div>
                    )}
                    <div className="min-w-0 flex-1">
                      {rv.authorUrl ? (
                        <a
                          href={rv.authorUrl}
                          target="_blank"
                          rel="noopener noreferrer nofollow"
                          className="font-semibold text-foreground hover:underline truncate block"
                        >
                          {rv.author}
                        </a>
                      ) : (
                        <p className="font-semibold text-foreground truncate">{rv.author}</p>
                      )}
                      <p className="text-xs text-muted-foreground">{rv.relativeTime}</p>
                    </div>
                    <GoogleLogo />
                  </header>
                  <Stars value={rv.rating} />
                  <p className="mt-3 text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
                    {rv.text}
                  </p>
                </article>
              ))}
            </div>
          )}
        </div>
      </div>

      {injectJsonLd && (
        <Helmet>
          <script type="application/ld+json">
            {JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "jemassuremoinscher.fr",
              url: "https://www.jemassuremoinscher.fr",
              aggregateRating: {
                "@type": "AggregateRating",
                ratingValue: data.rating.toFixed(1),
                bestRating: "5",
                worstRating: "1",
                ratingCount: String(data.total),
              },
            })}
          </script>
        </Helmet>
      )}
    </section>
  );
};

export default AvisGoogle;
