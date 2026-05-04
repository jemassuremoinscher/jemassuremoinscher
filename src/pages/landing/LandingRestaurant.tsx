import AdsLandingTemplate from "@/components/landing/AdsLandingTemplate";
import { landingConfigs } from "@/data/landingConfigs";

const LandingRestaurant = () => <AdsLandingTemplate {...landingConfigs["restaurant"]} />;
export default LandingRestaurant;
