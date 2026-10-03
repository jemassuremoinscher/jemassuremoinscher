/**
 * Rechargement après déploiement (décision de Paul du 3 octobre 2026).
 *
 * Quand un nouveau déploiement remplace les fichiers JS/CSS, un visiteur dont
 * la page a été chargée avant la bascule demande des fichiers qui n'existent
 * plus (« Failed to fetch dynamically imported module », événement Vite
 * 'vite:preloadError'). La page est alors rechargée UNE fois pour récupérer
 * la nouvelle version.
 *
 * Garde-fou (sessionStorage) : pas de second rechargement si le précédent a
 * eu lieu il y a moins de RELOAD_GUARD_MS — si le fichier manque encore après
 * rechargement, la page d'erreur s'affiche au lieu d'une boucle. Stockage
 * indisponible : aucun rechargement automatique (pas de garde-fou possible).
 *
 * Trace : chaque cas est écrit dans site_error_log (type 'chunk_load'). Avant
 * un rechargement, la trace est mise en attente dans sessionStorage et envoyée
 * au chargement suivant (une requête lancée juste avant reload() serait
 * annulée par le navigateur).
 */
import { reportSiteError } from "@/lib/siteErrorLog";

const GUARD_KEY = "stale-chunk-reload-at";
const PENDING_KEY = "stale-chunk-reload-pending";
const RELOAD_GUARD_MS = 5 * 60_000;
// Une même panne déclenche plusieurs écouteurs (vite:preloadError,
// ErrorBoundary, promesse rejetée) : une fois le rechargement lancé, les
// suivants ne font rien.
let reloading = false;

export const STALE_CHUNK_RE =
  /Failed to fetch dynamically imported module|error loading dynamically imported module|Importing a module script failed|Loading (CSS )?chunk [\w-]+ failed|Unable to preload CSS/i;

export const isStaleChunkError = (message: string | undefined | null) => !!message && STALE_CHUNK_RE.test(message);

/**
 * Recharge la page si aucun rechargement n'a eu lieu récemment.
 * Renvoie true si le rechargement est lancé (l'appelant n'a plus rien à faire).
 */
export function reloadOnceForStaleChunk(source: string, message: string): boolean {
  if (reloading) return true;
  const path = window.location.pathname;
  let last: number | null = null;
  try {
    const raw = sessionStorage.getItem(GUARD_KEY);
    last = raw ? Number(raw) : null;
  } catch {
    reportSiteError({ type: "chunk_load", message: `[stockage indisponible] ${message}`, context: { source, action: "no-reload-storage-unavailable" } });
    return false;
  }

  if (last && Date.now() - last < RELOAD_GUARD_MS) {
    // Message préfixé : sinon l'anti-doublon de reportSiteError (même page,
    // même message, moins d'une minute) l'absorberait derrière la trace
    // « reloaded » envoyée au démarrage.
    reportSiteError({ type: "chunk_load", message: `[pas de nouveau rechargement] ${message}`, context: { source, action: "no-reload-guard", lastReloadAt: new Date(last).toISOString() } });
    return false;
  }

  try {
    sessionStorage.setItem(GUARD_KEY, String(Date.now()));
    sessionStorage.setItem(PENDING_KEY, JSON.stringify({ source, message: message.slice(0, 500), path, at: new Date().toISOString() }));
  } catch {
    return false;
  }
  reloading = true;
  window.location.reload();
  return true;
}

/** Envoie la trace mise en attente avant un rechargement (appelé au démarrage). */
export function flushPendingStaleChunkReport(): void {
  try {
    const raw = sessionStorage.getItem(PENDING_KEY);
    if (!raw) return;
    sessionStorage.removeItem(PENDING_KEY);
    const p = JSON.parse(raw) as { source: string; message: string; path: string; at: string };
    reportSiteError({
      type: "chunk_load",
      message: p.message,
      pagePath: p.path,
      context: { source: p.source, action: "reloaded", detectedAt: p.at },
    });
  } catch {
    /* stockage indisponible ou trace illisible */
  }
}
