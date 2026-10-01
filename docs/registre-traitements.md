# Registre des activités de traitement (article 30 RGPD)

Responsable du traitement : jemassuremoinscher.fr, 2 rue d'Angleterre, 06000 Nice.
Contact RGPD : contact@jemassuremoinscher.fr (aucun DPO désigné à notre connaissance).

Établi le 2 octobre 2026 à partir du code du dépôt (tables Supabase, Edge Functions, scripts du site).
C'est un **projet à faire relire** : les bases légales et les durées marquées « à valider » sont des propositions, pas des décisions.

## Sous-traitants et transferts hors UE (communs à plusieurs traitements)

| Sous-traitant | Rôle | Hors UE |
| --- | --- | --- |
| Lovable Cloud / Supabase | Base de données, authentification, stockage de fichiers, Edge Functions | Région de la base **à confirmer** |
| Vercel | Hébergement et diffusion du site (journaux techniques avec adresse IP) | Société américaine : transfert possible, à vérifier dans le DPA |
| Resend | Envoi des emails transactionnels et des relances | Société américaine : transfert possible, à vérifier dans le DPA |
| Google | GA4, Google Ads, reCAPTCHA v3 ; modèle Gemini (via la passerelle IA de Lovable) pour le chatbot | Oui (États-Unis) |
| Lovable (passerelle IA) | Transmet les messages du chatbot au modèle `google/gemini-2.5-flash` | À vérifier dans le DPA |
| Meta | Pixel Meta (pages de conversion, avec consentement marketing) | Oui (États-Unis) |
| Microsoft | Clarity (enregistrement de sessions, avec consentement analytique) | Oui (États-Unis) |

Make.com (publication LinkedIn) ne reçoit que des contenus d'articles, pas de données de prospects : hors registre.

Garanties pour les transferts vers les États-Unis : Data Privacy Framework ou clauses contractuelles types, **à vérifier fournisseur par fournisseur**.

Mesures de sécurité communes :
- HTTPS partout ;
- RLS activée sur les tables ;
- accès au CRM réservé aux comptes authentifiés avec rôle ;
- inscriptions publiques désactivées ;
- secrets côté serveur uniquement ;
- journal d'audit des deals (`deal_audit_log`) ;
- sauvegardes quotidiennes (`db-backup`).

La double authentification est en cours de mise en place (phase 1, non bloquante).

---

## 1. Demandes de devis

- **Finalité :** traiter une demande de devis et rappeler le prospect pour lui présenter des offres.
- **Base légale :** mesures précontractuelles prises à la demande de la personne (art. 6.1.b). À valider.
- **Personnes concernées :** prospects qui remplissent un formulaire de devis.
- **Données :**
  - identité et coordonnées : nom, email, téléphone, code postal ;
  - réponses au formulaire selon le produit (`quote_data` : véhicule, logement, animal, situation…) ;
  - page d'origine.
- **Tables :** `insurance_quotes`, puis `contacts` et `deals` (`source_type = insurance_quote`), `site_error_log` en cas d'échec d'envoi.
- **Sous-traitants :** Lovable Cloud/Supabase, Vercel, Resend (email de confirmation et notification interne), Google reCAPTCHA.
- **Transferts hors UE :** Resend et Google (voir tableau).
- **Durée :**
  - annoncée : 3 ans après le dernier contact ;
  - appliquée : **aucune purge automatique** ; `cleanup-deleted-items` est manuelle et ne vise que les devis déjà en corbeille depuis 30 jours.
- **Sécurité :** reCAPTCHA v3 à l'envoi, RLS (pas de lecture anonyme), mesures communes.

## 2. Rappels (demande de rappel)

- **Finalité :** rappeler une personne au créneau demandé.
- **Base légale :** mesures précontractuelles (art. 6.1.b). À valider.
- **Personnes concernées :** visiteurs qui demandent un rappel.
- **Données :** nom, email, téléphone, créneau préféré, message libre.
- **Tables :** `contact_callbacks`.
- **Sous-traitants :** Lovable Cloud/Supabase, Vercel.
- **Transferts hors UE :** selon la région de la base, à confirmer.
- **Durée :** comme le traitement 1 (aucune purge automatique aujourd'hui).
- **Sécurité :** mesures communes.

## 3. Suivi commercial (CRM) et gestion des clients

- **Finalité :**
  - suivre les prospects et clients : étapes, tâches, notes, attribution aux conseillers, scoring ;
  - gérer les contrats, sinistres et commissions ;
  - tracer le devoir de conseil.
- **Base légale :**
  - exécution du contrat pour les clients ;
  - intérêt légitime pour les prospects ;
  - obligation légale pour le devoir de conseil (DDA).
  - À valider.
- **Personnes concernées :** prospects, clients, collaborateurs (auteurs des actions).
- **Données :**
  - coordonnées ;
  - produit recherché ;
  - notes et descriptions libres ;
  - score (`lead_score`) ;
  - contrats (assureur, numéro de police, prime, dates) ;
  - sinistres (description, montants, responsabilité) ;
  - documents justificatifs ;
  - fiches de devoir de conseil (situation, besoins, recommandation) ;
  - email de l'auteur dans le journal d'audit.
- **Tables :** `contacts`, `deals`, `activities`, `deal_tasks`, `deal_audit_log`, `documents` (et fichiers stockés), `contracts`, `claims`, `commission_payments`, `advice_records`, `lead_redistribution_log`, `notification_log`, `google_ads_conversions` (code postal, UTM).
- **Sous-traitants :** Lovable Cloud/Supabase ; Google Drive si des documents y sont liés (`documents.drive_url`, à confirmer).
- **Transferts hors UE :** selon la région de la base, à confirmer.
- **Durée :**
  - annoncée : prospects 3 ans, clients durée du contrat + 5 ans ;
  - appliquée : aucune purge automatique ; la corbeille des deals se purge à la main.
- **Décision automatisée :** non. Le score sert seulement à prioriser ; un conseiller traite chaque demande.
- **Sécurité :** mesures communes, journal d'audit, suppression des leads du site réservée aux administrateurs.

## 4. Relances automatiques (J+3 et J+7)

- **Finalité :** relancer par email un prospect resté sans réponse.
- **Base légale :** intérêt légitime, avec opposition possible par le lien de désinscription présent dans chaque email (art. 6.1.f). À valider.
- **Personnes concernées :** prospects à l'étape lead.
- **Données :** prénom, email, produit, dates d'envoi, identifiant d'envoi Resend.
- **Tables :** `quote_followup_log`, `contacts.email_opt_out` (opposition via `email-optout`), `deal_stage_email_log`.
- **Sous-traitants :** Resend, Lovable Cloud/Supabase.
- **Transferts hors UE :** Resend.
- **Durée :** journal d'envoi conservé avec le deal (aucune purge automatique).
- **Sécurité :** déclenchement par secret partagé (cron), un seul envoi par étape et par deal.

Traitement interne associé : l'alerte « demande non traitée après 45 minutes » (`lead_alert_log`) n'envoie aux collaborateurs que le prénom et le produit, jamais l'email ni le téléphone du prospect.

## 5. Emails et suivi d'ouverture

- **Finalité :** envoyer les emails du CRM (modèles) et savoir s'ils ont été ouverts ou cliqués.
- **Base légale :**
  - intérêt légitime pour l'envoi ;
  - pour le suivi d'ouverture, base légale **à valider** : la CNIL considère le pixel de suivi comme un traceur soumis à consentement, sauf exceptions.
- **Personnes concernées :** prospects et clients destinataires.
- **Données :** email et nom du destinataire, sujet, dates d'envoi, d'ouverture et de clic, nombres d'ouvertures et de clics.
- **Tables :** `email_tracking`, `email_templates` (sans donnée personnelle).
- **Sous-traitants :** Resend.
- **Transferts hors UE :** Resend.
- **Durée :** aucune purge automatique. À définir.
- **Sécurité :** mesures communes.

## 6. Newsletter et guide à télécharger

- **Finalité :** envoyer la newsletter et le guide demandé.
- **Base légale :** consentement (art. 6.1.a).
- **Personnes concernées :** inscrits à la newsletter, personnes qui téléchargent le guide.
- **Données :** email, source d'inscription, statut, dates d'inscription, de confirmation et de désinscription, jeton de confirmation (stocké haché).
- **Tables :** `newsletter_subscribers`.
- **Sous-traitants :** Resend, Lovable Cloud/Supabase.
- **Transferts hors UE :** Resend.
- **Durée :** jusqu'à la désinscription. Durée après inactivité à définir.
- **Point à corriger :**
  - `lead-magnet-capture` inscrit l'email en `pending` sans double confirmation ;
  - il **repasse en `pending` une adresse désinscrite** (« ré-opt-in léger »).
  - Un téléchargement du guide ne devrait pas annuler une désinscription.
- **Sécurité :** double confirmation pour l'inscription directe (`newsletter-subscribe`).

## 7. Quiz

- **Finalité :** recommander des assurances selon les réponses, puis recontacter la personne.
- **Base légale :** consentement ou mesures précontractuelles. À valider.
- **Personnes concernées :** visiteurs qui terminent le quiz et laissent leurs coordonnées.
- **Données :** nom, email, réponses, recommandations affichées.
- **Tables :** `quiz_leads`.
- **Sous-traitants :** Lovable Cloud/Supabase.
- **Transferts hors UE :** selon la région de la base, à confirmer.
- **Durée :** aucune purge automatique. À définir.
- **Sécurité :** mesures communes.

## 8. Chatbot

- **Finalité :** répondre aux questions des visiteurs et, à leur demande, transmettre la conversation à un conseiller.
- **Base légale :** intérêt légitime pour les réponses ; mesures précontractuelles pour le transfert. À valider.
- **Personnes concernées :** visiteurs qui utilisent le chatbot.
- **Données :**
  - messages saisis : chaque message est envoyé au modèle `google/gemini-2.5-flash` via la passerelle IA de Lovable ;
  - lors d'un transfert : nom, email, téléphone, motif et **historique complet de la conversation**.
- **Tables :** `chatbot_transfers` (conversations transférées uniquement).
- **Sous-traitants :** Lovable (passerelle IA), Google (modèle), Lovable Cloud/Supabase.
- **Transferts hors UE :** Google, et Lovable à vérifier.
- **Durée :** aucune purge automatique des transferts. À définir.
- **Sécurité :** mesures communes. Clé d'API côté serveur.

## 9. Commentaires du blog

- **Finalité :** publier les commentaires des lecteurs après modération.
- **Base légale :** consentement ou intérêt légitime. À valider.
- **Personnes concernées :** lecteurs qui commentent.
- **Données :** nom affiché, email (non publié), contenu, article.
- **Tables :** `blog_comments` (statut `pending` avant modération) ; vue publique `blog_comments_public` (commentaires approuvés, sans l'email).
- **Sous-traitants :** Lovable Cloud/Supabase.
- **Transferts hors UE :** selon la région de la base, à confirmer.
- **Durée :** durée de publication de l'article. À définir.
- **Sécurité :** modération avant publication.

## 10. Mesure d'audience et publicité

- **Finalité :** mesurer l'audience et l'usage du site, mesurer l'efficacité des publicités.
- **Base légale :**
  - consentement pour GA4, Clarity, Google Ads et Meta ;
  - pour la mesure interne du formulaire, intérêt légitime **ou** exemption CNIL, à valider.
- **Personnes concernées :** visiteurs du site.
- **Données :**
  - identifiants pseudonymes (`_ga`, `_clck`, `_fbp`, `_gcl_au`…), pages vues, interactions ;
  - pour Clarity, enregistrement de session ;
  - pour la mesure interne : étapes du formulaire de devis avec un identifiant aléatoire de session d'onglet (`qfe_session_id`).
- **Tables :** `quote_funnel_events` (mesure interne) ; `google_ads_conversions`.
- **Sous-traitants :** Google, Microsoft, Meta.
- **Transferts hors UE :** Google, Microsoft, Meta.
- **Durée :**
  - choix de consentement : 6 mois ;
  - cookies : de 1 jour à 2 ans selon l'éditeur (voir la politique cookies) ;
  - `_ga` dure 2 ans par défaut, alors que la politique de confidentialité actuelle annonce 13 mois au maximum : **à harmoniser**.
- **Sécurité :** aucun script tiers chargé sans consentement, retrait effectif (cookies expirés) ; aucun script tiers sur `/desinscription`.

## 11. Sécurité, anti-spam et comptes collaborateurs

- **Finalité :** protéger les formulaires contre les robots, diagnostiquer les erreurs, gérer les accès au CRM.
- **Base légale :** intérêt légitime (art. 6.1.f).
- **Personnes concernées :** visiteurs qui envoient un formulaire, collaborateurs.
- **Données :**
  - jeton et signaux reCAPTCHA ;
  - journal d'erreurs : page, type, message, user-agent, contexte technique (peut contenir un identifiant de devis) ;
  - comptes collaborateurs : nom, email, téléphone, rôles, facteurs de double authentification.
- **Tables :** `site_error_log`, `profiles`, `user_roles`, `sales_agents`, `alert_recipients` ; authentification Supabase.
- **Sous-traitants :** Google (reCAPTCHA), Lovable Cloud/Supabase.
- **Transferts hors UE :** Google.
- **Durée :**
  - journal d'erreurs : aucune purge automatique, à définir ;
  - comptes : durée de la collaboration.
- **Sécurité :** mesures communes.

## 12. Sauvegardes

- **Finalité :** restaurer les données en cas d'incident.
- **Base légale :** intérêt légitime (art. 6.1.f).
- **Personnes concernées :** toutes celles des traitements 1 à 9 et 11.
- **Données :** copie des tables `contacts`, `deals`, `deal_tasks`, `documents`, `activities`, `contracts`, `claims`, `commission_payments`, `insurance_quotes`, `contact_callbacks`, `quiz_leads`, `newsletter_subscribers`, `chatbot_transfers`, `sales_agents`, `profiles`, `user_roles` `seo_article_suggestions`, `published_drafts`, `advice_records`, `deal_audit_log` (liste `TABLES` de `db-backup`).
- **Tables :** `backup_snapshots` (métadonnées) ; fichiers dans le stockage `db-backups`.
- **Sous-traitants :** Lovable Cloud/Supabase.
- **Transferts hors UE :** selon la région, à confirmer.
- **Durée :** 30 jours (`RETENTION_DAYS = 30` dans `db-backup`).
  - Une donnée effacée à la demande d'une personne reste dans les sauvegardes jusqu'à 30 jours.
- **Sécurité :** déclenchement quotidien par cron (`db-backup-daily`), écriture par la fonction avec la clé de service ; caractère privé du bucket `db-backups` à vérifier.

---

## Points ouverts (à trancher par Paul)

1. **Région de la base** Lovable Cloud/Supabase et **DPA** de chaque sous-traitant (Vercel, Resend, Lovable, Google, Meta, Microsoft).
2. **Durées réelles :**
   - aucune purge automatique n'existe aujourd'hui pour les devis, rappels, deals, quiz, chatbot, suivi d'emails et journal d'erreurs ;
   - la purge quotidienne prévue au plan reste à décider.
3. **Suivi d'ouverture des emails :** base légale (consentement ?).
4. **Lead magnet :** ne plus réinscrire une adresse désinscrite.
5. **Cookie `_ga` :** 2 ans par défaut, contre 13 mois annoncés. Option technique : `cookie_expires` dans la configuration GA4.
6. **Reciblage publicitaire :**
   - Google Ads et le pixel Meta le permettent techniquement ;
   - la politique cookies le mentionne ;
   - à retirer seulement si aucune audience de reciblage n'est utilisée dans les comptes Google Ads et Meta.
7. **Mesure interne du formulaire** (`quote_funnel_events`) : sans consentement aujourd'hui ; vérifier qu'elle entre dans l'exemption CNIL ou la soumettre au consentement « analyse ».
