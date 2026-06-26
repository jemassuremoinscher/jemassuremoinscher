#!/usr/bin/env node

import { readFileSync, writeFileSync } from "node:fs";

import { resolve } from "node:path";

const BLOG_DATA_FILES = [

  "src/data/blogArticles.ts",

];

const GLOSSARY_FILE = "src/data/glossaryTerms.ts";

const MAX_LINKS_PER_ARTICLE = 5;

function loadGlossaryTerms(rootDir) {

  const filePath = resolve(rootDir, GLOSSARY_FILE);

  const src = readFileSync(filePath, "utf-8");

  const regex = /\{\s*id:\s*"[^"]+"\s*,\s*term:\s*"([^"]+)"\s*,\s*slug:\s*"([^"]+)"/g;

  const terms = [];

  let m;

  while ((m = regex.exec(src)) !== null) {

    terms.push({ term: m[1], slug: m[2] });

  }

  terms.sort((a, b) => b.term.length - a.term.length);

  return terms;

}

function splitProtectedSegments(content) {

  const protectedPattern =

    /```[\s\S]*?```|`[^`\n]+`|\[[^\]]+\]\([^)]+\)|^#{1,6}\s.*$/gm;

  const segments = [];

  let lastIndex = 0;

  let m;

  while ((m = protectedPattern.exec(content)) !== null) {

    if (m.index > lastIndex) {

      segments.push({ text: content.slice(lastIndex, m.index), protected: false });

    }

    segments.push({ text: m[0], protected: true });

    lastIndex = m.index + m[0].length;

  }

  if (lastIndex < content.length) {

    segments.push({ text: content.slice(lastIndex), protected: false });

  }

  return segments;

}

function linkifyArticleContent(content, glossaryTerms) {

  const segments = splitProtectedSegments(content);

  const usedSlugs = new Set();

  const linksAdded = [];

  for (const seg of segments) {

    if (seg.protected) continue;

    let progress = true;

    while (progress && linksAdded.length < MAX_LINKS_PER_ARTICLE) {

      progress = false;

      for (const { term, slug } of glossaryTerms) {

        if (linksAdded.length >= MAX_LINKS_PER_ARTICLE) break;

        if (usedSlugs.has(slug)) continue;

        const escaped = term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

        const re = new RegExp(`\\b(${escaped})\\b`, "i");

        const match = seg.text.match(re);

        if (!match) continue;

        const idx = match.index;

        const before = seg.text.slice(Math.max(0, idx - 2), idx);

        const afterEnd = idx + match[0].length;

        const after = seg.text.slice(afterEnd, afterEnd + 5);

        const isLocalBoldDefinition = before === "**" && /^\*\*\s*:/.test(after);

        if (isLocalBoldDefinition) {

          usedSlugs.add(slug);

          continue;

        }

        const linkMd = `[${match[0]}](/glossaire/${slug})`;

        seg.text =

          seg.text.slice(0, idx) + linkMd + seg.text.slice(idx + match[0].length);

        usedSlugs.add(slug);

        linksAdded.push({ term, slug });

        progress = true;

        break;

      }

    }

  }

  const newContent = segments.map((s) => s.text).join("");

  return { content: newContent, linksAdded };

}

function findContentBlocks(src) {

  const blocks = [];

  const marker = "content: `";

  let searchFrom = 0;

  while (true) {

    const start = src.indexOf(marker, searchFrom);

    if (start === -1) break;

    const contentStart = start + marker.length;

    let i = contentStart;

    while (i < src.length) {

      if (src[i] === "\\" && src[i + 1] === "`") {

        i += 2;

        continue;

      }

      if (src[i] === "`") break;

      i++;

    }

    const contentEnd = i;

    blocks.push({ markerStart: start, contentStart, contentEnd });

    searchFrom = contentEnd + 1;

  }

  return blocks;

}

function processFile(filePath, glossaryTerms, { apply }) {

  const src = readFileSync(filePath, "utf-8");

  const blocks = findContentBlocks(src);

  let result = "";

  let cursor = 0;

  const report = [];

  for (const block of blocks) {

    result += src.slice(cursor, block.contentStart);

    const original = src.slice(block.contentStart, block.contentEnd);

    const { content: linked, linksAdded } = linkifyArticleContent(original, glossaryTerms);

    result += linked;

    cursor = block.contentEnd;

    if (linksAdded.length > 0) {

      report.push({ linksAdded });

    }

  }

  result += src.slice(cursor);

  if (apply && report.length > 0) {

    writeFileSync(filePath, result, "utf-8");

  }

  return report;

}

function main() {

  const args = process.argv.slice(2);

  const apply = args.includes("--apply");

  const rootDir = process.cwd();

  const glossaryTerms = loadGlossaryTerms(rootDir);

  console.log(`Glossaire chargé : ${glossaryTerms.length} termes.\n`);

  let totalArticlesTouched = 0;

  let totalLinksAdded = 0;

  for (const relPath of BLOG_DATA_FILES) {

    const filePath = resolve(rootDir, relPath);

    console.log(`--- ${relPath} ---`);

    let report;

    try {

      report = processFile(filePath, glossaryTerms, { apply });

    } catch (err) {

      console.log(`  (ignoré : ${err.message})`);

      continue;

    }

    if (report.length === 0) {

      console.log("  Aucun lien à ajouter dans ce fichier.");

    }

    for (const entry of report) {

      totalArticlesTouched++;

      totalLinksAdded += entry.linksAdded.length;

      const list = entry.linksAdded.map((l) => `${l.term} → /glossaire/${l.slug}`).join(", ");

      console.log(`  Article #${totalArticlesTouched}: ${entry.linksAdded.length} lien(s) — ${list}`);

    }

    console.log("");

  }

  console.log("====================================");

  console.log(`Articles concernés : ${totalArticlesTouched}`);

  console.log(`Liens ajoutés (total) : ${totalLinksAdded}`);

  console.log(apply ? "Mode APPLY : fichiers modifiés." : "Mode DRY-RUN : aucun fichier modifié.");

  console.log("====================================");

}

main();
