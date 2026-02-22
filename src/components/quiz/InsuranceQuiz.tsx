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
import { useLanguage } from '@/contexts/LanguageContext';

export const InsuranceQuiz = () => {
  const { t } = useLanguage();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [showResults, setShowResults] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { trackEvent, trackConversion } = useAnalytics();

  const questions = [
    { id: 'q1', question: t('quiz.q1'), options: [
      { value: 'vehicule', label: t('quiz.q1.vehicle'), insuranceType: ['auto', 'moto'] },
      { value: 'sante', label: t('quiz.q1.health'), insuranceType: ['sante', 'prevoyance'] },
      { value: 'logement', label: t('quiz.q1.home'), insuranceType: ['habitation', 'pno'] },
      { value: 'famille', label: t('quiz.q1.family'), insuranceType: ['vie', 'prevoyance'] },
    ]},
    { id: 'q2', question: t('quiz.q2'), options: [
      { value: 'nouveau', label: t('quiz.q2.new'), insuranceType: [] },
      { value: 'insatisfait', label: t('quiz.q2.expensive'), insuranceType: [] },
      { value: 'changement', label: t('quiz.q2.change'), insuranceType: [] },
      { value: 'compare', label: t('quiz.q2.compare'), insuranceType: [] },
    ]},
    { id: 'q3', question: t('quiz.q3'), options: [
      { value: 'economiser', label: t('quiz.q3.save'), insuranceType: [] },
      { value: 'couverture', label: t('quiz.q3.coverage'), insuranceType: [] },
      { value: 'rapide', label: t('quiz.q3.callback'), insuranceType: [] },
      { value: 'conseil', label: t('quiz.q3.advice'), insuranceType: [] },
    ]},
  ];

  const progress = ((currentQuestion + 1) / questions.length) * 100;

  const handleAnswer = (value: string) => {
    const newAnswers = { ...answers, [questions[currentQuestion].id]: value };
    setAnswers(newAnswers);
    trackEvent('quiz_answer', { category: 'quiz', label: `Q${currentQuestion + 1}: ${value}` });
    if (currentQuestion < questions.length - 1) { setTimeout(() => setCurrentQuestion(currentQuestion + 1), 300); }
    else { setShowResults(true); }
  };

  const getRecommendation = () => {
    const firstAnswer = questions[0].options.find(opt => opt.value === answers.q1);
    const insuranceTypes = firstAnswer?.insuranceType || [];
    const recommendations: Record<string, any> = {
      auto: { title: 'Assurance Auto', savings: '450€', description: "Économisez jusqu'à 450€/an", link: '/assurance-auto' },
      moto: { title: 'Assurance Moto', savings: '280€', description: 'Meilleure assurance moto', link: '/assurance-moto' },
      sante: { title: 'Mutuelle Santé', savings: '600€', description: 'Comparez les mutuelles', link: '/assurance-sante' },
      prevoyance: { title: 'Prévoyance', savings: '380€', description: 'Protégez votre famille', link: '/assurance-prevoyance' },
      habitation: { title: 'Assurance Habitation', savings: '320€', description: 'Assurez votre logement', link: '/assurance-habitation' },
      pno: { title: 'Assurance PNO', savings: '250€', description: 'Protégez votre bien locatif', link: '/assurance-pno' },
      vie: { title: 'Assurance Vie', savings: '500€', description: "Préparez l'avenir", link: '/assurance-vie' },
    };
    return insuranceTypes.map(type => recommendations[type]).filter(Boolean);
  };

  const handleSubmit = async () => {
    if (!fullName.trim() || fullName.trim().length < 2) { toast.error('Nom invalide'); return; }
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) { toast.error('Email invalide'); return; }
    setIsSubmitting(true);
    try {
      const recommendations = getRecommendation();
      const { error } = await supabase.from('quiz_leads' as any).insert({ full_name: fullName, email, answers, recommendations: recommendations.map((r: any) => r?.title).join(', ') });
      if (error) throw error;
      trackConversion('quiz_complete', 10);
      trackEvent('quote_request', { category: 'quiz', label: 'Quiz completed' });
      toast.success(t('insPage.toast.success'));
    } catch (error) {
      console.error('Error submitting quiz:', error);
      toast.error(t('insPage.toast.error'));
    } finally { setIsSubmitting(false); }
  };

  const resetQuiz = () => { setCurrentQuestion(0); setAnswers({}); setEmail(''); setFullName(''); setShowResults(false); };

  if (showResults) {
    const recommendations = getRecommendation();
    return (
      <section className="py-16 bg-gradient-subtle">
        <div className="container mx-auto px-4 max-w-4xl">
          <Card className="shadow-elegant">
            <CardHeader className="text-center pb-6">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4"><Sparkles className="w-8 h-8 text-primary" /></div>
              <CardTitle className="text-3xl mb-2">{t('quiz.resultTitle')}</CardTitle>
              <p className="text-muted-foreground">{t('quiz.resultDesc')}</p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div><Label htmlFor="fullName">{t('quiz.fullName')}</Label><Input id="fullName" value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Jean Dupont" className="mt-1" /></div>
                <div><Label htmlFor="email">{t('quiz.email')}</Label><Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="jean.dupont@exemple.fr" className="mt-1" /></div>
              </div>
              <Button onClick={handleSubmit} disabled={isSubmitting || !email || !fullName} className="w-full" size="lg">
                {isSubmitting ? t('quiz.sending') : t('quiz.seeResults')}<ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              {email && fullName && !isSubmitting && recommendations.length > 0 && (
                <div className="space-y-4 pt-6 border-t">
                  <h3 className="font-semibold text-lg flex items-center gap-2"><CheckCircle2 className="h-5 w-5 text-green-600" />{t('quiz.recommendations')}</h3>
                  <div className="grid gap-4">
                    {recommendations.map((rec: any, index: number) => rec && (
                      <Card key={index} className="border-primary/20 hover:border-primary transition-colors">
                        <CardContent className="p-4">
                          <div className="flex justify-between items-start">
                            <div><h4 className="font-semibold text-lg">{rec.title}</h4><p className="text-sm text-muted-foreground mt-1">{rec.description}</p></div>
                            <div className="text-right"><div className="text-2xl font-bold text-primary">{rec.savings}</div><div className="text-xs text-muted-foreground">{t('quiz.savingsPerYear')}</div></div>
                          </div>
                          <Button asChild variant="outline" className="w-full mt-4"><a href={rec.link}>{t('quiz.compareOffers')}<ArrowRight className="ml-2 h-4 w-4" /></a></Button>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}
              <Button variant="ghost" onClick={resetQuiz} className="w-full">{t('quiz.restart')}</Button>
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
          <h2 className="text-3xl md:text-4xl font-bold mb-4">{t('quiz.title')}</h2>
          <p className="text-lg text-muted-foreground">{t('quiz.subtitle')}</p>
        </div>
        <Card className="shadow-elegant">
          <CardHeader>
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>{t('quiz.question')} {currentQuestion + 1} {t('quiz.of')} {questions.length}</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <h3 className="text-2xl font-semibold text-center mb-6">{currentQ.question}</h3>
            <div className="grid gap-3">
              {currentQ.options.map((option) => (
                <Button key={option.value} variant="outline" className="h-auto py-4 px-6 text-left justify-start hover:border-primary hover:bg-primary/5 transition-all" onClick={() => handleAnswer(option.value)}>
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