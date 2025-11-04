import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Heart } from "lucide-react";

const AssuranceSante = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-3 rounded-full bg-primary/10">
              <Heart className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-4xl font-bold text-foreground">Mutuelle Santé</h1>
          </div>

          <Card className="p-8">
            <h2 className="text-2xl font-bold mb-6 text-card-foreground">Obtenez votre devis en 2 minutes</h2>
            
            <form className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="situation">Situation familiale</Label>
                <Select>
                  <SelectTrigger id="situation">
                    <SelectValue placeholder="Sélectionner" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="celibataire">Célibataire</SelectItem>
                    <SelectItem value="couple">En couple</SelectItem>
                    <SelectItem value="famille">Famille</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="age-assure">Votre âge</Label>
                <Input id="age-assure" type="number" placeholder="30" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="regime">Régime de sécurité sociale</Label>
                <Select>
                  <SelectTrigger id="regime">
                    <SelectValue placeholder="Sélectionner" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="general">Régime général</SelectItem>
                    <SelectItem value="alsace-moselle">Alsace-Moselle</SelectItem>
                    <SelectItem value="tns">TNS</SelectItem>
                    <SelectItem value="agricole">Agricole</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="niveau">Niveau de couverture souhaité</Label>
                <Select>
                  <SelectTrigger id="niveau">
                    <SelectValue placeholder="Sélectionner" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="economique">Économique</SelectItem>
                    <SelectItem value="equilibre">Équilibré</SelectItem>
                    <SelectItem value="confort">Confort</SelectItem>
                    <SelectItem value="premium">Premium</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="code-postal-sante">Code postal</Label>
                <Input id="code-postal-sante" placeholder="75001" maxLength={5} />
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

export default AssuranceSante;
