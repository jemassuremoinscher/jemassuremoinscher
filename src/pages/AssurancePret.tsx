import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CreditCard } from "lucide-react";

const AssurancePret = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-3 rounded-full bg-primary/10">
              <CreditCard className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-4xl font-bold text-foreground">Assurance Prêt</h1>
          </div>

          <Card className="p-8">
            <h2 className="text-2xl font-bold mb-6 text-card-foreground">Obtenez votre devis en 2 minutes</h2>
            
            <form className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="type-pret">Type de prêt</Label>
                <Select>
                  <SelectTrigger id="type-pret">
                    <SelectValue placeholder="Sélectionner" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="immobilier">Prêt immobilier</SelectItem>
                    <SelectItem value="consommation">Prêt à la consommation</SelectItem>
                    <SelectItem value="professionnel">Prêt professionnel</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="montant">Montant du prêt (€)</Label>
                <Input id="montant" type="number" placeholder="200000" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="duree">Durée du prêt (années)</Label>
                <Select>
                  <SelectTrigger id="duree">
                    <SelectValue placeholder="Sélectionner" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="10">10 ans</SelectItem>
                    <SelectItem value="15">15 ans</SelectItem>
                    <SelectItem value="20">20 ans</SelectItem>
                    <SelectItem value="25">25 ans</SelectItem>
                    <SelectItem value="30">30 ans</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="age-emprunteur">Votre âge</Label>
                <Input id="age-emprunteur" type="number" placeholder="35" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="fumeur">Fumeur</Label>
                <Select>
                  <SelectTrigger id="fumeur">
                    <SelectValue placeholder="Sélectionner" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="non">Non</SelectItem>
                    <SelectItem value="oui">Oui</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="profession">Profession</Label>
                <Input id="profession" placeholder="Ex: Cadre, Employé..." />
              </div>

              <div className="space-y-2">
                <Label htmlFor="code-postal-pret">Code postal</Label>
                <Input id="code-postal-pret" placeholder="75001" maxLength={5} />
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

export default AssurancePret;
