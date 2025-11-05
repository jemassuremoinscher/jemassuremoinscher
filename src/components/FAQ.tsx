import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { HelpCircle } from "lucide-react";

const faqData = [
  {
    question: "Comment fonctionne le comparateur d'assurances ?",
    answer: "Notre comparateur analyse votre profil et vos besoins pour vous proposer les meilleures offres de plus de 120 assureurs partenaires. Vous remplissez un formulaire en 2 minutes, et nous vous affichons instantanément les 10 meilleures offres adaptées à votre situation, triées par prix."
  },
  {
    question: "Le comparateur est-il gratuit ?",
    answer: "Oui, notre service de comparaison est 100% gratuit et sans engagement. Vous pouvez comparer autant d'offres que vous le souhaitez sans frais cachés. Nous sommes rémunérés directement par nos partenaires assureurs."
  },
  {
    question: "Puis-je souscrire directement en ligne ?",
    answer: "Oui, une fois que vous avez trouvé l'offre qui vous convient, vous pouvez cliquer sur 'Souscrire' et vous serez redirigé vers l'assureur pour finaliser votre souscription en ligne. Un conseiller peut également vous contacter pour vous accompagner dans vos démarches."
  },
  {
    question: "Les tarifs affichés sont-ils définitifs ?",
    answer: "Les tarifs affichés sont des estimations calculées en temps réel selon les informations que vous nous fournissez. Le prix final peut légèrement varier selon des critères complémentaires demandés par l'assureur lors de la souscription."
  },
  {
    question: "Combien de temps faut-il pour obtenir un devis ?",
    answer: "Vous obtenez vos devis en moins de 2 minutes ! Il vous suffit de remplir le formulaire correspondant au type d'assurance recherché, et notre comparateur vous affiche immédiatement les 10 meilleures offres disponibles."
  },
  {
    question: "Puis-je modifier mes informations après avoir fait une simulation ?",
    answer: "Oui, vous pouvez refaire une nouvelle simulation autant de fois que vous le souhaitez en cliquant sur 'Faire une nouvelle demande'. Chaque simulation est indépendante et vous permet d'ajuster vos critères pour obtenir les offres les plus adaptées."
  },
  {
    question: "Mes données personnelles sont-elles protégées ?",
    answer: "Absolument. Nous accordons une importance primordiale à la protection de vos données personnelles. Toutes les informations que vous nous transmettez sont sécurisées et cryptées. Elles ne sont utilisées que pour générer vos devis et ne sont jamais revendues à des tiers."
  },
  {
    question: "Quels types d'assurances puis-je comparer ?",
    answer: "Nous proposons la comparaison de 6 types d'assurances : Assurance Auto, Mutuelle Santé, Assurance Moto, Assurance Habitation, Assurance Animaux et Assurance Prêt Immobilier. Chaque comparateur est spécialisé pour vous offrir les meilleures offres du marché."
  }
];

const FAQ = () => {
  return (
    <section className="py-20 bg-gradient-to-b from-muted/20 to-background relative overflow-hidden">
      {/* Decorative background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,hsl(var(--primary)/0.05),transparent_50%)]" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-12 animate-fade-in">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-4">
            <HelpCircle className="h-5 w-5" />
            <span className="font-semibold text-sm uppercase tracking-wide">FAQ</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-4">
            Questions <span className="text-primary">fréquentes</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Trouvez rapidement les réponses à vos questions sur notre comparateur d'assurances
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="space-y-4">
            {faqData.map((faq, index) => (
              <AccordionItem 
                key={index} 
                value={`item-${index}`}
                className="bg-card border-2 border-border rounded-lg px-6 hover:border-primary/30 transition-colors"
              >
                <AccordionTrigger className="text-left font-semibold text-card-foreground hover:text-primary py-6">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground pb-6 leading-relaxed">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
};

export default FAQ;