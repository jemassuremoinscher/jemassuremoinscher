import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SEO from '@/components/SEO';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const CGU = () => {
  return (
    <>
      <SEO 
        title="Conditions Générales d'Utilisation - jemassurmoinscher"
        description="Conditions générales d'utilisation du service jemassurmoinscher"
      />
      
      <div className="min-h-screen flex flex-col">
        <Header />
        
        <main id="main-content" className="flex-grow bg-gray-50 py-12">
          <div className="container mx-auto px-4 max-w-4xl">
            <h1 className="text-4xl font-bold text-gray-900 mb-8">Conditions Générales d'Utilisation</h1>
            
            <p className="text-muted-foreground mb-6">Dernière mise à jour : {new Date().toLocaleDateString('fr-FR')}</p>
            
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>1. Objet</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>
                    Les présentes Conditions Générales d'Utilisation (CGU) ont pour objet de définir les modalités et conditions 
                    d'utilisation du site jemassurmoinscher ainsi que les droits et obligations des utilisateurs.
                  </p>
                  <p className="mt-2">
                    L'utilisation du site implique l'acceptation pleine et entière des présentes CGU.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>2. Accès au service</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>
                    Le service est accessible gratuitement à tout utilisateur disposant d'un accès à Internet. 
                    Tous les frais supportés par l'utilisateur pour accéder au service (matériel informatique, logiciels, 
                    connexion Internet, etc.) sont à sa charge.
                  </p>
                  <p className="mt-2">
                    jemassurmoinscher se réserve le droit de suspendre, d'interrompre ou de limiter l'accès à tout ou partie 
                    du site, notamment pour des raisons de maintenance, sans préavis ni indemnité.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>3. Nature du service</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>
                    jemassurmoinscher est un service de comparaison en ligne permettant aux utilisateurs de comparer 
                    différentes offres d'assurance proposées par nos partenaires.
                  </p>
                  <p className="mt-2">
                    <strong>Important :</strong> jemassurmoinscher n'est pas un assureur et n'émet pas de contrats d'assurance.
                    Notre rôle se limite à la mise en relation entre les utilisateurs et les assureurs ou courtiers partenaires.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>4. Demande de devis</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>
                    Lorsque vous effectuez une demande de devis via notre site :
                  </p>
                  <ul className="list-disc pl-6 mt-2 space-y-1">
                    <li>Vous vous engagez à fournir des informations exactes et à jour</li>
                    <li>Vos données peuvent être transmises à nos partenaires assureurs</li>
                    <li>Vous pouvez être contacté par nos partenaires pour finaliser votre demande</li>
                    <li>Les tarifs affichés sont indicatifs et peuvent varier</li>
                    <li>Aucun engagement de souscription n'est pris en remplissant le formulaire</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>5. Données personnelles</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>
                    jemassurmoinscher collecte et traite vos données personnelles dans le respect du RGPD 
                    (Règlement Général sur la Protection des Données).
                  </p>
                  <p className="mt-2">
                    Pour plus d'informations sur le traitement de vos données, consultez notre{' '}
                    <a href="/politique-confidentialite" className="text-primary hover:underline">
                      Politique de confidentialité
                    </a>.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>6. Propriété intellectuelle</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>
                    L'ensemble du contenu du site (textes, images, logos, vidéos, etc.) est protégé par le droit de la propriété 
                    intellectuelle. Toute reproduction, représentation, modification ou exploitation non autorisée est interdite.
                  </p>
                  <p className="mt-2">
                    Les marques et logos des assureurs partenaires sont la propriété de leurs détenteurs respectifs.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>7. Responsabilité</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>
                    jemassurmoinscher s'efforce de fournir des informations fiables et actualisées. Cependant :
                  </p>
                  <ul className="list-disc pl-6 mt-2 space-y-1">
                    <li>Les informations sont fournies à titre indicatif</li>
                    <li>Nous ne garantissons pas l'exactitude ou l'exhaustivité des données</li>
                    <li>Les tarifs peuvent varier selon les assureurs</li>
                    <li>Nous ne sommes pas responsables des décisions prises sur la base de ces informations</li>
                    <li>La responsabilité du comparateur ne peut être engagée en cas de litige avec un assureur</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>8. Liens externes</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>
                    Le site peut contenir des liens vers des sites externes. jemassurmoinscher n'exerce aucun contrôle 
                    sur ces sites et décline toute responsabilité quant à leur contenu.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>9. Modification des CGU</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>
                    jemassurmoinscher se réserve le droit de modifier les présentes CGU à tout moment. 
                    Les modifications entrent en vigueur dès leur publication sur le site.
                  </p>
                  <p className="mt-2">
                    Il est conseillé aux utilisateurs de consulter régulièrement les CGU.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>10. Droit applicable et juridiction</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>
                    Les présentes CGU sont soumises au droit français. En cas de litige, les tribunaux français seront 
                    seuls compétents.
                  </p>
                  <p className="mt-2">
                    Conformément à la réglementation en vigueur, l'utilisateur a la possibilité de recourir à une médiation 
                    conventionnelle ou à tout autre mode alternatif de règlement des différends.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>11. Contact</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>
                    Pour toute question concernant les présentes CGU, vous pouvez nous contacter via notre{' '}
                    <a href="/contact" className="text-primary hover:underline">page de contact</a>.
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

export default CGU;
