import { useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Helmet } from "react-helmet-async";
import arthurStanding from "@/assets/mascotte/arthur-standing.png";

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
          <img
            src={arthurStanding}
            alt="Arthur debout - confirmation demande devis assurance moins chère"
            className="w-28 h-auto mx-auto mb-6"
            loading="eager"
          />
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
