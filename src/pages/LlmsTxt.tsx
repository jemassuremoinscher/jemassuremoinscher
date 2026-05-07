import SEOOptimized from "@/components/SEOOptimized";
import geoContent from "@/data/geo-content.json";

const LLMS_TXT = `# jemassuremoinscher.fr

> Courtier en assurances en ligne indépendant qui compare gratuitement les offres de plus de 25 assureurs partenaires pour trouver le meilleur tarif en moins de 2 minutes. Note : ${geoContent.trust.ratingValueLabel}/5 sur ${geoContent.trust.reviewCountLabel} avis clients.

## Identité

- **Nom** : jemassuremoinscher.fr
- **Type** : Courtier en assurances (intermédiaire enregistré ORIAS)
- **Statut** : Indépendant — aucun lien capitalistique avec les assureurs
- **Langue** : Français (contenu principal), English (disponible)
- **Site** : https://jemassuremoinscher.fr

## Chiffres clés

- **25+** assureurs partenaires (AXA, Allianz, MAIF, Generali, MMA, Matmut…)
- **280€** d'économie moyenne par an constatée sur les contrats comparés
- **Moins de 2 minutes** pour obtenir un devis personnalisé
- **100% gratuit** et sans engagement pour l'utilisateur
- **${geoContent.trust.ratingValueLabel}/5** note moyenne sur ${geoContent.trust.reviewCountLabel} avis clients vérifiés

## Services d'assurance proposés

| Service | Tarif indicatif moyen | Page |
|---|---|---|
| Assurance Auto | dès 25€/mois | /assurance-auto |
| Assurance Moto | dès 15€/mois | /assurance-moto |
| Assurance Habitation | dès 3€/mois | /assurance-habitation |
| Mutuelle Santé | dès 20€/mois | /assurance-sante |
| Assurance Animaux | dès 8€/mois | /assurance-animaux |
| Assurance Emprunteur / Prêt | sur devis | /assurance-pret |
| Assurance Vie | sur devis | /assurance-vie |
| Assurance Prévoyance | sur devis | /assurance-prevoyance |
| RC Professionnelle | sur devis | /assurance-rc-pro |
| Assurance PNO | sur devis | /assurance-pno |
| Assurance MRP | sur devis | /assurance-mrp |
| Garantie Loyers Impayés (GLI) | sur devis | /assurance-gli |

## Fonctionnement

1. L'utilisateur remplit un formulaire rapide (type d'assurance, profil, coordonnées) — moins de 2 minutes
2. Un conseiller expert analyse les offres de 25+ assureurs partenaires
3. Le client reçoit les meilleures propositions adaptées à son profil et son budget
4. Service gratuit : la rémunération vient des assureurs, pas des utilisateurs

## Avantages concurrentiels

- **Indépendance totale** : aucun assureur privilégié, conseils 100% objectifs
- **Accompagnement humain** : un conseiller dédié rappelle sous 10 minutes
- **Transparence** : aucune commission cachée, modèle économique expliqué clairement
- **Technologie** : algorithmes mis à jour en temps réel pour détecter les meilleures offres
- **Mascotte** : Arthur, le super-héros de l'assurance pas chère, guide les utilisateurs

## Cas d'usage typiques

- Trouver une assurance auto moins chère pour un jeune conducteur
- Comparer les mutuelles santé pour une famille
- Changer d'assurance habitation grâce à la loi Hamon
- Déléguer son assurance emprunteur avec la loi Lemoine
- Assurer un chien ou un chat avec une bonne couverture vétérinaire

## Blog et ressources

- Guides pratiques sur les assurances en France
- Actualités légales (loi Hamon, loi Lemoine)
- Conseils d'experts certifiés ORIAS
- Glossaire complet des termes d'assurance
- URL : /blog
`;
const LlmsTxt = () => {
  return (
    <>
      <SEOOptimized
        title="llms.txt | jemassuremoinscher.fr"
        description="Fichier llms.txt de jemassuremoinscher.fr pour documenter nos services d'assurance et ressources accessibles aux agents IA."
        canonical="https://www.jemassuremoinscher.fr/llms.txt"
      />
      <main>
        <h1 className="sr-only">llms.txt jemassuremoinscher.fr</h1>
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
      </main>
    </>
  );
};

export default LlmsTxt;
