# Audit SEO du groupe trottinette — 3 octobre 2026 (lecture seule)

Aucune redirection créée, aucune page supprimée, aucun fichier du site modifié. Données brutes : `trottinette-audit.json` (titres, meta, liens entrants/sortants, montants, similarités).

**Méthode.** HTML servi en production pour chaque URL (title, meta description, H1, H2 et mots comptés dans `<main>`, canonical, robots, types JSON-LD, liens internes sortants). Liens ENTRANTS : occurrences de l'URL dans `src/`, `index.html` et le contenu des 148 articles en base (les listes du blog, générées, ne sont pas comptées). Sitemap : https://www.jemassuremoinscher.fr/sitemap.xml (323 URL). « Intention » et « requête probable » : déduites du slug, du title et du H1 (je n'ai pas les données Search Console). « € non sourcés » : montants en euros dans une phrase sans source citée.

## 1. Les 29 URL du groupe

| # | Type | URL | Statut | Title | H1 | Mots | H2 | Intention | Requête probable | noindex | Sitemap | Snapshot | JSON-LD | Liens in / out | € non sourcés |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | page | /assurance-trottinette | 200 | Assurance Trottinette Électrique 2026 : Comparateur EDPM dès 2,90€/moi | Assurance trottinette électrique | 1193 | 11 | EDPM-gyroroue | assurance EDPM / gyroroue / hoverboard | non | oui | oui | BreadcrumbList, Dataset, FAQPage, HowTo, InsuranceProduct, WebPage | 15 / 11 | 8 |
| 2 | page | /assurance-trottinette-livreur | 200 | Assurance Trottinette Livreur Uber Eats / Deliveroo 2026 | Assurance Trottinette Livreur : un contrat qui couvre la liv | 755 | 9 | livreur | assurance trottinette livreur | non | oui | oui | BreadcrumbList, FAQPage | 6 / 2 | 0 |
| 3 | page | /landing/trottinette | 200 | Assurance Trottinette Électrique : Devis dès 2,90€/mois (RC seule) | Assurance Trottinette électrique | 62 | 2 | prix | prix / tarif assurance trottinette électrique | oui | non | non | BreadcrumbList, WebPage | 2 / 4 | 1 |
| 4 | article base | …/assurance-trottinette-electrique-le-comparatif-ultime-pour-2026 | 200 | Assurance Trottinette Électrique : Le Comparatif Ultime pour 2026 | Assurance Trottinette Électrique : Le Comparatif Ultime pour | 2169 | 1 | comparaison | comparatif assurance trottinette électrique | non | oui | non | Article, BreadcrumbList | 0 / 3 | 1 |
| 5 | article base | …/comparateur-assurance-trottinette-electrique-trouvez-la-meilleure-offre-2026-sans-effort | 200 | Comparateur Assurance Trottinette Électrique : Trouvez la Meilleure Of | Comparateur Assurance Trottinette Électrique : Trouvez la Me | 2936 | 0 | comparaison | comparatif assurance trottinette électrique | non | oui | non | Article, BreadcrumbList | 0 / 3 | 14 |
| 6 | article base | …/assurance-trottinette-en-ligne-le-guide-complet-pour-une-protection-optimale-en-2026 | 200 | Assurance Trottinette en Ligne : Le Guide Complet pour une Protection  | Assurance Trottinette en Ligne : Le Guide Complet pour une P | 1904 | 0 | devis | devis assurance trottinette électrique | non | oui | non | Article, BreadcrumbList | 0 / 3 | 6 |
| 7 | article base | …/comparatif-assurance-trottinette-electrique-2026-le-guide-ultime-pour-choisir-la-meilleure-couverture | 200 | Comparatif assurance trottinette électrique 2026 : Le guide ultime pou | Comparatif assurance trottinette électrique 2026 : Le guide  | 2251 | 8 | comparaison | comparatif assurance trottinette électrique | non | oui | non | Article, BreadcrumbList | 0 / 3 | 17 |
| 8 | article base | …/assurance-trottinette-electrique-livreur-2026-le-guide-indispensable | 200 | Assurance Trottinette Électrique Livreur 2026 : Le Guide Indispensable | Assurance Trottinette Électrique Livreur 2026 : Le Guide Ind | 2420 | 9 | livreur | assurance trottinette livreur | non | oui | non | Article, BreadcrumbList | 0 / 7 | 8 |
| 9 | article base | …/assurance-trottinette-la-moins-chere-en-2026-le-guide-ultime-pour-economiser | 200 | Assurance Trottinette La Moins Chère en 2026 : Le Guide Ultime pour Éc | Assurance Trottinette La Moins Chère en 2026 : Le Guide Ulti | 2920 | 9 | prix | prix / tarif assurance trottinette électrique | non | oui | non | Article, BreadcrumbList | 0 / 3 | 1 |
| 10 | article base | …/devis-assurance-trottinette-electrique-le-guide-ultime-pour-2026-et-au-dela | 200 | Devis assurance trottinette électrique : Le Guide Ultime pour 2026 et  | Devis assurance trottinette électrique : Le Guide Ultime pou | 2768 | 0 | devis | devis assurance trottinette électrique | non | oui | non | Article, BreadcrumbList | 0 / 3 | 24 |
| 11 | article base | …/assurance-trottinette-electrique-3-par-mois-mythe-ou-realite-pour-2026-le-guide-ultime | 200 | Assurance Trottinette Électrique 3 € par Mois : Mythe ou Réalité pour  | Assurance Trottinette Électrique 3 € par Mois : Mythe ou Réa | 2103 | 0 | prix | prix / tarif assurance trottinette électrique | non | oui | non | Article, BreadcrumbList | 0 / 3 | 12 |
| 12 | article base | …/assurance-trottinette-electrique-2-mythe-ou-realite-en-2026-le-guide-complet | 200 | Assurance Trottinette Électrique 2 € : Mythe ou Réalité en 2026 ? Le G | Assurance Trottinette Électrique 2 € : Mythe ou Réalité en 2 | 2217 | 7 | prix | prix / tarif assurance trottinette électrique | non | oui | non | Article, BreadcrumbList | 0 / 3 | 23 |
| 13 | article base | …/assurance-trottinette-electrique-pas-cher-en-2026-le-guide-ultime-pour-rouler-protege-et-economique | 200 | Assurance Trottinette Électrique Pas Cher en 2026 : Le Guide Ultime po | Assurance Trottinette Électrique Pas Cher en 2026 : Le Guide | 2220 | 0 | prix | prix / tarif assurance trottinette électrique | non | oui | non | Article, BreadcrumbList | 0 / 3 | 7 |
| 14 | article base | …/assurance-edpm-guide-complet-pour-choisir-la-meilleure-protection-2026 | 200 | Assurance EDPM : Guide Complet pour Choisir la Meilleure Protection (2 | Assurance EDPM : Guide Complet pour Choisir la Meilleure Pro | 2105 | 6 | EDPM-gyroroue | assurance EDPM / gyroroue / hoverboard | non | oui | non | Article, BreadcrumbList | 0 / 3 | 1 |
| 15 | article base | …/assurance-trottinette-electrique-2026-le-guide-ultime-pour-rouler-en-toute-legalite-et-securite | 200 | Assurance trottinette électrique 2026 : Le guide ultime pour rouler en | Assurance trottinette électrique 2026 : Le guide ultime pour | 2387 | 8 | obligation | assurance trottinette électrique obligatoire | non | oui | non | Article, BreadcrumbList | 0 / 3 | 11 |
| 16 | article base | …/assurance-trottinette-pas-cher-le-guide-ultime-pour-rouler-en-toute-securite-sans-vous-ruiner-en-2026 | 200 | Assurance trottinette pas cher : Le guide ultime pour rouler en toute  | Assurance trottinette pas cher : Le guide ultime pour rouler | 2237 | 9 | prix | prix / tarif assurance trottinette électrique | non | oui | non | Article, BreadcrumbList | 0 / 10 | 1 |
| 17 | article base | …/comparateur-assurance-trottinette-electrique-2026-le-guide-ultime-pour-rouler-protege-et-moins-cher | 200 | Comparateur Assurance Trottinette Électrique 2026 : Le Guide Ultime po | Comparateur Assurance Trottinette Électrique 2026 : Le Guide | 2429 | 0 | prix | prix / tarif assurance trottinette électrique | non | oui | non | Article, BreadcrumbList | 0 / 3 | 15 |
| 18 | article base | …/assurance-trottinette-electrique-prix-combien-ca-coute-vraiment-en-2026-et-comment-economiser | 200 | Assurance trottinette électrique prix : Combien ça coûte vraiment en 2 | Assurance trottinette électrique prix : Combien ça coûte vra | 2779 | 9 | prix | prix / tarif assurance trottinette électrique | non | oui | non | Article, BreadcrumbList | 0 / 3 | 22 |
| 19 | article base | …/assurance-trottinette-electrique-la-moins-chere-en-2026-le-guide-ultime-pour-rouler-sans-se-ruiner | 200 | Assurance trottinette électrique la moins chère en 2026 : Le guide ult | Assurance trottinette électrique la moins chère en 2026 : Le | 2086 | 6 | prix | prix / tarif assurance trottinette électrique | non | oui | non | Article, BreadcrumbList | 0 / 3 | 17 |
| 20 | article base | …/assurance-trottinette-electrique-obligatoire-en-france-des-2026-le-guide-complet | 301 → …/comparatif-assurance-trottinette-electrique-2026 | Comparer les assurances trottinette électrique en 2026 : les critères  | Comparer les assurances trottinette électrique en 2026 : les | 505 | 6 | comparaison | comparatif assurance trottinette électrique | non | non | non | Article, BreadcrumbList | 0 / 7 | 0 |
| 21 | article base | …/assurance-trottinette-pure-electric-votre-guide-complet-pour-2026 | 200 | Assurance trottinette Pure Electric : Votre guide complet pour 2026 | Assurance trottinette Pure Electric : Votre guide complet po | 2185 | 5 | marque | assurance trottinette Pure Electric | non | oui | non | Article, BreadcrumbList | 0 / 3 | 2 |
| 22 | article base | …/assurance-trottinette-electrique-sans-engagement-liberte-et-securite-garanties | 200 | Assurance Trottinette Électrique Sans Engagement : Liberté et Sécurité | Assurance Trottinette Électrique Sans Engagement : Liberté e | 2067 | 1 | devis | devis assurance trottinette électrique | non | oui | non | Article, BreadcrumbList | 0 / 10 | 1 |
| 23 | article base | …/quel-est-le-tarif-de-l-assurance-trottinette-electrique-en-2026-le-guide-complet-pour-rouler-protege-et-moins-cher | 200 | Quel est le Tarif de l'Assurance Trottinette Électrique en 2026 ? Le G | Quel est le Tarif de l'Assurance Trottinette Électrique en 2 | 1862 | 0 | prix | prix / tarif assurance trottinette électrique | non | oui | non | Article, BreadcrumbList | 0 / 10 | 7 |
| 24 | article TS | …/assurance-trottinette-vol-garantie-2026 | 200 | Vol de trottinette électrique : la garantie qui rembourse vraiment en  | Vol de trottinette électrique : la garantie qui rembourse vr | 669 | 8 | vol | assurance vol trottinette | non | oui | non | Article, BreadcrumbList | 3 / 6 | 10 |
| 25 | article TS | …/trottinette-electrique-debridage-loi-risques-2026 | 200 | Débrider sa trottinette électrique : ce que vous risquez vraiment en 2 | Débrider sa trottinette électrique : ce que vous risquez vra | 632 | 7 | obligation | assurance trottinette électrique obligatoire | non | oui | non | Article, BreadcrumbList | 1 / 5 | 10 |
| 26 | article TS | …/trottinette-electrique-accident-sinistre-demarches-2026 | 200 | Accident de trottinette électrique : les démarches à suivre étape par  | Accident de trottinette électrique : les démarches à suivre  | 826 | 10 | sinistre | accident trottinette démarches | non | oui | non | Article, BreadcrumbList | 0 / 6 | 5 |
| 27 | article TS | …/assurance-gyroroue-hoverboard-monoroue-edpm-2026 | 200 | Assurance gyroroue, hoverboard et monoroue : la jungle des EDPM décryp | Assurance gyroroue, hoverboard et monoroue : la jungle des E | 787 | 8 | EDPM-gyroroue | assurance EDPM / gyroroue / hoverboard | non | oui | non | Article, BreadcrumbList | 0 / 7 | 23 |
| 28 | article TS | …/comparatif-assurance-trottinette-electrique-2026 | 200 | Comparer les assurances trottinette électrique en 2026 : les critères  | Comparer les assurances trottinette électrique en 2026 : les | 505 | 6 | comparaison | comparatif assurance trottinette électrique | non | oui | non | Article, BreadcrumbList | 2 / 7 | 0 |
| 29 | article TS | …/trottinette-electrique-sans-assurance-delit-amende-2026 | 200 | Rouler en trottinette électrique sans assurance : un délit puni jusqu' | Rouler en trottinette électrique sans assurance : un délit p | 939 | 10 | prix | prix / tarif assurance trottinette électrique | non | oui | non | Article, BreadcrumbList | 2 / 7 | 16 |

Meta descriptions et canonicals complets : dans le JSON. Tous les canonicals pointent sur leur propre URL, sauf l'article n°20 (`assurance-trottinette-electrique-obligatoire-en-france-des-2026…`), déjà redirigé en 301 vers `comparatif-assurance-trottinette-electrique-2026`.

**Constats :**
- **Les 20 articles en base ne reçoivent aucun lien interne** depuis le code ou les autres contenus (seulement les listes du blog). La page principale ne lie que 3 articles TS. Ces 20 articles sont donc peu soutenus, et Google voit 20 pages concurrentes sur les mêmes requêtes.
- **11 articles visent l'intention « prix / pas cher / moins cher / tarif »**, 6 l'intention « comparatif / comparateur / devis / en ligne / sans engagement » : c'est le cœur de la cannibalisation.
- **Montants non sourcés** : 263 au total sur le groupe, concentrés dans les articles prix en base (jusqu'à 24 par article) ; la page principale n'en a aucun (prix issu de l'IPID cité).
- **/landing/trottinette** est en noindex et hors sitemap (page d'acquisition payante, cohérent) ; elle ne concurrence pas la page principale.

## 2. Similarité entre articles

- **Contenu (fragments de 5 mots et TF-IDF cosinus)** : aucune paire ne dépasse 40 %, sauf la paire n°20 / `comparatif-assurance-trottinette-electrique-2026` (100 %), qui est déjà une redirection 301. Les articles en base ont été rédigés séparément : le texte est reformulé (médiane TF-IDF 0,07, maximum 0,28). **La cannibalisation n'est pas textuelle, elle porte sur les requêtes visées.**
- **Ciblage (mots du slug, du title et du H1, Jaccard)** : 18 paires au-dessus de 40 % :

| Ciblage | URL A | URL B |
|---|---|---|
| 75 % | …/assurance-trottinette-electrique-3-par-mois-mythe-ou-realite-pour-2026-le-guide-ultime | …/assurance-trottinette-electrique-2-mythe-ou-realite-en-2026-le-guide-complet |
| 73 % | …/comparateur-assurance-trottinette-electrique-2026-le-guide-ultime-pour-rouler-protege-et-moins-cher | …/quel-est-le-tarif-de-l-assurance-trottinette-electrique-en-2026-le-guide-complet-pour-rouler-protege-et-moins-cher |
| 57 % | …/assurance-trottinette-electrique-pas-cher-en-2026-le-guide-ultime-pour-rouler-protege-et-economique | …/comparateur-assurance-trottinette-electrique-2026-le-guide-ultime-pour-rouler-protege-et-moins-cher |
| 56 % | …/assurance-trottinette-electrique-le-comparatif-ultime-pour-2026 | …/comparatif-assurance-trottinette-electrique-2026-le-guide-ultime-pour-choisir-la-meilleure-couverture |
| 55 % | …/comparateur-assurance-trottinette-electrique-2026-le-guide-ultime-pour-rouler-protege-et-moins-cher | …/assurance-trottinette-electrique-la-moins-chere-en-2026-le-guide-ultime-pour-rouler-sans-se-ruiner |
| 54 % | …/assurance-trottinette-electrique-pas-cher-en-2026-le-guide-ultime-pour-rouler-protege-et-economique | …/quel-est-le-tarif-de-l-assurance-trottinette-electrique-en-2026-le-guide-complet-pour-rouler-protege-et-moins-cher |
| 50 % | …/comparateur-assurance-trottinette-electrique-trouvez-la-meilleure-offre-2026-sans-effort | …/comparatif-assurance-trottinette-electrique-2026-le-guide-ultime-pour-choisir-la-meilleure-couverture |
| 50 % | …/assurance-trottinette-electrique-le-comparatif-ultime-pour-2026 | …/comparatif-assurance-trottinette-electrique-2026 |
| 50 % | …/assurance-trottinette-electrique-le-comparatif-ultime-pour-2026 | …/comparateur-assurance-trottinette-electrique-trouvez-la-meilleure-offre-2026-sans-effort |
| 50 % | …/assurance-trottinette-electrique-le-comparatif-ultime-pour-2026 | …/assurance-trottinette-electrique-livreur-2026-le-guide-indispensable |
| 50 % | …/assurance-trottinette-electrique-la-moins-chere-en-2026-le-guide-ultime-pour-rouler-sans-se-ruiner | …/quel-est-le-tarif-de-l-assurance-trottinette-electrique-en-2026-le-guide-complet-pour-rouler-protege-et-moins-cher |
| 50 % | …/assurance-trottinette-electrique-2026-le-guide-ultime-pour-rouler-en-toute-legalite-et-securite | …/assurance-trottinette-pas-cher-le-guide-ultime-pour-rouler-en-toute-securite-sans-vous-ruiner-en-2026 |
| 50 % | /assurance-trottinette | /landing/trottinette |
| 50 % | /assurance-trottinette | …/assurance-trottinette-electrique-le-comparatif-ultime-pour-2026 |
| 44 % | …/assurance-trottinette-electrique-le-comparatif-ultime-pour-2026 | …/comparateur-assurance-trottinette-electrique-2026-le-guide-ultime-pour-rouler-protege-et-moins-cher |
| 43 % | …/assurance-trottinette-electrique-le-comparatif-ultime-pour-2026 | …/devis-assurance-trottinette-electrique-le-guide-ultime-pour-2026-et-au-dela |
| 43 % | …/assurance-trottinette-electrique-le-comparatif-ultime-pour-2026 | …/assurance-trottinette-electrique-2-mythe-ou-realite-en-2026-le-guide-complet |
| 42 % | …/assurance-trottinette-pas-cher-le-guide-ultime-pour-rouler-en-toute-securite-sans-vous-ruiner-en-2026 | …/assurance-trottinette-electrique-la-moins-chere-en-2026-le-guide-ultime-pour-rouler-sans-se-ruiner |

Paires de contenu les plus proches (TF-IDF, pour information) : `comparateur…trouvez-la-meilleure-offre` / `comparateur…2026-le-guide-ultime` (0,28) ; **/assurance-trottinette-livreur / article base `…livreur-2026-le-guide-indispensable` (0,28)** ; `devis…` / `…pas-cher-le-guide-ultime…` (0,28).

## 3. Carte de consolidation proposée (à valider ; rien n'est appliqué)

Choix des URL à conserver : **à confirmer avec les positions et clics Search Console par URL** (je ne les ai pas). Par défaut, je propose de garder l'URL la plus courte, la mieux reliée ou la plus complète, et de reprendre les sections utiles avant toute redirection 301.

### 1. Pilier « assurance trottinette » (comparaison, devis, en ligne)
- **À conserver :** /assurance-trottinette
- **À rediriger en 301 :** 
  - …/assurance-trottinette-electrique-le-comparatif-ultime-pour-2026
  - …/comparateur-assurance-trottinette-electrique-trouvez-la-meilleure-offre-2026-sans-effort
  - …/comparatif-assurance-trottinette-electrique-2026-le-guide-ultime-pour-choisir-la-meilleure-couverture
  - …/comparatif-assurance-trottinette-electrique-2026 (TS)
  - …/assurance-trottinette-en-ligne-le-guide-complet-pour-une-protection-optimale-en-2026
  - …/devis-assurance-trottinette-electrique-le-guide-ultime-pour-2026-et-au-dela
  - …/assurance-trottinette-electrique-sans-engagement-liberte-et-securite-garanties
  - (…/assurance-trottinette-electrique-obligatoire-en-france-des-2026… : déjà en 301 vers le TS comparatif → la faire pointer directement vers le pilier pour éviter une chaîne)
- **Sections à reprendre avant fusion :** critères à comparer et priorités par profil (TS comparatif) ; liste des garanties RC / individuelle accident / vol / casse / assistance (comparatif « guide ultime ») ; « comment fonctionne un comparateur » ; points à vérifier avant de signer ; sans engagement / résiliation (à sourcer).

### 2. Prix
- **À conserver :** …/assurance-trottinette-electrique-prix-combien-ca-coute-vraiment-en-2026-et-comment-economiser (le plus structuré : 9 H2, 2 779 mots) — ou une URL courte nouvelle, ex. /assurance-trottinette-prix, si Paul préfère
- **À rediriger en 301 :** 
  - …/assurance-trottinette-la-moins-chere-en-2026-le-guide-ultime-pour-economiser
  - …/assurance-trottinette-electrique-la-moins-chere-en-2026-le-guide-ultime-pour-rouler-sans-se-ruiner
  - …/assurance-trottinette-electrique-3-par-mois-mythe-ou-realite-pour-2026-le-guide-ultime
  - …/assurance-trottinette-electrique-2-mythe-ou-realite-en-2026-le-guide-complet
  - …/assurance-trottinette-electrique-pas-cher-en-2026-le-guide-ultime-pour-rouler-protege-et-economique
  - …/assurance-trottinette-pas-cher-le-guide-ultime-pour-rouler-en-toute-securite-sans-vous-ruiner-en-2026
  - …/comparateur-assurance-trottinette-electrique-2026-le-guide-ultime-pour-rouler-protege-et-moins-cher
  - …/quel-est-le-tarif-de-l-assurance-trottinette-electrique-en-2026-le-guide-complet-pour-rouler-protege-et-moins-cher
- **Sections à reprendre avant fusion :** facteurs qui influencent le prix (modèle, profil, garanties, franchise) ; « ce que couvre une offre à bas coût » ; tableau prix ↔ garanties — À NE REPRENDRE QU'AVEC DES PRIX SOURCÉS (IPID, devis réel daté) : ces articles cumulent la majorité des montants non sourcés.

### 3. Obligation légale et sanctions
- **À conserver :** …/trottinette-electrique-sans-assurance-delit-amende-2026 (TS, a déjà une section « Sources officielles », 2 liens entrants)
- **À rediriger en 301 :** 
  - …/assurance-trottinette-electrique-2026-le-guide-ultime-pour-rouler-en-toute-legalite-et-securite
  - (option) …/trottinette-electrique-debridage-loi-risques-2026 → en section « engin débridé » ; ou le garder s'il se positionne seul sur « débridage »
- **Sections à reprendre avant fusion :** sanctions en cas de non-assurance ; « l'assurance habitation couvre-t-elle ma trottinette ? » ; « comment vérifier son contrat habitation » ; nullité d'assurance en cas de débridage ; règles de circulation (F308).

### 4. Livreur
- **À conserver :** /assurance-trottinette-livreur
- **À rediriger en 301 :** 
  - …/assurance-trottinette-electrique-livreur-2026-le-guide-indispensable
- **Sections à reprendre avant fusion :** risques spécifiques au métier de livreur ; usage professionnel vs RC privée ; checklist anti-vol du livreur (article vol).

### 5. EDPM : gyroroue, hoverboard, monoroue
- **À conserver :** …/assurance-gyroroue-hoverboard-monoroue-edpm-2026 (TS)
- **À rediriger en 301 :** 
  - …/assurance-edpm-guide-complet-pour-choisir-la-meilleure-protection-2026
- **Sections à reprendre avant fusion :** définition légale de l'EDPM et exemples ; garanties par type d'engin — tarifs par type à sourcer ou retirer (23 montants non sourcés dans l'article TS).

### 6. Marque (optionnel)
- **À conserver :** …/assurance-trottinette-pure-electric-votre-guide-complet-pour-2026
- **À rediriger en 301 :** aucune
- **Sections à reprendre avant fusion :** à garder seulement si Search Console montre des clics sur « Pure Electric » ; sinon 301 vers le pilier.

**Articles de soutien hors consolidation** (intentions distinctes, à garder ou à verser comme sections du pilier selon la cible 4-6 pages) : `assurance-trottinette-vol-garantie-2026` (vol et antivol) et `trottinette-electrique-accident-sinistre-demarches-2026` (démarches après accident). Si l'objectif est strictement 4 à 6 pages, je propose de les intégrer au pilier (sections « Vol et antivol » et « En cas d'accident ») et de les rediriger ensuite.

Résultat : **6 pages** (pilier, prix, obligation, livreur, EDPM, marque optionnelle) + 2 articles de soutien, au lieu de 29 URL ; **18 redirections 301** proposées (+ 2 optionnelles : débridage, Pure Electric ; + 2 si vol et accident sont versés au pilier).

## 4. /assurance-trottinette : sections absentes et sources officielles

Présent aujourd'hui : obligation (FAQ, « délit passible de 3 750 € » sans source citée), prix par formule (tableau Solo/Famille, IPID e-Trottineur), vol (carte « Victime d'un vol » et ligne du tableau), assurance habitation (FAQ), FAQ (4 questions), chiffres d'accidentalité. Je n'ai pas la liste des pages qui se classent devant (pas de Search Console ni de relevé des SERP) : la comparaison porte sur ce que couvrent les articles du groupe et les fiches officielles.

| Section absente ou incomplète | Contenu attendu | Source officielle |
|---|---|---|
| Amende sourcée | Conduite sans assurance : délit, jusqu'à 3 750 € ; amende forfaitaire 500 € + 50 % FGAO = 750 € ; majorée : 1 500 € | [F34829](https://www.service-public.gouv.fr/particuliers/vosdroits/F34829), vérifiée le 13 mars 2026 |
| Règles de circulation | 14 ans minimum ; 25 km/h maximum ; piste cyclable quand elle existe ; trottoir interdit sauf autorisation du maire ; un seul passager ; amende de 135 € ; écouteurs interdits ; équipements obligatoires | [F308](https://www.service-public.gouv.fr/particuliers/vosdroits/F308), vérifiée le 11 août 2026 |
| EDPM non homologué / débridé | Au-delà de 25 km/h ou si l'engin est modifié : requalifié en cyclomoteur (immatriculation, assurance deux-roues motorisé, casque) | [F2697](https://www.service-public.gouv.fr/particuliers/vosdroits/F2697), vérifiée le 13 novembre 2025 |
| Accident sans tiers | Dommages matériels (trottinette, casque) pris en charge uniquement avec une assurance personnelle couvrant ces risques | F2697 |
| Assurance habitation | La page a la question en FAQ ; ajouter la nuance de la fiche : vérifier que le contrat n'exclut pas ces engins. Attention : la phrase « en général, vous êtes couvert par le contrat habitation » de F308 vise les engins sans moteur ; pour un EDPM, l'assurance RC est une obligation propre | F308 / F2697 |
| Comment s'assurer (démarches) | Pièces demandées, attestation à présenter lors d'un contrôle (vérifier sur la fiche A17230, actualité « carte verte supprimée au 1er avril 2024 », avant de rédiger) | service-public A17230 (à lire) |
| Prix par formule | Présent (Solo dès 2,90 €/mois, Famille sans prix) ; pas de prix vol/casse/assistance : à ajouter seulement avec un document d'information d'un autre contrat | IPID e-Trottineur (mai 2025) déjà cité |
| Vol et antivol | Présent (carte « Victime d'un vol » + ligne du tableau) ; pas de règle officielle sur l'antivol (dépend du contrat) | conditions de chaque contrat |
| FAQ | Présente (4 questions) ; ajouter âge minimum, débridage, accident sans tiers, amende forfaitaire | F308, F2697, F34829 |

## 5. SNAPSHOTS, sitemap, liens cassés

- **/assurance-trottinette** et **/assurance-trottinette-livreur** : dans SNAPSHOTS et dans le sitemap.
- **/landing/trottinette** : ni SNAPSHOTS ni sitemap, et en noindex (choix cohérent pour une landing).
- **Articles (base et TS)** : jamais dans SNAPSHOTS (servis par le générateur d'articles statiques, normal) ; tous dans le sitemap, sauf l'article n°20 (redirigé en 301, normal).
- **Liens internes cassés : aucun** (tous les liens sortants des 29 URL répondent 200, aucun ne redirige).
- **Point de vigilance** : la redirection existante n°20 → `comparatif-assurance-trottinette-electrique-2026` créerait une chaîne si cet article TS est lui-même redirigé vers le pilier : faire pointer les deux directement vers la cible finale.
