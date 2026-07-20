import { Zap, ShieldCheck, Euro, AlertTriangle } from "lucide-react";
import SEOLandingPage from "@/components/landing/SEOLandingPage";

const AssuranceTrottinetteElectrique = () => {
  const advantages = [
    {
      icon: AlertTriangle,
      title: "Obligatoire depuis 2024",
      description:
        "Tout EDPM motorisé circulant sur la voie publique doit être assuré au minimum en responsabilité civile. Sans assurance, vous risquez une amende de 3 750 €.",
    },
    {
      icon: Euro,
      title: "Dès 2,90 €/mois",
      description:
        "Nos courtiers comparent 30+ assureurs pour trouver les formules trottinette les plus compétitives, avec ou sans vol et casse.",
    },
    {
      icon: ShieldCheck,
      title: "Garanties adaptées aux EDPM",
      description:
        "Responsabilité civile, protection corporelle du conducteur, vol, dommages matériels : choisissez la couverture qui vous convient.",
    },
  ];

  const faqs = [
    {
      question: "L'assurance trottinette électrique est-elle obligatoire en France en 2026 ?",
      answer:
        "Oui, depuis le décret du 23 octobre 2023, tous les Engins de Déplacement Personnel Motorisés (EDPM) — trottinettes électriques, gyroroues, hoverboards — doivent être assurés au minimum en responsabilité civile pour circuler sur la voie publique. Cette obligation s'applique même si vous roulez uniquement sur piste cyclable. Le défaut d'assurance est passible d'une amende pouvant atteindre 3 750 €.",
    },
    {
      question: "Combien coûte une assurance trottinette électrique ?",
      answer:
        "Le prix d'une assurance trottinette électrique varie de 2,90 € à 20 €/mois selon la formule choisie. Une formule de base (responsabilité civile seule) démarre à 2,90 €/mois (33 €/an). Une formule intermédiaire avec protection corporelle du conducteur revient à 5-7 €/mois. Les formules tous risques incluant vol et dommages matériels se situent entre 8 et 12 €/mois (jusqu'à 20 €/mois pour un usage livraison). Un courtier compare ces offres gratuitement pour vous.",
    },
    {
      question: "Que couvre l'assurance responsabilité civile pour une trottinette ?",
      answer:
        "La responsabilité civile (RC) couvre les dommages corporels et matériels que vous pourriez causer à un tiers en circulant avec votre trottinette électrique : piéton renversé, véhicule rayé, dégâts sur du mobilier urbain. Elle ne couvre pas vos propres blessures ni le vol de votre trottinette — pour cela, des garanties complémentaires (protection du conducteur, garantie vol) sont nécessaires.",
    },
    {
      question: "Faut-il un antivol homologué pour activer la garantie vol ?",
      answer:
        "Oui, la quasi-totalité des assureurs EDPM imposent un antivol agréé FUB (Fédération française des Usagers de la Bicyclette) ou Sold Secure Gold, fixé à un point fixe. La facture de l'antivol et celle de la trottinette doivent être conservées : sans elles, l'indemnisation peut être refusée ou minorée.",
    },
    {
      question: "Mon assurance habitation couvre-t-elle déjà ma trottinette ?",
      answer:
        "Certains contrats MRH récents (souscrits après 2022) incluent la RC EDPM dans la responsabilité civile vie privée — à vérifier impérativement par écrit auprès de votre assureur. Cette RC suffit pour respecter l'obligation légale, mais ne couvre ni le vol, ni la casse, ni vos propres blessures. Une assurance trottinette dédiée reste fortement recommandée.",
    },
    {
      question: "Suis-je couvert si je débride ma trottinette électrique ?",
      answer:
        "Non, jamais. Une trottinette débridée dépassant 25 km/h devient juridiquement un cyclomoteur : elle nécessite immatriculation, plaque, permis AM (BSR) et une assurance moto. Tout sinistre survenu avec un engin débridé entraîne la nullité de garantie et une responsabilité personnelle illimitée.",
    },
    {
      question: "Je suis livreur Uber Eats ou Deliveroo : ai-je besoin d'une assurance spécifique ?",
      answer:
        "Oui, impérativement. La livraison rémunérée est un usage professionnel exclu de 95 % des contrats trottinette grand public. Une RC pro livreur EDPM est obligatoire : voir notre page dédiée /assurance-trottinette-livreur. Sans elle, votre assureur peut refuser tout sinistre survenu en mission.",
    },
    {
      question: "Qu'est-ce que l'absence d'assurance pour un EDPM ?",
      answer:
        "Vous êtes considéré comme non assuré si aucun contrat en cours ne couvre votre responsabilité civile pour l'usage de votre trottinette électrique ou EDPM. Cela inclut : ne pas avoir souscrit d'assurance EDPM, avoir un contrat résilié pour non-paiement, compter sur une assurance habitation qui n'assure pas les accidents au guidon d'un EDPM (le cas le plus fréquent), ou circuler avec un usage exclu du contrat (livraison rémunérée, location, compétition). L'obligation pèse sur le propriétaire de l'engin, même s'il prête sa trottinette à quelqu'un d'autre.",
    },
    {
      question: "Quelles sont les conséquences si je roule sans assurance en trottinette électrique ?",
      answer:
        "Rouler sans assurance constitue un délit, pas une simple contravention. En cas de poursuite, vous encourez une amende pouvant aller jusqu'à 3 750 €, l'immobilisation ou la confiscation de votre trottinette, et une inscription au fichier AGIRA pendant 5 ans, qui rend les futures souscriptions d'assurance plus difficiles et plus chères. En cas d'accident, vous restez personnellement responsable de tous les dommages causés aux tiers : l'assureur de la victime peut saisir votre salaire et votre patrimoine, sans plafond, pour rembourser les préjudices. Le tribunal peut également prononcer la suspension ou l'annulation du permis de conduire.",
    },
  ];

  const contentBody = `
    <p>Depuis 2019, l'<strong>assurance trottinette électrique est obligatoire en France</strong> pour tout EDPM (Engin de Déplacement Personnel Motorisé) circulant sur la voie publique. Trottinettes, gyroroues, monoroues, hoverboards, skateboards électriques : tous sont soumis à l'obligation de souscrire au minimum une garantie responsabilité civile (article L211-1 du Code des assurances).</p>

    <p>Chez <strong>jemassuremoinscher.fr</strong>, courtier indépendant ORIAS spécialiste de la <strong>mobilité urbaine</strong>, nous comparons les 20 assureurs EDPM partenaires (Mobilease, Wakam, AssurOnline, April Mobilité, Cyclassur EDPM…) pour vous trouver la <strong>meilleure assurance trottinette au prix le plus bas</strong>. Devis en 2 minutes, attestation immédiate.</p>

    <h3>Pourquoi l'assurance trottinette est-elle devenue obligatoire ?</h3>
    <p>L'explosion du parc EDPM (plus de 2,5 millions d'engins en circulation en France en 2026) a entraîné une hausse vertigineuse des accidents : <strong>+38 % de tués en EDPM entre 2022 et 2025</strong> selon l'ONISR. Face à ce constat, le législateur a confirmé l'obligation d'assurance pour <strong>protéger les usagers et les tiers</strong>. Un accident impliquant un piéton renversé peut générer des dommages corporels chiffrés à plusieurs centaines de milliers d'euros — sans assurance, c'est votre patrimoine personnel qui est engagé à vie.</p>

    <h3>Les sanctions pour défaut d'assurance EDPM en 2026</h3>
    <p>Circuler sans assurance constitue un <strong>délit</strong>, pas une simple contravention. Seul le tribunal fixe le montant de l'amende en cas de poursuite.</p>
    <ul>
      <li><strong>Amende maximale</strong> : 3 750 € en cas de poursuite devant le tribunal.</li>
      <li><strong>Immobilisation et confiscation</strong> de l'engin par les forces de l'ordre.</li>
      <li><strong>Responsabilité personnelle illimitée</strong> en cas de dommages causés à un tiers — saisie sur salaire, biens, héritage possibles.</li>
      <li><strong>Inscription au fichier AGIRA</strong> pour 5 ans, rendant toute future souscription d'assurance (auto, habitation) difficile et plus chère.</li>
    </ul>

    <div class="bg-muted/40 border border-border rounded-xl p-5 md:p-6 my-8">
      <h3 class="text-lg font-bold text-foreground mb-4">Sources et références officielles</h3>
      <ul class="space-y-3 text-sm text-muted-foreground">
        <li>
          <strong>Sécurité routière</strong> — Préfecture de La Réunion, mis à jour le 21/01/2026 :
          « Circuler sans assurance constitue un délit passible d'une amende pouvant aller jusqu'à 3 750 euros. »
          <a href="https://www.reunion.gouv.fr/Actions-de-l-Etat/Securite-protection-des-personnes-et-des-biens/Securite-routiere/Trottinettes-electriques-monoroues-gyropodes-hoverboards-L-assurance-des-EDPM-est-obligatoire" target="_blank" rel="noopener noreferrer" class="text-primary hover:underline">Voir la source</a>
        </li>
        <li>
          <strong>Ministère de la Transition écologique</strong>, mis à jour le 06/02/2026 :
          « L'assurance est obligatoire pour les utilisateurs des EDP motorisés. »
          <a href="https://www.ecologie.gouv.fr/politiques-publiques/trottinettes-electriques-edpm-reglementation-vigueur" target="_blank" rel="noopener noreferrer" class="text-primary hover:underline">Voir la source</a>
        </li>
        <li>
          <strong>Code des assurances, article L211-1</strong> : obligation d'assurance responsabilité civile pour tout véhicule terrestre à moteur.
        </li>
        <li>
          <strong>Décret n° 2019-1082 du 23 octobre 2019</strong> : définition et réglementation des engins de déplacement personnel motorisés (EDPM).
        </li>
      </ul>
    </div>

    <h3>Les différentes formules d'assurance trottinette</h3>
    <p>Trois niveaux de couverture existent pour votre trottinette électrique :</p>
    <ul>
      <li><strong>Formule Essentielle</strong> (dès 2,90 €/mois — 33 €/an) : responsabilité civile obligatoire uniquement. Idéale pour un usage occasionnel ou un engin de faible valeur (&lt; 500 €).</li>
      <li><strong>Formule Confort</strong> (5 à 7 €/mois) : RC + individuelle conducteur (vos blessures) + assistance dépannage 24/7. Recommandée pour les trajets quotidiens domicile-travail.</li>
      <li><strong>Formule Tous Risques</strong> (8 à 12 €/mois) : couverture complète incluant vol, casse, dommages matériels, bris d'équipement et protection juridique. Conseillée pour les trottinettes haut de gamme (Dualtron, Speedway, Apollo > 800 €).</li>
    </ul>

    <h3>Les garanties à examiner à la loupe</h3>
    <p>Au-delà du prix, vérifiez systématiquement les points suivants :</p>
    <ul>
      <li><strong>Plafond d'indemnisation vol</strong> : à valeur d'achat (les 2 premières années) ou à valeur d'usage (vétusté de 15-25 %/an).</li>
      <li><strong>Franchise vol/casse</strong> : entre 50 € et 200 €. Une franchise basse fait grimper la prime mensuelle.</li>
      <li><strong>Conditions antivol</strong> : modèle exigé (FUB, Sold Secure Gold), fixation obligatoire à un point fixe.</li>
      <li><strong>Délai de carence vol</strong> : souvent 7 à 15 jours après souscription pendant lesquels le vol n'est pas couvert.</li>
      <li><strong>Couverture hors France</strong> : Europe géographique souvent incluse, à vérifier si vous voyagez avec.</li>
      <li><strong>Exclusions usage</strong> : compétition, location, livraison rémunérée systématiquement exclues du grand public.</li>
    </ul>

    <h3>Les règles de circulation des EDPM en 2026</h3>
    <p>En plus de l'assurance obligatoire, les conducteurs de trottinettes électriques doivent respecter plusieurs règles : <strong>vitesse maximale de 25 km/h</strong>, âge minimum 14 ans, interdiction de rouler sur les trottoirs (sauf autorisation municipale), port du casque recommandé (obligatoire hors agglomération), gilet rétro-réfléchissant de nuit, interdiction de transporter un passager, interdiction de circuler avec écouteurs ou téléphone à la main. Le non-respect de ces règles peut entraîner des amendes de 35 € à 1 500 €.</p>

    <h3>Cas particuliers : livreurs, étudiants, enfants</h3>
    <p>Trois profils nécessitent une couverture spécifique : les <strong>livreurs Uber Eats / Deliveroo</strong> (RC pro obligatoire, voir notre page <a href="/assurance-trottinette-livreur">assurance trottinette livreur</a>), les <strong>étudiants</strong> (formules courtes ou suspendables pendant les vacances), et les <strong>mineurs de 14 à 17 ans</strong> (la souscription doit être faite par le représentant légal, avec mention de l'âge du conducteur principal).</p>

    <p>Ne prenez pas le risque de rouler sans assurance. <strong>Comparez gratuitement les offres</strong> et trouvez la couverture adaptée à votre trottinette électrique en quelques clics.</p>

    <p><em>Pour comprendre en détail la réglementation EDPM, les sanctions et l'amende de 3 750 € prévue par la loi, consultez notre article dédié : <a href="/blog/trottinettes-electriques-edpm-assurance-obligatoire">Trottinettes électriques et EDPM : loi, sanctions et amendes 2026</a>.</em></p>
  `;


  return (
    <SEOLandingPage
      title="Assurance Trottinette Électrique 2026 : Devis dès 2,90€/mois"
      metaDescription="Comparez 30+ assureurs et obtenez votre devis d'assurance trottinette électrique en 2 min. Formules dès 2,90 €/mois, RC, vol et casse."
      keyword="assurance trottinette électrique devis"
      keywords="devis assurance trottinette électrique, comparateur assurance EDPM, prix assurance trottinette, assurance gyroroue pas cher"
      canonical="https://www.jemassuremoinscher.fr/assurance-trottinette-electrique"
      heroIcon={Zap}
      heroTitle="Assurance Trottinette Électrique : Comparez & Économisez dès 2,90 €/mois"
      heroSubtitle="Obtenez votre devis en 2 minutes. Nos courtiers comparent 30+ assureurs pour dénicher la meilleure formule EDPM adaptée à votre usage."
      ctaLabel="Comparer les offres gratuitement"
      ctaLink="/comparateur"
      contentTitle="Tout savoir sur l'assurance trottinette électrique obligatoire"
      contentBody={contentBody}
      advantages={advantages}
      faqTitle="FAQ – Assurance Trottinette Électrique"
      faqs={faqs}
      breadcrumbs={[
        { name: "Accueil", url: "https://www.jemassuremoinscher.fr/" },
        { name: "Assurance Trottinette Électrique", url: "https://www.jemassuremoinscher.fr/assurance-trottinette-electrique" },
      ]}
      bottomCtaTitle="Roulez l'esprit tranquille dès aujourd'hui"
      bottomCtaDescription="Comparez les assurances trottinette électrique en 2 minutes et trouvez la formule adaptée à votre usage."
      bottomCtaLabel="Obtenir mon devis gratuit"
      bottomCtaLink="/comparateur"
    />
  );
};

export default AssuranceTrottinetteElectrique;
