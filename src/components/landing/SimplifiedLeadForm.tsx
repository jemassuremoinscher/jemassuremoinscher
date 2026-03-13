import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { CheckCircle2, Loader2, Phone, Sparkles } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useAnalytics } from '@/hooks/useAnalytics';
import { useHoneypot } from '@/hooks/useHoneypot';
import { useLanguage } from '@/contexts/LanguageContext';
import { normalizeInsuranceType } from '@/utils/insuranceTypeNormalizer';

const simplifiedLeadSchema = z.object({
  fullName: z.string().trim().min(2, 'Nom requis').max(100),
  email: z.string().trim().email('Email invalide').max(255),
  phone: z.string().trim().regex(/^(?:(?:\+|00)33|0)\s*[1-9](?:[\s.-]*\d{2}){4}$/, 'Téléphone invalide'),
});

type SimplifiedLeadData = z.infer<typeof simplifiedLeadSchema>;

interface SimplifiedLeadFormProps {
  insuranceType: string;
  insuranceLabel: string;
}

export const SimplifiedLeadForm = ({ insuranceType, insuranceLabel }: SimplifiedLeadFormProps) => {
  const { t } = useLanguage();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const { trackEvent, trackConversion } = useAnalytics();
  const { honeypotRef, isBot } = useHoneypot();

  const form = useForm<SimplifiedLeadData>({
    resolver: zodResolver(simplifiedLeadSchema),
    defaultValues: { fullName: '', email: '', phone: '' },
  });

  const onSubmit = async (data: SimplifiedLeadData) => {
    if (isBot()) { setIsSuccess(true); return; }
    setIsSubmitting(true);
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const utmData = { source: urlParams.get('utm_source') || 'direct', medium: urlParams.get('utm_medium') || 'organic', campaign: urlParams.get('utm_campaign') || 'none', term: urlParams.get('utm_term') || null, content: urlParams.get('utm_content') || null };
      const { error } = await supabase.from('insurance_quotes').insert({ insurance_type: normalizeInsuranceType(insuranceType), full_name: data.fullName, email: data.email, phone: data.phone, quote_data: { source: `landing_${insuranceType}`, utm_data: utmData }, status: 'pending' });
      if (error) throw error;
      const { error: emailError } = await supabase.functions.invoke('send-quote-email', { body: { name: data.fullName, email: data.email, phone: data.phone, type: insuranceType, details: { source: `landing_${insuranceType}`, utm: utmData }, estimatedPrice: 35 } });
      if (emailError) console.error("Error sending email:", emailError);
      trackConversion(`landing_${insuranceType}`, 200);
      trackEvent('quote_request', { category: 'landing_page', label: `landing_${insuranceType}`, insurance_type: insuranceType, value: 200 });
      setIsSuccess(true);
      toast.success(t('leadForm.successTitle'));
    } catch (error) {
      console.error('Error submitting lead:', error);
      toast.error(t('insPage.toast.error'));
    } finally { setIsSubmitting(false); }
  };

  if (isSuccess) {
    return (
      <Card className="p-8 md:p-12 text-center animate-scale-in shadow-2xl border-2 border-primary/20">
        <div className="w-20 h-20 rounded-full bg-green-100 dark:bg-green-900/20 mx-auto mb-6 flex items-center justify-center">
          <CheckCircle2 className="h-10 w-10 text-green-600" />
        </div>
        <h3 className="text-3xl md:text-4xl font-bold mb-4">{t('leadForm.successTitle')}</h3>
        <p className="text-lg text-muted-foreground mb-6">
          {t('leadForm.successDesc')} <span className="font-bold text-primary">{t('leadForm.successTime')}</span> {t('leadForm.successEnd')}
        </p>
        <div className="bg-accent/10 border border-accent/20 rounded-lg p-6 space-y-3">
          <p className="font-semibold">{t('leadForm.meanwhile')}</p>
          <ul className="text-left space-y-2 text-sm">
            <li className="flex items-start gap-2"><CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" /><span>{t('leadForm.comparing')} <strong>{t('leadForm.insurers')}</strong></span></li>
            <li className="flex items-start gap-2"><CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" /><span>{t('leadForm.preparing')} <strong>{t('leadForm.personalQuote')}</strong></span></li>
            <li className="flex items-start gap-2"><CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" /><span>{t('leadForm.checkPhoneEmail')} <strong>{t('leadForm.phoneAndEmail')}</strong></span></li>
          </ul>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6 md:p-8 shadow-2xl border-2 border-primary/20 animate-scale-in">
      <div className="text-center mb-6">
        <div className="inline-flex items-center gap-2 bg-accent px-4 py-2 rounded-full mb-4">
          <Phone className="h-4 w-4 text-accent-foreground" />
          <span className="text-sm font-semibold text-accent-foreground">{t('leadForm.callbackGuarantee')}</span>
        </div>
        <h2 className="text-2xl md:text-3xl font-bold mb-2">{t('leadForm.getQuote')} {insuranceLabel}</h2>
        <p className="text-sm text-muted-foreground"><Sparkles className="inline h-4 w-4 mr-1" />{t('leadForm.formSpeed')}</p>
      </div>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <input ref={honeypotRef} type="text" name="website" autoComplete="off" tabIndex={-1} aria-hidden="true" style={{ position: 'absolute', left: '-9999px', opacity: 0 }} />
        <div>
          <Label htmlFor="fullName" className="text-base font-semibold mb-2 block">{t('leadForm.fullName')}</Label>
          <Input {...form.register('fullName')} id="fullName" placeholder="Jean Dupont" className="h-12 text-base" disabled={isSubmitting} />
          {form.formState.errors.fullName && <p className="text-sm text-red-600 mt-1">{form.formState.errors.fullName.message}</p>}
        </div>
        <div>
          <Label htmlFor="email" className="text-base font-semibold mb-2 block">{t('leadForm.email')}</Label>
          <Input {...form.register('email')} id="email" type="email" placeholder="jean.dupont@email.com" className="h-12 text-base" disabled={isSubmitting} />
          {form.formState.errors.email && <p className="text-sm text-red-600 mt-1">{form.formState.errors.email.message}</p>}
        </div>
        <div>
          <Label htmlFor="phone" className="text-base font-semibold mb-2 block">{t('leadForm.phone')}</Label>
          <Input {...form.register('phone')} id="phone" type="tel" placeholder="06 12 34 56 78" className="h-12 text-base" disabled={isSubmitting} />
          {form.formState.errors.phone && <p className="text-sm text-red-600 mt-1">{form.formState.errors.phone.message}</p>}
        </div>
        <Button type="submit" size="lg" className="w-full h-14 text-lg font-bold" disabled={isSubmitting} aria-label={`Recevoir mon devis ${insuranceLabel} gratuit`}>
          {isSubmitting ? (<><Loader2 className="mr-2 h-5 w-5 animate-spin" />{t('leadForm.sending')}</>) : t('leadForm.submit')}
        </Button>
        <p className="text-xs text-center text-muted-foreground">{t('leadForm.disclaimer')}</p>
      </form>
    </Card>
  );
};