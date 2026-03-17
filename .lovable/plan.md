

# Plan de traduction complete du site en anglais

## Contexte
La homepage et les composants partages (Header, Footer, Hero, HowItWorks, WhyUs, SEOFaq, QuickQuote, Guides, StickyCTA, PartnersSlider) sont deja traduits via le systeme `useLanguage()` / `t()`. Tout le reste du site contient du texte francais en dur.

## Scope -- fichiers a traduire

### Phase 1 : Composants partages restants (utilises sur toutes les pages produit)
1. **Testimonials.tsx** -- titres, stats, et textes des temoignages
2. **SavingsCalculator.tsx** -- labels, boutons, resultats
3. **QuoteRequestForm.tsx** -- labels de formulaire, messages de succes
4. **InsuranceComparison.tsx** -- titres, badges, boutons
5. **InsuranceFAQ.tsx** -- titre par defaut
6. **CookieBanner.tsx** -- tous les textes du bandeau cookies
7. **InteractiveComparator.tsx** -- filtres, labels, cartes d'offres
8. **SubscriptionModal.tsx** -- formulaire de rappel
9. **TrustBadges.tsx** -- badges de confiance

### Phase 2 : Pages d'assurance Particuliers
10. **AssuranceAuto.tsx** -- hero, formulaire, avantages, FAQ, CTA
11. **AssuranceSante.tsx** -- idem
12. **AssuranceHabitation.tsx** -- idem
13. **AssuranceMoto.tsx** -- idem
14. **AssuranceAnimaux.tsx** -- idem

### Phase 3 : Pages d'assurance Pro / Vie / Immobilier
15. **AssuranceVie.tsx**
16. **AssurancePret.tsx**
17. **AssurancePrevoyance.tsx**
18. **AssuranceRCPro.tsx**
19. **AssuranceMRP.tsx**
20. **AssuranceGLI.tsx**
21. **AssurancePNO.tsx**
22. **GestionLocative.tsx**

### Phase 4 : Pages secondaires
23. **Contact.tsx** -- formulaire, cartes, CTA
24. **QuiSommesNous.tsx** -- mission, valeurs, stats
25. **AvisClients.tsx** -- temoignages, resume, CTA
26. **NosPartenaires.tsx** -- criteres, engagement, CTA
27. **Blog.tsx** -- filtres, recherche, categories
28. **BlogArticle.tsx** -- navigation, commentaires
29. **Comparateur.tsx** -- titre SEO

### Phase 5 : Pages legales et utilitaires
30. **CGU.tsx**
31. **MentionsLegales.tsx**
32. **PolitiqueConfidentialite.tsx**
33. **PolitiqueCookies.tsx**
34. **PlanDuSite.tsx**
35. **NotFound.tsx**
36. **Glossaire.tsx / GlossaireTerme.tsx**

### Phase 6 : Landing pages (12 pages)
37-48. **LandingAuto, LandingSante, LandingHabitation, LandingMoto, LandingAnimaux, LandingVie, LandingPret, LandingPrevoyance, LandingRCPro, LandingMRP, LandingGLI, LandingPNO**

### Phase 7 : Composants restants
49. **CallbackForm.tsx**
50. **QuickHelpSection.tsx**
51. **SimplifiedLeadForm.tsx**
52. **InsuranceQuiz.tsx**
53. **AIChatbot.tsx / TransferDialog.tsx**
54. **NewsletterSection.tsx**
55. **BlogHighlights.tsx / CommentsSection.tsx**
56. **FAQ.tsx, Features.tsx, Partners.tsx**

---

## Approche technique

Pour chaque fichier :
1. Ajouter les cles FR + EN dans le dictionnaire `LanguageContext.tsx`
2. Importer `useLanguage` dans le composant
3. Remplacer chaque texte en dur par `t('cle.correspondante')`

Le dictionnaire `LanguageContext.tsx` va considérablement grossir (~2000+ cles). Pour garder le fichier lisible, les cles seront organisees par prefixe de page (ex: `autoPage.hero.title`, `contactPage.title`, etc.).

## Estimation

- ~55+ fichiers a modifier
- ~2000+ cles de traduction a ajouter
- Le travail sera fait en plusieurs passes successives pour eviter les erreurs

## Important
- Les textes SEO (meta title/description) resteront en francais car le site cible le marche francais -- les balises SEO ne changent pas avec le toggle
- Les schemas JSON-LD restent en francais pour le meme raison
- Les messages de validation Zod restent en francais (technique, peu visible)

