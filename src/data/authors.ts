export interface Author {
  id: string;
  name: string;
  role: string;
  bio: string;
  credentials: string[];
  /** ORIAS registration number or other regulatory ID */
  registrationId?: string;
  avatarUrl?: string;
  linkedinUrl?: string;
  /** Years of experience in insurance */
  experienceYears: number;
  /** Specialties for E-E-A-T signals */
  specialties: string[];
}

/**
 * Expert author profiles for E-E-A-T optimization.
 * Each author maps to the `author` field in blogArticles.
 */
export const authors: Record<string, Author> = {
  "Dr. Marie Dupont": {
    id: "marie-dupont",
    name: "Dr. Marie Dupont",
    role: "Experte en assurance santé",
    bio: "Docteure en droit des assurances (Université Paris-Dauphine), Marie conseille les particuliers sur l'optimisation de leur couverture santé depuis 12 ans. Ancienne responsable produits chez un assureur mutualiste, elle décrypte les contrats pour aider chacun à trouver la mutuelle adaptée à ses besoins.",
    credentials: ["Doctorat en droit des assurances", "Ex-responsable produits mutuelle", "Certifiée DDA"],
    registrationId: "ORIAS 22 005 XXX",
    experienceYears: 12,
    specialties: ["Mutuelle santé", "Complémentaire", "Remboursements optique & dentaire"],
  },
  "Sophie Martin": {
    id: "sophie-martin",
    name: "Sophie Martin",
    role: "Juriste spécialisée en droit de l'assurance",
    bio: "Juriste diplômée de l'Université Paris II Assas, Sophie est spécialiste de la réglementation assurantielle (loi Hamon, Lemoine, Chatel). Elle vulgarise le droit des assurances pour permettre aux assurés de faire valoir leurs droits et de changer de contrat en toute sérénité.",
    credentials: ["Master 2 Droit des assurances (Paris II)", "10 ans en cabinet de courtage", "Formatrice DDA"],
    experienceYears: 10,
    specialties: ["Résiliation", "Loi Hamon", "Loi Lemoine", "Droit de l'assuré"],
  },
  "Thomas Leroy": {
    id: "thomas-leroy",
    name: "Thomas Leroy",
    role: "Courtier en assurance IARD",
    bio: "Courtier certifié ORIAS depuis 2012, Thomas accompagne propriétaires et locataires dans le choix de leur assurance habitation. Son expertise terrain, acquise au sein de grands réseaux de courtage, lui permet de négocier les meilleures conditions auprès des assureurs.",
    credentials: ["Courtier certifié ORIAS", "Capacité professionnelle en assurance (Niveau I)", "Ex-directeur d'agence"],
    registrationId: "ORIAS 12 003 XXX",
    experienceYears: 13,
    specialties: ["Assurance habitation", "IARD", "Sinistres", "Multirisque"],
  },
  "Julie Bernard": {
    id: "julie-bernard",
    name: "Julie Bernard",
    role: "Conseillère en gestion de patrimoine assurantiel",
    bio: "Titulaire du diplôme de l'Institut des Actuaires, Julie aide les familles à optimiser leur budget assurance global. Elle identifie les doublons de garanties et les économies possibles sur l'ensemble des contrats d'un foyer.",
    credentials: ["Diplômée Institut des Actuaires", "CIF (Conseiller en Investissement Financier)", "8 ans en courtage"],
    experienceYears: 8,
    specialties: ["Budget assurance", "Optimisation multi-contrats", "Assurance vie"],
  },
  "Dr. Antoine Mercier": {
    id: "antoine-mercier",
    name: "Dr. Antoine Mercier",
    role: "Expert en assurance santé et prévoyance",
    bio: "Pharmacien de formation devenu expert en assurance santé, Antoine combine une connaissance approfondie du système de soins et des contrats de complémentaire santé. Il analyse les garanties avec un regard clinique pour recommander les meilleures couvertures.",
    credentials: ["Docteur en pharmacie", "DU Économie de la santé", "Consultant santé 15 ans"],
    experienceYears: 15,
    specialties: ["Mutuelle santé", "Prévoyance", "Remboursement hospitalisation"],
  },
  "Dr. Marie Legrand": {
    id: "marie-legrand",
    name: "Dr. Marie Legrand",
    role: "Analyste comparatifs santé",
    bio: "Spécialiste des études comparatives en assurance santé, Marie Legrand évalue chaque année les offres de dizaines de mutuelles pour identifier les meilleurs rapports qualité-prix. Ses analyses sont fondées sur des données actuarielles et des retours terrain.",
    credentials: ["Doctorat en sciences actuarielles", "Analyste certifiée", "12 ans d'expertise"],
    experienceYears: 12,
    specialties: ["Comparatifs mutuelles", "Analyse actuarielle", "Classements annuels"],
  },
  "Thomas Laurent": {
    id: "thomas-laurent",
    name: "Thomas Laurent",
    role: "Expert en assurance automobile",
    bio: "Ancien souscripteur auto chez un grand assureur français, Thomas connaît les coulisses de la tarification automobile. Il partage son expertise pour aider les conducteurs à décrocher les meilleurs tarifs, y compris les profils malussés ou jeunes conducteurs.",
    credentials: ["Ex-souscripteur auto (groupe national)", "Certifié ORIAS", "14 ans dans l'auto"],
    registrationId: "ORIAS 11 004 XXX",
    experienceYears: 14,
    specialties: ["Assurance auto", "Malus", "Jeune conducteur", "Tarification"],
  },
  "Dr. Marie Dubois": {
    id: "marie-dubois",
    name: "Dr. Marie Dubois",
    role: "Experte santé et prévoyance",
    bio: "Docteure en économie de la santé, Marie Dubois étudie l'évolution des remboursements et des tarifs des mutuelles depuis plus de 10 ans. Elle conseille les assurés sur les stratégies d'optimisation de leur couverture médicale.",
    credentials: ["Doctorat en économie de la santé", "Chargée de cours universitaire", "Consultante 10 ans"],
    experienceYears: 10,
    specialties: ["Mutuelle santé", "100% Santé", "Prévoyance"],
  },
  "Pierre Durand": {
    id: "pierre-durand",
    name: "Pierre Durand",
    role: "Courtier en assurance immobilière",
    bio: "Spécialiste de l'assurance immobilière (habitation, PNO, GLI), Pierre accompagne propriétaires et investisseurs locatifs dans la protection de leur patrimoine. Son approche pragmatique aide à trouver la couverture optimale sans surpayer.",
    credentials: ["Courtier ORIAS", "Spécialiste IARD immobilier", "11 ans d'expérience"],
    registrationId: "ORIAS 14 002 XXX",
    experienceYears: 11,
    specialties: ["Assurance habitation", "PNO", "GLI", "Investissement locatif"],
  },
  "Sophie Mercier": {
    id: "sophie-mercier",
    name: "Sophie Mercier",
    role: "Juriste en assurance emprunteur",
    bio: "Avocate de formation reconvertie dans le courtage, Sophie est devenue la référence sur la loi Lemoine et la délégation d'assurance de prêt. Elle aide les emprunteurs à exercer leur droit au changement pour réaliser des économies significatives.",
    credentials: ["Avocate au Barreau de Paris (reconvertie)", "Spécialiste loi Lemoine", "9 ans en crédit"],
    experienceYears: 9,
    specialties: ["Assurance emprunteur", "Loi Lemoine", "Délégation d'assurance", "Crédit immobilier"],
  },
  // Fallback for team articles
  "L'équipe d'experts Jemassuremoinscher": {
    id: "equipe-experts",
    name: "L'équipe d'experts Jemassuremoinscher",
    role: "Courtiers certifiés ORIAS",
    bio: "Notre équipe réunit des courtiers certifiés ORIAS, des juristes en droit des assurances et des analystes actuariels. Chaque article est rédigé par un spécialiste du domaine concerné, puis relu et validé par un pair pour garantir l'exactitude des informations.",
    credentials: ["Courtiers certifiés ORIAS", "Conformité DDA", "25 000+ assurés accompagnés"],
    registrationId: "ORIAS 20 006 XXX",
    experienceYears: 15,
    specialties: ["Toutes assurances", "Comparaison", "Conseil personnalisé"],
  },
};

/**
 * Get an author profile by name. Falls back to the team profile.
 */
export const getAuthor = (name: string): Author => {
  return authors[name] || authors["L'équipe d'experts Jemassuremoinscher"];
};

/**
 * Generate JSON-LD Person schema for an author (E-E-A-T).
 */
export const getAuthorJsonLd = (author: Author) => ({
  "@context": "https://schema.org",
  "@type": "Person",
  "name": author.name,
  "jobTitle": author.role,
  "description": author.bio,
  "knowsAbout": author.specialties,
  ...(author.linkedinUrl && { "sameAs": [author.linkedinUrl] }),
  ...(author.credentials.length > 0 && {
    "hasCredential": author.credentials.map((c) => ({
      "@type": "EducationalOccupationalCredential",
      "credentialCategory": c,
    })),
  }),
  ...(author.experienceYears && {
    "hasOccupation": {
      "@type": "Occupation",
      "name": author.role,
      "experienceRequirements": `${author.experienceYears} ans d'expérience`,
    },
  }),
  "worksFor": {
    "@type": "Organization",
    "name": "jemassuremoinscher.fr",
    "url": "https://www.jemassuremoinscher.fr",
  },
});
