import { InteractiveComparator } from '@/components/comparison/InteractiveComparator';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SEOOptimized from '@/components/SEOOptimized';
import Breadcrumbs from '@/components/Breadcrumbs';
import { Link } from 'react-router-dom';

const Comparateur = () => {
  return (
    <>
       <SEOOptimized
        title="Comparateur d'Assurances — Comparez 50+ Assureurs"
        description="Comparez gratuitement plus de 50 assureurs auto, moto, habitation et santé. Économisez jusqu'à 40% sur votre assurance en 2 minutes."
        keyword="comparateur d'assurances"
        keywords="assurance moins chère, changer d'assurance, comparaison assurance gratuit"
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "SoftwareApplication",
          "name": "Comparateur d'Assurance Moins Chère",
          "operatingSystem": "All",
          "applicationCategory": "FinanceApplication",
          "offers": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "EUR"
          }
        }}
       />
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <Breadcrumbs items={[{ label: "Comparateur" }]} />
        <main className="flex-1">
          <InteractiveComparator />

          {/* SEO Internal Links Section */}
          <section className="container mx-auto px-4 py-10">
            <h2 className="text-2xl font-bold text-foreground mb-6">Comparez par type d'assurance</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              <Link to="/assurance-auto" className="text-primary hover:underline font-medium">Assurance Auto</Link>
              <Link to="/assurance-moto" className="text-primary hover:underline font-medium">Assurance Moto</Link>
              <Link to="/assurance-habitation" className="text-primary hover:underline font-medium">Assurance Habitation</Link>
              <Link to="/assurance-sante" className="text-primary hover:underline font-medium">Mutuelle Santé</Link>
              <Link to="/assurance-pret" className="text-primary hover:underline font-medium">Assurance Prêt</Link>
              <Link to="/assurance-vie" className="text-primary hover:underline font-medium">Assurance Vie</Link>
              <Link to="/assurance-animaux" className="text-primary hover:underline font-medium">Assurance Animaux</Link>
              <Link to="/assurance-prevoyance" className="text-primary hover:underline font-medium">Assurance Prévoyance</Link>
              <Link to="/assurance-rc-pro" className="text-primary hover:underline font-medium">RC Professionnelle</Link>
              <Link to="/assurance-mrp" className="text-primary hover:underline font-medium">Multirisque Pro</Link>
              <Link to="/assurance-pno" className="text-primary hover:underline font-medium">Assurance PNO</Link>
              <Link to="/assurance-gli" className="text-primary hover:underline font-medium">Garantie Loyers Impayés</Link>
            </div>

            <h2 className="text-2xl font-bold text-foreground mt-10 mb-6">Ressources utiles</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <Link to="/blog" className="text-primary hover:underline font-medium">Blog & Guides</Link>
              <Link to="/contact" className="text-primary hover:underline font-medium">Nous Contacter</Link>
              <Link to="/nos-partenaires" className="text-primary hover:underline font-medium">Nos Partenaires</Link>
              <Link to="/avis-clients" className="text-primary hover:underline font-medium">Avis Clients</Link>
              <Link to="/qui-sommes-nous" className="text-primary hover:underline font-medium">Qui Sommes-Nous</Link>
              <Link to="/glossaire" className="text-primary hover:underline font-medium">Glossaire Assurance</Link>
            </div>

            <div className="mt-10 prose prose-sm max-w-none text-muted-foreground">
              <h3 className="text-lg font-semibold text-foreground">Comment fonctionne notre comparateur d'assurances ?</h3>
              <p>
                Notre comparateur d'assurances en ligne vous permet de comparer gratuitement les offres de plus de 50 assureurs partenaires. 
                Sélectionnez votre type d'assurance (auto, moto, habitation ou santé), indiquez votre budget actuel, et découvrez instantanément 
                les meilleures offres du marché. Nos utilisateurs économisent en moyenne 312€ par an en changeant d'assureur grâce à notre outil. 
                Le comparateur est 100% gratuit, sans engagement, et vous pouvez demander un rappel personnalisé pour finaliser votre souscription 
                avec l'un de nos conseillers experts.
              </p>
            </div>
          </section>
        </main>
        <Footer />
      </div>
    </>
  );
};

export default Comparateur;
