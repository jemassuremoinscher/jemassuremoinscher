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
const myefflLogo = "/mammouth-group/effl-light.png";
const mayoLogo = "/mammouth-group/mayo-favicon.png";
const provenceConceptLogo = "/mammouth-group/provence-concept-white.png";
const mammouthPatrimoineLogo = "/mammouth-group/mammouth-patrimoine.png";
const mammouthMotorsLogo = "/mammouth-group/mammouth-motors.png";
const mammouthConnectLogo = "/mammouth-group/mammouth-connect.png";

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
  /**
   * Couleur de marque réelle de l'entité (CSS/design tokens de son propre
   * site), ou à défaut la couleur déjà intégrée dans son fichier logo —
   * jamais devinée/inventée. Violet (bg-primary) reste exclusivement réservé
   * à jemassuremoinscher.fr.
   */
  cardBg?: string;
}

// Ordre et statut vérifiés un par un — aucun lien inventé pour les entités
// sans site public (Mammouth Patrimoine, Mammouth Motors, Mammouth Connect :
// logos fournis directement par Paul, mais pas de domaine à lier ; Provence
// Concept a un logo et une description sourcés sur son propre déploiement,
// mais pas de domaine personnalisé — vérifié via Vercel). Descriptions de
// Mammouth Patrimoine/Motors/Connect issues du LinkedIn de Paul (fournies
// directement, pas de présence web propre à vérifier en ligne).
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
    // #006ae6 : --primary vérifié dans leur CSS (assets/styles-*.css). Pas de
    // version blanche/inversée du logo trouvée (aucune référence dans le
    // HTML/CSS, chemins usuels en 404) — logo actuel conservé tel quel, fond
    // blanc opaque intégré au fichier, même traitement que Mayo.
    cardBg: "#006ae6",
  },
  {
    name: "EFFL",
    description: "Programme d'anglais exécutif de 8 semaines pour dirigeants russophones.",
    logo: myefflLogo,
    href: "https://www.myeffl.com",
    external: true,
    monogramColor: "bg-emerald-700",
    // #004225 : rgb(0 66 37) trouvé sur .ring-primary dans leur CSS Next.js.
    // Logo remplacé par leur propre variante claire (/logo-icon-light.png,
    // trouvée dans le DOM rendu) — vérifiée composée sur ce fond avant usage.
    cardBg: "#004225",
  },
  {
    name: "Mayo",
    description: "Crèche multilingue privée à Nice, Côte d'Azur.",
    logo: mayoLogo,
    href: "https://www.mayocreche.fr",
    external: true,
    monogramColor: "bg-sky-500",
    // #009fe3 : couleur intégrée dans leurs propres fichiers logo (favicon +
    // image "logo blanc" trouvée sur leur CDN) — plus fidèle à leur identité
    // visuelle réelle que le --primary de leur CSS (#3eace0, teinte dérivée
    // pour l'UI). Logo inchangé (déjà blanc sur fond bleu, carré).
    cardBg: "#009fe3",
  },
  {
    name: "Provence Concept",
    description: "Vêtements imaginés en Provence : t-shirts, sweatshirts et bientôt polos.",
    logo: provenceConceptLogo,
    // Pas de domaine personnalisé (vérifié via Vercel : uniquement des URLs
    // *.vercel.app par défaut) — pas de lien public pour l'instant.
    monogramColor: "bg-stone-500",
    // #15639e : --primary vérifié dans leur CSS Next.js (--brand: #3c8dcc,
    // --brand-deep: #0e3d6b). Logo remplacé par leur propre logo-white.png,
    // vérifié composé sur ce fond avant usage.
    cardBg: "#15639e",
  },
  {
    name: "Mammouth Patrimoine",
    description: "Service et conseil en France.",
    logo: mammouthPatrimoineLogo,
    monogramColor: "bg-stone-600",
    // Pas de site public (vérifié : aucun projet Vercel, aucun repo GitHub) —
    // donc aucune couleur de marque externe vérifiable. #3c8dcc est la
    // couleur déjà intégrée dans le fichier logo fourni par Paul (pas une
    // couleur de marque affirmée, juste un raccord visuel avec l'image).
    cardBg: "#3c8dcc",
  },
  {
    name: "Mammouth Motors",
    description: "Showroom virtuel et négoce international de véhicules neufs, basé à Dubaï (UAE, Afrique, CEI, Amérique du Sud).",
    logo: mammouthMotorsLogo,
    monogramColor: "bg-stone-500",
    // Pas de site public (idem Mammouth Patrimoine/Connect). #009ee2 est la
    // couleur déjà intégrée dans le fichier logo fourni par Paul.
    cardBg: "#009ee2",
  },
  {
    name: "Mammouth Connect",
    description: "Centre d'appels à l'Île Maurice, pour entreprises francophones internationales.",
    logo: mammouthConnectLogo,
    monogramColor: "bg-stone-600",
    // Pas de site public (idem Mammouth Patrimoine/Motors). #3c8dcc est la
    // couleur déjà intégrée dans le fichier logo fourni par Paul (identique
    // à Mammouth Patrimoine — les deux fichiers partagent ce bleu).
    cardBg: "#3c8dcc",
  },
  {
    name: "FINOPAYE",
    description: "Conseil en gestion de paye, basé à Rennes.",
    // Aucun logo fourni pour l'instant — monogramme générique, comme les 3
    // entités ci-dessus sans site public. Teinte "slate" pour rester distincte
    // du bleu "stone" des logos Patrimoine/Motors/Connect. SASU active depuis
    // le 17/06/2025 (SIREN 988 682 456, Rennes, dirigeant Alexandre Reinbold)
    // — vérifiée Pappers. Pas de site public, pas de lien.
    monogramColor: "bg-slate-500",
  },
];

const EntityCard = ({ entity }: { entity: GroupEntity }) => {
  const CardInner = (
    <Card className="h-full p-6 text-center hover:shadow-md transition-shadow">
      <CardContent className="p-0 flex flex-col items-center gap-3">
        {entity.logo ? (
          <div
            className={`h-16 w-16 rounded-xl overflow-hidden border border-border/40 flex items-center justify-center shrink-0 ${entity.cardBg ? "" : "bg-primary"}`}
            style={entity.cardBg ? { backgroundColor: entity.cardBg } : undefined}
          >
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
        description="Le Groupe Mammouth, présidé par Paul depuis 2014 : jemassuremoinscher.fr, Mammouth AI, EFFL, Mayo et les autres entités du groupe."
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
            {/* Option B validée : "Groupe Mammouth" redescend en eyebrow discret,
                le H1 devient neutre ("Nos autres marques") — Paul ne veut plus
                que le nom du groupe soit le grand titre visible de la page. */}
            <span className="text-xs font-semibold uppercase tracking-wide text-primary">
              Groupe Mammouth
            </span>
            <h1 className="mt-1 text-3xl md:text-4xl font-bold text-foreground mb-4">Nos autres marques</h1>
            <p className="text-muted-foreground leading-relaxed">
              jemassuremoinscher.fr fait partie du Groupe Mammouth, présidé par Paul depuis 2014
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
