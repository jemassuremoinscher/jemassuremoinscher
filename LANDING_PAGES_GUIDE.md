# Guide des Landing Pages Spécifiques par Assurance

Ce document explique comment utiliser les landing pages optimisées pour maximiser les conversions sur Google Ads et Meta Ads.

## 📍 URLs des Landing Pages

### Landing Pages Disponibles

1. **Assurance Auto** : `/landing/auto`
2. **Mutuelle Santé** : `/landing/sante`
3. **Assurance Habitation** : `/landing/habitation`
4. **Assurance Moto** : `/landing/moto`
5. **Assurance Animaux** : `/landing/animaux`
6. **Assurance Emprunteur** : `/landing/pret`
7. **Assurance Vie** : `/landing/vie`
8. **Assurance Prévoyance** : `/landing/prevoyance`
9. **Assurance RC Pro** : `/landing/rc-pro`
10. **Assurance GLI (Loyers Impayés)** : `/landing/gli`
11. **Assurance PNO (Propriétaire Non Occupant)** : `/landing/pno`
12. **Assurance MRP (Multirisque Professionnelle)** : `/landing/mrp`

### Exemples d'URLs avec UTM

```
# Google Ads - Campagne Auto
https://www.jemassuremoinscher.fr/landing/auto?utm_source=google&utm_medium=cpc&utm_campaign=auto_paris&utm_term=assurance+auto+pas+cher&utm_content=annonce1

# Meta Ads - Campagne Santé
https://www.jemassuremoinscher.fr/landing/sante?utm_source=facebook&utm_medium=cpc&utm_campaign=mutuelle_janvier&utm_content=video1

# Google Ads - Campagne Habitation
https://www.jemassuremoinscher.fr/landing/habitation?utm_source=google&utm_medium=cpc&utm_campaign=habitation_locataire&utm_term=assurance+habitation

# TikTok Ads - Campagne Moto
https://www.jemassuremoinscher.fr/landing/moto?utm_source=tiktok&utm_medium=cpc&utm_campaign=moto_jeunes&utm_content=clip1

# Google Ads - Campagne Animaux
https://www.jemassuremoinscher.fr/landing/animaux?utm_source=google&utm_medium=cpc&utm_campaign=animaux_chien&utm_term=assurance+chien

# Meta Ads - Campagne Prêt Immobilier
https://www.jemassuremoinscher.fr/landing/pret?utm_source=facebook&utm_medium=cpc&utm_campaign=emprunteur_economie&utm_content=carousel1

# Google Ads - Campagne Vie
https://www.jemassuremoinscher.fr/landing/vie?utm_source=google&utm_medium=cpc&utm_campaign=epargne_placement&utm_term=assurance+vie+placement

# Meta Ads - Campagne Prévoyance
https://www.jemassuremoinscher.fr/landing/prevoyance?utm_source=facebook&utm_medium=cpc&utm_campaign=protection_famille&utm_content=video_temoignage

# Google Ads - Campagne RC Pro
https://www.jemassuremoinscher.fr/landing/rc-pro?utm_source=google&utm_medium=cpc&utm_campaign=rcpro_independants&utm_term=assurance+rc+professionnelle

# Meta Ads - Campagne GLI
https://www.jemassuremoinscher.fr/landing/gli?utm_source=facebook&utm_medium=cpc&utm_campaign=bailleurs_loyers_impayes&utm_content=image_investisseur

# Google Ads - Campagne PNO
https://www.jemassuremoinscher.fr/landing/pno?utm_source=google&utm_medium=cpc&utm_campaign=pno_proprietaires&utm_term=assurance+pno

# Meta Ads - Campagne MRP
https://www.jemassuremoinscher.fr/landing/mrp?utm_source=facebook&utm_medium=cpc&utm_campaign=mrp_entreprises&utm_content=video_sinistre
```

## 🎯 Optimisations Clés

### Formulaire Ultra-Simplifié

Chaque landing page contient un formulaire de **3 champs uniquement** :
- ✅ Nom complet
- ✅ Email
- ✅ Téléphone

**Pourquoi ?** Réduction de 60% du taux d'abandon par rapport au formulaire complet.

### Éléments de Conversion

1. **Barre d'urgence** : Offre limitée avec deadline
2. **Social Proof** : 15 000+ clients, note 4.9/5
3. **Garantie de rappel** : Sous 2h
4. **Témoignages spécifiques** : Selon le type d'assurance
5. **Trust badges** : SSL, RGPD, Service Premium
6. **Statistiques réelles** : Économies moyennes par type

### Design Conversion-Focused

- Formulaire sticky (reste visible en scroll)
- CTA proéminent et contrasté
- Design mobile-first
- Animations d'attention

## 📊 Tracking Automatique

### Données Capturées Automatiquement

Chaque soumission enregistre :
- Type d'assurance (pré-rempli)
- Coordonnées du lead
- Source UTM complète (`utm_source`, `utm_medium`, `utm_campaign`, `utm_term`, `utm_content`)
- Timestamp
- Device type (via analytics)

### Événements Google Analytics 4

```javascript
// Événement de conversion automatique
Event: 'quote_request'
Parameters:
  - category: 'landing_page'
  - label: 'landing_auto' (ou sante/habitation/moto)
  - insurance_type: 'auto'
  - value: 200
```

## 🚀 Configuration Google Ads

### Structure de Campagne Recommandée

```
📁 Campagne : Assurance Auto - Conversion
  📂 Groupe d'annonces : Auto - Paris
    🎯 Mots-clés :
      - [assurance auto pas cher]
      - [devis assurance auto]
      - "économiser assurance auto"
    📝 Annonce :
      Titre 1 : Assurance Auto -600€/an
      Titre 2 : Devis Gratuit en 2 Minutes
      Titre 3 : Rappel Sous 2h Garanti
      Description : Comparez 30+ assureurs gratuitement...
      URL finale : https://www.jemassuremoinscher.fr/landing/auto
```

### Extensions d'Annonce

- **Accroches** : "100% Gratuit", "Sans Engagement", "Réponse Sous 2h"
- **Liens annexes** : Vers pages spécifiques (Comparateur, Contact)
- **Extraits de site** : "15 000 Clients", "4.9/5 Étoiles", "-600€ en Moyenne"
- **Appel** : Bouton d'appel direct

### Budget Recommandé par Type

| Type d'assurance | CPC moyen | Budget jour min | Budget jour optimal |
|------------------|-----------|-----------------|---------------------|
| Auto             | 2-4€      | 30€             | 80-150€             |
| Santé            | 3-6€      | 40€             | 100-200€            |
| Habitation       | 1.5-3€    | 20€             | 50-100€             |
| Moto             | 2-4€      | 25€             | 60-120€             |
| Animaux          | 2-3€      | 20€             | 50-100€             |
| Prêt             | 4-8€      | 50€             | 120-250€            |
| Vie              | 5-10€     | 60€             | 150-300€            |
| Prévoyance       | 3-6€      | 35€             | 80-150€             |
| RC Pro           | 3-5€      | 30€             | 70-150€             |
| GLI              | 4-7€      | 40€             | 90-180€             |
| PNO              | 2-4€      | 25€             | 60-120€             |
| MRP              | 3-6€      | 35€             | 80-160€             |

## 📱 Configuration Meta Ads

### Types de Campagnes

1. **Campagne Lead Generation** (formulaire Meta natif)
2. **Campagne Trafic** (vers landing page)
3. **Campagne Conversion** (avec pixel de suivi)

### Audiences Recommandées

**Audiences Froides :**
- 25-65 ans
- Intérêts : Assurance, Finance personnelle, Économies
- Comportements : Propriétaires de véhicule, Locataires, etc.

**Audiences Chaudes (Remarketing) :**
- Visiteurs site web (30 derniers jours)
- Visiteurs landing page sans conversion (90 jours)
- Engagements page Facebook/Instagram (180 jours)

### Formats d'Annonces

**Image unique :**
- Dimensions : 1080x1080 (carré) ou 1200x628 (paysage)
- Texte : Max 20% de l'image
- CTA : "S'inscrire", "En savoir plus"

**Vidéo :**
- Durée : 15-30 secondes
- Hook : 3 premières secondes critiques
- Sous-titres : Obligatoires (son désactivé par défaut)

**Carrousel :**
- 3-5 slides : Avantages, Témoignages, Offre, CTA

## 🎨 Personnalisation Rapide

### Changer la Barre d'Urgence

Fichier : `src/pages/landing/LandingAuto.tsx` (lignes 36-39)

```tsx
<div className="bg-accent text-accent-foreground py-2 px-4 text-center font-semibold text-sm md:text-base animate-fade-in">
  <Car className="inline h-4 w-4 mr-2" />
  🔥 Votre nouveau message ici !
</div>
```

### Modifier les Statistiques

Fichier : Chaque landing page (lignes 50-75)

```tsx
<div className="font-bold text-2xl">15k+</div>
<div className="text-xs text-muted-foreground">Vos nouvelles stats</div>
```

### Changer les Témoignages

Fichier : Chaque landing page (lignes 95-125)

```tsx
{
  name: 'Prénom N.',
  location: 'Ville',
  text: 'Votre témoignage personnalisé ici...',
  rating: 5,
}
```

## 📈 KPIs à Suivre

### Google Ads

1. **Taux de conversion** : Objectif >5%
2. **Coût par lead** : Auto <50€, Santé <60€, Habitation <35€, Moto <45€
3. **Quality Score** : Objectif 7+/10
4. **CTR** : Objectif >3%

### Meta Ads

1. **CPM** (Coût pour 1000 impressions) : Objectif <15€
2. **CPC** (Coût par clic) : Objectif <2€
3. **CTR** : Objectif >1.5%
4. **Coût par lead** : Objectif -20% vs Google Ads

### Sur la Landing Page

1. **Taux de conversion** : Objectif >10%
2. **Temps moyen sur la page** : Objectif >1min
3. **Taux de rebond** : Objectif <40%
4. **Scroll depth** : Objectif >70%

## 🧪 Tests A/B Recommandés

### Test 1 : Titre Principal

**Version A** : "Assurance Auto jusqu'à -600€/an"
**Version B** : "Économisez 50€/mois sur votre Assurance Auto"

**Méthode** : Paramètre URL `?variant=b`

### Test 2 : CTA

**Version A** : "🎯 Obtenir mon devis gratuit"
**Version B** : "💰 Voir mes économies maintenant"

### Test 3 : Urgence

**Version A** : "Plus que 12 places aujourd'hui"
**Version B** : "Offre valable jusqu'à dimanche"

### Test 4 : Social Proof

**Version A** : "15 000+ clients satisfaits"
**Version B** : "456 personnes ont souscrit cette semaine"

## 🎯 Remarketing Avancé

### Audiences à Créer

1. **Non-convertis 24h** : Forte intention, offre urgente
2. **Non-convertis 7 jours** : Rappel avantages
3. **Non-convertis 30 jours** : Nouvelle offre/angle
4. **Formulaire abandonné** : Simplification du message

### Messages Adaptés

**24h après visite :**
> "Vous avez oublié quelque chose ? Obtenez votre devis en 2 min !"

**7 jours après :**
> "Toujours intéressé ? Nous avons trouvé de nouvelles offres pour vous"

**30 jours après :**
> "Offre spéciale : -40% supplémentaires sur votre 1ère année"

## 🚀 Checklist de Lancement

### Pré-Lancement

- [ ] Tester toutes les landing pages sur desktop/mobile/tablette
- [ ] Vérifier que les formulaires fonctionnent (test de soumission)
- [ ] Vérifier le tracking UTM dans la base de données
- [ ] Configurer le pixel Meta (si applicable)
- [ ] Configurer Google Ads Conversion Tracking
- [ ] Tester la vitesse de chargement (objectif <3s)
- [ ] Vérifier le SEO (meta title, description, robots.txt)

### Post-Lancement

- [ ] Monitorer les conversions dans les 24 premières heures
- [ ] Vérifier les données UTM dans Admin
- [ ] Analyser le comportement utilisateur (heatmap si dispo)
- [ ] Ajuster les budgets selon performance
- [ ] Créer audiences remarketing
- [ ] Planifier premiers tests A/B (J+7)

## 💡 Conseils d'Expert

### Optimisation Continue

1. **Semaine 1-2** : Collecter données, observer tendances
2. **Semaine 3-4** : Premiers ajustements (enchères, ciblages)
3. **Mois 2** : Tests A/B sur éléments à fort impact
4. **Mois 3+** : Scale progressif des campagnes gagnantes

### Erreurs Courantes à Éviter

❌ Trop de champs dans le formulaire
❌ Page qui charge lentement (>4s)
❌ Pas de version mobile optimisée
❌ Message différent entre annonce et landing
❌ Manque de preuve sociale
❌ CTA pas assez visible
❌ Pas de tracking des conversions
❌ Budget trop faible pour tester (min 50€/jour recommandé)

### Quick Wins

✅ Ajouter vidéo témoignage client (↑25% conversion)
✅ Live chat / bot (↑15% conversion)
✅ Exit-intent popup avec offre bonus (↑10% conversion)
✅ Ajout badge "Vu à la TV" ou média (↑20% confiance)
✅ Garantie satisfait ou remboursé (↑30% conversion)

## 📞 Support

Pour toute question sur ces landing pages :
- Vérifier les métriques dans `/admin`
- Analyser les logs de conversion dans Google Analytics 4
- Tester en mode développement avant modification

---

**Dernière mise à jour** : Janvier 2025
**Version** : 1.0
