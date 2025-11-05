import { InteractiveComparator } from '@/components/comparison/InteractiveComparator';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SEO from '@/components/SEO';

const Comparateur = () => {
  return (
    <>
      <SEO
        title="Comparateur d'Assurances en Temps Réel - Calculez vos Économies"
        description="Comparez instantanément les meilleures offres d'assurance et calculez vos économies potentielles en temps réel. Trouvez l'assurance la moins chère adaptée à vos besoins."
        keywords="comparateur assurance, calcul économies assurance, assurance moins chère, comparaison prix assurance"
      />
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1">
          <div className="container mx-auto px-4">
            <InteractiveComparator />
          </div>
        </main>
        <Footer />
      </div>
    </>
  );
};

export default Comparateur;
