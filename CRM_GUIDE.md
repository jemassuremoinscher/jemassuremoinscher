# Guide CRM - Gestion et Scoring des Leads

## 📊 Vue d'ensemble

Le système CRM permet de gérer et scorer automatiquement tous les leads entrants (devis d'assurance et demandes de rappel) avec un algorithme intelligent de qualification.

## 🎯 Système de Scoring Automatique

### Calcul du Score (0-100 points)

Le score est calculé **automatiquement** à chaque nouveau lead selon ces critères :

#### Pour les Devis d'Assurance (insurance_quotes)

| Critère | Points | Description |
|---------|--------|-------------|
| **Base** | +10 | Score de départ |
| **Téléphone fourni** | +20 | Contact direct possible |
| **Email fourni** | +10 | Canal de communication |
| **Source Landing Page** | +30 | Haute intention (vient d'une page dédiée) |
| **Trafic payant (CPC)** | +25 | Source Google/Meta Ads |
| **Trafic organique/direct** | -10 | Intention potentiellement plus faible |
| **Type Vie** | +30 | Produit à forte valeur |
| **Type Prêt** | +25 | Produit à forte valeur |
| **Type Santé** | +20 | Produit à valeur moyenne |
| **Type Auto/RC Pro/MRP** | +15-20 | Produits à valeur moyenne |
| **Autres types** | +10 | Produits standards |
| **Créé < 24h** | +15 | Lead très récent = chaud |

**Score maximum** : 100 points (plafonné)

#### Pour les Demandes de Rappel (contact_callbacks)

| Critère | Points | Description |
|---------|--------|-------------|
| **Base** | +15 | Score de départ plus élevé (forte intention) |
| **Téléphone fourni** | +25 | Critique pour rappel |
| **Email fourni** | +10 | Canal de communication |
| **Message détaillé** | +20 | Montre engagement fort |
| **Créneau préféré** | +15 | Lead organisé et motivé |
| **Créé < 24h** | +20 | Lead très récent |

**Score maximum** : 100 points (plafonné)

### Classification des Leads par Score

| Score | Badge | Priorité | Action recommandée |
|-------|-------|----------|-------------------|
| **80-100** | 🔥 Chaud | URGENTE | Appeler immédiatement |
| **60-79** | ✓ Qualifié | HAUTE | Appeler dans 2h |
| **40-59** | Tiède | MOYENNE | Appeler dans 24h |
| **0-39** | Froid | BASSE | Email puis appel J+3 |

## 🎨 Interface CRM

### 1. Dashboard Principal

#### Statistiques Clés

- **Total Leads** : Nombre total de leads actifs
- **Chauds 🔥** : Leads avec score ≥ 80 (priorité absolue)
- **Qualifiés** : Leads avec score 60-79
- **En attente** : Leads non encore contactés
- **Score Moyen** : Performance globale de la génération de leads

### 2. Filtres Avancés

- **Par Score** :
  - Tous les scores
  - Chauds (80+)
  - Qualifiés (60+)
  - Tièdes (40+)

- **Par Statut** :
  - En attente
  - Contacté
  - Qualifié
  - Converti
  - Rejeté

- **Tri** :
  - Par score (décroissant)
  - Par date (récent d'abord)

### 3. Vue Pipeline (Kanban)

Visualisation par colonnes selon le statut :

```
┌─────────────┬─────────────┬─────────────┬─────────────┬─────────────┐
│ 🔔 En       │ 📞 Contactés│ ✅ Qualifiés│ 🎉 Convertis│ ❌ Rejetés  │
│  attente    │             │             │             │             │
│             │             │             │             │             │
│  [Leads]    │  [Leads]    │  [Leads]    │  [Leads]    │  [Leads]    │
│             │             │             │             │             │
└─────────────┴─────────────┴─────────────┴─────────────┴─────────────┘
```

**Fonctionnalités** :
- Glisser-déposer entre colonnes (à venir)
- Badge de score sur chaque carte
- Type d'assurance visible
- Date de création

### 4. Fiche Lead Détaillée

Cliquer sur un lead ouvre une modal avec :

#### Informations

- **Nom complet**
- **Email** (cliquable pour envoyer)
- **Téléphone** (cliquable pour appeler)
- **Type d'assurance** (si applicable)
- **Source du lead** (landing_page, website, contact_form)
- **Score et badge de qualification**

#### Actions

1. **Changer le statut** :
   - En attente → Contacté
   - Contacté → Qualifié
   - Qualifié → Converti ✅
   - Ou → Rejeté ❌

2. **Ajouter des notes** :
   - Historique des appels
   - Objections / besoins
   - Prochaines actions
   - Sauvegarde automatique avec timestamp

3. **Historique** :
   - Date de dernier contact
   - Prochain rappel planifié (à venir)

## 📈 Workflow Recommandé

### Matin (9h-10h)

1. Ouvrir l'onglet **CRM Pipeline**
2. Filtrer par **Chauds (80+)**
3. Trier par **Score décroissant**
4. Appeler **TOUS** les leads chauds
5. Noter les résultats dans les fiches

### Milieu de journée (11h-16h)

1. Filtrer par **Qualifiés (60+)**
2. Traiter les leads qualifiés restants
3. Mettre à jour les statuts après chaque appel
4. Planifier les suivis

### Fin de journée (17h-18h)

1. Vue **Liste** complète
2. Filtrer par **En attente**
3. Envoyer emails aux leads tièdes
4. Planifier rappels pour lendemain

## 🎯 Bonnes Pratiques

### ✅ À FAIRE

- Appeler les leads chauds dans les 15 minutes
- Mettre à jour le statut après chaque contact
- Ajouter des notes détaillées
- Suivre le pipeline quotidiennement
- Analyser les sources performantes (landing pages)

### ❌ À ÉVITER

- Laisser un lead chaud > 1h sans contact
- Oublier de noter l'issue des appels
- Négliger les leads tièdes (nourrir par email)
- Appeler leads froids sans email préalable

## 📊 KPIs à Suivre

### Taux de Conversion par Score

| Score | Taux de conversion cible |
|-------|-------------------------|
| 80-100 | 40-60% |
| 60-79 | 25-35% |
| 40-59 | 10-20% |
| 0-39 | 5-10% |

### Temps de Réponse

- **Leads chauds** : < 15 minutes
- **Leads qualifiés** : < 2 heures
- **Leads tièdes** : < 24 heures

### Objectifs Mensuels

- **Taux de conversion global** : > 20%
- **Temps moyen de conversion** : < 5 jours
- **Score moyen des leads** : > 60

## 🔧 Administration

### Mise à jour du Score

Le score se recalcule automatiquement :
- À la création du lead
- À chaque modification du lead

### Sources de Leads

Sources automatiquement détectées :
- `landing_page` : Vient d'une landing page spécifique (/landing/*)
- `website` : Formulaire site principal
- `contact_form` : Formulaire de contact/rappel

### Champs CRM (Base de données)

Nouveaux champs ajoutés aux tables :
- `lead_score` : Score calculé (0-100)
- `lead_source` : Source du lead
- `assigned_to` : Assigné à (UUID admin)
- `last_contacted_at` : Dernier contact
- `next_follow_up` : Prochain rappel planifié
- `notes` : Notes internes

## 📞 Scripts d'Appel Recommandés

### Lead Chaud (80+)

```
Bonjour [Nom],

Je suis [Votre nom] de AssusMoinsChere.fr.

Vous avez demandé un devis [Type assurance] il y a quelques minutes.
J'ai comparé 30+ assureurs et j'ai trouvé d'excellentes offres pour vous.

Avez-vous 5 minutes pour en discuter ?
```

### Lead Qualifié (60-79)

```
Bonjour [Nom],

Je vous appelle suite à votre demande de devis [Type assurance].

Je peux vous faire économiser jusqu'à [X]€/an.
Quel est le meilleur moment pour vous présenter 3 offres personnalisées ?
```

### Lead Tiède (40-59)

```
[D'abord envoyer un email, puis appeler 24h après]

Email:
Objet: Votre devis [Type assurance] - Économies jusqu'à X€

Bonjour [Nom],

Suite à votre demande, j'ai préparé une comparaison personnalisée...
[Lien vers offres]

Je vous rappelle demain pour répondre à vos questions.
```

## 🚀 Optimisation Continue

### Analyser les Performances

1. Quel type d'assurance convertit le mieux ?
2. Quelles sources génèrent les meilleurs scores ?
3. Quel timing d'appel est optimal ?
4. Quelles objections reviennent le plus ?

### Améliorer le Scoring

Si vous constatez que :
- Les leads d'une source convertissent mieux → Augmenter points source
- Un type d'assurance convertit moins → Réduire points type
- Les leads >48h ne convertissent jamais → Augmenter bonus récence

**Modifier le scoring** : Contacter le développeur ou modifier directement les fonctions SQL :
- `calculate_lead_score_quotes()`
- `calculate_lead_score_callbacks()`

## 💡 Cas d'Usage

### Priorité Absolue

**Nouveau lead chaud arrive** :
1. Notification sonore (à implémenter)
2. Badge rouge sur onglet CRM
3. Appeler immédiatement
4. Noter résultat
5. Planifier suivi si nécessaire

### Lead qui revient

Si un lead passe de "Rejeté" à nouvelle demande :
- Score augmenté automatiquement (+20 bonus)
- Marquer comme "Haute priorité"
- Nouveau script d'approche

### Lead dormant

Lead > 30 jours sans contact :
- Email de réactivation automatique
- Offre spéciale relance
- Si pas de réponse → Archiver

---

**Version** : 1.0
**Dernière mise à jour** : Janvier 2025
