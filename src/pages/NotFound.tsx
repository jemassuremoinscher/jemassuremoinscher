import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { useLanguage } from "@/contexts/LanguageContext";
import { Home, Car, Heart, Building, Search, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();
  const { t } = useLanguage();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  const popularLinks = [
    { to: "/comparateur", icon: Search, label: "Comparateur d'assurances" },
    { to: "/assurance-auto", icon: Car, label: "Assurance Auto" },
    { to: "/assurance-sante", icon: Heart, label: "Mutuelle Santé" },
    { to: "/assurance-habitation", icon: Building, label: "Assurance Habitation" },
  ];

  return (
    <>
      <Helmet>
        <title>Page introuvable | jemassuremoinscher</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      <div className="flex min-h-screen items-center justify-center bg-background px-4">
        <div className="text-center max-w-lg">
          <p className="text-7xl font-black text-primary mb-4">404</p>
          <h1 className="mb-3 text-2xl font-bold text-foreground">{t('notFound.title')}</h1>
          <p className="mb-8 text-muted-foreground">{t('notFound.text')}</p>

          <Button asChild size="lg" className="rounded-full mb-10">
            <Link to="/">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Retour à l'accueil
            </Link>
          </Button>

          <div className="border-t border-border pt-8">
            <p className="text-sm font-semibold text-foreground mb-4">Pages populaires</p>
            <div className="grid grid-cols-2 gap-3">
              {popularLinks.map(({ to, icon: Icon, label }) => (
                <Link
                  key={to}
                  to={to}
                  className="flex items-center gap-2 p-3 rounded-xl bg-muted hover:bg-primary/10 transition-colors text-sm font-medium text-foreground"
                >
                  <Icon className="h-4 w-4 text-primary shrink-0" />
                  {label}
                </Link>
              ))}
            </div>
            <div className="mt-6 flex flex-wrap justify-center gap-4 text-sm">
              <Link to="/blog" className="text-primary hover:underline">Blog</Link>
              <Link to="/contact" className="text-primary hover:underline">Contact</Link>
              <Link to="/nos-partenaires" className="text-primary hover:underline">Nos Partenaires</Link>
              <Link to="/plan-du-site" className="text-primary hover:underline">Plan du site</Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default NotFound;