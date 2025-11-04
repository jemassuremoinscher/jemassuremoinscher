const partners = [
  "AXA", "Allianz", "Groupama", "MAIF", "MACIF", 
  "Generali", "MMA", "Matmut", "GMF", "Direct Assurance",
  "Amaguiz", "April", "Assurpeople", "LCL"
];

const Partners = () => {
  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <p className="text-accent font-semibold text-sm uppercase tracking-wide mb-2">Nos partenaires</p>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Plus de 120 assureurs comparés
          </h2>
          <p className="text-muted-foreground text-lg">
            Et près de 8000 agences locales
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-6">
          {partners.map((partner, index) => (
            <div
              key={index}
              className="flex items-center justify-center p-6 bg-card rounded-lg border border-border hover:shadow-[var(--shadow-card)] transition-all duration-300"
            >
              <span className="font-bold text-primary text-sm">{partner}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Partners;
