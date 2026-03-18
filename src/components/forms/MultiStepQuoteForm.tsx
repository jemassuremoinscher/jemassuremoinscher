import { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { ArrowLeft, ArrowRight, Loader2, CheckCircle2, Lock, Phone, Mail, User } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useAnalytics } from '@/hooks/useAnalytics';
import { useHoneypot } from '@/hooks/useHoneypot';
import { trackGoogleAdsConversionWithParams } from '@/utils/googleAdsTracking';
import { trackMetaLead } from '@/utils/metaPixelTracking';
import { normalizeInsuranceType } from '@/utils/insuranceTypeNormalizer';
import { stepConfigsByType, type InsuranceType, type FormStep, type StepOption } from './stepConfigs';

// Mascot imports
import arthurCar from '@/assets/mascotte/arthur-car.png';
import arthurMoto from '@/assets/mascotte/arthur-moto.png';
import arthurHouse from '@/assets/mascotte/arthur-house.png';
import arthurSick from '@/assets/mascotte/arthur-sick.png';
import arthurThinking from '@/assets/mascotte/arthur-thinking.png';
import arthurAnimals from '@/assets/mascotte/arthur-animals.png';
import arthurIdea from '@/assets/mascotte/arthur-idea.png';
import arthurInjured from '@/assets/mascotte/arthur-injured.png';
import arthurBusiness from '@/assets/mascotte/arthur-business.png';
import arthurDetective from '@/assets/mascotte/arthur-detective.png';
import arthurThumbsUp from '@/assets/mascotte/arthur-thumbs-up.png';
import arthurExcited from '@/assets/mascotte/arthur-excited.png';
import arthurRunningCoin from '@/assets/mascotte/arthur-running-coin.png';

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

export const MultiStepQuoteForm = ({ insuranceType, onComplete, className = '' }: MultiStepQuoteFormProps) => {
  const navigate = useNavigate();
  const { trackEvent, trackConversion } = useAnalytics();
  const { honeypotRef, isBot } = useHoneypot();

  const steps = stepConfigsByType[insuranceType] || stepConfigsByType.comparateur;
  const [currentStep, setCurrentStep] = useState(0);
  const [direction, setDirection] = useState(1);
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [contactData, setContactData] = useState({ fullName: '', email: '', phone: '', acceptTerms: false as boolean });
  const [contactErrors, setContactErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [searchProgress, setSearchProgress] = useState(0);
  const [currentPartner, setCurrentPartner] = useState(0);

  const step = steps[currentStep];
  const totalSteps = steps.length;
  const progressPercent = ((currentStep + 1) / totalSteps) * 100;

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
      setDirection(-1);
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleCardSelect = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Auto-advance after a short delay for satisfying UX
    setTimeout(() => {
      setDirection(1);
      setCurrentStep(prev => prev + 1);
    }, 300);
  };

  const handleInputSubmit = (field: string, value: string, step: FormStep) => {
    if (step.validation && !step.validation.test(value)) {
      return;
    }
    setFormData(prev => ({ ...prev, [field]: value }));
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
      const { data: insertedQuote, error } = await supabase.from('insurance_quotes').insert({
        insurance_type: normalizeInsuranceType(insType === 'comparateur' ? (formData.insuranceType || 'auto') : insType),
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
      toast.error('Erreur', { description: 'Veuillez réessayer.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={`w-full max-w-2xl mx-auto ${className}`}>
      {/* Glass container */}
      <div className="relative rounded-[2rem] bg-card/80 backdrop-blur-xl border border-border/50 shadow-[var(--shadow-lg)] overflow-hidden">

        {/* Progress bar */}
        <div className="h-1.5 bg-muted/50 w-full">
          <motion.div
            className="h-full bg-gradient-to-r from-primary to-primary/70 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progressPercent}%` }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          />
        </div>

        {/* Step indicator */}
        <div className="flex items-center justify-between px-6 pt-4 pb-2">
          <button
            onClick={goBack}
            disabled={currentStep === 0 || step.type === 'searching'}
            className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors disabled:opacity-0 disabled:pointer-events-none"
            aria-label="Étape précédente"
          >
            <ArrowLeft className="h-4 w-4" />
            Retour
          </button>
          <span className="text-xs font-medium text-muted-foreground tracking-wide">
            {step.type !== 'searching' && `${currentStep + 1} / ${totalSteps}`}
          </span>
        </div>

        {/* Honeypot */}
        <input ref={honeypotRef} type="text" name="website" autoComplete="off" tabIndex={-1} aria-hidden="true" style={{ position: 'absolute', left: '-9999px', opacity: 0 }} />

        {/* Content area */}
        <div className="px-6 pb-8 min-h-[420px] flex flex-col">
          <AnimatePresence mode="wait" custom={direction}>
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
                />
              )}

              {step.type === 'input' && step.field && (
                <InputStep
                  step={step}
                  value={formData[step.field] || ''}
                  onChange={(val) => setFormData(prev => ({ ...prev, [step.field!]: val }))}
                  onSubmit={(val) => handleInputSubmit(step.field!, val, step)}
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
                  insuranceType={insuranceType}
                />
              )}
            </motion.div>
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
function CardSelectStep({ options, selected, onSelect }: { options: StepOption[]; selected?: string; onSelect: (v: string) => void }) {
  return (
    <div className={`grid gap-3 ${options.length <= 3 ? 'grid-cols-1 sm:grid-cols-3' : 'grid-cols-2'}`}>
      {options.map((option, idx) => {
        const Icon = option.icon;
        const isSelected = selected === option.value;
        return (
          <motion.button
            key={option.value}
            onClick={() => onSelect(option.value)}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.08, duration: 0.3 }}
            className={`
              group relative flex flex-col items-center text-center p-5 md:p-6 rounded-2xl border-2 transition-all duration-200 cursor-pointer
              ${isSelected
                ? 'border-primary bg-primary/5 shadow-[var(--shadow-hover)]'
                : 'border-border/50 hover:border-primary/40 hover:bg-primary/[0.02] hover:shadow-[var(--shadow-card)]'
              }
            `}
            aria-label={option.label}
          >
            <div className={`
              h-14 w-14 md:h-16 md:w-16 rounded-2xl flex items-center justify-center mb-3 transition-all duration-200
              ${isSelected
                ? 'bg-primary text-primary-foreground shadow-[var(--shadow-elegant)]'
                : 'bg-muted/60 text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary'
              }
            `}>
              <Icon className="h-7 w-7 md:h-8 md:w-8" />
            </div>
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
  );
}

// ─── Input Step ──────────────────────────────────────────────────────────────
function InputStep({ step, value, onChange, onSubmit }: { step: FormStep; value: string; onChange: (v: string) => void; onSubmit: (v: string) => void }) {
  const [error, setError] = useState('');

  const handleSubmit = () => {
    if (step.validation && !step.validation.test(value)) {
      setError(step.validationMessage || 'Valeur invalide');
      return;
    }
    setError('');
    onSubmit(value);
  };

  return (
    <div className="flex flex-col items-center gap-4 max-w-xs mx-auto w-full">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full"
      >
        <Input
          type={step.inputType || 'text'}
          value={value}
          onChange={(e) => { onChange(e.target.value); setError(''); }}
          onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
          placeholder={step.placeholder}
          maxLength={step.maxLength}
          className="h-14 text-center text-xl font-semibold rounded-2xl border-2 border-border/50 focus:border-primary bg-background/50"
          autoFocus
        />
        {error && <p className="text-xs text-destructive mt-2 text-center">{error}</p>}
      </motion.div>
      <Button
        onClick={handleSubmit}
        size="lg"
        className="w-full rounded-full font-bold text-base h-12 bg-primary hover:bg-primary/90 active:scale-[0.97] transition-transform"
      >
        Continuer
        <ArrowRight className="ml-2 h-4 w-4" />
      </Button>
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

// ─── Teaser Prices by insurance type ─────────────────────────────────────────
const teaserPrices: Record<string, { label: string; prices: { name: string; price: string; badge?: string }[] }> = {
  auto: { label: 'Assurance Auto', prices: [
    { name: 'Tiers', price: '11€', badge: 'Dès' },
    { name: 'Tiers+', price: '18€', badge: 'Dès' },
    { name: 'Tous risques', price: '29€', badge: 'Dès' },
  ]},
  moto: { label: 'Assurance Moto', prices: [
    { name: 'Tiers', price: '9€', badge: 'Dès' },
    { name: 'Intermédiaire', price: '15€', badge: 'Dès' },
    { name: 'Tous risques', price: '24€', badge: 'Dès' },
  ]},
  habitation: { label: 'Assurance Habitation', prices: [
    { name: 'Essentielle', price: '5€', badge: 'Dès' },
    { name: 'Confort', price: '12€', badge: 'Dès' },
    { name: 'Premium', price: '19€', badge: 'Dès' },
  ]},
  sante: { label: 'Mutuelle Santé', prices: [
    { name: 'Essentielle', price: '14€', badge: 'Dès' },
    { name: 'Confort', price: '29€', badge: 'Dès' },
    { name: 'Premium', price: '49€', badge: 'Dès' },
  ]},
  pret: { label: 'Assurance Prêt', prices: [
    { name: 'Décès', price: '8€', badge: 'Dès' },
    { name: 'Décès + PTIA', price: '14€', badge: 'Dès' },
    { name: 'Complète', price: '22€', badge: 'Dès' },
  ]},
  animaux: { label: 'Assurance Animaux', prices: [
    { name: 'Accident', price: '7€', badge: 'Dès' },
    { name: 'Confort', price: '19€', badge: 'Dès' },
    { name: 'Intégrale', price: '34€', badge: 'Dès' },
  ]},
  vie: { label: 'Assurance Vie', prices: [
    { name: 'Essentielle', price: '20€', badge: 'Dès' },
    { name: 'Confort', price: '45€', badge: 'Dès' },
    { name: 'Premium', price: '80€', badge: 'Dès' },
  ]},
  prevoyance: { label: 'Prévoyance', prices: [
    { name: 'Essentielle', price: '12€', badge: 'Dès' },
    { name: 'Confort', price: '25€', badge: 'Dès' },
    { name: 'Intégrale', price: '42€', badge: 'Dès' },
  ]},
  rc_pro: { label: 'RC Pro', prices: [
    { name: 'Basique', price: '15€', badge: 'Dès' },
    { name: 'Standard', price: '29€', badge: 'Dès' },
    { name: 'Premium', price: '49€', badge: 'Dès' },
  ]},
  mrp: { label: 'Multirisque Pro', prices: [
    { name: 'Essentielle', price: '25€', badge: 'Dès' },
    { name: 'Confort', price: '45€', badge: 'Dès' },
    { name: 'Premium', price: '75€', badge: 'Dès' },
  ]},
  gli: { label: 'GLI', prices: [
    { name: 'Basique', price: '2,5%', badge: 'Dès' },
    { name: 'Standard', price: '3%', badge: 'Dès' },
    { name: 'Premium', price: '3,5%', badge: 'Dès' },
  ]},
  pno: { label: 'PNO', prices: [
    { name: 'Essentielle', price: '6€', badge: 'Dès' },
    { name: 'Confort', price: '11€', badge: 'Dès' },
    { name: 'Premium', price: '18€', badge: 'Dès' },
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
          Un expert vous rappelle sous 30 minutes avec les meilleures offres personnalisées.
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
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider text-center">
          Tarifs trouvés pour votre profil
        </p>
        <div className="grid grid-cols-3 gap-2">
          {prices.map((p, i) => (
            <motion.div
              key={p.name}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1, duration: 0.3 }}
              className={`relative rounded-xl border-2 p-3 text-center transition-all ${
                i === 0
                  ? 'border-primary bg-primary/5 shadow-[var(--shadow-card)]'
                  : 'border-border/40 bg-background/50'
              }`}
            >
              {i === 0 && (
                <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground text-[10px] font-bold px-2 py-0.5 rounded-full whitespace-nowrap">
                  Meilleur prix
                </span>
              )}
              <span className="text-[10px] text-muted-foreground font-medium uppercase">{p.badge}</span>
              <div className="text-xl md:text-2xl font-extrabold text-accent mt-0.5">{p.price}</div>
              <span className="text-[11px] text-muted-foreground">/mois</span>
              <p className="text-xs font-medium text-foreground mt-1">{p.name}</p>
            </motion.div>
          ))}
        </div>
        <p className="text-[11px] text-muted-foreground text-center italic">
          * Tarifs indicatifs. Recevez votre devis exact en 30 min.
        </p>
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
        className="w-full rounded-full font-bold text-base h-13 bg-secondary hover:bg-secondary/90 text-secondary-foreground active:scale-[0.97] transition-transform"
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

export default MultiStepQuoteForm;
