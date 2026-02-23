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
import arthurThinking from "@/assets/mascotte/arthur-thinking.png";

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
const PROFILE_OPTIONS: Record<string, { value: string; label: string; emoji: string; desc?: string }[]> = {
  auto: [
    { value: "citadine", label: "Citadine", emoji: "🚗", desc: "Clio, 208, C3..." },
    { value: "berline", label: "Berline", emoji: "🚙", desc: "308, Mégane..." },
    { value: "suv", label: "SUV / 4x4", emoji: "🚐", desc: "3008, Tucson..." },
  ],
  moto: [
    { value: "scooter", label: "Scooter / 125cc", emoji: "🛵" },
    { value: "routiere", label: "Routière", emoji: "🏍️" },
    { value: "sportive", label: "Sportive", emoji: "🏎️" },
  ],
  habitation: [
    { value: "appartement", label: "Appartement", emoji: "🏢" },
    { value: "maison", label: "Maison", emoji: "🏠" },
    { value: "studio", label: "Studio / T1", emoji: "🛏️" },
  ],
  sante: [
    { value: "seul", label: "Seul(e)", emoji: "👤" },
    { value: "couple", label: "Couple", emoji: "👫" },
    { value: "famille", label: "Famille", emoji: "👨‍👩‍👧‍👦" },
  ],
  pret: [
    { value: "immobilier", label: "Prêt immobilier", emoji: "🏠" },
    { value: "conso", label: "Prêt conso", emoji: "💳" },
    { value: "professionnel", label: "Prêt pro", emoji: "💼" },
  ],
  animaux: [
    { value: "chien", label: "Chien", emoji: "🐕" },
    { value: "chat", label: "Chat", emoji: "🐈" },
    { value: "nac", label: "NAC / Autre", emoji: "🐰" },
  ],
  vie: [
    { value: "epargne", label: "Épargne", emoji: "💰" },
    { value: "succession", label: "Succession", emoji: "📋" },
    { value: "retraite", label: "Retraite", emoji: "🏖️" },
  ],
  prevoyance: [
    { value: "salarie", label: "Salarié", emoji: "👨‍💼" },
    { value: "independant", label: "Indépendant", emoji: "💼" },
    { value: "famille", label: "Protection famille", emoji: "👨‍👩‍👧" },
  ],
  rc_pro: [
    { value: "liberal", label: "Profession libérale", emoji: "⚖️" },
    { value: "artisan", label: "Artisan / Commerce", emoji: "🔧" },
    { value: "tech", label: "IT / Conseil", emoji: "💻" },
  ],
  mrp: [
    { value: "bureau", label: "Bureau", emoji: "🏢" },
    { value: "commerce", label: "Commerce", emoji: "🏪" },
    { value: "atelier", label: "Atelier / Entrepôt", emoji: "🏭" },
  ],
  gli: [
    { value: "1_lot", label: "1 lot", emoji: "🏠" },
    { value: "2_5_lots", label: "2-5 lots", emoji: "🏘️" },
    { value: "6_plus", label: "6+ lots", emoji: "🏗️" },
  ],
  pno: [
    { value: "appartement", label: "Appartement", emoji: "🏢" },
    { value: "maison", label: "Maison", emoji: "🏠" },
    { value: "immeuble", label: "Immeuble", emoji: "🏗️" },
  ],
};

// Coverage levels per insurance type (step 3)
const COVERAGE_OPTIONS: Record<string, { value: string; label: string; emoji: string; desc: string }[]> = {
  auto: [
    { value: "tiers", label: "Tiers", emoji: "🛡️", desc: "Responsabilité civile" },
    { value: "tiers_plus", label: "Tiers+", emoji: "🛡️✨", desc: "RC + vol, incendie, bris de glace" },
    { value: "tous_risques", label: "Tous Risques", emoji: "🏆", desc: "Couverture maximale" },
  ],
  moto: [
    { value: "tiers", label: "Tiers", emoji: "🛡️", desc: "Responsabilité civile" },
    { value: "tiers_plus", label: "Tiers+", emoji: "🛡️✨", desc: "RC + vol, incendie" },
    { value: "tous_risques", label: "Tous Risques", emoji: "🏆", desc: "Protection complète" },
  ],
  habitation: [
    { value: "essentielle", label: "Essentielle", emoji: "🛡️", desc: "Garanties de base" },
    { value: "confort", label: "Confort", emoji: "🛡️✨", desc: "Vol + dégâts des eaux" },
    { value: "premium", label: "Premium", emoji: "🏆", desc: "Toutes garanties" },
  ],
  sante: [
    { value: "economique", label: "Économique", emoji: "🛡️", desc: "Soins courants" },
    { value: "equilibre", label: "Équilibre", emoji: "🛡️✨", desc: "Optique + dentaire" },
    { value: "integrale", label: "Intégrale", emoji: "🏆", desc: "Remboursements max" },
  ],
  pret: [
    { value: "deces", label: "Décès", emoji: "🛡️", desc: "Garantie de base" },
    { value: "deces_ipt", label: "Décès + IPT", emoji: "🛡️✨", desc: "+ Invalidité permanente" },
    { value: "deces_ipt_itt", label: "Décès + IPT + ITT", emoji: "🏆", desc: "+ Incapacité temporaire" },
  ],
  animaux: [
    { value: "accident", label: "Accident", emoji: "🛡️", desc: "Accidents uniquement" },
    { value: "maladie_accident", label: "Maladie + Accident", emoji: "🛡️✨", desc: "Couverture élargie" },
    { value: "integrale", label: "Intégrale", emoji: "🏆", desc: "Prévention incluse" },
  ],
  vie: [
    { value: "epargne", label: "Épargne", emoji: "🛡️", desc: "Fonds euros" },
    { value: "protection", label: "Protection", emoji: "🛡️✨", desc: "Capital décès" },
    { value: "mixte", label: "Mixte", emoji: "🏆", desc: "Épargne + protection" },
  ],
  prevoyance: [
    { value: "essentielle", label: "Essentielle", emoji: "🛡️", desc: "Arrêt de travail" },
    { value: "confort", label: "Confort", emoji: "🛡️✨", desc: "+ Invalidité" },
    { value: "integrale", label: "Intégrale", emoji: "🏆", desc: "Protection complète" },
  ],
  rc_pro: [
    { value: "basique", label: "Basique", emoji: "🛡️", desc: "RC obligatoire" },
    { value: "standard", label: "Standard", emoji: "🛡️✨", desc: "+ Protection juridique" },
    { value: "premium", label: "Premium", emoji: "🏆", desc: "Couverture étendue" },
  ],
  mrp: [
    { value: "essentielle", label: "Essentielle", emoji: "🛡️", desc: "Garanties de base" },
    { value: "confort", label: "Confort", emoji: "🛡️✨", desc: "+ Perte d'exploitation" },
    { value: "premium", label: "Premium", emoji: "🏆", desc: "Toutes garanties" },
  ],
  gli: [
    { value: "basique", label: "Basique", emoji: "🛡️", desc: "Loyers impayés" },
    { value: "standard", label: "Standard", emoji: "🛡️✨", desc: "+ Dégradations" },
    { value: "premium", label: "Premium", emoji: "🏆", desc: "+ Protection juridique" },
  ],
  pno: [
    { value: "essentielle", label: "Essentielle", emoji: "🛡️", desc: "RC propriétaire" },
    { value: "confort", label: "Confort", emoji: "🛡️✨", desc: "+ Dommages au bien" },
    { value: "premium", label: "Premium", emoji: "🏆", desc: "Protection totale" },
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
            <motion.img src={arthurThinking} alt="Arthur" className="w-16 h-auto md:w-20" loading="lazy" animate={{ rotate: [0, -5, 5, 0] }} transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }} />
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
                          <span className="font-bold text-foreground">{option.label}</span>
                          {option.desc && <span className="text-xs text-muted-foreground">{option.desc}</span>}
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
                          <span className="font-bold text-foreground">{option.label}</span>
                          <span className="text-xs text-muted-foreground">{option.desc}</span>
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
            <Button variant="ghost" onClick={handlePrev} disabled={currentStep === 1} className="gap-2">
              <ChevronLeft className="w-4 h-4" />
              <span>{t('common.back')}</span>
            </Button>
            {currentStep < totalSteps ? (
              <Button onClick={handleNext} disabled={!canProceed()} className="gap-2 bg-primary hover:bg-primary/90">
                <span>{t('common.continue')}</span>
                <ChevronRight className="w-4 h-4" />
              </Button>
            ) : (
              <Button onClick={handleSubmit} disabled={!canProceed() || isSubmitting} className="gap-2 bg-gradient-to-r from-primary to-accent text-primary-foreground font-bold">
                {isSubmitting ? <><Loader2 className="w-4 h-4 animate-spin" /><span>{t('quickQuote.sending')}</span></> : <><span>{t('quickQuote.submit')}</span><ChevronRight className="w-4 h-4" /></>}
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
