import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SEO from '@/components/SEO';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, Lock, Eye, Database, UserCheck } from 'lucide-react';

const PolitiqueConfidentialite = () => {
  return (
    <>
      <SEO 
        title="Politique de Confidentialité - Le Comparateur Assurance"
        description="Politique de confidentialité et protection des données personnelles du Comparateur Assurance"
      />
      
      <div className="min-h-screen flex flex-col">
        <Header />
        
        <main id="main-content" className="flex-grow bg-gray-50 py-12">
          <div className="container mx-auto px-4 max-w-4xl">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                <Shield className="h-8 w-8 text-primary" />
              </div>
              <h1 className="text-4xl font-bold text-gray-900 mb-4">Politique de Confidentialité</h1>
              <p className="text-muted-foreground">
                Dernière mise à jour : {new Date().toLocaleDateString('fr-FR')}
              </p>
            </div>
            
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Eye className="h-5 w-5 text-primary" />
                    Introduction
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p>
                    Le Comparateur Assurance accorde une grande importance à la protection de vos données personnelles. 
                    Cette politique de confidentialité vous informe sur la manière dont nous collectons, utilisons et protégeons 
                    vos données conformément au RGPD (Règlement Général sur la Protection des Données).
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Database className="h-5 w-5 text-primary" />
                    1. Responsable du traitement
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <p><strong>Responsable :</strong> Le Comparateur Assurance</p>
                  <p><strong>Adresse :</strong> [Adresse à compléter]</p>
                  <p><strong>Email :</strong> contact@lecomparateurassurance.fr</p>
                  <p><strong>DPO (Délégué à la Protection des Données) :</strong> [Email DPO]</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>2. Données collectées</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="font-semibold mb-2">Nous collectons les données suivantes :</p>
                  
                  <div className="space-y-3">
                    <div>
                      <p className="font-semibold text-sm">Données d'identification :</p>
                      <ul className="list-disc pl-6 text-sm space-y-1">
                        <li>Nom et prénom</li>
                        <li>Adresse email</li>
                        <li>Numéro de téléphone</li>
                        <li>Adresse postale</li>
                      </ul>
                    </div>

                    <div>
                      <p className="font-semibold text-sm">Données relatives à votre demande de devis :</p>
                      <ul className="list-disc pl-6 text-sm space-y-1">
                        <li>Type d'assurance recherchée</li>
                        <li>Caractéristiques du bien ou véhicule à assurer</li>
                        <li>Situation personnelle (âge, profession, etc.)</li>
                        <li>Historique de sinistres si applicable</li>
                      </ul>
                    </div>

                    <div>
                      <p className="font-semibold text-sm">Données de navigation :</p>
                      <ul className="list-disc pl-6 text-sm space-y-1">
                        <li>Adresse IP</li>
                        <li>Type de navigateur</li>
                        <li>Pages consultées</li>
                        <li>Cookies (voir notre politique cookies)</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>3. Finalités du traitement</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="mb-2">Vos données sont utilisées pour :</p>
                  <ul className="list-disc pl-6 space-y-1">
                    <li>Traiter vos demandes de devis</li>
                    <li>Vous mettre en relation avec nos partenaires assureurs</li>
                    <li>Vous contacter pour compléter votre demande</li>
                    <li>Améliorer nos services</li>
                    <li>Respecter nos obligations légales</li>
                    <li>Réaliser des statistiques anonymisées</li>
                    <li>Vous envoyer des informations si vous y consentez</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>4. Base légale du traitement</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="mb-2">Le traitement de vos données repose sur :</p>
                  <ul className="list-disc pl-6 space-y-1">
                    <li><strong>Votre consentement :</strong> pour l'envoi de communications marketing</li>
                    <li><strong>L'exécution du contrat :</strong> pour traiter votre demande de devis</li>
                    <li><strong>L'intérêt légitime :</strong> pour améliorer nos services</li>
                    <li><strong>Les obligations légales :</strong> pour respecter la réglementation</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>5. Destinataires des données</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="mb-2">Vos données peuvent être transmises à :</p>
                  <ul className="list-disc pl-6 space-y-1">
                    <li>Nos partenaires assureurs et courtiers (uniquement les données nécessaires)</li>
                    <li>Nos prestataires techniques (hébergement, emailing, etc.)</li>
                    <li>Les autorités compétentes si requis par la loi</li>
                  </ul>
                  <p className="mt-3 text-sm text-muted-foreground">
                    Nous nous assurons que tous les destinataires respectent la réglementation sur la protection des données.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>6. Durée de conservation</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    <li><strong>Demandes de devis :</strong> 3 ans à compter de votre dernier contact</li>
                    <li><strong>Prospects non convertis :</strong> 3 ans maximum</li>
                    <li><strong>Clients :</strong> Durée du contrat + 5 ans (prescriptions légales)</li>
                    <li><strong>Cookies :</strong> Maximum 13 mois</li>
                    <li><strong>Données de connexion :</strong> 1 an maximum</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <UserCheck className="h-5 w-5 text-primary" />
                    7. Vos droits
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="mb-2">Conformément au RGPD, vous disposez des droits suivants :</p>
                  <ul className="list-disc pl-6 space-y-1">
                    <li><strong>Droit d'accès :</strong> obtenir une copie de vos données</li>
                    <li><strong>Droit de rectification :</strong> corriger vos données inexactes</li>
                    <li><strong>Droit à l'effacement :</strong> demander la suppression de vos données</li>
                    <li><strong>Droit à la limitation :</strong> limiter le traitement de vos données</li>
                    <li><strong>Droit à la portabilité :</strong> récupérer vos données dans un format structuré</li>
                    <li><strong>Droit d'opposition :</strong> vous opposer au traitement de vos données</li>
                    <li><strong>Droit de retrait du consentement :</strong> à tout moment</li>
                  </ul>
                  
                  <div className="mt-4 p-3 bg-primary/10 rounded-lg">
                    <p className="font-semibold text-sm">Pour exercer vos droits :</p>
                    <p className="text-sm mt-1">Contactez-nous par email : contact@lecomparateurassurance.fr</p>
                    <p className="text-sm">Ou par courrier à notre adresse avec justificatif d'identité</p>
                  </div>

                  <p className="mt-3 text-sm text-muted-foreground">
                    Vous disposez également du droit de déposer une réclamation auprès de la CNIL (www.cnil.fr).
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Lock className="h-5 w-5 text-primary" />
                    8. Sécurité des données
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="mb-2">Nous mettons en œuvre des mesures techniques et organisationnelles pour protéger vos données :</p>
                  <ul className="list-disc pl-6 space-y-1">
                    <li>Chiffrement des données (SSL/TLS)</li>
                    <li>Serveurs sécurisés</li>
                    <li>Accès restreint aux données personnelles</li>
                    <li>Sauvegardes régulières</li>
                    <li>Sensibilisation de nos équipes</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>9. Cookies</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>
                    Notre site utilise des cookies pour améliorer votre expérience. Pour plus d'informations, 
                    consultez notre{' '}
                    <a href="/politique-cookies" className="text-primary hover:underline">Politique de cookies</a>.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>10. Transferts internationaux</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>
                    Vos données sont hébergées au sein de l'Union Européenne. En cas de transfert hors UE, 
                    nous nous assurons que des garanties appropriées sont en place (clauses contractuelles types, etc.).
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>11. Modifications</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>
                    Nous nous réservons le droit de modifier cette politique de confidentialité à tout moment. 
                    Les modifications prendront effet dès leur publication sur le site. Nous vous encourageons à consulter 
                    régulièrement cette page.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>12. Contact</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>
                    Pour toute question concernant cette politique de confidentialité ou le traitement de vos données personnelles :
                  </p>
                  <div className="mt-3 space-y-1">
                    <p><strong>Email :</strong> contact@lecomparateurassurance.fr</p>
                    <p><strong>DPO :</strong> [Email DPO]</p>
                    <p><strong>Page de contact :</strong> <a href="/contact" className="text-primary hover:underline">Formulaire de contact</a></p>
                  </div>
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

export default PolitiqueConfidentialite;
