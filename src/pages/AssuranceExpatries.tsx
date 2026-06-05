import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Globe, Shield, Clock, Plane, MapPin } from "lucide-react";
import { useRef, useState } from "react";
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
import { useLanguage } from "@/contexts/LanguageContext";

type Audience = "in-france" | "abroad";

const AssuranceExpatries = () => {
  const { t } = useLanguage();
  const formRef = useRef<HTMLDivElement>(null);
  const [audience, setAudience] = useState<Audience>("in-france");
  const scrollToForm = () => formRef.current?.scrollIntoView({ behavior: "smooth" });

  const breadcrumbSchema = addBreadcrumbSchema([
    { name: "Accueil", url: "https://www.jemassuremoinscher.fr/" },
    { name: "Assurance Expatriés", url: "https://www.jemassuremoinscher.fr/assurance-expatries" },
  ]);
  const serviceSchema = addServiceSchema({
    name: "Comparateur Assurance Expatriés",
    description:
      "Comparez les assurances pour expatriés : Français à l'étranger (santé internationale, rapatriement, prévoyance) et étrangers en France (auto, santé, habitation, visa long séjour).",
    provider: "jemassuremoinscher.fr",
    areaServed: "Worldwide",
  });

  const faqsInFrance = [
    {
      question: "Mon assurance étrangère couvre-t-elle la France ?",
      answer:
        "Partiellement et temporairement. Elle peut couvrir un séjour court (moins de 90 jours). Au-delà, tu dois souscrire un contrat français — c'est obligatoire pour l'auto et fortement recommandé pour la santé et l'habitation.",
    },
    {
      question: "Puis-je assurer un véhicule avec un permis étranger ?",
      answer:
        "Oui. Le permis étranger est accepté pendant 12 mois après obtention du titre de séjour. Aucun assureur ne peut refuser pour ce seul motif. Au-delà, échange ou passage du permis français selon ton pays d'origine.",
    },
    {
      question: "Quelle assurance santé pour un expatrié en France ?",
      answer:
        "Une fois affilié à la Sécurité sociale (PUMA, après 3 mois de résidence stable), tu peux souscrire une mutuelle complémentaire française. En attendant, une assurance privée internationale est conseillée.",
    },
    {
      question: "Puis-je conserver mon bonus auto étranger ?",
      answer:
        "Oui, sous conditions. Demande un relevé d'information à ton ancien assureur (idéalement traduit). De nombreux assureurs français l'acceptent partiellement pour calculer ton coefficient bonus-malus.",
    },
    {
      question: "Quelles garanties pour un visa long séjour ?",
      answer:
        "Pour le VLS-TS, une assurance santé minimum est exigée à l'arrivée. Pour les visas étudiants, salariés et passeport talent, la couverture sociale française couvre l'essentiel — la mutuelle complète les remboursements.",
    },
  ];

  const faqsAbroad = [
    {
      question: "Suis-je toujours couvert par la Sécu si je pars à l'étranger ?",
      answer:
        "Non, dès que tu deviens résident fiscal d'un autre pays, tu sors du régime général. Une assurance santé internationale (CFE + complémentaire, ou 1er euro) devient indispensable pour éviter les frais médicaux à 100%.",
    },
    {
      question: "CFE ou assurance au 1er euro : que choisir ?",
      answer:
        "La CFE rembourse comme la Sécu française mais sur facture (avance des frais). L'assurance au 1er euro couvre directement les vrais coûts locaux (utile aux USA, Asie, où la santé coûte cher). On compare les deux options pour ton pays.",
    },
    {
      question: "Que devient mon assurance habitation française ?",
      answer:
        "Elle ne couvre plus une résidence à l'étranger. Tu dois souscrire localement OU choisir une assurance habitation expatrié internationale. Garde une assurance PNO si tu loues ton bien en France.",
    },
    {
      question: "Et l'assurance vie / prévoyance ?",
      answer:
        "Tes contrats français restent valides à l'étranger, mais la fiscalité change selon ta résidence. La prévoyance expatrié (décès, invalidité, rapatriement) est complémentaire et couvre les risques que les contrats locaux ignorent.",
    },
    {
      question: "Faut-il garder une assurance auto en France ?",
      answer:
        "Si tu gardes une voiture stockée en France, oui (RC minimum). Si tu vends ou exportes, résilie. Si tu loues régulièrement en France, une assurance non-propriétaire peut suffire.",
    },
  ];

  const faqs = audience === "in-france" ? faqsInFrance : faqsAbroad;
  const faqSchema = addFAQSchema(faqs);
  const insuranceProductSchema = addInsuranceProductSchema({
    name: "Assurance Expatriés",
    description:
      "Comparateur d'assurance pour expatriés : Français à l'étranger et étrangers en France. Auto, santé, habitation, prévoyance, rapatriement.",
    category: "Assurance Expatriés",
    url: "https://www.jemassuremoinscher.fr/assurance-expatries",
  });

  const advantagesInFrance = [
    { icon: Globe, title: "Tous statuts acceptés", description: "Visa long séjour, étudiant, salarié, passeport talent, frontalier." },
    { icon: Clock, title: "Devis en 2 minutes", description: "Compare 70+ assureurs en ligne, sans engagement." },
    { icon: Shield, title: "Permis & bonus étrangers", description: "Permis hors UE accepté 12 mois, bonus étranger pris en compte." },
  ];
  const advantagesAbroad = [
    { icon: Plane, title: "Couverture mondiale", description: "Santé, rapatriement, prévoyance valides dans plus de 180 pays." },
    { icon: Shield, title: "CFE ou 1er euro", description: "On compare les deux formules selon ton pays d'expatriation." },
    { icon: MapPin, title: "Conseils par pays", description: "Spécificités USA, Canada, Asie, Émirats, Afrique : adaptés à ta destination." },
  ];
  const advantages = audience === "in-france" ? advantagesInFrance : advantagesAbroad;

  // Form: santé pour expat à l'étranger (couverture la + demandée), comparateur global pour étrangers en FR
  const formInsuranceType = audience === "in-france" ? "comparateur" : "sante";

  return (
    <div className="min-h-screen">
      <SEOOptimized
        title={t("seo.expatries.title")}
        description={t("seo.expatries.description")}
        keyword="assurance expatriés"
        keywords="assurance expatrié, français à l'étranger, étranger en France, CFE, 1er euro, visa long séjour, rapatriement, mutuelle expat"
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
                title="Assurance Expatriés — Où que tu sois, on te couvre"
                subtitle="Tu pars vivre à l'étranger ? Tu viens d'arriver en France ? On compare santé, auto, habitation et prévoyance auprès de 70+ assureurs spécialisés expat."
                ctaLabel="Comparer maintenant"
                onCtaClick={scrollToForm}
              />
            </div>
          </div>
        </section>

        <div className="container mx-auto px-4 py-12">
          <DynamicUpdateDate />

          {/* Audience selector */}
          <div className="max-w-3xl mx-auto mb-10">
            <div className="glass-card rounded-full p-1.5 flex gap-1.5">
              <button
                type="button"
                onClick={() => setAudience("in-france")}
                aria-pressed={audience === "in-france"}
                className={`flex-1 rounded-full px-4 py-3 text-sm md:text-base font-semibold transition-all ${
                  audience === "in-france"
                    ? "bg-primary text-primary-foreground shadow-[var(--shadow-card)]"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                🇫🇷 Étranger en France
              </button>
              <button
                type="button"
                onClick={() => setAudience("abroad")}
                aria-pressed={audience === "abroad"}
                className={`flex-1 rounded-full px-4 py-3 text-sm md:text-base font-semibold transition-all ${
                  audience === "abroad"
                    ? "bg-primary text-primary-foreground shadow-[var(--shadow-card)]"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                ✈️ Français à l'étranger
              </button>
            </div>
          </div>

          <section className="max-w-4xl mx-auto mb-12">
            <div className="grid md:grid-cols-3 gap-6">
              {advantages.map((item, index) => (
                <Card key={`${audience}-${index}`} className="p-6 text-center">
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
            <MultiStepQuoteForm
              key={formInsuranceType}
              insuranceType={formInsuranceType}
              excludeStepIds={audience === "abroad" ? ["postalCode"] : undefined}
            />
          </div>

          <CourtierValueCards product="vie" />

          <InsuranceSEOTabs
            showGuarantees={false}
            faqTitle={
              audience === "in-france"
                ? "Questions fréquentes — Étrangers en France"
                : "Questions fréquentes — Français à l'étranger"
            }
            faqs={faqs}
          />

          <InsuranceBottomHub
            currentPage="vie"
            enBref={
              <EnBref
                facts={
                  audience === "in-france"
                    ? [
                        <><BrandName /> compare auto, santé, habitation et prévoyance pour les expatriés en France.</>,
                        "Permis hors UE accepté 12 mois, bonus étranger pris en compte sur justificatif.",
                        "PUMA accessible après 3 mois de résidence stable — mutuelle française dès le 1er jour.",
                        "Adapté aux visas long séjour, étudiants, salariés, passeport talent et frontaliers.",
                      ]
                    : [
                        <><BrandName /> compare santé internationale, rapatriement et prévoyance pour Français expatriés.</>,
                        "CFE (sur facture) ou 1er euro (couverture directe) — on compare selon ton pays.",
                        "Couverture mondiale dans 180+ pays, rapatriement médical inclus.",
                        "Assurance habitation et auto en France conservées si tu gardes un bien ou un véhicule.",
                      ]
                }
              />
            }
            ctaTitle={
              audience === "in-france"
                ? "Tu débarques en France ? On s'occupe de tes assurances."
                : "Tu pars à l'étranger ? On te couvre où que tu ailles."
            }
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
