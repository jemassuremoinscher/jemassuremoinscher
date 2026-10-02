import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Shield, Euro, Clock } from "lucide-react";
import { useRef } from "react";
import SEOOptimized from "@/components/SEOOptimized";
import { addServiceSchema, addFAQSchema, addInsuranceProductSchema } from "@/utils/seoUtils";
import arthurBusiness from "@/assets/mascotte/arthur-business.webp";
import ArthurHero from "@/components/insurance/ArthurHero";
import InsuranceSEOTabs from "@/components/insurance/InsuranceSEOTabs";
import ProductGuaranteeTable from "@/components/insurance/ProductGuaranteeTable";
import CourtierValueCards from "@/components/insurance/CourtierValueCards";
import InsuranceBottomHub from "@/components/insurance/InsuranceBottomHub";
import arthurFlying from "@/assets/mascotte/arthur-pointing-right.webp";
import { useLanguage } from "@/contexts/LanguageContext";
import Breadcrumbs from "@/components/Breadcrumbs";
import { MultiStepQuoteForm } from "@/components/forms/MultiStepQuoteForm";

const AssuranceMRP = () => {
  const { t } = useLanguage();
  const formRef = useRef<HTMLDivElement>(null);
  const scrollToForm = () => { formRef.current?.scrollIntoView({ behavior: 'smooth' }); };

  const serviceSchema = addServiceSchema({ name: "Comparateur Assurance MRP", description: "Comparez les assurances multirisque professionnelle.", provider: "jemassuremoinscher.fr", areaServed: "France" });
  const faqSchema = addFAQSchema([{ question: t('mrpPage.faq1.q'), answer: t('mrpPage.faq1.a') }, { question: t('mrpPage.faq2.q'), answer: t('mrpPage.faq2.a') }]);
  const insuranceProductSchema = addInsuranceProductSchema({ name: "Assurance Multirisque Professionnelle", description: "Comparateur MRP. Locaux, stock, matériel : protégez votre entreprise.", category: "Assurance Professionnelle", url: "https://www.jemassuremoinscher.fr/assurance-mrp" });
  const webPageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "url": "https://www.jemassuremoinscher.fr/assurance-mrp",
    "dateModified": "2026-09-26",
  };

  const advantages = [
    { icon: Euro, title: t('mrpPage.adv1.title'), description: t('mrpPage.adv1.desc') },
    { icon: Clock, title: t('insPage.quoteIn2min'), description: t('insPage.quoteIn2minDesc') },
    { icon: Shield, title: t('mrpPage.adv2.title'), description: t('mrpPage.adv2.desc') }
  ];

  return (
    <div className="min-h-screen">
      <SEOOptimized title={t("seo.mrp.title")} description={t("seo.mrp.description")} keyword="assurance multirisque professionnelle" keywords="MRP, assurance entreprise, assurance local professionnel, multirisque commerce" canonical="https://www.jemassuremoinscher.fr/assurance-mrp" jsonLd={[webPageSchema, serviceSchema, faqSchema, insuranceProductSchema]} />
      <Header />
      <Breadcrumbs items={[{ label: "Assurance MRP" }]} />
      <main id="main-content">
      <section className="relative pt-6 pb-10 md:pt-8 md:pb-14">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <ArthurHero
              imageSrc={arthurBusiness}
              imageAlt="Arthur en costume - MRP"
              title={t('mrpPage.title')}
              subtitle={t('mrpPage.subtitle')}
              ctaLabel={t('insPage.compareNow')}
              onCtaClick={scrollToForm}
            />
          </div>
        </div>
      </section>
      <div className="container mx-auto px-4 py-12">

        <section className="max-w-4xl mx-auto mb-8 prose prose-sm md:prose-base max-w-none">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
            La MRP est-elle <span className="text-primary">obligatoire</span> ?
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            Aucune loi n'impose une multirisque professionnelle en tant que telle. Mais l'{" "}
            <a href="https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000006442901" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-medium">
              article 1733 du Code civil
            </a>
            {" "}présume le locataire responsable en cas d'incendie du local qu'il occupe — ce qui rend une assurance pratiquement indispensable, même sans obligation légale directe. Par ailleurs, la quasi-totalité des <strong>baux commerciaux</strong> contient une clause rendant l'assurance contractuellement obligatoire, avec une attestation à fournir chaque année au bailleur : ne pas la fournir, après mise en demeure, peut exposer à la résiliation du bail.
          </p>
          <p className="text-muted-foreground leading-relaxed mt-4">
            La garantie <strong>perte d'exploitation</strong>, souvent optionnelle plutôt qu'incluse de base, indemnise la baisse de marge brute lorsqu'un sinistre garanti (incendie, dégât des eaux...) contraint à réduire ou interrompre l'activité, en couvrant aussi les charges fixes (loyer, salaires, remboursements) pendant l'arrêt forcé. La durée d'indemnisation et le délai de carence ne sont pas fixés par la loi : ils varient selon le contrat et l'assureur, généralement entre plusieurs mois et jusqu'à 3 ans selon les besoins de l'entreprise.
          </p>
          <p className="text-muted-foreground leading-relaxed mt-4">
            La MRP inclut souvent une responsabilité civile d'exploitation, mais pas la RC professionnelle liée à vos prestations : c'est le rôle de la <Link to="/assurance-rc-pro" className="text-primary hover:underline font-medium">RC Pro</Link>, obligatoire pour certaines professions réglementées et recommandée pour les autres.
          </p>
        </section>

        <section className="max-w-4xl mx-auto mb-12"><div className="grid md:grid-cols-3 gap-6">{advantages.map((item, index) => (<Card key={index} className="p-6 text-center"><div className="flex justify-center mb-4"><div className="p-3 rounded-full bg-primary/10"><item.icon className="h-8 w-8 text-primary" /></div></div><h2 className="font-bold text-lg mb-2">{item.title}</h2><p className="text-muted-foreground text-sm">{item.description}</p></Card>))}</div></section>
        <div ref={formRef} className="mb-16 min-h-[480px]"><MultiStepQuoteForm insuranceType="mrp" /></div>

        <ProductGuaranteeTable product="mrp" />

        <CourtierValueCards product="mrp" />

        <InsuranceSEOTabs
          faqTitle={t('insPage.faqTitle')}
          faqs={[
            { question: t('mrpPage.faq1.q'), answer: t('mrpPage.faq1.a') },
            { question: t('mrpPage.faq2.q'), answer: t('mrpPage.faq2.a') },
          ]}
        />

        <InsuranceBottomHub
          currentPage="mrp"
          ctaTitle={t('mrpPage.ctaTitle')}
          ctaDescription={t('mrpPage.ctaDesc')}
          ctaButtonLabel={t('insPage.compareNowBtn')}
          ctaMascotSrc={arthurFlying}
          ctaMascotAlt="Arthur - MRP"
          onCtaClick={scrollToForm}
        />
      </div>
      </main>
      <Footer />
    </div>
  );
};

export default AssuranceMRP;
