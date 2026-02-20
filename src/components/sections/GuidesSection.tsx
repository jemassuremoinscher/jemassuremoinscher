import { useState } from "react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription, DrawerClose,
} from "@/components/ui/drawer";
import { ScrollArea } from "@/components/ui/scroll-area";
import { BookOpen, FileText, Scale, X } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import arthurFlying from "@/assets/mascotte/arthur-flying.png";

interface Article {
  id: number;
  titleKey: string;
  excerptKey: string;
  icon: React.ReactNode;
  content: {
    intro: string;
    sections: { title: string; text: string }[];
    conclusion: string;
  };
}

const GuidesSection = () => {
  const { t, language } = useLanguage();
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const articles: Article[] = [
    {
      id: 1,
      titleKey: 'guides.article1.title',
      excerptKey: 'guides.article1.excerpt',
      icon: <Scale className="w-12 h-12 text-primary" />,
      content: language === 'en' ? {
        intro: "The Hamon law, effective since January 1, 2015, revolutionised the insurance world in France. It allows policyholders to cancel their contract at any time after the first year.",
        sections: [
          { title: "Which contracts are covered?", text: "The Hamon law applies to car, motorcycle, home and affinity insurance (phone, travel...). It does not cover life, supplementary health or income protection insurance." },
          { title: "How to proceed?", text: "It's simple: your new insurer takes care of everything! Just choose a new insurance and provide your old contract references. Cancellation takes effect 1 month after the request." },
          { title: "The advantages", text: "No more forced automatic renewal, no penalties, and complete freedom to shop around and save on your insurance premiums." },
        ],
        conclusion: "With jemassuremoinscher.fr, compare offers and switch insurance in a few clicks. Our advisors assist you free of charge."
      } : {
        intro: "La loi Hamon, entrée en vigueur le 1er janvier 2015, a révolutionné le monde de l'assurance en France. Elle permet aux assurés de résilier leur contrat à tout moment après la première année d'engagement.",
        sections: [
          { title: "Quels contrats sont concernés ?", text: "La loi Hamon s'applique aux assurances auto, moto, habitation et affinitaires (téléphone, voyage...). Elle ne concerne pas les assurances vie, santé complémentaire ou prévoyance." },
          { title: "Comment procéder ?", text: "C'est simple : votre nouvel assureur s'occupe de tout ! Il suffit de choisir une nouvelle assurance et de lui fournir les références de votre ancien contrat. La résiliation prend effet 1 mois après la demande." },
          { title: "Les avantages", text: "Plus de tacite reconduction forcée, plus de pénalités, et une liberté totale pour faire jouer la concurrence et économiser sur vos primes d'assurance." },
        ],
        conclusion: "Grâce à jemassuremoinscher.fr, comparez les offres et changez d'assurance en quelques clics. Nos conseillers vous accompagnent gratuitement dans vos démarches."
      }
    },
    {
      id: 2,
      titleKey: 'guides.article2.title',
      excerptKey: 'guides.article2.excerpt',
      icon: <BookOpen className="w-12 h-12 text-primary" />,
      content: language === 'en' ? {
        intro: "Insurance is a significant budget for French households. Here are 5 practical tips to significantly reduce your premiums without sacrificing coverage.",
        sections: [
          { title: "1. Compare regularly", text: "Rates change every year. Use a comparison tool like jemassuremoinscher.fr at least once a year to check you still have the best price." },
          { title: "2. Increase your deductible", text: "By accepting a higher deductible, you can reduce your premium by 15-30%. Best if you're a safe driver!" },
          { title: "3. Bundle your contracts", text: "Multi-insurance with the same insurer can give you discounts of up to 15% on all your contracts." },
          { title: "4. Adjust your coverage", text: "For a vehicle over 10 years old, switch to third-party plus rather than comprehensive. Savings can reach €200 per year." },
          { title: "5. Pay annually", text: "Monthly payment often incurs additional fees of 5-8%. Prefer annual payment if your cash flow allows." },
        ],
        conclusion: "By applying these tips, our users save an average of €320 per year. Start your free comparison to discover your savings potential!"
      } : {
        intro: "L'assurance représente un budget conséquent pour les ménages français. Voici 5 astuces concrètes pour réduire significativement vos primes sans sacrifier votre couverture.",
        sections: [
          { title: "1. Comparez régulièrement", text: "Les tarifs évoluent chaque année. Utilisez un comparateur comme jemassuremoinscher.fr au moins une fois par an pour vérifier que vous avez toujours le meilleur prix." },
          { title: "2. Augmentez votre franchise", text: "En acceptant une franchise plus élevée (le montant à votre charge en cas de sinistre), vous pouvez réduire votre prime de 15 à 30%. À réserver si vous êtes bon conducteur !" },
          { title: "3. Regroupez vos contrats", text: "La multi-assurance chez un même assureur peut vous faire bénéficier de réductions allant jusqu'à 15% sur l'ensemble de vos contrats." },
          { title: "4. Adaptez vos garanties", text: "Pour un véhicule de plus de 10 ans, passez au tiers étendu plutôt qu'à une assurance tous risques. L'économie peut atteindre 200€ par an." },
          { title: "5. Optez pour le paiement annuel", text: "Le paiement mensuel entraîne souvent des frais supplémentaires de 5 à 8%. Préférez le paiement annuel si votre trésorerie le permet." },
        ],
        conclusion: "En appliquant ces conseils, nos utilisateurs économisent en moyenne 320€ par an. Lancez votre comparatif gratuit pour découvrir votre potentiel d'économies !"
      }
    },
    {
      id: 3,
      titleKey: 'guides.article3.title',
      excerptKey: 'guides.article3.excerpt',
      icon: <FileText className="w-12 h-12 text-primary" />,
      content: language === 'en' ? {
        intro: "Car insurance for new drivers is often a significant expense. Discover how to get the best value for your first insurance.",
        sections: [
          { title: "Why are premiums high?", text: "Statistics show that novice drivers have 3 times more accident risk. Insurers therefore apply a surcharge of up to 100% in the first year." },
          { title: "Average budget", text: "Expect between €1,200 and €2,500 per year for comprehensive insurance. For third-party, prices vary from €600 to €1,200 depending on the vehicle and area." },
          { title: "How to reduce the cost?", text: "Choose a low-power vehicle (less than 6 HP), install a telematics box (save up to 30%), or be a secondary driver on your parents' policy." },
          { title: "Accompanied driving: a major advantage", text: "If you completed accompanied driving, your initial surcharge is 50% instead of 100%. After 2 claim-free years, you return to a normal coefficient." },
        ],
        conclusion: "On jemassuremoinscher.fr, we have negotiated special rates for new drivers with over 15 partner insurers. Compare in 2 minutes!"
      } : {
        intro: "L'assurance auto pour les jeunes conducteurs représente souvent un budget conséquent. Découvrez comment obtenir le meilleur rapport qualité-prix pour votre première assurance.",
        sections: [
          { title: "Pourquoi les primes sont-elles élevées ?", text: "Les statistiques montrent que les conducteurs novices ont 3 fois plus de risques d'accident. Les assureurs appliquent donc une surprime pouvant aller jusqu'à 100% la première année." },
          { title: "Le budget moyen", text: "Comptez entre 1 200€ et 2 500€ par an pour une assurance tous risques. Pour un tiers, les prix varient de 600€ à 1 200€ selon le véhicule et la zone géographique." },
          { title: "Comment réduire la facture ?", text: "Optez pour un véhicule de faible puissance (moins de 6 CV), installez un boîtier télématique (économie jusqu'à 30%), ou soyez conducteur secondaire sur le contrat de vos parents." },
          { title: "La conduite accompagnée : un atout majeur", text: "Si vous avez suivi l'AAC, votre surprime initiale est de 50% au lieu de 100%. Après 2 ans sans sinistre, vous retrouvez un coefficient normal." },
        ],
        conclusion: "Sur jemassuremoinscher.fr, nous avons négocié des tarifs spéciaux pour les jeunes conducteurs avec plus de 15 assureurs partenaires. Comparez en 2 minutes !"
      }
    }
  ];

  const handleOpenArticle = (article: Article) => {
    setSelectedArticle(article);
    setIsDrawerOpen(true);
  };

  return (
    <section className="py-16 md:py-24 bg-muted/30" aria-labelledby="guides-title">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-10"
        >
          <div className="flex justify-center mb-4">
            <motion.div className="relative">
              <motion.img
                src={arthurFlying}
                alt="Arthur"
                className="w-20 h-auto md:w-28"
                loading="lazy"
                animate={{ y: [0, -10, 0], rotate: [0, 3, -3, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              />
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5 }}
                className="absolute -top-2 -right-16 md:-right-24 bg-accent text-accent-foreground rounded-lg px-3 py-1.5 text-xs md:text-sm font-bold whitespace-nowrap shadow-lg"
              >
                {t('guides.arthurSpeech')}
                <div className="absolute -bottom-1.5 left-3 w-3 h-3 bg-accent transform rotate-45" />
              </motion.div>
            </motion.div>
          </div>
          <h2 id="guides-title" className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            {t('guides.mainTitle')}
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            {t('guides.mainSubtitle')}
          </p>
        </motion.div>

        <div className="relative -mx-4 px-4">
          <div className="flex gap-6 overflow-x-auto pb-6 snap-x snap-mandatory scrollbar-hide md:grid md:grid-cols-3 md:overflow-visible">
            {articles.map((article, index) => (
              <motion.article
                key={article.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="flex-shrink-0 w-[85%] md:w-full snap-center"
              >
                <div className="bg-card rounded-2xl border border-border shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden h-full flex flex-col group">
                  <div className="relative h-44 bg-gradient-to-br from-primary/10 via-primary/5 to-accent/10 flex items-center justify-center overflow-hidden">
                    <div className="absolute inset-0 opacity-10">
                      <div className="absolute top-4 left-4 w-20 h-20 rounded-full bg-primary/30"></div>
                      <div className="absolute bottom-4 right-8 w-16 h-16 rounded-full bg-accent/40"></div>
                      <div className="absolute top-1/2 right-4 w-12 h-12 rounded-full bg-primary/20"></div>
                    </div>
                    <div className="relative z-10 transform group-hover:scale-110 transition-transform duration-300">
                      {article.icon}
                    </div>
                    <Badge variant="secondary" className="absolute top-4 left-4 bg-primary/90 text-primary-foreground hover:bg-primary">
                      {t('common.advice')}
                    </Badge>
                  </div>
                  <div className="p-6 flex flex-col flex-grow">
                    <h3 className="text-xl font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                      {t(article.titleKey)}
                    </h3>
                    <p className="text-muted-foreground text-sm mb-4 flex-grow">{t(article.excerptKey)}</p>
                    <Button
                      variant="outline"
                      className="w-full mt-auto border-primary/30 hover:bg-primary hover:text-primary-foreground transition-all"
                      onClick={() => handleOpenArticle(article)}
                    >
                      {t('common.readMore')}
                    </Button>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </div>

      <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
        <DrawerContent className="max-h-[90vh]">
          <DrawerHeader className="border-b border-border pb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Badge variant="secondary" className="bg-primary/90 text-primary-foreground">{t('common.advice')}</Badge>
                <DrawerTitle className="text-xl md:text-2xl font-bold">
                  {selectedArticle ? t(selectedArticle.titleKey) : ''}
                </DrawerTitle>
              </div>
              <DrawerClose asChild>
                <Button variant="ghost" size="icon" className="rounded-full"><X className="w-5 h-5" /></Button>
              </DrawerClose>
            </div>
            <DrawerDescription className="text-muted-foreground mt-2">
              {selectedArticle ? t(selectedArticle.excerptKey) : ''}
            </DrawerDescription>
          </DrawerHeader>
          <ScrollArea className="h-[60vh] px-6 py-6">
            {selectedArticle && (
              <div className="space-y-6">
                <p className="text-foreground leading-relaxed text-base">{selectedArticle.content.intro}</p>
                {selectedArticle.content.sections.map((section, index) => (
                  <div key={index} className="space-y-2">
                    <h4 className="text-lg font-semibold text-foreground">{section.title}</h4>
                    <p className="text-muted-foreground leading-relaxed">{section.text}</p>
                  </div>
                ))}
                <div className="bg-primary/10 rounded-xl p-5 border border-primary/20">
                  <p className="text-foreground font-medium">{selectedArticle.content.conclusion}</p>
                </div>
                <div className="pt-4">
                  <Button
                    className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-6 text-lg font-semibold"
                    onClick={() => { setIsDrawerOpen(false); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  >
                    {t('guides.cta')}
                  </Button>
                </div>
              </div>
            )}
          </ScrollArea>
        </DrawerContent>
      </Drawer>
    </section>
  );
};

export default GuidesSection;