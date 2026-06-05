/**
 * Détecte si un "contenu d'article" ressemble en réalité à un prompt LLM
 * (instructions à l'IA) au lieu du HTML/Markdown final.
 *
 * Utilisé pour bloquer la publication d'articles dont la génération a échoué
 * et qui ont stocké le prompt à la place du contenu rendu.
 */

export interface PromptLeakResult {
  isPromptLeak: boolean;
  reasons: string[];
  score: number;
}

// Patterns typiques d'un prompt LLM (FR + EN)
const PROMPT_PATTERNS: { regex: RegExp; weight: number; label: string }[] = [
  { regex: /^\s*(tu es|vous êtes|you are|act as|agis comme|imagine que|imagine you)/i, weight: 5, label: 'Ouverture type prompt ("Tu es…", "You are…")' },
  { regex: /\b(rédige|écris|génère|generate|write|produce|create)\s+(un|une|a|an|the)\s+(article|texte|contenu|post|réponse|response)/i, weight: 4, label: 'Instruction de génération ("Rédige un article…")' },
  { regex: /\{(keyword|topic|sujet|mot[_-]?cl[eé]|title|titre|slug|insert|placeholder)\}/i, weight: 4, label: 'Placeholders non remplacés ({keyword}, {topic}…)' },
  { regex: /\[(INSERT|INSÉRER|TODO|PLACEHOLDER|YOUR\s+\w+)/i, weight: 4, label: 'Marqueurs [INSERT …] ou [TODO]' },
  { regex: /\b(format de sortie|output format|sortie attendue|expected output|réponds en|respond in|return json|return only)/i, weight: 4, label: 'Spécification de format de sortie' },
  { regex: /\b(longueur|length)\s*:?\s*\d+\s*(mots|words|caractères|characters)/i, weight: 3, label: 'Contrainte de longueur ("1500 mots")' },
  { regex: /```json[\s\S]{0,80}\{[\s\S]*"(title|slug|content|meta_description)"/i, weight: 5, label: 'Bloc JSON brut non parsé' },
  { regex: /^[\s\S]{0,200}\{\s*"(title|slug|suggested_content|content|meta_description)"\s*:/i, weight: 5, label: 'Sortie JSON brute au lieu du contenu' },
  { regex: /\b(voici (le|un) prompt|here is the prompt|prompt utilisé|prompt used|system prompt)/i, weight: 5, label: 'Mention explicite du prompt' },
  { regex: /\b(role|rôle)\s*:\s*(system|user|assistant)\b/i, weight: 4, label: 'Structure messages OpenAI ("role: system")' },
  { regex: /\b(contraintes?|constraints?|consignes?|guidelines?)\s*:\s*\n?\s*[-•]/i, weight: 3, label: 'Liste de consignes éditoriales' },
  { regex: /\b(ne pas (inclure|mentionner|utiliser)|do not (include|mention|use))/i, weight: 2, label: 'Instructions négatives ("ne pas inclure…")' },
  { regex: /\b(structure attendue|expected structure|plan de l'article|article outline)/i, weight: 3, label: 'Plan/structure décrit au lieu de rédigé' },
];

const HTML_INDICATORS = /<(h1|h2|h3|p|ul|ol|li|article|section)\b[^>]*>/i;
const MARKDOWN_HEADING = /^#{1,3}\s+\S/m;

export function detectPromptLeak(content: string | null | undefined): PromptLeakResult {
  const reasons: string[] = [];
  let score = 0;

  if (!content || typeof content !== 'string') {
    return { isPromptLeak: true, reasons: ['Contenu vide ou invalide'], score: 99 };
  }

  const trimmed = content.trim();

  // Trop court pour un article (< 600 caractères = très suspect)
  if (trimmed.length < 600) {
    reasons.push(`Contenu très court (${trimmed.length} caractères)`);
    score += 3;
  }

  // Aucun rendu HTML ni Markdown structuré
  const hasHtml = HTML_INDICATORS.test(trimmed);
  const hasMd = MARKDOWN_HEADING.test(trimmed);
  if (!hasHtml && !hasMd && trimmed.length < 2000) {
    reasons.push('Aucune structure HTML ni Markdown détectée');
    score += 3;
  }

  for (const { regex, weight, label } of PROMPT_PATTERNS) {
    if (regex.test(trimmed)) {
      reasons.push(label);
      score += weight;
    }
  }

  // Seuil : score ≥ 5 ⇒ blocage
  return {
    isPromptLeak: score >= 5,
    reasons,
    score,
  };
}
