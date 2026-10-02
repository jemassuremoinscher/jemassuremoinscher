import { createContext, ReactNode, useCallback, useContext, useEffect, useMemo, useState } from "react";

// Un seul BreadcrumbList JSON-LD par page (correctif du 2026-10-02).
// Trois sources pouvaient en émettre chacune un :
// - GlobalSchemas : version générée depuis l'URL (sans accents ni hiérarchie) ;
// - le composant Breadcrumbs : le fil d'Ariane visible ;
// - SEOOptimized, quand la page passe un BreadcrumbList dans jsonLd
//   (ou une page qui l'écrit elle-même dans un <Helmet>).
// Les pages déclarent ici ce qu'elles émettent :
// - GlobalSchemas n'émet le sien que si aucune déclaration n'existe ;
// - SEOOptimized retire le sien si le composant Breadcrumbs est présent
//   (le fil visible fait foi).

type BreadcrumbSource = "component" | "jsonld";
type Counts = Record<BreadcrumbSource, number>;

interface BreadcrumbDeclarationValue {
  counts: Counts;
  register: (source: BreadcrumbSource) => () => void;
}

const EMPTY: Counts = { component: 0, jsonld: 0 };

const BreadcrumbDeclarationContext = createContext<BreadcrumbDeclarationValue | null>(null);

export function BreadcrumbDeclarationProvider({ children }: { children: ReactNode }) {
  const [counts, setCounts] = useState<Counts>(EMPTY);
  const register = useCallback((source: BreadcrumbSource) => {
    setCounts((c) => ({ ...c, [source]: c[source] + 1 }));
    return () => setCounts((c) => ({ ...c, [source]: Math.max(0, c[source] - 1) }));
  }, []);
  const value = useMemo(() => ({ counts, register }), [counts, register]);
  return <BreadcrumbDeclarationContext.Provider value={value}>{children}</BreadcrumbDeclarationContext.Provider>;
}

/** Ce que la page courante déclare (0 partout hors provider). */
export function useBreadcrumbDeclarations(): Counts {
  return useContext(BreadcrumbDeclarationContext)?.counts ?? EMPTY;
}

/** À appeler par tout composant qui émet un BreadcrumbList JSON-LD. */
export function useDeclareBreadcrumb(source: BreadcrumbSource, active = true) {
  const register = useContext(BreadcrumbDeclarationContext)?.register;
  useEffect(() => {
    if (!register || !active) return;
    return register(source);
  }, [register, source, active]);
}
