import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Home } from "lucide-react";

const AssuranceHabitation = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-3 rounded-full bg-primary/10">
              <Home className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-4xl font-bold text-foreground">Assurance Habitation</h1>
          </div>

          <Card className="p-8">
            <h2 className="text-2xl font-bold mb-6 text-card-foreground">Obtenez votre devis en 2 minutes</h2>
            
            <form className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="type-logement">Type de logement</Label>
                <Select>
                  <SelectTrigger id="type-logement">
                    <SelectValue placeholder="Sélectionner" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="maison">Maison</SelectItem>
                    <SelectItem value="appartement">Appartement</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="statut">Vous êtes</Label>
                <Select>
                  <SelectTrigger id="statut">
                    <SelectValue placeholder="Sélectionner" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="proprietaire">Propriétaire</SelectItem>
                    <SelectItem value="locataire">Locataire</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="surface">Surface (m²)</Label>
                <Input id="surface" type="number" placeholder="75" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="pieces">Nombre de pièces</Label>
                <Select>
                  <SelectTrigger id="pieces">
                    <SelectValue placeholder="Sélectionner" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 pièce</SelectItem>
                    <SelectItem value="2">2 pièces</SelectItem>
                    <SelectItem value="3">3 pièces</SelectItem>
                    <SelectItem value="4">4 pièces</SelectItem>
                    <SelectItem value="5">5 pièces et +</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="code-postal-hab">Code postal</Label>
                <Input id="code-postal-hab" placeholder="75001" maxLength={5} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="valeur">Valeur des biens à assurer (€)</Label>
                <Input id="valeur" type="number" placeholder="15000" />
              </div>

              <Button className="w-full" size="lg">
                Comparer les offres
              </Button>
            </form>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AssuranceHabitation;
