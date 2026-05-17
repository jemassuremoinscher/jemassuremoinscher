import AdsLandingTemplate from "@/components/landing/AdsLandingTemplate";
import { landingConfigs } from "@/data/landingConfigs";

const LandingCampingCar = () => <AdsLandingTemplate {...(landingConfigs["camping-car"] as any)} />;
export default LandingCampingCar;
