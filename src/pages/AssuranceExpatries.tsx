import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Globe, Shield, Clock } from "lucide-react";
import { useRef } from "react";
import SEOOptimized from "@/components/SEOOptimized";
import {
  addServiceSchema,
  addFAQSchema,
  addBreadcrumbSchema,
  addInsuranceProductSchema,
} from "@/utils/seoUtils";
import arthurFlying from "@/assets/mascotte/arthur-flying.webp";
import arthurConfident from "@/assets/mascotte/arthur-confident.webp";
import ArthurHero from "@/components/insurance/ArthurHero";
import InsuranceSEOTabs from "@/components/insurance/InsuranceSEOTabs";
import CourtierValueCards from "@/components/insurance/CourtierValueCards";
import InsuranceBottomHub from "@/components/insurance/InsuranceBottomHub";
import EnBref from "@/components/seo/EnBref";
import BrandName from "@/components/BrandName";
import Breadcrumbs from "@/components/Breadcrumbs";
import DynamicUpdateDate from "@/components/DynamicUpdateDate";
import { MultiStepQuoteForm } from "@/components/forms/MultiStepQuoteForm";

const AssuranceExpatries = () => {
  const formRef = useRef<HTMLDivElement>(null);
  const scrollToForm = () => formRef.current?.scrollIntoView({ behavior: "smooth" });

  const breadcrumbSchema = addBreadcrumbSchema([
    { name: "Accueil", url: "https://www.jemassuremoinscher.fr/" },
    { name: "Assurance Expatriés", url: "https://www.jemassuremoinscher.fr/assurance-expatries" },
  ]);
  const serviceSchema = addServiceSchema({
    name: "Comparateur Assurance Expatriés",
    description:
      "Comparez les assurances pour expatriés en France : auto, santé, habitation, prévoyance. Adapté aux visas long séjour, frontaliers et nouveaux arrivants.",
    provider: "jemassuremoinscher.fr",
    areaServed: "France",
  });
  const faqs = [
    {
      question: "Mon assurance étrangère couvre-t-elle la France ?",
      answer:
        "Partiellement et temporairement. Elle peut couvrir un séjour court (moins de 90 jours). Au-delà, vous devez souscrire un contrat français — c'est obligatoire pour l'auto et fortement recommandé pour la santé et l'habitation.",
    },
    {
      question: "Puis-je assurer un véhicule avec un permis étranger ?",
      answer:
        "Oui. Le permis étranger est accepté pendant 12 mois après obtention du titre de séjour. Aucun assureur ne peut refuser pour ce seul motif. Au-delà, échange ou passage du permis français obligatoire selon votre pays d'origine.",
    },
    {
      question: "Quelle assurance santé pour un expatrié en France ?",
      answer:
        "Une fois affilié à la Sécurité sociale (PUMA, après 3 mois de résidence stable), vous pouvez souscrire une mutuelle complémentaire française. En attendant, une assurance privée internationale est conseillée.",
    },
    {
      question: "Puis-je conserver mon bonus auto étranger ?",
      answer:
        "Oui, sous conditions. Demandez un relevé d'information à votre ancien assureur (idéalement traduit). De nombreux assureurs français en France l'acceptent partiellement pour calculer votre coefficient de réduction-majoration.",
    },
    {
      question: "Quelles garanties pour un visa long séjour ?",
      answer:
        "Pour le VLS-TS, une assurance santé minimum est exigée à l'arrivée. Pour les visas étudiants, salariés et passeport talent, la couverture sociale française couvre l'essentiel — la mutuelle complète les remboursements.",
    },
  ];
  const faqSchema = addFAQSchema(faqs);
  const insuranceProductSchema = addInsuranceProductSchema({
    name: "Assurance Expatriés",
    description:
      "Comparateur d'assurance pour expatriés en France : auto, santé, habitation, prévoyance. Adapté aux visas long séjour, nouveaux arrivants et frontaliers.",
    category: "Assurance Expatriés",
    url: "https://www.jemassuremoinscher.fr/assurance-expatries",
  });
  const advantages = [
    {
      icon: Globe,
      title: "Tous statuts acceptés",
      description: "Visa long séjour, étudiant, salarié, passeport talent, frontalier.",
    },
    { icon: Clock, title: "Devis en 2 minutes", description: "Comparez 70+ assureurs en ligne, sans engagement." },
    {
      icon: Shield,
      title: "Permis & bonus étrangers",
      description: "Permis hors UE accepté 12 mois, bonus étranger pris en compte.",
    },
  ];

  return (
    <div className="min-h-screen">
      <SEOOptimized
        title="Assurance Expatriés en France — Auto, Santé, Habitation"
        description="Expatrié en France ? Comparez auto, santé, habitation et prévoyance adaptées aux visas long séjour, frontaliers et nouveaux arrivants. Devis gratuit 2 min."
        keyword="assurance expatriés France"
        keywords="assurance expatrié, visa long séjour, permis étranger, mutuelle expatrié, frontalier, nouvel arrivant France"
        canonical="https://www.jemassuremoinscher.fr/assurance-expatries"
        jsonLd={[breadcrumbSchema, serviceSchema, faqSchema, insuranceProductSchema]}
      />
      <Header />
      <Breadcrumbs items={[{ label: "Assurance Expatriés" }]} />
      <main id="main-content">
        <section className="relative pt-6 pb-10 md:pt-8 md:pb-14">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <ArthurHero
                imageSrc={arthurFlying}
                imageAlt="Arthur en vol — assurance expatriés"
                title="Assurance Expatriés en France — Tout en un seul devis"
                subtitle="Tu viens de poser tes valises en France ? On compare pour toi auto, santé, habitation et prévoyance auprès de 70+ assureurs adaptés aux profils expatriés."
                ctaLabel="Comparer maintenant"
                onCtaClick={scrollToForm}
              />
            </div>
          </div>
        </section>

        <div className="container mx-auto px-4 py-12">
          <DynamicUpdateDate />

          <section className="max-w-4xl mx-auto mb-12">
            <div className="grid md:grid-cols-3 gap-6">
              {advantages.map((item, index) => (
                <Card key={index} className="p-6 text-center">
                  <div className="flex justify-center mb-4">
                    <div className="p-3 rounded-full bg-primary/10">
                      <item.icon className="h-8 w-8 text-primary" />
                    </div>
                  </div>
                  <h2 className="font-bold text-lg mb-2">{item.title}</h2>
                  <p className="text-muted-foreground text-sm">{item.description}</p>
                </Card>
              ))}
            </div>
          </section>

          <div ref={formRef} className="mb-16 min-h-[480px]">
            <MultiStepQuoteForm insuranceType="comparateur" />
          </div>

          <CourtierValueCards product="vie" />

          <InsuranceSEOTabs
            showGuarantees={false}
            faqTitle="Questions fréquentes — Expatriés"
            faqs={faqs}
          />

          <InsuranceBottomHub
            currentPage="vie"
            enBref={
              <EnBref
                facts={[
                  <>
                    <BrandName /> compare auto, santé, habitation et prévoyance pour les expatriés en France.
                  </>,
                  "Permis hors UE accepté 12 mois, bonus étranger pris en compte sur justificatif.",
                  "PUMA accessible après 3 mois de résidence stable — mutuelle française dès le 1er jour.",
                  "Adapté aux visas long séjour, étudiants, salariés, passeport talent et frontaliers.",
                ]}
              />
            }
            ctaTitle="Tu débarques en France ? On s'occupe de tes assurances."
            ctaDescription="Devis personnalisé en 2 minutes — gratuit et sans engagement."
            ctaButtonLabel="Comparer maintenant"
            ctaMascotSrc={arthurConfident}
            ctaMascotAlt="Arthur — assurance expatriés"
            onCtaClick={scrollToForm}
          />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AssuranceExpatries;
