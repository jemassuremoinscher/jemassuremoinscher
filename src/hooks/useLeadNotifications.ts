import { useEffect, useRef, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

const NOTIFICATION_SOUND_URL = 'data:audio/wav;base64,UklGRl9vT19teleXBldGRhdGE='; // placeholder

export function useLeadNotifications(enabled: boolean) {
  const permissionRef = useRef<NotificationPermission>('default');
  const initialLoadDone = useRef(false);

  const requestPermission = useCallback(async () => {
    if (!('Notification' in window)) return;
    const perm = await Notification.requestPermission();
    permissionRef.current = perm;
    return perm;
  }, []);

  const sendNotification = useCallback((title: string, body: string, url?: string) => {
    if (permissionRef.current !== 'granted') return;

    // Play sound
    try {
      const audio = new Audio('/notification-sound.mp3');
      audio.volume = 0.5;
      audio.play().catch(() => {});
    } catch {}

    const notification = new Notification(title, {
      body,
      icon: '/favicon.ico',
      badge: '/favicon.ico',
      tag: 'new-lead-' + Date.now(),
      requireInteraction: true,
    });

    notification.onclick = () => {
      window.focus();
      if (url) window.location.hash = '';
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

    // Wait a bit before listening to avoid notifications on initial load
    const timer = setTimeout(() => {
      initialLoadDone.current = true;
    }, 5000);

    const quotesChannel = supabase
      .channel('lead-notifications-quotes')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'insurance_quotes',
      }, (payload) => {
        if (!initialLoadDone.current) return;
        const data = payload.new as any;
        sendNotification(
          '🔔 Nouveau devis reçu !',
          `${data.full_name || 'Prospect'} — ${data.insurance_type || 'Assurance'}${data.phone ? ' • ' + data.phone : ''}`,
        );
      })
      .subscribe();

    const callbacksChannel = supabase
      .channel('lead-notifications-callbacks')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'contact_callbacks',
      }, (payload) => {
        if (!initialLoadDone.current) return;
        const data = payload.new as any;
        sendNotification(
          '📞 Nouvelle demande de rappel !',
          `${data.full_name || 'Prospect'}${data.phone ? ' • ' + data.phone : ''}`,
        );
      })
      .subscribe();

    const transfersChannel = supabase
      .channel('lead-notifications-transfers')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'chatbot_transfers',
      }, (payload) => {
        if (!initialLoadDone.current) return;
        const data = payload.new as any;
        sendNotification(
          '💬 Transfert chatbot !',
          `${data.visitor_name || data.visitor_email || 'Visiteur'}`,
        );
      })
      .subscribe();

    return () => {
      clearTimeout(timer);
      supabase.removeChannel(quotesChannel);
      supabase.removeChannel(callbacksChannel);
      supabase.removeChannel(transfersChannel);
    };
  }, [enabled, sendNotification]);

  return { requestPermission, permissionStatus: permissionRef.current };
}
