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
  /** Years of experience in insurance — omis si non verifie */
  experienceYears?: number;
  /** Specialties for E-E-A-T signals */
  specialties: string[];
}

/**
 * Expert author profiles for E-E-A-T optimization.
 * Each author maps to the `author` field in blogArticles.
 */
export const authors: Record<string, Author> = {
  // Les 18 profils nominatifs precedents ont ete supprimes : ils attribuaient
  // des diplomes universitaires et des certifications ORIAS a
  // des personnes qui n'existent pas, et etaient publies en JSON-LD Person sur
  // /qui-sommes-nous. Seule subsiste l'attribution collective, alignee sur les
  // chiffres verifies d'ExpertiseEEAT.tsx.
  "L'équipe d'experts Jemassuremoinscher": {
    id: "equipe-experts",
    name: "L'équipe d'experts Jemassuremoinscher",
    role: "Courtiers en assurance",
    bio: "Une équipe de conseillers en assurance basée à Nice, qui traite chaque jour des demandes réelles : auto malussée, jeune conducteur, mutuelle senior, RC pro, PNO et GLI. Chaque contenu s'appuie sur des sources officielles — Légifrance, France Assureurs, ACPR — ou sur nos propres données de devis, et est relu à chaque évolution réglementaire.",
    credentials: [
      "Édité par ARPV, courtier en assurances (immatriculation ORIAS en cours)",
      "Soumis au Code des assurances et au contrôle de l'ACPR",
      "Plus de 70 assureurs partenaires interrogés à garanties comparables",
      "Plus de 247 avis clients vérifiés",
    ],
    registrationId: "Immatriculation ORIAS en cours",
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
  // Organization et non Person : l'attribution est collective. Emettre un
  // Person pour une equipe affirmerait l'existence d'un individu nomme.
  "@type": "Organization",
  "name": author.name,
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
