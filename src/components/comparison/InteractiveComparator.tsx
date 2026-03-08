import { useState, useMemo, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Check, TrendingDown, Star, Sparkles, Share2 } from 'lucide-react';
import { cn } from '@/lib/utils';

import { SubscriptionModal } from './SubscriptionModal';
import { toast } from 'sonner';
import { useAnalytics } from '@/hooks/useAnalytics';
import { useLanguage } from '@/contexts/LanguageContext';
import arthurThumbsUp from '@/assets/mascotte/arthur-thumbs-up.png';



interface InsuranceOffer {
  id: string;
  insurer: string;
  price: number;
  originalPrice: number;
  rating: number;
  coverage: string;
  benefits: string[];
  popular?: boolean;
}

const offersByType: Record<string, Omit<InsuranceOffer, 'price' | 'originalPrice'>[]> = {
  auto: [
    { id: '1', insurer: 'AXA', rating: 4.8, coverage: 'Premium', benefits: ['Assistance 24/7', 'Franchise 0€', 'Véhicule de remplacement', 'Protection juridique'], popular: true },
    { id: '2', insurer: 'MAIF', rating: 4.7, coverage: 'Tous risques', benefits: ['Bris de glace inclus', 'Protection conducteur', 'Assistance 0 km'] },
    { id: '3', insurer: 'Allianz', rating: 4.6, coverage: 'Confort', benefits: ['Garantie valeur à neuf', 'Prêt de véhicule', 'Assistance Europe'] },
    { id: '4', insurer: 'Groupama', rating: 4.5, coverage: 'Optimal', benefits: ['Catastrophes naturelles', 'Protection famille', 'Garage agréé'] },
    { id: '5', insurer: 'MACIF', rating: 4.7, coverage: 'Essentiel+', benefits: ['Vol et incendie', 'Dommages collision', 'Assistance panne'] },
    { id: '6', insurer: 'Direct Assurance', rating: 4.2, coverage: 'Éco', benefits: ['Responsabilité civile', 'Assistance de base'] },
  ],
  moto: [
    { id: '1', insurer: 'AXA', rating: 4.8, coverage: 'Premium', benefits: ['Assistance 24/7', 'Équipement pilote couvert', 'Vol et incendie', 'Protection juridique'], popular: true },
    { id: '2', insurer: 'MAIF', rating: 4.7, coverage: 'Tous risques', benefits: ['Casque et gants couverts', 'Protection conducteur', 'Assistance 0 km'] },
    { id: '3', insurer: 'Allianz', rating: 4.6, coverage: 'Confort', benefits: ['Valeur à neuf 2 ans', 'Accessoires couverts', 'Assistance Europe'] },
    { id: '4', insurer: 'Groupama', rating: 4.5, coverage: 'Optimal', benefits: ['Catastrophes naturelles', 'Prêt de 2 roues', 'Garage agréé'] },
    { id: '5', insurer: 'MACIF', rating: 4.7, coverage: 'Essentiel+', benefits: ['Vol et incendie', 'Dommages collision', 'Assistance panne'] },
    { id: '6', insurer: 'Direct Assurance', rating: 4.2, coverage: 'Éco', benefits: ['Responsabilité civile', 'Assistance de base'] },
  ],
  habitation: [
    { id: '1', insurer: 'AXA', rating: 4.8, coverage: 'Premium', benefits: ['Dégâts des eaux', 'Vol et vandalisme', 'Rééquipement à neuf', 'Protection juridique'], popular: true },
    { id: '2', insurer: 'MAIF', rating: 4.7, coverage: 'Tous risques', benefits: ['Incendie et explosion', 'Bris de glace', 'Catastrophes naturelles'] },
    { id: '3', insurer: 'Allianz', rating: 4.6, coverage: 'Confort', benefits: ['Responsabilité civile vie privée', 'Objets de valeur', 'Jardin et piscine'] },
    { id: '4', insurer: 'Groupama', rating: 4.5, coverage: 'Optimal', benefits: ['Dommages électriques', 'Assistance serrurerie', 'Relogement temporaire'] },
    { id: '5', insurer: 'MACIF', rating: 4.7, coverage: 'Essentiel+', benefits: ['Dégâts des eaux', 'Incendie', 'Responsabilité civile'] },
    { id: '6', insurer: 'Direct Assurance', rating: 4.2, coverage: 'Éco', benefits: ['Responsabilité civile', 'Incendie de base'] },
  ],
  sante: [
    { id: '1', insurer: 'AXA', rating: 4.8, coverage: 'Premium', benefits: ['Hospitalisation 100%', 'Dentaire 300%', 'Optique 400€/an', 'Médecines douces'], popular: true },
    { id: '2', insurer: 'Harmonie Mutuelle', rating: 4.7, coverage: 'Intégrale', benefits: ['Hospitalisation chambre seule', 'Orthodontie adulte', 'Cure thermale'] },
    { id: '3', insurer: 'Allianz', rating: 4.6, coverage: 'Confort', benefits: ['Consultation spécialistes 100%', 'Optique 300€/an', 'Prothèses dentaires'] },
    { id: '4', insurer: 'Groupama', rating: 4.5, coverage: 'Optimal', benefits: ['Hospitalisation 150%', 'Pharmacie remboursée', 'Téléconsultation incluse'] },
    { id: '5', insurer: 'MACIF', rating: 4.7, coverage: 'Essentiel+', benefits: ['Consultation généraliste 100%', 'Dentaire 200%', 'Optique 200€/an'] },
    { id: '6', insurer: 'MGEN', rating: 4.3, coverage: 'Éco', benefits: ['Soins courants 100%', 'Hospitalisation de base'] },
  ],
};

/** Generate dynamic prices so there's always at least one offer below currentPrice */
const generateOffers = (currentPrice: number, type: string): InsuranceOffer[] => {
  const ratios = [0.70, 0.75, 0.80, 0.85, 0.78, 0.55];
  const offers = offersByType[type] || offersByType.auto;
  return offers.map((offer, i) => {
    const price = Math.max(9, Math.round(currentPrice * ratios[i]));
    const originalPrice = Math.round(price * (1.25 + Math.random() * 0.15));
    return { ...offer, price, originalPrice };
  });
};

export const InteractiveComparator = () => {
  const { t } = useLanguage();
  const [insuranceType, setInsuranceType] = useState('auto');
  const [currentPrice, setCurrentPrice] = useState([65]);
  const [sortBy, setSortBy] = useState<'price' | 'rating' | 'coverage'>('price');
  const [selectedOffer, setSelectedOffer] = useState<InsuranceOffer | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [hasCompared, setHasCompared] = useState(false);

  const { trackEvent } = useAnalytics();

  // Update document.title based on current step
  useEffect(() => {
    const step = hasCompared ? 'Résultats' : 'Étape 1 : Vos critères';
    document.title = `${step} - Comparateur d'Assurance | Jemassuremoinscher`;
    return () => { document.title = 'Comparateur d\'Assurances Gratuit en Ligne'; };
  }, [hasCompared]);

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title: document.title, url: window.location.href });
      } catch { /* cancelled */ }
    } else {
      await navigator.clipboard.writeText(window.location.href);
      toast.success(t('comparator.linkCopied'));
    }
  };

  const handleSubscribe = (offer: InsuranceOffer) => {
    trackEvent('quote_request', {
      category: 'comparator_subscription',
      label: offer.insurer,
      value: offer.price,
      insurance_type: insuranceType,
    });
    setSelectedOffer(offer);
    setIsModalOpen(true);
  };

  const filteredOffers = useMemo(() => {
    return generateOffers(currentPrice[0], insuranceType)
      .map(offer => ({ ...offer, savings: offer.originalPrice - offer.price }))
      .sort((a, b) => {
        if (sortBy === 'price') return a.price - b.price;
        if (sortBy === 'coverage') return b.benefits.length - a.benefits.length;
        return b.rating - a.rating;
      });
  }, [sortBy, currentPrice, insuranceType]);

  const totalYearlySavings = useMemo(() => {
    const bestOffer = filteredOffers[0];
    return ((currentPrice[0] - bestOffer.price) * 12);
  }, [currentPrice, filteredOffers]);

  return (
    <div className="space-y-0">
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-primary via-primary/90 to-primary/80 overflow-hidden">
        <div className="container mx-auto px-4 py-8 md:py-20">
          <div className="max-w-[70%] sm:max-w-[75%] md:max-w-2xl relative z-10">
            <Badge className="mb-4 bg-white/20 text-white border-white/30 backdrop-blur-sm">
              <Sparkles className="h-3 w-3 mr-1" />
              {t('comparator.badge')}
            </Badge>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
              {t('comparator.heroTitle')}
            </h1>
            <p className="text-base md:text-lg text-white/80">
              {t('comparator.heroSubtitle')}
            </p>
          </div>
          <img src={arthurThumbsUp} alt="" aria-hidden="true" className="absolute right-4 md:right-12 bottom-0 h-24 sm:h-32 md:h-48 lg:h-56 object-contain opacity-90 pointer-events-none select-none" />
        </div>
      </section>

      <div className="container mx-auto px-4 py-6 md:py-14 space-y-10">
        {/* Filters Card */}
        <Card className="glass-card p-6 md:p-8 max-w-4xl mx-auto rounded-[2rem]">
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="space-y-3">
              <Label htmlFor="comparator-insurance-type" className="text-base font-semibold text-foreground">{t('comparator.insuranceType')}</Label>
              <Select value={insuranceType} onValueChange={setInsuranceType}>
                <SelectTrigger id="comparator-insurance-type" className="h-12 md:h-12 h-14 rounded-2xl text-base" aria-label={t('comparator.insuranceType')}><SelectValue /></SelectTrigger>
                <SelectContent className="rounded-2xl">
                  <SelectItem value="auto">{t('comparator.autoIns')}</SelectItem>
                  <SelectItem value="moto">{t('comparator.motoIns')}</SelectItem>
                  <SelectItem value="habitation">{t('comparator.homeIns')}</SelectItem>
                  <SelectItem value="sante">{t('comparator.healthIns')}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-3">
              <Label htmlFor="comparator-sort-by" className="text-base font-semibold text-foreground">{t('comparator.sortBy')}</Label>
              <Select value={sortBy} onValueChange={(v) => setSortBy(v as any)}>
                <SelectTrigger id="comparator-sort-by" className="h-12 rounded-2xl" aria-label={t('comparator.sortBy')}><SelectValue /></SelectTrigger>
                <SelectContent className="rounded-2xl">
                  <SelectItem value="price">{t('comparator.lowestPrice')}</SelectItem>
                  <SelectItem value="rating">{t('comparator.bestRating')}</SelectItem>
                  <SelectItem value="coverage">Meilleures garanties</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Slider */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="comparator-price-slider" className="text-base font-semibold text-foreground">{t('comparator.currentPrice')}</Label>
              <div className="text-2xl font-bold text-primary">{currentPrice[0]}€/{t('common.perMonth').split(' ').pop()}</div>
            </div>
            <Slider value={currentPrice} onValueChange={setCurrentPrice} min={30} max={150} step={5} className="w-full" aria-label={t('comparator.currentPrice')} />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>30€</span>
              <span>150€</span>
            </div>
          </div>

          {/* Savings highlight */}
          <div className="mt-8 p-6 rounded-[1.5rem] bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-full bg-primary/15 flex items-center justify-center shrink-0">
                <TrendingDown className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground font-medium">{t('comparator.yearlySavings')}</p>
                <p className="text-3xl font-black text-primary">{totalYearlySavings > 0 ? totalYearlySavings : 0}€</p>
                {totalYearlySavings > 0 && (
                  <p className="text-sm text-muted-foreground mt-0.5">
                    {t('comparator.switchingTo')} {filteredOffers[0]?.price}€/{t('common.perMonth').split(' ').pop()}
                  </p>
                )}
              </div>
            </div>
          </div>
          {/* Compare button */}
          {!hasCompared && (
            <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Button
                size="lg"
                role="button"
                onClick={() => setHasCompared(true)}
                className="bg-secondary hover:bg-secondary/90 text-secondary-foreground font-bold px-10 rounded-full text-lg"
                aria-label="Lancer la comparaison des tarifs d'assurance"
              >
                Comparer maintenant
              </Button>
              
            </div>
          )}
        </Card>

        {/* Offers - only shown after comparison */}
        {hasCompared && (
        <div className="max-w-4xl mx-auto space-y-4" aria-live="polite" aria-atomic="false">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-xl md:text-2xl font-bold text-foreground">
              {filteredOffers.length} {t('comparator.offersAvailable')}
            </h2>
            <Button variant="ghost" size="sm" onClick={handleShare} className="gap-2 text-muted-foreground hover:text-foreground" aria-label="Partager les résultats de comparaison">
              <Share2 className="h-4 w-4" aria-hidden="true" />
              {t('comparator.share')}
            </Button>
          </div>

          {filteredOffers.map((offer, index) => {
            const monthlySavings = currentPrice[0] - offer.price;
            const yearlySavings = monthlySavings * 12;

            return (
              <Card
                key={offer.id}
                className={cn(
                  'glass-card p-6 rounded-[2rem] transition-all duration-300 hover:shadow-[var(--shadow-hover)]',
                  offer.popular && 'ring-2 ring-primary/40',
                  index === 0 && 'bg-gradient-to-br from-primary/5 to-accent/5'
                )}
              >
                <div className="flex flex-col lg:flex-row lg:items-center gap-6">
                  <div className="flex-1 space-y-3">
                    <div className="flex items-center gap-2 flex-wrap">
                      {index === 0 && (
                        <Badge className="bg-primary text-primary-foreground">
                          <Sparkles className="h-3 w-3 mr-1" />
                          {t('comparator.bestOfferBadge')}
                        </Badge>
                      )}
                      {offer.popular && <Badge variant="secondary">{t('comparator.popular')}</Badge>}
                      <h3 className="text-xl font-bold text-foreground">{offer.insurer}</h3>
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-secondary text-secondary" />
                        <span className="text-sm font-semibold text-foreground">{offer.rating}</span>
                      </div>
                    </div>
                    <div>
                      <Badge variant="outline" className="mb-2 rounded-full">{offer.coverage}</Badge>
                      <div className="grid sm:grid-cols-2 gap-1.5">
                        {offer.benefits.map((benefit, idx) => (
                          <div key={idx} className="flex items-start gap-2 text-sm">
                            <Check className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                            <span className="text-muted-foreground">{benefit}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row lg:flex-col items-center gap-3 lg:items-end">
                    <div className="text-center lg:text-right">
                      <div className="flex items-baseline gap-2 justify-center lg:justify-end">
                        <span className="text-sm text-muted-foreground line-through">{offer.originalPrice}€</span>
                        <span className="text-3xl font-black text-primary">{offer.price}€</span>
                      </div>
                      <p className="text-sm text-muted-foreground">{t('common.perMonth')}</p>
                      {monthlySavings > 0 && (
                        <div className="mt-2 inline-flex items-center gap-1 bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-semibold">
                          <TrendingDown className="h-4 w-4" />
                          -{monthlySavings}€/{t('common.perMonth').split(' ').pop()}
                          <span className="text-xs opacity-75">(-{yearlySavings}€/{t('common.perYear').split(' ').pop()})</span>
                        </div>
                      )}
                    </div>
                    <Button
                      size="lg"
                      onClick={() => handleSubscribe(offer)}
                      aria-label={`Demander un devis ${offer.insurer} à ${offer.price}€ par mois`}
                      className={cn(
                        "w-full sm:w-auto lg:w-full rounded-full font-bold",
                        index === 0
                          ? "bg-secondary hover:bg-secondary/90 text-secondary-foreground"
                          : "bg-primary hover:bg-primary/90 text-primary-foreground"
                      )}
                    >
                      {t('comparator.callbackBtn')}
                    </Button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
        )}

      </div>

      {selectedOffer && (
        <SubscriptionModal
          open={isModalOpen}
          onOpenChange={setIsModalOpen}
          offerDetails={{
            insurer: selectedOffer.insurer,
            price: selectedOffer.price,
            coverage: selectedOffer.coverage,
            insuranceType: insuranceType,
          }}
        />
      )}
    </div>
  );
};
