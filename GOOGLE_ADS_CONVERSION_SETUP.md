# Configuration Google Ads - Suivi des Conversions

## 📋 Vue d'ensemble

Ce document explique comment configurer le suivi des conversions Google Ads pour mesurer précisément le ROI de vos campagnes publicitaires.

## 🎯 Conversions Trackées

### 1. **Demande de Devis** (`quote_request`)
- **Valeur**: 100€
- **Déclenchement**: Soumission formulaire de devis
- **Données collectées**:
  - Type d'assurance
  - Code postal
  - Valeur de la conversion

### 2. **Demande de Rappel** (`callback_request`)
- **Valeur**: 50€
- **Déclenchement**: Soumission formulaire de rappel
- **Données collectées**:
  - Créneau préféré
  - Valeur de la conversion

## 🔧 Configuration Étape par Étape

### Étape 1: Créer les Conversions dans Google Ads

1. **Accéder à Google Ads**
   - Connectez-vous à votre compte Google Ads
   - Allez dans **Outils et paramètres** > **Mesure** > **Conversions**

2. **Créer la conversion "Demande de Devis"**
   - Cliquez sur **+ Nouvelle action de conversion**
   - Sélectionnez **Site Web**
   - Configurez:
     - **Nom**: Demande de Devis - Assurance
     - **Catégorie**: Lead
     - **Valeur**: Utiliser des valeurs différentes (100€ par défaut)
     - **Comptabilisation**: Une seule conversion
     - **Fenêtre de conversion**: 30 jours
     - **Modèle d'attribution**: Au dernier clic
   - Notez le **ID de conversion** (AW-XXXXXXXXX)
   - Notez le **Libellé de conversion** (XXXXXXXXX)

3. **Créer la conversion "Demande de Rappel"**
   - Répétez le processus avec:
     - **Nom**: Demande de Rappel - Assurance
     - **Valeur**: 50€ par défaut
     - Notez les ID et libellés

### Étape 2: Configurer index.html

Remplacez `AW-XXXXXXXXX` dans `index.html` ligne 26:

```html
<!-- Google Ads Conversion Tracking -->
<script async src="https://www.googletagmanager.com/gtag/js?id=AW-VOTRE_ID_CONVERSION"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'AW-VOTRE_ID_CONVERSION');
</script>
```

### Étape 3: Configurer googleAdsTracking.ts

Ouvrez `src/utils/googleAdsTracking.ts` et remplacez les placeholders:

```typescript
const CONVERSION_CONFIGS: Record<ConversionType, ConversionConfig> = {
  quote_request: {
    conversionId: 'AW-VOTRE_ID_CONVERSION',     // Ex: AW-123456789
    conversionLabel: 'VOTRE_LIBELLE_DEVIS',      // Ex: AbC-dEfGhIjK
    value: 100,
    currency: 'EUR',
  },
  callback_request: {
    conversionId: 'AW-VOTRE_ID_CONVERSION',     // Même ID
    conversionLabel: 'VOTRE_LIBELLE_RAPPEL',     // Ex: XyZ-aBcDeFgH
    value: 50,
    currency: 'EUR',
  },
};
```

### Étape 4: Tester le Tracking

1. **Test en Local**
   ```bash
   npm run dev
   ```
   - Ouvrez la console du navigateur
   - Soumettez un formulaire (devis ou rappel)
   - Vérifiez le message: `✅ Google Ads Conversion tracked: quote_request`

2. **Test avec Google Tag Assistant**
   - Installez [Google Tag Assistant](https://tagassistant.google.com/)
   - Rechargez votre page
   - Soumettez un formulaire
   - Vérifiez que la conversion est détectée

3. **Test dans Google Ads**
   - Allez dans **Conversions** > **Résumé**
   - Attendez 24-48h pour voir les premières données
   - Les conversions de test apparaissent avec le tag "Non vérifiée"

### Étape 5: Vérifier les Conversions

Dans Google Ads:
- **Outils** > **Conversions** > **Résumé**
- Vérifiez que les conversions sont enregistrées
- Consultez le rapport de diagnostic pour tout problème

## 📊 Rapports et Analyse

### Dans Google Ads

1. **Vue d'ensemble**
   - Campagnes > Conversions
   - Filtrez par action de conversion (Devis / Rappel)

2. **Métriques clés**
   - Taux de conversion
   - Coût par conversion
   - Valeur de conversion
   - ROI (ROAS)

3. **Optimisation**
   - Identifiez les mots-clés les plus performants
   - Ajustez les enchères en fonction du coût par conversion
   - Testez différents messages publicitaires

### Formules Importantes

```
Coût par Lead = Dépenses / Nombre de conversions
ROI = ((Valeur conversions - Coût) / Coût) × 100
ROAS = Valeur conversions / Coût publicitaire
```

## 🔍 Déduplication

Le système génère automatiquement des **transaction_id** uniques pour éviter les doublons:

```typescript
transaction_id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
```

Cela garantit qu'une même conversion n'est pas comptée plusieurs fois.

## 🎯 Valeurs de Conversion Recommandées

### Selon le Type d'Assurance

```typescript
const INSURANCE_VALUES = {
  auto: 100,      // Commission moyenne: 80-120€
  sante: 150,     // Commission moyenne: 120-180€
  habitation: 80, // Commission moyenne: 60-100€
  pret: 200,      // Commission moyenne: 150-250€
  vie: 300,       // Commission moyenne: 250-350€
  animaux: 60,    // Commission moyenne: 40-80€
  moto: 90,       // Commission moyenne: 70-110€
};
```

Pour affiner les valeurs par type d'assurance, modifiez `trackGoogleAdsConversionWithParams()`:

```typescript
// Dans QuoteRequestForm.tsx
const insuranceValues = {
  auto: 100, sante: 150, habitation: 80,
  pret: 200, vie: 300, animaux: 60, moto: 90
};

trackGoogleAdsConversionWithParams('quote_request', {
  value: insuranceValues[data.insuranceType] || 100,
  insuranceType: data.insuranceType,
  postalCode: data.postalCode,
});
```

## ⚠️ Résolution des Problèmes

### Conversions Non Détectées

1. **Vérifier la configuration**
   ```javascript
   // Dans la console du navigateur
   window.gtag // Doit être défini
   ```

2. **Vérifier les IDs**
   - Les ID de conversion doivent correspondre exactement
   - Format: `AW-XXXXXXXXX` (avec le tiret)

3. **Vérifier les bloqueurs de pub**
   - Désactivez AdBlock pour les tests
   - Testez en navigation privée

4. **Vérifier le consentement cookies**
   - Les conversions nécessitent le consentement
   - Acceptez les cookies lors du test

### Conversions Dupliquées

- Vérifiez que vous n'avez pas deux fois le pixel de conversion
- Assurez-vous que `transaction_id` est bien généré

### Valeurs Incorrectes

- Vérifiez que les valeurs dans `googleAdsTracking.ts` correspondent à vos objectifs
- Ajustez selon vos commissions réelles

## 📈 Optimisation Avancée

### 1. **Remarketing**
Créez des audiences de remarketing basées sur les conversions:
- Utilisateurs ayant demandé un devis (mais pas souscrit)
- Utilisateurs ayant demandé un rappel (mais pas converti)

### 2. **Enchères Intelligentes**
Activez les stratégies d'enchères basées sur les conversions:
- Maximiser les conversions
- CPA cible
- ROAS cible

### 3. **Tests A/B**
Testez différents éléments:
- Messages publicitaires
- Pages de destination
- Formulaires (nombre de champs, ordre, etc.)

### 4. **Segments de Conversion**
Créez des segments selon:
- Type d'assurance
- Valeur du lead
- Source de trafic (organique, payant, etc.)

## 🔐 Confidentialité et RGPD

### Conformité

1. **Consentement**
   - Banner cookies implémenté
   - Les conversions ne sont trackées qu'avec consentement

2. **Anonymisation**
   - Les données personnelles ne sont pas envoyées à Google Ads
   - Seuls les codes postaux et types d'assurance sont transmis

3. **Politique de Confidentialité**
   - Mentionnez l'utilisation de Google Ads
   - Expliquez le suivi des conversions
   - Fournissez un lien pour opt-out

## 📞 Support

### Ressources Google Ads
- [Centre d'aide - Suivi des conversions](https://support.google.com/google-ads/answer/6095821)
- [Guide - Optimisation des conversions](https://support.google.com/google-ads/answer/2454000)

### Debug Local
```typescript
// Dans la console du navigateur
import { logGoogleAdsStatus } from '@/utils/googleAdsTracking';
logGoogleAdsStatus();
```

## 🎓 Bonnes Pratiques

1. **Définissez des objectifs clairs**
   - CPA cible: 30-50€ pour un lead de qualité
   - Taux de conversion: > 3%
   - ROI: > 200%

2. **Suivez régulièrement**
   - Consultez les rapports quotidiennement
   - Ajustez les enchères hebdomadairement
   - Analysez les performances mensuellement

3. **Testez constamment**
   - Nouveaux mots-clés
   - Nouvelles audiences
   - Nouveaux messages

4. **Optimisez la qualité**
   - Améliorez le Quality Score
   - Optimisez les landing pages
   - Réduisez le temps de chargement

---

**Date de création**: 2025-11-07  
**Dernière mise à jour**: 2025-11-07  
**Version**: 1.0.0
