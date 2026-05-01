# 🚨 TODO: Implémenter les Résumés Sociaux

## ✅ FAIT
- [x] Migration Supabase: Colonne `social_summary` ajoutée (20260501000000_add_social_summary_to_seo_suggestions.sql)
- [x] Documentation complète créée (docs/SOCIAL_SUMMARY_IMPLEMENTATION.md)

## 🔄 À FAIRE (dans Lovable)
- [ ] **ÉTAPE 2**: Modifier `supabase/functions/generate-seo-suggestions/index.ts`
  - 5 changements "Find & Replace" détaillés dans la doc
    - Ajouter le champ `social_summary: string` au type `ParsedArticle`
      - Mettre à jour la fonction `normalizeArticle`
        - Mettre à jour la fonction `parseAiArticle`
          - **Remplacer le PROMPT IA** (ligne ~275) - C'EST LE PLUS IMPORTANT
            - Ajouter `social_summary: article.social_summary` à l'insert Supabase

            - [ ] **ÉTAPE 3**: Mettre à jour `src/components/admin/SEOSuggestions.tsx`
              - Ajouter l'affichage du `social_summary` avec badge amber
                - Voir modèle dans la doc

                - [ ] **ÉTAPE 4**: Configurer le Cron 3x/semaine
                  - Lundi, Mercredi, Vendredi à 9h UTC
                    - Via Supabase Database > Webhooks

                    ## 📍 Résumé
                    Le système générera maintenant des résumés 2-lignes **punchy et engageants** pour LinkedIn/Facebook au lieu du texte tronqué générique actuel.

                    **Exemple de bon résumé social:**
                    > 💡 Réduire ses frais d'assurance santé de 30-40%? C'est possible! Découvrez les 5 stratégies simples que les meilleurs assurés utilisent en 2026.

                    Voir: `docs/SOCIAL_SUMMARY_IMPLEMENTATION.md` pour le guide complet avec tous les codes à utiliser.
