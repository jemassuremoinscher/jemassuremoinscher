import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Shield, Loader2, Mail, Lock } from 'lucide-react';
import { toast } from 'sonner';
import { z } from 'zod';

const authSchema = z.object({
  email: z.string().trim().email('Email invalide').max(255),
  password: z.string().min(6, 'Le mot de passe doit contenir au moins 6 caractères').max(100),
});

const Auth = () => {
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { signIn, signUp, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      // Mode de récupération d'accès : redonne le rôle admin aux comptes internes
      supabase.rpc('recover_internal_access').then(() => navigate('/admin'), () => navigate('/admin'));
    }
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const cleanEmail = email.trim().toLowerCase();
    const cleanPassword = password.trim();

    try {
      authSchema.parse({ email: cleanEmail, password: cleanPassword });
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast.error(error.errors[0].message);
        return;
      }
    }

    setIsLoading(true);

    try {
      if (mode === 'signup') {
        const { error } = await signUp(cleanEmail, cleanPassword);
        if (error) {
          if (error.message.toLowerCase().includes('already registered')) {
            toast.error('Ce compte existe déjà — connecte-toi ou utilise « mot de passe oublié ».');
            setMode('signin');
          } else {
            toast.error(error.message);
          }
        } else {
          toast.success('Compte créé ! Tu peux te connecter.');
          setMode('signin');
        }
        return;
      }

      // Purge d'une éventuelle session périmée (refresh token invalide sur un autre navigateur)
      await supabase.auth.signOut({ scope: 'local' }).catch(() => {});

      const { error } = await signIn(cleanEmail, cleanPassword);

      if (error) {
        if (error.message.includes('Invalid login credentials')) {
          toast.error(
            "Email ou mot de passe incorrect. Si le compte a été recréé récemment, utilise « Mot de passe oublié » pour en définir un nouveau.",
          );
        } else if (error.message.toLowerCase().includes('email not confirmed')) {
          toast.error("Email non confirmé — vérifie ta boîte mail.");
        } else {
          toast.error(error.message);
        }
      } else {
        await supabase.rpc('recover_internal_access');
        toast.success('Connexion réussie !');
        navigate('/admin');
      }
    } catch (error: any) {
      toast.error('Une erreur est survenue. Veuillez réessayer.');
    } finally {
      setIsLoading(false);
    }
  };


  const handleReset = async () => {
    const cleanEmail = email.trim().toLowerCase();
    try {
      authSchema.shape.email.parse(cleanEmail);
    } catch {
      toast.error('Saisis ton email pour recevoir le lien de réinitialisation');
      return;
    }
    const { error } = await supabase.auth.resetPasswordForEmail(cleanEmail, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    if (error) toast.error(error.message);
    else toast.success('Email de réinitialisation envoyé');
  };


  return (
    <>
      <Helmet>
        <title>Connexion Admin | jemassuremoinscher.fr</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-accent/5 p-4">
        <Card className="w-full max-w-md p-8">
          <div className="flex flex-col items-center mb-8">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <Shield className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-3xl font-bold">Dashboard Admin</h1>
            <p className="text-muted-foreground text-center mt-2">
              {mode === 'signin' ? "Accédez à votre espace d'administration" : 'Créez votre compte administrateur'}
            </p>
          </div>

          <div className="mb-6 grid grid-cols-2 gap-1 rounded-lg bg-muted p-1">
            <button
              type="button"
              onClick={() => setMode('signin')}
              className={`rounded-md py-2 text-sm font-medium transition ${mode === 'signin' ? 'bg-background shadow' : 'text-muted-foreground'}`}
            >
              Se connecter
            </button>
            <button
              type="button"
              onClick={() => setMode('signup')}
              className={`rounded-md py-2 text-sm font-medium transition ${mode === 'signup' ? 'bg-background shadow' : 'text-muted-foreground'}`}
            >
              Créer un compte
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="login-email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="login-email"
                  type="email"
                  placeholder="admin@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10"
                  disabled={isLoading}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="login-password">Mot de passe</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="login-password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10"
                  disabled={isLoading}
                  required
                />
              </div>
            </div>

            <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  {mode === 'signin' ? 'Connexion...' : 'Création...'}
                </>
              ) : mode === 'signin' ? (
                'Se connecter'
              ) : (
                'Créer mon compte'
              )}
            </Button>
          </form>

          <div className="mt-6 flex flex-col items-center gap-1">
            <Button variant="ghost" onClick={handleReset} className="text-sm">
              Mot de passe oublié ?
            </Button>
            <Button
              variant="ghost"
              onClick={() => navigate('/')}
              className="text-sm"
            >
              ← Retour à l'accueil
            </Button>
          </div>

        </Card>
      </div>
    </>
  );
};

export default Auth;
