import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink, MousePointerClick, Eye, Activity } from "lucide-react";
import { CLARITY_PROJECT_ID } from "@/config/analytics";
import { useLanguage } from "@/contexts/LanguageContext";

/**
 * Microsoft Clarity dashboard widget — link to external dashboard
 * (Clarity does not expose an embeddable iframe; deep-link only)
 */
const MicrosoftClarityWidget = () => {
  const { t } = useLanguage();
  const dashboardUrl = `https://clarity.microsoft.com/projects/view/${CLARITY_PROJECT_ID}/dashboard`;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <Activity className="w-5 h-5 text-primary" />
            </div>
            <div>
              <CardTitle>Microsoft Clarity</CardTitle>
              <CardDescription>
                Analyse comportementale : heatmaps, session replays, scroll depth
              </CardDescription>
            </div>
          </div>
          <Button asChild>
            <a
              href={dashboardUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={t("a11y.admin.openClarity")}
            >
              Ouvrir Clarity
              <ExternalLink className="w-4 h-4 ml-2" />
            </a>
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <a
            href={`https://clarity.microsoft.com/projects/view/${CLARITY_PROJECT_ID}/heatmaps`}
            target="_blank"
            rel="noopener noreferrer"
            className="block p-4 rounded-lg border bg-card hover:bg-accent/5 transition-colors"
          >
            <div className="flex items-center gap-2 mb-2">
              <MousePointerClick className="w-4 h-4 text-primary" />
              <span className="font-semibold">Heatmaps</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Voir où les utilisateurs cliquent et scrollent
            </p>
          </a>
          <a
            href={`https://clarity.microsoft.com/projects/view/${CLARITY_PROJECT_ID}/recordings`}
            target="_blank"
            rel="noopener noreferrer"
            className="block p-4 rounded-lg border bg-card hover:bg-accent/5 transition-colors"
          >
            <div className="flex items-center gap-2 mb-2">
              <Eye className="w-4 h-4 text-primary" />
              <span className="font-semibold">Session replays</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Rejouer les sessions utilisateurs
            </p>
          </a>
          <a
            href={`https://clarity.microsoft.com/projects/view/${CLARITY_PROJECT_ID}/dashboard`}
            target="_blank"
            rel="noopener noreferrer"
            className="block p-4 rounded-lg border bg-card hover:bg-accent/5 transition-colors"
          >
            <div className="flex items-center gap-2 mb-2">
              <Activity className="w-4 h-4 text-primary" />
              <span className="font-semibold">Insights</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Rage clicks, dead clicks, frustrations
            </p>
          </a>
        </div>
        <p className="text-xs text-muted-foreground mt-4">
          Project ID : <code className="font-mono">{CLARITY_PROJECT_ID}</code> · Données collectées en continu sur le site public
        </p>
      </CardContent>
    </Card>
  );
};

export default MicrosoftClarityWidget;
