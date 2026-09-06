import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEOOptimized from "@/components/SEOOptimized";
import Breadcrumbs from "@/components/Breadcrumbs";
import BrandName from "@/components/BrandName";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { addBreadcrumbSchema, addOrganizationSchema } from "@/utils/seoUtils";
import { ExternalLink } from "lucide-react";

// Chemins publics en dur (public/, non hashés, non traités par le pipeline
// d'assets Vite) — même mécanisme que le logo du header et la mascotte du
// hero (src/components/Header.tsx, src/components/Hero.tsx), pas un import
// ES depuis src/assets/.
const jemassuremoinscherLogo = "/arthur-thumbs-up.webp";
const mammouthAiLogo = "/mammouth-group/mammouth-ai.png";
const myefflLogo = "/mammouth-group/myeffl.png";
const mayoLogo = "/mammouth-group/mayo-favicon.png";

const baseUrl = "https://www.jemassuremoinscher.fr";
const canonical = `${baseUrl}/qui-sommes-nous/groupe-mammouth`;

interface GroupEntity {
  name: string;
  description: string;
  logo?: string;
  /** URL externe vérifiée accessible, ou lien interne ("/") — absent si aucun site public */
  href?: string;
  external?: boolean;
  monogramColor?: string;
}

// Ordre et statut vérifiés un par un — aucun logo ni lien inventé pour les
// entités sans site public (Provence Concept, Mammouth Patrimoine, Mammouth
// Motors, Mammouth Connect).
const entities: GroupEntity[] = [
  {
    name: "jemassuremoinscher.fr",
    description: "Comparateur d'assurances en ligne, courtier indépendant enregistré ORIAS.",
    logo: jemassuremoinscherLogo,
    href: "/",
    monogramColor: "bg-primary",
  },
  {
    name: "Mammouth AI",
    description: "Chief of Staff IA pour fondateurs.",
    logo: mammouthAiLogo,
    href: "https://www.mammouth-ai.com",
    external: true,
    monogramColor: "bg-orange-500",
  },
  {
    name: "EFFL",
    description: "Programme d'anglais exécutif de 8 semaines pour dirigeants russophones.",
    logo: myefflLogo,
    href: "https://www.myeffl.com",
    external: true,
    monogramColor: "bg-emerald-700",
  },
  {
    name: "Mayo",
    description: "Crèche multilingue privée à Nice, Côte d'Azur.",
    logo: mayoLogo,
    href: "https://www.mayocreche.fr",
    external: true,
    monogramColor: "bg-sky-500",
  },
  {
    name: "Provence Concept",
    description: "Entité du Groupe Mammouth.",
    monogramColor: "bg-stone-500",
  },
  {
    name: "Mammouth Patrimoine",
    description: "Structure holding du Groupe Mammouth.",
    monogramColor: "bg-stone-600",
  },
  {
    name: "Mammouth Motors",
    description: "Entité du Groupe Mammouth.",
    monogramColor: "bg-stone-500",
  },
  {
    name: "Mammouth Connect",
    description: "Entité du Groupe Mammouth.",
    monogramColor: "bg-stone-600",
  },
];

const EntityCard = ({ entity }: { entity: GroupEntity }) => {
  const CardInner = (
    <Card className="h-full p-6 text-center hover:shadow-md transition-shadow">
      <CardContent className="p-0 flex flex-col items-center gap-3">
        {entity.logo ? (
          <div className="h-16 w-16 rounded-xl overflow-hidden border border-border/40 flex items-center justify-center bg-white shrink-0">
            <img src={entity.logo} alt={`Logo ${entity.name}`} className="h-full w-full object-contain p-1.5" loading="lazy" />
          </div>
        ) : (
          <Avatar className="h-16 w-16 text-xl">
            <AvatarFallback className={`${entity.monogramColor} text-white font-bold`}>
              {entity.name.charAt(0)}
            </AvatarFallback>
          </Avatar>
        )}
        <div>
          <p className="font-bold text-foreground flex items-center justify-center gap-1.5">
            {entity.name === "jemassuremoinscher.fr" ? <BrandName /> : entity.name}
            {entity.external && <ExternalLink className="h-3.5 w-3.5 text-muted-foreground" aria-hidden="true" />}
          </p>
          <p className="text-sm text-muted-foreground mt-1">{entity.description}</p>
        </div>
      </CardContent>
    </Card>
  );

  if (entity.href) {
    return entity.external ? (
      <a href={entity.href} target="_blank" rel="noopener noreferrer" className="block h-full no-underline text-inherit">
        {CardInner}
      </a>
    ) : (
      <a href={entity.href} className="block h-full no-underline text-inherit">
        {CardInner}
      </a>
    );
  }

  return CardInner;
};

const GroupeMammouth = () => {
  const jsonLd = [
    addOrganizationSchema(),
    addBreadcrumbSchema([
      { name: "Accueil", url: baseUrl },
      { name: "Qui sommes-nous ?", url: `${baseUrl}/qui-sommes-nous` },
      { name: "Groupe Mammouth", url: canonical },
    ]),
  ];

  return (
    <div className="min-h-screen bg-background">
      <SEOOptimized
        title="Groupe Mammouth | jemassuremoinscher.fr"
        description="Le Groupe Mammouth, présidé par Paul Vuillier de Rabaudy depuis 2014 : jemassuremoinscher.fr, Mammouth AI, EFFL, Mayo et les autres entités du groupe."
        canonical={canonical}
        jsonLd={jsonLd}
      />

      <Header />

      <main id="main-content">
        <div className="container mx-auto px-4 pt-4">
          <Breadcrumbs
            items={[
              { label: "Qui sommes-nous ?", href: "/qui-sommes-nous" },
              { label: "Groupe Mammouth" },
            ]}
          />
        </div>

        <section className="pt-6 pb-10 md:pt-8 md:pb-14">
          <div className="container mx-auto px-4 max-w-3xl">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Groupe Mammouth</h1>
            <p className="text-muted-foreground leading-relaxed">
              jemassuremoinscher.fr fait partie du Groupe Mammouth, présidé par Paul Vuillier de Rabaudy depuis 2014
              (Île Maurice).
            </p>
          </div>
        </section>

        <section className="pb-16 md:pb-24">
          <div className="container mx-auto px-4 max-w-5xl">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {entities.map((entity) => (
                <EntityCard key={entity.name} entity={entity} />
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default GroupeMammouth;
