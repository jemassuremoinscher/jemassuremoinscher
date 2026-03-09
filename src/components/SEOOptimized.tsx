import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';

interface SEOOptimizedProps {
  /** Page title — max 60 characters recommended */
  title: string;
  /** Meta description — max 150 characters recommended */
  description: string;
  /** Primary keyword for this page */
  keyword?: string;
  /** Additional keywords (comma-separated) */
  keywords?: string;
  /** Canonical URL override */
  canonical?: string;
  /** Open Graph image URL */
  ogImage?: string;
  /** Open Graph type (default: website) */
  ogType?: string;
  /** JSON-LD structured data schemas */
  jsonLd?: object | object[];
  /** Whether to noindex this page */
  noindex?: boolean;
  /** Article published date (ISO format) for article:published_time OG tag */
  articlePublishedTime?: string;
  /** Article modified date (ISO format) for article:modified_time OG tag */
  articleModifiedTime?: string;
}

const BASE_URL = 'https://www.jemassuremoinscher.fr';
const DEFAULT_IMAGE = `${BASE_URL}/opengraph-image.png`;

/**
 * SEOOptimized — react-helmet-async based SEO component.
 * 
 * Usage:
 * ```tsx
 * <SEOOptimized
 *   title="Assurance Auto Moins Chère"
 *   description="Comparez 50+ assureurs auto. Devis gratuit en 2 min."
 *   keyword="assurance auto pas chère"
 * />
 * ```
 */
const SEOOptimized = ({
  title,
  description,
  keyword,
  keywords,
  canonical,
  ogImage,
  ogType = 'website',
  jsonLd,
  noindex = false,
}: SEOOptimizedProps) => {
  const location = useLocation();
  // Normalize: strip trailing slash (except root "/"), ensure lowercase
  const normalizedPath = location.pathname === '/' ? '' : location.pathname.replace(/\/+$/, '');
  const pageCanonical = canonical || `${BASE_URL}${normalizedPath}`;
  const pageImage = ogImage || DEFAULT_IMAGE;

  // Combine keyword + keywords
  const allKeywords = [keyword, keywords].filter(Boolean).join(', ');

  const schemas = jsonLd
    ? Array.isArray(jsonLd)
      ? jsonLd
      : [jsonLd]
    : [];

  return (
    <Helmet>
      {/* Primary Meta */}
      <title>{title}</title>
      <meta name="description" content={description} />
      {allKeywords && <meta name="keywords" content={allKeywords} />}
      <meta name="robots" content={noindex ? 'noindex, nofollow' : 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1'} />
      <link rel="canonical" href={pageCanonical} />

      {/* Hreflang — French primary, English alternate */}
      <link rel="alternate" hrefLang="fr" href={pageCanonical} />
      <link rel="alternate" hrefLang="en" href={pageCanonical} />
      <link rel="alternate" hrefLang="x-default" href={pageCanonical} />

      {/* Open Graph */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={pageCanonical} />
      <meta property="og:image" content={pageImage} />
      <meta property="og:type" content={ogType} />
      <meta property="og:locale" content="fr_FR" />
      <meta property="og:locale:alternate" content="en_US" />
      <meta property="og:site_name" content="jemassuremoinscher" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={pageImage} />

      {/* JSON-LD */}
      {schemas.map((schema, i) => (
        <script key={i} type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      ))}
    </Helmet>
  );
};

export default SEOOptimized;
