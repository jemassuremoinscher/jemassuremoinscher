import { useEffect, useRef, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface Options {
  enabled: boolean;
  userId?: string | null;
  isSupervisor?: boolean;
}

export function useLeadNotifications(optsOrEnabled: boolean | Options) {
  const opts: Options =
    typeof optsOrEnabled === 'boolean'
      ? { enabled: optsOrEnabled }
      : optsOrEnabled;
  const { enabled, userId, isSupervisor } = opts;

  const permissionRef = useRef<NotificationPermission>('default');
  const initialLoadDone = useRef(false);
  const userIdRef = useRef<string | null | undefined>(userId);
  const supervisorRef = useRef<boolean>(!!isSupervisor);

  useEffect(() => {
    userIdRef.current = userId;
  }, [userId]);
  useEffect(() => {
    supervisorRef.current = !!isSupervisor;
  }, [isSupervisor]);

  const requestPermission = useCallback(async () => {
    if (!('Notification' in window)) return;
    const perm = await Notification.requestPermission();
    permissionRef.current = perm;
    return perm;
  }, []);

  const sendNotification = useCallback((title: string, body: string, tagPrefix = 'crm') => {
    if (permissionRef.current !== 'granted') return;
    try {
      const audio = new Audio('/notification-sound.mp3');
      audio.volume = 0.5;
      audio.play().catch(() => {});
    } catch {}
    const notification = new Notification(title, {
      body,
      icon: '/favicon.ico',
      badge: '/favicon.ico',
      tag: `${tagPrefix}-${Date.now()}`,
      requireInteraction: false,
    });
    notification.onclick = () => {
      window.focus();
      notification.close();
    };
  }, []);

  useEffect(() => {
    if (!enabled) return;
    if ('Notification' in window) {
      permissionRef.current = Notification.permission;
    }
  }, [enabled]);

  useEffect(() => {
    if (!enabled) return;

    const timer = setTimeout(() => {
      initialLoadDone.current = true;
    }, 5000);

    // ---- Nouveaux leads (INSERT) ----
    const quotesChannel = supabase
      .channel('lead-notif-quotes')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'insurance_quotes' }, (payload) => {
        if (!initialLoadDone.current) return;
        const d = payload.new as any;
        sendNotification(
          '🔔 Nouveau devis reçu',
          `${d.full_name || 'Prospect'} — ${d.insurance_type || 'Assurance'}${d.phone ? ' • ' + d.phone : ''}`,
          'quote-new',
        );
      })
      .subscribe();

    const callbacksChannel = supabase
      .channel('lead-notif-callbacks')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'contact_callbacks' }, (payload) => {
        if (!initialLoadDone.current) return;
        const d = payload.new as any;
        sendNotification(
          '📞 Nouvelle demande de rappel',
          `${d.full_name || 'Prospect'}${d.phone ? ' • ' + d.phone : ''}`,
          'callback-new',
        );
      })
      .subscribe();

    const transfersChannel = supabase
      .channel('lead-notif-transfers')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'chatbot_transfers' }, (payload) => {
        if (!initialLoadDone.current) return;
        const d = payload.new as any;
        sendNotification(
          '💬 Transfert chatbot',
          `${d.visitor_name || d.visitor_email || 'Visiteur'}`,
          'transfer-new',
        );
      })
      .subscribe();

    // ---- Deals : pipeline (INSERT + UPDATE) ----
    const dealsChannel = supabase
      .channel('lead-notif-deals')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'deals' }, (payload) => {
        if (!initialLoadDone.current) return;
        const d = payload.new as any;
        const uid = userIdRef.current;
        const mine = d.assigned_to && uid && d.assigned_to === uid;
        if (!mine && !supervisorRef.current) return;
        sendNotification(
          mine ? '🎯 Nouveau deal assigné' : '🆕 Nouveau deal créé',
          `${d.insurance_type || 'Deal'} — étape ${d.stage}`,
          'deal-new',
        );
      })
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'deals' }, (payload) => {
        if (!initialLoadDone.current) return;
        const n = payload.new as any;
        const o = payload.old as any;
        const uid = userIdRef.current;
        const involvesMe = uid && (n.assigned_to === uid || o.assigned_to === uid);
        if (!involvesMe && !supervisorRef.current) return;

        // Réassignation
        if (n.assigned_to !== o.assigned_to) {
          const toMe = uid && n.assigned_to === uid;
          sendNotification(
            toMe ? '📥 Deal réassigné vers toi' : '🔄 Deal réassigné',
            `${n.insurance_type || 'Deal'} — étape ${n.stage}`,
            'deal-reassign',
          );
          return;
        }
        // Changement d'étape
        if (n.stage !== o.stage) {
          sendNotification(
            '🔀 Étape deal modifiée',
            `${n.insurance_type || 'Deal'} : ${o.stage} → ${n.stage}`,
            'deal-stage',
          );
          return;
        }
      })
      .subscribe();

    // ---- Tâches ----
    const tasksChannel = supabase
      .channel('lead-notif-tasks')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'deal_tasks' }, (payload) => {
        if (!initialLoadDone.current) return;
        const t = payload.new as any;
        const uid = userIdRef.current;
        const mine = uid && t.assigned_to === uid;
        if (!mine && !supervisorRef.current) return;
        sendNotification(
          mine ? '✅ Nouvelle tâche assignée' : '📝 Nouvelle tâche créée',
          `${t.title || 'Tâche'}${t.priority ? ' • ' + t.priority : ''}`,
          'task-new',
        );
      })
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'deal_tasks' }, (payload) => {
        if (!initialLoadDone.current) return;
        const n = payload.new as any;
        const o = payload.old as any;
        const uid = userIdRef.current;
        const involvesMe = uid && (n.assigned_to === uid || o.assigned_to === uid);
        if (!involvesMe && !supervisorRef.current) return;

        if (n.assigned_to !== o.assigned_to) {
          const toMe = uid && n.assigned_to === uid;
          sendNotification(
            toMe ? '📬 Tâche réassignée vers toi' : '🔄 Tâche réassignée',
            n.title || 'Tâche',
            'task-reassign',
          );
          return;
        }
        if (n.status !== o.status) {
          if (n.status === 'done') {
            sendNotification('✅ Tâche complétée', n.title || 'Tâche', 'task-done');
          } else {
            sendNotification('✏️ Tâche modifiée', `${n.title} — ${n.status}`, 'task-update');
          }
          return;
        }
        // Autre modif (titre, échéance, priorité)
        if (n.title !== o.title || n.due_at !== o.due_at || n.priority !== o.priority) {
          sendNotification('✏️ Tâche modifiée', n.title || 'Tâche', 'task-update');
        }
      })
      .subscribe();

    return () => {
      clearTimeout(timer);
      supabase.removeChannel(quotesChannel);
      supabase.removeChannel(callbacksChannel);
      supabase.removeChannel(transfersChannel);
      supabase.removeChannel(dealsChannel);
      supabase.removeChannel(tasksChannel);
    };
  }, [enabled, sendNotification]);

  return { requestPermission, permissionStatus: permissionRef.current };
}
