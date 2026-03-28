import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEOOptimized from "@/components/SEOOptimized";
import Breadcrumbs from "@/components/Breadcrumbs";
import { Shield, Award, Users, Heart, Zap, Search, BarChart3, Handshake, CheckCircle, Lock, BadgeCheck, Scale, Star } from "lucide-react";
import { addOrganizationSchema, addBreadcrumbSchema } from "@/utils/seoUtils";
import { motion } from "framer-motion";
import arthurThumbsUp from "@/assets/mascotte/arthur-thumbs-up.webp";
import arthurFlying from "@/assets/mascotte/arthur-flying.webp";
import arthurPointing from "@/assets/mascotte/arthur-pointing.webp";
import oriasLogo from "@/assets/logos/orias.jpg";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";

const stats = [
  { value: "+25", label: "Assureurs partenaires" },
  { value: "280€", label: "Économie moyenne / an" },
  { value: "4.8/5", label: "Note clients (2 500+ avis)" },
  { value: "100%", label: "Gratuit & sans engagement" },
];

const team = [
  { name: "Paul", role: "Co-fondateur", initials: "P", color: "bg-primary" },
  { name: "Alexandre", role: "Co-fondateur", initials: "A", color: "bg-accent" },
];

const methodology = [
  {
    step: 1,
    icon: Search,
    title: "Analyse de votre profil",
    desc: "Nous recueillons vos besoins réels en 2 minutes : type de couverture, budget, situation personnelle.",
  },
  {
    step: 2,
    icon: BarChart3,
    title: "Comparaison de 50+ assureurs",
    desc: "Notre algorithme interroge en temps réel les grilles tarifaires de nos partenaires pour trouver les meilleures offres.",
  },
  {
    step: 3,
    icon: Scale,
    title: "Sélection impartiale",
    desc: "Aucun favoritisme : les résultats sont classés par rapport qualité-prix, adaptés à votre profil uniquement.",
  },
  {
    step: 4,
    icon: Handshake,
    title: "Accompagnement personnalisé",
    desc: "Un conseiller dédié vous rappelle sous 2h pour finaliser votre choix et gérer la résiliation de votre ancien contrat.",
  },
];

const certifications = [
  {
    icon: BadgeCheck,
    title: "Enregistré ORIAS",
    desc: "Courtier immatriculé N° 24 XXX XXX — vérifiable sur orias.fr",
  },
  {
    icon: Shield,
    title: "Garantie Financière",
    desc: "Couvert par une assurance RC Pro et une garantie financière conforme",
  },
  {
    icon: Lock,
    title: "Paiement sécurisé",
    desc: "Transactions cryptées SSL — aucune donnée bancaire stockée",
  },
  {
    icon: Award,
    title: "Membre CSCA",
    desc: "Adhérent à la Chambre Syndicale des Courtiers d'Assurances",
  },
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
        description="Découvrez l'équipe derrière jemassuremoinscher.fr : un courtier en assurances indépendant, enregistré ORIAS, gratuit et transparent. Notre mission : rendre l'assurance moins chère."
        canonical={`${baseUrl}/qui-sommes-nous`}
        jsonLd={jsonLd}
      />

      <Header />

      <main id="main-content">
        <div className="container mx-auto px-4 pt-4">
          <Breadcrumbs items={[{ label: "Qui sommes-nous" }]} />
        </div>

        {/* ─── Hero ─── */}
        <section className="relative bg-gradient-to-br from-primary via-primary/90 to-primary/80 overflow-hidden">
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
              alt="Arthur mascotte jemassuremoinscher.fr"
              className="absolute right-4 md:right-12 bottom-0 h-24 sm:h-32 md:h-56 lg:h-64 object-contain opacity-90 pointer-events-none select-none"
              width={256}
              height={320}
              loading="eager"
            />
          </div>
        </section>

        {/* ─── Chiffres clés ─── */}
        <section className="py-12 md:py-16 bg-muted/20">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 md:gap-6 max-w-4xl mx-auto">
              {stats.map((stat, i) => (
                <motion.div
                  key={stat.label}
                  className="bg-card rounded-2xl border border-border/50 p-5 md:p-6 text-center shadow-sm"
                  custom={i}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={fadeUp}
                >
                  <div className="text-2xl md:text-4xl font-extrabold text-primary mb-1">
                    {stat.value}
                  </div>
                  <div className="text-xs md:text-sm text-muted-foreground">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── Notre Mission ─── */}
        <section className="py-14 md:py-20">
          <div className="container mx-auto px-4 max-w-4xl">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                  <Heart className="h-6 w-6 text-primary" />
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-foreground">Notre Mission</h2>
              </div>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>
                  Rendre l'assurance <strong className="text-foreground">transparente, compréhensible et moins chère</strong> pour tous les Français. Trop longtemps, les consommateurs ont subi des tarifs opaques, des contrats incompréhensibles et des renouvellements automatiques sans négociation.
                </p>
                <p>
                  Notre comparateur indépendant, enregistré à l'<strong className="text-foreground">ORIAS</strong>, analyse en temps réel les offres de plus de 50 partenaires pour vous présenter, en toute objectivité, les contrats les plus compétitifs du marché. <strong className="text-foreground">Pas de favoritisme, pas de commission cachée</strong> : chaque recommandation est basée uniquement sur votre profil et vos besoins réels.
                </p>
              </div>
            </motion.div>

            {/* Valeurs en grille */}
            <div className="grid sm:grid-cols-2 gap-4 mt-10">
              {[
                { icon: Shield, title: "Indépendance", desc: "Zéro lien capitalistique avec les assureurs. Recommandations 100 % objectives." },
                { icon: Heart, title: "Transparence", desc: "Aucune commission cachée. Vous voyez ce que nous voyons." },
                { icon: Zap, title: "Simplicité", desc: "Un parcours clair, sans jargon ni étapes inutiles." },
                { icon: Users, title: "Accompagnement", desc: "Une équipe disponible pour vous guider dans votre choix." },
              ].map(({ icon: Icon, title, desc }, i) => (
                <motion.div
                  key={title}
                  className="flex items-start gap-3 bg-card rounded-xl border border-border/40 p-5"
                  custom={i}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={fadeUp}
                >
                  <div className="mt-0.5 h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <Icon className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground text-sm">{title}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── L'Équipe ─── */}
        <section className="py-14 md:py-20 bg-muted/10">
          <div className="container mx-auto px-4 max-w-4xl">
            <motion.div
              className="text-center mb-10"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-3">L'équipe derrière le comparateur</h2>
              <p className="text-muted-foreground max-w-xl mx-auto">
                De vrais humains, passionnés par l'assurance et la technologie, qui travaillent chaque jour pour vous faire économiser.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-lg mx-auto">
              {team.map((member, i) => (
                <motion.div
                  key={member.name}
                  custom={i}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={fadeUp}
                >
                  <Card className="text-center p-6 md:p-8">
                    <CardContent className="p-0 flex flex-col items-center gap-4">
                      <Avatar className="h-20 w-20 md:h-24 md:w-24 text-2xl">
                        <AvatarFallback className={`${member.color} text-white font-bold text-2xl md:text-3xl`}>
                          {member.initials}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-lg font-bold text-foreground">{member.name}</p>
                        <p className="text-sm text-muted-foreground">{member.role}</p>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── Méthodologie (Timeline) ─── */}
        <section className="py-14 md:py-20">
          <div className="container mx-auto px-4 max-w-4xl">
            <motion.div
              className="text-center mb-12"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-3">
                Notre méthodologie
              </h2>
              <p className="text-muted-foreground max-w-xl mx-auto">
                Comment nous comparons plus de 50 assureurs pour vous trouver le meilleur tarif.
              </p>
            </motion.div>

            {/* Vertical timeline */}
            <div className="relative">
              {/* Vertical line */}
              <div className="absolute left-5 md:left-1/2 top-0 bottom-0 w-px bg-border md:-translate-x-px" aria-hidden="true" />

              <div className="space-y-8 md:space-y-12">
                {methodology.map(({ step, icon: Icon, title, desc }, i) => {
                  const isLeft = i % 2 === 0;
                  return (
                    <motion.div
                      key={step}
                      className="relative flex items-start gap-4 md:gap-0"
                      custom={i}
                      initial="hidden"
                      whileInView="visible"
                      viewport={{ once: true }}
                      variants={fadeUp}
                    >
                      {/* Step circle — mobile: left-aligned, desktop: centered */}
                      <div className="relative z-10 shrink-0 md:absolute md:left-1/2 md:-translate-x-1/2">
                        <div className="h-10 w-10 rounded-full bg-primary text-white flex items-center justify-center font-bold text-sm shadow-md">
                          {step}
                        </div>
                      </div>

                      {/* Content card */}
                      <div className={`flex-1 md:w-[calc(50%-2.5rem)] ${isLeft ? 'md:mr-auto md:pr-10' : 'md:ml-auto md:pl-10'}`}>
                        <div className="bg-card rounded-xl border border-border/40 p-5 shadow-sm">
                          <div className="flex items-center gap-2 mb-2">
                            <Icon className="h-5 w-5 text-primary" />
                            <h3 className="font-bold text-foreground">{title}</h3>
                          </div>
                          <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* ─── Certifications & Conformité ─── */}
        <section className="py-14 md:py-20 bg-muted/10">
          <div className="container mx-auto px-4 max-w-5xl">
            <motion.div
              className="text-center mb-10"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-3">
                Nos certifications & garanties légales
              </h2>
              <p className="text-muted-foreground max-w-xl mx-auto">
                Votre sécurité est notre priorité. Nous respectons les plus hauts standards réglementaires du courtage en assurances.
              </p>
            </motion.div>

            <div className="relative">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
                {certifications.map(({ icon: Icon, title, desc }, i) => (
                  <motion.div
                    key={title}
                    custom={i}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={fadeUp}
                  >
                    <Card className="h-full text-center p-5 md:p-6 border-primary/20 hover:border-primary/40 transition-colors">
                      <CardContent className="p-0 flex flex-col items-center gap-3">
                        <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                          <Icon className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                          <p className="font-bold text-foreground text-sm">{title}</p>
                          <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{desc}</p>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>

              {/* Arthur pointing */}
              <img
                src={arthurPointing}
                alt="Arthur présente les certifications de jemassuremoinscher.fr"
                className="hidden lg:block absolute -right-8 -bottom-12 h-36 object-contain opacity-80 pointer-events-none select-none"
                width={144}
                height={180}
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
                  aria-label="Comparer gratuitement vos assurances"
                  className="inline-flex items-center gap-2 bg-secondary hover:bg-secondary/90 text-secondary-foreground font-bold px-8 py-4 rounded-full text-lg transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  Comparer gratuitement
                </a>
              </div>
              <img
                src={arthurFlying}
                alt="Arthur en vol"
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
