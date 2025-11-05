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

const subscriptionSchema = z.object({
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
  acceptTerms: z.boolean().refine((val) => val === true, {
    message: "Vous devez accepter les conditions",
  }),
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
  };
}

export const SubscriptionModal = ({ open, onOpenChange, offerDetails }: SubscriptionModalProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const { trackEvent, trackConversion } = useAnalytics();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setValue,
  } = useForm<SubscriptionFormData>({
    resolver: zodResolver(subscriptionSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      acceptTerms: false,
    },
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

      // Envoyer l'email de confirmation
      const { error: emailError } = await supabase.functions.invoke("send-quote-email", {
        body: {
          name: data.fullName,
          email: data.email,
          phone: data.phone,
          type: offerDetails.insuranceType,
          details: {
            insurer: offerDetails.insurer,
            price: offerDetails.price,
            coverage: offerDetails.coverage,
            source: "comparateur",
          },
          estimatedPrice: offerDetails.price,
        },
      });

      if (emailError) {
        console.error("Error sending email:", emailError);
      }

      setIsSuccess(true);
      toast.success("Demande envoyée avec succès !");

      // Track conversion
      trackConversion("quote_request", offerDetails.price);
      trackEvent("quote_request", {
        category: "conversion",
        insurer: offerDetails.insurer,
        price: offerDetails.price,
        insurance_type: offerDetails.insuranceType,
      });

      // Reset form after 3 seconds
      setTimeout(() => {
        setIsSuccess(false);
        reset();
        onOpenChange(false);
      }, 3000);
    } catch (error) {
      console.error("Error submitting subscription:", error);
      toast.error("Une erreur est survenue. Veuillez réessayer.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      reset();
      setIsSuccess(false);
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl">
            <Sparkles className="h-6 w-6 text-primary" />
            Souscrire à cette offre
          </DialogTitle>
          <DialogDescription>
            <div className="mt-4 p-4 bg-primary/10 rounded-lg">
              <p className="font-semibold text-foreground">{offerDetails.insurer}</p>
              <p className="text-sm">
                {offerDetails.coverage} • <span className="text-2xl font-bold text-primary">{offerDetails.price}€</span>/mois
              </p>
            </div>
          </DialogDescription>
        </DialogHeader>

        {isSuccess ? (
          <div className="py-8 text-center">
            <CheckCircle2 className="h-16 w-16 text-green-600 mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-2">Demande envoyée !</h3>
            <p className="text-muted-foreground">
              Nous vous contactons dans les 24h pour finaliser votre souscription.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="fullName">Nom complet *</Label>
              <Input
                id="fullName"
                placeholder="Jean Dupont"
                {...register("fullName")}
                disabled={isSubmitting}
              />
              {errors.fullName && (
                <p className="text-sm text-destructive">{errors.fullName.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                placeholder="jean.dupont@email.com"
                {...register("email")}
                disabled={isSubmitting}
              />
              {errors.email && (
                <p className="text-sm text-destructive">{errors.email.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Téléphone *</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="06 12 34 56 78"
                {...register("phone")}
                disabled={isSubmitting}
              />
              {errors.phone && (
                <p className="text-sm text-destructive">{errors.phone.message}</p>
              )}
            </div>

            <div className="flex items-start space-x-3 pt-4">
              <Checkbox
                id="acceptTerms"
                checked={acceptTerms}
                onCheckedChange={(checked) => setValue("acceptTerms", checked as boolean)}
                disabled={isSubmitting}
              />
              <div className="space-y-1 leading-none">
                <Label
                  htmlFor="acceptTerms"
                  className="text-sm font-normal cursor-pointer"
                >
                  J'accepte les conditions générales et la politique de confidentialité *
                </Label>
                {errors.acceptTerms && (
                  <p className="text-sm text-destructive">{errors.acceptTerms.message}</p>
                )}
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={isSubmitting}
                className="flex-1"
              >
                Annuler
              </Button>
              <Button type="submit" disabled={isSubmitting} className="flex-1">
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Envoi...
                  </>
                ) : (
                  "Confirmer"
                )}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
};
