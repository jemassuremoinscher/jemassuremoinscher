import { ReactNode } from "react";
import { Link } from "react-router-dom";
import { ShieldAlert } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

/**
 * Garde d'accès aux pages sensibles du back-office (sauvegardes, finance,
 * marketing, RGPD, corbeille, import, alertes...).
 * Le rôle est vérifié côté serveur (table user_roles + RLS) : ce composant
 * empêche simplement l'affichage de l'écran aux comptes non autorisés.
 */
export default function RequireAdmin({ children }: { children: ReactNode }) {
  const { loading, user, isAdmin } = useAuth();

  if (loading) {
    return (
      <div className="grid flex-1 place-items-center p-10">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#E9D5FF] border-t-[#7C3AED]" />
      </div>
    );
  }

  if (!user || !isAdmin) {
    return (
      <div className="grid flex-1 place-items-center p-10">
        <div className="max-w-md rounded-3xl border border-[#E9D5FF] bg-white p-8 text-center dark:border-[#362B54] dark:bg-[#1E1B2E]">
          <ShieldAlert className="mx-auto mb-3 h-10 w-10 text-[#7C3AED]" />
          <h1 className="text-lg font-semibold">Accès réservé aux administrateurs</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Ton compte n'a pas les droits nécessaires pour consulter cette page.
          </p>
          <Link
            to="/admin"
            className="mt-5 inline-flex rounded-full bg-[#7C3AED] px-5 py-2 text-sm font-medium text-white"
          >
            Retour au pipeline
          </Link>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
