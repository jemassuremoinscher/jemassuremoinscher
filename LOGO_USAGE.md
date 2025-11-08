# Guide d'utilisation des logos

Ce guide explique quand et comment utiliser chaque version du logo de Le Comparateur Assurance.

## 📁 Fichiers disponibles

### 1. **Favicon** (`public/favicon.png`)
- **Dimensions** : 512x512 px
- **Format** : Carré
- **Usage** : Icône du navigateur (onglets, favoris, raccourcis)
- **Emplacement** : `/public/favicon.png`
- **Référence HTML** : Déjà configuré dans `index.html`

```html
<link rel="icon" type="image/png" href="/favicon.png" />
```

### 2. **Logo Mobile** (`src/assets/logo-mobile.png`)
- **Dimensions** : 1024x512 px (ratio 2:1)
- **Format** : Horizontal compact
- **Usage** : Header mobile, petits écrans (< 768px)
- **Import React** :

```tsx
import logoMobile from '@/assets/logo-mobile.png';

<img src={logoMobile} alt="Le Comparateur Assurance" className="h-8 md:hidden" />
```

### 3. **Logo Desktop** (`src/assets/logo-desktop.png`)
- **Dimensions** : 1536x512 px (ratio 3:1)
- **Format** : Horizontal standard
- **Usage** : Header desktop, tablettes et grands écrans (≥ 768px)
- **Import React** :

```tsx
import logoDesktop from '@/assets/logo-desktop.png';

<img src={logoDesktop} alt="Le Comparateur Assurance" className="hidden md:block h-12" />
```

### 4. **Logo HD** (`src/assets/logo-hd.png`)
- **Dimensions** : 1920x640 px (ratio 3:1)
- **Format** : Haute résolution
- **Usage** : 
  - Écrans Retina/HiDPI
  - Documents imprimés
  - Présentations
  - Marketing
- **Import React** :

```tsx
import logoHD from '@/assets/logo-hd.png';

<img 
  src={logoHD} 
  alt="Le Comparateur Assurance" 
  className="w-full max-w-2xl"
/>
```

### 5. **Logo Original** (`src/assets/logo.png`)
- **Usage** : Actuellement utilisé dans le Header
- **Remplacement** : À remplacer progressivement par logo-mobile.png et logo-desktop.png

## 🎨 Recommandations d'utilisation

### Header responsive
```tsx
import logoMobile from '@/assets/logo-mobile.png';
import logoDesktop from '@/assets/logo-desktop.png';

export const Header = () => (
  <header>
    {/* Logo mobile */}
    <img 
      src={logoMobile} 
      alt="Le Comparateur Assurance" 
      className="h-8 md:hidden"
    />
    
    {/* Logo desktop */}
    <img 
      src={logoDesktop} 
      alt="Le Comparateur Assurance" 
      className="hidden md:block h-12"
    />
  </header>
);
```

### Footer
```tsx
import logoDesktop from '@/assets/logo-desktop.png';

<img 
  src={logoDesktop} 
  alt="Le Comparateur Assurance" 
  className="h-10 mb-4"
/>
```

### Email signatures / Documents
Utilisez `logo-hd.png` pour une qualité optimale.

## 📐 Tailles recommandées (Tailwind)

- **Mobile header** : `h-8` (32px)
- **Desktop header** : `h-10` ou `h-12` (40-48px)
- **Footer** : `h-8` ou `h-10` (32-40px)
- **Hero sections** : `h-16` à `h-24` (64-96px)

## ♿ Accessibilité

Toujours inclure un texte alternatif descriptif :

```tsx
<img 
  src={logoDesktop} 
  alt="Le Comparateur Assurance - Retour à l'accueil" 
/>
```

## 🎯 Points d'attention

- ✅ Utiliser le logo mobile en dessous de 768px
- ✅ Utiliser le logo desktop au-dessus de 768px
- ✅ Préserver le ratio d'aspect (ne pas déformer)
- ✅ Assurer un bon contraste avec l'arrière-plan
- ❌ Ne pas modifier les couleurs du logo
- ❌ Ne pas ajouter d'effets ou de filtres
- ❌ Ne pas recadrer le logo
