import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Shield, Euro, Clock } from "lucide-react";
import { useRef } from "react";
import SEOOptimized from "@/components/SEOOptimized";
import { addServiceSchema, addFAQSchema, addHowToSchema, addInsuranceProductSchema, addSpeakableSchema } from "@/utils/seoUtils";
import arthurScoot from "@/assets/mascotte/arthur-scoot.png?w=480&format=webp";
import ArthurHero from "@/components/insurance/ArthurHero";
import ExpertiseSection from "@/components/insurance/ExpertiseSection";
import InsuranceSEOTabs from "@/components/insurance/InsuranceSEOTabs";
import CourtierValueCards from "@/components/insurance/CourtierValueCards";
import InsuranceBottomHub from "@/components/insurance/InsuranceBottomHub";
import EnBref from "@/components/seo/EnBref";
import BrandName from "@/components/BrandName";
import arthurFlying from "@/assets/mascotte/arthur-sprint-coin.webp";
import Breadcrumbs from "@/components/Breadcrumbs";
import { MultiStepQuoteForm } from "@/components/forms/MultiStepQuoteForm";
import TrottinetteStatsAnswers from "@/components/insurance/TrottinetteStatsAnswers";
import ProductGuaranteeTable from "@/components/insurance/ProductGuaranteeTable";
import TrottinetteGuide, { TrottinetteSources, TROTTINETTE_SOURCES } from "@/components/insurance/TrottinetteGuide";
import { TROTTINETTE_RC_PRICE_MONTHLY, TROTTINETTE_RC_PRICE_ANNUAL } from "@/config/site";

// Schema WebPage avec citation de la source des statistiques du bloc
// "Trottinette électrique en France : les chiffres" (TrottinetteStatsAnswers)
// — même pattern que veloStatsWebPageSchema (src/pages/AssuranceVelo.tsx) et
// le webPageSchema de la home. URL vérifiée le 2026-09-09. Fiches
// Service-Public des sections réglementaires (TrottinetteGuide) ajoutées le
// 2026-10-03.
const trottinetteStatsWebPageSchema = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  "@id": "https://www.jemassuremoinscher.fr/assurance-trottinette#webpage",
  "url": "https://www.jemassuremoinscher.fr/assurance-trottinette",
  "name": "Assurance trottinette électrique : comparateur EDPM",
  "inLanguage": "fr-FR",
  "dateModified": "2026-10-03",
  "citation": [
    { "@type": "CreativeWork", "name": "ONISR — Bilan 2025 de la sécurité routière", "url": "https://www.onisr.securite-routiere.gouv.fr/en/road-safety-performance/annual-road-safety-reports/2025-road-safety-annual-report" },
    ...TROTTINETTE_SOURCES.map((s) => ({ "@type": "CreativeWork", "name": `Service-Public.fr — ${s.title}`, "url": s.url })),
  ],
  // Speakable ajouté le 2026-09-14 (infrastructure addSpeakableSchema,
  // seoUtils.ts) : cible le H1 et le H2 du bloc réponses courtes sourcées.
  "speakable": addSpeakableSchema(["h1", "#trottinette-stats-title"]),
};

const AssuranceTrottinette = () => {
  const formRef = useRef<HTMLDivElement>(null);
  const scrollToForm = () => {
    formRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const serviceSchema = addServiceSchema({
    name: "Comparateur Assurance Trottinette Électrique",
    description:
      `Comparez les meilleures offres d'assurance trottinette électrique (EDPM) en France. Responsabilité civile obligatoire dès ${TROTTINETTE_RC_PRICE_MONTHLY}. Devis gratuit en 2 minutes.`,
    provider: "jemassuremoinscher.fr",
    areaServed: "France",
  });

  // Mêmes étapes que la section visible « Comment s'assurer en 3 étapes »
  // (TrottinetteGuide).
  const howToSchema = addHowToSchema({
    name: "Comment s'assurer en 3 étapes",
    description: "Les vérifications à faire avant d'assurer une trottinette électrique (EDPM), d'après Service-Public.fr.",
    steps: [
      {
        name: "Vérifiez votre contrat habitation",
        text: "S'il ne prévoit pas les EDPM, il vous faut une extension de garantie ou une assurance spécifique.",
      },
      {
        name: "Vérifiez votre trottinette",
        text: "25 km/h maximum, pas de débridage, équipements obligatoires présents : l'assureur peut exiger ces conditions.",
      },
      {
        name: "Choisissez vos garanties et comparez",
        text: "La responsabilité civile est le minimum obligatoire ; dommages matériels, vol, accidents de la vie et protection juridique sont facultatifs. Faites votre demande avec le formulaire de cette page.",
      },
    ],
  });

  // Réponses reprises des fiches Service-Public lues le 3 octobre 2026 (voir
  // TrottinetteGuide) ; prix et garanties : constantes de src/config/site.ts.
  // Le même tableau alimente la FAQ visible et le JSON-LD FAQPage.
  const faqs = [
    {
      question: "L'assurance trottinette électrique est-elle obligatoire ?",
      answer:
        "Oui. La trottinette électrique est un engin de déplacement personnel motorisé (EDPM), assimilé à un véhicule terrestre à moteur : une assurance responsabilité civile est obligatoire, même si sa vitesse est limitée à 25 km/h. Elle couvre les dommages que vous causez à d'autres personnes.",
    },
    {
      question: "Quelle amende pour une trottinette électrique sans assurance ?",
      answer:
        "Circuler sans assurance est un délit puni d'une amende pouvant aller jusqu'à 3 750 €, avec immobilisation et mise en fourrière possibles. Sous conditions (notamment une première infraction, commise par une personne majeure), une amende forfaitaire de 750 € peut s'appliquer, ramenée à 600 € en cas de paiement immédiat ou dans les 15 jours.",
    },
    {
      question: "Combien coûte une assurance trottinette électrique ?",
      answer:
        `À partir de ${TROTTINETTE_RC_PRICE_MONTHLY} pour la formule Solo (responsabilité civile, garantie Mobilité et défense pénale et recours inclus). Sur une base annuelle, comptez ${TROTTINETTE_RC_PRICE_ANNUAL}. La formule Famille (souscripteur + conjoint et enfants) et la protection du conducteur sont disponibles en option ; le vol n'est pas inclus dans ce contrat, d'autres assureurs le proposent selon leurs conditions.`,
    },
    {
      question: "Que couvre une assurance trottinette électrique ?",
      answer:
        "La formule Solo couvre la responsabilité civile (dommages matériels causés aux tiers), une garantie Mobilité forfaitaire et la défense pénale et recours en cas de litige. La formule Famille étend cette couverture au conjoint et aux enfants. La protection corporelle du conducteur reste une option. Le vol n'est pas inclus dans ce contrat ; d'autres assureurs le proposent, selon leurs conditions. La casse et l'assistance dépendent aussi de l'assureur.",
    },
    {
      question: "Mon assurance habitation couvre-t-elle ma trottinette ?",
      answer:
        "Pas toujours. Votre assurance habitation ne couvre pas automatiquement les trottinettes électriques. Si votre contrat ne le prévoit pas, vous devez souscrire une extension de garantie ou une assurance spécifique EDPM.",
    },
    {
      question: "Où peut-on rouler en trottinette électrique ?",
      answer:
        "En agglomération, sur la piste cyclable lorsqu'elle existe ; à défaut, sur les routes limitées à 50 km/h, ou dans les aires piétonnes à 6 km/h sans gêner les piétons. Le trottoir est interdit, sauf autorisation du maire. Rouler hors des zones autorisées expose à une amende de 135 €.",
    },
    {
      question: "Le casque est-il obligatoire en trottinette électrique ?",
      answer:
        "Il est obligatoire, avec un équipement rétro-réfléchissant, à Paris et dans plusieurs départements, dont les Hauts-de-Seine, la Seine-Saint-Denis, le Val-de-Marne, les Alpes-Maritimes et l'Yonne (liste non exhaustive). Ailleurs, l'équipement rétro-réfléchissant est obligatoire la nuit ou quand la visibilité est insuffisante. Hors agglomération, sur les routes limitées à 80 km/h où la circulation est autorisée, le casque est obligatoire. Il l'est aussi si l'engin est requalifié en cyclomoteur.",
    },
    {
      question: "Que se passe-t-il si ma trottinette est débridée ?",
      answer:
        "Au-delà de 25 km/h, ou si elle a été débridée, la trottinette est requalifiée en cyclomoteur : l'immatriculation, une assurance deux-roues motorisé et le port du casque deviennent notamment obligatoires. L'assureur peut aussi exiger que l'engin soit bridé avant d'accepter de le garantir.",
    },
    {
      question: "Suis-je couvert si je tombe seul, sans tiers en cause ?",
      answer:
        "La responsabilité civile couvre les dommages causés aux autres. Après une chute seule, les dommages matériels de votre trottinette ou de votre casque ne sont pris en charge que si vous avez souscrit une assurance personnelle couvrant ces risques : assurance dommages, garantie accidents de la vie ou extension de votre assurance habitation.",
    },
    {
      question: "Que faire en cas de vol de ma trottinette ?",
      answer:
        "Portez plainte au commissariat ou à la gendarmerie, ou en ligne si vous ne connaissez pas l'auteur, et conservez le récépissé. La garantie vol est facultative : elle n'est pas incluse dans le contrat décrit sur cette page ; d'autres assureurs la proposent, selon leurs conditions.",
    },
  ];

  const faqSchema = addFAQSchema(faqs);

  const insuranceProductSchema = addInsuranceProductSchema({
    name: "Assurance Trottinette Électrique",
    description: `Comparateur d'assurance trottinette électrique (EDPM). RC obligatoire dès ${TROTTINETTE_RC_PRICE_MONTHLY}, garantie Mobilité, défense pénale et recours.`,
    category: "Assurance Mobilité",
    url: "https://www.jemassuremoinscher.fr/assurance-trottinette",
  });

  const advantages = [
    { icon: Euro, title: `Dès ${TROTTINETTE_RC_PRICE_MONTHLY}`, description: `Responsabilité civile obligatoire à partir de ${TROTTINETTE_RC_PRICE_MONTHLY}.` },
    { icon: Clock, title: "Devis en 2 minutes", description: "Comparez et souscrivez en ligne, sans engagement." },
    { icon: Shield, title: "Assureurs EDPM spécialisés", description: "Les spécialistes de la trottinette électrique comparés." },
  ];

  return (
    <div className="min-h-screen">
      <SEOOptimized
        title={`Assurance trottinette électrique dès ${TROTTINETTE_RC_PRICE_MONTHLY} | Devis`}
        description={`Assurance trottinette électrique (EDPM) : obligation, amende sans assurance, règles de circulation, vol. Formule Solo dès ${TROTTINETTE_RC_PRICE_MONTHLY}, devis en ligne.`}
        keyword="assurance trottinette électrique"
        keywords="assurance trottinette électrique, assurance EDPM, RC trottinette, comparateur assurance trottinette"
        canonical="https://www.jemassuremoinscher.fr/assurance-trottinette"
        ogTitle="Assurance Trottinette Électrique 2026 : Comparez les assureurs EDPM"
        ogDescription={`RC obligatoire dès ${TROTTINETTE_RC_PRICE_MONTHLY}. Garantie Mobilité, défense pénale et recours. Devis gratuit en 2 minutes.`}
        twitterDescription={`Comparez les assurances trottinette électrique en 2 minutes. RC dès ${TROTTINETTE_RC_PRICE_MONTHLY}. Gratuit et sans engagement.`}
        jsonLd={[serviceSchema, howToSchema, faqSchema, insuranceProductSchema, trottinetteStatsWebPageSchema]}
      />
      <Header />
      <Breadcrumbs items={[{ label: "Assurance Trottinette Électrique" }]} />

      <main id="main-content">
        {/* Zone 1 — Hero */}
        <section className="relative pt-6 pb-10 md:pt-8 md:pb-14">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <ArthurHero
                imageSrc={arthurScoot}
                imageAlt="Arthur mascotte jemassuremoinscher sur trottinette électrique assurée"
                title="Assurance trottinette électrique"
                subtitle={`RC obligatoire, garantie Mobilité, défense pénale et recours. Comparez les assureurs EDPM et souscrivez en ligne dès ${TROTTINETTE_RC_PRICE_MONTHLY}.`}
                ctaLabel="Comparer maintenant"
                onCtaClick={scrollToForm}
              />
            </div>
          </div>
        </section>

        <div
          className="container mx-auto px-4 py-12"
          data-ai-description={`Comparateur d'assurance trottinette électrique — jemassuremoinscher.fr compare les assureurs EDPM, RC obligatoire dès ${TROTTINETTE_RC_PRICE_MONTHLY}, devis gratuit en moins de 2 minutes`}
        >

          {/* H2 above-the-fold */}
          <section className="max-w-4xl mx-auto mb-10 prose prose-sm md:prose-base max-w-none">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
              Comment trouver la <span className="text-primary">meilleure assurance trottinette électrique</span> en 2026 ?
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              La trottinette électrique est un <Link to="/glossaire/edpm" className="text-primary hover:underline font-medium"><strong>engin de déplacement personnel motorisé (EDPM)</strong></Link>, assimilé à un véhicule terrestre à moteur : une <strong>assurance de responsabilité civile</strong> est obligatoire, même si sa vitesse maximale est limitée à 25 km/h. Rouler sans assurance est un <strong>délit puni d'une amende pouvant aller jusqu'à 3 750 €</strong>. Le contrat comparé ici couvre la <strong>responsabilité civile</strong> dès {TROTTINETTE_RC_PRICE_MONTHLY} en formule Solo, avec la <strong>garantie Mobilité</strong> et la <strong>défense pénale et recours</strong> ; la formule <strong>Famille</strong> (souscripteur + conjoint et enfants) et la <strong>protection du conducteur</strong> sont disponibles en option.
            </p>
            <ul className="text-sm text-muted-foreground mt-4 space-y-1.5 list-none pl-0">
              <li>✓ Vérifier que votre trottinette respecte les <strong>25 km/h</strong> maximum (au-delà, elle est requalifiée en cyclomoteur)</li>
              <li>✓ Comparer les formules Solo et Famille selon qui doit être couvert</li>
              <li>✓ En savoir plus sur la <Link to="/blog/trottinette-electrique-sans-assurance-delit-amende-2026" className="text-primary hover:underline font-medium">réglementation EDPM détaillée</Link></li>
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

          <ProductGuaranteeTable product="trottinette" />

          <div ref={formRef} className="mb-16 min-h-[480px]">
            <MultiStepQuoteForm insuranceType="trottinette" />
          </div>

          <TrottinetteStatsAnswers />

          <CourtierValueCards product="trottinette" />

          {/* Sections réglementaires sourcées (Service-Public.fr, 3 octobre
              2026). Remplacent l'encart « Victime d'un vol » dont le délai de
              48 heures et la « première cause de refus » n'étaient pas
              sourcés : la procédure de plainte est reprise de F1435. */}
          <TrottinetteGuide onCtaClick={scrollToForm} />

          {/* Ressources & maillage interne trottinette */}
          <section className="max-w-5xl mx-auto mb-12" aria-labelledby="trottinette-resources">
            <h2 id="trottinette-resources" className="text-2xl md:text-3xl font-bold text-foreground mb-6">
              Aller plus loin sur l'assurance trottinette électrique
            </h2>
            <div className="grid md:grid-cols-2 gap-4 mb-6">
              <Link to="/blog/trottinette-electrique-sans-assurance-delit-amende-2026" className="block p-5 rounded-xl border border-border/60 hover:border-primary hover:bg-primary/5 transition">
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
                  <span className="font-medium text-foreground">Comparer les assurances trottinette : les critères</span>
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
            answersInDom
          />

          <TrottinetteSources />

          {/* Zone 4 & 5 — Confiance + Maillage + EnBref + CTA */}
          <InsuranceBottomHub
            currentPage="trottinette"
            expertiseSection={<ExpertiseSection insuranceType="assurance trottinette électrique" />}
            enBref={
              <EnBref
                facts={[
                  <>
                    <BrandName /> compare les offres d'assureurs spécialistes EDPM.
                  </>,
                  "RC responsabilité civile obligatoire depuis 2019 pour toute trottinette électrique.",
                  `Tarif constaté : ${TROTTINETTE_RC_PRICE_MONTHLY} pour la formule Solo (RC seule).`,
                  "Attestation d'assurance délivrée après souscription.",
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
