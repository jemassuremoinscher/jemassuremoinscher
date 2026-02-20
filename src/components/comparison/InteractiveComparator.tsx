import { useState, useMemo } from 'react';
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
import arthurThumbsUp from '@/assets/mascotte/arthur-thumbs-up.png';
import arthurFlying from '@/assets/mascotte/arthur-flying.png';

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

const mockOffers: InsuranceOffer[] = [
  {
    id: '1',
    insurer: 'AXA',
    price: 45,
    originalPrice: 65,
    rating: 4.8,
    coverage: 'Premium',
    benefits: ['Assistance 24/7', 'Franchise 0€', 'Véhicule de remplacement', 'Protection juridique'],
    popular: true,
  },
  {
    id: '2',
    insurer: 'MAIF',
    price: 52,
    originalPrice: 70,
    rating: 4.7,
    coverage: 'Tous risques',
    benefits: ['Bris de glace inclus', 'Protection conducteur', 'Assistance 0 km'],
  },
  {
    id: '3',
    insurer: 'Allianz',
    price: 48,
    originalPrice: 68,
    rating: 4.6,
    coverage: 'Confort',
    benefits: ['Garantie valeur à neuf', 'Prêt de véhicule', 'Assistance Europe'],
  },
  {
    id: '4',
    insurer: 'Groupama',
    price: 55,
    originalPrice: 75,
    rating: 4.5,
    coverage: 'Optimal',
    benefits: ['Couverture catastrophes naturelles', 'Protection famille', 'Garage agréé'],
  },
  {
    id: '5',
    insurer: 'MACIF',
    price: 50,
    originalPrice: 72,
    rating: 4.7,
    coverage: 'Essentiel+',
    benefits: ['Vol et incendie', 'Dommages collision', 'Assistance panne'],
  },
];

export const InteractiveComparator = () => {
  const [insuranceType, setInsuranceType] = useState('auto');
  const [currentPrice, setCurrentPrice] = useState([65]);
  const [sortBy, setSortBy] = useState<'price' | 'savings' | 'rating'>('savings');
  const [selectedOffer, setSelectedOffer] = useState<InsuranceOffer | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { trackEvent } = useAnalytics();

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title: document.title, url: window.location.href });
      } catch { /* cancelled */ }
    } else {
      await navigator.clipboard.writeText(window.location.href);
      toast.success("Lien copié !");
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
    return mockOffers
      .map(offer => ({
        ...offer,
        savings: offer.originalPrice - offer.price,
      }))
      .sort((a, b) => {
        if (sortBy === 'price') return a.price - b.price;
        if (sortBy === 'savings') return b.savings - a.savings;
        return b.rating - a.rating;
      });
  }, [sortBy]);

  const totalYearlySavings = useMemo(() => {
    const bestOffer = filteredOffers[0];
    return ((currentPrice[0] - bestOffer.price) * 12);
  }, [currentPrice, filteredOffers]);

  return (
    <div className="space-y-0">
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-primary via-primary/90 to-primary/80 overflow-hidden">
        <div className="container mx-auto px-4 py-14 md:py-20">
          <div className="max-w-[70%] sm:max-w-[75%] md:max-w-2xl relative z-10">
            <Badge className="mb-4 bg-white/20 text-white border-white/30 backdrop-blur-sm">
              <Sparkles className="h-3 w-3 mr-1" />
              Comparateur en Temps Réel
            </Badge>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
              Découvrez vos économies potentielles
            </h1>
            <p className="text-base md:text-lg text-white/80">
              Comparez instantanément les meilleures offres du marché
            </p>
          </div>
          <img
            src={arthurThumbsUp}
            alt=""
            aria-hidden="true"
            className="absolute right-4 md:right-12 bottom-0 h-24 sm:h-32 md:h-48 lg:h-56 object-contain opacity-90 pointer-events-none select-none"
          />
        </div>
      </section>

      <div className="container mx-auto px-4 py-10 md:py-14 space-y-10">
        {/* Filters Card */}
        <Card className="glass-card p-6 md:p-8 max-w-4xl mx-auto rounded-[2rem]">
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="space-y-3">
              <Label className="text-base font-semibold text-foreground">Type d'assurance</Label>
              <Select value={insuranceType} onValueChange={setInsuranceType}>
                <SelectTrigger className="h-12 rounded-2xl">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="rounded-2xl">
                  <SelectItem value="auto">🚗 Assurance Auto</SelectItem>
                  <SelectItem value="moto">🏍️ Assurance Moto</SelectItem>
                  <SelectItem value="habitation">🏠 Assurance Habitation</SelectItem>
                  <SelectItem value="sante">💊 Mutuelle Santé</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-3">
              <Label className="text-base font-semibold text-foreground">Trier par</Label>
              <Select value={sortBy} onValueChange={(v) => setSortBy(v as any)}>
                <SelectTrigger className="h-12 rounded-2xl">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="rounded-2xl">
                  <SelectItem value="savings">💰 Meilleures économies</SelectItem>
                  <SelectItem value="price">💵 Prix le plus bas</SelectItem>
                  <SelectItem value="rating">⭐ Meilleure note</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Slider */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-base font-semibold text-foreground">Votre prix actuel</Label>
              <div className="text-2xl font-bold text-primary">{currentPrice[0]}€/mois</div>
            </div>
            <Slider
              value={currentPrice}
              onValueChange={setCurrentPrice}
              min={30}
              max={150}
              step={5}
              className="w-full"
            />
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
                <p className="text-sm text-muted-foreground font-medium">
                  Économie potentielle sur 1 an
                </p>
                <p className="text-3xl font-black text-primary">
                  {totalYearlySavings > 0 ? totalYearlySavings : 0}€
                </p>
                {totalYearlySavings > 0 && (
                  <p className="text-sm text-muted-foreground mt-0.5">
                    En passant à notre meilleure offre à {filteredOffers[0]?.price}€/mois
                  </p>
                )}
              </div>
            </div>
          </div>
        </Card>

        {/* Offers */}
        <div className="max-w-4xl mx-auto space-y-4">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-xl md:text-2xl font-bold text-foreground">
              {filteredOffers.length} offres disponibles
            </h2>
            <Button variant="ghost" size="sm" onClick={handleShare} className="gap-2 text-muted-foreground hover:text-foreground">
              <Share2 className="h-4 w-4" />
              Partager
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
                  {/* Left */}
                  <div className="flex-1 space-y-3">
                    <div className="flex items-center gap-2 flex-wrap">
                      {index === 0 && (
                        <Badge className="bg-primary text-primary-foreground">
                          <Sparkles className="h-3 w-3 mr-1" />
                          Meilleure offre
                        </Badge>
                      )}
                      {offer.popular && (
                        <Badge variant="secondary">⭐ Populaire</Badge>
                      )}
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

                  {/* Right - Pricing */}
                  <div className="flex flex-col sm:flex-row lg:flex-col items-center gap-3 lg:items-end">
                    <div className="text-center lg:text-right">
                      <div className="flex items-baseline gap-2 justify-center lg:justify-end">
                        <span className="text-sm text-muted-foreground line-through">{offer.originalPrice}€</span>
                        <span className="text-3xl font-black text-primary">{offer.price}€</span>
                      </div>
                      <p className="text-sm text-muted-foreground">par mois</p>

                      {monthlySavings > 0 && (
                        <div className="mt-2 inline-flex items-center gap-1 bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-semibold">
                          <TrendingDown className="h-4 w-4" />
                          -{monthlySavings}€/mois
                          <span className="text-xs opacity-75">(-{yearlySavings}€/an)</span>
                        </div>
                      )}
                    </div>

                    <Button
                      size="lg"
                      onClick={() => handleSubscribe(offer)}
                      className={cn(
                        "w-full sm:w-auto lg:w-full rounded-full font-bold",
                        index === 0
                          ? "bg-secondary hover:bg-secondary/90 text-secondary-foreground"
                          : "bg-primary hover:bg-primary/90 text-primary-foreground"
                      )}
                    >
                      Me faire rappeler
                    </Button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        {/* CTA */}
        <div className="relative bg-gradient-to-r from-primary to-primary/80 rounded-[2rem] p-8 md:p-12 text-center max-w-4xl mx-auto overflow-visible">
          <div className="relative z-10">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
              Besoin d'aide pour choisir ?
            </h2>
            <p className="text-white/80 mb-6 max-w-xl mx-auto">
              Nos experts comparent gratuitement toutes les offres et vous conseillent la meilleure solution
            </p>
            <Button size="lg" className="bg-secondary hover:bg-secondary/90 text-secondary-foreground font-bold px-8 rounded-full text-lg">
              Parler à un expert gratuitement
            </Button>
          </div>
          <img
            src={arthurFlying}
            alt=""
            aria-hidden="true"
            className="absolute -top-10 right-4 md:right-12 h-16 sm:h-24 md:h-36 object-contain pointer-events-none select-none"
          />
        </div>
      </div>

      {/* Subscription Modal */}
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
