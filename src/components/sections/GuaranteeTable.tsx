import { Helmet } from "react-helmet-async";

const guarantees = [
  {
    name: "Responsabilité Civile (RC)",
    auto: "Incluse",
    moto: "Incluse",
    habitation: "Incluse",
    sante: "—",
    pro: "Incluse",
  },
  {
    name: "Défense & Recours",
    auto: "Incluse",
    moto: "Incluse",
    habitation: "Option",
    sante: "—",
    pro: "Incluse",
  },
  {
    name: "Assistance 0 km",
    auto: "Option",
    moto: "Option",
    habitation: "—",
    sante: "—",
    pro: "—",
  },
  {
    name: "Vol & Incendie",
    auto: "Tiers+",
    moto: "Tiers+",
    habitation: "Incluse",
    sante: "—",
    pro: "Option",
  },
  {
    name: "Bris de glace",
    auto: "Tiers+",
    moto: "Option",
    habitation: "Option",
    sante: "—",
    pro: "—",
  },
  {
    name: "Hospitalisation",
    auto: "—",
    moto: "—",
    habitation: "—",
    sante: "100–300%",
    pro: "—",
  },
  {
    name: "Optique & Dentaire",
    auto: "—",
    moto: "—",
    habitation: "—",
    sante: "100–400€",
    pro: "—",
  },
  {
    name: "Dommages tous accidents",
    auto: "Tous risques",
    moto: "Tous risques",
    habitation: "—",
    sante: "—",
    pro: "Option",
  },
] as const;

const columns = [
  { key: "auto", label: "Auto" },
  { key: "moto", label: "Moto" },
  { key: "habitation", label: "Habitation" },
  { key: "sante", label: "Santé" },
  { key: "pro", label: "RC Pro" },
] as const;

const datasetSchema = {
  "@context": "https://schema.org",
  "@type": "Dataset",
  name: "Comparatif des garanties d'assurance en France — jemassuremoinscher.fr",
  description:
    "Tableau comparatif des garanties incluses, optionnelles ou indisponibles selon le type d'assurance (auto, moto, habitation, santé, RC Pro) proposé par le comparateur jemassuremoinscher.fr.",
  url: "https://www.jemassuremoinscher.fr",
  creator: {
    "@type": "Organization",
    name: "jemassuremoinscher.fr",
  },
  temporalCoverage: "2026",
  license: "https://creativecommons.org/licenses/by-nc/4.0/",
};

const GuaranteeTable = () => {
  return (
    <>
      <Helmet>
        <script type="application/ld+json">
          {JSON.stringify(datasetSchema)}
        </script>
      </Helmet>
      <section
        className="py-12 md:py-14 bg-background section-lazy"
        aria-labelledby="guarantee-table-title"
        data-ai-description="Tableau comparatif sémantique des garanties d'assurance (RC, défense recours, assistance, vol, hospitalisation) par type de contrat (auto, moto, habitation, santé, RC Pro)."
      >
        <div className="container mx-auto px-4 max-w-5xl">
          <h2
            id="guarantee-table-title"
            className="text-xl md:text-2xl font-bold text-foreground mb-2"
          >
            Garanties comparées par type d'assurance
          </h2>
          <p className="text-sm text-muted-foreground mb-6">
            Incluse, en option ou selon la formule choisie — retrouvez les garanties clés de chaque contrat.
          </p>

          {/* Desktop table */}
          <div className="hidden md:block overflow-hidden rounded-2xl border border-primary/15 bg-card shadow-elevation-2">
            <table className="w-full text-sm border-collapse">
              <caption className="sr-only">
                Comparatif des garanties par type d'assurance proposé par jemassuremoinscher.fr
              </caption>
              <thead>
                <tr className="bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10">
                  <th scope="col" className="text-left p-4 font-bold text-foreground text-sm uppercase tracking-wide">
                    Garantie
                  </th>
                  {columns.map((col) => (
                    <th
                      key={col.key}
                      scope="col"
                      className="p-4 text-center font-bold text-primary text-sm uppercase tracking-wide border-l border-primary/10"
                    >
                      {col.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {guarantees.map((row, i) => (
                  <tr
                    key={row.name}
                    className={`group transition-colors duration-200 border-t border-border/30 ${
                      i % 2 === 0 ? "bg-background" : "bg-primary/[0.04]"
                    } hover:bg-primary/[0.08]`}
                  >
                    <th scope="row" className="text-left p-3.5 font-medium text-foreground group-hover:text-primary transition-colors">
                      {row.name}
                    </th>
                    {columns.map((col) => {
                      const val = row[col.key];
                      const isIncluded = val === "Incluse";
                      const isOption = val === "Option";
                      const isDash = val === "—";
                      return (
                        <td key={col.key} className="p-3.5 text-center text-sm border-l border-border/20">
                          {isIncluded ? (
                            <span className="inline-flex items-center gap-1 text-success font-semibold">
                              <span aria-hidden="true">✓</span> Incluse
                            </span>
                          ) : isOption ? (
                            <span className="inline-flex items-center rounded-full bg-secondary/20 text-foreground px-2.5 py-0.5 text-[11px] font-semibold">
                              Option
                            </span>
                          ) : isDash ? (
                            <span className="text-muted-foreground/40">—</span>
                          ) : (
                            <span className="text-foreground font-semibold">{val}</span>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="md:hidden space-y-3">
            {guarantees.map((row, i) => (
              <div
                key={row.name}
                className={`rounded-2xl border border-primary/15 p-4 ${
                  i % 2 === 0 ? "bg-card" : "bg-primary/[0.04]"
                }`}
              >
                <p className="font-semibold text-foreground text-sm mb-3 pb-2 border-b border-border/30">
                  {row.name}
                </p>
                <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                  {columns.map((col) => {
                    const val = row[col.key];
                    const isIncluded = val === "Incluse";
                    const isOption = val === "Option";
                    const isDash = val === "—";
                    return (
                      <div key={col.key} className="flex items-center justify-between text-xs">
                        <span className="text-muted-foreground font-medium">{col.label}</span>
                        {isIncluded ? (
                          <span className="text-success font-semibold">✓</span>
                        ) : isOption ? (
                          <span className="inline-flex items-center rounded-full bg-secondary/20 text-foreground px-2 py-0.5 text-[10px] font-semibold">
                            Option
                          </span>
                        ) : isDash ? (
                          <span className="text-muted-foreground/40">—</span>
                        ) : (
                          <span className="text-foreground font-semibold">{val}</span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default GuaranteeTable;
