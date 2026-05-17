import AdsLandingTemplate from "@/components/landing/AdsLandingTemplate";
import { landingConfigs } from "@/data/landingConfigs";

const LandingMutuelleEntreprise = () => <AdsLandingTemplate {...(landingConfigs["mutuelle-entreprise"] as any)} />;
export default LandingMutuelleEntreprise;
