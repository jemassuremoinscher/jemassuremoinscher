import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Car, Shield, Euro, Clock } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { useState, useRef } from "react";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import InsuranceComparison from "@/components/InsuranceComparison";
import { autoInsurers, generateInsurerOffers } from "@/utils/insurerData";
import SEO from "@/components/SEO";
import InsuranceFAQ from "@/components/insurance/InsuranceFAQ";
import Testimonials from "@/components/Testimonials";
import { SavingsCalculator } from "@/components/calculator/SavingsCalculator";
import { QuoteRequestForm } from "@/components/forms/QuoteRequestForm";
import { addServiceSchema, addFAQSchema, addBreadcrumbSchema, addAggregateRatingSchema, addHowToSchema } from "@/utils/seoUtils";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import arthurThumbsUp from "@/assets/mascotte/arthur-thumbs-up.png";
import arthurFlying from "@/assets/mascotte/arthur-flying.png";
import { useLanguage } from "@/contexts/LanguageContext";

const formSchema = z.object({
  marque: z.string().min(1, "Champ requis"),
  modele: z.string().min(1, "Champ requis"),
  annee: z.string().min(1, "Champ requis"),
  carburant: z.string().min(1, "Champ requis"),
  codePostal: z.string().length(5, "Code postal invalide"),
  age: z.string().min(1, "Champ requis"),
  permis: z.string().min(1, "Champ requis"),
  bonusMalus: z.string().min(1, "Champ requis"),
});

const AssuranceAuto = () => {
  const { t } = useLanguage();
  const [insurerOffers, setInsurerOffers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedBrand, setSelectedBrand] = useState<string>("");
  const [submittedFormData, setSubmittedFormData] = useState<Record<string, any>>({});
  const formRef = useRef<HTMLDivElement>(null);

  const modelsByBrand: Record<string, string[]> = {
    "Peugeot": ["208", "308", "3008", "2008", "508", "5008", "Partner", "Expert", "Rifter"],
    "Renault": ["Clio", "Captur", "Megane", "Kadjar", "Scenic", "Espace", "Twingo", "Zoe", "Arkana"],
    "Citroën": ["C3", "C4", "C5 Aircross", "C3 Aircross", "Berlingo", "SpaceTourer", "Ami"],
    "Volkswagen": ["Golf", "Polo", "Tiguan", "T-Roc", "Passat", "Touran", "ID.3", "ID.4", "Arteon"],
    "BMW": ["Série 1", "Série 2", "Série 3", "Série 4", "Série 5", "X1", "X3", "X5", "iX3", "i4"],
    "Mercedes-Benz": ["Classe A", "Classe B", "Classe C", "Classe E", "GLA", "GLB", "GLC", "EQC"],
    "Audi": ["A1", "A3", "A4", "A6", "Q2", "Q3", "Q5", "Q7", "e-tron", "Q4 e-tron"],
    "Toyota": ["Yaris", "Corolla", "C-HR", "RAV4", "Aygo", "Prius", "Camry", "Highlander"],
    "Ford": ["Fiesta", "Focus", "Puma", "Kuga", "Mustang", "Ranger", "Transit"],
    "Opel": ["Corsa", "Astra", "Crossland", "Grandland", "Mokka", "Combo", "Vivaro"],
    "Fiat": ["500", "Panda", "Tipo", "500X", "500L", "Ducato"],
    "Nissan": ["Micra", "Juke", "Qashqai", "X-Trail", "Leaf", "Ariya"],
    "Kia": ["Picanto", "Rio", "Ceed", "XCeed", "Sportage", "Niro", "EV6"],
    "Hyundai": ["i10", "i20", "i30", "Tucson", "Kona", "Santa Fe", "Ioniq 5"],
    "Mazda": ["Mazda2", "Mazda3", "CX-3", "CX-30", "CX-5", "MX-5"],
    "Honda": ["Jazz", "Civic", "CR-V", "HR-V", "e"],
    "Seat": ["Ibiza", "Leon", "Arona", "Ateca", "Tarraco"],
    "Skoda": ["Fabia", "Octavia", "Scala", "Kamiq", "Karoq", "Kodiaq", "Enyaq"],
    "Dacia": ["Sandero", "Duster", "Logan", "Spring", "Jogger"],
    "Mini": ["Cooper", "Countryman", "Clubman"],
    "Volvo": ["XC40", "XC60", "XC90", "V60", "V90", "S60", "S90"],
    "Tesla": ["Model 3", "Model Y", "Model S", "Model X"],
    "DS": ["DS 3", "DS 4", "DS 7", "DS 9"],
    "Alfa Romeo": ["Giulia", "Stelvio", "Tonale"],
    "Jeep": ["Renegade", "Compass", "Cherokee", "Wrangler"],
    "Land Rover": ["Defender", "Discovery", "Range Rover", "Range Rover Evoque", "Range Rover Sport"],
    "Porsche": ["911", "Cayenne", "Macan", "Panamera", "Taycan"],
    "Lexus": ["CT", "IS", "NX", "RX", "UX"],
    "Jaguar": ["E-Pace", "F-Pace", "XE", "XF", "I-Pace"],
    "Smart": ["ForTwo", "ForFour"],
    "Suzuki": ["Ignis", "Swift", "Vitara", "S-Cross"],
    "Mitsubishi": ["Space Star", "ASX", "Eclipse Cross", "Outlander"],
    "Subaru": ["Impreza", "XV", "Forester", "Outback"],
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { marque: "", modele: "", annee: "", carburant: "", codePostal: "", age: "", permis: "", bonusMalus: "" },
  });

  const scrollToForm = () => { formRef.current?.scrollIntoView({ behavior: 'smooth' }); };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    try {
      setSubmittedFormData(values);
      const basePrice = 65;
      const ageDriver = parseInt(values.age);
      const yearVehicle = parseInt(values.annee);
      const bonusMalusCoef = parseFloat(values.bonusMalus);
      let price = basePrice;
      if (ageDriver < 25) price += 80;
      else if (ageDriver < 30) price += 40;
      if (yearVehicle < 2010) price += 25;
      else if (yearVehicle < 2015) price += 15;
      else if (yearVehicle > 2020) price += 20;
      if (values.carburant === "electrique") price -= 15;
      else if (values.carburant === "hybride") price -= 8;
      price = price * bonusMalusCoef;
      const randomVariation = Math.floor(Math.random() * 30) - 15;
      price += randomVariation;
      const offers = generateInsurerOffers(price, autoInsurers);
      setInsurerOffers(offers);
      toast.success(t('insPage.toast.success'), { description: t('insPage.toast.successDesc') });
    } catch (error: any) {
      console.error("Error:", error);
      toast.error(t('insPage.toast.error'), { description: t('insPage.toast.errorDesc') });
    } finally { setIsLoading(false); }
  };

  const breadcrumbSchema = addBreadcrumbSchema([
    { name: "Accueil", url: "https://www.jemassuremoinscher.fr/" },
    { name: "Assurance Auto", url: "https://www.jemassuremoinscher.fr/assurance-auto" }
  ]);
  const serviceSchema = addServiceSchema({ name: "Comparateur Assurance Auto", description: "Comparez les meilleures offres d'assurance auto en France. Devis gratuit et personnalisé en 2 minutes. Économisez jusqu'à 400€ par an.", provider: "jemassuremoinscher", areaServed: "France" });
  const ratingSchema = addAggregateRatingSchema("Comparateur Assurance Auto", 4.7, 1853);
  const howToSchema = addHowToSchema({ name: "Comment obtenir un devis d'assurance auto en ligne", description: "Guide étape par étape pour comparer et obtenir votre devis d'assurance auto en 2 minutes", totalTime: "PT2M", steps: [{ name: "Renseignez les informations de votre véhicule", text: "Indiquez la marque, le modèle, la date de mise en circulation et l'usage de votre véhicule." }, { name: "Précisez votre profil de conducteur", text: "Renseignez votre âge, votre ancienneté de permis et votre coefficient bonus-malus." }, { name: "Comparez les offres disponibles", text: "Recevez instantanément plusieurs devis d'assureurs partenaires." }, { name: "Faites-vous rappeler", text: "Sélectionnez l'offre qui vous convient et demandez à être rappelé par un conseiller." }] });
  const faqSchema = addFAQSchema([{ question: "Quelle assurance auto choisir ?", answer: "Le choix dépend de votre profil, votre véhicule et votre budget. Notre comparateur vous aide à trouver l'offre la mieux adaptée." }, { question: "Combien coûte une assurance auto ?", answer: "Le prix varie selon votre âge, votre véhicule, votre historique et votre lieu de résidence. En moyenne, entre 400€ et 800€ par an." }, { question: "Puis-je changer d'assurance auto à tout moment ?", answer: "Oui, grâce à la loi Hamon, vous pouvez résilier après un an sans frais ni justification." }]);

  const advantages = [
    { icon: Euro, title: t('autoPage.adv1.title'), description: t('autoPage.adv1.desc') },
    { icon: Clock, title: t('insPage.quoteIn2min'), description: t('insPage.quoteIn2minDesc') },
    { icon: Shield, title: t('autoPage.adv2.title'), description: t('autoPage.adv2.desc') }
  ];

  return (
    <div className="min-h-screen">
      <SEO title="Assurance Auto - Comparez et Économisez | jemassuremoinscher" description="Comparez les meilleures assurances auto en France. Devis gratuit en 2 minutes. Économisez jusqu'à 400€/an." keywords="assurance auto, devis assurance voiture, assurance auto pas cher, comparateur assurance auto" canonical="https://www.jemassuremoinscher.fr/assurance-auto" jsonLd={[breadcrumbSchema, serviceSchema, ratingSchema, howToSchema, faqSchema]} />
      <Header />

      <section className="bg-gradient-to-br from-primary/5 to-primary/10 py-16 relative overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center relative">
            <img src={arthurThumbsUp} alt="Arthur" className="hidden lg:block absolute -left-32 bottom-0 w-32 h-auto" />
            <div className="flex justify-center mb-6"><div className="p-4 rounded-full bg-primary/10"><Car className="h-12 w-12 text-primary" /></div></div>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">{t('autoPage.title')}</h1>
            <p className="text-xl text-muted-foreground mb-8">{t('autoPage.subtitle')}</p>
            <Button size="lg" onClick={scrollToForm} className="text-lg px-8 py-6">{t('insPage.compareNow')}</Button>
          </div>
        </div>
      </section>

      <main className="container mx-auto px-4 py-12">
        <section className="max-w-4xl mx-auto mb-12">
          <div className="grid md:grid-cols-3 gap-6">
            {advantages.map((item, index) => (
              <Card key={index} className="p-6 text-center">
                <div className="flex justify-center mb-4"><div className="p-3 rounded-full bg-primary/10"><item.icon className="h-8 w-8 text-primary" /></div></div>
                <h3 className="font-bold text-lg mb-2">{item.title}</h3>
                <p className="text-muted-foreground text-sm">{item.description}</p>
              </Card>
            ))}
          </div>
        </section>

        <div ref={formRef} className="max-w-3xl mx-auto mb-16">
          <Card className="p-8">
            <h2 className="text-2xl font-bold mb-6 text-card-foreground">{t('insPage.getQuote')}</h2>
            {insurerOffers.length > 0 ? (
              <InsuranceComparison insurers={insurerOffers} onNewQuote={() => setInsurerOffers([])} formData={submittedFormData} insuranceType="Assurance Auto" />
            ) : (
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField control={form.control} name="marque" render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('autoPage.form.brand')}</FormLabel>
                      <Select onValueChange={(value) => { field.onChange(value); setSelectedBrand(value); form.setValue("modele", ""); }} defaultValue={field.value}>
                        <FormControl><SelectTrigger><SelectValue placeholder={t('autoPage.form.brandPlaceholder')} /></SelectTrigger></FormControl>
                        <SelectContent className="max-h-[300px]">
                          {Object.keys(modelsByBrand).sort().map((brand) => (<SelectItem key={brand} value={brand}>{brand}</SelectItem>))}
                          <SelectItem value="Autre">{t('autoPage.form.other')}</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )} />

                  <FormField control={form.control} name="modele" render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('autoPage.form.model')}</FormLabel>
                      {selectedBrand && modelsByBrand[selectedBrand] ? (
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl><SelectTrigger><SelectValue placeholder={t('autoPage.form.modelSelect')} /></SelectTrigger></FormControl>
                          <SelectContent className="max-h-[300px]">
                            {modelsByBrand[selectedBrand].map((model) => (<SelectItem key={model} value={model}>{model}</SelectItem>))}
                            <SelectItem value="Autre">{t('autoPage.form.other')}</SelectItem>
                          </SelectContent>
                        </Select>
                      ) : (
                        <FormControl><Input placeholder={selectedBrand ? t('autoPage.form.modelPlaceholder') : t('autoPage.form.modelFirst')} {...field} disabled={!selectedBrand} /></FormControl>
                      )}
                      <FormMessage />
                    </FormItem>
                  )} />

                  <div className="grid grid-cols-2 gap-4">
                    <FormField control={form.control} name="annee" render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('autoPage.form.year')}</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl><SelectTrigger><SelectValue placeholder={t('insPage.select')} /></SelectTrigger></FormControl>
                          <SelectContent className="max-h-[300px]">{Array.from({ length: 2025 - 1980 + 1 }, (_, i) => 2025 - i).map((year) => (<SelectItem key={year} value={year.toString()}>{year}</SelectItem>))}</SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={form.control} name="carburant" render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('autoPage.form.fuel')}</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl><SelectTrigger><SelectValue placeholder={t('insPage.select')} /></SelectTrigger></FormControl>
                          <SelectContent>
                            <SelectItem value="essence">{t('autoPage.form.fuel.essence')}</SelectItem>
                            <SelectItem value="diesel">{t('autoPage.form.fuel.diesel')}</SelectItem>
                            <SelectItem value="electrique">{t('autoPage.form.fuel.electric')}</SelectItem>
                            <SelectItem value="hybride">{t('autoPage.form.fuel.hybrid')}</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )} />
                  </div>

                  <FormField control={form.control} name="codePostal" render={({ field }) => (
                    <FormItem><FormLabel>{t('insPage.postalCode')}</FormLabel><FormControl><Input placeholder="75001" maxLength={5} {...field} /></FormControl><FormMessage /></FormItem>
                  )} />

                  <FormField control={form.control} name="age" render={({ field }) => (
                    <FormItem><FormLabel>{t('insPage.yourAge')}</FormLabel><FormControl><Input type="number" placeholder="25" {...field} /></FormControl><FormMessage /></FormItem>
                  )} />

                  <FormField control={form.control} name="permis" render={({ field }) => (
                    <FormItem><FormLabel>{t('autoPage.form.license')}</FormLabel><FormControl><Input type="date" {...field} /></FormControl><FormMessage /></FormItem>
                  )} />

                  <FormField control={form.control} name="bonusMalus" render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('autoPage.form.bonusMalus')}</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl><SelectTrigger><SelectValue placeholder={t('autoPage.form.bonusMalusPlaceholder')} /></SelectTrigger></FormControl>
                        <SelectContent className="max-h-[300px]">
                          <SelectItem value="0.50">{t('autoPage.form.bonus050')}</SelectItem>
                          <SelectItem value="0.60">{t('autoPage.form.bonus060')}</SelectItem>
                          <SelectItem value="0.70">{t('autoPage.form.bonus070')}</SelectItem>
                          <SelectItem value="0.80">{t('autoPage.form.bonus080')}</SelectItem>
                          <SelectItem value="0.90">{t('autoPage.form.bonus090')}</SelectItem>
                          <SelectItem value="1.00">{t('autoPage.form.bonus100')}</SelectItem>
                          <SelectItem value="1.25">{t('autoPage.form.bonus125')}</SelectItem>
                          <SelectItem value="1.50">{t('autoPage.form.bonus150')}</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )} />

                  <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
                    {isLoading ? t('insPage.loading') : t('insPage.compareOffers')}
                  </Button>
                </form>
              </Form>
            )}
          </Card>
        </div>

        <section className="max-w-4xl mx-auto mb-16">
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="learn-more" className="border rounded-lg">
              <AccordionTrigger className="px-6 py-4 hover:no-underline">
                <span className="text-lg font-semibold flex items-center gap-2">{t('insPage.learnMore')} {t('autoPage.learnMore')}</span>
              </AccordionTrigger>
              <AccordionContent className="px-6 pb-6">
                <div className="space-y-12">
                  <InsuranceFAQ title={t('insPage.faqTitle')} faqs={[
                    { question: t('autoPage.faq1.q'), answer: t('autoPage.faq1.a') },
                    { question: t('autoPage.faq2.q'), answer: t('autoPage.faq2.a') },
                    { question: t('autoPage.faq3.q'), answer: t('autoPage.faq3.a') },
                    { question: t('autoPage.faq4.q'), answer: t('autoPage.faq4.a') },
                  ]} />
                  <SavingsCalculator />
                  <QuoteRequestForm />
                  <Testimonials />
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </section>

        <section className="max-w-2xl mx-auto text-center mb-16">
          <Card className="p-8 bg-primary/5 border-primary/20 relative overflow-visible">
            <img src={arthurFlying} alt="Arthur" className="absolute -right-6 -top-10 w-20 h-auto hidden sm:block" />
            <h2 className="text-2xl font-bold mb-4">{t('insPage.readyToSave')} {t('autoPage.readyToSave')} ?</h2>
            <p className="text-muted-foreground mb-6">{t('insPage.compareFree')}</p>
            <Button size="lg" onClick={scrollToForm} className="w-full max-w-md text-lg py-6">{t('insPage.compareNowBtn')}</Button>
          </Card>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default AssuranceAuto;
