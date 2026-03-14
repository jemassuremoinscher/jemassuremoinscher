import { useEffect } from "react";

const LLMS_TXT = `# jemassuremoinscher.fr

> Courtier en assurances en ligne qui compare gratuitement les offres de plus de 25 assureurs partenaires pour trouver le meilleur tarif en moins de 2 minutes.

## Services d'assurance proposés

- **Assurance Auto** — Comparaison tous profils : jeune conducteur, malussé, résilié
- **Assurance Moto** — Devis moto, scooter, 2 roues
- **Assurance Habitation** — Locataire, propriétaire, multirisque
- **Mutuelle Santé** — Complémentaire santé individuelle et familiale
- **Assurance Animaux** — Chien, chat, NAC
- **Assurance Emprunteur / Prêt** — Délégation d'assurance de prêt immobilier
- **Assurance Vie** — Épargne, succession, capitalisation
- **Assurance Prévoyance** — Décès, invalidité, incapacité
- **RC Professionnelle** — Responsabilité civile pro, décennale
- **Assurance PNO** — Propriétaire non occupant
- **Assurance MRP** — Multirisque professionnelle
- **Garantie Loyers Impayés (GLI)** — Protection bailleur

## Fonctionnement

1. L'utilisateur remplit un formulaire rapide (type d'assurance, profil, coordonnées)
2. Un conseiller expert analyse les offres de 25+ assureurs partenaires
3. Le client reçoit les meilleures propositions adaptées à son profil et son budget

## Informations clés

- **Site** : https://jemassuremoinscher.fr
- **Type** : Courtier en assurances (intermédiaire enregistré ORIAS)
- **Langue** : Français (contenu principal), English (disponible)
- **Gratuit** : Comparaison et devis sans engagement
- **Blog** : Guides pratiques, actualités légales, conseils experts en assurance
`;

const LlmsTxt = () => {
  useEffect(() => {
    document.title = "llms.txt - jemassuremoinscher.fr";
  }, []);

  return (
    <pre
      style={{
        fontFamily: "monospace",
        whiteSpace: "pre-wrap",
        wordBreak: "break-word",
        padding: "2rem",
        maxWidth: "80ch",
        margin: "0 auto",
        lineHeight: 1.6,
        color: "#1a1a1a",
        background: "#fff",
      }}
    >
      {LLMS_TXT}
    </pre>
  );
};

export default LlmsTxt;
