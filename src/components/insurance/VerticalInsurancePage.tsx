import { useRef, type ReactNode } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Shield, Search, Clock } from "lucide-react";
import SEOOptimized from "@/components/SEOOptimized";
import { addServiceSchema, addFAQSchema, addInsuranceProductSchema } from "@/utils/seoUtils";
import ArthurHero from "@/components/insurance/ArthurHero";
import ExpertiseSection from "@/components/insurance/ExpertiseSection";
import InsuranceSEOTabs from "@/components/insurance/InsuranceSEOTabs";
import ProductGuaranteeTable, { type ProductKey } from "@/components/insurance/ProductGuaranteeTable";
import CourtierValueCards, { type ProductContext } from "@/components/insurance/CourtierValueCards";
import InsuranceBottomHub from "@/components/insurance/InsuranceBottomHub";
import EnBref from "@/components/seo/EnBref";
import BrandName from "@/components/BrandName";
import arthurFlying from "@/assets/mascotte/arthur-flying.webp";
import Breadcrumbs from "@/components/Breadcrumbs";
import { MultiStepQuoteForm } from "@/components/forms/MultiStepQuoteForm";
import type { InsuranceType } from "@/components/forms/stepConfigs";

export interface VerticalPageProps {
  /** Slug for currentPage in BottomHub (use existing landing key) */
  slug: string;
  /** Crumb label */
  breadcrumbLabel: string;
  /** Hero */
  heroImage: string;
  heroAlt: string;
  heroTitle: string;
  heroSubtitle: string;
  /** SEO */
  seoTitle: string;
  seoDescription: string;
  ogTitle?: string;
  ogDescription?: string;
  canonical: string;
  keyword: string;
  keywords?: string;
  /** MultiStep insurance type (closest existing key) */
  insuranceType: InsuranceType;
  /**
   * Clé du tableau de garanties. À OMETTRE tant qu'il n'existe pas de tableau
   * propre à CE produit : ne jamais réutiliser celui d'un produit voisin
   * (prix et niveaux de garanties d'un autre produit affichés à tort).
   */
  productKey?: ProductKey;
  /**
   * Produit nommé dans le titre de CourtierValueCards. Obligatoire, sans
   * repli : l'ancien défaut "auto" affichait « pour l'assurance auto » sur des
   * pages qui n'en parlent pas.
   */
  courtierProduct: ProductContext;
  /** Advantages */
  advantages?: { title: string; description: string; icon?: any }[];
  /** FAQ */
  faqs: { question: string; answer: string }[];
  /** EnBref bullet points */
  enBrefFacts: ReactNode[];
  /** Bottom CTA */
  ctaTitle: string;
  ctaDescription: string;
  /** Service description for JSON-LD */
  serviceName: string;
  serviceDescription: string;
  productCategory: string;
  ratingValue?: number;
  reviewCount?: number;
  /** Expertise display label */
  expertiseLabel: string;
  /**
   * Points d'expertise personnalisés pour ExpertiseSection — à fournir dès
   * que le défaut du composant ("50+ compagnies d'assurance partenaires
   * comparées") ne correspond pas à la réalité de cette verticale (ex :
   * vélo, où il n'existe aucun partenaire spécialisé, seulement l'option
   * vol des assureurs habitation généralistes).
   */
  expertisePoints?: string[];
  /**
   * Schemas JSON-LD additionnels (ex : WebPage avec citation pour des
   * statistiques sourcées) — étalés APRÈS les 3 schemas par défaut. Optionnel
   * : si omis (toutes les pages actuelles sauf vélo), le JSON-LD émis reste
   * identique au caractère près à avant cet ajout.
   */
  extraSchemas?: object[];
  /**
   * Section libre insérée entre le tableau de garanties et CourtierValueCards
   * (ex : bloc de statistiques sourcées façon DirectAnswers). Optionnel : si
   * omis, rien ne change pour les pages qui ne le renseignent pas.
   */
  extraSection?: ReactNode;
}

const VerticalInsurancePage = (props: VerticalPageProps) => {
  const formRef = useRef<HTMLDivElement>(null);
  const scrollToForm = () => formRef.current?.scrollIntoView({ behavior: "smooth" });

  const serviceSchema = addServiceSchema({
    name: props.serviceName,
    description: props.serviceDescription,
    provider: "jemassuremoinscher.fr",
    areaServed: "France",
  });
  const faqSchema = addFAQSchema(props.faqs);
  const insuranceProductSchema = addInsuranceProductSchema({
    name: props.serviceName,
    description: props.serviceDescription,
    category: props.productCategory,
    url: props.canonical,
    ratingValue: props.ratingValue,
    reviewCount: props.reviewCount,
  });

  const advantages = props.advantages ?? [
    { icon: Search, title: "Comparez plusieurs assureurs", description: "Un conseiller met en regard les offres selon votre profil." },
    { icon: Clock, title: "Devis en 2 minutes", description: "Gratuit, sans engagement, sans carte bancaire." },
    { icon: Shield, title: "Courtier ORIAS", description: "Conseil expert et indépendant, 100% transparent." },
  ];

  return (
    <div className="min-h-screen">
      <SEOOptimized
        title={props.seoTitle}
        description={props.seoDescription}
        keyword={props.keyword}
        keywords={props.keywords}
        canonical={props.canonical}
        ogTitle={props.ogTitle ?? props.seoTitle}
        ogDescription={props.ogDescription ?? props.seoDescription}
        twitterDescription={props.ogDescription ?? props.seoDescription}
        jsonLd={[serviceSchema, faqSchema, insuranceProductSchema, ...(props.extraSchemas ?? [])]}
      />
      <Header />
      <Breadcrumbs items={[{ label: props.breadcrumbLabel }]} />

      <main id="main-content">
        <section className="relative pt-6 pb-10 md:pt-8 md:pb-14">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <ArthurHero
                imageSrc={props.heroImage}
                imageAlt={props.heroAlt}
                title={props.heroTitle}
                subtitle={props.heroSubtitle}
                ctaLabel="Comparer maintenant"
                onCtaClick={scrollToForm}
              />
            </div>
          </div>
        </section>

        <div className="container mx-auto px-4 py-12" data-ai-description={`${props.serviceName} — comparateur jemassuremoinscher.fr`}>
          <section className="max-w-4xl mx-auto mb-12">
            <div className="grid md:grid-cols-3 gap-6">
              {advantages.map((item, i) => {
                const Icon = item.icon ?? Shield;
                return (
                  <Card key={i} className="p-6 text-center">
                    <div className="flex justify-center mb-4">
                      <div className="p-3 rounded-full bg-primary/10">
                        <Icon className="h-8 w-8 text-primary" />
                      </div>
                    </div>
                    <h2 className="font-bold text-lg mb-2">{item.title}</h2>
                    <p className="text-muted-foreground text-sm">{item.description}</p>
                  </Card>
                );
              })}
            </div>
          </section>

          <div ref={formRef} className="mb-16 min-h-[480px]">
            <MultiStepQuoteForm insuranceType={props.insuranceType} />
          </div>

          {props.productKey && <ProductGuaranteeTable product={props.productKey} />}

          {props.extraSection}

          <CourtierValueCards product={props.courtierProduct} />

          <InsuranceSEOTabs faqTitle="Questions fréquentes" faqs={props.faqs} />

          <InsuranceBottomHub
            currentPage={props.slug}
            expertiseSection={<ExpertiseSection insuranceType={props.expertiseLabel} expertisePoints={props.expertisePoints} />}
            enBref={
              <EnBref
                facts={
                  props.enBrefFacts.length
                    ? props.enBrefFacts
                    : [
                        <>
                          <BrandName /> compare les meilleurs assureurs du marché.
                        </>,
                      ]
                }
              />
            }
            ctaTitle={props.ctaTitle}
            ctaDescription={props.ctaDescription}
            ctaButtonLabel="Obtenir mon devis gratuit"
            ctaMascotSrc={arthurFlying}
            ctaMascotAlt={`Arthur - ${props.serviceName}`}
            onCtaClick={scrollToForm}
          />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default VerticalInsurancePage;
