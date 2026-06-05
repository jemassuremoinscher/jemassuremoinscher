// Auto-patch SEOOptimized title/description to use t() across pages
import fs from 'node:fs';

const map = {
  'src/pages/AssuranceAnimaux.tsx': 'animaux',
  'src/pages/AssuranceExpatries.tsx': 'expatries',
  'src/pages/AssuranceGLI.tsx': 'gli',
  'src/pages/AssuranceMRP.tsx': 'mrp',
  'src/pages/AssuranceMetiersAtypiques.tsx': 'metiersAtypiques',
  'src/pages/AssuranceMoto.tsx': 'moto',
  'src/pages/AssurancePNO.tsx': 'pno',
  'src/pages/AssurancePret.tsx': 'pret',
  'src/pages/AssurancePrevoyance.tsx': 'prevoyance',
  'src/pages/AssuranceRCPro.tsx': 'rcpro',
  'src/pages/AssuranceVie.tsx': 'vie',
  'src/pages/BlogPreview.tsx': 'blogPreview',
  'src/pages/CGU.tsx': 'cgu',
  'src/pages/Comparateur.tsx': 'comparateur',
  'src/pages/FAQ.tsx': 'faq',
  'src/pages/GestionLocative.tsx': 'gestionLocative',
  'src/pages/Glossaire.tsx': 'glossaire',
  'src/pages/LlmsTxt.tsx': 'llmsTxt',
  'src/pages/MentionsLegales.tsx': 'mentions',
  'src/pages/NewsletterGestion.tsx': 'newsletter',
  'src/pages/NosPartenaires.tsx': 'partenaires',
  'src/pages/PlanDuSite.tsx': 'plan',
  'src/pages/PolitiqueConfidentialite.tsx': 'confidentialite',
  'src/pages/PolitiqueCookies.tsx': 'cookies',
  'src/pages/SourcesEtMethodologie.tsx': 'sources',
  'src/pages/profil/NicheProfilePage.tsx': 'nicheProfile',
};

let totalChanges = 0;
for (const [file, key] of Object.entries(map)) {
  let src = fs.readFileSync(file, 'utf8');
  const orig = src;

  // Replace title="..." (any content) within first SEOOptimized block - use SEOOptimized scope
  // We'll do targeted replacement: find SEOOptimized opening, then within ~600 chars replace title and description.
  const re = /(<SEOOptimized[\s\S]{0,800}?)title=("[^"]*"|\{[^}]*\})/;
  src = src.replace(re, (m, before) => `${before}title={t("seo.${key}.title")}`);
  const re2 = /(<SEOOptimized[\s\S]{0,800}?)description=("[^"]*"|\{[^}]*\}|`[^`]*`)/;
  src = src.replace(re2, (m, before) => `${before}description={t("seo.${key}.description")}`);

  // Ensure useLanguage import
  if (!/useLanguage/.test(src)) {
    // Add import after the last "import" line
    const importLines = src.match(/^import .+$/gm) || [];
    const lastImport = importLines[importLines.length - 1];
    src = src.replace(lastImport, `${lastImport}\nimport { useLanguage } from "@/contexts/LanguageContext";`);

    // Add const { t } = useLanguage(); inside component
    // Find first `const X = (` or `const X: ... = (` component and add at start of its body
    const compMatch = src.match(/(const\s+\w+\s*(?::\s*[^=]+)?=\s*\(\s*[^)]*\)\s*=>\s*\{)/);
    if (compMatch) {
      src = src.replace(compMatch[0], `${compMatch[0]}\n  const { t } = useLanguage();`);
    } else {
      // function declaration
      const fnMatch = src.match(/(function\s+\w+\s*\([^)]*\)\s*\{)/);
      if (fnMatch) src = src.replace(fnMatch[0], `${fnMatch[0]}\n  const { t } = useLanguage();`);
    }
  }

  if (src !== orig) {
    fs.writeFileSync(file, src);
    totalChanges++;
    console.log(`Patched: ${file}`);
  } else {
    console.log(`No change: ${file}`);
  }
}
console.log(`Done. ${totalChanges} files patched.`);
