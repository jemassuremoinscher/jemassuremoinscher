import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Car, Check, ChevronRight, ChevronLeft, Calendar, Mail, Loader2, CheckCircle2, Shield, Home, Heart, Dog, Bike, Briefcase, Building2, FileText, Umbrella, Key, ShieldCheck } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useAnalytics } from "@/hooks/useAnalytics";
import { useHoneypot } from "@/hooks/useHoneypot";
import { useLanguage } from "@/contexts/LanguageContext";
import arthurThinking from "@/assets/mascotte/arthur-idea.png";
import { trackMetaLead } from "@/utils/metaPixelTracking";

type InsuranceType = "auto" | "moto" | "habitation" | "sante" | "pret" | "animaux" | "vie" | "prevoyance" | "rc_pro" | "mrp" | "gli" | "pno" | "";

interface QuoteData {
  insuranceType: InsuranceType;
  profileOption: string;
  coverageLevel: string;
  email: string;
  phone: string;
}

const PHONE_REGEX = /^(?:(?:\+|00)33|0)\s*[1-9](?:[\s.-]*\d{2}){4}$/;

// Insurance type definitions
const INSURANCE_TYPES: { value: InsuranceType; labelKey: string; icon: React.ElementType; emoji: string }[] = [
  { value: "auto", labelKey: "quoteForm.autoIns", icon: Car, emoji: "🚗" },
  { value: "moto", labelKey: "quoteForm.motoIns", icon: Bike, emoji: "🏍️" },
  { value: "habitation", labelKey: "quoteForm.homeIns", icon: Home, emoji: "🏠" },
  { value: "sante", labelKey: "quoteForm.healthIns", icon: Heart, emoji: "🏥" },
  { value: "pret", labelKey: "quoteForm.loanIns", icon: Key, emoji: "🔑" },
  { value: "animaux", labelKey: "quoteForm.petIns", icon: Dog, emoji: "🐾" },
  { value: "vie", labelKey: "quoteForm.vieIns", icon: Umbrella, emoji: "☂️" },
  { value: "prevoyance", labelKey: "quoteForm.prevoyanceIns", icon: ShieldCheck, emoji: "🛡️" },
  { value: "rc_pro", labelKey: "quoteForm.rcProIns", icon: Briefcase, emoji: "💼" },
  { value: "mrp", labelKey: "quoteForm.mrpIns", icon: Building2, emoji: "🏢" },
  { value: "gli", labelKey: "quoteForm.gliIns", icon: FileText, emoji: "📋" },
  { value: "pno", labelKey: "quoteForm.pnoIns", icon: Home, emoji: "🏘️" },
];

// Profile options per insurance type (step 2)
const PROFILE_OPTIONS: Record<string, { value: string; labelKey: string; emoji: string; descKey?: string }[]> = {
  auto: [
    { value: "citadine", labelKey: "profile.auto.citadine", emoji: "🚗", descKey: "profile.auto.citadineDesc" },
    { value: "berline", labelKey: "profile.auto.berline", emoji: "🚙", descKey: "profile.auto.berlineDesc" },
    { value: "suv", labelKey: "profile.auto.suv", emoji: "🚐", descKey: "profile.auto.suvDesc" },
  ],
  moto: [
    { value: "scooter", labelKey: "profile.moto.scooter", emoji: "🛵" },
    { value: "routiere", labelKey: "profile.moto.routiere", emoji: "🏍️" },
    { value: "sportive", labelKey: "profile.moto.sportive", emoji: "🏎️" },
  ],
  habitation: [
    { value: "appartement", labelKey: "profile.habitation.appartement", emoji: "🏢" },
    { value: "maison", labelKey: "profile.habitation.maison", emoji: "🏠" },
    { value: "studio", labelKey: "profile.habitation.studio", emoji: "🛏️" },
  ],
  sante: [
    { value: "seul", labelKey: "profile.sante.seul", emoji: "👤" },
    { value: "couple", labelKey: "profile.sante.couple", emoji: "👫" },
    { value: "famille", labelKey: "profile.sante.famille", emoji: "👨‍👩‍👧‍👦" },
  ],
  pret: [
    { value: "immobilier", labelKey: "profile.pret.immobilier", emoji: "🏠" },
    { value: "conso", labelKey: "profile.pret.conso", emoji: "💳" },
    { value: "professionnel", labelKey: "profile.pret.professionnel", emoji: "💼" },
  ],
  animaux: [
    { value: "chien", labelKey: "profile.animaux.chien", emoji: "🐕" },
    { value: "chat", labelKey: "profile.animaux.chat", emoji: "🐈" },
    { value: "nac", labelKey: "profile.animaux.nac", emoji: "🐰" },
  ],
  vie: [
    { value: "epargne", labelKey: "profile.vie.epargne", emoji: "💰" },
    { value: "succession", labelKey: "profile.vie.succession", emoji: "📋" },
    { value: "retraite", labelKey: "profile.vie.retraite", emoji: "🏖️" },
  ],
  prevoyance: [
    { value: "salarie", labelKey: "profile.prevoyance.salarie", emoji: "👨‍💼" },
    { value: "independant", labelKey: "profile.prevoyance.independant", emoji: "💼" },
    { value: "famille", labelKey: "profile.prevoyance.famille", emoji: "👨‍👩‍👧" },
  ],
  rc_pro: [
    { value: "liberal", labelKey: "profile.rcPro.liberal", emoji: "⚖️" },
    { value: "artisan", labelKey: "profile.rcPro.artisan", emoji: "🔧" },
    { value: "tech", labelKey: "profile.rcPro.tech", emoji: "💻" },
  ],
  mrp: [
    { value: "bureau", labelKey: "profile.mrp.bureau", emoji: "🏢" },
    { value: "commerce", labelKey: "profile.mrp.commerce", emoji: "🏪" },
    { value: "atelier", labelKey: "profile.mrp.atelier", emoji: "🏭" },
  ],
  gli: [
    { value: "1_lot", labelKey: "profile.gli.1lot", emoji: "🏠" },
    { value: "2_5_lots", labelKey: "profile.gli.2_5lots", emoji: "🏘️" },
    { value: "6_plus", labelKey: "profile.gli.6plus", emoji: "🏗️" },
  ],
  pno: [
    { value: "appartement", labelKey: "profile.pno.appartement", emoji: "🏢" },
    { value: "maison", labelKey: "profile.pno.maison", emoji: "🏠" },
    { value: "immeuble", labelKey: "profile.pno.immeuble", emoji: "🏗️" },
  ],
};

// Coverage levels per insurance type (step 3)
const COVERAGE_OPTIONS: Record<string, { value: string; labelKey: string; emoji: string; descKey: string }[]> = {
  auto: [
    { value: "tiers", labelKey: "qq.cov.auto.tiers", emoji: "🛡️", descKey: "qq.cov.auto.tiersDesc" },
    { value: "tiers_plus", labelKey: "qq.cov.auto.tiersPlus", emoji: "🛡️✨", descKey: "qq.cov.auto.tiersPlusDesc" },
    { value: "tous_risques", labelKey: "qq.cov.auto.tousRisques", emoji: "🏆", descKey: "qq.cov.auto.tousRisquesDesc" },
  ],
  moto: [
    { value: "tiers", labelKey: "qq.cov.moto.tiers", emoji: "🛡️", descKey: "qq.cov.moto.tiersDesc" },
    { value: "tiers_plus", labelKey: "qq.cov.moto.tiersPlus", emoji: "🛡️✨", descKey: "qq.cov.moto.tiersPlusDesc" },
    { value: "tous_risques", labelKey: "qq.cov.moto.tousRisques", emoji: "🏆", descKey: "qq.cov.moto.tousRisquesDesc" },
  ],
  habitation: [
    { value: "essentielle", labelKey: "qq.cov.habitation.essentielle", emoji: "🛡️", descKey: "qq.cov.habitation.essentielleDesc" },
    { value: "confort", labelKey: "qq.cov.habitation.confort", emoji: "🛡️✨", descKey: "qq.cov.habitation.confortDesc" },
    { value: "premium", labelKey: "qq.cov.habitation.premium", emoji: "🏆", descKey: "qq.cov.habitation.premiumDesc" },
  ],
  sante: [
    { value: "economique", labelKey: "qq.cov.sante.economique", emoji: "🛡️", descKey: "qq.cov.sante.economiqueDesc" },
    { value: "equilibre", labelKey: "qq.cov.sante.equilibre", emoji: "🛡️✨", descKey: "qq.cov.sante.equilibreDesc" },
    { value: "integrale", labelKey: "qq.cov.sante.integrale", emoji: "🏆", descKey: "qq.cov.sante.integraleDesc" },
  ],
  pret: [
    { value: "deces", labelKey: "qq.cov.pret.deces", emoji: "🛡️", descKey: "qq.cov.pret.decesDesc" },
    { value: "deces_ipt", labelKey: "qq.cov.pret.decesIpt", emoji: "🛡️✨", descKey: "qq.cov.pret.decesIptDesc" },
    { value: "deces_ipt_itt", labelKey: "qq.cov.pret.decesIptItt", emoji: "🏆", descKey: "qq.cov.pret.decesIptIttDesc" },
  ],
  animaux: [
    { value: "accident", labelKey: "qq.cov.animaux.accident", emoji: "🛡️", descKey: "qq.cov.animaux.accidentDesc" },
    { value: "maladie_accident", labelKey: "qq.cov.animaux.maladieAccident", emoji: "🛡️✨", descKey: "qq.cov.animaux.maladieAccidentDesc" },
    { value: "integrale", labelKey: "qq.cov.animaux.integrale", emoji: "🏆", descKey: "qq.cov.animaux.integraleDesc" },
  ],
  vie: [
    { value: "epargne", labelKey: "qq.cov.vie.epargne", emoji: "🛡️", descKey: "qq.cov.vie.epargneDesc" },
    { value: "protection", labelKey: "qq.cov.vie.protection", emoji: "🛡️✨", descKey: "qq.cov.vie.protectionDesc" },
    { value: "mixte", labelKey: "qq.cov.vie.mixte", emoji: "🏆", descKey: "qq.cov.vie.mixteDesc" },
  ],
  prevoyance: [
    { value: "essentielle", labelKey: "qq.cov.prevoyance.essentielle", emoji: "🛡️", descKey: "qq.cov.prevoyance.essentielleDesc" },
    { value: "confort", labelKey: "qq.cov.prevoyance.confort", emoji: "🛡️✨", descKey: "qq.cov.prevoyance.confortDesc" },
    { value: "integrale", labelKey: "qq.cov.prevoyance.integrale", emoji: "🏆", descKey: "qq.cov.prevoyance.integraleDesc" },
  ],
  rc_pro: [
    { value: "basique", labelKey: "qq.cov.rcPro.basique", emoji: "🛡️", descKey: "qq.cov.rcPro.basiqueDesc" },
    { value: "standard", labelKey: "qq.cov.rcPro.standard", emoji: "🛡️✨", descKey: "qq.cov.rcPro.standardDesc" },
    { value: "premium", labelKey: "qq.cov.rcPro.premium", emoji: "🏆", descKey: "qq.cov.rcPro.premiumDesc" },
  ],
  mrp: [
    { value: "essentielle", labelKey: "qq.cov.mrp.essentielle", emoji: "🛡️", descKey: "qq.cov.mrp.essentielleDesc" },
    { value: "confort", labelKey: "qq.cov.mrp.confort", emoji: "🛡️✨", descKey: "qq.cov.mrp.confortDesc" },
    { value: "premium", labelKey: "qq.cov.mrp.premium", emoji: "🏆", descKey: "qq.cov.mrp.premiumDesc" },
  ],
  gli: [
    { value: "basique", labelKey: "qq.cov.gli.basique", emoji: "🛡️", descKey: "qq.cov.gli.basiqueDesc" },
    { value: "standard", labelKey: "qq.cov.gli.standard", emoji: "🛡️✨", descKey: "qq.cov.gli.standardDesc" },
    { value: "premium", labelKey: "qq.cov.gli.premium", emoji: "🏆", descKey: "qq.cov.gli.premiumDesc" },
  ],
  pno: [
    { value: "essentielle", labelKey: "qq.cov.pno.essentielle", emoji: "🛡️", descKey: "qq.cov.pno.essentielleDesc" },
    { value: "confort", labelKey: "qq.cov.pno.confort", emoji: "🛡️✨", descKey: "qq.cov.pno.confortDesc" },
    { value: "premium", labelKey: "qq.cov.pno.premium", emoji: "🏆", descKey: "qq.cov.pno.premiumDesc" },
  ],
};

const QuickQuoteSection = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [direction, setDirection] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const { trackEvent, trackConversion } = useAnalytics();
  const { honeypotRef, isBot } = useHoneypot();
  const { t } = useLanguage();
  const [quoteData, setQuoteData] = useState<QuoteData>({
    insuranceType: "",
    profileOption: "",
    coverageLevel: "",
    email: "",
    phone: ""
  });
  const totalSteps = 4;

  const handleNext = () => { if (currentStep < totalSteps) { setDirection(1); setCurrentStep(prev => prev + 1); } };
  const handlePrev = () => { if (currentStep > 1) { setDirection(-1); setCurrentStep(prev => prev - 1); } };

  const handleInsuranceTypeSelect = (value: InsuranceType) => {
    setQuoteData(prev => ({ ...prev, insuranceType: value, profileOption: "", coverageLevel: "" }));
  };

  const handleSubmit = async () => {
    if (isSubmitting) return;
    if (isBot()) { setIsSuccess(true); return; }
    setIsSubmitting(true);
    try {
      const { error } = await supabase.from('insurance_quotes').insert({
        insurance_type: quoteData.insuranceType, full_name: '', email: quoteData.email, phone: quoteData.phone,
        quote_data: { source: 'quick_quote', profileOption: quoteData.profileOption, coverageLevel: quoteData.coverageLevel },
        status: 'pending',
      });
      if (error) throw error;
      await supabase.functions.invoke('send-quote-email', {
        body: { name: 'Prospect Devis Rapide', email: quoteData.email, phone: quoteData.phone, type: quoteData.insuranceType,
          details: { source: 'quick_quote', profileOption: quoteData.profileOption, coverageLevel: quoteData.coverageLevel } },
      }).catch(err => console.error('Email error:', err));
      trackConversion('quick_quote', 150);
      trackEvent('quote_request', { category: 'quick_quote', label: `${quoteData.insuranceType}_${quoteData.profileOption}_${quoteData.coverageLevel}`, insurance_type: quoteData.insuranceType, value: 150 });
      trackMetaLead({
        content_name: `Devis rapide ${quoteData.insuranceType}`,
        content_category: quoteData.insuranceType,
        value: 150,
        currency: 'EUR',
      });
      setIsSuccess(true);
      toast.success(t('quickQuote.toastSuccess'));
    } catch (error) {
      console.error('Error submitting quick quote:', error);
      toast.error(t('quickQuote.toastError'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const slideVariants = {
    enter: (direction: number) => ({ x: direction > 0 ? 100 : -100, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (direction: number) => ({ x: direction < 0 ? 100 : -100, opacity: 0 })
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1: return quoteData.insuranceType !== "";
      case 2: return quoteData.profileOption !== "";
      case 3: return quoteData.coverageLevel !== "";
      case 4: return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(quoteData.email) && PHONE_REGEX.test(quoteData.phone);
      default: return false;
    }
  };

  const profileOptions = PROFILE_OPTIONS[quoteData.insuranceType] || [];
  const coverageOptions = COVERAGE_OPTIONS[quoteData.insuranceType] || [];

  if (isSuccess) {
    return (
      <section className="py-12 md:py-16 bg-gradient-to-b from-background to-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto bg-card rounded-2xl shadow-lg border border-border/50 p-8 text-center animate-scale-in">
            <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/20 mx-auto mb-4 flex items-center justify-center">
              <CheckCircle2 className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="text-2xl font-bold mb-3">{t('quickQuote.successTitle')}</h3>
            <p className="text-muted-foreground mb-4">
              {t('quickQuote.successText')} <span className="font-bold text-primary">{t('quickQuote.successTime')}</span> {t('quickQuote.successEnd')}
            </p>
            <p className="text-sm text-muted-foreground">{t('quickQuote.successCheck')}</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 md:py-16 bg-gradient-to-b from-background to-muted/30" aria-labelledby="quick-quote-title">
      <h2 id="quick-quote-title" className="sr-only">{t('quickQuote.srTitle')}</h2>
      <div className="container mx-auto px-4">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-8">
          <div className="flex items-center justify-center gap-4 mb-4">
            <motion.img src={arthurThinking} alt="Arthur mascotte" className="w-16 h-auto md:w-20" width={80} height={100} loading="lazy" animate={{ rotate: [0, -5, 5, 0] }} transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }} />
            <div className="text-left">
              <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-1">{t('quickQuote.title')}</h2>
              <p className="text-muted-foreground">{t('quickQuote.subtitle')}</p>
            </div>
          </div>
        </motion.div>

        <div className="flex items-center justify-center gap-2 mb-8">
          {Array.from({ length: totalSteps }).map((_, index) => (
            <div key={index} className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${index + 1 <= currentStep ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
                {index + 1 < currentStep ? <Check className="w-4 h-4" /> : index + 1}
              </div>
              {index < totalSteps - 1 && <div className={`w-6 md:w-12 h-1 mx-1 rounded-full transition-all duration-300 ${index + 1 < currentStep ? "bg-primary" : "bg-muted"}`} />}
            </div>
          ))}
        </div>

        <div className="max-w-2xl mx-auto bg-card rounded-2xl shadow-lg border border-border/50 p-6 md:p-8 overflow-hidden">
          <input ref={honeypotRef} type="text" name="website" autoComplete="off" tabIndex={-1} aria-hidden="true" style={{ position: 'absolute', left: '-9999px', opacity: 0 }} />
          <AnimatePresence mode="wait" custom={direction}>
            {/* Step 1: Insurance Type */}
            {currentStep === 1 && (
              <motion.div key="step1" custom={direction} variants={slideVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.3, ease: "easeInOut" }}>
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 rounded-lg bg-primary/10"><Shield className="w-5 h-5 text-primary" /></div>
                  <h4 className="text-lg md:text-xl font-bold text-foreground">{t('quickQuote.insuranceTypeQuestion')}</h4>
                </div>
                <RadioGroup value={quoteData.insuranceType} onValueChange={value => handleInsuranceTypeSelect(value as InsuranceType)} className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {INSURANCE_TYPES.map(option => (
                    <Label key={option.value} htmlFor={`ins-${option.value}`} className="cursor-pointer">
                      <div className={`relative p-3 md:p-4 rounded-xl border-2 transition-all duration-300 card-hover ${quoteData.insuranceType === option.value ? "border-primary bg-primary/5 shadow-md" : "border-border hover:border-primary/50 bg-card"}`}>
                        {quoteData.insuranceType === option.value && <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full bg-primary flex items-center justify-center"><Check className="w-3 h-3 text-primary-foreground" /></motion.div>}
                        <div className="flex flex-col items-center text-center gap-1">
                          <span className="text-2xl">{option.emoji}</span>
                          <span className="font-bold text-foreground text-xs md:text-sm">{t(option.labelKey)}</span>
                        </div>
                        <RadioGroupItem value={option.value} id={`ins-${option.value}`} className="sr-only" />
                      </div>
                    </Label>
                  ))}
                </RadioGroup>
              </motion.div>
            )}

            {/* Step 2: Profile */}
            {currentStep === 2 && (
              <motion.div key="step2" custom={direction} variants={slideVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.3, ease: "easeInOut" }}>
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 rounded-lg bg-primary/10"><Calendar className="w-5 h-5 text-primary" /></div>
                  <h4 className="text-lg md:text-xl font-bold text-foreground">{t('quickQuote.profileQuestion')}</h4>
                </div>
                <RadioGroup value={quoteData.profileOption} onValueChange={value => setQuoteData(prev => ({ ...prev, profileOption: value }))} className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {profileOptions.map(option => (
                    <Label key={option.value} htmlFor={`profile-${option.value}`} className="cursor-pointer">
                      <div className={`relative p-4 md:p-6 rounded-xl border-2 transition-all duration-300 card-hover ${quoteData.profileOption === option.value ? "border-primary bg-primary/5 shadow-md" : "border-border hover:border-primary/50 bg-card"}`}>
                        {quoteData.profileOption === option.value && <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute top-2 right-2 w-6 h-6 rounded-full bg-primary flex items-center justify-center"><Check className="w-4 h-4 text-primary-foreground" /></motion.div>}
                        <div className="flex flex-col items-center text-center gap-2">
                          <span className="text-3xl mb-1">{option.emoji}</span>
                          <span className="font-bold text-foreground">{t(option.labelKey)}</span>
                          {option.descKey && <span className="text-xs text-muted-foreground">{t(option.descKey)}</span>}
                        </div>
                        <RadioGroupItem value={option.value} id={`profile-${option.value}`} className="sr-only" />
                      </div>
                    </Label>
                  ))}
                </RadioGroup>
              </motion.div>
            )}

            {/* Step 3: Coverage Level */}
            {currentStep === 3 && (
              <motion.div key="step3" custom={direction} variants={slideVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.3, ease: "easeInOut" }}>
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 rounded-lg bg-primary/10"><Shield className="w-5 h-5 text-primary" /></div>
                  <h4 className="text-lg md:text-xl font-bold text-foreground">{t('quickQuote.coverageQuestion')}</h4>
                </div>
                <RadioGroup value={quoteData.coverageLevel} onValueChange={value => setQuoteData(prev => ({ ...prev, coverageLevel: value }))} className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {coverageOptions.map(option => (
                    <Label key={option.value} htmlFor={`coverage-${option.value}`} className="cursor-pointer">
                      <div className={`relative p-4 md:p-6 rounded-xl border-2 transition-all duration-300 card-hover ${quoteData.coverageLevel === option.value ? "border-primary bg-primary/5 shadow-md" : "border-border hover:border-primary/50 bg-card"}`}>
                        {quoteData.coverageLevel === option.value && <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute top-2 right-2 w-6 h-6 rounded-full bg-primary flex items-center justify-center"><Check className="w-4 h-4 text-primary-foreground" /></motion.div>}
                        <div className="flex flex-col items-center text-center gap-2">
                          <span className="text-3xl mb-1">{option.emoji}</span>
                          <span className="font-bold text-foreground">{t(option.labelKey)}</span>
                          <span className="text-xs text-muted-foreground">{t(option.descKey)}</span>
                        </div>
                        <RadioGroupItem value={option.value} id={`coverage-${option.value}`} className="sr-only" />
                      </div>
                    </Label>
                  ))}
                </RadioGroup>
              </motion.div>
            )}

            {/* Step 4: Contact */}
            {currentStep === 4 && (
              <motion.div key="step4" custom={direction} variants={slideVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.3, ease: "easeInOut" }}>
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 rounded-lg bg-primary/10"><Mail className="w-5 h-5 text-primary" /></div>
                  <h4 className="text-lg md:text-xl font-bold text-foreground">{t('quickQuote.contactQuestion')}</h4>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="qq-email" className="text-sm font-medium text-foreground">{t('quickQuote.emailLabel')}</Label>
                    <Input id="qq-email" type="email" placeholder="exemple@email.com" value={quoteData.email} onChange={e => setQuoteData(prev => ({ ...prev, email: e.target.value }))} className="mt-2 h-12 text-base" disabled={isSubmitting} />
                  </div>
                  <div>
                    <Label htmlFor="qq-phone" className="text-sm font-medium text-foreground">{t('quickQuote.phoneLabel')}</Label>
                    <Input id="qq-phone" type="tel" placeholder="06 12 34 56 78" value={quoteData.phone} onChange={e => setQuoteData(prev => ({ ...prev, phone: e.target.value }))} className="mt-2 h-12 text-base" disabled={isSubmitting} />
                  </div>
                  <p className="text-xs text-muted-foreground">{t('quickQuote.privacyNote')}</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex items-center justify-between mt-8 pt-6 border-t border-border/50">
            <Button variant="ghost" onClick={handlePrev} disabled={currentStep === 1} className="gap-2" aria-label="Retour à l'étape précédente">
              <ChevronLeft className="w-4 h-4" aria-hidden="true" />
              <span>{t('common.back')}</span>
            </Button>
            {currentStep < totalSteps ? (
              <Button onClick={handleNext} disabled={!canProceed()} className="gap-2 bg-primary hover:bg-primary/90" aria-label="Passer à l'étape suivante">
                <span>{t('common.continue')}</span>
                <ChevronRight className="w-4 h-4" aria-hidden="true" />
              </Button>
            ) : (
              <Button onClick={handleSubmit} disabled={!canProceed() || isSubmitting} className="gap-2 bg-gradient-to-r from-primary to-accent text-primary-foreground font-bold" aria-label="Envoyer ma demande de devis rapide">
                {isSubmitting ? <><Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" /><span>{t('quickQuote.sending')}</span></> : <><span>{t('quickQuote.submit')}</span><ChevronRight className="w-4 h-4" aria-hidden="true" /></>}
              </Button>
            )}
          </div>
        </div>

        <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-center text-sm text-muted-foreground mt-6">
          {t('quickQuote.secureData')}
        </motion.p>
      </div>
    </section>
  );
};

export default QuickQuoteSection;
