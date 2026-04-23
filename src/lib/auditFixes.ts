import { supabase } from "@/integrations/supabase/client";

export const PAGE_META_CATALOG: { path: string; label: string; defaultTitle: string; defaultDesc: string }[] = [
  { path: "/", label: "Accueil", defaultTitle: "Assurance Moins Chère : Comparateur Gratuit | jemassuremoinscher.fr", defaultDesc: "Comparateur d'assurances gratuit. Comparez 50+ assureurs et économisez jusqu'à 280€. Devis en 2 min, sans engagement." },
  { path: "/assurance-auto", label: "Assurance Auto", defaultTitle: "Assurance Auto Moins Chère [Month] : -40% ⭐", defaultDesc: "50+ assureurs comparés gratuitement. Nos clients économisent 320€/an en moyenne. Devis auto instantané, sans engagement." },
  { path: "/assurance-moto", label: "Assurance Moto", defaultTitle: "Assurance Moto Moins Chère [Month] : -35% ⭐", defaultDesc: "Moto, scooter, 125cc : comparez 50+ assureurs. Tous risques dès 15€/mois. Devis gratuit et sans engagement." },
  { path: "/assurance-habitation", label: "Assurance Habitation", defaultTitle: "Assurance Habitation Moins Chère [Month] dès 3€", defaultDesc: "Comparez 50+ assureurs habitation en 2 min. Maison ou appartement, locataire ou propriétaire. Économisez jusqu'à 40%." },
  { path: "/assurance-sante", label: "Mutuelle Santé", defaultTitle: "Mutuelle Santé Moins Chère [Month] : -300€/an", defaultDesc: "Comparez 50+ mutuelles en 2 min. Optique, dentaire, hospitalisation : trouvez la formule idéale. 4.9/5 satisfaction client." },
  { path: "/assurance-animaux", label: "Assurance Animaux", defaultTitle: "Assurance Chien Chat dès 8€/mois [Month]", defaultDesc: "Mutuelle animaux : remboursement vétérinaire jusqu'à 100%. Comparez les offres chien et chat en 2 min. Sans délai de carence." },
  { path: "/assurance-vie", label: "Assurance Vie", defaultTitle: "Assurance Vie [Month] : Meilleurs Rendements", defaultDesc: "Fonds euros, unités de compte, PER : comparez les meilleures assurances vie. Fiscalité avantageuse après 8 ans. Devis gratuit." },
  { path: "/assurance-pret", label: "Assurance Prêt", defaultTitle: "Assurance Emprunteur [Month] : -15 000€ (Lemoine)", defaultDesc: "Loi Lemoine : changez d'assurance de prêt à tout moment. Comparez 50+ assureurs, économisez jusqu'à 50%. Devis gratuit en 2 min." },
  { path: "/assurance-prevoyance", label: "Prévoyance", defaultTitle: "Prévoyance [Month] : Protégez Votre Famille 9€/mois", defaultDesc: "Décès, invalidité, obsèques : comparez les garanties prévoyance de 50+ assureurs. Devis personnalisé gratuit en 2 min." },
  { path: "/assurance-rc-pro", label: "RC Professionnelle", defaultTitle: "RC Pro dès 15€/mois [Month] : Devis Gratuit", defaultDesc: "Responsabilité civile professionnelle : comparez 50+ assureurs. Tous secteurs : BTP, conseil, IT, commerce. Attestation immédiate." },
  { path: "/assurance-mrp", label: "Assurance MRP", defaultTitle: "Multirisque Pro (MRP) [Month] dès 20€/mois", defaultDesc: "Locaux, stock, matériel : protégez votre entreprise avec une MRP adaptée. 50+ assureurs comparés. Devis gratuit en 2 min." },
  { path: "/assurance-pno", label: "Assurance PNO", defaultTitle: "PNO Assurance dès 5€/mois [Month] | Copropriété", defaultDesc: "PNO assurance : comparez les assurances propriétaire non occupant. Obligatoire en copropriété (loi Alur). 50+ assureurs comparés. Devis gratuit." },
  { path: "/assurance-gli", label: "Garantie Loyers Impayés", defaultTitle: "GLI [Month] : Garantie Loyer Impayé dès 2,5%", defaultDesc: "Loyers impayés, dégradations, frais juridiques : sécurisez vos revenus locatifs. Comparez les GLI de 50+ assureurs. Devis gratuit." },
  { path: "/comparateur", label: "Comparateur", defaultTitle: "Comparateur d'Assurances Gratuit", defaultDesc: "Comparez les offres de 50+ assureurs en 2 minutes. Auto, santé, habitation, prêt. Sans engagement." },
  { path: "/blog", label: "Blog", defaultTitle: "Blog Assurance - Conseils & Guides", defaultDesc: "Guides complets, actualités et conseils pour économiser sur vos assurances." },
  { path: "/glossaire", label: "Glossaire", defaultTitle: "Glossaire de l'Assurance", defaultDesc: "Définitions claires de tous les termes d'assurance : franchise, prime, sinistre, responsabilité civile..." },
  { path: "/qui-sommes-nous", label: "Qui sommes-nous", defaultTitle: "Qui sommes-nous | jemassuremoinscher.fr", defaultDesc: "Découvrez notre équipe de courtiers en assurances. Indépendant, transparent, gratuit." },
  { path: "/contact", label: "Contact", defaultTitle: "Contactez-nous | jemassuremoinscher.fr", defaultDesc: "Besoin d'aide ? Contactez notre équipe de conseillers. Réponse sous 2h." },
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

export const canAutoFixSeoIssue = (issue: { category: string; description: string; file: string }) => {
  const fingerprint = `${issue.category} ${issue.description}`.toLowerCase();
  return Boolean(auditFileToPagePath(issue.file)) && (
    fingerprint.includes("title") ||
    fingerprint.includes("meta") ||
    fingerprint.includes("description") ||
    fingerprint.includes("open graph") ||
    fingerprint.includes("og")
  );
};

export const canAutoFixGeoIssue = (issue: { category: string; description: string; file: string }) => {
  const fingerprint = `${issue.category} ${issue.description}`.toLowerCase();
  return Boolean(auditFileToPagePath(issue.file)) && (
    fingerprint.includes("title") ||
    fingerprint.includes("geo")
  );
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

  throw new Error("Cette correction SEO nécessite une mise à jour manuelle du template.");
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

  throw new Error("Cette correction GEO nécessite une mise à jour manuelle du template ou du build statique.");
};