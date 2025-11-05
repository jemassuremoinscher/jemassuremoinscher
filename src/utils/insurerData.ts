export interface InsurerConfig {
  name: string;
  priceMultiplier: number;
  coverage: string[];
  discount?: string;
  basePrice?: number;
  variationFactor?: number;
  coverageDetails?: string[];
  logo?: string;
}

export const autoInsurers: InsurerConfig[] = [
  {
    name: "Direct Assurance",
    priceMultiplier: 0.92,
    coverage: ["Tous risques", "Assistance 24/7", "Véhicule de remplacement"],
    discount: "-15% en ligne"
  },
  {
    name: "Allianz",
    priceMultiplier: 1.05,
    coverage: ["Tous risques", "Protection juridique", "Bris de glace"],
  },
  {
    name: "Axa",
    priceMultiplier: 1.08,
    coverage: ["Tous risques", "Garantie conducteur", "Vol/Incendie"],
  },
  {
    name: "MAIF",
    priceMultiplier: 0.98,
    coverage: ["Tous risques", "Garantie corporelle", "Protection du bonus"],
    discount: "-10% nouveau client"
  },
  {
    name: "Macif",
    priceMultiplier: 1.02,
    coverage: ["Tous risques", "Assistance panne 0km", "Protection familiale"],
  },
  {
    name: "Groupama",
    priceMultiplier: 1.12,
    coverage: ["Tous risques", "Assistance voyage", "Garantie valeur à neuf"],
  },
  {
    name: "GMF",
    priceMultiplier: 1.00,
    coverage: ["Tous risques", "Protection juridique", "Garantie des accessoires"],
  },
  {
    name: "MAAF",
    priceMultiplier: 0.95,
    coverage: ["Tous risques", "Assistance dépannage", "Vol du contenu"],
  },
  {
    name: "Matmut",
    priceMultiplier: 1.07,
    coverage: ["Tous risques", "Garantie du conducteur", "Catastrophes naturelles"],
  },
  {
    name: "MMA",
    priceMultiplier: 1.10,
    coverage: ["Tous risques", "Protection familiale", "Assistance internationale"],
  },
];

export const healthInsurers: InsurerConfig[] = [
  {
    name: "Harmonie Mutuelle",
    priceMultiplier: 0.90,
    coverage: ["Optique 400€/an", "Dentaire 300%", "Médecines douces"],
    discount: "-20% en ligne"
  },
  {
    name: "Mutuelle Générale",
    priceMultiplier: 1.05,
    coverage: ["Optique 350€/an", "Dentaire 250%", "Ostéopathie"],
  },
  {
    name: "MGEN",
    priceMultiplier: 0.95,
    coverage: ["Optique 500€/an", "Dentaire 350%", "Hospitalisation"],
    discount: "-15% famille"
  },
  {
    name: "Swiss Life",
    priceMultiplier: 1.12,
    coverage: ["Optique 600€/an", "Dentaire 400%", "Médecine de ville"],
  },
  {
    name: "April Santé",
    priceMultiplier: 0.88,
    coverage: ["Optique 300€/an", "Dentaire 200%", "Pharmacie"],
  },
  {
    name: "Alan",
    priceMultiplier: 1.08,
    coverage: ["Optique illimitée", "Dentaire 350%", "Application mobile"],
  },
  {
    name: "Malakoff Humanis",
    priceMultiplier: 1.02,
    coverage: ["Optique 450€/an", "Dentaire 300%", "Prévention santé"],
  },
  {
    name: "Axa Santé",
    priceMultiplier: 1.15,
    coverage: ["Optique 550€/an", "Dentaire 380%", "Téléconsultation"],
  },
  {
    name: "Henner",
    priceMultiplier: 1.00,
    coverage: ["Optique 400€/an", "Dentaire 280%", "Assistance rapatriement"],
  },
  {
    name: "Apivia Mutuelle",
    priceMultiplier: 0.93,
    coverage: ["Optique 350€/an", "Dentaire 250%", "Cure thermale"],
    discount: "-10% en ligne"
  },
];

export const homeInsurers: InsurerConfig[] = [
  {
    name: "Luko",
    priceMultiplier: 0.85,
    coverage: ["Dégâts des eaux", "Vol/Cambriolage", "Responsabilité civile"],
    discount: "-25% digital"
  },
  {
    name: "Allianz Habitation",
    priceMultiplier: 1.10,
    coverage: ["Multirisque", "Bris de glace", "Protection juridique"],
  },
  {
    name: "Axa Habitation",
    priceMultiplier: 1.15,
    coverage: ["Tout risque", "Catastrophe naturelle", "Jardin"],
  },
  {
    name: "MAIF Habitation",
    priceMultiplier: 0.95,
    coverage: ["Multirisque", "Dommages électriques", "Assistance serrurerie"],
    discount: "-12% web"
  },
  {
    name: "Macif Habitation",
    priceMultiplier: 1.05,
    coverage: ["Incendie/Explosion", "Vol", "Dégât des eaux"],
  },
  {
    name: "Groupama Habitation",
    priceMultiplier: 1.12,
    coverage: ["Multirisque premium", "Objets de valeur", "Piscine"],
  },
  {
    name: "GMF Habitation",
    priceMultiplier: 1.00,
    coverage: ["Risques locatifs", "Bris de vitres", "RC vie privée"],
  },
  {
    name: "MAAF Habitation",
    priceMultiplier: 0.92,
    coverage: ["Multirisque", "Garantie rééquipement", "Tempête"],
  },
  {
    name: "Matmut Habitation",
    priceMultiplier: 1.08,
    coverage: ["Tous risques", "Dommages électriques", "Jardin/Dépendances"],
  },
  {
    name: "MMA Habitation",
    priceMultiplier: 1.18,
    coverage: ["Premium", "Objets précieux", "Assistance 24/7"],
  },
];

export const petInsurers: InsurerConfig[] = [
  {
    name: "SantéVet",
    priceMultiplier: 0.88,
    coverage: ["Soins courants", "Chirurgie", "Hospitalisation"],
    discount: "-20% premier mois"
  },
  {
    name: "Bulle Bleue",
    priceMultiplier: 1.05,
    coverage: ["Maladie", "Accident", "Prévention"],
  },
  {
    name: "Carrefour Assurance",
    priceMultiplier: 0.82,
    coverage: ["Vétérinaire", "Vaccins", "Médicaments"],
    discount: "-15% en ligne"
  },
  {
    name: "Axa Animaux",
    priceMultiplier: 1.15,
    coverage: ["Formule premium", "Soins et vaccins", "Assistance"],
  },
  {
    name: "April Animaux",
    priceMultiplier: 0.95,
    coverage: ["Accident et maladie", "Frais vétérinaires", "Chirurgie"],
  },
  {
    name: "Allianz Chiens Chats",
    priceMultiplier: 1.10,
    coverage: ["Tout risque", "Médecines alternatives", "Prévention"],
  },
  {
    name: "Self Assurance",
    priceMultiplier: 0.90,
    coverage: ["Soins vétérinaires", "Hospitalisation", "Analyses"],
  },
  {
    name: "Figo Pet",
    priceMultiplier: 1.08,
    coverage: ["Accidents", "Maladies", "Examens"],
  },
  {
    name: "AG2R Animaux",
    priceMultiplier: 1.02,
    coverage: ["Soins courants", "Urgences", "Stérilisation"],
  },
  {
    name: "Assur O'Poil",
    priceMultiplier: 0.93,
    coverage: ["Soins vétérinaires", "Frais d'obsèques", "Responsabilité civile"],
    discount: "-10% web"
  },
];

export const loanInsurers: InsurerConfig[] = [
  {
    name: "Metlife",
    priceMultiplier: 0.85,
    coverage: ["Décès", "Invalidité", "Incapacité travail"],
    discount: "-30% vs banques"
  },
  {
    name: "Cardif",
    priceMultiplier: 1.10,
    coverage: ["Garantie décès", "PTIA", "ITT"],
  },
  {
    name: "Swiss Life Emprunteur",
    priceMultiplier: 0.92,
    coverage: ["Décès tout cause", "Invalidité permanente", "Arrêt de travail"],
    discount: "-25% délégation"
  },
  {
    name: "Generali Emprunteur",
    priceMultiplier: 1.05,
    coverage: ["Garantie décès", "IPT/IPP", "Maladie"],
  },
  {
    name: "Allianz Emprunteur",
    priceMultiplier: 1.12,
    coverage: ["Décès", "Invalidité totale", "Incapacité temporaire"],
  },
  {
    name: "Axa Emprunteur",
    priceMultiplier: 0.95,
    coverage: ["Décès/PTIA", "IPT", "ITT"],
  },
  {
    name: "MACIF Emprunteur",
    priceMultiplier: 1.00,
    coverage: ["Garanties de base", "Options personnalisables", "Couverture étendue"],
  },
  {
    name: "MAIF Emprunteur",
    priceMultiplier: 0.98,
    coverage: ["Décès accidentel", "Invalidité", "Chômage (option)"],
  },
  {
    name: "April Emprunteur",
    priceMultiplier: 0.88,
    coverage: ["Décès", "Invalidité", "Franchise courte"],
    discount: "-20% en ligne"
  },
  {
    name: "Malakoff Emprunteur",
    priceMultiplier: 1.08,
    coverage: ["Garantie décès", "IPT/IPP", "Arrêt de travail longue durée"],
  },
];

export const motoInsurers: InsurerConfig[] = [
  {
    name: "AMV Assurance Moto",
    priceMultiplier: 0.90,
    coverage: ["Tous risques", "Équipements", "Assistance panne"],
    discount: "-15% en ligne"
  },
  {
    name: "Mutuelle des Motards",
    priceMultiplier: 0.95,
    coverage: ["Dommages tous accidents", "Vol", "Garantie valeur à neuf"],
    discount: "-10% nouveau client"
  },
  {
    name: "April Moto",
    priceMultiplier: 1.05,
    coverage: ["Tous risques", "Accessoires", "Casque et blouson"],
  },
  {
    name: "Allianz Moto",
    priceMultiplier: 1.12,
    coverage: ["Formule premium", "Protection juridique", "Assistance 24/7"],
  },
  {
    name: "Axa Moto",
    priceMultiplier: 1.08,
    coverage: ["Tous risques", "Vol/Incendie", "Catastrophes naturelles"],
  },
  {
    name: "Direct Assurance Moto",
    priceMultiplier: 0.88,
    coverage: ["Tous risques", "Protection du bonus", "Assistance voyage"],
    discount: "-18% digital"
  },
  {
    name: "MAAF Moto",
    priceMultiplier: 1.00,
    coverage: ["Dommages collision", "Vol et tentative", "Bris de glace"],
  },
  {
    name: "Matmut Moto",
    priceMultiplier: 1.10,
    coverage: ["Tous risques", "Équipements du pilote", "Remorquage"],
  },
  {
    name: "GMF Moto",
    priceMultiplier: 1.03,
    coverage: ["Responsabilité civile", "Dommages tous accidents", "Vol"],
  },
  {
    name: "MMA Moto",
    priceMultiplier: 1.15,
    coverage: ["Garantie premium", "Accessoires et équipements", "Protection maximale"],
  },
];

export function generateInsurerOffers(basePrice: number, insurerConfigs: InsurerConfig[]) {
  return insurerConfigs
    .map(config => ({
      name: config.name,
      price: Math.round(basePrice * config.priceMultiplier),
      coverage: config.coverage,
      discount: config.discount,
    }))
    .sort((a, b) => a.price - b.price);
}

export function getLifeInsuranceInsurers(): InsurerConfig[] {
  return [
    {
      name: "Generali Vie",
      priceMultiplier: 0.92,
      coverage: [],
      basePrice: 80,
      variationFactor: 0.92,
      coverageDetails: [
        "Gestion pilotée disponible",
        "Frais d'entrée réduits",
      ],
      discount: "-20% frais de gestion",
      logo: "/src/assets/logos/generali.png"
    },
    {
      name: "Swiss Life",
      priceMultiplier: 1.05,
      coverage: [],
      basePrice: 85,
      variationFactor: 1.05,
      coverageDetails: [
        "Large choix de supports",
        "Accompagnement personnalisé",
      ],
      logo: "/src/assets/logos/swiss-life.png"
    },
    {
      name: "Axa Vie",
      priceMultiplier: 1.08,
      coverage: [],
      basePrice: 82,
      variationFactor: 1.08,
      coverageDetails: [
        "Options d'investissement variées",
        "Services en ligne complets",
      ],
      logo: "/src/assets/logos/axa.png"
    },
    {
      name: "Allianz Vie",
      priceMultiplier: 1.02,
      coverage: [],
      basePrice: 88,
      variationFactor: 1.02,
      coverageDetails: [
        "Garantie plancher disponible",
        "Gestion flexible",
      ],
      logo: "/src/assets/logos/allianz.png"
    },
    {
      name: "Cardif Assurance Vie",
      priceMultiplier: 0.88,
      coverage: [],
      basePrice: 75,
      variationFactor: 0.88,
      coverageDetails: [
        "Frais compétitifs",
        "Souscription simplifiée",
      ],
      discount: "-15% en ligne",
      logo: "/src/assets/logos/cardif.png"
    },
    {
      name: "Metlife Assurance Vie",
      priceMultiplier: 1.12,
      coverage: [],
      basePrice: 90,
      variationFactor: 1.12,
      coverageDetails: [
        "Protection renforcée",
        "Options de sortie flexibles",
      ],
      logo: "/src/assets/logos/metlife.png"
    },
    {
      name: "AG2R La Mondiale",
      priceMultiplier: 0.95,
      coverage: [],
      basePrice: 83,
      variationFactor: 0.95,
      coverageDetails: [
        "Gestion responsable ISR",
        "Conseils personnalisés",
      ],
      logo: "/src/assets/logos/ag2r.png"
    },
    {
      name: "Malakoff Humanis Vie",
      priceMultiplier: 1.00,
      coverage: [],
      basePrice: 86,
      variationFactor: 1.00,
      coverageDetails: [
        "Multisupport équilibré",
        "Frais transparents",
      ],
      logo: "/src/assets/logos/malakoff-humanis.png"
    },
    {
      name: "Groupama Vie",
      priceMultiplier: 0.98,
      coverage: [],
      basePrice: 84,
      variationFactor: 0.98,
      coverageDetails: [
        "Réseau d'agences étendu",
        "Accompagnement local",
      ],
      discount: "-10% nouveau client",
      logo: "/src/assets/logos/groupama.png"
    },
    {
      name: "MMA Vie",
      priceMultiplier: 1.10,
      coverage: [],
      basePrice: 89,
      variationFactor: 1.10,
      coverageDetails: [
        "Formule premium",
        "Garanties étendues",
      ],
      logo: "/src/assets/logos/mma.png"
    },
  ];
}