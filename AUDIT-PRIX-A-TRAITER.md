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

## 5. `AssuranceHabitation.tsx` — "40%" en dur dans `ogDescription`/`twitterDescription`

Fichier : `src/pages/AssuranceHabitation.tsx`, lignes ~70-71.

Claim : `ogDescription="...Économisez jusqu'à 40% sur votre contrat."`, `twitterDescription="...Économisez jusqu'à 40%/an..."`. Même famille que le "40%" déjà corrigé sur la homepage, jamais repéré jusqu'ici car cette page n'utilise pas l'objet `R` de `index.html` (ces props sont propres au composant React de la page). Flagué en passant pendant le chantier protection juridique (2026-09-24), pas traité.

---

## Autres points flagués en cours de route (chantier prix passes 2-3), non traités car hors des 6 confirmées

- `AssuranceAuto.tsx` : "Nos clients économisent 320€/an, jusqu'à 400€" (non sourcé) — le pilier auto lui-même contient un chiffre non vérifié, ce qui a compliqué la vérification de la landing `auto`.
- `mrp` (landingConfigs.tsx) : topBarText "-25% la 1ère année", stats "-25% Économie moy." — non sourcé, pas dans les 6 traitées.
- `prevoyance` (landingConfigs.tsx) : stats "100% Maintien salaire", "-30% Vs marché" — non sourcé.
- `pno` (landingConfigs.tsx) : stats "-30% Vs marché" — non sourcé.
- Témoignages avec prix chiffrés sur plusieurs landings (sans-permis "32€/mois"/"48€/mois", prevoyance "22€/mois", pno "92€/an", rc-pro "14€/mois") — même famille que les 36 témoignages fictifs déjà supprimés des fichiers i18n, mais ceux-ci sont dans `landingConfigs.tsx` (`testimonials` par landing), jamais audités pour authenticité.
