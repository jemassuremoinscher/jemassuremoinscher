# Landing Page Google Ads - Guide d'Utilisation

## 🎯 Vue d'ensemble

La landing page `/landing/assurance` est optimisée pour maximiser les conversions depuis vos campagnes Google Ads avec :
- ✅ Formulaire ultra-court (4 champs)
- ✅ Preuve sociale renforcée
- ✅ Tracking automatique des conversions
- ✅ Design sans distraction
- ✅ Mobile-first responsive

## 📍 URLs et Tracking

### URL de base
```
https://votre-domaine.fr/landing/assurance
```

### URLs avec tracking UTM (recommandé)
```
https://votre-domaine.fr/landing/assurance?utm_source=google&utm_medium=cpc&utm_campaign=assurance_auto_2025
```

### Exemples par campagne
```
# Campagne Auto
/landing/assurance?utm_source=google&utm_medium=cpc&utm_campaign=auto_search&utm_term=assurance+auto+pas+cher

# Campagne Santé
/landing/assurance?utm_source=google&utm_medium=cpc&utm_campaign=sante_display&utm_content=banner_1

# Campagne Habitation
/landing/assurance?utm_source=google&utm_medium=cpc&utm_campaign=habitation_shopping
```

## 🎨 Éléments d'optimisation

### 1. Barre d'urgence (Top Bar)
- **Offre limitée** avec countdown psychologique
- Couleur accent pour attirer l'attention
- Changez le texte selon vos promotions

### 2. Preuves sociales visibles
- ✅ 15 000+ clients satisfaits
- ✅ Note 4.8/5 sur 2 847 avis
- ✅ Économie moyenne 947€
- ✅ Temps de devis 2 min

### 3. Témoignages clients
- 3 témoignages authentiques
- Prénom + ville pour crédibilité
- Notes 5 étoiles
- Facilement modifiables dans le code

### 4. Badges de confiance
- Données sécurisées SSL
- Certifié RGPD
- Service Premium

### 5. Indicateur d'activité en temps réel
- "12 personnes comparent en ce moment"
- Animation pulse pour crédibilité
- Encourage l'action immédiate

## 📊 Tracking des Conversions

### Google Analytics 4 (déjà configuré)
Chaque soumission de formulaire déclenche :
```javascript
trackEvent('ads_form_submit', {
  category: 'lead_generation',
  label: 'google_ads_landing',
  insurance_type: 'auto',
  value: 150
});
```

### Google Ads Conversion Tracking
```javascript
trackConversion('ads_lead_form', 150);
```

**Configuration Google Ads :**
1. Google Ads → Outils → Conversions
2. Créer une nouvelle conversion
3. Type : "Envoi de formulaire pour prospects"
4. Valeur : 150€ (ajustez selon votre LTV)
5. Nom : "Lead Landing Page"

### UTM Parameters tracking
Tous les paramètres UTM sont automatiquement capturés et stockés :
- `utm_source`
- `utm_medium`
- `utm_campaign`
- Stockés dans `quote_data.source`

## 🎯 Configuration Google Ads

### 1. Structure de campagne recommandée

**Campagne Search (Recherche)**
```
Groupe d'annonces : Assurance Auto Paris
- Mots-clés :
  * [assurance auto paris] (exact)
  * "assurance auto pas cher" (expression)
  * +assurance +auto +devis (large modifié)
  
- Extensions d'annonce :
  * Liens annexes : Devis gratuit, Économisez 30%, Rappel 2h
  * Accroches : Sans engagement, Gratuit, Expert dédié
  * Extraits structurés : Types (Auto, Moto, Habitation, Santé)
```

**Exemple d'annonce optimisée :**
```
Titre 1 : Assurance Auto -30% | 2025
Titre 2 : Devis Gratuit en 2 Min
Titre 3 : Économisez Jusqu'à 947€/an
Description 1 : Comparez 30+ assureurs. Expert dédié vous rappelle sous 2h. Sans engagement.
Description 2 : ✓ Gratuit ✓ Rapide ✓ 15 000 clients satisfaits. Offre limitée -30% !
URL finale : https://votre-domaine.fr/landing/assurance?utm_source=google&utm_medium=cpc&utm_campaign=auto_search
```

### 2. Audiences de remarketing
Créez ces audiences dans GA4 :
- Visiteurs qui n'ont pas converti (remarketing)
- Visiteurs ayant passé >30s sur la page
- Visiteurs ayant scrollé >50%

## 📱 Optimisation Mobile

La page est 100% responsive avec :
- Formulaire adapté tactile
- Boutons de taille suffisante (min 44px)
- Texte lisible sans zoom
- Chargement rapide (<3s)

## 🧪 A/B Testing recommandé

### Tests prioritaires

**Test #1 : CTA Button**
- Version A : "Être rappelé gratuitement"
- Version B : "Obtenir mon devis gratuit"
- Version C : "Comparer maintenant"

**Test #2 : Headline**
- Version A : "Économisez jusqu'à 947€ par an"
- Version B : "Payez jusqu'à 30% moins cher"
- Version C : "Trouvez l'assurance la moins chère en 2 min"

**Test #3 : Urgence**
- Version A : "Plus que 7 places disponibles"
- Version B : "Offre expire dans 24h"
- Version C : Pas de barre d'urgence

**Test #4 : Formulaire**
- Version A : 4 champs (actuel)
- Version B : 3 champs (sans type d'assurance)
- Version C : 2 étapes (type puis coordonnées)

### Comment implémenter l'A/B testing

1. **Via Google Optimize** (gratuit)
2. **Via paramètres URL** :
```
/landing/assurance?variant=b
```

3. **Duplication de page** :
```
/landing/assurance-v2
/landing/assurance-short
```

## 📈 KPIs à surveiller

### Dans Google Ads
- **Taux de conversion** : Objectif >5%
- **Coût par lead** : Objectif <30€
- **Quality Score** : Objectif 7-10
- **Taux de clics (CTR)** : Objectif >3%

### Dans Google Analytics 4
- **Taux de rebond** : Objectif <40%
- **Temps sur page** : Objectif >2 min
- **Scroll depth** : Objectif >60% scrollent jusqu'au formulaire
- **Form starts** : % qui commencent à remplir
- **Form abandonment** : % qui abandonnent

## 🎨 Personnalisation facile

### Changer les couleurs d'urgence
```tsx
// Dans src/pages/LandingAds.tsx ligne 150
<div className="bg-accent text-accent-foreground...">
// Remplacez par :
<div className="bg-red-600 text-white...">
```

### Modifier les stats
```tsx
// Ligne 200
<div className="font-bold text-2xl">15 000+</div>
// Changez selon vos vraies stats
```

### Ajouter/retirer des témoignages
```tsx
// Ligne 280 - Array de témoignages
{
  name: 'Nouveau Client',
  location: 'Toulouse',
  text: 'Mon témoignage ici...',
  rating: 5,
}
```

## 🚀 Lancement rapide

### Checklist avant lancement

1. **Configuration Google Ads**
   - [ ] Campagne créée
   - [ ] Conversions configurées
   - [ ] Extensions d'annonces ajoutées
   - [ ] Budget défini

2. **Tracking**
   - [ ] Google Analytics 4 installé ✅ (déjà fait)
   - [ ] Conversion tracking testé
   - [ ] UTM parameters fonctionnels

3. **Page**
   - [ ] Test sur mobile
   - [ ] Test formulaire soumission
   - [ ] Vérifier email/téléphone de contact
   - [ ] Vitesse de chargement <3s

4. **Suivi**
   - [ ] Dashboard Google Ads configuré
   - [ ] Alertes conversions activées
   - [ ] Rapport hebdomadaire programmé

## 💰 Estimation Budget & ROI

### Exemple Assurance Auto

**Budget mensuel** : 1 000€
- CPC moyen : 2€
- Clics mensuels : 500
- Taux de conversion : 5%
- Leads générés : 25 leads
- Coût par lead : 40€
- Taux de closing : 20%
- Clients acquis : 5
- CA moyen/client : 600€
- CA total : 3 000€
- **ROI : 200%**

### Optimisation continue

**Mois 1-2** : Phase de test
- Tester différentes audiences
- A/B test headlines et CTAs
- Affiner mots-clés

**Mois 3-6** : Optimisation
- Concentrer budget sur best performers
- Augmenter enchères sur conversions
- Remarketing actif

**Mois 6+** : Scale
- Dupliquer campagnes gagnantes
- Nouvelles audiences similaires
- Augmenter budget

## 🔧 Maintenance

### Hebdomadaire
- Vérifier taux de conversion
- Ajuster enchères si CPL trop élevé
- Ajouter mots-clés négatifs

### Mensuelle
- Analyser performances par device
- Comparer avec objectifs
- Tester nouvelles variantes

### Trimestrielle
- Refonte si taux conversion <3%
- Nouveaux témoignages clients
- Mise à jour statistiques

## 📞 Support

Pour toute question sur l'implémentation :
1. Consultez les analytics dans le dashboard admin
2. Vérifiez les logs de conversion dans GA4
3. Testez le formulaire en environnement de développement

---

**Prêt à lancer ?** Configurez d'abord votre campagne Google Ads puis dirigez le trafic vers `/landing/assurance` avec les bons paramètres UTM !
