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
  /**
   * Type de schema.org à émettre pour cet auteur. "Organization" par défaut
   * (attribution collective) — passer "Person" uniquement pour une personne
   * réelle et identifiée, jamais pour une équipe.
   */
  entityType?: "Person" | "Organization";
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
  "Paul": {
    id: "paul",
    name: "Paul",
    role: "Cofondateur, jemassuremoinscher.fr",
    bio: "Paul est cofondateur de jemassuremoinscher.fr depuis janvier 2026. Titulaire d'un doctorat (PhD) en commerce international de Griffith College Dublin (mention 1st Class Honours, 93/100), son parcours combine création et direction d'entreprises, stratégie marketing, et gestion financière et juridique, en France, aux Émirats arabes unis et à l'international.",
    credentials: [
      "PhD International Business — Griffith College Dublin (1st Class Honours, 93/100)",
      "Président du Groupe Mammouth depuis 2014 (Île Maurice)",
    ],
    specialties: ["Création et direction d'entreprises", "Stratégie marketing", "Gestion financière et juridique"],
    entityType: "Person",
  },
};

/**
 * Get an author profile by name. Falls back to the team profile.
 */
export const getAuthor = (name: string): Author => {
  return authors[name] || authors["L'équipe d'experts Jemassuremoinscher"];
};

/**
 * Generate JSON-LD schema for an author (E-E-A-T).
 */
export const getAuthorJsonLd = (author: Author) => {
  // Organization par defaut : l'attribution est collective. Emettre un Person
  // pour une equipe affirmerait l'existence d'un individu nomme. Person
  // seulement quand author.entityType le demande explicitement — une vraie
  // personne reelle et identifiee (cf. authors.ts, "Paul").
  const isPerson = author.entityType === "Person";
  return {
    "@context": "https://schema.org",
    "@type": isPerson ? "Person" : "Organization",
    "name": author.name,
    "description": author.bio,
    "knowsAbout": author.specialties,
    ...(isPerson && { "jobTitle": author.role }),
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
  };
};
