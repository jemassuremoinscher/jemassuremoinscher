import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SEO from '@/components/SEO';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const MentionsLegales = () => {
  return (
    <>
      <SEO 
        title="Mentions Légales - jemassuremoinscher"
        description="Mentions légales et informations juridiques de jemassuremoinscher"
      />
      
      <div className="min-h-screen flex flex-col">
        <Header />
        
        <main id="main-content" className="flex-grow bg-gray-50 py-12">
          <div className="container mx-auto px-4 max-w-4xl">
            <h1 className="text-4xl font-bold text-gray-900 mb-8">Mentions Légales</h1>
            
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Éditeur du site</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <p><strong>Raison sociale :</strong> jemassuremoinscher</p>
                  <p><strong>Forme juridique :</strong> SAS (Société par Actions Simplifiée)</p>
                  <p><strong>Capital social :</strong> 10 000 €</p>
                  <p><strong>Siège social :</strong> [Adresse à compléter]</p>
                  <p><strong>RCS :</strong> [Numéro à compléter]</p>
                  <p><strong>SIRET :</strong> [Numéro à compléter]</p>
                  <p><strong>Email :</strong> contact@jemassuremoinscher.fr</p>
                  <p><strong>Téléphone :</strong> [Numéro à compléter]</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Directeur de la publication</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>[Nom du directeur de publication]</p>
                  <p>En qualité de [Fonction]</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Hébergement</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <p><strong>Hébergeur :</strong> Lovable (GPE.com)</p>
                  <p><strong>Adresse :</strong> [Adresse de l'hébergeur]</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Activité</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>jemassuremoinscher est un service de comparaison en ligne d'offres d'assurance.</p>
                  <p className="mt-2">
                    Notre activité consiste à mettre en relation des prospects avec des assureurs et courtiers partenaires. 
                    Nous ne sommes pas un organisme d'assurance et n'assurons pas directement les clients.
                  </p>
                  <p className="mt-2">
                    <strong>Numéro ORIAS :</strong> [Numéro à compléter si applicable]
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Propriété intellectuelle</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>
                    L'ensemble du contenu de ce site (textes, images, vidéos, logos, etc.) est protégé par le droit d'auteur. 
                    Toute reproduction, même partielle, est interdite sans autorisation préalable.
                  </p>
                  <p className="mt-2">
                    Les marques et logos présents sur ce site sont la propriété de leurs détenteurs respectifs.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Cookies et données personnelles</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>
                    Pour plus d'informations sur notre utilisation des cookies et le traitement de vos données personnelles, 
                    veuillez consulter notre{' '}
                    <a href="/politique-cookies" className="text-primary hover:underline">Politique de cookies</a>
                    {' '}et notre{' '}
                    <a href="/politique-confidentialite" className="text-primary hover:underline">Politique de confidentialité</a>.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Responsabilité</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>
                    jemassuremoinscher met tout en œuvre pour offrir des informations fiables et à jour. 
                    Cependant, nous ne pouvons garantir l'exactitude, la précision ou l'exhaustivité des informations mises à disposition.
                  </p>
                  <p className="mt-2">
                    Les tarifs et garanties affichés sont fournis à titre indicatif et peuvent varier. 
                    Nous vous invitons à vérifier les conditions auprès des assureurs directement.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Médiation</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>
                    Conformément aux dispositions du Code de la consommation concernant le règlement amiable des litiges, 
                    jemassuremoinscher adhère au Service du Médiateur [Nom du médiateur].
                  </p>
                  <p className="mt-2">
                    En cas de litige, vous pouvez déposer votre réclamation sur son site : [URL du médiateur]
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default MentionsLegales;
