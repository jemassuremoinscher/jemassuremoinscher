import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Shield, Heart, Users, Headphones, Euro, Clock, UserCheck } from "lucide-react";
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
import InfoSection from "@/components/insurance/InfoSection";
import HowItWorks from "@/components/insurance/HowItWorks";
import InsuranceFAQ from "@/components/insurance/InsuranceFAQ";
import Testimonials from "@/components/Testimonials";

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
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary/5 to-primary/10 py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex justify-center mb-6">
              <div className="p-4 rounded-full bg-primary/10">
                <Shield className="h-12 w-12 text-primary" />
              </div>
            </div>
            <h1 className="text-5xl font-bold text-foreground mb-6">Assurance Prévoyance</h1>
            <p className="text-xl text-muted-foreground mb-8">
              Protégez votre famille et préparez l'avenir sereinement. 
              Comparez les meilleures solutions de prévoyance adaptées à vos besoins.
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <Heart className="h-5 w-5 text-primary" />
                <span>Protection familiale</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-primary" />
                <span>Devis immédiat</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-primary" />
                <span>Garanties sur mesure</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <main className="container mx-auto px-4 py-12">
        {/* Formulaire de devis */}
        <div className="max-w-3xl mx-auto mb-16">
          <Card className="p-8">
            <h2 className="text-2xl font-bold mb-6 text-card-foreground">Obtenez votre devis personnalisé</h2>
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

                  <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
                    {isLoading ? "Envoi en cours..." : "Obtenir mon devis gratuit"}
                  </Button>
                </form>
              </Form>
            )}
          </Card>
        </div>

        {/* Garanties Section */}
        <InfoSection
          title="Les différentes solutions de prévoyance"
          description="Choisissez la protection adaptée à votre situation et vos besoins"
          items={[
            {
              icon: Heart,
              title: "Assurance Décès",
              description: "Versement d'un capital ou d'une rente à vos proches en cas de décès. Protégez votre famille et assurez leur avenir financier.",
            },
            {
              icon: Shield,
              title: "Garantie Invalidité",
              description: "Maintien de revenus en cas d'invalidité permanente suite à maladie ou accident. Rente mensuelle selon le taux d'invalidité.",
            },
            {
              icon: UserCheck,
              title: "Incapacité de Travail",
              description: "Indemnités journalières en cas d'arrêt de travail prolongé pour maintenir votre niveau de vie pendant votre convalescence.",
            },
            {
              icon: Users,
              title: "Assurance Dépendance",
              description: "Rente viagère si vous perdez votre autonomie. Financement de l'aide à domicile ou d'un établissement spécialisé.",
            },
            {
              icon: Headphones,
              title: "Assurance Obsèques",
              description: "Capital garanti pour financer vos obsèques et soulager vos proches du poids financier et organisationnel.",
            },
            {
              icon: Euro,
              title: "Rente Éducation",
              description: "Versement d'une rente pour financer les études de vos enfants en cas de décès ou invalidité du parent assuré.",
            },
          ]}
        />

        {/* Comment ça marche */}
        <HowItWorks
          steps={[
            {
              number: "1",
              title: "Évaluez vos besoins",
              description: "Définissez le type de protection souhaité selon votre situation familiale et professionnelle.",
            },
            {
              number: "2",
              title: "Comparez les garanties",
              description: "Recevez plusieurs offres détaillées avec les garanties, exclusions et tarifs de chaque assureur.",
            },
            {
              number: "3",
              title: "Protégez vos proches",
              description: "Souscrivez en ligne et assurez la sécurité financière de votre famille dès maintenant.",
            },
          ]}
        />

        {/* Conseils */}
        <section className="py-12 max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-foreground mb-8 text-center">
            Nos conseils pour bien choisir votre prévoyance
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="p-6">
              <h3 className="text-xl font-semibold mb-3">Évaluez le capital nécessaire</h3>
              <p className="text-muted-foreground">
                Pour une assurance décès, calculez le capital nécessaire pour maintenir le niveau de vie 
                de votre famille : remboursement du crédit immobilier, frais de scolarité, revenus de remplacement. 
                Comptez généralement 3 à 5 fois votre revenu annuel.
              </p>
            </Card>
            <Card className="p-6">
              <h3 className="text-xl font-semibold mb-3">Adaptez selon votre âge</h3>
              <p className="text-muted-foreground">
                Plus vous êtes jeune, moins la cotisation est élevée. Si vous avez des enfants en bas âge 
                et un crédit immobilier, privilégiez une assurance décès temporaire. Après 50 ans, 
                pensez à la dépendance et aux obsèques.
              </p>
            </Card>
            <Card className="p-6">
              <h3 className="text-xl font-semibold mb-3">Coordonnez avec vos autres garanties</h3>
              <p className="text-muted-foreground">
                Vérifiez ce qui est déjà couvert par votre mutuelle d'entreprise, votre assurance emprunteur 
                ou votre épargne existante. Évitez les doublons et optimisez votre budget en complétant 
                uniquement les protections manquantes.
              </p>
            </Card>
            <Card className="p-6">
              <h3 className="text-xl font-semibold mb-3">Lisez les exclusions</h3>
              <p className="text-muted-foreground">
                Prenez le temps de lire les exclusions de garantie : sports à risque, maladies préexistantes, 
                professions dangereuses. Certains contrats proposent des rachats d'exclusions moyennant 
                une surprime pour une couverture plus complète.
              </p>
            </Card>
          </div>
        </section>

        {/* FAQ */}
        <InsuranceFAQ
          title="Questions fréquentes sur la prévoyance"
          faqs={[
            {
              question: "Quelle est la différence entre prévoyance et mutuelle santé ?",
              answer: "La mutuelle santé rembourse vos frais médicaux (consultations, médicaments, hospitalisation). La prévoyance couvre les conséquences financières d'un accident de la vie : décès, invalidité, incapacité de travail. Elle verse un capital ou une rente pour compenser la perte de revenus et protéger votre famille.",
            },
            {
              question: "Ai-je besoin d'une assurance prévoyance si j'ai déjà celle de mon entreprise ?",
              answer: "La prévoyance collective couvre uniquement pendant votre activité professionnelle et s'arrête en cas de départ de l'entreprise. De plus, elle peut être insuffisante selon votre situation familiale. Un contrat individuel complète ces garanties et vous suit tout au long de votre vie, même en cas de changement professionnel.",
            },
            {
              question: "Comment est calculé le montant des cotisations ?",
              answer: "Les cotisations dépendent de plusieurs facteurs : votre âge, votre profession, votre état de santé, le montant du capital ou de la rente garantie, et les garanties choisies. Plus vous souscrivez jeune, plus les cotisations sont faibles. Un questionnaire médical peut être demandé selon le montant assuré.",
            },
            {
              question: "Qu'est-ce que la garantie dépendance et à quel âge y souscrire ?",
              answer: "La garantie dépendance verse une rente si vous ne pouvez plus accomplir seul les actes essentiels de la vie quotidienne (se laver, s'habiller, se nourrir). L'âge idéal de souscription se situe entre 50 et 60 ans : les cotisations restent abordables et vous êtes généralement en bonne santé pour être accepté facilement.",
            },
            {
              question: "L'assurance obsèques est-elle vraiment utile ?",
              answer: "Oui, elle permet de financer vos obsèques (en moyenne 4 000 à 6 000€) et d'éviter à vos proches de supporter ce coût dans un moment difficile. Vous pouvez également prévoir l'organisation de vos obsèques selon vos souhaits. Le capital est garanti et les cotisations peuvent être viagères ou sur une durée limitée.",
            },
            {
              question: "Puis-je résilier mon contrat de prévoyance ?",
              answer: "Oui, les contrats de prévoyance sont résiliables à tout moment après la première année, avec un préavis généralement de 2 mois. Attention : si vous résiliez, vous perdez les garanties et les cotisations déjà versées ne sont pas remboursées (sauf pour certains contrats d'obsèques avec épargne). Comparez bien avant de changer.",
            },
          ]}
        />

        {/* Testimonials */}
        <Testimonials />
      </main>
      <Footer />
    </div>
  );
};

export default AssurancePrevoyance;
