import { Fragment, type ReactNode } from "react";

/**
 * Phrase traduite contenant du balisage : remplace chaque {nom} du texte par
 * l'élément React correspondant, sans couper la phrase en morceaux (chaque
 * langue garde son ordre des mots). Exemple :
 *   richText(t("cle"), { strong: <strong>{t("cle.strong")}</strong> })
 * avec fr : "les 7 réflexes pour {strong} sur ton assurance".
 */
export const richText = (template: string, parts: Record<string, ReactNode>): ReactNode =>
  template
    .split(/(\{[A-Za-z0-9_]+\})/)
    .filter((chunk) => chunk !== "")
    .map((chunk, i) => {
      const m = chunk.match(/^\{([A-Za-z0-9_]+)\}$/);
      return <Fragment key={i}>{m && m[1] in parts ? parts[m[1]] : chunk}</Fragment>;
    });
