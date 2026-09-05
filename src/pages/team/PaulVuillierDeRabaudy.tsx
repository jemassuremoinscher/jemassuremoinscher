import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEOOptimized from "@/components/SEOOptimized";
import Breadcrumbs from "@/components/Breadcrumbs";
import { authors, getAuthorJsonLd } from "@/data/authors";
import { addBreadcrumbSchema } from "@/utils/seoUtils";
import { Briefcase, GraduationCap, Landmark, Megaphone, Rocket } from "lucide-react";

const author = authors["Paul Vuillier de Rabaudy"];
const baseUrl = "https://www.jemassuremoinscher.fr";
const canonical = `${baseUrl}/qui-sommes-nous/paul-vuillier-de-rabaudy`;

interface CareerEntry {
  role: string;
  org: string;
  period?: string;
}

const careerSections: { icon: typeof Rocket; title: string; entries: CareerEntry[] }[] = [
  {
    icon: Rocket,
    title: "Entrepreneuriat & direction",
    entries: [
      { role: "Président du Groupe Mammouth", org: "Île Maurice — Mammouth Patrimoine, Mammouth AI, Mammouth Motors, Mammouth Connect", period: "depuis 2014" },
      { role: "Cofondateur", org: "Vitalize Labs (cession)" },
      { role: "Cofondateur", org: "Hypnolib (cession)" },
      { role: "Cofondateur", org: "jemassuremoinscher.fr", period: "depuis 2026" },
    ],
  },
  {
    icon: Megaphone,
    title: "Marketing",
    entries: [
      { role: "Directeur Marketing", org: "Approved Automotive — Dubaï", period: "2023-2025" },
    ],
  },
  {
    icon: Landmark,
    title: "Finance & juridique",
    entries: [
      { role: "Legal, Quality & Revenue Manager", org: "Driving Evolution — Paris", period: "depuis 2016" },
      { role: "Company Secretary", org: "2LDM Invest", period: "2021-2024" },
    ],
  },
  {
    icon: Briefcase,
    title: "Débuts de carrière",
    entries: [
      { role: "Finance & Operations Coordinator", org: "EEM", period: "2014-2015" },
      { role: "Product Communication Assistant", org: "Mitsubishi Motors North America", period: "2013" },
      { role: "Concierge", org: "Westin Hotels & Resorts — Paris", period: "2008-2010" },
    ],
  },
];

const PaulVuillierDeRabaudy = () => {
  const jsonLd = [
    getAuthorJsonLd(author),
    addBreadcrumbSchema([
      { name: "Accueil", url: baseUrl },
      { name: "Qui sommes-nous ?", url: `${baseUrl}/qui-sommes-nous` },
      { name: author.name, url: canonical },
    ]),
  ];

  return (
    <div className="min-h-screen bg-background">
      <SEOOptimized
        title="Paul Vuillier de Rabaudy — Cofondateur | jemassuremoinscher.fr"
        description="Paul Vuillier de Rabaudy, cofondateur de jemassuremoinscher.fr depuis janvier 2026. PhD en commerce international, parcours en entrepreneuriat, marketing et finance."
        canonical={canonical}
        jsonLd={jsonLd}
      />

      <Header />

      <main id="main-content">
        <div className="container mx-auto px-4 pt-4">
          <Breadcrumbs
            items={[
              { label: "Qui sommes-nous ?", href: "/qui-sommes-nous" },
              { label: author.name },
            ]}
          />
        </div>

        {/* Hero */}
        <section className="pt-6 pb-10 md:pt-8 md:pb-14">
          <div className="container mx-auto px-4 max-w-3xl">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">{author.name}</h1>
            <p className="text-lg text-primary font-semibold mb-6">{author.role}</p>
            <p className="text-muted-foreground leading-relaxed">{author.bio}</p>
          </div>
        </section>

        {/* Crédentials */}
        <section className="py-10 bg-muted/10">
          <div className="container mx-auto px-4 max-w-3xl">
            <div className="flex items-center gap-3 mb-5">
              <GraduationCap className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-bold text-foreground">Qualifications</h2>
            </div>
            <ul className="space-y-2">
              {author.credentials.map((credential) => (
                <li key={credential} className="flex items-start gap-2 text-sm text-muted-foreground">
                  <span className="text-primary mt-1">•</span>
                  <span>{credential}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Parcours, par thème */}
        <section className="py-14 md:py-20">
          <div className="container mx-auto px-4 max-w-3xl">
            <h2 className="text-2xl font-bold text-foreground mb-8">Parcours</h2>
            <div className="space-y-10">
              {careerSections.map(({ icon: Icon, title, entries }) => (
                <div key={title}>
                  <div className="flex items-center gap-2 mb-4">
                    <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                      <Icon className="h-4 w-4 text-primary" />
                    </div>
                    <h3 className="font-bold text-foreground">{title}</h3>
                  </div>
                  <ul className="space-y-3 pl-10">
                    {entries.map((entry) => (
                      <li key={`${entry.role}-${entry.org}`} className="text-sm">
                        <span className="font-semibold text-foreground">{entry.role}</span>
                        <span className="text-muted-foreground"> — {entry.org}</span>
                        {entry.period && <span className="text-muted-foreground italic"> ({entry.period})</span>}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default PaulVuillierDeRabaudy;
