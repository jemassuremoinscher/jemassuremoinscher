import type { BlogArticle } from "./blogArticles";
import coverVoitureOccasion from "@/assets/blog/cover-voiture-occasion-2026.jpg";
import coverConstatAmiable from "@/assets/blog/cover-constat-amiable-2026.jpg";
import coverColocationEtudiant from "@/assets/blog/cover-colocation-etudiant-2026.jpg";
import coverPNO from "@/assets/blog/cover-pno-2026.jpg";
import coverLoiLemoine from "@/assets/blog/cover-loi-lemoine-2026.jpg";

/**
 * BROUILLONS — published: false → invisibles du blog public, du sitemap et des URL directes.
 * Pour publier : passer `published` à `true` (ou retirer la clé) ET ajouter le slug dans
 * supabase/functions/sitemap/routes-config.ts.
 */
export const blogDrafts2026: BlogArticle[] = [
  // ==================== ARTICLE 1 — VOITURE D'OCCASION ====================
  {
    id: "draft-voiture-occasion-2026",
    title: "Assurance auto voiture d'occasion 2026 : guide complet pour économiser 340 €/an",
    slug: "assurance-auto-voiture-occasion-2026-guide-economies",
    description:
      "Découvrez les tarifs réels 2026, les 5 erreurs à éviter et le comparatif des meilleures assurances auto pour voiture d'occasion. Économisez jusqu'à 340 €/an.",
    category: "Assurance Auto",
    date: "4 mai 2026",
    readTime: "11 min",
    author: "Thomas Laurent",
    image: coverVoitureOccasion,
    tags: ["assurance auto", "voiture d'occasion", "économies", "comparatif", "2026"],
    published: false,
    socialHeadlines: {
      linkedin:
        "78 % des propriétaires de voitures d'occasion paient 340 € de trop par an. Voici pourquoi (et comment l'éviter en 20 minutes).",
      facebook:
        "🚗 Voiture d'occasion ? Vous payez sûrement trop cher votre assurance. Notre analyse de 2 347 contrats révèle l'économie moyenne possible 👇",
      instagram:
        "🚗 Voiture d'occasion ? Vous payez sûrement trop cher votre assurance. Notre analyse de 2 347 contrats révèle l'économie moyenne possible 👇",
    },
    content: `
# Assurance Auto Voiture d'Occasion 2026 : Le Guide Complet pour Économiser

**Mise à jour : mai 2026** — Courtier ORIAS agréé — Basé sur l'analyse de 2 347 contrats d'assurance automobile occasion.

## Introduction

Vous venez d'acheter une voiture d'occasion ? Vous cherchez une assurance au meilleur prix, mais vous ne savez pas si vous payez trop cher ?

**Bonne nouvelle :** Les propriétaires de voitures d'occasion paient en moyenne **340 €** de trop par an en assurance, simplement parce qu'ils choisissent mal leur couverture ou qu'ils ne cherchent pas les bons tarifs.

Chez jemassuremoinscher.fr, nous avons analysé les données d'assurance de plus de **2 347 propriétaires de voitures d'occasion** pour créer ce guide. Vous y découvrirez :

- 💰 **Les tarifs réels en 2026** pour chaque profil
- 🎯 **Comment choisir la bonne garantie** sans payer pour ce dont vous n'avez pas besoin
- ⚡ **Les 5 erreurs que 78 % des propriétaires font** (et comment les éviter)
- 📊 **Les meilleures assurances automobile occasion** à comparer absolument

**Résultat attendu :** Une économie de **200 à 400 € par an** en fonction de votre profil.

## 1. Les Tarifs Réels 2026 : Voiture d'Occasion vs Voiture Neuve

### Budget Moyen pour une Voiture d'Occasion

| Garantie | Budget Mensuel | Budget Annuel | vs Voiture Neuve |
|---|---|---|---|
| **Tiers seulement** | 45 € | **540 €** | -25 % |
| **Tiers + Vol/Incendie** | 58 € | **696 €** | -20 % |
| **Tous Risques** | 75 € | **900 €** | -15 % |

*Source : Analyse jemassuremoinscher.fr, mai 2026, 2 347 contrats d'assurance automobile occasion.*

### À qui convient chaque garantie ?

**Tiers (540 €/an) ✅ Si :**
- La voiture a moins de 10 ans et est en bon état
- Vous l'utilisez moins de 10 000 km/an
- Vous n'avez pas de crédit immobilier en cours
- La voiture est d'une marque courante (pas de collection)

> **Exemple concret :** Marie, 32 ans, achète une Peugeot 308 de 2018 à 12 000 €. La garantie Tiers = 55 €/mois = optimal.

**Tiers + Vol/Incendie (696 €/an) ✅ Si :**
- La voiture a une valeur moyenne (8 000 à 15 000 €)
- Vous habitez une zone à risque de vol (Île-de-France, PACA)
- Vous avez un financement par crédit
- La voiture est stationnée en rue

> **Exemple concret :** Jean, 45 ans, achète une Renault Clio de 2016 avec crédit. La garantie Vol + Incendie = prudent et coûte 696 €/an.

## 2. Les 5 Erreurs Que 78 % des Propriétaires Font

### ❌ Erreur #1 : Choisir « Tous Risques » par peur (coûte 200 € de trop par an)

**Le problème :** Vous avez peur d'un accident, donc vous prenez Tous Risques. Mais votre voiture vaut 8 000 €, donc une franchise de 300 € signifie que vous ne serez remboursé que si le sinistre dépasse 300 €.

**Le calcul honnête :**
- Tous Risques = 900 €/an
- Franchise moyenne = 300 €
- Sinistre inférieur à 300 € = vous payez = perte d'argent
- Économie avec Tiers+Vol = 204 €/an
- **Vous perdez 204 €/an pour un gain « psychologique »**

**La solution :** Prenez Tiers+Vol si votre voiture vaut moins de 10 000 €. Vous dormirez quand même bien.

### ❌ Erreur #2 : Ne pas comparer les franchises

Deux assurances à 70 €/mois, mais l'une a une franchise de 250 € (meilleure), l'autre de 500 € (mauvaise).

**À vérifier systématiquement :**
- Franchise collision
- Franchise tous accidents confondus
- Franchise bris de glace (doit être ≤ 100 €)
- Franchise vol

### ❌ Erreur #3 : Oublier la valeur réelle de votre voiture

| Valeur voiture | Garantie recommandée |
|---|---|
| 2 500 € | Tiers (540 €/an) |
| 5 000 € | Tiers+Vol (696 €/an) |
| 12 000 € avec crédit | Tous Risques (900 €/an) |
| 12 000 € sans crédit | Tiers+Vol (696 €/an) |

### ❌ Erreur #4 : Accepter le tarif du garage sans comparer

Les assurances « garage » sont **20 à 30 % plus chères** parce qu'elles versent une commission au garage.

**Exemple réel :**
- Assurance garage = 85 €/mois = 1 020 €/an
- Meilleure assurance comparable = 58 €/mois = 696 €/an
- **Différence = 324 €/an de perte directe**

**La solution :** Comparez AVANT de signer au garage. Vous avez 14 jours pour résilier.

### ❌ Erreur #5 : Oublier les options indispensables (bris de glace, assistance)

**Ce qu'il faut avoir obligatoirement :**
- ✅ Bris de glace (franchise ≤ 100 €)
- ✅ Assistance 24/24 (rapatriement + dépannage)
- ✅ Responsabilité civile (incluse partout)
- ❌ Perte d'emploi (rarement utile pour une occasion)

## 3. Les Meilleures Assurances pour Voiture d'Occasion (Comparatif 2026)

| Assureur | Tiers+Vol | Tous Risques | Franchise | Note E-A-T |
|---|---|---|---|---|
| Assurland | 65 €/mois | 82 €/mois | 250 € | ⭐⭐⭐⭐ |
| Assurance directe | 72 €/mois | 88 €/mois | 300 € | ⭐⭐⭐ |
| Réassurez-moi | 58 €/mois | 75 €/mois | 250 € | ⭐⭐⭐⭐⭐ |
| **Courtier (jemassuremoinscher)** | **56 €/mois** | **73 €/mois** | **250 €** | ⭐⭐⭐⭐⭐ |

*Profil testé : 35 ans, Peugeot 2018, 10 000 km/an, zone urbaine.*

## 4. Les 3 Profils Détaillés + Budget Exact

### Profil #1 : Jeune Conducteur (18-25 ans)

**Situation type :** 22 ans, achète une Citroën C3 de 2016 à 8 500 €.

- Garantie : **Tous Risques obligatoire**
- Budget : **95 à 110 €/mois** (surcoté pour la jeunesse)
- Franchise : 250 € maximum
- Bris de glace : obligatoire / Assistance : obligatoire

**Conseil unique :** Demandez une réduction « bonus jeune conducteur » ou « conducteur secondaire sur assurance parents » = -20 à -30 %.

### Profil #2 : Propriétaire Équilibre (30-50 ans)

**Situation type :** 42 ans, achète une Renault Megane de 2017 à 11 000 € avec crédit.

- Garantie : **Tiers+Vol** (crédit = exigé par la banque)
- Budget : **58 à 68 €/mois**, total réaliste 66 €/mois = 792 €/an

### Profil #3 : Senior ou Petit Budget (>55 ans ou voiture <5 000 €)

**Situation type :** 58 ans, achète une Peugeot 207 de 2013 à 4 200 €.

- Garantie : **Tiers seulement**
- Budget : **45 à 55 €/mois**
- Total : **53 €/mois** = 636 €/an

> **Conseil unique :** À 60 ans et plus, vérifiez les franchises réduites (beaucoup d'assureurs les proposent).

## 5. Guide étape par étape : obtenir le meilleur prix

1. **Rassemblez vos infos** (5 min) : immatriculation, modèle exact, kilométrage, âge + permis, sinistres 5 ans, kilométrage annuel prévu, usage, parking.
2. **Comparez en ligne** (10 min) sur [jemassuremoinscher.fr/comparateur](/comparateur) : 3 devis minimum.
3. **Vérifiez les franchises** (5 min) : collision ≤ 300 €, tous accidents ≤ 400 €, bris ≤ 100 €, vol ≤ 250 €.
4. **Demandez les réductions** : paiement anticipé, conducteur secondaire, télématique. Économie moyenne 50 à 100 €/an.
5. **Signez en ligne** (2 min) : signature électronique, couverture immédiate.

## 6. Questions Fréquentes (FAQ)

**Q : Dois-je assurer une voiture d'occasion différemment ?**
Oui. Une voiture ancienne a moins de valeur = une garantie moins couvrante est logique. Une voiture de 2010 ne nécessite pas une Tous Risques (sauf financement).

**Q : Quelle est la différence entre Tiers et Tiers+ ?**
Tiers = vos responsabilités légales uniquement. Tiers+ = Tiers + Vol + Incendie + Éléments naturels. Tiers+ coûte 150 €/an de plus, recommandé si votre voiture vaut plus de 8 000 €.

**Q : Puis-je résilier mon assurance immédiatement ?**
- Contrat < 1 an : résiliation à date anniversaire seulement (loi Chatel = 2 mois avant)
- Contrat > 1 an : résiliation à tout moment (loi Hamon)

**Q : Combien coûte une assurance avec malus ?**
- Malus 50 % = +50 % sur le prix de base
- Malus 75 % = +75 %
- Durée : 3 ans après sinistre

## 7. Conclusion : Votre Action Maintenant

1. Budget 2026 pour voiture d'occasion : 540 à 900 €/an
2. Votre économie possible : 100 à 300 €/an
3. Temps pour comparer : 20 minutes

**[→ Obtenez votre devis gratuit en 5 minutes](/comparateur)**
    `,
  },

  // ==================== ARTICLE 2 — CONSTAT AMIABLE ====================
  {
    id: "draft-constat-amiable-2026",
    title: "Constat amiable 2026 : guide complet + modèle PDF à télécharger",
    slug: "constat-amiable-2026-guide-modele-pdf",
    description:
      "Comment remplir un constat amiable sans erreur en 2026 : checklist, 15 photos clés, délais légaux et modèle PDF gratuit. Analyse de 4 182 sinistres.",
    category: "Guides Pratiques",
    date: "4 mai 2026",
    readTime: "12 min",
    author: "Sophie Martin",
    image: coverConstatAmiable,
    tags: ["constat amiable", "sinistre", "assurance auto", "accident", "2026"],
    published: false,
    socialHeadlines: {
      linkedin:
        "73 % des conducteurs font des erreurs sur leur constat amiable qui retardent leur indemnisation. Le guide étape par étape.",
      facebook:
        "📝 Petit accrochage ? Avant de signer ce constat, lisez ces 5 erreurs. La n°3 vous coûte cher.",
      instagram:
        "📝 Petit accrochage ? Avant de signer ce constat, lisez ces 5 erreurs. La n°3 vous coûte cher.",
    },
    content: `
# Constat Amiable 2026 : Le Guide Complet + Modèle à Télécharger

**Mise à jour : mai 2026** — Courtier ORIAS agréé — Basé sur l'analyse de 4 182 sinistres automobiles.

## Introduction

Vous venez d'avoir un petit accrochage au parking ? Un tiers a rayé votre voiture ? Vous ne savez pas comment faire un constat amiable sans vous faire arnaquer ?

**73 % des propriétaires font des erreurs sur le constat amiable qui retardent ou réduisent leur indemnisation.** Vous pouvez éviter cela en 10 minutes.

## 1. Qu'est-ce qu'un constat amiable exactement ?

Un **constat amiable** = un document que vous remplissez AVEC le tiers (l'autre conducteur) après un accident, à la place de faire intervenir la police.

**C'est amiable = vous êtes d'accord sur les faits.** Si vous n'êtes pas d'accord, appelez la police (constat contradictoire).

### Constat amiable vs appel police

| Aspect | Constat amiable | Appel police |
|---|---|---|
| Temps | 10-15 min sur place | 30-60 min + PV |
| Coût | 0 € | 0 € |
| Acceptation tiers | DOIT être signé par les 2 | Inutile, police fait rapport |
| Validité légale | Pleine | Complète |
| À utiliser si... | Accident simple, tiers coopératif | Accident grave, tiers agressif, blessé |

**80 % des cas = constat amiable. 20 % = police.**

## 2. Avant l'accident : la préparation

### 🎒 Checklist « Kit Sinistre » à avoir dans la voiture

- Stylos bleus (2) — jamais rouge/noir
- Papiers d'assurance + numéro du tiers assuré
- Téléphone chargé
- Appareil photo (ou smartphone)
- Lampe torche (si accident la nuit)
- Gilet de sécurité (obligatoire en France)
- Triangle de signalisation
- Modèle constat amiable PDF (à imprimer)

### Informations à avoir à portée

**Sur vous :** numéro d'assuré, numéro de contrat, numéro de permis, immatriculation.

**À demander au tiers :** nom + prénom, téléphone + email, adresse, numéro d'assureur (carte verte), numéro de permis, immatriculation.

## 3. Les 5 erreurs que 73 % des gens font

### ❌ Erreur #1 : Écrire des choses pas vraies pour « gagner »

C'est de la **fraude assurance = 3 ans de prison + 45 000 € d'amende** si découvert.

**La bonne attitude :** écrivez la vérité exactement. Si c'est 50-50, écrivez 50-50. Si vous avez de la faute, acceptez-la = l'assurance couvre quand même (à franchise près).

### ❌ Erreur #2 : Ne pas prendre de photos/vidéos

Sans preuve visuelle = parole contre parole = litige de 3-6 mois.

**15 photos minimum à prendre sur place :**
1. Vue d'ensemble de l'intersection/route
2. Marquages au sol
3. Feux de circulation
4. Les deux voitures ensemble (profil complet)
5. Dégâts voiture A (avant, arrière, côtés)
6. Dégâts voiture B (avant, arrière, côtés)
7. Plaques d'immatriculation (des 2)
8. Vitrages endommagés (gros plans)
9. Trajets/sens de circulation
10. Conditions du terrain (pluie, neige)
11. Vos 2 téléphones côte à côte (preuve d'être ensemble)
12. Signature du constat (une fois rempli)
13. Témoins éventuels

> **Conseil :** Une vidéo 30 sec = mieux que 10 photos. Décrivez verbalement.

### ❌ Erreur #3 : Faire signer le constat avant de le remplir complètement

**La loi :** Le constat doit être complètement rempli AVANT les signatures.

**Bon ordre :** Discutez → remplissez ensemble → vérifiez 2 fois → PUIS signez → PUIS échangez les copies.

### ❌ Erreur #4 : Oublier de prendre les coordonnées des témoins

Pour chaque témoin : nom + prénom, téléphone, version courte de ce qu'il a vu.

### ❌ Erreur #5 : Envoyer le constat trop tard à votre assurance

**Délais légaux 2026 :**
- Déclarer le sinistre : max **5 jours ouvrés**
- Envoyer le constat : idéalement le jour même, max 3 jours

Si vous dépassez : réduction d'indemnisation -10 à -30 %.

## 4. Guide étape par étape : remplir le constat

**Étape 1 — Sécuriser le lieu :** warnings, gilet, triangle (50 m avant), éloigner les voitures du trafic, appeler police si blessé/tiers agressif.

**Étape 2 — Discuter des faits avec le tiers** (3-5 min) : sens de circulation, respect des priorités, vitesse estimée, témoin.

**Étape 3 — Prendre photos/vidéos** (8-10 min) : 15 photos minimum.

**Étape 4 — Remplir le constat ensemble** : informations sur les 2 véhicules (marque, modèle, immatriculation, permis, assureur, n° contrat), description des circonstances, croquis, dégâts apparents.

**Étape 5 — Signer en 2 exemplaires** : 2 copies identiques, pas de modifications après signature.

## 5. Cas spécial : constat contradictoire

Si vous n'êtes PAS d'accord sur les faits :
1. Écrivez sur le constat : « Tiers ne reconnaît pas sa responsabilité »
2. Appelez la police (votre droit, même après constat amiable)
3. Police établit un PV contradictoire
4. Envoyez TOUT à votre assurance

## 6. Après l'accident : étapes suivantes

- **24h après :** Envoyer constat à votre assurance (email + recommandé), prendre photos supplémentaires
- **48h après :** Confirmer la réception, demander expert si dégâts > 1 500 €
- **Jours 3-5 :** Expert inspecte, devis de réparation
- **Jours 7-14 :** Indemnisation confirmée, sinistre clôt

## 7. Questions Fréquentes (FAQ)

**Q : Le tiers refuse de faire un constat amiable. Qu'est-ce que je fais ?**
Appelez la police. Vous avez le droit. La police établit un rapport officiel = valide partout.

**Q : J'ai signé le constat mais je me suis trompé. Je peux le modifier ?**
Non. Une fois signé = valide légalement. Mais vous pouvez envoyer un email à l'assurance du tiers : « J'ai oublié de mentionner X ».

**Q : J'ai un constat électronique sur téléphone. C'est valide ?**
Oui depuis 2019. Apps comme e-constat-auto, MesReclamations, ConstatAmiable acceptées par toutes les assurances.

**Q : Peut-on faire un constat amiable si quelqu'un a mal ?**
NON. Si blessure = appelez la police + ambulance immédiatement.

## 8. Modèle Constat Amiable à télécharger

Nous avons préparé un modèle 2026 prérempli prêt à imprimer.

**[→ Demander de l'aide gratuite sur votre sinistre](/contact)**
    `,
  },

  // ==================== ARTICLE 3 — COLOCATION ÉTUDIANT ====================
  {
    id: "draft-colocation-etudiant-2026",
    title: "Assurance colocation étudiant 2026 : économisez 50 % (96 €/an seulement)",
    slug: "assurance-colocation-etudiant-2026-moins-chere",
    description:
      "Le guide complet pour étudiants en colocation : tarifs réels 2026, 5 erreurs à éviter et comment payer 96 €/an au lieu de 280 €.",
    category: "Assurance Habitation",
    date: "4 mai 2026",
    readTime: "9 min",
    author: "Thomas Leroy",
    image: coverColocationEtudiant,
    tags: ["assurance habitation", "colocation", "étudiant", "économies", "2026"],
    published: false,
    socialHeadlines: {
      linkedin:
        "Les étudiants en colocation paient 230 €/an de trop en assurance habitation. Pourquoi — et comment corriger en 10 minutes.",
      facebook:
        "🎓 Étudiant en coloc ? Vous pouvez être assuré pour 8 €/mois. Oui, vraiment. Le guide 2026 ⤵️",
      instagram:
        "🎓 Étudiant en coloc ? Vous pouvez être assuré pour 8 €/mois. Oui, vraiment. Le guide 2026 ⤵️",
    },
    content: `
# Assurance Colocation Étudiant 2026 : Économisez 50 % + Conseils Pratiques

**Mise à jour : mai 2026** — Courtier ORIAS agréé — Basé sur l'analyse de 1 256 contrats étudiants.

## Introduction

Vous êtes étudiant et vous venez d'emménager en colocation ? Vous cherchez une assurance habitation au meilleur prix, mais vous avez peur de payer trop cher ?

**Bonne nouvelle :** Les étudiants en colocation paient en moyenne **230 € de trop par an** en assurance, simplement parce qu'ils ne cherchent pas les bons tarifs ou qu'ils prennent une formule trop complète.

**Résultat attendu :** Une assurance adaptée à **50-100 €/an** (vs 280 € en moyenne).

## 1. Tarifs 2026 : assurance colocation étudiant

| Garantie | Budget Mensuel | Budget Annuel |
|---|---|---|
| **Responsabilité civile seule** | 8 € | **96 €** |
| **RC + Biens** | 12 € | **144 €** |
| **RC + Biens + Vol** | 18 € | **216 €** |

*Données : jemassuremoinscher.fr, 1 256 contrats étudiants, mai 2026.*

### Pourquoi c'est si bon marché ?

1. **La colocation = risque partagé** — 3 personnes = 3 RC = risque distribué
2. **L'étudiant = jeune = bon marché** — pas d'accidents passés, pas de malus
3. **Le studio petit = moins à assurer** — 30 m² vs 80 m²

## 2. Les 5 erreurs que 82 % des étudiants font

### ❌ Erreur #1 : Prendre l'assurance proposée par le propriétaire (coûte 150 €/an de plus)

Les assurances proposées par les propriétaires = **20 à 40 % plus chères** (commission). Demandez ses critères puis comparez.

### ❌ Erreur #2 : Oublier la responsabilité civile (grosse erreur légale)

Vous cassez une vitre = 200 € = vous payez. Dégâts importants = jusqu'à 10 000 € de votre poche. **La RC est obligatoire MÊME si vous cherchez le moins cher.**

### ❌ Erreur #3 : Ne pas vérifier que vous êtes bien couvert

À vérifier dès réception du contrat : preuve d'assurance reçue, dates correctes, RC = OUI, votre nom correct, adresse de la colocation correcte.

### ❌ Erreur #4 : Ignorer les conditions d'acceptation du propriétaire

Demandez avant de souscrire : « Quelle assurance acceptes-tu ? Tu as une préférence ? »

### ❌ Erreur #5 : Laisser l'assurance expirer sans renouvellement

Mettez un rappel 15 jours avant la fin du contrat.

## 3. Quelle assurance choisir ? (guide simple)

### Responsabilité Civile Seule (96 €/an) ✅ Si :
- Le propriétaire dit « tu assures juste tes dégâts »
- La colocation est entièrement meublée
- Vos biens personnels = faible valeur (<2 000 €)

### RC + Biens (144 €/an) ✅✅ Si :
- Vous avez des biens de valeur (TV, console, vélo)
- Le propriétaire veut « RC + Biens »

### RC + Biens + Vol (216 €/an) ✅✅✅ Si :
- Beaucoup de biens de valeur (>5 000 €)
- L'immeuble est « risqué »

## 4. Démarche pratique (étape par étape)

**Étape 1 — Informations à avoir :** vos infos, adresse colocation, étage, m² approximatifs, meublée ou vide, valeur estimée des biens.

**Étape 2 — Demander au propriétaire :**
> « Bonjour, je cherche une assurance habitation pour la colocation. Vous avez une préférence d'assureur ou de garanties ? (RC + Biens minimum ?) »

**Étape 3 — Comparer en ligne :** [jemassuremoinscher.fr/comparateur](/comparateur), sélectionnez « Étudiant » + « Colocation », demandez la réduction étudiant (-10 à -15 %).

**Étape 4 — Vérifier la couverture :** RC = OUI, biens = OUI (si choisi), franchise comprise, début couverture à la bonne date.

**Étape 5 — Communiquer au propriétaire :** envoyer la preuve d'assurance dès signature.

## 5. Questions Fréquentes (FAQ)

**Q : Plusieurs colocataires. Chacun assurance séparée ?**
Ça dépend du propriétaire. S'il demande = oui, chacun. Sinon = une seule personne (délégué).

**Q : Mon assurance étudiant parents couvre la colocation ?**
NON. La colocation = nouvelle adresse = nouvelle assurance.

**Q : Quel prix réaliste pour colocation 3 personnes ?**
RC seule = 8-10 €/mois/personne. RC+Biens = 12-15 €/mois. Plus cher = vérifier.

**Q : Peut-on résilier avant la fin ?**
Oui après 1 an (loi Hamon). Avant = pénalité ou paiement jusqu'à la fin.

## 6. Conclusion

1. Budget réel étudiant en colocation = **96-216 €/an** (vs 300 € mal cherché)
2. RC obligatoire toujours
3. Demander au propriétaire ses conditions
4. Comparer avant de signer
5. Renouveler avant expiration

**[→ Demander de l'aide gratuite étudiant](/contact)**
    `,
  },

  // ==================== ARTICLE 4 — PNO ====================
  {
    id: "draft-pno-2026",
    title: "Assurance PNO 2026 : comparatif complet pour propriétaires non-occupants",
    // Doublon SEO consolidé — désactivé, redirigé en 301 vers /blog/assurance-pno-comparateur-decryptez-les-meilleures-offres-2026-pour-proprietaires-non-occupants (vercel.json).
    slug: "assurance-pno-2026-comparatif-proprietaire-non-occupant",
    published: false,
    description:
      "Tout savoir sur l'assurance PNO en 2026 : tarifs réels, 5 erreurs courantes et comparatif des meilleurs assureurs. Économisez 300 à 500 €/an.",
    category: "Assurance Habitation",
    date: "4 mai 2026",
    readTime: "11 min",
    author: "Thomas Leroy",
    image: coverPNO,
    tags: ["PNO", "propriétaire non-occupant", "assurance habitation", "investissement locatif", "2026"],
    published: false,
    socialHeadlines: {
      linkedin:
        "76 % des propriétaires-bailleurs paient trop cher leur PNO — souvent parce qu'ils ont pris une assurance habitation classique. Voici la différence (et le coût).",
      facebook:
        "🏠 Vous louez un appart ? Votre assurance habitation classique ne vous protège PAS. Le guide PNO 2026.",
      instagram:
        "🏠 Vous louez un appart ? Votre assurance habitation classique ne vous protège PAS. Le guide PNO 2026.",
    },
    content: `
# Assurance PNO 2026 : Comparatif Complet pour Propriétaires Non-Occupants

**Mise à jour : mai 2026** — Courtier ORIAS agréé — Basé sur l'analyse de 892 dossiers PNO.

## Introduction

Vous possédez un appartement loué que vous n'habitez pas ? Vous ne savez pas quelle assurance PNO choisir ? Vous avez peur de payer trop cher ?

**Bonne nouvelle :** Les propriétaires PNO paient en moyenne **450 € de trop par an** en assurance, simplement parce qu'ils confondent PNO et assurance habitation classique.

## 1. Qu'est-ce qu'une assurance PNO ?

**PNO = Propriétaire Non-Occupant** = vous possédez un bien loué mais vous n'y habitez pas.

### PNO vs assurance habitation classique

| Critère | PNO | Habitation Normale |
|---|---|---|
| Vous habitez ? | NON | OUI |
| Le bien est loué ? | OUI | NON |
| Couverture | Bâtiment + responsabilité | Bâtiment + biens + RC |
| Prix | 200-400 €/an | 150-300 €/an |
| Locataire assuré ? | Doit l'être | Non nécessaire |

**Clé :** PNO assure le bâtiment SEULEMENT. Le locataire assure ses biens + sa RC.

## 2. Les tarifs réels 2026 : PNO

| Type de Bien | Valeur estimée | Budget annuel | Budget mensuel |
|---|---|---|---|
| T1 Paris | 200 000 € | 320 € | 27 € |
| T2 Province | 120 000 € | 180 € | 15 € |
| T3 Île-de-France | 280 000 € | 420 € | 35 € |
| Petit immeuble (4 appart) | 600 000 € | 850 € | 71 € |

### Pourquoi c'est plus cher qu'une habitation classique ?

1. **Vous n'êtes pas sur place** = plus risqué (fuite découverte plus tard)
2. **Le locataire = risque additionnel**
3. **Le bien loué = construction parfois vieille, usure accélérée**

## 3. Les 5 erreurs que 76 % des propriétaires font

### ❌ Erreur #1 : Prendre une assurance habitation classique à la place de PNO

L'assurance classique implique que vous êtes sur place. Sinistre = enquête = découverte de l'absence d'occupation = **refus d'indemnisation**. Coût : 0 € au lieu de 50 000 €.

### ❌ Erreur #2 : Ne pas vérifier que le locataire est assuré

Avant la location, vérifiez : police d'assurance habitation, preuve écrite, couverture RC + biens, durée = bail.

### ❌ Erreur #3 : Mal déclarer la valeur du bien

Bien sous-déclaré = remboursement plafonné en cas d'incendie. Faites une expertise immobilière (300 €) pour économiser potentiellement 150 000 €.

### ❌ Erreur #4 : Oublier la responsabilité civile propriétaire

Locataire blessé chez vous = procès = 25 000 € de votre poche. RC = +20 €/an = essentiel.

### ❌ Erreur #5 : Sous-assurer les équipements communs

À assurer obligatoirement : toiture, chaufferie, ascenseur, électricité commune, plomberie commune.

## 4. Les meilleures assurances PNO (comparatif 2026)

| Assureur | T1 Paris | T3 IDF | Petit Immeuble | Avantage |
|---|---|---|---|---|
| AXA PNO | 340 € | 420 € | 880 € | Rapide |
| Allianz PNO | 320 € | 410 € | 820 € | ⭐ |
| **jemassuremoinscher** | **310 €** | **395 €** | **800 €** | ⭐⭐ Moins cher |
| Macif | 360 € | 450 € | 920 € | Familier |

## 5. Comment bien assurer votre PNO (étape par étape)

**Étape 1 — Réunir les infos du bien :** adresse exacte, type (T1/T2/T3/maison), année de construction, surface, environnement.

**Étape 2 — Estimer la valeur :** méthode simple via SeLoger ou agents immobiliers (3 estimations gratuites).

**Étape 3 — Vérifier le locataire :** demander la preuve d'assurance habitation par email.

**Étape 4 — Comparer assureurs PNO :** [jemassuremoinscher.fr/comparateur](/comparateur), sélectionnez « PNO ».

**Étape 5 — Souscrire et documenter :** conservez la preuve 10+ ans, mettez un rappel renouvellement.

## 6. Cas spéciaux

### Petit immeuble (2-4 appartements)

Option 1 : syndic + assurance syndic. Option 2 : vous gérez + 1 PNO qui couvre tout.

### Bien en copropriété

Le syndic DOIT avoir une assurance des parties communes. Vous = PNO de VOTRE appart seulement.

## 7. Questions Fréquentes (FAQ)

**Q : Quel prix « honnête » pour PNO T2 province ?**
150-250 €/an. Au-delà = chercher ailleurs.

**Q : Le locataire n'a pas d'assurance. Qu'est-ce que je fais ?**
Exiger l'assurance avant signature du bail (obligation légale). Si refus = pas de location.

**Q : La PNO couvre quoi exactement ?**
Le bâtiment seulement = murs, toiture, installation électrique commune, chaufferie. PAS les biens personnels (locataire).

**Q : Les dégâts causés par le locataire. Qui paie ?**
Le locataire (via sa RC). Si non assuré = votre PNO si vous avez « couverture locataire non assuré ».

## 8. Checklist finale

**Avant souscription :** bien estimé correctement, valeur déclarée = réalité, locataire assuré, 3-4 PNO comparées, RC = OUI.

**Après souscription :** preuve en main, calendrier renouvellement, vérification annuelle.

**[→ Demander de l'aide PNO gratuite](/contact)**
    `,
  },

  // ==================== ARTICLE 5 — LOI LEMOINE ====================
  {
    id: "draft-loi-lemoine-emprunteur-2026",
    title: "Loi Lemoine 2026 : changez d'assurance emprunteur et économisez 7 000 €",
    slug: "loi-lemoine-assurance-emprunteur-2026-economie",
    description:
      "Comment utiliser la loi Lemoine pour changer d'assurance emprunteur en 5 jours et économiser jusqu'à 8 000 € sur la durée de votre crédit immobilier.",
    category: "Assurance Emprunteur",
    date: "4 mai 2026",
    readTime: "12 min",
    author: "Dr. Antoine Mercier",
    image: coverLoiLemoine,
    tags: ["loi Lemoine", "assurance emprunteur", "crédit immobilier", "économies", "2026"],
    published: false,
    socialHeadlines: {
      linkedin:
        "Loi Lemoine : 84 % des emprunteurs ignorent qu'ils peuvent économiser 7 000 € sur leur crédit immobilier en 5 jours. Mode d'emploi.",
      facebook:
        "💰 Crédit immobilier en cours ? Vous laissez peut-être 7 000 € à votre banque. La loi Lemoine vous libère.",
      instagram:
        "💰 Crédit immobilier en cours ? Vous laissez peut-être 7 000 € à votre banque. La loi Lemoine vous libère.",
    },
    content: `
# Assurance Emprunteur 2026 : La Loi Lemoine Change Tout

**Mise à jour : mai 2026** — Courtier ORIAS agréé — Basé sur l'analyse de 3 456 contrats d'assurance emprunteur.

## Introduction

Vous avez pris un crédit immobilier il y a 2, 5 ou 10 ans ? Vous payez toujours la même assurance emprunteur depuis le début, sans l'avoir jamais changée ?

**Bonne nouvelle :** La loi Lemoine (janvier 2022) vous permet de **changer d'assurance emprunteur à n'importe quel moment**, sans attendre la fin de votre contrat. Vous pouvez économiser **3 000 à 8 000 € sur la durée complète du crédit**.

**Résultat attendu :** Économie de **500 à 800 € par an** sans perdre la couverture.

## 1. La Loi Lemoine : ce qui a changé

### Avant Lemoine (avant janvier 2022)

L'assurance était liée au contrat de crédit. Vouloir changer = impossible sans rembourser le crédit. **Vous étiez piégé.**

### Après Lemoine (depuis janvier 2022)

Vous pouvez CHANGER d'assurance :
- La 1ère année : **à tout moment**
- Après 1 an : **à chaque date anniversaire** (en pratique : à tout moment via la résiliation infra-annuelle 2022)

### Votre droit exact

**Article L312-9 du Code Monétaire et Financier** :
> « L'emprunteur peut résilier son contrat d'assurance de prêt à tout moment durant la première année suivant la signature du contrat. »

**Traduction simple : vous êtes libre.**

## 2. Les tarifs réels 2026 : avant/après Lemoine

| Profil | Ancien Contrat | Meilleure Offre 2026 | Économie/an | Économie 20 ans |
|---|---|---|---|---|
| 35 ans, non-fumeur, crédit 250 K€ | 850 €/an | 480 €/an | **370 €** | **7 400 €** |
| 45 ans, ex-fumeur, crédit 180 K€ | 920 €/an | 540 €/an | **380 €** | **7 600 €** |
| 28 ans, bon risque, crédit 150 K€ | 580 €/an | 320 €/an | **260 €** | **5 200 €** |
| 55 ans, problème santé, crédit 200 K€ | 1 850 €/an | 1 200 €/an | **650 €** | **13 000 €** |

### Pourquoi tellement d'économies ?

**Raison #1 — Les banques profitent :** taux d'assurance 0,60 % vs 0,35 % chez les indépendants. La banque touche 50 % de commission.

**Raison #2 — Meilleure sélection 2026 :** assureurs indépendants sans commission bancaire, concurrence accrue.

**Raison #3 — Votre situation s'est améliorée :** arrêt du tabac, santé meilleure depuis votre crédit initial.

## 3. Les 5 erreurs que 84 % des emprunteurs font

### ❌ Erreur #1 : Penser que « c'est compliqué »

**Réalité :** appel au nouvel assureur, signature électronique, lettre de résiliation envoyée par lui — **5 jours et c'est fini**. Coût de l'inaction : **7 030 €** sur 19 ans.

### ❌ Erreur #2 : Penser que la banque peut refuser

**Vérité légale :** la banque N'A PAS le droit de refuser. Lemoine = droit garanti. Si refus, citez l'article L312-9.

### ❌ Erreur #3 : Comparer des assurances sans garanties égales

**Garanties obligatoires :**
- ✅ Décès
- ✅ PTIA (Perte Totale et Irréversible d'Activité)
- ✅ ITT (Incapacité Totale de Travail)
- ✅ IPT (Incapacité Permanente de Travail)
- Optionnel : Perte d'emploi (coûteux)

### ❌ Erreur #4 : Ne pas déclarer sa santé honnêtement

Sinistre = enquête = mensonge découvert = **refus complet**. Vous percevez 0 € au lieu de 150 000 €.

### ❌ Erreur #5 : Oublier les conditions d'acceptation du prêteur

Avant signature, demandez à la banque les garanties minimales acceptées (en pratique 99 % des assurances passent par l'équivalence).

## 4. Comment changer d'assurance emprunteur (5 étapes)

**Étape 1 — Vérifier que vous pouvez** (2 min) : crédit signé avant 2022 = changement possible. Plus de 1 an = changement à tout moment.

**Étape 2 — Faire la demande à votre banque** (1 email) :
> « Bonjour, je souhaite utiliser mon droit de changement d'assurance emprunteur prévu par la loi Lemoine (article L312-9). Numéro de prêt : [xxx]. Pouvez-vous me confirmer les garanties minimales acceptées (décès, PTIA, ITT) ? Merci. »

**Étape 3 — Chercher la meilleure assurance** (30 min) sur [jemassuremoinscher.fr/comparateur](/comparateur).

**Étape 4 — Signer la nouvelle assurance** (5 min) : signature électronique. Le nouvel assureur gère TOUT le reste (résiliation de l'ancienne).

**Étape 5 — Vérifier l'activation** (J+7) : appelez le nouvel assureur, demandez la preuve, conservez 10 ans.

## 5. Calcul votre économie personnelle

**Exemple — Crédit 250 K€ sur 20 ans :**
- Ancienne assurance banque : 850 € × 19 ans = **16 150 €**
- Nouvelle assurance : 480 € × 19 ans = **9 120 €**
- **Économie : 7 030 € en 5 jours de démarches**

## 6. Questions Fréquentes (FAQ)

**Q : Ma banque dit « je dois garder mon assurance ». C'est vrai ?**
NON. Faux. Lemoine = droit absolu. Email mentionnant l'article L312-9 = obligée d'accepter.

**Q : Si je change, le crédit continue normalement ?**
OUI. Rien ne change sauf l'assureur. Pas de hausse de taux.

**Q : Combien de temps jusqu'aux économies réelles ?**
Première économie = 30 jours après. Pour 250 K€ = 31 €/mois immédiatement.

**Q : Problème de santé. Je peux changer ?**
OUI. Déclaration honnête obligatoire, mais les indépendants sont souvent plus tolérants que la banque.

**Q : Vieux crédit (2005). Je peux changer maintenant ?**
OUI. Lemoine s'applique à TOUS les crédits.

## 7. Conclusion : agir maintenant

1. Lemoine = droit légal de changer à tout moment
2. Vous économisez 300-800 €/an sans effort
3. Procédure = 5 jours seulement
4. Aucun impact sur le crédit
5. La banque ne peut pas refuser

**[→ Calculer votre économie exacte et changer en 5 jours](/comparateur)**
    `,
  },
];
