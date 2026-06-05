import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEOOptimized from "@/components/SEOOptimized";
import InsuranceFAQ from "@/components/insurance/InsuranceFAQ";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { addServiceSchema, addFAQSchema, addBreadcrumbSchema } from "@/utils/seoUtils";
import QuickCheck from "@/components/niche/QuickCheck";
import SurchargeSimulator from "@/components/niche/SurchargeSimulator";
import { ShieldCheck, ArrowRight } from "lucide-react";
import arthurDetective from "@/assets/mascotte/arthur-detective.webp";
import type { NicheData } from "@/data/nicheInsuranceData";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const normalizeExpertiseBlockHeadings = (content: string) =>
  content.replace(/<h1\b/gi, "<h3").replace(/<\/h1>/gi, "</h3>").replace(/<h2\b/gi, "<h3").replace(/<\/h2>/gi, "</h3>");

interface NicheLandingPageProps {
  data: NicheData;
}

const NicheLandingPage = ({ data }: NicheLandingPageProps) => {
  const [showFloatingCTA, setShowFloatingCTA] = useState(false);

  useEffect(() => {
    const handleScroll = () => setShowFloatingCTA(window.scrollY > 400);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const breadcrumbs = [
    { name: "Accueil", url: "https://jemassuremoinscher.fr/" },
    { name: "Assurance Auto", url: "https://jemassuremoinscher.fr/assurance-auto" },
    { name: data.heroTitle.split(":")[0].trim(), url: `https://jemassuremoinscher.fr/profil/${data.slug}` },
  ];

  const schemas = [
    addBreadcrumbSchema(breadcrumbs),
    addServiceSchema({ name: data.title, description: data.metaDescription, provider: "jemassuremoinscher.fr", areaServed: "France" }),
    addFAQSchema(data.faqs),
  ];

  return (
    <div className="min-h-screen bg-background">
      <SEOOptimized
        title={data.title}
        description={data.metaDescription}
        keyword={data.keyword}
        canonical={`https://jemassuremoinscher.fr/profil/${data.slug}`}
        jsonLd={schemas}
      />
      <Header />

      {/* Hero — navy/slate tones for serious financial topics */}
      <section className="relative py-16 md:py-20 overflow-hidden" style={{ background: "linear-gradient(135deg, hsl(220 30% 15%), hsl(220 25% 22%))" }}>
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center relative">
            <img
              src={arthurDetective}
              alt="Arthur expert assurance"
              className="hidden lg:block absolute -left-28 bottom-0 w-28 h-auto opacity-90"
              width={112} height={140} loading="eager" decoding="async"
            />
            <div className="flex justify-center mb-6">
              <div className="p-3 rounded-full bg-white/10">
                <ShieldCheck className="h-10 w-10 text-white" />
              </div>
            </div>
            <h1 className="text-3xl md:text-5xl font-bold text-white mb-6 leading-tight">
              {data.heroTitle}
            </h1>
            <p className="text-lg md:text-xl text-white/80 mb-8 max-w-3xl mx-auto">
              {data.heroSubtitle}
            </p>
            <Button size="lg" className="text-lg px-8 py-6 bg-accent text-accent-foreground hover:bg-accent/90" asChild>
              <Link to="/comparateur">
                Obtenir mon tarif spécial <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <main id="main-content" className="container mx-auto px-4 py-12 space-y-12 max-w-4xl">
        {/* Quick Check */}
        <section>
          <QuickCheck
            questions={data.quickCheckQuestions}
            eligibleMessage={data.eligibleMessage}
            notEligibleMessage={data.notEligibleMessage}
          />
        </section>

        {/* Expertise Blocks */}
        <section className="space-y-6">
          <h2 className="text-2xl font-bold text-foreground">Ce que vous devez savoir</h2>
          {data.expertiseBlocks.map((block, i) => (
            <Card key={i} className="p-6 border-l-4 border-l-primary">
              <h3 className="text-lg font-bold text-foreground mb-3">{block.title}</h3>
              <div
                className="text-sm text-muted-foreground leading-relaxed prose prose-sm max-w-none"
                dangerouslySetInnerHTML={{ __html: normalizeExpertiseBlockHeadings(block.content) }}
              />
            </Card>
          ))}
        </section>

        {/* Solutions Table */}
        <section>
          <h2 className="text-2xl font-bold text-foreground mb-4">Les solutions disponibles pour votre profil</h2>
          <Card className="overflow-hidden">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead className="font-bold">Formule</TableHead>
                    <TableHead className="font-bold">Couverture</TableHead>
                    <TableHead className="font-bold">Franchise</TableHead>
                    <TableHead className="font-bold">Prix indicatif</TableHead>
                    <TableHead className="font-bold">Idéal pour</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.solutions.map((sol, i) => (
                    <TableRow key={i} className="hover:bg-muted/30 transition-colors">
                      <TableCell className="font-semibold text-foreground">{sol.formule}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">{sol.couverture}</TableCell>
                      <TableCell className="text-sm">{sol.franchise}</TableCell>
                      <TableCell className="font-semibold text-primary">{sol.prixIndicatif}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">{sol.ideal}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </Card>
        </section>

        {/* Surcharge Simulator */}
        <section>
          <SurchargeSimulator
            coefficient={data.surchargeCoefficient}
            label={data.surchargeLabel}
            explanation={data.surchargeExplanation}
          />
        </section>

        {/* FAQ */}
        <InsuranceFAQ title="Questions fréquentes" faqs={data.faqs} />

        {/* Bottom CTA */}
        <section className="text-center py-8">
          <Card className="p-8 border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-accent/5">
            <h2 className="text-2xl font-bold text-foreground mb-4">
              Prêt à retrouver une assurance adaptée ?
            </h2>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              Nos courtiers partenaires sont spécialisés dans les profils atypiques. Devis gratuit, sans engagement, sous 10 minutes.
            </p>
            <Button size="lg" className="text-lg px-8 py-6" asChild>
              <Link to="/comparateur">Obtenir mon tarif spécial</Link>
            </Button>
          </Card>
        </section>
      </main>

      {/* Floating CTA (mobile) */}
      {showFloatingCTA && (
        <div
          className="fixed bottom-6 left-4 right-4 z-50 md:hidden"
          style={{ animation: "fadeIn 0.3s ease-out" }}
        >
          <Link
            to="/comparateur"
            className="flex items-center justify-center gap-2 py-4 px-6 rounded-2xl font-bold text-base text-accent-foreground bg-gradient-to-r from-accent to-accent/80 shadow-lg active:scale-95 transition-transform"
          >
            Obtenir mon tarif spécial
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default NicheLandingPage;
