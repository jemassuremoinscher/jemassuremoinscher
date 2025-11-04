import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Car } from "lucide-react";

const AssuranceAuto = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-3 rounded-full bg-primary/10">
              <Car className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-4xl font-bold text-foreground">Assurance Auto</h1>
          </div>

          <Card className="p-8">
            <h2 className="text-2xl font-bold mb-6 text-card-foreground">Obtenez votre devis en 2 minutes</h2>
            
            <form className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="marque">Marque du véhicule</Label>
                <Input id="marque" placeholder="Ex: Renault, Peugeot..." />
              </div>

              <div className="space-y-2">
                <Label htmlFor="modele">Modèle</Label>
                <Input id="modele" placeholder="Ex: Clio, 308..." />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="annee">Année</Label>
                  <Select>
                    <SelectTrigger id="annee">
                      <SelectValue placeholder="Sélectionner" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="2024">2024</SelectItem>
                      <SelectItem value="2023">2023</SelectItem>
                      <SelectItem value="2022">2022</SelectItem>
                      <SelectItem value="2021">2021</SelectItem>
                      <SelectItem value="2020">2020</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="carburant">Carburant</Label>
                  <Select>
                    <SelectTrigger id="carburant">
                      <SelectValue placeholder="Sélectionner" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="essence">Essence</SelectItem>
                      <SelectItem value="diesel">Diesel</SelectItem>
                      <SelectItem value="electrique">Électrique</SelectItem>
                      <SelectItem value="hybride">Hybride</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="code-postal">Code postal</Label>
                <Input id="code-postal" placeholder="75001" maxLength={5} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="age">Votre âge</Label>
                <Input id="age" type="number" placeholder="25" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="permis">Date d'obtention du permis</Label>
                <Input id="permis" type="date" />
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

export default AssuranceAuto;
