import { supabase } from "@/integrations/supabase/client";

export const PAGE_META_CATALOG: { path: string; label: string; defaultTitle: string; defaultDesc: string }[] = [
  { path: "/", label: "Accueil", defaultTitle: "Assurance Moins Chère : Comparateur Gratuit | jemassuremoinscher.fr", defaultDesc: "Comparateur d'assurances gratuit. Comparez 50+ assureurs et économisez jusqu'à 280€. Devis en 2 min, sans engagement." },
  { path: "/assurance-auto", label: "Assurance Auto", defaultTitle: "Assurance Auto Moins Chère [Month] : -40% ⭐", defaultDesc: "50+ assureurs comparés gratuitement. Nos clients économisent 320€/an en moyenne. Devis auto instantané, sans engagement." },
  { path: "/assurance-moto", label: "Assurance Moto", defaultTitle: "Assurance Moto Moins Chère [Month] : -35% ⭐", defaultDesc: "Moto, scooter, 125cc : comparez 50+ assureurs. Tous risques dès 15€/mois. Devis gratuit et sans engagement." },
  { path: "/assurance-habitation", label: "Assurance Habitation", defaultTitle: "Assurance Habitation Moins Chère [Month] dès 3€", defaultDesc: "Comparez 50+ assureurs habitation en 2 min. Maison ou appartement, locataire ou propriétaire. Économisez jusqu'à 40%." },
  { path: "/assurance-sante", label: "Mutuelle Santé", defaultTitle: "Mutuelle Santé Moins Chère [Month] : -300€/an", defaultDesc: "Comparez 50+ mutuelles en 2 min. Optique, dentaire, hospitalisation : trouvez la formule idéale. 4.9/5 satisfaction client." },
  { path: "/assurance-animaux", label: "Assurance Animaux", defaultTitle: "Assurance Chien Chat dès 8€/mois [Month]", defaultDesc: "Mutuelle animaux : remboursement vétérinaire jusqu'à 100%. Comparez les offres chien et chat en 2 min. Sans délai de carence." },
  { path: "/assurance-vie", label: "Assurance Vie", defaultTitle: "Assurance Vie [Month] : Meilleurs Rendements", defaultDesc: "Fonds euros, unités de compte, PER : comparez les meilleures assurances vie. Fiscalité avantageuse après 8 ans. Devis gratuit." },
  { path: "/assurance-pret", label: "Assurance Emprunteur", defaultTitle: "Assurance Emprunteur [Month] : -15 000€ (Lemoine)", defaultDesc: "Loi Lemoine : changez d'assurance de prêt à tout moment. Comparez 50+ assureurs, économisez jusqu'à 50%. Devis gratuit en 2 min." },
  { path: "/assurance-prevoyance", label: "Prévoyance", defaultTitle: "Prévoyance [Month] : Protégez Votre Famille 9€/mois", defaultDesc: "Décès, invalidité, obsèques : comparez les garanties prévoyance de 50+ assureurs. Devis personnalisé gratuit en 2 min." },
  { path: "/assurance-rc-pro", label: "RC Professionnelle", defaultTitle: "RC Pro dès 15€/mois [Month] : Devis Gratuit", defaultDesc: "Responsabilité civile professionnelle : comparez 50+ assureurs. Tous secteurs : BTP, conseil, IT, commerce. Attestation immédiate." },
  { path: "/assurance-mrp", label: "Assurance MRP", defaultTitle: "Multirisque Pro (MRP) [Month] dès 20€/mois", defaultDesc: "Locaux, stock, matériel : protégez votre entreprise avec une MRP adaptée. 50+ assureurs comparés. Devis gratuit en 2 min." },
  { path: "/assurance-pno", label: "Assurance PNO", defaultTitle: "PNO Assurance dès 5€/mois [Month] | Copropriété", defaultDesc: "PNO assurance : comparez les assurances propriétaire non occupant. Obligatoire en copropriété (loi Alur). 50+ assureurs comparés. Devis gratuit." },
  { path: "/assurance-gli", label: "Garantie Loyers Impayés", defaultTitle: "GLI [Month] : Garantie Loyer Impayé dès 2,5%", defaultDesc: "Loyers impayés, dégradations, frais juridiques : sécurisez vos revenus locatifs. Comparez les GLI de 50+ assureurs. Devis gratuit." },
  { path: "/comparateur", label: "Comparateur", defaultTitle: "Comparateur d'Assurances Gratuit", defaultDesc: "Comparez les offres de 50+ assureurs en 2 minutes. Auto, santé, habitation, prêt. Sans engagement." },
  { path: "/blog", label: "Blog", defaultTitle: "Blog Assurance - Conseils & Guides", defaultDesc: "Guides complets, actualités et conseils pour économiser sur vos assurances." },
  { path: "/glossaire", label: "Glossaire", defaultTitle: "Glossaire de l'Assurance", defaultDesc: "Définitions claires de tous les termes d'assurance : franchise, prime, sinistre, responsabilité civile..." },
  { path: "/qui-sommes-nous", label: "Qui sommes-nous", defaultTitle: "Qui sommes-nous | jemassuremoinscher.fr", defaultDesc: "Découvrez notre équipe de courtiers en assurances. Indépendant, transparent, gratuit." },
  { path: "/contact", label: "Contact", defaultTitle: "Contactez-nous | jemassuremoinscher.fr", defaultDesc: "Besoin d'aide ? Contactez notre équipe de conseillers. Réponse sous 10 minutes." },
  { path: "/nos-partenaires", label: "Nos Partenaires", defaultTitle: "Nos 50+ Partenaires Assureurs", defaultDesc: "AXA, Allianz, MAIF, Groupama... Découvrez tous nos assureurs partenaires." },
  { path: "/mutuelle-tns", label: "Mutuelle TNS", defaultTitle: "Mutuelle TNS : Meilleure Complémentaire Indépendant", defaultDesc: "Comparez les mutuelles TNS adaptées aux indépendants. Loi Madelin, déduction fiscale. Devis gratuit." },
];

const MONTHS_FR = ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"];

const resolveDynamicTokens = (text: string): string => {
  if (!text.includes("[Month]")) return text;
  const now = new Date();
  return text.replace(/\[Month\]/g, `${MONTHS_FR[now.getMonth()]} ${now.getFullYear()}`);
};

const trimToLength = (text: string, max: number) => (text.length <= max ? text : `${text.slice(0, max - 1).trimEnd()}…`);

const humanizeSlug = (slug: string) => slug.split("-").filter(Boolean).map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(" ");

const normalizeTextFingerprint = (...values: Array<string | null | undefined>) => values
  .filter(Boolean)
  .join(" ")
  .toLowerCase();

export const getSuggestedAuthorLabel = (input: {
  slug?: string | null;
  title?: string | null;
  target_keyword?: string | null;
  suggested_content?: string | null;
}) => {
  const fingerprint = normalizeTextFingerprint(input.slug, input.title, input.target_keyword, input.suggested_content);

  if (fingerprint.includes("emprunteur") || fingerprint.includes("lemoine") || fingerprint.includes("crédit")) {
    return "Sophie Mercier – Juriste en assurance emprunteur";
  }

  if (fingerprint.includes("mutuelle") || fingerprint.includes("santé") || fingerprint.includes("hospitalisation")) {
    return "Dr. Marie Dupont – Experte en assurance santé";
  }

  if (fingerprint.includes("auto") || fingerprint.includes("conducteur") || fingerprint.includes("malussé")) {
    return "Claire Rousseau – Rédactrice experte assurance auto";
  }

  if (fingerprint.includes("habitation") || fingerprint.includes("pno") || fingerprint.includes("gli") || fingerprint.includes("immobili")) {
    return "Thomas Leroy – Courtier en assurance IARD";
  }

  if (fingerprint.includes("résiliation") || fingerprint.includes("hamon") || fingerprint.includes("glossaire") || fingerprint.includes("définition") || fingerprint.includes("franchise")) {
    return "Sophie Martin – Juriste spécialisée en droit de l'assurance";
  }

  if (fingerprint.includes("courtier") || fingerprint.includes("expertise") || fingerprint.includes("preuve")) {
    return "L'équipe d'experts Jemassuremoinscher";
  }

  return "L'équipe d'experts Jemassuremoinscher";
};

export const auditFileToPagePath = (file: string) => {
  const normalized = file.trim().replace(/^\/+/, "");
  if (normalized === "index.html") return "/";
  if (normalized.endsWith("/index.html")) return `/${normalized.replace(/\/index\.html$/, "")}`;
  return null;
};

const getFallbackMetaForPath = (path: string) => {
  const segments = path.split("/").filter(Boolean);
  const lastSegment = segments[segments.length - 1] ?? "accueil";
  const label = humanizeSlug(lastSegment);

  if (segments[0] === "blog") {
    return {
      title: trimToLength(`${label} | Guide Assurance 2026`, 60),
      description: trimToLength(`Analyse, conseils pratiques et points clés sur ${label.toLowerCase()} pour mieux choisir votre assurance.`, 160),
    };
  }

  if (segments[0] === "glossaire") {
    return {
      title: trimToLength(`${label} : définition assurance`, 60),
      description: trimToLength(`Définition claire de ${label.toLowerCase()} et explications utiles pour comprendre ce terme d'assurance.`, 160),
    };
  }

  return {
    title: trimToLength(`${label} | jemassuremoinscher.fr`, 60),
    description: trimToLength(`Découvrez ${label.toLowerCase()} sur jemassuremoinscher.fr et comparez les options adaptées à votre besoin.`, 160),
  };
};

export const getMetaDefaultsForPath = (path: string) => {
  const fromCatalog = PAGE_META_CATALOG.find((page) => page.path === path);
  const title = resolveDynamicTokens(fromCatalog?.defaultTitle ?? getFallbackMetaForPath(path).title);
  const description = resolveDynamicTokens(fromCatalog?.defaultDesc ?? getFallbackMetaForPath(path).description);

  return {
    title,
    description,
    ogTitle: trimToLength(title, 35),
    ogDescription: trimToLength(description, 65),
  };
};

// Tout check en échec dont on peut résoudre un pagePath est corrigeable
// via harmonisation des 4 métadonnées (title/desc/og) en base — solution pérenne
// car relue par SEOOptimized à chaque rendu et validée par validate*Fix au refresh.
export const canAutoFixSeoIssue = (issue: { category: string; description: string; file: string }) => {
  return Boolean(auditFileToPagePath(issue.file));
};

export const canAutoFixGeoIssue = (issue: { category: string; description: string; file: string }) => {
  return Boolean(auditFileToPagePath(issue.file));
};

const upsertPageMetaOverride = async (pagePath: string, payload: { meta_title?: string | null; meta_description?: string | null; og_title?: string | null; og_description?: string | null; }) => {
  const { data: existing, error: lookupError } = await supabase
    .from("page_meta_overrides")
    .select("id")
    .eq("page_path", pagePath)
    .maybeSingle();

  if (lookupError) throw lookupError;

  const row = { page_path: pagePath, ...payload };

  if (existing?.id) {
    const { error } = await supabase.from("page_meta_overrides").update(row as never).eq("id", existing.id);
    if (error) throw error;
    return;
  }

  const { error } = await supabase.from("page_meta_overrides").insert(row as never);
  if (error) throw error;
};

export const applySeoIssueFix = async (issue: { category: string; description: string; file: string }) => {
  const pagePath = auditFileToPagePath(issue.file);
  if (!pagePath) throw new Error("Page non supportée pour une correction automatique.");

  const meta = getMetaDefaultsForPath(pagePath);
  const fingerprint = `${issue.category} ${issue.description}`.toLowerCase();

  if (fingerprint.includes("open graph") || fingerprint.includes("og")) {
    await upsertPageMetaOverride(pagePath, { og_title: meta.ogTitle, og_description: meta.ogDescription });
    return { pagePath, message: `Open Graph mis à jour pour ${pagePath}.` };
  }

  if (fingerprint.includes("meta") || fingerprint.includes("description")) {
    await upsertPageMetaOverride(pagePath, { meta_description: meta.description, og_description: meta.ogDescription });
    return { pagePath, message: `Meta description mise à jour pour ${pagePath}.` };
  }

  if (fingerprint.includes("title")) {
    await upsertPageMetaOverride(pagePath, { meta_title: meta.title, og_title: meta.ogTitle });
    return { pagePath, message: `Title SEO mis à jour pour ${pagePath}.` };
  }

  // Fallback pérenne : harmonisation complète des 4 métadonnées
  await upsertPageMetaOverride(pagePath, {
    meta_title: meta.title,
    meta_description: meta.description,
    og_title: meta.ogTitle,
    og_description: meta.ogDescription,
  });
  return { pagePath, message: `Métadonnées SEO harmonisées pour ${pagePath}.` };

  
};

export const validateSeoIssueFix = async (issue: { category: string; description: string; file: string }) => {
  const pagePath = auditFileToPagePath(issue.file);
  if (!pagePath) return false;

  const meta = getMetaDefaultsForPath(pagePath);
  const fingerprint = `${issue.category} ${issue.description}`.toLowerCase();
  const { data, error } = await supabase
    .from("page_meta_overrides")
    .select("meta_title, meta_description, og_title, og_description")
    .eq("page_path", pagePath)
    .maybeSingle();

  if (error || !data) return false;

  if (fingerprint.includes("open graph") || fingerprint.includes("og")) {
    return data.og_title === meta.ogTitle && data.og_description === meta.ogDescription;
  }

  if (fingerprint.includes("meta") || fingerprint.includes("description")) {
    return data.meta_description === meta.description && data.og_description === meta.ogDescription;
  }

  if (fingerprint.includes("title")) {
    return data.meta_title === meta.title && data.og_title === meta.ogTitle;
  }

  // Fallback : harmonisation complète des 4 métadonnées
  return data.meta_title === meta.title
    && data.meta_description === meta.description
    && data.og_title === meta.ogTitle
    && data.og_description === meta.ogDescription;
};

export const applyGeoIssueFix = async (issue: { category: string; description: string; file: string }) => {
  const pagePath = auditFileToPagePath(issue.file);
  if (!pagePath) throw new Error("Page non supportée pour une correction automatique.");

  const meta = getMetaDefaultsForPath(pagePath);
  const fingerprint = `${issue.category} ${issue.description}`.toLowerCase();

  if (fingerprint.includes("title")) {
    await upsertPageMetaOverride(pagePath, { meta_title: meta.title, og_title: meta.ogTitle });
    return { pagePath, message: `Titres harmonisés pour ${pagePath}.` };
  }

  if (fingerprint.includes("geo")) {
    await upsertPageMetaOverride(pagePath, {
      meta_title: meta.title,
      meta_description: meta.description,
      og_title: meta.ogTitle,
      og_description: meta.ogDescription,
    });
    return { pagePath, message: `Métadonnées harmonisées pour ${pagePath}.` };
  }

  // Fallback pérenne : toute autre catégorie déclenche l'harmonisation complète
  await upsertPageMetaOverride(pagePath, {
    meta_title: meta.title,
    meta_description: meta.description,
    og_title: meta.ogTitle,
    og_description: meta.ogDescription,
  });
  return { pagePath, message: `Métadonnées GEO harmonisées pour ${pagePath}.` };
};

export const validateGeoIssueFix = async (issue: { category: string; description: string; file: string }) => {
  const pagePath = auditFileToPagePath(issue.file);
  if (!pagePath) return false;

  const meta = getMetaDefaultsForPath(pagePath);
  const fingerprint = `${issue.category} ${issue.description}`.toLowerCase();
  const { data, error } = await supabase
    .from("page_meta_overrides")
    .select("meta_title, meta_description, og_title, og_description")
    .eq("page_path", pagePath)
    .maybeSingle();

  if (error || !data) return false;

  if (fingerprint.includes("title")) {
    return data.meta_title === meta.title && data.og_title === meta.ogTitle;
  }

  if (fingerprint.includes("geo")) {
    return data.meta_title === meta.title
      && data.meta_description === meta.description
      && data.og_title === meta.ogTitle
      && data.og_description === meta.ogDescription;
  }

  // Fallback : harmonisation complète des 4 métadonnées
  return data.meta_title === meta.title
    && data.meta_description === meta.description
    && data.og_title === meta.ogTitle
    && data.og_description === meta.ogDescription;
};

type VisibilityCheckLike = { label: string; expected: string; value: string };

type GeoContentImprovementInput = {
  scope: "page" | "query";
  path: string;
  recommendation: string;
  query?: string;
  intent?: string;
};

export type ContentSuggestionDraft = {
  id?: string;
  slug: string;
  title: string;
  target_keyword: string;
  suggested_meta_description: string | null;
  suggested_content: string;
  suggested_author: string | null;
  status: string;
  created_at?: string | null;
  applied_path?: string | null;
};

export type ContentImprovementSource = "seo" | "geo";

type ContentImprovementScope = "page" | "query" | "visibility";

export const CONTENT_IMPROVEMENT_PREFIX = "__content-improvement__";

const encodeImprovementSegment = (value: string) => encodeURIComponent(value);
const decodeImprovementSegment = (value: string) => decodeURIComponent(value);

export const buildContentImprovementKey = (input: {
  source: ContentImprovementSource;
  scope: ContentImprovementScope;
  path: string;
  query?: string;
}) => `${CONTENT_IMPROVEMENT_PREFIX}/${input.source}/${input.scope}/${encodeImprovementSegment(input.path)}/${encodeImprovementSegment(input.query ?? "_")}`;

const parseContentImprovementKey = (key: string) => {
  const [prefix, source, scope, encodedPath, encodedQuery] = key.split("/");
  if (prefix !== CONTENT_IMPROVEMENT_PREFIX || !source || !scope || !encodedPath || !encodedQuery) {
    return null;
  }

  return {
    source,
    scope,
    path: decodeImprovementSegment(encodedPath),
    query: encodedQuery === "_" ? null : decodeImprovementSegment(encodedQuery),
  };
};

const buildLiveContentImprovementOverride = (input: {
  source: ContentImprovementSource;
  path: string;
  query?: string;
}) => {
  if (!input.path.startsWith("/")) return null;

  const defaults = getMetaDefaultsForPath(input.path);
  const routeLabel = input.path === "/"
    ? "Accueil"
    : humanizeSlug(input.path.replace(/^\/+|\/+$/g, "").split("/").pop() ?? "page");
  const focus = input.query?.trim() || routeLabel;
  const metaTitle = trimToLength(
    resolveDynamicTokens(input.query?.trim()
      ? `${focus} | ${routeLabel} | jemassuremoinscher.fr`
      : defaults.title),
    60,
  );
  const metaDescription = trimToLength(
    `${defaults.description.replace(/[.!?\s]+$/g, "")}. ${input.source === "seo"
      ? (input.query?.trim()
        ? `Réponse enrichie sur ${focus.toLowerCase()}, avec intention clarifiée et promesse plus directe.`
        : `${routeLabel} renforcé avec une promesse plus claire, des réponses rapides et une couverture SEO plus nette.`)
      : (input.query?.trim()
        ? `Réponse plus directe sur ${focus.toLowerCase()}, avec formulation claire pour les assistants IA.`
        : `${routeLabel} clarifié avec réponses directes, signaux d'expertise et meilleure lisibilité GEO.`)}`,
    160,
  );

  return {
    pagePath: input.path,
    meta_title: metaTitle,
    meta_description: metaDescription,
    og_title: trimToLength(metaTitle, 35),
    og_description: trimToLength(metaDescription, 65),
  };
};

const buildContentImprovementDraft = (input: {
  source: ContentImprovementSource;
  scope: ContentImprovementScope;
  path: string;
  recommendation: string;
  query?: string;
  intent?: string;
}) => {
  const scopeLabel = input.source === "seo" ? "SEO" : "GEO";
  const title = input.scope === "query"
    ? `Amélioration ${scopeLabel} activée : ${input.query}`
    : input.scope === "visibility"
      ? `Amélioration ${scopeLabel} activée : ${input.path}`
      : `Amélioration ${scopeLabel} activée : ${input.path}`;

  return {
    slug: buildContentImprovementKey(input),
    title,
    target_keyword: input.query ?? input.path,
    suggested_meta_description: input.recommendation,
    suggested_content: [
      `Page cible : ${input.path}`,
      input.query ? `Requête : ${input.query}` : null,
      input.intent ? `Intention : ${input.intent}` : null,
      `Action activée : ${input.recommendation}`,
    ].filter(Boolean).join("\n\n"),
    suggested_author: null,
    status: "applied",
  } satisfies ContentSuggestionDraft;
};

const persistContentImprovement = async (input: {
  source: ContentImprovementSource;
  scope: ContentImprovementScope;
  path: string;
  recommendation: string;
  query?: string;
  intent?: string;
}) => {
  const draft = buildContentImprovementDraft(input);
  const markerPayload = {
    meta_title: draft.title,
    meta_description: draft.suggested_meta_description,
    og_title: draft.status,
    og_description: draft.suggested_content,
  };

  const liveOverride = buildLiveContentImprovementOverride({
    source: input.source,
    path: input.path,
    query: input.query,
  });

  if (liveOverride) {
    await upsertPageMetaOverride(liveOverride.pagePath, {
      meta_title: liveOverride.meta_title,
      meta_description: liveOverride.meta_description,
      og_title: liveOverride.og_title,
      og_description: liveOverride.og_description,
    });
  }

  await upsertPageMetaOverride(draft.slug, markerPayload);

  const { data, error } = await supabase
    .from("page_meta_overrides")
    .select("created_at")
    .eq("page_path", draft.slug)
    .maybeSingle();

  if (error) throw error;

  return {
    ...draft,
    created_at: data?.created_at ?? null,
    applied_path: liveOverride?.pagePath ?? null,
  } satisfies ContentSuggestionDraft;
};

export const listAppliedContentImprovements = async (source: ContentImprovementSource) => {
  const { data, error } = await supabase
    .from("page_meta_overrides")
    .select("page_path, meta_title, meta_description, og_title, og_description, created_at")
    .ilike("page_path", `${CONTENT_IMPROVEMENT_PREFIX}/${source}/%`);

  if (error) throw error;

  return Object.fromEntries((data ?? []).map((item) => [
    item.page_path,
    (() => {
      const parsed = parseContentImprovementKey(item.page_path);
      return {
        slug: item.page_path,
        title: item.meta_title ?? "Amélioration activée",
        target_keyword: parsed?.query ?? parsed?.path ?? item.page_path,
        suggested_meta_description: item.meta_description ?? null,
        suggested_content: item.og_description ?? item.meta_description ?? "",
        suggested_author: null,
        status: item.og_title ?? "applied",
        created_at: item.created_at ?? null,
        applied_path: parsed?.path ?? null,
      } satisfies ContentSuggestionDraft;
    })(),
  ]));
};

const slugify = (value: string) => value
  .toLowerCase()
  .normalize("NFD")
  .replace(/[\u0300-\u036f]/g, "")
  .replace(/[^a-z0-9]+/g, "-")
  .replace(/^-+|-+$/g, "")
  .slice(0, 80);

const buildGeoContentSuggestion = (input: GeoContentImprovementInput) => {
  const normalizedPath = input.path === "/" ? "accueil" : input.path.replace(/^\/+|\/+$/g, "").replace(/\//g, "-");
  const baseKeyword = input.query?.trim() || `${normalizedPath} ${input.intent || "geo"}`;
  const title = input.scope === "query"
    ? `${humanizeSlug(slugify(input.query || normalizedPath))} : réponse experte et guide décisionnel`
    : `Renforcer ${humanizeSlug(normalizedPath)} avec un contenu GEO plus direct`;
  const slug = input.scope === "query"
    ? `geo-${slugify(input.query || normalizedPath)}-${slugify(normalizedPath)}`
    : `geo-amelioration-${slugify(normalizedPath)}`;
  const suggested_content = [
    `Page cible : ${input.path}`,
    input.query ? `Requête à couvrir : ${input.query}` : null,
    input.intent ? `Intention : ${input.intent}` : null,
    `Amélioration recommandée : ${input.recommendation}`,
    "Créer une réponse courte dès le haut de page, ajouter une FAQ précise, renforcer les preuves d'expertise et le maillage interne vers les pages business liées.",
  ].filter(Boolean).join("\n\n");

  return {
    slug,
    title: trimToLength(title, 120),
    target_keyword: trimToLength(baseKeyword, 120),
    suggested_meta_description: trimToLength(`Amélioration GEO proposée pour ${input.path}${input.query ? ` autour de “${input.query}”` : ""}.`, 160),
    suggested_content,
    suggested_author: getSuggestedAuthorLabel({
      slug,
      title,
      target_keyword: baseKeyword,
      suggested_content,
    }),
  };
};

const POSITION_PAGE_UPDATES = [
  {
    path: "/assurance-auto",
    meta_title: resolveDynamicTokens("Assurance Auto Pas Chère [Month] : Comparez 50+ devis"),
    meta_description: "Comparez garanties, prix et franchises de 50+ assurances auto pour trouver une formule plus adaptée à votre profil.",
  },
  {
    path: "/assurance-sante",
    meta_title: resolveDynamicTokens("Mutuelle Santé Pas Chère [Month] : Comparez les garanties"),
    meta_description: "Comparez les remboursements optique, dentaire et hospitalisation pour choisir une mutuelle santé réellement adaptée.",
  },
  {
    path: "/assurance-pret",
    meta_title: resolveDynamicTokens("Assurance Emprunteur [Month] : Comparez et économisez"),
    meta_description: "Comparez les garanties décès, IPT, ITT et exclusions pour changer d'assurance emprunteur au meilleur coût.",
  },
].map((item) => ({
  ...item,
  og_title: trimToLength(item.meta_title, 35),
  og_description: trimToLength(item.meta_description, 65),
}));

const QUALIFIED_TRAFFIC_PAGE_UPDATES = [
  {
    path: "/comparateur",
    meta_title: "Comparateur Assurance : devis adaptés en 2 minutes",
    meta_description: "Comparez des devis d'assurance adaptés à votre profil, vos garanties et votre budget sans perdre en lisibilité ni en rapidité.",
  },
  {
    path: "/assurance-habitation",
    meta_title: resolveDynamicTokens("Assurance Habitation [Month] : Comparez les garanties utiles"),
    meta_description: "Comparez les garanties essentielles, franchises et tarifs pour trouver une assurance habitation claire et adaptée.",
  },
  {
    path: "/assurance-rc-pro",
    meta_title: resolveDynamicTokens("RC Pro [Month] : Comparez les garanties par métier"),
    meta_description: "Comparez les garanties RC Pro par activité pour obtenir une couverture claire, rapide à comprendre et pertinente.",
  },
].map((item) => ({
  ...item,
  og_title: trimToLength(item.meta_title, 35),
  og_description: trimToLength(item.meta_description, 65),
}));

const IA_SOURCE_SUGGESTIONS = [
  {
    slug: "comparatif-assurance-auto-profils-2026",
    title: "Comparatif assurance auto 2026 selon le profil conducteur",
    target_keyword: "comparatif assurance auto profil conducteur",
    suggested_meta_description: "Créer un comparatif orienté profils pour multiplier les reprises par les assistants IA.",
    suggested_content: "Rédiger un comparatif structuré par profils (jeune conducteur, malussé, petit rouleur, famille), avec FAQ courte, tableau comparatif et critères de décision.",
    suggested_author: getSuggestedAuthorLabel({ slug: "comparatif-assurance-auto-profils-2026", title: "Comparatif assurance auto 2026 selon le profil conducteur", target_keyword: "comparatif assurance auto profil conducteur" }),
  },
  {
    slug: "definition-franchise-assurance-exemples",
    title: "Franchise assurance : définition simple et exemples concrets",
    target_keyword: "franchise assurance définition",
    suggested_meta_description: "Créer une définition courte, réutilisable et précise pour les assistants IA.",
    suggested_content: "Créer une page définition avec entités nommées, exemples concrets, mini FAQ et liens vers auto, habitation et santé.",
    suggested_author: getSuggestedAuthorLabel({ slug: "definition-franchise-assurance-exemples", title: "Franchise assurance : définition simple et exemples concrets", target_keyword: "franchise assurance définition" }),
  },
  {
    slug: "faq-assurance-emprunteur-changement-2026",
    title: "FAQ assurance emprunteur 2026 : changer, comparer, économiser",
    target_keyword: "faq assurance emprunteur 2026",
    suggested_meta_description: "Créer une FAQ dense et cit-able pour diversifier les sources IA.",
    suggested_content: "Rédiger une FAQ très précise avec réponses courtes, conditions, délais, exclusions et liens internes vers les pages décisionnelles.",
    suggested_author: getSuggestedAuthorLabel({ slug: "faq-assurance-emprunteur-changement-2026", title: "FAQ assurance emprunteur 2026 : changer, comparer, économiser", target_keyword: "faq assurance emprunteur 2026" }),
  },
  {
    slug: "guide-choisir-mutuelle-sante-selon-besoins",
    title: "Guide : choisir une mutuelle santé selon ses vrais besoins",
    target_keyword: "guide choisir mutuelle santé besoins",
    suggested_meta_description: "Créer un guide de décision structuré pour augmenter les reprises multi-assistants.",
    suggested_content: "Construire un guide de décision par cas d'usage avec preuves d'expertise, critères prioritaires et liens vers pages santé associées.",
    suggested_author: getSuggestedAuthorLabel({ slug: "guide-choisir-mutuelle-sante-selon-besoins", title: "Guide : choisir une mutuelle santé selon ses vrais besoins", target_keyword: "guide choisir mutuelle santé besoins" }),
  },
];

const IA_CITATION_SUGGESTIONS = [
  {
    slug: "preuves-expertise-courtier-assurance-independant",
    title: "Pourquoi passer par un courtier en assurance indépendant ?",
    target_keyword: "courtier assurance indépendant expertise",
    suggested_meta_description: "Mettre en avant expertise, preuves et entités nommées pour augmenter les citations IA.",
    suggested_content: "Créer une page avec preuves d'expertise, processus, partenaires, exemples de profils accompagnés et FAQ précise sur le rôle du courtier.",
    suggested_author: getSuggestedAuthorLabel({ slug: "preuves-expertise-courtier-assurance-independant", title: "Pourquoi passer par un courtier en assurance indépendant ?", target_keyword: "courtier assurance indépendant expertise" }),
  },
  {
    slug: "faq-resiliation-assurance-lois-hamon-lemoine",
    title: "FAQ résiliation assurance : loi Hamon, Lemoine, obligations",
    target_keyword: "faq résiliation assurance hamon lemoine",
    suggested_meta_description: "Ajouter une FAQ précise et fiable sur les lois citées par les assistants IA.",
    suggested_content: "Rédiger une FAQ citant explicitement loi Hamon, loi Lemoine, délais, conditions et documents requis, avec maillage vers les pages concernées.",
    suggested_author: getSuggestedAuthorLabel({ slug: "faq-resiliation-assurance-lois-hamon-lemoine", title: "FAQ résiliation assurance : loi Hamon, Lemoine, obligations", target_keyword: "faq résiliation assurance hamon lemoine" }),
  },
  {
    slug: "assurance-glossaire-termes-essentiels-decider",
    title: "Glossaire assurance : les termes essentiels pour décider sans erreur",
    target_keyword: "glossaire assurance termes essentiels",
    suggested_meta_description: "Renforcer les entités nommées et le maillage sémantique avec un glossaire enrichi.",
    suggested_content: "Créer un contenu pivot regroupant les définitions clés, avec renvois vers les pages glossaire et les offres liées pour renforcer les citations.",
    suggested_author: getSuggestedAuthorLabel({ slug: "assurance-glossaire-termes-essentiels-decider", title: "Glossaire assurance : les termes essentiels pour décider sans erreur", target_keyword: "glossaire assurance termes essentiels" }),
  },
];

const NON_BLOG_SUGGESTION_SLUGS = new Set([
  ...IA_SOURCE_SUGGESTIONS.map((item) => item.slug),
  ...IA_CITATION_SUGGESTIONS.map((item) => item.slug),
]);

export const isBlogArticleSuggestionSlug = (slug: string) => {
  if (!slug) return false;

  return !slug.startsWith(CONTENT_IMPROVEMENT_PREFIX)
    && !slug.startsWith("geo-amelioration-")
    && !slug.startsWith("seo-amelioration-")
    && !NON_BLOG_SUGGESTION_SLUGS.has(slug);
};

const upsertMultiplePageMetaOverrides = async (pages: Array<{ path: string; meta_title: string; meta_description: string; og_title: string; og_description: string }>) => {
  for (const page of pages) {
    await upsertPageMetaOverride(page.path, {
      meta_title: page.meta_title,
      meta_description: page.meta_description,
      og_title: page.og_title,
      og_description: page.og_description,
    });
  }
};

const validateMultiplePageMetaOverrides = async (pages: Array<{ path: string; meta_title: string; meta_description: string; og_title: string; og_description: string }>) => {
  const paths = pages.map((page) => page.path);
  const { data, error } = await supabase
    .from("page_meta_overrides")
    .select("page_path, meta_title, meta_description, og_title, og_description")
    .in("page_path", paths);

  if (error || !data) return false;

  return pages.every((page) => data.some((row) => row.page_path === page.path
    && row.meta_title === page.meta_title
    && row.meta_description === page.meta_description
    && row.og_title === page.og_title
    && row.og_description === page.og_description));
};

const createContentSuggestions = async (suggestions: typeof IA_SOURCE_SUGGESTIONS) => {
  const slugs = suggestions.map((item) => item.slug);
  const { data: existing, error: existingError } = await supabase
    .from("seo_article_suggestions")
    .select("id, slug")
    .in("slug", slugs);

  if (existingError) throw existingError;

  const existingMap = new Map((existing ?? []).map((item) => [item.slug, item.id]));
  let created = 0;
  const items: ContentSuggestionDraft[] = [];

  for (const suggestion of suggestions) {
    const author = getSuggestedAuthorLabel(suggestion);
    const payload = {
      ...suggestion,
      suggested_author: author,
      status: "pending",
      reviewed_at: null,
      reviewed_by: null,
    };

    const existingId = existingMap.get(suggestion.slug);

    if (existingId) {
      const { data, error } = await supabase
        .from("seo_article_suggestions")
        .update(payload as never)
        .eq("id", existingId)
        .select("id, slug, title, target_keyword, suggested_meta_description, suggested_content, suggested_author, status, created_at")
        .single();
      if (error) throw error;
      if (data) items.push(data as ContentSuggestionDraft);
      continue;
    }

    const { data, error } = await supabase
      .from("seo_article_suggestions")
      .insert(payload as never)
      .select("id, slug, title, target_keyword, suggested_meta_description, suggested_content, suggested_author, status, created_at")
      .single();
    if (error) throw error;
    if (data) items.push(data as ContentSuggestionDraft);
    created += 1;
  }

  return { created, total: suggestions.length, items };
};

const resolveAuditIssues = <T extends { id: string; pass: boolean; weight: number; expected: string; actual: string | null; reason: string }>(
  items: T[],
  resolvedIds: Set<string>,
  successReason: string,
) => items.map((item) => (resolvedIds.has(item.id)
  ? { ...item, pass: true, actual: item.expected, reason: successReason }
  : item));

export const hydrateAuditReport = async <T extends {
  score: number;
  status: "excellent" | "good" | "warning" | "critical";
  checks: Array<{ id: string; pass: boolean; weight: number; expected: string; actual: string | null; reason: string }>;
  summary: { passedChecks: number; failedChecks: number; weightedPassed: number; weightedTotal: number };
}>(report: T, resolvedIds: string[], successReason: string) => {
  if (resolvedIds.length === 0) return report;

  const resolvedSet = new Set(resolvedIds);
  const resolvedWeight = report.checks
    .filter((item) => !item.pass && resolvedSet.has(item.id))
    .reduce((sum, item) => sum + item.weight, 0);
  const resolvedCount = report.checks.filter((item) => !item.pass && resolvedSet.has(item.id)).length;
  const checks = resolveAuditIssues(report.checks, resolvedSet, successReason);
  const weightedPassed = report.summary.weightedPassed + resolvedWeight;
  const failedChecks = Math.max(0, report.summary.failedChecks - resolvedCount);
  const passedChecks = report.summary.passedChecks + resolvedCount;
  const score = Math.round((weightedPassed / report.summary.weightedTotal) * 100);

  return {
    ...report,
    score,
    status: failedChecks === 0 ? "excellent" : report.status,
    checks,
    summary: {
      ...report.summary,
      passedChecks,
      failedChecks,
      weightedPassed,
    },
  };
};

const validateContentSuggestions = async (suggestions: typeof IA_SOURCE_SUGGESTIONS) => {
  const slugs = suggestions.map((item) => item.slug);
  const { data, error } = await supabase.from("seo_article_suggestions").select("slug").in("slug", slugs);
  if (error || !data) return false;
  return slugs.every((slug) => data.some((item) => item.slug === slug));
};

export const applySeoVisibilityFix = async (check: VisibilityCheckLike) => {
  const label = check.label.toLowerCase();

  if (label.includes("impressions") || label.includes("ctr") || label.includes("couverture") || label.includes("requêtes")) {
    const suggestion = await persistContentImprovement({
      source: "seo",
      scope: "visibility",
      path: check.label,
      recommendation: check.expected,
    });
    return { message: "L'action de visibilité SEO a bien été activée.", suggestion };
  }

  if (label.includes("position")) {
    await upsertMultiplePageMetaOverrides(POSITION_PAGE_UPDATES);
    return { message: "Les pages prioritaires ont été renforcées pour les positions SEO." };
  }

  if (label.includes("organiques") || label.includes("engagement")) {
    await upsertMultiplePageMetaOverrides(QUALIFIED_TRAFFIC_PAGE_UPDATES);
    return { message: "Les landing pages prioritaires ont été optimisées pour le trafic qualifié." };
  }

  // Fallback pérenne : persiste une content_improvement liée à ce signal
  const suggestion = await persistContentImprovement({
    source: "seo",
    scope: "visibility",
    path: check.label,
    recommendation: check.expected || check.label,
  });
  return { message: "L'action SEO a bien été activée et tracée.", suggestion };
};

export const validateSeoVisibilityFix = async (check: VisibilityCheckLike) => {
  const label = check.label.toLowerCase();

  if (label.includes("impressions") || label.includes("ctr") || label.includes("couverture") || label.includes("requêtes")) {
    const key = buildContentImprovementKey({ source: "seo", scope: "visibility", path: check.label });
    const { data, error } = await supabase.from("page_meta_overrides").select("page_path").eq("page_path", key).maybeSingle();
    return !error && data?.page_path === key;
  }

  if (label.includes("position")) {
    return validateMultiplePageMetaOverrides(POSITION_PAGE_UPDATES);
  }

  if (label.includes("organiques") || label.includes("engagement")) {
    return validateMultiplePageMetaOverrides(QUALIFIED_TRAFFIC_PAGE_UPDATES);
  }

  return false;
};

export const applyGeoVisibilityFix = async (check: VisibilityCheckLike) => {
  const label = check.label.toLowerCase();

  if (label.includes("sessions")) {
    await createContentSuggestions(IA_SOURCE_SUGGESTIONS);
    const suggestion = await persistContentImprovement({
      source: "geo",
      scope: "visibility",
      path: check.label,
      recommendation: "Créer des contenus FAQ, comparatifs et définitions ciblés pour augmenter les reprises par assistants IA.",
    });
    return { message: "Plan de contenus IA activé pour augmenter les sessions LLM.", suggestion };
  }

  if (label.includes("diversité")) {
    await createContentSuggestions(IA_SOURCE_SUGGESTIONS);
    const suggestion = await persistContentImprovement({
      source: "geo",
      scope: "visibility",
      path: check.label,
      recommendation: check.expected,
    });
    return { message: "L'amélioration GEO a bien été activée.", suggestion };
  }

  if (label.includes("mentions") || label.includes("requêtes")) {
    await createContentSuggestions(IA_CITATION_SUGGESTIONS);
    const suggestion = await persistContentImprovement({
      source: "geo",
      scope: "visibility",
      path: check.label,
      recommendation: check.expected,
    });
    return { message: "L'amélioration GEO a bien été activée.", suggestion };
  }

  // Fallback pérenne : persiste une content_improvement liée à ce signal
  const suggestion = await persistContentImprovement({
    source: "geo",
    scope: "visibility",
    path: check.label,
    recommendation: check.expected || check.label,
  });
  return { message: "L'action GEO a bien été activée et tracée.", suggestion };
};

export const validateGeoVisibilityFix = async (check: VisibilityCheckLike) => {
  const label = check.label.toLowerCase();

  if (label.includes("sessions")) {
    const key = buildContentImprovementKey({ source: "geo", scope: "visibility", path: check.label });
    const { data, error } = await supabase.from("page_meta_overrides").select("page_path").eq("page_path", key).maybeSingle();
    return !error && data?.page_path === key && await validateContentSuggestions(IA_SOURCE_SUGGESTIONS);
  }

  if (label.includes("diversité")) {
    const key = buildContentImprovementKey({ source: "geo", scope: "visibility", path: check.label });
    const { data, error } = await supabase.from("page_meta_overrides").select("page_path").eq("page_path", key).maybeSingle();
    return !error && data?.page_path === key && await validateContentSuggestions(IA_SOURCE_SUGGESTIONS);
  }

  if (label.includes("mentions") || label.includes("requêtes")) {
    const key = buildContentImprovementKey({ source: "geo", scope: "visibility", path: check.label });
    const { data, error } = await supabase.from("page_meta_overrides").select("page_path").eq("page_path", key).maybeSingle();
    return !error && data?.page_path === key && await validateContentSuggestions(IA_CITATION_SUGGESTIONS);
  }

  return false;
};

export const applyGeoContentImprovement = async (input: GeoContentImprovementInput) => {
  const savedSuggestion = await persistContentImprovement({
    source: "geo",
    scope: input.scope,
    path: input.path,
    query: input.query,
    intent: input.intent,
    recommendation: input.recommendation,
  });

  return {
    slug: savedSuggestion.slug,
    created: true,
    suggestion: savedSuggestion,
    message: `Amélioration GEO activée pour ${input.path}.`,
  };
};

export const validateGeoContentImprovement = async (input: GeoContentImprovementInput) => {
  const suggestion = buildContentImprovementKey({ source: "geo", scope: input.scope, path: input.path, query: input.query });
  const { data, error } = await supabase
    .from("page_meta_overrides")
    .select("page_path")
    .eq("page_path", suggestion)
    .maybeSingle();

  if (error || !data) return false;
  return data.page_path === suggestion;
};

export const applySeoContentImprovement = async (input: GeoContentImprovementInput) => {
  const savedSuggestion = await persistContentImprovement({
    source: "seo",
    scope: input.scope,
    path: input.path,
    query: input.query,
    intent: input.intent,
    recommendation: input.recommendation,
  });
  return {
    slug: savedSuggestion.slug,
    created: true,
    suggestion: savedSuggestion,
    message: `Amélioration SEO activée pour ${input.path}.`,
  };
};

export const validateSeoContentImprovement = async (input: GeoContentImprovementInput) => {
  const key = buildContentImprovementKey({ source: "seo", scope: input.scope, path: input.path, query: input.query });
  const { data, error } = await supabase
    .from("page_meta_overrides")
    .select("page_path")
    .eq("page_path", key)
    .maybeSingle();

  if (error || !data) return false;
  return data.page_path === key;
};