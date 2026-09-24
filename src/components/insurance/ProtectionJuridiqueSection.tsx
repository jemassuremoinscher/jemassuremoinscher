/**
 * Section partagée "Protection juridique", insérée dans AssuranceHabitation.tsx
 * ET AssuranceAuto.tsx le 2026-09-24, juste après le tableau de garanties
 * principal. Pas de page pilier dédiée (décision prise : la PJ se vend
 * surtout en option, pas comme un produit autonome).
 *
 * Sources (paraphrasées, jamais recopiées) :
 * - Code des assurances, article L127-1 (Légifrance) — définition légale
 * - Code des assurances, article L127-3 (Légifrance) — libre choix de
 *   l'avocat garanti par la loi
 *
 * Le prop `context` adapte les exemples de litiges à la page (habitation
 * ou auto) sans dupliquer le composant. Aucun plafond de garantie ni prix
 * inventé : la PJ étant vendue en option très variable d'un assureur à
 * l'autre, on ne publie pas de chiffre non vérifié.
 */

const SRC = {
  l1271: { label: "Code des assurances, article L127-1 (Légifrance)", href: "https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000006792738" },
  l1273: { label: "Code des assurances, article L127-3 (Légifrance)", href: "https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000006792825" },
} as const;

const H2 = "text-xl md:text-2xl font-bold text-foreground mb-3";
const P = "text-muted-foreground leading-relaxed mb-3";
const UL = "list-disc pl-5 space-y-2 text-muted-foreground leading-relaxed mb-3";

interface ProtectionJuridiqueSectionProps {
  context: "habitation" | "auto";
}

const EXAMPLES: Record<ProtectionJuridiqueSectionProps["context"], { title: string; items: string[] }> = {
  habitation: {
    title: "Exemples de litiges couverts pour un logement",
    items: [
      "Conflit de voisinage (nuisances, mitoyenneté, servitude)",
      "Litige avec un artisan après des travaux mal exécutés",
      "Désaccord en copropriété (charges, travaux votés en assemblée)",
      "Litige de consommation lié au logement (électroménager, énergie)",
    ],
  },
  auto: {
    title: "Exemples de litiges couverts pour un véhicule",
    items: [
      "Litige avec un garage après une réparation contestée",
      "Désaccord lors de l'achat ou la vente d'un véhicule",
      "Contestation d'une amende ou d'un retrait de points",
      "Recours contre un tiers après un accident non pris en charge par son assurance",
    ],
  },
};

const ProtectionJuridiqueSection = ({ context }: ProtectionJuridiqueSectionProps) => {
  const examples = EXAMPLES[context];
  return (
    <section className="max-w-4xl mx-auto mb-12" aria-labelledby={`pj-${context}-title`}>
      <h2 id={`pj-${context}-title`} className={H2}>Protection juridique : ce qu'elle couvre quand elle est incluse</h2>
      <p className={P}>
        La protection juridique est une garantie souvent proposée en option avec un contrat {context === "habitation" ? "habitation" : "auto"}. Elle prend en charge les frais de procédure et de défense en cas de litige avec un tiers, pour vous défendre ou vous représenter, ou pour obtenir une réparation amiable (Code des assurances, article L127-1).
      </p>
      <h3 className="text-base md:text-lg font-semibold text-foreground mt-6 mb-2">{examples.title}</h3>
      <ul className={UL}>
        {examples.items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
      <p className={P}>
        Point souvent méconnu : la loi garantit le libre choix de l'avocat. Si un avocat intervient pour vous défendre, vous êtes libre de le choisir vous-même — l'assureur ne peut vous en proposer un sans que vous le demandiez par écrit (Code des assurances, article L127-3).
      </p>
      <p className="text-xs text-muted-foreground mt-4 leading-relaxed">
        Sources :{" "}
        <a href={SRC.l1271.href} target="_blank" rel="noopener noreferrer" className="underline hover:text-primary">{SRC.l1271.label}</a>
        {" · "}
        <a href={SRC.l1273.href} target="_blank" rel="noopener noreferrer" className="underline hover:text-primary">{SRC.l1273.label}</a>
      </p>
    </section>
  );
};

export default ProtectionJuridiqueSection;
