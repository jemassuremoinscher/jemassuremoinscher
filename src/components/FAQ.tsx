import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { HelpCircle } from "lucide-react";
import { useAnalytics } from "@/hooks/useAnalytics";
import { useLanguage } from "@/contexts/LanguageContext";

const FAQ = () => {
  const { t } = useLanguage();
  const { trackEvent } = useAnalytics();

  const faqData = [
    { question: "Comment fonctionne le comparateur ?", answer: "C'est très simple : vous répondez à quelques questions sur vos besoins (2 minutes max), et notre outil compare les offres de plus de 50 assureurs. Un expert vous rappelle ensuite pour vous présenter les meilleures options. Vous n'avez rien à faire d'autre !" },
    { question: "C'est vraiment gratuit ?", answer: "Oui, 100% gratuit et sans engagement. Comparez autant d'offres que vous voulez, sans frais cachés. Nos partenaires assureurs nous rémunèrent directement, jamais vous." },
    { question: "Comment me faire rappeler ?", answer: "Une fois votre comparaison terminée, cliquez sur 'Me faire rappeler'. Un conseiller vous contacte rapidement pour vous accompagner. Ne vous inquiétez pas, aucun engagement de votre part." },
    { question: "Les tarifs affichés sont-ils définitifs ?", answer: "Ce sont des estimations très proches de la réalité, calculées selon vos réponses. Le prix final peut légèrement varier lors de la souscription. Ne vous inquiétez pas, votre conseiller vous expliquera tout en détail." },
    { question: "En combien de temps j'ai mes devis ?", answer: "En 2 minutes chrono ! Répondez aux questions, et les meilleures offres s'affichent immédiatement. Un expert vous rappelle ensuite sous 10 minutes pour vous aider à choisir." },
    { question: "Je peux refaire une comparaison ?", answer: "Bien sûr ! Vous pouvez relancer une nouvelle comparaison à tout moment, gratuitement. Ajustez vos critères autant de fois que nécessaire pour trouver l'offre parfaite." },
    { question: "Mes données sont-elles en sécurité ?", answer: "Absolument. Vos informations sont chiffrées et protégées (RGPD). Elles servent uniquement à générer vos devis et ne sont jamais revendues. Ne vous inquiétez pas, votre vie privée est notre priorité." },
    { question: "Quels types d'assurances puis-je comparer ?", answer: "Auto, Santé, Habitation, Moto, Animaux, Prêt Immobilier, Vie, Prévoyance, RC Pro, MRP, GLI et PNO. Quel que soit votre besoin, on vous trouve la meilleure offre." },
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-muted/20 to-background relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,hsl(var(--primary)/0.05),transparent_50%)]" />
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-12 animate-fade-in">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-4">
            <HelpCircle className="h-5 w-5" />
            <span className="font-semibold text-sm uppercase tracking-wide">{t('faqComponent.badge')}</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-4">
            {t('faqComponent.title')} <span className="text-primary">{t('faqComponent.titleHighlight')}</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">{t('faqComponent.subtitle')}</p>
        </div>
        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="space-y-4">
            {faqData.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`} className="bg-card border-2 border-border rounded-lg px-6 hover:border-primary/30 transition-colors">
                <AccordionTrigger className="text-left font-semibold text-card-foreground hover:text-primary py-6" onClick={() => trackEvent('faq_open', { category: 'engagement', label: faq.question })}>{faq.question}</AccordionTrigger>
                <AccordionContent className="text-muted-foreground pb-6 leading-relaxed">{faq.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
};

export default FAQ;