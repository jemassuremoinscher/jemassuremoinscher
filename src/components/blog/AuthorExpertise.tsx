import { Shield, CheckCircle, Award, Briefcase, BookOpen } from "lucide-react";
import teamExperts from "@/assets/team-experts.png";
import { getAuthor, type Author } from "@/data/authors";

interface AuthorExpertiseProps {
  /** Author name as it appears in blogArticles */
  authorName?: string;
}

/**
 * Rich author card for E-E-A-T optimization.
 * Displays credentials, bio, specialties, and trust signals.
 */
const AuthorExpertise = ({ authorName }: AuthorExpertiseProps) => {
  const author: Author = authorName
    ? getAuthor(authorName)
    : getAuthor("L'équipe d'experts jemassuremoinscher.fr");

  return (
    <div
      className="rounded-2xl border border-border/60 bg-card overflow-hidden"
      itemScope
      itemType="https://schema.org/Person"
    >
      {/* Header */}
      <div className="flex items-center gap-4 p-5 bg-muted/40">
        <img
          src={teamExperts}
          alt={`Photo de ${author.name}`}
          className="w-16 h-16 rounded-full object-cover ring-2 ring-primary/20"
          loading="lazy"
          width={64}
          height={64}
          itemProp="image"
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <h3 className="font-bold text-foreground text-base truncate" itemProp="name">
              {author.name}
            </h3>
            <Shield className="h-4 w-4 text-primary shrink-0" aria-label="Auteur vérifié" />
          </div>
          <p className="text-sm text-muted-foreground" itemProp="jobTitle">
            {author.role}
          </p>
          <div className="flex items-center gap-1.5 mt-1 text-xs text-muted-foreground">
            <CheckCircle className="h-3.5 w-3.5 text-emerald-600 shrink-0" aria-hidden="true" />
            <span>Vérifié par nos courtiers certifiés ORIAS</span>
          </div>
        </div>
      </div>

      {/* Bio */}
      <div className="px-5 py-4 border-t border-border/40">
        <p className="text-sm text-muted-foreground leading-relaxed" itemProp="description">
          {author.bio}
        </p>
      </div>

      {/* Credentials & Stats */}
      <div className="px-5 pb-5 grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* Credentials */}
        <div className="flex items-start gap-2.5">
          <div className="p-1.5 rounded-lg bg-primary/10 shrink-0 mt-0.5">
            <Award className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
          </div>
          <div>
            <p className="text-xs font-semibold text-foreground mb-1">Qualifications</p>
            <ul className="space-y-0.5">
              {author.credentials.map((cred, i) => (
                <li key={i} className="text-xs text-muted-foreground flex items-start gap-1">
                  <span className="text-primary mt-0.5">•</span>
                  <span>{cred}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Experience & Specialties */}
        <div className="space-y-3">
          <div className="flex items-start gap-2.5">
            <div className="p-1.5 rounded-lg bg-primary/10 shrink-0 mt-0.5">
              <Briefcase className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
            </div>
            <div>
              <p className="text-xs font-semibold text-foreground mb-0.5">Expérience</p>
              <p className="text-xs text-muted-foreground">{author.experienceYears} ans dans l'assurance</p>
            </div>
          </div>

          <div className="flex items-start gap-2.5">
            <div className="p-1.5 rounded-lg bg-primary/10 shrink-0 mt-0.5">
              <BookOpen className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
            </div>
            <div>
              <p className="text-xs font-semibold text-foreground mb-0.5">Spécialités</p>
              <div className="flex flex-wrap gap-1">
                {author.specialties.map((spec, i) => (
                  <span
                    key={i}
                    className="inline-block text-[10px] font-medium px-2 py-0.5 rounded-full bg-primary/10 text-primary"
                  >
                    {spec}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Hidden structured data */}
      <meta itemProp="worksFor" content="jemassuremoinscher.fr" />
      {author.registrationId && (
        <meta itemProp="identifier" content={author.registrationId} />
      )}
    </div>
  );
};

export default AuthorExpertise;
