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
  'footer.description': 'Comparez les meilleures assurances en France. Gratuit, rapide et sans engagement.',
  'footer.legalSection': 'Légal',
  'footer.privacyPolicy': 'Politique de confidentialité',
  'footer.cookiePolicy': 'Politique cookies',
  
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
  'common.back': 'Retour',
  'common.continue': 'Continuer',
  'common.send': 'Envoyer',
  'common.readMore': 'Lire la suite',
  'common.advice': 'Conseil',
  
  // How it works
  'howItWorks.title': 'Comment ça marche ?',
  'howItWorks.subtitle': "Comparer ses assurances n'a jamais été aussi simple",
  'howItWorks.step1.title': 'Je remplis mon profil',
  'howItWorks.step1.description': 'En 2 minutes, décrivez vos besoins en assurance.',
  'howItWorks.step2.title': 'Je compare les offres',
  'howItWorks.step2.description': 'Arthur analyse 50+ assureurs pour vous.',
  'howItWorks.step3.title': 'On me rappelle tout de suite',
  'howItWorks.step3.description': 'Choisissez la meilleure offre et faites-vous rappeler.',
  'howItWorks.arthurCta': "s'occupe de tout !",
  
  // Why us
  'whyUs.title': 'Pourquoi nous choisir ?',
  'whyUs.subtitle': 'Découvrez ce qui nous différencie des autres comparateurs',
  'whyUs.criteria': 'Critères',
  'whyUs.others': 'Autres comparateurs',
  'whyUs.othersMobile': 'Autres',
  'whyUs.speed': 'Rapidité',
  'whyUs.speedUs': 'Devis en 2 minutes',
  'whyUs.speedThem': "Jusqu'à 15 minutes",
  'whyUs.insurerCount': "Nombre d'assureurs",
  'whyUs.insurerCountUs': '50+ partenaires',
  'whyUs.insurerCountThem': '10-20 assureurs',
  'whyUs.transparency': 'Transparence des prix',
  'whyUs.transparencyUs': 'Prix affichés sans surprise',
  'whyUs.transparencyThem': 'Frais cachés fréquents',
  'whyUs.mascot': 'Mascotte préférée',
  'whyUs.mascotUs': 'Arthur, le super-héros !',
  'whyUs.mascotThem': 'Aucune mascotte 😢',
  'whyUs.didYouKnow': 'Saviez-vous que',
  'whyUs.9outOf10': '9 clients sur 10',
  'whyUs.save': 'économisent',
  'whyUs.perYear': 'par an',
  'whyUs.googleReviews': 'sur Google Reviews • +250 avis',
  'whyUs.service100': 'Service 100%',
  'whyUs.freeService': 'Gratuit',
  'whyUs.data': 'Données',
  'whyUs.secured': 'Sécurisées',
  'whyUs.arthurSays': 'Arthur vous dit :',
  'whyUs.arthurQuote': '"Je négocie pour vous les',
  'whyUs.bestRates': 'meilleurs tarifs',
  
  // SEO FAQ
  'seoFaq.title': 'Questions fréquentes',
  'seoFaq.subtitle': "Tout ce que vous devez savoir sur la comparaison d'assurances",
  'seoFaq.q1': 'Comment économiser sur mon assurance auto ?',
  'seoFaq.a1': "Pour économiser sur votre assurance auto, comparez les offres de plusieurs assureurs grâce à notre comparateur gratuit. Analysez les garanties proposées, ajustez votre franchise, et profitez des réductions pour bon conducteur. En moyenne, nos utilisateurs économisent 320€ par an sur leur assurance auto.",
  'seoFaq.q2': 'Est-ce vraiment gratuit ?',
  'seoFaq.a2': "Oui, notre service de comparaison est 100% gratuit et sans engagement. Nous sommes rémunérés par les assureurs partenaires uniquement si vous souscrivez à une offre. Vous ne payez jamais de frais supplémentaires pour utiliser notre comparateur.",
  'seoFaq.q3': "Puis-je changer d'assurance n'importe quand ?",
  'seoFaq.a3': "Depuis la loi Hamon de 2015, vous pouvez résilier votre contrat d'assurance auto, moto ou habitation à tout moment après la première année de souscription. Pour l'assurance santé, la résiliation est possible à la date d'anniversaire du contrat avec un préavis de 2 mois, ou à tout moment après la première année grâce à la résiliation infra-annuelle.",
  'seoFaq.moreQuestions': "D'autres questions ?",
  'seoFaq.arthurHere': 'est là pour vous !',
  
  // Quick Quote
  'quickQuote.srTitle': "Simulateur d'assurance auto et santé",
  'quickQuote.title': 'Mon Devis Rapide',
  'quickQuote.subtitle': 'Arthur calcule votre économie en 30 secondes',
  'quickQuote.vehicleQuestion': 'Quel est votre véhicule ?',
  'quickQuote.ageQuestion': 'Quel est votre âge ?',
  'quickQuote.contactQuestion': 'Vos coordonnées pour le devis',
  'quickQuote.emailLabel': 'Votre email',
  'quickQuote.phoneLabel': 'Votre téléphone',
  'quickQuote.privacyNote': "Un expert vous rappelle pour vous proposer le meilleur tarif. Vos données sont protégées et ne seront jamais partagées.",
  'quickQuote.submit': 'Recevoir mon devis',
  'quickQuote.sending': 'Envoi en cours...',
  'quickQuote.successTitle': 'Demande envoyée !',
  'quickQuote.successText': 'Un expert vous rappelle dans les',
  'quickQuote.successTime': '2 heures',
  'quickQuote.successEnd': 'pour vous proposer le meilleur tarif.',
  'quickQuote.successCheck': 'Vérifiez votre téléphone et votre email.',
  'quickQuote.secureData': '🔒 Vos données sont sécurisées et confidentielles',
  'quickQuote.citadine': 'Citadine',
  'quickQuote.citadineDesc': 'Petite voiture de ville',
  'quickQuote.berline': 'Berline',
  'quickQuote.berlineDesc': 'Confort et espace',
  'quickQuote.suv': 'SUV / 4x4',
  'quickQuote.suvDesc': 'Tout-terrain',
  'quickQuote.toastSuccess': 'Demande envoyée ! Nous vous contactons très vite.',
  'quickQuote.toastError': 'Erreur. Veuillez réessayer.',
  
  // Guides
  'guides.mainTitle': 'Tout savoir pour payer moins cher',
  'guides.mainSubtitle': "Arthur partage ses meilleurs conseils pour optimiser vos contrats d'assurance",
  'guides.arthurSpeech': 'À lire ! 📚',
  'guides.cta': 'Lancer mon comparatif gratuit',
  'guides.article1.title': 'Loi Hamon : comment résilier ?',
  'guides.article1.excerpt': "Résiliez votre assurance à tout moment après 1 an de contrat.",
  'guides.article2.title': '5 astuces pour réduire sa prime',
  'guides.article2.excerpt': "Découvrez nos conseils d'experts pour économiser jusqu'à 40%.",
  'guides.article3.title': 'Jeune conducteur : quel budget ?',
  'guides.article3.excerpt': "Guide complet pour assurer votre première voiture au meilleur prix.",
  
  // Sticky CTA
  'stickyCta.text': 'Lancer mon comparatif gratuitement',
  
  // Insurance labels for footer
  'footer.autoInsurance': 'Assurance Auto',
  'footer.motoInsurance': 'Assurance Moto',
  'footer.homeInsurance': 'Assurance Habitation',
  'footer.healthInsurance': 'Assurance Santé',
  'footer.petInsurance': 'Assurance Animaux',
  'footer.lifeInsurance': 'Assurance Vie',
  'footer.whoAreWe': 'Qui sommes-nous ?',
  'footer.ourPartners': 'Nos partenaires',
  
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
  'footer.description': 'Compare the best insurance in France. Free, fast and no commitment.',
  'footer.legalSection': 'Legal',
  'footer.privacyPolicy': 'Privacy Policy',
  'footer.cookiePolicy': 'Cookie Policy',
  
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
  'common.back': 'Back',
  'common.continue': 'Continue',
  'common.send': 'Send',
  'common.readMore': 'Read more',
  'common.advice': 'Tip',
  
  // How it works
  'howItWorks.title': 'How It Works',
  'howItWorks.subtitle': 'Comparing insurance has never been easier',
  'howItWorks.step1.title': 'Fill in my profile',
  'howItWorks.step1.description': 'In 2 minutes, describe your insurance needs.',
  'howItWorks.step2.title': 'Compare offers',
  'howItWorks.step2.description': 'Arthur analyses 50+ insurers for you.',
  'howItWorks.step3.title': 'Get a callback right away',
  'howItWorks.step3.description': 'Choose the best offer and get called back.',
  'howItWorks.arthurCta': 'takes care of everything!',
  
  // Why us
  'whyUs.title': 'Why Choose Us?',
  'whyUs.subtitle': 'Discover what sets us apart from other comparison sites',
  'whyUs.criteria': 'Criteria',
  'whyUs.others': 'Other comparison sites',
  'whyUs.othersMobile': 'Others',
  'whyUs.speed': 'Speed',
  'whyUs.speedUs': 'Quote in 2 minutes',
  'whyUs.speedThem': 'Up to 15 minutes',
  'whyUs.insurerCount': 'Number of insurers',
  'whyUs.insurerCountUs': '50+ partners',
  'whyUs.insurerCountThem': '10-20 insurers',
  'whyUs.transparency': 'Price transparency',
  'whyUs.transparencyUs': 'No surprise pricing',
  'whyUs.transparencyThem': 'Frequent hidden fees',
  'whyUs.mascot': 'Favourite mascot',
  'whyUs.mascotUs': 'Arthur, the superhero!',
  'whyUs.mascotThem': 'No mascot 😢',
  'whyUs.didYouKnow': 'Did you know that',
  'whyUs.9outOf10': '9 out of 10 customers',
  'whyUs.save': 'save',
  'whyUs.perYear': 'per year',
  'whyUs.googleReviews': 'on Google Reviews • 250+ reviews',
  'whyUs.service100': '100% Service',
  'whyUs.freeService': 'Free',
  'whyUs.data': 'Data',
  'whyUs.secured': 'Secured',
  'whyUs.arthurSays': 'Arthur says:',
  'whyUs.arthurQuote': '"I negotiate the',
  'whyUs.bestRates': 'best rates',
  
  // SEO FAQ
  'seoFaq.title': 'Frequently Asked Questions',
  'seoFaq.subtitle': 'Everything you need to know about insurance comparison',
  'seoFaq.q1': 'How can I save on my car insurance?',
  'seoFaq.a1': 'To save on your car insurance, compare offers from multiple insurers with our free comparison tool. Analyse the coverage offered, adjust your deductible, and take advantage of safe driver discounts. On average, our users save €320 per year on their car insurance.',
  'seoFaq.q2': 'Is it really free?',
  'seoFaq.a2': 'Yes, our comparison service is 100% free with no commitment. We are only compensated by partner insurers if you take out a policy. You never pay any additional fees to use our comparison tool.',
  'seoFaq.q3': 'Can I switch insurance at any time?',
  'seoFaq.a3': "Since the Hamon law of 2015, you can cancel your car, motorcycle or home insurance contract at any time after the first year. For health insurance, cancellation is possible on the contract anniversary date with 2 months' notice, or at any time after the first year thanks to infra-annual cancellation.",
  'seoFaq.moreQuestions': 'More questions?',
  'seoFaq.arthurHere': 'is here for you!',
  
  // Quick Quote
  'quickQuote.srTitle': 'Auto and health insurance simulator',
  'quickQuote.title': 'My Quick Quote',
  'quickQuote.subtitle': 'Arthur calculates your savings in 30 seconds',
  'quickQuote.vehicleQuestion': 'What is your vehicle?',
  'quickQuote.ageQuestion': 'How old are you?',
  'quickQuote.contactQuestion': 'Your contact details for the quote',
  'quickQuote.emailLabel': 'Your email',
  'quickQuote.phoneLabel': 'Your phone',
  'quickQuote.privacyNote': 'An expert will call you back to offer the best rate. Your data is protected and will never be shared.',
  'quickQuote.submit': 'Get my quote',
  'quickQuote.sending': 'Sending...',
  'quickQuote.successTitle': 'Request sent!',
  'quickQuote.successText': 'An expert will call you back within',
  'quickQuote.successTime': '2 hours',
  'quickQuote.successEnd': 'to offer you the best rate.',
  'quickQuote.successCheck': 'Check your phone and email.',
  'quickQuote.secureData': '🔒 Your data is secure and confidential',
  'quickQuote.citadine': 'City car',
  'quickQuote.citadineDesc': 'Small city car',
  'quickQuote.berline': 'Sedan',
  'quickQuote.berlineDesc': 'Comfort and space',
  'quickQuote.suv': 'SUV / 4x4',
  'quickQuote.suvDesc': 'Off-road',
  'quickQuote.toastSuccess': 'Request sent! We will contact you very soon.',
  'quickQuote.toastError': 'Error. Please try again.',
  
  // Guides
  'guides.mainTitle': 'Everything you need to pay less',
  'guides.mainSubtitle': 'Arthur shares his best tips to optimise your insurance contracts',
  'guides.arthurSpeech': 'Must read! 📚',
  'guides.cta': 'Start my free comparison',
  'guides.article1.title': 'Hamon Law: how to cancel?',
  'guides.article1.excerpt': 'Cancel your insurance at any time after 1 year of contract.',
  'guides.article2.title': '5 tips to reduce your premium',
  'guides.article2.excerpt': "Discover our expert advice to save up to 40%.",
  'guides.article3.title': 'New driver: what budget?',
  'guides.article3.excerpt': 'Complete guide to insuring your first car at the best price.',
  
  // Sticky CTA
  'stickyCta.text': 'Start my free comparison',
  
  // Insurance labels for footer
  'footer.autoInsurance': 'Car Insurance',
  'footer.motoInsurance': 'Motorcycle Insurance',
  'footer.homeInsurance': 'Home Insurance',
  'footer.healthInsurance': 'Health Insurance',
  'footer.petInsurance': 'Pet Insurance',
  'footer.lifeInsurance': 'Life Insurance',
  'footer.whoAreWe': 'About Us',
  'footer.ourPartners': 'Our Partners',
  
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