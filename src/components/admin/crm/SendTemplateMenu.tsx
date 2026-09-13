import { useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { MailPlus, Send } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import type { EmailTemplate } from '@/types/crm';

interface SendTemplateMenuProps {
  dealId: string;
  contactEmail?: string | null;
  contactFullName?: string | null;
  productLabel?: string;
  onSent?: () => void;
  /** Style du déclencheur pour s'aligner visuellement sur les boutons voisins
   * (Appel/Email/SMS/WhatsApp) du même bloc contact. */
  triggerClassName?: string;
}

// Même substitution que ActivityComposer.tsx et les edge functions d'envoi —
// {{prenom}} / {{produit}} uniquement, tolérante aux espaces.
const fillTemplateVars = (text: string, firstName: string, product: string): string =>
  text
    .replace(/\{\{\s*prenom\s*\}\}/gi, firstName)
    .replace(/\{\{\s*produit\s*\}\}/gi, product);

/**
 * Raccourci d'envoi de template : le menu déroulant liste les templates
 * actifs et pré-remplit sujet/corps au clic, mais n'envoie jamais
 * directement — une Dialog de relecture/modification s'ouvre toujours avant
 * l'appel réel à crm-send-template. Le gain de clics vient de sauter le
 * changement d'onglet + la sélection manuelle dans ActivityComposer, jamais
 * la vérification avant envoi.
 */
export const SendTemplateMenu = ({
  dealId,
  contactEmail,
  contactFullName,
  productLabel,
  onSent,
  triggerClassName,
}: SendTemplateMenuProps) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [templateId, setTemplateId] = useState<string | null>(null);
  const [templateName, setTemplateName] = useState('');
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');

  const firstName = (contactFullName ?? '').trim().split(/\s+/)[0] ?? '';
  const product = productLabel ?? '';

  const { data: templates } = useQuery({
    queryKey: ['email-templates-active'],
    queryFn: async (): Promise<EmailTemplate[]> => {
      const { data, error } = await supabase
        .from('email_templates')
        .select('id, name, subject, body')
        .eq('is_active', true)
        .order('name');
      if (error) throw error;
      return (data ?? []) as EmailTemplate[];
    },
  });

  const openPreview = (tpl: EmailTemplate) => {
    setTemplateId(tpl.id);
    setTemplateName(tpl.name);
    setSubject(fillTemplateVars(tpl.subject, firstName, product));
    setBody(fillTemplateVars(tpl.body, firstName, product));
    setDialogOpen(true);
  };

  const sendTemplate = useMutation({
    mutationFn: async () => {
      if (!contactEmail) throw new Error("Ce contact n'a pas d'adresse email");
      // DEBUG TEMPORAIRE (à retirer après diagnostic du 401 "Auth session
      // missing!") : vérifie l'état réel de la session juste avant l'appel,
      // sans jamais logger le token lui-même.
      const { data: { session: debugSession } } = await supabase.auth.getSession();
      console.log('[DEBUG crm-send-template] session avant invoke (SendTemplateMenu):', JSON.stringify({
        hasSession: !!debugSession,
        hasAccessToken: !!debugSession?.access_token,
        expiresAt: debugSession?.expires_at ? new Date(debugSession.expires_at * 1000).toISOString() : null,
        expired: debugSession?.expires_at ? Date.now() > debugSession.expires_at * 1000 : null,
      }));
      // Contournement : passe le token explicitement plutôt que de compter sur
      // l'injection automatique du SDK (cf. investigation du 401 "Auth session
      // missing!" — le mécanisme automatique est correct sur le papier mais le
      // header n'atteignait pas le serveur en pratique). À retirer avec le log
      // de debug ci-dessus une fois la cause confirmée.
      const { data, error } = await supabase.functions.invoke('crm-send-template', {
        headers: debugSession?.access_token ? { Authorization: `Bearer ${debugSession.access_token}` } : undefined,
        body: {
          dealId,
          templateId,
          recipientEmail: contactEmail,
          recipientName: contactFullName ?? contactEmail,
          subject,
          body,
        },
      });
      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      return data;
    },
    onSuccess: () => {
      setDialogOpen(false);
      toast.success('Email envoyé');
      onSent?.();
    },
    onError: (err: unknown) => {
      toast.error(err instanceof Error ? err.message : "Échec de l'envoi de l'email");
    },
  });

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild disabled={!contactEmail}>
          <button
            type="button"
            disabled={!contactEmail}
            className={
              triggerClassName ??
              'flex items-center gap-3 rounded-2xl border border-[#E9D5FF] dark:border-[#362B54] bg-white dark:bg-[#1E1B2E] px-4 py-3 text-sm text-slate-700 dark:text-slate-200 hover:bg-[#FAF5FF] dark:hover:bg-[#262140] disabled:opacity-50 disabled:cursor-not-allowed'
            }
          >
            <MailPlus className="h-4 w-4 text-[#7C3AED] dark:text-[#C4B5FD]" />
            Template
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          {(templates ?? []).length === 0 && (
            <div className="px-2 py-1.5 text-sm text-muted-foreground">Aucun template actif</div>
          )}
          {(templates ?? []).map((t) => (
            <DropdownMenuItem key={t.id} onClick={() => openPreview(t)}>
              {t.name}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Envoyer : {templateName}</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <p className="text-xs text-muted-foreground">
              Destinataire : <span className="font-medium text-foreground">{contactEmail}</span>
              {' · '}Expéditeur : <span className="font-medium text-foreground">contact@jemassuremoinscher.fr</span>
            </p>
            <div>
              <Label>Sujet</Label>
              <Input value={subject} onChange={(e) => setSubject(e.target.value)} />
            </div>
            <div>
              <Label>Corps</Label>
              <Textarea value={body} onChange={(e) => setBody(e.target.value)} rows={8} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setDialogOpen(false)} disabled={sendTemplate.isPending}>
              Annuler
            </Button>
            <Button
              onClick={() => sendTemplate.mutate()}
              disabled={sendTemplate.isPending || !subject.trim() || !body.trim()}
            >
              <Send className="mr-2 h-3.5 w-3.5" />
              {sendTemplate.isPending ? 'Envoi...' : 'Envoyer'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
