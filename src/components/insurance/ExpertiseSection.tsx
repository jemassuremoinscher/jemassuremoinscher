import { Shield, Award, Users, BookOpen, CheckCircle } from "lucide-react";
import teamExperts from "@/assets/team-experts.png";

interface ExpertiseSectionProps {
  /** Insurance type name for contextual content */
  insuranceType: string;
  /** Number of years of experience (default: 15) */
  yearsExperience?: number;
  /** Number of partner insurers (default: 50) */
  partnerCount?: number;
  /** Custom expertise points */
  expertisePoints?: string[];
}

/**
 * E-E-A-T optimized expertise section.
 * Demonstrates Experience, Expertise, Authority, and Trust
 * to satisfy Google's quality rater guidelines.
 */
const ExpertiseSection = ({
  insuranceType,
  yearsExperience = 15,
  partnerCount = 50,
  expertisePoints,
}: ExpertiseSectionProps) => {
  const defaultPoints = [
    `Courtiers certifiés ORIAS spécialisés en ${insuranceType}`,
    `${partnerCount}+ compagnies d'assurance partenaires comparées`,
    `${yearsExperience} ans d'expérience dans le courtage d'assurance`,
    "Accompagnement personnalisé par un conseiller dédié",
    "Avis vérifiés : 4.8/5 sur la base de 2 500+ avis clients",
  ];

  const points = expertisePoints || defaultPoints;

  return (
    <section className="py-12 md:py-16" aria-labelledby="expertise-heading">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <h2 id="expertise-heading" className="text-2xl md:text-3xl font-bold text-foreground mb-3">
              Pourquoi nous faire confiance pour votre {insuranceType} ?
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Notre équipe de courtiers certifiés analyse chaque contrat pour vous recommander 
              la couverture optimale au meilleur prix.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 items-center">
            {/* Trust signals */}
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="p-2 rounded-lg bg-primary/10 shrink-0">
                  <Award className="h-5 w-5 text-primary" aria-hidden="true" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">Expertise certifiée</h3>
                  <p className="text-sm text-muted-foreground">
                    Immatriculés à l'ORIAS en tant que courtiers en assurance, nous respectons 
                    les obligations de conseil et d'information de la directive DDA.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-2 rounded-lg bg-primary/10 shrink-0">
                  <Users className="h-5 w-5 text-primary" aria-hidden="true" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">Expérience terrain</h3>
                  <p className="text-sm text-muted-foreground">
                    Nos courtiers ont accompagné plus de 25 000 assurés dans le choix de leur 
                    {insuranceType}. Chaque recommandation est basée sur une analyse personnalisée.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-2 rounded-lg bg-primary/10 shrink-0">
                  <Shield className="h-5 w-5 text-primary" aria-hidden="true" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">Indépendance totale</h3>
                  <p className="text-sm text-muted-foreground">
                    Nous ne sommes liés à aucune compagnie d'assurance. Notre seul objectif : 
                    vous trouver le meilleur rapport garanties/prix.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-2 rounded-lg bg-primary/10 shrink-0">
                  <BookOpen className="h-5 w-5 text-primary" aria-hidden="true" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">Contenu vérifié</h3>
                  <p className="text-sm text-muted-foreground">
                    Chaque guide et comparatif est rédigé et relu par nos experts, puis mis à jour 
                    régulièrement selon l'évolution de la réglementation.
                  </p>
                </div>
              </div>
            </div>

            {/* Checklist + image */}
            <div className="bg-muted/30 rounded-2xl p-6 md:p-8">
              <div className="flex items-center gap-3 mb-6">
                <img 
                  src={teamExperts} 
                  alt="Équipe d'experts courtiers jemassuremoinscher.fr" 
                  className="w-16 h-16 rounded-full object-cover border-2 border-primary/20"
                  loading="lazy"
                  width={64}
                  height={64}
                />
                <div>
                  <p className="font-semibold text-foreground text-sm">L'équipe d'experts</p>
                  <p className="text-xs text-muted-foreground">jemassuremoinscher.fr</p>
                </div>
              </div>

              <ul className="space-y-3" aria-label="Nos engagements">
                {points.map((point, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-primary shrink-0 mt-0.5" aria-hidden="true" />
                    <span className="text-sm text-foreground">{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ExpertiseSection;
