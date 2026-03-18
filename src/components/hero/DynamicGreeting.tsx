import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import arthurThumbsUp from "@/assets/mascotte/arthur-wink-thumbsup.webp";
import arthurCar from "@/assets/mascotte/arthur-car.webp";
import arthurHouse from "@/assets/mascotte/arthur-house.webp";
import arthurSick from "@/assets/mascotte/arthur-sick.webp";
import arthurAnimals from "@/assets/mascotte/arthur-animals.webp";
import arthurMoto from "@/assets/mascotte/arthur-moto.webp";
import arthurBusiness from "@/assets/mascotte/arthur-business.webp";

interface DynamicGreetingConfig {
  title: React.ReactNode;
  subtitle: string;
  arthurSpeech: string;
  mascotSrc: string;
  mascotAlt: string;
  ctaLink: string;
  ctaText: string;
  badgeText: React.ReactNode;
}

const refConfigs: Record<string, DynamicGreetingConfig> = {
  "jeune-conducteur": {
    title: (
      <>
        Assurance <span className="text-accent">Jeune Conducteur</span>
        <br />au meilleur prix
      </>
    ),
    subtitle: "Permis récent ? Économisez jusqu'à 40% sur votre première assurance auto. Nos assureurs partenaires proposent des tarifs spéciaux permis probatoire.",
    arthurSpeech: "Bienvenue, jeune conducteur ! 🚗",
    mascotSrc: arthurCar,
    mascotAlt: "Arthur en voiture — assurance jeune conducteur pas chère",
    ctaLink: "/comparateur?step=1&profile=jeune",
    ctaText: "Mon prix jeune conducteur →",
    badgeText: <>Jusqu'à <span className="text-accent">-40%</span> pour les permis probatoires</>,
  },
  "malusse": {
    title: (
      <>
        Assurance Auto <span className="text-accent">Malussé</span>
        <br />sans refus
      </>
    ),
    subtitle: "Malus élevé ? Coefficient défavorable ? Nos assureurs spécialisés acceptent tous les profils, même les plus difficiles.",
    arthurSpeech: "Pas de panique, j'ai la solution ! 💪",
    mascotSrc: arthurCar,
    mascotAlt: "Arthur en voiture — assurance malussé acceptée",
    ctaLink: "/comparateur?step=1&profile=malusse",
    ctaText: "Mon prix malussé →",
    badgeText: <>Assureurs <span className="text-accent">spécialisés malus</span> — tous profils acceptés</>,
  },
  "senior": {
    title: (
      <>
        Assurance <span className="text-accent">Senior</span>
        <br />adaptée à vos besoins
      </>
    ),
    subtitle: "Plus de 55 ans ? Profitez de garanties sur mesure et de tarifs avantageux grâce à votre expérience au volant.",
    arthurSpeech: "L'expérience, ça compte ! 🎯",
    mascotSrc: arthurCar,
    mascotAlt: "Arthur — assurance senior avantageuse",
    ctaLink: "/comparateur?step=1&profile=senior",
    ctaText: "Mon prix senior →",
    badgeText: <>Jusqu'à <span className="text-accent">-30%</span> grâce à votre expérience</>,
  },
  "famille": {
    title: (
      <>
        Assurance <span className="text-accent">Famille</span>
        <br />complète et économique
      </>
    ),
    subtitle: "Protégez toute la famille : auto, habitation, santé. Regroupez vos contrats et économisez sur l'ensemble.",
    arthurSpeech: "Toute la famille protégée ! 👨‍👩‍👧‍👦",
    mascotSrc: arthurHouse,
    mascotAlt: "Arthur — assurance famille multi-produits",
    ctaLink: "/comparateur?step=1&profile=famille",
    ctaText: "Mon prix famille →",
    badgeText: <>Pack famille : <span className="text-accent">multi-contrats</span> avantageux</>,
  },
  "habitation": {
    title: (
      <>
        Assurance <span className="text-accent">Habitation</span>
        <br />pas chère
      </>
    ),
    subtitle: "Locataire ou propriétaire ? Comparez les meilleures offres habitation dès 3€/mois. Souscription en ligne rapide.",
    arthurSpeech: "Votre logement mérite le meilleur ! 🏠",
    mascotSrc: arthurHouse,
    mascotAlt: "Arthur — assurance habitation économique",
    ctaLink: "/comparateur?step=1&type=habitation",
    ctaText: "Mon prix habitation →",
    badgeText: <>Dès <span className="text-accent">3€/mois</span> — souscription en ligne</>,
  },
  "sante": {
    title: (
      <>
        Mutuelle <span className="text-accent">Santé</span>
        <br />sur mesure
      </>
    ),
    subtitle: "Trouvez la mutuelle qui correspond à vos besoins : optique, dentaire, hospitalisation. Comparez plus de 50 mutuelles.",
    arthurSpeech: "Votre santé, notre priorité ! 🏥",
    mascotSrc: arthurSick,
    mascotAlt: "Arthur — mutuelle santé pas chère",
    ctaLink: "/comparateur?step=1&type=sante",
    ctaText: "Mon prix mutuelle →",
    badgeText: <>Plus de <span className="text-accent">50 mutuelles</span> comparées</>,
  },
  "animaux": {
    title: (
      <>
        Assurance <span className="text-accent">Animaux</span>
        <br />à petit prix
      </>
    ),
    subtitle: "Protégez votre compagnon à 4 pattes. Frais vétérinaires remboursés jusqu'à 100%. Dès 8€/mois.",
    arthurSpeech: "Nos amis comptent aussi ! 🐾",
    mascotSrc: arthurAnimals,
    mascotAlt: "Arthur — assurance animaux économique",
    ctaLink: "/comparateur?step=1&type=animaux",
    ctaText: "Mon prix animaux →",
    badgeText: <>Dès <span className="text-accent">8€/mois</span> — chiens et chats</>,
  },
  "moto": {
    title: (
      <>
        Assurance <span className="text-accent">Moto</span>
        <br />au meilleur tarif
      </>
    ),
    subtitle: "Motard passionné ? Comparez les assurances moto tous risques, équipements inclus. Devis en 2 minutes.",
    arthurSpeech: "En route, motard ! 🏍️",
    mascotSrc: arthurMoto,
    mascotAlt: "Arthur en moto — assurance moto pas chère",
    ctaLink: "/comparateur?step=1&type=moto",
    ctaText: "Mon prix moto →",
    badgeText: <>Équipements <span className="text-accent">inclus</span> dans nos offres</>,
  },
  "pro": {
    title: (
      <>
        Assurance <span className="text-accent">Professionnelle</span>
        <br />RC Pro & MRP
      </>
    ),
    subtitle: "Entrepreneur, freelance, TPE ? Protégez votre activité avec une RC Pro ou une multirisque professionnelle adaptée.",
    arthurSpeech: "Votre business, bien protégé ! 💼",
    mascotSrc: arthurBusiness,
    mascotAlt: "Arthur — assurance professionnelle RC Pro",
    ctaLink: "/comparateur?step=1&type=rc-pro",
    ctaText: "Mon prix pro →",
    badgeText: <>RC Pro dès <span className="text-accent">15€/mois</span></>,
  },
};

export function useDynamicGreeting(): DynamicGreetingConfig | null {
  const [searchParams] = useSearchParams();
  const ref = searchParams.get("ref");

  return useMemo(() => {
    if (!ref || !refConfigs[ref]) return null;
    return refConfigs[ref];
  }, [ref]);
}

export function getDefaultGreeting() {
  return {
    mascotSrc: arthurThumbsUp,
    mascotAlt: "Arthur mascotte jemassuremoinscher.fr - super-héros de l'assurance moins chère",
  };
}
