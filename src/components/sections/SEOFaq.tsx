import { ChevronDown } from "lucide-react";
import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import arthurStanding from "@/assets/mascotte/arthur-standing.png";

const SEOFaq = () => {
  const { t } = useLanguage();

  const FAQS = [
    { question: t('seoFaq.q1'), answer: t('seoFaq.a1') },
    { question: t('seoFaq.q2'), answer: t('seoFaq.a2') },
    { question: t('seoFaq.q3'), answer: t('seoFaq.a3') },
  ];

  return (
    <section className="py-16 md:py-20 bg-background">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10 md:mb-14"
        >
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground mb-3">
            {t('seoFaq.title')}
          </h2>
          <p className="text-muted-foreground max-w-md mx-auto">
            {t('seoFaq.subtitle')}
          </p>
        </motion.div>

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
                  <p className="text-muted-foreground leading-relaxed">{faq.answer}</p>
                </div>
              </details>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="flex flex-col md:flex-row items-center justify-center gap-4 mt-10"
        >
          <motion.img
            src={arthurStanding}
            alt="Arthur"
            className="w-16 h-auto md:w-20"
            loading="lazy"
            animate={{ y: [0, -6, 0] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
          />
          <div className="bg-primary/10 border border-primary/20 rounded-xl px-5 py-3 text-center md:text-left">
            <p className="text-sm md:text-base font-medium text-foreground">
              {t('seoFaq.moreQuestions')} <span className="text-primary font-bold">Arthur</span> {t('seoFaq.arthurHere')}
            </p>
          </div>
        </motion.div>

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "FAQPage",
              mainEntity: FAQS.map((faq) => ({
                "@type": "Question",
                name: faq.question,
                acceptedAnswer: { "@type": "Answer", text: faq.answer },
              })),
            }),
          }}
        />
      </div>
    </section>
  );
};

export default SEOFaq;