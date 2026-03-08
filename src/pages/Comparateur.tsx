import { InteractiveComparator } from '@/components/comparison/InteractiveComparator';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SEOOptimized from '@/components/SEOOptimized';
import Breadcrumbs from '@/components/Breadcrumbs';

const Comparateur = () => {
  return (
    <>
       <SEOOptimized
        title="Comparateur d'Assurances Gratuit en Ligne"
        description="Comparateur d'assurances : comparez 50+ assureurs en temps réel. Alternative à LesFurets. Économisez 40%."
        keyword="comparateur d'assurances"
        keywords="assurance moins chère, changer d'assurance, comparaison assurance gratuit"
       />
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <Breadcrumbs items={[{ label: "Comparateur" }]} />
        <main className="flex-1">
          <InteractiveComparator />
        </main>
        <Footer />
      </div>
    </>
  );
};

export default Comparateur;
