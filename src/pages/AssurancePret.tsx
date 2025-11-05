import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Shield } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

const formSchema = z.object({
  name: z.string().min(2, "Le nom doit contenir au moins 2 caractères").max(100),
  email: z.string().email("Email invalide").max(255),
  phone: z.string().min(10, "Numéro de téléphone invalide").max(15),
  montantPret: z.string().min(1, "Champ requis"),
  dureePret: z.string().min(1, "Champ requis"),
  age: z.string().min(1, "Champ requis"),
  statut: z.string().min(1, "Champ requis"),
  fumeur: z.string().min(1, "Champ requis"),
  codePostal: z.string().length(5, "Code postal invalide"),
});

const AssurancePret = () => {
  const { toast } = useToast();
  const [estimatedPrice, setEstimatedPrice] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      montantPret: "",
      dureePret: "",
      age: "",
      statut: "",
      fumeur: "",
      codePostal: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    try {
      const montant = parseInt(values.montantPret);
      const duree = parseInt(values.dureePret);
      const ageValue = parseInt(values.age);
      let price = (montant / 1000) * 0.3;
      
      if (duree > 20) price += 5;
      if (ageValue > 45) price += 10;
      if (values.fumeur === "oui") price += 8;
      if (values.statut === "profession-risque") price += 12;
      
      const randomVariation = Math.floor(Math.random() * 10) - 5;
      price += randomVariation;
      price = Math.round(price);

      const { data, error } = await supabase.functions.invoke("send-quote-email", {
        body: {
          name: values.name,
          email: values.email,
          phone: values.phone,
          type: "Assurance Prêt Immobilier",
          details: {
            montantPret: values.montantPret,
            dureePret: values.dureePret,
            age: values.age,
            statut: values.statut,
            fumeur: values.fumeur,
            codePostal: values.codePostal,
          },
          estimatedPrice: price,
        },
      });

      if (error) throw error;

      setEstimatedPrice(price);
      toast({
        title: "Demande envoyée !",
        description: "Vous allez recevoir votre devis par email.",
      });
    } catch (error: any) {
      console.error("Error:", error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue. Veuillez réessayer.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      <Header />
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-3 rounded-full bg-primary/10">
              <Shield className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-4xl font-bold text-foreground">Assurance Prêt Immobilier</h1>
          </div>

          <Card className="p-8">
            <h2 className="text-2xl font-bold mb-6 text-card-foreground">Obtenez votre devis en 2 minutes</h2>
            
            {estimatedPrice ? (
              <div className="text-center py-8">
                <h3 className="text-3xl font-bold mb-4 text-primary">Votre tarif estimé</h3>
                <p className="text-5xl font-bold text-accent mb-6">{estimatedPrice}€/mois</p>
                <p className="text-muted-foreground mb-4">Un conseiller vous contactera pour finaliser votre devis.</p>
                <Button onClick={() => setEstimatedPrice(null)}>Faire une nouvelle demande</Button>
              </div>
            ) : (
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nom complet</FormLabel>
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
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input type="email" placeholder="jean@exemple.fr" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Téléphone</FormLabel>
                        <FormControl>
                          <Input placeholder="0612345678" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="montantPret"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Montant du prêt (€)</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="200000" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="dureePret"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Durée du prêt</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Sélectionner" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="10">10 ans</SelectItem>
                            <SelectItem value="15">15 ans</SelectItem>
                            <SelectItem value="20">20 ans</SelectItem>
                            <SelectItem value="25">25 ans</SelectItem>
                            <SelectItem value="30">30 ans</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="age"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Votre âge</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="35" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="statut"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Statut professionnel</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Sélectionner" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="salarie">Salarié</SelectItem>
                            <SelectItem value="fonctionnaire">Fonctionnaire</SelectItem>
                            <SelectItem value="independant">Indépendant</SelectItem>
                            <SelectItem value="profession-risque">Profession à risque</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="fumeur"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Êtes-vous fumeur ?</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Sélectionner" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="non">Non</SelectItem>
                            <SelectItem value="oui">Oui</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="codePostal"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Code postal</FormLabel>
                        <FormControl>
                          <Input placeholder="75001" maxLength={5} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
                    {isLoading ? "Envoi en cours..." : "Comparer les offres"}
                  </Button>
                </form>
              </Form>
            )}
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AssurancePret;
