import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Shield, Clock, Euro, FileCheck, Heart, TrendingDown, Users } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import InsuranceComparison from "@/components/InsuranceComparison";
import { loanInsurers, generateInsurerOffers } from "@/utils/insurerData";
import SEO from "@/components/SEO";
import InfoSection from "@/components/insurance/InfoSection";
import HowItWorks from "@/components/insurance/HowItWorks";
import InsuranceFAQ from "@/components/insurance/InsuranceFAQ";
import Testimonials from "@/components/Testimonials";

const formSchema = z.object({
  montantPret: z.string().min(1, "Champ requis"),
  dureePret: z.string().min(1, "Champ requis"),
  age: z.string().min(1, "Champ requis"),
  statut: z.string().min(1, "Champ requis"),
  fumeur: z.string().min(1, "Champ requis"),
  codePostal: z.string().length(5, "Code postal invalide"),
});

const AssurancePret = () => {
  const { toast } = useToast();
  const [insurerOffers, setInsurerOffers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [submittedFormData, setSubmittedFormData] = useState<Record<string, any>>({});

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
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
      // Sauvegarder les données du formulaire
      setSubmittedFormData(values);
      
      // Calcul prix réaliste (coût par mois)
      const montant = parseInt(values.montantPret);
      const duree = parseInt(values.dureePret);
      const ageValue = parseInt(values.age);
      
      // Tarification basée sur le capital assuré
      let price = (montant / 1000) * 0.35; // Base: 0,35€ par millier
      
      // Facteurs d'ajustement
      if (duree > 25) price += 15;
      else if (duree > 20) price += 10;
      else if (duree > 15) price += 5;
      
      // Âge (impact majeur)
      if (ageValue > 55) price += 35;
      else if (ageValue > 45) price += 20;
      else if (ageValue > 35) price += 10;
      
      // Fumeur (majoration importante)
      if (values.fumeur === "oui") price += 15;
      
      // Profession à risque
      if (values.statut === "profession-risque") price += 25;
      
      const randomVariation = Math.floor(Math.random() * 15) - 7;
      price += randomVariation;
      price = Math.round(price);

      const offers = generateInsurerOffers(price, loanInsurers);
      setInsurerOffers(offers);
      toast({
        title: "Offres générées !",
        description: "Consultez les meilleures offres d'assurance emprunteur.",
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
        title="Assurance Prêt Immobilier - Économisez jusqu'à 50% | Le Comparateur Assurance"
        description="Comparez les assurances emprunteur et économisez des milliers d'euros sur votre crédit immobilier. Devis gratuit et changement simplifié avec la loi Lemoine."
        keywords="assurance prêt immobilier, assurance emprunteur, délégation assurance, loi Lemoine, assurance crédit"
        canonical="https://votre-domaine.fr/assurance-pret"
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
            <h1 className="text-5xl font-bold text-foreground mb-6">Assurance Prêt Immobilier</h1>
            <p className="text-xl text-muted-foreground mb-8">
              Économisez jusqu'à 50% sur votre assurance emprunteur en comparant les offres. 
              Grâce à la loi Lemoine, changez d'assurance à tout moment gratuitement.
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <Euro className="h-5 w-5 text-primary" />
                <span>Jusqu'à 15 000€ d'économies</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-primary" />
                <span>Changement gratuit</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-primary" />
                <span>Garanties équivalentes</span>
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
                insuranceType="Assurance Prêt Immobilier"
              />
            ) : (
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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

        {/* Garanties Section */}
        <InfoSection
          title="Les garanties de l'assurance emprunteur"
          description="Comprenez les garanties essentielles qui protègent votre prêt immobilier"
          items={[
            {
              icon: Heart,
              title: "Garantie Décès",
              description: "Remboursement du capital restant dû en cas de décès de l'assuré. Garantie obligatoire pour tous les crédits immobiliers.",
            },
            {
              icon: Shield,
              title: "PTIA",
              description: "Perte Totale et Irréversible d'Autonomie. Couverture si vous ne pouvez plus exercer d'activité et nécessitez l'assistance d'une tierce personne.",
            },
            {
              icon: FileCheck,
              title: "ITT",
              description: "Incapacité Temporaire Totale de travail. Prise en charge des échéances pendant votre arrêt de travail suite à maladie ou accident.",
            },
            {
              icon: Users,
              title: "IPT",
              description: "Invalidité Permanente Totale. Protection si votre taux d'invalidité est supérieur à 66%. Remboursement des mensualités selon la quotité.",
            },
            {
              icon: TrendingDown,
              title: "IPP",
              description: "Invalidité Permanente Partielle. Couverture pour un taux d'invalidité entre 33% et 66%. Prise en charge partielle des mensualités.",
            },
            {
              icon: Clock,
              title: "Garantie Chômage",
              description: "Option facultative qui prend en charge vos mensualités en cas de perte d'emploi involontaire pendant une durée limitée.",
            },
          ]}
        />

        {/* Comment ça marche */}
        <HowItWorks
          steps={[
            {
              number: "1",
              title: "Comparez les offres",
              description: "Obtenez plusieurs devis d'assureurs alternatifs moins chers que votre banque avec des garanties équivalentes.",
            },
            {
              number: "2",
              title: "Changez gratuitement",
              description: "Grâce à la loi Lemoine, résiliez à tout moment sans frais ni pénalités. Nous gérons toutes les démarches.",
            },
            {
              number: "3",
              title: "Économisez",
              description: "Réduisez le coût de votre assurance jusqu'à 50% et économisez des milliers d'euros sur la durée du prêt.",
            },
          ]}
        />

        {/* Loi Lemoine */}
        <section className="py-12 max-w-4xl mx-auto">
          <Card className="p-8 bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
            <h2 className="text-3xl font-bold text-foreground mb-4 text-center">La loi Lemoine : vos nouveaux droits</h2>
            <div className="space-y-4">
              <div className="flex gap-3">
                <Shield className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold mb-1">Résiliation à tout moment</h3>
                  <p className="text-muted-foreground">Changez d'assurance emprunteur quand vous voulez, sans attendre la date anniversaire.</p>
                </div>
              </div>
              <div className="flex gap-3">
                <Heart className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold mb-1">Droit à l'oubli renforcé</h3>
                  <p className="text-muted-foreground">Pas de déclaration d'ancienne maladie après 5 ans (au lieu de 10 ans) pour les cancers et hépatites.</p>
                </div>
              </div>
              <div className="flex gap-3">
                <FileCheck className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold mb-1">Suppression du questionnaire</h3>
                  <p className="text-muted-foreground">Plus de questionnaire médical pour les prêts de moins de 200 000€ par personne sur 25 ans maximum.</p>
                </div>
              </div>
            </div>
          </Card>
        </section>

        {/* FAQ */}
        <InsuranceFAQ
          title="Questions fréquentes sur l'assurance prêt immobilier"
          faqs={[
            {
              question: "Puis-je vraiment changer d'assurance emprunteur à tout moment ?",
              answer: "Oui ! Depuis la loi Lemoine de juin 2022, vous pouvez résilier votre assurance emprunteur à tout moment, sans frais ni pénalités, et sans attendre la date anniversaire du contrat. La seule condition est de présenter un contrat avec des garanties équivalentes à votre banque.",
            },
            {
              question: "Combien puis-je économiser en changeant d'assurance ?",
              answer: "Les économies varient selon votre profil, mais en moyenne les emprunteurs économisent entre 30% et 50% sur leur assurance, soit plusieurs milliers d'euros sur la durée du prêt. Par exemple, pour un prêt de 200 000€ sur 20 ans, vous pouvez économiser jusqu'à 15 000€.",
            },
            {
              question: "Ma banque peut-elle refuser ma nouvelle assurance ?",
              answer: "Votre banque ne peut refuser qu'si les garanties proposées ne sont pas équivalentes à celles de son contrat groupe. Si les garanties sont équivalentes, elle doit accepter dans les 10 jours ouvrés et vous envoyer un avenant au contrat de prêt. En cas de refus abusif, saisissez le médiateur bancaire.",
            },
            {
              question: "Qu'est-ce que la quotité d'assurance ?",
              answer: "La quotité représente le pourcentage du capital emprunté couvert par l'assurance. Pour un emprunt à deux, vous pouvez répartir comme vous souhaitez : 50/50, 100/100, 70/30... Une quotité de 100% par personne (200% au total) offre une protection maximale mais coûte plus cher.",
            },
            {
              question: "Ai-je besoin de passer une visite médicale ?",
              answer: "Cela dépend de votre situation. Grâce à la loi Lemoine, si votre prêt est inférieur à 200 000€ par assuré et se termine avant vos 60 ans, aucun questionnaire médical n'est requis. Au-delà, un questionnaire de santé sera nécessaire, parfois complété par des examens médicaux.",
            },
            {
              question: "Que se passe-t-il en cas de sinistre ?",
              answer: "En cas d'arrêt de travail, invalidité ou décès, votre assurance prend en charge les mensualités du prêt selon les garanties souscrites et la quotité assurée. Vous devez déclarer le sinistre rapidement, fournir les justificatifs demandés (certificats médicaux, arrêt de travail) et l'assureur procèdera aux vérifications avant la prise en charge.",
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

export default AssurancePret;
