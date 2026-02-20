import { Card } from "@/components/ui/card";
import { Shield, Award, Lock, Users, TrendingUp, CheckCircle } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export const TrustBadges = () => {
  const { t } = useLanguage();

  const badges = [
    { icon: Shield, title: t('trust.secureData'), description: t('trust.secureDataDesc') },
    { icon: Award, title: t('trust.certified'), description: t('trust.certifiedDesc') },
    { icon: Lock, title: t('trust.securePay'), description: t('trust.securePayDesc') },
    { icon: Users, title: t('trust.clients'), description: t('trust.clientsDesc') },
    { icon: TrendingUp, title: t('trust.savingsGuaranteed'), description: t('trust.savingsGuaranteedDesc') },
    { icon: CheckCircle, title: t('trust.noCommitment'), description: t('trust.noCommitmentDesc') },
  ];

  return (
    <section className="py-12 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {badges.map((badge, index) => (
            <Card key={index} className="p-4 text-center hover-lift transition-all group">
              <div className="flex flex-col items-center gap-2">
                <div className="bg-primary/10 p-3 rounded-full group-hover:bg-primary/20 transition-colors">
                  <badge.icon className="h-6 w-6 text-primary" aria-hidden="true" />
                </div>
                <div>
                  <p className="font-semibold text-sm">{badge.title}</p>
                  <p className="text-xs text-muted-foreground">{badge.description}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
