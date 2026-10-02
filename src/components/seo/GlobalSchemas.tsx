import { Helmet } from "react-helmet-async";
import { useLocation } from "react-router-dom";
import { useMemo } from "react";
import geoContent from "@/data/geo-content.json";
import { addOrganizationSchema, addBreadcrumbSchema } from "@/utils/seoUtils";
import { useBreadcrumbDeclarations } from "@/contexts/BreadcrumbDeclarationContext";

const BASE = "https://www.jemassuremoinscher.fr";

/**
 * Globally injected JSON-LD schemas:
 * - Organization (with AggregateRating from geo-content)
 * - WebSite (with SearchAction)
 * - BreadcrumbList (auto-generated from URL pathname)
 *
 * BreadcrumbList : émis seulement si la page n'en déclare aucun (composant
 * Breadcrumbs ou BreadcrumbList dans le jsonLd de SEOOptimized), voir
 * contexts/BreadcrumbDeclarationContext.tsx. SEOOptimized ne déduplique que
 * son propre jsonLd : il ne voit pas les scripts émis ici.
 */
const GlobalSchemas = () => {
  const { pathname } = useLocation();
  const declared = useBreadcrumbDeclarations();
  const pageDeclaresBreadcrumb = declared.component + declared.jsonld > 0;

  const schemas = useMemo(() => {
    // AggregateRating is now injected dynamically by <AvisGoogle /> from the live
    // Google Reviews API. We deliberately do NOT inject a static rating here, to
    // avoid Schema.org rich-result violations when the real data is unavailable.
    const organization = addOrganizationSchema();

    const website = {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: geoContent.brandName,
      url: BASE,
      inLanguage: "fr-FR",
      potentialAction: {
        "@type": "SearchAction",
        target: `${BASE}/comparateur?q={search_term_string}`,
        "query-input": "required name=search_term_string",
      },
    };

    // Auto breadcrumbs from path segments
    const segments = pathname.split("/").filter(Boolean);
    const items: { name: string; url: string }[] = [{ name: "Accueil", url: `${BASE}/` }];
    let acc = "";
    for (const seg of segments) {
      acc += `/${seg}`;
      const label = decodeURIComponent(seg)
        .replace(/-/g, " ")
        .replace(/\b\w/g, (c) => c.toUpperCase());
      items.push({ name: label, url: `${BASE}${acc}` });
    }
    const breadcrumb = items.length > 1 && !pageDeclaresBreadcrumb ? addBreadcrumbSchema(items) : null;

    return [organization, website, breadcrumb].filter(Boolean) as object[];
  }, [pathname, pageDeclaresBreadcrumb]);

  return (
    <Helmet>
      {schemas.map((s, i) => (
        <script key={`global-jsonld-${i}`} type="application/ld+json">
          {JSON.stringify(s)}
        </script>
      ))}
    </Helmet>
  );
};

export default GlobalSchemas;
