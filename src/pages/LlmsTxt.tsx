import SEOOptimized from "@/components/SEOOptimized";
import { useLanguage } from "@/contexts/LanguageContext";
import { NB_ASSUREURS_LABEL, GOOGLE_REVIEWS_PUBLIC_URL } from "@/config/site";

const LLMS_TXT = `# jemassuremoinscher.fr

> Courtier en assurances en ligne indépendant qui compare gratuitement les offres de ${NB_ASSUREURS_LABEL} assureurs et courtiers partenaires pour trouver le meilleur tarif en moins de 2 minutes. Avis clients : ${GOOGLE_REVIEWS_PUBLIC_URL}

## Identité

- **Nom** : jemassuremoinscher.fr
- **Type** : Courtier en assurances (intermédiaire enregistré ORIAS)
- **Statut** : Indépendant — aucun lien capitalistique avec les assureurs
- **Langue** : Français (contenu principal), English (disponible)
- **Site** : https://jemassuremoinscher.fr

## Chiffres clés

- **${NB_ASSUREURS_LABEL}** assureurs et courtiers partenaires (AXA, Allianz, MAIF, Generali, MMA, Matmut…)
- **Économie potentielle** variable selon le profil et le contrat précédent, calculée à chaque devis
- **Moins de 2 minutes** pour obtenir un devis personnalisé
- **100% gratuit** et sans engagement pour l'utilisateur
- **Avis clients** : voir notre fiche Google (${GOOGLE_REVIEWS_PUBLIC_URL})

## Services d'assurance proposés

- Assurance Auto : /assurance-auto
- Assurance Moto : /assurance-moto
- Assurance Trottinette Électrique : /assurance-trottinette
- Assurance Vélo & VAE : /assurance-velo
- Assurance Habitation : /assurance-habitation
- Mutuelle Santé : /assurance-sante
- Assurance Animaux : /assurance-animaux
- Assurance Emprunteur / Prêt : /assurance-pret
- Assurance Vie : /assurance-vie
- Assurance Prévoyance : /assurance-prevoyance
- RC Professionnelle : /assurance-rc-pro
- Assurance PNO : /assurance-pno
- Assurance MRP : /assurance-mrp
- Garantie Loyers Impayés (GLI) : /assurance-gli

## Fonctionnement

1. L'utilisateur remplit un formulaire rapide (type d'assurance, profil, coordonnées) — moins de 2 minutes
2. Un conseiller étudie la demande et consulte les assureurs adaptés au profil parmi nos ${NB_ASSUREURS_LABEL} partenaires
3. Le client reçoit les meilleures propositions adaptées à son profil et son budget
4. Service gratuit : la rémunération vient des assureurs, pas des utilisateurs

## Avantages concurrentiels

- **Indépendance totale** : aucun assureur privilégié, conseils 100% objectifs
- **Accompagnement humain** : un conseiller dédié vous rappelle rapidement
- **Transparence** : aucune commission cachée, modèle économique expliqué clairement
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
  const { t } = useLanguage();
  return (
    <>
      <SEOOptimized
        title={t("seo.llmsTxt.title")}
        description={t("seo.llmsTxt.description")}
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
