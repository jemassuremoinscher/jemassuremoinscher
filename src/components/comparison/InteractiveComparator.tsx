import { useState, useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Check, TrendingDown, AlertCircle, Star, Sparkles, Link, Facebook, Twitter, Linkedin, MessageCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { SubscriptionModal } from './SubscriptionModal';
import { useToast } from '@/hooks/use-toast';

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
  const { toast } = useToast();

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      toast({
        title: "Lien copié !",
        description: "Le lien a été copié dans votre presse-papiers",
      });
    } catch (err) {
      toast({
        title: "Erreur",
        description: "Impossible de copier le lien",
        variant: "destructive",
      });
    }
  };

  const handleShareFacebook = () => {
    const url = encodeURIComponent(window.location.href);
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank', 'width=600,height=400');
  };

  const handleShareTwitter = () => {
    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent('Découvrez les meilleures offres d\'assurance avec notre comparateur en temps réel !');
    window.open(`https://twitter.com/intent/tweet?url=${url}&text=${text}`, '_blank', 'width=600,height=400');
  };

  const handleShareLinkedIn = () => {
    const url = encodeURIComponent(window.location.href);
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${url}`, '_blank', 'width=600,height=400');
  };

  const handleShareWhatsApp = () => {
    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent('Découvrez les meilleures offres d\'assurance avec notre comparateur en temps réel ! ');
    window.open(`https://wa.me/?text=${text}${url}`, '_blank');
  };

  const handleSubscribe = (offer: InsuranceOffer) => {
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
    <div className="space-y-8 py-12">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto">
        <Badge className="mb-4">
          <Sparkles className="h-3 w-3 mr-1" />
          Comparateur en Temps Réel
        </Badge>
        <h2 className="text-4xl md:text-5xl font-bold mb-4">
          Découvrez vos économies potentielles
        </h2>
        <p className="text-lg text-muted-foreground mb-4">
          Comparez instantanément les meilleures offres du marché
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Button 
            variant="outline" 
            size="lg"
            onClick={handleCopyLink}
            className="gap-2"
          >
            <Link className="h-4 w-4" />
            Copier le lien
          </Button>
          <Button 
            variant="outline" 
            size="lg"
            onClick={handleShareFacebook}
            className="gap-2 bg-blue-600 hover:bg-blue-700 text-white border-blue-600 hover:border-blue-700"
          >
            <Facebook className="h-4 w-4" />
            Facebook
          </Button>
          <Button 
            variant="outline" 
            size="lg"
            onClick={handleShareTwitter}
            className="gap-2 bg-sky-500 hover:bg-sky-600 text-white border-sky-500 hover:border-sky-600"
          >
            <Twitter className="h-4 w-4" />
            Twitter
          </Button>
          <Button 
            variant="outline" 
            size="lg"
            onClick={handleShareLinkedIn}
            className="gap-2 bg-blue-700 hover:bg-blue-800 text-white border-blue-700 hover:border-blue-800"
          >
            <Linkedin className="h-4 w-4" />
            LinkedIn
          </Button>
          <Button 
            variant="outline" 
            size="lg"
            onClick={handleShareWhatsApp}
            className="gap-2 bg-green-600 hover:bg-green-700 text-white border-green-600 hover:border-green-700"
          >
            <MessageCircle className="h-4 w-4" />
            WhatsApp
          </Button>
        </div>
      </div>

      {/* Interactive Filters */}
      <Card className="p-6 md:p-8 max-w-4xl mx-auto">
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Insurance Type */}
          <div className="space-y-3">
            <Label className="text-base font-semibold">Type d'assurance</Label>
            <Select value={insuranceType} onValueChange={setInsuranceType}>
              <SelectTrigger className="h-12">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="auto">🚗 Assurance Auto</SelectItem>
                <SelectItem value="moto">🏍️ Assurance Moto</SelectItem>
                <SelectItem value="habitation">🏠 Assurance Habitation</SelectItem>
                <SelectItem value="sante">💊 Mutuelle Santé</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Sort By */}
          <div className="space-y-3">
            <Label className="text-base font-semibold">Trier par</Label>
            <Select value={sortBy} onValueChange={(v) => setSortBy(v as any)}>
              <SelectTrigger className="h-12">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="savings">💰 Meilleures économies</SelectItem>
                <SelectItem value="price">💵 Prix le plus bas</SelectItem>
                <SelectItem value="rating">⭐ Meilleure note</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Current Price Slider */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label className="text-base font-semibold">Votre prix actuel</Label>
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

        {/* Savings Display */}
        <div className="mt-8 p-6 rounded-lg bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950/20 dark:to-green-900/20 border-2 border-green-200 dark:border-green-800">
          <div className="flex items-center gap-3 mb-2">
            <TrendingDown className="h-8 w-8 text-green-600" />
            <div>
              <p className="text-sm text-green-700 dark:text-green-400 font-medium">
                Économie potentielle sur 1 an
              </p>
              <p className="text-4xl font-black text-green-600">
                {totalYearlySavings > 0 ? totalYearlySavings : 0}€
              </p>
            </div>
          </div>
          {totalYearlySavings > 0 && (
            <p className="text-sm text-green-700 dark:text-green-400 mt-2">
              En passant à notre meilleure offre à {filteredOffers[0]?.price}€/mois
            </p>
          )}
        </div>
      </Card>

      {/* Offers Grid */}
      <div className="max-w-6xl mx-auto space-y-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-2xl font-bold">
            {filteredOffers.length} offres disponibles
          </h3>
          <Badge variant="outline">
            <AlertCircle className="h-3 w-3 mr-1" />
            Mise à jour en temps réel
          </Badge>
        </div>

        {filteredOffers.map((offer, index) => {
          const monthlySavings = currentPrice[0] - offer.price;
          const yearlySavings = monthlySavings * 12;

          return (
            <Card
              key={offer.id}
              className={cn(
                'p-6 transition-all hover:shadow-lg',
                offer.popular && 'border-2 border-primary shadow-md',
                index === 0 && 'bg-gradient-to-br from-primary/5 to-accent/5'
              )}
            >
              <div className="flex flex-col lg:flex-row lg:items-center gap-6">
                {/* Left - Insurer Info */}
                <div className="flex-1 space-y-3">
                  <div className="flex items-center gap-3 flex-wrap">
                    {index === 0 && (
                      <Badge className="bg-green-600 text-white">
                        <Sparkles className="h-3 w-3 mr-1" />
                        Meilleure offre
                      </Badge>
                    )}
                    {offer.popular && (
                      <Badge variant="secondary">
                        ⭐ Populaire
                      </Badge>
                    )}
                    <h4 className="text-xl font-bold">{offer.insurer}</h4>
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm font-semibold">{offer.rating}</span>
                    </div>
                  </div>

                  <div>
                    <Badge variant="outline" className="mb-2">
                      {offer.coverage}
                    </Badge>
                    <div className="grid sm:grid-cols-2 gap-2">
                      {offer.benefits.map((benefit, idx) => (
                        <div key={idx} className="flex items-start gap-2 text-sm">
                          <Check className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                          <span className="text-muted-foreground">{benefit}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Right - Pricing */}
                <div className="flex flex-col sm:flex-row lg:flex-col items-center gap-4 lg:items-end">
                  <div className="text-center lg:text-right">
                    <div className="flex items-baseline gap-2 justify-center lg:justify-end">
                      <span className="text-sm text-muted-foreground line-through">
                        {offer.originalPrice}€
                      </span>
                      <span className="text-4xl font-black text-primary">
                        {offer.price}€
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">par mois</p>
                    
                    {monthlySavings > 0 && (
                      <div className="mt-2 inline-flex items-center gap-1 bg-green-100 dark:bg-green-950/30 text-green-700 dark:text-green-400 px-3 py-1 rounded-full text-sm font-semibold">
                        <TrendingDown className="h-4 w-4" />
                        -{monthlySavings}€/mois
                        <span className="text-xs opacity-75">
                          (-{yearlySavings}€/an)
                        </span>
                      </div>
                    )}
                  </div>

                  <Button
                    size="lg"
                    variant={index === 0 ? "subscribe-best" : "subscribe"}
                    onClick={() => handleSubscribe(offer)}
                    className="w-full sm:w-auto lg:w-full"
                  >
                    {index === 0 ? 'Souscrire maintenant' : 'Souscrire'}
                  </Button>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* CTA Section */}
      <Card className="p-8 text-center bg-gradient-to-br from-primary/10 to-accent/10 max-w-3xl mx-auto">
        <h3 className="text-2xl font-bold mb-4">
          Besoin d'aide pour choisir ?
        </h3>
        <p className="text-muted-foreground mb-6">
          Nos experts comparent gratuitement toutes les offres et vous conseillent la meilleure solution
        </p>
        <Button size="lg" className="text-lg px-8">
          Parler à un expert gratuitement
        </Button>
      </Card>

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
