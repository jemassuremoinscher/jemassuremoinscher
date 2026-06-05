import { useState, type ReactNode } from "react";
import InsuranceFAQ from "@/components/insurance/InsuranceFAQ";
import GuaranteeTable from "@/components/sections/GuaranteeTable";
import { useLanguage } from "@/contexts/LanguageContext";

interface FAQ {
  question: string;
  answer: string;
}

interface InsuranceSEOTabsProps {
  faqTitle: string;
  faqs: FAQ[];
  showGuarantees?: boolean;
  children?: ReactNode;
}

const InsuranceSEOTabs = ({ faqTitle, faqs, showGuarantees = true, children }: InsuranceSEOTabsProps) => {
  const { t } = useLanguage();
  const [active, setActive] = useState<"faq" | "guarantees">("faq");
  const tabs = [
    { id: "faq" as const, label: t("seoTabs.faq") },
    { id: "guarantees" as const, label: t("seoTabs.guarantees") },
  ];
  const visibleTabs = showGuarantees ? tabs : tabs.filter((tab) => tab.id === "faq");

  return (
    <section className="max-w-5xl mx-auto mb-12" aria-label={t("seoTabs.aria")}>
      <div className="flex border-b border-border/50 mb-0">
        {visibleTabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActive(tab.id)}
            className={`flex-1 sm:flex-none px-5 py-3 text-sm font-semibold transition-colors relative ${
              active === tab.id ? "text-primary" : "text-muted-foreground hover:text-foreground"
            }`}
            aria-selected={active === tab.id}
            role="tab"
          >
            {tab.label}
            {active === tab.id && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full" />
            )}
          </button>
        ))}
      </div>

      <div className="pt-6">
        {active === "faq" && (
          <div className="animate-fade-in">
            <InsuranceFAQ title={faqTitle} faqs={faqs} />
            {children}
          </div>
        )}
        {showGuarantees && active === "guarantees" && (
          <div className="animate-fade-in -mx-4 sm:mx-0">
            <GuaranteeTable />
          </div>
        )}
      </div>
    </section>
  );
};

export default InsuranceSEOTabs;
