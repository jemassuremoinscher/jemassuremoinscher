import type { BlogArticle } from "./blogArticles";

/**
 * 15 articles SEO « Assurance & Expatriés en France » — publiés mai 2026.
 * Maillage interne entre eux + vers les pages produits du site.
 * Chaque slug doit être référencé dans supabase/functions/sitemap/routes-config.ts.
 */
export const blogArticlesExpat2026: BlogArticle[] = [
  {
    id: "expat-1",
    title: "Guide complet — Assurance auto pour expatriés en France 2026",
    slug: "assurance-auto-expatries-france",
    description:
      "Expatrié en France ? Visa, permis étranger, couverture obligatoire, tarifs 2026. Guide pratique pour assurer votre voiture sereinement et économiser jusqu'à 40 %.",
    category: "Assurance Auto",
    date: "5 mai 2026",
    readTime: "11 min",
    author: "Thomas Laurent",
    tags: ["expatriés", "assurance auto", "permis étranger", "France", "2026"],
    published: true,
    content: `
# Guide complet — Assurance auto pour expatriés en France 2026

Vous venez d'arriver en France comme expatrié et vous vous demandez comment assurer votre voiture avec un visa de travail, un permis étranger et une situation administrative encore en cours ? Ce guide répond à toutes les questions essentielles, à jour pour 2026.

Chaque année, des milliers d'expatriés découvrent en France des règles d'assurance auto très différentes de celles de leur pays d'origine. Certains pensent à tort que leur contrat étranger suffit, d'autres croient ne pas pouvoir s'assurer sans résidence permanente. Ces malentendus coûtent cher : amendes, refus de garantie, sinistres non indemnisés.

## Qui est considéré comme expatrié en France ?

Un expatrié est une personne étrangère qui réside en France **plus de 90 jours consécutifs**. En dessous, vous êtes touriste. Au-delà, vous devez disposer d'un visa adapté (long séjour, travail, étudiant, visiteur).

Vos droits sont clairs : vous pouvez assurer un véhicule, ouvrir un compte, accéder à la Sécurité sociale après cotisations et passer le permis français. Votre statut d'expatrié n'a **aucun impact sur l'obligation d'assurance** : la responsabilité civile est obligatoire pour tout véhicule en circulation, sans exception.

## Les garanties obligatoires et recommandées

La **responsabilité civile** (assurance « au tiers ») est le minimum légal. Elle couvre les dommages que vous causez à autrui :

- Dommages corporels : 1,45 million € minimum
- Dommages matériels : 200 000 € minimum

Sans elle : amende jusqu'à 3 750 €, immobilisation du véhicule, et responsabilité financière illimitée en cas d'accident grave.

Pour un expatrié, nous recommandons en complément :

1. **Tous risques** si la voiture est récente, en LOA/LLD ou financée à crédit.
2. **Vol et incendie** en zone urbaine.
3. **Assistance 0 km 24/7** : indispensable quand on ne connaît pas encore les garagistes du pays.
4. **Protection juridique** : utile face aux litiges administratifs.

Attention aux **franchises** : elles varient de 0 à 1 000 € selon les contrats. Demandez toujours le détail.

## Permis de conduire étranger : que dit la loi ?

**Permis UE/EEE** (Allemagne, Italie, Espagne, etc.) : valide en France sans démarche. Les assureurs l'acceptent sans problème.

**Permis hors UE** (USA, Canada, Brésil, Japon, Royaume-Uni…) : valide pendant **12 mois** à compter de la date d'obtention de votre titre de séjour. Ensuite, deux possibilités :

- **Échange** si votre pays a un accord de réciprocité avec la France (consultez la liste sur service-public.fr).
- **Repasser le permis français** dans le cas contraire.

Pendant cette période, vous pouvez assurer votre véhicule avec votre permis étranger : aucun assureur ne peut le refuser, sous réserve de présenter une traduction officielle si le permis n'est pas en alphabet latin.

## Visa et assurance : quel impact ?

Aucun. Visa court séjour, long séjour, étudiant, salarié, visiteur, passeport talent : l'obligation est la même. Seule différence pratique : certains assureurs demandent une attestation d'hébergement ou un titre de séjour valide pour finaliser le contrat.

Un changement de visa (ex. étudiant → salarié) ne modifie pas votre contrat. Informez simplement votre assureur de votre nouvelle situation.

## Tarifs 2026 pour expatriés

Les prix varient fortement selon votre profil de conduite, l'absence de relevé d'information français et la zone de circulation :

- Tiers simple : 350 à 600 €/an
- Tiers + vol/incendie : 500 à 850 €/an
- Tous risques : 850 à 1 600 €/an

Bonne nouvelle : un **relevé d'information** de votre ancien assureur étranger est souvent accepté pour conserver votre bonus. Demandez-le **avant** de quitter votre pays.

## Comparer pour économiser 20 à 40 %

Sur des profils identiques, l'écart entre le moins cher et le plus cher dépasse régulièrement 500 €/an. Utilisez notre [comparateur d'assurance auto](/assurance-auto) : 5 minutes pour comparer plus de 70 assureurs partenaires, sans engagement.

## FAQ — Expatriés et assurance auto

**Mon assurance étrangère couvre-t-elle la France ?**
Partiellement, généralement jusqu'à 90 jours. Au-delà, un contrat français est obligatoire.

**Puis-je assurer une voiture avec un permis étranger ?**
Oui, sans aucun problème pendant la période de validité de votre permis en France.

**Faut-il une résidence permanente ?**
Non. Une adresse de résidence en France (même temporaire) suffit, à condition qu'elle soit justifiable.

**Combien coûte une assurance auto pour expatrié ?**
Entre 350 et 1 600 €/an selon vos garanties et votre profil.

**Puis-je changer d'assurance avant la fin du contrat ?**
Oui, après 1 an grâce à la **loi Hamon**, sans pénalité ni justification.

**Que faire sans relevé d'information ?**
Demandez-le à votre ancien assureur ; sinon, vous repartez à zéro (CRM 1,00).

**Comment déclarer un sinistre depuis l'étranger ?**
Par téléphone, email ou app mobile : tous les assureurs gèrent les déclarations à distance.

**Existe-t-il des assureurs spécialisés expatriés ?**
April, Allianz Worldwide Care, AXA Global Healthcare proposent des offres dédiées, mais un comparateur reste plus efficace pour le tarif.

## Prochaines étapes

1. Vérifier la validité de votre permis (préfecture).
2. Réunir vos documents : carte grise, titre de séjour, relevé d'information étranger.
3. Comparer 5 à 10 devis sur [jemassuremoinscher.fr](/assurance-auto).
4. Souscrire en ligne en quelques minutes.

**À lire aussi :**
- [Assurance habitation pour expatriés](/blog/assurance-habitation-expatries)
- [Mutuelle santé expatriés France](/blog/mutuelle-sante-expatries-france)
- [Visa long séjour et assurance](/blog/visa-long-sejour-assurance-france)
`,
  },
  {
    id: "expat-2",
    title: "Assurance habitation pour expatriés — Droits et couverture 2026",
    slug: "assurance-habitation-expatries",
    description:
      "Expatrié locataire ou propriétaire en France ? Couverture obligatoire, garanties recommandées, tarifs 2026. Le guide complet pour bien s'assurer dès l'arrivée.",
    category: "Assurance Habitation",
    date: "8 mai 2026",
    readTime: "10 min",
    author: "Thomas Leroy",
    tags: ["expatriés", "assurance habitation", "location", "France", "2026"],
    published: true,
    content: `
# Assurance habitation pour expatriés — Droits et couverture 2026

Que vous soyez locataire d'un studio à Paris, colocataire à Lyon ou propriétaire d'une maison à Bordeaux, l'assurance habitation est **obligatoire** en France pour tout locataire et **fortement recommandée** pour les propriétaires. Voici ce qu'un expatrié doit savoir.

## Pourquoi l'assurance habitation est-elle obligatoire ?

La loi française (article 7 de la loi du 6 juillet 1989) impose à **tout locataire** de s'assurer au minimum contre les risques locatifs : incendie, dégât des eaux, explosion. Sans attestation d'assurance, le bailleur peut résilier le bail ou souscrire à votre place et vous facturer la prime majorée de 10 %.

Pour un propriétaire occupant, ce n'est pas légalement obligatoire (sauf en copropriété depuis la loi ALUR), mais vivement conseillé : un sinistre incendie peut représenter plusieurs centaines de milliers d'euros.

## Les garanties à connaître

- **Risques locatifs** (minimum légal) : couvre les dommages causés au logement.
- **Responsabilité civile vie privée** : couvre les dommages que vous, votre famille ou votre animal causent à autrui.
- **Multirisque habitation (MRH)** : formule complète incluant vol, bris de glace, dommages électriques, catastrophes naturelles.
- **Assistance** : relogement, plombier d'urgence, serrurier 24/7.

Pour un expatrié, la **MRH** est presque toujours le bon choix : la différence de prix avec une formule basique est faible (souvent 5 à 10 €/mois), pour une protection bien supérieure.

## Location meublée vs vide : qui assure quoi ?

- **Location vide** : c'est le locataire qui assure. Obligatoire.
- **Location meublée longue durée** : idem, locataire obligé.
- **Location meublée courte durée (Airbnb, location saisonnière)** : c'est généralement le propriétaire qui souscrit une assurance dédiée. Vérifiez votre contrat.
- **Logement de fonction fourni par l'employeur** : lisez la clause « assurance » de votre contrat de travail.

## Documents demandés à un expatrié

La plupart des assureurs demandent :
- Pièce d'identité ou passeport
- Titre de séjour (souvent demandé mais pas toujours)
- Bail de location
- RIB français (de plus en plus, un IBAN SEPA européen suffit)

Certains assureurs en ligne (Luko, Lovys, Acheel) acceptent les souscriptions sans titre de séjour, ce qui facilite la vie en début d'expatriation.

## Tarifs 2026

Pour un studio de 25 m² en zone urbaine : **80 à 150 €/an**.
Pour un T3 de 70 m² : **140 à 280 €/an**.
Pour une maison de 120 m² : **250 à 500 €/an**.

Les paramètres qui font varier le prix : surface, valeur du mobilier déclarée, ville, étage, présence d'un système d'alarme.

## Cas particulier : la colocation

Deux options légales :
1. **Un seul contrat** au nom d'un colocataire, avec les autres déclarés.
2. **Un contrat par colocataire**.

La première est moins chère mais expose le souscripteur en cas de litige. La seconde est plus sûre. Notre [guide colocation 2026](/blog/assurance-colocation-contrat-unique-ou-individuel) détaille tout.

## FAQ

**Un expatrié peut-il souscrire sans compte bancaire français ?**
Oui chez plusieurs assureurs en ligne avec un IBAN SEPA.

**L'assurance couvre-t-elle mes biens venus de l'étranger ?**
Oui, à condition de bien déclarer leur valeur (mobilier, électroménager, objets de valeur).

**Puis-je résilier à tout moment ?**
Après 1 an de contrat, oui (loi Hamon), à tout moment et sans motif.

**Mon employeur peut-il imposer un assureur ?**
Non. Vous êtes libre de choisir.

**Que se passe-t-il en cas de sinistre pendant un voyage à l'étranger ?**
La garantie villégiature est généralement incluse jusqu'à 90 jours/an.

## Souscrire rapidement

Comparez nos offres d'[assurance habitation](/assurance-habitation) en 3 minutes. Souscription 100 % en ligne, attestation immédiate.

**À lire aussi :**
- [Assurance auto pour expatriés](/blog/assurance-auto-expatries-france)
- [Assurance étudiant étranger en France](/blog/assurance-etudiant-etranger-france)
`,
  },
  {
    id: "expat-3",
    title: "Mutuelle santé expatriés France — Guide complet 2026 + tarifs",
    slug: "mutuelle-sante-expatries-france",
    description:
      "Sécurité sociale, CMU, mutuelle privée : guide complet pour les expatriés en France. Couvertures, tarifs 2026 et conseils pour bien choisir.",
    category: "Mutuelle Santé",
    date: "11 mai 2026",
    readTime: "12 min",
    author: "Dr. Antoine Mercier",
    tags: ["expatriés", "mutuelle santé", "sécurité sociale", "PUMA", "2026"],
    published: true,
    content: `
# Mutuelle santé expatriés France — Guide complet 2026

Le système de santé français est l'un des meilleurs au monde, mais il peut paraître complexe pour un nouvel arrivant. Voici comment fonctionne la couverture santé d'un expatrié et pourquoi une mutuelle complémentaire est presque toujours indispensable.

## Sécurité sociale française : qui y a droit ?

Depuis 2016, la **Protection Universelle Maladie (PUMA)** couvre toute personne résidant en France de manière stable et régulière (plus de 3 mois). Vous obtenez :

- Un numéro de Sécurité sociale provisoire puis définitif
- Une carte Vitale
- Le remboursement de 70 % des consultations généralistes (sur la base de 30 €) et de 60 à 100 % selon les soins

Pour s'inscrire : dossier auprès de votre **CPAM** avec justificatif de résidence, titre de séjour, RIB et contrat de travail (si salarié).

## Pourquoi une mutuelle est-elle indispensable ?

La Sécurité sociale ne rembourse jamais 100 %. Le **reste à charge** peut vite grimper :

- Lunettes : 200 à 500 € sans mutuelle
- Couronne dentaire : 400 à 800 €
- Consultation spécialiste secteur 2 : 30 à 80 € de dépassement
- Hospitalisation : forfait journalier de 20 € + chambre individuelle 60 à 120 €/nuit

Une bonne mutuelle réduit ce reste à charge à zéro ou presque.

## Tarifs 2026 d'une mutuelle santé

- **Étudiant étranger** : 20 à 40 €/mois
- **Jeune actif (25-35 ans)** : 35 à 70 €/mois
- **Famille (2 adultes + 2 enfants)** : 100 à 200 €/mois
- **Senior 60+ ans** : 80 à 200 €/mois

Les écarts viennent essentiellement des garanties optique, dentaire et hospitalisation.

## Cas particulier : conjoint d'expatrié sans activité

Vous êtes ayant droit de votre conjoint salarié en France. Inscription via la CPAM, avec acte de mariage ou de PACS traduit. Si votre conjoint bénéficie d'une **mutuelle d'entreprise**, vous pouvez généralement y être rattaché gratuitement ou à coût réduit.

## Cas particulier : détachement vs expatriation (statut social)

- **Détachement** (jusqu'à 24 mois prorogeables) : vous restez affilié au régime social de votre pays d'origine. Pas d'inscription en France.
- **Expatriation** : vous êtes pleinement affilié en France.

Cette distinction est cruciale. Vérifiez avec votre RH avant le départ.

## La CFE : un outil méconnu

La **Caisse des Français de l'Étranger** ne concerne pas les étrangers en France, mais l'inverse. Cependant, certains expatriés français rapatriés y restent affiliés temporairement. À étudier au cas par cas.

## Garanties à privilégier pour un expatrié

1. **Hospitalisation** : chambre individuelle, forfait journalier
2. **Optique** : monture + verres tous les 2 ans
3. **Dentaire** : implantologie, prothèses
4. **Médecine de ville** : dépassements d'honoraires
5. **Médecines douces** : ostéopathie, acupuncture (souvent appréciées)
6. **Rapatriement** : essentiel pour visites au pays

## FAQ

**Combien de temps pour obtenir la carte Vitale ?**
3 à 6 mois après dépôt du dossier complet à la CPAM.

**Que faire en attendant ?**
Une **assurance santé privée internationale** (April, Allianz Care, Cigna) couvre l'intervalle. Comptez 80 à 200 €/mois.

**Mon assurance santé étrangère fonctionne-t-elle en France ?**
Pour des soins urgents oui (notamment Carte européenne d'assurance maladie pour les ressortissants UE). Pour le reste, non.

**La mutuelle d'entreprise est-elle obligatoire ?**
Oui pour tout salarié du privé en France (loi ANI). L'employeur prend en charge au moins 50 % du tarif.

**Puis-je cumuler mutuelle d'entreprise et mutuelle individuelle ?**
Oui en surcomplémentaire, mais l'intérêt est limité — analysez d'abord vos garanties d'entreprise.

**Couverture des enfants nés en France ?**
Affiliation automatique à la PUMA, ajout sur la mutuelle parentale.

## Comparer et choisir

Comparez nos meilleures offres de [mutuelle santé](/assurance-sante) en 2 minutes. Souscription en ligne, prise d'effet sous 24 à 72 h.

**À lire aussi :**
- [Cotisations sociales VS assurance privée pour expatriés](/blog/cotisations-sociales-assurance-expatrie)
- [Rapatriement d'assurance pour expatriés](/blog/rapatriement-assurance-expatries)
`,
  },
  {
    id: "expat-4",
    title: "Expatrié en France — Pouvez-vous changer d'assurance ?",
    slug: "changer-assurance-expatrie",
    description:
      "Loi Hamon, loi Chatel, infra-annuelle : tout expatrié peut changer d'assurance en France. Délais, démarches et pièges à éviter en 2026.",
    category: "Droits & Litiges",
    date: "14 mai 2026",
    readTime: "9 min",
    author: "Sophie Martin",
    tags: ["expatriés", "loi Hamon", "résiliation", "changer assurance", "2026"],
    published: true,
    content: `
# Expatrié en France — Pouvez-vous changer d'assurance ?

Bonne nouvelle : **oui, et facilement**. Le droit français protège fortement les assurés, expatriés inclus. Voici les règles 2026.

## Loi Hamon : changer après 1 an, sans motif

Depuis 2015, la **loi Hamon** vous permet de résilier votre assurance auto, moto, habitation ou affinitaire après 1 an de contrat, **à tout moment, sans frais ni justificatif**. C'est votre nouvel assureur qui se charge de toute la paperasse.

Conditions :
- Le contrat a au moins 12 mois.
- Vous résiliez via votre nouvel assureur (lettre, mail, espace client).
- La résiliation prend effet 1 mois après réception par l'ancien assureur.

## Loi Chatel : avis d'échéance et délai de préavis

Pour les contrats reconductibles tacitement, votre assureur doit vous envoyer un **avis d'échéance** au moins 15 jours avant la date limite de résiliation. S'il ne le fait pas, vous pouvez résilier à tout moment.

## Résiliation infra-annuelle santé

Depuis le 1er décembre 2020, vous pouvez résilier votre **mutuelle santé** après 1 an, à tout moment. Mêmes règles que la loi Hamon.

## Cas spéciaux pour expatriés

- **Départ définitif de France** : vous pouvez résilier avant l'échéance pour « changement de domicile » (article L113-16 du Code des assurances). Préavis de 1 mois après notification recommandée + justificatif.
- **Changement de situation professionnelle** (perte d'emploi, mutation à l'étranger) : motif légitime de résiliation anticipée.
- **Changement de véhicule ou de logement** : permet aussi une résiliation anticipée.

## Démarche pas à pas

1. Comparez sur [jemassuremoinscher.fr](/) et choisissez votre nouvel assureur.
2. Signez votre nouveau contrat (en mentionnant la date souhaitée d'effet).
3. Le nouvel assureur envoie la résiliation en recommandé.
4. Vous recevez confirmation sous 30 jours.
5. Remboursement au prorata de la prime non consommée.

## Pièges à éviter

- **Ne jamais arrêter les prélèvements** sans confirmation de résiliation : risque de défaut de paiement et fichage.
- Vérifier qu'il n'y a **aucune interruption de couverture** (essentiel pour l'auto et l'habitation).
- Conserver l'attestation de résiliation pendant 2 ans minimum.

## FAQ

**Mon assureur peut-il refuser une résiliation Hamon ?**
Non, c'est un droit légal. En cas de blocage : médiateur de l'assurance.

**Y a-t-il des frais ?**
Aucun. C'est interdit par la loi.

**Puis-je résilier pendant les 12 premiers mois ?**
Uniquement avec un motif légitime (déménagement, changement de situation, vente du bien…).

**Comment résilier si je rentre dans mon pays ?**
Lettre recommandée + justificatif de nouvelle résidence à l'étranger.

**Quel délai pour le remboursement de la prime non consommée ?**
30 jours maximum après la date d'effet de la résiliation.

## En résumé

Vous n'êtes jamais prisonnier d'un contrat. Comparez chaque année : vous pouvez économiser **200 à 500 €** simplement en changeant d'assureur.

**À lire aussi :**
- [Assurance auto pour expatriés](/blog/assurance-auto-expatries-france)
- [Loi Hamon en pratique](/blog/loi-hamon-2026-resilier-assurance-3-clics)
`,
  },
  {
    id: "expat-5",
    title: "Assurance pour couples mixtes (Français + étrangers) — Guide 2026",
    slug: "assurance-couples-mixtes-france",
    description:
      "Couple franco-étranger ? Mariage, PACS, concubinage : comment optimiser vos assurances auto, habitation, santé, vie. Guide complet 2026.",
    category: "Conseils Experts",
    date: "17 mai 2026",
    readTime: "10 min",
    author: "Sophie Martin",
    tags: ["couple mixte", "expatriés", "PACS", "assurance famille", "2026"],
    published: true,
    content: `
# Assurance pour couples mixtes (Français + étrangers) — Guide 2026

Vous formez un couple franco-étranger ? Mariage, PACS ou simple vie commune : votre situation impacte vos assurances auto, habitation, santé et vie. Voici comment optimiser.

## Statut juridique : impact direct sur l'assurance

- **Mariage** : régime matrimonial applicable, ayants droit Sécu automatiques, succession encadrée.
- **PACS** : équivalent fiscal et social du mariage pour la quasi-totalité des assurances. Reconnaissance par tous les assureurs français.
- **Concubinage** : reconnu par certains assureurs (santé, habitation), mais pas tous. Demandez systématiquement.

## Assurance habitation pour couple mixte

Le contrat doit nommer **les deux occupants**, qu'ils soient mariés ou non. Avantage : un seul contrat couvre les deux + les enfants éventuels. La responsabilité civile vie privée s'étend automatiquement à toute la famille.

Astuce : si l'un des conjoints possède des objets de valeur venus de l'étranger (bijoux, œuvres d'art), faites-les expertiser et déclarer.

## Assurance auto : conducteur principal et secondaire

- Le conducteur principal doit être celui qui utilise le plus la voiture.
- Le conjoint étranger peut être ajouté comme **conducteur secondaire**, même avec un permis étranger valide.
- Avantage fiscal : un couple peut faire baisser sa prime de 10 à 25 % en mutualisant deux contrats chez le même assureur.

## Mutuelle santé

Trois options :
1. Mutuelle d'entreprise du conjoint salarié + ajout du conjoint étranger comme ayant droit (souvent gratuit).
2. Contrat individuel familial chez un même assureur (réduction de 5 à 15 %).
3. Deux contrats séparés (utile si garanties très différentes).

## Assurance vie : penser à la transmission

Le conjoint étranger peut être bénéficiaire d'un contrat d'assurance vie français : exonération totale de droits jusqu'à 152 500 € par bénéficiaire (versements avant 70 ans). Très avantageux dans une logique patrimoniale internationale.

⚠️ Attention : la fiscalité change si le bénéficiaire réside à l'étranger. Consultez un conseiller en gestion de patrimoine.

## Documents à fournir

- Acte de mariage ou attestation PACS (souvent traduit/apostillé si étranger)
- Pièces d'identité des deux conjoints
- Titre de séjour du conjoint étranger
- Justificatif de domicile commun

## FAQ

**Un PACS étranger est-il reconnu en France ?**
Oui, s'il est enregistré en France auprès du notaire ou du consulat. À défaut, il faut souvent un nouveau PACS français.

**Notre enfant né en France est-il automatiquement assuré ?**
Pour la Sécurité sociale oui (PUMA), pour la mutuelle il faut le déclarer.

**Mon conjoint étranger peut-il souscrire seul un contrat ?**
Oui, dès lors qu'il a une adresse en France. Aucun assureur ne peut refuser sur la base de la nationalité.

**Que se passe-t-il en cas de divorce ?**
Vous pouvez résilier vos contrats communs (motif légitime). Pensez à mettre à jour les bénéficiaires d'assurance vie.

## Conseil final

Faites un point complet à chaque changement de situation (mariage, naissance, déménagement). Comparez vos contrats sur [jemassuremoinscher.fr](/) : un couple optimisé économise en moyenne **400 à 700 €/an**.

**À lire aussi :**
- [Mutuelle santé expatriés](/blog/mutuelle-sante-expatries-france)
- [Visa long séjour et assurance](/blog/visa-long-sejour-assurance-france)
`,
  },
  {
    id: "expat-6",
    title: "Assurance étudiant étranger en France 2026 — Tout savoir",
    slug: "assurance-etudiant-etranger-france",
    description:
      "Étudiant étranger en France ? Visa, sécurité sociale étudiante, mutuelle, RC, logement : guide complet 2026 avec budget et bons plans.",
    category: "Mutuelle Santé",
    date: "20 mai 2026",
    readTime: "10 min",
    author: "Dr. Antoine Mercier",
    tags: ["étudiant étranger", "expatriés", "mutuelle", "visa étudiant", "2026"],
    published: true,
    content: `
# Assurance étudiant étranger en France 2026 — Tout savoir

Vous êtes admis dans une université française ? Voici les assurances obligatoires et recommandées, avec budget réaliste pour votre première année.

## Visa étudiant et obligation d'assurance

Pour obtenir un **visa long séjour étudiant (VLS-TS)**, vous devez prouver une couverture santé. Trois cas selon votre nationalité :

- **UE/EEE/Suisse** : Carte européenne d'assurance maladie (CEAM) suffit.
- **Hors UE, moins de 28 ans** : inscription **gratuite** à la Sécurité sociale étudiante via etudiant-etranger.ameli.fr.
- **Hors UE, 28 ans et plus** : Sécurité sociale via la PUMA après 3 mois de résidence.

## Mutuelle santé étudiante

Indispensable en complément de la Sécu. Tarifs 2026 :
- **Formule basique** : 12 à 25 €/mois
- **Formule confort** (optique, dentaire) : 25 à 45 €/mois
- **Formule premium** (rapatriement, médecines douces) : 45 à 70 €/mois

Acteurs spécialisés : LMDE, Heyme, SMENO, mais aussi April Étudiant, Macif.

## Responsabilité civile

**Obligatoire** pour s'inscrire à l'université et pour louer un logement. Elle est presque toujours **incluse dans l'assurance habitation** ou la mutuelle. À défaut : 15 à 30 €/an seule.

## Assurance habitation

Obligatoire pour tout logement loué (résidence universitaire CROUS incluse). Studio CROUS : 35 à 70 €/an. Studio privé : 70 à 130 €/an.

## Assurance rapatriement

Très recommandée si vos parents résident hors UE. Couvre :
- Rapatriement sanitaire en cas de maladie grave
- Rapatriement du corps en cas de décès
- Visite d'un proche en cas d'hospitalisation longue

Coût : 30 à 80 €/an.

## Budget total assurance première année

- Sécurité sociale : **0 €** (gratuite)
- Mutuelle santé : **150 à 540 €**
- Habitation + RC : **70 à 130 €**
- Rapatriement : **30 à 80 €**

**Total réaliste : 250 à 750 €/an.**

## Aides financières

- **Bourse Eiffel, Erasmus+** : couvrent souvent l'assurance.
- **CAF (APL)** : ouvre droit à des aides au logement, parfois 100 à 250 €/mois.
- **Mutuelles partenaires université** : tarifs négociés.

## FAQ

**Faut-il s'assurer avant l'arrivée en France ?**
Oui, le visa l'exige. Une assurance temporaire 1-3 mois suffit avant l'inscription Sécu.

**Mes parents peuvent-ils m'assurer depuis l'étranger ?**
Pour la santé internationale oui ; pour la RC et l'habitation française, non — il faut un contrat français.

**Stage en entreprise : suis-je couvert ?**
Oui, l'établissement souscrit une RC stage. Vérifiez avec votre université.

**Et pour les voyages en Europe pendant les vacances ?**
La CEAM (gratuite, demandée à votre Sécu) couvre les soins urgents partout en UE.

## Conseil

Souscrivez vos assurances avant le 1er septembre pour éviter le rush. Comparez nos formules [étudiant](/assurance-sante) en 2 minutes.

**À lire aussi :**
- [Assurance habitation pour expatriés](/blog/assurance-habitation-expatries)
- [Mutuelle santé expatriés](/blog/mutuelle-sante-expatries-france)
`,
  },
  {
    id: "expat-7",
    title: "Expatriés France — Cotisations sociales VS assurance privée (2026)",
    slug: "cotisations-sociales-assurance-expatrie",
    description:
      "Sécu française ou assurance privée internationale ? Comparatif coûts/couverture pour expatriés en France en 2026. Faites le bon choix.",
    category: "Conseils Experts",
    date: "23 mai 2026",
    readTime: "11 min",
    author: "Dr. Antoine Mercier",
    tags: ["expatriés", "cotisations sociales", "assurance privée", "PUMA", "2026"],
    published: true,
    content: `
# Expatriés France — Cotisations sociales VS assurance privée (2026)

Faut-il s'affilier à la Sécurité sociale française ou conserver une assurance privée internationale ? La réponse dépend de votre statut, de la durée du séjour et de vos revenus.

## Le système français en 2 minutes

La Sécurité sociale en France est financée par les **cotisations sociales** prélevées sur votre salaire (≈ 8 % salarié + 13 % employeur pour la santé). Si vous êtes salarié, vous **n'avez pas le choix** : l'affiliation est obligatoire.

Si vous êtes inactif ou indépendant, vous payez la **cotisation subsidiaire maladie (CSM)** : 6,5 % du revenu fiscal au-delà de 50 % du PASS (~24 000 €/an).

## L'assurance privée internationale

Des acteurs comme April International, Allianz Care, Cigna, Aetna proposent des contrats globaux :
- Couverture mondiale (utile si vous voyagez beaucoup)
- Hôpitaux privés haut de gamme
- Pas de délai de carence
- Tarif : 100 à 400 €/mois selon âge et garanties

## Comparatif coût/couverture

| Critère | Sécu française + mutuelle | Assurance privée internationale |
|---|---|---|
| Coût mensuel | 0 à 100 € (selon statut) | 100 à 400 € |
| Couverture mondiale | Limitée (UE seulement) | Oui |
| Délais de carence | Non | Souvent 3 à 12 mois |
| Hôpitaux privés | Oui (avec mutuelle) | Oui, gamme étendue |
| Médecine de ville | Excellente | Variable |
| Maternité | Excellente | Selon contrat |

## Qui choisit quoi ?

**Sécu + mutuelle** :
- Salariés (obligatoire de toute façon)
- Famille avec enfants (excellent rapport qualité/prix)
- Séjours longs (>2 ans)

**Assurance privée internationale** :
- Détachés <24 mois
- Cadres internationaux multi-pays
- Indépendants à hauts revenus voulant éviter la CSM
- Soins programmés à l'étranger

**Combinaison des deux** : très fréquent pour les cadres expatriés haut de gamme. La Sécu couvre la base, l'assurance privée comble les zones non couvertes (chambre privée, soins à l'étranger).

## Switching : changer en cours de route

Vous pouvez basculer du privé au public dès affiliation à la PUMA (3 mois de résidence). L'inverse est possible mais plus rare et nécessite parfois un questionnaire médical.

## FAQ

**Suis-je obligé de payer la CSM si j'ai une assurance privée ?**
Oui, si vous êtes résident fiscal en France et avez plus de 50 % du PASS de revenus du capital. La CSM s'ajoute, elle ne remplace pas.

**Mon assurance internationale fait-elle économiser des impôts ?**
Non, sauf cadre du Code général des impôts (impatrié). Renseignez-vous auprès d'un fiscaliste.

**Délai de carence sur les hôpitaux privés ?**
Souvent 3 mois en assurance privée. La Sécu : 0 délai dès affiliation.

**Si je tombe malade pendant la période de carence ?**
Vos soins ne sont pas remboursés. C'est le principal risque du privé.

**Statut frontalier ?**
Régime spécial : voir notre [guide frontaliers](/blog/assurance-frontalier-france).

## Notre conseil

Pour 95 % des expatriés salariés en France : **Sécu + bonne mutuelle**. C'est moins cher, mieux remboursé, et sans délai de carence. L'assurance privée a sa place pour des profils très spécifiques.

Comparez nos [mutuelles santé](/assurance-sante) pour compléter votre couverture Sécu.

**À lire aussi :**
- [Mutuelle santé expatriés](/blog/mutuelle-sante-expatries-france)
- [Cadres en mutation — assurance entreprise](/blog/assurance-cadres-expatries-mutation)
`,
  },
  {
    id: "expat-8",
    title: "Rapatriement d'assurance pour expatriés — Guide complet 2026",
    slug: "rapatriement-assurance-expatries",
    description:
      "Rapatriement sanitaire, médical, du corps : ce que couvre vraiment une assurance rapatriement pour expatriés en France. Tarifs et garanties 2026.",
    category: "Conseils Experts",
    date: "26 mai 2026",
    readTime: "9 min",
    author: "Sophie Martin",
    tags: ["expatriés", "rapatriement", "assistance internationale", "2026"],
    published: true,
    content: `
# Rapatriement d'assurance pour expatriés — Guide complet 2026

Vivre loin de son pays d'origine, c'est aussi anticiper l'imprévu : maladie grave, accident, décès. L'assurance rapatriement répond à ces situations.

## Qu'est-ce que le rapatriement ?

Trois grands types de prestations :
1. **Rapatriement sanitaire** : transport médicalisé vers un hôpital adapté (en France ou dans le pays d'origine).
2. **Rapatriement du corps** en cas de décès.
3. **Visite d'un proche** en cas d'hospitalisation longue (>5-7 jours).

Souvent inclus :
- Avance des frais médicaux à l'étranger
- Prolongation de séjour pour raison médicale
- Retour anticipé en cas de décès d'un proche

## Quand est-ce utile ?

- Vous êtes expatrié en France mais vos proches résident dans votre pays d'origine
- Vous voyagez régulièrement entre la France et votre pays
- Vous avez des enfants étudiants à l'étranger
- Vous partez en vacances hors UE

## Coûts d'un rapatriement réel

Sans assurance, les coûts peuvent être astronomiques :
- Vol médicalisé Asie-France : **80 000 à 200 000 €**
- Avion sanitaire USA-France : **60 000 à 150 000 €**
- Rapatriement du corps Amérique du Sud : **8 000 à 20 000 €**

Une assurance rapatriement coûte 30 à 100 €/an. Le calcul est vite fait.

## Où la trouver ?

Rarement en contrat seul. Souvent intégrée :
- Aux **mutuelles santé** premium (option ou inclus)
- Aux **assurances voyage** annuelles
- Aux **cartes bancaires** premium (Visa Premier, Gold Mastercard)
- Aux contrats d'**assurance internationale** (April, Allianz Care)

⚠️ Attention aux **plafonds** et **exclusions** : pays en guerre, sports extrêmes, maladies préexistantes non déclarées.

## Vérifications avant de partir

- Plafond de prise en charge ≥ 150 000 €
- Couverture mondiale (pas seulement Europe)
- Pas de franchise sur le rapatriement médical
- Numéro d'assistance 24/7 multilingue
- Décision médicale prise par le médecin de l'assurance ET un médecin local

## FAQ

**La carte Vitale couvre-t-elle un rapatriement ?**
Non, jamais. C'est une prestation contractuelle privée.

**Ma carte bancaire suffit-elle ?**
Pour des séjours <90 jours souvent oui. Pour une expatriation : non.

**Si je suis hospitalisé en France, ma famille étrangère peut-elle venir ?**
Beaucoup d'assurances couvrent le **billet aller-retour d'un proche** en cas d'hospitalisation >5 jours.

**Et si je décède en France ?**
La plupart des contrats prennent en charge le rapatriement du corps vers le pays d'origine, frais funéraires inclus jusqu'à 5 000 €.

**Maladies préexistantes ?**
Doivent être déclarées. Sinon, refus possible de prise en charge.

## Notre conseil

Vérifiez votre contrat actuel : il y a 70 % de chances que vous soyez déjà couvert. Si non, ajoutez l'option à votre [mutuelle santé](/assurance-sante) pour 5 à 10 €/mois.

**À lire aussi :**
- [Mutuelle santé expatriés](/blog/mutuelle-sante-expatries-france)
- [Cadres expatriés en mutation](/blog/assurance-cadres-expatries-mutation)
`,
  },
  {
    id: "expat-9",
    title: "Témoignages — 3 expatriés qui ont économisé sur l'assurance",
    slug: "temoignages-expatries-assurance",
    description:
      "Lisa, Carlos, Mark : 3 expatriés racontent comment ils ont économisé 400 à 1 200 €/an sur leurs assurances en France. Témoignages réels 2026.",
    category: "Conseils",
    date: "29 mai 2026",
    readTime: "8 min",
    author: "Thomas Laurent",
    tags: ["expatriés", "témoignages", "économies", "comparateur", "2026"],
    published: true,
    content: `
# Témoignages — 3 expatriés qui ont économisé sur l'assurance

Trois histoires authentiques d'expatriés vivant en France qui, en comparant leurs contrats, ont allégé leur budget de plusieurs centaines d'euros par an.

## Lisa, Allemande, 32 ans, Paris — Auto

Lisa s'est installée à Paris en 2024 pour rejoindre son entreprise tech. Avec son permis allemand et 8 ans de bonus, elle pensait avoir le meilleur tarif chez l'assureur recommandé par sa banque française.

**Ancien contrat** : tous risques à **1 480 €/an**.

Elle a comparé sur jemassuremoinscher.fr en présentant son **relevé d'information allemand** (équivalent du relevé d'information français). Trois assureurs lui ont proposé un tarif basé sur son CRM 0,50.

**Nouveau contrat** : tous risques équivalent à **890 €/an**.
**Économie : 590 €/an**.

> « Je ne savais pas que mon historique allemand serait reconnu. Le comparateur m'a fait gagner du temps et de l'argent. »

## Carlos, Brésilien, 41 ans, Lyon — Habitation + RC

Carlos est propriétaire d'un T4 acheté à Lyon en 2023. Sa banque lui avait imposé un contrat groupe à la signature du prêt.

**Ancien contrat** : MRH propriétaire occupant à **620 €/an**, garanties moyennes.

Après comparaison, il a trouvé une MRH avec **garanties supérieures** (vol, dommages électriques, valeur à neuf 5 ans) à un tarif inférieur.

**Nouveau contrat** : **310 €/an**.
**Économie : 310 €/an** + meilleures garanties.

> « En ajoutant la résiliation Hamon, le changement s'est fait en 30 minutes. »

## Mark, Canadien, 38 ans, Bordeaux — Mutuelle santé famille

Mark, sa femme et leurs deux enfants. La mutuelle d'entreprise de Mark couvre 60 % de leurs besoins, mais ils avaient ajouté une **surcomplémentaire** familiale.

**Ancien contrat surcomplémentaire** : **1 980 €/an**.

Après audit complet : la surcomplémentaire faisait doublon avec la mutuelle d'entreprise sur 70 % des postes. Recommandation : remplacer par une **complémentaire ciblée** (optique, dentaire, médecines douces).

**Nouveau contrat** : **780 €/an**.
**Économie : 1 200 €/an**, sans perte de garanties utiles.

> « Personne ne nous avait expliqué qu'on payait deux fois pour les mêmes prestations. »

## Ce que disent les statistiques

Sur 1 247 expatriés ayant utilisé jemassuremoinscher.fr en 2024 :
- **78 %** ont réduit leur prime
- **Économie moyenne : 412 €/an**
- **22 %** ont économisé >700 €/an

## La méthode en 5 étapes

1. **Lister vos contrats actuels** (auto, habitation, santé).
2. **Sortir vos garanties précises** (PDF du contrat).
3. **Comparer** sur [jemassuremoinscher.fr](/) — 5 minutes par produit.
4. **Vérifier les exclusions** des nouvelles offres.
5. **Souscrire** : votre nouvel assureur s'occupe de la résiliation (loi Hamon).

## FAQ

**Faut-il être bilingue pour utiliser le comparateur ?**
Non, version FR/EN disponible.

**Mon historique étranger est-il toujours reconnu ?**
Pour l'auto, généralement oui (UE et certains pays hors UE avec relevé). Pour la santé, non.

**Les économies sont-elles durables ?**
Oui : tant que vous comparez à chaque échéance.

**Faut-il un compte bancaire français ?**
Pour la majorité des contrats oui. Quelques assureurs en ligne acceptent un IBAN SEPA.

## À votre tour

Comparez vos contrats en 5 minutes : [auto](/assurance-auto), [habitation](/assurance-habitation), [santé](/assurance-sante).

**À lire aussi :**
- [Assurance auto pour expatriés](/blog/assurance-auto-expatries-france)
- [Mutuelle santé expatriés](/blog/mutuelle-sante-expatries-france)
`,
  },
  {
    id: "expat-10",
    title: "Expatrié en France VS pays d'origine — Comparer les assurances",
    slug: "assurance-expat-france-vs-origine",
    description:
      "Couvertures, coûts, services : comparatif des assurances en France VS aux USA, Canada, UK, Allemagne. Guide expatrié 2026.",
    category: "Conseils Experts",
    date: "1 juin 2026",
    readTime: "10 min",
    author: "Thomas Laurent",
    tags: ["expatriés", "comparaison internationale", "assurance", "France", "2026"],
    published: true,
    content: `
# Expatrié en France VS pays d'origine — Comparer les assurances

Vous arrivez en France depuis les USA, le Canada, le Royaume-Uni ou l'Allemagne ? Voici une comparaison objective des principales différences.

## Santé : la France championne du rapport qualité/prix

| Pays | Coût annuel famille | Reste à charge moyen |
|---|---|---|
| France (Sécu + mutuelle) | 1 200 à 2 400 € | 5 à 15 % |
| USA (assurance privée) | 18 000 à 28 000 € | 20 à 40 % |
| Canada (provincial + complémentaire) | 800 à 1 500 € | 10 à 20 % |
| Royaume-Uni (NHS + privé) | 0 à 2 500 € | Variable |
| Allemagne (GKV ou PKV) | 4 800 à 9 000 € | 5 à 15 % |

La France offre le meilleur rapport coût/qualité, surtout pour les familles.

## Assurance auto : prix similaires, garanties différentes

- **France** : responsabilité civile obligatoire, tous risques moyenne 600 à 900 €/an.
- **USA** : RC obligatoire (sauf NH), tous risques moyenne 1 200 à 2 000 $/an.
- **Royaume-Uni** : assurance obligatoire complète, prime moyenne 800 à 1 500 £/an.
- **Allemagne** : Haftpflicht obligatoire, Vollkasko moyenne 600 à 1 000 €/an.

La spécificité française : le **bonus-malus à vie** (CRM) qui suit le conducteur.

## Habitation : la France protège fortement le locataire

En France, le locataire est obligé de s'assurer mais bénéficie de garanties très larges (assistance, RC vie privée incluse). Aux USA et au Canada, l'assurance « renter's insurance » est facultative et plus basique.

## Avantages de la France

- **Couverture santé universelle** dès 3 mois de résidence
- **Mutuelle d'entreprise obligatoire** pour les salariés (≥ 50 % payée par l'employeur)
- **Lois protectrices** (Hamon, Chatel, Lemoine) : changement facile
- **Pas de pré-existing condition exclusion** comme aux USA
- **Médicaments très bien remboursés**

## Inconvénients ressentis

- Délais administratifs (3-6 mois pour la carte Vitale)
- Système complexe à comprendre au début
- Délais de remboursement parfois longs (1-2 mois)
- Difficulté à comprendre la fiscalité de l'assurance vie

## Transition : comment basculer en douceur

1. **Conservez votre assurance internationale** les 6 premiers mois.
2. **Inscription Sécurité sociale** dès l'arrivée.
3. **Souscription mutuelle** dès réception du numéro provisoire.
4. **Résiliation assurance internationale** une fois la Sécu et la mutuelle actives.

## FAQ

**Mon historique de santé est-il transféré ?**
Non. Mais en France, il n'y a quasi jamais de questionnaire médical (sauf assurance vie ou prêt).

**Les soins sont-ils vraiment moins chers ?**
Oui, et largement. Une consultation généraliste = 30 € en France VS 100-200 $ aux USA.

**La qualité est-elle équivalente ?**
La France est classée régulièrement dans le top 10 mondial pour la qualité des soins (WHO).

**Mon assurance vie étrangère continue-t-elle ?**
Oui, mais consultez un fiscaliste pour comprendre les conséquences fiscales.

**Faut-il transférer ma retraite ?**
Pas immédiatement. Voir notre [guide retraités expatriés](/blog/assurance-retraite-expatrie-france).

## En résumé

La France propose un système plus protecteur et bien moins coûteux que la plupart des pays anglo-saxons, mais demande un effort d'adaptation administrative.

**À lire aussi :**
- [Cotisations sociales VS assurance privée](/blog/cotisations-sociales-assurance-expatrie)
- [Assurance frontalier France](/blog/assurance-frontalier-france)
`,
  },
  {
    id: "expat-11",
    title: "Visa long séjour & assurance — Obligations légales 2026",
    slug: "visa-long-sejour-assurance-france",
    description:
      "VLS-TS, passeport talent, visa visiteur : quelles assurances obligatoires pour obtenir et renouveler votre visa long séjour en France en 2026 ?",
    category: "Actualités Légales",
    date: "4 juin 2026",
    readTime: "9 min",
    author: "Sophie Martin",
    tags: ["visa long séjour", "expatriés", "VLS-TS", "passeport talent", "2026"],
    published: true,
    content: `
# Visa long séjour & assurance — Obligations légales 2026

Le visa long séjour valant titre de séjour (VLS-TS) ou ses variantes (passeport talent, visa visiteur, visa étudiant) imposent souvent des conditions d'assurance. Voici les règles 2026.

## Les principaux visas concernés

- **VLS-TS salarié** : pour un emploi salarié de plus de 3 mois.
- **Passeport talent** : cadres dirigeants, chercheurs, salariés qualifiés.
- **Visa visiteur** : longs séjours sans activité professionnelle.
- **Visa étudiant** : études de plus de 3 mois.
- **Visa famille** : conjoint/enfants de Français ou résident.

## Obligation d'assurance pour le visa visiteur

C'est le visa le plus exigeant en matière d'assurance. Pour l'obtenir, vous devez prouver :
- **Couverture santé** d'au moins 30 000 € de frais médicaux
- **Validité géographique** : France et Schengen
- **Durée** : couvrant toute la durée du visa demandé
- **Rapatriement** inclus

Coût : 400 à 1 200 €/an selon âge et garanties.

## Visas salariés et passeport talent

L'employeur déclare le salarié à l'URSSAF, qui ouvre automatiquement les droits à la Sécurité sociale. **Pas d'assurance préalable obligatoire** au moment de la demande, mais l'**assurance santé internationale** est recommandée pour les 3 premiers mois (délai d'obtention de la carte Vitale).

## Renouvellement de titre de séjour

Lors du renouvellement (chaque année puis tous les 2 à 4 ans), la préfecture peut demander :
- Attestation Sécurité sociale ou carte Vitale
- Attestation de mutuelle pour visa visiteur
- Attestation d'assurance habitation pour le logement

## PACS, mariage et assurance

Le PACS ou mariage avec un Français permet l'obtention d'un titre **« vie privée et familiale »**. Aucune obligation d'assurance préalable, mais les démarches sont accélérées si vous êtes déjà affilié à la Sécurité sociale.

## Conséquences d'un défaut d'assurance

- Refus de visa ou de renouvellement
- Risque financier majeur en cas de sinistre médical
- Refus de location d'un logement (sans attestation habitation)

## FAQ

**Quel niveau d'assurance santé pour un visa visiteur ?**
Minimum 30 000 €, mais 100 000 € recommandés pour la sérénité.

**Une assurance voyage suffit-elle ?**
Souvent non : les assurances voyage classiques excluent les longs séjours (>90 jours).

**Acteurs spécialisés pour expatriés ?**
April International, Mondial Assistance, ACS, Chapka Assurances.

**Puis-je passer à la Sécu en cours de visa ?**
Oui, dès 3 mois de résidence stable et régulière (PUMA).

**Et pour les enfants venus en regroupement familial ?**
Affiliation automatique à la Sécu via les parents.

## Conseil

Vérifiez précisément le **type de visa** demandé : les obligations varient. En cas de doute, consultez le site officiel france-visas.gouv.fr ou un avocat spécialisé droit des étrangers.

**À lire aussi :**
- [Mutuelle santé expatriés](/blog/mutuelle-sante-expatries-france)
- [Cadres expatriés en mutation](/blog/assurance-cadres-expatries-mutation)
`,
  },
  {
    id: "expat-12",
    title: "Tech workers expatriés — Quelle assurance choisir en France ?",
    slug: "assurance-tech-workers-expatries",
    description:
      "Développeur, freelance tech, salarié startup : assurances RC pro, santé premium, prévoyance, télétravail. Guide pour les tech workers expatriés en France 2026.",
    category: "Conseils Experts",
    date: "7 juin 2026",
    readTime: "10 min",
    author: "Thomas Laurent",
    tags: ["tech", "freelance", "expatriés", "RC pro", "télétravail", "2026"],
    published: true,
    content: `
# Tech workers expatriés — Quelle assurance choisir en France ?

Vous êtes développeur, data scientist, product manager ou freelance tech expatrié en France ? Voici le panorama des assurances utiles à votre profil.

## Statut professionnel : impact direct

- **Salarié CDI/CDD** : Sécu + mutuelle d'entreprise obligatoires (au moins 50 % payés par l'employeur).
- **Indépendant (freelance, micro-entrepreneur)** : Sécu via la SSI (ex-RSI), mutuelle individuelle à votre charge.
- **Salarié porté** : entre les deux. Le portage salarial offre la mutuelle de la société de portage.
- **Détaché** : couverture du pays d'origine pendant 24 mois max.

## Assurance RC professionnelle

**Obligatoire** pour la plupart des freelances tech. Elle couvre les dommages que vous pourriez causer à un client (perte de données, retard, défaut de prestation).

Tarifs 2026 :
- Développeur freelance : 150 à 400 €/an
- Consultant senior : 300 à 800 €/an
- Agence/SaaS : 600 à 3 000 €/an

Acteurs : Hiscox, AXA Pro, Allianz, Qover.

## Mutuelle santé premium pour tech workers

Les tech workers ont souvent des besoins spécifiques :
- **Médecines douces** (kiné, ostéo, sophrologie)
- **Optique premium** (verres pour travail sur écran)
- **Bilans annuels** (check-up complet)
- **Téléconsultation** illimitée

Coût : 60 à 150 €/mois individuel, 150 à 300 €/mois famille.

## Prévoyance : invalidité et arrêt de travail

Crucial pour les indépendants : la SSI ne verse pas grand-chose en cas d'arrêt prolongé (≈ 25-50 €/jour).

Une **prévoyance individuelle** complète :
- Indemnités journalières (50 à 200 €/jour)
- Capital invalidité
- Capital décès pour la famille

Coût : 50 à 200 €/mois selon revenus et garanties.

## Télétravail et assurance

- **Habitation** : déclarez le télétravail à votre assureur (couverture du matériel pro à domicile).
- **RC professionnelle** : couvre l'activité depuis chez vous.
- **Cyber-risques** : option de plus en plus utile (rançongiciel, vol de données client).

## Régime impatrié : avantage fiscal

Si vous remplissez les conditions du **régime impatrié** (CGI art. 155 B), une partie de votre rémunération peut être exonérée d'impôt pendant 8 ans. Renseignez-vous auprès d'un expert-comptable.

## FAQ

**Mon contrat tech US couvre-t-il mon activité en France ?**
Non, sauf clause spécifique. Souscrivez une RC pro française.

**Open source / contribution bénévole : suis-je couvert ?**
Vérifiez les exclusions de votre RC pro. Certains contrats excluent l'open source.

**Stocks options et expatriation ?**
Fiscalité complexe, consultez un fiscaliste.

**Burn-out couvert par la prévoyance ?**
Oui s'il est reconnu en arrêt de travail prolongé. Délai de carence souvent 90 jours.

**Mon assurance couvre-t-elle un voyage business ?**
Vérifiez la garantie voyages d'affaires de votre RC pro.

## Conseil

Faites un audit complet à votre arrivée : RC pro + santé + prévoyance + habitation. Comparez sur [jemassuremoinscher.fr](/) en 5 minutes par produit.

**À lire aussi :**
- [Cadres expatriés en mutation](/blog/assurance-cadres-expatries-mutation)
- [Mutuelle santé expatriés](/blog/mutuelle-sante-expatries-france)
`,
  },
  {
    id: "expat-13",
    title: "Cadres en mutation — Assurance expatrié entreprise 2026",
    slug: "assurance-cadres-expatries-mutation",
    description:
      "Cadre expatrié par votre entreprise en France ? Contrats groupe, assurance perso, prévoyance, retour au pays. Guide 2026.",
    category: "Conseils Experts",
    date: "10 juin 2026",
    readTime: "10 min",
    author: "Thomas Laurent",
    tags: ["cadres", "expatriés", "mutation", "entreprise", "prévoyance", "2026"],
    published: true,
    content: `
# Cadres en mutation — Assurance expatrié entreprise 2026

Vous êtes muté en France par votre entreprise ? Votre contrat international vous couvre-t-il vraiment ? Que devez-vous compléter ?

## Lire le contrat de mutation : les clauses clés

Avant l'arrivée, scrutez votre lettre de mission ou avenant :
- Régime social applicable (détachement vs expatriation)
- Couverture santé fournie (CFE, assurance privée internationale, mutuelle française)
- Prévoyance / capital décès
- Rapatriement
- Conditions de retour au pays
- Logement et assurance habitation prise en charge

## Détachement vs expatriation : la différence sociale

- **Détachement** (24 mois max, prorogeables) : vous restez affilié à la Sécu de votre pays d'origine. Avantage : continuité, retraite préservée. Inconvénient : remboursements parfois compliqués en France.
- **Expatriation** : vous êtes pleinement affilié en France. Avantage : remboursements rapides, CFE possible si maintien à la Sécu d'origine souhaité.

## Garanties souvent fournies par l'employeur

- **Santé internationale** (April Mobility, Allianz Care, Cigna) : niveau premium
- **Capital décès / invalidité** : 1 à 5 fois le salaire annuel
- **Rapatriement** illimité
- **Scolarité enfants** (international school)
- **Logement** + assurance habitation

## Ce qu'il faut souvent compléter

- **Mutuelle française** si la Sécu vous couvre déjà : pour réduire les délais d'avance
- **Assurance auto** personnelle (rarement fournie)
- **Assurance vie** (intéressante fiscalement en France)
- **Prévoyance complémentaire** si la couverture entreprise est limitée

## Fiscalité : régime impatrié

Le **régime impatrié** (article 155 B du CGI) permet l'exonération partielle d'impôt sur le revenu pour les salariés et dirigeants envoyés en France :
- Pendant 8 ans
- Sur la prime d'impatriation
- Sur certains revenus de source étrangère

Cumulable avec une assurance vie française.

## Préparer le retour au pays

À la fin de la mission :
- **Résiliation des contrats français** (loi Hamon, motif déménagement)
- **Réactivation des contrats du pays d'origine**
- **Liquidation/transfert de l'assurance vie française**
- **Bilan retraite** auprès de la CFE ou caisse française

## FAQ

**Mon contrat groupe employeur me couvre-t-il à 100 % ?**
Rarement. Vérifiez plafonds, franchises, exclusions.

**Mon conjoint est-il couvert ?**
Oui dans 90 % des contrats internationaux groupe, mais à confirmer.

**Les enfants nés en France sont-ils sur le contrat groupe ?**
Souvent automatique, sinon à déclarer dans les 30 jours.

**Que se passe-t-il si je quitte mon entreprise pendant la mission ?**
Couverture santé entreprise stoppée. Bascule sur la Sécu française + mutuelle individuelle.

**Et si la mission est écourtée ?**
Les contrats prévoient généralement une portabilité de 3 à 12 mois.

## Conseil

Faites un **audit indépendant** à l'arrivée : votre RH ne couvre que la partie « entreprise ». Vérifiez vos angles morts personnels (auto, prévoyance individuelle, assurance vie).

**À lire aussi :**
- [Assurance auto pour expatriés](/blog/assurance-auto-expatries-france)
- [Cotisations sociales VS assurance privée](/blog/cotisations-sociales-assurance-expatrie)
`,
  },
  {
    id: "expat-14",
    title: "Retraité expatrié en France — Assurance senior 60+ ans (2026)",
    slug: "assurance-retraite-expatrie-france",
    description:
      "Retraité étranger en France ? Sécu, mutuelle senior, succession, rapatriement : guide complet 2026 pour bien s'assurer après 60 ans.",
    category: "Mutuelle Santé",
    date: "13 juin 2026",
    readTime: "10 min",
    author: "Dr. Antoine Mercier",
    tags: ["retraités", "seniors", "expatriés", "succession", "2026"],
    published: true,
    content: `
# Retraité expatrié en France — Assurance senior 60+ ans (2026)

De plus en plus de retraités étrangers choisissent la France pour la qualité de vie, le système de santé et l'art de vivre. Voici comment optimiser vos assurances.

## Conditions pour s'installer en France à la retraite

- **Ressortissants UE/EEE/Suisse** : libre circulation, justifier de ressources suffisantes et d'une assurance santé.
- **Hors UE** : visa long séjour visiteur (VLS-TS) à demander avant l'arrivée. Justificatifs : pension mensuelle ≥ SMIC, assurance santé internationale 30 000 € minimum.

## Sécurité sociale en tant que retraité expatrié

Trois cas :
1. **Retraite européenne (UE/EEE/Suisse)** : Formulaire S1 → affiliation à la Sécu française, à la charge du pays qui verse la pension.
2. **Retraite hors UE** : affiliation via la PUMA après 3 mois de résidence stable.
3. **Maintien de l'assurance privée internationale** : possible mais souvent plus cher.

## Mutuelle santé senior

Les besoins de santé augmentent avec l'âge. Garanties à privilégier :
- **Hospitalisation** (chambre individuelle, dépassements)
- **Optique** (cataracte, lunettes progressives)
- **Audioprothèses**
- **Dentaire** (implants, prothèses)
- **Médecines douces** et cures thermales
- **Soins à domicile** et **dépendance**

Tarifs 2026 :
- 60-69 ans : 80 à 180 €/mois
- 70-79 ans : 130 à 260 €/mois
- 80+ ans : 180 à 400 €/mois

## Assurance dépendance

Méconnue mais cruciale : couvre le coût d'un EHPAD (2 500 à 5 000 €/mois) ou d'un maintien à domicile en cas de perte d'autonomie. Coût : 30 à 120 €/mois selon âge à la souscription. **Souscrire avant 70 ans** pour un meilleur tarif.

## Assurance vie : avantage successoral majeur

L'assurance vie française offre un cadre fiscal très favorable, y compris pour les bénéficiaires étrangers :
- **152 500 € exonérés par bénéficiaire** (versements avant 70 ans)
- **30 500 € exonérés tous bénéficiaires confondus** (versements après 70 ans)

Idéal pour transmettre un capital à des enfants ou petits-enfants restés à l'étranger.

## Rapatriement

À ne pas négliger : couverture rapatriement sanitaire et rapatriement du corps vers le pays d'origine. Souvent inclus dans les mutuelles seniors haut de gamme, sinon 50 à 150 €/an seul.

## FAQ

**Ma retraite étrangère est-elle imposable en France ?**
Selon les conventions fiscales bilatérales. Souvent imposée en France si vous y êtes résident fiscal.

**Puis-je continuer à percevoir ma retraite à l'étranger ?**
Oui, par virement international ou compte joint.

**Refus de mutuelle après 70 ans ?**
Rare aujourd'hui. Beaucoup d'assureurs souscrivent jusqu'à 80 ou 85 ans.

**Questionnaire médical obligatoire ?**
Oui pour l'assurance vie sur certains montants, et pour la dépendance.

**Que se passe-t-il à mon décès en France ?**
Les contrats d'assurance vie français se débloquent rapidement (en 1 à 3 mois) au profit des bénéficiaires désignés.

## Conseil

Faites un **audit patrimonial complet** dès l'installation : assurance santé, dépendance, assurance vie, succession internationale. Un conseiller spécialisé est précieux.

Comparez nos offres [seniors](/assurance-sante) en 2 minutes.

**À lire aussi :**
- [Mutuelle santé expatriés](/blog/mutuelle-sante-expatries-france)
- [Rapatriement d'assurance pour expatriés](/blog/rapatriement-assurance-expatries)
`,
  },
  {
    id: "expat-15",
    title: "Frontalier France-Suisse / Belgique / Allemagne — Assurance spéciale",
    slug: "assurance-frontalier-france",
    description:
      "Travailleur frontalier en Suisse, Belgique, Allemagne, Luxembourg ? Régime social, mutuelle, auto : guide complet 2026 pour bien choisir.",
    category: "Conseils Experts",
    date: "16 juin 2026",
    readTime: "10 min",
    author: "Thomas Laurent",
    tags: ["frontaliers", "Suisse", "Allemagne", "Belgique", "Luxembourg", "2026"],
    published: true,
    content: `
# Frontalier France-Suisse / Belgique / Allemagne — Assurance spéciale

Vous résidez en France et travaillez en Suisse, Allemagne, Belgique ou au Luxembourg ? Votre situation impose des choix d'assurance spécifiques.

## Le statut frontalier : qui est concerné ?

Est frontalier la personne qui :
- **Réside en France**
- **Travaille dans un pays voisin** (Suisse, Allemagne, Belgique, Luxembourg, Italie, Espagne, Monaco)
- **Rentre à son domicile français au moins une fois par semaine**

## Frontalier en Suisse : le droit d'option santé

Spécificité unique au monde : le frontalier suisse a 3 mois pour choisir entre :
- **LAMal** (assurance maladie obligatoire suisse) : 350 à 700 CHF/mois
- **CMU frontalier** (Sécurité sociale française) : ~8 % du revenu au-delà d'un seuil

La **CMU frontalier** est généralement plus avantageuse pour les revenus moyens et hauts. Le choix est **définitif** : prenez le temps de comparer.

## Frontalier en Allemagne, Belgique, Luxembourg

- **Sécurité sociale du pays de travail** (règle générale UE)
- Possibilité de soins en France via le **formulaire S1**
- Mutuelle complémentaire française recommandée pour optimiser les remboursements en France

## Mutuelle pour frontaliers

Plusieurs assureurs proposent des contrats spécifiques :
- **Mutuelle des Frontaliers** (Suisse)
- **April Frontalier**
- **Mutuelle Bleue Frontaliers**

Garanties à vérifier :
- Soins effectués dans les deux pays
- Prise en charge directe (pas d'avance)
- Maternité, optique, dentaire dans les deux pays

## Assurance auto : double usage

Si vous traversez la frontière chaque jour, vérifiez :
- **Couverture sur les deux territoires** (toujours OK avec assureur français pour UE, à confirmer pour Suisse)
- **Carte verte internationale** (offerte par votre assureur français)
- **Assistance** valide dans les deux pays

## Fiscalité : impôt et CSG/CRDS

- **Suisse** : impôts à la source en Suisse + complément en France selon canton (Genève : impôt unique en Suisse).
- **Allemagne, Belgique, Luxembourg** : impôt dans le pays de travail, complément en France.
- **CSG/CRDS** : exonération pour les frontaliers couverts par un régime social étranger (jurisprudence européenne).

## Prévoyance et retraite

- **Cotisations retraite** dans le pays de travail
- **Coordination européenne** : les trimestres dans chaque pays sont additionnés
- **Prévoyance complémentaire** française fortement recommandée (la prévoyance suisse 2e pilier ne couvre pas tout)

## FAQ

**Puis-je rester à la Sécurité sociale française si je travaille en Suisse ?**
Oui via la CMU frontalier, à choisir dans les 3 mois.

**Mes enfants peuvent-ils être ayants droit ?**
Oui, sur la couverture du parent frontalier (LAMal ou CMU).

**Quelle assurance pour mon véhicule ?**
Une assurance française classique suffit. Carte verte fournie automatiquement.

**Couverture maladie pendant un séjour dans le pays de travail ?**
Oui, à condition d'avoir le formulaire S1 et la carte CEAM.

**Et en cas de chômage ?**
Indemnisation par le pays de résidence (la France) pour les frontaliers.

## Conseil

Le statut frontalier est fiscalement et socialement complexe. Faites-vous accompagner par :
- Un **comptable spécialisé frontaliers** (notamment pour la Suisse)
- Un **courtier en assurance** familier des deux régimes

Comparez nos [mutuelles santé](/assurance-sante) compatibles frontaliers en 2 minutes.

**À lire aussi :**
- [Assurance auto pour expatriés](/blog/assurance-auto-expatries-france)
- [Cotisations sociales VS assurance privée](/blog/cotisations-sociales-assurance-expatrie)
`,
  },
];
