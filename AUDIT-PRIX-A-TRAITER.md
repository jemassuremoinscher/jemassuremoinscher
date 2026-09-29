# Suivi — chiffres/prix non sourcés repérés mais non traités (2026-09-24)

**Mise à jour 2026-09-26 : les points 1-4 et 6 sont traités** (commits `38325975` et `f89bc896`). Reste : point 7 (incohérence prix PNO) et point 8 (dateModified manquant, prix des tableaux) — futur chantier verticales.

Fichier de suivi créé pendant le chantier prix (passes 1-3) pour ne pas perdre les points flagués en cours de route mais hors du périmètre traité ce soir. À reprendre après le plan de travail en cours (chantier cyber, mutuelle entreprise, protection juridique, audit grosses verticales, liens blog).

## 1. Objet `R` dans `index.html` (bootstrap SEO par route, avant hydratation React)

Fichier : `index.html`, lignes ~41-60 (script `SEO Bootstrap`).

Même mécanisme que celui corrigé sur la homepage ("/"), mais pour les autres routes. Confirmé non sourcé :
- `/assurance-auto` : "économisez jusqu'à 40%", "dès 25€/mois"
- `/assurance-sante` : "économisez jusqu'à 300€/an"

Probablement d'autres entrées du même objet à vérifier une par une (une quinzaine de routes au total dans `R`).

## 2. FAQ homepage — écart de prix entre assureurs

Fichiers : `src/pages/Index.tsx` (JSON-LD FAQPage, ligne ~135), `src/components/sections/DirectAnswers.tsx` (contenu visible identique).

Claim : "l'écart de prix entre deux assureurs atteint couramment 30 à 40 % pour un même profil" + "regrouper auto et habitation... 5 à 15 % de remise". Laissé intact car distinct du pattern "nos utilisateurs économisent X%" déjà corrigé — mais toujours non sourcé.

## 3. `aboutPage.resultsDesc` (i18n, page "à propos")

Fichiers : `src/i18n/fr.ts:1148`, équivalent `en.ts`.

Claim : "En moyenne, nos utilisateurs économisent 35% sur leurs contrats d'assurance grâce à notre comparateur intelligent." Même famille que le "40%"/"280€" déjà corrigé sur la homepage, mais chiffre différent (35%) et page différente (à propos).

## 4. FAQ de la landing `/landing/auto`

Fichier : `src/data/landingConfigs.tsx` ligne ~87 (slug `auto`).

Claim : "En moyenne, nos utilisateurs économisent jusqu'à 40 % en mettant en concurrence les 70+ assureurs partenaires." Même famille, page landing spécifique.

## 5. ~~`AssuranceHabitation.tsx` — "40%" en dur dans `ogDescription`/`twitterDescription`~~ — TRAITÉ le 2026-09-24

Corrigé dans le chantier "audit grosses verticales" (commit `e9902c99`), avec 5 autres pages ayant le même défaut (auto, moto, sante, vie, pret) et deux couches supplémentaires jamais auditées (sous-titre visible `*Page.subtitle`, titre de carte avantage `*Page.adv1.title`).

---

## 6. `DynamicUpdateDate` sur 7 pages restantes (audit du 2026-09-24)

Composant supprimé sur les 12 grosses verticales (commit `24bd2134`) car il affichait `new Date()` sans lien avec une vraie mise à jour — fausse fraîcheur mécanique. **7 pages l'utilisent encore, pas traitées ce soir** : `AssuranceExpatries.tsx`, `BlogArticle.tsx`, `AssuranceAnimaux.tsx`, `Contact.tsx`, `AssuranceTrottinette.tsx`, `Blog.tsx`, `AssuranceMetiersAtypiques.tsx`.

Cas particulier à traiter différemment : `Blog.tsx`/`BlogArticle.tsx` ont probablement une vraie date exploitable côté Supabase (`published_at`/`reviewed_at` sur `seo_article_suggestions`) — à vérifier et wiring proprement plutôt qu'un simple retrait, contrairement aux 5 autres qui n'ont probablement pas de source réelle non plus.

## 7. Incohérence de prix PNO (audit du 2026-09-24)

`ProductGuaranteeTable.tsx` (`pno`) affiche "dès 5€/mois", mais `pnoPage.adv2.title` (i18n) affiche "Dès 9€/mois" — deux prix différents pour le même produit sur la même page. Pas traité (catégorie "prix des tableaux", explicitement différée).

---

## Autres points flagués en cours de route (chantier prix passes 2-3), non traités car hors des 6 confirmées

- `AssuranceAuto.tsx` : "Nos clients économisent 320€/an, jusqu'à 400€" — **traité le 2026-09-24** (commit `e9902c99`), avec 7 autres emplacements dans le même fichier (serviceSchema, faqSchema, insuranceProductSchema, data-ai-description, enBrefFacts).
- `mrp` (landingConfigs.tsx) : topBarText "-25% la 1ère année", stats "-25% Économie moy." — non sourcé, pas dans les 6 traitées.
- `prevoyance` (landingConfigs.tsx) : stats "100% Maintien salaire", "-30% Vs marché" — non sourcé.
- `pno` (landingConfigs.tsx) : stats "-30% Vs marché" — non sourcé.
- Témoignages avec prix chiffrés sur plusieurs landings (sans-permis "32€/mois"/"48€/mois", prevoyance "22€/mois", pno "92€/an", rc-pro "14€/mois") — même famille que les 36 témoignages fictifs déjà supprimés des fichiers i18n, mais ceux-ci sont dans `landingConfigs.tsx` (`testimonials` par landing), jamais audités pour authenticité.

## 8. Reste explicitement différé au futur "chantier verticales" (confirmé le 2026-09-24)

- Prix des tableaux `ProductGuaranteeTable.tsx` (auto, moto, habitation, sante, pno, mrp, rc-pro, pret, prevoyance, gli, gestion-locative) : aucun n'a de commentaire "devis vérifié" (contrairement à scooter-50cc/trottinette).
- Absence de `dateModified`/`datePublished` en JSON-LD sur les 12 grosses verticales (contrairement aux nouveaux piliers créés cette nuit).

---

## 9. Chantier LCP/hydratation — `hydrateRoot` testé, échec confirmé (2026-09-27)

**Diagnostic de départ** : le LCP est probablement pénalisé par `createRoot` qui détruit et reconstruit tout le DOM prérendu au boot React, au lieu de le réutiliser. `hydrateRoot` éviterait cette destruction — mais toutes les pages sont chargées via `lazy()` + `<Suspense fallback={spinner}>` au niveau du routeur (`App.tsx`), sans marqueurs SSR (le "SSR" ici est un snapshot Puppeteer statique, pas un vrai rendu serveur streamé) : React ne sait pas que ce Suspense était déjà résolu, donc `hydrateRoot` risque d'afficher le spinner de fallback à la place du contenu déjà peint.

**Corrections faites avant le test** (conservées, indépendamment du résultat) :
- `LanguageContext.tsx` : l'état initial de la langue lisait `localStorage` de façon synchrone dans l'initialiseur de `useState` — désaccord garanti pour un visiteur revenant avec `language: 'en'` sauvegardé. Corrigé : état initial toujours `'fr'`, restauration de la préférence dans un `useEffect` post-montage (même pattern que `useCookieConsent`, déjà correct).
- `DynamicGreeting.tsx`/`DynamicHeroContent.tsx` (contenu de hero variable selon `?ref=` dans l'URL) : identifié comme risque potentiel, mais **finalement du code mort** — jamais importé dans une page réelle. Rien à corriger.
- `ContactStep` (Math.random, `MultiStepQuoteForm.tsx`) et `useCookieConsent` (bannière cookies) : vérifiés, **pas des sources de désaccord** contrairement à l'hypothèse initiale — le premier ne se monte jamais au premier rendu (`currentStep` démarre toujours à 0), le second suit déjà le bon pattern (état par défaut identique partout, vraie valeur posée en effet).

**Mécanisme testé** : dans `main.tsx`, précharger le chunk JS de la route (`import("./pages/AssuranceAuto")`) et l'attendre avant d'appeler `hydrateRoot`, scopé à `/assurance-auto` uniquement (`createRoot` inchangé pour toutes les autres routes).

**Résultat** : échec. Testé sur `serve dist` (voir découverte annexe ci-dessous) — console affiche des erreurs React réelles au chargement de `/assurance-auto` :
- Erreur #418 (répétée ~7 fois) : *"Hydration failed because the initial UI does not match what was rendered on the server."*
- Erreur #423 : *"There was an error while hydrating but React was able to recover by instead client rendering the entire root."*

React récupère (contenu final correct pour l'utilisateur), mais retombe de fait sur un rendu client complet — probablement aucun gain LCP, avec en plus le coût de la tentative d'hydratation ratée et des erreurs console. **Cause exacte non identifiée** : les erreurs sont minifiées (build de prod) ; les localiser avec certitude demanderait un build React en mode dev servi sur le HTML prérendu, ou une recherche dichotomique en désactivant des sous-arbres — pas fait, sur instruction explicite d'arrêter l'investigation ici. Le gain potentiel de `hydrateRoot` reste donc **hypothétique**, pas démontré.

**`main.tsx` reverté** à l'état d'origine (`createRoot` simple) — l'expérimentation n'a pas été déployée au-delà du test local.

**Découverte annexe (utile pour tout futur test d'hydratation ou de prerendering)** : `vite preview` ne reproduit PAS le routing réel de production — il retombe sur `dist/index.html` (l'accueil) pour toute route sans extension, donnant l'impression trompeuse que le prerendering par route ne fonctionne pas. Vérifié sur le site en ligne (`curl https://www.jemassuremoinscher.fr/assurance-auto`, `x-vercel-cache: HIT`, titre correct) : la prod sert bien la bonne page. Pour tester localement avec un routing fidèle à la prod, utiliser `npx serve dist -l <port>` plutôt que `vite preview`.
