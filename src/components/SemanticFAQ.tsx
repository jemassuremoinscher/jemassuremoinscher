import { ChevronDown } from "lucide-react";
import { motion } from "framer-motion";

export interface FAQItem {
  question: string;
  answer: string;
}

interface SemanticFAQProps {
  items: FAQItem[];
  title?: string;
  subtitle?: string;
}

/**
 * Semantic FAQ section using native <details>/<summary> for SEO.
 * JSON-LD FAQPage schema should be passed to SEOOptimized in the parent page
 * to avoid duplicate structured data.
 */
const SemanticFAQ = ({
  items,
  title = "Questions fréquentes",
  subtitle = "Retrouvez les réponses aux questions les plus posées.",
}: SemanticFAQProps) => {
  return (
    <section className="py-14 md:py-18 bg-muted/20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
            {title}
          </h2>
          <p className="text-muted-foreground max-w-lg mx-auto text-sm md:text-base">
            {subtitle}
          </p>
        </div>

        <div className="max-w-3xl mx-auto space-y-3">
          {items.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.06 }}
            >
              <details className="group bg-card rounded-xl border border-border/50 overflow-hidden">
                <summary className="flex items-center justify-between gap-4 p-5 cursor-pointer list-none hover:bg-muted/30 transition-colors">
                  <h3 className="text-sm md:text-base font-semibold text-foreground text-left pr-4">
                    {faq.question}
                  </h3>
                  <ChevronDown
                    className="w-4 h-4 text-muted-foreground flex-shrink-0 transition-transform duration-300 group-open:rotate-180"
                    aria-hidden="true"
                  />
                </summary>
                <div className="px-5 pb-5">
                  <p className="text-muted-foreground leading-relaxed text-sm">
                    {faq.answer}
                  </p>
                </div>
              </details>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SemanticFAQ;
