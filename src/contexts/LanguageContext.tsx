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
  'nav.back': 'Retour',
  'nav.share': 'Partager',
  'nav.favorites': 'Favoris',
  'nav.print': 'Imprimer',
  'nav.moreActions': "Plus d'actions",
  
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
  'hero.title': 'Le site pour trouver son assurance moins chère,',
  'hero.titleHighlight': 'sans compromis.',
  'hero.subtitle': 'Comparez',
  'hero.subtitleBold': '50+ assureurs',
  'hero.subtitleEnd': 'en 2 minutes.',
  'hero.subtitleSecondary': 'Gratuit et sans engagement.',
  'hero.savingsBadge': "Économisez jusqu'à",
  'hero.savingsPercent': '40%',
  'hero.savingsEnd': 'sur votre assurance actuelle',
  'hero.arthurSpeech': "Moi c'est Arthur !",
  'hero.partnersCount': 'Assureurs partenaires',
  'hero.compareTime': 'Comparaison express',
  'hero.freeLabel': 'Gratuit & sans engagement',
  
  // Categories
  'category.auto': 'Auto',
  'category.moto': 'Moto',
  'category.home': 'Habitation',
  'category.health': 'Santé',
  'category.pets': 'Animaux',
  'category.life': 'Vie',
  
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
  'footer.tagline': "Arthur, votre super-héros des économies d'assurance.",
  'footer.insurances': 'Nos Assurances',
  'footer.about': 'À propos',
  'footer.info': 'Informations',
  'footer.cookies': 'Cookies',
  'footer.legal': 'Mentions légales',
  'footer.terms': 'CGU',
  'footer.privacy': 'Confidentialité',
  'footer.contact': 'Contact',
  'footer.sitemap': 'Plan du site',
  'footer.newsletter': 'Newsletter',
  'footer.rights': 'Tous droits réservés',
  'footer.privacyCharter': 'Charte de Confidentialité',
  'footer.securePayment': 'Paiement Sécurisé',
  'footer.gdprProtected': 'Données Protégées RGPD',
  'footer.verifiedSite': 'Site Vérifié',
  'footer.disclaimer': 'Jemassuremoinscher.fr est un comparateur indépendant. Les tarifs affichés sont indicatifs et peuvent varier selon votre profil. Ce site ne se substitue pas aux conseils d\'un professionnel de l\'assurance.',
  
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
  'common.close': 'Fermer',
  'common.loading': 'Chargement en cours...',
  
  // How it works
  'howItWorks.title': 'Comment ça marche ?',
  'howItWorks.step1.title': 'Remplissez le formulaire',
  'howItWorks.step1.description': 'Décrivez votre profil en quelques clics',
  'howItWorks.step2.title': 'Comparez les offres',
  'howItWorks.step2.description': 'Recevez des devis personnalisés instantanément',
  'howItWorks.step3.title': 'Souscrivez en ligne',
  'howItWorks.step3.description': 'Choisissez et finalisez votre assurance',
  
  // Why us
  'whyUs.title': 'Pourquoi nous choisir ?',
  'whyUs.subtitle': 'Un service pensé pour vous',
  
  // Guides
  'guides.title': 'Nos guides pratiques',
  'guides.subtitle': 'Tout savoir sur l\'assurance',
  
  // Pages
  'page.blog.title': 'Blog',
  'page.blog.subtitle': 'Conseils et actualités assurance',
  'page.about.title': 'Qui sommes-nous ?',
  'page.about.subtitle': 'Découvrez notre histoire et notre mission',
  'page.partners.title': 'Nos Partenaires',
  'page.partners.subtitle': 'Découvrez nos assureurs partenaires',
  'page.contact.title': 'Contactez-nous',
  'page.contact.subtitle': 'Notre équipe est à votre écoute',
};

// English translations
const en: Record<string, string> = {
  // Header
  'nav.individuals': 'Individuals',
  'nav.professionals': 'Business',
  'nav.lifeAndSavings': 'Life & Savings',
  'nav.realEstate': 'Real Estate',
  'nav.aboutUs': 'About Us',
  'nav.partners': 'Our Partners',
  'nav.reviews': 'Customer Reviews',
  'nav.blog': 'Blog',
  'nav.openMenu': 'Open menu',
  'nav.closeMenu': 'Close menu',
  'nav.back': 'Back',
  'nav.share': 'Share',
  'nav.favorites': 'Favorites',
  'nav.print': 'Print',
  'nav.moreActions': 'More actions',
  
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
  'hero.title': 'The site to find cheaper insurance,',
  'hero.titleHighlight': 'without compromise.',
  'hero.subtitle': 'Compare',
  'hero.subtitleBold': '50+ insurers',
  'hero.subtitleEnd': 'in 2 minutes.',
  'hero.subtitleSecondary': 'Free and no commitment.',
  'hero.savingsBadge': 'Save up to',
  'hero.savingsPercent': '40%',
  'hero.savingsEnd': 'on your current insurance',
  'hero.arthurSpeech': "I'm Arthur!",
  'hero.partnersCount': 'Partner insurers',
  'hero.compareTime': 'Express comparison',
  'hero.freeLabel': 'Free & no commitment',
  
  // Categories
  'category.auto': 'Auto',
  'category.moto': 'Moto',
  'category.home': 'Home',
  'category.health': 'Health',
  'category.pets': 'Pets',
  'category.life': 'Life',
  
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
  'footer.insurances': 'Our Insurance',
  'footer.about': 'About',
  'footer.info': 'Information',
  'footer.cookies': 'Cookies',
  'footer.legal': 'Legal Notice',
  'footer.terms': 'Terms of Use',
  'footer.privacy': 'Privacy',
  'footer.contact': 'Contact',
  'footer.sitemap': 'Sitemap',
  'footer.newsletter': 'Newsletter',
  'footer.rights': 'All rights reserved',
  'footer.privacyCharter': 'Privacy Policy',
  'footer.securePayment': 'Secure Payment',
  'footer.gdprProtected': 'GDPR Protected Data',
  'footer.verifiedSite': 'Verified Site',
  'footer.disclaimer': 'Jemassuremoinscher.fr is an independent comparison site. Displayed rates are indicative and may vary based on your profile. This site does not replace advice from an insurance professional.',
  
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
  'common.close': 'Close',
  'common.loading': 'Loading...',
  
  // How it works
  'howItWorks.title': 'How It Works',
  'howItWorks.step1.title': 'Fill out the form',
  'howItWorks.step1.description': 'Describe your profile in a few clicks',
  'howItWorks.step2.title': 'Compare offers',
  'howItWorks.step2.description': 'Receive personalized quotes instantly',
  'howItWorks.step3.title': 'Subscribe online',
  'howItWorks.step3.description': 'Choose and finalize your insurance',
  
  // Why us
  'whyUs.title': 'Why Choose Us?',
  'whyUs.subtitle': 'A service designed for you',
  
  // Guides
  'guides.title': 'Our Practical Guides',
  'guides.subtitle': 'Everything about insurance',
  
  // Pages
  'page.blog.title': 'Blog',
  'page.blog.subtitle': 'Insurance tips and news',
  'page.about.title': 'About Us',
  'page.about.subtitle': 'Discover our history and mission',
  'page.partners.title': 'Our Partners',
  'page.partners.subtitle': 'Discover our partner insurers',
  'page.contact.title': 'Contact Us',
  'page.contact.subtitle': 'Our team is here to help',
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
