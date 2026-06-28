import AdsLandingTemplate from "@/components/landing/AdsLandingTemplate";
import { landingConfigs } from "@/data/landingConfigs";

const LandingTrottinette = () => <AdsLandingTemplate {...(landingConfigs["trottinette"] as any)} />;
export default LandingTrottinette;
