import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';

export type Language = 'fr' | 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// French translations (primary)
const fr: Record<string, string> = {
  // Header
  'nav.comparator': 'Comparateur Garanties',
  'nav.individuals': 'Particuliers',
  'nav.professionals': 'Professionnels',
  'nav.lifeAndSavings': 'Vie & Épargne',
  'nav.realEstate': 'Immobilier',
  'nav.aboutUs': 'Qui sommes-nous ?',
  'nav.partners': 'Nos Partenaires',
  'nav.reviews': 'Avis Clients',
  'nav.blog': 'Blog',
  'nav.openMenu': 'Ouvrir le menu',
  'nav.closeMenu': 'Fermer le menu',
  
  // Insurance types
  'insurance.auto': 'Auto',
  'insurance.moto': 'Moto',
  'insurance.home': 'Habitation',
  'insurance.health': 'Santé',
  'insurance.pets': 'Animaux',
  'insurance.rcPro': 'RC Pro',
  'insurance.mrp': 'MRP',
  'insurance.life': 'Assurance Vie',
  'insurance.loan': 'Assurance de Prêt',
  'insurance.provident': 'Prévoyance',
  'insurance.gli': 'Garantie Loyer Impayée',
  'insurance.pno': 'PNO',
  'insurance.rentalManagement': 'Gestion Locative',
  
  // Hero
  'hero.badge': 'Arthur, votre super-héros des économies',
  'hero.title': 'Laissez Arthur vous faire',
  'hero.titleHighlight': 'Économiser',
  'hero.titleEnd': 'sur vos Assurances !',
  'hero.subtitle': 'Arthur compare plus de 120 assureurs pour dénicher la meilleure offre adaptée à vos besoins',
  'hero.savings': 'EN MOYENNE',
  'hero.savingsAmount': '947€',
  'hero.savingsPerYear': 'PAR AN*',
  'hero.avgSavings': "trouvés par Arthur",
  'hero.compareTime': 'et c\'est réglé !',
  'hero.freeNoObligation': 'gratuit & sans engagement',
  'hero.cta': "Arthur compare pour vous - C'est gratuit !",
  'hero.ctaDetails': '✓ Sans engagement • ✓ Devis instantané • ✓ 100% gratuit',
  
  // Categories
  'category.auto': 'AUTO',
  'category.health': 'SANTÉ',
  'category.pets': 'ANIMAUX',
  'category.home': 'HABITATION',
  'category.loan': 'PRÊT',
  'category.moto': 'MOTO',
  
  // Features
  'features.title': 'Pourquoi nous choisir ?',
  'features.subtitle': 'Des avantages exclusifs pour vous accompagner',
  'features.free.title': '100% Gratuit',
  'features.free.description': 'Notre service de comparaison est entièrement gratuit et sans engagement.',
  'features.fast.title': 'Rapide & Simple',
  'features.fast.description': 'Obtenez vos devis en moins de 2 minutes.',
  'features.expert.title': 'Experts Dédiés',
  'features.expert.description': 'Une équipe de conseillers disponible pour vous accompagner.',
  'features.secure.title': 'Données Sécurisées',
  'features.secure.description': 'Vos informations sont protégées et confidentielles.',
  
  // FAQ
  'faq.title': 'Questions Fréquentes',
  'faq.subtitle': 'Tout ce que vous devez savoir sur notre comparateur',
  
  // Footer
  'footer.tagline': 'Arthur, votre super-héros des économies d\'assurance.',
  'footer.insurances': 'Assurances',
  'footer.about': 'À propos',
  'footer.info': 'Informations',
  'footer.cookies': 'Cookies',
  'footer.legal': 'Mentions légales',
  'footer.terms': 'CGU',
  'footer.privacy': 'Confidentialité',
  'footer.contact': 'Contact',
  'footer.sitemap': 'Plan du site',
  'footer.newsletter': 'Newsletter',
  'footer.rights': 'Tous droits réservés.',
  
  // Testimonials
  'testimonials.title': 'Ce que disent nos clients',
  'testimonials.subtitle': 'Des milliers de clients satisfaits',
  
  // Partners
  'partners.title': 'Nos Partenaires',
  'partners.subtitle': 'Plus de 120 assureurs de confiance',
  
  // Common
  'common.learnMore': 'En savoir plus',
  'common.getQuote': 'Obtenir un devis',
  'common.compare': 'Comparer',
  'common.free': 'Gratuit',
};

// English translations
const en: Record<string, string> = {
  // Header
  'nav.comparator': 'Coverage Comparator',
  'nav.individuals': 'Individuals',
  'nav.professionals': 'Professionals',
  'nav.lifeAndSavings': 'Life & Savings',
  'nav.realEstate': 'Real Estate',
  'nav.aboutUs': 'About Us',
  'nav.partners': 'Our Partners',
  'nav.reviews': 'Customer Reviews',
  'nav.blog': 'Blog',
  'nav.openMenu': 'Open menu',
  'nav.closeMenu': 'Close menu',
  
  // Insurance types
  'insurance.auto': 'Auto',
  'insurance.moto': 'Motorcycle',
  'insurance.home': 'Home',
  'insurance.health': 'Health',
  'insurance.pets': 'Pets',
  'insurance.rcPro': 'Professional Liability',
  'insurance.mrp': 'Business Property',
  'insurance.life': 'Life Insurance',
  'insurance.loan': 'Loan Insurance',
  'insurance.provident': 'Income Protection',
  'insurance.gli': 'Rent Guarantee',
  'insurance.pno': 'Landlord Insurance',
  'insurance.rentalManagement': 'Property Management',
  
  // Hero
  'hero.badge': 'Arthur, your savings superhero',
  'hero.title': 'Let Arthur help you',
  'hero.titleHighlight': 'Save',
  'hero.titleEnd': 'on your Insurance!',
  'hero.subtitle': 'Arthur compares over 120 insurers to find the best offer tailored to your needs',
  'hero.savings': 'ON AVERAGE',
  'hero.savingsAmount': '€947',
  'hero.savingsPerYear': 'PER YEAR*',
  'hero.avgSavings': 'found by Arthur',
  'hero.compareTime': 'and you\'re done!',
  'hero.freeNoObligation': 'free & no commitment',
  'hero.cta': "Arthur compares for you - It's free!",
  'hero.ctaDetails': '✓ No commitment • ✓ Instant quotes • ✓ 100% free',
  
  // Categories
  'category.auto': 'AUTO',
  'category.health': 'HEALTH',
  'category.pets': 'PETS',
  'category.home': 'HOME',
  'category.loan': 'LOAN',
  'category.moto': 'MOTO',
  
  // Features
  'features.title': 'Why Choose Us?',
  'features.subtitle': 'Exclusive benefits to support you',
  'features.free.title': '100% Free',
  'features.free.description': 'Our comparison service is completely free with no obligation.',
  'features.fast.title': 'Fast & Simple',
  'features.fast.description': 'Get your quotes in less than 2 minutes.',
  'features.expert.title': 'Dedicated Experts',
  'features.expert.description': 'A team of advisors available to assist you.',
  'features.secure.title': 'Secure Data',
  'features.secure.description': 'Your information is protected and confidential.',
  
  // FAQ
  'faq.title': 'Frequently Asked Questions',
  'faq.subtitle': 'Everything you need to know about our comparator',
  
  // Footer
  'footer.tagline': 'Arthur, your insurance savings superhero.',
  'footer.insurances': 'Insurance',
  'footer.about': 'About',
  'footer.info': 'Information',
  'footer.cookies': 'Cookies',
  'footer.legal': 'Legal Notice',
  'footer.terms': 'Terms of Use',
  'footer.privacy': 'Privacy',
  'footer.contact': 'Contact',
  'footer.sitemap': 'Sitemap',
  'footer.newsletter': 'Newsletter',
  'footer.rights': 'All rights reserved.',
  
  // Testimonials
  'testimonials.title': 'What Our Customers Say',
  'testimonials.subtitle': 'Thousands of satisfied customers',
  
  // Partners
  'partners.title': 'Our Partners',
  'partners.subtitle': 'Over 120 trusted insurers',
  
  // Common
  'common.learnMore': 'Learn more',
  'common.getQuote': 'Get a quote',
  'common.compare': 'Compare',
  'common.free': 'Free',
};

const translations: Record<Language, Record<string, string>> = { fr, en };

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('language') as Language;
    return saved && (saved === 'fr' || saved === 'en') ? saved : 'fr';
  });

  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('language', lang);
    document.documentElement.lang = lang;
  }, []);

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  const t = useCallback((key: string): string => {
    return translations[language][key] || translations['fr'][key] || key;
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
