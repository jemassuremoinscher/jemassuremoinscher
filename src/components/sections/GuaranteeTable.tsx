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
          <div className="hidden md:block overflow-x-auto rounded-xl border border-border/50">
            <table className="w-full text-sm">
              <caption className="sr-only">
                Comparatif des garanties par type d'assurance proposé par jemassuremoinscher.fr
              </caption>
              <thead>
                <tr className="bg-muted/40">
                  <th scope="col" className="text-left p-3 font-semibold text-foreground">
                    Garantie
                  </th>
                  {columns.map((col) => (
                    <th
                      key={col.key}
                      scope="col"
                      className="p-3 text-center font-semibold text-foreground"
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
                    className={i % 2 === 0 ? "bg-background" : "bg-muted/20"}
                  >
                    <th scope="row" className="text-left p-3 font-medium text-foreground">
                      {row.name}
                    </th>
                    {columns.map((col) => {
                      const val = row[col.key];
                      const isIncluded = val === "Incluse";
                      const isDash = val === "—";
                      return (
                        <td
                          key={col.key}
                          className={`p-3 text-center text-sm ${
                            isIncluded
                              ? "text-emerald-600 font-semibold"
                              : isDash
                              ? "text-muted-foreground/40"
                              : "text-foreground"
                          }`}
                        >
                          {isIncluded ? "✓ Incluse" : val}
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
            {guarantees.map((row) => (
              <div
                key={row.name}
                className="bg-card rounded-xl border border-border/40 p-4"
              >
                <p className="font-semibold text-foreground text-sm mb-2">
                  {row.name}
                </p>
                <div className="grid grid-cols-2 gap-x-4 gap-y-1.5">
                  {columns.map((col) => {
                    const val = row[col.key];
                    const isIncluded = val === "Incluse";
                    const isDash = val === "—";
                    return (
                      <div key={col.key} className="flex justify-between text-xs">
                        <span className="text-muted-foreground">{col.label}</span>
                        <span
                          className={
                            isIncluded
                              ? "text-emerald-600 font-semibold"
                              : isDash
                              ? "text-muted-foreground/40"
                              : "text-foreground font-medium"
                          }
                        >
                          {isIncluded ? "✓" : val}
                        </span>
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
