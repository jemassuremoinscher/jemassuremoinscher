import { lazy, Suspense } from "react";
import { useLocation } from "react-router-dom";

const ExitIntentLeadMagnet = lazy(() => import("./ExitIntentLeadMagnet"));

/**
 * Affiche le rattrapage exit-intent sur les pages à fort potentiel de
 * conversion (home, comparateur, fiches assurance, landings). Évite
 * d'apparaître sur les pages contenu (blog, glossaire, légal, admin).
 */
const ALLOWED_PREFIXES = [
  "/assurance-",
  "/mutuelle-",
  "/landing/",
  "/comparateur",
  "/outils/",
];

const GlobalExitIntent = () => {
  const { pathname } = useLocation();
  const allowed =
    pathname === "/" || ALLOWED_PREFIXES.some((p) => pathname.startsWith(p));
  if (!allowed) return null;
  return (
    <Suspense fallback={null}>
      <ExitIntentLeadMagnet />
    </Suspense>
  );
};

export default GlobalExitIntent;
