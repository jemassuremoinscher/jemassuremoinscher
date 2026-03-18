import { useParams, Navigate } from "react-router-dom";
import NicheLandingPage from "@/components/niche/NicheLandingPage";
import { getNicheBySlug, nicheProfiles } from "@/data/nicheInsuranceData";
import { Card } from "@/components/ui/card";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEOOptimized from "@/components/SEOOptimized";
import { ShieldCheck, ArrowRight } from "lucide-react";

const NicheProfilePage = () => {
  const { slug } = useParams<{ slug: string }>();

  // Index page: list all niches
  if (!slug) {
    return (
      <div className="min-h-screen bg-background">
        <SEOOptimized
          title="Profils Spéciaux — Assurance Auto Adaptée | jemassuremoinscher"
          description="Solutions d'assurance auto pour profils atypiques : résilié, retrait de permis, multi-sinistré, primo-assuré, jeune conducteur puissant."
          keyword="assurance auto profil spécial"
          canonical="https://jemassuremoinscher.fr/profil"
        />
        <Header />
        <main className="container mx-auto px-4 py-12 max-w-4xl">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4 text-center">
            Solutions pour profils spéciaux
          </h1>
          <p className="text-center text-muted-foreground mb-10 max-w-2xl mx-auto">
            Chaque situation a sa solution. Nos courtiers spécialisés accompagnent les profils que les assureurs traditionnels refusent.
          </p>
          <div className="grid sm:grid-cols-2 gap-6">
            {nicheProfiles.map((niche) => (
              <Link key={niche.slug} to={`/profil/${niche.slug}`}>
                <Card className="p-6 hover:border-primary/40 transition-all group cursor-pointer h-full">
                  <div className="flex items-start gap-3">
                    <ShieldCheck className="w-6 h-6 text-primary mt-0.5 shrink-0" />
                    <div>
                      <h2 className="font-bold text-foreground group-hover:text-primary transition-colors mb-2">
                        {niche.heroTitle.split(":")[0].trim()}
                      </h2>
                      <p className="text-sm text-muted-foreground line-clamp-2">{niche.heroSubtitle}</p>
                      <span className="inline-flex items-center gap-1 mt-3 text-sm font-medium text-primary">
                        Voir les solutions <ArrowRight className="w-3 h-3" />
                      </span>
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const data = getNicheBySlug(slug);
  if (!data) return <Navigate to="/profil" replace />;

  return <NicheLandingPage data={data} />;
};

export default NicheProfilePage;
