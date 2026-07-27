## Chantier "Notifications Chrome — v2"

### 1. Table `notification_log` (Cloud DB)
Nouvelle table pour tracer chaque notification envoyée :
- `id`, `user_id` (destinataire), `type` (`lead_new`, `task_assigned`, `task_updated`, `task_completed`, `deal_stage_changed`, `deal_reassigned`…), `entity_type`, `entity_id`, `title`, `body`, `url`, `read_at`, `created_at`.
- RLS : l'utilisateur voit ses propres notifs, admin/owner voient tout.
- GRANT + policies conformes au standard du projet.

### 2. Anti-spam / dédoublonnage (hook)
Refonte de `useLeadNotifications` :
- Clé de dédup `type:entity_id` stockée en mémoire + `localStorage` (TTL 5 min) → pas 2× la même notif.
- Regroupement en rafale : si ≥3 events du même type en <10s → une seule notif "3 nouveaux leads" au lieu de 3.
- Chaque notif affichée = 1 insert dans `notification_log`.

### 3. Page Réglages `/admin/reglages/notifications`
Interface pour activer/désactiver par type :
- Leads (nouveaux devis, rappels, chatbot)
- Tâches (assignées, modifiées, complétées, réassignées)
- Deals (changement d'étape, réassignation)
- Préférences stockées dans `localStorage` par user (clé `notif-prefs:{userId}`).
- Le hook lit ces prefs avant d'afficher.
- Bouton **"Tester la notification"** qui envoie une notif de démo et vérifie la permission Chrome.

### 4. Centre de notifications in-app
Nouvel onglet dans la sidebar CRM (icône cloche + badge non-lus) :
- Liste paginée depuis `notification_log` (filtre user_id sauf admin).
- Recherche texte, filtre par type/date.
- Clic sur une notif → navigation vers l'entité (`url`) + marque comme lue.
- Bouton "Tout marquer comme lu".

### 5. Export CSV
Bouton dans le centre de notifs → CSV `date, type, entité, url, utilisateur, lue_le`.
Réutilise `src/utils/exportCSV.ts`.

### Fichiers touchés
- **Migration SQL** : `notification_log` + RLS + grants.
- **Nouveau** : `src/pages/crm/NotificationsCenter.tsx`, `src/pages/crm/NotificationSettings.tsx`.
- **Modifiés** : `src/hooks/useLeadNotifications.ts` (dédup/prefs/log), `src/pages/crm/CrmSidebar.tsx` (2 entrées menu), `src/pages/crm/CrmLayout.tsx` (routes), `src/pages/crm/CrmHeader.tsx` (bouton Tester + badge).

### Hors périmètre
- Pas d'envoi push serveur (Service Worker Push) → on reste sur `Notification API` locale déclenchée par les Realtime channels déjà en place. Sinon dis-le-moi, ça change la stack.
