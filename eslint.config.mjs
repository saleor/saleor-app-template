import { defineConfig, globalIgnores } from "eslint/config";
import js from "@eslint/js";

import nextCoreWebVitals from "eslint-config-next/core-web-vitals";
import eslintConfigPrettier from "eslint-config-prettier";

import saleorPlugin from "@saleor/eslint-plugin-saleor-app";
import simpleImportSort from "eslint-plugin-simple-import-sort";

import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const saleorRecommended = saleorPlugin.configs["flat/recommended"];
const saleorRecommendedArray = Array.isArray(saleorRecommended)
  ? saleorRecommended
  : [saleorRecommended];

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
      "no-unused-vars": ["error", { 
        argsIgnorePattern: "^_", 
        varsIgnorePattern: "^_",
        caughtErrorsIgnorePattern: "^_"
       }],
    },
  },

  ...saleorRecommendedArray.map((cfg) => ({
    ...cfg,
    plugins: {
      "@saleor/saleor-app": saleorPlugin,
      ...(cfg.plugins ?? {}),
    },
  })),

  eslintConfigPrettier,
]);