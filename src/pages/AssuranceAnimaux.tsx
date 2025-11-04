import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Users } from "lucide-react";

const AssuranceAnimaux = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-3 rounded-full bg-primary/10">
              <Users className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-4xl font-bold text-foreground">Assurance Animaux</h1>
          </div>

          <Card className="p-8">
            <h2 className="text-2xl font-bold mb-6 text-card-foreground">Obtenez votre devis en 2 minutes</h2>
            
            <form className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="type-animal">Type d'animal</Label>
                <Select>
                  <SelectTrigger id="type-animal">
                    <SelectValue placeholder="Sélectionner" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="chien">Chien</SelectItem>
                    <SelectItem value="chat">Chat</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="race">Race</Label>
                <Input id="race" placeholder="Ex: Labrador, Siamois..." />
              </div>

              <div className="space-y-2">
                <Label htmlFor="age-animal">Âge de l'animal</Label>
                <Input id="age-animal" type="number" placeholder="3" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="sexe">Sexe</Label>
                <Select>
                  <SelectTrigger id="sexe">
                    <SelectValue placeholder="Sélectionner" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Mâle</SelectItem>
                    <SelectItem value="femelle">Femelle</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="sterilise">Stérilisé/Castré</Label>
                <Select>
                  <SelectTrigger id="sterilise">
                    <SelectValue placeholder="Sélectionner" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="oui">Oui</SelectItem>
                    <SelectItem value="non">Non</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="code-postal-animaux">Code postal</Label>
                <Input id="code-postal-animaux" placeholder="75001" maxLength={5} />
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

export default AssuranceAnimaux;
