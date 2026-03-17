

## Plan: Improve Average Position from 46.5

### Diagnosis

Your GSC data shows 235 impressions across 81 queries with **0 clicks** and position **46.5** (page 5 of Google). The core issues:

1. **Content gaps**: Top impression queries like "assurance obligatoire trottinette électrique france 2026", "assurance voiture avec permis etranger", and "hypnose remboursement" only exist as blog articles or not at all — no dedicated SEO landing pages.
2. **Thin keyword targeting**: Existing SEO pages (e.g., jeune conducteur) have correct content but meta titles/descriptions aren't optimized for the exact queries GSC shows.
3. **Missing dedicated pages for proven demand**: GSC is telling you which queries already generate impressions — you should create standalone pages for the top ones.

### Changes

**1. Create 3 new SEO landing pages targeting top GSC queries**

Each uses the existing `SEOLandingPage` component pattern with 800+ word content, 3 FAQs, structured data, and breadcrumbs:

- **`/assurance-trottinette-electrique`** — targets "assurance obligatoire trottinette électrique france 2026" (10 impressions, top query)
- **`/assurance-auto-permis-etranger`** — targets "assurance voiture avec permis etranger" + "assurance permis etranger" (9 combined impressions)
- **`/assurance-emprunteur`** — targets "assurance emprunteur définition" (4 impressions); currently only a glossary entry, deserves a full product-style page

**2. Optimize existing page meta tags for exact GSC query match**

- **AssuranceJeuneConducteur**: Change title to `"Devis Assurance Auto Jeune Conducteur Pas Cher 2026"` and meta description to match "devis assurance auto jeune conducteur pas cher" + "en ligne" variants (13 combined impressions)
- **AssurancePNO**: Adjust H1 and meta to include "pno assurance" exact match (9 impressions across "pno assurance" + "pno")

**3. Add routes + sitemap entries**

- Register 3 new routes in `App.tsx`
- Add 3 entries to `supabase/functions/sitemap/routes-config.ts` with `priority: 0.8`

**4. Strengthen internal linking**

- Add the 3 new pages to `RelatedInsuranceLinks.tsx` mapping so they receive link juice from existing product pages
- Add cross-links from the existing blog articles (trottinette, permis etranger) to their new dedicated pages via a "page dédiée" CTA

### Files to create
- `src/pages/seo/AssuranceTrottinetteElectrique.tsx`
- `src/pages/seo/AssuranceAutoPermisEtranger.tsx`
- `src/pages/seo/AssuranceEmprunteurSEO.tsx`

### Files to edit
- `src/App.tsx` — add 3 lazy imports + routes
- `supabase/functions/sitemap/routes-config.ts` — add 3 entries
- `src/pages/seo/AssuranceJeuneConducteur.tsx` — optimize title/meta
- `src/pages/AssurancePNO.tsx` — optimize H1/meta for "pno assurance"
- `src/components/insurance/RelatedInsuranceLinks.tsx` — add new pages to link map
- `src/data/blogArticles2026.ts` — add internal links from trottinette + permis etranger articles to new dedicated pages

### Why this works
Google is already indexing your site for these queries (impressions prove it). Creating dedicated, content-rich pages with exact keyword match in title/H1/meta will move you from position 46 toward page 1. Blog articles alone don't rank as well as dedicated landing pages with structured data, FAQs, and clear CTAs.

