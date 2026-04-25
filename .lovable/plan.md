Plan de correction proposé

Objectif : appliquer toutes les demandes sans toucher au design global du site, uniquement avec des ajustements de contenu, de structure réutilisable et de cohérence.

1. Header mobile/tablet
- Supprimer les icônes réseaux sociaux du drawer mobile/tablet.
- Conserver les réseaux sociaux uniquement dans le header desktop/tablet haut, comme demandé.
- Garder le sélecteur de langue dans le drawer.

2. Avis et nombre de clients partout
- Remplacer toutes les occurrences visibles et structurées de 4.9 / 4,9 par 4.9 / 4,9.
- Mettre à jour les composants de preuve sociale : formulaire, widgets avis, landing pages, schemas JSON-LD.
- Remplacer le seuil “250 Français/clients assurés” par “+1000 clients assurés” partout où il apparaît.
- Vérifier les occurrences restantes par recherche globale après modification.

3. Lisibilité des héros avec Arthur en arrière-plan
- Ajuster le composant commun `ArthurHero` pour rendre le grand Arthur décoratif un peu plus transparent.
- Garder le design existant, mais améliorer la lisibilité sur toutes les pages qui utilisent ce même hero.
- Pour la page métiers atypiques, assombrir légèrement la couleur du titre en passant de l’accent doré à une couleur de texte plus lisible, sans changer la mise en page.

4. Bloc “Pourquoi un courtier spécialisé…” en cartes
- Transformer sur `/assurance-metiers-atypiques` le bloc texte long “Pourquoi un courtier spécialisé pour les métiers atypiques ?” en cartes, en conservant le contenu SEO/GEO utile.
- Créer un composant réutilisable de cartes explicatives qui reprend le style des cartes de la home : Card, icône, titre, texte, tokens Tailwind existants.
- Ajouter ce bloc de cartes naturellement dans le flux des 14 pages produit des onglets :
  - Particuliers : auto, moto, habitation, santé, animaux
  - Professionnels : RC Pro, MRP, métiers atypiques
  - Vie & Épargne : assurance vie, assurance emprunteur, prévoyance
  - Immobilier : GLI, PNO, gestion locative
- Ne pas dupliquer un bloc s’il existe déjà sur une page ; uniquement compléter les pages où il manque.

5. Comparateur : plus de questions et tarifs cohérents
- Étendre la logique `/comparateur` : après le choix du type d’assurance, injecter davantage de questions spécifiques selon le cas, pas seulement auto/moto.
- Réutiliser les étapes déjà présentes dans `stepConfigsByType` pour habitation, santé, animaux, vie, emprunteur, prévoyance, RC Pro, MRP, GLI, PNO et gestion locative.
- Ajouter, si nécessaire, quelques étapes simples cohérentes pour améliorer la précision : âge, type de bien, niveau de garantie, code postal, etc.
- Calculer/afficher des estimations de tarifs cohérentes en fin de parcours selon le type sélectionné et les réponses, en restant indicatif et sans promesse ferme.
- Conserver le formulaire et ses animations existantes.

6. Assurance vie : frais offerts, sans tableau garanties
- Retirer `ProductGuaranteeTable product="vie"` de `/assurance-vie`, car le tableau de garanties n’est pas pertinent pour l’assurance vie.
- Mettre en avant subtilement mais clairement :
  - “0% de frais d’entrée”
  - “frais d’arbitrage offerts”
  - “frais d’entrée offerts”
- Ajouter ces signaux dans les zones SEO/GEO déjà présentes : avantages, En bref, FAQ/schema si pertinent, metadata, sans alourdir le design.

7. Tableaux garanties uniquement sur pages concernées
- Garder le tableau garanties sur les pages où il a du sens : auto, moto, habitation, santé, animaux, PNO, GLI, MRP, RC Pro, emprunteur, prévoyance, métiers atypiques, gestion locative.
- Retirer l’assurance vie du type `ProductGuaranteeTable` si elle n’est plus utilisée, pour éviter une réintroduction future.
- Vérifier qu’il n’y a pas de duplication avec l’onglet “Garanties comparées” existant d’`InsuranceSEOTabs`.

8. Renommer Assurance Emprunteur en Assurance Emprunteur
- Remplacer les libellés visibles “Assurance Emprunteur”, “Assurance Emprunteur” et “Assurance Emprunteur” par “Assurance Emprunteur” quand il s’agit du produit/page.
- Mettre à jour : header, footer, liens internes, breadcrumbs, titres, landing config, glossaire, SEO pages, index static, blog categories/titres/tags si ambigu.
- Garder l’expression “assurance de prêt immobilier” uniquement comme synonyme explicatif dans les contenus longs quand elle aide le SEO, mais éviter qu’elle soit le titre principal.

9. Articles blog et Arthur thématique
- Confirmer et renforcer la logique existante : les trois articles métiers atypiques utilisent déjà les bons Arthur par slug : accrobranche, sports outdoor/kayak, événementiel/karting.
- Corriger les catégories restantes qui tombent trop souvent sur Arthur ampoule (`arthur-idea`) en ajoutant une fonction de mapping par sujet/tags/titre.
- Règle future : priorité au slug, puis catégorie, puis tags/titre, puis fallback neutre ; ne pas utiliser Arthur ampoule par défaut pour les sujets métiers/auto/moto/habitation/santé.

10. Contrôle final
- Recherche globale pour vérifier : aucune occurrence visible restante de 4.9/4,9, 250 clients, “Assurance Emprunteur” comme libellé principal, `ProductGuaranteeTable product="vie"`.
- Vérification que les pages produits ont bien le bloc cartes sans doublon.
- Vérification TypeScript/build si disponible en mode exécution après approbation.

Détails techniques
- Fichiers probablement concernés : `Header.tsx`, `ArthurHero.tsx`, `MultiStepQuoteForm.tsx`, `stepConfigs.ts`, `AssuranceVie.tsx`, `AssurancePret.tsx`, pages produit, `ProductGuaranteeTable.tsx`, `BlogArticleArthur.tsx`, `fr.ts`, `Footer.tsx`, `SimpleFooter.tsx`, landing configs, index static et contenus blog.
- Pas de modification de design global : uniquement classes Tailwind existantes, composants UI déjà utilisés et contenu SEO/GEO.