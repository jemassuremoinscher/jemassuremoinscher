# Suivi — chiffres/prix non sourcés repérés mais non traités (2026-09-24)

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
