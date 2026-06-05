import AdsLandingTemplate from "@/components/landing/AdsLandingTemplate";
import { landingConfigs } from "@/data/landingConfigs";

const LandingFlotteAuto = () => <AdsLandingTemplate {...(landingConfigs["flotte-auto"] as any)} />;
export default LandingFlotteAuto;
