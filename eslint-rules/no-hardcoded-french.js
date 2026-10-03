/**
 * Règle locale « no-hardcoded-french » (chantier i18n, étape 2) : signale un
 * texte français écrit en dur au lieu de passer par t() (src/i18n/fr.ts).
 * Avertissement seulement. Périmètre exclu (admin, CRM, back-office, blog,
 * glossaire, dictionnaires) : voir eslint.config.js.
 *
 * Signalé :
 * - texte JSX contenant des lettres ;
 * - attribut visible (alt, title, aria-label, placeholder, label…) en chaîne ;
 * - chaîne contenant du français (lettre accentuée ou mots-outils), hors
 *   imports, appels t()/console, comparaisons et clés techniques.
 * Pour une valeur volontairement française (donnée envoyée au CRM, nom
 * propre), ajouter : // eslint-disable-next-line local/no-hardcoded-french
 */
const VISIBLE_ATTRS = new Set(["alt", "title", "aria-label", "aria-description", "placeholder", "label"]);
const TECH_ATTRS = new Set(["className", "class", "id", "href", "to", "src", "type", "name", "key", "role", "htmlFor", "variant", "size", "rel", "target", "autoComplete", "inputMode", "pattern", "loading", "decoding", "fetchPriority", "fetchpriority", "align", "side", "lang", "value", "defaultValue", "d", "viewBox", "fill", "stroke"]);
const TECH_PROPS = new Set(["className", "id", "value", "field", "type", "key", "href", "to", "src", "icon", "variant", "path", "slug", "route", "url", "file"]);
const FRENCH = /[àâäéèêëîïôöùûüçœÀÂÉÈÊËÎÏÔÙÛÇ]|\b(le|la|les|des|du|un|une|et|pour|avec|vous|votre|vos|est|sont|au|aux|sur|par|pas|nous|notre|dès|mois)\b/i;
const HUMAN = (s) => /[A-Za-zÀ-ÿ]{2,}/.test(s) && !/^\s*(https?:|mailto:|tel:|\/|#|@\/|\.\/)/.test(s);
const SKIP_CALLEES = /^(t|tt|console\.\w+|require|import|useLanguage|new RegExp|RegExp)$/;

const calleeName = (node) => {
  const c = node.callee;
  if (!c) return "";
  if (c.type === "Identifier") return c.name;
  if (c.type === "MemberExpression" && c.object.type === "Identifier" && c.property.type === "Identifier") return `${c.object.name}.${c.property.name}`;
  return "";
};

export default {
  meta: { type: "suggestion", docs: { description: "Texte français écrit en dur : passer par t()" }, schema: [] },
  create(context) {
    const report = (node, text) =>
      context.report({ node, message: `Texte français en dur : « ${text.trim().slice(0, 60)} » — passer par t() (src/i18n/fr.ts).` });
    const checkString = (node, text) => {
      const p = node.parent;
      if (!p || !HUMAN(text) || !FRENCH.test(text)) return;
      if (p.type === "ImportDeclaration" || p.type === "ExportNamedDeclaration" || p.type === "ExportAllDeclaration") return;
      if (p.type === "CallExpression" && SKIP_CALLEES.test(calleeName(p))) return;
      if (p.type === "NewExpression" && p.callee.type === "Identifier" && p.callee.name === "RegExp") return;
      if (p.type === "Property" && p.value === node && p.key && TECH_PROPS.has(p.key.name ?? p.key.value)) return;
      if (p.type === "Property" && p.key === node) return;
      if (p.type === "BinaryExpression" && ["===", "!==", "==", "!="].includes(p.operator)) return;
      if (p.type === "SwitchCase" || p.type === "TSLiteralType") return;
      if (p.type === "JSXAttribute") return; // traité par JSXAttribute
      report(node, text);
    };
    return {
      JSXText(node) {
        const v = node.value.replace(/\s+/g, " ").trim();
        if (v && HUMAN(v)) report(node, v);
      },
      JSXAttribute(node) {
        const name = typeof node.name.name === "string" ? node.name.name : "";
        if (TECH_ATTRS.has(name) || !node.value) return;
        const v = node.value.type === "Literal" ? node.value.value : node.value.type === "JSXExpressionContainer" && node.value.expression.type === "Literal" ? node.value.expression.value : null;
        if (typeof v === "string" && HUMAN(v) && (VISIBLE_ATTRS.has(name) || FRENCH.test(v))) report(node, v);
      },
      Literal(node) {
        if (typeof node.value === "string") checkString(node, node.value);
      },
      TemplateLiteral(node) {
        const text = node.quasis.map((q) => q.value.cooked ?? "").join("{x}");
        checkString(node, text);
      },
    };
  },
};
