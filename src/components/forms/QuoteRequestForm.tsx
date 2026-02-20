import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { FileText, Loader2, CheckCircle2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useAnalytics } from "@/hooks/useAnalytics";
import { useHoneypot } from "@/hooks/useHoneypot";
import { trackGoogleAdsConversionWithParams } from "@/utils/googleAdsTracking";
import { useLanguage } from "@/contexts/LanguageContext";

const quoteFormSchema = z.object({
  insuranceType: z.string().min(1, "Veuillez sélectionner un type d'assurance"),
  fullName: z.string()
    .trim()
    .min(2, "Le nom doit contenir au moins 2 caractères")
    .max(100, "Le nom ne peut pas dépasser 100 caractères"),
  email: z.string()
    .trim()
    .email("Email invalide")
    .max(255, "L'email ne peut pas dépasser 255 caractères"),
  phone: z.string()
    .trim()
    .regex(/^(?:(?:\+|00)33|0)\s*[1-9](?:[\s.-]*\d{2}){4}$/, "Numéro de téléphone invalide"),
  postalCode: z.string()
    .trim()
    .regex(/^\d{5}$/, "Code postal invalide (5 chiffres)"),
  currentInsurer: z.string().max(100).optional(),
  acceptTerms: z.boolean().refine((val) => val === true, {
    message: "Vous devez accepter les conditions",
  }),
});

type QuoteFormData = z.infer<typeof quoteFormSchema>;

export const QuoteRequestForm = () => {
  const { t } = useLanguage();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const { trackEvent, trackConversion } = useAnalytics();
  const { honeypotRef, isBot } = useHoneypot();

  const form = useForm<QuoteFormData>({
    resolver: zodResolver(quoteFormSchema),
    defaultValues: {
      insuranceType: "",
      fullName: "",
      email: "",
      phone: "",
      postalCode: "",
      currentInsurer: "",
      acceptTerms: false,
    },
  });

  const onSubmit = async (data: QuoteFormData) => {
    if (isBot()) { setIsSuccess(true); return; }
    setIsSubmitting(true);

    try {
      const { data: insertedQuote, error } = await supabase.from("insurance_quotes").insert({
        insurance_type: data.insuranceType,
        full_name: data.fullName,
        email: data.email,
        phone: data.phone,
        quote_data: {
          postalCode: data.postalCode,
          currentInsurer: data.currentInsurer || null,
        },
        status: "pending",
      }).select().single();

      if (error) throw error;

      const { error: emailError } = await supabase.functions.invoke('send-quote-email', {
        body: {
          name: data.fullName,
          email: data.email,
          phone: data.phone,
          type: data.insuranceType,
          details: {
            postalCode: data.postalCode,
            currentInsurer: data.currentInsurer || 'Non renseigné',
          },
          estimatedPrice: 35,
        },
      });

      if (emailError) {
        console.error("Error sending email:", emailError);
      }

      setIsSuccess(true);
      toast.success(t('quoteForm.toastSuccess'), {
        description: t('quoteForm.toastSuccessDesc'),
      });
      
      trackConversion('quote_request', 100);
      trackEvent('quote_request', {
        category: 'lead_generation',
        insurance_type: data.insuranceType,
        value: 100,
      });
      
      const quoteData = insertedQuote?.quote_data as any;
      trackGoogleAdsConversionWithParams('quote_request', {
        value: 100,
        insuranceType: data.insuranceType,
        postalCode: data.postalCode,
        leadId: insertedQuote?.id,
        utmSource: quoteData?.utm_data?.source,
        utmMedium: quoteData?.utm_data?.medium,
        utmCampaign: quoteData?.utm_data?.campaign,
        utmContent: quoteData?.utm_data?.content,
        utmTerm: quoteData?.utm_data?.term,
      });
      
      form.reset();
    } catch (error) {
      console.error("Error submitting quote:", error);
      toast.error(t('quoteForm.toastError'), {
        description: t('quoteForm.toastErrorDesc'),
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <Card className="p-12 text-center max-w-2xl mx-auto">
        <CheckCircle2 className="h-16 w-16 text-primary mx-auto mb-6" />
        <h3 className="text-2xl font-bold mb-4">{t('quoteForm.successTitle')}</h3>
        <p className="text-muted-foreground mb-6">
          {t('quoteForm.successText')}
        </p>
        <Button onClick={() => setIsSuccess(false)} variant="outline">
          {t('quoteForm.newRequest')}
        </Button>
      </Card>
    );
  }

  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4 max-w-3xl">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 mb-4">
            <FileText className="h-8 w-8 text-primary" />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            {t('quoteForm.title')} <span className="text-primary">{t('quoteForm.titleHighlight')}</span>
          </h2>
          <p className="text-muted-foreground text-lg">
            {t('quoteForm.subtitle')}
          </p>
        </div>

        <Card className="p-8">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <input ref={honeypotRef} type="text" name="website" autoComplete="off" tabIndex={-1} aria-hidden="true" style={{ position: 'absolute', left: '-9999px', opacity: 0 }} />
              <FormField
                control={form.control}
                name="insuranceType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('quoteForm.insuranceType')}</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder={t('quoteForm.selectType')} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="auto">{t('quoteForm.autoIns')}</SelectItem>
                        <SelectItem value="moto">{t('quoteForm.motoIns')}</SelectItem>
                        <SelectItem value="habitation">{t('quoteForm.homeIns')}</SelectItem>
                        <SelectItem value="sante">{t('quoteForm.healthIns')}</SelectItem>
                        <SelectItem value="pret">{t('quoteForm.loanIns')}</SelectItem>
                        <SelectItem value="animaux">{t('quoteForm.petIns')}</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="fullName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('quoteForm.fullName')}</FormLabel>
                      <FormControl>
                        <Input placeholder="Jean Dupont" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('quoteForm.email')}</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="jean.dupont@email.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('quoteForm.phone')}</FormLabel>
                      <FormControl>
                        <Input type="tel" placeholder="06 12 34 56 78" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="postalCode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('quoteForm.postalCode')}</FormLabel>
                      <FormControl>
                        <Input placeholder="75001" {...field} maxLength={5} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="currentInsurer"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('quoteForm.currentInsurer')}</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: AXA, Allianz..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="acceptTerms"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>
                        {t('quoteForm.acceptTerms')}
                      </FormLabel>
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full" size="lg" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    {t('quoteForm.submitting')}
                  </>
                ) : (
                  <>
                    <FileText className="mr-2 h-5 w-5" />
                    {t('quoteForm.submit')}
                  </>
                )}
              </Button>

              <p className="text-xs text-muted-foreground text-center">
                {t('quoteForm.required')}
              </p>
            </form>
          </Form>
        </Card>
      </div>
    </section>
  );
};
