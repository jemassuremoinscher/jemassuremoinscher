import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Calendar, Clock } from "lucide-react";

const blogPosts = [
  {
    title: "Comment choisir son assurance auto en 2024 ?",
    description: "Découvrez nos conseils pour bien choisir votre assurance auto et économiser jusqu'à 40% sur votre contrat.",
    category: "Assurance Auto",
    date: "15 janvier 2024",
    readTime: "5 min"
  },
  {
    title: "Mutuelle santé : les garanties essentielles à connaître",
    description: "Quelles sont les garanties indispensables dans une mutuelle santé ? Notre guide complet pour faire le bon choix.",
    category: "Mutuelle Santé",
    date: "10 janvier 2024",
    readTime: "7 min"
  },
  {
    title: "Assurance habitation : ce qui change en 2024",
    description: "Les nouvelles réglementations et tendances de l'assurance habitation pour cette année.",
    category: "Assurance Habitation",
    date: "5 janvier 2024",
    readTime: "4 min"
  },
  {
    title: "Protéger son animal : pourquoi souscrire une assurance ?",
    description: "Les avantages d'une assurance animaux et comment choisir la meilleure couverture pour votre compagnon.",
    category: "Assurance Animaux",
    date: "28 décembre 2023",
    readTime: "6 min"
  },
  {
    title: "Assurance emprunteur : tout ce qu'il faut savoir",
    description: "Comment optimiser le coût de votre assurance prêt immobilier grâce à la délégation d'assurance.",
    category: "Assurance Prêt",
    date: "20 décembre 2023",
    readTime: "8 min"
  },
  {
    title: "Les pièges à éviter lors de la souscription d'une assurance",
    description: "Nos experts vous révèlent les erreurs courantes à ne pas commettre pour éviter les mauvaises surprises.",
    category: "Conseils",
    date: "15 décembre 2023",
    readTime: "5 min"
  }
];

const Blog = () => {
  return (
    <div className="min-h-screen">
      <Header />
      
      <main className="container mx-auto px-4 py-16">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              Blog & Actualités
            </h1>
            <p className="text-lg text-muted-foreground">
              Conseils, guides et actualités pour tout savoir sur les assurances
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {blogPosts.map((post, index) => (
              <Card key={index} className="hover:shadow-lg transition-all hover-lift cursor-pointer">
                <CardHeader>
                  <div className="flex items-center gap-2 text-sm text-primary font-semibold mb-2">
                    {post.category}
                  </div>
                  <CardTitle className="text-xl">{post.title}</CardTitle>
                  <CardDescription className="text-muted-foreground">
                    {post.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span>{post.date}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>{post.readTime}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="mt-16 bg-gradient-to-br from-primary/10 to-accent/10 p-8 rounded-xl text-center">
            <h2 className="text-2xl font-bold mb-4">Restez informé</h2>
            <p className="text-muted-foreground mb-6">
              Abonnez-vous à notre newsletter pour recevoir nos derniers articles et conseils directement dans votre boîte mail.
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Blog;
