import { useState, useCallback, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { ArrowLeft, ArrowRight, Loader2, CheckCircle2, Lock, Phone, Mail, User, Search } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useAnalytics } from '@/hooks/useAnalytics';
import { useFunnelTracker } from '@/hooks/useFunnelTracker';
import { useHoneypot } from '@/hooks/useHoneypot';
import { trackGoogleAdsConversionWithParams } from '@/utils/googleAdsTracking';
import { trackMetaLead } from '@/utils/metaPixelTracking';
import { normalizeInsuranceTypeStrict } from '@/utils/insuranceTypeNormalizer';
import { stepConfigsByType, type InsuranceType, type FormStep, type StepOption } from './stepConfigs';
import { useFieldTracking } from '@/hooks/useFieldTracking';
import { AUTO_BRANDS, MOTO_BRANDS, AUTO_BRAND_NAMES, MOTO_BRAND_NAMES } from '@/data/vehicleBrands';
import FlipPriceCard from './FlipPriceCard';

// Mascot imports
import arthurCar from '@/assets/mascotte/arthur-car.webp';
import arthurMoto from '@/assets/mascotte/arthur-moto.webp';
import arthurHouse from '@/assets/mascotte/arthur-house.webp';
import arthurSick from '@/assets/mascotte/arthur-sick.webp';
import arthurThinking from '@/assets/mascotte/arthur-thinking.webp';
import arthurAnimals from '@/assets/mascotte/arthur-animals.webp';
import arthurIdea from '@/assets/mascotte/arthur-idea.webp';
import arthurInjured from '@/assets/mascotte/arthur-injured.webp';
import arthurBusiness from '@/assets/mascotte/arthur-business.webp';
import arthurDetective from '@/assets/mascotte/arthur-detective.webp';
import arthurThumbsUp from '@/assets/mascotte/arthur-thumbs-up.webp';
import arthurExcited from '@/assets/mascotte/arthur-excited.webp';
import arthurRunningCoin from '@/assets/mascotte/arthur-running-coin.webp';
import arthurClimbing from '@/assets/mascotte/arthur-climbing.webp';

// Logo imports for teaser prices
import logoDirectAssurance from '@/assets/logos/direct-assurance-new.webp';
import logoAllianz from '@/assets/logos/allianz.webp';
import logoAxa from '@/assets/logos/axa.webp';
import logoAmaguiz from '@/assets/logos/amaguiz.png';
import logoMaif from '@/assets/logos/maif.webp';
import logoGroupama from '@/assets/logos/groupama.png';
import logoAlanNew from '@/assets/logos/alan-new.webp';
import logoHarmonie from '@/assets/logos/harmonie-mutuelle.png';
import logoApril from '@/assets/logos/april-new.png';
import logoCardif from '@/assets/logos/cardif.png';
import logoGenerali from '@/assets/logos/generali-new.png';
import logoAcheel from '@/assets/logos/acheel.webp';
import logoSwisslife from '@/assets/logos/swisslife.webp';
import logoAon from '@/assets/logos/aon.webp';

const mascotImages: Record<InsuranceType, string> = {
  auto: arthurCar,
  moto: arthurMoto,
  habitation: arthurHouse,
  sante: arthurSick,
  pret: arthurThinking,
  animaux: arthurAnimals,
  vie: arthurIdea,
  prevoyance: arthurInjured,
  rc_pro: arthurBusiness,
  mrp: arthurBusiness,
  gli: arthurDetective,
  pno: arthurHouse,
  comparateur: arthurThumbsUp,
  metiers_atypiques: arthurClimbing,
  gestion_locative: arthurHouse,
};

const mascotSearching = arthurRunningCoin;
const mascotSuccess = arthurExcited;

// Partner logos to show during searching animation
const partnerNames = [
  'AXA', 'Allianz', 'MAIF', 'MACIF', 'Groupama', 'Generali',
  'Direct Assurance', 'MMA', 'MAAF', 'Matmut', 'GMF', 'Abeille',
  'April', 'Alan', 'Swiss Life', 'AG2R', 'Harmonie', 'MGEN',
];

const contactSchema = z.object({
  fullName: z.string().trim().min(2, 'Minimum 2 caractères').max(100),
  email: z.string().trim().email('Email invalide'),
  phone: z.string().trim().regex(/^(?:(?:\+|00)33|0)\s*[1-9](?:[\s.-]*\d{2}){4}$/, 'Numéro invalide'),
  acceptTerms: z.literal(true, { errorMap: () => ({ message: 'Requis' }) }),
});

interface MultiStepQuoteFormProps {
  insuranceType: InsuranceType;
  onComplete?: () => void;
  className?: string;
  /** Constrain card to fixed height with internal scroll (Hero usage) */
  fixedHeight?: boolean;
}

const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 80 : -80,
    opacity: 0,
    scale: 0.97,
  }),
  center: {
    x: 0,
    opacity: 1,
    scale: 1,
  },
  exit: (direction: number) => ({
    x: direction > 0 ? -80 : 80,
    opacity: 0,
    scale: 0.97,
  }),
};

export const MultiStepQuoteForm = ({ insuranceType, onComplete, className = '', fixedHeight = false }: MultiStepQuoteFormProps) => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { trackEvent, trackConversion } = useAnalytics();
  const { track: trackFunnel } = useFunnelTracker();
  const { honeypotRef, isBot } = useHoneypot();

  // Prefill from URL: ?type=auto&age=35&zipcode=75001
  const prefillType = searchParams.get('type');
  const prefillAge = searchParams.get('age') || '';
  const prefillZip = searchParams.get('zipcode') || searchParams.get('postalCode') || '';
  const initialFormData: Record<string, string> = {};
  if (insuranceType === 'comparateur' && prefillType && prefillType in stepConfigsByType) {
    initialFormData.insuranceType = prefillType;
  }
  if (prefillAge) initialFormData.age = prefillAge;
  if (prefillZip && /^\d{5}$/.test(prefillZip)) initialFormData.postalCode = prefillZip;

  const [currentStep, setCurrentStep] = useState(0);
  const [direction, setDirection] = useState(1);
  const [formData, setFormData] = useState<Record<string, string>>(initialFormData);
  const [contactData, setContactData] = useState({ fullName: '', email: '', phone: '', acceptTerms: false as boolean });

  // For comparateur, dynamically inject the full product-specific path after type selection
  const steps = useMemo(() => {
    const baseSteps = stepConfigsByType[insuranceType] || stepConfigsByType.comparateur;
    if (insuranceType !== 'comparateur') return baseSteps;
    
    const selectedType = formData.insuranceType;
    if (selectedType && selectedType in stepConfigsByType) {
      const specificSteps = stepConfigsByType[selectedType as InsuranceType];
      const typeStep = baseSteps[0];
      const productSteps = specificSteps.filter(s => s.type !== 'searching' && s.type !== 'contact' && s.type !== 'callback');
      const finalSteps = baseSteps.filter(s => s.type === 'searching' || s.type === 'contact');
      return [typeStep, ...productSteps, ...finalSteps];
    }
    return baseSteps;
  }, [insuranceType, formData.insuranceType]);
  const [contactErrors, setContactErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [searchProgress, setSearchProgress] = useState(0);
  const [currentPartner, setCurrentPartner] = useState(0);
  const [microLoading, setMicroLoading] = useState(false);
  const [transitionScreen, setTransitionScreen] = useState<string | null>(null);
  const { activeHint, startTracking, stopTracking, dismissHint } = useFieldTracking();

  const step = steps[currentStep];
  const totalSteps = steps.length;
  const progressPercent = ((currentStep + 1) / totalSteps) * 100;

  // Funnel tracking — emit step_view on each step change
  const reachedSubmitRef = useRef(false);
  const effectiveType = formData.insuranceType || insuranceType;
  useEffect(() => {
    if (!step) return;
    trackFunnel('step_view', {
      stepIndex: currentStep,
      stepId: step.id,
      insuranceType: effectiveType,
      metadata: { totalSteps, type: step.type },
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentStep, steps.length]);

  // Track form_view once on mount, abandon on unload if not submitted
  useEffect(() => {
    trackFunnel('form_view', { stepIndex: 0, stepId: steps[0]?.id, insuranceType: effectiveType });
    const onLeave = () => {
      if (!reachedSubmitRef.current) {
        trackFunnel('abandon', {
          stepIndex: currentStep,
          stepId: steps[currentStep]?.id,
          insuranceType: formData.insuranceType || insuranceType,
          metadata: { totalSteps: steps.length },
        });
      }
    };
    window.addEventListener('pagehide', onLeave);
    return () => {
      window.removeEventListener('pagehide', onLeave);
      onLeave();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Auto-advance past steps already pre-filled from URL params (hero form, deep links).
  useEffect(() => {
    if (!step || step.type === 'searching' || step.type === 'contact' || step.type === 'callback') return;
    if (step.field && formData[step.field]) {
      setCurrentStep((s) => Math.min(s + 1, steps.length - 1));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentStep, steps.length]);

  // Contextual transition messages
  const transitionMessages = [
    'Recherche des meilleurs tarifs en cours…',
    'Vérification de votre éligibilité aux bonus…',
    'Analyse de votre profil…',
    'Comparaison des garanties disponibles…',
    'Optimisation de votre tarif…',
  ];

  // Step time estimate
  const stepsRemaining = totalSteps - (currentStep + 1);
  const secondsEstimate = Math.max(15, stepsRemaining * 15);

  const mascotSrc = step.type === 'searching'
    ? mascotSearching
    : step.type === 'contact'
      ? (isSuccess ? mascotSuccess : mascotImages[insuranceType])
      : mascotImages[insuranceType];

  // Searching animation
  useEffect(() => {
    if (step.type !== 'searching') return;
    setSearchProgress(0);
    setCurrentPartner(0);

    const progressInterval = setInterval(() => {
      setSearchProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + 2;
      });
    }, 60);

    const partnerInterval = setInterval(() => {
      setCurrentPartner(prev => (prev + 1) % partnerNames.length);
    }, 200);

    const timer = setTimeout(() => {
      goNext();
    }, 3200);

    return () => {
      clearInterval(progressInterval);
      clearInterval(partnerInterval);
      clearTimeout(timer);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentStep]);

  const goNext = useCallback(() => {
    if (currentStep < totalSteps - 1) {
      setDirection(1);
      setCurrentStep(prev => prev + 1);
    }
  }, [currentStep, totalSteps]);

  const goBack = () => {
    if (currentStep > 0) {
      trackFunnel('step_back', { stepIndex: currentStep, stepId: steps[currentStep]?.id, insuranceType: effectiveType });
      setDirection(-1);
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleCardSelect = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    trackFunnel('step_complete', {
      stepIndex: currentStep,
      stepId: steps[currentStep]?.id,
      insuranceType: effectiveType,
      metadata: { field, value },
    });
    // Show transition screen with contextual message
    const msg = transitionMessages[currentStep % transitionMessages.length];
    setTransitionScreen(msg);
    setMicroLoading(true);
    setTimeout(() => {
      setMicroLoading(false);
      setTransitionScreen(null);
      setDirection(1);
      setCurrentStep(prev => prev + 1);
    }, 1000);
  };

  const handleInputSubmit = (field: string, value: string, step: FormStep) => {
    if (step.validation && !step.validation.test(value)) {
      return;
    }
    setFormData(prev => ({ ...prev, [field]: value }));
    trackFunnel('step_complete', {
      stepIndex: currentStep,
      stepId: steps[currentStep]?.id,
      insuranceType: effectiveType,
      metadata: { field },
    });
    goNext();
  };

  const handleContactSubmit = async () => {
    const result = contactSchema.safeParse(contactData);
    if (!result.success) {
      const errors: Record<string, string> = {};
      result.error.issues.forEach(issue => {
        errors[issue.path[0] as string] = issue.message;
      });
      setContactErrors(errors);
      return;
    }
    setContactErrors({});

    if (isBot()) {
      setIsSuccess(true);
      return;
    }

    setIsSubmitting(true);
    try {
      const insType = formData.insuranceType || insuranceType;
      const rawType = insType === 'comparateur' ? (formData.insuranceType || 'auto') : insType;
      const canonicalType = normalizeInsuranceTypeStrict(rawType);
      if (!canonicalType) {
        toast.error(`Type d'assurance invalide: ${rawType}`);
        setIsSubmitting(false);
        return;
      }
      const { data: insertedQuote, error } = await supabase.from('insurance_quotes').insert({
        insurance_type: canonicalType,
        full_name: contactData.fullName,
        email: contactData.email,
        phone: contactData.phone,
        quote_data: {
          ...formData,
          source: 'multi_step_form',
          insuranceType: insType,
        },
        status: 'pending',
      }).select().single();

      if (error) throw error;

      // Send email
      await supabase.functions.invoke('send-quote-email', {
        body: {
          name: contactData.fullName,
          email: contactData.email,
          phone: contactData.phone,
          type: insType,
          details: formData,
          estimatedPrice: 35,
        },
      }).catch(console.error);

      setIsSuccess(true);
      reachedSubmitRef.current = true;
      trackFunnel('submit_success', {
        stepIndex: currentStep,
        stepId: steps[currentStep]?.id,
        insuranceType: insType,
        metadata: { leadId: insertedQuote?.id },
      });
      toast.success('Demande envoyée !', { description: 'Un conseiller vous contacte très vite.' });

      trackConversion('quote_request', 100);
      trackEvent('quote_request', {
        category: 'lead_generation',
        insurance_type: insType,
        coverage_level: formData.coverageLevel,
        source: 'multi_step_form',
        value: 100,
      });

      trackGoogleAdsConversionWithParams('quote_request', {
        value: 100,
        insuranceType: insType,
        postalCode: formData.postalCode,
        leadId: insertedQuote?.id,
      });

      trackMetaLead({
        content_name: `Devis ${insType}`,
        content_category: insType,
        value: 100,
        currency: 'EUR',
      });

      if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('event', 'conversion', {
          send_to: 'AW-972332620/QUOTE_SUBMIT',
          value: 100,
          currency: 'EUR',
          transaction_id: insertedQuote?.id || `${Date.now()}`,
        });
      }

      setTimeout(() => {
        navigate('/merci');
      }, 2000);
    } catch (error) {
      console.error('Error submitting quote:', error);
      trackFunnel('submit_error', {
        stepIndex: currentStep,
        stepId: steps[currentStep]?.id,
        insuranceType: formData.insuranceType || insuranceType,
        metadata: { message: (error as Error)?.message?.slice(0, 200) },
      });
      toast.error('Erreur', { description: 'Veuillez réessayer.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={`w-full max-w-2xl mx-auto ${className}`} id="quote-form">
      {/* Glass container */}
      <div className={`relative rounded-[2rem] bg-card/80 backdrop-blur-xl border border-border/50 shadow-[var(--shadow-lg)] overflow-hidden ${fixedHeight ? 'flex flex-col h-[640px]' : ''}`}>

        {/* Step banner — urgency + progress */}
        {step.type !== 'searching' && step.type !== 'callback' && !transitionScreen && (
          <div className="bg-primary px-4 py-2.5 flex items-center justify-between gap-3 text-[11px] md:text-xs">
            <span className="font-semibold text-primary-foreground/90">
              Étape {currentStep + 1}/{totalSteps}
            </span>
            <span className="text-primary-foreground/85 flex items-baseline gap-1.5">
              Plus que{' '}
              <span className="text-[22px] md:text-[26px] font-bold leading-none text-[#fcd34d] tabular-nums tracking-tight animate-[pulse_2.4s_ease-in-out_infinite] drop-shadow-[0_0_10px_rgba(252,211,77,0.45)]">
                {secondsEstimate}s
              </span>{' '}
              pour voir vos prix
            </span>
          </div>
        )}
        {step.type === 'callback' && !transitionScreen && (
          <div className="bg-primary px-4 py-2.5 flex items-center justify-between gap-3 text-[11px] md:text-xs">
            <span className="font-semibold text-primary-foreground/90">
              Dernière étape — finalisez votre demande
            </span>
            <span className="text-primary-foreground/85 flex items-baseline gap-1.5">
              Rappel sous{' '}
              <span className="text-[22px] md:text-[26px] font-bold leading-none text-[#fcd34d] tabular-nums tracking-tight animate-[pulse_2.4s_ease-in-out_infinite] drop-shadow-[0_0_10px_rgba(252,211,77,0.45)]">
                30 min
              </span>
            </span>
          </div>
        )}

        {/* Progress bar */}
        <div className="h-1.5 bg-muted/50 w-full relative overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-accent to-accent/70 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progressPercent}%` }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          />
          {microLoading && (
            <div className="absolute top-0 left-0 h-full w-full step-shimmer-bar" />
          )}
        </div>

        {/* Step indicator */}
        <div className="flex items-center justify-between px-6 pt-4 pb-2">
          <button
            type="button"
            onClick={goBack}
            disabled={currentStep === 0 || step.type === 'searching' || !!transitionScreen}
            className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors disabled:opacity-0 disabled:pointer-events-none relative z-10"
            aria-label="Étape précédente"
          >
            <ArrowLeft className="h-4 w-4" />
            Retour
          </button>
          <span className="text-xs font-medium text-muted-foreground tracking-wide">
            {step.type !== 'searching' && !transitionScreen && `${currentStep + 1} / ${totalSteps}`}
          </span>
        </div>

        {/* Honeypot */}
        <input ref={honeypotRef} type="text" name="website" autoComplete="off" tabIndex={-1} aria-hidden="true" style={{ position: 'absolute', left: '-9999px', opacity: 0 }} />

        {/* Content area */}
        <div className={`px-6 pb-8 flex flex-col ${fixedHeight ? 'flex-1 overflow-y-auto min-h-0' : 'min-h-[420px]'}`}>
          <AnimatePresence mode="wait" custom={direction}>
            {transitionScreen ? (
              <motion.div
                key="transition"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="flex-1 flex flex-col items-center justify-center gap-5 py-12"
              >
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p className="text-sm font-medium text-muted-foreground text-center max-w-xs">
                  {transitionScreen}
                </p>
              </motion.div>
            ) : (
              <motion.div
                key={step.id + currentStep}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
                className="flex-1 flex flex-col"
              >
                {/* Arthur mascot */}
                <div className="flex justify-center mb-4">
                  <motion.img
                    src={mascotSrc}
                    alt="Arthur"
                    className="h-20 md:h-24 object-contain drop-shadow-lg"
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1, y: [0, -6, 0] }}
                    transition={{
                      scale: { duration: 0.4 },
                      opacity: { duration: 0.4 },
                      y: { duration: 2.5, repeat: Infinity, ease: 'easeInOut' },
                    }}
                    width={96}
                    height={120}
                  />
                </div>

                {/* Title */}
                <div className="text-center mb-6">
                  <h2 className="text-xl md:text-2xl font-bold text-foreground mb-1.5">
                    {step.title}
                  </h2>
                  {step.subtitle && (
                    <p className="text-sm md:text-base text-muted-foreground max-w-md mx-auto">
                      {step.subtitle}
                    </p>
                  )}
                </div>

                {/* Step content */}
                {step.type === 'card-select' && step.options && step.field && (
                  <CardSelectStep
                    options={step.options}
                    selected={formData[step.field]}
                    onSelect={(value) => handleCardSelect(step.field!, value)}
                    microLoading={microLoading}
                  />
                )}

                {step.type === 'input' && step.field && (
                  <InputStep
                    step={step}
                    value={formData[step.field] || ''}
                    onChange={(val) => setFormData(prev => ({ ...prev, [step.field!]: val }))}
                    onSubmit={(val) => handleInputSubmit(step.field!, val, step)}
                    activeHint={activeHint?.field === step.field ? activeHint.message : null}
                    onFocus={() => startTracking(step.field!)}
                    onBlur={() => stopTracking(step.field!)}
                    onDismissHint={dismissHint}
                  />
                )}

                {step.type === 'vehicle-select' && step.field && (
                  <VehicleSelectStep
                    step={step}
                    formData={formData}
                    onSelect={(field, value) => {
                      setFormData(prev => {
                        const next = { ...prev, [field]: value };
                        // Clear model when brand changes
                        if (step.vehicleField === 'brand') {
                          delete next.vehicleModel;
                        }
                        return next;
                      });
                      const msg = transitionMessages[currentStep % transitionMessages.length];
                      setTransitionScreen(msg);
                      setMicroLoading(true);
                      setTimeout(() => {
                        setMicroLoading(false);
                        setTransitionScreen(null);
                        setDirection(1);
                        setCurrentStep(prev => prev + 1);
                      }, 700);
                    }}
                  />
                )}

                {step.type === 'searching' && (
                  <SearchingStep
                    progress={searchProgress}
                    currentPartner={partnerNames[currentPartner]}
                  />
                )}

                {step.type === 'contact' && (
                  <ContactStep
                    data={contactData}
                    errors={contactErrors}
                    isSubmitting={isSubmitting}
                    isSuccess={isSuccess}
                    onChange={setContactData}
                    onSubmit={handleContactSubmit}
                    insuranceType={formData.insuranceType || insuranceType}
                  />
                )}

                {step.type === 'callback' && (
                  <CallbackStep
                    data={contactData}
                    errors={contactErrors}
                    isSubmitting={isSubmitting}
                    isSuccess={isSuccess}
                    onChange={setContactData}
                    onSubmit={handleContactSubmit}
                  />
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Trust badges at bottom */}
        <div className="border-t border-border/30 px-6 py-3 flex items-center justify-center gap-4 text-xs text-muted-foreground">
          <span className="flex items-center gap-1"><Lock className="h-3 w-3" /> Données sécurisées</span>
          <span className="hidden sm:inline">•</span>
          <span className="hidden sm:flex items-center gap-1">100% gratuit</span>
          <span className="hidden sm:inline">•</span>
          <span className="hidden sm:flex items-center gap-1">Sans engagement</span>
        </div>
      </div>



    </div>
  );
};

// ─── Card Select Step ────────────────────────────────────────────────────────
function CardSelectStep({ options, selected, onSelect, microLoading }: { options: StepOption[]; selected?: string; onSelect: (v: string) => void; microLoading?: boolean }) {
  return (
    <div className="relative">
      <div className={`grid gap-3 ${options.length <= 3 ? 'grid-cols-1 sm:grid-cols-3' : options.length <= 4 ? 'grid-cols-2' : 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4'}`}>
        {options.map((option, idx) => {
          const Icon = option.icon;
          const isSelected = selected === option.value;
          return (
            <motion.button
              key={option.value}
              onClick={() => onSelect(option.value)}
              whileTap={{ scale: 0.96 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.08, duration: 0.3 }}
              style={{
                transform: isSelected ? 'scale(1.04)' : undefined,
                transition: 'transform 0.25s cubic-bezier(.4,0,.2,1), box-shadow 0.25s ease, border-color 0.25s ease',
              }}
              className={`
                group relative flex flex-col items-center text-center p-5 md:p-6 rounded-2xl border-2 cursor-pointer
                ${isSelected
                  ? 'border-primary bg-primary/5 shadow-[0_0_20px_hsl(var(--primary)/0.25)]'
                  : 'border-border/50 hover:border-primary/60 hover:bg-primary/[0.03] hover:shadow-[0_0_16px_hsl(var(--primary)/0.15)]'
                }
              `}
              onMouseEnter={(e) => {
                if (!isSelected) {
                  (e.currentTarget as HTMLElement).style.transform = 'scale(1.05)';
                }
              }}
              onMouseLeave={(e) => {
                if (!isSelected) {
                  (e.currentTarget as HTMLElement).style.transform = 'scale(1)';
                }
              }}
              aria-label={option.label}
            >
              {option.iconImage ? (
                <div className="h-16 w-16 md:h-20 md:w-20 flex items-center justify-center mb-2">
                  <img
                    src={option.iconImage}
                    alt=""
                    aria-hidden="true"
                    className="h-full w-full object-contain drop-shadow-md"
                    loading="lazy"
                    decoding="async"
                  />
                </div>
              ) : (
                <div className={`
                  h-14 w-14 md:h-16 md:w-16 rounded-2xl flex items-center justify-center mb-3 transition-all duration-200
                  ${isSelected
                    ? 'bg-primary text-primary-foreground shadow-[var(--shadow-elegant)]'
                    : 'bg-muted/60 text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary'
                  }
                `}>
                  <Icon className="h-7 w-7 md:h-8 md:w-8" />
                </div>
              )}
              <span className="font-semibold text-foreground text-sm md:text-base">{option.label}</span>
              {option.description && (
                <span className="text-xs text-muted-foreground mt-1 leading-tight">{option.description}</span>
              )}
              {isSelected && (
                <motion.div
                  layoutId="selected-check"
                  className="absolute top-2 right-2 h-6 w-6 rounded-full bg-primary flex items-center justify-center"
                >
                  <CheckCircle2 className="h-4 w-4 text-primary-foreground" />
                </motion.div>
              )}
            </motion.button>
          );
        })}
      </div>
      {/* Micro-loading feedback */}
      {microLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-4 flex items-center justify-center gap-2 text-xs text-muted-foreground"
        >
          <Loader2 className="h-3.5 w-3.5 animate-spin text-primary" />
          <span>Calcul de précision…</span>
        </motion.div>
      )}
    </div>
  );
}

// ─── Input Step ──────────────────────────────────────────────────────────────
function InputStep({ step, value, onChange, onSubmit, activeHint, onFocus, onBlur, onDismissHint }: {
  step: FormStep; value: string; onChange: (v: string) => void; onSubmit: (v: string) => void;
  activeHint?: string | null; onFocus?: () => void; onBlur?: () => void; onDismissHint?: () => void;
}) {
  const [error, setError] = useState('');

  const handleSubmit = () => {
    if (step.validation && !step.validation.test(value)) {
      setError(step.validationMessage || 'Valeur invalide');
      return;
    }
    setError('');
    onBlur?.();
    onSubmit(value);
  };

  return (
    <div className="flex flex-col items-center gap-4 max-w-xs mx-auto w-full">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full relative"
      >
        <Input
          type={step.inputType || 'text'}
          value={value}
          onChange={(e) => { onChange(e.target.value); setError(''); onDismissHint?.(); }}
          onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
          onFocus={onFocus}
          onBlur={onBlur}
          placeholder={step.placeholder}
          maxLength={step.maxLength}
          className="h-14 text-center text-xl font-semibold rounded-2xl border-2 border-border/50 focus:border-primary bg-background/50"
          autoFocus
        />
        {error && <p className="text-xs text-destructive mt-2 text-center">{error}</p>}

        {/* Contextual help bubble */}
        {activeHint && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8 }}
            className="absolute left-0 right-0 top-full mt-3 z-20"
          >
            <div className="relative bg-card border border-primary/20 rounded-xl p-3 shadow-[var(--shadow-card)] text-xs text-muted-foreground leading-relaxed">
              <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3 h-3 rotate-45 bg-card border-l border-t border-primary/20" />
              <div className="flex items-start gap-2">
                <span className="text-primary text-sm flex-shrink-0">💡</span>
                <span>{activeHint}</span>
                <button onClick={onDismissHint} className="text-muted-foreground/60 hover:text-foreground ml-auto flex-shrink-0" aria-label="Fermer">✕</button>
              </div>
            </div>
          </motion.div>
        )}
      </motion.div>
      <Button
        onClick={handleSubmit}
        size="lg"
        className="btn-glow w-full rounded-full font-bold text-base h-12 bg-primary hover:bg-primary/90 active:scale-[0.96] active:brightness-90 transition-all duration-75"
      >
        Continuer
        <ArrowRight className="ml-2 h-4 w-4" />
      </Button>
    </div>
  );
}


// ─── Vehicle Select Step ─────────────────────────────────────────────────────
function VehicleSelectStep({ step, formData, onSelect }: {
  step: FormStep;
  formData: Record<string, string>;
  onSelect: (field: string, value: string) => void;
}) {
  const [search, setSearch] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const items = useMemo(() => {
    if (step.vehicleField === 'brand') {
      const brands = step.vehicleType === 'moto' ? MOTO_BRAND_NAMES : AUTO_BRAND_NAMES;
      return brands;
    }
    if (step.vehicleField === 'model') {
      const selectedBrand = formData.vehicleBrand;
      const brandsMap = step.vehicleType === 'moto' ? MOTO_BRANDS : AUTO_BRANDS;
      return selectedBrand ? (brandsMap[selectedBrand] || []) : [];
    }
    return [];
  }, [step.vehicleField, step.vehicleType, formData.vehicleBrand]);

  const filtered = useMemo(() => {
    if (!search.trim()) return items;
    const q = search.toLowerCase();
    return items.filter(i => i.toLowerCase().includes(q));
  }, [items, search]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  return (
    <div className="flex flex-col items-center gap-3 max-w-sm mx-auto w-full">
      <div className="relative w-full">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          ref={inputRef}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Rechercher…"
          className="h-12 pl-10 rounded-2xl border-2 border-border/50 focus:border-primary bg-background/50"
        />
      </div>
      <div className="w-full max-h-[260px] overflow-y-auto rounded-xl border border-border/30 bg-background/50">
        {filtered.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-6">Aucun résultat</p>
        ) : (
          filtered.map((item, idx) => (
            <motion.button
              key={item}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: Math.min(idx * 0.02, 0.3) }}
              onClick={() => onSelect(step.field!, item)}
              className="w-full text-left px-4 py-3 text-sm font-medium text-foreground hover:bg-primary/5 hover:text-primary transition-colors border-b border-border/20 last:border-b-0"
            >
              {item}
            </motion.button>
          ))
        )}
      </div>
    </div>
  );
}

// ─── Searching Step ──────────────────────────────────────────────────────────
function SearchingStep({ progress, currentPartner }: { progress: number; currentPartner: string }) {
  return (
    <div className="flex flex-col items-center gap-6 py-4">
      {/* Spinning loader */}
      <div className="relative h-20 w-20">
        <svg className="h-20 w-20 animate-spin" viewBox="0 0 80 80">
          <circle cx="40" cy="40" r="34" fill="none" stroke="hsl(var(--muted))" strokeWidth="5" />
          <circle
            cx="40" cy="40" r="34" fill="none"
            stroke="hsl(var(--primary))" strokeWidth="5"
            strokeDasharray={`${progress * 2.14} 214`}
            strokeLinecap="round"
            className="transition-all duration-200"
            style={{ transformOrigin: 'center', transform: 'rotate(-90deg)' }}
          />
        </svg>
        <span className="absolute inset-0 flex items-center justify-center text-sm font-bold text-primary">
          {Math.round(progress)}%
        </span>
      </div>

      {/* Current partner being analyzed */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentPartner}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.15 }}
          className="text-sm text-muted-foreground font-medium"
        >
          Analyse de <span className="text-foreground font-semibold">{currentPartner}</span>…
        </motion.div>
      </AnimatePresence>

      {/* Progress bar */}
      <div className="w-full max-w-xs h-2 bg-muted/50 rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-primary to-secondary rounded-full"
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.2 }}
        />
      </div>

      <p className="text-xs text-muted-foreground">50+ assureurs comparés en temps réel</p>
    </div>
  );
}

// ─── Teaser Prices by insurance type with insurer logos ──────────────────────
const teaserPrices: Record<string, { label: string; prices: { name: string; price: string; badge?: string; logo: string; features: string[] }[] }> = {
  auto: { label: 'Assurance Auto', prices: [
    { name: 'Tiers', price: '11€', badge: 'Dès', logo: logoDirectAssurance, features: ['Responsabilité civile obligatoire', 'Défense pénale et recours', 'Assistance 50 km du domicile'] },
    { name: 'Tiers+', price: '18€', badge: 'Dès', logo: logoAllianz, features: ['Tout du Tiers', 'Vol et incendie', 'Bris de glace', 'Catastrophes naturelles'] },
    { name: 'Tous risques', price: '29€', badge: 'Dès', logo: logoAxa, features: ['Tous dommages au véhicule', 'Vol, incendie, vandalisme', 'Bris de glace 0€ franchise', 'Véhicule de prêt'] },
  ]},
  moto: { label: 'Assurance Moto', prices: [
    { name: 'Tiers', price: '9€', badge: 'Dès', logo: logoAmaguiz, features: ['Responsabilité civile', 'Défense pénale', 'Assistance dépannage'] },
    { name: 'Intermédiaire', price: '15€', badge: 'Dès', logo: logoAllianz, features: ['Tout du Tiers', 'Vol et incendie', 'Équipement pilote 500€'] },
    { name: 'Tous risques', price: '24€', badge: 'Dès', logo: logoAxa, features: ['Tous dommages moto', 'Vol et incendie', 'Équipement 1500€', 'Assistance 0 km'] },
  ]},
  habitation: { label: 'Assurance Habitation', prices: [
    { name: 'Essentielle', price: '5€', badge: 'Dès', logo: logoDirectAssurance, features: ['Responsabilité civile vie privée', 'Incendie et explosion', 'Dégâts des eaux'] },
    { name: 'Confort', price: '12€', badge: 'Dès', logo: logoMaif, features: ['Tout de l\'Essentielle', 'Vol et vandalisme', 'Bris de glace', 'Catastrophes naturelles'] },
    { name: 'Premium', price: '19€', badge: 'Dès', logo: logoGroupama, features: ['Couverture tous risques', 'Objets de valeur protégés', 'Protection juridique', 'Relogement inclus'] },
  ]},
  sante: { label: 'Mutuelle Santé', prices: [
    { name: 'Essentielle', price: '14€', badge: 'Dès', logo: logoAlanNew, features: ['Hospitalisation 100% BR', 'Soins courants 100%', 'Optique simple'] },
    { name: 'Confort', price: '29€', badge: 'Dès', logo: logoHarmonie, features: ['Hospitalisation 200% BR', 'Dentaire 200%', 'Optique 200€/an', 'Médecines douces'] },
    { name: 'Premium', price: '49€', badge: 'Dès', logo: logoAxa, features: ['Hospitalisation 300% BR', 'Dentaire 400%', 'Optique 500€/an', 'Chambre particulière'] },
  ]},
  pret: { label: 'Assurance Emprunteur', prices: [
    { name: 'Décès', price: '8€', badge: 'Dès', logo: logoApril, features: ['Garantie décès toutes causes', 'Capital remboursé à la banque', 'Couverture jusqu\'à 75 ans'] },
    { name: 'Décès + PTIA', price: '14€', badge: 'Dès', logo: logoCardif, features: ['Décès', 'PTIA (perte totale d\'autonomie)', 'Délégation loi Lemoine'] },
    { name: 'Complète', price: '22€', badge: 'Dès', logo: logoGenerali, features: ['Décès et PTIA', 'Invalidité (IPT, IPP)', 'Incapacité de travail (ITT)', 'Perte d\'emploi en option'] },
  ]},
  animaux: { label: 'Assurance Animaux', prices: [
    { name: 'Accident', price: '7€', badge: 'Dès', logo: logoAcheel, features: ['Frais vétérinaires accident', 'Chirurgie d\'urgence', 'Hospitalisation'] },
    { name: 'Confort', price: '19€', badge: 'Dès', logo: logoAllianz, features: ['Accidents et maladies', 'Remboursement 70%', 'Plafond 1500€/an', 'Vaccins inclus'] },
    { name: 'Intégrale', price: '34€', badge: 'Dès', logo: logoAxa, features: ['Accidents et maladies', 'Remboursement 100%', 'Plafond 2500€/an', 'Prévention et stérilisation'] },
  ]},
  vie: { label: 'Assurance Vie', prices: [
    { name: 'Essentielle', price: '20€', badge: 'Dès', logo: logoSwisslife, features: ['Fonds euros sécurisé', 'Versements libres', 'Frais d\'entrée 0%'] },
    { name: 'Confort', price: '45€', badge: 'Dès', logo: logoGenerali, features: ['Fonds euros + unités de compte', 'Gestion pilotée', 'Arbitrages gratuits', 'Avance sur épargne'] },
    { name: 'Premium', price: '80€', badge: 'Dès', logo: logoAxa, features: ['Multi-supports premium', 'Gestion sous mandat', 'SCPI accessibles', 'Conseiller dédié'] },
  ]},
  prevoyance: { label: 'Prévoyance', prices: [
    { name: 'Essentielle', price: '12€', badge: 'Dès', logo: logoApril, features: ['Capital décès', 'Rente éducation enfants', 'Frais d\'obsèques'] },
    { name: 'Confort', price: '25€', badge: 'Dès', logo: logoAllianz, features: ['Capital décès', 'Invalidité permanente', 'Indemnités journalières', 'Rente conjoint'] },
    { name: 'Intégrale', price: '42€', badge: 'Dès', logo: logoAxa, features: ['Toutes garanties Confort', 'IJ majorées', 'Rente éducation', 'Assistance famille'] },
  ]},
  rc_pro: { label: 'RC Pro', prices: [
    { name: 'Basique', price: '15€', badge: 'Dès', logo: logoAon, features: ['RC exploitation', 'RC professionnelle', 'Plafond 1M€'] },
    { name: 'Standard', price: '29€', badge: 'Dès', logo: logoAllianz, features: ['RC exploitation et pro', 'Défense recours', 'Plafond 3M€', 'Faute inexcusable'] },
    { name: 'Premium', price: '49€', badge: 'Dès', logo: logoAxa, features: ['Toutes garanties Standard', 'Cyber-risques inclus', 'Plafond 8M€', 'Protection juridique étendue'] },
  ]},
  mrp: { label: 'Multirisque Pro', prices: [
    { name: 'Essentielle', price: '25€', badge: 'Dès', logo: logoGenerali, features: ['Locaux et matériel', 'Incendie, dégâts des eaux', 'RC exploitation'] },
    { name: 'Confort', price: '45€', badge: 'Dès', logo: logoAllianz, features: ['Tout de l\'Essentielle', 'Vol et vandalisme', 'Bris de machines', 'Perte d\'exploitation'] },
    { name: 'Premium', price: '75€', badge: 'Dès', logo: logoAxa, features: ['Couverture tous risques', 'Cyber-risques', 'Marchandises transportées', 'Protection juridique pro'] },
  ]},
  gli: { label: 'GLI', prices: [
    { name: 'Basique', price: '2,5%', badge: 'Dès', logo: logoAllianz, features: ['Loyers impayés couverts', 'Plafond 50 000€', 'Carence 3 mois'] },
    { name: 'Standard', price: '3%', badge: 'Dès', logo: logoGenerali, features: ['Loyers impayés', 'Détériorations immobilières', 'Frais de procédure', 'Carence 2 mois'] },
    { name: 'Premium', price: '3,5%', badge: 'Dès', logo: logoAxa, features: ['Toutes garanties Standard', 'Vacance locative', 'Plafond 90 000€', 'Sans carence'] },
  ]},
  pno: { label: 'PNO', prices: [
    { name: 'Essentielle', price: '6€', badge: 'Dès', logo: logoDirectAssurance, features: ['Responsabilité civile propriétaire', 'Incendie et dégâts des eaux', 'Recours des locataires'] },
    { name: 'Confort', price: '11€', badge: 'Dès', logo: logoMaif, features: ['Tout de l\'Essentielle', 'Vol entre locataires', 'Bris de glace', 'Vacance locative 3 mois'] },
    { name: 'Premium', price: '18€', badge: 'Dès', logo: logoGroupama, features: ['Couverture tous risques', 'Vacance locative 6 mois', 'Protection juridique', 'Détériorations immobilières'] },
  ]},
  gestion_locative: { label: 'Gestion Locative', prices: [
    { name: 'Essentielle', price: '5%', badge: 'Dès', logo: logoMaif, features: ['Encaissement loyers', 'Quittancement', 'Révision annuelle'] },
    { name: 'Confort', price: '7%', badge: 'Dès', logo: logoAllianz, features: ['Tout de l\'Essentielle', 'GLI incluse', 'Gestion technique', 'Visites annuelles'] },
    { name: 'Premium', price: '9%', badge: 'Dès', logo: logoAxa, features: ['Gestion complète', 'GLI + vacance', 'Travaux supervisés', 'Reporting détaillé'] },
  ]},
};

// ─── Contact Step ────────────────────────────────────────────────────────────
function ContactStep({
  data, errors, isSubmitting, isSuccess, onChange, onSubmit, insuranceType,
}: {
  data: { fullName: string; email: string; phone: string; acceptTerms: boolean };
  errors: Record<string, string>;
  isSubmitting: boolean;
  isSuccess: boolean;
  onChange: (d: typeof data) => void;
  onSubmit: () => void;
  insuranceType?: string;
}) {
  if (isSuccess) {
    return (
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="flex flex-col items-center gap-4 py-6"
      >
        <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
          <CheckCircle2 className="h-10 w-10 text-primary" />
        </div>
        <h3 className="text-xl font-bold text-foreground">Demande envoyée !</h3>
        <p className="text-sm text-muted-foreground text-center max-w-sm">
          Un expert vous rappelle sous 5 minutes avec les meilleures offres personnalisées.
        </p>
      </motion.div>
    );
  }

  const prices = teaserPrices[insuranceType || 'auto']?.prices || teaserPrices.auto.prices;

  return (
    <div className="space-y-5 max-w-md mx-auto w-full">
      {/* Teaser prices */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="space-y-3"
      >
        <div className="flex flex-col items-center gap-1">
          <p className="text-sm font-semibold text-primary text-center">
            ⬇️ Continuez ci-dessous pour recevoir vos prix exacts
          </p>
          <span className="text-xl text-primary animate-bounce" aria-hidden="true">↓</span>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {prices.map((p, i) => (
            <motion.div
              key={p.name}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1, duration: 0.3 }}
            >
              <FlipPriceCard
                name={p.name}
                price={p.price}
                badge={p.badge}
                logo={p.logo}
                features={p.features}
                highlight={i === 0}
                insuranceType={insuranceType || 'auto'}
                position={i}
              />
            </motion.div>
          ))}
        </div>
        <p className="text-[11px] text-muted-foreground text-center italic">
          👆 Cliquez sur une carte pour voir les garanties incluses
        </p>
      </motion.div>

      {/* Scroll-down CTA — make it obvious that contact fields are below */}
      <motion.div
        initial={{ opacity: 0, y: -4 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.4 }}
        className="flex flex-col items-center gap-1.5 pt-1"
      >
        <p className="text-sm font-semibold text-primary text-center">
          ⬇️ Continuez ci-dessous pour recevoir vos prix exacts
        </p>
        <span className="text-2xl text-primary animate-bounce" aria-hidden="true">↓</span>
      </motion.div>

      <div className="h-px bg-border/40" />
      {/* Full name */}
      <div className="space-y-1.5">
        <Label htmlFor="msf-name" className="text-sm font-medium flex items-center gap-1.5">
          <User className="h-3.5 w-3.5 text-muted-foreground" /> Nom complet
        </Label>
        <Input
          id="msf-name"
          value={data.fullName}
          onChange={(e) => onChange({ ...data, fullName: e.target.value })}
          placeholder="Jean Dupont"
          className="h-12 rounded-xl border-2 border-border/50 focus:border-primary"
          disabled={isSubmitting}
        />
        {errors.fullName && <p className="text-xs text-destructive">{errors.fullName}</p>}
      </div>

      {/* Email */}
      <div className="space-y-1.5">
        <Label htmlFor="msf-email" className="text-sm font-medium flex items-center gap-1.5">
          <Mail className="h-3.5 w-3.5 text-muted-foreground" /> Email
        </Label>
        <Input
          id="msf-email"
          type="email"
          value={data.email}
          onChange={(e) => onChange({ ...data, email: e.target.value })}
          placeholder="jean.dupont@email.com"
          className="h-12 rounded-xl border-2 border-border/50 focus:border-primary"
          disabled={isSubmitting}
        />
        {errors.email && <p className="text-xs text-destructive">{errors.email}</p>}
      </div>

      {/* Phone */}
      <div className="space-y-1.5">
        <Label htmlFor="msf-phone" className="text-sm font-medium flex items-center gap-1.5">
          <Phone className="h-3.5 w-3.5 text-muted-foreground" /> Téléphone
        </Label>
        <Input
          id="msf-phone"
          type="tel"
          value={data.phone}
          onChange={(e) => onChange({ ...data, phone: e.target.value })}
          placeholder="06 12 34 56 78"
          className="h-12 rounded-xl border-2 border-border/50 focus:border-primary"
          disabled={isSubmitting}
        />
        {errors.phone && <p className="text-xs text-destructive">{errors.phone}</p>}
      </div>

      {/* Terms */}
      <div className="flex items-start gap-2 pt-1">
        <Checkbox
          id="msf-terms"
          checked={data.acceptTerms}
          onCheckedChange={(checked) => onChange({ ...data, acceptTerms: checked as boolean })}
          disabled={isSubmitting}
        />
        <Label htmlFor="msf-terms" className="text-xs text-muted-foreground leading-tight cursor-pointer">
          J'accepte les conditions d'utilisation et la politique de confidentialité. Mes données sont utilisées uniquement pour me recontacter.
        </Label>
      </div>
      {errors.acceptTerms && <p className="text-xs text-destructive">{errors.acceptTerms}</p>}

      {/* Submit */}
      <Button
        onClick={onSubmit}
        disabled={isSubmitting}
        size="lg"
        className="btn-glow w-full rounded-full font-bold text-base h-13 bg-secondary hover:bg-secondary/90 text-secondary-foreground active:scale-[0.97] transition-transform"
      >
        {isSubmitting ? (
          <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Envoi en cours…</>
        ) : (
          <>Recevoir mon devis gratuit</>
        )}
      </Button>

      <p className="text-[11px] text-muted-foreground text-center">
        🔒 Vos données sont protégées et ne seront jamais vendues.
      </p>
    </div>
  );
}

// ─── Callback Step (no price, justified call-back request) ───────────────────
function CallbackStep({
  data, errors, isSubmitting, isSuccess, onChange, onSubmit,
}: {
  data: { fullName: string; email: string; phone: string; acceptTerms: boolean };
  errors: Record<string, string>;
  isSubmitting: boolean;
  isSuccess: boolean;
  onChange: (d: typeof data) => void;
  onSubmit: () => void;
}) {
  if (isSuccess) {
    return (
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="flex flex-col items-center gap-4 py-6"
      >
        <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
          <CheckCircle2 className="h-10 w-10 text-primary" />
        </div>
        <h3 className="text-xl font-bold text-foreground">Demande reçue !</h3>
        <p className="text-sm text-muted-foreground text-center max-w-sm">
          Un courtier expert métiers atypiques vous rappelle sous 5 minutes avec une étude personnalisée et 2 à 3 propositions chiffrées.
        </p>
      </motion.div>
    );
  }

  return (
    <div className="space-y-5 max-w-md mx-auto w-full">
      {/* Justification block */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="rounded-2xl bg-primary/5 border border-primary/20 p-4 space-y-2"
      >
        <p className="text-sm font-semibold text-foreground flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 text-primary" /> Pourquoi pas de prix immédiat ?
        </p>
        <p className="text-xs text-muted-foreground leading-relaxed">
          Chiffrer un métier atypique demande une analyse fine : votre process, vos certifications,
          votre sinistralité et les spécificités de votre activité influencent fortement la prime.
          C'est pourquoi nos courtiers étudient votre dossier en profondeur et le présentent à nos
          <span className="font-semibold text-foreground"> 20 assureurs de niche</span> les mieux positionnés
          pour votre secteur, avant de vous transmettre une estimation fiable —
          souvent <span className="font-semibold text-foreground">2 fois moins chère</span> qu'un devis en direct.
        </p>
        <ul className="text-xs text-muted-foreground space-y-1 pt-1">
          <li className="flex items-center gap-2"><span className="text-primary">✓</span> Rappel sous 10 minutes</li>
          <li className="flex items-center gap-2"><span className="text-primary">✓</span> 2 à 3 propositions argumentées</li>
          <li className="flex items-center gap-2"><span className="text-primary">✓</span> Sans engagement</li>
        </ul>
      </motion.div>

      {/* Full name */}
      <div className="space-y-1.5">
        <Label htmlFor="cb-name" className="text-sm font-medium flex items-center gap-1.5">
          <User className="h-3.5 w-3.5 text-muted-foreground" /> Nom complet
        </Label>
        <Input
          id="cb-name"
          value={data.fullName}
          onChange={(e) => onChange({ ...data, fullName: e.target.value })}
          placeholder="Jean Dupont"
          className="h-12 rounded-xl border-2 border-border/50 focus:border-primary"
          disabled={isSubmitting}
        />
        {errors.fullName && <p className="text-xs text-destructive">{errors.fullName}</p>}
      </div>

      {/* Email */}
      <div className="space-y-1.5">
        <Label htmlFor="cb-email" className="text-sm font-medium flex items-center gap-1.5">
          <Mail className="h-3.5 w-3.5 text-muted-foreground" /> Email professionnel
        </Label>
        <Input
          id="cb-email"
          type="email"
          value={data.email}
          onChange={(e) => onChange({ ...data, email: e.target.value })}
          placeholder="contact@monentreprise.fr"
          className="h-12 rounded-xl border-2 border-border/50 focus:border-primary"
          disabled={isSubmitting}
        />
        {errors.email && <p className="text-xs text-destructive">{errors.email}</p>}
      </div>

      {/* Phone */}
      <div className="space-y-1.5">
        <Label htmlFor="cb-phone" className="text-sm font-medium flex items-center gap-1.5">
          <Phone className="h-3.5 w-3.5 text-muted-foreground" /> Téléphone (pour le rappel)
        </Label>
        <Input
          id="cb-phone"
          type="tel"
          value={data.phone}
          onChange={(e) => onChange({ ...data, phone: e.target.value })}
          placeholder="06 12 34 56 78"
          className="h-12 rounded-xl border-2 border-border/50 focus:border-primary"
          disabled={isSubmitting}
        />
        {errors.phone && <p className="text-xs text-destructive">{errors.phone}</p>}
      </div>

      {/* Terms */}
      <div className="flex items-start gap-2 pt-1">
        <Checkbox
          id="cb-terms"
          checked={data.acceptTerms}
          onCheckedChange={(checked) => onChange({ ...data, acceptTerms: checked as boolean })}
          disabled={isSubmitting}
        />
        <Label htmlFor="cb-terms" className="text-xs text-muted-foreground leading-tight cursor-pointer">
          J'accepte les conditions d'utilisation. Mes données servent uniquement à étudier mon dossier et à me rappeler.
        </Label>
      </div>
      {errors.acceptTerms && <p className="text-xs text-destructive">{errors.acceptTerms}</p>}

      {/* Submit */}
      <Button
        onClick={onSubmit}
        disabled={isSubmitting}
        size="lg"
        className="btn-glow w-full rounded-full font-bold text-base h-13 bg-secondary hover:bg-secondary/90 text-secondary-foreground active:scale-[0.97] transition-transform"
      >
        {isSubmitting ? (
          <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Envoi en cours…</>
        ) : (
          <>Demander mon rappel sous 10 minutes</>
        )}
      </Button>

      <p className="text-[11px] text-muted-foreground text-center">
        🔒 Vos données sont protégées et ne seront jamais vendues.
      </p>
    </div>
  );
}

export default MultiStepQuoteForm;
