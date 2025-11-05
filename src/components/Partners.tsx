const partners = [
  "AXA", "Allianz", "Groupama", "MAIF", "MACIF", 
  "Generali", "MMA", "Matmut", "GMF", "Direct Assurance",
  "Amaguiz", "April", "Assurpeople", "LCL"
];

const Partners = () => {
  return (
    <section className="py-20 bg-gradient-to-b from-background to-muted/20 relative overflow-hidden">
      {/* Decorative background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,hsl(var(--primary)/0.05),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,hsl(var(--accent)/0.05),transparent_50%)]" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16 animate-fade-in">
          <p className="text-accent font-semibold text-sm uppercase tracking-wide mb-3">Nos partenaires</p>
          <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-4">
            Plus de <span className="text-primary">120 assureurs</span> comparés
          </h2>
          <p className="text-muted-foreground text-lg">
            Et près de <span className="font-semibold text-foreground">8000 agences locales</span>
          </p>
          <div className="w-24 h-1 bg-accent mx-auto rounded-full mt-4" />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-6">
          {partners.map((partner, index) => (
            <div
              key={index}
              className="flex items-center justify-center p-6 bg-card rounded-xl border-2 border-border hover:border-primary/30 hover-lift transition-all duration-300 group animate-fade-in"
              style={{ animationDelay: `${0.05 * index}s` }}
            >
              <span className="font-bold text-primary text-sm group-hover:text-accent transition-colors">{partner}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Partners;
