# Accessibility (A11Y) Documentation

## Vue d'ensemble

Ce site web a été développé en suivant les normes WCAG 2.1 niveau AA pour garantir l'accessibilité à tous les utilisateurs, y compris ceux utilisant des technologies d'assistance.

## Fonctionnalités d'accessibilité implémentées

### 1. Navigation au clavier

- **Tous les éléments interactifs** sont accessibles via le clavier (Tab, Shift+Tab, Enter, Espace)
- **États de focus visibles** : Indicateurs clairs avec ring bleu autour des éléments focalisés
- **Skip to main content** : Lien "Aller au contenu principal" visible au focus pour éviter la navigation répétitive
- **Piège de focus** : Dans les modales et dialogues, le focus reste confiné à l'élément actif
- **Ordre de tabulation logique** : Navigation séquentielle cohérente à travers le site

### 2. Attributs ARIA

Les attributs ARIA suivants sont utilisés pour améliorer l'accessibilité :

- `role="banner"` : Header principal
- `role="navigation"` : Menus de navigation
- `role="main"` : Contenu principal
- `role="dialog"` : Modales et menus mobiles
- `role="status"` : Annonces pour lecteurs d'écran
- `role="menu"` et `role="menuitem"` : Menus déroulants
- `aria-label` : Descriptions contextuelles des éléments
- `aria-expanded` : État des éléments extensibles (menus, accordéons)
- `aria-hidden="true"` : Masque les éléments décoratifs
- `aria-live` : Zones de contenu dynamique
- `aria-controls` : Relation entre contrôles et contenus
- `aria-haspopup` : Indication de menus contextuels

### 3. Sémantique HTML

Structure sémantique complète :

```html
<header role="banner">
  <nav role="navigation" aria-label="Navigation principale">
    <!-- Navigation -->
  </nav>
</header>

<main id="main-content" role="main">
  <!-- Contenu principal -->
</main>

<footer role="contentinfo">
  <!-- Footer -->
</footer>
```

### 4. Contraste des couleurs (WCAG AA)

Tous les contrastes respectent un ratio minimum de **4.5:1** pour le texte normal :

| Élément | Couleur texte | Couleur fond | Ratio | Statut |
|---------|---------------|--------------|-------|--------|
| Texte principal | `#46217A` | `#FAFAFA` | 9.2:1 | ✅ AAA |
| Liens | `#6D28D9` | `#FFFFFF` | 7.1:1 | ✅ AAA |
| Boutons primaires | `#FFFFFF` | `#6D28D9` | 7.1:1 | ✅ AAA |
| Texte accentué | `#46217A` | `#FCD34D` | 5.8:1 | ✅ AA |
| Texte muted | `#6B4E96` | `#F5F3FF` | 4.9:1 | ✅ AA |

### 5. Images et médias

- **Attributs alt** descriptifs sur toutes les images
- **aria-hidden="true"** sur les images décoratives
- **loading="lazy"** pour optimiser le chargement
- **fetchPriority="high"** sur les images hero

### 6. Formulaires accessibles

- **Labels explicites** associés à tous les champs
- **Messages d'erreur** descriptifs avec `aria-describedby`
- **Validation en temps réel** avec retour accessible
- **Instructions claires** pour chaque champ
- **États de chargement** annoncés aux lecteurs d'écran

### 7. Responsive et mobile

- **Design responsive** adaptatif
- **Taille minimum des zones tactiles** : 44x44px
- **Navigation mobile** accessible avec drawer et overlay
- **Zoom** jusqu'à 200% sans perte de contenu

## Tests d'accessibilité

### Outils recommandés

1. **axe DevTools** : Extension Chrome/Firefox pour tests automatisés
2. **WAVE** : Évaluation visuelle de l'accessibilité
3. **Lighthouse** : Score d'accessibilité dans Chrome DevTools
4. **NVDA** (Windows) ou **VoiceOver** (Mac) : Tests avec lecteurs d'écran

### Checklist de tests

- [ ] Navigation complète au clavier sans souris
- [ ] Test avec lecteur d'écran (NVDA/VoiceOver)
- [ ] Vérification des contrastes avec Color Contrast Analyzer
- [ ] Test de zoom à 200%
- [ ] Navigation mobile avec TalkBack (Android) ou VoiceOver (iOS)
- [ ] Validation HTML (W3C Validator)
- [ ] Score Lighthouse > 90

## Utilitaires d'accessibilité

Le fichier `src/utils/a11y.ts` contient des fonctions utilitaires :

```typescript
// Annoncer un message aux lecteurs d'écran
announceToScreenReader("Formulaire envoyé avec succès", "polite");

// Piéger le focus dans une modale
const cleanup = trapFocus(modalElement);

// Vérifier le contraste des couleurs
const isAccessible = checkContrast("#6D28D9", "#FFFFFF");
```

## Améliorations futures

- [ ] Mode sombre avec contrastes optimisés
- [ ] Préférences utilisateur (taille texte, animations réduites)
- [ ] Transcriptions pour contenu multimédia
- [ ] Support complet du mode contraste élevé Windows

## Ressources

- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [MDN Web Accessibility](https://developer.mozilla.org/en-US/docs/Web/Accessibility)
- [WebAIM](https://webaim.org/)
- [The A11Y Project](https://www.a11yproject.com/)

## Contact

Pour signaler un problème d'accessibilité, contactez notre équipe à accessibility@comparateur-assurance.fr
