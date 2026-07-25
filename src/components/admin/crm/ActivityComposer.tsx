import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { StickyNote, Phone, Mail, GraduationCap, Send } from 'lucide-react';
import { toast } from 'sonner';
import { createActivity, resolveCurrentAgentRef } from '@/lib/crmApi';
import type { CallOutcome, ComposableActionType } from '@/types/crm';

interface ActivityComposerProps {
  dealId: string;
  onCreated: () => void;
}

type QuickAction = 'note' | 'call' | 'email' | 'advice';

const ACTIONS: { key: QuickAction; label: string; icon: typeof Phone }[] = [
  { key: 'note', label: 'Note', icon: StickyNote },
  { key: 'call', label: 'Appel', icon: Phone },
  { key: 'email', label: 'Email', icon: Mail },
  { key: 'advice', label: 'Conseil délivré', icon: GraduationCap },
];

const CALL_OUTCOME_OPTIONS: { value: CallOutcome; label: string }[] = [
  { value: 'answered', label: 'Répondu' },
  { value: 'no_answer', label: 'Pas de réponse' },
  { value: 'callback_requested', label: 'Rappel demandé' },
];

export const ActivityComposer = ({ dealId, onCreated }: ActivityComposerProps) => {
  const [action, setAction] = useState<QuickAction>('note');
  const [content, setContent] = useState('');
  const [callOutcome, setCallOutcome] = useState<CallOutcome>('answered');
  const [adviceNeed, setAdviceNeed] = useState('');
  const [adviceRecommendation, setAdviceRecommendation] = useState('');

  const resetForm = () => {
    setContent('');
    setCallOutcome('answered');
    setAdviceNeed('');
    setAdviceRecommendation('');
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

      return createActivity({
        ...base,
        action_type: action satisfies ComposableActionType, // 'note' | 'email'
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

  const isValid =
    action === 'advice'
      ? adviceNeed.trim().length > 0 && adviceRecommendation.trim().length > 0
      : action === 'call'
        ? true
        : content.trim().length > 0;

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
                  : "Résumé de l'email envoyé..."
            }
          />
        </div>
      )}

      <div className="flex justify-end">
        <Button size="sm" onClick={() => mutation.mutate()} disabled={!isValid || mutation.isPending}>
          <Send className="h-3.5 w-3.5 mr-2" />
          {mutation.isPending ? 'Enregistrement...' : 'Ajouter'}
        </Button>
      </div>
    </Card>
  );
};
