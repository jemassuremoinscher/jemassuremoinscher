# Génération automatique du sitemap

Ce système génère automatiquement le sitemap XML à partir d'une configuration centralisée des routes React Router.

## Architecture

### Fichiers
- **`routes-config.ts`** : Configuration centralisée de toutes les routes avec métadonnées SEO
- **`index.ts`** : Edge function qui génère le sitemap dynamiquement
- **`deno.json`** : Configuration de l'edge function

## Comment ça marche

1. **Configuration centralisée** : Toutes les routes sont définies dans `routes-config.ts` avec leurs métadonnées :
   - `path` : Le chemin de la route
   - `lastmod` : Date de dernière modification
   - `changefreq` : Fréquence de mise à jour
   - `priority` : Priorité SEO (0.0 à 1.0)

2. **Génération dynamique** : L'edge function combine les routes principales et les articles de blog pour générer le XML

3. **Mise à jour automatique** : Quand vous ajoutez une nouvelle route dans `routes-config.ts`, elle apparaît automatiquement dans le sitemap

## Ajouter une nouvelle page

Pour ajouter une nouvelle page au sitemap :

1. Ouvrez `supabase/functions/sitemap/routes-config.ts`
2. Ajoutez votre route dans le tableau `routes` ou `blogArticles` :

```typescript
{
  path: "/nouvelle-page",
  lastmod: "2025-11-11",
  changefreq: "weekly",
  priority: 0.8,
}
```

3. L'edge function sera redéployée automatiquement

## Accès au sitemap

Le sitemap est accessible via l'edge function :
- **URL de l'edge function** : `https://ybqxpngkbgosobtetxac.supabase.co/functions/v1/sitemap`

### Configuration Google Search Console

Pour que Google utilise le sitemap généré dynamiquement :

1. Dans Google Search Console
2. Allez dans "Sitemaps"
3. Ajoutez l'URL de l'edge function

Ou bien, vous pouvez mettre à jour le fichier statique `public/sitemap.xml` manuellement en copiant le contenu généré.

## Priorités et fréquences recommandées

### Priority
- `1.0` : Page d'accueil
- `0.9` : Pages principales (assurances, comparateurs)
- `0.8` : Pages importantes (articles SEO, landing pages)
- `0.7` : Pages secondaires
- `0.5` : Pages utilitaires
- `0.3` : Pages légales

### Changefreq
- `daily` : Contenu mis à jour quotidiennement (blog, homepage)
- `weekly` : Contenu mis à jour régulièrement (pages produits)
- `monthly` : Contenu stable (pages informatives)
- `yearly` : Contenu très stable (pages légales)

## Avantages

✅ **Plus d'oublis** : Toutes les routes sont centralisées
✅ **Maintenance facile** : Un seul fichier à modifier
✅ **Synchronisation automatique** : Le sitemap est toujours à jour
✅ **Configuration flexible** : Priorités et fréquences personnalisables
✅ **Cache performant** : Cache d'1 heure pour optimiser les performances
