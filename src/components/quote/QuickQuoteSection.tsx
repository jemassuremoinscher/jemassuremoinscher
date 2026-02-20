import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Car, Check, ChevronRight, ChevronLeft, Calendar, Mail, Loader2, CheckCircle2 } from "lucide-react";
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

type VehicleType = "citadine" | "berline" | "suv" | "";
type DriverAge = "18-25" | "26-35" | "36-50" | "50+" | "";
interface QuoteData {
  vehicleType: VehicleType;
  driverAge: DriverAge;
  email: string;
  phone: string;
}
const PHONE_REGEX = /^(?:(?:\+|00)33|0)\s*[1-9](?:[\s.-]*\d{2}){4}$/;

const QuickQuoteSection = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [direction, setDirection] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const { trackEvent, trackConversion } = useAnalytics();
  const { honeypotRef, isBot } = useHoneypot();
  const { t } = useLanguage();
  const [quoteData, setQuoteData] = useState<QuoteData>({
    vehicleType: "",
    driverAge: "",
    email: "",
    phone: ""
  });
  const totalSteps = 3;

  const vehicleOptions = [
    { value: "citadine", label: t('quickQuote.citadine'), description: t('quickQuote.citadineDesc'), icon: "🚗" },
    { value: "berline", label: t('quickQuote.berline'), description: t('quickQuote.berlineDesc'), icon: "🚙" },
    { value: "suv", label: t('quickQuote.suv'), description: t('quickQuote.suvDesc'), icon: "🚐" },
  ];

  const ageOptions = [
    { value: "18-25", label: "18-25", icon: "👤" },
    { value: "26-35", label: "26-35", icon: "👨" },
    { value: "36-50", label: "36-50", icon: "👨‍💼" },
    { value: "50+", label: "50+", icon: "👴" },
  ];

  const handleNext = () => { if (currentStep < totalSteps) { setDirection(1); setCurrentStep(prev => prev + 1); } };
  const handlePrev = () => { if (currentStep > 1) { setDirection(-1); setCurrentStep(prev => prev - 1); } };
  const handleVehicleSelect = (value: VehicleType) => { setQuoteData(prev => ({ ...prev, vehicleType: value })); };
  const handleAgeSelect = (value: DriverAge) => { setQuoteData(prev => ({ ...prev, driverAge: value })); };

  const handleSubmit = async () => {
    if (isSubmitting) return;
    if (isBot()) { setIsSuccess(true); return; }
    setIsSubmitting(true);
    try {
      const { error } = await supabase.from('insurance_quotes').insert({
        insurance_type: 'auto', full_name: '', email: quoteData.email, phone: quoteData.phone,
        quote_data: { source: 'quick_quote', vehicleType: quoteData.vehicleType, driverAge: quoteData.driverAge },
        status: 'pending',
      });
      if (error) throw error;
      await supabase.functions.invoke('send-quote-email', {
        body: { name: 'Prospect Devis Rapide', email: quoteData.email, phone: quoteData.phone, type: 'auto',
          details: { source: 'quick_quote', vehicleType: quoteData.vehicleType, driverAge: quoteData.driverAge },
          estimatedPrice: 35 },
      }).catch(err => console.error('Email error:', err));
      trackConversion('quick_quote', 150);
      trackEvent('quote_request', { category: 'quick_quote', label: `auto_${quoteData.vehicleType}_${quoteData.driverAge}`, insurance_type: 'auto', value: 150 });
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
      case 1: return quoteData.vehicleType !== "";
      case 2: return quoteData.driverAge !== "";
      case 3: return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(quoteData.email) && PHONE_REGEX.test(quoteData.phone);
      default: return false;
    }
  };

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
              <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-1">{t('quickQuote.title')}</h3>
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
              {index < totalSteps - 1 && <div className={`w-8 md:w-16 h-1 mx-1 rounded-full transition-all duration-300 ${index + 1 < currentStep ? "bg-primary" : "bg-muted"}`} />}
            </div>
          ))}
        </div>

        <div className="max-w-2xl mx-auto bg-card rounded-2xl shadow-lg border border-border/50 p-6 md:p-8 overflow-hidden">
          <input ref={honeypotRef} type="text" name="website" autoComplete="off" tabIndex={-1} aria-hidden="true" style={{ position: 'absolute', left: '-9999px', opacity: 0 }} />
          <AnimatePresence mode="wait" custom={direction}>
            {currentStep === 1 && (
              <motion.div key="step1" custom={direction} variants={slideVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.3, ease: "easeInOut" }}>
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 rounded-lg bg-primary/10"><Car className="w-5 h-5 text-primary" /></div>
                  <h4 className="text-lg md:text-xl font-bold text-foreground">{t('quickQuote.vehicleQuestion')}</h4>
                </div>
                <RadioGroup value={quoteData.vehicleType} onValueChange={value => handleVehicleSelect(value as VehicleType)} className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {vehicleOptions.map(option => (
                    <Label key={option.value} htmlFor={option.value} className="cursor-pointer">
                      <div className={`relative p-4 md:p-6 rounded-xl border-2 transition-all duration-300 card-hover ${quoteData.vehicleType === option.value ? "border-primary bg-primary/5 shadow-md" : "border-border hover:border-primary/50 bg-card"}`}>
                        {quoteData.vehicleType === option.value && <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute top-2 right-2 w-6 h-6 rounded-full bg-primary flex items-center justify-center"><Check className="w-4 h-4 text-primary-foreground" /></motion.div>}
                        <div className="flex flex-col items-center text-center gap-2">
                          <span className="text-4xl mb-2">{option.icon}</span>
                          <span className="font-bold text-foreground">{option.label}</span>
                          <span className="text-xs text-muted-foreground">{option.description}</span>
                        </div>
                        <RadioGroupItem value={option.value} id={option.value} className="sr-only" />
                      </div>
                    </Label>
                  ))}
                </RadioGroup>
              </motion.div>
            )}

            {currentStep === 2 && (
              <motion.div key="step2" custom={direction} variants={slideVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.3, ease: "easeInOut" }}>
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 rounded-lg bg-primary/10"><Calendar className="w-5 h-5 text-primary" /></div>
                  <h4 className="text-lg md:text-xl font-bold text-foreground">{t('quickQuote.ageQuestion')}</h4>
                </div>
                <RadioGroup value={quoteData.driverAge} onValueChange={value => handleAgeSelect(value as DriverAge)} className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {ageOptions.map(option => (
                    <Label key={option.value} htmlFor={`age-${option.value}`} className="cursor-pointer">
                      <div className={`relative p-4 rounded-xl border-2 transition-all duration-300 card-hover ${quoteData.driverAge === option.value ? "border-primary bg-primary/5 shadow-md" : "border-border hover:border-primary/50 bg-card"}`}>
                        {quoteData.driverAge === option.value && <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute top-2 right-2 w-5 h-5 rounded-full bg-primary flex items-center justify-center"><Check className="w-3 h-3 text-primary-foreground" /></motion.div>}
                        <div className="flex flex-col items-center text-center gap-1">
                          <span className="text-2xl">{option.icon}</span>
                          <span className="font-bold text-foreground text-sm">{option.label}</span>
                        </div>
                        <RadioGroupItem value={option.value} id={`age-${option.value}`} className="sr-only" />
                      </div>
                    </Label>
                  ))}
                </RadioGroup>
              </motion.div>
            )}

            {currentStep === 3 && (
              <motion.div key="step3" custom={direction} variants={slideVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.3, ease: "easeInOut" }}>
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