import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Shield, Award, Users, TrendingUp } from "lucide-react";

const QuiSommesNous = () => {
  return (
    <div className="min-h-screen">
      <Header />
      
      <main className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            Qui sommes-nous ?
          </h1>
          
          <p className="text-lg text-muted-foreground mb-8">
            jemassuremoinscher est votre partenaire de confiance pour trouver les meilleures offres d'assurance adaptées à vos besoins.
          </p>

          <div className="grid md:grid-cols-2 gap-8 my-12">
            <div className="bg-card p-6 rounded-xl border-2 border-border hover:border-primary/30 transition-all">
              <Shield className="w-12 h-12 text-primary mb-4" />
              <h3 className="text-xl font-bold mb-3">Notre mission</h3>
              <p className="text-muted-foreground">
                Simplifier la comparaison des assurances et vous faire économiser sur vos contrats en toute transparence.
              </p>
            </div>

            <div className="bg-card p-6 rounded-xl border-2 border-border hover:border-primary/30 transition-all">
              <Award className="w-12 h-12 text-primary mb-4" />
              <h3 className="text-xl font-bold mb-3">Notre expertise</h3>
              <p className="text-muted-foreground">
                Plus de 10 ans d'expérience dans le domaine de l'assurance avec des experts dédiés à votre service.
              </p>
            </div>

            <div className="bg-card p-6 rounded-xl border-2 border-border hover:border-primary/30 transition-all">
              <Users className="w-12 h-12 text-primary mb-4" />
              <h3 className="text-xl font-bold mb-3">Notre communauté</h3>
              <p className="text-muted-foreground">
                Plus de 500 000 utilisateurs nous font confiance pour leurs comparaisons d'assurance.
              </p>
            </div>

            <div className="bg-card p-6 rounded-xl border-2 border-border hover:border-primary/30 transition-all">
              <TrendingUp className="w-12 h-12 text-primary mb-4" />
              <h3 className="text-xl font-bold mb-3">Nos résultats</h3>
              <p className="text-muted-foreground">
                En moyenne, nos utilisateurs économisent 35% sur leurs contrats d'assurance.
              </p>
            </div>
          </div>

          <div className="bg-gradient-to-br from-primary/10 to-accent/10 p-8 rounded-xl">
            <h2 className="text-2xl font-bold mb-4">Nos valeurs</h2>
            <ul className="space-y-3 text-muted-foreground">
              <li className="flex items-start">
                <span className="text-primary mr-2">•</span>
                <span><strong>Transparence :</strong> Nous vous présentons toutes les offres sans parti pris</span>
              </li>
              <li className="flex items-start">
                <span className="text-primary mr-2">•</span>
                <span><strong>Indépendance :</strong> Notre service est gratuit et impartial</span>
              </li>
              <li className="flex items-start">
                <span className="text-primary mr-2">•</span>
                <span><strong>Simplicité :</strong> Un processus de comparaison clair et rapide</span>
              </li>
              <li className="flex items-start">
                <span className="text-primary mr-2">•</span>
                <span><strong>Accompagnement :</strong> Notre équipe est là pour vous guider</span>
              </li>
            </ul>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default QuiSommesNous;
