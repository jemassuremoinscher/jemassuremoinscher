export interface GlossaryTerm {
  id: string;
  term: string;
  slug: string;
  definition: string;
  category: string;
  content: string;
  tags: string[];
  relatedTerms?: string[];
}

export const glossaryCategories = [
  "Tous",
  "Général",
  "Auto & Moto",
  "Santé",
  "Habitation",
  "Vie & Prévoyance",
  "Professionnel",
];

export const glossaryTerms: GlossaryTerm[] = [
  {
    id: "1",
    term: "Franchise",
    slug: "franchise",
    definition: "Montant qui reste à la charge de l'assuré en cas de sinistre, avant l'intervention de l'assureur.",
    category: "Général",
    content: `La **franchise** est la somme qui reste à votre charge lors d'un sinistre. Elle peut être :

- **Franchise absolue** : montant fixe déduit de l'indemnisation (ex : 150€)
- **Franchise relative** : si le montant du sinistre dépasse la franchise, l'assureur rembourse la totalité
- **Franchise proportionnelle** : calculée en pourcentage du sinistre

**Exemple concret :** Avec une franchise de 300€ et un sinistre de 1 500€, vous recevez 1 200€ d'indemnisation.

**Conseil :** Une franchise élevée réduit votre prime d'assurance, mais augmente votre reste à charge en cas de sinistre. Trouvez le bon équilibre selon votre budget.`,
    tags: ["franchise", "sinistre", "indemnisation", "prime"],
    relatedTerms: ["2", "3", "5"],
  },
  {
    id: "2",
    term: "Prime d'assurance",
    slug: "prime-assurance",
    definition: "Montant que l'assuré paie à son assureur en échange de la couverture des risques prévus au contrat.",
    category: "Général",
    content: `La **prime d'assurance** (ou cotisation) est le prix que vous payez pour être couvert. Elle est calculée selon :

- **Le profil de l'assuré** : âge, antécédents, situation personnelle
- **Le niveau de garanties** choisi
- **La valeur du bien assuré**
- **La zone géographique**
- **Le montant de la franchise**

La prime peut être payée mensuellement, trimestriellement ou annuellement. Un paiement annuel est souvent moins cher car il évite les frais de fractionnement.

**Astuce :** Comparez régulièrement vos primes avec les offres du marché. Vous pouvez économiser jusqu'à 40% en changeant d'assureur.`,
    tags: ["prime", "cotisation", "tarif", "paiement"],
    relatedTerms: ["1", "3", "4"],
  },
  {
    id: "3",
    term: "Sinistre",
    slug: "sinistre",
    definition: "Événement dommageable couvert par le contrat d'assurance qui déclenche la garantie de l'assureur.",
    category: "Général",
    content: `Un **sinistre** est tout événement prévu dans votre contrat d'assurance qui provoque un dommage et déclenche votre droit à indemnisation.

**Que faire en cas de sinistre ?**

1. **Déclarer rapidement** : vous avez 5 jours ouvrés (2 jours pour un vol) pour déclarer le sinistre à votre assureur
2. **Rassembler les preuves** : photos, témoignages, factures, constat amiable
3. **Ne pas modifier les lieux** sauf pour la sécurité
4. **Contacter votre assureur** par courrier recommandé ou via votre espace client

**Types de sinistres courants :**
- Accident de la route
- Dégât des eaux
- Incendie
- Vol ou cambriolage
- Catastrophe naturelle`,
    tags: ["sinistre", "déclaration", "indemnisation", "dommage"],
    relatedTerms: ["1", "5", "6"],
  },
  {
    id: "4",
    term: "Bonus-Malus",
    slug: "bonus-malus",
    definition: "Système de coefficient appliqué à la prime d'assurance auto qui récompense les bons conducteurs et pénalise les responsables de sinistres.",
    category: "Auto & Moto",
    content: `Le **bonus-malus** (ou coefficient de réduction-majoration, CRM) est un mécanisme légal qui ajuste votre prime d'assurance auto selon votre historique de conduite.

**Comment ça fonctionne ?**

- **Départ** : coefficient de 1,00
- **Chaque année sans sinistre** : -5% (coefficient × 0,95)
- **Sinistre responsable** : +25% (coefficient × 1,25)
- **Sinistre semi-responsable** : +12,5% (coefficient × 1,125)
- **Bonus maximum** : 0,50 (soit -50% sur la prime de base)
- **Malus maximum** : 3,50 (soit +250%)

**Il faut 13 ans sans sinistre** pour atteindre le bonus maximum de 0,50.

**Bon à savoir :** Le bonus-malus vous suit si vous changez d'assureur. Votre nouvel assureur demandera un relevé d'information à l'ancien.`,
    tags: ["bonus-malus", "CRM", "coefficient", "auto", "conducteur"],
    relatedTerms: ["7", "8", "9"],
  },
  {
    id: "5",
    term: "Indemnisation",
    slug: "indemnisation",
    definition: "Compensation financière versée par l'assureur à l'assuré suite à un sinistre couvert par le contrat.",
    category: "Général",
    content: `L'**indemnisation** est le versement effectué par l'assureur pour compenser les dommages subis lors d'un sinistre.

**Modes d'indemnisation :**

- **Valeur à neuf** : remplacement par un bien neuf équivalent
- **Valeur de remplacement** : prix du bien au jour du sinistre (vétusté déduite)
- **Valeur vénale** : prix de vente sur le marché
- **Indemnisation en nature** : réparation ou remplacement direct

**Délais d'indemnisation :**
- Catastrophe naturelle : 3 mois après la publication de l'arrêté
- Vol : 30 jours après déclaration
- Autres sinistres : variable selon le contrat

**Important :** L'indemnisation ne peut pas dépasser le montant du préjudice réel. C'est le principe indemnitaire.`,
    tags: ["indemnisation", "remboursement", "valeur", "vétusté"],
    relatedTerms: ["1", "3", "6"],
  },
  {
    id: "6",
    term: "Tiers",
    slug: "tiers",
    definition: "Personne étrangère au contrat d'assurance, qui subit un dommage dont l'assuré est responsable.",
    category: "Général",
    content: `En assurance, le **tiers** désigne toute personne extérieure au contrat qui subit un préjudice causé par l'assuré.

**Assurance au tiers (responsabilité civile) :**

C'est le niveau minimum obligatoire en assurance auto. Elle couvre uniquement les dommages que vous causez à autrui :
- Dommages corporels aux autres personnes
- Dommages matériels aux véhicules et biens d'autrui

**Elle ne couvre PAS :**
- Vos propres blessures
- Les dégâts sur votre véhicule
- Le vol de votre véhicule

**Formules intermédiaires :**
- **Tiers + vol + incendie** : ajoute la couverture contre le vol et l'incendie
- **Tiers étendu** : inclut bris de glace, catastrophes naturelles

**Pour qui ?** L'assurance au tiers convient aux véhicules anciens ou de faible valeur.`,
    tags: ["tiers", "responsabilité civile", "RC", "auto"],
    relatedTerms: ["4", "7", "8"],
  },
  {
    id: "7",
    term: "Tous risques",
    slug: "tous-risques",
    definition: "Formule d'assurance auto offrant la couverture la plus complète, incluant les dommages au véhicule de l'assuré même en cas de responsabilité.",
    category: "Auto & Moto",
    content: `L'assurance **tous risques** est la formule la plus protectrice en assurance auto. Elle couvre l'ensemble des dommages, y compris ceux subis par votre propre véhicule.

**Garanties incluses :**

- Responsabilité civile (obligatoire)
- Dommages collision (même responsable)
- Vol et tentative de vol
- Incendie et explosion
- Bris de glace
- Catastrophes naturelles et technologiques
- Vandalisme
- Protection du conducteur

**Quand choisir tous risques ?**
- Véhicule neuf ou récent (moins de 5 ans)
- Véhicule de valeur élevée
- Financement en cours (crédit ou LOA)
- Conducteur novice

**Coût moyen :** 30 à 50% plus cher que l'assurance au tiers, mais une protection complète en cas de sinistre.`,
    tags: ["tous risques", "auto", "garantie", "couverture complète"],
    relatedTerms: ["6", "4", "8"],
  },
  {
    id: "8",
    term: "Constat amiable",
    slug: "constat-amiable",
    definition: "Document officiel rempli par les conducteurs impliqués dans un accident de la route pour établir les circonstances du sinistre.",
    category: "Auto & Moto",
    content: `Le **constat amiable** (ou constat européen d'accident) est un formulaire standardisé que les conducteurs remplissent après un accident.

**Comment le remplir correctement ?**

1. **Recto (à remplir ensemble)** :
   - Date, heure et lieu de l'accident
   - Identité des conducteurs et immatriculations
   - Assureurs et numéros de contrat
   - Croquis de l'accident
   - Circonstances (cocher les cases correspondantes)
   - Signatures des deux parties

2. **Verso (à remplir seul)** :
   - Observations complémentaires
   - Dégâts apparents
   - Témoins éventuels

**Règles essentielles :**
- Ne signez que si vous êtes d'accord avec le contenu
- Utilisez un stylo à bille (pas de crayon)
- Envoyez-le à votre assureur sous 5 jours ouvrés
- Gardez toujours un exemplaire vierge dans votre véhicule

**Attention :** Une fois signé, le constat est difficilement contestable.`,
    tags: ["constat amiable", "accident", "auto", "déclaration"],
    relatedTerms: ["3", "4", "6"],
  },
  {
    id: "9",
    term: "Loi Hamon",
    slug: "loi-hamon",
    definition: "Loi permettant de résilier son assurance auto, moto ou habitation à tout moment après la première année de contrat.",
    category: "Général",
    content: `La **loi Hamon** (loi consommation du 17 mars 2014) facilite la résiliation des contrats d'assurance pour les particuliers.

**Contrats concernés :**
- Assurance auto
- Assurance moto
- Assurance habitation
- Assurance affinitaire (téléphone, voyage...)

**Comment ça marche ?**

1. Après 1 an de contrat, vous pouvez résilier à tout moment
2. Votre nouvel assureur s'occupe des démarches de résiliation
3. La résiliation prend effet 1 mois après la demande
4. L'ancien assureur rembourse le trop-perçu sous 30 jours

**Avantages :**
- Plus besoin d'attendre la date anniversaire
- Pas de justification nécessaire
- Procédure simplifiée (le nouvel assureur gère tout)
- Pas de frais de résiliation

**Bon à savoir :** La loi Hamon ne s'applique pas aux assurances santé, vie ou prévoyance. Pour la mutuelle, c'est la loi du 14 juillet 2019 qui permet la résiliation après 1 an.`,
    tags: ["loi hamon", "résiliation", "changement assureur", "droits"],
    relatedTerms: ["10", "2"],
  },
  {
    id: "10",
    term: "Loi Lemoine",
    slug: "loi-lemoine",
    definition: "Loi permettant de changer d'assurance emprunteur à tout moment, sans frais et sans attendre la date anniversaire.",
    category: "Vie & Prévoyance",
    content: `La **loi Lemoine** (1er juin 2022) révolutionne l'assurance emprunteur en France en permettant une résiliation à tout moment.

**Ce que permet la loi Lemoine :**

- **Résiliation à tout moment** : plus besoin d'attendre la date anniversaire
- **Pas de frais** : la résiliation est gratuite
- **Pas de questionnaire médical** pour les prêts < 200 000€ par assuré
- **Droit à l'oubli réduit** : 5 ans au lieu de 10 pour les anciens malades du cancer

**Conditions :**
- Le nouveau contrat doit offrir des garanties au moins équivalentes
- La banque a 10 jours pour répondre à votre demande

**Économies potentielles :**

En changeant d'assurance emprunteur, vous pouvez économiser entre 5 000€ et 15 000€ sur la durée de votre prêt immobilier.

**Étapes pour changer :**
1. Comparer les offres d'assurance emprunteur
2. Souscrire un nouveau contrat avec garanties équivalentes
3. Envoyer la demande de substitution à votre banque
4. La banque accepte ou refuse sous 10 jours`,
    tags: ["loi lemoine", "emprunteur", "prêt immobilier", "résiliation"],
    relatedTerms: ["9", "15"],
  },
  {
    id: "11",
    term: "Mutuelle santé",
    slug: "mutuelle-sante",
    definition: "Complémentaire santé qui rembourse tout ou partie des frais médicaux non pris en charge par la Sécurité sociale.",
    category: "Santé",
    content: `La **mutuelle santé** (ou complémentaire santé) complète les remboursements de l'Assurance Maladie obligatoire.

**Pourquoi une mutuelle ?**

La Sécurité sociale ne rembourse en moyenne que 70% des frais médicaux. La mutuelle prend en charge le reste (ticket modérateur) et peut couvrir des dépassements d'honoraires.

**Garanties principales :**
- **Hospitalisation** : chambre particulière, forfait journalier
- **Optique** : montures, verres, lentilles
- **Dentaire** : prothèses, implants, orthodontie
- **Médecine courante** : consultations, médicaments, analyses

**100% Santé :**
Depuis 2021, le dispositif 100% Santé garantit un reste à charge zéro sur :
- Certaines lunettes
- Certaines prothèses dentaires
- Certains appareils auditifs

**Conseil :** Adaptez votre mutuelle à vos besoins réels. Un jeune en bonne santé n'a pas les mêmes besoins qu'une famille avec enfants.`,
    tags: ["mutuelle", "santé", "complémentaire", "remboursement", "sécurité sociale"],
    relatedTerms: ["12", "13"],
  },
  {
    id: "12",
    term: "Ticket modérateur",
    slug: "ticket-moderateur",
    definition: "Part des frais médicaux qui reste à la charge du patient après le remboursement de la Sécurité sociale.",
    category: "Santé",
    content: `Le **ticket modérateur** est la différence entre le tarif de base de la Sécurité sociale et le montant qu'elle rembourse.

**Exemples concrets :**

| Acte | Tarif base | Taux SS | Remboursement SS | Ticket modérateur |
|------|-----------|---------|-----------------|------------------|
| Consultation généraliste | 26,50€ | 70% | 18,55€ | 7,95€ |
| Consultation spécialiste | 30€ | 70% | 21€ | 9€ |
| Hospitalisation | Variable | 80% | 80% | 20% |

**Cas d'exonération du ticket modérateur :**
- Affection de longue durée (ALD)
- Maternité (à partir du 6e mois)
- Accident du travail ou maladie professionnelle
- Bénéficiaires de la CSS (Complémentaire Santé Solidaire)

**Rôle de la mutuelle :** La plupart des mutuelles remboursent le ticket modérateur à 100%, ce qui signifie un reste à charge nul sur les actes au tarif de base.`,
    tags: ["ticket modérateur", "sécurité sociale", "remboursement", "santé"],
    relatedTerms: ["11", "13"],
  },
  {
    id: "13",
    term: "Tiers payant",
    slug: "tiers-payant",
    definition: "Mécanisme qui dispense l'assuré d'avancer les frais médicaux : l'assureur et/ou la Sécurité sociale paient directement le professionnel de santé.",
    category: "Santé",
    content: `Le **tiers payant** vous évite d'avancer les frais de santé. Le professionnel de santé est payé directement par la Sécurité sociale et/ou votre mutuelle.

**Types de tiers payant :**

- **Tiers payant partiel** : vous ne payez que le ticket modérateur (la part Sécu est payée directement)
- **Tiers payant intégral** : vous ne payez rien (Sécu + mutuelle paient directement)

**Où s'applique-t-il ?**
- Pharmacies (avec carte Vitale)
- Laboratoires d'analyses
- Radiologies
- Hôpitaux et cliniques
- De plus en plus de médecins et spécialistes

**Pour en bénéficier :**
1. Présentez votre carte Vitale
2. Présentez votre carte de tiers payant (fournie par votre mutuelle)
3. Le professionnel de santé facture directement vos organismes

**Obligatoire pour :** les bénéficiaires de la CSS, les victimes d'accident du travail, les femmes enceintes (à partir du 6e mois).`,
    tags: ["tiers payant", "carte vitale", "santé", "remboursement"],
    relatedTerms: ["11", "12"],
  },
  {
    id: "14",
    term: "Responsabilité civile",
    slug: "responsabilite-civile",
    definition: "Obligation légale de réparer les dommages causés à autrui. L'assurance RC couvre les conséquences financières de cette responsabilité.",
    category: "Général",
    content: `La **responsabilité civile** (RC) est une obligation légale : toute personne doit réparer les dommages qu'elle cause à autrui (article 1240 du Code civil).

**Types de responsabilité civile :**

- **RC vie privée** : incluse dans l'assurance habitation, couvre les dommages de la vie quotidienne
- **RC auto** : obligatoire, couvre les dommages causés avec votre véhicule
- **RC professionnelle** : couvre les dommages liés à votre activité professionnelle

**Dommages couverts :**
- **Corporels** : blessures physiques causées à un tiers
- **Matériels** : dégâts sur les biens d'autrui
- **Immatériels** : préjudice moral, perte financière

**Exemples courants :**
- Votre enfant casse une vitre chez le voisin → RC vie privée
- Vous provoquez un accident de la route → RC auto
- Dégât des eaux chez votre voisin du dessous → RC habitation

**Attention :** La RC ne couvre pas vos propres dommages ni les dommages intentionnels.`,
    tags: ["responsabilité civile", "RC", "dommages", "obligation"],
    relatedTerms: ["6", "16"],
  },
  {
    id: "15",
    term: "Assurance emprunteur",
    slug: "assurance-emprunteur",
    definition: "Assurance souscrite lors d'un prêt immobilier qui garantit le remboursement du crédit en cas de décès, invalidité ou incapacité de travail.",
    category: "Vie & Prévoyance",
    content: `L'**assurance emprunteur** protège à la fois l'emprunteur et la banque en cas d'impossibilité de rembourser le prêt immobilier.

**Garanties principales :**

- **Décès** : le capital restant dû est remboursé à la banque
- **PTIA** (Perte Totale et Irréversible d'Autonomie) : idem
- **IPT** (Invalidité Permanente Totale) : prise en charge des mensualités
- **IPP** (Invalidité Permanente Partielle) : prise en charge partielle
- **ITT** (Incapacité Temporaire de Travail) : prise en charge pendant l'arrêt

**Coût :**
L'assurance emprunteur représente 20 à 40% du coût total du crédit. Changer d'assurance peut faire économiser des milliers d'euros.

**Délégation d'assurance :**
Grâce à la loi Lemoine, vous pouvez choisir une assurance externe (pas celle de la banque) à tout moment, à condition que les garanties soient équivalentes.

**Quotité :** Pour un couple, la quotité définit la part couverte par chaque emprunteur (ex : 50/50, 100/100, 70/30).`,
    tags: ["emprunteur", "prêt immobilier", "crédit", "banque", "garantie"],
    relatedTerms: ["10", "16"],
  },
  {
    id: "16",
    term: "Dégât des eaux",
    slug: "degat-des-eaux",
    definition: "Sinistre causé par une fuite, un débordement ou une infiltration d'eau, couvert par l'assurance habitation.",
    category: "Habitation",
    content: `Le **dégât des eaux** est le sinistre le plus fréquent en assurance habitation (environ 800 000 cas par an en France).

**Causes courantes :**
- Fuite sur une canalisation
- Débordement d'un appareil (lave-linge, baignoire)
- Infiltration par la toiture ou les murs
- Rupture d'un joint ou d'un flexible
- Gel des canalisations

**Que faire en cas de dégât des eaux ?**

1. **Couper l'eau** à la source si possible
2. **Limiter les dégâts** : éponger, protéger vos biens
3. **Prendre des photos** avant de nettoyer
4. **Remplir un constat amiable dégât des eaux** avec le voisin si concerné
5. **Déclarer le sinistre** à votre assureur sous 5 jours ouvrés
6. **Conserver les justificatifs** : factures, devis de réparation

**Convention IRSI :** Pour les sinistres < 5 000€ HT, c'est l'assureur de l'occupant du local sinistré qui gère et indemnise, quel que soit le responsable.`,
    tags: ["dégât des eaux", "habitation", "fuite", "sinistre", "IRSI"],
    relatedTerms: ["3", "14", "17"],
  },
  {
    id: "17",
    term: "Garantie décennale",
    slug: "garantie-decennale",
    definition: "Assurance obligatoire pour les constructeurs couvrant les dommages compromettant la solidité de l'ouvrage pendant 10 ans après la réception des travaux.",
    category: "Habitation",
    content: `La **garantie décennale** est une assurance obligatoire pour tous les professionnels du bâtiment (loi Spinetta, 1978).

**Que couvre-t-elle ?**

Pendant 10 ans après la réception des travaux, elle couvre les dommages qui :
- Compromettent la solidité de l'ouvrage (fondations, murs porteurs)
- Rendent l'ouvrage impropre à sa destination (infiltrations rendant un logement inhabitable)
- Affectent la solidité d'un élément d'équipement indissociable

**Qui est concerné ?**
- Entrepreneurs et artisans du bâtiment
- Architectes et maîtres d'œuvre
- Promoteurs immobiliers
- Constructeurs de maisons individuelles

**En tant que propriétaire :**
- Vérifiez que l'artisan possède une attestation décennale AVANT les travaux
- Conservez cette attestation pendant 10 ans minimum
- En cas de vente, transmettez-la au nouveau propriétaire

**Dommage-ouvrage :** L'assurance dommage-ouvrage (DO) est le pendant côté propriétaire. Elle permet un remboursement rapide sans attendre la recherche de responsabilité.`,
    tags: ["décennale", "construction", "bâtiment", "travaux", "garantie"],
    relatedTerms: ["16", "18"],
  },
  {
    id: "18",
    term: "PNO (Propriétaire Non Occupant)",
    slug: "assurance-pno",
    definition: "Assurance destinée aux propriétaires qui mettent leur bien en location, couvrant les risques non pris en charge par l'assurance du locataire.",
    category: "Habitation",
    content: `L'assurance **PNO** (Propriétaire Non Occupant) protège le propriétaire bailleur contre les risques liés à son bien locatif.

**Pourquoi souscrire une PNO ?**

- **Obligatoire** en copropriété (loi ALUR)
- Couvre les périodes de vacance locative (logement vide entre deux locataires)
- Complète l'assurance habitation du locataire
- Protège en cas de défaut d'assurance du locataire

**Garanties principales :**
- Responsabilité civile du propriétaire
- Dégât des eaux et incendie
- Catastrophes naturelles
- Vice de construction
- Troubles de jouissance causés aux voisins

**Garanties optionnelles :**
- Garantie loyers impayés (GLI)
- Protection juridique
- Vandalisme par le locataire

**Coût moyen :** 80€ à 200€/an selon la surface et les garanties. C'est un investissement faible comparé aux risques couverts.`,
    tags: ["PNO", "propriétaire", "location", "bailleur", "habitation"],
    relatedTerms: ["16", "17", "19"],
  },
  {
    id: "19",
    term: "GLI (Garantie Loyers Impayés)",
    slug: "garantie-loyers-impayes",
    definition: "Assurance qui protège le propriétaire bailleur contre le risque de loyers impayés par le locataire.",
    category: "Professionnel",
    content: `La **GLI** (Garantie Loyers Impayés) sécurise les revenus locatifs du propriétaire bailleur.

**Que couvre la GLI ?**

- **Loyers impayés** : remboursement des loyers et charges non payés
- **Frais de contentieux** : procédure d'expulsion, huissier, avocat
- **Dégradations locatives** : réparations après départ du locataire
- **Vacance locative** : compensation pendant la recherche d'un nouveau locataire (option)

**Conditions de souscription :**
Le locataire doit généralement :
- Être en CDI (hors période d'essai) ou fonctionnaire
- Avoir un taux d'effort < 33% (loyer < 1/3 des revenus nets)
- Fournir les justificatifs demandés (bulletins de salaire, avis d'imposition)

**Coût :** 2,5% à 5% du loyer charges comprises.

**GLI vs Caution :** Vous ne pouvez pas cumuler GLI et caution (personne physique), sauf si le locataire est étudiant ou apprenti.

**Alternative :** La garantie Visale (gratuite, proposée par Action Logement) pour les jeunes de moins de 30 ans.`,
    tags: ["GLI", "loyers impayés", "bailleur", "location", "propriétaire"],
    relatedTerms: ["18"],
  },
  {
    id: "20",
    term: "RC Pro (Responsabilité Civile Professionnelle)",
    slug: "rc-pro",
    definition: "Assurance couvrant les dommages causés à des tiers dans le cadre de l'activité professionnelle.",
    category: "Professionnel",
    content: `La **RC Pro** (Responsabilité Civile Professionnelle) protège les entreprises et indépendants contre les conséquences financières des dommages causés à des tiers dans le cadre de leur activité.

**Obligatoire pour :**
- Professions réglementées (médecins, avocats, experts-comptables)
- Professionnels du bâtiment
- Agents immobiliers
- Auto-écoles
- Agences de voyage

**Recommandée pour :** toutes les entreprises et indépendants, même si non obligatoire.

**Dommages couverts :**
- **Corporels** : blessure d'un client dans vos locaux
- **Matériels** : dégât sur un bien confié par un client
- **Immatériels** : erreur de conseil, retard de livraison, perte de données

**Exemples concrets :**
- Un consultant donne un mauvais conseil financier → perte pour le client
- Un plombier cause un dégât des eaux chez un client
- Un développeur web livre un site avec une faille de sécurité

**Coût :** variable selon l'activité, le chiffre d'affaires et les garanties. De 100€/an pour un consultant à plusieurs milliers pour le BTP.`,
    tags: ["RC Pro", "responsabilité civile professionnelle", "entreprise", "indépendant"],
    relatedTerms: ["14", "17"],
  },
  {
    id: "21",
    term: "Prévoyance",
    slug: "prevoyance",
    definition: "Ensemble des garanties qui protègent l'assuré et sa famille contre les risques de la vie : décès, invalidité, incapacité de travail.",
    category: "Vie & Prévoyance",
    content: `La **prévoyance** regroupe les contrats qui protègent contre les aléas de la vie ayant un impact financier majeur.

**Garanties de prévoyance :**

- **Décès** : versement d'un capital ou d'une rente au(x) bénéficiaire(s)
- **Invalidité** : rente compensant la perte de revenus
- **Incapacité de travail** : indemnités journalières pendant un arrêt maladie prolongé
- **Dépendance** : rente en cas de perte d'autonomie

**Pourquoi souscrire ?**

Les prestations de la Sécurité sociale sont souvent insuffisantes :
- Indemnités journalières limitées à 50% du salaire
- Pension d'invalidité : 30 à 50% du salaire selon la catégorie
- Capital décès Sécu : environ 3 500€ seulement

**Pour les indépendants :**
La protection est encore plus faible. Un contrat de prévoyance individuelle est fortement recommandé pour :
- Les auto-entrepreneurs
- Les professions libérales
- Les gérants TNS (Travailleur Non Salarié)

**Conseil :** Vérifiez d'abord ce que couvre votre entreprise (prévoyance collective obligatoire) avant de souscrire un contrat individuel.`,
    tags: ["prévoyance", "décès", "invalidité", "incapacité", "protection"],
    relatedTerms: ["11", "15"],
  },
  {
    id: "22",
    term: "Vétusté",
    slug: "vetuste",
    definition: "Dépréciation d'un bien due à l'usure et au temps, prise en compte dans le calcul de l'indemnisation par l'assureur.",
    category: "Général",
    content: `La **vétusté** représente la perte de valeur d'un bien due à son usure naturelle au fil du temps. Elle est appliquée par l'assureur lors du calcul de l'indemnisation.

**Comment est-elle calculée ?**

Chaque type de bien a un taux de vétusté annuel :
- **Électroménager** : 10 à 15% par an
- **Mobilier** : 5 à 10% par an
- **Vêtements** : 20 à 30% par an
- **Informatique** : 15 à 20% par an
- **Toiture** : 1 à 2% par an

**Exemple :**
Un canapé acheté 1 000€ il y a 5 ans, avec une vétusté de 10%/an :
- Vétusté = 50% → Valeur résiduelle = 500€
- Indemnisation = 500€ (au lieu de 1 000€)

**Comment limiter l'impact ?**

- **Garantie valeur à neuf** : option qui rembourse le prix du neuf, sans déduction de vétusté (généralement pour les biens de moins de 5 ans)
- **Rééquipement à neuf** : variante qui couvre le remplacement à neuf

**Conseil :** Conservez vos factures d'achat. Elles servent de preuve pour l'indemnisation.`,
    tags: ["vétusté", "indemnisation", "valeur", "usure", "remplacement"],
    relatedTerms: ["5", "1"],
  },
  {
    id: "23",
    term: "Délai de carence",
    slug: "delai-de-carence",
    definition: "Période suivant la souscription d'un contrat pendant laquelle les garanties ne sont pas encore actives.",
    category: "Général",
    content: `Le **délai de carence** est une période d'attente après la souscription du contrat pendant laquelle vous ne pouvez pas bénéficier de certaines garanties.

**Durées courantes :**

| Type d'assurance | Délai de carence |
|-----------------|-----------------|
| Mutuelle santé (optique/dentaire) | 3 à 6 mois |
| Mutuelle santé (hospitalisation) | 0 à 3 mois |
| Assurance emprunteur (ITT) | 90 jours |
| Prévoyance (arrêt de travail) | 30 à 90 jours |
| Assurance animaux | 48h à 6 mois |

**Pourquoi existe-t-il ?**

Le délai de carence protège l'assureur contre les souscriptions opportunistes (ex : souscrire une mutuelle dentaire juste avant un soin coûteux prévu).

**Comment l'éviter ?**

- **Changement d'assureur** : si vous aviez déjà un contrat similaire, le nouveau peut reprendre l'ancienneté (pas de nouveau délai de carence)
- **Mutuelle d'entreprise** : généralement sans délai de carence
- **Négociation** : certains assureurs suppriment le délai de carence à la souscription

**Attention :** Ne confondez pas délai de carence et franchise (qui s'applique à chaque sinistre, pas à la souscription).`,
    tags: ["délai de carence", "souscription", "attente", "garantie"],
    relatedTerms: ["1", "2", "11"],
  },
  {
    id: "24",
    term: "Avenant",
    slug: "avenant",
    definition: "Document qui modifie les conditions du contrat d'assurance en cours (ajout/suppression de garanties, changement de situation).",
    category: "Général",
    content: `Un **avenant** est un acte écrit qui modifie votre contrat d'assurance existant sans avoir à en souscrire un nouveau.

**Cas nécessitant un avenant :**

- **Changement de véhicule** (assurance auto)
- **Déménagement** (assurance habitation)
- **Ajout ou retrait de garantie**
- **Modification de la franchise**
- **Changement de bénéficiaire** (assurance vie)
- **Changement de situation familiale** (mariage, naissance)

**Comment ça fonctionne ?**

1. Vous informez votre assureur du changement
2. L'assureur évalue l'impact sur le risque et la prime
3. Un avenant est rédigé avec les nouvelles conditions
4. Vous signez l'avenant
5. Les nouvelles conditions entrent en vigueur

**Impact sur la prime :**
- Un changement qui augmente le risque → prime en hausse
- Un changement qui diminue le risque → prime en baisse
- L'assureur ajuste le montant au prorata

**Important :** Déclarez tout changement de situation à votre assureur. Une omission peut entraîner une réduction d'indemnisation voire une nullité du contrat.`,
    tags: ["avenant", "modification", "contrat", "garantie"],
    relatedTerms: ["2", "9"],
  },
  {
    id: "25",
    term: "Assurance vie",
    slug: "assurance-vie",
    definition: "Contrat d'épargne et de prévoyance permettant de constituer un capital, préparer sa retraite ou transmettre un patrimoine avec une fiscalité avantageuse.",
    category: "Vie & Prévoyance",
    content: `L'**assurance vie** est le placement préféré des Français avec plus de 1 900 milliards d'euros d'encours.

**Double fonction :**

1. **Épargne** : vous constituez un capital qui fructifie
2. **Prévoyance** : en cas de décès, le capital est transmis aux bénéficiaires

**Types de supports :**

- **Fonds en euros** : capital garanti, rendement modéré (1,5 à 3%/an)
- **Unités de compte (UC)** : investissement en actions/obligations, rendement potentiellement plus élevé mais non garanti

**Fiscalité avantageuse :**

Après 8 ans de détention :
- Abattement annuel de 4 600€ (célibataire) ou 9 200€ (couple) sur les gains
- Taux réduit de 7,5% au-delà (+ prélèvements sociaux de 17,2%)

**Transmission :**
- Chaque bénéficiaire bénéficie d'un abattement de 152 500€ (versements avant 70 ans)
- Hors succession : les capitaux ne passent pas par le notaire

**Conseil :** L'assurance vie est un outil polyvalent. Vous pouvez y effectuer des retraits partiels à tout moment (ce n'est pas bloqué contrairement aux idées reçues).`,
    tags: ["assurance vie", "épargne", "placement", "fiscalité", "transmission"],
    relatedTerms: ["15", "21"],
  },
];
