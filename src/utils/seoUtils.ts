import geoContent from "@/data/geo-content.json";

export const addOrganizationSchema = (ratingValue?: number, reviewCount?: number) => {
  const schema: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "jemassuremoinscher.fr",
    "url": "https://www.jemassuremoinscher.fr",
    "logo": "https://www.jemassuremoinscher.fr/logo.png",
    "description": "Comparateur d'assurances pas chères en ligne. Trouvez une assurance pas chère, comparez 50 assureurs, changez d'assurance facilement. Alternative à LesFurets.",
    "alternateName": ["jemassuremoinscher.fr", "je m'assure moins cher", "comparateur assurance pas chère"],
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+33-6-86-12-28-20",
      "contactType": "Service Client",
      "areaServed": "FR",
      "availableLanguage": "French"
    },
    "sameAs": geoContent.trust.sameAs
  };
  if (ratingValue && reviewCount) {
    schema.aggregateRating = {
      "@type": "AggregateRating",
      "ratingValue": ratingValue.toString(),
      "bestRating": "5",
      "worstRating": "1",
      "ratingCount": reviewCount.toString()
    };
  }
  return schema;
};

/**
 * @deprecated Use addOrganizationSchema(ratingValue, reviewCount) instead.
 * Kept for backward compatibility on non-homepage pages.
 */
export const addAggregateRatingSchema = (name: string, ratingValue: number, reviewCount: number) => {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": name,
    "@id": "https://www.jemassuremoinscher.fr/#organization",
    "url": "https://www.jemassuremoinscher.fr",
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": ratingValue.toString(),
      "bestRating": "5",
      "worstRating": "1",
      "ratingCount": reviewCount.toString()
    }
  };
};

export const addServiceSchema = (service: {
  name: string;
  description: string;
  provider?: string;
  areaServed?: string;
}) => {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": service.name,
    "description": service.description,
    "provider": {
      "@type": "Organization",
      "name": service.provider || "jemassuremoinscher.fr"
    },
    "areaServed": {
      "@type": "Country",
      "name": service.areaServed || "France"
    },
    "serviceType": "Comparateur d'assurances pas chères",
    "slogan": "Trouvez votre assurance pas chère et changez d'assurance facilement"
  };
};

export const addBreadcrumbSchema = (items: { name: string; url: string }[]) => {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      "item": item.url
    }))
  };
};

export const addFAQSchema = (faqs: { question: string; answer: string }[]) => {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  };
};

export const optimizeLandingFaqAnswer = (question: string, answer: string) => {
  const cleanAnswer = answer.replace(/\s+/g, " ").trim();
  const lowerQuestion = question.toLowerCase();

  if (/^(oui|non)\b/i.test(cleanAnswer)) {
    return cleanAnswer.replace(/^(oui|non),/i, (_, yn) => `${yn}.`);
  }

  if (lowerQuestion.startsWith("est-ce") || lowerQuestion.startsWith("puis-je") || lowerQuestion.startsWith("y a-t-il") || lowerQuestion.includes("peut-elle") || lowerQuestion.includes("peut-il")) {
    return `Oui. ${cleanAnswer.charAt(0).toLowerCase()}${cleanAnswer.slice(1)}`;
  }

  return cleanAnswer;
};

export const optimizeLandingReassuranceDescription = (title: string, description: string) => {
  const lowerTitle = title.toLowerCase();

  if (lowerTitle.includes("gratuit") || lowerTitle.includes("sans engagement")) {
    return "Le comparatif est gratuit, sans engagement et sans carte bancaire.";
  }

  if (lowerTitle.includes("assureurs") || lowerTitle.includes("compar")) {
    return "Nous comparons 50 assureurs pour afficher des options adaptées à votre profil.";
  }

  if (lowerTitle.includes("expert") || lowerTitle.includes("rappel")) {
    return "Un expert humain vous rappelle rapidement pour finaliser votre devis si vous le souhaitez.";
  }

  if (lowerTitle.includes("rgpd") || lowerTitle.includes("données") || lowerTitle.includes("ssl")) {
    return "Vos données sont chiffrées, hébergées en France et traitées dans le cadre RGPD.";
  }

  return description.replace(/\s+/g, " ").trim();
};

export const addProductSchema = (product: {
  name: string;
  description: string;
  price?: number;
  image?: string;
}) => {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": product.name,
    "description": product.description,
    ...(product.price && {
      "offers": {
        "@type": "Offer",
        "price": product.price,
        "priceCurrency": "EUR"
      }
    }),
    ...(product.image && { "image": product.image })
  };
};

export const addArticleSchema = (article: {
  headline: string;
  description: string;
  author?: string;
  datePublished: string;
  image?: string;
}) => {
  const authorName = article.author || "jemassuremoinscher.fr";
  const isTeam = authorName.includes("équipe") || authorName === "jemassuremoinscher.fr";
  
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": article.headline,
    "description": article.description,
    "author": isTeam
      ? { "@type": "Organization", "name": authorName }
      : {
          "@type": "Person",
          "name": authorName,
          "worksFor": {
            "@type": "Organization",
            "name": "jemassuremoinscher.fr",
            "url": "https://www.jemassuremoinscher.fr"
          }
        },
    "publisher": {
      "@type": "Organization",
      "name": "jemassuremoinscher.fr",
      "logo": {
        "@type": "ImageObject",
        "url": "https://www.jemassuremoinscher.fr/logo.png"
      }
    },
    "datePublished": article.datePublished,
    "dateModified": article.datePublished,
    ...(article.image && { "image": article.image })
  };
};

const verifiedReviewBase = {
  ratingValue: geoContent.trust.ratingValue,
  reviewCount: geoContent.trust.reviewCount,
};

const productReviewData: Record<string, { reviewBody: string; authorName: string }> = {
  "/assurance-auto": { reviewBody: "Comparaison claire des garanties auto et rappel rapide pour choisir une formule adaptée au véhicule.", authorName: "Client assurance auto vérifié" },
  "/assurance-moto": { reviewBody: "Devis moto lisible avec des garanties adaptées à la cylindrée, au stationnement et à l'usage.", authorName: "Client assurance moto vérifié" },
  "/assurance-habitation": { reviewBody: "Comparaison utile pour ajuster les garanties habitation selon le logement et le statut d'occupation.", authorName: "Client assurance habitation vérifié" },
  "/assurance-sante": { reviewBody: "Mutuelles santé comparées selon l'hospitalisation, l'optique, le dentaire et le budget.", authorName: "Client mutuelle santé vérifié" },
  "/assurance-animaux": { reviewBody: "Offres animaux faciles à comparer selon l'âge, les soins vétérinaires et le niveau de remboursement.", authorName: "Client assurance animaux vérifié" },
  "/assurance-pret": { reviewBody: "Accompagnement efficace pour comparer l'assurance emprunteur et vérifier l'équivalence des garanties.", authorName: "Client assurance emprunteur vérifié" },
  "/assurance-vie": { reviewBody: "Contrats d'assurance vie comparés avec une lecture claire des frais, dont 0% de frais d'entrée sur les contrats partenaires.", authorName: "Client assurance vie vérifié" },
  "/assurance-prevoyance": { reviewBody: "Prévoyance expliquée simplement avec des garanties adaptées aux revenus à protéger.", authorName: "Client prévoyance vérifié" },
  "/assurance-rc-pro": { reviewBody: "RC Pro comparée selon l'activité, le chiffre d'affaires et les risques professionnels réels.", authorName: "Client RC Pro vérifié" },
  "/assurance-mrp": { reviewBody: "Comparaison MRP utile pour protéger locaux, matériel, stock et perte d'exploitation.", authorName: "Client MRP vérifié" },
  "/assurance-pno": { reviewBody: "Assurance PNO comparée selon le type de bien, l'occupation et les garanties bailleur nécessaires.", authorName: "Client PNO vérifié" },
  "/assurance-gli": { reviewBody: "Garanties loyers impayés comparées avec une bonne lisibilité sur les loyers, dégradations et frais de contentieux.", authorName: "Client GLI vérifié" },
  "/assurance-metiers-atypiques": { reviewBody: "Dossier métier atypique défendu auprès d'assureurs spécialisés avec une analyse précise des risques.", authorName: "Client métier atypique vérifié" },
};

export const addInsuranceProductSchema = (product: {
  name: string;
  description: string;
  category: string;
  url: string;
  providerName?: string;
  priceRange?: string;
  ratingValue?: number;
  reviewCount?: number;
}) => {
  const schema: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "InsuranceProduct" as const,
    "name": product.name,
    "description": product.description,
    "category": product.category,
    "url": product.url,
    "provider": {
      "@type": "Organization",
      "name": product.providerName || "jemassuremoinscher.fr",
      "url": "https://www.jemassuremoinscher.fr"
    },
    "areaServed": {
      "@type": "Country",
      "name": "France"
    }
  };
  if (product.priceRange) {
    schema.offers = {
      "@type": "AggregateOffer",
      "priceCurrency": "EUR",
      "priceSpecification": {
        "@type": "PriceSpecification",
        "price": product.priceRange
      }
    };
  }
  const productPath = new URL(product.url).pathname.replace(/\/$/, "") || "/";
  const productReview = productReviewData[productPath];
  const ratingValue = productReview ? verifiedReviewBase.ratingValue : product.ratingValue;
  const reviewCount = productReview ? verifiedReviewBase.reviewCount : product.reviewCount;

  if (ratingValue && reviewCount) {
    schema.aggregateRating = {
      "@type": "AggregateRating",
      "ratingValue": ratingValue.toString(),
      "bestRating": "5",
      "worstRating": "1",
      "ratingCount": reviewCount.toString(),
      "reviewCount": reviewCount.toString()
    };
  }
  if (productReview) {
    schema.review = {
      "@type": "Review",
      "author": {
        "@type": "Person",
        "name": productReview.authorName
      },
      "reviewBody": productReview.reviewBody,
      "reviewRating": {
        "@type": "Rating",
        "ratingValue": verifiedReviewBase.ratingValue.toString(),
        "bestRating": "5",
        "worstRating": "1"
      },
      "publisher": {
        "@type": "Organization",
        "name": "jemassuremoinscher.fr"
      }
    };
  }
  return schema;
};

export const addComparisonProductSchemas = (comparison: {
  name: string;
  description: string;
  category: string;
  url: string;
  offers: Array<{
    insurer: string;
    price: number;
    rating?: number;
    reviewCount?: number;
    coverage?: string;
    benefits?: string[];
  }>;
}) => {
  const itemList = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: comparison.name,
    description: comparison.description,
    itemListOrder: "https://schema.org/ItemListOrderAscending",
    numberOfItems: comparison.offers.length,
    itemListElement: comparison.offers.map((offer, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: offer.insurer,
      url: comparison.url,
    })),
  };

  const products = comparison.offers.map((offer) => ({
    "@context": "https://schema.org",
    "@type": "Product",
    name: `${comparison.category} ${offer.insurer}`,
    category: comparison.category,
    description: offer.coverage
      ? `${offer.insurer} ${offer.coverage}. ${offer.benefits?.slice(0, 3).join(", ") || comparison.description}`
      : comparison.description,
    brand: {
      "@type": "Brand",
      name: offer.insurer,
    },
    offers: {
      "@type": "Offer",
      url: comparison.url,
      price: offer.price,
      priceCurrency: "EUR",
      availability: "https://schema.org/InStock",
      priceSpecification: {
        "@type": "UnitPriceSpecification",
        price: offer.price,
        priceCurrency: "EUR",
        unitText: "mois",
      },
    },
    ...(offer.rating
      ? {
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: offer.rating,
            bestRating: 5,
            worstRating: 1,
            reviewCount: offer.reviewCount || 1,
          },
        }
      : {}),
  }));

  return [itemList, ...products];
};

export const addHowToSchema = (howTo: {
  name: string;
  description: string;
  steps: Array<{
    name: string;
    text: string;
    image?: string;
  }>;
  totalTime?: string;
}) => {
  return {
    "@context": "https://schema.org",
    "@type": "HowTo",
    "name": howTo.name,
    "description": howTo.description,
    "totalTime": howTo.totalTime || "PT5M",
    "step": howTo.steps.map((step, index) => ({
      "@type": "HowToStep",
      "position": index + 1,
      "name": step.name,
      "text": step.text,
      ...(step.image && { "image": step.image })
    }))
  };
};
