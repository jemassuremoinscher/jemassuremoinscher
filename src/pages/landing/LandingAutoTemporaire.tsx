import AdsLandingTemplate from "@/components/landing/AdsLandingTemplate";
import { landingConfigs } from "@/data/landingConfigs";

const LandingAutoTemporaire = () => <AdsLandingTemplate {...(landingConfigs["auto-temporaire"] as any)} />;
export default LandingAutoTemporaire;
