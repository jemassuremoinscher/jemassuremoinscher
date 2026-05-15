import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEOOptimized from "@/components/SEOOptimized";
import Breadcrumbs from "@/components/Breadcrumbs";
import {
  Shield,
  Award,
  Users,
  Heart,
  Zap,
  Search,
  BarChart3,
  Handshake,
  CheckCircle,
  Lock,
  BadgeCheck,
  Scale,
  Star,
  Eye,
  Banknote,
} from "lucide-react";
import { addOrganizationSchema, addBreadcrumbSchema } from "@/utils/seoUtils";
import { authors, getAuthorJsonLd } from "@/data/authors";
import { motion } from "framer-motion";
import arthurThumbsUp from "@/assets/mascotte/arthur-thumbs-up.webp";
import arthurFlying from "@/assets/mascotte/arthur-flying.webp";
import arthurPointing from "@/assets/mascotte/arthur-pointing.webp";
import oriasLogo from "@/assets/logos/orias.jpg";
import cscaLogo from "@/assets/logos/csca.png";
import paulPhoto from "@/assets/team/paul.jpg";
import alexandrePhoto from "@/assets/team/alexandre.jpg";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";
import ArthurHero from "@/components/insurance/ArthurHero";

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
  // JSON-LD: org + breadcrumb + all author Person schemas
  const authorSchemas = Object.values(authors).map(getAuthorJsonLd);
  const jsonLd = [
    addOrganizationSchema(),
    addBreadcrumbSchema([
      { name: "Accueil", url: baseUrl },
      { name: "Qui sommes-nous", url: `${baseUrl}/qui-sommes-nous` },
    ]),
    ...authorSchemas,
  ];

  const stats = [
    { value: t("aboutPage.stat1Value"), label: t("aboutPage.stat1Label") },
    { value: t("aboutPage.stat2Value"), label: t("aboutPage.stat2Label") },
    { value: t("aboutPage.stat3Value"), label: t("aboutPage.stat3Label") },
    { value: t("aboutPage.stat4Value"), label: t("aboutPage.stat4Label") },
  ];

  const team = [
    { name: "Alexandre", role: t("aboutPage.cofounder"), initials: "A", color: "bg-accent", photo: alexandrePhoto },
    { name: "Paul", role: t("aboutPage.cofounder"), initials: "P", color: "bg-primary", photo: paulPhoto },
  ];

  const methodology = [
    { step: 1, icon: Search, title: t("aboutPage.step1Title"), desc: t("aboutPage.step1Desc") },
    { step: 2, icon: BarChart3, title: t("aboutPage.step2Title"), desc: t("aboutPage.step2Desc") },
    { step: 3, icon: Scale, title: t("aboutPage.step3Title"), desc: t("aboutPage.step3Desc") },
    { step: 4, icon: Handshake, title: t("aboutPage.step4Title"), desc: t("aboutPage.step4Desc") },
  ];

  const values = [
    { icon: Shield, title: t("aboutPage.independence"), desc: t("aboutPage.independenceDesc") },
    { icon: Heart, title: t("aboutPage.transparency"), desc: t("aboutPage.transparencyDesc") },
    { icon: Zap, title: t("aboutPage.simplicity"), desc: t("aboutPage.simplicityDesc") },
    { icon: Users, title: t("aboutPage.support"), desc: t("aboutPage.supportDesc") },
  ];

  return (
    <div className="min-h-screen bg-background">
      <SEOOptimized
        title="Qui sommes-nous | jemassuremoinscher.fr"
        description="Découvrez l'équipe derrière jemassuremoinscher.fr : un courtier en assurances indépendant, enregistré ORIAS, gratuit et transparent."
        canonical={`${baseUrl}/qui-sommes-nous`}
        ogTitle="Qui sommes-nous ? | jemassuremoinscher.fr — Courtier indépendant enregistré ORIAS"
        ogDescription="Découvrez l'équipe derrière jemassuremoinscher.fr : courtier en assurances indépendant, enregistré ORIAS, gratuit et 100% transparent."
        twitterDescription="Courtier en assurances indépendant, enregistré ORIAS. Comparez 50+ assureurs gratuitement sur jemassuremoinscher.fr."
        jsonLd={jsonLd}
      />

      <Header />

      <main id="main-content">
        <div className="container mx-auto px-4 pt-4">
          <Breadcrumbs items={[{ label: t("aboutPage.title") }]} />
        </div>

        {/* ─── Hero ─── */}
        <section className="relative pt-6 pb-10 md:pt-8 md:pb-14">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <ArthurHero
                imageSrc={arthurThumbsUp}
                imageAlt="Arthur mascotte jemassuremoinscher.fr"
                title={t("aboutPage.heroTitle")}
                subtitle={t("aboutPage.heroDesc")}
                ctaLabel={t("aboutPage.ctaBtn")}
                onCtaClick={() => {
                  window.location.href = "/comparateur";
                }}
              />
            </div>
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
                  <div className="text-2xl md:text-4xl font-extrabold text-primary mb-1">{stat.value}</div>
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
                <h2 className="text-2xl md:text-3xl font-bold text-foreground">{t("aboutPage.missionTitle")}</h2>
              </div>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p dangerouslySetInnerHTML={{ __html: t("aboutPage.missionP1") }} />
                <p dangerouslySetInnerHTML={{ __html: t("aboutPage.missionP2") }} />
              </div>
            </motion.div>

            {/* Valeurs en grille */}
            <div className="grid sm:grid-cols-2 gap-4 mt-10">
              {values.map(({ icon: Icon, title, desc }, i) => (
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
              <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-3">{t("aboutPage.teamTitle")}</h2>
              <p className="text-muted-foreground max-w-xl mx-auto">{t("aboutPage.teamDesc")}</p>
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
                        <AvatarImage src={member.photo} alt={`Photo de ${member.name}, ${member.role}`} />
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
              <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-3">{t("aboutPage.methodTitle")}</h2>
              <p className="text-muted-foreground max-w-xl mx-auto">{t("aboutPage.methodDesc")}</p>
            </motion.div>

            {/* Vertical timeline */}
            <div className="relative">
              <div
                className="absolute left-5 md:left-1/2 top-0 bottom-0 w-px bg-border md:-translate-x-px"
                aria-hidden="true"
              />

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
                      <div className="relative z-10 shrink-0 md:absolute md:left-1/2 md:-translate-x-1/2">
                        <div className="h-10 w-10 rounded-full bg-primary text-white flex items-center justify-center font-bold text-sm shadow-md">
                          {step}
                        </div>
                      </div>

                      <div
                        className={`flex-1 md:w-[calc(50%-2.5rem)] ${isLeft ? "md:mr-auto md:pr-10" : "md:ml-auto md:pl-10"}`}
                      >
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
              <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-3">{t("aboutPage.certTitle")}</h2>
              <p className="text-muted-foreground max-w-xl mx-auto">{t("aboutPage.certDesc")}</p>
            </motion.div>

            <div className="relative">
              <div className="flex flex-wrap items-stretch justify-center gap-4">
                <div className="flex items-center gap-3 bg-card rounded-xl border border-border/50 px-5 py-4 shadow-sm min-w-[200px]">
                  <img
                    src={oriasLogo}
                    alt="Logo ORIAS"
                    className="h-10 w-auto object-contain"
                    width={80}
                    height={40}
                    loading="lazy"
                  />
                  <div className="text-left">
                    <p className="text-xs font-bold text-foreground">{t("aboutPage.oriasLabel")}</p>
                    <p className="text-xs text-muted-foreground">{t("aboutPage.oriasNumber")}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 bg-card rounded-xl border border-border/50 px-5 py-4 shadow-sm min-w-[200px]">
                  <div className="flex items-center gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-accent text-accent" />
                    ))}
                  </div>
                  <div className="text-left">
                    <p className="text-xs font-bold text-foreground">{t("aboutPage.googleReviews")}</p>
                    <p className="text-xs text-muted-foreground">{t("aboutPage.googleReviewsCount")}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 bg-card rounded-xl border border-border/50 px-5 py-4 shadow-sm min-w-[200px]">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <Shield className="h-5 w-5 text-primary" />
                  </div>
                  <div className="text-left">
                    <p className="text-xs font-bold text-foreground">{t("aboutPage.financialGuarantee")}</p>
                    <p className="text-xs text-muted-foreground">{t("aboutPage.financialGuaranteeDesc")}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 bg-card rounded-xl border border-border/50 px-5 py-4 shadow-sm min-w-[200px]">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <Lock className="h-5 w-5 text-primary" />
                  </div>
                  <div className="text-left">
                    <p className="text-xs font-bold text-foreground">{t("aboutPage.securePayment")}</p>
                    <p className="text-xs text-muted-foreground">{t("aboutPage.securePaymentDesc")}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 bg-card rounded-xl border border-border/50 px-5 py-4 shadow-sm min-w-[200px]">
                  <img
                    src={cscaLogo}
                    alt="Logo CSCA - Chambre Syndicale des Courtiers d'Assurances"
                    className="h-10 w-auto object-contain"
                    width={40}
                    height={40}
                    loading="lazy"
                  />
                  <div className="text-left">
                    <p className="text-xs font-bold text-foreground">{t("aboutPage.cscaMember")}</p>
                    <p className="text-xs text-muted-foreground">{t("aboutPage.cscaDesc")}</p>
                  </div>
                </div>
              </div>

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

        {/* ─── Transparence Courtier ─── */}
        <section className="py-14 md:py-20">
          <div className="container mx-auto px-4 max-w-4xl">
            <motion.div
              className="text-center mb-10"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <div className="flex items-center justify-center gap-3 mb-4">
                <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                  <Scale className="h-6 w-6 text-primary" />
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-foreground">Notre politique de transparence</h2>
              </div>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Chez jemassuremoinscher.fr, nous croyons qu'un courtier digne de confiance doit être transparent sur son
                fonctionnement.
              </p>
            </motion.div>

            <div className="grid sm:grid-cols-2 gap-4">
              {[
                {
                  icon: Banknote,
                  title: "Comment sommes-nous rémunérés ?",
                  desc: "Nous percevons une commission versée par l'assureur partenaire lorsque vous souscrivez un contrat via notre plateforme. Vous ne payez jamais de frais supplémentaires : notre rémunération est incluse dans la prime d'assurance, au même tarif que si vous alliez directement chez l'assureur.",
                },
                {
                  icon: Scale,
                  title: "Indépendance garantie",
                  desc: "Nous ne sommes liés par aucun accord d'exclusivité avec un assureur. Notre comparaison est impartiale : nous présentons les offres de 60+ partenaires sans favoriser aucune compagnie. Notre objectif est de trouver le meilleur rapport garanties/prix pour vous.",
                },
                {
                  icon: Heart,
                  title: "Service 100% gratuit",
                  desc: "La comparaison, le conseil personnalisé et l'accompagnement à la souscription sont entièrement gratuits pour vous. Pas de frais cachés, pas de supplément, pas d'abonnement. Vous ne payez que votre prime d'assurance.",
                },
                {
                  icon: Lock,
                  title: "Protection de vos données",
                  desc: "Vos données personnelles sont protégées conformément au RGPD. Elles sont utilisées uniquement pour établir votre devis et ne sont jamais revendues à des tiers. Vous pouvez demander leur suppression à tout moment.",
                },
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
                    <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── CTA ─── */}
        <section className="py-12 md:py-16">
          <div className="container mx-auto px-4">
            <div className="relative bg-gradient-to-r from-primary to-primary/80 rounded-2xl p-8 md:p-12 text-center max-w-4xl mx-auto overflow-visible">
              <div className="relative z-10">
                <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">{t("aboutPage.ctaTitle")}</h2>
                <p className="text-white/80 mb-6 max-w-xl mx-auto">{t("aboutPage.ctaDesc")}</p>
                <a
                  href="/comparateur"
                  aria-label={t("aboutPage.ctaBtn")}
                  className="inline-flex items-center gap-2 bg-secondary hover:bg-secondary/90 text-secondary-foreground font-bold px-8 py-4 rounded-full text-lg transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  {t("aboutPage.ctaBtn")}
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
