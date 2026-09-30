# Logos partenaires

Dépose ici les fichiers de logo fournis par les assureurs (format webp/png/svg de préférence).

Une fois un fichier déposé pour un partenaire de `src/data/partners.ts` :
1. Ajoute un import du fichier (`import xLogo from "@/assets/logos/x.webp"` si placé dans `src/assets/logos/`, ou une référence directe si servi depuis `public/partners/`).
2. Renseigne `logo` sur l'entrée correspondante.
3. Passe `autorisationLogo: true` UNIQUEMENT si l'autorisation d'utiliser ce logo est confirmée.

Sans les deux (`logo` ET `autorisationLogo: true`), le nom s'affiche en texte — jamais de logo par défaut.
