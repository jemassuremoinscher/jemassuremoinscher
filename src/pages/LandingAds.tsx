import AdsLandingTemplate from "@/components/landing/AdsLandingTemplate";
import { landingConfigs } from "@/data/landingConfigs";

const LandingAds = () => <AdsLandingTemplate {...landingConfigs.auto} />;

export default LandingAds;