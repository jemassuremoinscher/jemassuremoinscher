import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

interface SEOProps {
  title?: string;
  description?: string;
  canonical?: string;
  ogImage?: string;
  keywords?: string;
  noindex?: boolean;
  jsonLd?: object | object[];
}

const SEO = ({ 
  title, 
  description, 
  canonical, 
  ogImage, 
  keywords,
  noindex = false,
  jsonLd 
}: SEOProps) => {
  const location = useLocation();
  const baseUrl = 'https://www.assurmoinschere.fr';
  
  const defaultTitle = 'Le Comparateur Assurance - Économisez jusqu\'à 947€/an';
  const defaultDescription = 'Comparez gratuitement les meilleures assurances auto, santé, habitation, animaux et prêt en France. Devis en 2 minutes.';
  const defaultImage = 'https://lovable.dev/opengraph-image-p98pqg.png';

  const pageTitle = title || defaultTitle;
  const pageDescription = description || defaultDescription;
  const pageCanonical = canonical || `${baseUrl}${location.pathname}`;
  const pageImage = ogImage || defaultImage;

  useEffect(() => {
    // Update title
    document.title = pageTitle;

    // Update or create meta tags
    const updateMetaTag = (name: string, content: string, property = false) => {
      const attribute = property ? 'property' : 'name';
      let element = document.querySelector(`meta[${attribute}="${name}"]`);
      
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attribute, name);
        document.head.appendChild(element);
      }
      
      element.setAttribute('content', content);
    };

    // Meta tags
    updateMetaTag('description', pageDescription);
    if (keywords) updateMetaTag('keywords', keywords);
    updateMetaTag('robots', noindex ? 'noindex, nofollow' : 'index, follow');

    // Open Graph
    updateMetaTag('og:title', pageTitle, true);
    updateMetaTag('og:description', pageDescription, true);
    updateMetaTag('og:url', pageCanonical, true);
    updateMetaTag('og:image', pageImage, true);
    updateMetaTag('og:type', 'website', true);

    // Twitter
    updateMetaTag('twitter:card', 'summary_large_image');
    updateMetaTag('twitter:title', pageTitle);
    updateMetaTag('twitter:description', pageDescription);
    updateMetaTag('twitter:image', pageImage);

    // Canonical link
    let canonicalLink = document.querySelector('link[rel="canonical"]');
    if (!canonicalLink) {
      canonicalLink = document.createElement('link');
      canonicalLink.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.setAttribute('href', pageCanonical);

    // JSON-LD structured data
    const existingJsonLd = document.querySelectorAll('script[type="application/ld+json"]');
    existingJsonLd.forEach(script => script.remove());

    if (jsonLd) {
      const schemas = Array.isArray(jsonLd) ? jsonLd : [jsonLd];
      schemas.forEach((schema, index) => {
        const script = document.createElement('script');
        script.type = 'application/ld+json';
        script.text = JSON.stringify(schema);
        script.setAttribute('data-schema-index', index.toString());
        document.head.appendChild(script);
      });
    }
  }, [pageTitle, pageDescription, pageCanonical, pageImage, keywords, noindex, jsonLd]);

  return null;
};

export default SEO;
