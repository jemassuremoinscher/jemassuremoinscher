import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { CheckCircle2, ArrowRight, Sparkles } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useAnalytics } from '@/hooks/useAnalytics';

type Question = {
  id: string;
  question: string;
  options: { value: string; label: string; insuranceType: string[] }[];
};

const questions: Question[] = [
  {
    id: 'q1',
    question: 'Quel est votre besoin principal ?',
    options: [
      { value: 'vehicule', label: '🚗 Assurer mon véhicule', insuranceType: ['auto', 'moto'] },
      { value: 'sante', label: '🏥 Protéger ma santé', insuranceType: ['sante', 'prevoyance'] },
      { value: 'logement', label: '🏠 Sécuriser mon logement', insuranceType: ['habitation', 'pno'] },
      { value: 'famille', label: '👨‍👩‍👧 Protéger ma famille', insuranceType: ['vie', 'prevoyance'] },
    ],
  },
  {
    id: 'q2',
    question: 'Quelle est votre situation actuelle ?',
    options: [
      { value: 'nouveau', label: '🆕 Je n\'ai pas encore d\'assurance', insuranceType: [] },
      { value: 'insatisfait', label: '😕 Mon assurance actuelle est trop chère', insuranceType: [] },
      { value: 'changement', label: '🔄 J\'ai un changement de situation', insuranceType: [] },
      { value: 'compare', label: '🔍 Je veux simplement comparer', insuranceType: [] },
    ],
  },
  {
    id: 'q3',
    question: 'Quel est votre objectif principal ?',
    options: [
      { value: 'economiser', label: '💰 Économiser sur mes cotisations', insuranceType: [] },
      { value: 'couverture', label: '🛡️ Obtenir une meilleure couverture', insuranceType: [] },
      { value: 'rapide', label: '⚡ Souscrire rapidement', insuranceType: [] },
      { value: 'conseil', label: '💬 Être accompagné par un expert', insuranceType: [] },
    ],
  },
];

export const InsuranceQuiz = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [showResults, setShowResults] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { trackEvent, trackConversion } = useAnalytics();

  const progress = ((currentQuestion + 1) / questions.length) * 100;

  const handleAnswer = (value: string) => {
    const newAnswers = { ...answers, [questions[currentQuestion].id]: value };
    setAnswers(newAnswers);

    trackEvent('quiz_answer', {
      category: 'quiz',
      label: `Q${currentQuestion + 1}: ${value}`,
    });

    if (currentQuestion < questions.length - 1) {
      setTimeout(() => setCurrentQuestion(currentQuestion + 1), 300);
    } else {
      setShowResults(true);
    }
  };

  const getRecommendation = () => {
    const firstAnswer = questions[0].options.find(opt => opt.value === answers.q1);
    const insuranceTypes = firstAnswer?.insuranceType || [];
    
    const recommendations = {
      auto: {
        title: 'Assurance Auto',
        savings: '450€',
        description: 'Économisez jusqu\'à 450€/an sur votre assurance auto',
        link: '/assurance-auto',
      },
      moto: {
        title: 'Assurance Moto',
        savings: '280€',
        description: 'Trouvez la meilleure assurance moto au meilleur prix',
        link: '/assurance-moto',
      },
      sante: {
        title: 'Mutuelle Santé',
        savings: '600€',
        description: 'Comparez les mutuelles santé et économisez',
        link: '/assurance-sante',
      },
      prevoyance: {
        title: 'Prévoyance',
        savings: '380€',
        description: 'Protégez-vous et votre famille efficacement',
        link: '/assurance-prevoyance',
      },
      habitation: {
        title: 'Assurance Habitation',
        savings: '320€',
        description: 'Assurez votre logement au meilleur prix',
        link: '/assurance-habitation',
      },
      pno: {
        title: 'Assurance PNO',
        savings: '250€',
        description: 'Protégez votre bien immobilier locatif',
        link: '/assurance-pno',
      },
      vie: {
        title: 'Assurance Vie',
        savings: '500€',
        description: 'Préparez votre avenir avec l\'assurance vie',
        link: '/assurance-vie',
      },
    };

    return insuranceTypes.map(type => recommendations[type as keyof typeof recommendations]).filter(Boolean);
  };

  const handleSubmit = async () => {
    const trimmedName = fullName.trim();
    const trimmedEmail = email.trim();

    if (!trimmedName || trimmedName.length < 2) {
      toast.error('Nom invalide', {
        description: 'Veuillez renseigner votre nom (2 caractères minimum)',
      });
      return;
    }

    if (!trimmedEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      toast.error('Email invalide', {
        description: 'Veuillez entrer une adresse email valide',
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const recommendations = getRecommendation();
      
      const { error } = await supabase.from('quiz_leads' as any).insert({
        full_name: fullName,
        email,
        answers,
        recommendations: recommendations.map(r => r?.title).join(', '),
      });

      if (error) throw error;

      trackConversion('quiz_complete', 10);
      trackEvent('quote_request', {
        category: 'quiz',
        label: 'Quiz completed',
      });

      toast.success('Résultats envoyés !', {
        description: 'Consultez vos recommandations personnalisées ci-dessous',
      });
    } catch (error) {
      console.error('Error submitting quiz:', error);
      toast.error('Erreur', {
        description: 'Une erreur est survenue. Veuillez réessayer.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setAnswers({});
    setEmail('');
    setFullName('');
    setShowResults(false);
  };

  if (showResults) {
    const recommendations = getRecommendation();

    return (
      <section className="py-16 bg-gradient-subtle">
        <div className="container mx-auto px-4 max-w-4xl">
          <Card className="shadow-elegant">
            <CardHeader className="text-center pb-6">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Sparkles className="w-8 h-8 text-primary" />
              </div>
              <CardTitle className="text-3xl mb-2">
                Votre assurance idéale vous attend !
              </CardTitle>
              <p className="text-muted-foreground">
                Recevez vos recommandations personnalisées par email
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="fullName">Nom complet</Label>
                  <Input
                    id="fullName"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Jean Dupont"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="jean.dupont@exemple.fr"
                    className="mt-1"
                  />
                </div>
              </div>

              <Button
                onClick={handleSubmit}
                disabled={isSubmitting || !email || !fullName}
                className="w-full"
                size="lg"
              >
                {isSubmitting ? 'Envoi en cours...' : 'Voir mes recommandations'}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>

              {email && fullName && !isSubmitting && recommendations.length > 0 && (
                <div className="space-y-4 pt-6 border-t">
                  <h3 className="font-semibold text-lg flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                    Vos recommandations personnalisées
                  </h3>
                  <div className="grid gap-4">
                    {recommendations.map((rec, index) => rec && (
                      <Card key={index} className="border-primary/20 hover:border-primary transition-colors">
                        <CardContent className="p-4">
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-semibold text-lg">{rec.title}</h4>
                              <p className="text-sm text-muted-foreground mt-1">
                                {rec.description}
                              </p>
                            </div>
                            <div className="text-right">
                              <div className="text-2xl font-bold text-primary">
                                {rec.savings}
                              </div>
                              <div className="text-xs text-muted-foreground">
                                d'économies/an
                              </div>
                            </div>
                          </div>
                          <Button
                            asChild
                            variant="outline"
                            className="w-full mt-4"
                          >
                            <a href={rec.link}>
                              Comparer les offres
                              <ArrowRight className="ml-2 h-4 w-4" />
                            </a>
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}

              <Button
                variant="ghost"
                onClick={resetQuiz}
                className="w-full"
              >
                Recommencer le quiz
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>
    );
  }

  const currentQ = questions[currentQuestion];

  return (
    <section className="py-16 bg-gradient-subtle">
      <div className="container mx-auto px-4 max-w-3xl">
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Trouvez votre assurance idéale en 3 questions
          </h2>
          <p className="text-lg text-muted-foreground">
            Répondez à notre quiz et recevez des recommandations personnalisées
          </p>
        </div>

        <Card className="shadow-elegant">
          <CardHeader>
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Question {currentQuestion + 1} sur {questions.length}</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <h3 className="text-2xl font-semibold text-center mb-6">
              {currentQ.question}
            </h3>
            <div className="grid gap-3">
              {currentQ.options.map((option) => (
                <Button
                  key={option.value}
                  variant="outline"
                  className="h-auto py-4 px-6 text-left justify-start hover:border-primary hover:bg-primary/5 transition-all"
                  onClick={() => handleAnswer(option.value)}
                >
                  <span className="text-lg">{option.label}</span>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};
