import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Partners from "@/components/Partners";

const NosPartenaires = () => {
  return (
    <div className="min-h-screen">
      <Header />
      
      <main className="py-16">
        <div className="container mx-auto px-4 mb-12">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              Nos partenaires assureurs
            </h1>
            <p className="text-lg text-muted-foreground mb-8">
              Nous travaillons avec les plus grandes compagnies d'assurance françaises pour vous proposer les meilleures offres du marché.
            </p>
          </div>
        </div>

        <Partners />

        <div className="container mx-auto px-4 mt-16">
          <div className="max-w-4xl mx-auto">
            <div className="bg-gradient-to-br from-primary/10 to-accent/10 p-8 rounded-xl">
              <h2 className="text-2xl font-bold mb-4">Pourquoi ces partenaires ?</h2>
              <p className="text-muted-foreground mb-4">
                Nous sélectionnons nos partenaires selon des critères stricts de qualité, de fiabilité et de compétitivité. 
                Chaque assureur présent dans notre comparateur a été soigneusement évalué pour garantir :
              </p>
              <ul className="space-y-2 text-muted-foreground">
                <li className="flex items-start">
                  <span className="text-primary mr-2">✓</span>
                  <span>Une solidité financière reconnue</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-2">✓</span>
                  <span>Un excellent service client</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-2">✓</span>
                  <span>Des tarifs compétitifs</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-2">✓</span>
                  <span>Une présence nationale avec des agences locales</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default NosPartenaires;
