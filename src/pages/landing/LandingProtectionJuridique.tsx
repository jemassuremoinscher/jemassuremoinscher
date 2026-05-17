import AdsLandingTemplate from "@/components/landing/AdsLandingTemplate";
import { landingConfigs } from "@/data/landingConfigs";

const LandingProtectionJuridique = () => <AdsLandingTemplate {...(landingConfigs["protection-juridique"] as any)} />;
export default LandingProtectionJuridique;
