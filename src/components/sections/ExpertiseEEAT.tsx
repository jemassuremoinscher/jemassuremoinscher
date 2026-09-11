import { Link } from "react-router-dom";
import { BadgeCheck, BookOpen, Users, Scale } from "lucide-react";
import { CONTENT_LAST_REVIEWED } from "@/config/contentReview";

/**
 * Bloc E-E-A-T : Experience, Expertise, Authoritativeness, Trustworthiness.
 * Rend visibles pour Google et les moteurs génératifs :
 * qui rédige, sur quelles sources, avec quelle méthode, sous quel statut réglementaire.
 */

const PILLARS = [
  {
    icon: Users,
    title: "Qui vous conseille",
    body:
      "Une équipe de conseillers en assurance basée à Nice, qui traite chaque jour des demandes réelles : auto malussée, jeune conducteur, mutuelle senior, RC pro, PNO et GLI.",
    bullets: [
      "Accompagnement humain par téléphone, pas seulement un formulaire",
      "Plus de 247 avis clients vérifiés (4,9/5) sur notre fiche Google",
      "Rappel sous 2 h ouvrées après une demande de devis",
    ],
  },
  {
    icon: Scale,
    title: "Notre statut et notre indépendance",
    body:
      "jemassuremoinscher.fr est édité par ARPV, courtier en assurances (immatriculé ORIAS n° 26011100), soumis au Code des assurances et au contrôle de l'ACPR.",
    bullets: [
      "Rémunération par commission de l'assureur, jamais par le client",
      "Aucun classement payant : les offres sont triées par pertinence tarifaire",
      "Données traitées conformément au RGPD, hébergement en France",
    ],
  },
  {
    icon: BookOpen,
    title: "Nos sources",
    body:
      "Chaque chiffre publié s'appuie sur des sources officielles ou sur nos propres données de devis, datées et vérifiables.",
    bullets: [
      "Légifrance (lois Hamon, Chatel, Lemoine, Code des assurances)",
      "France Assureurs et ACPR pour les statistiques de marché",
      "Nos devis internes 2026 pour les prix constatés",
    ],
  },
  {
    icon: BadgeCheck,
    title: "Notre méthode de comparaison",
    body:
      "Nous interrogeons plus de 70 assureurs partenaires et 2 500 agences locales à garanties comparables, puis nous présentons les écarts réels.",
    bullets: [
      "Comparaison à garanties équivalentes, franchise incluse",
      "Économie moyenne constatée : jusqu'à 280 €/an selon le profil",
      "Contenus relus et mis à jour à chaque évolution réglementaire",
    ],
  },
];

const ExpertiseEEAT = () => {
  const formatted = new Date(CONTENT_LAST_REVIEWED).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <section
      className="pt-14 md:pt-20 pb-8 md:pb-10 bg-background border-t border-border/30 section-lazy"
      aria-labelledby="expertise-title"
    >
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="text-center mb-10">
          <h2 id="expertise-title" className="text-2xl md:text-4xl font-bold text-foreground mb-3">
            Pourquoi faire confiance à nos comparaisons ?
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Expérience terrain, statut de courtier, sources officielles et méthode transparente :
            voici ce qui se cache derrière chaque devis que nous vous présentons.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          {PILLARS.map((p) => (
            <article
              key={p.title}
              className="rounded-2xl border border-border/50 bg-card p-6 shadow-sm h-full"
            >
              <span className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-accent/10 text-accent">
                <p.icon className="h-5 w-5" aria-hidden="true" />
              </span>
              <h3 className="text-lg font-bold text-foreground mb-2">{p.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed mb-3">{p.body}</p>
              <ul className="space-y-1.5">
                {p.bullets.map((b) => (
                  <li key={b} className="text-sm text-muted-foreground leading-relaxed pl-4 relative">
                    <span className="absolute left-0 top-2 h-1.5 w-1.5 rounded-full bg-primary" aria-hidden="true" />
                    {b}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>

        <p className="mt-8 text-center text-sm text-muted-foreground">
          Contenu relu par notre équipe de conseillers le{" "}
          <time dateTime={CONTENT_LAST_REVIEWED}>{formatted}</time>. Consultez nos{" "}
          <Link to="/sources-et-methodologie" className="text-primary font-medium hover:underline">
            sources et notre méthodologie
          </Link>{" "}
          ou{" "}
          <Link to="/qui-sommes-nous" className="text-primary font-medium hover:underline">
            découvrez notre équipe
          </Link>
          .
        </p>
      </div>
    </section>
  );
};

export default ExpertiseEEAT;
