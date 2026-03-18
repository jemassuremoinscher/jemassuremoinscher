export interface NicheQuestion {
  id: string;
  label: string;
  yesText: string;
  noText: string;
}

export interface SolutionRow {
  formule: string;
  couverture: string;
  franchise: string;
  prixIndicatif: string;
  ideal: string;
}

export interface ExpertiseBlock {
  title: string;
  content: string;
}

export interface NicheData {
  slug: string;
  title: string;
  metaDescription: string;
  keyword: string;
  heroTitle: string;
  heroSubtitle: string;
  quickCheckQuestions: NicheQuestion[];
  eligibleMessage: string;
  notEligibleMessage: string;
  expertiseBlocks: ExpertiseBlock[];
  solutions: SolutionRow[];
  surchargeCoefficient: number;
  surchargeLabel: string;
  surchargeExplanation: string;
  expertContent: string;
  faqs: { question: string; answer: string }[];
}

export const nicheProfiles: NicheData[] = [
  {
    slug: "resilie-non-paiement",
    title: "Assurance Auto Résilié Non-Paiement — Solutions 2026",
    metaDescription: "Résilié pour non-paiement ? Retrouvez un contrat auto adapté. Nos courtiers spécialisés négocient des tarifs jusqu'à 30% moins chers que le marché.",
    keyword: "assurance auto résilié non-paiement",
    heroTitle: "Assurance Auto après Résiliation pour Non-Paiement : Retrouvez un contrat aujourd'hui",
    heroSubtitle: "Une résiliation ne signifie pas la fin. 87% de nos clients résiliés retrouvent une couverture sous 48h grâce à nos partenaires spécialisés.",
    quickCheckQuestions: [
      { id: "dette", label: "Votre dette auprès de l'ancien assureur est-elle soldée ?", yesText: "Soldée", noText: "En cours" },
      { id: "coupure", label: "Moins de 2 mois sans assurance ?", yesText: "Oui", noText: "Non" },
      { id: "permis", label: "Votre permis est-il valide ?", yesText: "Valide", noText: "Suspendu" },
    ],
    eligibleMessage: "Profil éligible à nos solutions partenaires. Tarif estimé sous 48h.",
    notEligibleMessage: "Votre profil nécessite une étude personnalisée. Un courtier vous rappelle sous 24h.",
    expertiseBlocks: [
      {
        title: "Le saviez-vous ? Le fichier AGIRA",
        content: "Après une résiliation pour non-paiement, votre nom est inscrit au fichier AGIRA pour une durée de 2 ans. Ce fichier est consulté par tous les assureurs avant d'accepter un nouveau contrat. La bonne nouvelle : l'inscription n'est pas un refus automatique. Les assureurs spécialisés (marché du risque aggravé) acceptent ces profils, avec une majoration encadrée par le Code des assurances."
      },
      {
        title: "Suspension vs. Annulation : la distinction qui change tout",
        content: "Une suspension de contrat pour non-paiement intervient 30 jours après la mise en demeure. L'annulation définitive survient 10 jours plus tard. Si vous régularisez pendant la période de suspension, vous conservez votre contrat et votre historique. Après l'annulation, vous repartez de zéro avec inscription AGIRA. Ce timing est décisif — chaque jour compte."
      },
      {
        title: "Le hack courtier : la stratégie du tiers temporaire",
        content: "Souscrire une garantie au tiers basique pendant 12 mois permet de reconstituer un historique d'assuré sans sinistre. Au bout d'un an, vous redevenez un profil standard et pouvez négocier un tarif tous risques compétitif. Coût de la stratégie : environ 800-1200€/an en tiers contre 2000€+ en tous risques directement. Économie nette sur 2 ans : 30 à 40%. <a href='/outils/calculateur-bonus-malus' class='text-primary underline font-semibold'>Vérifiez l'impact sur votre bonus avec notre calculateur →</a>"
      }
    ],
    solutions: [
      { formule: "Tiers basique", couverture: "RC + Défense recours", franchise: "Aucune", prixIndicatif: "65-90€/mois", ideal: "Reprise d'historique" },
      { formule: "Tiers étendu", couverture: "RC + Vol + Incendie + Bris de glace", franchise: "500-800€", prixIndicatif: "90-130€/mois", ideal: "Véhicule de + de 5 ans" },
      { formule: "Tous risques adapté", couverture: "Couverture complète + assistance", franchise: "800-1200€", prixIndicatif: "130-200€/mois", ideal: "Véhicule récent, dette soldée" },
    ],
    surchargeCoefficient: 1.5,
    surchargeLabel: "Majoration non-paiement",
    surchargeExplanation: "Le marché applique en moyenne une surprime de +50% après une résiliation pour non-paiement. Cette majoration diminue progressivement sur 2 ans si aucun nouvel incident n'est enregistré.",
    expertContent: "",
    faqs: [
      { question: "Combien de temps reste-t-on fiché AGIRA après un non-paiement ?", answer: "L'inscription au fichier AGIRA dure 2 ans à compter de la date de résiliation. Passé ce délai, votre profil redevient standard et les assureurs ne peuvent plus consulter cet historique. Pendant ces 2 ans, des assureurs spécialisés vous couvrent avec une majoration dégressive." },
      { question: "Peut-on contester une résiliation pour non-paiement ?", answer: "Oui, si la mise en demeure n'a pas été envoyée en recommandé avec AR, ou si le délai de 30 jours n'a pas été respecté, la résiliation est juridiquement contestable. Vérifiez les dates sur votre courrier. Nous avons vu des cas où la résiliation a été annulée pour vice de procédure." },
      { question: "Que se passe-t-il si je roule sans assurance pendant la recherche ?", answer: "Rouler sans assurance est un délit (article L324-2 du Code de la route). Sanction : amende de 3 750€, suspension de permis, confiscation du véhicule. En cas d'accident, vous êtes personnellement responsable de tous les dommages. Ne prenez jamais ce risque — une couverture tiers temporaire peut être souscrite en 24h." },
      { question: "Comment réduire la surprime après une résiliation ?", answer: "Trois leviers concrets : 1) Soldez votre dette auprès de l'ancien assureur (preuve de paiement à fournir). 2) Souscrivez au tiers pendant 12 mois sans sinistre. 3) Passez par un courtier spécialisé qui négocie des tarifs 20 à 30% inférieurs au marché direct." },
    ]
  },
  {
    slug: "retrait-permis",
    title: "Assurance Auto après Retrait de Permis — Alcool, Stups | 2026",
    metaDescription: "Retrait de permis pour alcool ou stupéfiants ? Solutions d'assurance auto adaptées. Comparez les offres spécialisées sans jugement.",
    keyword: "assurance auto retrait permis alcool",
    heroTitle: "Assurance Auto après Retrait de Permis : Solutions concrètes pour reprendre la route",
    heroSubtitle: "Un retrait de permis ne ferme pas toutes les portes. Nos courtiers partenaires travaillent avec des assureurs qui acceptent ces profils depuis plus de 15 ans.",
    quickCheckQuestions: [
      { id: "type", label: "Votre permis a-t-il été suspendu (temporaire) ou annulé (définitif) ?", yesText: "Suspendu", noText: "Annulé" },
      { id: "recupere", label: "Avez-vous récupéré votre permis ?", yesText: "Oui", noText: "Pas encore" },
      { id: "ethylotest", label: "Disposez-vous d'un éthylotest anti-démarrage (EAD) si imposé ?", yesText: "Oui / Non requis", noText: "Non" },
    ],
    eligibleMessage: "Profil éligible. Nous travaillons avec 8 assureurs spécialisés dans les risques aggravés.",
    notEligibleMessage: "Votre situation nécessite une analyse approfondie. Un courtier spécialisé vous contacte sous 24h.",
    expertiseBlocks: [
      {
        title: "Suspension vs. Annulation : ce que l'assureur voit vraiment",
        content: "Une suspension de permis (administrative ou judiciaire) est temporaire : 6 mois à 3 ans. Vous conservez votre permis d'origine. Une annulation impose de repasser l'examen après un délai fixé par le juge. Pour l'assureur, la différence est majeure : une suspension avec récupération automatique entraîne une surprime de +100% à +150%. Une annulation avec repassage du permis peut aller jusqu'à +200% à +300%. C'est cette distinction technique qui détermine votre tarif."
      },
      {
        title: "Le saviez-vous ? Le relevé d'informations ne ment pas",
        content: "Votre relevé d'informations (RI) mentionne le retrait de permis pendant 5 ans. Inutile de le dissimuler : tous les assureurs le demandent et le vérifient. En revanche, le RI enregistre aussi vos années sans sinistre après l'incident. Chaque année propre réduit mécaniquement la surprime. C'est un document à valoriser, pas à redouter."
      },
      {
        title: "Le hack courtier : l'EAD comme levier de négociation",
        content: "Si le tribunal vous impose un éthylotest anti-démarrage (EAD), présentez-le comme un argument auprès de l'assureur. L'EAD réduit statistiquement le risque de récidive de 75%. Certains assureurs accordent une réduction de 10 à 15% sur la surprime pour les véhicules équipés. <a href='/outils/calculateur-bonus-malus' class='text-primary underline font-semibold'>Calculez votre coefficient bonus-malus actuel →</a>"
      }
    ],
    solutions: [
      { formule: "Tiers obligatoire", couverture: "RC seule", franchise: "Aucune", prixIndicatif: "120-180€/mois", ideal: "Véhicule ancien, budget serré" },
      { formule: "Tiers + Vol/Incendie", couverture: "RC + Vol + Incendie", franchise: "600-1000€", prixIndicatif: "160-230€/mois", ideal: "Véhicule de valeur moyenne" },
      { formule: "Tous risques majoré", couverture: "Couverture complète", franchise: "1000-1500€", prixIndicatif: "230-350€/mois", ideal: "Permis récupéré, 1+ an sans sinistre" },
    ],
    surchargeCoefficient: 2.5,
    surchargeLabel: "Majoration retrait de permis (alcool/stups)",
    surchargeExplanation: "La surprime moyenne constatée est de +150% pour une suspension et +200% pour une annulation. Elle diminue de 20 à 30% par année sans incident. Nos courtiers parviennent à réduire ces taux de 20 à 30% via des contrats spécialisés.",
    expertContent: "",
    faqs: [
      { question: "Peut-on s'assurer pendant une suspension de permis ?", answer: "Oui. Vous pouvez assurer votre véhicule même si votre permis est suspendu (le véhicule reste votre propriété). En revanche, vous ne pouvez pas le conduire. L'assurance couvre le vol, l'incendie et les dommages stationnement. Nommer un conducteur secondaire sur le contrat permet au véhicule de continuer à rouler." },
      { question: "L'assureur peut-il refuser de m'assurer après un retrait de permis ?", answer: "Oui, un assureur classique peut refuser. Mais le Bureau Central de Tarification (BCT) peut être saisi si aucun assureur ne vous accepte. Le BCT impose alors à un assureur de vous couvrir au tarif qu'il fixe. En pratique, les courtiers spécialisés trouvent une solution avant d'en arriver là." },
      { question: "Combien de temps dure la surprime après un retrait de permis ?", answer: "La surprime est appliquée pendant 2 à 5 ans selon la gravité de l'infraction. Elle diminue progressivement chaque année sans nouveau sinistre ni infraction. Après 3 ans propres, la plupart des assureurs reviennent à un tarif quasi-normal." },
    ]
  },
  {
    slug: "frequence-sinistres",
    title: "Assurance Auto Multi-Sinistré (3+ sinistres) — Solutions 2026",
    metaDescription: "3 sinistres ou plus en 2 ans ? Des solutions d'assurance existent. Comparez les offres pour profils à sinistralité élevée.",
    keyword: "assurance auto multi sinistré fréquence sinistres",
    heroTitle: "Assurance Auto après Plusieurs Sinistres : les solutions pour repartir sereinement",
    heroSubtitle: "Un historique chargé complique la recherche, mais ne l'empêche pas. Nous travaillons avec des assureurs qui évaluent votre profil au-delà des chiffres bruts.",
    quickCheckQuestions: [
      { id: "nombre", label: "Avez-vous eu 3 sinistres ou plus sur les 24 derniers mois ?", yesText: "Oui", noText: "Moins de 3" },
      { id: "responsabilite", label: "Étiez-vous responsable à plus de 50% dans la majorité des cas ?", yesText: "Oui", noText: "Non" },
      { id: "resilie", label: "Avez-vous été résilié par votre assureur pour sinistralité ?", yesText: "Oui", noText: "Non" },
    ],
    eligibleMessage: "Nous avons des solutions adaptées à votre profil. Devis personnalisé sous 48h.",
    notEligibleMessage: "Votre profil est complexe mais pas impossible. Un expert vous contacte pour une étude approfondie.",
    expertiseBlocks: [
      {
        title: "Le saviez-vous ? La règle des 3 sinistres responsables",
        content: "La plupart des assureurs déclenchent une résiliation à partir du 3ème sinistre responsable en 24 mois (certains dès le 2ème en 12 mois). Mais attention : un sinistre où vous êtes responsable à 0% (attesté par le constat amiable ou le rapport d'expert) ne doit pas compter. Vérifiez votre relevé d'informations et contestez toute erreur de responsabilité via la convention IRSA."
      },
      {
        title: "Idée reçue : « Mon malus est bloqué à 3.50, c'est fini pour moi »",
        content: "Faux dans 40% des cas. Le coefficient maximum de 3.50 est un plafond légal, pas un verdict définitif. Chaque année sans sinistre responsable réduit votre CRM de 5%. En 13 ans sans sinistre, vous revenez à 1.00. Mais surtout : certains assureurs spécialisés pondèrent le CRM avec d'autres critères (type de véhicule, kilométrage, usage). Un CRM de 2.00 sur un véhicule modeste peut coûter moins cher qu'un CRM de 1.00 sur un SUV."
      },
      {
        title: "Le hack courtier : le relevé d'informations détaillé",
        content: "Demandez à votre ancien assureur un relevé d'informations détaillé (pas juste le standard). Ce document montre le contexte de chaque sinistre : conditions météo, stationnement, tiers impliqué. Un courtier peut s'en servir pour argumenter auprès d'un nouvel assureur que votre profil est moins risqué que le CRM ne le suggère. <a href='/outils/calculateur-bonus-malus' class='text-primary underline font-semibold'>Calculez votre CRM exact →</a>"
      }
    ],
    solutions: [
      { formule: "Tiers restrictif", couverture: "RC uniquement", franchise: "Aucune", prixIndicatif: "80-120€/mois", ideal: "Véhicule > 10 ans" },
      { formule: "Tiers + BDG", couverture: "RC + Bris de glace", franchise: "400€", prixIndicatif: "100-150€/mois", ideal: "Usage quotidien" },
      { formule: "Tous risques haute franchise", couverture: "Couverture complète", franchise: "1000-2000€", prixIndicatif: "150-250€/mois", ideal: "Véhicule < 5 ans" },
    ],
    surchargeCoefficient: 2.0,
    surchargeLabel: "Majoration multi-sinistres (CRM élevé)",
    surchargeExplanation: "Avec un CRM supérieur à 2.00, la surprime moyenne constatée est de +100%. Chaque année sans sinistre la réduit de 5%. Un courtier spécialisé obtient des tarifs 20 à 30% inférieurs au marché direct.",
    expertContent: "",
    faqs: [
      { question: "Mon assureur peut-il me résilier pour trop de sinistres même si je ne suis pas responsable ?", answer: "En théorie, un assureur ne devrait pas résilier pour des sinistres non responsables. En pratique, certains contrats prévoient une clause de résiliation pour 'fréquence anormale de sinistres' indépendamment de la responsabilité. Vérifiez vos conditions générales et contestez si la clause est abusive." },
      { question: "Comment faire baisser mon CRM rapidement ?", answer: "Pas de raccourci : chaque année sans sinistre responsable réduit le CRM de 5%. Mais deux leviers accélèrent le processus : 1) Passer à une conduite à faible kilométrage (assurance au km). 2) Installer un boîtier télématique qui prouve votre prudence — certains assureurs accordent un bonus anticipé." },
      { question: "Existe-t-il des assureurs qui ne regardent pas le CRM ?", answer: "Aucun assureur sérieux n'ignore le CRM. Mais les assureurs spécialisés (marché du risque aggravé) l'évaluent différemment : ils croisent le CRM avec votre profil global (âge, véhicule, usage). Un CRM de 2.50 sur un véhicule modeste avec 5 000 km/an coûtera moins cher qu'un CRM de 1.50 sur un véhicule puissant avec 25 000 km/an." },
    ]
  },
  {
    slug: "sans-antecedents",
    title: "Assurance Auto sans Antécédents — Primo-Assuré 2026",
    metaDescription: "Pas d'historique d'assurance auto ? Trouvez un contrat adapté aux profils sans antécédents. Tarifs compétitifs pour primo-assurés.",
    keyword: "assurance auto sans antécédents primo-assuré",
    heroTitle: "Assurance Auto sans Antécédents : obtenez votre premier contrat au juste prix",
    heroSubtitle: "Pas d'historique ≠ mauvais conducteur. 72% de nos primo-assurés obtiennent un tarif inférieur à la moyenne du marché grâce à notre réseau de courtiers.",
    quickCheckQuestions: [
      { id: "permis", label: "Avez-vous le permis depuis plus de 3 ans ?", yesText: "Oui", noText: "Moins de 3 ans" },
      { id: "vehicule", label: "Le véhicule fait-il moins de 6 CV fiscaux ?", yesText: "Oui", noText: "Plus de 6 CV" },
      { id: "conducteur", label: "Serez-vous le conducteur principal ?", yesText: "Oui", noText: "Non" },
    ],
    eligibleMessage: "Profil standard primo-assuré. Tarifs compétitifs disponibles chez nos partenaires.",
    notEligibleMessage: "Votre profil nécessite une étude spécifique. Un courtier vous propose un devis adapté sous 48h.",
    expertiseBlocks: [
      {
        title: "Le saviez-vous ? CRM neutre ≠ CRM pénalisant",
        content: "En tant que primo-assuré, vous démarrez avec un CRM de 1.00 (coefficient neutre). Ce n'est pas un malus. Mais les assureurs appliquent souvent une 'surprime nouveau conducteur' de 20 à 40% pendant les 2-3 premières années. Cette surprime est distincte du bonus-malus et disparaît avec l'ancienneté, même sans sinistre. Certains assureurs en ligne la suppriment dès la 2ème année."
      },
      {
        title: "Idée reçue : « Je n'ai pas de relevé d'informations, c'est un problème »",
        content: "Faux. Ne pas avoir de relevé d'informations signifie que vous n'avez jamais été assuré en tant que conducteur principal — c'est un profil neutre, pas négatif. L'assureur ne peut pas vous facturer un malus inexistant. Si un courtier ou un assureur vous demande un RI que vous n'avez pas, une attestation sur l'honneur de non-assurance antérieure suffit dans la plupart des cas."
      },
      {
        title: "Le hack courtier : la conduite accompagnée comme atout",
        content: "Si vous avez obtenu votre permis via la conduite accompagnée (AAC), vous bénéficiez d'une réduction de surprime jeune conducteur de moitié (12.5% au lieu de 25% la première année). Mentionnez-le systématiquement — c'est un argument que certains comparateurs en ligne ne prennent pas en compte, mais qu'un courtier valorise toujours. <a href='/outils/calculateur-bonus-malus' class='text-primary underline font-semibold'>Simulez votre futur bonus-malus →</a>"
      }
    ],
    solutions: [
      { formule: "Tiers économique", couverture: "RC + Défense recours", franchise: "Aucune", prixIndicatif: "40-65€/mois", ideal: "Petit budget, véhicule ancien" },
      { formule: "Tiers confort", couverture: "RC + Vol + BDG + Assistance", franchise: "300-500€", prixIndicatif: "55-85€/mois", ideal: "Véhicule d'occasion récent" },
      { formule: "Tous risques primo", couverture: "Couverture complète", franchise: "500-800€", prixIndicatif: "75-120€/mois", ideal: "Véhicule neuf ou LOA" },
    ],
    surchargeCoefficient: 1.25,
    surchargeLabel: "Surprime primo-assuré",
    surchargeExplanation: "Les primo-assurés subissent en moyenne une surprime de +25% (hors surprime jeune conducteur). Elle diminue de 5% par an sans sinistre. En 5 ans propres, vous atteignez un bonus de 0.76 — soit 24% de réduction.",
    expertContent: "",
    faqs: [
      { question: "Quelle est la différence entre primo-assuré et jeune conducteur ?", answer: "Un jeune conducteur a le permis depuis moins de 3 ans. Un primo-assuré n'a jamais été conducteur principal sur un contrat auto, quel que soit son âge. Vous pouvez avoir 45 ans et être primo-assuré si vous n'avez jamais eu de voiture à votre nom. Les surprimes sont différentes : +25% pour le primo-assuré, +25% supplémentaire pour le jeune conducteur (cumulable)." },
      { question: "Puis-je utiliser le bonus de mes parents ?", answer: "Non, le bonus-malus est personnel et non transférable. En revanche, si vous étiez conducteur secondaire sur le contrat de vos parents, demandez une attestation de conduite secondaire. Certains assureurs en tiennent compte pour réduire la surprime primo-assuré." },
      { question: "L'assurance au kilomètre est-elle intéressante pour un primo-assuré ?", answer: "Oui, si vous roulez moins de 8 000 km/an. L'assurance au km (pay-as-you-drive) peut réduire votre prime de 20 à 30% par rapport à un forfait classique. C'est un levier méconnu des primo-assurés qui permet de compenser la surprime nouveau conducteur." },
    ]
  },
  {
    slug: "jeune-conducteur-voiture-puissante",
    title: "Assurance Jeune Conducteur Voiture Puissante — Guide 2026",
    metaDescription: "Jeune conducteur avec voiture puissante ? Comparez les assurances adaptées. Solutions pour assurer un véhicule de + de 6 CV avec un permis récent.",
    keyword: "assurance jeune conducteur voiture puissante",
    heroTitle: "Jeune Conducteur + Voiture Puissante : comment s'assurer sans se ruiner",
    heroSubtitle: "Un profil perçu comme risqué par les assureurs, mais pas sans solutions. Nos courtiers obtiennent des tarifs jusqu'à 35% inférieurs au marché pour ce segment.",
    quickCheckQuestions: [
      { id: "permis", label: "Permis obtenu depuis moins de 3 ans ?", yesText: "Oui", noText: "Plus de 3 ans" },
      { id: "puissance", label: "Votre véhicule dépasse 7 CV fiscaux ?", yesText: "Oui", noText: "Non" },
      { id: "conduite", label: "Avez-vous fait la conduite accompagnée ?", yesText: "AAC", noText: "Classique" },
    ],
    eligibleMessage: "Des solutions existent pour votre profil. Nos partenaires spécialisés proposent des tarifs négociés.",
    notEligibleMessage: "Profil sensible — un courtier analyse votre dossier et vous rappelle sous 24h avec une proposition ferme.",
    expertiseBlocks: [
      {
        title: "Le saviez-vous ? La puissance fiscale n'est pas la puissance réelle",
        content: "Les assureurs tarifent sur la puissance fiscale (CV), pas les chevaux DIN. Une Peugeot 308 GTi de 270 ch peut être en 10 CV fiscaux, tandis qu'un SUV diesel de 150 ch peut être en 8 CV. Le critère déterminant pour l'assureur est le groupe SRA (Sécurité et Réparation Automobile) qui intègre le coût de réparation, la fréquence de vol et la sinistralité du modèle. Consultez-le avant d'acheter."
      },
      {
        title: "Idée reçue : « On ne peut pas assurer un jeune sur une sportive »",
        content: "Faux dans 60% des cas. Les assureurs traditionnels refusent souvent, mais le marché spécialisé accepte ces profils. La clé est le montage du contrat : conducteur secondaire sur le contrat d'un parent (si le jeune vit au domicile), assurance au km, ou boîtier télématique qui prouve une conduite prudente. Le refus du premier assureur n'est pas le dernier mot."
      },
      {
        title: "Le hack courtier : le boîtier télématique, l'arme secrète",
        content: "Un boîtier télématique (type YouDrive chez Direct Assurance ou le système d'Alan) enregistre votre conduite. Si votre score est bon pendant 6 mois, certains assureurs réduisent la surprime de 15 à 25%. C'est l'argument le plus efficace pour un jeune conducteur avec véhicule puissant : il transforme un profil théoriquement risqué en conducteur prouvé par les données. <a href='/outils/calculateur-bonus-malus' class='text-primary underline font-semibold'>Estimez votre bonus-malus futur →</a>"
      }
    ],
    solutions: [
      { formule: "Tiers jeune puissant", couverture: "RC + Défense recours", franchise: "Aucune", prixIndicatif: "120-180€/mois", ideal: "Budget limité, véhicule de + de 5 ans" },
      { formule: "Tiers + télématique", couverture: "RC + Vol + BDG + boîtier", franchise: "500€", prixIndicatif: "100-160€/mois", ideal: "Conducteur prudent, prêt à être suivi" },
      { formule: "Tous risques avec surprime", couverture: "Couverture complète", franchise: "800-1200€", prixIndicatif: "200-350€/mois", ideal: "Véhicule récent/neuf, LOA" },
    ],
    surchargeCoefficient: 2.0,
    surchargeLabel: "Surprime jeune conducteur + véhicule puissant",
    surchargeExplanation: "La surprime cumulée (jeune conducteur + véhicule puissant) atteint en moyenne +100%. Avec conduite accompagnée, elle descend à +75%. Après 2 ans sans sinistre, elle se réduit à +40%. Un boîtier télématique peut accélérer cette baisse.",
    expertContent: "",
    faqs: [
      { question: "À partir de combien de CV un véhicule est considéré comme puissant ?", answer: "Pour les assureurs, le seuil se situe généralement à 7 CV fiscaux. Au-delà de 10 CV, la plupart des assureurs classiques refusent les jeunes conducteurs. Mais le groupe SRA du véhicule compte autant que la puissance : une berline de 9 CV avec un faible taux de vol sera plus facile à assurer qu'un coupé de 7 CV très volé." },
      { question: "Peut-on être conducteur secondaire sur le contrat de ses parents pour payer moins cher ?", answer: "Oui, c'est légal et courant. Mais attention : si vous êtes le conducteur principal effectif (celui qui utilise le véhicule plus de 50% du temps), c'est une fausse déclaration. En cas de sinistre, l'assureur peut refuser l'indemnisation. Si vous vivez au domicile parental et partagez réellement le véhicule, c'est pertinent." },
      { question: "Le boîtier télématique est-il obligatoire pour assurer une voiture puissante en tant que jeune ?", answer: "Non, il n'est pas obligatoire. Mais il est fortement recommandé : il réduit la prime de 15 à 25% après 6 mois de bonne conduite et il peut être le facteur décisif pour qu'un assureur accepte votre dossier. Considérez-le comme un investissement, pas une contrainte." },
    ]
  }
];

export const getNicheBySlug = (slug: string): NicheData | undefined => {
  return nicheProfiles.find(p => p.slug === slug);
};
