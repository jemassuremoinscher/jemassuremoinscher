import { Helmet } from 'react-helmet-async';
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useBreadcrumbDeclarations, useDeclareBreadcrumb } from "@/contexts/BreadcrumbDeclarationContext";

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
  /** Short OG title (25-35 chars) — falls back to title if not set */
  ogTitle?: string;
  /** Short OG description (55-65 chars) */
  ogDescription?: string;
  /** Longer Twitter description (150-200 chars) */
  twitterDescription?: string;
}

const BASE_URL = 'https://www.jemassuremoinscher.fr';
const DEFAULT_IMAGE = `${BASE_URL}/opengraph-image.png`;

/**
 * Retiré le 2026-09-30 (décision de Paul) : ce token injectait le mois/année
 * courants dans les titres/meta ("Assurance Auto Moins Chère Juin 2026"),
 * périmé dès le mois suivant et jamais réellement à jour. Toutes les
 * occurrences de "[Month]" ont été retirées des sources (auditFixes.ts,
 * GlossaireTerme.tsx, i18n fr/en). Cette fonction ne fait plus que nettoyer
 * un éventuel token résiduel (ex. une ligne page_meta_overrides pas encore
 * corrigée en base) — elle n'injecte plus jamais de date.
 */
const resolveDynamicTokens = (text: string): string => {
  if (!text.includes('[Month]')) return text;
  return text.replace(/\s*\[Month\]/g, '').trim();
};

/**
 * Retire du <head> les balises statiques (index.html, captures) que Helmet
 * double avec les siennes (data-rh="true") : canonical, description, og:*,
 * twitter:*, hreflang. Sans ce nettoyage, la page porte deux meta description
 * et deux canonical. Exportée pour les pages qui utilisent Helmet directement
 * (DuelPage).
 */
export const removeStaticHeadDuplicates = () => {
  const removeStatic = (selector: string) => {
    document.head.querySelectorAll(selector).forEach((el) => {
      if (!el.hasAttribute("data-rh")) el.parentNode?.removeChild(el);
    });
  };
  removeStatic('link[rel="canonical"]');
  removeStatic('meta[name="description"]');
  removeStatic('meta[property^="og:"]');
  removeStatic('meta[name^="twitter:"]');
  removeStatic('link[rel="alternate"][hreflang]');
};

/**
 * SEOOptimized — react-helmet-async based SEO component.
 * 
 * Usage:
 * ```tsx
 * <SEOOptimized
 *   title="Assurance Auto Moins Chère"
 *   description="Comparez 70+ assureurs auto. Devis gratuit en 2 min."
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
  articlePublishedTime,
  articleModifiedTime,
  ogTitle,
  ogDescription,
  twitterDescription,
}: SEOOptimizedProps) => {
  const location = useLocation();
  const normalizedPath = location.pathname === '/' ? '' : location.pathname.replace(/\/+$/, '');
  const pageCanonical = canonical || `${BASE_URL}${normalizedPath}`;
  const pageImage = ogImage || DEFAULT_IMAGE;
  const [override, setOverride] = useState<{ meta_title: string | null; meta_description: string | null; og_title: string | null; og_description: string | null; } | null>(null);

  // Dynamic month replacement
  const fallbackTitle = resolveDynamicTokens(title);
  const fallbackDescription = resolveDynamicTokens(description);
  const resolvedTitle = resolveDynamicTokens(override?.meta_title || fallbackTitle);
  const resolvedDescription = resolveDynamicTokens(override?.meta_description || fallbackDescription);
  const resolvedOgTitle = resolveDynamicTokens(override?.og_title || ogTitle || resolvedTitle);
  const resolvedOgDescription = resolveDynamicTokens(override?.og_description || ogDescription || resolvedDescription);

  useEffect(() => {
    removeStaticHeadDuplicates();

    let isActive = true;

    const loadOverride = async () => {
      const pagePath = normalizedPath || '/';
      const { data, error } = await supabase
        .from('page_meta_overrides')
        .select('meta_title, meta_description, og_title, og_description')
        .eq('page_path', pagePath)
        .maybeSingle();

      if (!isActive) return;
      if (error) {
        setOverride(null);
        return;
      }

      setOverride(data ?? null);
    };

    void loadOverride();

    return () => {
      isActive = false;
    };
  }, [normalizedPath]);

  // SEO length warnings (dev only)
  if (import.meta.env.DEV) {
    if (resolvedTitle.length > 60) console.warn(`[SEO] Title exceeds 60 chars (${resolvedTitle.length}): "${resolvedTitle}"`);
    if (resolvedDescription.length > 160) console.warn(`[SEO] Description exceeds 160 chars (${resolvedDescription.length}): "${resolvedDescription.substring(0, 80)}…"`);
  }

  const allKeywords = [keyword, keywords].filter(Boolean).join(', ');

  const rawSchemas = jsonLd
    ? Array.isArray(jsonLd)
      ? jsonLd
      : [jsonLd]
    : [];

  // Un seul BreadcrumbList par page : si le composant Breadcrumbs (fil
  // visible) est présent, il fait foi et le nôtre est retiré ; sinon le nôtre
  // est déclaré pour que GlobalSchemas n'en ajoute pas un généré depuis l'URL.
  const declaredBreadcrumbs = useBreadcrumbDeclarations();
  const hasOwnBreadcrumb = rawSchemas.some(
    (s) => typeof s === 'object' && s !== null && (s as Record<string, unknown>)['@type'] === 'BreadcrumbList',
  );
  const keepOwnBreadcrumb = hasOwnBreadcrumb && declaredBreadcrumbs.component === 0;
  useDeclareBreadcrumb('jsonld', keepOwnBreadcrumb);

  // Deduplicate schemas by @type to prevent Google "Duplicate field" errors
  // (e.g. multiple FAQPage blocks injected during SPA navigation)
  const seenTypes = new Set<string>();
  const schemas = rawSchemas.filter((schema: any) => {
    const type = schema?.['@type'];
    if (type === 'BreadcrumbList' && !keepOwnBreadcrumb) return false;
    // Only dedupe single-type schemas that should appear once per page
    const singleTypes = ['FAQPage', 'BreadcrumbList', 'Organization', 'WebSite'];
    if (typeof type === 'string' && singleTypes.includes(type)) {
      if (seenTypes.has(type)) return false;
      seenTypes.add(type);
    }
    return true;
  });

  return (
    <Helmet>
      {/* Primary Meta */}
      <title>{resolvedTitle}</title>
      <meta name="description" content={resolvedDescription} />
      {allKeywords && <meta name="keywords" content={allKeywords} />}
      <meta name="robots" content={noindex ? 'noindex, nofollow' : 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1'} />
      <link rel="canonical" href={pageCanonical} />

      {/* Hreflang — French primary, English alternate */}
      <link rel="alternate" hrefLang="fr" href={pageCanonical} />
      <link rel="alternate" hrefLang="en" href={pageCanonical} />
      <link rel="alternate" hrefLang="x-default" href={pageCanonical} />

      {/* Author & format-detection */}
      <meta name="author" content="jemassuremoinscher.fr" />
      <meta name="format-detection" content="telephone=no" />

      {/* Open Graph */}
      <meta property="og:title" content={resolvedOgTitle} />
      <meta property="og:description" content={resolvedOgDescription} />
      <meta property="og:url" content={pageCanonical} />
      <meta property="og:image" content={pageImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content={resolvedOgTitle} />
      <meta property="og:type" content={ogType} />
      <meta property="og:locale" content="fr_FR" />
      <meta property="og:locale:alternate" content="en_US" />
      <meta property="og:site_name" content="jemassuremoinscher.fr" />

      {/* Article dates (for blog/article pages) */}
      {articlePublishedTime && <meta property="article:published_time" content={articlePublishedTime} />}
      {articleModifiedTime && <meta property="article:modified_time" content={articleModifiedTime} />}

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@jmassuremoinscher" />
      <meta name="twitter:creator" content="@jmassuremoinscher" />
      <meta name="twitter:title" content={resolvedOgTitle} />
      <meta name="twitter:description" content={twitterDescription ? resolveDynamicTokens(twitterDescription) : resolvedOgDescription} />
      <meta name="twitter:image" content={pageImage} />
      <meta name="twitter:image:alt" content={resolvedOgTitle} />

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
