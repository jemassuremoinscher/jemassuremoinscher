import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ShieldCheck } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import InsuranceComparison from "@/components/InsuranceComparison";
import { generateInsurerOffers, InsurerConfig } from "@/utils/insurerData";
import SEO from "@/components/SEO";

const formSchema = z.object({
  name: z.string().min(2, "Le nom doit contenir au moins 2 caractères").max(100),
  email: z.string().email("Email invalide").max(255),
  phone: z.string().min(10, "Numéro de téléphone invalide").max(15),
  entreprise: z.string().min(1, "Champ requis"),
  secteur: z.string().min(1, "Champ requis"),
  effectif: z.string().min(1, "Champ requis"),
  chiffreAffaires: z.string().min(1, "Champ requis"),
  sinistresAnnee: z.string().min(1, "Champ requis"),
  codePostal: z.string().length(5, "Code postal invalide"),
});

const rcProInsurers: InsurerConfig[] = [
  {
    name: "AXA",
    priceMultiplier: 1.00,
    coverage: ["Dommages corporels", "Dommages matériels", "Dommages immatériels", "Protection juridique"],
  },
  {
    name: "Allianz",
    priceMultiplier: 1.05,
    coverage: ["RC après livraison", "Atteinte à l'environnement", "Défense pénale", "Assistance juridique"],
    discount: "-12% en ligne"
  },
  {
    name: "MMA",
    priceMultiplier: 0.95,
    coverage: ["Garantie décennale incluse", "Faute inexcusable", "Sous-traitants", "Extension géographique"],
    discount: "-15% nouveau client"
  },
  {
    name: "Generali",
    priceMultiplier: 1.08,
    coverage: ["Responsabilité civile générale", "Produits livrés", "Mise en cause personnelle", "Recours clients"],
  },
  {
    name: "Groupama",
    priceMultiplier: 1.02,
    coverage: ["RC exploitation", "RC après travaux", "Protection locaux", "Défense et recours"],
  },
  {
    name: "MAIF",
    priceMultiplier: 0.98,
    coverage: ["Dommages tous accidents", "Garantie financière", "Assistance sinistre", "Experts dédiés"],
  },
];

const AssuranceRCPro = () => {
  const { toast } = useToast();
  const [insurerOffers, setInsurerOffers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      entreprise: "",
      secteur: "",
      effectif: "",
      chiffreAffaires: "",
      sinistresAnnee: "",
      codePostal: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    try {
      const basePrice = 45;
      let price = basePrice;

      const effectif = parseInt(values.effectif);
      if (effectif > 50) price += 60;
      else if (effectif > 20) price += 35;
      else if (effectif > 10) price += 20;

      if (values.secteur === "batiment" || values.secteur === "conseil") price += 40;
      if (values.secteur === "sante") price += 50;

      const ca = parseInt(values.chiffreAffaires);
      if (ca > 500000) price += 50;
      else if (ca > 200000) price += 25;

      const sinistres = parseInt(values.sinistresAnnee);
      if (sinistres > 0) price += sinistres * 15;

      const { error } = await supabase.functions.invoke("send-quote-email", {
        body: {
          name: values.name,
          email: values.email,
          phone: values.phone,
          type: "RC Professionnelle",
          details: {
            entreprise: values.entreprise,
            secteur: values.secteur,
            effectif: values.effectif,
            chiffreAffaires: values.chiffreAffaires,
            sinistresAnnee: values.sinistresAnnee,
            codePostal: values.codePostal,
          },
          estimatedPrice: price,
        },
      });

      if (error) throw error;

      const offers = generateInsurerOffers(price, rcProInsurers);
      setInsurerOffers(offers);
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
      <SEO 
        title="RC Pro - Responsabilité Civile Professionnelle | Comparateur"
        description="Comparez les assurances RC Pro. Protégez votre activité professionnelle contre les dommages causés à vos clients. Devis gratuit et rapide pour tous secteurs."
        keywords="RC Pro, responsabilité civile professionnelle, assurance RC, protection professionnelle, garantie décennale"
        canonical="https://votre-domaine.fr/assurance-rc-pro"
      />
      <Header />
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-3 rounded-full bg-primary/10">
              <ShieldCheck className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-4xl font-bold text-foreground">RC Professionnelle</h1>
          </div>

          <Card className="p-8">
            {insurerOffers.length > 0 ? (
              <InsuranceComparison insurers={insurerOffers} onNewQuote={() => setInsurerOffers([])} />
            ) : (
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nom du dirigeant</FormLabel>
                          <FormControl>
                            <Input placeholder="Votre nom" {...field} />
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
                            <Input type="email" placeholder="votre@email.com" {...field} />
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
                            <Input placeholder="06 12 34 56 78" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="entreprise"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nom de l'entreprise</FormLabel>
                          <FormControl>
                            <Input placeholder="Votre entreprise" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="secteur"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Secteur d'activité</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Choisissez" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="commerce">Commerce</SelectItem>
                              <SelectItem value="services">Services</SelectItem>
                              <SelectItem value="batiment">Bâtiment</SelectItem>
                              <SelectItem value="conseil">Conseil</SelectItem>
                              <SelectItem value="sante">Santé</SelectItem>
                              <SelectItem value="artisanat">Artisanat</SelectItem>
                              <SelectItem value="informatique">Informatique</SelectItem>
                              <SelectItem value="autre">Autre</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="effectif"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nombre de salariés</FormLabel>
                          <FormControl>
                            <Input type="number" placeholder="0" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="chiffreAffaires"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Chiffre d'affaires annuel (€)</FormLabel>
                          <FormControl>
                            <Input type="number" placeholder="100000" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="sinistresAnnee"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Sinistres sur 3 ans</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Choisissez" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="0">Aucun</SelectItem>
                              <SelectItem value="1">1 sinistre</SelectItem>
                              <SelectItem value="2">2 sinistres</SelectItem>
                              <SelectItem value="3">3 sinistres ou plus</SelectItem>
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
                            <Input placeholder="75001" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? "Envoi en cours..." : "Obtenir mon devis gratuit"}
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

export default AssuranceRCPro;
