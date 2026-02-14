import path from "node:path";
import { fileURLToPath } from "node:url";

import js from "@eslint/js";
import { defineConfig, globalIgnores } from "eslint/config";
import saleorPlugin from "@saleor/eslint-plugin-saleor-app";
import eslintConfigPrettier from "eslint-config-prettier";
import nextCoreWebVitals from "eslint-config-next/core-web-vitals";
import simpleImportSort from "eslint-plugin-simple-import-sort";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig([
  globalIgnores([
    ".next/**",
    "node_modules/**",
    "dist/**",
    "graphql/schema.graphql",
    "generated/**",
  ]),

  js.configs.recommended,

  nextCoreWebVitals,

  {
    files: ["**/*.{js,jsx,ts,tsx}"],
    plugins: {
      "simple-import-sort": simpleImportSort,
      "@saleor/saleor-app": saleorPlugin,
    },
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      parserOptions: {
        project: "./tsconfig.json",
        tsconfigRootDir: __dirname,
      },
    },
    rules: {
      "import/order": "off",
      "simple-import-sort/imports": "warn",
      "simple-import-sort/exports": "warn",
      "@saleor/saleor-app/logger-leak": "error",
      "no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          caughtErrorsIgnorePattern: "^_",
        },
      ],
    },
  },

  eslintConfigPrettier,
]);
