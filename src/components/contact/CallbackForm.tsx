import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Phone, Loader2, CheckCircle2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useAnalytics } from "@/hooks/useAnalytics";
import { useHoneypot } from "@/hooks/useHoneypot";
import { trackGoogleAdsConversion } from "@/utils/googleAdsTracking";
import { useLanguage } from "@/contexts/LanguageContext";

const callbackSchema = z.object({
  fullName: z.string().trim().min(2, "Le nom doit contenir au moins 2 caractères").max(100),
  email: z.string().trim().email("Email invalide").max(255),
  phone: z.string().trim().regex(/^(?:(?:\+|00)33|0)\s*[1-9](?:[\s.-]*\d{2}){4}$/, "Numéro de téléphone invalide"),
  preferredTime: z.string().min(1, "Veuillez sélectionner un créneau"),
  message: z.string().max(500).optional(),
});

type CallbackFormData = z.infer<typeof callbackSchema>;

export const CallbackForm = () => {
  const { t } = useLanguage();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { trackEvent, trackConversion } = useAnalytics();
  const { honeypotRef, isBot } = useHoneypot();
  const [isSuccess, setIsSuccess] = useState(false);

  const form = useForm<CallbackFormData>({
    resolver: zodResolver(callbackSchema),
    defaultValues: { fullName: "", email: "", phone: "", preferredTime: "", message: "" },
  });

  const onSubmit = async (data: CallbackFormData) => {
    if (isBot()) { setIsSuccess(true); return; }
    setIsSubmitting(true);
    try {
      const { error } = await supabase.from("contact_callbacks").insert({
        full_name: data.fullName, email: data.email, phone: data.phone,
        preferred_time: data.preferredTime, message: data.message || null, status: "pending",
      });
      if (error) throw error;
      await supabase.functions.invoke('send-quote-email', {
        body: { name: data.fullName, email: data.email, phone: data.phone, type: 'Demande de rappel',
          details: { source: 'callback_form', preferredTime: data.preferredTime, message: data.message || '' }, estimatedPrice: 0 },
      }).catch(err => console.error('Email notification error:', err));
      setIsSuccess(true);
      toast.success(t('callbackForm.successTitle'), { description: t('callbackForm.successDesc') });
      trackConversion('callback_request');
      trackEvent('callback_request', { category: 'lead_generation', label: data.preferredTime });
      trackGoogleAdsConversion('callback_request');
      form.reset();
    } catch (error) {
      console.error("Error submitting callback request:", error);
      toast.error(t('insPage.toast.error'), { description: t('insPage.toast.errorDesc') });
    } finally { setIsSubmitting(false); }
  };

  if (isSuccess) {
    return (
      <Card className="p-12 text-center max-w-2xl mx-auto">
        <CheckCircle2 className="h-16 w-16 text-primary mx-auto mb-6" />
        <h3 className="text-2xl font-bold mb-4">{t('callbackForm.successTitle')}</h3>
        <p className="text-muted-foreground mb-6">{t('callbackForm.successDesc')}</p>
        <Button onClick={() => setIsSuccess(false)} variant="outline">{t('callbackForm.newRequest')}</Button>
      </Card>
    );
  }

  return (
    <section className="py-16 bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto px-4 max-w-3xl">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 mb-4"><Phone className="h-8 w-8 text-primary" /></div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            {t('callbackForm.title')} <span className="text-primary">{t('callbackForm.titleHighlight')}</span>
          </h2>
          <p className="text-muted-foreground text-lg">{t('callbackForm.subtitle')}</p>
        </div>
        <Card className="p-8">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <input ref={honeypotRef} type="text" name="website" autoComplete="off" tabIndex={-1} aria-hidden="true" style={{ position: 'absolute', left: '-9999px', opacity: 0 }} />
              <div className="grid md:grid-cols-2 gap-6">
                <FormField control={form.control} name="fullName" render={({ field }) => (
                  <FormItem><FormLabel>{t('callbackForm.fullName')}</FormLabel><FormControl><Input placeholder="Jean Dupont" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="email" render={({ field }) => (
                  <FormItem><FormLabel>{t('callbackForm.email')}</FormLabel><FormControl><Input type="email" placeholder="jean.dupont@email.com" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                <FormField control={form.control} name="phone" render={({ field }) => (
                  <FormItem><FormLabel>{t('callbackForm.phone')}</FormLabel><FormControl><Input type="tel" placeholder="06 12 34 56 78" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="preferredTime" render={({ field }) => (
                  <FormItem><FormLabel>{t('callbackForm.timeSlot')}</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}><FormControl><SelectTrigger><SelectValue placeholder={t('callbackForm.timeSlotPlaceholder')} /></SelectTrigger></FormControl>
                      <SelectContent>
                        <SelectItem value="morning">{t('callbackForm.morning')}</SelectItem>
                        <SelectItem value="afternoon">{t('callbackForm.afternoon')}</SelectItem>
                        <SelectItem value="evening">{t('callbackForm.evening')}</SelectItem>
                      </SelectContent></Select><FormMessage /></FormItem>
                )} />
              </div>
              <FormField control={form.control} name="message" render={({ field }) => (
                <FormItem><FormLabel>{t('callbackForm.message')}</FormLabel><FormControl>
                  <Textarea placeholder={t('callbackForm.messagePlaceholder')} className="min-h-[100px]" {...field} />
                </FormControl><FormMessage /></FormItem>
              )} />
              <Button type="submit" className="w-full" size="lg" disabled={isSubmitting}>
                {isSubmitting ? (<><Loader2 className="mr-2 h-5 w-5 animate-spin" />{t('callbackForm.sending')}</>) : (<><Phone className="mr-2 h-5 w-5" />{t('callbackForm.submit')}</>)}
              </Button>
              <p className="text-xs text-muted-foreground text-center">{t('callbackForm.required')}</p>
            </form>
          </Form>
        </Card>
      </div>
    </section>
  );
};