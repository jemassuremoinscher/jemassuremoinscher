import { Link } from "react-router-dom";
import { ArrowRight, BookOpen, Calculator, MessageSquare } from "lucide-react";

interface RelatedLink {
  to: string;
  label: string;
  description: string;
}

interface RelatedInsuranceLinksProps {
  currentPage: string;
}

const allProducts: Record<string, RelatedLink> = {
  auto: { to: "/assurance-auto", label: "Assurance Auto", description: "Comparez les offres auto dès 11€/mois" },
  moto: { to: "/assurance-moto", label: "Assurance Moto", description: "Protégez votre deux-roues au meilleur prix" },
  habitation: { to: "/assurance-habitation", label: "Assurance Habitation", description: "Couvrez votre logement dès 4€/mois" },
  sante: { to: "/assurance-sante", label: "Mutuelle Santé", description: "Remboursements optimaux, cotisation maîtrisée" },
  animaux: { to: "/assurance-animaux", label: "Assurance Animaux", description: "Frais vétérinaires couverts jusqu'à 100%" },
  vie: { to: "/assurance-vie", label: "Assurance Vie", description: "Protégez vos proches et faites fructifier votre épargne" },
  pret: { to: "/assurance-pret", label: "Assurance Prêt", description: "Économisez sur votre assurance emprunteur" },
  prevoyance: { to: "/assurance-prevoyance", label: "Prévoyance", description: "Anticipez les aléas de la vie" },
  rcpro: { to: "/assurance-rc-pro", label: "RC Professionnelle", description: "Protégez votre activité professionnelle" },
  mrp: { to: "/assurance-mrp", label: "Assurance MRP", description: "Multirisque pour vos locaux professionnels" },
  pno: { to: "/assurance-pno", label: "Assurance PNO", description: "Propriétaire non occupant : protégez votre bien" },
  gli: { to: "/assurance-gli", label: "Garantie Loyers Impayés", description: "Sécurisez vos revenus locatifs" },
};

// Mapping: for each product page, which related products + resources to show
const relatedMap: Record<string, { products: string[]; articles: { to: string; label: string }[]; tools: { to: string; label: string }[] }> = {
  auto: {
    products: ["moto", "habitation", "pret"],
    articles: [
      { to: "/blog/meilleure-assurance-auto-2026", label: "Meilleure assurance auto 2026" },
      { to: "/blog/assurance-auto-jeune-conducteur-astuces", label: "Astuces jeune conducteur" },
      { to: "/blog/resiliation-assurance-droits-2026", label: "Résilier son assurance : vos droits" },
    ],
    tools: [
      { to: "/outils/calculateur-bonus-malus", label: "Calculateur Bonus-Malus" },
      { to: "/comparateur", label: "Comparateur multi-assurances" },
    ],
  },
  moto: {
    products: ["auto", "habitation", "prevoyance"],
    articles: [
      { to: "/blog/meilleure-assurance-auto-2026", label: "Guide assurance véhicule 2026" },
      { to: "/blog/resiliation-assurance-droits-2026", label: "Résilier son assurance facilement" },
    ],
    tools: [
      { to: "/outils/calculateur-bonus-malus", label: "Calculateur Bonus-Malus" },
      { to: "/comparateur", label: "Comparateur multi-assurances" },
    ],
  },
  habitation: {
    products: ["pno", "gli", "auto"],
    articles: [
      { to: "/blog/comparatif-habitation-2026", label: "Comparatif habitation 2026" },
      { to: "/blog/loi-lemoine-2026", label: "Loi Lemoine : ce qui change" },
    ],
    tools: [
      { to: "/comparateur", label: "Comparateur multi-assurances" },
      { to: "/glossaire", label: "Glossaire de l'assurance" },
    ],
  },
  sante: {
    products: ["prevoyance", "vie", "animaux"],
    articles: [
      { to: "/blog/top-mutuelles-sante-2026", label: "Top mutuelles santé 2026" },
      { to: "/blog/mutuelle-sante-reduire-frais-medicaux-2026", label: "Réduire ses frais médicaux" },
    ],
    tools: [
      { to: "/comparateur", label: "Comparateur multi-assurances" },
      { to: "/glossaire", label: "Glossaire de l'assurance" },
    ],
  },
  animaux: {
    products: ["sante", "habitation", "prevoyance"],
    articles: [
      { to: "/blog/top-mutuelles-sante-2026", label: "Guide mutuelles 2026" },
    ],
    tools: [
      { to: "/comparateur", label: "Comparateur multi-assurances" },
    ],
  },
  vie: {
    products: ["pret", "prevoyance", "sante"],
    articles: [
      { to: "/blog/loi-lemoine-2026", label: "Loi Lemoine 2026" },
    ],
    tools: [
      { to: "/comparateur", label: "Comparateur multi-assurances" },
      { to: "/glossaire", label: "Glossaire de l'assurance" },
    ],
  },
  pret: {
    products: ["vie", "habitation", "prevoyance"],
    articles: [
      { to: "/blog/loi-lemoine-2026", label: "Loi Lemoine : changer d'assurance prêt" },
      { to: "/blog/resiliation-assurance-droits-2026", label: "Vos droits de résiliation" },
    ],
    tools: [
      { to: "/comparateur", label: "Comparateur multi-assurances" },
    ],
  },
  prevoyance: {
    products: ["sante", "vie", "rcpro"],
    articles: [
      { to: "/blog/droits-des-assures-2026", label: "Droits des assurés 2026" },
    ],
    tools: [
      { to: "/comparateur", label: "Comparateur multi-assurances" },
      { to: "/glossaire", label: "Glossaire de l'assurance" },
    ],
  },
  rcpro: {
    products: ["mrp", "prevoyance", "gli"],
    articles: [
      { to: "/blog/nouvelle-reglementation-assurance-2025", label: "Nouvelles réglementations 2025" },
    ],
    tools: [
      { to: "/comparateur", label: "Comparateur multi-assurances" },
    ],
  },
  mrp: {
    products: ["rcpro", "pno", "gli"],
    articles: [
      { to: "/blog/nouvelle-reglementation-assurance-2025", label: "Nouvelles réglementations 2025" },
    ],
    tools: [
      { to: "/comparateur", label: "Comparateur multi-assurances" },
    ],
  },
  pno: {
    products: ["habitation", "gli", "mrp"],
    articles: [
      { to: "/blog/comparatif-habitation-2025", label: "Comparatif habitation 2025" },
    ],
    tools: [
      { to: "/comparateur", label: "Comparateur multi-assurances" },
      { to: "/contact", label: "Contactez un conseiller" },
    ],
  },
  gli: {
    products: ["pno", "habitation", "mrp"],
    articles: [
      { to: "/blog/comparatif-habitation-2025", label: "Comparatif habitation 2025" },
    ],
    tools: [
      { to: "/comparateur", label: "Comparateur multi-assurances" },
    ],
  },
};

const RelatedInsuranceLinks = ({ currentPage }: RelatedInsuranceLinksProps) => {
  const related = relatedMap[currentPage];
  if (!related) return null;

  const relatedProducts = related.products
    .map((key) => allProducts[key])
    .filter(Boolean);

  return (
    <section className="max-w-4xl mx-auto mb-16">
      <h2 className="text-2xl font-bold text-foreground mb-8 text-center">
        Nos clients consultent aussi
      </h2>

      {/* Related products */}
      <div className="grid sm:grid-cols-3 gap-4 mb-8">
        {relatedProducts.map((product) => (
          <Link
            key={product.to}
            to={product.to}
            className="group block p-5 rounded-xl border border-border/50 bg-muted/20 hover:border-primary/40 hover:bg-primary/5 transition-all"
          >
            <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors mb-1 flex items-center gap-2">
              {product.label}
              <ArrowRight className="h-4 w-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
            </h3>
            <p className="text-sm text-muted-foreground">{product.description}</p>
          </Link>
        ))}
      </div>

      {/* Articles & tools */}
      <div className="grid sm:grid-cols-2 gap-6">
        {/* Articles */}
        <div className="p-5 rounded-xl border border-border/30 bg-muted/10">
          <div className="flex items-center gap-2 mb-3">
            <BookOpen className="h-4 w-4 text-primary" />
            <h3 className="font-semibold text-foreground text-sm uppercase tracking-wide">
              Articles conseils
            </h3>
          </div>
          <ul className="space-y-2">
            {related.articles.map((article) => (
              <li key={article.to}>
                <Link
                  to={article.to}
                  className="text-sm text-muted-foreground hover:text-primary transition-colors hover:underline underline-offset-2"
                >
                  → {article.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Tools & resources */}
        <div className="p-5 rounded-xl border border-border/30 bg-muted/10">
          <div className="flex items-center gap-2 mb-3">
            <Calculator className="h-4 w-4 text-primary" />
            <h3 className="font-semibold text-foreground text-sm uppercase tracking-wide">
              Outils & Ressources
            </h3>
          </div>
          <ul className="space-y-2">
            {related.tools.map((tool) => (
              <li key={tool.to}>
                <Link
                  to={tool.to}
                  className="text-sm text-muted-foreground hover:text-primary transition-colors hover:underline underline-offset-2"
                >
                  → {tool.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
};

export default RelatedInsuranceLinks;
