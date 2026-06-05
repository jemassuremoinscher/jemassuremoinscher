import AdsLandingTemplate from "@/components/landing/AdsLandingTemplate";
import { landingConfigs } from "@/data/landingConfigs";

const LandingCyber = () => <AdsLandingTemplate {...(landingConfigs["cyber"] as any)} />;
export default LandingCyber;
