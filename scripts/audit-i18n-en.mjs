#!/usr/bin/env node
// Audit script: detects FR text remaining when EN toggle is active.
// Scans src/**/*.{ts,tsx} for:
//   1. Hardcoded literal strings with French accents/words (not wrapped in t())
//   2. Suspect entries in src/i18n/en.ts (FR words/accents still present)
//   3. SEO meta (title/description), alt= and aria-label= attributes that aren't t()
// Outputs CSV to /mnt/documents/i18n-audit-en.csv
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve('src');
const OUT = '/mnt/documents/i18n-audit-en.csv';

const FRENCH_WORDS = /\b(gratuit|moins cher|sans engagement|découvr|économ|protég|santé|habitation|voiture|comparateur|votre|nous|c['’]est|qu['’]|à|de|en|le|la|les|des|est|sont|moins|cher|économisez|conseillers?|assureurs?|devis|jeune|conducteur|emprunteur|prévoyance|partenaires?|maison|chien|chat|véhicule|façon|résili|garanties?|tarifs?|pas chère?|meilleure?s?|comparez|obtenez|recevez|découvrez|profitez|trouvez)\b/i;
const ACCENTS = /[àâäéèêëïîôöùûüÿçœÀÂÄÉÈÊËÏÎÔÖÙÛÜŸÇŒ]/;
const ENGLISH_WORDS = /\b(the|and|with|your|our|free|insurance|quote|cheap|best|find|get|compare|save|click|here|now|home|car|health|life|loan|pet|landlord)\b/i;

const rows = [['type','file','line','context','snippet']];

function walk(dir) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p);
    else if (/\.(ts|tsx)$/.test(e.name)) scanFile(p);
  }
}

function isLikelyFrench(s) {
  if (s.length < 4) return false;
  if (/^[A-Z_][A-Z0-9_]*$/.test(s)) return false; // CONST
  if (/^[a-z]+([A-Z][a-z]+)+$/.test(s)) return false; // camelCase identifier
  if (/^[/.#@a-z0-9_-]+$/i.test(s)) return false; // path/class
  return ACCENTS.test(s) || FRENCH_WORDS.test(s);
}

function scanFile(file) {
  const rel = path.relative('.', file);
  // skip i18n source files themselves except en.ts (we audit it separately)
  if (rel.endsWith('src/i18n/fr.ts')) return;
  const src = fs.readFileSync(file, 'utf8');
  const lines = src.split('\n');

  const isEnFile = rel.endsWith('src/i18n/en.ts');
  const isDataFile = /src\/data\//.test(rel);

  lines.forEach((line, idx) => {
    const ln = idx + 1;

    if (isEnFile) {
      // Look for FR text in EN translations
      const m = line.match(/^\s*['"]([^'"]+)['"]\s*:\s*['"]([^'"]+)['"]/);
      if (m && (ACCENTS.test(m[2]) || FRENCH_WORDS.test(m[2]))) {
        rows.push(['en-fr-leak', rel, ln, m[1], m[2]]);
      }
      return;
    }

    if (isDataFile) {
      // Data files: report any FR string literal so user knows DB/static content not translated
      const strs = line.match(/(['"`])((?:(?!\1).){8,})\1/g) || [];
      for (const s of strs) {
        const v = s.slice(1, -1);
        if (isLikelyFrench(v)) {
          rows.push(['data-fr-only', rel, ln, '', v.slice(0, 160)]);
          break;
        }
      }
      return;
    }

    // Component files
    // 1) SEOOptimized title/description literals
    const seoT = line.match(/\btitle=["']([^"']+)["']/);
    if (seoT && isLikelyFrench(seoT[1]) && /SEOOptimized|<Helmet/.test(src.slice(Math.max(0, src.indexOf(line)-400), src.indexOf(line)))) {
      rows.push(['seo-title-hardcoded', rel, ln, 'title=', seoT[1]]);
    }
    const seoD = line.match(/\bdescription=["']([^"']+)["']/);
    if (seoD && isLikelyFrench(seoD[1])) {
      rows.push(['seo-or-prop-desc-hardcoded', rel, ln, 'description=', seoD[1]]);
    }
    // 2) alt= attributes
    const alt = line.match(/\balt=["']([^"']+)["']/);
    if (alt && isLikelyFrench(alt[1])) {
      rows.push(['alt-hardcoded-fr', rel, ln, 'alt=', alt[1]]);
    }
    // 3) aria-label
    const aria = line.match(/\baria-label=["']([^"']+)["']/);
    if (aria && isLikelyFrench(aria[1])) {
      rows.push(['aria-label-hardcoded-fr', rel, ln, 'aria-label=', aria[1]]);
    }
    // 4) JSX text nodes (between > and <) with French
    const jsxText = line.match(/>([^<>{}\n]{6,})</);
    if (jsxText) {
      const v = jsxText[1].trim();
      if (isLikelyFrench(v) && !/\{t\(/.test(line)) {
        rows.push(['jsx-text-hardcoded-fr', rel, ln, '', v.slice(0, 160)]);
      }
    }
    // 5) String literals passed to known FR-only schema generators
    if (/addServiceSchema|addFAQSchema|addHowToSchema|addInsuranceProductSchema/.test(line)) {
      rows.push(['schema-fr-literal-context', rel, ln, 'schema()', line.trim().slice(0, 160)]);
    }
  });
}

walk(ROOT);

// Database content note (static, can't be scanned but flagged)
rows.push(['db-content','supabase.seo_article_suggestions','-','blog articles', 'Stored in French only — no translation layer']);
rows.push(['db-content','supabase.client_reviews','-','client reviews','Stored in French — no translation layer']);

const csv = rows.map(r => r.map(c => `"${String(c ?? '').replace(/"/g,'""')}"`).join(',')).join('\n');
fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(OUT, '\uFEFF' + csv);
console.log(`Wrote ${rows.length - 1} findings to ${OUT}`);

// Summary
const byType = {};
for (const r of rows.slice(1)) byType[r[0]] = (byType[r[0]] || 0) + 1;
console.log('Summary by type:');
for (const [k,v] of Object.entries(byType).sort((a,b)=>b[1]-a[1])) console.log(`  ${k}: ${v}`);
