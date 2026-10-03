import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";

interface FAQItem {
  question: string;
  answer: string;
}

interface InsuranceFAQProps {
  title?: string;
  faqs: FAQItem[];
  /** Garde les réponses dans le HTML (et la capture prerender) même repliées,
   *  pour qu'elles correspondent au JSON-LD FAQPage de la page. */
  answersInDom?: boolean;
}

const InsuranceFAQ = ({ title, faqs, answersInDom }: InsuranceFAQProps) => {
  const { t } = useLanguage();
  const displayTitle = title || t('insuranceFaq.defaultTitle');

  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-foreground mb-8 text-center">{displayTitle}</h2>
        <Card className="p-6 max-w-4xl mx-auto">
          <Accordion type="single" collapsible className="w-full space-y-3">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="border-0 rounded-2xl px-5 bg-muted/30 hover:bg-muted/60 transition-colors data-[state=open]:bg-muted/60 data-[state=open]:shadow-[var(--shadow-card)]"
              >
                <AccordionTrigger className="text-left font-semibold hover:no-underline py-4">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent
                  forceMount={answersInDom || undefined}
                  className={`text-muted-foreground pb-4 leading-relaxed${answersInDom ? " [[data-state=closed]>&]:hidden" : ""}`}
                >
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </Card>
      </div>
    </section>
  );
};

export default InsuranceFAQ;
