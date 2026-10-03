import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import tseslint from "typescript-eslint";
import noHardcodedFrench from "./eslint-rules/no-hardcoded-french.js";

export default tseslint.config(
  { ignores: ["dist"] },
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    plugins: {
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      "react-refresh/only-export-components": ["warn", { allowConstantExport: true }],
      "@typescript-eslint/no-unused-vars": "off",
    },
  },
  // i18n, étape 2 : texte français en dur → avertissement (strict plus tard).
  // Hors périmètre : admin, CRM, back-office, blog, glossaire, dictionnaires.
  {
    files: ["src/**/*.{ts,tsx}"],
    ignores: [
      "src/i18n/**",
      "src/integrations/**",
      "src/pages/crm/**",
      "src/components/admin/**",
      "src/components/commercial/**",
      "src/pages/Admin*.tsx",
      "src/pages/Commercial*.tsx",
      "src/pages/Blog*.tsx",
      "src/components/blog/**",
      "src/data/blogArticles*.ts",
      "src/pages/Glossaire*.tsx",
      "src/data/glossaryTerms.ts",
      "src/**/*.test.{ts,tsx}",
    ],
    plugins: { local: { rules: { "no-hardcoded-french": noHardcodedFrench } } },
    rules: { "local/no-hardcoded-french": "warn" },
  },
);
