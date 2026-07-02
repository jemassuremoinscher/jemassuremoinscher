import SEOCategoryPage from "@/components/seo/SEOCategoryPage";

const faqItems = [
  {
    question: "Puis-je changer d'assurance auto à tout moment ?",
    answer:
      "Oui, après un an de contrat, la loi Hamon vous permet de résilier à tout moment sans frais ni justification. Votre nouvel assureur s'occupe de toutes les démarches et la continuité de couverture est garantie.",
  },
  {
    question: "Comment est calculé le prix de mon assurance auto ?",
    answer:
      "Les assureurs croisent principalement votre coefficient bonus-malus, votre âge et ancienneté de permis, les caractéristiques du véhicule (puissance, valeur, âge), votre lieu de résidence, l'usage déclaré (trajets, kilométrage) et votre historique de sinistres sur les 5 dernières années.",
  },
  {
    question: "Quels documents faut-il pour souscrire une assurance auto ?",
    answer:
      "Trois documents suffisent généralement : votre permis de conduire, la carte grise du véhicule (certificat d'immatriculation) et votre relevé d'information, fourni par votre ancien assureur, qui retrace votre historique de conduite.",
  },
  {
    question: "Quelle est la différence entre le tiers et le tous risques ?",
    answer:
      "L'assurance au tiers couvre uniquement les dommages que vous causez aux autres. Le tous risques ajoute la couverture de votre propre véhicule, même en cas d'accident responsable. Le tiers convient aux véhicules de faible valeur, le tous risques aux véhicules récents.",
  },
  {
    question: "Un jeune conducteur peut-il éviter la surprime ?",
    answer:
      "La surprime légale (jusqu'à 100 % la première année) ne peut pas être supprimée, mais elle est réduite de moitié avec la conduite accompagnée et disparaît après 3 ans sans sinistre (2 ans en conduite accompagnée). Comparer reste le meilleur moyen d'en limiter l'impact, les écarts entre assureurs étant maximaux sur ce profil.",
  },
  {
    question: "Que faire si je suis résilié par mon assureur ?",
    answer:
      "Des assureurs spécialisés acceptent les profils résiliés, avec des primes majorées. En dernier recours, le Bureau Central de Tarification (BCT) peut légalement contraindre l'assureur de votre choix à vous couvrir en responsabilité civile.",
  },
  {
    question: "L'assurance au kilomètre, c'est intéressant pour qui ?",
    answer:
      "Pour les conducteurs qui roulent moins de 8 000 km par an environ. La prime est calculée sur le kilométrage réel déclaré ou mesuré, avec des économies de 20 à 30 % par rapport à une formule classique.",
  },
  {
    question: "Le comparateur est-il vraiment gratuit ?",
    answer:
      "Oui, à 100 %. Le service est gratuit et sans engagement pour vous : nous sommes rémunérés par les assureurs partenaires uniquement si vous souscrivez, sans aucune majoration de votre prime.",
  },
  {
    question: "Mon bonus est-il conservé si je change d'assureur ?",
    answer:
      "Oui, votre coefficient bonus-malus vous suit automatiquement : il figure sur votre relevé d'information et s'applique chez tout nouvel assureur. Changer de compagnie ne vous fait jamais perdre votre bonus.",
  },
];

const contentBlocks = [
  {
    title: "Pourquoi comparer les assurances auto avec notre outil ?",
    content: `
      <p>Comparer les offres d'assurance auto est la méthode la plus efficace pour <strong>réduire votre prime jusqu'à 40 %</strong>. Les tarifs varient considérablement d'un assureur à l'autre pour des garanties équivalentes, et seul un comparateur indépendant vous permet d'obtenir une vision claire du marché en quelques clics.</p>
      <p>Notre outil analyse en temps réel les offres de <strong>plus de 30 compagnies partenaires</strong> (Allianz, AXA, MAIF, Matmut, Direct Assurance…) pour vous présenter les contrats les plus compétitifs adaptés à votre profil. Contrairement aux devis obtenus un par un, vous gagnez un temps précieux et accédez à des tarifs négociés exclusifs.</p>
      <p>De plus, notre comparateur est <strong>100 % gratuit et sans engagement</strong>. Vous n'avez aucune obligation de souscrire et vos données restent confidentielles conformément au RGPD.</p>
    `,
  },
  {
    title: "Les critères qui font varier le prix de votre prime auto",
    content: `
      <p>Comprendre les facteurs de tarification vous aide à mieux négocier. Voici les principaux critères pris en compte par les assureurs :</p>
      <ul>
        <li><strong>Le coefficient bonus-malus :</strong> un bon historique de conduite peut réduire votre prime de plus de 50 %.</li>
        <li><strong>Le type de véhicule :</strong> puissance fiscale, valeur à neuf et coût des réparations influencent directement le tarif.</li>
        <li><strong>Votre lieu de résidence :</strong> les zones urbaines à fort taux de sinistralité sont plus chères que les zones rurales.</li>
        <li><strong>Votre âge et expérience :</strong> les jeunes conducteurs paient une surprime, qui diminue progressivement avec l'expérience.</li>
        <li><strong>L'usage du véhicule :</strong> un kilométrage élevé ou un usage professionnel augmentent le risque et donc la cotisation.</li>
      </ul>
      <p>En renseignant précisément ces informations dans notre comparateur, vous obtenez des devis au plus juste, sans mauvaise surprise à la souscription.</p>
    `,
  },
  {
    title: "Quelles garanties choisir pour faire des économies ?",
    content: `
      <p>Le choix de la formule est déterminant pour optimiser le rapport couverture/prix. Trois niveaux existent :</p>
      <ul>
        <li><strong>Au tiers (responsabilité civile) :</strong> l'option la moins chère, idéale pour les véhicules anciens de faible valeur. Elle couvre uniquement les dommages causés à autrui.</li>
        <li><strong>Au tiers étendu (intermédiaire) :</strong> ajoute des garanties vol, incendie et bris de glace. Un bon compromis pour les véhicules de valeur moyenne.</li>
        <li><strong>Tous risques :</strong> la couverture la plus complète, recommandée pour les véhicules récents ou de valeur importante.</li>
      </ul>
      <p>Pour réaliser des économies supplémentaires, pensez à <strong>ajuster votre franchise</strong> (une franchise plus élevée réduit la prime), à regrouper vos contrats chez le même assureur, et à opter pour le <strong>paiement annuel</strong> plutôt que mensuel.</p>
      <p>Notre comparateur vous permet de simuler chaque formule pour trouver le meilleur équilibre entre protection et budget.</p>
    `,
  },
  {
    title: "Combien coûte une assurance auto en 2026 ?",
    content: `
      <p>Le prix d'une assurance auto varie fortement selon votre profil, votre véhicule et votre formule. À titre indicatif, voici les fourchettes de primes annuelles constatées sur le marché français :</p>
      <div style="overflow-x:auto;-webkit-overflow-scrolling:touch;margin:1rem 0;">
        <table style="width:100%;border-collapse:collapse;min-width:560px;font-size:0.9em;">
          <thead>
            <tr style="background:hsl(var(--muted));">
              <th style="text-align:left;padding:0.6rem;border:1px solid hsl(var(--border));">Formule</th>
              <th style="text-align:left;padding:0.6rem;border:1px solid hsl(var(--border));">Profil expérimenté (bonus 50)</th>
              <th style="text-align:left;padding:0.6rem;border:1px solid hsl(var(--border));">Profil standard</th>
              <th style="text-align:left;padding:0.6rem;border:1px solid hsl(var(--border));">Jeune conducteur</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style="padding:0.6rem;border:1px solid hsl(var(--border));"><strong>Au tiers</strong></td>
              <td style="padding:0.6rem;border:1px solid hsl(var(--border));">350 € – 550 €/an</td>
              <td style="padding:0.6rem;border:1px solid hsl(var(--border));">450 € – 700 €/an</td>
              <td style="padding:0.6rem;border:1px solid hsl(var(--border));">900 € – 1 500 €/an</td>
            </tr>
            <tr>
              <td style="padding:0.6rem;border:1px solid hsl(var(--border));"><strong>Tiers étendu</strong></td>
              <td style="padding:0.6rem;border:1px solid hsl(var(--border));">450 € – 700 €/an</td>
              <td style="padding:0.6rem;border:1px solid hsl(var(--border));">550 € – 900 €/an</td>
              <td style="padding:0.6rem;border:1px solid hsl(var(--border));">1 100 € – 1 800 €/an</td>
            </tr>
            <tr>
              <td style="padding:0.6rem;border:1px solid hsl(var(--border));"><strong>Tous risques</strong></td>
              <td style="padding:0.6rem;border:1px solid hsl(var(--border));">600 € – 950 €/an</td>
              <td style="padding:0.6rem;border:1px solid hsl(var(--border));">700 € – 1 200 €/an</td>
              <td style="padding:0.6rem;border:1px solid hsl(var(--border));">1 400 € – 2 500 €/an</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p>Ces montants sont des ordres de grandeur : votre tarif réel dépend de votre <a href="/glossaire/bonus-malus">coefficient bonus-malus</a>, de votre lieu de résidence, de la puissance de votre véhicule et de votre historique de sinistres. La seule façon de connaître votre prix exact est de comparer des devis personnalisés.</p>
      <p>À noter : les écarts de tarifs entre assureurs pour un même profil dépassent régulièrement 40 %. Deux conducteurs identiques peuvent payer du simple au double selon la compagnie choisie — c'est précisément ce qui rend la comparaison indispensable.</p>
      <h2>Les écarts de prix selon les régions</h2>
      <p>La localisation joue un rôle majeur dans le calcul de votre prime. Les zones urbaines denses (Île-de-France, Provence-Alpes-Côte d'Azur, Rhône) affichent des primes supérieures de 20 à 40 % à la moyenne nationale, en raison d'une sinistralité et d'un risque de vol plus élevés. À l'inverse, les régions rurales (Bretagne, Pays de la Loire, Limousin) bénéficient des tarifs les plus bas de France.</p>
    `,
  },
  {
    title: "Assurance auto jeune conducteur : comment payer moins cher",
    content: `
      <p>Les conducteurs novices paient une surprime légale pouvant atteindre 100 % la première année. Elle diminue de moitié chaque année sans sinistre responsable, pour disparaître au bout de 3 ans (2 ans en cas de conduite accompagnée).</p>
      <p>Nos conseils concrets pour réduire la facture :</p>
      <ul>
        <li><strong>La conduite accompagnée (AAC) :</strong> elle réduit la surprime initiale de moitié (50 % au lieu de 100 %) et raccourcit sa durée. C'est le levier le plus puissant, à anticiper avant le permis.</li>
        <li><strong>Choisir une voiture d'occasion peu puissante :</strong> moins de 6 CV fiscaux, c'est une prime nettement réduite et une formule au tiers qui devient pertinente.</li>
        <li><strong>Être ajouté comme conducteur secondaire</strong> sur le contrat d'un parent pendant 1 à 2 ans permet de construire un historique avant de s'assurer seul — à condition de déclarer honnêtement qui est le conducteur principal.</li>
        <li><strong>L'assurance au kilomètre :</strong> si vous roulez moins de 8 000 km/an, les formules "pay as you drive" font économiser 20 à 30 %.</li>
      </ul>
      <p>Pour aller plus loin, consultez notre guide complet <a href="/assurance-auto-jeune-conducteur">assurance auto jeune conducteur</a>.</p>
    `,
  },
  {
    title: "Conducteur malussé ou résilié : des solutions existent",
    content: `
      <p>Un malus élevé ou une résiliation par votre assureur (pour sinistres répétés ou non-paiement) ne vous condamne pas à rester sans assurance — rouler non assuré est un délit passible de 3 750 € d'amende.</p>
      <p>Des assureurs spécialisés acceptent les profils malussés et résiliés, avec des primes majorées mais négociables. Notre comparateur inclut ces compagnies spécialisées. Et si aucun assureur ne vous accepte, le Bureau Central de Tarification (BCT) peut contraindre une compagnie de votre choix à vous couvrir au tiers : une procédure légale, gratuite, méconnue. Cette obligation légale de couverture repose sur la <a href="/glossaire/responsabilite-civile">responsabilité civile</a> minimale obligatoire.</p>
      <p>Après 2 ans sans sinistre responsable, votre coefficient revient automatiquement à 1 : comparer à ce moment précis permet de retrouver des tarifs standards.</p>
      <p>Voir aussi notre page dédiée <a href="/assurance-auto-malus">assurance auto malus</a>.</p>
    `,
  },
  {
    title: "Changer d'assurance auto : vos droits en 2026",
    content: `
      <p>Depuis la <a href="/glossaire/loi-hamon">loi Hamon</a>, vous pouvez résilier votre contrat auto à tout moment après un an d'engagement, sans frais ni justification. Mieux : c'est votre nouvel assureur qui gère toute la démarche de résiliation à votre place. Concrètement :</p>
      <ol>
        <li>Vous comparez et choisissez votre nouveau contrat.</li>
        <li>Le nouvel assureur résilie l'ancien contrat pour vous (mandat de résiliation).</li>
        <li>La continuité de couverture est garantie — aucun jour sans assurance.</li>
        <li>Le trop-perçu de votre ancienne prime vous est remboursé au prorata.</li>
      </ol>
      <p>Avant la première année, la résiliation reste possible dans certains cas : vente du véhicule, déménagement, changement de situation matrimoniale ou professionnelle, ou augmentation non justifiée du tarif par l'assureur.</p>
    `,
  },
  {
    title: "Comment bien comparer les assurances auto : notre méthode",
    content: `
      <p>Comparer ne se résume pas à trier par prix croissant. Voici les 5 points que nous vous recommandons de vérifier sur chaque devis :</p>
      <ol>
        <li><strong>Le montant des <a href="/glossaire/franchise">franchises</a> :</strong> une prime basse cache parfois une franchise de 800 € ou plus. Vérifiez la franchise dommages ET la franchise vol.</li>
        <li><strong>Les plafonds d'indemnisation :</strong> notamment pour la garantie du conducteur (visez 1 million d'euros minimum en cas d'invalidité).</li>
        <li><strong>Les exclusions de garantie :</strong> prêt de volant, conduite sur circuit, effets personnels dans le véhicule… lisez les conditions générales.</li>
        <li><strong>L'assistance :</strong> 0 km ou 50 km ? Véhicule de remplacement inclus ou non ? Ces détails comptent le jour de la panne.</li>
        <li><strong>La valeur d'indemnisation :</strong> valeur à neuf, valeur d'achat ou cote Argus ? Sur un véhicule récent, la différence se chiffre en milliers d'euros.</li>
      </ol>
      <p>Notre comparateur affiche ces critères côte à côte pour chaque offre, pas seulement le prix.</p>
    `,
  },
  {
    title: "Les erreurs à éviter au moment de souscrire",
    content: `
      <ul>
        <li><strong>Faire une fausse déclaration</strong> (kilométrage, conducteur principal, lieu de stationnement) : en cas de sinistre, c'est la nullité du contrat et zéro indemnisation.</li>
        <li><strong>Sur-assurer un véhicule ancien :</strong> au-delà de 8-10 ans, la formule tous risques est rarement rentable par rapport à la cote du véhicule.</li>
        <li><strong>Oublier de comparer à chaque échéance :</strong> les assureurs augmentent régulièrement les tarifs des clients fidèles. Comparer chaque année, même sans changer, vous replace en position de négocier.</li>
        <li><strong>Choisir uniquement au prix :</strong> une économie de 50 €/an qui cache une franchise doublée coûte cher au premier sinistre.</li>
      </ul>
    `,
  },
];

const CategorieAutoSEO = () => (
  <SEOCategoryPage
    metaTitle="Assurance Auto Moins Chère | Comparer en 2 min"
    metaDescription="Comparez les assurances auto et économisez jusqu'à 40 % sur votre prime. Devis gratuit et sans engagement en 2 minutes."
    canonicalPath="/assurance-auto-comparatif"
    h1="Assurance Auto : Comparez et payez moins cher"
    subtitle="Trouvez la meilleure assurance auto en comparant gratuitement plus de 30 offres en 2 minutes. Économisez jusqu'à 40 % sur votre prime annuelle sans sacrifier vos garanties."
    contentBlocks={contentBlocks}
    faqItems={faqItems}
    ctaLabel="Lancer le comparateur auto"
    ctaLink="/assurance-auto"
    serviceName="Comparateur d'assurance auto"
    serviceDescription="Service gratuit de comparaison d'assurances auto permettant d'économiser jusqu'à 40 % sur sa prime annuelle."
  />
);

export default CategorieAutoSEO;
