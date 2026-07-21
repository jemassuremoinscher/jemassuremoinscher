import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

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
    { to: "/comparatif/maif-vs-macif", label: "Duel MAIF vs Macif" },
    { to: "/profil/resilie-non-paiement", label: "Résilié pour non-paiement ?" },
    { to: "/assurance-auto-jeune-conducteur", label: "Assurance jeune conducteur" },
  ],
  "Assurance Auto": [
    { to: "/assurance-auto", label: "Comparer les assurances auto" },
    { to: "/outils/calculateur-bonus-malus", label: "Calculer mon bonus-malus" },
    { to: "/comparatif/axa-vs-allianz", label: "Duel AXA vs Allianz" },
    { to: "/profil/retrait-permis", label: "Retrait de permis : solutions" },
    { to: "/profil/frequence-sinistres", label: "Multi-sinistré (3+ sinistres)" },
    { to: "/assurance-auto-jeune-conducteur", label: "Assurance jeune conducteur" },
  ],
  "Santé": [
    { to: "/assurance-sante", label: "Comparer les mutuelles santé" },
    { to: "/assurance-prevoyance", label: "Assurance prévoyance" },
    { to: "/assurance-animaux", label: "Assurance animaux" },
    { to: "/comparatif/alan-vs-harmonie-mutuelle", label: "Duel Alan vs Harmonie" },
  ],
  "Mutuelle Santé": [
    { to: "/assurance-sante", label: "Comparer les mutuelles santé" },
    { to: "/assurance-prevoyance", label: "Assurance prévoyance" },
    { to: "/comparatif/alan-vs-harmonie-mutuelle", label: "Duel Alan vs Harmonie" },
  ],
  "Habitation": [
    { to: "/assurance-habitation", label: "Comparer les assurances habitation" },
    { to: "/assurance-pno", label: "Assurance propriétaire non occupant" },
    { to: "/assurance-gli", label: "Garantie loyers impayés" },
    { to: "/comparatif/luko-vs-alan", label: "Duel Luko vs Alan" },
  ],
  "Assurance Habitation": [
    { to: "/assurance-habitation", label: "Comparer les assurances habitation" },
    { to: "/assurance-pno", label: "Assurance PNO" },
    { to: "/comparatif/groupama-vs-gmf", label: "Duel Groupama vs GMF" },
  ],
  "Juridique": [
    { to: "/assurance-auto", label: "Assurance auto" },
    { to: "/assurance-habitation", label: "Assurance habitation" },
    { to: "/comparateur", label: "Comparateur multi-assurances" },
    { to: "/profil", label: "Solutions profils spéciaux" },
  ],
  "Actualités Légales": [
    { to: "/assurance-auto", label: "Assurance auto" },
    { to: "/comparateur", label: "Comparateur multi-assurances" },
    { to: "/profil", label: "Solutions profils spéciaux" },
    { to: "/comparatif", label: "Duels assureurs face à face" },
    { to: "/assurance-mrp", label: "Assurance MRP" },
    { to: "/glossaire", label: "Glossaire de l'assurance" },
  ],
  "Conseils Experts": [
    { to: "/comparateur", label: "Comparer toutes les assurances" },
    { to: "/contact", label: "Parler à un conseiller" },
    { to: "/glossaire", label: "Glossaire de l'assurance" },
    { to: "/profil", label: "Profils spéciaux : solutions dédiées" },
    { to: "/comparatif", label: "Duels assureurs face à face" },
  ],
  "Guides Pratiques": [
    { to: "/comparateur", label: "Comparer toutes les assurances" },
    { to: "/glossaire", label: "Glossaire de l'assurance" },
    { to: "/outils/calculateur-bonus-malus", label: "Calculateur bonus-malus" },
    { to: "/comparatif", label: "Duels assureurs" },
  ],
  "Conseils": [
    { to: "/comparateur", label: "Comparer toutes les assurances" },
    { to: "/contact", label: "Parler à un conseiller" },
    { to: "/glossaire", label: "Glossaire de l'assurance" },
    { to: "/comparatif", label: "Duels assureurs face à face" },
  ],
  "Mobilité Verte": [
    { to: "/assurance-trottinette-electrique", label: "Assurance trottinette électrique" },
    { to: "/assurance-auto", label: "Assurance auto" },
    { to: "/comparateur", label: "Comparateur multi-assurances" },
  ],
  "Assurance Emprunteur": [
    { to: "/assurance-emprunteur", label: "Assurance emprunteur" },
    { to: "/assurance-pret", label: "Assurance prêt" },
    { to: "/comparateur", label: "Comparateur multi-assurances" },
    { to: "/assurance-prevoyance", label: "Assurance prévoyance" },
  ],
  "Droits & Litiges": [
    { to: "/comparateur", label: "Comparateur multi-assurances" },
    { to: "/profil", label: "Solutions profils spéciaux" },
    { to: "/glossaire", label: "Glossaire de l'assurance" },
  ],
  "Assurance Animaux": [
    { to: "/assurance-animaux", label: "Comparer les assurances animaux" },
    { to: "/assurance-sante", label: "Mutuelle santé" },
    { to: "/comparateur", label: "Comparateur multi-assurances" },
  ],
  "Métiers Atypiques": [
    { to: "/assurance-metiers-atypiques", label: "Assurance métiers atypiques" },
    { to: "/assurance-mrp", label: "Assurance MRP" },
    { to: "/assurance-rc-pro", label: "RC Professionnelle" },
    { to: "/glossaire", label: "Glossaire de l'assurance" },
  ],
  "Réglementation": [
    { to: "/assurance-trottinette-electrique", label: "Assurance trottinette électrique" },
    { to: "/glossaire", label: "Glossaire de l'assurance" },
    { to: "/comparateur", label: "Comparateur multi-assurances" },
  ],
};

// Fallback for unknown categories
const defaultProducts: ProductLink[] = [
  { to: "/comparateur", label: "Comparer les assurances" },
  { to: "/blog", label: "Tous nos articles" },
  { to: "/contact", label: "Contactez un conseiller" },
  { to: "/comparatif", label: "Duels assureurs face à face" },
];

// Tag-based extra links
const tagToLink: Record<string, ProductLink> = {
  "jeune conducteur": { to: "/blog/jeune-conducteur-voiture-puissante-110-chevaux", label: "Jeune conducteur + voiture puissante" },
  "bonus malus": { to: "/outils/calculateur-bonus-malus", label: "Calculateur bonus-malus" },
  "malus": { to: "/profil/frequence-sinistres", label: "Solutions multi-sinistré" },
  "résiliation": { to: "/profil/resilie-non-paiement", label: "Résilié pour non-paiement : solutions" },
  "non-paiement": { to: "/profil/resilie-non-paiement", label: "Résilié pour non-paiement" },
  "agira": { to: "/profil/resilie-non-paiement", label: "Fichier AGIRA : que faire ?" },
  "retrait permis": { to: "/profil/retrait-permis", label: "Retrait de permis : solutions" },
  "alcool": { to: "/profil/retrait-permis", label: "Assurance après retrait de permis" },
  "sinistre": { to: "/profil/frequence-sinistres", label: "Multi-sinistré : solutions" },
  "mutuelle tns": { to: "/mutuelle-tns", label: "Mutuelle TNS" },
  "loi lemoine": { to: "/blog/loi-lemoine-2026", label: "Tout sur la loi Lemoine" },
  "loi hamon": { to: "/blog/resiliation-assurance-droits-2026", label: "Résiliation loi Hamon" },
  "habitation": { to: "/assurance-habitation", label: "Comparer les assurances habitation" },
  "animaux": { to: "/assurance-animaux", label: "Assurance animaux" },
  "rc pro": { to: "/assurance-rc-pro", label: "RC Professionnelle" },
  "maif": { to: "/comparatif/maif-vs-macif", label: "Duel MAIF vs Macif" },
  "axa": { to: "/comparatif/axa-vs-allianz", label: "Duel AXA vs Allianz" },
  "direct assurance": { to: "/comparatif/direct-assurance-vs-l-olivier", label: "Direct Assurance vs L'Olivier" },
  "primo": { to: "/profil/sans-antecedents", label: "Primo-assuré : comment s'assurer" },
  "sans antécédent": { to: "/profil/sans-antecedents", label: "Sans antécédents : solutions" },
  "trottinette": { to: "/assurance-trottinette-electrique", label: "Assurance trottinette électrique" },
  "emprunteur": { to: "/assurance-emprunteur", label: "Assurance emprunteur" },
  "métiers atypiques": { to: "/assurance-metiers-atypiques", label: "Assurance métiers atypiques" },
  "permis probatoire": { to: "/assurance-auto-jeune-conducteur", label: "Assurance jeune conducteur" },
  "décès": { to: "/assurance-prevoyance", label: "Assurance prévoyance" },
  "multirisque professionnelle": { to: "/assurance-mrp", label: "Assurance MRP" },
};

const RelatedProductLinks = ({ category, tags }: RelatedProductLinksProps) => {
  const { t } = useLanguage();
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

  const allLinks = [...products, ...tagLinks.slice(0, 3)];

  return (
    <nav aria-label={t("a11y.blog.relatedPages")} className="mt-10 p-5 rounded-xl border border-primary/20 bg-primary/5">
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
