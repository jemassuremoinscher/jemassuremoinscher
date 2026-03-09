import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

interface RelatedProductLinksProps {
  category: string;
  tags: string[];
}

interface ProductLink {
  to: string;
  label: string;
}

const categoryToProducts: Record<string, ProductLink[]> = {
  "Auto": [
    { to: "/assurance-auto", label: "Comparer les assurances auto" },
    { to: "/outils/calculateur-bonus-malus", label: "Calculer mon bonus-malus" },
    { to: "/assurance-moto", label: "Assurance moto" },
  ],
  "Santé": [
    { to: "/assurance-sante", label: "Comparer les mutuelles santé" },
    { to: "/assurance-prevoyance", label: "Assurance prévoyance" },
    { to: "/assurance-animaux", label: "Assurance animaux" },
  ],
  "Habitation": [
    { to: "/assurance-habitation", label: "Comparer les assurances habitation" },
    { to: "/assurance-pno", label: "Assurance propriétaire non occupant" },
    { to: "/assurance-gli", label: "Garantie loyers impayés" },
  ],
  "Juridique": [
    { to: "/assurance-auto", label: "Assurance auto" },
    { to: "/assurance-habitation", label: "Assurance habitation" },
    { to: "/comparateur", label: "Comparateur multi-assurances" },
  ],
  "Conseils": [
    { to: "/comparateur", label: "Comparer toutes les assurances" },
    { to: "/contact", label: "Parler à un conseiller" },
    { to: "/glossaire", label: "Glossaire de l'assurance" },
  ],
};

// Fallback for unknown categories
const defaultProducts: ProductLink[] = [
  { to: "/comparateur", label: "Comparer les assurances" },
  { to: "/blog", label: "Tous nos articles" },
  { to: "/contact", label: "Contactez un conseiller" },
];

// Tag-based extra links
const tagToLink: Record<string, ProductLink> = {
  "jeune conducteur": { to: "/seo/assurance-jeune-conducteur", label: "Guide jeune conducteur" },
  "bonus malus": { to: "/outils/calculateur-bonus-malus", label: "Calculateur bonus-malus" },
  "malus": { to: "/seo/assurance-auto-malus", label: "Assurance auto avec malus" },
  "mutuelle tns": { to: "/seo/mutuelle-tns", label: "Mutuelle TNS" },
  "résiliation": { to: "/blog/resiliation-assurance-droits-2026", label: "Vos droits de résiliation" },
  "loi lemoine": { to: "/blog/loi-lemoine-2026", label: "Tout sur la loi Lemoine" },
  "habitation": { to: "/assurance-habitation", label: "Comparer les assurances habitation" },
  "animaux": { to: "/assurance-animaux", label: "Assurance animaux" },
  "rc pro": { to: "/assurance-rc-pro", label: "RC Professionnelle" },
};

const RelatedProductLinks = ({ category, tags }: RelatedProductLinksProps) => {
  const products = categoryToProducts[category] || defaultProducts;

  // Add tag-based links (deduplicated)
  const tagLinks: ProductLink[] = [];
  const existingPaths = new Set(products.map((p) => p.to));
  
  for (const tag of tags) {
    const normalizedTag = tag.toLowerCase();
    for (const [key, link] of Object.entries(tagToLink)) {
      if (normalizedTag.includes(key) && !existingPaths.has(link.to)) {
        tagLinks.push(link);
        existingPaths.add(link.to);
      }
    }
  }

  const allLinks = [...products, ...tagLinks.slice(0, 2)];

  return (
    <nav aria-label="Pages liées" className="mt-10 p-5 rounded-xl border border-primary/20 bg-primary/5">
      <h3 className="font-bold text-foreground mb-3 text-base">
        📌 Pages utiles en rapport avec cet article
      </h3>
      <ul className="grid sm:grid-cols-2 gap-2">
        {allLinks.map((link) => (
          <li key={link.to}>
            <Link
              to={link.to}
              className="group flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors py-1"
            >
              <ArrowRight className="h-3 w-3 text-primary/60 group-hover:translate-x-0.5 transition-transform" />
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default RelatedProductLinks;
