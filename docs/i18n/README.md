# Traductions du site (i18n)

## Principes

- **Source de vérité : le français.** Tout texte est d'abord écrit en français ; les autres langues en sont des traductions, jamais l'inverse.
- **Langues cibles :**
  - `en` : anglais **britannique** (excess, cover, advisor…) ;
  - `it` : italien, avec **vouvoiement formel** (« Lei »).
- **Public visé : les personnes résidant en France** qui préfèrent lire en anglais ou en italien. Le site ne s'adresse pas aux résidents du Royaume-Uni ou de l'Italie.
- **Aucune adaptation au droit britannique ou italien.** Le droit applicable reste le droit français : les lois, articles de code et organismes français sont conservés et expliqués, jamais remplacés par un équivalent étranger. Devise : EUR ; téléphone et code postal français.

## Glossaire

[`glossary.json`](glossary.json) est imposé au traducteur automatique :

- `rules` : règles générales (ce qui ne se traduit jamais, traitement des lois et des citations officielles, éléments à conserver à l'identique, registre de langue, aucune promesse ajoutée ou retirée) ;
- `terms` : traduction obligatoire des termes d'assurance, du français vers `en` et `it`.

Toute modification du glossaire doit être validée par Paul ; la clé `version` indique la date de la dernière version validée.
