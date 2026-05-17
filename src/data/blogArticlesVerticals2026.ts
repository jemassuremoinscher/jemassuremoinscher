import type { BlogArticle } from "./blogArticles";

/**
 * Série Verticales 2026 — 9 articles (3 sujets × 1 pilier + 2 satellites).
 * Liens internes intégrés vers les landing pages /landing/decennale,
 * /landing/flotte-auto, /landing/mutuelle-entreprise et articles connexes.
 */
export const blogArticlesVerticals2026: BlogArticle[] = [
  // ============================================================
  // VERTICALE 1 — DÉCENNALE BTP
  // ============================================================
  {
    id: "vert-decennale-pilier",
    title: "Garantie décennale 2026 : guide complet pour les artisans du BTP",
    slug: "garantie-decennale-2026-guide-complet-artisans-btp",
    description: "Tout savoir sur l'assurance décennale en 2026 : obligations légales, prix, garanties, démarches. Le guide de référence pour les artisans et entreprises du bâtiment.",
    category: "Conseils Experts",
    date: "5 mai 2026",
    readTime: "12 min",
    author: "Thomas Leroy",
    tags: ["décennale", "BTP", "artisan", "obligation légale", "assurance pro"],
    content: `
# Garantie décennale 2026 : le guide complet pour les artisans du BTP

La **garantie décennale** est l'assurance la plus importante de votre activité dans le bâtiment. Obligatoire depuis la loi Spinetta de 1978, elle protège vos clients pendant 10 ans après la réception des travaux — et vous protège financièrement contre des sinistres qui peuvent atteindre des centaines de milliers d'euros.

## Qu'est-ce que la garantie décennale ?

La décennale couvre les **dommages compromettant la solidité de l'ouvrage** ou le rendant **impropre à sa destination**. Elle s'applique pendant **10 ans** à compter de la réception des travaux.

Exemples concrets :
- Fissures importantes dans un mur porteur
- Infiltrations rendant une pièce inhabitable
- Affaissement de toiture
- Effondrement d'une dalle

## Qui doit souscrire une décennale ?

L'obligation s'applique à **tout constructeur** au sens du Code civil :
- Artisans (maçons, plombiers, électriciens, couvreurs, charpentiers…)
- Auto-entrepreneurs du BTP
- Entreprises générales du bâtiment
- Architectes, maîtres d'œuvre, bureaux d'études
- Promoteurs immobiliers

> 👉 Pour un comparatif personnalisé, consultez notre page dédiée à l'[assurance décennale BTP](/landing/decennale).

## Combien coûte une décennale en 2026 ?

Le tarif dépend de **6 critères principaux** :
1. **Le métier exercé** (gros œuvre > second œuvre)
2. **Le chiffre d'affaires annuel**
3. **L'ancienneté de l'entreprise**
4. **La sinistralité passée**
5. **La zone géographique**
6. **Les techniques utilisées** (techniques courantes ou non-courantes)

| Profil | Tarif annuel moyen |
|---|---|
| Auto-entrepreneur peinture (CA 35 k€) | 700 – 1 100 € |
| Plombier-chauffagiste (CA 80 k€) | 1 400 – 2 200 € |
| Maçon gros œuvre (CA 150 k€) | 3 500 – 6 500 € |
| Couvreur-charpentier (CA 200 k€) | 4 500 – 8 000 € |

## Comment souscrire ?

1. **Préparez votre dossier** : Kbis, diplômes/qualifications, CA prévisionnel, descriptif d'activité
2. **Comparez au moins 3 devis** — les écarts entre assureurs peuvent dépasser 40 %
3. **Vérifiez les exclusions** (techniques non-courantes, sous-traitance, travaux à l'étranger)
4. **Obtenez l'attestation** : indispensable avant le 1er chantier

## Les pièges à éviter

- **Démarrer un chantier sans attestation** = délit pénal (6 mois de prison, 75 000 € d'amende)
- **Sous-déclarer son CA** : la franchise sera majorée et certains sinistres non couverts
- **Oublier les activités annexes** : chaque métier exercé doit figurer sur l'attestation
- **Négliger la RC Pro** : la décennale ne couvre que les dommages à l'ouvrage, pas les dommages corporels

## Que faire en cas de sinistre ?

1. **Déclarez sous 5 jours** à votre assureur (lettre recommandée + AR)
2. **Conservez toutes les preuves** : photos, devis, échanges écrits
3. **Ne reconnaissez pas votre responsabilité** avant l'expertise
4. **L'expert mandaté** déterminera la cause et le montant des dommages

## Articles complémentaires

- [RC Pro et décennale : quelles différences pour les artisans ?](/blog/rc-pro-decennale-differences-artisans-btp)
- [Décennale auto-entrepreneur : tout ce qu'il faut savoir](/blog/decennale-auto-entrepreneur-btp-2026)
- [Comparatif RC Pro pour artisans et indépendants](/landing/rc-pro)

## Conclusion

La décennale n'est pas une dépense, c'est un **investissement de protection**. Un seul sinistre non couvert peut suffire à mettre une entreprise en faillite. Prenez le temps de comparer, vérifiez les exclusions, et n'attendez pas le premier chantier pour souscrire.

**Besoin d'un devis personnalisé ?** Obtenez votre [comparatif décennale gratuit en 2 minutes](/landing/decennale).
    `,
  },
  {
    id: "vert-decennale-sat1",
    title: "RC Pro et décennale : quelles différences pour les artisans du BTP ?",
    slug: "rc-pro-decennale-differences-artisans-btp",
    description: "RC Pro ou décennale : laquelle souscrire ? Comprenez en 5 minutes ce que chaque assurance couvre vraiment pour un artisan du bâtiment.",
    category: "Conseils Experts",
    date: "8 mai 2026",
    readTime: "6 min",
    author: "Thomas Leroy",
    tags: ["décennale", "RC Pro", "BTP", "artisan"],
    content: `
# RC Pro et décennale : quelles différences pour les artisans du BTP ?

Beaucoup d'artisans confondent **RC Pro** et **garantie décennale**. Pourtant, ces deux assurances couvrent des risques **totalement différents** et sont, dans la plupart des cas, **complémentaires**.

## Ce que couvre la décennale

La [garantie décennale](/landing/decennale) protège pendant **10 ans après la réception** des travaux contre :
- Les dommages affectant la **solidité de l'ouvrage**
- Les désordres rendant l'ouvrage **impropre à sa destination**

👉 Elle ne couvre **que les dommages matériels** survenant **après la fin du chantier**.

## Ce que couvre la RC Pro

La **Responsabilité Civile Professionnelle** couvre les dommages causés à des tiers **pendant l'exercice de l'activité** :
- Dommages corporels (chute d'un client sur le chantier)
- Dommages matériels (outil tombé sur la voiture d'un voisin)
- Dommages immatériels consécutifs (perte d'exploitation d'un client)

## Tableau comparatif

| Critère | Décennale | RC Pro |
|---|---|---|
| Obligation légale | Oui (BTP) | Recommandée |
| Durée de la garantie | 10 ans après réception | Pendant l'activité |
| Type de dommages | Ouvrage uniquement | Tiers (personnes, biens) |
| Quand intervient-elle ? | Après le chantier | Pendant le chantier |
| Tarif moyen / an | 700 – 8 000 € | 250 – 1 500 € |

## Faut-il les deux ?

**Oui dans 95 % des cas.** Un artisan du BTP doit cumuler les deux pour être réellement protégé. La RC Pro est souvent **incluse dans le contrat décennale** sous forme de pack "Multirisque artisan".

## Pour aller plus loin

- [Guide complet de la décennale 2026](/blog/garantie-decennale-2026-guide-complet-artisans-btp)
- [Décennale auto-entrepreneur](/blog/decennale-auto-entrepreneur-btp-2026)
- [Comparatif RC Pro pour artisans](/landing/rc-pro)

**Vous démarrez votre activité ?** Obtenez un [devis décennale + RC Pro en 2 minutes](/landing/decennale).
    `,
  },
  {
    id: "vert-decennale-sat2",
    title: "Décennale auto-entrepreneur : prix, démarches et obligations 2026",
    slug: "decennale-auto-entrepreneur-btp-2026",
    description: "Auto-entrepreneur dans le BTP ? La décennale est obligatoire dès le 1er chantier. Tarifs, formalités et conseils pour bien la choisir en 2026.",
    category: "Conseils Experts",
    date: "11 mai 2026",
    readTime: "7 min",
    author: "Thomas Leroy",
    tags: ["décennale", "auto-entrepreneur", "BTP", "micro-entreprise"],
    content: `
# Décennale auto-entrepreneur : tout ce qu'il faut savoir en 2026

Être **micro-entrepreneur** dans le bâtiment ne vous dispense pas de la [garantie décennale](/landing/decennale). Au contraire : vous êtes soumis **exactement aux mêmes obligations** qu'une entreprise classique du BTP.

## L'obligation légale

Tout auto-entrepreneur exerçant une activité de **construction, rénovation, plomberie, électricité, peinture, carrelage, etc.** doit souscrire une décennale **avant le premier coup de pelle**.

⚠️ Démarrer sans attestation = **délit pénal** (Article L. 243-3 du Code des assurances).

## Combien ça coûte ?

Pour un auto-entrepreneur avec un CA prévisionnel **inférieur à 50 000 €** :

| Métier | Tarif annuel moyen |
|---|---|
| Peintre, plaquiste | 600 – 1 100 € |
| Plombier, électricien | 900 – 1 500 € |
| Maçon, carreleur | 1 500 – 2 800 € |
| Couvreur, charpentier | 2 200 – 4 000 € |

## Comment réduire la facture ?

1. **Comparer au moins 3 devis** ([comparateur gratuit ici](/landing/decennale))
2. Choisir une **franchise plus élevée** (économie de 10 à 20 %)
3. Limiter les **activités secondaires** déclarées
4. Adhérer à un **réseau d'artisans** qui négocie des tarifs groupés
5. **Justifier d'une qualification** (CAP/BP/Qualibat) → -15 % en moyenne

## Les pièges spécifiques aux auto-entrepreneurs

- **Le seuil de CA** : si vous dépassez 77 700 € (BTP), votre prime sera réajustée
- **La sous-traitance** : si vous travaillez pour une entreprise générale, vérifiez votre couverture
- **Les techniques non-courantes** (paille, terre crue, ossature bois complexe) = surprime importante

## Ressources utiles

- [Guide complet de la décennale 2026](/blog/garantie-decennale-2026-guide-complet-artisans-btp)
- [RC Pro vs décennale : quelles différences ?](/blog/rc-pro-decennale-differences-artisans-btp)

**Démarrez votre activité l'esprit tranquille** : [obtenez votre attestation décennale en 48 h](/landing/decennale).
    `,
  },

  // ============================================================
  // VERTICALE 2 — FLOTTE AUTO
  // ============================================================
  {
    id: "vert-flotte-pilier",
    title: "Assurance flotte auto 2026 : le guide complet pour entreprises",
    slug: "assurance-flotte-auto-2026-guide-entreprise",
    description: "Tout savoir sur l'assurance flotte auto en 2026 : seuil, tarifs, garanties, économies. Le guide de référence pour gérer le parc véhicules de votre entreprise.",
    category: "Conseils Experts",
    date: "6 mai 2026",
    readTime: "11 min",
    author: "Thomas Laurent",
    tags: ["flotte auto", "entreprise", "parc véhicules", "assurance pro"],
    content: `
# Assurance flotte auto 2026 : le guide complet pour entreprises

Gérer **3, 10 ou 100 véhicules** dans son entreprise impose une logique différente d'une assurance auto classique. L'**assurance flotte** permet de centraliser la gestion, négocier de meilleurs tarifs et simplifier la vie de votre comptabilité.

## Qu'est-ce qu'une flotte automobile ?

On parle de "flotte" dès lors qu'une entreprise possède ou utilise **au moins 3 à 5 véhicules** (le seuil dépend de l'assureur). Tous types confondus :
- Voitures particulières (commerciaux, dirigeants)
- Utilitaires (VUL, fourgons)
- Poids lourds
- Engins de chantier
- Véhicules de location longue durée

## Les avantages d'une assurance flotte

| Avantage | Détail |
|---|---|
| **Tarif négocié** | -15 à -40 % vs contrats individuels |
| **Gestion centralisée** | 1 seul contrat, 1 seule échéance |
| **Mutualisation des risques** | Un sinistre n'impacte pas tous les véhicules |
| **Statistique propre** | Votre sinistralité réelle, pas un barème générique |
| **Souplesse** | Ajout/retrait de véhicules en cours d'année |

## Combien ça coûte ?

Le tarif dépend de **5 facteurs** :
1. **La taille de la flotte** (plus elle est grande, plus le tarif unitaire baisse)
2. **Le type de véhicules** (VUL > VP > PL en termes de risque)
3. **L'usage** (urbain, longue distance, transport de marchandises)
4. **L'historique de sinistralité** (taux S/P sur 3 ans)
5. **Les garanties choisies** (tiers, tiers+, tous risques)

| Type de flotte | Tarif moyen / véhicule / an |
|---|---|
| 5 VP commerciaux | 650 – 950 € |
| 10 VUL artisans | 850 – 1 400 € |
| 20 utilitaires livraison | 1 100 – 1 900 € |
| 50+ véhicules mixtes | 600 – 1 200 € |

> 👉 Obtenez un [devis flotte auto personnalisé en 2 min](/landing/flotte-auto).

## Les 3 types de contrats

### 1. Contrat à conducteur désigné
Chaque véhicule a un conducteur principal nommé. **Tarif le plus bas** mais peu flexible.

### 2. Contrat tous conducteurs
N'importe quel salarié peut conduire n'importe quel véhicule. **Idéal pour les artisans et commerciaux** mais plus cher.

### 3. Contrat statistique
Votre prime est calculée selon votre **sinistralité réelle** (taux S/P). **Idéal au-delà de 30 véhicules**.

## Comment réduire la facture ?

- Mettre en place une **politique de prévention** (formation éco-conduite, télématique)
- Choisir une **franchise plus élevée**
- Centraliser **tous les contrats** chez un seul assureur (auto + locaux + RC Pro)
- **Renégocier tous les 2 ans** (le marché évolue vite)
- Installer des **boîtiers connectés** (-10 à -25 %)

## La gestion des sinistres

1. **Désignez un référent flotte** en interne
2. **Standardisez la déclaration** (formulaire interne + constat amiable)
3. **Suivez le taux S/P** trimestriellement
4. **Analysez les sinistres récurrents** pour identifier les conducteurs à risque

## Articles connexes

- [Boîtiers connectés et flotte auto : enjeux 2026](/blog/boitiers-connectes-flotte-auto-entreprise-2026)
- [Réduire le coût de sa flotte auto en 2026](/blog/reduire-cout-flotte-auto-entreprise-2026)

## Conclusion

Une assurance flotte bien négociée représente **une économie moyenne de 25 %** par rapport à des contrats individuels, **plus une charge administrative divisée par 5**. Si votre entreprise possède 3 véhicules ou plus, c'est un changement à faire dès aujourd'hui.

**Comparez les meilleures offres flotte** en [demandant votre devis personnalisé gratuit](/landing/flotte-auto).
    `,
  },
  {
    id: "vert-flotte-sat1",
    title: "Boîtiers connectés et flotte auto : enjeux et économies en 2026",
    slug: "boitiers-connectes-flotte-auto-entreprise-2026",
    description: "Télématique embarquée : comment les boîtiers connectés réduisent jusqu'à 25 % le coût de votre flotte auto en 2026. Avantages, prix, RGPD.",
    category: "Conseils Experts",
    date: "9 mai 2026",
    readTime: "6 min",
    author: "Thomas Laurent",
    tags: ["flotte auto", "télématique", "boîtier connecté", "entreprise"],
    content: `
# Boîtiers connectés et flotte auto : enjeux 2026

Les **boîtiers connectés** (ou télématique embarquée) transforment la gestion des flottes auto. En 2026, plus de **60 % des flottes de plus de 10 véhicules** en sont équipées.

## Comment ça marche ?

Un petit boîtier connecté à la prise OBD ou installé directement par l'assureur enregistre :
- Vitesse, accélérations, freinages
- Kilométrage réel
- Trajets effectués
- Comportement de conduite (score)

## Les économies réalisables

| Poste | Économie moyenne |
|---|---|
| Prime d'assurance | -10 à -25 % |
| Carburant | -8 à -15 % |
| Maintenance | -10 à -20 % |
| Sinistralité | -30 % en 1 an |

## Avantages pour le gestionnaire de flotte

- **Géolocalisation en temps réel** des véhicules
- **Détection automatique des accidents** + alerte
- **Identification des conducteurs à risque**
- **Optimisation des tournées** logistiques
- **Justificatifs fiscaux** automatiques (notes de frais)

## Et le RGPD ?

L'utilisation de la télématique doit respecter **3 règles** :
1. **Information préalable** des salariés concernés
2. **Consultation du CSE** dans les entreprises de +50 salariés
3. **Déclaration CNIL** si géolocalisation hors temps de travail

## Combien ça coûte ?

- **Boîtier auto-installable** : 0 € (fourni par l'assureur) à 50 €
- **Boîtier pro avec installation** : 80 à 200 € par véhicule
- **Abonnement mensuel** : 5 à 15 € par véhicule

**Retour sur investissement moyen : 6 à 12 mois.**

## Articles complémentaires

- [Guide complet de l'assurance flotte auto 2026](/blog/assurance-flotte-auto-2026-guide-entreprise)
- [Réduire le coût de sa flotte auto](/blog/reduire-cout-flotte-auto-entreprise-2026)
- [Assurance flotte : comparatif 2026](/landing/flotte-auto)

**Équipez votre flotte intelligemment** : [obtenez un devis flotte + télématique](/landing/flotte-auto).
    `,
  },
  {
    id: "vert-flotte-sat2",
    title: "Réduire le coût de sa flotte auto en 2026 : 10 leviers concrets",
    slug: "reduire-cout-flotte-auto-entreprise-2026",
    description: "10 leviers concrets pour faire baisser jusqu'à 30 % le coût de votre flotte automobile en 2026 : assurance, carburant, maintenance, formation.",
    category: "Conseils Experts",
    date: "12 mai 2026",
    readTime: "7 min",
    author: "Thomas Laurent",
    tags: ["flotte auto", "économies", "entreprise", "gestion"],
    content: `
# Réduire le coût de sa flotte auto en 2026 : 10 leviers concrets

Une flotte auto représente en moyenne **15 à 25 % des charges variables** d'une entreprise. Voici **10 leviers éprouvés** pour faire baisser la facture sans sacrifier la qualité du service.

## 1. Renégocier l'assurance flotte

Un audit tous les 24 mois permet d'économiser **15 à 30 %**. Le marché est très concurrentiel.
👉 [Demandez un comparatif flotte auto](/landing/flotte-auto).

## 2. Choisir la bonne formule

- **Tiers** : véhicules de +7 ans à faible valeur
- **Tiers + vol/incendie** : véhicules de 3 à 7 ans
- **Tous risques** : véhicules neufs ou en LLD

## 3. Installer des boîtiers connectés

-10 à -25 % sur la prime + -15 % sur le carburant. [Voir notre article dédié](/blog/boitiers-connectes-flotte-auto-entreprise-2026).

## 4. Former les conducteurs à l'éco-conduite

- Économie carburant : -10 à -15 %
- Réduction sinistralité : -30 %
- ROI moyen : 4 mois

## 5. Optimiser la fiscalité (TVS, AND)

Privilégiez les véhicules **hybrides ou électriques** : exonération de TVS, bonus, abattements.

## 6. Mutualiser les véhicules

Réservation interne via une plateforme : **3 véhicules pour 5 salariés** = -40 %.

## 7. Renégocier les contrats LLD

Tous les 36-48 mois. Les loueurs sont en concurrence féroce, profitez-en.

## 8. Centraliser les achats de carburant

Cartes carburant avec remises négociées : -3 à -8 c€/L.

## 9. Maintenance préventive

Un véhicule entretenu = moins de pannes = moins d'immobilisation = moins de coûts cachés.

## 10. Suivre les KPI mensuellement

- Coût km moyen
- Taux S/P (sinistres/primes)
- Consommation par véhicule
- Disponibilité du parc

## En synthèse

| Levier | Économie moyenne |
|---|---|
| Renégociation assurance | -25 % |
| Télématique | -20 % |
| Éco-conduite | -12 % |
| Mutualisation | -40 % véhicules |
| Fiscalité verte | -8 % global |

## Articles connexes

- [Guide complet flotte auto 2026](/blog/assurance-flotte-auto-2026-guide-entreprise)
- [Boîtiers connectés et flotte auto](/blog/boitiers-connectes-flotte-auto-entreprise-2026)

**Lancez votre optimisation flotte dès aujourd'hui** : [demandez votre devis personnalisé](/landing/flotte-auto).
    `,
  },

  // ============================================================
  // VERTICALE 3 — MUTUELLE ENTREPRISE
  // ============================================================
  {
    id: "vert-mutuelle-ent-pilier",
    title: "Mutuelle entreprise 2026 : guide complet de la complémentaire santé collective",
    slug: "mutuelle-entreprise-2026-guide-complementaire-sante-collective",
    description: "Mutuelle entreprise obligatoire : guide complet 2026 pour dirigeants et DRH. Obligations, ANI, panier de soins, prix, choix du contrat.",
    category: "Conseils Experts",
    date: "7 mai 2026",
    readTime: "11 min",
    author: "Dr. Antoine Mercier",
    tags: ["mutuelle entreprise", "complémentaire santé", "ANI", "obligation employeur"],
    content: `
# Mutuelle entreprise 2026 : le guide complet de la complémentaire santé collective

Depuis l'**ANI du 1er janvier 2016**, **toute entreprise du secteur privé** doit proposer une complémentaire santé à ses salariés. En 2026, les règles se sont durcies et le panier de soins minimum a été enrichi. Voici tout ce qu'un dirigeant ou DRH doit savoir.

## L'obligation légale en 2026

L'employeur doit :
- **Proposer un contrat collectif** à tous les salariés
- **Financer au minimum 50 %** de la cotisation
- Respecter le **panier de soins ANI** minimum
- Mettre en place le **contrat responsable** (sinon perte des exonérations sociales)

## Le panier de soins ANI minimum 2026

| Poste | Couverture minimale |
|---|---|
| Ticket modérateur | 100 % |
| Forfait journalier hospitalier | Illimité |
| Dentaire | 125 % BR |
| Optique adulte | 100 €/an + monture |
| Soins courants 100 % santé | Reste à charge zéro |

## Combien ça coûte ?

| Profil entreprise | Coût mensuel / salarié |
|---|---|
| TPE 5 salariés (panier ANI) | 35 – 55 € |
| PME 50 salariés (formule confort) | 55 – 85 € |
| ETI 200 salariés (formule premium) | 75 – 130 € |

**Pour l'employeur** : 50 % minimum, en moyenne **60 % pratiqué** dans les PME.

> 👉 [Comparez les mutuelles entreprise gratuitement](/landing/mutuelle-entreprise).

## Les 5 critères pour choisir

1. **Qualité du panier de soins** (au-delà du minimum ANI)
2. **Réseau de soins** (opticiens, dentistes partenaires)
3. **Tiers payant généralisé**
4. **Services additionnels** (téléconsultation, médecine douce, prévention)
5. **Qualité du service RH** (portail, dématérialisation, reporting)

## Les cas de dispense

Un salarié peut **refuser** la mutuelle si :
- Il est déjà couvert par celle du conjoint (collectif obligatoire)
- Il bénéficie de la CSS
- Il est en CDD < 3 mois
- Il est apprenti avec cotisation > 10 % de sa rémunération

Demandez systématiquement le **justificatif de dispense** chaque année.

## Les avantages fiscaux

- **Cotisations employeur déductibles** du résultat
- **Cotisations salariales déductibles** du revenu imposable
- **Exonération de charges sociales** sur la part employeur (sous conditions du contrat responsable)

## Mettre en place une mutuelle : les étapes

1. **Cartographier les besoins** des salariés (sondage interne)
2. **Comparer 3 à 5 devis** auprès d'assureurs et mutuelles
3. **Choisir le contrat** (responsable, ANI compatible, exonérations)
4. **Formaliser** par DUE (Décision Unilatérale de l'Employeur), accord référendaire ou accord collectif
5. **Informer les salariés** (notice d'information obligatoire)
6. **Gérer les adhésions** et les dispenses

## Articles connexes

- [Mutuelle TNS vs mutuelle entreprise](/blog/mutuelle-tns-vs-mutuelle-entreprise-2026)
- [Surcomplémentaire santé en entreprise](/blog/surcomplementaire-sante-entreprise-2026)

## Conclusion

La mutuelle entreprise est **bien plus qu'une obligation légale** : c'est un **levier RH** majeur en 2026. Une bonne complémentaire améliore l'attractivité, la fidélisation et la santé globale de vos collaborateurs.

**Comparez les meilleures mutuelles entreprise** : [obtenez vos devis personnalisés en 2 minutes](/landing/mutuelle-entreprise).
    `,
  },
  {
    id: "vert-mutuelle-ent-sat1",
    title: "Mutuelle TNS vs mutuelle entreprise : quelles différences en 2026 ?",
    slug: "mutuelle-tns-vs-mutuelle-entreprise-2026",
    description: "TNS, dirigeant assimilé salarié, gérant majoritaire : quelle mutuelle choisir en 2026 ? Comparatif complet, fiscalité loi Madelin, prix.",
    category: "Conseils Experts",
    date: "10 mai 2026",
    readTime: "6 min",
    author: "Dr. Antoine Mercier",
    tags: ["mutuelle TNS", "mutuelle entreprise", "loi Madelin", "dirigeant"],
    content: `
# Mutuelle TNS vs mutuelle entreprise : quelles différences en 2026 ?

Selon votre **statut social**, la mutuelle adaptée à vos besoins n'est pas la même. Voici un comparatif clair pour choisir entre **mutuelle TNS (loi Madelin)** et **[mutuelle entreprise collective](/landing/mutuelle-entreprise)**.

## Qui est concerné par quoi ?

| Statut | Mutuelle adaptée |
|---|---|
| Gérant majoritaire SARL | TNS (Madelin) |
| EURL à l'IR | TNS (Madelin) |
| Auto-entrepreneur | TNS (Madelin) |
| Profession libérale | TNS (Madelin) |
| Président SAS/SASU | Entreprise (assimilé salarié) |
| Salarié | Entreprise (obligatoire) |

## Tableau comparatif

| Critère | Mutuelle TNS | Mutuelle entreprise |
|---|---|---|
| Obligation | Non | Oui (salariés) |
| Cofinancement | 100 % perso | 50 % min. employeur |
| Déduction fiscale | Loi Madelin | Charges déductibles |
| Tarif moyen mensuel | 80 – 200 € | 35 – 130 € (part salarié) |
| Souplesse garanties | Très haute | Encadrée (ANI) |

## Quand cumuler les deux ?

Un **dirigeant TNS** peut souscrire une **surcomplémentaire individuelle** en plus de la mutuelle collective de ses salariés. C'est même fortement recommandé pour les **besoins spécifiques** (optique haut de gamme, médecines douces, hospitalisation premium).

## La loi Madelin en bref

Les cotisations de mutuelle TNS sont **déductibles du revenu imposable** dans la limite de :
- **3,75 % du bénéfice imposable** + 7 % du PASS
- Plafond global : **3 % de 8 PASS** (~11 000 € en 2026)

## Articles connexes

- [Guide complet de la mutuelle entreprise](/blog/mutuelle-entreprise-2026-guide-complementaire-sante-collective)
- [Surcomplémentaire santé en entreprise](/blog/surcomplementaire-sante-entreprise-2026)
- [Mutuelle TNS pour micro-entrepreneurs](/blog/auto-entrepreneur-mutuelle-protection-optimale)

**Quel statut, quelle mutuelle ?** [Obtenez un comparatif personnalisé](/landing/mutuelle-entreprise).
    `,
  },
  {
    id: "vert-mutuelle-ent-sat2",
    title: "Surcomplémentaire santé en entreprise : pourquoi la proposer en 2026 ?",
    slug: "surcomplementaire-sante-entreprise-2026",
    description: "La surcomplémentaire santé permet aux salariés de renforcer leur mutuelle collective. Avantages, fiscalité, mise en place : le guide 2026.",
    category: "Conseils Experts",
    date: "13 mai 2026",
    readTime: "6 min",
    author: "Dr. Antoine Mercier",
    tags: ["surcomplémentaire", "mutuelle entreprise", "santé", "RH"],
    content: `
# Surcomplémentaire santé en entreprise : pourquoi la proposer en 2026 ?

La **mutuelle collective obligatoire** couvre le minimum ANI. Mais beaucoup de salariés ont besoin de **bien plus** : optique premium, soins dentaires lourds, médecines douces, hospitalisation en chambre individuelle… C'est là qu'intervient la **surcomplémentaire santé**.

## Qu'est-ce qu'une surcomplémentaire ?

C'est une **assurance santé qui s'ajoute** à la mutuelle collective. Elle intervient **après** le remboursement de la Sécu **et** de la mutuelle obligatoire, pour réduire (voire annuler) le reste à charge.

## Les principaux usages

| Poste | Reste à charge sans surco | Avec surco |
|---|---|---|
| Lunettes haut de gamme (600 €) | 350 € | 0 – 50 € |
| Couronne céramique (700 €) | 400 € | 100 € |
| Chambre individuelle (90 €/nuit) | 70 € | 0 € |
| Ostéopathie (60 € × 5) | 200 € | 0 € |

## Souscription : individuelle ou collective ?

### Option 1 — Surcomplémentaire individuelle
Le salarié souscrit **librement**, à son nom. Coût : **15 à 45 €/mois**. Aucune obligation pour l'employeur.

### Option 2 — Surcomplémentaire collective facultative
L'entreprise **négocie un contrat groupe**, les salariés y adhèrent **librement**. Tarif **30 à 50 % moins cher** qu'en individuel.

## Pourquoi la proposer en tant qu'employeur ?

- **Attractivité RH** : argument fort en entretien d'embauche
- **Fidélisation** : un avantage social peu onéreux mais très valorisé
- **Aucun coût** pour l'employeur si 100 % à charge du salarié
- **Image employeur** renforcée

## Fiscalité

- Si **financement employeur partiel** → traitement identique à la mutuelle obligatoire (contrat responsable obligatoire)
- Si **100 % salarié** → cotisations non déductibles du revenu mais pas de charges sociales

## La mise en place en 5 étapes

1. **Sondage interne** sur les besoins réels
2. **Comparatif de 3 contrats** auprès du même assureur ou d'un autre
3. **Présentation au CSE** (information ou consultation)
4. **Diffusion d'une notice** aux salariés
5. **Bilan annuel** d'adhésion et d'utilisation

## Articles connexes

- [Guide complet de la mutuelle entreprise](/blog/mutuelle-entreprise-2026-guide-complementaire-sante-collective)
- [Mutuelle TNS vs mutuelle entreprise](/blog/mutuelle-tns-vs-mutuelle-entreprise-2026)

**Boostez votre attractivité RH** : [comparez les meilleures surcomplémentaires entreprise](/landing/mutuelle-entreprise).
    `,
  },
];
