import arthurIdea from "@/assets/mascotte/arthur-idea.png";
import arthurCar from "@/assets/mascotte/arthur-car.png";
import arthurHouse from "@/assets/mascotte/arthur-house.png";
import arthurSick from "@/assets/mascotte/arthur-sick.png";
import arthurAnimals from "@/assets/mascotte/arthur-animals.png";
import arthurBusiness from "@/assets/mascotte/arthur-business.png";
import arthurDetective from "@/assets/mascotte/arthur-detective.png";
import arthurMoto from "@/assets/mascotte/arthur-moto.png";
import arthurPointing from "@/assets/mascotte/arthur-pointing.png";
import arthurRunningCoin from "@/assets/mascotte/arthur-running-coin.png";

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
      alt=""
      aria-hidden="true"
      className={`h-10 w-10 sm:h-12 sm:w-12 object-contain flex-shrink-0 ${className}`}
      width={48}
      height={48}
      loading="lazy"
    />
  );
};

export default BlogArticleArthur;
