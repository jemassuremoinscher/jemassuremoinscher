import AdsLandingTemplate from "@/components/landing/AdsLandingTemplate";
import { landingConfigs } from "@/data/landingConfigs";

const LandingDecennale = () => <AdsLandingTemplate {...(landingConfigs["decennale"] as any)} />;
export default LandingDecennale;
