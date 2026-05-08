import { Link } from "react-router-dom";
import { ArrowRight, BookOpen, Calculator, ShieldAlert } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

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
  pret: { to: "/assurance-pret", label: "Assurance Emprunteur", description: "Économisez sur votre assurance emprunteur" },
  prevoyance: { to: "/assurance-prevoyance", label: "Prévoyance", description: "Anticipez les aléas de la vie" },
  rcpro: { to: "/assurance-rc-pro", label: "RC Professionnelle", description: "Protégez votre activité professionnelle" },
  mrp: { to: "/assurance-mrp", label: "Assurance MRP", description: "Multirisque pour vos locaux professionnels" },
  pno: { to: "/assurance-pno", label: "Assurance PNO", description: "Propriétaire non occupant : protégez votre bien" },
  gli: { to: "/assurance-gli", label: "Garantie Loyers Impayés", description: "Sécurisez vos revenus locatifs" },
  trottinette: { to: "/assurance-trottinette-electrique", label: "Assurance Trottinette", description: "EDPM : assurance obligatoire dès 3,50€/mois" },
  permisEtranger: { to: "/assurance-auto-permis-etranger", label: "Permis Étranger", description: "Assurance auto avec permis étranger accepté" },
  emprunteur: { to: "/assurance-emprunteur", label: "Assurance Emprunteur", description: "Changez à tout moment, économisez jusqu'à 15 000€" },
  metiersAtypiques: { to: "/assurance-metiers-atypiques", label: "Métiers Atypiques", description: "Activités à risques : devis sur-mesure auprès de 12 assureurs spé." },
  gestionLocative: { to: "/gestion-locative", label: "Gestion Locative", description: "Confiez vos biens à un pro : honoraires dès 5%" },
};

const nicheLinks = [
  { to: "/profil/resilie-non-paiement", label: "Résilié pour non-paiement" },
  { to: "/profil/retrait-permis", label: "Retrait de permis" },
  { to: "/profil/frequence-sinistres", label: "Multi-sinistré (3+ sinistres)" },
  { to: "/profil/sans-antecedents", label: "Sans antécédents / Primo-assuré" },
  { to: "/profil/jeune-conducteur-voiture-puissante", label: "Jeune conducteur + voiture puissante" },
];

const duelLinks = [
  { to: "/comparatif/maif-vs-macif", label: "MAIF vs Macif" },
  { to: "/comparatif/axa-vs-allianz", label: "AXA vs Allianz" },
  { to: "/comparatif/direct-assurance-vs-l-olivier", label: "Direct Assurance vs L'Olivier" },
  { to: "/comparatif/luko-vs-alan", label: "Luko vs Alan" },
];

const relatedMap: Record<string, { products: string[]; articles: { to: string; label: string }[]; tools: { to: string; label: string }[]; niches?: { to: string; label: string }[] }> = {
  auto: {
    products: ["moto", "habitation", "permisEtranger"],
    articles: [
      { to: "/blog/meilleure-assurance-auto-2026", label: "Meilleure assurance auto 2026" },
      { to: "/blog/assurance-auto-jeune-conducteur-astuces", label: "Astuces jeune conducteur" },
      { to: "/blog/permis-conduire-etranger-assurance-auto-france", label: "Assurance auto avec permis étranger" },
    ],
    tools: [
      { to: "/outils/calculateur-bonus-malus", label: "Calculateur Bonus-Malus" },
      { to: "/comparateur", label: "Comparateur multi-assurances" },
      { to: "/comparatif", label: "Duels assureurs face à face" },
    ],
    niches: [
      { to: "/profil/resilie-non-paiement", label: "Résilié pour non-paiement ?" },
      { to: "/profil/retrait-permis", label: "Retrait de permis ?" },
      { to: "/profil/jeune-conducteur-voiture-puissante", label: "Jeune conducteur + voiture puissante ?" },
      { to: "/profil/frequence-sinistres", label: "Multi-sinistré ?" },
      { to: "/profil/sans-antecedents", label: "Primo-assuré sans antécédents ?" },
    ],
  },
  moto: {
    products: ["auto", "trottinette", "habitation"],
    articles: [
      { to: "/blog/meilleure-assurance-auto-2026", label: "Guide assurance véhicule 2026" },
      { to: "/blog/resiliation-assurance-droits-2026", label: "Résilier son assurance facilement" },
    ],
    tools: [
      { to: "/outils/calculateur-bonus-malus", label: "Calculateur Bonus-Malus" },
      { to: "/comparateur", label: "Comparateur multi-assurances" },
      { to: "/comparatif/maif-vs-macif", label: "Duel : MAIF vs Macif" },
    ],
    niches: [
      { to: "/profil/jeune-conducteur-voiture-puissante", label: "Jeune conducteur + 2-roues puissant ?" },
      { to: "/profil/resilie-non-paiement", label: "Résilié pour non-paiement ?" },
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
      { to: "/comparatif/axa-vs-allianz", label: "Duel : AXA vs Allianz" },
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
      { to: "/comparatif/alan-vs-harmonie-mutuelle", label: "Duel : Alan vs Harmonie Mutuelle" },
    ],
  },
  animaux: {
    products: ["sante", "habitation", "prevoyance"],
    articles: [
      { to: "/blog/top-mutuelles-sante-2026", label: "Guide mutuelles 2026" },
    ],
    tools: [
      { to: "/comparateur", label: "Comparateur multi-assurances" },
      { to: "/comparatif", label: "Duels assureurs face à face" },
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
    products: ["emprunteur", "vie", "habitation"],
    articles: [
      { to: "/blog/loi-lemoine-2026", label: "Loi Lemoine : changer d'assurance emprunteur" },
      { to: "/blog/resiliation-assurance-droits-2026", label: "Vos droits de résiliation" },
    ],
    tools: [
      { to: "/comparateur", label: "Comparateur multi-assurances" },
      { to: "/comparatif", label: "Duels assureurs face à face" },
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
    products: ["mrp", "metiersAtypiques", "prevoyance"],
    articles: [
      { to: "/blog/nouvelle-reglementation-assurance-2026", label: "Nouvelles réglementations 2026" },
      { to: "/blog/assurance-parc-accrobranche-obligations-2026", label: "Assurance parc accrobranche 2026" },
      { to: "/blog/assurance-moniteur-sports-outdoor-2026", label: "Assurance moniteur sports outdoor" },
      { to: "/blog/assurance-organisateur-evenement-festival-2026", label: "Assurance organisateur d'événement" },
    ],
    tools: [
      { to: "/comparateur", label: "Comparateur multi-assurances" },
      { to: "/comparatif", label: "Duels assureurs face à face" },
    ],
  },
  mrp: {
    products: ["rcpro", "metiersAtypiques", "pno"],
    articles: [
      { to: "/blog/nouvelle-reglementation-assurance-2026", label: "Nouvelles réglementations 2026" },
      { to: "/blog/assurance-parc-accrobranche-obligations-2026", label: "Assurance parc accrobranche 2026" },
    ],
    tools: [
      { to: "/comparateur", label: "Comparateur multi-assurances" },
    ],
  },
  pno: {
    products: ["habitation", "gli", "mrp"],
    articles: [
      { to: "/blog/comparatif-habitation-2026", label: "Comparatif habitation 2026" },
    ],
    tools: [
      { to: "/comparateur", label: "Comparateur multi-assurances" },
      { to: "/contact", label: "Contactez un conseiller" },
    ],
  },
  gli: {
    products: ["pno", "habitation", "gestionLocative"],
    articles: [
      { to: "/blog/comparatif-habitation-2026", label: "Comparatif habitation 2026" },
      { to: "/blog/assurance-pno-obligatoire-louer-bien", label: "PNO : obligatoire pour louer ?" },
    ],
    tools: [
      { to: "/comparateur", label: "Comparateur multi-assurances" },
    ],
  },
  gestionLocative: {
    products: ["gli", "pno", "habitation"],
    articles: [
      { to: "/blog/assurance-pno-obligatoire-louer-bien", label: "PNO : obligatoire pour louer ?" },
      { to: "/blog/comparatif-habitation-2026", label: "Comparatif habitation 2026" },
    ],
    tools: [
      { to: "/comparateur", label: "Comparateur multi-assurances" },
      { to: "/contact", label: "Contactez un conseiller" },
    ],
  },
};

const RelatedInsuranceLinks = ({ currentPage }: RelatedInsuranceLinksProps) => {
  const related = relatedMap[currentPage];
  if (!related) return null;

  const relatedProducts = related.products
    .map((key) => allProducts[key])
    .filter(Boolean);

  const showNiches = related.niches && related.niches.length > 0;

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

      {/* Niche profiles (auto pages) */}
      {showNiches && (
        <div className="mb-8 p-5 rounded-xl border border-amber-200/50 dark:border-amber-800/30 bg-amber-50/30 dark:bg-amber-950/10">
          <div className="flex items-center gap-2 mb-3">
            <ShieldAlert className="h-4 w-4 text-amber-600 dark:text-amber-400" />
            <h3 className="font-semibold text-foreground text-sm uppercase tracking-wide">
              Profils spéciaux — Solutions dédiées
            </h3>
          </div>
          <div className="grid sm:grid-cols-2 gap-2">
            {related.niches!.map((niche) => (
              <Link
                key={niche.to}
                to={niche.to}
                className="text-sm text-muted-foreground hover:text-primary transition-colors hover:underline underline-offset-2"
              >
                → {niche.label}
              </Link>
            ))}
          </div>
        </div>
      )}

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
