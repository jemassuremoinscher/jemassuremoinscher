import { ChevronDown } from "lucide-react";
import { motion } from "framer-motion";

const FAQS = [
  {
    question: "Comment économiser sur mon assurance auto ?",
    answer:
      "Pour économiser sur votre assurance auto, comparez les offres de plusieurs assureurs grâce à notre comparateur gratuit. Analysez les garanties proposées, ajustez votre franchise, et profitez des réductions pour bon conducteur. En moyenne, nos utilisateurs économisent 320€ par an sur leur assurance auto.",
  },
  {
    question: "Est-ce vraiment gratuit ?",
    answer:
      "Oui, notre service de comparaison est 100% gratuit et sans engagement. Nous sommes rémunérés par les assureurs partenaires uniquement si vous souscrivez à une offre. Vous ne payez jamais de frais supplémentaires pour utiliser notre comparateur.",
  },
  {
    question: "Puis-je changer d'assurance n'importe quand ?",
    answer:
      "Depuis la loi Hamon de 2015, vous pouvez résilier votre contrat d'assurance auto, moto ou habitation à tout moment après la première année de souscription. Pour l'assurance santé, la résiliation est possible à la date d'anniversaire du contrat avec un préavis de 2 mois, ou à tout moment après la première année grâce à la résiliation infra-annuelle.",
  },
];

const SEOFaq = () => {
  return (
    <section className="py-16 md:py-20 bg-background">
      <div className="container mx-auto px-4">
        {/* Section Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10 md:mb-14"
        >
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground mb-3">
            Questions fréquentes
          </h2>
          <p className="text-muted-foreground max-w-md mx-auto">
            Tout ce que vous devez savoir sur la comparaison d'assurances
          </p>
        </motion.div>

        {/* FAQ Accordion - Using semantic details/summary for SEO */}
        <div className="max-w-3xl mx-auto space-y-4">
          {FAQS.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <details className="group bg-card rounded-xl shadow-sm border border-border/50 overflow-hidden">
                <summary className="flex items-center justify-between gap-4 p-5 md:p-6 cursor-pointer list-none hover:bg-muted/30 transition-colors">
                  <h3 className="text-base md:text-lg font-semibold text-foreground text-left pr-4">
                    {faq.question}
                  </h3>
                  <ChevronDown className="w-5 h-5 text-muted-foreground flex-shrink-0 transition-transform duration-300 group-open:rotate-180" />
                </summary>
                <div className="px-5 pb-5 md:px-6 md:pb-6">
                  <p className="text-muted-foreground leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              </details>
            </motion.div>
          ))}
        </div>

        {/* Schema.org FAQ structured data for SEO */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "FAQPage",
              mainEntity: FAQS.map((faq) => ({
                "@type": "Question",
                name: faq.question,
                acceptedAnswer: {
                  "@type": "Answer",
                  text: faq.answer,
                },
              })),
            }),
          }}
        />
      </div>
    </section>
  );
};

export default SEOFaq;