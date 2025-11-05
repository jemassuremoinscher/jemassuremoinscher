export const addOrganizationSchema = () => {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Le Comparateur Assurance",
    "url": "https://www.assurmoinschere.fr",
    "logo": "https://www.assurmoinschere.fr/logo.png",
    "description": "Comparateur d'assurances en ligne - Auto, Santé, Habitation, Vie, Animaux",
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+33-1-XX-XX-XX-XX",
      "contactType": "Service Client",
      "areaServed": "FR",
      "availableLanguage": "French"
    },
    "sameAs": [
      "https://www.facebook.com/assurmoinschere",
      "https://twitter.com/assurmoinschere",
      "https://www.linkedin.com/company/assurmoinschere"
    ]
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
      "name": service.provider || "Le Comparateur Assurance"
    },
    "areaServed": {
      "@type": "Country",
      "name": service.areaServed || "France"
    },
    "serviceType": "Comparateur d'assurance"
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
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": article.headline,
    "description": article.description,
    "author": {
      "@type": "Organization",
      "name": article.author || "Le Comparateur Assurance"
    },
    "publisher": {
      "@type": "Organization",
      "name": "Le Comparateur Assurance",
      "logo": {
        "@type": "ImageObject",
        "url": "https://www.assurmoinschere.fr/logo.png"
      }
    },
    "datePublished": article.datePublished,
    "dateModified": article.datePublished,
    ...(article.image && { "image": article.image })
  };
};
