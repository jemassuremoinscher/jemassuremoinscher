import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, ArrowRight, TrendingUp } from 'lucide-react';
import { blogArticles } from '@/data/blogArticles';

export const BlogHighlights = () => {
  const navigate = useNavigate();
  
  // Prendre les 3 articles les plus récents
  const featuredArticles = blogArticles.slice(0, 3);

  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <Badge className="mb-4">
            <TrendingUp className="w-4 h-4 mr-2" />
            Blog & Actualités
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Guides et Conseils Assurance 2025
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Découvrez nos articles experts pour bien choisir votre assurance et économiser jusqu\'à 947€ par an
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {featuredArticles.map((article) => (
            <Card 
              key={article.id} 
              className="hover:shadow-elegant transition-all hover-lift cursor-pointer group h-full flex flex-col"
              onClick={() => navigate(`/blog/${article.slug}`)}
            >
              <CardHeader className="flex-grow">
                <Badge className="mb-3 w-fit">{article.category}</Badge>
                <CardTitle className="text-xl group-hover:text-primary transition-colors line-clamp-2">
                  {article.title}
                </CardTitle>
                <CardDescription className="text-muted-foreground line-clamp-3 mt-2">
                  {article.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    <span>{article.date}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>{article.readTime}</span>
                  </div>
                </div>
                <Button 
                  variant="ghost" 
                  className="w-full group-hover:bg-primary/10"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/blog/${article.slug}`);
                  }}
                >
                  Lire l\'article
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center">
          <Button 
            size="lg" 
            variant="outline"
            onClick={() => navigate('/blog')}
            className="gap-2"
          >
            Voir tous les articles
            <ArrowRight className="h-5 w-5" />
          </Button>
        </div>

        {/* SEO Keywords Section */}
        <div className="mt-12 p-6 bg-gradient-subtle rounded-xl">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 text-sm">
            <div>
              <h3 className="font-semibold mb-3 text-primary">Guides Pratiques</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li>• Meilleure assurance auto 2025</li>
                <li>• Top mutuelles santé</li>
                <li>• Assurance jeune conducteur</li>
                <li>• Comparatif habitation</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-3 text-primary">Actualités Légales</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li>• Loi Lemoine 2025</li>
                <li>• Loi Hamon résiliation</li>
                <li>• Nouvelle réglementation</li>
                <li>• Droits des assurés</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-3 text-primary">Conseils Experts</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li>• Économiser sur ses contrats</li>
                <li>• Choisir ses garanties</li>
                <li>• Éviter les pièges</li>
                <li>• Optimiser sa couverture</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-3 text-primary">Par Type</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li>• Auto & Moto</li>
                <li>• Santé & Prévoyance</li>
                <li>• Habitation & PNO</li>
                <li>• Vie & Emprunteur</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
