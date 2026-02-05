import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Check, X, Car, Bike, Home, Heart, Building2, Briefcase, PiggyBank, Phone, MessageCircle, Shield, Users, TrendingUp, Key } from "lucide-react";
import { Link } from "react-router-dom";
import SEO from "@/components/SEO";
import arthurThinking from "@/assets/mascotte/arthur-thinking.png";
import arthurThumbsUp from "@/assets/mascotte/arthur-thumbs-up.png";
import arthurFlying from "@/assets/mascotte/arthur-flying.png";
import arthurRunning from "@/assets/mascotte/arthur-running.png";
import arthurStanding from "@/assets/mascotte/arthur-standing.png";

const ComparateurGaranties = () => {
  // ========== PARTICULIERS ==========
  const autoGaranties = [
    { category: "Responsabilité Civile", economique: true, confort: true, premium: true, description: "Dommages causés aux tiers" },
    { category: "Dommages Collision", economique: false, confort: true, premium: true, description: "En cas d'accident responsable" },
    { category: "Vol & Incendie", economique: false, confort: true, premium: true, description: "Protection contre le vol et l'incendie" },
    { category: "Bris de Glace", economique: false, confort: "Franchise 50€", premium: "Sans franchise", description: "Pare-brise, vitres, optiques" },
    { category: "Assistance 0 km", economique: false, confort: true, premium: true, description: "Dépannage dès le premier kilomètre" },
    { category: "Véhicule de Remplacement", economique: false, confort: "5 jours", premium: "30 jours", description: "En cas d'accident ou panne" },
    { category: "Valeur à Neuf", economique: false, confort: "12 mois", premium: "24 mois", description: "Remboursement valeur d'achat" },
  ];

  const motoGaranties = [
    { category: "Responsabilité Civile", economique: true, confort: true, premium: true, description: "Dommages causés aux tiers" },
    { category: "Dommages Tous Accidents", economique: false, confort: true, premium: true, description: "Même si vous êtes responsable" },
    { category: "Vol & Incendie", economique: false, confort: true, premium: true, description: "Protection complète" },
    { category: "Équipements", economique: false, confort: "1 500€", premium: "3 000€", description: "Casque, blouson, gants, bottes" },
    { category: "Garantie Conducteur", economique: "50 000€", confort: "500 000€", premium: "1 000 000€", description: "Indemnisation corporelle" },
    { category: "Assistance 0 km", economique: false, confort: true, premium: true, description: "Dépannage et remorquage" },
  ];

  const habitationGaranties = [
    { category: "Responsabilité Civile", economique: true, confort: true, premium: true, description: "Dommages causés à des tiers" },
    { category: "Incendie & Explosion", economique: true, confort: true, premium: true, description: "Dommages par le feu" },
    { category: "Dégâts des Eaux", economique: true, confort: true, premium: true, description: "Fuites, infiltrations, gel" },
    { category: "Vol & Vandalisme", economique: "Effraction", confort: true, premium: true, description: "Protection contre le vol" },
    { category: "Valeur Mobilier", economique: "20 000€", confort: "40 000€", premium: "80 000€", description: "Capital mobilier garanti" },
    { category: "Assistance à Domicile", economique: false, confort: true, premium: true, description: "Plombier, serrurier 24h/24" },
  ];

  const santeGaranties = [
    { category: "Consultations Généraliste", economique: "100%", confort: "150%", premium: "200%", description: "Base Sécurité sociale" },
    { category: "Consultations Spécialiste", economique: "100%", confort: "200%", premium: "300%", description: "Y compris dépassements" },
    { category: "Hospitalisation", economique: "100%", confort: "200%", premium: "300%", description: "Chambre individuelle incluse" },
    { category: "Optique (annuel)", economique: "100€", confort: "250€", premium: "500€", description: "Lunettes et lentilles" },
    { category: "Dentaire Prothèses", economique: "150%", confort: "300%", premium: "500%", description: "Couronnes, bridges, implants" },
    { category: "Médecines Douces", economique: false, confort: "150€/an", premium: "300€/an", description: "Ostéo, kiné, acupuncture" },
  ];

  const animauxGaranties = [
    { category: "Frais Vétérinaires", economique: "1 000€/an", confort: "2 500€/an", premium: "5 000€/an", description: "Consultations et soins" },
    { category: "Chirurgie", economique: "70%", confort: "85%", premium: "100%", description: "Opérations chirurgicales" },
    { category: "Médicaments", economique: "50%", confort: "75%", premium: "100%", description: "Traitements prescrits" },
    { category: "Vaccins", economique: false, confort: "50€/an", premium: "100€/an", description: "Vaccinations annuelles" },
    { category: "Responsabilité Civile", economique: true, confort: true, premium: true, description: "Dommages causés par l'animal" },
  ];

  // ========== PROFESSIONNELS ==========
  const rcProGaranties = [
    { category: "RC Exploitation", economique: true, confort: true, premium: true, description: "Dommages dans l'exercice de l'activité" },
    { category: "RC Professionnelle", economique: true, confort: true, premium: true, description: "Erreurs, omissions, fautes" },
    { category: "Plafond de garantie", economique: "500 000€", confort: "1 500 000€", premium: "3 000 000€", description: "Par sinistre" },
    { category: "Défense Pénale", economique: false, confort: true, premium: true, description: "Assistance juridique" },
    { category: "Atteinte à la réputation", economique: false, confort: "50 000€", premium: "150 000€", description: "E-réputation et image" },
    { category: "Cyber-risques", economique: false, confort: false, premium: true, description: "Protection données" },
  ];

  const mrpGaranties = [
    { category: "Incendie & Explosion", economique: true, confort: true, premium: true, description: "Locaux et matériel" },
    { category: "Dégâts des Eaux", economique: true, confort: true, premium: true, description: "Fuites et infiltrations" },
    { category: "Vol & Vandalisme", economique: "Effraction", confort: true, premium: true, description: "Protection du matériel" },
    { category: "Perte d'exploitation", economique: false, confort: "6 mois", premium: "12 mois", description: "Compensation du CA perdu" },
    { category: "Bris de machine", economique: false, confort: true, premium: true, description: "Équipements professionnels" },
    { category: "Marchandises", economique: "20 000€", confort: "50 000€", premium: "100 000€", description: "Stock garanti" },
  ];

  // ========== VIE ET ÉPARGNE ==========
  const assuranceVieGaranties = [
    { category: "Capital Décès", economique: "50 000€", confort: "150 000€", premium: "500 000€", description: "Versé aux bénéficiaires" },
    { category: "Fonds en euros", economique: true, confort: true, premium: true, description: "Capital garanti" },
    { category: "Unités de compte", economique: false, confort: true, premium: true, description: "Supports diversifiés" },
    { category: "Frais de gestion", economique: "0.80%", confort: "0.60%", premium: "0.40%", description: "Annuels" },
    { category: "Arbitrages gratuits", economique: "1/an", confort: "4/an", premium: "Illimités", description: "Changements de supports" },
    { category: "Gestion pilotée", economique: false, confort: true, premium: true, description: "Gestion automatisée" },
  ];

  const prevoyanceGaranties = [
    { category: "Indemnités Journalières", economique: "30€/jour", confort: "60€/jour", premium: "100€/jour", description: "En cas d'arrêt maladie" },
    { category: "Capital Invalidité", economique: "50 000€", confort: "150 000€", premium: "300 000€", description: "Selon taux d'invalidité" },
    { category: "Capital Décès", economique: "50 000€", confort: "150 000€", premium: "300 000€", description: "Versé à la famille" },
    { category: "Rente Éducation", economique: false, confort: true, premium: true, description: "Pour les enfants" },
    { category: "Assistance", economique: false, confort: true, premium: true, description: "Aide à domicile" },
    { category: "Délai de carence", economique: "90 jours", confort: "30 jours", premium: "15 jours", description: "Avant indemnisation" },
  ];

  // ========== IMMOBILIER ==========
  const pnoGaranties = [
    { category: "Responsabilité Civile", economique: true, confort: true, premium: true, description: "Propriétaire non occupant" },
    { category: "Recours des locataires", economique: true, confort: true, premium: true, description: "Défauts d'entretien" },
    { category: "Vacance locative", economique: false, confort: "3 mois", premium: "6 mois", description: "Loyers impayés" },
    { category: "Dégâts des eaux", economique: true, confort: true, premium: true, description: "Fuites et infiltrations" },
    { category: "Protection juridique", economique: false, confort: true, premium: true, description: "Litiges locatifs" },
    { category: "Vandalisme locataire", economique: false, confort: "5 000€", premium: "15 000€", description: "Dégradations volontaires" },
  ];

  const gliGaranties = [
    { category: "Loyers impayés", economique: "12 mois", confort: "24 mois", premium: "Illimité", description: "Durée de couverture" },
    { category: "Plafond mensuel", economique: "2 000€", confort: "3 500€", premium: "5 000€", description: "Par mois garanti" },
    { category: "Dégradations", economique: "5 000€", confort: "10 000€", premium: "20 000€", description: "État des lieux sortant" },
    { category: "Frais de contentieux", economique: true, confort: true, premium: true, description: "Procédures juridiques" },
    { category: "Départ prématuré", economique: false, confort: true, premium: true, description: "Sans préavis" },
    { category: "Délai de carence", economique: "3 mois", confort: "1 mois", premium: "Sans carence", description: "Avant prise en charge" },
  ];

  const renderCell = (value: boolean | string) => {
    if (value === true) {
      return <Check className="h-5 w-5 text-primary mx-auto" />;
    }
    if (value === false) {
      return <X className="h-5 w-5 text-muted-foreground mx-auto opacity-30" />;
    }
    return <span className="text-sm font-medium text-primary">{value}</span>;
  };

  // Mobile card view for responsive
  const renderMobileCard = (garantie: any, index: number) => (
    <Card key={index} className="glass-card p-4 rounded-2026 border-0 mb-4">
      <h4 className="font-bold text-foreground mb-1">{garantie.category}</h4>
      <p className="text-xs text-muted-foreground mb-3">{garantie.description}</p>
      <div className="grid grid-cols-3 gap-2 text-center">
        <div className="glass-card p-2 rounded-xl">
          <Badge variant="outline" className="mb-1 text-xs">Éco</Badge>
          <div className="mt-1">{renderCell(garantie.economique)}</div>
        </div>
        <div className="bg-primary/10 p-2 rounded-xl">
          <Badge className="mb-1 text-xs">Confort</Badge>
          <div className="mt-1">{renderCell(garantie.confort)}</div>
        </div>
        <div className="glass-card p-2 rounded-xl">
          <Badge variant="secondary" className="mb-1 text-xs">Premium</Badge>
          <div className="mt-1">{renderCell(garantie.premium)}</div>
        </div>
      </div>
    </Card>
  );

  const renderTable = (garanties: any[], priceEco: string, priceConfort: string, pricePremium: string, showCTA: boolean = true) => (
    <>
      {/* Desktop Table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="separator-subtle">
              <th className="text-left p-4 w-1/4">
                <span className="text-base font-bold">Garanties</span>
              </th>
              <th className="text-center p-4 w-1/4">
                <div className="space-y-1">
                  <Badge variant="outline" className="mb-2 rounded-2026">Économique</Badge>
                  <div className="text-2xl font-bold text-primary">{priceEco}</div>
                  <div className="text-xs text-muted-foreground">par mois</div>
                </div>
              </th>
              <th className="text-center p-4 w-1/4 bg-primary/5 rounded-t-2026">
                <div className="space-y-1">
                  <Badge className="mb-2 rounded-2026">Confort</Badge>
                  <div className="text-2xl font-bold text-primary">{priceConfort}</div>
                  <div className="text-xs text-muted-foreground">par mois</div>
                </div>
              </th>
              <th className="text-center p-4 w-1/4">
                <div className="space-y-1">
                  <Badge variant="secondary" className="mb-2 rounded-2026">Premium</Badge>
                  <div className="text-2xl font-bold text-primary">{pricePremium}</div>
                  <div className="text-xs text-muted-foreground">par mois</div>
                </div>
              </th>
            </tr>
          </thead>
          <tbody>
            {garanties.map((garantie, index) => (
              <tr key={index} className="separator-subtle hover:bg-muted/30 transition-colors">
                <td className="p-4">
                  <div>
                    <div className="font-semibold text-sm">{garantie.category}</div>
                    <div className="text-xs text-muted-foreground mt-1">{garantie.description}</div>
                  </div>
                </td>
                <td className="p-4 text-center">{renderCell(garantie.economique)}</td>
                <td className="p-4 text-center bg-primary/5">{renderCell(garantie.confort)}</td>
                <td className="p-4 text-center">{renderCell(garantie.premium)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden">
        <div className="flex justify-between gap-2 mb-4 glass-card p-3 rounded-2026">
          <div className="text-center flex-1">
            <Badge variant="outline" className="text-xs">Éco</Badge>
            <div className="text-lg font-bold text-primary mt-1">{priceEco}</div>
          </div>
          <div className="text-center flex-1 bg-primary/10 rounded-xl p-2">
            <Badge className="text-xs">Confort</Badge>
            <div className="text-lg font-bold text-primary mt-1">{priceConfort}</div>
          </div>
          <div className="text-center flex-1">
            <Badge variant="secondary" className="text-xs">Premium</Badge>
            <div className="text-lg font-bold text-primary mt-1">{pricePremium}</div>
          </div>
        </div>
        {garanties.map((garantie, index) => renderMobileCard(garantie, index))}
      </div>

      {/* CTA after table */}
      {showCTA && (
        <div className="mt-6 text-center">
          <Link to="/contact">
            <Button size="lg" className="rounded-2026 gap-2">
              <Phone className="h-4 w-4" />
              Contactez-nous pour un devis personnalisé
            </Button>
          </Link>
        </div>
      )}
    </>
  );

  const renderInsuranceSection = (
    title: string,
    description: string,
    garanties: any[],
    priceEco: string,
    priceConfort: string,
    pricePremium: string,
    arthurImage: string
  ) => (
    <Card className="glass-card p-4 md:p-8 rounded-2026 border-0 mb-8">
      <div className="mb-6 flex items-start gap-4">
        <img src={arthurImage} alt="Arthur" className="w-14 md:w-16 h-auto shrink-0" />
        <div>
          <h3 className="text-xl md:text-2xl font-bold mb-1">{title}</h3>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
      </div>
      {renderTable(garanties, priceEco, priceConfort, pricePremium)}
    </Card>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-muted/30 to-background">
      <SEO 
        title="Comparateur de Garanties - Particuliers, Pro, Vie, Immobilier"
        description="Comparez les garanties d'assurance : Particuliers, Professionnels, Vie & Épargne, Immobilier. Tableaux comparatifs détaillés pour trouver la meilleure formule."
        keywords="comparateur garanties assurance, formules assurance, garanties auto santé habitation professionnels"
        canonical="https://jemassuremoinscher.lovable.app/comparateur-garanties"
      />
      <Header />
      
      {/* Hero Section */}
      <section className="hero-glass py-12 md:py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
        <div className="container mx-auto px-4 relative">
          <div className="max-w-4xl mx-auto text-center relative">
            <img 
              src={arthurThinking} 
              alt="Arthur réfléchit" 
              className="hidden lg:block absolute -left-36 top-1/2 -translate-y-1/2 w-32 h-auto drop-shadow-lg"
            />
            <img 
              src={arthurFlying} 
              alt="Arthur vole" 
              className="hidden lg:block absolute -right-36 top-1/2 -translate-y-1/2 w-28 h-auto drop-shadow-lg"
            />
            
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-foreground mb-4 tracking-tight">
              Comparateur de Garanties
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-6">
              Comparez en détail les garanties Économique, Confort et Premium pour trouver la protection idéale.
            </p>
            
            <div className="glass-card inline-block px-6 py-3 rounded-2026 relative">
              <p className="text-sm font-medium text-foreground">
                💡 Je décrypte chaque garantie pour vous aider à choisir !
              </p>
            </div>

            {/* Hero CTA */}
            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/contact">
                <Button size="lg" className="rounded-2026 gap-2 w-full sm:w-auto">
                  <MessageCircle className="h-4 w-4" />
                  Parler à un conseiller
                </Button>
              </Link>
              <Link to="/comparateur">
                <Button size="lg" variant="outline" className="rounded-2026 gap-2 w-full sm:w-auto">
                  <TrendingUp className="h-4 w-4" />
                  Obtenir un devis gratuit
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <main className="container mx-auto px-4 py-8 md:py-12">
        {/* Main Category Tabs */}
        <Tabs defaultValue="particuliers" className="w-full">
          <TabsList className="glass-card grid w-full max-w-3xl mx-auto grid-cols-2 md:grid-cols-4 mb-8 p-2 rounded-2026 h-auto">
            <TabsTrigger value="particuliers" className="flex items-center gap-2 rounded-2026 py-3 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all">
              <Users className="h-4 w-4" />
              <span className="text-xs md:text-sm">Particuliers</span>
            </TabsTrigger>
            <TabsTrigger value="professionnels" className="flex items-center gap-2 rounded-2026 py-3 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all">
              <Briefcase className="h-4 w-4" />
              <span className="text-xs md:text-sm">Professionnels</span>
            </TabsTrigger>
            <TabsTrigger value="vie-epargne" className="flex items-center gap-2 rounded-2026 py-3 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all">
              <PiggyBank className="h-4 w-4" />
              <span className="text-xs md:text-sm">Vie & Épargne</span>
            </TabsTrigger>
            <TabsTrigger value="immobilier" className="flex items-center gap-2 rounded-2026 py-3 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all">
              <Building2 className="h-4 w-4" />
              <span className="text-xs md:text-sm">Immobilier</span>
            </TabsTrigger>
          </TabsList>

          {/* PARTICULIERS */}
          <TabsContent value="particuliers" className="space-y-8">
            <div className="flex items-center gap-3 mb-6">
              <Users className="h-8 w-8 text-primary" />
              <div>
                <h2 className="text-2xl md:text-3xl font-bold">Assurances Particuliers</h2>
                <p className="text-muted-foreground">Auto, Moto, Habitation, Santé, Animaux</p>
              </div>
            </div>

            {renderInsuranceSection("Assurance Auto", "Protégez votre véhicule et vos déplacements", autoGaranties, "65€", "95€", "145€", arthurThumbsUp)}
            {renderInsuranceSection("Assurance Moto", "Protection adaptée à votre deux-roues", motoGaranties, "50€", "85€", "135€", arthurRunning)}
            {renderInsuranceSection("Assurance Habitation", "Protégez votre logement et vos biens", habitationGaranties, "12€", "22€", "38€", arthurStanding)}
            {renderInsuranceSection("Mutuelle Santé", "Vos frais de santé remboursés", santeGaranties, "45€", "85€", "145€", arthurThumbsUp)}
            {renderInsuranceSection("Assurance Animaux", "Protégez vos compagnons à 4 pattes", animauxGaranties, "15€", "30€", "50€", arthurFlying)}
          </TabsContent>

          {/* PROFESSIONNELS */}
          <TabsContent value="professionnels" className="space-y-8">
            <div className="flex items-center gap-3 mb-6">
              <Briefcase className="h-8 w-8 text-primary" />
              <div>
                <h2 className="text-2xl md:text-3xl font-bold">Assurances Professionnels</h2>
                <p className="text-muted-foreground">RC Pro, Multirisque Professionnelle</p>
              </div>
            </div>

            {renderInsuranceSection("RC Professionnelle", "Couvrez votre responsabilité professionnelle", rcProGaranties, "35€", "75€", "150€", arthurThumbsUp)}
            {renderInsuranceSection("Multirisque Pro (MRP)", "Protection complète de votre activité", mrpGaranties, "80€", "150€", "280€", arthurStanding)}

            {/* Pro CTA Banner */}
            <Card className="glass-card p-6 md:p-8 rounded-2026 border-0 bg-gradient-to-r from-primary/10 to-accent/10">
              <div className="flex flex-col md:flex-row items-center gap-6">
                <img src={arthurFlying} alt="Arthur" className="w-20 h-auto" />
                <div className="flex-1 text-center md:text-left">
                  <h3 className="text-xl font-bold mb-2">Besoin d'un conseil personnalisé ?</h3>
                  <p className="text-muted-foreground">Nos experts en assurance pro vous accompagnent gratuitement.</p>
                </div>
                <Link to="/contact">
                  <Button size="lg" className="rounded-2026 gap-2">
                    <Phone className="h-4 w-4" />
                    Être rappelé
                  </Button>
                </Link>
              </div>
            </Card>
          </TabsContent>

          {/* VIE ET ÉPARGNE */}
          <TabsContent value="vie-epargne" className="space-y-8">
            <div className="flex items-center gap-3 mb-6">
              <PiggyBank className="h-8 w-8 text-primary" />
              <div>
                <h2 className="text-2xl md:text-3xl font-bold">Vie & Épargne</h2>
                <p className="text-muted-foreground">Assurance Vie, Prévoyance</p>
              </div>
            </div>

            {renderInsuranceSection("Assurance Vie", "Faites fructifier votre épargne", assuranceVieGaranties, "0€*", "0€*", "0€*", arthurThumbsUp)}
            {renderInsuranceSection("Prévoyance", "Protégez vos revenus et votre famille", prevoyanceGaranties, "25€", "55€", "95€", arthurRunning)}

            <p className="text-xs text-muted-foreground text-center">* L'assurance vie n'a pas de cotisation mensuelle fixe, les frais dépendent des versements effectués.</p>
          </TabsContent>

          {/* IMMOBILIER */}
          <TabsContent value="immobilier" className="space-y-8">
            <div className="flex items-center gap-3 mb-6">
              <Building2 className="h-8 w-8 text-primary" />
              <div>
                <h2 className="text-2xl md:text-3xl font-bold">Assurances Immobilier</h2>
                <p className="text-muted-foreground">PNO, Garantie Loyers Impayés</p>
              </div>
            </div>

            {renderInsuranceSection("Propriétaire Non Occupant (PNO)", "Protégez vos biens locatifs", pnoGaranties, "8€", "15€", "25€", arthurStanding)}
            {renderInsuranceSection("Garantie Loyers Impayés (GLI)", "Sécurisez vos revenus locatifs", gliGaranties, "2.5%*", "3%*", "3.5%*", arthurThumbsUp)}

            <p className="text-xs text-muted-foreground text-center">* Pourcentage du loyer mensuel charges comprises.</p>

            {/* Immobilier CTA */}
            <Card className="glass-card p-6 md:p-8 rounded-2026 border-0 bg-gradient-to-r from-accent/10 to-primary/10">
              <div className="flex flex-col md:flex-row items-center gap-6">
                <img src={arthurFlying} alt="Arthur" className="w-20 h-auto" />
                <div className="flex-1 text-center md:text-left">
                  <h3 className="text-xl font-bold mb-2">Investisseur immobilier ?</h3>
                  <p className="text-muted-foreground">Découvrez nos offres spéciales multi-biens avec réductions groupées.</p>
                </div>
                <Link to="/contact">
                  <Button size="lg" className="rounded-2026 gap-2">
                    <Key className="h-4 w-4" />
                    Demander une étude
                  </Button>
                </Link>
              </div>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Comment choisir section */}
        <section className="mt-12 max-w-4xl mx-auto relative">
          <img 
            src={arthurThinking} 
            alt="Arthur réfléchit" 
            className="hidden lg:block absolute -right-28 top-1/2 -translate-y-1/2 w-24 h-auto drop-shadow-lg"
          />
          
          <Card className="glass-card p-6 md:p-8 rounded-2026 border-0">
            <h2 className="text-2xl font-bold mb-6 text-center">Comment choisir sa formule ?</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center glass-card p-4 rounded-2026">
                <Badge variant="outline" className="mb-3 rounded-2026 px-4 py-1">Économique</Badge>
                <p className="text-sm text-muted-foreground">
                  Idéal pour les petits budgets avec les garanties essentielles
                </p>
              </div>
              <div className="text-center bg-primary/10 p-4 rounded-2026">
                <Badge className="mb-3 rounded-2026 px-4 py-1">Confort</Badge>
                <p className="text-sm text-muted-foreground">
                  Le meilleur rapport qualité-prix avec une protection équilibrée
                </p>
              </div>
              <div className="text-center glass-card p-4 rounded-2026">
                <Badge variant="secondary" className="mb-3 rounded-2026 px-4 py-1">Premium</Badge>
                <p className="text-sm text-muted-foreground">
                  Protection maximale sans franchise pour une tranquillité totale
                </p>
              </div>
            </div>
          </Card>
        </section>

        {/* Final CTA Section */}
        <section className="mt-12 text-center">
          <Card className="glass-card p-8 md:p-12 rounded-2026 border-0 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5" />
            <div className="relative">
              <img src={arthurThumbsUp} alt="Arthur" className="w-24 h-auto mx-auto mb-4" />
              <h2 className="text-2xl md:text-3xl font-bold mb-4">Prêt à économiser sur votre assurance ?</h2>
              <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
                Nos conseillers sont disponibles pour vous aider à trouver la meilleure offre adaptée à vos besoins.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/contact">
                  <Button size="lg" className="rounded-2026 gap-2 w-full sm:w-auto">
                    <Phone className="h-4 w-4" />
                    Contactez-nous
                  </Button>
                </Link>
                <Link to="/comparateur">
                  <Button size="lg" variant="outline" className="rounded-2026 gap-2 w-full sm:w-auto">
                    <Shield className="h-4 w-4" />
                    Comparer les offres
                  </Button>
                </Link>
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
