# Implémentation des Résumés Sociaux - Guide Complet

## ✅ ÉTAPE 1 : Migration Supabase  
**Statut** : ✅ COMPLÉTÉE

La migration SQL a été appliquée pour ajouter la colonne `social_summary` à la table `seo_article_suggestions`.

---

## ⏳ ÉTAPE 2 : Modification de `generate-seo-suggestions/index.ts`

### CHERCHER & REMPLACER #1 - Line 8 (Type ParsedArticle)

**CHERCHER:**
```typescript
type ParsedArticle = {
  title: string;
    meta_description: string;
      author: string;
        content: string;
        };
        ```

        **REMPLACER PAR:**
        ```typescript
        type ParsedArticle = {
          title: string;
            meta_description: string;
              author: string;
                content: string;
                  social_summary: string;  // NEW: 2-line punchy summary for social media
                  };
                  ```

                  ---

                  ### CHERCHER & REMPLACER #2 - Function normalizeArticle (ligne ~110)

                  **CHERCHER:**
                  ```typescript
                  function normalizeArticle(article: Partial<ParsedArticle>): ParsedArticle {
                    const title = typeof article.title === "string" ? article.title.trim() : "";
                      const content = typeof article.content === "string" ? article.content.trim() : "";
                        const metaDescriptionSource = typeof article.meta_description === "string" ? article.meta_description : "";
                          const rawAuthor = typeof article.author === "string" && article.author.trim().length > 0 ? article.author.trim() : "L'équipe d'experts Jemassuremoinscher";
                            const author = rawAuthor.toLowerCase().includes("arthur") ? "L'équipe d'experts Jemassuremoinscher" : rawAuthor;

                              if (!title) throw new Error("Titre manquant dans la réponse IA");
                                if (!content) throw new Error("Contenu manquant dans la réponse IA");

                                  return {
                                      title,
                                          content,
                                              author,
                                                  meta_description: metaDescriptionSource.trim().slice(0, 150),
                                                    };
                                                    }
                                                    ```

                                                    **REMPLACER PAR:**
                                                    ```typescript
                                                    function normalizeArticle(article: Partial<ParsedArticle>): ParsedArticle {
                                                      const title = typeof article.title === "string" ? article.title.trim() : "";
                                                        const content = typeof article.content === "string" ? article.content.trim() : "";
                                                          const metaDescriptionSource = typeof article.meta_description === "string" ? article.meta_description : "";
                                                            const socialSummary = typeof article.social_summary === "string" ? article.social_summary.trim() : "";
                                                              const rawAuthor = typeof article.author === "string" && article.author.trim().length > 0 ? article.author.trim() : "L'équipe d'experts Jemassuremoinscher";
                                                                const author = rawAuthor.toLowerCase().includes("arthur") ? "L'équipe d'experts Jemassuremoinscher" : rawAuthor;

                                                                  if (!title) throw new Error("Titre manquant dans la réponse IA");
                                                                    if (!content) throw new Error("Contenu manquant dans la réponse IA");
                                                                      if (!socialSummary) throw new Error("Résumé social manquant dans la réponse IA");

                                                                        return {
                                                                            title,
                                                                                content,
                                                                                    author,
                                                                                        social_summary: socialSummary,  // NEW
                                                                                            meta_description: metaDescriptionSource.trim().slice(0, 150),
                                                                                              };
                                                                                              }
                                                                                              ```

                                                                                              ---

                                                                                              ### CHERCHER & REMPLACER #3 - Function parseAiArticle (ligne ~150)

                                                                                              **CHERCHER:**
                                                                                              ```typescript
                                                                                              function parseAiArticle(raw: string): ParsedArticle {
                                                                                                const taggedArticle = {
                                                                                                    title: extractTaggedSection(raw, "TITLE") || "",
                                                                                                        meta_description: extractTaggedSection(raw, "META_DESCRIPTION") || "",
                                                                                                            author: extractTaggedSection(raw, "AUTHOR") || "",
                                                                                                                content: extractTaggedSection(raw, "CONTENT") || "",
                                                                                                                  };
                                                                                                                  
                                                                                                                    if (taggedArticle.title && taggedArticle.content) {
                                                                                                                        return normalizeArticle(taggedArticle);
                                                                                                                          }
                                                                                                                          
                                                                                                                            const jsonArticle = tryParseJsonArticle(raw);
                                                                                                                              if (jsonArticle) {
                                                                                                                                  return normalizeArticle(jsonArticle);
                                                                                                                                    }
                                                                                                                                    
                                                                                                                                      throw new Error("Impossible d'extraire un format exploitable depuis la réponse IA");
                                                                                                                                      }
                                                                                                                                      ```
                                                                                                                                      
                                                                                                                                      **REMPLACER PAR:**
                                                                                                                                      ```typescript
                                                                                                                                      function parseAiArticle(raw: string): ParsedArticle {
                                                                                                                                        const taggedArticle = {
                                                                                                                                            title: extractTaggedSection(raw, "TITLE") || "",
                                                                                                                                                meta_description: extractTaggedSection(raw, "META_DESCRIPTION") || "",
                                                                                                                                                    social_summary: extractTaggedSection(raw, "SOCIAL_SUMMARY") || "",  // NEW
                                                                                                                                                        author: extractTaggedSection(raw, "AUTHOR") || "",
                                                                                                                                                            content: extractTaggedSection(raw, "CONTENT") || "",
                                                                                                                                                              };
                                                                                                                                                              
                                                                                                                                                                if (taggedArticle.title && taggedArticle.content && taggedArticle.social_summary) {  // NEW: require social_summary
                                                                                                                                                                    return normalizeArticle(taggedArticle);
                                                                                                                                                                      }
                                                                                                                                                                      
                                                                                                                                                                        const jsonArticle = tryParseJsonArticle(raw);
                                                                                                                                                                          if (jsonArticle) {
                                                                                                                                                                              return normalizeArticle(jsonArticle);
                                                                                                                                                                                }
                                                                                                                                                                                
                                                                                                                                                                                  throw new Error("Impossible d'extraire un format exploitable depuis la réponse IA");
                                                                                                                                                                                  }
                                                                                                                                                                                  ```
                                                                                                                                                                                  
                                                                                                                                                                                  ---
                                                                                                                                                                                  
                                                                                                                                                                                  ### CHERCHER & REMPLACER #4 - Prompt IA (ligne ~275, la const prompt)
                                                                                                                                                                                  
                                                                                                                                                                                  **CHERCHER:**
                                                                                                                                                                                  ```typescript
                                                                                                                                                                                  const prompt = `Tu es un expert SEO et rédacteur pour jemassuremoinscher.fr, un courtier en assurances indépendant. Génère un article de blog SEO optimisé pour la requête "${keyword}" (position actuelle: ${Math.round(opp.position)}, ${opp.impressions} impressions/28j). URL actuellement associée dans Google Search Console: ${currentPage} Contraintes: - 1500+ mots minimum - Titre H1 optimisé contenant le mot-clé exact - Meta description de 150 caractères max - Structure avec H2/H3 logiques - Inclure un tableau de données chiffrées - Inclure une FAQ de 3-4 questions - Maillage interne vers: /assurance-auto, /assurance-sante, /assurance-habitation, /assurance-pret, /assurance-vie, /assurance-moto, /assurance-animaux, /blog (choisir les plus pertinents) - Ton expert mais accessible, pas de jargon inutile - Données à jour pour 2026 - Mentionner "jemassuremoinscher.fr" naturellement 2-3 fois - Suggérer un auteur expert crédible avec titre/spécialité - Ne jamais utiliser les balises [[TITLE]], [[META_DESCRIPTION]], [[AUTHOR]], [[CONTENT]] à l'intérieur du contenu Réponds STRICTEMENT avec ce format, sans JSON, sans bloc de code et sans texte avant/après: [[TITLE]] Titre de l'article [[/TITLE]] [[META_DESCRIPTION]] Meta description [[/META_DESCRIPTION]] [[AUTHOR]] Prénom Nom – Titre [[/AUTHOR]] [[CONTENT]] Article complet en markdown [[/CONTENT]]`;
                                                                                                                                                                                  ```
                                                                                                                                                                                  
                                                                                                                                                                                  **REMPLACER PAR:**
                                                                                                                                                                                  ```typescript
                                                                                                                                                                                  const prompt = `Tu es un expert SEO et rédacteur pour jemassuremoinscher.fr. Génère un article de blog SEO optimisé pour "${keyword}" (position: ${Math.round(opp.position)}, ${opp.impressions} impressions/28j). URL actuelle: ${currentPage}
                                                                                                                                                                                  
                                                                                                                                                                                  IMPORTANT - Génère AUSSI un résumé accrocheur pour réseaux sociaux (LinkedIn/Facebook) en 2 lignes max:
                                                                                                                                                                                  - Doit être PUNCHY et donner envie de cliquer
                                                                                                                                                                                  - PAS une troncature du contenu
                                                                                                                                                                                  - Inclure le bénéfice principal
                                                                                                                                                                                  - Langage accessible, pas technique
                                                                                                                                                                                  
                                                                                                                                                                                  Exemple bon résumé: "💡 Réduire ses frais d'assurance santé de 30-40%? C'est possible! Découvrez les 5 stratégies que les meilleurs assurés utilisent en 2026."
                                                                                                                                                                                  
                                                                                                                                                                                  Contraintes article:
                                                                                                                                                                                  - 1500+ mots minimum
                                                                                                                                                                                  - Titre H1 contenant "${keyword}"
                                                                                                                                                                                  - Meta description 150 caractères max
                                                                                                                                                                                  - Structure H2/H3 logiques
                                                                                                                                                                                  - Tableau de données chiffrées
                                                                                                                                                                                  - FAQ 3-4 questions
                                                                                                                                                                                  - Maillage interne: /assurance-auto, /assurance-sante, /assurance-habitation, /assurance-pret, /assurance-vie, /assurance-moto, /assurance-animaux, /blog
                                                                                                                                                                                  - Ton expert et accessible
                                                                                                                                                                                  - Données 2026
                                                                                                                                                                                  - Mention jemassuremoinscher.fr 2-3x
                                                                                                                                                                                  - Auteur expert crédible
                                                                                                                                                                                  
                                                                                                                                                                                  Réponds STRICTEMENT:
                                                                                                                                                                                  [[TITLE]] Titre [[/TITLE]]
                                                                                                                                                                                  [[META_DESCRIPTION]] Meta description [[/META_DESCRIPTION]]
                                                                                                                                                                                  [[SOCIAL_SUMMARY]] 2 lignes max - résumé social accrocheur [[/SOCIAL_SUMMARY]]
                                                                                                                                                                                  [[AUTHOR]] Prénom Nom – Titre [[/AUTHOR]]
                                                                                                                                                                                  [[CONTENT]] Article markdown [[/CONTENT]]`;
                                                                                                                                                                                  ```
                                                                                                                                                                                  
                                                                                                                                                                                  ---
                                                                                                                                                                                  
                                                                                                                                                                                  ### CHERCHER & REMPLACER #5 - Insert en Supabase (ligne ~380)
                                                                                                                                                                                  
                                                                                                                                                                                  **CHERCHER:**
                                                                                                                                                                                  ```typescript
                                                                                                                                                                                  const { error: insertError } = await supabase.from("seo_article_suggestions").insert({
                                                                                                                                                                                    title: article.title,
                                                                                                                                                                                      slug,
                                                                                                                                                                                        target_keyword: keyword,
                                                                                                                                                                                          gsc_position: Math.round(opp.position * 10) / 10,
                                                                                                                                                                                            gsc_impressions: opp.impressions,
                                                                                                                                                                                              gsc_clicks: opp.clicks,
                                                                                                                                                                                                suggested_content: article.content,
                                                                                                                                                                                                  suggested_meta_description: article.meta_description,
                                                                                                                                                                                                    suggested_author: article.author,
                                                                                                                                                                                                      status: "pending",
                                                                                                                                                                                                      });
                                                                                                                                                                                                      ```
                                                                                                                                                                                                      
                                                                                                                                                                                                      **REMPLACER PAR:**
                                                                                                                                                                                                      ```typescript
                                                                                                                                                                                                      const { error: insertError } = await supabase.from("seo_article_suggestions").insert({
                                                                                                                                                                                                        title: article.title,
                                                                                                                                                                                                          slug,
                                                                                                                                                                                                            target_keyword: keyword,
                                                                                                                                                                                                              gsc_position: Math.round(opp.position * 10) / 10,
                                                                                                                                                                                                                gsc_impressions: opp.impressions,
                                                                                                                                                                                                                  gsc_clicks: opp.clicks,
                                                                                                                                                                                                                    suggested_content: article.content,
                                                                                                                                                                                                                      suggested_meta_description: article.meta_description,
                                                                                                                                                                                                                        suggested_author: article.author,
                                                                                                                                                                                                                          social_summary: article.social_summary,  // NEW
                                                                                                                                                                                                                            status: "pending",
                                                                                                                                                                                                                            });
                                                                                                                                                                                                                            ```
                                                                                                                                                                                                                            
                                                                                                                                                                                                                            ---
                                                                                                                                                                                                                            
                                                                                                                                                                                                                            ## ⏳ ÉTAPE 3 : Mise à jour du composant React `SEOSuggestions.tsx`
                                                                                                                                                                                                                            
                                                                                                                                                                                                                            Ajoute l'affichage du `social_summary` dans la liste des articles suggérés.
                                                                                                                                                                                                                            
                                                                                                                                                                                                                            **Ajoute cette section à côté du titre/description:**
                                                                                                                                                                                                                            ```tsx
                                                                                                                                                                                                                            {/* Résumé Social */}
                                                                                                                                                                                                                            {suggestion.social_summary && (
                                                                                                                                                                                                                              <div className="bg-amber-50 border-l-4 border-amber-500 p-3 my-2">
                                                                                                                                                                                                                                  <p className="text-xs font-semibold text-amber-800">🚨 Résumé Social:</p>
                                                                                                                                                                                                                                      <p className="text-sm text-amber-900 italic">"{suggestion.social_summary}"</p>
                                                                                                                                                                                                                                        </div>
                                                                                                                                                                                                                                        )}
                                                                                                                                                                                                                                        ```
                                                                                                                                                                                                                                        
                                                                                                                                                                                                                                        ---
                                                                                                                                                                                                                                        
                                                                                                                                                                                                                                        ## ⏳ ÉTAPE 4 : Configuration du Cron (3x/semaine)
                                                                                                                                                                                                                                        
                                                                                                                                                                                                                                        ### Option A - Via Supabase Console:
                                                                                                                                                                                                                                        1. Va dans **Database > Webhooks**
                                                                                                                                                                                                                                        2. Crée un **scheduled trigger**:
                                                                                                                                                                                                                                           - **Function**: `generate-seo-suggestions`
                                                                                                                                                                                                                                              - **Cron expression**: `0 9 * * 1,3,5`
                                                                                                                                                                                                                                                 - **Header**: `Authorization: Bearer YOUR_ANON_KEY`
                                                                                                                                                                                                                                                 
                                                                                                                                                                                                                                                 ### Option B - Via Environment Variables:
                                                                                                                                                                                                                                                 Ajoute à ton `.env`:
                                                                                                                                                                                                                                                 ```
                                                                                                                                                                                                                                                 GEN_SEO_CRON_ENABLED=true
                                                                                                                                                                                                                                                 GEN_SEO_CRON_SCHEDULE=0 9 * * 1,3,5
                                                                                                                                                                                                                                                 ```
                                                                                                                                                                                                                                                 
                                                                                                                                                                                                                                                 ---
                                                                                                                                                                                                                                                 
                                                                                                                                                                                                                                                 ## ✅ VÉRIFICATION
                                                                                                                                                                                                                                                 
                                                                                                                                                                                                                                                 Après implémentation, teste:
                                                                                                                                                                                                                                                 
                                                                                                                                                                                                                                                 1. **Migration appliquée**: `SELECT social_summary FROM seo_article_suggestions;`
                                                                                                                                                                                                                                                 2. **Nouvelle génération**: Appelle `generate-seo-suggestions` et vérifie le `social_summary` 
                                                                                                                                                                                                                                                 3. **UI affiche**: Regarde le back-office pour voir le résumé social affiché
                                                                                                                                                                                                                                                 4. **Cron fonctionne**: Attends lundi/mercredi/vendredi 9h UTC pour vérifier
                                                                                                                                                                                                                                                 
                                                                                                                                                                                                                                                 ---
                                                                                                                                                                                                                                                 
                                                                                                                                                                                                                                                 ## 📊 RÉSUMÉ DES CHANGEMENTS
                                                                                                                                                                                                                                                 
                                                                                                                                                                                                                                                 - ✅ Migration SQL: Colonne `social_summary` ajoutée
                                                                                                                                                                                                                                                 - 🔄 Fonction IA: Prompt amélioré + extraction du social_summary
                                                                                                                                                                                                                                                 - 🎨 UI: Affichage visible dans le back-office avec badge
                                                                                                                                                                                                                                                 - ⏰ Automatisation: 3x/semaine (lun/mer/ven 9h UTC)
