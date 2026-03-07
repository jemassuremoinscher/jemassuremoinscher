import { Shield, CheckCircle } from "lucide-react";
import teamExperts from "@/assets/team-experts.png";

const AuthorExpertise = () => {
  return (
    <div className="flex items-center gap-4 p-5 rounded-2xl bg-muted/50 border border-border/50">
      <img
        src={teamExperts}
        alt="Équipe d'experts Jemassuremoinscher"
        className="w-14 h-14 rounded-full object-cover ring-2 ring-primary/20"
        loading="lazy"
      />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="font-semibold text-foreground text-sm">
            Par l'équipe d'experts Jemassuremoinscher
          </span>
          <Shield className="h-4 w-4 text-primary shrink-0" />
        </div>
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <CheckCircle className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
          <span>Vérifié par nos courtiers certifiés ORIAS</span>
        </div>
      </div>
    </div>
  );
};

export default AuthorExpertise;
