#!/usr/bin/env node
// Migrates aria-label="..." and alt="..." French literals to t("a11y.<key>")
// Adds keys to src/i18n/fr.ts and src/i18n/en.ts
// Ensures useLanguage hook + import present in each touched file.

import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();

// Map: file -> array of { match: full attribute as it appears, key, en }
// Use unique excerpts captured from the source to ensure exact replacement.
const TARGETS = [
  // CookieBanner
  { file: "src/components/CookieBanner.tsx", attr: "aria-label", fr: "Fermer la bannière de cookies", en: "Close cookie banner", key: "a11y.cookieBanner.close" },
  // Footer
  { file: "src/components/Footer.tsx", attr: "aria-label", fr: "Fermer les mentions légales", en: "Close legal notice", key: "a11y.footer.closeLegal" },
  { file: "src/components/Footer.tsx", attr: "aria-label", fr: "Fermer les conditions générales", en: "Close terms and conditions", key: "a11y.footer.closeCgu" },
  { file: "src/components/Footer.tsx", attr: "aria-label", fr: "Fermer la politique de confidentialité", en: "Close privacy policy", key: "a11y.footer.closePrivacy" },
  // Header
  { file: "src/components/Header.tsx", attr: "aria-label", fr: "Retour à la page d'accueil", en: "Back to homepage", key: "a11y.header.home" },
  { file: "src/components/Header.tsx", attr: "aria-label", fr: "Réseaux sociaux", en: "Social networks", key: "a11y.common.socials" },
  { file: "src/components/Header.tsx", attr: "aria-label", fr: "Menu de navigation mobile", en: "Mobile navigation menu", key: "a11y.header.mobileMenu" },
  { file: "src/components/Header.tsx", attr: "aria-label", fr: "Comparer les assurances", en: "Compare insurance", key: "a11y.header.compare" },
  { file: "src/components/Header.tsx", attr: "aria-label", fr: "Nous contacter", en: "Contact us", key: "a11y.header.contact" },
  { file: "src/components/Header.tsx", attr: "alt", fr: "Arthur, la mascotte", en: "Arthur, the mascot", key: "a11y.header.mascotAlt" },
  // Hero
  { file: "src/components/Hero.tsx", attr: "aria-label", fr: "Section principale - Comparateur d'assurances", en: "Main section - Insurance comparator", key: "a11y.hero.section" },
  // ReadingProgressBar
  { file: "src/components/ReadingProgressBar.tsx", attr: "aria-label", fr: "Progression de lecture", en: "Reading progress", key: "a11y.reading.progress" },
  // Admin (kept FR-friendly EN)
  { file: "src/components/admin/DraftArticlesPublisher.tsx", attr: "aria-label", fr: "Rafraîchir", en: "Refresh", key: "a11y.common.refresh" },
  { file: "src/components/admin/DraftArticlesPublisher.tsx", attr: "aria-label", fr: "Dépublier", en: "Unpublish", key: "a11y.common.unpublish" },
  { file: "src/components/admin/DraftArticlesSocialPublisher.tsx", attr: "aria-label", fr: "Rafraîchir", en: "Refresh", key: "a11y.common.refresh" },
  { file: "src/components/admin/GoogleAnalyticsDashboard.tsx", attr: "aria-label", fr: "Rafraîchir les données Analytics", en: "Refresh Analytics data", key: "a11y.admin.refreshAnalytics" },
  { file: "src/components/admin/MicrosoftClarityWidget.tsx", attr: "aria-label", fr: "Ouvrir le tableau de bord Microsoft Clarity", en: "Open Microsoft Clarity dashboard", key: "a11y.admin.openClarity" },
  // Blog
  { file: "src/components/blog/AuthorExpertise.tsx", attr: "aria-label", fr: "Auteur vérifié", en: "Verified author", key: "a11y.blog.verifiedAuthor" },
  { file: "src/components/blog/EssentielBox.tsx", attr: "aria-label", fr: "Résumé de l'article", en: "Article summary", key: "a11y.blog.essentielBox" },
  { file: "src/components/blog/ExpertTip.tsx", attr: "aria-label", fr: "Conseil de l'expert", en: "Expert tip", key: "a11y.blog.expertTip" },
  { file: "src/components/blog/RelatedProductLinks.tsx", attr: "aria-label", fr: "Pages liées", en: "Related pages", key: "a11y.blog.relatedPages" },
  { file: "src/components/blog/TableOfContents.tsx", attr: "aria-label", fr: "Sommaire de l'article", en: "Table of contents", key: "a11y.blog.toc" },
  // Comparison
  { file: "src/components/comparison/InteractiveComparator.tsx", attr: "aria-label", fr: "Lancer la comparaison des tarifs d'assurance", en: "Launch insurance price comparison", key: "a11y.compare.launch" },
  { file: "src/components/comparison/InteractiveComparator.tsx", attr: "aria-label", fr: "Partager les résultats de comparaison", en: "Share comparison results", key: "a11y.compare.share" },
  { file: "src/components/comparison/InteractiveComparator.tsx", attr: "alt", fr: "Arthur mascotte comparateur assurance moins chère", en: "Arthur mascot - cheapest insurance comparator", key: "a11y.compare.mascotAlt" },
  // Contact callback
  { file: "src/components/contact/CallbackForm.tsx", attr: "aria-label", fr: "Demander un rappel téléphonique gratuit", en: "Request a free callback", key: "a11y.callback.submit" },
  { file: "src/components/contact/QuickHelpSection.tsx", attr: "alt", fr: "Arthur réfléchit - aide personnalisée assurance moins chère", en: "Arthur thinking - personalised help on cheaper insurance", key: "a11y.quickHelp.mascotAlt" },
  // Forms
  { file: "src/components/forms/QuoteRequestForm.tsx", attr: "aria-label", fr: "Envoyer ma demande de devis d'assurance", en: "Send my insurance quote request", key: "a11y.quote.submit" },
  // Hero variants
  { file: "src/components/hero/DynamicHeroContent.tsx", attr: "aria-label", fr: "Voir les avis clients", en: "See customer reviews", key: "a11y.hero.viewReviews" },
  { file: "src/components/hero/HeroQuoteForm.tsx", attr: "aria-label", fr: "Formulaire de demande de devis", en: "Quote request form", key: "a11y.hero.quoteForm" },
  { file: "src/components/hero/HeroQuoteForm.tsx", attr: "aria-label", fr: "Découvrez votre prix en 2 min", en: "Discover your price in 2 min", key: "a11y.hero.discoverPrice" },
  // Optimizer
  { file: "src/components/optimizer/ContractOptimizerWidget.tsx", attr: "aria-label", fr: "Vérifiez votre assurance auto", en: "Check your car insurance", key: "a11y.optimizer.check" },
  { file: "src/components/optimizer/ContractOptimizerWidget.tsx", attr: "alt", fr: "Arthur en voiture pour l'analyse de contrat d'assurance", en: "Arthur driving - car insurance contract analysis", key: "a11y.optimizer.mascotAlt" },
  // Chatbot
  { file: "src/components/chatbot/AIChatbot.tsx", attr: "alt", fr: "Arthur réfléchit", en: "Arthur thinking", key: "a11y.chatbot.mascotAlt" },
  // QuickQuoteSection
  { file: "src/components/quote/QuickQuoteSection.tsx", attr: "aria-label", fr: "Retour à l'étape précédente", en: "Back to previous step", key: "a11y.quick.back" },
  { file: "src/components/quote/QuickQuoteSection.tsx", attr: "aria-label", fr: "Passer à l'étape suivante", en: "Next step", key: "a11y.quick.next" },
  { file: "src/components/quote/QuickQuoteSection.tsx", attr: "aria-label", fr: "Envoyer ma demande de devis rapide", en: "Send my quick quote request", key: "a11y.quick.submit" },
  { file: "src/components/quote/QuickQuoteSection.tsx", attr: "alt", fr: "Arthur réfléchit - devis assurance rapide et moins cher", en: "Arthur thinking - quick cheaper insurance quote", key: "a11y.quick.mascotAlt" },
  // Regional widget
  { file: "src/components/regional/RegionalDataWidget.tsx", attr: "aria-label", fr: "Données régionales d'assurance", en: "Regional insurance data", key: "a11y.regional.data" },
  // Sections
  { file: "src/components/sections/GuidesSection.tsx", attr: "aria-label", fr: "Fermer le guide", en: "Close guide", key: "a11y.guides.close" },
  { file: "src/components/sections/HowItWorks.tsx", attr: "alt", fr: "Arthur court avec une pièce - économisez sur votre assurance moins chère", en: "Arthur running with a coin - save on cheaper insurance", key: "a11y.howItWorks.mascotAlt" },
  { file: "src/components/sections/SimpleFooter.tsx", attr: "aria-label", fr: "À propos", en: "About", key: "a11y.simpleFooter.about" },
  { file: "src/components/sections/SimpleFooter.tsx", attr: "aria-label", fr: "Réseaux sociaux", en: "Social networks", key: "a11y.common.socials" },
  { file: "src/components/sections/SimpleFooter.tsx", attr: "aria-label", fr: "Suivez-nous sur Instagram", en: "Follow us on Instagram", key: "a11y.social.instagram" },
  { file: "src/components/sections/SimpleFooter.tsx", attr: "aria-label", fr: "Suivez-nous sur LinkedIn", en: "Follow us on LinkedIn", key: "a11y.social.linkedin" },
  { file: "src/components/sections/SimpleFooter.tsx", attr: "aria-label", fr: "Suivez-nous sur Facebook", en: "Follow us on Facebook", key: "a11y.social.facebook" },
  { file: "src/components/sections/SimpleFooter.tsx", attr: "alt", fr: "Arthur - mascotte jemassuremoinscher.fr assurance moins chère", en: "Arthur - jemassuremoinscher.fr mascot, cheaper insurance", key: "a11y.simpleFooter.mascotAlt" },
  { file: "src/components/sections/TrustRow.tsx", attr: "aria-label", fr: "Courtier immatriculé ORIAS", en: "ORIAS-registered broker", key: "a11y.trust.orias" },
  { file: "src/components/sections/TrustRow.tsx", attr: "aria-label", fr: "Vérifier notre immatriculation sur le site officiel ORIAS (nouvelle fenêtre)", en: "Verify our registration on the official ORIAS website (new window)", key: "a11y.trust.oriasVerify" },
  { file: "src/components/sections/TrustRow.tsx", attr: "aria-label", fr: "Courtier indépendant, conseil 100% impartial", en: "Independent broker, 100% impartial advice", key: "a11y.trust.independent" },
  { file: "src/components/sections/TrustRow.tsx", attr: "aria-label", fr: "Transparence totale, service gratuit et sans engagement", en: "Full transparency, free service with no commitment", key: "a11y.trust.transparent" },
  // Insurance expertise
  { file: "src/components/insurance/ExpertiseSection.tsx", attr: "alt", fr: "Équipe d'experts en assurance jemassuremoinscher.fr", en: "jemassuremoinscher.fr insurance experts team", key: "a11y.expertise.teamAlt" },
  // Admin pages
  { file: "src/pages/Admin.tsx", attr: "aria-label", fr: "Actualiser les données", en: "Refresh data", key: "a11y.common.refreshData" },
  { file: "src/pages/Admin.tsx", attr: "aria-label", fr: "Déconnexion", en: "Sign out", key: "a11y.common.signOut" },
  // FAQ
  { file: "src/pages/FAQ.tsx", attr: "aria-label", fr: "Filtrer par catégorie", en: "Filter by category", key: "a11y.faq.filter" },
  { file: "src/pages/FAQ.tsx", attr: "aria-label", fr: "Liste des questions fréquentes", en: "Frequently asked questions list", key: "a11y.faq.list" },
  { file: "src/pages/FAQ.tsx", attr: "alt", fr: "Arthur mascotte jemassuremoinscher.fr - questions fréquentes", en: "Arthur jemassuremoinscher.fr mascot - frequently asked questions", key: "a11y.faq.mascotAlt" },
  // Outils
  { file: "src/pages/outils/CalculateurBonusMalus.tsx", attr: "aria-label", fr: "Années sans accident", en: "Years without accident", key: "a11y.bonusMalus.years" },
  // Avis
  { file: "src/pages/AvisClients.tsx", attr: "alt", fr: "Arthur mascotte jemassuremoinscher.fr - avis clients vérifiés", en: "Arthur jemassuremoinscher.fr mascot - verified customer reviews", key: "a11y.avis.mascotAlt1" },
  { file: "src/pages/AvisClients.tsx", attr: "alt", fr: "Arthur mascotte jemassuremoinscher.fr - avis clients assurance moins chère", en: "Arthur jemassuremoinscher.fr mascot - cheaper insurance customer reviews", key: "a11y.avis.mascotAlt2" },
  // Contact
  { file: "src/pages/Contact.tsx", attr: "alt", fr: "Arthur en vol - comparer vos assurances gratuitement", en: "Arthur flying - compare your insurance for free", key: "a11y.contact.mascotAlt" },
  // Merci
  { file: "src/pages/Merci.tsx", attr: "alt", fr: "Arthur debout - confirmation demande devis assurance moins chère", en: "Arthur standing - cheaper insurance quote request confirmation", key: "a11y.merci.mascotAlt" },
  // Partenaires
  { file: "src/pages/NosPartenaires.tsx", attr: "alt", fr: "Arthur mascotte jemassuremoinscher.fr - nos partenaires assureurs", en: "Arthur jemassuremoinscher.fr mascot - our insurer partners", key: "a11y.partenaires.mascotAlt1" },
  { file: "src/pages/NosPartenaires.tsx", attr: "alt", fr: "Arthur en vol - comparer vos assurances gratuitement", en: "Arthur flying - compare your insurance for free", key: "a11y.partenaires.mascotAlt2" },
  // NotFound
  { file: "src/pages/NotFound.tsx", attr: "alt", fr: "Arthur en béquilles", en: "Arthur on crutches", key: "a11y.notFound.mascotAlt" },
  // QuiSommesNous
  { file: "src/pages/QuiSommesNous.tsx", attr: "alt", fr: "Logo CSCA - Chambre Syndicale des Courtiers d'Assurances", en: "CSCA logo - French Insurance Brokers Union", key: "a11y.about.cscaAlt" },
  { file: "src/pages/QuiSommesNous.tsx", attr: "alt", fr: "Arthur présente les certifications de jemassuremoinscher.fr", en: "Arthur showcasing jemassuremoinscher.fr certifications", key: "a11y.about.certifAlt" },
  { file: "src/pages/QuiSommesNous.tsx", attr: "alt", fr: "Arthur en vol", en: "Arthur flying", key: "a11y.about.flyAlt" },
];

// Group by file
const byFile = new Map();
for (const t of TARGETS) {
  if (!byFile.has(t.file)) byFile.set(t.file, []);
  byFile.get(t.file).push(t);
}

let patchedFiles = 0;
let replacements = 0;
const allKeys = new Map(); // key -> { fr, en }

for (const [file, list] of byFile) {
  const abs = path.join(ROOT, file);
  if (!fs.existsSync(abs)) {
    console.warn("MISSING", file);
    continue;
  }
  let src = fs.readFileSync(abs, "utf8");
  let changed = false;

  for (const t of list) {
    allKeys.set(t.key, { fr: t.fr, en: t.en });
    // Build possible literal patterns; the source uses different quoting.
    // Common forms:
    //   aria-label="FR"
    //   aria-label={`FR`}
    //   aria-label={"FR"}
    const escapedDouble = t.fr.replace(/"/g, '\\"');
    const candidates = [
      `${t.attr}="${escapedDouble}"`,
      `${t.attr}={"${escapedDouble}"}`,
      `${t.attr}={\`${t.fr}\`}`,
      `${t.attr}={'${t.fr.replace(/'/g, "\\'")}'}`,
    ];
    let matched = false;
    for (const cand of candidates) {
      if (src.includes(cand)) {
        const repl = `${t.attr}={t("${t.key}")}`;
        src = src.split(cand).join(repl);
        matched = true;
        changed = true;
        replacements++;
        break;
      }
    }
    if (!matched) {
      console.warn(`NO MATCH ${file} :: ${t.attr}="${t.fr}"`);
    }
  }

  if (changed) {
    // Ensure useLanguage import + hook
    if (!/from\s+["']@\/contexts\/LanguageContext["']/.test(src)) {
      // insert import after the last import line
      const importMatch = src.match(/(^import[\s\S]*?from\s+["'][^"']+["'];?\s*\n)(?![\s\S]*^import )/m);
      const importLine = `import { useLanguage } from "@/contexts/LanguageContext";\n`;
      // simpler: append after first block of imports
      const lastImportIdx = (() => {
        const re = /^import[^\n]*\n/gm;
        let m, last = 0;
        while ((m = re.exec(src))) last = m.index + m[0].length;
        return last;
      })();
      src = src.slice(0, lastImportIdx) + importLine + src.slice(lastImportIdx);
    } else if (!/\buseLanguage\b/.test(src.split("from \"@/contexts/LanguageContext\"")[0])) {
      // import exists but useLanguage not imported — add it
      src = src.replace(/import\s*\{([^}]*)\}\s*from\s*["']@\/contexts\/LanguageContext["']/, (m, inside) => {
        if (inside.includes("useLanguage")) return m;
        return `import {${inside}, useLanguage } from "@/contexts/LanguageContext"`;
      });
    }
    // Ensure hook call in component
    if (!/const\s*\{\s*t\s*[,}]/.test(src) && !/useLanguage\(\)/.test(src)) {
      // Insert hook at top of first function/const component body — best-effort
      // Look for a function component pattern: "const X = (...) => {" or "function X(...) {"
      const compRe = /(const\s+\w+[^=]*=\s*\([^)]*\)\s*=>\s*\{|function\s+\w+\s*\([^)]*\)\s*\{)/;
      const m = src.match(compRe);
      if (m) {
        const idx = m.index + m[0].length;
        src = src.slice(0, idx) + `\n  const { t } = useLanguage();` + src.slice(idx);
      }
    } else if (/useLanguage\(\)/.test(src) && !/\bconst\s*\{\s*[^}]*\bt\b[^}]*\}\s*=\s*useLanguage\(\)/.test(src)) {
      // hook used but `t` not destructured — leave as-is (assume already exposed)
    }
    fs.writeFileSync(abs, src);
    patchedFiles++;
  }
}

// Append translation keys to fr.ts and en.ts (skip if already present)
function appendKeys(filePath, lang) {
  let src = fs.readFileSync(filePath, "utf8");
  const insertIdx = src.lastIndexOf("};");
  if (insertIdx === -1) return;
  let block = `\n  // a11y (auto-generated)\n`;
  let added = 0;
  for (const [key, val] of allKeys) {
    const re = new RegExp(`["']${key.replace(/\./g, "\\.")}["']\\s*:`);
    if (re.test(src)) continue;
    const text = (lang === "fr" ? val.fr : val.en).replace(/\\/g, "\\\\").replace(/"/g, '\\"');
    block += `  "${key}": "${text}",\n`;
    added++;
  }
  if (added > 0) {
    src = src.slice(0, insertIdx) + block + src.slice(insertIdx);
    fs.writeFileSync(filePath, src);
  }
  console.log(`Added ${added} ${lang} keys`);
}
appendKeys(path.join(ROOT, "src/i18n/fr.ts"), "fr");
appendKeys(path.join(ROOT, "src/i18n/en.ts"), "en");

console.log(`Patched ${patchedFiles} files, ${replacements} replacements, ${allKeys.size} unique keys.`);
