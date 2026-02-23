import { InteractiveComparator } from '@/components/comparison/InteractiveComparator';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SEO from '@/components/SEO';

const Comparateur = () => {
  return (
    <>
       <SEO
        title="Comparateur d'Assurances Gratuit - Trouvez l'Assurance Pas Chère | jemassuremoinscher"
        description="Utilisez notre comparateur d'assurances pour trouver l'assurance pas chère idéale. Comparez 50+ assureurs en temps réel. Meilleure alternative à LesFurets. Changez d'assurance facilement et économisez jusqu'à 40%."
        keywords="comparateur d'assurances, comparateur assurance, assurance pas chere, assurance pas chère, changer d'assurance, lesfurets alternative, comparaison assurance gratuit"
       />
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1">
          <InteractiveComparator />
        </main>
        <Footer />
      </div>
    </>
  );
};

export default Comparateur;
