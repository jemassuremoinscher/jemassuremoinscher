import AdsLandingTemplate from "@/components/landing/AdsLandingTemplate";
import { landingConfigs } from "@/data/landingConfigs";

const LandingSansPermis = () => <AdsLandingTemplate {...(landingConfigs["sans-permis"] as any)} />;
export default LandingSansPermis;
