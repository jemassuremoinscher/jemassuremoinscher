import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PawPrint, Shield, Euro, Clock, Heart, Syringe, Stethoscope } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import InsuranceComparison from "@/components/InsuranceComparison";
import { petInsurers, generateInsurerOffers } from "@/utils/insurerData";
import SEO from "@/components/SEO";
import InfoSection from "@/components/insurance/InfoSection";
import HowItWorks from "@/components/insurance/HowItWorks";
import InsuranceFAQ from "@/components/insurance/InsuranceFAQ";
import Testimonials from "@/components/Testimonials";

const formSchema = z.object({
  typeAnimal: z.string().min(1, "Champ requis"),
  race: z.string().min(1, "Champ requis"),
  ageAnimal: z.string().min(1, "Champ requis"),
  sexe: z.string().min(1, "Champ requis"),
  sterilise: z.string().min(1, "Champ requis"),
  codePostal: z.string().length(5, "Code postal invalide"),
});

const AssuranceAnimaux = () => {
  const { toast } = useToast();
  const [insurerOffers, setInsurerOffers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [submittedFormData, setSubmittedFormData] = useState<Record<string, any>>({});

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      typeAnimal: "",
      race: "",
      ageAnimal: "",
      sexe: "",
      sterilise: "",
      codePostal: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    try {
      // Sauvegarder les données du formulaire
      setSubmittedFormData(values);
      
      // Calcul prix réaliste
      const basePrice = 25; // Base formule économique
      const age = parseInt(values.ageAnimal);
      let price = basePrice;
      
      // Type d'animal (impact majeur)
      if (values.typeAnimal === "chien") price += 15; // Chiens plus chers
      else if (values.typeAnimal === "chat") price += 5;
      
      // Âge (augmente significativement avec l'âge)
      if (age > 10) price += 25;
      else if (age > 8) price += 15;
      else if (age > 5) price += 8;
      else if (age < 1) price += 5; // Jeunes animaux aussi plus chers
      
      // Stérilisation (réduction)
      if (values.sterilise === "oui") price -= 3;
      
      const randomVariation = Math.floor(Math.random() * 12) - 6;
      price += randomVariation;

      const offers = generateInsurerOffers(price, petInsurers);
      setInsurerOffers(offers);
      toast({
        title: "Offres générées !",
        description: "Consultez les meilleures offres pour votre animal.",
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
        title="Assurance Animaux - Protégez votre chien ou chat | Le Comparateur Assurance"
        description="Comparez les assurances pour chiens et chats. Remboursement des frais vétérinaires jusqu'à 100%. Devis gratuit pour protéger votre animal de compagnie."
        keywords="assurance chien, assurance chat, assurance animaux, mutuelle animaux, frais vétérinaires"
        canonical="https://votre-domaine.fr/assurance-animaux"
      />
      <Header />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary/5 to-primary/10 py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex justify-center mb-6">
              <div className="p-4 rounded-full bg-primary/10">
                <PawPrint className="h-12 w-12 text-primary" />
              </div>
            </div>
            <h1 className="text-5xl font-bold text-foreground mb-6">Assurance Animaux</h1>
            <p className="text-xl text-muted-foreground mb-8">
              Protégez la santé de votre compagnon et maîtrisez vos dépenses vétérinaires. 
              Comparez les meilleures mutuelles pour chiens et chats.
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <Heart className="h-5 w-5 text-primary" />
                <span>Jusqu'à 100% remboursé</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-primary" />
                <span>Devis en 2 minutes</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-primary" />
                <span>Meilleure protection</span>
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
              <InsuranceComparison 
                insurers={insurerOffers} 
                onNewQuote={() => setInsurerOffers([])}
                formData={submittedFormData}
                insuranceType="Assurance Animaux"
              />
            ) : (
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="typeAnimal"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Type d'animal</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Sélectionner" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="chien">Chien</SelectItem>
                            <SelectItem value="chat">Chat</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="race"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Race</FormLabel>
                        <FormControl>
                          <Input placeholder="Ex: Labrador, Siamois..." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="ageAnimal"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Âge de l'animal</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="3" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="sexe"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Sexe</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Sélectionner" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="male">Mâle</SelectItem>
                            <SelectItem value="femelle">Femelle</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="sterilise"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Stérilisé/Castré</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Sélectionner" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="oui">Oui</SelectItem>
                            <SelectItem value="non">Non</SelectItem>
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

        {/* Garanties Section */}
        <InfoSection
          title="Les garanties de l'assurance animaux"
          description="Protégez la santé de votre compagnon avec des garanties complètes"
          items={[
            {
              icon: Stethoscope,
              title: "Soins Vétérinaires",
              description: "Remboursement des consultations, examens, analyses et radiographies chez le vétérinaire. Taux jusqu'à 100%.",
            },
            {
              icon: Syringe,
              title: "Chirurgie et Hospitalisation",
              description: "Prise en charge des opérations chirurgicales et des frais d'hospitalisation, même pour les interventions lourdes.",
            },
            {
              icon: Heart,
              title: "Prévention",
              description: "Forfait annuel pour les vaccins, vermifuges, antiparasitaires, détartrage et stérilisation de votre animal.",
            },
            {
              icon: Shield,
              title: "Maladies et Accidents",
              description: "Couverture complète des soins suite à maladie ou accident : médicaments, soins, examens complémentaires.",
            },
            {
              icon: Euro,
              title: "Frais d'Obsèques",
              description: "Prise en charge des frais d'incinération ou d'enterrement de votre animal en cas de décès.",
            },
            {
              icon: Clock,
              title: "Assistance",
              description: "Services d'assistance 24h/24 : garde d'animal en cas d'hospitalisation, recherche en cas de perte.",
            },
          ]}
        />

        {/* Comment ça marche */}
        <HowItWorks
          steps={[
            {
              number: "1",
              title: "Décrivez votre animal",
              description: "Indiquez l'espèce, la race, l'âge et l'état de santé de votre compagnon.",
            },
            {
              number: "2",
              title: "Comparez les formules",
              description: "Recevez plusieurs devis avec différents niveaux de couverture et taux de remboursement.",
            },
            {
              number: "3",
              title: "Protégez votre animal",
              description: "Souscrivez en ligne et bénéficiez de remboursements rapides dès les premiers soins.",
            },
          ]}
        />

        {/* Conseils */}
        <section className="py-12 max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-foreground mb-8 text-center">
            Nos conseils pour choisir la bonne assurance
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="p-6">
              <h3 className="text-xl font-semibold mb-3">Souscrivez tôt</h3>
              <p className="text-muted-foreground">
                Plus votre animal est jeune, moins la cotisation est élevée et plus il sera facile 
                de l'assurer. Idéalement, souscrivez dès l'adoption, avant l'apparition de problèmes 
                de santé qui pourraient être exclus.
              </p>
            </Card>
            <Card className="p-6">
              <h3 className="text-xl font-semibold mb-3">Vérifiez le délai de carence</h3>
              <p className="text-muted-foreground">
                Le délai de carence est la période pendant laquelle vous n'êtes pas encore couvert 
                après la souscription. Il varie de quelques jours pour les accidents à plusieurs mois 
                pour certaines maladies. Anticipez !
              </p>
            </Card>
            <Card className="p-6">
              <h3 className="text-xl font-semibold mb-3">Comparez les plafonds</h3>
              <p className="text-muted-foreground">
                Attention aux plafonds annuels et par acte : un plafond trop bas peut s'avérer 
                insuffisant en cas de maladie grave. Pour les races fragiles ou les chiens de grande 
                taille, privilégiez des plafonds élevés.
              </p>
            </Card>
            <Card className="p-6">
              <h3 className="text-xl font-semibold mb-3">Le forfait prévention</h3>
              <p className="text-muted-foreground">
                Le forfait prévention rembourse les actes non liés à une maladie : vaccins, stérilisation, 
                antiparasitaires. Très utile pour les jeunes animaux, il permet d'amortir la cotisation 
                et d'assurer un suivi vétérinaire régulier.
              </p>
            </Card>
          </div>
        </section>

        {/* FAQ */}
        <InsuranceFAQ
          title="Questions fréquentes sur l'assurance animaux"
          faqs={[
            {
              question: "À partir de quel âge puis-je assurer mon animal ?",
              answer: "La plupart des assureurs acceptent les animaux dès 2-3 mois (après la primo-vaccination) et jusqu'à 7-10 ans selon les compagnies. Certaines mutuelles spécialisées acceptent les animaux seniors mais avec des garanties et tarifs adaptés. Plus vous attendez, plus il sera difficile et coûteux d'assurer votre compagnon.",
            },
            {
              question: "Les maladies héréditaires sont-elles couvertes ?",
              answer: "Cela dépend des contrats. Certaines assurances excluent les maladies héréditaires et congénitales (dysplasie de la hanche, cataracte, souffle au cœur...), d'autres les couvrent moyennant une surprime. Lisez attentivement les conditions générales, surtout si votre animal est d'une race prédisposée à certaines pathologies.",
            },
            {
              question: "Comment fonctionne le remboursement des frais vétérinaires ?",
              answer: "Après une consultation ou des soins, vous envoyez la feuille de soins et la facture acquittée à votre assureur (souvent par email ou via une application). Le remboursement intervient généralement sous 48h à 15 jours selon la formule choisie. Certains vétérinaires pratiquent le tiers payant avec certaines mutuelles.",
            },
            {
              question: "Qu'est-ce que le délai de carence et combien de temps dure-t-il ?",
              answer: "Le délai de carence est la période d'attente avant que vos garanties ne s'activent. Pour les accidents, il est généralement de 2 jours à 1 semaine. Pour les maladies, il varie de 30 jours à 6 mois selon les pathologies. Pendant ce délai, les soins ne sont pas remboursés. Seuls les accidents survenus avant la souscription ne seront jamais couverts.",
            },
            {
              question: "Mon chat d'intérieur a-t-il besoin d'une assurance ?",
              answer: "Oui ! Même un chat d'intérieur peut tomber malade, ingérer un objet dangereux ou se blesser. Les frais vétérinaires peuvent vite grimper : une occlusion intestinale nécessitant une chirurgie coûte 1 500€ à 3 000€. L'assurance permet d'offrir les meilleurs soins à votre chat sans vous soucier du coût.",
            },
            {
              question: "Puis-je résilier mon assurance animaux ?",
              answer: "Oui, comme pour toutes les assurances, vous pouvez résilier à la date anniversaire du contrat avec un préavis de 2 mois généralement. Depuis la loi Hamon, après un an d'engagement, vous pouvez aussi résilier à tout moment. Attention : en cas de résiliation, votre animal perd sa couverture et une nouvelle souscription sera plus coûteuse du fait de son âge.",
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

export default AssuranceAnimaux;
