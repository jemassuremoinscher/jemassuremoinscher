# 🔄 Configuration de la Synchronisation Google Ads

## Vue d'ensemble

Ce guide explique comment configurer la synchronisation automatique des données de campagnes Google Ads vers votre base de données.

## ✅ Prérequis

Les credentials suivants doivent être configurés dans les secrets (déjà fait) :
- `GOOGLE_ADS_CLIENT_ID`
- `GOOGLE_ADS_CLIENT_SECRET`
- `GOOGLE_ADS_REFRESH_TOKEN`
- `GOOGLE_ADS_DEVELOPER_TOKEN`
- `GOOGLE_ADS_CUSTOMER_ID`

## 🔐 Obtenir les Credentials Google Ads

### 1. Developer Token
1. Connectez-vous au [Google Ads API Center](https://ads.google.com/aw/apicenter)
2. Cliquez sur "Get your developer token"
3. Remplissez le formulaire avec les détails de votre application
4. Copiez le token généré

### 2. OAuth2 Credentials (Client ID & Secret)
1. Allez sur [Google Cloud Console](https://console.cloud.google.com/)
2. Créez un nouveau projet ou sélectionnez un existant
3. Activez l'API Google Ads :
   - Menu → APIs & Services → Library
   - Cherchez "Google Ads API"
   - Cliquez sur "Enable"
4. Créez des credentials OAuth 2.0 :
   - Menu → APIs & Services → Credentials
   - Cliquez sur "Create Credentials" → "OAuth client ID"
   - Type : "Web application"
   - Ajoutez `http://localhost` dans les URIs de redirection autorisés
   - Copiez le Client ID et Client Secret

### 3. Refresh Token
1. Utilisez l'outil OAuth Playground de Google :
   ```bash
   https://developers.google.com/oauthplayground/
   ```
2. Configurez avec vos credentials :
   - Cliquez sur l'icône ⚙️ en haut à droite
   - Cochez "Use your own OAuth credentials"
   - Entrez votre Client ID et Client Secret
3. Sélectionnez les scopes :
   - Cherchez "Google Ads API"
   - Sélectionnez `https://www.googleapis.com/auth/adwords`
4. Cliquez sur "Authorize APIs"
5. Cliquez sur "Exchange authorization code for tokens"
6. Copiez le Refresh Token

### 4. Customer ID
1. Connectez-vous à votre compte Google Ads
2. Le Customer ID est visible en haut à droite (format : XXX-XXX-XXXX)
3. Supprimez les tirets pour obtenir le format : XXXXXXXXXX

## 🚀 Configuration de la Synchronisation Automatique

### Synchronisation Manuelle

Vous pouvez tester la synchronisation manuellement via l'URL :
```
https://ybqxpngkbgosobtetxac.supabase.co/functions/v1/sync-google-ads
```

### Synchronisation Automatique (Cron Job)

Pour synchroniser automatiquement toutes les heures, exécutez ce SQL dans votre base de données :

```sql
-- Activer les extensions nécessaires
CREATE EXTENSION IF NOT EXISTS pg_cron;
CREATE EXTENSION IF NOT EXISTS pg_net;

-- Créer le cron job (synchronisation toutes les heures)
SELECT cron.schedule(
  'sync-google-ads-hourly',
  '0 * * * *', -- Toutes les heures à 0 minutes
  $$
  SELECT
    net.http_post(
      url:='https://ybqxpngkbgosobtetxac.supabase.co/functions/v1/sync-google-ads',
      headers:='{"Content-Type": "application/json"}'::jsonb,
      body:='{}'::jsonb
    ) as request_id;
  $$
);
```

### Autres Fréquences de Synchronisation

**Toutes les 6 heures :**
```sql
SELECT cron.schedule(
  'sync-google-ads-6h',
  '0 */6 * * *',
  $$ /* même corps que ci-dessus */ $$
);
```

**Tous les jours à 2h du matin :**
```sql
SELECT cron.schedule(
  'sync-google-ads-daily',
  '0 2 * * *',
  $$ /* même corps que ci-dessus */ $$
);
```

**Toutes les 15 minutes :**
```sql
SELECT cron.schedule(
  'sync-google-ads-15min',
  '*/15 * * * *',
  $$ /* même corps que ci-dessus */ $$
);
```

## 📊 Données Synchronisées

La fonction récupère et synchronise les métriques suivantes pour les 30 derniers jours :

- **Informations de campagne :**
  - ID et nom de la campagne
  - Statut (active, paused, ended)
  - Budget quotidien

- **Métriques de performance :**
  - Dépenses totales (€)
  - Nombre de clics
  - Nombre d'impressions
  - Nombre de conversions
  - Valeur des conversions (€)

## 🔍 Vérifier la Synchronisation

### 1. Vérifier les Jobs Cron
```sql
SELECT * FROM cron.job;
```

### 2. Voir l'Historique des Exécutions
```sql
SELECT * FROM cron.job_run_details 
WHERE jobid = (SELECT jobid FROM cron.job WHERE jobname = 'sync-google-ads-hourly')
ORDER BY start_time DESC 
LIMIT 10;
```

### 3. Vérifier les Données Synchronisées
```sql
SELECT 
  campaign_name,
  status,
  total_spend,
  total_conversions,
  updated_at
FROM google_ads_campaigns
ORDER BY updated_at DESC;
```

## 🐛 Dépannage

### Erreur : "Missing Google Ads credentials"
→ Vérifiez que tous les secrets sont bien configurés

### Erreur : "Invalid grant" lors de l'OAuth
→ Le refresh token a expiré, générez-en un nouveau

### Erreur : "Developer token not approved"
→ Votre developer token doit être approuvé par Google (peut prendre 24-48h)

### Aucune donnée synchronisée
→ Vérifiez que votre compte Google Ads a des campagnes actives dans les 30 derniers jours

### Erreur : "Customer not found"
→ Vérifiez le format du Customer ID (sans tirets)

## 📈 Intégration avec le Dashboard

Les données synchronisées sont automatiquement affichées dans le dashboard analytics à l'URL `/admin` avec :
- Graphiques de performance en temps réel
- Métriques clés (ROI, CPL, taux de conversion)
- Tableaux détaillés par campagne

## 🔐 Sécurité

- ✅ Les credentials sont stockés de façon sécurisée dans les secrets
- ✅ L'edge function ne nécessite pas d'authentification JWT (cron job)
- ✅ Toutes les communications utilisent HTTPS
- ✅ Les tokens d'accès sont régénérés à chaque appel

## 📝 Notes Importantes

1. **Limites de l'API Google Ads :**
   - Quota quotidien : 15,000 opérations
   - Cette synchronisation consomme environ 1 opération par campagne

2. **Performance :**
   - La synchronisation prend environ 2-5 secondes pour 10 campagnes
   - Évitez de synchroniser plus souvent que nécessaire

3. **Données Historiques :**
   - La fonction récupère les métriques des 30 derniers jours
   - Pour récupérer plus d'historique, modifiez le query GAQL dans l'edge function

## 🆘 Support

En cas de problème :
1. Vérifiez les logs de l'edge function dans le dashboard Cloud
2. Consultez la documentation de l'API Google Ads
3. Vérifiez que votre compte Google Ads a les permissions nécessaires
