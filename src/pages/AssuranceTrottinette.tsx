import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Shield, Euro, Clock } from "lucide-react";
import { useRef } from "react";
import SEOOptimized from "@/components/SEOOptimized";
import { addServiceSchema, addFAQSchema, addHowToSchema, addInsuranceProductSchema } from "@/utils/seoUtils";
import arthurBike from "@/assets/mascotte/arthur-bike.png";
import ArthurHero from "@/components/insurance/ArthurHero";
import ExpertiseSection from "@/components/insurance/ExpertiseSection";
import InsuranceSEOTabs from "@/components/insurance/InsuranceSEOTabs";
import CourtierValueCards from "@/components/insurance/CourtierValueCards";
import InsuranceBottomHub from "@/components/insurance/InsuranceBottomHub";
import EnBref from "@/components/seo/EnBref";
import BrandName from "@/components/BrandName";
import arthurFlying from "@/assets/mascotte/arthur-sprint-coin.webp";
import Breadcrumbs from "@/components/Breadcrumbs";
import DynamicUpdateDate from "@/components/DynamicUpdateDate";
import { MultiStepQuoteForm } from "@/components/forms/MultiStepQuoteForm";

const AssuranceTrottinette = () => {
  const formRef = useRef<HTMLDivElement>(null);
  const scrollToForm = () => {
    formRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const serviceSchema = addServiceSchema({
    name: "Comparateur Assurance Trottinette Électrique",
    description:
      "Comparez les meilleures offres d'assurance trottinette électrique (EDPM) en France. Responsabilité civile obligatoire dès 3,50€/mois. Devis gratuit en 2 minutes.",
    provider: "jemassuremoinscher.fr",
    areaServed: "France",
  });

  const howToSchema = addHowToSchema({
    name: "Comment assurer sa trottinette électrique en ligne",
    description: "Guide étape par étape pour comparer et souscrire une assurance trottinette électrique (EDPM) en 2 minutes",
    totalTime: "PT2M",
    steps: [
      {
        name: "Renseignez votre trottinette",
        text: "Indiquez la marque, le modèle, la puissance et la valeur d'achat de votre trottinette électrique.",
      },
      {
        name: "Choisissez vos garanties",
        text: "Responsabilité civile obligatoire, vol, dommages, assistance : sélectionnez le niveau de couverture adapté.",
      },
      {
        name: "Comparez les offres",
        text: "Recevez instantanément plusieurs devis d'assureurs partenaires spécialistes des EDPM.",
      },
      {
        name: "Souscrivez en ligne",
        text: "Validez l'offre choisie et recevez votre attestation d'assurance immédiatement.",
      },
    ],
  });

  const faqs = [
    {
      question: "L'assurance trottinette électrique est-elle obligatoire ?",
      answer:
        "Oui. Depuis 2019, tout engin de déplacement personnel motorisé (EDPM) — dont la trottinette électrique — doit être couvert par une assurance responsabilité civile, comme un véhicule terrestre à moteur. Rouler sans assurance est un délit passible de 3 750€ d'amende.",
    },
    {
      question: "Combien coûte une assurance trottinette électrique ?",
      answer:
        "Entre 6€ et 9€/mois pour une responsabilité civile seule, et entre 12€ et 18€/mois pour une formule complète avec vol, dommages et assistance (jusqu'à 25€/mois pour un usage livraison). Le prix dépend de la valeur de la trottinette, de la zone d'usage et du niveau de garanties.",
    },
    {
      question: "Que couvre une assurance trottinette électrique ?",
      answer:
        "La RC couvre les dommages causés aux tiers (piétons, cyclistes, véhicules). Les formules complètes ajoutent le vol (avec antivol homologué), la casse accidentelle, le vandalisme, l'assistance/dépannage et parfois une garantie corporelle conducteur.",
    },
    {
      question: "Mon assurance habitation couvre-t-elle ma trottinette ?",
      answer:
        "Non pour la circulation. La RC vie privée de l'habitation ne couvre pas les EDPM en usage routier. Une assurance trottinette dédiée est indispensable dès que vous circulez sur la voie publique.",
    },
  ];

  const faqSchema = addFAQSchema(faqs);

  const insuranceProductSchema = addInsuranceProductSchema({
    name: "Assurance Trottinette Électrique",
    description: "Comparateur d'assurance trottinette électrique (EDPM). RC obligatoire dès 6€/mois, vol, casse, assistance jusqu'à 18€/mois.",
    category: "Assurance Mobilité",
    url: "https://www.jemassuremoinscher.fr/assurance-trottinette",
  });

  const advantages = [
    { icon: Euro, title: "Dès 6€/mois", description: "Responsabilité civile obligatoire à partir de 6€/mois." },
    { icon: Clock, title: "Devis en 2 minutes", description: "Comparez et souscrivez en ligne, sans engagement." },
    { icon: Shield, title: "10+ assureurs EDPM", description: "Les spécialistes de la trottinette électrique comparés." },
  ];

  return (
    <div className="min-h-screen">
      <SEOOptimized
        title="Assurance Trottinette Électrique 2026 : Comparateur EDPM dès 6€/mois"
        description="Comparez les meilleures assurances trottinette électrique (EDPM). Responsabilité civile obligatoire, vol, casse, assistance. Devis gratuit en 2 minutes."
        keyword="assurance trottinette électrique"
        keywords="assurance trottinette électrique, assurance EDPM, RC trottinette, vol trottinette, comparateur assurance trottinette"
        canonical="https://www.jemassuremoinscher.fr/assurance-trottinette"
        ogTitle="Assurance Trottinette Électrique 2026 : Comparez 10+ assureurs EDPM"
        ogDescription="RC obligatoire dès 6€/mois. Vol, casse, assistance jusqu'à 18€/mois. Devis gratuit en 2 minutes."
        twitterDescription="Comparez les assurances trottinette électrique en 2 minutes. RC dès 6€/mois. Gratuit et sans engagement."
        jsonLd={[serviceSchema, howToSchema, faqSchema, insuranceProductSchema]}
      />
      <Header />
      <Breadcrumbs items={[{ label: "Assurance Trottinette Électrique" }]} />

      <main id="main-content">
        {/* Zone 1 — Hero */}
        <section className="relative pt-6 pb-10 md:pt-8 md:pb-14">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <ArthurHero
                imageSrc={arthurBike}
                imageAlt="Arthur mascotte jemassuremoinscher sur trottinette électrique assurée"
                title="Assurance trottinette électrique"
                subtitle="RC obligatoire, vol, casse, assistance. Comparez 10+ assureurs EDPM et souscrivez en ligne dès 6€/mois."
                ctaLabel="Comparer maintenant"
                onCtaClick={scrollToForm}
              />
            </div>
          </div>
        </section>

        <div
          className="container mx-auto px-4 py-12"
          data-ai-description="Comparateur d'assurance trottinette électrique — jemassuremoinscher.fr compare 10+ assureurs EDPM, RC obligatoire dès 6€/mois, devis gratuit en moins de 2 minutes"
        >
          <DynamicUpdateDate />

          {/* H2 above-the-fold */}
          <section className="max-w-4xl mx-auto mb-10 prose prose-sm md:prose-base max-w-none">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
              Comment trouver la <span className="text-primary">meilleure assurance trottinette électrique</span> en 2026 ?
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              Depuis le <strong>décret n°2019-1082</strong>, toute trottinette électrique circulant sur la voie publique doit être couverte par une <strong>assurance responsabilité civile</strong>, comme un scooter. Rouler sans assurance est un <strong>délit puni de 3 750€ d'amende</strong>. Trois leviers déterminent votre prix : <strong>la formule</strong> (RC seule entre 6€ et 9€/mois, formule complète 12€ à 18€/mois), <strong>la valeur de la trottinette</strong> (impact fort sur les garanties vol et casse) et <strong>votre zone d'usage</strong> (grandes agglomérations = surprime vol).
            </p>
            <ul className="text-sm text-muted-foreground mt-4 space-y-1.5 list-none pl-0">
              <li>✓ Vérifier que votre trottinette respecte les <strong>25 km/h</strong> maximum (au-delà = homologation moto obligatoire)</li>
              <li>✓ Comparer RC seule vs formule complète (vol + casse + assistance)</li>
              <li>✓ Souscrire une garantie vol avec <strong>antivol homologué SRA</strong></li>
              <li>✓ En savoir plus sur la <Link to="/assurance-trottinette-electrique" className="text-primary hover:underline font-medium">réglementation EDPM détaillée</Link></li>
            </ul>
            <p className="text-xs text-muted-foreground/80 mt-4">
              Service 100% en ligne basé à Nice (06000).
            </p>
          </section>

          {/* Zone 2 — Avantages + Formulaire */}
          <section className="max-w-4xl mx-auto mb-12">
            <div className="grid md:grid-cols-3 gap-6">
              {advantages.map((item, index) => (
                <Card key={index} className="p-6 text-center">
                  <div className="flex justify-center mb-4">
                    <div className="p-3 rounded-full bg-primary/10">
                      <item.icon className="h-8 w-8 text-primary" />
                    </div>
                  </div>
                  <h3 className="font-bold text-lg mb-2">{item.title}</h3>
                  <p className="text-muted-foreground text-sm">{item.description}</p>
                </Card>
              ))}
            </div>
          </section>

          <div ref={formRef} className="mb-16 min-h-[480px]">
            <MultiStepQuoteForm insuranceType="trottinette" />
          </div>

          <CourtierValueCards product="moto" />

          {/* Ressources & maillage interne trottinette */}
          <section className="max-w-5xl mx-auto mb-12" aria-labelledby="trottinette-resources">
            <h2 id="trottinette-resources" className="text-2xl md:text-3xl font-bold text-foreground mb-6">
              Aller plus loin sur l'assurance trottinette électrique
            </h2>
            <div className="grid md:grid-cols-2 gap-4 mb-6">
              <Link to="/assurance-trottinette-electrique" className="block p-5 rounded-xl border border-border/60 hover:border-primary hover:bg-primary/5 transition">
                <div className="font-semibold text-foreground mb-1">Guide réglementation EDPM</div>
                <div className="text-sm text-muted-foreground">Loi, obligations, sanctions : tout ce qu'il faut savoir avant de rouler.</div>
              </Link>
              <Link to="/assurance-trottinette-livreur" className="block p-5 rounded-xl border border-border/60 hover:border-primary hover:bg-primary/5 transition">
                <div className="font-semibold text-foreground mb-1">Livreurs Uber Eats / Deliveroo</div>
                <div className="text-sm text-muted-foreground">Assurance pro spécifique pour usage commercial en trottinette.</div>
              </Link>
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-3">Articles conseils</h3>
            <ul className="grid md:grid-cols-3 gap-3 list-none pl-0">
              <li>
                <Link to="/blog/comparatif-assurance-trottinette-electrique-2026" className="block p-4 rounded-lg border border-border/50 hover:border-primary hover:bg-primary/5 transition text-sm">
                  <span className="font-medium text-foreground">Comparatif 2026 des meilleures assurances trottinette</span>
                </Link>
              </li>
              <li>
                <Link to="/blog/assurance-trottinette-vol-garantie-2026" className="block p-4 rounded-lg border border-border/50 hover:border-primary hover:bg-primary/5 transition text-sm">
                  <span className="font-medium text-foreground">Vol de trottinette : la garantie qui rembourse vraiment</span>
                </Link>
              </li>
              <li>
                <Link to="/blog/trottinette-electrique-sans-assurance-delit-amende-2026" className="block p-4 rounded-lg border border-border/50 hover:border-primary hover:bg-primary/5 transition text-sm">
                  <span className="font-medium text-foreground">Rouler sans assurance : délit puni jusqu'à 3 750€</span>
                </Link>
              </li>
            </ul>
          </section>

          {/* Zone 3 — FAQ + Garanties en tabs */}
          <InsuranceSEOTabs
            faqTitle="Questions fréquentes sur l'assurance trottinette électrique"
            faqs={faqs}
          />

          {/* Zone 4 & 5 — Confiance + Maillage + EnBref + CTA */}
          <InsuranceBottomHub
            currentPage="trottinette"
            expertiseSection={<ExpertiseSection insuranceType="assurance trottinette électrique" />}
            enBref={
              <EnBref
                facts={[
                  <>
                    <BrandName /> compare les offres de 10+ assureurs spécialistes EDPM.
                  </>,
                  "RC responsabilité civile obligatoire depuis 2019 pour toute trottinette électrique.",
                  "Tarif constaté : 6 à 9€/mois pour la RC seule, 12 à 18€/mois en formule complète.",
                  "Attestation d'assurance délivrée immédiatement après souscription.",
                ]}
              />
            }
            ctaTitle="Prêt à assurer votre trottinette dès aujourd'hui ?"
            ctaDescription="Comparez les assurances EDPM en 2 minutes, gratuitement."
            ctaButtonLabel="Comparer maintenant"
            ctaMascotSrc={arthurFlying}
            ctaMascotAlt="Arthur en vol - économisez sur votre assurance trottinette électrique"
            onCtaClick={scrollToForm}
          />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AssuranceTrottinette;
