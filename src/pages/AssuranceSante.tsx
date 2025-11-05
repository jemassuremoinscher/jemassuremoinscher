import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Heart } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import InsuranceComparison from "@/components/InsuranceComparison";
import { healthInsurers, generateInsurerOffers } from "@/utils/insurerData";
import SEO from "@/components/SEO";

const formSchema = z.object({
  name: z.string().min(2, "Le nom doit contenir au moins 2 caractères").max(100),
  email: z.string().email("Email invalide").max(255),
  phone: z.string().min(10, "Numéro de téléphone invalide").max(15),
  situation: z.string().min(1, "Champ requis"),
  age: z.string().min(1, "Champ requis"),
  regime: z.string().min(1, "Champ requis"),
  niveau: z.string().min(1, "Champ requis"),
  codePostal: z.string().length(5, "Code postal invalide"),
});

const AssuranceSante = () => {
  const { toast } = useToast();
  const [insurerOffers, setInsurerOffers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      situation: "",
      age: "",
      regime: "",
      niveau: "",
      codePostal: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    try {
      const basePrice = 35;
      const ageValue = parseInt(values.age);
      let price = basePrice;
      
      if (values.situation === "famille") price += 40;
      else if (values.situation === "couple") price += 25;
      
      if (ageValue > 50) price += 15;
      
      if (values.niveau === "premium") price += 30;
      else if (values.niveau === "confort") price += 20;
      else if (values.niveau === "equilibre") price += 10;
      
      const randomVariation = Math.floor(Math.random() * 15) - 7;
      price += randomVariation;

      const { data, error } = await supabase.functions.invoke("send-quote-email", {
        body: {
          name: values.name,
          email: values.email,
          phone: values.phone,
          type: "Mutuelle Santé",
          details: {
            situation: values.situation,
            age: values.age,
            regime: values.regime,
            niveau: values.niveau,
            codePostal: values.codePostal,
          },
          estimatedPrice: price,
        },
      });

      if (error) throw error;

      const offers = generateInsurerOffers(price, healthInsurers);
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
        title="Mutuelle Santé - Comparez les Meilleures Offres | Le Comparateur Assurance"
        description="Comparez les mutuelles santé et complémentaires santé en France. Devis gratuit et personnalisé en 2 minutes. Trouvez la meilleure mutuelle adaptée à vos besoins."
        keywords="mutuelle santé, complémentaire santé, assurance santé, comparateur mutuelle, mutuelle pas cher"
        canonical="https://votre-domaine.fr/assurance-sante"
      />
      <Header />
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-3 rounded-full bg-primary/10">
              <Heart className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-4xl font-bold text-foreground">Mutuelle Santé</h1>
          </div>

          <Card className="p-8">
            <h2 className="text-2xl font-bold mb-6 text-card-foreground">Obtenez votre devis en 2 minutes</h2>
            
            {insurerOffers.length > 0 ? (
              <InsuranceComparison 
                insurers={insurerOffers} 
                onNewQuote={() => setInsurerOffers([])} 
              />
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
                    name="situation"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Situation familiale</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Sélectionner" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="celibataire">Célibataire</SelectItem>
                            <SelectItem value="couple">En couple</SelectItem>
                            <SelectItem value="famille">Famille</SelectItem>
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
                          <Input type="number" placeholder="30" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="regime"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Régime de sécurité sociale</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Sélectionner" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="general">Régime général</SelectItem>
                            <SelectItem value="alsace-moselle">Alsace-Moselle</SelectItem>
                            <SelectItem value="tns">TNS</SelectItem>
                            <SelectItem value="agricole">Agricole</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="niveau"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Niveau de couverture souhaité</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Sélectionner" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="economique">Économique</SelectItem>
                            <SelectItem value="equilibre">Équilibré</SelectItem>
                            <SelectItem value="confort">Confort</SelectItem>
                            <SelectItem value="premium">Premium</SelectItem>
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

export default AssuranceSante;
