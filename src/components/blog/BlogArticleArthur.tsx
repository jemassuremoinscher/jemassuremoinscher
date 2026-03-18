import arthurIdea from "@/assets/mascotte/arthur-idea.webp";
import arthurCar from "@/assets/mascotte/arthur-car.webp";
import arthurHouse from "@/assets/mascotte/arthur-house.webp";
import arthurSick from "@/assets/mascotte/arthur-sick.webp";
import arthurAnimals from "@/assets/mascotte/arthur-animals.webp";
import arthurBusiness from "@/assets/mascotte/arthur-business.webp";
import arthurDetective from "@/assets/mascotte/arthur-detective.webp";
import arthurMoto from "@/assets/mascotte/arthur-moto.webp";
import arthurPointing from "@/assets/mascotte/arthur-pointing.webp";
import arthurRunningCoin from "@/assets/mascotte/arthur-running-coin.webp";

const categoryArthurMap: Record<string, string> = {
  "Assurance Auto": arthurCar,
  "Assurance Habitation": arthurHouse,
  "Mutuelle Santé": arthurSick,
  "Assurance Animaux": arthurAnimals,
  "Assurance Emprunteur": arthurBusiness,
  "Assurance Prêt": arthurBusiness,
  "Droits & Litiges": arthurDetective,
  "Mobilité Verte": arthurMoto,
  "Conseils Experts": arthurIdea,
  "Guides Pratiques": arthurPointing,
  "Actualités Légales": arthurDetective,
  "Conseils": arthurRunningCoin,
};

interface BlogArticleArthurProps {
  category: string;
  className?: string;
}

const BlogArticleArthur = ({ category, className = "" }: BlogArticleArthurProps) => {
  const src = categoryArthurMap[category] || arthurIdea;
  
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
