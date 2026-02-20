import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2, CheckCircle2, Sparkles } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useAnalytics } from "@/hooks/useAnalytics";
import { useLanguage } from "@/contexts/LanguageContext";

const subscriptionSchema = z.object({
  fullName: z.string().trim().min(2, "Le nom doit contenir au moins 2 caractères").max(100, "Le nom ne peut pas dépasser 100 caractères"),
  email: z.string().trim().email("Email invalide").max(255, "L'email ne peut pas dépasser 255 caractères"),
  phone: z.string().trim().regex(/^(?:(?:\+|00)33|0)\s*[1-9](?:[\s.-]*\d{2}){4}$/, "Numéro de téléphone invalide"),
  acceptTerms: z.boolean().refine((val) => val === true, { message: "Vous devez accepter les conditions" }),
});

type SubscriptionFormData = z.infer<typeof subscriptionSchema>;

interface SubscriptionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  offerDetails: {
    insurer: string;
    price: number;
    coverage: string;
    insuranceType: string;
    formData?: Record<string, any>;
  };
}

export const SubscriptionModal = ({ open, onOpenChange, offerDetails }: SubscriptionModalProps) => {
  const { t } = useLanguage();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const { trackEvent, trackConversion } = useAnalytics();

  const {
    register, handleSubmit, formState: { errors }, reset, watch, setValue,
  } = useForm<SubscriptionFormData>({
    resolver: zodResolver(subscriptionSchema),
    defaultValues: { fullName: "", email: "", phone: "", acceptTerms: false },
  });

  const acceptTerms = watch("acceptTerms");

  const onSubmit = async (data: SubscriptionFormData) => {
    setIsSubmitting(true);
    try {
      const { error } = await supabase.from("insurance_quotes").insert({
        insurance_type: offerDetails.insuranceType,
        full_name: data.fullName,
        email: data.email,
        phone: data.phone,
        quote_data: {
          insurer: offerDetails.insurer,
          price: offerDetails.price,
          coverage: offerDetails.coverage,
          source: "comparateur",
        },
        status: "pending",
      });
      if (error) throw error;

      const { error: emailError } = await supabase.functions.invoke("send-quote-email", {
        body: {
          name: data.fullName, email: data.email, phone: data.phone,
          type: offerDetails.insuranceType,
          details: { insurer: offerDetails.insurer, price: offerDetails.price, coverage: offerDetails.coverage, source: "comparateur" },
          estimatedPrice: offerDetails.price,
        },
      });
      if (emailError) console.error("Error sending email:", emailError);

      setIsSuccess(true);
      toast.success(t('subModal.toastSuccess'));
      trackConversion("quote_request", offerDetails.price);
      trackEvent("quote_request", {
        category: "conversion", insurer: offerDetails.insurer,
        price: offerDetails.price, insurance_type: offerDetails.insuranceType,
      });

      setTimeout(() => { setIsSuccess(false); reset(); onOpenChange(false); }, 3000);
    } catch (error) {
      console.error("Error submitting subscription:", error);
      toast.error(t('subModal.toastError'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) { reset(); setIsSuccess(false); onOpenChange(false); }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[450px] max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Sparkles className="h-5 w-5 text-primary" />
            {t('subModal.title')}
          </DialogTitle>
          <DialogDescription>
            <div className="mt-3 space-y-2">
              <div className="p-3 bg-primary/10 rounded-lg">
                <p className="font-semibold text-foreground text-base">{offerDetails.insurer}</p>
                <p className="text-xs">
                  {offerDetails.coverage} • <span className="text-lg font-bold text-primary">{offerDetails.price}€</span>/{t('common.perMonth').split(' ').pop()}
                </p>
              </div>
            </div>
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto px-1">
          {isSuccess ? (
            <div className="py-6 text-center">
              <CheckCircle2 className="h-12 w-12 text-green-600 mx-auto mb-3" />
              <h3 className="text-lg font-bold mb-2">{t('subModal.successTitle')}</h3>
              <p className="text-sm text-muted-foreground">{t('subModal.successText')}</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-3 pb-2">
              <div className="space-y-1.5">
                <Label htmlFor="fullName" className="text-sm">{t('subModal.fullName')}</Label>
                <Input id="fullName" placeholder="Jean Dupont" {...register("fullName")} disabled={isSubmitting} className="h-9" />
                {errors.fullName && <p className="text-xs text-destructive">{errors.fullName.message}</p>}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="email" className="text-sm">{t('subModal.email')}</Label>
                <Input id="email" type="email" placeholder="jean.dupont@email.com" {...register("email")} disabled={isSubmitting} className="h-9" />
                {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="phone" className="text-sm">{t('subModal.phone')}</Label>
                <Input id="phone" type="tel" placeholder="06 12 34 56 78" {...register("phone")} disabled={isSubmitting} className="h-9" />
                {errors.phone && <p className="text-xs text-destructive">{errors.phone.message}</p>}
              </div>

              <div className="flex items-start space-x-2 pt-2">
                <Checkbox id="acceptTerms" checked={acceptTerms} onCheckedChange={(checked) => setValue("acceptTerms", checked as boolean)} disabled={isSubmitting} />
                <div className="space-y-1 leading-none">
                  <Label htmlFor="acceptTerms" className="text-xs font-normal cursor-pointer">
                    {t('subModal.acceptTerms')}
                  </Label>
                  {errors.acceptTerms && <p className="text-xs text-destructive">{errors.acceptTerms.message}</p>}
                </div>
              </div>

              <div className="flex gap-2 pt-3">
                <Button type="button" variant="outline" onClick={handleClose} disabled={isSubmitting} className="flex-1 h-9">
                  {t('common.cancel')}
                </Button>
                <Button type="submit" disabled={isSubmitting} className="flex-1 h-9">
                  {isSubmitting ? (
                    <><Loader2 className="mr-2 h-3 w-3 animate-spin" />{t('common.sending')}</>
                  ) : (
                    t('common.confirm')
                  )}
                </Button>
              </div>
            </form>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
