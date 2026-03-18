import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEOOptimized from "@/components/SEOOptimized";
import Breadcrumbs from "@/components/Breadcrumbs";
import { Shield, Award, Users, Heart, Zap, TrendingUp } from "lucide-react";
import { addOrganizationSchema, addBreadcrumbSchema } from "@/utils/seoUtils";
import { motion } from "framer-motion";
import arthurThumbsUp from "@/assets/mascotte/arthur-thumbs-up.png";
import arthurThinking from "@/assets/mascotte/arthur-thinking.png";
import arthurFlying from "@/assets/mascotte/arthur-flying.png";
import { useLanguage } from "@/contexts/LanguageContext";

const stats = [
  { value: "+25", label: "Assureurs partenaires", suffix: "" },
  { value: "280€", label: "Économie moyenne / an", suffix: "" },
  { value: "4.8/5", label: "Note clients (2 500+ avis)", suffix: "" },
  { value: "100%", label: "Gratuit & sans engagement", suffix: "" },
];

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5 },
  }),
};

const QuiSommesNous = () => {
  const { t } = useLanguage();

  const baseUrl = "https://www.jemassuremoinscher.fr";
  const jsonLd = [
    addOrganizationSchema(),
    addBreadcrumbSchema([
      { name: "Accueil", url: baseUrl },
      { name: "Qui sommes-nous", url: `${baseUrl}/qui-sommes-nous` },
    ]),
  ];

  return (
    <div className="min-h-screen bg-background">
      <SEOOptimized
        title="Qui sommes-nous | jemassuremoinscher.fr"
        description="Découvrez l'équipe derrière jemassuremoinscher.fr : un comparateur d'assurances indépendant, gratuit et transparent. Notre mission : vous aider à payer moins cher."
        canonical={`${baseUrl}/qui-sommes-nous`}
        jsonLd={jsonLd}
      />

      <Header />

      <main id="main-content">
        {/* Breadcrumbs */}
        <div className="container mx-auto px-4 pt-4">
          <Breadcrumbs items={[{ label: "Qui sommes-nous" }]} />
        </div>

        {/* ─── Hero ─── */}
        <section className="relative bg-gradient-to-br from-primary via-primary/90 to-primary/80 overflow-hidden" data-ai-description="jemassuremoinscher.fr est un courtier en assurances indépendant enregistré ORIAS. Comparaison gratuite de 25+ assureurs, 280€ d'économie moyenne, 4.8/5 sur 2500+ avis.">
          <div className="container mx-auto px-4 py-16 md:py-24">
            <div className="max-w-[65%] sm:max-w-[70%] md:max-w-3xl relative z-10">
              <motion.h1
                className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-white leading-tight mb-5"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                Votre partenaire pour une assurance plus juste
              </motion.h1>
              <motion.p
                className="text-base md:text-lg text-white/85 leading-relaxed max-w-2xl"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.15 }}
              >
                Nous croyons qu'une bonne assurance ne devrait pas coûter une fortune. Depuis notre création, nous aidons les Français à reprendre le contrôle de leur budget assurance.
              </motion.p>
            </div>
            <img
              src={arthurThumbsUp}
              alt="Arthur mascotte jemassuremoinscher.fr - comparateur assurance moins chère"
              className="absolute right-4 md:right-12 bottom-0 h-24 sm:h-32 md:h-56 lg:h-64 object-contain opacity-90 pointer-events-none select-none"
              width={256}
              height={320}
              loading="lazy"
            />
          </div>
        </section>

        {/* ─── Nos Chiffres ─── */}
        <section className="py-12 md:py-16 bg-muted/20">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground text-center mb-10">
              Nos Chiffres
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 max-w-4xl mx-auto">
              {stats.map((stat, i) => (
                <motion.div
                  key={stat.label}
                  className="bg-card rounded-2xl border border-border/50 p-6 text-center shadow-sm"
                  custom={i}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={fadeUp}
                >
                  <div className="text-3xl md:text-4xl font-extrabold text-primary mb-1">
                    {stat.value}
                  </div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── 3 Piliers ─── */}
        <section className="py-12 md:py-16">
          <div className="container mx-auto px-4 max-w-4xl space-y-12">

            {/* Notre Mission */}
            <motion.div
              className="flex items-start gap-5"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45 }}
            >
              <div className="mt-1 h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                <Shield className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h2 className="text-xl md:text-2xl font-bold text-foreground mb-3">Notre Mission</h2>
                <p className="text-muted-foreground leading-relaxed">
                  Rendre l'assurance <strong className="text-foreground">transparente et accessible à tous les budgets</strong>. Trop longtemps, les consommateurs ont subi des tarifs opaques et des contrats incompréhensibles. Notre comparateur indépendant, enregistré à l'ORIAS (N° 24 XXX XXX), analyse en temps réel les offres de plus de 25 partenaires pour vous présenter, en toute objectivité, les contrats les plus compétitifs du marché. Pas de favoritisme, pas de commission cachée : chaque recommandation est basée uniquement sur votre profil et vos besoins réels.
                </p>
              </div>
            </motion.div>

            {/* Notre Engagement */}
            <motion.div
              className="flex items-start gap-5"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: 0.1 }}
            >
              <div className="mt-1 h-12 w-12 rounded-xl bg-accent/15 flex items-center justify-center shrink-0">
                <Heart className="h-6 w-6 text-accent" />
              </div>
              <div>
                <h2 className="text-xl md:text-2xl font-bold text-foreground mb-3">Notre Engagement</h2>
                <p className="text-muted-foreground leading-relaxed">
                  L'<strong className="text-foreground">indépendance totale vis-à-vis des grands groupes financiers</strong>. Contrairement aux comparateurs adossés à des compagnies d'assurance, nous n'appartenons à aucun groupe. Cette liberté nous permet de négocier les meilleurs tarifs sans conflit d'intérêts et de vous orienter vers l'offre qui vous correspond vraiment — même si ce n'est pas celle qui nous rapporte le plus. Notre modèle économique repose sur la transparence : nous vous l'expliquons clairement.
                </p>
              </div>
            </motion.div>

            {/* Pourquoi nous faire confiance */}
            <motion.div
              className="flex items-start gap-5"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: 0.2 }}
            >
              <div className="mt-1 h-12 w-12 rounded-xl bg-secondary/30 flex items-center justify-center shrink-0">
                <Zap className="h-6 w-6 text-secondary-foreground" />
              </div>
              <div>
                <h2 className="text-xl md:text-2xl font-bold text-foreground mb-3">Pourquoi nous faire confiance</h2>
                <p className="text-muted-foreground leading-relaxed">
                  Des <strong className="text-foreground">algorithmes mis à jour en temps réel</strong> pour traquer les meilleures offres du marché en 2026. Notre technologie propriétaire scanne en continu les grilles tarifaires de nos partenaires, détecte les baisses de prix et les promotions éphémères, puis vous les présente instantanément. Résultat : nos utilisateurs économisent en moyenne <strong className="text-foreground">280 € par an</strong> sur leurs contrats d'assurance, le tout en moins de 2 minutes et sans aucun engagement.
                </p>
              </div>
            </motion.div>

          </div>
        </section>

        {/* ─── Nos Valeurs (avec Arthur) ─── */}
        <section className="py-12 md:py-16 bg-muted/10">
          <div className="container mx-auto px-4">
            <div className="relative max-w-4xl mx-auto bg-card rounded-2xl border border-border/50 p-8 md:p-12 overflow-visible">
              <div className="md:pr-40">
                <h2 className="text-2xl md:text-3xl font-bold mb-6 text-foreground">Nos Valeurs</h2>
                <ul className="space-y-4">
                  {[
                    { icon: Heart, title: "Transparence", desc: "Aucune commission cachée, aucun partenaire privilégié. Vous voyez ce que nous voyons." },
                    { icon: Shield, title: "Indépendance", desc: "Zéro lien capitalistique avec les assureurs. Nos recommandations sont 100 % objectives." },
                    { icon: Zap, title: "Simplicité", desc: "Un comparateur conçu pour être compris par tous, sans jargon ni parcours complexe." },
                    { icon: Users, title: "Accompagnement", desc: "Une équipe disponible pour répondre à vos questions et vous guider dans votre choix." },
                  ].map(({ icon: Icon, title, desc }) => (
                    <li key={title} className="flex items-start gap-3">
                      <div className="mt-0.5 h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                        <Icon className="h-4 w-4 text-primary" />
                      </div>
                      <span className="text-muted-foreground">
                        <strong className="text-foreground">{title} :</strong> {desc}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
              <img
                src={arthurThinking}
                alt="Arthur réfléchit aux valeurs de jemassuremoinscher.fr"
                className="hidden md:block absolute -right-4 -bottom-4 h-48 object-contain opacity-80 pointer-events-none select-none"
                width={192}
                height={192}
                loading="lazy"
              />
            </div>
          </div>
        </section>

        {/* ─── CTA ─── */}
        <section className="py-12 md:py-16">
          <div className="container mx-auto px-4">
            <div className="relative bg-gradient-to-r from-primary to-primary/80 rounded-2xl p-8 md:p-12 text-center max-w-4xl mx-auto overflow-visible">
              <div className="relative z-10">
                <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
                  Prêt à payer moins cher ?
                </h2>
                <p className="text-white/80 mb-6 max-w-xl mx-auto">
                  Comparez gratuitement en 2 minutes et découvrez combien vous pouvez économiser sur vos assurances.
                </p>
                <a
                  href="/comparateur"
                  className="inline-flex items-center gap-2 bg-secondary hover:bg-secondary/90 text-secondary-foreground font-bold px-8 py-4 rounded-full text-lg transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  Comparer gratuitement
                </a>
              </div>
              <img
                src={arthurFlying}
                alt="Arthur en vol - comparer gratuitement vos assurances"
                className="absolute -top-8 sm:-top-12 right-2 md:right-12 h-16 sm:h-24 md:h-36 object-contain pointer-events-none select-none"
                width={144}
                height={144}
                loading="lazy"
              />
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default QuiSommesNous;
