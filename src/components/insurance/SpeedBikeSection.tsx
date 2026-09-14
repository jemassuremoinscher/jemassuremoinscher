import { Zap } from "lucide-react";
import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";

/**
 * Speed-bike (VAE >25 km/h, jusqu'à 45 km/h) : traité comme un cas à part sur
 * cette page, pas fondu dans le reste du contenu vélo. Raison : le speed-bike
 * relève légalement de la catégorie L1e-B (cyclomoteur), pas du régime vélo —
 * il a besoin d'une RC motorisée, pas de l'extension vol habitation qui est
 * le sujet du reste de la page. Mélanger les deux créerait une contradiction
 * interne (voir diagnostic du 2026-09-13).
 *
 * Faits vérifiés par recherche le 2026-09-13 : catégorie L1e-B (équivalente
 * à un cyclomoteur 50cc), immatriculation obligatoire, RC motorisée
 * obligatoire, casque homologué moto, permis AM (dès 14 ans, ex-BSR depuis
 * le 19/01/2013) ou permis B/A. Interdiction des pistes cyclables.
 */
const SpeedBikeSection = () => (
  <section className="max-w-4xl mx-auto mb-12">
    <Card className="p-6 md:p-8 border-2 border-primary/30 bg-primary/[0.03]">
      <div className="flex items-start gap-4">
        <span className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <Zap className="h-5 w-5" aria-hidden="true" />
        </span>
        <div>
          <h2 className="text-lg md:text-xl font-bold text-foreground mb-2">
            Speed-bike (VAE 45 km/h) : un régime à part
          </h2>
          <p className="text-muted-foreground leading-relaxed mb-4">
            Au-delà de 25 km/h, un vélo à assistance électrique change de catégorie légale : ce n'est plus un vélo, mais un cyclomoteur au sens du code de la route (catégorie européenne <strong>L1e-B</strong>, équivalente à un scooter 50cc). Les obligations qui en découlent n'ont rien à voir avec le reste de cette page :
          </p>
          <ul className="text-sm text-muted-foreground space-y-1.5 mb-4">
            <li>✓ <strong>Immatriculation obligatoire</strong> (carte grise + plaque)</li>
            <li>✓ <strong>Assurance responsabilité civile motorisée obligatoire</strong> — l'extension vol vélo de votre assurance habitation ne suffit pas et ne couvre pas la circulation</li>
            <li>✓ <strong>Casque homologué moto</strong> (pas un casque vélo classique)</li>
            <li>✓ <strong>Permis AM</strong> (dès 14 ans, ex-BSR) ou permis B/A</li>
          </ul>
          <p className="text-muted-foreground leading-relaxed mb-4">
            Un speed-bike a donc besoin du même type de couverture qu'un cyclomoteur 50cc, pas d'une extension habitation.
          </p>
          <Link
            to="/assurance-scooter-50cc"
            className="inline-flex items-center gap-1.5 font-semibold text-primary hover:underline"
          >
            Comparer une assurance scooter 50cc / cyclomoteur adaptée →
          </Link>
        </div>
      </div>
    </Card>
  </section>
);

export default SpeedBikeSection;
