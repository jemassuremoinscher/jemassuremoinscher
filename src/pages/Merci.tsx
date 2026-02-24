import { useEffect } from "react";
import { Link } from "react-router-dom";
import { CheckCircle2, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Helmet } from "react-helmet-async";

const Merci = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <Helmet>
        <title>Merci pour votre demande | Je M'Assure Moins Cher</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      <main className="min-h-screen flex items-center justify-center bg-background px-4">
        <Card className="p-12 text-center max-w-2xl mx-auto">
          <CheckCircle2 className="h-16 w-16 text-primary mx-auto mb-6" />
          <h1 className="text-2xl font-bold mb-4">Merci pour votre demande !</h1>
          <p className="text-muted-foreground mb-6">
            Votre demande de devis a bien été envoyée. Un conseiller vous recontactera dans les plus brefs délais pour vous proposer les meilleures offres.
          </p>
          <Link to="/">
            <Button variant="outline">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Retour à l'accueil
            </Button>
          </Link>
        </Card>
      </main>
    </>
  );
};

export default Merci;
