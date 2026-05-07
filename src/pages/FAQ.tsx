import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Breadcrumbs from "@/components/Breadcrumbs";
import SEOOptimized from "@/components/SEOOptimized";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Search, ShieldCheck, Wallet, FileText, Phone, HelpCircle, ArrowRight } from "lucide-react";

type FaqItem = { q: string; a: string };
type FaqCategory = {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  items: FaqItem[];
};

const categories: FaqCategory[] = [
  {
    id: "comparateur",
    label: "Le comparateur",
    icon: Search,
    items: [
      {
        q: "Comment fonctionne le comparateur jemassuremoinscher.fr ?",
        a: "Vous remplissez un formulaire en 2 minutes, nos experts analysent les offres de plus de 50 assureurs partenaires (Allianz, AXA, Groupama, MAIF, Generali, Swiss Life…) et un conseiller dédié vous rappelle sous 5 minutes avec les meilleures propositions adaptées à votre profil.",
      },
      {
        q: "La comparaison est-elle vraiment gratuite ?",
        a: "Oui, 100 % gratuite et sans engagement. Vous n'avez rien à payer pour utiliser le comparateur ni pour parler à un conseiller. Notre rémunération provient uniquement des assureurs si vous choisissez de souscrire.",
      },
      {
        q: "Combien d'assureurs comparez-vous ?",
        a: "Plus de 50 compagnies françaises et européennes, dont les leaders du marché et des assureurs spécialisés sur les profils atypiques (résiliés, malussés, métiers de niche).",
      },
      {
        q: "Quels types d'assurance puis-je comparer ?",
        a: "Auto, moto, scooter, habitation, santé, mutuelle, prévoyance, assurance vie, emprunteur, animaux, RC Pro, MRP, GLI, PNO et de nombreux contrats spécialisés.",
      },
    ],
  },
  {
    id: "tarifs",
    label: "Tarifs & économies",
    icon: Wallet,
    items: [
      {
        q: "Combien puis-je économiser en moyenne ?",
        a: "Nos clients économisent en moyenne 320 € par an sur leur assurance auto et jusqu'à 40 % sur leur mutuelle santé. Les économies dépendent de votre contrat actuel et de votre profil.",
      },
      {
        q: "Pourquoi les prix varient-ils autant entre assureurs ?",
        a: "Chaque assureur applique ses propres critères de tarification (âge, lieu de résidence, antécédents, véhicule, garanties…). Comparer permet de trouver l'assureur le mieux adapté à votre profil au meilleur prix.",
      },
      {
        q: "Le tarif proposé est-il garanti ?",
        a: "Oui, le tarif communiqué par notre conseiller est ferme et engage l'assureur, sous réserve que les informations transmises soient exactes.",
      },
    ],
  },
  {
    id: "souscription",
    label: "Souscription & contrat",
    icon: FileText,
    items: [
      {
        q: "Comment changer d'assurance facilement ?",
        a: "Grâce à la loi Hamon (depuis 2015), vous pouvez résilier votre contrat auto, moto ou habitation à tout moment après 1 an d'engagement. Notre conseiller s'occupe de toutes les démarches gratuitement.",
      },
      {
        q: "Faut-il résilier moi-même mon ancien contrat ?",
        a: "Non. Pour les contrats éligibles à la loi Hamon, votre nouvel assureur effectue la résiliation à votre place. Vous n'avez rien à faire.",
      },
      {
        q: "Combien de temps pour souscrire un nouveau contrat ?",
        a: "La souscription se fait en quelques minutes par téléphone ou en ligne. Votre attestation d'assurance vous est transmise immédiatement par email.",
      },
      {
        q: "Que se passe-t-il si je ne suis pas satisfait ?",
        a: "Vous disposez d'un délai légal de rétractation de 14 jours après la souscription d'un contrat à distance.",
      },
    ],
  },
  {
    id: "garanties",
    label: "Garanties & sinistres",
    icon: ShieldCheck,
    items: [
      {
        q: "Quelles garanties choisir pour mon assurance auto ?",
        a: "Cela dépend de l'âge et de la valeur de votre véhicule. Pour une voiture neuve : tous risques. Pour un véhicule de plus de 8 ans : tiers étendu suffit souvent. Notre conseiller vous oriente vers la formule optimale.",
      },
      {
        q: "Suis-je couvert immédiatement après la souscription ?",
        a: "Oui, dès réception de votre attestation. Vous êtes assuré sans interruption entre votre ancien et votre nouveau contrat.",
      },
      {
        q: "Comment déclarer un sinistre ?",
        a: "Contactez directement votre assureur dans les délais prévus au contrat (généralement 5 jours ouvrés, 2 jours pour un vol). Notre service après-vente peut aussi vous accompagner.",
      },
    ],
  },
  {
    id: "service",
    label: "Notre service",
    icon: Phone,
    items: [
      {
        q: "Sous combien de temps suis-je rappelé ?",
        a: "Un conseiller dédié vous rappelle sous 5 minutes pendant nos horaires d'ouverture (lundi-samedi, 9h-19h).",
      },
      {
        q: "Mes données sont-elles sécurisées ?",
        a: "Oui. Nous sommes conformes au RGPD. Vos données ne sont jamais revendues et sont uniquement utilisées pour vous proposer la meilleure offre d'assurance.",
      },
      {
        q: "Puis-je obtenir un devis sans donner mon numéro de téléphone ?",
        a: "Le téléphone est nécessaire pour qu'un conseiller puisse vous présenter les offres personnalisées et finaliser la souscription. Vous ne recevrez jamais de démarchage abusif.",
      },
    ],
  },
];

const FAQPage = () => {
  const [search, setSearch] = useState("");
  const [activeCat, setActiveCat] = useState<string>("all");

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    return categories
      .filter((c) => activeCat === "all" || c.id === activeCat)
      .map((c) => ({
        ...c,
        items: term
          ? c.items.filter(
              (it) =>
                it.q.toLowerCase().includes(term) ||
                it.a.toLowerCase().includes(term),
            )
          : c.items,
      }))
      .filter((c) => c.items.length > 0);
  }, [search, activeCat]);

  const allItems = categories.flatMap((c) => c.items);

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: allItems.map((it) => ({
      "@type": "Question",
      name: it.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: it.a,
      },
    })),
  };

  return (
    <>
      <SEOOptimized
        title="FAQ — Questions fréquentes sur la comparaison d'assurance"
        description="Toutes les réponses sur le comparateur d'assurance jemassuremoinscher.fr : fonctionnement, tarifs, souscription, garanties, sinistres et notre service de conseil."
        canonical="https://www.jemassuremoinscher.fr/faq"
        jsonLd={faqJsonLd}
      />

      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <Breadcrumbs items={[{ label: "FAQ" }]} />

        <main id="main-content" className="flex-grow">
          {/* Hero */}
          <section className="relative bg-gradient-to-br from-primary via-primary/95 to-primary/80 overflow-hidden">
            <div className="container mx-auto px-4 py-14 md:py-20">
              <div className="max-w-[65%] sm:max-w-[70%] md:max-w-2xl relative z-10">
                <Badge variant="accent" className="mb-4">
                  <HelpCircle aria-hidden="true" /> Aide & Support
                </Badge>
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
                  Questions fréquentes
                </h1>
                <p className="text-base md:text-lg text-white/85 leading-relaxed mb-6">
                  Tout ce que vous devez savoir sur la comparaison d'assurance,
                  la souscription, les garanties et notre accompagnement.
                </p>

                {/* Search */}
                <div className="relative max-w-xl">
                  <Search
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground"
                    aria-hidden="true"
                  />
                  <label htmlFor="faq-search" className="sr-only">
                    Rechercher une question
                  </label>
                  <Input
                    id="faq-search"
                    type="search"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Rechercher une question…"
                    className="pl-9 bg-white"
                  />
                </div>
              </div>
              <img
                src="/src/assets/mascotte/arthur-question.webp"
                alt="Arthur mascotte jemassuremoinscher.fr - questions fréquentes"
                className="absolute right-4 md:right-12 bottom-0 h-24 sm:h-32 md:h-48 lg:h-56 object-contain opacity-90 pointer-events-none select-none"
                width={224}
                height={280}
                loading="lazy"
              />
            </div>
          </section>

          {/* Category filter */}
          <section className="border-b border-border/40 bg-background sticky top-16 z-20">
            <div className="container mx-auto px-4 py-4">
              <div
                className="flex gap-2 overflow-x-auto scrollbar-hide"
                role="tablist"
                aria-label="Filtrer par catégorie"
              >
                <button
                  type="button"
                  role="tab"
                  aria-selected={activeCat === "all"}
                  onClick={() => setActiveCat("all")}
                  data-no-md
                  className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                    activeCat === "all"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground hover:bg-muted/70"
                  }`}
                >
                  Toutes
                </button>
                {categories.map((c) => {
                  const Icon = c.icon;
                  const active = activeCat === c.id;
                  return (
                    <button
                      key={c.id}
                      type="button"
                      role="tab"
                      aria-selected={active}
                      onClick={() => setActiveCat(c.id)}
                      data-no-md
                      className={`flex items-center gap-2 whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                        active
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-muted-foreground hover:bg-muted/70"
                      }`}
                    >
                      <Icon className="w-4 h-4" aria-hidden="true" />
                      {c.label}
                    </button>
                  );
                })}
              </div>
            </div>
          </section>

          {/* FAQ content */}
          <section className="py-12 md:py-16" aria-label="Liste des questions fréquentes">
            <div className="container mx-auto px-4 max-w-3xl">
              {filtered.length === 0 ? (
                <p className="text-center text-muted-foreground py-12">
                  Aucune question ne correspond à votre recherche.
                </p>
              ) : (
                filtered.map((cat) => {
                  const Icon = cat.icon;
                  return (
                    <div key={cat.id} className="mb-10">
                      <h2 className="flex items-center gap-2 text-xl md:text-2xl font-bold text-foreground mb-4">
                        <Icon className="w-5 h-5 text-primary" aria-hidden="true" />
                        {cat.label}
                      </h2>
                      <Accordion type="single" collapsible className="w-full">
                        {cat.items.map((it, idx) => (
                          <AccordionItem
                            key={`${cat.id}-${idx}`}
                            value={`${cat.id}-${idx}`}
                            className="border border-border/40 rounded-2xl mb-3 px-5 bg-card data-[state=open]:shadow-elevation-2 transition-shadow"
                          >
                            <AccordionTrigger className="text-left text-base md:text-lg font-semibold hover:no-underline py-4">
                              {it.q}
                            </AccordionTrigger>
                            <AccordionContent className="text-muted-foreground leading-relaxed pb-4">
                              {it.a}
                            </AccordionContent>
                          </AccordionItem>
                        ))}
                      </Accordion>
                    </div>
                  );
                })
              )}
            </div>
          </section>

          {/* CTA */}
          <section className="py-12 md:py-16 bg-muted/30 border-t border-border/40">
            <div className="container mx-auto px-4 max-w-3xl text-center">
              <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-3">
                Vous n'avez pas trouvé votre réponse ?
              </h2>
              <p className="text-muted-foreground mb-6">
                Un conseiller dédié vous rappelle sous 5 minutes, gratuitement
                et sans engagement.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button asChild size="lg">
                  <Link to="/contact">
                    Être rappelé gratuitement
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link to="/">Comparer les assurances</Link>
                </Button>
              </div>
            </div>
          </section>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default FAQPage;
