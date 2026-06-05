## Objectif

Quand le visiteur passe en EN, **plus aucun texte FR ne doit apparaître** sur la homepage, les pages assurance (Vie, Auto, Habitation, Santé, Moto, Animaux, Pret, Prevoyance, RC Pro, MRP, GLI, PNO) ni dans les briques transverses (Header, Footer, formulaire multi-step, chatbot, sticky CTA).

## Périmètre identifié (audit)

Composants 100% FR hard-codé (zéro `t()`):

- `src/components/insurance/CourtierValueCards.tsx` — "Pourquoi passer par un courtier spécialisé…", 4 cartes (Comparaison ciblée, Garanties vérifiées, Dossier défendu, Conseil indépendant)
- `src/components/insurance/InsuranceSEOTabs.tsx` — labels onglets, titres internes
- `src/components/insurance/InsuranceBottomHub.tsx` — "Nos clients consultent aussi", "Articles conseils", "Outils & Ressources", labels CTA
- `src/components/seo/EnBref.tsx` — libellé "En bref"
- `src/components/DynamicUpdateDate.tsx` — "Données mises à jour en temps réel le …"

Pages avec strings FR hard-codées dans le code page (en plus des `t()`):

- `src/pages/AssuranceVie.tsx` — "0% de frais d'entrée", "Frais d'arbitrage offerts", FAQ extra, EnBref facts, breadcrumb "Accueil"
- Idem (à vérifier/aligner) pour: AssuranceAuto, AssuranceHabitation, AssuranceSante, AssuranceMoto, AssuranceAnimaux, AssurancePret, AssuranceVie, AssurancePrevoyance, AssuranceRCPro, AssuranceMRP, AssuranceGLI, AssurancePNO

Composants partiellement traduits à compléter:

- `src/components/Footer.tsx` (seulement 9 `t()` pour ~30 libellés visibles: "Nos Assurances", "Ressources", "À propos", "Informations légales", listes de produits, badges légaux, disclaimer, copyright)
- `src/components/forms/MultiStepQuoteForm.tsx` — "Étape 1/5", "Plus que 60s pour voir vos prix", chips "Données sécurisées / 100% gratuit / Sans engagement", labels métier des choix d'assurance et tuiles (visibles dans les screenshots)
- Header/menu (sous-menus "Vie & Épargne", "Immobilier" → vérifier que tous les items sont traduits)
- ArthurHero (alt-text + label CTA résiduels)

## Stratégie d'implémentation

1. **Créer un script d'audit** `scripts/audit-i18n-coverage.ts` qui parcourt les `.tsx` et liste les chaînes JSX françaises (mots-clés: `Que souhaitez|votre|assurance|gratuit|sans engagement|comparez|conseiller|économ|découvr|cher`) **hors** appels `t(...)`. Servira de checklist exhaustive.
2. **Refactorer les composants 0-`t()`** en y branchant `useLanguage` + clés `componentName.*`. Toujours conserver les valeurs FR existantes comme défaut dans `fr.ts`, créer la traduction EN parallèle.
3. **Compléter Footer** + **MultiStepQuoteForm** (zone à plus fort impact visuel sur toutes les pages).
4. **Pages assurance**: extraire chaque string FR locale vers une clé `<page>.*` (ex. `viePage.adv.zeroFees.title`). Mutualiser les libellés communs (breadcrumb "Home", "0% entry fees", "Free arbitration fees") sous un namespace `insPage.*`.
5. **Étendre `src/i18n/fr.ts` et `src/i18n/en.ts`** avec toutes les nouvelles clés. Re-vérifier la parité via le script existant `scripts/diff-i18n.ts`.
6. **Vérification visuelle** route par route: `/`, `/assurance-vie`, `/assurance-auto`, `/assurance-habitation`, `/assurance-sante`, `/assurance-moto`, `/assurance-animaux`, `/assurance-pret`, `/contact`, `/blog`, `/glossaire`. (Routes blog/glossaire restent FR par nature SEO — confirmer ce point.)

## Périmètre exclu (à confirmer par toi)

- **Articles de blog & glossaire**: contenu éditorial FR, optimisé SEO français — ne sont **pas** traduits. La langue de l'article reste FR même en mode EN (canonical FR uniquement). À confirmer.
- **Meta tags par page** (title/description/OG): aujourd'hui en FR; le site cible la France (hreflang fr/en pointe la même URL FR). Si tu veux des meta EN dynamiques, dis-le et j'ajouterai un namespace `seo.<page>.title/description` consommé par `SEOOptimized` quand `language === 'en'`.
- **Schemas JSON-LD**: descriptions FR conservées (référencement FR).
- **Données métier** (noms d'assureurs, produits, mentions ORIAS, RGPD): non traduites.

## Détails techniques

Contrats de nommage des clés:

```
courtierValue.title / .subtitle
courtierValue.card1.title / .desc  (… card1..card4)
seoTabs.tabFAQ / .tabGuide / .tabBenefits
bottomHub.alsoConsulted / .articles / .toolsResources / .ctaReady
enBref.title  (= "En bref" / "In brief")
updateDate.label  (= "Data updated in real time on {date}")
form.stepOf  (= "Step {n}/{total}" / "Étape {n}/{total}")
form.timeLeft  (= "Only {n}s left to see your prices")
form.trust.secured / .free / .noCommit
footer.nosAssurances / .resources / .about / .legal / .copyright
```

Pour les chaînes interpolées (ex. date, n° d'étape), `t()` retourne un template avec `{x}` puis `String.replace` côté composant (pattern existant dans le projet).

Livraisons:

```
src/i18n/fr.ts          (+ ~120 clés)
src/i18n/en.ts          (+ ~120 clés, parité 1:1)
src/components/insurance/CourtierValueCards.tsx
src/components/insurance/InsuranceSEOTabs.tsx
src/components/insurance/InsuranceBottomHub.tsx
src/components/seo/EnBref.tsx
src/components/DynamicUpdateDate.tsx
src/components/Footer.tsx                          (compléments)
src/components/forms/MultiStepQuoteForm.tsx        (compléments)
src/pages/Assurance{Vie,Auto,Habitation,Sante,Moto,Animaux,Pret,Prevoyance,RCPro,MRP,GLI,PNO}.tsx
scripts/audit-i18n-coverage.ts                     (nouveau)
```

## Questions pour toi avant d'attaquer

1. **Blog & glossaire**: on laisse en FR uniquement (recommandé pour le SEO FR), ou tu veux qu'on traduise aussi les coquilles (titres de section, dates, "Lire la suite", "Auteur")?
2. **Meta SEO par page en EN**: on les bascule aussi (title/description/OG) quand `language === 'en'`, ou on garde tout en FR puisque hreflang pointe la même URL?
3. **Ordre de priorité** si tu veux découper en plusieurs livraisons:  
   a) Pages assurance + composants insurance (le plus visible pour un visiteur EN)  
   b) Footer + MultiStepQuoteForm (transverses, présentes partout)  
   c) Header/menus + chatbot + StickyCTA  
   d) Blog/glossaire (si retenu)
