// https://docs.expo.dev/guides/using-eslint/
import expoConfig from "eslint-config-expo/flat";
import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import { defineConfig } from "eslint/config";

export default defineConfig([
  expoConfig,
  {
    files: ["**/*.{js,mjs,cjs,ts,mts,cts}"],
    plugins: { js },
    extends: ["js/recommended"],
    languageOptions: { globals: globals.browser },
  },
  tseslint.configs.strictTypeChecked,
  tseslint.configs.stylisticTypeChecked,
]);
