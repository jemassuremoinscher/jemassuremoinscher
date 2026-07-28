import { useEffect, useRef, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { loadPrefs, NotifType } from '@/lib/notificationPrefs';

interface Options {
  enabled: boolean;
  userId?: string | null;
  isSupervisor?: boolean;
}

interface EmitParams {
  type: NotifType;
  title: string;
  body: string;
  entityType?: string;
  entityId?: string;
  url?: string;
}

export function useLeadNotifications(optsOrEnabled: boolean | Options) {
  const opts: Options =
    typeof optsOrEnabled === 'boolean' ? { enabled: optsOrEnabled } : optsOrEnabled;
  const { enabled, userId, isSupervisor } = opts;

  const permissionRef = useRef<NotificationPermission>('default');
  const initialLoadDone = useRef(false);
  const userIdRef = useRef<string | null | undefined>(userId);
  const supervisorRef = useRef<boolean>(!!isSupervisor);
  const prefsRef = useRef(loadPrefs(userId || 'anon'));

  // Anti-spam state
  const dedupMap = useRef<Map<string, number>>(new Map());
  const burstBuffer = useRef<Map<NotifType, { count: number; firstAt: number; timer: number | null }>>(new Map());

  useEffect(() => {
    userIdRef.current = userId;
    prefsRef.current = loadPrefs(userId || 'anon');
  }, [userId]);
  useEffect(() => {
    supervisorRef.current = !!isSupervisor;
  }, [isSupervisor]);

  // Réagit aux changements de préférences dans la page Réglages
  useEffect(() => {
    if (!userId) return;
    const handler = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      if (detail?.userId === userId) prefsRef.current = loadPrefs(userId);
    };
    window.addEventListener('notif-prefs-changed', handler as EventListener);
    return () => window.removeEventListener('notif-prefs-changed', handler as EventListener);
  }, [userId]);

  const swRegRef = useRef<ServiceWorkerRegistration | null>(null);

  const ensureServiceWorker = useCallback(async () => {
    if (swRegRef.current) return swRegRef.current;
    if (!('serviceWorker' in navigator)) return null;
    try {
      const existing = await navigator.serviceWorker.getRegistration('/sw.js');
      const reg = existing ?? (await navigator.serviceWorker.register('/sw.js'));
      // wait until active so showNotification works reliably
      if (!reg.active) {
        await new Promise<void>((resolve) => {
          const sw = reg.installing || reg.waiting;
          if (!sw) return resolve();
          sw.addEventListener('statechange', () => {
            if (sw.state === 'activated') resolve();
          });
          setTimeout(() => resolve(), 3000);
        });
      }
      swRegRef.current = reg;
      return reg;
    } catch {
      return null;
    }
  }, []);

  const requestPermission = useCallback(async () => {
    if (!('Notification' in window)) return;
    const perm = await Notification.requestPermission();
    permissionRef.current = perm;
    if (perm === 'granted') await ensureServiceWorker();
    return perm;
  }, [ensureServiceWorker]);

  const showChromeNotification = useCallback(async (title: string, body: string, tag: string, url?: string) => {
    if (permissionRef.current !== 'granted') return;
    try {
      const audio = new Audio('/notification-sound.mp3');
      audio.volume = 0.5;
      audio.play().catch(() => {});
    } catch {}
    const options: NotificationOptions = {
      body,
      icon: '/favicon.ico',
      badge: '/favicon.ico',
      tag,
      requireInteraction: false,
      data: { url: url ?? '/admin' },
    };
    const reg = await ensureServiceWorker();
    if (reg && 'showNotification' in reg) {
      try {
        await reg.showNotification(title, options);
        return;
      } catch {
        // fall through to legacy path
      }
    }
    try {
      const n = new Notification(title, options);
      n.onclick = () => {
        window.focus();
        if (url) {
          try {
            const target = new URL(url, window.location.origin);
            if (target.origin === window.location.origin) window.location.assign(target.href);
          } catch {}
        }
        n.close();
      };
    } catch {}
  }, [ensureServiceWorker]);

  const logToDb = useCallback(
    async (p: EmitParams) => {
      const uid = userIdRef.current;
      if (!uid) return;
      try {
        await supabase.from('notification_log').insert({
          user_id: uid,
          type: p.type,
          entity_type: p.entityType ?? null,
          entity_id: p.entityId ?? null,
          title: p.title,
          body: p.body,
          url: p.url ?? null,
        });
        window.dispatchEvent(new CustomEvent('notif-log-changed'));
      } catch {}
    },
    [],
  );

  const emit = useCallback(
    (p: EmitParams) => {
      const prefs = prefsRef.current;
      if (!prefs.types[p.type]) return;

      // Dédoublonnage par (type + entity_id)
      const dedupKey = `${p.type}:${p.entityId ?? p.title}`;
      const now = Date.now();
      const last = dedupMap.current.get(dedupKey);
      if (last && now - last < prefs.dedupWindowMs) return;
      dedupMap.current.set(dedupKey, now);

      // Nettoie la map dédup (évite la fuite mémoire)
      if (dedupMap.current.size > 500) {
        for (const [k, t] of dedupMap.current) {
          if (now - t > prefs.dedupWindowMs) dedupMap.current.delete(k);
        }
      }

      // Regroupement anti-burst : plusieurs events du même type <10s
      const buf = burstBuffer.current.get(p.type) ?? { count: 0, firstAt: now, timer: null };
      if (now - buf.firstAt > prefs.burstWindowMs) {
        buf.count = 0;
        buf.firstAt = now;
      }
      buf.count += 1;
      burstBuffer.current.set(p.type, buf);

      // Log en DB systématiquement (l'historique conserve chaque event)
      logToDb(p);

      if (buf.count < prefs.burstThreshold) {
        showChromeNotification(p.title, p.body, `${p.type}-${p.entityId ?? now}`, p.url);
      } else if (buf.count === prefs.burstThreshold) {
        // Notification groupée unique
        showChromeNotification(
          `🔔 ${buf.count} nouveaux événements`,
          `Plusieurs "${p.title}" en rafale`,
          `${p.type}-burst-${buf.firstAt}`,
          p.url,
        );
      }
      // >threshold : silencieux jusqu'à la fin de la fenêtre burst
    },
    [logToDb, showChromeNotification],
  );

  useEffect(() => {
    if (!enabled) return;
    if ('Notification' in window) {
      permissionRef.current = Notification.permission;
      if (Notification.permission === 'granted') void ensureServiceWorker();
    }
  }, [enabled, ensureServiceWorker]);

  useEffect(() => {
    if (!enabled) return;

    const timer = setTimeout(() => {
      initialLoadDone.current = true;
    }, 5000);

    const quotesChannel = supabase
      .channel('lead-notif-quotes')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'insurance_quotes' }, (payload) => {
        if (!initialLoadDone.current) return;
        const d = payload.new as any;
        emit({
          type: 'lead_quote',
          title: '🔔 Nouveau devis reçu',
          body: `${d.full_name || 'Prospect'} — ${d.insurance_type || 'Assurance'}${d.phone ? ' • ' + d.phone : ''}`,
          entityType: 'insurance_quote',
          entityId: d.id,
          url: '/admin',
        });
      })
      .subscribe();

    const callbacksChannel = supabase
      .channel('lead-notif-callbacks')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'contact_callbacks' }, (payload) => {
        if (!initialLoadDone.current) return;
        const d = payload.new as any;
        emit({
          type: 'lead_callback',
          title: '📞 Nouvelle demande de rappel',
          body: `${d.full_name || 'Prospect'}${d.phone ? ' • ' + d.phone : ''}`,
          entityType: 'contact_callback',
          entityId: d.id,
          url: '/admin',
        });
      })
      .subscribe();

    const transfersChannel = supabase
      .channel('lead-notif-transfers')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'chatbot_transfers' }, (payload) => {
        if (!initialLoadDone.current) return;
        const d = payload.new as any;
        emit({
          type: 'lead_transfer',
          title: '💬 Transfert chatbot',
          body: `${d.visitor_name || d.visitor_email || 'Visiteur'}`,
          entityType: 'chatbot_transfer',
          entityId: d.id,
          url: '/admin',
        });
      })
      .subscribe();

    const dealsChannel = supabase
      .channel('lead-notif-deals')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'deals' }, (payload) => {
        if (!initialLoadDone.current) return;
        const d = payload.new as any;
        const uid = userIdRef.current;
        const mine = d.assigned_to && uid && d.assigned_to === uid;
        if (!mine && !supervisorRef.current) return;
        emit({
          type: 'deal_new',
          title: mine ? '🎯 Nouveau deal assigné' : '🆕 Nouveau deal créé',
          body: `${d.insurance_type || 'Deal'} — étape ${d.stage}`,
          entityType: 'deal',
          entityId: d.id,
          url: '/admin',
        });
      })
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'deals' }, (payload) => {
        if (!initialLoadDone.current) return;
        const n = payload.new as any;
        const o = payload.old as any;
        const uid = userIdRef.current;
        const involvesMe = uid && (n.assigned_to === uid || o.assigned_to === uid);
        if (!involvesMe && !supervisorRef.current) return;

        if (n.assigned_to !== o.assigned_to) {
          const toMe = uid && n.assigned_to === uid;
          emit({
            type: 'deal_reassign',
            title: toMe ? '📥 Deal réassigné vers toi' : '🔄 Deal réassigné',
            body: `${n.insurance_type || 'Deal'} — étape ${n.stage}`,
            entityType: 'deal',
            entityId: n.id,
            url: '/admin',
          });
          return;
        }
        if (n.stage !== o.stage) {
          emit({
            type: 'deal_stage',
            title: '🔀 Étape deal modifiée',
            body: `${n.insurance_type || 'Deal'} : ${o.stage} → ${n.stage}`,
            entityType: 'deal',
            entityId: n.id,
            url: '/admin',
          });
        }
      })
      .subscribe();

    const tasksChannel = supabase
      .channel('lead-notif-tasks')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'deal_tasks' }, (payload) => {
        if (!initialLoadDone.current) return;
        const t = payload.new as any;
        const uid = userIdRef.current;
        const mine = uid && t.assigned_to === uid;
        if (!mine && !supervisorRef.current) return;
        emit({
          type: 'task_new',
          title: mine ? '✅ Nouvelle tâche assignée' : '📝 Nouvelle tâche créée',
          body: `${t.title || 'Tâche'}${t.priority ? ' • ' + t.priority : ''}`,
          entityType: 'deal_task',
          entityId: t.id,
          url: '/admin/dashboard',
        });
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
          emit({
            type: 'task_reassign',
            title: toMe ? '📬 Tâche réassignée vers toi' : '🔄 Tâche réassignée',
            body: n.title || 'Tâche',
            entityType: 'deal_task',
            entityId: n.id,
            url: '/admin/dashboard',
          });
          return;
        }
        if (n.status !== o.status) {
          if (n.status === 'done') {
            emit({
              type: 'task_done',
              title: '✅ Tâche complétée',
              body: n.title || 'Tâche',
              entityType: 'deal_task',
              entityId: n.id,
              url: '/admin/dashboard',
            });
          } else {
            emit({
              type: 'task_update',
              title: '✏️ Tâche modifiée',
              body: `${n.title} — ${n.status}`,
              entityType: 'deal_task',
              entityId: n.id,
              url: '/admin/dashboard',
            });
          }
          return;
        }
        if (n.title !== o.title || n.due_at !== o.due_at || n.priority !== o.priority) {
          emit({
            type: 'task_update',
            title: '✏️ Tâche modifiée',
            body: n.title || 'Tâche',
            entityType: 'deal_task',
            entityId: n.id,
            url: '/admin/dashboard',
          });
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
  }, [enabled, emit]);

  // Notification de test (utilisée par le bouton "Tester")
  const sendTestNotification = useCallback(async () => {
    if (!('Notification' in window)) return false;
    if (Notification.permission !== 'granted') {
      const perm = await Notification.requestPermission();
      permissionRef.current = perm;
      if (perm !== 'granted') return false;
    } else {
      permissionRef.current = 'granted';
    }
    await ensureServiceWorker();
    await showChromeNotification(
      '🧪 Test notification',
      'Les notifications Chrome fonctionnent parfaitement.',
      `test-${Date.now()}`,
      '/admin/reglages/notifications',
    );
    logToDb({
      type: 'lead_quote',
      title: '🧪 Notification de test',
      body: 'Ping manuel depuis les réglages',
      entityType: 'test',
    });
    return true;
  }, [showChromeNotification, logToDb, ensureServiceWorker]);

  // Simule un vrai lead entrant (parcours complet via emit + SW)
  const sendSampleLeadNotification = useCallback(async () => {
    if (!('Notification' in window)) return false;
    if (Notification.permission !== 'granted') {
      const perm = await Notification.requestPermission();
      permissionRef.current = perm;
      if (perm !== 'granted') return false;
    }
    await ensureServiceWorker();
    const fakeId = `sample-${Date.now()}`;
    const samples = [
      { name: 'Jean Dupont', type: 'Auto', phone: '06 12 34 56 78' },
      { name: 'Marie Laurent', type: 'Habitation', phone: '07 88 55 22 11' },
      { name: 'Karim Benali', type: 'Santé', phone: '06 45 78 90 12' },
    ];
    const s = samples[Math.floor(Math.random() * samples.length)];
    emit({
      type: 'lead_quote',
      title: '🔔 Nouveau devis reçu (exemple)',
      body: `${s.name} — ${s.type} • ${s.phone}`,
      entityType: 'insurance_quote',
      entityId: fakeId,
      url: '/admin',
    });
    return true;
  }, [emit, ensureServiceWorker]);

  return {
    requestPermission,
    permissionStatus: permissionRef.current,
    sendTestNotification,
    sendSampleLeadNotification,
  };
}
