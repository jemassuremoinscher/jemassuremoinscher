import { useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { StickyNote, Phone, Mail, MessageSquare, MessageCircle, MailPlus, GraduationCap, Send } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { createActivity, resolveCurrentAgentRef } from '@/lib/crmApi';
import type { CallOutcome, ComposableActionType, EmailTemplate } from '@/types/crm';

interface ActivityComposerProps {
  dealId: string;
  onCreated: () => void;
  /** Pour l'action "Envoyer template" — destinataire et substitution des variables. */
  contactEmail?: string | null;
  contactFullName?: string | null;
  productLabel?: string;
}

type QuickAction = 'note' | 'call' | 'email' | 'sms' | 'whatsapp' | 'advice' | 'template';

const ACTIONS: { key: QuickAction; label: string; icon: typeof Phone }[] = [
  { key: 'note', label: 'Note', icon: StickyNote },
  { key: 'call', label: 'Appel', icon: Phone },
  { key: 'email', label: 'Email', icon: Mail },
  { key: 'sms', label: 'SMS', icon: MessageSquare },
  { key: 'whatsapp', label: 'WhatsApp', icon: MessageCircle },
  { key: 'advice', label: 'Conseil délivré', icon: GraduationCap },
  { key: 'template', label: 'Envoyer template', icon: MailPlus },
];

const CALL_OUTCOME_OPTIONS: { value: CallOutcome; label: string }[] = [
  { value: 'answered', label: 'Répondu' },
  { value: 'no_answer', label: 'Pas de réponse' },
  { value: 'callback_requested', label: 'Rappel demandé' },
];

// Substitution des seules variables supportées : {{prenom}} et {{produit}},
// tolérante aux espaces ({{ prenom }}). Aucune autre interpolation.
const fillTemplateVars = (text: string, firstName: string, product: string): string =>
  text
    .replace(/\{\{\s*prenom\s*\}\}/gi, firstName)
    .replace(/\{\{\s*produit\s*\}\}/gi, product);

export const ActivityComposer = ({
  dealId,
  onCreated,
  contactEmail,
  contactFullName,
  productLabel,
}: ActivityComposerProps) => {
  const [action, setAction] = useState<QuickAction>('note');
  const [content, setContent] = useState('');
  const [callOutcome, setCallOutcome] = useState<CallOutcome>('answered');
  const [adviceNeed, setAdviceNeed] = useState('');
  const [adviceRecommendation, setAdviceRecommendation] = useState('');

  const [templateId, setTemplateId] = useState<string>('');
  const [emailSubject, setEmailSubject] = useState('');
  const [emailBody, setEmailBody] = useState('');

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
    enabled: action === 'template',
  });

  const resetForm = () => {
    setContent('');
    setCallOutcome('answered');
    setAdviceNeed('');
    setAdviceRecommendation('');
  };

  const resetTemplateForm = () => {
    setTemplateId('');
    setEmailSubject('');
    setEmailBody('');
  };

  const applyTemplate = (id: string) => {
    setTemplateId(id);
    const tpl = templates?.find((t) => t.id === id);
    if (!tpl) return;
    setEmailSubject(fillTemplateVars(tpl.subject, firstName, product));
    setEmailBody(fillTemplateVars(tpl.body, firstName, product));
  };

  const mutation = useMutation({
    mutationFn: async () => {
      const agent = await resolveCurrentAgentRef();
      if (!agent) throw new Error('Utilisateur non authentifié');

      const base = { deal_id: dealId, author_id: agent.userId };

      if (action === 'call') {
        return createActivity({
          ...base,
          action_type: 'call' satisfies ComposableActionType,
          description: content || null,
          metadata: { outcome: callOutcome },
        });
      }

      if (action === 'advice') {
        return createActivity({
          ...base,
          action_type: 'meeting' satisfies ComposableActionType,
          description: null,
          metadata: { kind: 'advice', need: adviceNeed, recommendation: adviceRecommendation },
        });
      }

      // action est ici 'note' | 'email' | 'sms' | 'whatsapp'
      // ('call', 'advice' et 'template' ont leur propre branche ci-dessus / sendTemplate)
      return createActivity({
        ...base,
        action_type: action as ComposableActionType,
        description: content || null,
      });
    },
    onSuccess: () => {
      resetForm();
      toast.success('Activité enregistrée');
      onCreated();
    },
    onError: () => {
      toast.error("Erreur lors de l'enregistrement de l'activité");
    },
  });

  // Envoi réel via l'edge function : elle envoie via Resend PUIS logue dans
  // activities + email_tracking. En cas d'échec Resend, elle renvoie une erreur
  // et ne logue aucun succès — on n'appelle onCreated() que sur succès confirmé.
  const sendTemplate = useMutation({
    mutationFn: async () => {
      if (!contactEmail) throw new Error('Ce contact n\'a pas d\'adresse email');
      const { data, error } = await supabase.functions.invoke('crm-send-template', {
        body: {
          dealId,
          templateId: templateId || null,
          recipientEmail: contactEmail,
          recipientName: contactFullName ?? contactEmail,
          subject: emailSubject,
          body: emailBody,
        },
      });
      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      return data;
    },
    onSuccess: () => {
      resetTemplateForm();
      toast.success('Email envoyé');
      onCreated();
    },
    onError: (err: unknown) => {
      toast.error(err instanceof Error ? err.message : "Échec de l'envoi de l'email");
    },
  });

  const isValid =
    action === 'advice'
      ? adviceNeed.trim().length > 0 && adviceRecommendation.trim().length > 0
      : action === 'call'
        ? true
        : action === 'template'
          ? Boolean(contactEmail) && emailSubject.trim().length > 0 && emailBody.trim().length > 0
          : content.trim().length > 0;

  const submitting = mutation.isPending || sendTemplate.isPending;

  return (
    <Card className="p-4 space-y-3">
      <div className="flex flex-wrap gap-2">
        {ACTIONS.map(({ key, label, icon: Icon }) => (
          <Button
            key={key}
            type="button"
            size="sm"
            variant={action === key ? 'default' : 'outline'}
            onClick={() => setAction(key)}
          >
            <Icon className="h-3.5 w-3.5 mr-2" />
            {label}
          </Button>
        ))}
      </div>

      {action === 'advice' ? (
        <div className="space-y-2">
          <div>
            <p className="text-xs text-muted-foreground mb-1">Besoin exprimé par le client</p>
            <Textarea
              value={adviceNeed}
              onChange={(e) => setAdviceNeed(e.target.value)}
              rows={2}
              placeholder="Ex : couvrir son véhicule neuf financé à crédit..."
            />
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-1">Recommandation formulée</p>
            <Textarea
              value={adviceRecommendation}
              onChange={(e) => setAdviceRecommendation(e.target.value)}
              rows={2}
              placeholder="Ex : formule tous risques avec garantie valeur à neuf..."
            />
          </div>
        </div>
      ) : action === 'template' ? (
        <div className="space-y-2">
          <div className="text-xs text-muted-foreground">
            Destinataire :{' '}
            {contactEmail ? (
              <span className="font-medium text-foreground">{contactEmail}</span>
            ) : (
              <span className="text-destructive">aucune adresse email pour ce contact</span>
            )}
            {' · '}Expéditeur : <span className="font-medium text-foreground">contact@jemassuremoinscher.fr</span>
          </div>
          <Select value={templateId} onValueChange={applyTemplate} disabled={!contactEmail}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Choisir un template..." />
            </SelectTrigger>
            <SelectContent>
              {(templates ?? []).map((t) => (
                <SelectItem key={t.id} value={t.id}>
                  {t.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div>
            <p className="text-xs text-muted-foreground mb-1">Sujet</p>
            <Input
              value={emailSubject}
              onChange={(e) => setEmailSubject(e.target.value)}
              disabled={!contactEmail}
              placeholder="Sujet de l'email"
            />
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-1">Corps</p>
            <Textarea
              value={emailBody}
              onChange={(e) => setEmailBody(e.target.value)}
              rows={8}
              disabled={!contactEmail}
              placeholder="Corps de l'email (les variables {{prenom}} / {{produit}} sont déjà remplacées)"
            />
          </div>
        </div>
      ) : (
        <div className="space-y-2">
          {action === 'call' && (
            <Select value={callOutcome} onValueChange={(v) => setCallOutcome(v as CallOutcome)}>
              <SelectTrigger className="w-[220px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {CALL_OUTCOME_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={3}
            placeholder={
              action === 'note'
                ? 'Ajouter une note...'
                : action === 'call'
                  ? "Détails de l'appel (optionnel)..."
                  : action === 'sms'
                    ? 'Résumé du SMS envoyé...'
                    : action === 'whatsapp'
                      ? 'Résumé de la conversation WhatsApp...'
                      : "Résumé de l'email envoyé..."
            }
          />
        </div>
      )}

      <div className="flex justify-end">
        <Button
          size="sm"
          onClick={() => (action === 'template' ? sendTemplate.mutate() : mutation.mutate())}
          disabled={!isValid || submitting}
        >
          <Send className="h-3.5 w-3.5 mr-2" />
          {action === 'template'
            ? sendTemplate.isPending
              ? 'Envoi...'
              : 'Envoyer'
            : mutation.isPending
              ? 'Enregistrement...'
              : 'Ajouter'}
        </Button>
      </div>
    </Card>
  );
};
