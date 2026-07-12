import arthurIdea from "@/assets/mascotte/arthur-idea.webp";
import arthurCar from "@/assets/mascotte/arthur-car.webp?w=480&format=webp";
import arthurHouse from "@/assets/mascotte/arthur-house.webp?w=480&format=webp";
import arthurSick from "@/assets/mascotte/arthur-sick.webp";
import arthurAnimals from "@/assets/mascotte/arthur-animals.webp";
import arthurBusiness from "@/assets/mascotte/arthur-business.webp";
import arthurDetective from "@/assets/mascotte/arthur-detective.webp";
import arthurMoto from "@/assets/mascotte/arthur-moto.webp?w=480&format=webp";
import arthurPointing from "@/assets/mascotte/arthur-pointing.webp";
import arthurRunningCoin from "@/assets/mascotte/arthur-running-coin.webp";
import arthurClimbing from "@/assets/mascotte/arthur-climbing.webp";
import arthurKayak from "@/assets/mascotte/arthur-kayak.webp";
import arthurBike from "@/assets/mascotte/arthur-bike.png";
import arthurKarting from "@/assets/mascotte/arthur-karting.webp";

const categoryArthurMap: Record<string, string> = {
  "Assurance Auto": arthurCar,
  "Assurance Habitation": arthurHouse,
  "Mutuelle Santé": arthurSick,
  "Assurance Animaux": arthurAnimals,
  "Assurance Emprunteur": arthurBusiness,
  "Droits & Litiges": arthurDetective,
  "Mobilité Verte": arthurBike,
  "Conseils Experts": arthurIdea,
  "Guides Pratiques": arthurPointing,
  "Actualités Légales": arthurDetective,
  "Conseils": arthurRunningCoin,
  "Métiers Atypiques": arthurClimbing,
  "Sports & Outdoor": arthurClimbing,
  "Sports Outdoor": arthurClimbing,
  "Événementiel": arthurKarting,
  "Loisirs Aventure": arthurClimbing,
  "Sports Nautiques": arthurKayak,
  "Vélo & Mobilité": arthurBike,
};

// Per-slug overrides take precedence over category mapping
const slugArthurMap: Record<string, string> = {
  "assurance-parc-accrobranche-obligations-2026": arthurClimbing,
  "assurance-moniteur-sports-outdoor-2026": arthurKayak,
  "assurance-organisateur-evenement-festival-2026": arthurKarting,
  "velos-cargos-vae-protection-vol-urbain": arthurBike,
};

const subjectArthurRules: Array<{ keywords: string[]; src: string }> = [
  { keywords: ["accrobranche", "escalade", "cordiste", "hauteur", "grimpe", "aventure"], src: arthurClimbing },
  { keywords: ["kayak", "nautique", "canyon", "plongee", "outdoor", "moniteur", "sport"], src: arthurKayak },
  { keywords: ["festival", "evenement", "organisateur", "concert", "karting"], src: arthurKarting },
  { keywords: ["velo", "vae", "cargo", "mobilite"], src: arthurBike },
  { keywords: ["moto", "scooter", "deux-roues"], src: arthurMoto },
  { keywords: ["auto", "voiture", "conducteur", "malus", "bct"], src: arthurCar },
  { keywords: ["habitation", "colocation", "logement", "degat", "pno"], src: arthurHouse },
  { keywords: ["sante", "mutuelle", "medical", "frais"], src: arthurSick },
  { keywords: ["animaux", "chien", "chat"], src: arthurAnimals },
  { keywords: ["emprunteur", "pret", "lemoine", "credit"], src: arthurBusiness },
  { keywords: ["arnaque", "litige", "droits", "resiliation", "declaration"], src: arthurDetective },
];

interface BlogArticleArthurProps {
  category: string;
  slug?: string;
  className?: string;
}

const BlogArticleArthur = ({ category, slug, className = "" }: BlogArticleArthurProps) => {
  const normalizedSlug = slug?.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "") || "";
  const inferredSrc = subjectArthurRules.find((rule) =>
    rule.keywords.some((keyword) => normalizedSlug.includes(keyword))
  )?.src;
  const src = (slug && slugArthurMap[slug]) || inferredSrc || categoryArthurMap[category] || arthurIdea;
  
  return (
    <img
      src={src}
      alt={`Arthur mascotte ${category} - assurance moins chère`}
      className={`h-10 w-10 sm:h-12 sm:w-12 object-contain flex-shrink-0 ${className}`}
      width={48}
      height={48}
      loading="lazy"
    />
  );
};

export default BlogArticleArthur;
