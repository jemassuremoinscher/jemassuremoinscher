import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useCookieConsent } from "@/hooks/useCookieConsent";
import { Cookie, Settings, X } from "lucide-react";
import { Link } from "react-router-dom";

const CookieBanner = () => {
  const { showBanner, acceptAll, rejectAll, updatePreferences } = useCookieConsent();
  const [showSettings, setShowSettings] = useState(false);
  const [preferences, setPreferences] = useState({
    necessary: true,
    analytics: false,
    marketing: false,
  });

  if (!showBanner) return null;

  const handleSavePreferences = () => {
    updatePreferences(preferences);
    setShowSettings(false);
  };

  const handleAcceptAll = () => {
    acceptAll();
    setShowSettings(false);
  };

  const handleRejectAll = () => {
    rejectAll();
    setShowSettings(false);
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 animate-slide-in-left">
      <Card className="max-w-4xl mx-auto shadow-2xl border-2">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <Cookie className="h-6 w-6 text-primary" />
              </div>
              <div>
                <CardTitle className="text-lg">Gestion des cookies</CardTitle>
                <CardDescription className="text-sm mt-1">
                  Nous utilisons des cookies pour améliorer votre expérience
                </CardDescription>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleRejectAll}
              className="shrink-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="pb-3">
          {!showSettings ? (
            <p className="text-sm text-muted-foreground">
              Nous utilisons des cookies pour personnaliser le contenu et les annonces, pour fournir des fonctionnalités de médias sociaux et pour analyser notre trafic. Vous pouvez accepter tous les cookies ou gérer vos préférences.{" "}
              <Link to="/politique-cookies" className="text-primary hover:underline">
                En savoir plus
              </Link>
            </p>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between space-x-4 p-3 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <Label htmlFor="necessary" className="font-medium text-sm">
                    Cookies nécessaires
                  </Label>
                  <p className="text-xs text-muted-foreground mt-1">
                    Essentiels au fonctionnement du site. Toujours activés.
                  </p>
                </div>
                <Switch
                  id="necessary"
                  checked={true}
                  disabled
                  className="shrink-0"
                />
              </div>

              <div className="flex items-center justify-between space-x-4 p-3 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <Label htmlFor="analytics" className="font-medium text-sm">
                    Cookies analytiques
                  </Label>
                  <p className="text-xs text-muted-foreground mt-1">
                    Nous aident à comprendre comment vous utilisez notre site.
                  </p>
                </div>
                <Switch
                  id="analytics"
                  checked={preferences.analytics}
                  onCheckedChange={(checked) =>
                    setPreferences({ ...preferences, analytics: checked })
                  }
                  className="shrink-0"
                />
              </div>

              <div className="flex items-center justify-between space-x-4 p-3 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <Label htmlFor="marketing" className="font-medium text-sm">
                    Cookies marketing
                  </Label>
                  <p className="text-xs text-muted-foreground mt-1">
                    Utilisés pour afficher des publicités pertinentes.
                  </p>
                </div>
                <Switch
                  id="marketing"
                  checked={preferences.marketing}
                  onCheckedChange={(checked) =>
                    setPreferences({ ...preferences, marketing: checked })
                  }
                  className="shrink-0"
                />
              </div>
            </div>
          )}
        </CardContent>

        <CardFooter className="flex flex-wrap gap-2 pt-3 border-t">
          {!showSettings ? (
            <>
              <Button
                onClick={handleAcceptAll}
                className="flex-1 sm:flex-none bg-primary hover:bg-primary/90"
              >
                Tout accepter
              </Button>
              <Button
                onClick={handleRejectAll}
                variant="outline"
                className="flex-1 sm:flex-none"
              >
                Tout refuser
              </Button>
              <Button
                onClick={() => setShowSettings(true)}
                variant="ghost"
                className="flex-1 sm:flex-none"
              >
                <Settings className="h-4 w-4 mr-2" />
                Personnaliser
              </Button>
            </>
          ) : (
            <>
              <Button
                onClick={handleSavePreferences}
                className="flex-1 sm:flex-none bg-primary hover:bg-primary/90"
              >
                Enregistrer mes préférences
              </Button>
              <Button
                onClick={() => setShowSettings(false)}
                variant="outline"
                className="flex-1 sm:flex-none"
              >
                Retour
              </Button>
            </>
          )}
        </CardFooter>
      </Card>
    </div>
  );
};

export default CookieBanner;
