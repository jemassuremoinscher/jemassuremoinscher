import {
  Car, Bike, Home, Heart, ShieldCheck, Building2, Briefcase, Wallet,
  HeartPulse, HardHat, PartyPopper,
  Users, TrendingDown, Clock, Award, CheckCircle2, Phone, Sparkles, Lock, Shield, FileCheck,
} from "lucide-react";
import type { AdsLandingProps } from "@/components/landing/AdsLandingTemplate";
import { TROTTINETTE_RC_PRICE_MONTHLY, NB_ASSUREURS_LABEL } from "@/config/site";

import arthurCar from "@/assets/mascotte/arthur-car.webp?w=480&format=webp";
import arthurMoto from "@/assets/mascotte/arthur-moto.webp?w=480&format=webp";
import arthurHouse from "@/assets/mascotte/arthur-house.webp?w=480&format=webp";
import arthurSick from "@/assets/mascotte/arthur-sick.webp";
import arthurThinking from "@/assets/mascotte/arthur-thinking.webp";
import arthurAnimals from "@/assets/mascotte/arthur-animals.webp";
import arthurIdea from "@/assets/mascotte/arthur-idea.webp";
import arthurInjured from "@/assets/mascotte/arthur-injured.webp";
import arthurBusiness from "@/assets/mascotte/arthur-business.webp";
import arthurDetective from "@/assets/mascotte/arthur-detective.webp";
import arthurThumbsUp from "@/assets/mascotte/arthur-thumbs-up.webp";
import arthurRunningCoin from "@/assets/mascotte/arthur-running-coin.webp";
import arthurClimbing from "@/assets/mascotte/arthur-climbing.webp";
import arthurKayak from "@/assets/mascotte/arthur-kayak.webp";
import arthurBtp from "@/assets/mascotte/arthur-btp.webp";
import arthurExcited from "@/assets/mascotte/arthur-excited.webp";
import arthurFlying from "@/assets/mascotte/arthur-flying.webp";
import arthurBike from "@/assets/mascotte/arthur-bike.png";
import arthurScoot from "@/assets/mascotte/arthur-scoot.png?w=480&format=webp";
const trustReviewStat = { icon: ShieldCheck, value: "ORIAS", label: "n° 26011100 · courtier indépendant" };

const baseAdvantages = [
  { icon: CheckCircle2, title: "100% gratuit & sans engagement", description: "Aucune carte bancaire, aucun frais caché." },
  { icon: Award, title: `${NB_ASSUREURS_LABEL} assureurs et courtiers comparés`, description: "AXA, Allianz, MAIF, Matmut, Generali et bien d'autres." },
  { icon: Phone, title: "Expert dédié — rappel rapide par un conseiller", description: "Un humain, jamais un robot, pour finaliser." },
  { icon: Lock, title: "Données protégées RGPD", description: "Site SSL, hébergement France, courtier ORIAS." },
];

export const landingConfigs: Record<string, AdsLandingProps | { fr: AdsLandingProps; en: AdsLandingProps }> = {
  // ────────────────────────────── Particuliers ──────────────────────────────
  auto: {
    fr: {
      slug: "auto",
      trackingTitle: "Landing Page Assurance Auto",
      seoTitle: "Assurance auto moins chère | Devis gratuit en 2 min avec Arthur",
      seoDescription: `Compare ${NB_ASSUREURS_LABEL} assureurs et courtiers auto avec Arthur en 2 minutes. Service gratuit, sans engagement, courtier indépendant ORIAS. Rappel rapide par un conseiller.`,
      seoKeyword: "assurance auto moins chère",
      seoKeywords: "devis assurance auto, comparateur assurance voiture, assurance auto pas chère",
      // Désindexée le 2026-09-21 : même sujet que le pilier /assurance-auto (cannibalisation),
      // même traitement que les configs velo, trottinette et les 8 sujets traités avant elle.
      noindex: true,
      topBarText: "Devis gratuit en 2 minutes — rappel rapide par un conseiller",
      badgeText: "Comparateur indépendant ORIAS",
      heroTitle: "Ton assurance auto,",
      heroHighlight: "comparée en 2 minutes",
      heroSubtitle: <>Arthur compare <strong className="text-primary">{NB_ASSUREURS_LABEL} assureurs et courtiers partenaires</strong> et te trouve le meilleur tarif, sans compromis sur les garanties.</>,
      mascotSrc: arthurCar,
      mascotAlt: "Arthur au volant — Comparateur assurance auto jemassuremoinscher.fr",
      speechText: `Salut ! Je compare ${NB_ASSUREURS_LABEL} assureurs et courtiers auto pour toi en 2 minutes.`,
      insuranceType: "auto",
      insuranceLabel: "Assurance Auto",
      // trustReviewStat retiré ici : badgeText affiche déjà "Comparateur
      // indépendant ORIAS" juste au-dessus du hero — pas de doublon.
      stats: [
        { icon: Clock, value: "2 min", label: "Pour ton devis" },
      ],
      advantages: [
        { icon: CheckCircle2, title: "100 % gratuit & sans engagement", description: "Aucune carte bancaire demandée, aucun frais caché." },
        { icon: Award, title: `${NB_ASSUREURS_LABEL} assureurs et courtiers comparés`, description: "AXA, Allianz, MAIF, Matmut, Generali, Direct Assurance, MACIF et bien d'autres." },
        { icon: Phone, title: "Un expert dédié, pas un robot", description: "Arthur fait l'analyse, un conseiller humain te rappelle pour finaliser." },
        { icon: Lock, title: "Données protégées RGPD", description: "Site SSL, hébergement France, courtier inscrit à l'ORIAS." },
      ],
      testimonials: [],
      faqs: [
        { question: "Comment Arthur compare-t-il les assurances auto ?", answer: `Tu remplis le formulaire en 2 minutes avec ton véhicule et ton profil. Arthur interroge en temps réel les ${NB_ASSUREURS_LABEL} assureurs et courtiers partenaires et te présente les meilleures offres adaptées à ton profil.` },
        { question: "Combien puis-je économiser ?", answer: `Cela dépend de ton profil et de ton contrat actuel. Un conseiller compare ta situation à celle de nos ${NB_ASSUREURS_LABEL} assureurs et courtiers partenaires pour identifier une économie réelle, sans engagement.` },
        { question: "Le service est-il vraiment gratuit ?", answer: "Oui, 100 % gratuit et sans engagement. Aucune carte bancaire demandée. Un conseiller te rappelle rapidement, en général dans l'heure aux heures d'ouverture, pour t'accompagner si tu le souhaites." },
        { question: "Puis-je changer d'assurance à tout moment ?", answer: "Oui, dès la première année grâce à la loi Hamon. Nous nous occupons gratuitement de la résiliation de ton ancien contrat." },
      ],
      bottomCtaTitle: "Prêt à comparer ton assurance auto ?",
      bottomCtaDescription: "Devis gratuit en 2 minutes — rappel rapide par un conseiller.",
    },
    en: {
      slug: "auto",
      trackingTitle: "Landing Page Car Insurance",
      seoTitle: "Cheaper car insurance | Free quote in 2 min with Arthur",
      seoDescription: `Compare ${NB_ASSUREURS_LABEL} car insurers with Arthur in 2 minutes. Free, no commitment, independent ORIAS-registered broker. Quick callback from an advisor.`,
      seoKeyword: "cheaper car insurance",
      seoKeywords: "car insurance quote, car insurance comparison, cheap car insurance France",
      // Désindexée le 2026-09-21 : même sujet que le pilier /assurance-auto (cannibalisation),
      // même traitement que les configs velo, trottinette et les 8 sujets traités avant elle.
      noindex: true,
      topBarText: "Free quote in 2 minutes — quick callback from an advisor",
      badgeText: "Independent ORIAS broker",
      heroTitle: "Your car insurance,",
      heroHighlight: "compared in 2 minutes",
      heroSubtitle: <>Arthur compares <strong className="text-primary">{NB_ASSUREURS_LABEL} partner insurers and brokers</strong> and finds the best rate, without compromising on cover.</>,
      mascotSrc: arthurCar,
      mascotAlt: "Arthur driving — car insurance comparator jemassuremoinscher.fr",
      speechText: `Hi! I'll compare ${NB_ASSUREURS_LABEL} car insurers for you in 2 minutes.`,
      insuranceType: "auto",
      insuranceLabel: "Car Insurance",
      // "Verified reviews" retiré : badgeText affiche déjà "Independent
      // ORIAS broker" juste au-dessus du hero — pas de doublon.
      stats: [
        { icon: Clock, value: "2 min", label: "For your quote" },
      ],
      advantages: [
        { icon: CheckCircle2, title: "100% free & no commitment", description: "No credit card required, no hidden fees." },
        { icon: Award, title: `${NB_ASSUREURS_LABEL} insurers compared`, description: "AXA, Allianz, MAIF, Matmut, Generali, Direct Assurance, MACIF and many more." },
        { icon: Phone, title: "A dedicated expert, not a bot", description: "Arthur runs the analysis, a human advisor calls you back to finalise." },
        { icon: Lock, title: "GDPR-protected data", description: "SSL site, France-based hosting, ORIAS-registered broker." },
      ],
      testimonials: [],
      faqs: [
        { question: "How does Arthur compare car insurance?", answer: `You fill in the 2-minute form with your vehicle and profile. Arthur queries the ${NB_ASSUREURS_LABEL} partner insurers and brokers in real time and shows you the best offers for your profile.` },
        { question: "How much can I save?", answer: `It depends on your profile and current contract. An advisor compares your situation with the ${NB_ASSUREURS_LABEL} partner insurers and brokers to find real savings, with no commitment.` },
        { question: "Is the service really free?", answer: "Yes, 100% free and no commitment. No credit card required. An advisor calls you back quickly, usually within the hour during business hours, to help if you'd like." },
        { question: "Can I switch insurance anytime?", answer: "Yes, after the first year thanks to the Hamon law. We handle the cancellation of your previous contract for free." },
      ],
      bottomCtaTitle: "Ready to compare your car insurance?",
      bottomCtaDescription: "Free quote in 2 minutes — quick callback from an advisor.",
    },
  },

  moto: {
    slug: "moto",
    trackingTitle: "Landing Page Assurance Moto",
    seoTitle: "Assurance Moto Moins Chère | Devis Gratuit",
    seoDescription: "Comparez les assurances moto en 2 min. Rappel rapide par un conseiller.",
    seoKeyword: "assurance moto moins chère",
    seoKeywords: "devis assurance moto, comparateur moto, assurance scooter",
    // Désindexée le 2026-09-21 : même sujet que le pilier /assurance-moto (cannibalisation),
    // même traitement que les configs velo, trottinette et les 8 sujets traités avant elle.
    noindex: true,
    topBarText: "🏍️ Offre Moto : assistance 0 km offerte",
    badgeText: "Spécialiste 2-roues",
    heroTitle: "Assurance moto",
    heroHighlight: "comparée en 2 minutes",
    heroSubtitle: <>Tous types de cylindrées — du 50 cm³ au gros cube. Devis personnalisé en 2 minutes.</>,
    mascotSrc: arthurMoto,
    mascotAlt: "Arthur en moto — comparateur assurance 2-roues",
    speechText: "Roulez serein : assureurs moto comparés en 2 minutes !",
    insuranceType: "moto",
    insuranceLabel: "Assurance Moto",
    stats: [
      trustReviewStat,
      { icon: Clock, value: "2 min", label: "Pour le devis" },
    ],
    advantages: baseAdvantages,
    testimonials: [],
    faqs: [
      { question: "Quelles motos puis-je assurer ?", answer: "Toutes : 50 cm³, scooters, A2, A, gros cube, custom et trail." },
      { question: "Est-ce moins cher qu'en agence ?", answer: "La mise en concurrence de plusieurs assureurs permet souvent de trouver un tarif plus avantageux." },
      { question: "Puis-je résilier à tout moment ?", answer: "Oui, dès la 1ère année grâce à la loi Hamon. Nous nous occupons de la résiliation." },
    ],
    bottomCtaTitle: "Trouvez la meilleure assurance moto",
    bottomCtaDescription: "Comparez des assureurs spécialistes 2-roues — devis en 2 min.",
  },

  habitation: {
    slug: "habitation",
    trackingTitle: "Landing Page Assurance Habitation",
    seoTitle: "Assurance Habitation Moins Chère | Devis Gratuit",
    seoDescription: "Comparez les assurances habitation en 2 min. Locataire ou propriétaire.",
    seoKeyword: "assurance habitation moins chère",
    seoKeywords: "devis assurance habitation, MRH locataire, MRH propriétaire",
    // Désindexée le 2026-09-21 : même sujet que le pilier /assurance-habitation (cannibalisation),
    // même traitement que les configs velo, trottinette et les 8 sujets traités avant elle.
    noindex: true,
    topBarText: "🏠 Assurance habitation : locataire ou propriétaire, devis en 2 minutes",
    badgeText: "Locataires & Propriétaires",
    heroTitle: "Assurance habitation",
    heroHighlight: "au juste prix",
    heroSubtitle: <>Studio, appartement ou maison — couverture complète, prix imbattable.</>,
    mascotSrc: arthurHouse,
    mascotAlt: "Arthur devant sa maison — comparateur assurance habitation",
    speechText: "Votre toit mérite la meilleure assurance, au meilleur prix !",
    insuranceType: "habitation",
    insuranceLabel: "Assurance Habitation",
    stats: [
      trustReviewStat,
      { icon: Clock, value: "2 min", label: "Pour le devis" },
    ],
    advantages: baseAdvantages,
    testimonials: [],
    faqs: [
      { question: "Que couvre une assurance habitation ?", answer: "Incendie, dégâts des eaux, vol, vandalisme, responsabilité civile et catastrophes naturelles." },
      { question: "Est-elle obligatoire ?", answer: "Obligatoire pour les locataires et copropriétaires. Vivement recommandée pour les propriétaires." },
      { question: "Comment recevoir mon attestation ?", answer: "Un conseiller vous l'envoie par email après la souscription." },
    ],
    bottomCtaTitle: "Protégez votre logement dès aujourd'hui",
    bottomCtaDescription: "Devis personnalisé en 2 min — rappel rapide par un conseiller.",
  },

  sante: {
    slug: "sante",
    trackingTitle: "Landing Page Mutuelle Santé",
    seoTitle: "Mutuelle Santé Moins Chère | Devis Gratuit en 2 min",
    seoDescription: "Comparez les mutuelles santé. Sans questionnaire médical.",
    seoKeyword: "mutuelle santé moins chère",
    seoKeywords: "devis mutuelle, comparateur mutuelle santé, complémentaire santé",
    // Désindexée le 2026-09-21 : même sujet que le pilier /assurance-sante (cannibalisation),
    // même traitement que les configs velo, trottinette et les 8 sujets traités avant elle.
    noindex: true,
    topBarText: "❤️ Mutuelle santé : sans questionnaire médical",
    badgeText: "Sans questionnaire médical",
    heroTitle: "Mutuelle santé",
    heroHighlight: "adaptée à votre budget",
    heroSubtitle: <>Soins, optique, dentaire, hospitalisation. Couverture renforcée pour toute la famille.</>,
    mascotSrc: arthurSick,
    mascotAlt: "Arthur en blouse — comparateur mutuelle santé",
    speechText: "Bien remboursé, c'est mieux. Je trouve la mutuelle qu'il vous faut !",
    insuranceType: "sante",
    insuranceLabel: "Mutuelle Santé",
    stats: [
      trustReviewStat,
      { icon: Clock, value: "2 min", label: "Pour le devis" },
    ],
    advantages: baseAdvantages,
    testimonials: [],
    faqs: [
      { question: "Y a-t-il un questionnaire médical ?", answer: "Non, aucune de nos mutuelles partenaires n'impose de questionnaire médical." },
      { question: "Combien de temps pour changer de mutuelle ?", answer: "Grâce à la loi Hamon, vous pouvez résilier après 1 an, à tout moment, sans frais." },
      { question: "La mutuelle prend-elle effet immédiatement ?", answer: "Oui, prise en charge dès le 1er jour, sans délai de carence sur les soins courants." },
    ],
    bottomCtaTitle: "Mieux remboursé, moins cher",
    bottomCtaDescription: "Comparez 25+ mutuelles en 2 min, sans questionnaire médical.",
  },

  pret: {
    slug: "pret",
    trackingTitle: "Landing Page Assurance Emprunteur",
    // "-60 %" retiré du seoTitle uniquement (non sourcé), même logique que
    // gli/animaux ci-dessus — corps de page hors périmètre de cette demande.
    seoTitle: "Assurance Emprunteur | Loi Lemoine 2026",
    seoDescription: "Changez d'assurance de prêt à tout moment grâce à la loi Lemoine. Devis gratuit.",
    seoKeyword: "assurance emprunteur moins chère",
    seoKeywords: "loi Lemoine, délégation assurance emprunteur, ADE",
    // Désindexée le 2026-09-21 : même sujet que le pilier /assurance-pret (cannibalisation),
    // même traitement que les configs velo, trottinette et les 8 sujets traités avant elle.
    noindex: true,
    topBarText: "💰 Loi Lemoine : changez d'assurance emprunteur à tout moment",
    badgeText: "Loi Lemoine 2026",
    heroTitle: "Assurance prêt immobilier",
    heroHighlight: "sans attendre l'échéance",
    heroSubtitle: <>La loi Lemoine vous permet de changer d'assurance emprunteur à tout moment. Profitez-en.</>,
    mascotSrc: arthurThinking,
    mascotAlt: "Arthur calcule — assurance emprunteur",
    speechText: "Une assurance emprunteur 4× moins chère, c'est possible. Je vous montre !",
    insuranceType: "pret",
    insuranceLabel: "Assurance Emprunteur",
    stats: [
      trustReviewStat,
      { icon: Clock, value: "2 min", label: "Pour le devis" },
    ],
    advantages: baseAdvantages,
    testimonials: [],
    faqs: [
      { question: "Qu'est-ce que la loi Lemoine ?", answer: "Depuis juin 2022, vous pouvez changer d'assurance emprunteur à tout moment, sans frais." },
      { question: "Ma banque peut-elle refuser ?", answer: "Non, si les garanties sont équivalentes elle est tenue d'accepter (équivalence des garanties)." },
      { question: "En combien de temps c'est effectif ?", answer: "Comptez 2 à 4 semaines entre la souscription et la prise d'effet du nouveau contrat." },
    ],
    bottomCtaTitle: "Réduisez le coût de votre assurance de prêt",
    bottomCtaDescription: "Profitez de la loi Lemoine — devis personnalisé en 2 min.",
  },

  vie: {
    slug: "vie",
    trackingTitle: "Landing Page Assurance Vie",
    seoTitle: "Assurance Vie | Comparateur Gratuit",
    seoDescription: "Découvrez les meilleurs contrats d'assurance vie. Frais réduits, fonds €, unités de compte.",
    seoKeyword: "meilleure assurance vie",
    seoKeywords: "contrat assurance vie, placement assurance vie, fonds euros",
    // Désindexée le 2026-09-21 : même sujet que le pilier /assurance-vie (cannibalisation),
    // même traitement que les configs velo, trottinette et les 8 sujets traités avant elle.
    noindex: true,
    topBarText: "💼 Assurance vie : comparez frais et supports",
    badgeText: "Sans frais d'entrée",
    heroTitle: "Assurance vie",
    heroHighlight: "sans frais d'entrée",
    heroSubtitle: <>Préparez votre avenir, transmettez votre patrimoine. Placement souple et fiscalité optimisée.</>,
    mascotSrc: arthurIdea,
    mascotAlt: "Arthur ampoule — épargne assurance vie",
    speechText: "Faites travailler votre épargne avec les meilleurs contrats du marché !",
    insuranceType: "vie",
    insuranceLabel: "Assurance Vie",
    stats: [
      trustReviewStat,
      { icon: Clock, value: "2 min", label: "Pour le devis" },
    ],
    advantages: baseAdvantages,
    testimonials: [],
    faqs: [
      { question: "Quel ticket d'entrée ?", answer: "Le montant du premier versement varie selon les contrats — certains sont accessibles avec un montant réduit." },
      { question: "Mon argent est-il bloqué ?", answer: "Non, votre épargne reste disponible à tout moment (rachat partiel ou total)." },
      { question: "Quelle fiscalité après 8 ans ?", answer: "Abattement annuel de 4 600 € (9 200 € pour un couple) sur les gains." },
    ],
    bottomCtaTitle: "Faites travailler votre épargne",
    bottomCtaDescription: "Devis personnalisé en 2 min — sans frais d'entrée.",
  },

  prevoyance: {
    slug: "prevoyance",
    trackingTitle: "Landing Page Assurance Prévoyance",
    seoTitle: "Assurance Prévoyance | Maintien de salaire",
    seoDescription: "Protégez vos revenus en cas d'arrêt de travail, invalidité ou décès. Devis gratuit.",
    seoKeyword: "assurance prévoyance",
    seoKeywords: "garantie maintien de salaire, prévoyance TNS, prévoyance famille",
    // Désindexée le 2026-09-21 : même sujet que le pilier /assurance-prevoyance (cannibalisation),
    // même traitement que les configs velo, trottinette et les 8 sujets traités avant elle.
    noindex: true,
    topBarText: "🛡️ Prévoyance : arrêt de travail, invalidité, décès",
    badgeText: "Maintien de revenus garanti",
    heroTitle: "Prévoyance",
    heroHighlight: "adaptée à votre profil",
    heroSubtitle: <>Arrêt de travail, invalidité, décès — votre famille à l'abri quoi qu'il arrive.</>,
    mascotSrc: arthurInjured,
    mascotAlt: "Arthur protégé — assurance prévoyance",
    speechText: "Anticiper, c'est protéger ceux qu'on aime !",
    insuranceType: "prevoyance",
    insuranceLabel: "Prévoyance",
    stats: [
      trustReviewStat,
      { icon: Clock, value: "2 min", label: "Pour le devis" },
    ],
    advantages: baseAdvantages,
    testimonials: [],
    faqs: [
      { question: "À qui s'adresse la prévoyance ?", answer: "Indépendants, salariés sans bonne couverture, parents : tous ceux qui veulent sécuriser leurs revenus." },
      { question: "Y a-t-il une franchise ?", answer: "Variable selon contrat (de 0 à 90 jours). Plus la franchise est courte, plus la prime est élevée." },
      { question: "Mes proches sont-ils protégés ?", answer: "Oui, capital décès et rente éducation pour conjoint et enfants en cas de décès." },
    ],
    bottomCtaTitle: "Protégez vos revenus et votre famille",
    bottomCtaDescription: "Devis personnalisé en 2 min — couverture complète.",
  },

  animaux: {
    slug: "animaux",
    trackingTitle: "Landing Page Assurance Animaux",
    seoTitle: "Assurance Animaux | Comparateur",
    seoDescription: "Mutuelle santé chien et chat : comparez les remboursements des frais vétérinaires.",
    seoKeyword: "assurance animaux moins chère",
    seoKeywords: "mutuelle chien, mutuelle chat, assurance santé animale",
    // Désindexée le 2026-09-21 : même sujet que le pilier /assurance-animaux (cannibalisation),
    // même traitement que les configs velo, trottinette et les 8 sujets traités avant elle.
    // "dès 8 €/mois" retiré du titre et du heroHighlight (non sourcé, même
    // défaut que les prix retirés ailleurs).
    noindex: true,
    topBarText: "🐾 Assurance chien et chat : comparez les formules",
    badgeText: "Chien & Chat",
    heroTitle: "Assurance pour vos animaux",
    heroHighlight: "Chien & chat",
    heroSubtitle: <>Vétérinaire, chirurgie, médicaments : le taux de remboursement dépend de la formule choisie.</>,
    mascotSrc: arthurAnimals,
    mascotAlt: "Arthur avec chien & chat — assurance animaux",
    speechText: "Vos boules de poils méritent les meilleurs soins !",
    insuranceType: "animaux",
    insuranceLabel: "Assurance Animaux",
    stats: [
      trustReviewStat,
      { icon: Clock, value: "2 min", label: "Pour le devis" },
    ],
    advantages: baseAdvantages,
    testimonials: [],
    faqs: [
      { question: "Mon animal est-il éligible ?", answer: "Oui, chiens et chats de 2 mois à 7-10 ans selon les contrats (sans race exclue)." },
      { question: "Quel est le délai de carence ?", answer: "Généralement 7 jours pour la maladie, 48 h pour l'accident." },
      { question: "Combien suis-je remboursé ?", answer: "Le taux de remboursement dépend de la formule choisie, dans la limite du plafond annuel du contrat." },
    ],
    bottomCtaTitle: "Protégez la santé de votre compagnon",
    bottomCtaDescription: "Devis personnalisé en 2 min — comparez les assureurs spécialisés.",
  },

  // ────────────────────────────── Pros ──────────────────────────────
  "rc-pro": {
    slug: "rc-pro",
    trackingTitle: "Landing Page Assurance RC Pro",
    seoTitle: "Assurance RC Pro | Tous métiers",
    seoDescription: "Responsabilité civile professionnelle pour TPE, indépendants et auto-entrepreneurs.",
    seoKeyword: "assurance rc pro moins chère",
    seoKeywords: "responsabilité civile professionnelle, RC pro indépendant, RC auto-entrepreneur",
    // Désindexée le 2026-09-21 : même sujet que le pilier /assurance-rc-pro (cannibalisation),
    // même traitement que les configs velo, trottinette et les 8 sujets traités avant elle.
    noindex: true,
    topBarText: "💼 RC Pro : adaptée à votre métier",
    badgeText: "Tous métiers",
    heroTitle: "Responsabilité Civile Pro",
    heroHighlight: "adaptée à votre métier",
    heroSubtitle: <>Indépendants, TPE, auto-entrepreneurs — protégez votre activité contre les sinistres clients.</>,
    mascotSrc: arthurBusiness,
    mascotAlt: "Arthur en costume — RC Pro",
    speechText: "Une RC Pro adaptée à votre métier, en 2 minutes !",
    insuranceType: "rc_pro",
    insuranceLabel: "RC Pro",
    stats: [
      trustReviewStat,
      { icon: Clock, value: "2 min", label: "Pour le devis" },
    ],
    advantages: baseAdvantages,
    testimonials: [],
    faqs: [
      { question: "La RC Pro est-elle obligatoire ?", answer: "Obligatoire pour les professions réglementées (santé, juridique, immobilier, BTP), recommandée pour tous les autres." },
      { question: "Couvre-t-elle les dommages corporels ?", answer: "Oui, dommages corporels, matériels et immatériels causés à des tiers (clients, prestataires)." },
      { question: "Comment recevoir mon attestation ?", answer: "Un conseiller vous l'envoie par email après la souscription." },
    ],
    bottomCtaTitle: "Protégez votre activité dès aujourd'hui",
    bottomCtaDescription: "RC Pro adaptée à votre métier — rappel rapide par un conseiller.",
  },

  mrp: {
    slug: "mrp",
    trackingTitle: "Landing Page Assurance MRP",
    seoTitle: "Assurance MRP | Multirisque Pro",
    seoDescription: "Multirisque professionnelle : locaux, matériel, perte d'exploitation. Devis gratuit.",
    seoKeyword: "assurance mrp moins chère",
    seoKeywords: "multirisque professionnelle, assurance local commercial, assurance perte d'exploitation",
    // Désindexée le 2026-09-21 : même sujet que le pilier /assurance-mrp (cannibalisation),
    // même traitement que les configs velo, trottinette et les 8 sujets traités avant elle.
    noindex: true,
    topBarText: "🏢 Multirisque pro : locaux, matériel, perte d'exploitation",
    badgeText: "Locaux & Matériel",
    heroTitle: "Multirisque Pro",
    heroHighlight: "protection complète",
    heroSubtitle: <>Locaux, matériel, marchandises et perte d'exploitation. La protection complète de votre entreprise.</>,
    mascotSrc: arthurDetective,
    mascotAlt: "Arthur détective — assurance MRP",
    speechText: "Votre entreprise, vos locaux, votre matériel : tout est protégé !",
    insuranceType: "mrp",
    insuranceLabel: "Assurance MRP",
    stats: [
      trustReviewStat,
      { icon: Clock, value: "2 min", label: "Pour le devis" },
    ],
    advantages: baseAdvantages,
    testimonials: [],
    faqs: [
      { question: "Que couvre la MRP ?", answer: "Locaux, matériel, marchandises, RC exploitation, perte d'exploitation, dégâts des eaux et incendie." },
      { question: "Pour quelles activités ?", answer: "Commerces, restaurants, bureaux, ateliers, cabinets… toutes les TPE et PME." },
      { question: "Puis-je inclure la perte d'exploitation ?", answer: "Oui, fortement recommandée — elle compense la baisse de CA après un sinistre." },
    ],
    bottomCtaTitle: "Couvrez votre entreprise des risques majeurs",
    bottomCtaDescription: "Devis MRP personnalisé en 2 min — perte d'exploitation incluse.",
  },

  gli: {
    slug: "gli",
    trackingTitle: "Landing Page Assurance GLI",
    seoTitle: "Assurance GLI | Garantie Loyers Impayés",
    seoDescription: "Sécurisez vos revenus locatifs : loyers impayés, dégradations, frais juridiques. Devis gratuit.",
    seoKeyword: "garantie loyers impayés",
    seoKeywords: "assurance GLI bailleur, garantie loyers impayés moins chère",
    // Désindexée le 2026-09-21 : même sujet que le pilier /assurance-gli (cannibalisation),
    // même traitement que les configs velo, trottinette et les 8 sujets traités avant elle.
    // "dès 2,5 %" retiré du seoTitle uniquement (non sourcé) — le corps de
    // page (topBarText/heroHighlight/stats) garde ce chiffre pour l'instant,
    // hors périmètre de cette demande. Attention : cette route a une ligne
    // page_meta_overrides en base (confirmé par Paul) qui peut écraser ce
    // titre en production — à vérifier séparément.
    noindex: true,
    topBarText: "🔑 GLI : loyers impayés, dégradations, frais juridiques",
    badgeText: "Bailleurs particuliers",
    heroTitle: "Garantie Loyers Impayés",
    heroHighlight: "pour bailleurs",
    heroSubtitle: <>Loyers impayés, dégradations, frais de procédure : votre revenu locatif sécurisé.</>,
    mascotSrc: arthurThumbsUp,
    mascotAlt: "Arthur pouce levé — GLI bailleur",
    speechText: "Loyers impayés ? Je vous aide à vous protéger !",
    insuranceType: "gli",
    insuranceLabel: "GLI",
    stats: [
      trustReviewStat,
      { icon: Clock, value: "2 min", label: "Pour le devis" },
    ],
    advantages: baseAdvantages,
    testimonials: [],
    faqs: [
      { question: "Quel locataire est éligible ?", answer: "Solvabilité du locataire vérifiée selon le critère légal des 3× le loyer en revenus nets." },
      { question: "Que couvre la GLI ?", answer: "Loyers impayés, charges, taxe foncière non récupérée, dégradations, frais de procédure et d'huissier." },
      { question: "Cumulable avec la caution Visale ?", answer: "Non, la GLI et Visale ne sont pas cumulables. Vous devez choisir l'un ou l'autre." },
    ],
    bottomCtaTitle: "Sécurisez vos revenus locatifs",
    bottomCtaDescription: "Devis GLI en 2 min — éligibilité confirmée immédiatement.",
  },

  pno: {
    slug: "pno",
    trackingTitle: "Landing Page Assurance PNO",
    seoTitle: "Assurance PNO | Propriétaire Non Occupant",
    seoDescription: "Protégez votre bien locatif : sinistres, RC propriétaire, vacance locative.",
    seoKeyword: "assurance propriétaire non occupant",
    seoKeywords: "PNO bailleur, assurance bien locatif",
    // Désindexée le 2026-09-21 : même sujet que le pilier /assurance-pno (cannibalisation),
    // même traitement que les configs velo, trottinette et les 8 sujets traités avant elle.
    noindex: true,
    topBarText: "🏘️ Offre PNO : obligatoire en copropriété (loi Alur)",
    badgeText: "Obligatoire en copropriété",
    heroTitle: "Assurance PNO",
    heroHighlight: "obligatoire en copro",
    heroSubtitle: <>Propriétaire non occupant : protégez votre bien locatif et votre RC, même entre 2 locataires.</>,
    mascotSrc: arthurHouse,
    mascotAlt: "Arthur PNO — propriétaire non occupant",
    speechText: "Bailleur ? La PNO est obligatoire en copropriété (loi Alur) !",
    insuranceType: "pno",
    insuranceLabel: "Assurance PNO",
    stats: [
      trustReviewStat,
      { icon: Clock, value: "2 min", label: "Pour le devis" },
    ],
    advantages: baseAdvantages,
    testimonials: [],
    faqs: [
      { question: "La PNO est-elle obligatoire ?", answer: "Oui depuis la loi Alur (2014) pour les biens en copropriété. Vivement recommandée pour tous les autres." },
      { question: "Que couvre-t-elle ?", answer: "Sinistres dans les parties privatives, RC propriétaire, recours des voisins et du locataire." },
      { question: "Doublonne-t-elle avec l'assurance du locataire ?", answer: "Non — la PNO couvre les vacances locatives et les sinistres non couverts par votre locataire." },
    ],
    bottomCtaTitle: "Protégez votre bien locatif",
    bottomCtaDescription: "PNO — attestation pour votre syndic envoyée par email après souscription.",
  },

  // ────────────────────────────── Métiers atypiques ──────────────────────────────
  accrobranche: {
    slug: "accrobranche",
    trackingTitle: "Landing Page Assurance Parc Accrobranche",
    seoTitle: "Assurance Parc Accrobranche & Loisirs Aventure",
    seoDescription: "Couverture sur-mesure pour parcs accrobranche, tyroliennes et loisirs aventure. 20 assureurs spécialisés.",
    seoKeyword: "assurance parc accrobranche",
    seoKeywords: "assurance tyrolienne, assurance loisirs aventure, RC parc aventure, norme EN 15567",
    noindex: true,
    topBarText: "🌲 Spécialiste loisirs aventure — 20 assureurs de niche, rappel rapide par un conseiller",
    badgeText: "Métiers atypiques",
    heroTitle: "Assurance Parc",
    heroHighlight: "Accrobranche & Aventure",
    heroSubtitle: <><strong>RC exploitant, individuelle accident participants, matériel & EPI.</strong> Étude personnalisée auprès de nos 20 assureurs spécialisés.</>,
    mascotSrc: arthurClimbing,
    mascotAlt: "Arthur escaladeur — assurance parc accrobranche",
    speechText: "Refusé ailleurs ? Nos 20 assureurs de niche disent oui !",
    insuranceType: "metiers_atypiques",
    insuranceLabel: "Parc Accrobranche",
    stats: [
      { icon: Award, value: "EN 15567", label: "Norme respectée" },
    ],
    advantages: [
      { icon: ShieldCheck, title: "RC exploitant complète", description: "Dommages corporels et matériels causés aux grimpeurs (chutes, blocages tyrolienne, défaut équipement)." },
      { icon: Heart, title: "Individuelle accident", description: "Indemnisation directe des participants même sans tiers responsable." },
      { icon: HardHat, title: "Matériel & EPI couverts", description: "Plateformes, lignes de vie, baudriers, mousquetons : remplacement et contrôles ECP." },
      { icon: Phone, title: "0 refus", description: "Solution même pour gros parcs et activités à risque aggravé." },
    ],
    testimonials: [],
    faqs: [
      { question: "Pourquoi un courtier spécialisé ?", answer: "Les généralistes refusent les activités classées risques aggravés. Nous travaillons avec 20 assureurs de niche (Hiscox, Albingia, MMA Pro Sport, Generali Évolution…)." },
      { question: "Comment obtenir une attestation ?", answer: "Rappel rapide par un conseiller, puis attestation émise après réception du dossier complet (Kbis, dernier bilan, descriptif activité)." },
      { question: "Mes animateurs sont-ils couverts ?", answer: "RC exploitation oui ; pour leur santé personnelle souscrivez en plus AT/MP et garantie individuelle accident." },
    ],
    bottomCtaTitle: "Sécurisez votre parc dès aujourd'hui",
    bottomCtaDescription: "Étude gratuite et personnalisée — rappel rapide par un courtier expert.",
  },

  "cordiste-btp": {
    slug: "cordiste-btp",
    trackingTitle: "Landing Page Assurance Cordiste & BTP Spécialisé",
    seoTitle: "Assurance Cordiste & BTP Travaux en Hauteur",
    seoDescription: "RC pro et matériel pour cordistes, travaux acrobatiques et BTP spécialisé. 20 assureurs de niche.",
    seoKeyword: "assurance cordiste",
    seoKeywords: "assurance travaux en hauteur, RC pro cordiste, assurance BTP spécialisé, IRATA",
    noindex: true,
    topBarText: "⛏️ Cordistes & BTP en hauteur — 20 assureurs spécialisés, rappel rapide par un conseiller",
    badgeText: "Métiers atypiques",
    heroTitle: "Assurance",
    heroHighlight: "Cordiste & BTP en hauteur",
    heroSubtitle: <><strong>RC pro, matériel EPI, individuelle accident.</strong> Solutions sur-mesure pour cordistes IRATA, travaux acrobatiques et BTP spécialisé.</>,
    mascotSrc: arthurBtp,
    mascotAlt: "Arthur BTP — assurance cordiste",
    speechText: "IRATA, travaux acrobatiques : on assure les profils refusés ailleurs !",
    insuranceType: "metiers_atypiques",
    insuranceLabel: "Cordiste & BTP",
    stats: [
      { icon: Award, value: "IRATA", label: "Certification reconnue" },
    ],
    advantages: [
      { icon: ShieldCheck, title: "RC pro adaptée", description: "Couverture des dommages causés aux tiers pendant vos interventions en hauteur." },
      { icon: HardHat, title: "EPI & matériel", description: "Cordes, harnais, descendeurs, ASAP : remplacement après sinistre ou contrôle annuel." },
      { icon: Heart, title: "Individuelle accident pro", description: "Complément CPAM/AT-MP en cas d'arrêt suite à accident en hauteur." },
      { icon: FileCheck, title: "Attestations chantier", description: "Attestations renforcées pour donneurs d'ordre exigeants (BTP, industrie)." },
    ],
    testimonials: [],
    faqs: [
      { question: "Pourquoi mon assureur généraliste refuse-t-il ?", answer: "Les travaux en hauteur sont classés risque aggravé, souvent avec surprime. Les généralistes ne disposent pas de grilles dédiées." },
      { question: "Mes cordes et EPI sont-ils couverts ?", answer: "Oui, en garantie matériel professionnel, avec contrôle annuel ECP exigé pour le maintien de la couverture." },
      { question: "Faut-il une certification IRATA ?", answer: "Pas obligatoire pour souscrire mais elle réduit fortement la prime — démontre votre maîtrise du risque." },
    ],
    bottomCtaTitle: "Travaillez en hauteur en toute sécurité",
    bottomCtaDescription: "Étude personnalisée — rappel rapide par un courtier spécialisé risques aggravés.",
  },

  evenementiel: {
    slug: "evenementiel",
    trackingTitle: "Landing Page Assurance Organisateur Événementiel",
    seoTitle: "Assurance Organisateur d'Événement & Festival",
    seoDescription: "RC organisateur, annulation, matériel scénique. 20 assureurs spécialisés événementiel.",
    seoKeyword: "assurance organisateur événement",
    seoKeywords: "assurance festival, RC organisateur, assurance annulation événement",
    noindex: true,
    topBarText: "🎉 Organisateurs & festivals — 20 assureurs spécialisés, étude express 24 h",
    badgeText: "Métiers atypiques",
    heroTitle: "Assurance",
    heroHighlight: "Organisateur d'Événement",
    heroSubtitle: <><strong>RC organisateur, annulation, matériel scénique, intempéries.</strong> Solutions pour festivals, soirées, conférences et compétitions.</>,
    mascotSrc: arthurExcited,
    mascotAlt: "Arthur fête — assurance événementiel",
    speechText: "Festivals, soirées, salons : trouvons la couverture adaptée !",
    insuranceType: "metiers_atypiques",
    insuranceLabel: "Événementiel",
    stats: [
      { icon: Clock, value: "Sous 24 h", label: "Devis" },
    ],
    advantages: [
      { icon: ShieldCheck, title: "RC organisateur", description: "Dommages corporels et matériels causés aux participants, prestataires et tiers." },
      { icon: PartyPopper, title: "Garantie annulation", description: "Remboursement frais engagés en cas d'annulation pour cause indépendante (intempéries, force majeure)." },
      { icon: Building2, title: "Matériel scénique", description: "Sonorisation, éclairage, structures, scènes : couverts contre vol, bris, incendie." },
      { icon: Phone, title: "Étude express 24 h", description: "Pour les événements à date imminente, procédure accélérée." },
    ],
    testimonials: [],
    faqs: [
      { question: "À partir de combien de personnes faut-il s'assurer ?", answer: "Dès le 1er invité, mais la RC organisateur est obligatoire dès 50 personnes ou si l'événement est ouvert au public." },
      { question: "Quels événements couvrez-vous ?", answer: "Festivals, concerts, courses sportives, soirées privées/corporate, salons, conférences, mariages." },
      { question: "Et l'annulation pour intempéries ?", answer: "Oui, garantie spécifique remboursant les frais engagés (cachets, location matériel, communication)." },
    ],
    bottomCtaTitle: "Organisez votre événement en toute sérénité",
    bottomCtaDescription: "Étude personnalisée — procédure express 24 h disponible.",
  },

  "moniteur-sport": {
    slug: "moniteur-sport",
    trackingTitle: "Landing Page Assurance Moniteur Sports Outdoor",
    seoTitle: "Assurance Moniteur Sports Outdoor & Encadrant",
    seoDescription: "RC pro pour moniteurs escalade, kayak, ski, parapente. 20 assureurs spécialisés sports nature.",
    seoKeyword: "assurance moniteur sport",
    seoKeywords: "assurance moniteur escalade, RC pro moniteur kayak, assurance encadrant sportif",
    noindex: true,
    topBarText: "🏔️ Moniteurs sports outdoor — 20 assureurs spécialisés, devis 30 min",
    badgeText: "Métiers atypiques",
    heroTitle: "Assurance Moniteur",
    heroHighlight: "Sports Outdoor",
    heroSubtitle: <><strong>RC pro adaptée à votre discipline :</strong> escalade, kayak, ski, parapente, équitation, plongée. Tarifs négociés pour indépendants et associations.</>,
    mascotSrc: arthurKayak,
    mascotAlt: "Arthur en kayak — assurance moniteur sport",
    speechText: "Moniteur indépendant ? RC pro adaptée à votre discipline en 30 min !",
    insuranceType: "metiers_atypiques",
    insuranceLabel: "Moniteur Sport",
    stats: [
      { icon: Award, value: "BE/DE", label: "Diplômes acceptés" },
      { icon: Clock, value: "30 min", label: "Devis express" },
    ],
    advantages: [
      { icon: ShieldCheck, title: "RC pro discipline", description: "Couverture spécifique à votre discipline : escalade, kayak, ski, parapente, équitation, plongée." },
      { icon: Heart, title: "Individuelle accident", description: "Complément CPAM en cas d'arrêt suite à accident pendant l'encadrement." },
      { icon: Users, title: "Stagiaires couverts", description: "Vos élèves, stagiaires et clients couverts pendant vos prestations." },
      { icon: FileCheck, title: "Attestations FFME/FFCK", description: "Attestations conformes aux exigences fédérales et préfectorales." },
    ],
    testimonials: [],
    faqs: [
      { question: "Quels diplômes acceptés ?", answer: "BE, BPJEPS, DEJEPS, brevets fédéraux, qualifications guide haute montagne, etc." },
      { question: "Sorties multi-jours couvertes ?", answer: "Oui, raids, treks et stages multi-jours inclus dans la RC, à préciser à la souscription." },
      { question: "Et si j'encadre à l'étranger ?", answer: "Extension monde possible (Europe, monde entier) — à intégrer au contrat dès l'origine." },
    ],
    bottomCtaTitle: "Encadrez en toute sérénité",
    bottomCtaDescription: "RC pro adaptée à votre discipline, devis en 30 min.",
  },

  // ────────────────────────────── Nouvelles niches 2026 ──────────────────────────────
  vtc: {
    slug: "vtc",
    trackingTitle: "Landing Page Assurance VTC",
    seoTitle: "Assurance VTC Pas Chère | Devis Chauffeur Privé en 2 min",
    seoDescription: "Assurance VTC : RC pro + flotte + protection juridique. 15 assureurs spécialisés Uber, Bolt, Heetch.",
    seoKeyword: "assurance vtc",
    // Désindexée le 2026-09-23 : cannibalise le nouveau pilier /assurance-vtc
    // (même seoKeyword "assurance vtc"), même traitement que velo, trottinette
    // et les 20 sujets traités avant elle.
    noindex: true,
    seoKeywords: "assurance chauffeur vtc, assurance uber, rc pro vtc, assurance flotte vtc",
    topBarText: "🚖 VTC : assurance flotte + RC pro",
    badgeText: "Spécialiste Chauffeurs VTC",
    heroTitle: "Assurance VTC",
    heroHighlight: "RC pro + flotte",
    heroSubtitle: <>Couverture <strong>RC pro + flotte + assistance</strong> pour chauffeurs Uber, Bolt, Heetch.</>,
    mascotSrc: arthurCar,
    mascotAlt: "Arthur chauffeur VTC — assurance VTC pas chère",
    speechText: "Chauffeur VTC ? Je négocie votre assurance flotte et RC pro !",
    insuranceType: "auto",
    insuranceLabel: "Assurance VTC",
    stats: [
      { icon: Clock, value: "2 min", label: "Pour le devis" },
    ],
    advantages: [
      { icon: Car, title: "RC pro + flotte incluses", description: "Une seule prime, deux protections : votre activité VTC et votre véhicule." },
      { icon: Award, title: "Plateformes acceptées", description: "Uber, Bolt, Heetch, Marcel, Kapten — toutes plateformes couvertes." },
      { icon: Phone, title: "Attestation par email", description: "Justificatif valable préfecture envoyé par email après souscription." },
      { icon: ShieldCheck, title: "Protection juridique", description: "Litiges plateformes, contrôle URSSAF, contestation préfecture inclus." },
    ],
    testimonials: [],
    faqs: [
      { question: "Quelle assurance pour un VTC ?", answer: "Un VTC doit souscrire une assurance auto à usage transport de personnes + une RC pro. Notre offre combine les deux." },
      { question: "Combien coûte une assurance VTC ?", answer: "Le prix dépend du véhicule, de l'expérience et de la zone d'activité. Comparez des devis établis pour votre situation." },
      { question: "L'attestation est-elle valable préfecture ?", answer: "Oui, attestation conforme aux exigences préfecture pour l'inscription au registre VTC." },
    ],
    bottomCtaTitle: "Roulez assuré dès aujourd'hui",
    bottomCtaDescription: "Attestation VTC valable préfecture — devis gratuit.",
  },

  "auto-entrepreneur": {
    slug: "auto-entrepreneur",
    // Désindexée le 2026-09-23 : cannibalise le nouveau pilier
    // /assurance-auto-entrepreneur (même seoKeyword), même traitement que
    // les sujets traités avant elle.
    noindex: true,
    trackingTitle: "Landing Page Assurance Auto-Entrepreneur",
    seoTitle: "Assurance Auto-Entrepreneur | RC Pro Adaptée",
    seoDescription: "Assurance auto-entrepreneur : RC pro, mutuelle TNS, prévoyance. Adapté aux micro-entrepreneurs. Devis 2 min.",
    seoKeyword: "assurance auto entrepreneur",
    seoKeywords: "rc pro auto entrepreneur, assurance micro entreprise, mutuelle auto entrepreneur",
    topBarText: "💼 Auto-entrepreneur : RC pro adaptée à votre activité",
    badgeText: "N°1 Micro-entreprise",
    heroTitle: "Assurance Auto-Entrepreneur",
    heroHighlight: "adaptée à votre activité",
    heroSubtitle: <>RC pro <strong>obligatoire ou recommandée</strong> selon votre activité. Couverture instantanée, sans engagement.</>,
    mascotSrc: arthurBusiness,
    mascotAlt: "Arthur entrepreneur — assurance auto-entrepreneur",
    speechText: "Auto-entrepreneur ? RC pro adaptée à votre activité !",
    insuranceType: "rc_pro",
    insuranceLabel: "RC Pro Auto-Entrepreneur",
    stats: [
      { icon: FileCheck, value: "Immédiate", label: "Attestation" },
      { icon: Clock, value: "2 min", label: "Souscription" },
    ],
    advantages: [
      { icon: Briefcase, title: "Toutes activités couvertes", description: "Services, conseil, BTP, beauté, e-commerce, prestations intellectuelles." },
      { icon: ShieldCheck, title: "RC pro + protection juridique", description: "Dommages clients + litiges contractuels et URSSAF inclus." },
      { icon: Award, title: "Contrat sans engagement", description: "Résiliable à tout moment après la 1ère année (loi Hamon)." },
      { icon: FileCheck, title: "Attestation RC pro", description: "Indispensable pour gagner clients exigeants ou répondre à appels d'offres." },
    ],
    testimonials: [],
    faqs: [
      { question: "La RC pro est-elle obligatoire pour un auto-entrepreneur ?", answer: "Ça dépend de votre activité, pas de votre statut. La loi l'impose pour le BTP, le tourisme et certaines professions de santé, juridiques ou financières précisément définies — pas pour la beauté ou le conseil en général, où elle reste une démarche volontaire fortement recommandée." },
      { question: "Combien coûte une RC pro auto-entrepreneur ?", answer: "Le prix dépend de votre activité. Comparez des devis établis pour votre situation." },
      { question: "Puis-je ajouter une mutuelle TNS ?", answer: "Oui, pack RC pro + mutuelle TNS + prévoyance optimisé Madelin disponible." },
    ],
    bottomCtaTitle: "Protégez votre micro-entreprise",
    bottomCtaDescription: "RC pro adaptée à votre activité — devis gratuit.",
  },

  senior: {
    slug: "senior",
    // Désindexée le 2026-09-23 : cannibalise le nouveau pilier
    // /assurance-senior (même seoKeyword), même traitement que les sujets
    // traités avant elle.
    noindex: true,
    trackingTitle: "Landing Page Mutuelle Senior",
    seoTitle: "Mutuelle Senior 60+ | Optique, Dentaire, Audio",
    seoDescription: "Mutuelle senior 60 ans et plus : optique, dentaire, audioprothèse, hospitalisation. Comparez les mutuelles en 2 min.",
    seoKeyword: "mutuelle senior",
    seoKeywords: "mutuelle 60 ans, mutuelle retraité, mutuelle senior pas chère",
    topBarText: "👴 Mutuelle senior : optique, dentaire et audio renforcés",
    badgeText: "Spécialiste Senior",
    heroTitle: "Mutuelle Senior",
    heroHighlight: "adaptée à vos besoins",
    heroSubtitle: <>Couverture renforcée <strong>optique, dentaire, audioprothèse, hospitalisation</strong>. Sans questionnaire médical.</>,
    mascotSrc: arthurThumbsUp,
    mascotAlt: "Arthur senior — mutuelle senior pas chère",
    speechText: "Senior ? Je trouve la mutuelle adaptée à vos besoins !",
    insuranceType: "sante",
    insuranceLabel: "Mutuelle Senior",
    stats: [
      { icon: Clock, value: "Immédiate", label: "Prise d'effet" },
    ],
    advantages: [
      { icon: HeartPulse, title: "Optique, dentaire, audio renforcés", description: "Postes les plus coûteux après 60 ans, remboursements renforcés selon la formule." },
      { icon: Shield, title: "Sans questionnaire médical", description: "Acceptation garantie, aucune sélection médicale." },
      { icon: Heart, title: "Cures thermales & médecines douces", description: "Ostéopathie, acupuncture, homéopathie, cures conventionnées." },
      { icon: Phone, title: "Conseiller dédié senior", description: "Un interlocuteur unique qui connaît votre dossier." },
    ],
    testimonials: [],
    faqs: [
      { question: "Quel est le prix d'une mutuelle senior ?", answer: "Le tarif dépend de l'âge, du lieu de résidence et des garanties choisies : un devis personnalisé est nécessaire." },
      { question: "Y a-t-il un questionnaire médical ?", answer: "Non, acceptation garantie sans questionnaire ni examen." },
      { question: "Puis-je résilier ma mutuelle actuelle ?", answer: "Oui, loi Bourquin permet la résiliation à tout moment après 1 an." },
    ],
    bottomCtaTitle: "Protégez votre santé après 60 ans",
    bottomCtaDescription: "Mutuelle senior adaptée — comparaison gratuite en 2 min.",
  },

  scooter: {
    slug: "scooter",
    trackingTitle: "Landing Page Assurance Scooter",
    seoTitle: "Assurance Scooter 50cc Pas Chère | Devis 2 min",
    seoDescription: "Assurance scooter 50cc, 125cc, électrique. Comparez les assureurs spécialisés deux-roues.",
    seoKeyword: "assurance scooter",
    seoKeywords: "assurance scooter 50cc, assurance scooter 125, assurance scooter électrique",
    // Cannibalisation avec /assurance-moto (seoKeyword "assurance moto moins
    // chère", différent) : aucune, mots-clés distincts. Mais même défaut que
    // vélo/trottinette avant leur nettoyage : noindex absent + présente dans
    // le sitemap + aucune entrée relatedMap → section "liens associés"
    // invisible. Corrigé le 2026-09-12, même traitement.
    noindex: true,
    topBarText: "🛵 Scooter : du tiers au tous risques — assistance 0 km",
    badgeText: "Spécialiste 2-roues",
    heroTitle: "Assurance Scooter",
    heroHighlight: "50cc, 125cc, électrique",
    heroSubtitle: <>Tiers, intermédiaire ou tous risques pour <strong>50cc, 125cc, électrique</strong>. Attestation en ligne.</>,
    mascotSrc: arthurMoto,
    mascotAlt: "Arthur en scooter — assurance scooter pas chère",
    speechText: "Scooter ? Tiers ou tous risques, je compare pour vous !",
    insuranceType: "moto",
    insuranceLabel: "Assurance Scooter",
    stats: [
      // "6 400+ Scooters assurés" et "12 Assureurs 2-roues" retirés : aucune
      // source vérifiable (même défaut que "15+ Assureurs vélo"/"20+
      // Assureurs EDPM" trouvé sur vélo/trottinette). trustReviewStat
      // affiche l'immatriculation ORIAS (chantier avis clients 2026-09-29 :
      // "5/5 avis vérifiés" ne correspondait à aucune source réelle).
      trustReviewStat,
      { icon: Clock, value: "2 min", label: "Pour le devis" },
    ],
    advantages: [
      { icon: Bike, title: "50cc, 125cc, électrique", description: "Toutes cylindrées et motorisations couvertes, dont scooters électriques." },
      { icon: ShieldCheck, title: "Vol & incendie inclus", description: "Garanties dès la formule intermédiaire." },
      { icon: Phone, title: "Assistance 0 km", description: "Dépannage et remorquage 7j/7 24h/24." },
      { icon: Award, title: "Bonus conservé", description: "Votre bonus moto/scooter est conservé même en changeant d'assureur." },
    ],
    // Témoignages inventés retirés (mêmes noms/style que ceux trouvés sur
    // vélo/trottinette : aucune preuve que ce sont de vrais clients).
    testimonials: [],
    faqs: [
      { question: "Quelle assurance pour un scooter 50cc ?", answer: "Au minimum la responsabilité civile (tiers). Recommandée : intermédiaire avec vol/incendie." },
      { question: "Faut-il un permis pour un scooter électrique ?", answer: "BSR (AM) suffit pour les scooters électriques limités à 45 km/h." },
      { question: "Puis-je assurer mon scooter sans BSR ?", answer: "Non, BSR obligatoire si né après 1988." },
    ],
    bottomCtaTitle: "Roulez en scooter à petit prix",
    bottomCtaDescription: "Attestation en ligne — devis gratuit.",
  },

  "rc-pro-micro-entreprise": {
    slug: "rc-pro-micro-entreprise",
    // Désindexée le 2026-09-23 : cannibalise le nouveau pilier
    // /assurance-rc-pro-micro-entreprise (même seoKeyword), même traitement
    // que les sujets traités avant elle.
    noindex: true,
    trackingTitle: "Landing Page RC Pro Micro-Entreprise",
    seoTitle: "RC Pro Micro-Entreprise | Assurance Adaptée",
    seoDescription: "RC pro micro-entreprise : couverture dommages clients, juridique. 15 assureurs comparés.",
    seoKeyword: "rc pro micro entreprise",
    seoKeywords: "responsabilité civile professionnelle micro entreprise, rc pro freelance",
    topBarText: "📋 RC Pro Micro-entreprise : adaptée à votre activité",
    badgeText: "Spécialiste Micro-entreprise",
    heroTitle: "RC Pro Micro-Entreprise",
    heroHighlight: "adaptée à votre activité",
    heroSubtitle: <>Protection essentielle <strong>dommages corporels, matériels, immatériels</strong> causés à vos clients.</>,
    mascotSrc: arthurDetective,
    mascotAlt: "Arthur expert — RC pro micro-entreprise",
    speechText: "RC pro micro-entreprise adaptée à votre activité !",
    insuranceType: "rc_pro",
    insuranceLabel: "RC Pro Micro",
    stats: [
      { icon: Phone, value: "Juridique", label: "Litiges inclus" },
      { icon: Phone, value: "Rappel rapide", label: "Par un conseiller" },
    ],
    advantages: [
      { icon: ShieldCheck, title: "Dommages 360°", description: "Corporels, matériels et immatériels causés à vos clients." },
      { icon: FileCheck, title: "Attestation officielle", description: "PDF envoyé par email après souscription, indispensable pour appels d'offres." },
      { icon: Award, title: "Plafonds adaptés", description: "Montants de garantie adaptés à votre activité." },
      { icon: Phone, title: "Juridique inclus", description: "Litiges contractuels, recouvrement, accompagnement URSSAF." },
    ],
    testimonials: [],
    faqs: [
      { question: "RC pro obligatoire pour micro-entreprise ?", answer: "Ça dépend de votre activité, pas de votre statut. La loi l'impose pour le BTP, le tourisme et certaines professions de santé, juridiques ou financières précisément définies — pas pour la beauté ou le conseil en général, où elle reste une démarche volontaire fortement recommandée." },
      { question: "Quel plafond de garantie choisir ?", answer: "Le plafond adapté dépend de votre activité et de votre exposition au risque : comparez des devis établis pour votre situation." },
      { question: "Combien coûte une RC pro micro ?", answer: "Le prix dépend de votre activité et de votre chiffre d'affaires. Comparez des devis établis pour votre situation." },
    ],
    bottomCtaTitle: "Sécurisez votre micro-entreprise",
    bottomCtaDescription: "RC pro adaptée à votre activité — rappel rapide par un conseiller.",
  },

  restaurant: {
    slug: "restaurant",
    trackingTitle: "Landing Page Assurance Restaurant",
    seoTitle: "Assurance Restaurant & Food Truck | MRP + RC Pro",
    seoDescription: "Assurance restaurant, food truck, brasserie : MRP, RC pro, perte d'exploitation. Devis personnalisé en 24 h.",
    seoKeyword: "assurance restaurant",
    seoKeywords: "assurance restaurant pas chère, assurance food truck, mrp restaurant",
    topBarText: "🍽️ Restaurateurs : MRP + RC pro + perte d'exploitation — devis 24 h",
    badgeText: "Spécialiste Restauration",
    heroTitle: "Assurance Restaurant",
    heroHighlight: "spécial restauration",
    heroSubtitle: <>MRP, RC pro, perte d'exploitation, intoxication alimentaire pour <strong>restaurants, food trucks, brasseries</strong>.</>,
    mascotSrc: arthurExcited,
    mascotAlt: "Arthur chef — assurance restaurant",
    speechText: "Restaurateur ? Pack MRP + RC pro adapté à votre cuisine !",
    insuranceType: "mrp",
    insuranceLabel: "Assurance Restaurant",
    stats: [
      { icon: Clock, value: "24 h", label: "Devis sur-mesure" },
    ],
    advantages: [
      { icon: Building2, title: "MRP adaptée HCR", description: "Multirisque dédiée Hôtellerie-Café-Restaurant : cuisine, salle, terrasse." },
      { icon: HeartPulse, title: "Intoxication alimentaire", description: "Garantie spécifique TIAC incluse." },
      { icon: ShieldCheck, title: "Perte d'exploitation", description: "Indemnisation de votre marge en cas de fermeture forcée." },
      { icon: FileCheck, title: "Food truck inclus", description: "Véhicule + équipements + activité ambulante dans un seul contrat." },
    ],
    testimonials: [],
    faqs: [
      { question: "Quelle assurance obligatoire pour un restaurant ?", answer: "MRP + RC pro indispensables. Perte d'exploitation et TIAC fortement recommandées." },
      { question: "Combien coûte l'assurance d'un restaurant ?", answer: "Le tarif dépend de la surface, du chiffre d'affaires et de la localisation : un devis personnalisé est nécessaire." },
      { question: "Food truck : quelle couverture ?", answer: "MRP ambulante + RC pro + assurance véhicule pro + équipements cuisine." },
    ],
    bottomCtaTitle: "Protégez votre restaurant",
    bottomCtaDescription: "Pack MRP + RC pro adapté HCR — devis sur-mesure 24 h.",
  },

  "coach-sportif": {
    slug: "coach-sportif",
    // Désindexée le 2026-09-23 : cannibalise le nouveau pilier
    // /assurance-coach-sportif (même seoKeyword), même traitement que les
    // sujets traités avant elle.
    noindex: true,
    trackingTitle: "Landing Page Assurance Coach Sportif",
    seoTitle: "Assurance Coach Sportif & Yoga | RC Pro Adaptée",
    seoDescription: "RC pro coach sportif, yoga, pilates, fitness : dommages clients, accidents, salles partenaires. BPJEPS accepté.",
    seoKeyword: "assurance coach sportif",
    seoKeywords: "rc pro coach sportif, assurance prof yoga, assurance pilates",
    topBarText: "🏋️ Coach sportif : RC pro adaptée — diplôme accepté",
    badgeText: "Spécialiste Sport",
    heroTitle: "RC Pro Coach Sportif",
    heroHighlight: "adaptée à vos cours",
    heroSubtitle: <>Couverture <strong>cours collectifs, individuels, à domicile, en salle ou outdoor</strong>. Yoga, pilates, fitness, crossfit.</>,
    mascotSrc: arthurClimbing,
    mascotAlt: "Arthur coach sportif — assurance coach",
    speechText: "Coach sportif ? RC pro adaptée à toutes vos prestations !",
    insuranceType: "rc_pro",
    insuranceLabel: "RC Pro Coach",
    stats: [
      { icon: Award, value: "BPJEPS", label: "Diplômes acceptés" },
      { icon: HeartPulse, value: "Tous cours", label: "Yoga, pilates, fitness" },
      { icon: Phone, value: "Rappel rapide", label: "Par un conseiller" },
    ],
    advantages: [
      { icon: HeartPulse, title: "Tous types de cours", description: "Individuel, collectif, à domicile, en salle, outdoor, visio." },
      { icon: ShieldCheck, title: "Dommages clients", description: "Blessure, chute, problème médical pendant la séance." },
      { icon: Award, title: "BPJEPS, BEMF, CQP", description: "Tous diplômes officiels acceptés sans surprime." },
      { icon: FileCheck, title: "Attestation salle", description: "Acceptée par Basic Fit, Fitness Park, etc." },
    ],
    testimonials: [],
    faqs: [
      { question: "RC pro obligatoire pour coach sportif ?", answer: "Le diplôme (BPJEPS, etc.) est obligatoire pour enseigner contre rémunération (Code du sport, art. L212-1). La RC pro n'est pas imposée par un texte spécifique au coach indépendant — elle l'est pour les salles et associations qui l'emploient (art. L321-1) — mais elle est quasi systématiquement exigée par les salles partenaires et les clients." },
      { question: "Combien coûte une RC pro coach ?", answer: "Le prix dépend du nombre d'élèves et des disciplines enseignées. Comparez des devis établis pour votre situation." },
      { question: "Cours en visio couverts ?", answer: "Oui, les coachs en visio sont couverts (responsabilité conseils, programmes inadaptés)." },
    ],
    bottomCtaTitle: "Coachez en toute sérénité",
    bottomCtaDescription: "RC pro coach sportif adaptée — devis 5 min.",
  },

  photographe: {
    slug: "photographe",
    // Désindexée le 2026-09-23 : cannibalise le nouveau pilier
    // /assurance-photographe (même seoKeyword), même traitement que les
    // sujets traités avant elle.
    noindex: true,
    trackingTitle: "Landing Page Assurance Photographe",
    seoTitle: "Assurance Photographe & Vidéaste | RC Pro + Matériel",
    seoDescription: "RC pro photographe : prestations mariage, événementiel, studio. Matériel photo/vidéo couvert. Devis 5 min.",
    seoKeyword: "assurance photographe",
    seoKeywords: "rc pro photographe, assurance vidéaste, assurance matériel photo",
    topBarText: "📸 Photographes : RC pro + matériel couvert",
    badgeText: "Spécialiste Image",
    heroTitle: "Assurance Photographe",
    heroHighlight: "RC pro + matériel",
    heroSubtitle: <>Protection complète pour <strong>photographes & vidéastes</strong> : prestations, matériel, droit à l'image, livrables clients.</>,
    mascotSrc: arthurDetective,
    mascotAlt: "Arthur photographe — assurance photographe",
    speechText: "Photographe ? RC pro + votre matériel couvert !",
    insuranceType: "rc_pro",
    insuranceLabel: "RC Pro Photo/Vidéo",
    stats: [
      { icon: Award, value: "Droit à l'image", label: "Protection incluse" },
      { icon: Shield, value: "Matériel", label: "Tous risques" },
      { icon: Phone, value: "Rappel rapide", label: "Par un conseiller" },
    ],
    advantages: [
      { icon: Sparkles, title: "Matériel photo/vidéo", description: "Boîtiers, objectifs, drones, éclairage : vol, casse, perte couverts." },
      { icon: ShieldCheck, title: "Prestations mariage/event", description: "Annulation, retard, litige client, perte de fichiers." },
      { icon: Award, title: "Droit à l'image", description: "Litiges droit à l'image, contestations de cession, propriété intellectuelle." },
      { icon: FileCheck, title: "Drone inclus en option", description: "RC drone pro DGAC ajoutable au contrat." },
    ],
    testimonials: [],
    faqs: [
      { question: "RC pro obligatoire pour photographe ?", answer: "Non obligatoire mais vivement recommandée. Indispensable pour mariages et corporate." },
      { question: "Mon matériel est-il couvert ?", answer: "Oui, garantie tous risques disponible : vol, casse accidentelle, perte." },
      { question: "Et la perte des fichiers clients ?", answer: "Garantie 'reconstitution de fichiers' incluse." },
    ],
    bottomCtaTitle: "Protégez votre activité photo/vidéo",
    bottomCtaDescription: "RC pro + matériel couvert — devis 5 min.",
  },

  influenceur: {
    slug: "influenceur",
    // Désindexée le 2026-09-23 : cannibalise le nouveau pilier
    // /assurance-influenceur (même seoKeyword), même traitement que les
    // sujets traités avant elle.
    noindex: true,
    trackingTitle: "Landing Page Assurance Influenceur",
    seoTitle: "Assurance Influenceur & Créateur de Contenu | RC Pro",
    seoDescription: "RC pro influenceur, créateur, streamer : litiges marques, droit à l'image, diffamation. Conforme loi influence 2023.",
    seoKeyword: "assurance influenceur",
    seoKeywords: "rc pro créateur de contenu, assurance instagram, assurance youtuber",
    topBarText: "📱 Influenceurs : conformité loi influence 2023 + RC pro digitale",
    badgeText: "Conforme Loi Influence",
    heroTitle: "Assurance Influenceur",
    heroHighlight: "RC pro digitale",
    heroSubtitle: <>Protégez-vous contre <strong>litiges marques, droit à l'image, diffamation, mentions trompeuses</strong>. Conforme loi du 9 juin 2023.</>,
    mascotSrc: arthurExcited,
    mascotAlt: "Arthur influenceur — assurance créateur de contenu",
    speechText: "Influenceur ? RC pro conforme loi 2023 !",
    insuranceType: "rc_pro",
    insuranceLabel: "RC Pro Influenceur",
    stats: [
      { icon: FileCheck, value: "Toutes plateformes", label: "Instagram, TikTok..." },
      { icon: Shield, value: "Loi 2023", label: "Conforme" },
      { icon: Phone, value: "Rappel rapide", label: "Par un conseiller" },
    ],
    advantages: [
      { icon: ShieldCheck, title: "Conforme loi du 9 juin 2023", description: "Couverture spécifique aux obligations des influenceurs commerciaux." },
      { icon: Award, title: "Litiges marques", description: "Désaccords contractuels, retard livraison contenu, propriété intellectuelle." },
      { icon: Sparkles, title: "Droit à l'image & diffamation", description: "Plaintes de tiers, accusations diffamatoires, deepfakes." },
      { icon: FileCheck, title: "Toutes plateformes", description: "Instagram, TikTok, YouTube, Twitch, X, Snapchat." },
    ],
    testimonials: [],
    faqs: [
      { question: "RC pro obligatoire pour un influenceur ?", answer: "Non obligatoire stricto sensu, mais quasi-indispensable depuis la loi du 9 juin 2023." },
      { question: "Combien coûte une assurance influenceur ?", answer: "Le prix dépend du nombre d'abonnés et des plateformes concernées. Comparez des devis établis pour votre situation." },
      { question: "Je vis à l'étranger mais paie en France, suis-je couvert ?", answer: "Oui, à condition d'être déclaré en France. Couverture monde entier." },
    ],
    bottomCtaTitle: "Créez du contenu en toute sérénité",
    bottomCtaDescription: "RC pro influenceur conforme loi 2023 — devis 5 min.",
  },

  drone: {
    slug: "drone",
    // Désindexée le 2026-09-23 : cannibalise le nouveau pilier
    // /assurance-drone (même seoKeyword), même traitement que les sujets
    // traités avant elle.
    noindex: true,
    trackingTitle: "Landing Page Assurance Drone Pro",
    // Corrigé le 2026-09-23 : les scénarios nationaux S-1/S-2/S-3 n'existent
    // plus depuis le 1er janvier 2026 (remplacés par le cadre européen UAS).
    seoTitle: "Assurance Drone Pro | RC Pro DGAC",
    seoDescription: "RC pro drone professionnel : catégorie spécifique DGAC, réglementation européenne UAS. Matériel couvert tous risques.",
    seoKeyword: "assurance drone",
    seoKeywords: "assurance drone professionnel, rc pro drone, assurance télépilote",
    topBarText: "🚁 Télépilotes : RC pro DGAC + drone couvert",
    badgeText: "Spécialiste Drone Pro",
    heroTitle: "Assurance Drone Pro",
    heroHighlight: "DGAC + matériel",
    heroSubtitle: <>RC pro <strong>catégorie spécifique</strong>, couverture matériel tous risques, conforme exigences DGAC.</>,
    mascotSrc: arthurFlying,
    mascotAlt: "Arthur télépilote drone — assurance drone professionnel",
    speechText: "Télépilote drone ? RC pro DGAC + votre matériel couvert !",
    insuranceType: "rc_pro",
    insuranceLabel: "RC Pro Drone",
    stats: [
      { icon: Shield, value: "UAS UE", label: "Catégorie spécifique" },
    ],
    advantages: [
      { icon: ShieldCheck, title: "Catégorie spécifique DGAC", description: "Couverture adaptée à votre autorisation d'exploitation (scénario standard européen, PDRA ou LUC)." },
      { icon: Sparkles, title: "Drone tous risques", description: "Casse, perte, vol du drone et accessoires." },
      { icon: Award, title: "Plafonds adaptés", description: "Montants de garantie adaptés aux exigences corporate." },
      { icon: FileCheck, title: "Attestation DGAC", description: "PDF conforme pour vos déclarations de vol." },
    ],
    testimonials: [],
    faqs: [
      { question: "RC pro obligatoire pour un drone professionnel ?", answer: "Oui, obligatoire pour tout vol professionnel. Sans elle, vol interdit." },
      { question: "Mon drone est-il couvert ?", answer: "Oui, garantie tous risques en option : casse, perte, vol." },
      { question: "Et les vols hors France ?", answer: "Extension Europe ou monde entier disponible." },
    ],
    bottomCtaTitle: "Volez en toute légalité",
    bottomCtaDescription: "RC pro drone DGAC + matériel — devis gratuit.",
  },

  // ────────────────────────────── Pro — nouvelles verticales ──────────────────────────────
  decennale: {
    slug: "decennale",
    trackingTitle: "Landing Page Garantie Décennale BTP",
    seoTitle: "Garantie Décennale BTP : Devis en 2 min | Arthur",
    seoDescription: "Garantie décennale obligatoire pour artisans et entreprises BTP. Plusieurs assureurs comparés. Devis gratuit en 2 min.",
    seoKeyword: "garantie décennale",
    seoKeywords: "assurance décennale, décennale artisan, décennale BTP, attestation décennale",
    // Désindexée le 2026-09-21 : cannibalise /assurance-decennale (seoKeyword "garantie décennale" quasi identique à celui du pilier ("assurance décennale")),
    // même traitement que les configs velo et trottinette.
    noindex: true,
    topBarText: "🏗️ Décennale BTP — rappel rapide par un conseiller",
    badgeText: "Obligatoire BTP",
    heroTitle: "Garantie Décennale",
    heroHighlight: "obligatoire BTP",
    heroSubtitle: <><strong>Couverture 10 ans</strong> des dommages compromettant la solidité de l'ouvrage. Pour artisans, auto-entrepreneurs et entreprises du BTP.</>,
    mascotSrc: arthurBtp,
    mascotAlt: "Arthur BTP — garantie décennale",
    speechText: "Maçon, plombier, électricien ? La décennale est obligatoire — je trouve le meilleur tarif.",
    insuranceType: "rc_pro",
    insuranceLabel: "Garantie Décennale",
    stats: [
      { icon: ShieldCheck, value: "10 ans", label: "Couverture légale" },
      trustReviewStat,
      { icon: Clock, value: "2 min", label: "Pour le devis" },
    ],
    advantages: [
      { icon: ShieldCheck, title: "Garantie décennale conforme", description: "Articles 1792 et suivants du Code civil. Attestation conforme exigée par tous les donneurs d'ordre." },
      { icon: Award, title: "Tous corps d'état", description: "Maçonnerie, plomberie, électricité, couverture, second œuvre : grille adaptée à votre activité." },
      { icon: FileCheck, title: "Attestation par email", description: "PDF envoyé après souscription, opposable à vos clients et aux notaires." },
      { icon: TrendingDown, title: "Tarifs négociés", description: "Comparez plusieurs assureurs pour trouver une prime adaptée à votre activité." },
    ],
    testimonials: [],
    faqs: [
      { question: "La décennale est-elle vraiment obligatoire ?", answer: "Oui, pour tout professionnel du BTP exécutant des travaux de construction soumis à la responsabilité décennale (loi Spinetta de 1978)." },
      { question: "Que couvre la décennale ?", answer: "Tous dommages compromettant la solidité de l'ouvrage ou le rendant impropre à sa destination, pendant 10 ans après réception des travaux." },
      { question: "Combien coûte une décennale ?", answer: "Le tarif dépend de l'activité, du chiffre d'affaires et des antécédents : un devis personnalisé est nécessaire." },
    ],
    bottomCtaTitle: "Lancez votre activité BTP sereinement",
    bottomCtaDescription: "Attestation décennale conforme — rappel rapide par un expert BTP.",
  },

  "flotte-auto": {
    slug: "flotte-auto",
    trackingTitle: "Landing Page Assurance Flotte Auto Entreprise",
    seoTitle: "Assurance Flotte Auto Entreprise : Devis en 2 min | Arthur",
    seoDescription: "Assurance flotte de véhicules d'entreprise dès 3 voitures. Gestion centralisée, tarifs négociés. Comparez plusieurs assureurs.",
    seoKeyword: "assurance flotte auto",
    seoKeywords: "assurance flotte entreprise, assurance véhicules professionnels, flotte automobile",
    // Désindexée le 2026-09-21 : cannibalise /assurance-flotte-auto (même seoKeyword "assurance flotte auto"),
    // même traitement que les configs velo et trottinette.
    noindex: true,
    topBarText: "🚗 Flotte auto pro — devis groupé",
    badgeText: "Pro — Entreprises",
    heroTitle: "Assurance Flotte",
    heroHighlight: "véhicules d'entreprise",
    heroSubtitle: <><strong>Dès 3 véhicules.</strong> Contrat unique, gestion centralisée, tarifs préférentiels et conducteurs interchangeables.</>,
    mascotSrc: arthurCar,
    mascotAlt: "Arthur au volant — assurance flotte entreprise",
    speechText: "3 véhicules ou +, un seul contrat pour toute votre flotte.",
    insuranceType: "auto",
    insuranceLabel: "Flotte Auto",
    stats: [
      trustReviewStat,
      { icon: Clock, value: "2 min", label: "Pour le devis" },
    ],
    advantages: [
      { icon: Briefcase, title: "Contrat unique multi-véhicules", description: "Une seule prime, un seul interlocuteur, une seule échéance pour toute la flotte." },
      { icon: Users, title: "Conducteurs interchangeables", description: "Tous vos salariés autorisés à conduire chaque véhicule sans déclaration nominative." },
      { icon: TrendingDown, title: "Tarifs préférentiels", description: "Mutualisation des risques : tarif négocié pour l'ensemble de la flotte." },
      { icon: FileCheck, title: "Gestion en ligne", description: "Ajout/retrait d'un véhicule en temps réel, attestations téléchargeables 24/7." },
    ],
    testimonials: [],
    faqs: [
      { question: "À partir de combien de véhicules ?", answer: "La plupart des assureurs flotte démarrent à 3 véhicules. Au-delà de 10, négociation sur-mesure." },
      { question: "Tous types de véhicules acceptés ?", answer: "Oui : VL, utilitaires, poids lourds, véhicules spéciaux. Grille tarifaire dédiée par catégorie." },
      { question: "Qui peut conduire ?", answer: "Tout salarié titulaire du permis adapté. Conducteurs non nommément déclarés, gain administratif important." },
    ],
    bottomCtaTitle: "Optimisez votre flotte de véhicules",
    bottomCtaDescription: "Étude personnalisée — rappel rapide par un expert flottes.",
  },

  "mutuelle-entreprise": {
    slug: "mutuelle-entreprise",
    trackingTitle: "Landing Page Mutuelle Entreprise Collective",
    seoTitle: "Mutuelle Entreprise Obligatoire : Devis en 2 min | Arthur",
    seoDescription: "Mutuelle collective obligatoire pour vos salariés. Conformité ANI, panier de soins, déduction fiscale. Comparez 25+ mutuelles entreprises.",
    seoKeyword: "mutuelle entreprise",
    seoKeywords: "mutuelle collective, mutuelle obligatoire entreprise, ANI mutuelle, complémentaire santé entreprise",
    // Désindexée le 2026-09-21 : cannibalise /assurance-mutuelle-entreprise (même seoKeyword "mutuelle entreprise"),
    // même traitement que les configs velo et trottinette.
    noindex: true,
    topBarText: "🏢 Mutuelle entreprise ANI — conformité garantie, déduction fiscale",
    badgeText: "Obligatoire ANI",
    heroTitle: "Mutuelle Entreprise",
    heroHighlight: "collective obligatoire",
    heroSubtitle: <><strong>Conformité ANI</strong>, panier de soins minimal respecté, prise en charge employeur déductible et financement partagé 50/50.</>,
    mascotSrc: arthurBusiness,
    mascotAlt: "Arthur entrepreneur — mutuelle entreprise",
    speechText: "Mutuelle obligatoire pour tous vos salariés depuis 2016 — je vous trouve la meilleure.",
    insuranceType: "sante",
    insuranceLabel: "Mutuelle Entreprise",
    stats: [
      trustReviewStat,
      { icon: Clock, value: "2 min", label: "Pour le devis" },
    ],
    advantages: [
      { icon: ShieldCheck, title: "Conformité ANI garantie", description: "Panier de soins minimal respecté : hospitalisation, optique, dentaire, prothèses auditives." },
      { icon: TrendingDown, title: "Déduction fiscale employeur", description: "La part employeur est déductible de l'impôt sur les sociétés et exonérée de charges (sous plafond)." },
      { icon: Users, title: "Salariés satisfaits", description: "Couverture étendue : médecines douces, télémédecine, prévention. Argument RH différenciant." },
      { icon: FileCheck, title: "Mise en place clé en main", description: "Acte juridique, affichage obligatoire, dispenses : on s'occupe de tout pour vous." },
    ],
    testimonials: [],
    faqs: [
      { question: "La mutuelle entreprise est-elle obligatoire ?", answer: "Oui, depuis le 1er janvier 2016 (ANI 2013), tout employeur du secteur privé doit proposer une mutuelle collective à ses salariés." },
      { question: "Quelle part employeur minimum ?", answer: "L'employeur doit financer au minimum 50% de la cotisation. Le reste est à la charge du salarié." },
      { question: "Quelles dispenses possibles ?", answer: "Salariés couverts par mutuelle conjoint, CDD courts, apprentis sous conditions : dispenses prévues par la loi." },
    ],
    bottomCtaTitle: "Mettez votre entreprise en conformité",
    bottomCtaDescription: "Étude personnalisée — rappel rapide par un expert mutuelle collective.",
  },

  cyber: {
    slug: "cyber",
    trackingTitle: "Landing Page Assurance Cyber-Risques",
    seoTitle: "Assurance Cyber-Risques Entreprise : Devis en 2 min",
    seoDescription: "Protégez votre entreprise contre les cyberattaques : rançongiciel, fuite de données, RGPD. Devis gratuit.",
    seoKeyword: "assurance cyber",
    seoKeywords: "assurance cyber-risques, cyberattaque entreprise, assurance ransomware, protection données RGPD",
    // Désindexée le 2026-09-21 : cannibalise /assurance-cyber (même seoKeyword "assurance cyber"),
    // même traitement que les configs velo et trottinette.
    noindex: true,
    topBarText: "🛡️ Cyber-risques — couverture rançongiciel + RGPD, devis 2 min",
    badgeText: "Pro — Cybersécurité",
    heroTitle: "Assurance",
    heroHighlight: "Cyber-Risques entreprise",
    heroSubtitle: <><strong>Rançongiciel, phishing, fuite de données.</strong> Couverture et cellule de crise selon le contrat.</>,
    mascotSrc: arthurDetective,
    mascotAlt: "Arthur détective — assurance cyber",
    speechText: "1 PME sur 2 a subi une cyberattaque en 2024 — protégez-vous avant qu'il ne soit trop tard.",
    insuranceType: "rc_pro",
    insuranceLabel: "Cyber-Risques",
    stats: [
      trustReviewStat,
      { icon: Clock, value: "2 min", label: "Pour le devis" },
    ],
    advantages: [
      { icon: Shield, title: "Rançongiciel & extorsion", description: "Prise en charge de la rançon (légale), restauration des systèmes et perte d'exploitation." },
      { icon: Lock, title: "Fuite de données & RGPD", description: "Notification CNIL, frais juridiques, amendes RGPD, indemnisation clients impactés." },
      { icon: Phone, title: "Cellule de crise 24/7", description: "Experts forensic, juristes RGPD, communicants : intervention immédiate après incident." },
      { icon: TrendingDown, title: "Perte d'exploitation", description: "Indemnisation du chiffre d'affaires perdu pendant l'arrêt forcé de l'activité." },
    ],
    testimonials: [],
    faqs: [
      { question: "Qui est concerné par la cyber-assurance ?", answer: "Toute entreprise manipulant des données numériques ou dépendante de ses systèmes : TPE, PME, ETI, profession libérale." },
      { question: "La rançon est-elle vraiment couverte ?", answer: "Oui, dans les pays où c'est légal et sous validation préalable de l'assureur. La priorité reste la restauration des systèmes." },
      { question: "Et le RGPD ?", answer: "Couverture des frais de notification CNIL, des amendes (selon limites légales) et des actions clients post-incident." },
    ],
    bottomCtaTitle: "Anticipez la cyberattaque",
    bottomCtaDescription: "Étude personnalisée — rappel rapide par un expert cyber.",
  },

  // ────────────────────────────── Particuliers — nouvelles verticales ──────────────────────────────
  "sans-permis": {
    slug: "sans-permis",
    trackingTitle: "Landing Page Assurance Voiture Sans Permis",
    seoTitle: "Assurance Voiture Sans Permis : Devis en 2 min",
    seoDescription: "Assurance voiturette sans permis (VSP) Aixam, Ligier, Microcar. Tiers, tous risques, jeune ou senior. Devis gratuit en 2 min.",
    seoKeyword: "assurance voiture sans permis",
    seoKeywords: "assurance voiturette, assurance VSP, assurance Aixam, assurance Ligier sans permis",
    // Désindexée le 2026-09-21 : cannibalise /assurance-sans-permis (même seoKeyword "assurance voiture sans permis"),
    // même traitement que les configs velo et trottinette.
    noindex: true,
    topBarText: "🚙 Voiture sans permis — devis en 2 min",
    badgeText: "VSP",
    heroTitle: "Assurance",
    heroHighlight: "Voiture Sans Permis",
    heroSubtitle: <><strong>Aixam, Ligier, Microcar, Chatenet.</strong> Tiers à tous risques, formules adaptées jeunes (BSR) et seniors.</>,
    mascotSrc: arthurCar,
    mascotAlt: "Arthur — assurance voiture sans permis",
    speechText: "Voiturette sans permis ? Je compare les assureurs spécialisés VSP en 2 min.",
    insuranceType: "auto",
    insuranceLabel: "Sans Permis",
    stats: [
      { icon: Users, value: "Dès 14 ans", label: "BSR accepté" },
      trustReviewStat,
      { icon: Clock, value: "2 min", label: "Pour le devis" },
    ],
    advantages: [
      { icon: ShieldCheck, title: "Tiers à tous risques", description: "Du tiers simple obligatoire à la formule tous risques avec assistance 0 km." },
      { icon: Users, title: "Jeunes BSR & seniors", description: "Formules dédiées dès 14 ans (BSR / AM) et tarifs préférentiels seniors sans malus." },
      { icon: Award, title: "Toutes marques VSP", description: "Aixam, Ligier, Microcar, Chatenet, JDM, Bellier : grille adaptée par modèle." },
      { icon: Phone, title: "Assistance 0 km", description: "Dépannage dès la porte de chez vous, véhicule de prêt sur option." },
    ],
    testimonials: [],
    faqs: [
      { question: "Faut-il une assurance pour une VSP ?", answer: "Oui, obligatoire au même titre qu'une voiture classique : a minima la responsabilité civile (tiers)." },
      { question: "À partir de quel âge ?", answer: "Dès 14 ans avec le permis AM (ex-BSR). Certains assureurs imposent 16 ans selon les formules." },
      { question: "Mon malus auto compte-t-il ?", answer: "Non, la VSP utilise un coefficient propre. Idéal en cas de retrait de permis ou de malus important." },
    ],
    bottomCtaTitle: "Roulez sans permis, assurés",
    bottomCtaDescription: "Devis VSP gratuit — rappel rapide par un expert.",
  },

  "camping-car": {
    slug: "camping-car",
    trackingTitle: "Landing Page Assurance Camping-Car",
    seoTitle: "Assurance Camping-Car & Van : Devis en 2 min",
    seoDescription: "Assurance camping-car, van aménagé, fourgon. Tiers à tous risques, contenu, assistance Europe. Comparez les assureurs spécialisés.",
    seoKeyword: "assurance camping-car",
    seoKeywords: "assurance van aménagé, assurance fourgon aménagé, assurance camping-car tous risques",
    // Désindexée le 2026-09-21 : cannibalise /assurance-camping-car (même seoKeyword "assurance camping-car"),
    // même traitement que les configs velo et trottinette.
    noindex: true,
    topBarText: "🚐 Camping-car & van — assistance Europe, devis 2 min",
    badgeText: "Loisirs",
    heroTitle: "Assurance",
    heroHighlight: "Camping-Car & Van",
    heroSubtitle: <><strong>Profilé, capucine, intégral, van aménagé.</strong> Tiers à tous risques, contenu, assistance Europe et frais d'hébergement inclus.</>,
    mascotSrc: arthurKayak,
    mascotAlt: "Arthur en vadrouille — assurance camping-car",
    speechText: "Camping-car, van ou fourgon ? J'assure votre maison sur roues partout en Europe.",
    insuranceType: "auto",
    insuranceLabel: "Camping-Car",
    stats: [
      { icon: Award, value: "Europe", label: "Assistance incluse" },
      trustReviewStat,
      { icon: Clock, value: "2 min", label: "Pour le devis" },
    ],
    advantages: [
      { icon: ShieldCheck, title: "Tous types couverts", description: "Profilé, capucine, intégral, van aménagé, fourgon ou poids lourd : grille adaptée." },
      { icon: Home, title: "Contenu & aménagements", description: "Mobilier, électroménager, panneaux solaires, équipements outdoor : couverture sur-mesure." },
      { icon: Phone, title: "Assistance Europe 24/7", description: "Dépannage, rapatriement, frais d'hébergement et véhicule de remplacement en cas de panne." },
      { icon: Wallet, title: "Usage saisonnier possible", description: "Tarif réduit si utilisation < 6 mois/an, parfait pour les retraités voyageurs." },
    ],
    testimonials: [],
    faqs: [
      { question: "Mon contenu est-il couvert en cas de vol ?", answer: "Oui, en formule tous risques avec extension contenu (mobilier, électronique, outdoor) jusqu'au plafond souscrit." },
      { question: "Quid des panneaux solaires installés ?", answer: "Couverts s'ils sont déclarés à la souscription (valeur d'achat à l'appui). Vol et bris inclus." },
      { question: "Peut-on rouler hors Europe ?", answer: "Oui, certaines extensions couvrent Maroc, Tunisie, voire Balkans. À préciser à la souscription." },
    ],
    bottomCtaTitle: "Prenez la route en toute liberté",
    bottomCtaDescription: "Devis camping-car gratuit — rappel rapide par un expert loisirs.",
  },

  velo: {
    slug: "velo",
    trackingTitle: "Landing Page Assurance Vélo & VAE",
    seoTitle: "Assurance Vélo & VAE Électrique : Devis en 2 min",
    seoDescription: "Assurance vélo classique, VAE, vélo cargo. Vol, casse, RC, assistance dépannage. Couverture France + Europe. Devis gratuit.",
    seoKeyword: "assurance vélo",
    seoKeywords: "assurance VAE, assurance vélo électrique, assurance vélo cargo, assurance vol vélo",
    // Désindexée : cannibalise /assurance-velo (même seoKeyword "assurance vélo"),
    // même fix déjà appliqué à la config trottinette ci-dessous.
    noindex: true,
    topBarText: "🚲 Vélo & VAE — vol + casse couverts, devis 2 min",
    badgeText: "Mobilité douce",
    heroTitle: "Assurance",
    heroHighlight: "Vélo & VAE électrique",
    heroSubtitle: <><strong>Vol, casse, RC, assistance.</strong> Vélo classique, VAE, vélo cargo, gravel ou route. Couverture France + Europe.</>,
    mascotSrc: arthurBike,
    mascotAlt: "Arthur cycliste avec casque — assurance vélo",
    // "Toutes les 12 minutes" retiré : aucune source dans le repo, et
    // contredit le "400 000/an" de l'article de blog (ça ferait ~1,3 min).
    // Aucun des deux chiffres n'étant sourcé, formulation qualitative.
    speechText: "Le vol de vélo est l'un des sinistres les plus fréquents en ville — protégez le vôtre.",
    // Corrigé le 2026-09-20 : valait "habitation" (même copié-collé que la
    // config trottinette) — les leads vélo partaient comme des leads habitation.
    insuranceType: "velo",
    insuranceLabel: "Vélo & VAE",
    stats: [
      // "15+ Assureurs vélo" retiré : aucun assureur vélo spécialisé (Cyclassur,
      // Sharelock, Qover...) n'est un partenaire réel du site (cf. Partners.tsx,
      // 39 assureurs généralistes, aucun spécialiste vélo). Chiffre invérifiable.
      { icon: Lock, value: "FUB", label: "Antivol homologué" },
      trustReviewStat,
      { icon: Clock, value: "2 min", label: "Pour le devis" },
    ],
    advantages: [
      { icon: Lock, title: "Vol & tentative de vol", description: "Indemnisation à valeur d'achat ou valeur d'usage, antivol homologué FUB exigé." },
      { icon: ShieldCheck, title: "Casse accidentelle", description: "Cadre, fourche, roues, transmission : pièces et main d'œuvre remboursées." },
      { icon: Heart, title: "RC vélo & dommages corporels", description: "Si vous blessez un piéton ou détériorez un bien tiers, votre responsabilité civile est couverte." },
      { icon: Phone, title: "Assistance dépannage", description: "Crevaison, panne batterie VAE, casse : retour à domicile ou poursuite trajet pris en charge." },
    ],
    // Témoignages retirés : 3 noms détaillés (Sophie B., Famille M., Romain T.)
    // sans aucune preuve qu'il s'agit de vrais clients. Tableau vide = section
    // masquée par AdsLandingTemplate (testimonials.length > 0).
    testimonials: [],
    faqs: [
      { question: "L'antivol homologué est-il obligatoire ?", answer: "Oui pour la garantie vol : antivol agréé FUB 2 roues classé Sold Secure Gold ou ART minimum." },
      { question: "Mon vélo est-il couvert hors France ?", answer: "Oui, Europe géographique incluse par défaut chez la plupart des assureurs spécialisés." },
      { question: "Et si je n'ai pas la facture ?", answer: "Une photo, un certificat de marquage Bicycode ou un témoignage peut suffire — à vérifier au cas par cas." },
    ],
    bottomCtaTitle: "Roulez serein sur votre vélo",
    bottomCtaDescription: "Devis vélo & VAE gratuit — rappel rapide par un expert mobilité.",
  },

  "protection-juridique": {
    slug: "protection-juridique",
    trackingTitle: "Landing Page Protection Juridique",
    seoTitle: "Protection Juridique : Devis Gratuit | Arthur",
    seoDescription: "Protection juridique vie privée et pro. Conseils illimités, prise en charge des frais d'avocat et de procédure. Comparez plusieurs assureurs.",
    seoKeyword: "protection juridique",
    seoKeywords: "assurance protection juridique, défense recours, frais avocat assurance, litige assurance",
    // Désindexée le 2026-09-21 : cannibalise /assurance-protection-juridique (même seoKeyword "protection juridique"),
    // même traitement que les configs velo et trottinette.
    noindex: true,
    topBarText: "⚖️ Protection juridique — conseils illimités",
    badgeText: "Défense & conseils",
    heroTitle: "Protection",
    heroHighlight: "Juridique",
    heroSubtitle: <><strong>Litiges conso, travail, voisinage, immobilier.</strong> Conseils illimités, frais d'avocat et de procédure pris en charge.</>,
    mascotSrc: arthurThinking,
    mascotAlt: "Arthur juriste — protection juridique",
    speechText: "Un litige ? Avant d'aller au tribunal, je vous couvre les frais d'avocat et de procédure.",
    insuranceType: "metiers_atypiques",
    insuranceLabel: "Protection Juridique",
    stats: [
      { icon: FileCheck, value: "Illimités", label: "Conseils juridiques" },
      trustReviewStat,
      { icon: Clock, value: "2 min", label: "Pour le devis" },
    ],
    advantages: [
      { icon: Phone, title: "Conseils juridiques illimités", description: "Juristes disponibles par téléphone du lundi au samedi pour tous vos questionnements légaux." },
      { icon: FileCheck, title: "Frais d'avocat couverts", description: "Honoraires avocat, expert, huissier pris en charge jusqu'au plafond souscrit." },
      { icon: ShieldCheck, title: "Tous domaines de la vie", description: "Conso, travail, voisinage, famille, immobilier, fiscalité : couverture étendue." },
      { icon: Award, title: "Procédures amiables et judiciaires", description: "Médiation, transaction, contentieux : accompagnement à chaque étape." },
    ],
    testimonials: [],
    faqs: [
      { question: "Que couvre la protection juridique ?", answer: "Tous litiges hors pénal grave : consommation, travail, voisinage, copropriété, famille, fiscalité, immobilier." },
      { question: "Et si j'ai déjà un litige en cours ?", answer: "Non, l'assureur exclut les litiges connus avant la souscription (délai de carence souvent 3 mois)." },
      { question: "Puis-je choisir mon avocat ?", answer: "Oui, libre choix garanti par la loi. L'assureur peut proposer un avocat partenaire (souvent moins cher pour vous)." },
    ],
    bottomCtaTitle: "Défendez vos droits sans avancer",
    bottomCtaDescription: "Devis protection juridique gratuit — rappel rapide par un expert.",
  },

  "auto-temporaire": {
    slug: "auto-temporaire",
    trackingTitle: "Landing Page Assurance Auto Temporaire",
    seoTitle: "Assurance Auto Temporaire : 1 jour à 3 mois | Arthur",
    seoDescription: "Assurance auto temporaire de 1 à 90 jours. Voiture de prêt, achat, vente, étudiant à l'étranger.",
    seoKeyword: "assurance auto temporaire",
    seoKeywords: "assurance voiture courte durée, assurance auto 1 jour, assurance auto 1 mois, assurance auto temporaire en ligne",
    // Désindexée le 2026-09-21 : cannibalise /assurance-auto-temporaire (même seoKeyword "assurance auto temporaire"),
    // même traitement que les configs velo et trottinette.
    noindex: true,
    topBarText: "⏱️ Assurance auto temporaire de 1 à 90 jours",
    badgeText: "Courte durée",
    heroTitle: "Assurance Auto",
    heroHighlight: "Temporaire",
    heroSubtitle: <><strong>De 1 à 90 jours.</strong> Voiture de prêt, achat-vente, étudiant à l'étranger, expat de retour.</>,
    mascotSrc: arthurCar,
    mascotAlt: "Arthur — assurance auto temporaire",
    speechText: "Besoin d'assurance pour 3 jours, 2 semaines ou 2 mois ? Comparons les offres !",
    insuranceType: "auto",
    insuranceLabel: "Auto Temporaire",
    stats: [
      { icon: Car, value: "1 à 90j", label: "Durée souple" },
      trustReviewStat,
      { icon: Clock, value: "2 min", label: "Pour le devis" },
    ],
    advantages: [
      { icon: Clock, title: "Durée à la carte", description: "1, 7, 15, 30, 60 ou 90 jours : choisissez la durée pile adaptée à votre besoin." },
      { icon: FileCheck, title: "Attestation par email", description: "Carte verte et attestation PDF envoyées par email après la souscription." },
      { icon: ShieldCheck, title: "Tiers + assistance", description: "Responsabilité civile obligatoire incluse + assistance dépannage 24/7." },
      { icon: Wallet, title: "Pas d'engagement annuel", description: "Vous payez uniquement la période souscrite, idéal pour usage ponctuel ou transitoire." },
    ],
    testimonials: [],
    faqs: [
      { question: "Quelle durée minimale et maximale ?", answer: "De 1 jour à 90 jours selon les assureurs. Au-delà, contrat annuel classique recommandé." },
      { question: "Quel profil conducteur accepté ?", answer: "Permis depuis 1 an minimum, sans malus important. Jeunes conducteurs et résiliés : étude au cas par cas." },
      { question: "Et pour un véhicule étranger ?", answer: "Possible si carte grise européenne en cours de validité. Démarches d'importation à finaliser ensuite." },
    ],
    bottomCtaTitle: "Roulez assuré, pile le temps qu'il faut",
    bottomCtaDescription: "Devis auto temporaire gratuit — rappel rapide par un conseiller.",
  },

  trottinette: {
    slug: "trottinette",
    trackingTitle: "Landing Page Assurance Trottinette Électrique",
    seoTitle: `Assurance Trottinette Électrique : Devis dès ${TROTTINETTE_RC_PRICE_MONTHLY} (RC seule)`,
    seoDescription: `Assurance trottinette électrique obligatoire (EDPM). RC seule dès ${TROTTINETTE_RC_PRICE_MONTHLY}. Devis 2 min, attestation envoyée par email après souscription. Spécialiste mobilité.`,
    seoKeyword: "assurance trottinette électrique",
    seoKeywords: "assurance EDPM, assurance trottinette obligatoire, assurance gyroroue, assurance hoverboard, trottinette électrique pas chère",
    noindex: true,
    topBarText: `⚡ Trottinette électrique — RC seule obligatoire dès ${TROTTINETTE_RC_PRICE_MONTHLY}, attestation par email`,
    badgeText: "EDPM • Spécialiste mobilité",
    heroTitle: "Assurance",
    heroHighlight: "Trottinette électrique",
    // "vol, casse, individuelle accident" retiré : contredisait "RC seule"
    // juste après (ces garanties ne sont pas confirmées par l'IPID fourni
    // par Paul, qui ne documente que RC, garantie Mobilité, défense pénale
    // et recours, et protection du conducteur en option — chantier 2026-09-30).
    heroSubtitle: <><strong>Obligatoire depuis 2019.</strong> Responsabilité civile jusqu'à 100 M€, défense pénale et recours (3 000€/sinistre). RC seule dès {TROTTINETTE_RC_PRICE_MONTHLY}.</>,
    mascotSrc: arthurScoot,
    mascotAlt: "Arthur en trottinette électrique — assurance EDPM obligatoire",
    speechText: "Sans assurance, vous risquez 3 750 € d'amende et la confiscation. Je vous trouve la meilleure couverture en 2 minutes.",
    // Corrigé le 2026-09-20 : valait "habitation" (copié-collé de la config
    // habitation), donc chaque lead de cette landing était enregistré, envoyé
    // par email et tracké comme une assurance habitation.
    insuranceType: "trottinette",
    insuranceLabel: "Trottinette / EDPM",
    // "20+ Assureurs EDPM" retiré : aucune source vérifiable (même défaut
    // déjà corrigé sur vélo/scooter le 2026-09-29, jamais appliqué ici).
    stats: [
      { icon: Wallet, value: TROTTINETTE_RC_PRICE_MONTHLY, label: "RC seule, à partir de" },
      trustReviewStat,
      { icon: Clock, value: "2 min", label: "Pour le devis" },
    ],
    // "Individuelle conducteur" et "Assistance & dépannage" (24/7) retirées :
    // aucune assistance/dépannage/retour à domicile dans l'IPID e-Trottineur
    // (Allianz IARD / April Moto, 05/2025) fourni par Paul, et la protection
    // corporelle du conducteur y est en OPTION, jamais incluse par défaut —
    // remplacées par les garanties réellement confirmées (chantier 2026-09-30).
    // "Garantie vol & tentative" retirée (2026-09-30, décision de Paul) :
    // aucune mention du vol dans les avantages/titre/meta/JSON-LD/landing —
    // la seule ligne "Vol" du site vit désormais dans le tableau de
    // garanties du pilier (TROTTINETTE_VOL_STATUS), pas ici.
    advantages: [
      { icon: ShieldCheck, title: "RC obligatoire incluse", description: "Responsabilité civile EDPM imposée par la loi : jusqu'à 100 M€ pour les dommages matériels causés aux tiers." },
      { icon: FileCheck, title: "Défense pénale et recours", description: "Litige après un accident ? Vos frais de défense et de recours pris en charge jusqu'à 3 000 € par sinistre." },
      { icon: Heart, title: "Protection du conducteur (en option)", description: "Frais médicaux, invalidité, décès : une garantie individuelle accident disponible en option, à ajouter selon vos besoins." },
    ],
    // Témoignages retirés : 3 noms détaillés (Julien P., Sarah K., Mehdi R. —
    // le chantier vélo n'en avait signalé que 2, le 3ème avait échappé à la
    // relecture) sans aucune preuve qu'il s'agit de vrais clients. Même
    // défaut que la config vélo ci-dessus, jamais traité au moment du fix
    // noindex de cette config.
    testimonials: [],
    // FAQ "antivol homologué pour la garantie vol" retirée (2026-09-30) :
    // présupposait une garantie vol incluse, ce qui n'est plus le cas
    // (TROTTINETTE_VOL_STATUS). Le mot "vol" a aussi été retiré de la
    // réponse "assurance habitation" ci-dessous (question conservée, elle
    // décrit une limite de l'habitation, pas une promesse sur notre offre).
    faqs: [
      { question: "L'assurance trottinette est-elle vraiment obligatoire ?", answer: "Oui, la RC EDPM est obligatoire depuis 2019 pour circuler sur la voie publique. Sans assurance : 3 750 € d'amende et confiscation possible de l'engin." },
      { question: "Mon assurance habitation suffit-elle ?", answer: "Parfois, mais à vérifier : la RC vie privée des contrats MRH récents inclut souvent la RC EDPM (à confirmer par écrit). Elle ne couvre ni la casse ni vos blessures." },
      { question: "Et si ma trottinette est débridée ?", answer: "Aucun assureur ne couvre une trottinette débridée (>25 km/h) : elle devient juridiquement un cyclomoteur (immatriculation + permis AM requis)." },
    ],
    bottomCtaTitle: "Roulez en règle dès aujourd'hui",
    bottomCtaDescription: "Devis trottinette gratuit — attestation par email après souscription, rappel rapide par un expert mobilité.",
  },
};

