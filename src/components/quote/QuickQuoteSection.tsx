import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Car, Check, ChevronRight, ChevronLeft, Calendar, Mail, Bike, Home, HeartPulse, PawPrint, Heart, Shield } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import arthurThinking from "@/assets/mascotte/arthur-thinking.png";

type InsuranceType = "auto" | "moto" | "habitation" | "sante" | "animaux" | "vie" | "";
type VehicleType = "citadine" | "berline" | "suv" | "sportive" | "scooter" | "routiere" | "";
type PropertyType = "appartement" | "maison" | "studio" | "";
type PetType = "chien" | "chat" | "nac" | "";
type CoverageLevel = "essentiel" | "confort" | "premium" | "";
type AgeRange = "18-25" | "26-35" | "36-50" | "50+" | "";

interface QuoteData {
  insuranceType: InsuranceType;
  specificChoice: string;
  ageRange: AgeRange;
  email: string;
}

const QuickQuoteSection = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [direction, setDirection] = useState(1);
  const [quoteData, setQuoteData] = useState<QuoteData>({
    insuranceType: "",
    specificChoice: "",
    ageRange: "",
    email: "",
  });

  const totalSteps = 4;

  // Step 1: Insurance types
  const insuranceTypes = [
    { value: "auto", label: "Auto", icon: Car, emoji: "🚗" },
    { value: "moto", label: "Moto", icon: Bike, emoji: "🏍️" },
    { value: "habitation", label: "Habitation", icon: Home, emoji: "🏠" },
    { value: "sante", label: "Santé", icon: HeartPulse, emoji: "💊" },
    { value: "animaux", label: "Animaux", icon: PawPrint, emoji: "🐾" },
    { value: "vie", label: "Vie", icon: Heart, emoji: "❤️" },
  ];

  // Step 2: Specific options based on insurance type
  const getSpecificOptions = () => {
    switch (quoteData.insuranceType) {
      case "auto":
        return [
          { value: "citadine", label: "Citadine", description: "Petite voiture de ville", icon: "🚗" },
          { value: "berline", label: "Berline", description: "Confort et espace", icon: "🚙" },
          { value: "suv", label: "SUV / 4x4", description: "Tout-terrain", icon: "🚐" },
        ];
      case "moto":
        return [
          { value: "scooter", label: "Scooter", description: "Moins de 125cc", icon: "🛵" },
          { value: "routiere", label: "Routière", description: "Moto de route", icon: "🏍️" },
          { value: "sportive", label: "Sportive", description: "Haute performance", icon: "🏎️" },
        ];
      case "habitation":
        return [
          { value: "studio", label: "Studio", description: "Moins de 30m²", icon: "🏢" },
          { value: "appartement", label: "Appartement", description: "2 pièces et plus", icon: "🏬" },
          { value: "maison", label: "Maison", description: "Avec ou sans jardin", icon: "🏠" },
        ];
      case "sante":
        return [
          { value: "essentiel", label: "Essentiel", description: "Couverture de base", icon: "💊" },
          { value: "confort", label: "Confort", description: "Bon rapport qualité/prix", icon: "🏥" },
          { value: "premium", label: "Premium", description: "Couverture maximale", icon: "⭐" },
        ];
      case "animaux":
        return [
          { value: "chien", label: "Chien", description: "Toutes races", icon: "🐕" },
          { value: "chat", label: "Chat", description: "Toutes races", icon: "🐈" },
          { value: "nac", label: "NAC", description: "Nouveaux animaux", icon: "🐰" },
        ];
      case "vie":
        return [
          { value: "deces", label: "Décès", description: "Protection famille", icon: "🛡️" },
          { value: "epargne", label: "Épargne", description: "Constitution capital", icon: "💰" },
          { value: "retraite", label: "Retraite", description: "Préparer l'avenir", icon: "🌅" },
        ];
      default:
        return [];
    }
  };

  const getStep2Question = () => {
    switch (quoteData.insuranceType) {
      case "auto": return "Quel est votre véhicule ?";
      case "moto": return "Quel type de deux-roues ?";
      case "habitation": return "Quel type de logement ?";
      case "sante": return "Quel niveau de couverture ?";
      case "animaux": return "Quel type d'animal ?";
      case "vie": return "Quel type d'assurance vie ?";
      default: return "Précisez votre besoin";
    }
  };

  const getStep2Icon = () => {
    const type = insuranceTypes.find(t => t.value === quoteData.insuranceType);
    return type?.icon || Shield;
  };

  const ageOptions = [
    { value: "18-25", label: "18-25 ans", icon: "👤" },
    { value: "26-35", label: "26-35 ans", icon: "👨" },
    { value: "36-50", label: "36-50 ans", icon: "👨‍💼" },
    { value: "50+", label: "50+ ans", icon: "👴" },
  ];

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setDirection(1);
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      setDirection(-1);
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleSubmit = () => {
    console.log("Quote data:", quoteData);
  };

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 100 : -100,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 100 : -100,
      opacity: 0,
    }),
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return quoteData.insuranceType !== "";
      case 2:
        return quoteData.specificChoice !== "";
      case 3:
        return quoteData.ageRange !== "";
      case 4:
        return quoteData.email.includes("@");
      default:
        return false;
    }
  };

  const Step2Icon = getStep2Icon();

  return (
    <section
      className="py-12 md:py-16 bg-gradient-to-b from-background to-muted/30"
      aria-labelledby="quick-quote-title"
    >
      <h2 id="quick-quote-title" className="sr-only">
        Simulateur d'assurance - Auto, Moto, Habitation, Santé, Animaux, Vie
      </h2>

      <div className="container mx-auto px-4">
        {/* Visible Title with Arthur */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-8"
        >
          <div className="flex items-center justify-center gap-4 mb-4">
            <motion.img
              src={arthurThinking}
              alt="Arthur réfléchit à votre devis"
              className="w-16 h-auto md:w-20"
              loading="lazy"
              animate={{ rotate: [0, -5, 5, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            />
            <div className="text-left">
              <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-1">
                Mon Devis Rapide
              </h3>
              <p className="text-muted-foreground">
                Arthur calcule votre économie en 30 secondes
              </p>
            </div>
          </div>
        </motion.div>

        {/* Stepper */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {Array.from({ length: totalSteps }).map((_, index) => (
            <div key={index} className="flex items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${
                  index + 1 <= currentStep
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {index + 1 < currentStep ? (
                  <Check className="w-4 h-4" />
                ) : (
                  index + 1
                )}
              </div>
              {index < totalSteps - 1 && (
                <div
                  className={`w-6 md:w-12 h-1 mx-1 rounded-full transition-all duration-300 ${
                    index + 1 < currentStep ? "bg-primary" : "bg-muted"
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        {/* Question Container */}
        <div className="max-w-2xl mx-auto bg-card rounded-2xl shadow-lg border border-border/50 p-6 md:p-8 overflow-hidden">
          <AnimatePresence mode="wait" custom={direction}>
            {/* Step 1: Insurance Type */}
            {currentStep === 1 && (
              <motion.div
                key="step1"
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.3, ease: "easeInOut" }}
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <Shield className="w-5 h-5 text-primary" />
                  </div>
                  <h4 className="text-lg md:text-xl font-bold text-foreground">
                    Quelle assurance recherchez-vous ?
                  </h4>
                </div>

                <RadioGroup
                  value={quoteData.insuranceType}
                  onValueChange={(value) => setQuoteData((prev) => ({ ...prev, insuranceType: value as InsuranceType, specificChoice: "" }))}
                  className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4"
                >
                  {insuranceTypes.map((option) => (
                    <Label
                      key={option.value}
                      htmlFor={`insurance-${option.value}`}
                      className="cursor-pointer"
                    >
                      <div
                        className={`relative p-4 md:p-5 rounded-xl border-2 transition-all duration-300 card-hover ${
                          quoteData.insuranceType === option.value
                            ? "border-primary bg-primary/5 shadow-md"
                            : "border-border hover:border-primary/50 bg-card"
                        }`}
                      >
                        {quoteData.insuranceType === option.value && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="absolute top-2 right-2 w-5 h-5 rounded-full bg-primary flex items-center justify-center"
                          >
                            <Check className="w-3 h-3 text-primary-foreground" />
                          </motion.div>
                        )}

                        <div className="flex flex-col items-center text-center gap-2">
                          <span className="text-3xl">{option.emoji}</span>
                          <span className="font-bold text-foreground text-sm md:text-base">
                            {option.label}
                          </span>
                        </div>

                        <RadioGroupItem
                          value={option.value}
                          id={`insurance-${option.value}`}
                          className="sr-only"
                        />
                      </div>
                    </Label>
                  ))}
                </RadioGroup>
              </motion.div>
            )}

            {/* Step 2: Specific Choice */}
            {currentStep === 2 && (
              <motion.div
                key="step2"
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.3, ease: "easeInOut" }}
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <Step2Icon className="w-5 h-5 text-primary" />
                  </div>
                  <h4 className="text-lg md:text-xl font-bold text-foreground">
                    {getStep2Question()}
                  </h4>
                </div>

                <RadioGroup
                  value={quoteData.specificChoice}
                  onValueChange={(value) => setQuoteData((prev) => ({ ...prev, specificChoice: value }))}
                  className="grid grid-cols-1 md:grid-cols-3 gap-4"
                >
                  {getSpecificOptions().map((option) => (
                    <Label
                      key={option.value}
                      htmlFor={`specific-${option.value}`}
                      className="cursor-pointer"
                    >
                      <div
                        className={`relative p-4 md:p-6 rounded-xl border-2 transition-all duration-300 card-hover ${
                          quoteData.specificChoice === option.value
                            ? "border-primary bg-primary/5 shadow-md"
                            : "border-border hover:border-primary/50 bg-card"
                        }`}
                      >
                        {quoteData.specificChoice === option.value && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="absolute top-2 right-2 w-6 h-6 rounded-full bg-primary flex items-center justify-center"
                          >
                            <Check className="w-4 h-4 text-primary-foreground" />
                          </motion.div>
                        )}

                        <div className="flex flex-col items-center text-center gap-2">
                          <span className="text-4xl mb-2">{option.icon}</span>
                          <span className="font-bold text-foreground">
                            {option.label}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {option.description}
                          </span>
                        </div>

                        <RadioGroupItem
                          value={option.value}
                          id={`specific-${option.value}`}
                          className="sr-only"
                        />
                      </div>
                    </Label>
                  ))}
                </RadioGroup>
              </motion.div>
            )}

            {/* Step 3: Age */}
            {currentStep === 3 && (
              <motion.div
                key="step3"
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.3, ease: "easeInOut" }}
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <Calendar className="w-5 h-5 text-primary" />
                  </div>
                  <h4 className="text-lg md:text-xl font-bold text-foreground">
                    Quel est votre âge ?
                  </h4>
                </div>

                <RadioGroup
                  value={quoteData.ageRange}
                  onValueChange={(value) => setQuoteData((prev) => ({ ...prev, ageRange: value as AgeRange }))}
                  className="grid grid-cols-2 md:grid-cols-4 gap-4"
                >
                  {ageOptions.map((option) => (
                    <Label
                      key={option.value}
                      htmlFor={`age-${option.value}`}
                      className="cursor-pointer"
                    >
                      <div
                        className={`relative p-4 rounded-xl border-2 transition-all duration-300 card-hover ${
                          quoteData.ageRange === option.value
                            ? "border-primary bg-primary/5 shadow-md"
                            : "border-border hover:border-primary/50 bg-card"
                        }`}
                      >
                        {quoteData.ageRange === option.value && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="absolute top-2 right-2 w-5 h-5 rounded-full bg-primary flex items-center justify-center"
                          >
                            <Check className="w-3 h-3 text-primary-foreground" />
                          </motion.div>
                        )}

                        <div className="flex flex-col items-center text-center gap-1">
                          <span className="text-2xl">{option.icon}</span>
                          <span className="font-bold text-foreground text-sm">
                            {option.label}
                          </span>
                        </div>

                        <RadioGroupItem
                          value={option.value}
                          id={`age-${option.value}`}
                          className="sr-only"
                        />
                      </div>
                    </Label>
                  ))}
                </RadioGroup>
              </motion.div>
            )}

            {/* Step 4: Email */}
            {currentStep === 4 && (
              <motion.div
                key="step4"
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.3, ease: "easeInOut" }}
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <Mail className="w-5 h-5 text-primary" />
                  </div>
                  <h4 className="text-lg md:text-xl font-bold text-foreground">
                    Où envoyer votre devis ?
                  </h4>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="email" className="text-sm font-medium text-foreground">
                      Votre email
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="exemple@email.com"
                      value={quoteData.email}
                      onChange={(e) =>
                        setQuoteData((prev) => ({ ...prev, email: e.target.value }))
                      }
                      className="mt-2 h-12 text-base"
                    />
                  </div>

                  <p className="text-xs text-muted-foreground">
                    En soumettant ce formulaire, vous acceptez de recevoir votre devis par email.
                    Vos données sont protégées et ne seront jamais partagées.
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t border-border/50">
            <Button
              variant="ghost"
              onClick={handlePrev}
              disabled={currentStep === 1}
              className="gap-2"
            >
              <ChevronLeft className="w-4 h-4" />
              Retour
            </Button>

            {currentStep < totalSteps ? (
              <Button
                onClick={handleNext}
                disabled={!canProceed()}
                className="gap-2 bg-primary hover:bg-primary/90"
              >
                Continuer
                <ChevronRight className="w-4 h-4" />
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                disabled={!canProceed()}
                className="gap-2 bg-gradient-to-r from-primary to-accent text-primary-foreground font-bold"
              >
                Recevoir mon devis
                <ChevronRight className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>

        {/* Trust indicator */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center text-sm text-muted-foreground mt-6"
        >
          🔒 Vos données sont sécurisées et confidentielles
        </motion.p>
      </div>
    </section>
  );
};

export default QuickQuoteSection;
