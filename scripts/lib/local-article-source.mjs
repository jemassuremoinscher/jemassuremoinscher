/**
 * Articles locaux (src/data/blogArticles*.ts) : outils partagés entre
 * generate-static-pages.mjs (qui écrit blog/<slug>/index.html) et
 * verify-local-articles.mjs (qui fait échouer le build si ce HTML ne
 * correspond plus à sa source TS).
 *
 * Bug trouvé le 2026-10-01 : ces pages n'étaient créées qu'une fois
 * ("already present" ensuite). 77 sur 80 servaient en production un
 * contenu périmé (auteurs fictifs, chiffres retirés de la source).
 */
import { createHash } from "node:crypto";

// Créés s'ils manquent, jamais réécrits : fichiers non suivis par git que le
// générateur ne doit pas toucher (décision de Paul).
export const LOCAL_ARTICLES_CREATE_ONLY = new Set(["barometre-assurance-t3-2026"]);

// Empreinte des champs de la source TS qui alimentent le HTML. Écrite dans
// <meta name="jmmc-source-hash"> par le générateur, recalculée par le contrôle.
export const localArticleSourceHash = (a) =>
  createHash("sha256")
    .update(JSON.stringify([a.slug, a.title, a.description ?? "", a.content ?? "", a.author ?? "", a.date ?? "", a.image ?? "", a.category ?? ""]))
    .digest("hex")
    .slice(0, 16);
