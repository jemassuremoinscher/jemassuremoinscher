
# Plan de modifications

## 1. Ajouter le logo Google Reviews dans le bloc 4.8

Dans le composant `src/components/comparison/WhyUsComparison.tsx`, le bloc affichant "4.8/5 sur Google Reviews" (lignes 222-236) sera enrichi avec le logo Google (le "G" multicolore) a cote des etoiles, pour renforcer la credibilite visuelle.

## 2. Changer le favicon pour Arthur

Le fichier `index.html` pointe deja vers `/favicon.png`. Il suffit de copier l'image d'Arthur (`src/assets/mascotte/arthur-thumbs-up.png`) vers `public/favicon.png` pour remplacer le favicon actuel par Arthur.

## 3. Remplacer "Souscrire" par "Me faire rappeler"

Deux fichiers affichent le bouton "Souscrire" / "Souscrire maintenant" apres comparaison des offres :

- **`src/components/InsuranceComparison.tsx`** (ligne 83) : remplacer par "Me faire rappeler"
- **`src/components/comparison/InteractiveComparator.tsx`** (ligne 398) : remplacer par "Me faire rappeler"

---

## Details techniques

### WhyUsComparison.tsx (bloc 4.8)
- Ajouter un SVG du logo Google (le "G" multicolore) dans le `div` contenant les etoiles et la note, avant ou a cote du texte "sur Google Reviews".

### index.html / favicon
- Copier `src/assets/mascotte/arthur-thumbs-up.png` vers `public/favicon.png` via `lov-copy`.

### InsuranceComparison.tsx
- Ligne 83 : `"Souscrire maintenant"` -> `"Me faire rappeler"` et `"Souscrire"` -> `"Me faire rappeler"`

### InteractiveComparator.tsx
- Ligne 398 : `"Souscrire maintenant"` -> `"Me faire rappeler"` et `"Souscrire"` -> `"Me faire rappeler"`
