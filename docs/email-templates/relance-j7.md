# Relance J+7

Texte de trace uniquement — l'insertion en base (`email_templates`) est faite manuellement, pas par migration (voir `supabase/migrations/`, aucune migration d'insertion pour ce template).

- **Nom du template** (colonne `name` dans `email_templates`) : `Relance J+7`
- **Ciblage** : `send-followup-reminders`, milestone `j7` (voir `TEMPLATE_BY_MILESTONE` dans `supabase/functions/send-followup-reminders/index.ts`)
- **Variables utilisées** : `{{prenom}}`, `{{produit}}`, `{{lien_desinscription}}`

## Sujet

```
Votre demande de devis d'assurance {{produit}} : toujours d'actualite ?
```

## Corps

```
Bonjour {{prenom}},

Vous avez récemment demandé un devis d'assurance {{produit}}. Si vous avez des questions ou si vous souhaitez que nous reprenions votre dossier, répondez simplement à cet email : un conseiller vous recontactera rapidement.

Si vous ne souhaitez plus recevoir d'emails de notre part à ce sujet, vous pouvez vous désinscrire ici : {{lien_desinscription}}

jemassuremoinscher.fr est un courtier en assurances indépendant, immatriculé à l'ORIAS sous le numéro 26011100.

Bonne journée,
L'équipe jemassuremoinscher.fr
```
