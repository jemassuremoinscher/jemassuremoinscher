import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Shield, Users, Clock, Mountain, TreePine, PartyPopper, HardHat, Sparkles, ArrowRight, Search, FileCheck } from "lucide-react";
import { useRef } from "react";
import { Link } from "react-router-dom";
import SEOOptimized from "@/components/SEOOptimized";
import { addServiceSchema, addFAQSchema, addBreadcrumbSchema, addInsuranceProductSchema } from "@/utils/seoUtils";
import arthurClimbing from "@/assets/mascotte/arthur-climbing.webp";
import arthurKayak from "@/assets/mascotte/arthur-kayak.webp";
import arthurBtp from "@/assets/mascotte/arthur-btp.webp";
import arthurKarting from "@/assets/mascotte/arthur-karting.webp";
import ArthurHero from "@/components/insurance/ArthurHero";
import InsuranceSEOTabs from "@/components/insurance/InsuranceSEOTabs";
import CourtierValueCards from "@/components/insurance/CourtierValueCards";
import InsuranceBottomHub from "@/components/insurance/InsuranceBottomHub";
import Breadcrumbs from "@/components/Breadcrumbs";
import DynamicUpdateDate from "@/components/DynamicUpdateDate";
import { MultiStepQuoteForm } from "@/components/forms/MultiStepQuoteForm";

const AssuranceMetiersAtypiques = () => {
  const formRef = useRef<HTMLDivElement>(null);
  const scrollToForm = () => {
    formRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const breadcrumbSchema = addBreadcrumbSchema([
    { name: "Accueil", url: "https://www.jemassuremoinscher.fr/" },
    { name: "Métiers Atypiques", url: "https://www.jemassuremoinscher.fr/assurance-metiers-atypiques" },
  ]);

  const serviceSchema = addServiceSchema({
    name: "Assurance Métiers Atypiques",
    description:
      "Courtage spécialisé pour activités à risques aggravés : parcs accrobranche, sports outdoor, événementiel, BTP spécialisé, cordistes. Solutions sur-mesure auprès de 20 assureurs de niche.",
    provider: "jemassuremoinscher.fr",
    areaServed: "France",
  });

  const faqs = [
    {
      question: "Pourquoi mon assureur refuse-t-il ma RC pro métier atypique ?",
      answer:
        "Les assureurs généralistes (AXA, MAIF, Allianz) ne disposent pas de grilles tarifaires pour les activités classées « risques aggravés » : exploitation de tyroliennes, encadrement sportif, organisation d'événements > 500 personnes, travaux acrobatiques. Ils refusent par défaut. Nos courtiers sollicitent uniquement les 20 assureurs spécialisés du marché français (Hiscox, Albingia, MMA Pro Sport, Generali Évolution Pro, CFDP, Verspieren, Gras Savoye, Circles Group, Beazley, Markel, Liberty…) qui disposent de produits dédiés.",
    },
    {
      question: "Combien coûte une RC pro pour un métier atypique ?",
      answer:
        "Aucun prix instantané n'est fiable : la prime dépend du chiffre d'affaires, du nombre d'encadrants, des certifications et de l'historique sinistre. C'est pourquoi nous vous rappelons sous 10 minutes avec une estimation argumentée. À titre indicatif 2026 : exploitant accrobranche 2 800–6 500 €/an, moniteur escalade indépendant 280–1 100 €/an, organisateur festival 5 000 personnes 1 800–4 200 € pour l'événement, cordiste 1 200–2 800 €/an. Notre intervention divise généralement la facture par 2 versus une souscription en direct.",
    },
    {
      question: "Quel est le délai pour obtenir une attestation ?",
      answer:
        "Rappel sous 10 minutes après votre demande, puis attestation 48 à 72 h après réception du dossier complet (Kbis, dernier bilan, descriptif d'activité, sinistralité 5 ans). Pour un événement ponctuel avec date imminente, nous activons une procédure express sous 10 minutes.",
    },
    {
      question: "Le BCT peut-il m'imposer un assureur ?",
      answer:
        "Le Bureau Central de Tarification ne traite que la RC auto et la RC chasse. Pour les RC pro métiers atypiques, il n'existe pas de filet légal : si tous les assureurs refusent, l'activité doit être adaptée ou suspendue. C'est précisément pour éviter cette impasse que le passage par un courtier spécialisé est indispensable.",
    },
    {
      question: "Mes salariés sont-ils couverts par ma RC pro ?",
      answer:
        "Oui pour les dommages causés aux tiers dans le cadre de leur mission (RC exploitation). Non pour les dommages corporels qu'ils subiraient eux-mêmes : il faut souscrire séparément l'assurance accident du travail (AT/MP via l'URSSAF) et idéalement une garantie individuelle accident professionnelle pour compléter les indemnités CPAM.",
    },
    {
      question: "Puis-je cumuler RC pro et MRP dans un seul contrat ?",
      answer:
        "Oui, c'est même recommandé pour les exploitations avec local et matériel (parc accrobranche, salle d'escalade, atelier). Vous obtenez une protection homogène (locaux, EPI, matériel scénique, RC) avec une seule franchise et un seul interlocuteur. Nous structurons ces contrats package avec Albingia, MMA Pro et Hiscox.",
    },
    {
      question: "Qu'est-ce qu'une « surprime de profession » ?",
      answer:
        "C'est une majoration tarifaire appliquée aux métiers à sinistralité élevée. Elle peut atteindre +150 % sur la RC d'un cordiste vs un peintre standard. Notre rôle : démontrer à l'assureur que votre process (formation, EPI conformes, certifications IRATA, ECP annuels) justifie une surprime modérée voire son absence.",
    },
    {
      question: "Comment déclarer un sinistre sur un événement déjà passé ?",
      answer:
        "Vous disposez de 5 jours ouvrés à compter de la connaissance du sinistre (2 jours en cas de vol). Déclaration par e-mail à votre courtier avec : description circonstanciée, identité des victimes, témoignages, photos, procès-verbal éventuel, coordonnées des secours intervenus. Nous prenons le relais avec l'assureur pour défendre votre dossier.",
    },
  ];

  const faqSchema = addFAQSchema(faqs);

  const insuranceProductSchema = addInsuranceProductSchema({
    name: "Assurance Métiers Atypiques",
    description:
      "Courtier spécialisé activités à risques aggravés : accrobranche, sports outdoor, événementiel, BTP spécialisé. Mise en concurrence de 20 assureurs de niche. Rappel sous 10 minutes.",
    category: "RC Pro spécialisée — Métiers atypiques",
    url: "https://www.jemassuremoinscher.fr/assurance-metiers-atypiques",
  });

  const advantages = [
    {
      icon: Users,
      title: "20 assureurs de niche",
      description: "Hiscox, Albingia, MMA Pro Sport, Generali Évolution Pro, Beazley, Markel, Liberty… seuls les spécialistes appétents pour votre secteur.",
    },
    {
      icon: Clock,
      title: "Rappel & devis sous 10 minutes",
      description: "Un courtier dédié vous rappelle sous 5 minutes avec une étude personnalisée et 2 à 3 propositions argumentées.",
    },
    {
      icon: Shield,
      title: "0 refus — courtier dédié",
      description: "Un interlocuteur unique défend votre dossier auprès des assureurs et négocie les surprimes pour vous.",
    },
  ];

  const niches = [
    {
      icon: TreePine,
      title: "Parcs accrobranche & loisirs aventure",
      description: "Tyroliennes, parcours dans les arbres, via ferrata, escape outdoor, accroclim. Norme EN 15567.",
      slug: "/blog/assurance-parc-accrobranche-obligations-2026",
      arthur: arthurClimbing,
      arthurAlt: "Arthur grimpeur — assurance accrobranche",
    },
    {
      icon: Mountain,
      title: "Sports outdoor & moniteurs",
      description: "Guides de montagne, moniteurs escalade, kayak, parapente, VTT, canyoning. Code du sport L.321-1.",
      slug: "/blog/assurance-moniteur-sports-outdoor-2026",
      arthur: arthurKayak,
      arthurAlt: "Arthur kayak — assurance moniteur sport",
    },
    {
      icon: PartyPopper,
      title: "Événementiel & festivals",
      description: "Organisateurs de concerts, marathons, salons, courses d'obstacles. RC + annulation + bénévoles.",
      slug: "/blog/assurance-organisateur-evenement-festival-2026",
      arthur: arthurKarting,
      arthurAlt: "Arthur karting — assurance événement",
    },
    {
      icon: HardHat,
      title: "BTP spécialisé & métiers à risques",
      description: "Cordistes, désamianteurs, élagueurs, travaux acrobatiques, étanchéité toiture. Certifs IRATA, QualiBat.",
      slug: "/assurance-rc-pro",
      arthur: arthurBtp,
      arthurAlt: "Arthur cordiste BTP — métiers à risques",
    },
  ];

  const additionalNiches = [
    "Escape games & loisirs indoor",
    "Food trucks & restauration mobile",
    "Organisateurs de raids & trails",
    "Centres équestres & poneys-clubs",
    "Écoles de plongée sous-marine",
    "Dronistes professionnels (DGAC)",
    "Artisans pyrotechniciens",
    "Skipper & loueurs nautiques",
  ];

  return (
    <div className="min-h-screen">
      <SEOOptimized
        title="Assurance métiers atypiques | RC Pro sur mesure 2026"
        description="Courtier spécialisé métiers atypiques : accrobranche, sports outdoor, événementiel, BTP spécialisé. 20 assureurs de niche. Rappel sous 10 minutes."
        keyword="assurance métiers atypiques"
        keywords="assurance activité à risque, RC pro spécialisée, assurance accrobranche, assurance moniteur sport, assurance organisateur événement, assurance cordiste"
        canonical="https://www.jemassuremoinscher.fr/assurance-metiers-atypiques"
        jsonLd={[breadcrumbSchema, serviceSchema, faqSchema, insuranceProductSchema]}
      />
      <Header />
      <Breadcrumbs items={[{ label: "Métiers Atypiques" }]} />
      <main id="main-content">
        <section className="relative pt-6 pb-10 md:pt-8 md:pb-14">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <ArthurHero
                imageSrc={arthurClimbing}
                imageAlt="Arthur grimpeur — expert en assurances de métiers atypiques"
                title="Assurance Métiers Atypiques : couvrir l'inassurable, c'est notre métier"
                subtitle="Accrobranche, sports outdoor, événementiel, cordistes, métiers à risques aggravés… Nos courtiers négocient avec les 20 assureurs spécialisés du marché français pour vous trouver une couverture sur-mesure."
                savingsHighlight="Rappel sous 10 minutes, 0 refus"
                ctaLabel="Obtenir mon devis sur-mesure"
                onCtaClick={scrollToForm}
                savingsValue="20+"
                savingsLabel="Assureurs de niche"
                reviewsValue="0 refus"
                reviewsLabel="Courtier dédié"
              />
            </div>
          </div>
        </section>

        <div className="container mx-auto px-4 py-12">
          <DynamicUpdateDate />

          {/* Avantages */}
          <section className="max-w-4xl mx-auto mb-16">
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

          {/* Pour qui ? — Grille niches principales */}
          <section className="max-w-5xl mx-auto mb-16">
            <h2 className="text-3xl font-bold text-foreground mb-3 text-center">Pour qui ?</h2>
            <p className="text-center text-muted-foreground mb-10 max-w-2xl mx-auto">
              4 grandes familles de métiers atypiques, et autant d'expertises sectorielles. Cliquez pour découvrir nos guides dédiés.
            </p>
            <div className="grid sm:grid-cols-2 gap-5">
              {niches.map((niche) => (
                <Link
                  key={niche.slug}
                  to={niche.slug}
                  aria-label={`${niche.title} — voir le guide`}
                  className="group block rounded-[1.5rem] focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                >
                  <Card className="p-6 h-full transition-all duration-300 border-2 border-border/60 group-hover:border-primary group-hover:-translate-y-1 group-hover:shadow-[var(--shadow-hover)] group-active:translate-y-0 group-active:scale-[0.99] group-focus-visible:border-primary">
                    <div className="flex items-start gap-4">
                      <div className="w-16 h-16 shrink-0 flex items-center justify-center rounded-xl bg-primary/5 transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-3">
                        <img
                          src={niche.arthur}
                          alt={niche.arthurAlt}
                          className="w-full h-full object-contain select-none pointer-events-none"
                          width={64}
                          height={64}
                          loading="lazy"
                          onError={(e) => {
                            const img = e.currentTarget;
                            // Avoid infinite loop
                            if (img.dataset.fallback === "1") return;
                            img.dataset.fallback = "1";
                            // Inline SVG fallback — Arthur silhouette icon
                            img.src =
                              "data:image/svg+xml;utf8," +
                              encodeURIComponent(
                                `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64' fill='none'><rect width='64' height='64' rx='12' fill='hsl(262 83% 58% / 0.1)'/><circle cx='32' cy='24' r='10' fill='hsl(262 83% 58%)'/><path d='M14 54c0-10 8-16 18-16s18 6 18 16' fill='hsl(262 83% 58%)'/><circle cx='28' cy='23' r='1.6' fill='white'/><circle cx='36' cy='23' r='1.6' fill='white'/></svg>`
                              );
                            img.alt = `${niche.arthurAlt} (illustration de remplacement)`;
                          }}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-foreground group-hover:text-primary transition-colors mb-2">
                          {niche.title}
                        </h3>
                        <p className="text-sm text-muted-foreground mb-3">{niche.description}</p>
                        <span className="inline-flex items-center gap-1 text-sm font-semibold text-primary">
                          Voir le guide
                          <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1" />
                        </span>
                      </div>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>

            {/* Niches secondaires */}
            <div className="mt-8 p-6 rounded-2xl bg-muted/30 border border-border/40">
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="w-4 h-4 text-primary" />
                <h3 className="font-semibold text-foreground text-sm uppercase tracking-wide">
                  Nous couvrons aussi
                </h3>
              </div>
              <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-2 text-sm text-muted-foreground">
                {additionalNiches.map((n) => (
                  <span key={n}>• {n}</span>
                ))}
              </div>
              <p className="text-xs text-muted-foreground mt-4 italic">
                Votre activité ne figure pas ici ? Contactez-nous, nous trouvons quasi systématiquement une solution.
              </p>
            </div>
          </section>

          {/* Comment ça marche */}
          <section className="max-w-4xl mx-auto mb-16">
            <h2 className="text-3xl font-bold text-foreground mb-10 text-center">Comment ça marche ?</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {[
                { step: "1", title: "Questionnaire détaillé activité", desc: "9 questions ciblées sur votre activité, vos certifications, votre fréquentation et votre sinistralité — pour un dossier solide dès le départ." },
                { step: "2", title: "Mise en concurrence 20 assureurs", desc: "Nous sollicitons uniquement les assureurs spécialisés ayant un appétit pour votre secteur — pas de refus inutiles." },
                { step: "3", title: "Rappel & propositions sous 10 minutes", desc: "Un courtier dédié vous rappelle sous 5 minutes avec 2 à 3 propositions argumentées. Souscription et attestation immédiate à la signature." },
              ].map((s) => (
                <Card key={s.step} className="p-6">
                  <div className="text-5xl font-bold text-primary/20 mb-3">{s.step}</div>
                  <h3 className="font-bold text-lg mb-2">{s.title}</h3>
                  <p className="text-sm text-muted-foreground">{s.desc}</p>
                </Card>
              ))}
            </div>
          </section>

          {/* Formulaire devis */}
          <div ref={formRef} className="mb-16 min-h-[480px]">
            <MultiStepQuoteForm insuranceType="metiers_atypiques" />
          </div>

          <CourtierValueCards product="metiers-atypiques" />

          {/* SEO Tabs (FAQ + Garanties) */}
          <InsuranceSEOTabs faqTitle="Questions fréquentes — Métiers atypiques" faqs={faqs} showGuarantees={false} />

          {/* Bloc SEO 400+ mots */}
          <section className="max-w-3xl mx-auto mb-16 prose prose-sm md:prose-base text-muted-foreground leading-relaxed [&_strong]:text-foreground [&_h2]:text-foreground [&_h3]:text-foreground">
            <h2 className="text-2xl font-bold mb-6">Pourquoi un courtier spécialisé pour les métiers atypiques ?</h2>
            <div className="grid md:grid-cols-2 gap-5 not-prose mb-8">
              {[
                { icon: Search, title: "Accès aux assureurs de niche", desc: "Hiscox, Albingia, CFDP, MMA Pro Sport, Generali Évolution Pro, Beazley ou Markel disposent de produits dédiés, mais demandent un dossier technique bien présenté." },
                { icon: FileCheck, title: "Dossier défendu", desc: "Nous valorisons vos certifications, procédures, contrôles, fréquentation et sinistralité pour éviter les refus automatiques et les surprimes injustifiées." },
                { icon: Shield, title: "Couverture structurée", desc: "RC exploitation, individuelle accident, matériel, annulation, protection juridique ou perte d'exploitation : chaque garantie est calibrée selon votre activité réelle." },
                { icon: Users, title: "Expérience terrain", desc: "Depuis 2018, notre cellule Métiers Atypiques accompagne des moniteurs outdoor, exploitants accrobranche, organisateurs d'événements et cordistes." },
              ].map((item) => (
                <Card key={item.title} className="p-6 h-full border-2 border-border/60">
                  <div className="p-3 rounded-2xl bg-primary/10 w-fit mb-4">
                    <item.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-bold text-foreground mb-2">{item.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
                </Card>
              ))}
            </div>
            <h3 className="text-xl font-bold mt-6 mb-3">Notre méthode en 3 piliers</h3>
            <ul>
              <li><strong>Audit de risque sectoriel</strong> — Nous cartographions vos expositions réelles : corporel (chutes, blessures clients/salariés), matériel (EPI, scènes, chapiteaux), juridique (mise en cause après accident), financier (annulation, perte exploitation).</li>
              <li><strong>Plaidoyer technique auprès des assureurs</strong> — Nous valorisons vos certifications (IRATA, BPJEPS, ECP, QualiBat, IATA), vos process internes, votre sinistralité réelle, pour décrocher des surprimes modérées voire nulles.</li>
              <li><strong>Suivi sinistre dédié</strong> — En cas de sinistre, votre courtier prend la main face à l'assureur. Nous avons indemnisé 14 M€ en 2025 pour nos clients métiers atypiques.</li>
            </ul>
            <h3 className="text-xl font-bold mt-6 mb-3">Garanties indispensables selon votre activité</h3>
            <p>
              La <strong>RC Pro exploitation</strong> reste le socle, mais elle ne suffit jamais seule. Selon votre métier, complétez avec : <strong>RC organisateur</strong> (événementiel), <strong>individuelle accident participants</strong> (sports outdoor), <strong>dommages matériel professionnel</strong> (EPI cordistes, lignes de vie), <strong>annulation événement</strong> (festivals, courses), <strong>protection juridique sectorielle</strong>, <strong>cyber</strong> (billetterie, données clients), <strong>perte d'exploitation</strong> (parcs, salles indoor).
            </p>
            <p>
              Nos contrats sont structurés en <strong>package modulaire</strong> : vous payez uniquement ce dont vous avez besoin, et vous ajustez vos garanties à la saison (utile pour les activités saisonnières comme le ski, le canyoning ou les festivals d'été). Un <strong>seul interlocuteur</strong>, une <strong>seule franchise</strong>, une attestation unique à présenter aux donneurs d'ordres.
            </p>
            <p className="text-sm">
              <strong>Liens utiles :</strong> <Link to="/assurance-rc-pro" className="text-primary hover:underline">RC Pro standard</Link> · <Link to="/assurance-mrp" className="text-primary hover:underline">MRP locaux pro</Link> · <Link to="/blog/assurance-parc-accrobranche-obligations-2026" className="text-primary hover:underline">Guide accrobranche</Link> · <Link to="/blog/assurance-moniteur-sports-outdoor-2026" className="text-primary hover:underline">Guide moniteurs sport</Link> · <Link to="/blog/assurance-organisateur-evenement-festival-2026" className="text-primary hover:underline">Guide événementiel</Link>
            </p>
          </section>

          {/* Cas clients */}
          <section className="max-w-4xl mx-auto mb-16">
            <h2 className="text-2xl font-bold text-foreground mb-8 text-center">Ils nous ont fait confiance</h2>
            <div className="grid md:grid-cols-3 gap-5">
              {[
                {
                  title: "Parc accrobranche, Ardèche",
                  quote: "Refusés par 6 assureurs après un sinistre corporel en 2024. Jemassuremoinscher a placé notre RC chez Albingia en 5 jours, prime divisée par 1,8.",
                  who: "Julien, gérant — 45 000 visiteurs/an",
                },
                {
                  title: "Moniteur escalade, Chamonix",
                  quote: "Auto-entrepreneur multi-disciplines (escalade, alpi, ski de rando). Couverture unique chez MMA Pro Sport pour 720 €/an au lieu de 1 600 € en direct.",
                  who: "Camille, BE alpinisme",
                },
                {
                  title: "Organisateur trail, Pyrénées",
                  quote: "Trail de 2 200 coureurs annulé pour intempéries en 2025. Indemnisation à 92 % grâce à la garantie annulation négociée par leurs courtiers.",
                  who: "Marc, association sportive",
                },
              ].map((c) => (
                <Card key={c.title} className="p-5">
                  <h3 className="font-bold text-foreground mb-2 text-sm uppercase tracking-wide">{c.title}</h3>
                  <p className="text-sm text-muted-foreground italic mb-3">« {c.quote} »</p>
                  <p className="text-xs text-foreground font-medium">— {c.who}</p>
                </Card>
              ))}
            </div>
          </section>

          {/* Bottom Hub */}
          <InsuranceBottomHub
            currentPage="rcpro"
            ctaTitle="Votre activité mérite une couverture sur-mesure"
            ctaDescription="Demande de rappel gratuite et sans engagement. Un courtier dédié vous rappelle sous 5 minutes avec une étude personnalisée et 2 à 3 propositions argumentées."
            ctaButtonLabel="Demander mon rappel sous 10 minutes"
            ctaMascotSrc={arthurBtp}
            ctaMascotAlt="Arthur — Métiers Atypiques"
            onCtaClick={scrollToForm}
          />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AssuranceMetiersAtypiques;
