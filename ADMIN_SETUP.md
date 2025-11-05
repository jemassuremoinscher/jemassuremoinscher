# Dashboard Administrateur - Guide d'utilisation

## 🎯 Vue d'ensemble

Le dashboard administrateur vous permet de gérer toutes les demandes de devis et de rappel en temps réel, avec des statistiques détaillées et des graphiques interactifs.

## 🔐 Création du compte administrateur

### 1. Première connexion

1. Accédez à `/auth` ou cliquez sur "Dashboard Admin" dans le header
2. Créez un compte avec votre email et mot de passe
3. Un compte sera créé mais **ne sera pas encore administrateur**

### 2. Attribution du rôle admin

Pour donner les droits administrateur à un utilisateur, vous devez exécuter cette commande SQL dans votre backend :

```sql
-- Remplacez 'user_id_here' par l'ID réel de l'utilisateur
-- Vous pouvez trouver l'ID dans la table auth.users

INSERT INTO public.user_roles (user_id, role)
VALUES ('user_id_here', 'admin');
```

**Pour obtenir l'ID utilisateur :**

1. Ouvrez le backend Lovable Cloud
2. Allez dans l'onglet "Table Editor"
3. Sélectionnez la table `auth.users`
4. Trouvez votre email et copiez l'`id` UUID

**Alternative - Script d'attribution automatique :**

Vous pouvez également donner les droits admin au premier utilisateur inscrit :

```sql
-- Donner admin au premier utilisateur inscrit
INSERT INTO public.user_roles (user_id, role)
SELECT id, 'admin'::public.app_role
FROM auth.users
ORDER BY created_at ASC
LIMIT 1
ON CONFLICT (user_id, role) DO NOTHING;
```

## 📊 Fonctionnalités du Dashboard

### 1. Cartes de statistiques (en haut)

- **Demandes de devis** : Nombre total avec tendance
- **Demandes de rappel** : Nombre total avec tendance
- **Devis en attente** : Nécessitent une action
- **Rappels en attente** : Nécessitent une action

### 2. Graphiques interactifs

#### Demandes par type d'assurance
- Graphique en barres montrant la répartition des demandes de devis
- Types : Auto, Moto, Habitation, Santé, Prêt, Animaux

#### Répartition par statut
- Graphique circulaire (pie chart) montrant :
  - Devis en attente
  - Devis contactés
  - Devis convertis
  - Rappels en attente
  - Rappels terminés

### 3. Table des demandes de devis

**Colonnes :**
- Type d'assurance
- Nom du client
- Contact (email + téléphone cliquable)
- Détails (code postal, assureur actuel)
- Date de création
- Statut actuel
- Actions rapides

**Statuts disponibles :**
- 🟠 **En attente** : Nouvelle demande à traiter
- 🔵 **Contacté** : Client a été contacté
- 🟢 **Converti** : Vente réussie
- 🔴 **Rejeté** : Demande refusée/annulée

**Actions rapides :**
- ✓ Marquer comme contacté
- ✗ Marquer comme rejeté

**Filtres :**
- Filtrer par statut via le menu déroulant

### 4. Table des demandes de rappel

**Colonnes :**
- Nom du client
- Contact (email + téléphone cliquable)
- Créneau préféré
- Message (si présent)
- Date de création
- Statut actuel
- Actions rapides

**Statuts disponibles :**
- 🟠 **En attente** : Rappel à faire
- 🔵 **Appelé** : Client a été appelé
- 🟢 **Terminé** : Rappel effectué avec succès
- 🔴 **Annulé** : Rappel annulé

**Actions rapides :**
- ✓ Marquer comme appelé
- ✗ Marquer comme annulé

**Filtres :**
- Filtrer par statut via le menu déroulant

## ⚡ Mise à jour en temps réel

Le dashboard utilise **Supabase Realtime** pour se mettre à jour automatiquement :

- ✅ Nouvelles demandes apparaissent instantanément
- ✅ Changements de statut visibles en temps réel
- ✅ Pas besoin de rafraîchir la page
- ✅ Bouton "Actualiser" disponible pour forcer une mise à jour

## 🔒 Sécurité

### Row Level Security (RLS)

Toutes les tables sont protégées par RLS :

1. **Public** : Peut créer des demandes (INSERT)
2. **Admins uniquement** : Peuvent voir et modifier toutes les données (SELECT, UPDATE, DELETE)

### Vérification des rôles

- Le rôle admin est vérifié côté serveur via une fonction sécurisée
- Pas de manipulation possible depuis le client
- Redirection automatique si non autorisé

## 📱 Interface responsive

Le dashboard est entièrement responsive :
- 📱 Mobile : Tables scrollables, cartes empilées
- 💻 Tablette : Layout à 2 colonnes
- 🖥️ Desktop : Layout complet à 4 colonnes

## 🎨 Actions disponibles

### En-tête du dashboard

- **Actualiser** : Force le rechargement des données
- **Voir le site** : Retourne à la page d'accueil
- **Déconnexion** : Se déconnecter du dashboard

### Sur chaque demande

- **Email** : Cliquer pour envoyer un email
- **Téléphone** : Cliquer pour appeler directement
- **Statut** : Modifier via les boutons d'action

## 🔔 Notifications

Le système utilise **Sonner** pour afficher des toasts :
- ✅ Succès : Confirmation des actions
- ❌ Erreur : Avertissements en cas de problème
- ℹ️ Info : Messages informatifs

## 📈 Conseils d'utilisation

1. **Prioriser les demandes en attente**
   - Filtrer par statut "En attente"
   - Traiter les plus anciennes en premier

2. **Utiliser les filtres**
   - Concentrez-vous sur un statut spécifique
   - Évitez la surcharge d'information

3. **Actions rapides**
   - Un clic pour changer le statut
   - Accès direct email/téléphone

4. **Surveiller les graphiques**
   - Identifiez les tendances
   - Optimisez votre stratégie marketing

## 🛠️ Gestion avancée

### Ajouter d'autres administrateurs

```sql
-- Ajouter un nouvel admin
INSERT INTO public.user_roles (user_id, role)
VALUES ('uuid_de_l_utilisateur', 'admin');
```

### Révoquer les droits admin

```sql
-- Retirer le rôle admin
DELETE FROM public.user_roles
WHERE user_id = 'uuid_de_l_utilisateur'
AND role = 'admin';
```

### Ajouter des modérateurs (accès limité)

```sql
-- Le rôle moderator existe mais n'a pas encore de permissions
INSERT INTO public.user_roles (user_id, role)
VALUES ('uuid_de_l_utilisateur', 'moderator');
```

## 🐛 Résolution de problèmes

### "Accès refusé"
- Vérifiez que le rôle admin est bien attribué dans `user_roles`
- Reconnectez-vous après l'attribution du rôle

### Les données ne s'affichent pas
- Vérifiez votre connexion internet
- Cliquez sur "Actualiser"
- Vérifiez les RLS policies dans le backend

### Erreur lors de la mise à jour de statut
- Vérifiez que vous êtes toujours connecté
- Vérifiez les permissions dans le backend

## 📞 Support

Pour toute question ou problème :
1. Consultez la documentation Lovable Cloud
2. Vérifiez les logs dans le backend
3. Contactez l'équipe de support

---

**Note importante :** Assurez-vous de bien configurer la confirmation automatique des emails dans les paramètres d'authentification du backend pour faciliter les tests en développement.
