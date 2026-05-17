import AdsLandingTemplate from "@/components/landing/AdsLandingTemplate";
import { landingConfigs } from "@/data/landingConfigs";

const LandingVelo = () => <AdsLandingTemplate {...(landingConfigs["velo"] as any)} />;
export default LandingVelo;
