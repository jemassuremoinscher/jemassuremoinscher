import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Check, X, Car, Bike, Home, Heart } from "lucide-react";
import SEO from "@/components/SEO";

const ComparateurGaranties = () => {
  const autoGaranties = [
    {
      category: "Responsabilité Civile",
      economique: true,
      confort: true,
      premium: true,
      description: "Dommages causés aux tiers"
    },
    {
      category: "Dommages Collision",
      economique: false,
      confort: true,
      premium: true,
      description: "En cas d'accident responsable"
    },
    {
      category: "Vol & Incendie",
      economique: false,
      confort: true,
      premium: true,
      description: "Protection contre le vol et l'incendie"
    },
    {
      category: "Bris de Glace",
      economique: false,
      confort: "Franchise 50€",
      premium: "Sans franchise",
      description: "Pare-brise, vitres, optiques"
    },
    {
      category: "Catastrophes Naturelles",
      economique: true,
      confort: true,
      premium: true,
      description: "Tempête, inondation, grêle"
    },
    {
      category: "Assistance 0 km",
      economique: false,
      confort: true,
      premium: true,
      description: "Dépannage dès le premier kilomètre"
    },
    {
      category: "Véhicule de Remplacement",
      economique: false,
      confort: "5 jours",
      premium: "30 jours",
      description: "En cas d'accident ou panne"
    },
    {
      category: "Protection Juridique",
      economique: false,
      confort: false,
      premium: true,
      description: "Défense en cas de litige"
    },
    {
      category: "Valeur à Neuf",
      economique: false,
      confort: "12 mois",
      premium: "24 mois",
      description: "Remboursement valeur d'achat"
    },
    {
      category: "Accessoires & Aménagements",
      economique: false,
      confort: "2 000€",
      premium: "5 000€",
      description: "GPS, autoradio, attelage..."
    }
  ];

  const motoGaranties = [
    {
      category: "Responsabilité Civile",
      economique: true,
      confort: true,
      premium: true,
      description: "Dommages causés aux tiers"
    },
    {
      category: "Dommages Tous Accidents",
      economique: false,
      confort: true,
      premium: true,
      description: "Même si vous êtes responsable"
    },
    {
      category: "Vol & Incendie",
      economique: false,
      confort: true,
      premium: true,
      description: "Protection complète"
    },
    {
      category: "Équipements",
      economique: false,
      confort: "1 500€",
      premium: "3 000€",
      description: "Casque, blouson, gants, bottes"
    },
    {
      category: "Garantie Conducteur",
      economique: "50 000€",
      confort: "500 000€",
      premium: "1 000 000€",
      description: "Indemnisation corporelle"
    },
    {
      category: "Assistance 0 km",
      economique: false,
      confort: true,
      premium: true,
      description: "Dépannage et remorquage"
    },
    {
      category: "Accessoires & Aménagements",
      economique: false,
      confort: "1 000€",
      premium: "2 500€",
      description: "Top case, GPS, antivol..."
    },
    {
      category: "Valeur d'Achat",
      economique: false,
      confort: "12 mois",
      premium: "24 mois",
      description: "Pour moto neuve ou récente"
    },
    {
      category: "Prêt de Véhicule",
      economique: false,
      confort: "5 jours",
      premium: "15 jours",
      description: "En cas d'immobilisation"
    }
  ];

  const habitationGaranties = [
    {
      category: "Responsabilité Civile",
      economique: true,
      confort: true,
      premium: true,
      description: "Dommages causés à des tiers"
    },
    {
      category: "Incendie & Explosion",
      economique: true,
      confort: true,
      premium: true,
      description: "Dommages par le feu"
    },
    {
      category: "Dégâts des Eaux",
      economique: true,
      confort: true,
      premium: true,
      description: "Fuites, infiltrations, gel"
    },
    {
      category: "Vol & Vandalisme",
      economique: "Effraction",
      confort: true,
      premium: true,
      description: "Protection contre le vol"
    },
    {
      category: "Bris de Glace",
      economique: false,
      confort: true,
      premium: true,
      description: "Vitres, miroirs, plaques"
    },
    {
      category: "Catastrophes Naturelles",
      economique: true,
      confort: true,
      premium: true,
      description: "Inondation, sécheresse, tempête"
    },
    {
      category: "Valeur Mobilier",
      economique: "20 000€",
      confort: "40 000€",
      premium: "80 000€",
      description: "Capital mobilier garanti"
    },
    {
      category: "Objets de Valeur",
      economique: false,
      confort: "5 000€",
      premium: "15 000€",
      description: "Bijoux, œuvres d'art..."
    },
    {
      category: "Protection Juridique",
      economique: false,
      confort: "10 000€",
      premium: "30 000€",
      description: "Défense en cas de litige"
    },
    {
      category: "Assistance à Domicile",
      economique: false,
      confort: true,
      premium: true,
      description: "Plombier, serrurier 24h/24"
    },
    {
      category: "Remplacement à Neuf",
      economique: false,
      confort: "2 ans",
      premium: "5 ans",
      description: "Biens mobiliers"
    }
  ];

  const santeGaranties = [
    {
      category: "Consultations Généraliste",
      economique: "100%",
      confort: "150%",
      premium: "200%",
      description: "Base Sécurité sociale"
    },
    {
      category: "Consultations Spécialiste",
      economique: "100%",
      confort: "200%",
      premium: "300%",
      description: "Y compris dépassements"
    },
    {
      category: "Pharmacie",
      economique: "100%",
      confort: "100%",
      premium: "100%",
      description: "Médicaments remboursés"
    },
    {
      category: "Analyses & Radiologie",
      economique: "100%",
      confort: "150%",
      premium: "200%",
      description: "Examens médicaux"
    },
    {
      category: "Hospitalisation",
      economique: "100%",
      confort: "200%",
      premium: "300%",
      description: "Chambre individuelle incluse"
    },
    {
      category: "Optique (annuel)",
      economique: "100€",
      confort: "250€",
      premium: "500€",
      description: "Lunettes et lentilles"
    },
    {
      category: "Dentaire Prothèses",
      economique: "150%",
      confort: "300%",
      premium: "500%",
      description: "Couronnes, bridges, implants"
    },
    {
      category: "Orthodontie (par semestre)",
      economique: "200€",
      confort: "500€",
      premium: "1 000€",
      description: "Enfants et adultes"
    },
    {
      category: "Médecines Douces",
      economique: false,
      confort: "150€/an",
      premium: "300€/an",
      description: "Ostéo, kiné, acupuncture"
    },
    {
      category: "Maternité",
      economique: "300€",
      confort: "600€",
      premium: "1 200€",
      description: "Forfait naissance"
    },
    {
      category: "Cures Thermales",
      economique: false,
      confort: "300€",
      premium: "600€",
      description: "Par an"
    }
  ];

  const renderCell = (value: boolean | string) => {
    if (value === true) {
      return <Check className="h-5 w-5 text-green-600 mx-auto" />;
    }
    if (value === false) {
      return <X className="h-5 w-5 text-muted-foreground mx-auto opacity-30" />;
    }
    return <span className="text-sm font-medium text-primary">{value}</span>;
  };

  const renderTable = (garanties: any[], priceEco: string, priceConfort: string, pricePremium: string) => (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b-2 border-border">
            <th className="text-left p-4 w-1/4">
              <span className="text-base font-bold">Garanties</span>
            </th>
            <th className="text-center p-4 w-1/4">
              <div className="space-y-1">
                <Badge variant="outline" className="mb-2">Économique</Badge>
                <div className="text-2xl font-bold text-primary">{priceEco}</div>
                <div className="text-xs text-muted-foreground">par mois</div>
              </div>
            </th>
            <th className="text-center p-4 w-1/4 bg-primary/5">
              <div className="space-y-1">
                <Badge className="mb-2">Confort</Badge>
                <div className="text-2xl font-bold text-primary">{priceConfort}</div>
                <div className="text-xs text-muted-foreground">par mois</div>
              </div>
            </th>
            <th className="text-center p-4 w-1/4">
              <div className="space-y-1">
                <Badge variant="secondary" className="mb-2">Premium</Badge>
                <div className="text-2xl font-bold text-primary">{pricePremium}</div>
                <div className="text-xs text-muted-foreground">par mois</div>
              </div>
            </th>
          </tr>
        </thead>
        <tbody>
          {garanties.map((garantie, index) => (
            <tr key={index} className="border-b border-border hover:bg-muted/30 transition-colors">
              <td className="p-4">
                <div>
                  <div className="font-semibold text-sm">{garantie.category}</div>
                  <div className="text-xs text-muted-foreground mt-1">{garantie.description}</div>
                </div>
              </td>
              <td className="p-4 text-center">
                {renderCell(garantie.economique)}
              </td>
              <td className="p-4 text-center bg-primary/5">
                {renderCell(garantie.confort)}
              </td>
              <td className="p-4 text-center">
                {renderCell(garantie.premium)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  return (
    <div className="min-h-screen">
      <SEO 
        title="Comparateur de Garanties - Toutes les Formules Détaillées"
        description="Comparez en détail les garanties des formules économique, confort et premium pour l'assurance auto, moto, habitation et santé. Tableaux comparatifs complets."
        keywords="comparateur garanties assurance, formules assurance, garanties auto moto habitation santé"
        canonical="https://votre-domaine.fr/comparateur-garanties"
      />
      <Header />
      
      <section className="bg-gradient-to-br from-primary/5 to-primary/10 py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl font-bold text-foreground mb-6">Comparateur de Garanties</h1>
            <p className="text-xl text-muted-foreground mb-8">
              Comparez en détail les garanties de nos formules Économique, Confort et Premium 
              pour trouver la protection idéale adaptée à vos besoins et votre budget.
            </p>
          </div>
        </div>
      </section>

      <main className="container mx-auto px-4 py-12">
        <Tabs defaultValue="auto" className="w-full">
          <TabsList className="grid w-full max-w-2xl mx-auto grid-cols-4 mb-8">
            <TabsTrigger value="auto" className="flex items-center gap-2">
              <Car className="h-4 w-4" />
              <span className="hidden sm:inline">Auto</span>
            </TabsTrigger>
            <TabsTrigger value="moto" className="flex items-center gap-2">
              <Bike className="h-4 w-4" />
              <span className="hidden sm:inline">Moto</span>
            </TabsTrigger>
            <TabsTrigger value="habitation" className="flex items-center gap-2">
              <Home className="h-4 w-4" />
              <span className="hidden sm:inline">Habitation</span>
            </TabsTrigger>
            <TabsTrigger value="sante" className="flex items-center gap-2">
              <Heart className="h-4 w-4" />
              <span className="hidden sm:inline">Santé</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="auto">
            <Card className="p-6">
              <div className="mb-6">
                <h2 className="text-3xl font-bold mb-2">Assurance Auto</h2>
                <p className="text-muted-foreground">
                  Comparez les garanties selon votre niveau de protection souhaité
                </p>
              </div>
              {renderTable(autoGaranties, "65€", "95€", "145€")}
            </Card>
          </TabsContent>

          <TabsContent value="moto">
            <Card className="p-6">
              <div className="mb-6">
                <h2 className="text-3xl font-bold mb-2">Assurance Moto</h2>
                <p className="text-muted-foreground">
                  Protection adaptée à votre deux-roues et votre pratique
                </p>
              </div>
              {renderTable(motoGaranties, "50€", "85€", "135€")}
            </Card>
          </TabsContent>

          <TabsContent value="habitation">
            <Card className="p-6">
              <div className="mb-6">
                <h2 className="text-3xl font-bold mb-2">Assurance Habitation</h2>
                <p className="text-muted-foreground">
                  Protégez votre logement et vos biens selon vos besoins
                </p>
              </div>
              {renderTable(habitationGaranties, "12€", "22€", "38€")}
            </Card>
          </TabsContent>

          <TabsContent value="sante">
            <Card className="p-6">
              <div className="mb-6">
                <h2 className="text-3xl font-bold mb-2">Mutuelle Santé</h2>
                <p className="text-muted-foreground">
                  Choisissez votre niveau de remboursement pour vos frais de santé
                </p>
              </div>
              {renderTable(santeGaranties, "45€", "85€", "145€")}
            </Card>
          </TabsContent>
        </Tabs>

        <section className="mt-16 max-w-4xl mx-auto">
          <Card className="p-8 bg-gradient-to-br from-primary/5 to-primary/10">
            <h2 className="text-2xl font-bold mb-4 text-center">Comment choisir ?</h2>
            <div className="grid md:grid-cols-3 gap-6 mt-6">
              <div className="text-center">
                <Badge variant="outline" className="mb-3">Économique</Badge>
                <p className="text-sm text-muted-foreground">
                  Idéal pour les petits budgets avec les garanties essentielles obligatoires
                </p>
              </div>
              <div className="text-center">
                <Badge className="mb-3">Confort</Badge>
                <p className="text-sm text-muted-foreground">
                  Le meilleur rapport qualité-prix avec une protection équilibrée et complète
                </p>
              </div>
              <div className="text-center">
                <Badge variant="secondary" className="mb-3">Premium</Badge>
                <p className="text-sm text-muted-foreground">
                  Protection maximale sans franchise avec les meilleures garanties du marché
                </p>
              </div>
            </div>
          </Card>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default ComparateurGaranties;
