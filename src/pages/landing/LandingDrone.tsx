import AdsLandingTemplate from "@/components/landing/AdsLandingTemplate";
import { landingConfigs } from "@/data/landingConfigs";

const LandingDrone = () => <AdsLandingTemplate {...landingConfigs["drone"]} />;
export default LandingDrone;
