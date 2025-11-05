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
import InsuranceComparison from "@/components/InsuranceComparison";
import { generateInsurerOffers, InsurerConfig } from "@/utils/insurerData";
import SEO from "@/components/SEO";

const formSchema = z.object({
  name: z.string().min(2, "Le nom doit contenir au moins 2 caractères").max(100),
  email: z.string().email("Email invalide").max(255),
  phone: z.string().min(10, "Numéro de téléphone invalide").max(15),
  typePrevoyance: z.string().min(1, "Champ requis"),
  situation: z.string().min(1, "Champ requis"),
  age: z.string().min(1, "Champ requis"),
  profession: z.string().min(1, "Champ requis"),
  codePostal: z.string().length(5, "Code postal invalide"),
});

const prevoyanceInsurers: InsurerConfig[] = [
  {
    name: "AXA",
    priceMultiplier: 1.05,
    coverage: ["Capital décès garanti", "Rente conjoint", "Rente éducation"],
  },
  {
    name: "Generali",
    priceMultiplier: 1.02,
    coverage: ["Protection famille", "Capital décès doublé accident", "Rente invalidité"],
    discount: "-10% en ligne"
  },
  {
    name: "Swiss Life",
    priceMultiplier: 1.10,
    coverage: ["Capital décès majoré", "Garantie dépendance incluse", "Assistance psychologique"],
  },
  {
    name: "AG2R La Mondiale",
    priceMultiplier: 0.98,
    coverage: ["Capital décès", "Rente éducation", "Garantie obsèques"],
    discount: "-12% nouveau client"
  },
  {
    name: "Malakoff Humanis",
    priceMultiplier: 1.00,
    coverage: ["Protection complète", "Capital invalidité", "Services d'assistance"],
  },
  {
    name: "MetLife",
    priceMultiplier: 0.95,
    coverage: ["Capital décès modulable", "Garantie ITT", "Frais d'obsèques"],
  },
];

const AssurancePrevoyance = () => {
  const { toast } = useToast();
  const [insurerOffers, setInsurerOffers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      typePrevoyance: "",
      situation: "",
      age: "",
      profession: "",
      codePostal: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    try {
      const basePrice = 25;
      let price = basePrice;

      const age = parseInt(values.age);
      if (age > 50) price += 15;
      else if (age > 40) price += 10;
      else if (age > 30) price += 5;

      if (values.typePrevoyance === "deces") price += 10;
      if (values.typePrevoyance === "obseques") price += 5;
      if (values.typePrevoyance === "dependance") price += 20;

      if (values.profession === "risque") price += 15;

      const { error } = await supabase.functions.invoke("send-quote-email", {
        body: {
          name: values.name,
          email: values.email,
          phone: values.phone,
          type: "Prévoyance",
          details: {
            typePrevoyance: values.typePrevoyance,
            situation: values.situation,
            age: values.age,
            profession: values.profession,
            codePostal: values.codePostal,
          },
          estimatedPrice: price,
        },
      });

      if (error) throw error;

      const offers = generateInsurerOffers(price, prevoyanceInsurers);
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
        title="Prévoyance - Protégez votre avenir et celui de vos proches"
        description="Comparez les meilleures assurances prévoyance : décès, obsèques, dépendance. Protégez votre famille et préparez l'avenir sereinement. Devis gratuit en 2 minutes."
        keywords="assurance prévoyance, assurance décès, assurance obsèques, assurance dépendance, protection famille"
        canonical="https://votre-domaine.fr/assurance-prevoyance"
      />
      <Header />
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-3 rounded-full bg-primary/10">
              <Shield className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-4xl font-bold text-foreground">Assurance Prévoyance</h1>
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
                          <FormLabel>Nom complet</FormLabel>
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
                      name="typePrevoyance"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Type de prévoyance</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Choisissez" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="deces">Assurance décès</SelectItem>
                              <SelectItem value="obseques">Assurance obsèques</SelectItem>
                              <SelectItem value="dependance">Assurance dépendance</SelectItem>
                              <SelectItem value="incapacite">Garantie incapacité</SelectItem>
                              <SelectItem value="invalidite">Garantie invalidité</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="situation"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Situation familiale</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Choisissez" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="celibataire">Célibataire</SelectItem>
                              <SelectItem value="marie">Marié(e)</SelectItem>
                              <SelectItem value="pacse">Pacsé(e)</SelectItem>
                              <SelectItem value="divorce">Divorcé(e)</SelectItem>
                              <SelectItem value="veuf">Veuf/Veuve</SelectItem>
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
                          <FormLabel>Âge</FormLabel>
                          <FormControl>
                            <Input type="number" placeholder="Votre âge" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="profession"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Profession</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Choisissez" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="salarie">Salarié(e)</SelectItem>
                              <SelectItem value="independant">Indépendant(e)</SelectItem>
                              <SelectItem value="fonctionnaire">Fonctionnaire</SelectItem>
                              <SelectItem value="retraite">Retraité(e)</SelectItem>
                              <SelectItem value="risque">Profession à risque</SelectItem>
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

export default AssurancePrevoyance;
