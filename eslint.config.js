// https://docs.expo.dev/guides/using-eslint/
const expoConfig = require("eslint-config-expo/flat");
const js = require("@eslint/js");
const globals = require("globals");
const tseslint = require("typescript-eslint");
const { defineConfig, globalIgnores } = require("eslint/config");

const restrictedImportPaths = [
    {
        name: "react-native",
        importNames: ["Text"],
        message:
            "Don't use base React Native's Text component. Instead, use the Text component exported by @/components/primitives/Text",
    },{
        name: "react-native",
        importNames: ["Stack"],
        message:
            "Don't use base React Native's Stack component. Instead, use the Stack component exported by @/components/primitives/Stack",
    },
];

module.exports = defineConfig([
    globalIgnores(["*.config.*", "dist/*"]),
    expoConfig,
    {
        files: ["**/*.{js,mjs,cjs,ts,mts,cts}"],
        plugins: { js },
        extends: ["js/recommended"],
        languageOptions: {
            globals: globals.browser,
        },
    },
    tseslint.configs.strictTypeChecked,
    tseslint.configs.stylisticTypeChecked,
    {
        rules: {
            "@typescript-eslint/consistent-type-imports": "error",
            "@typescript-eslint/array-type": ["error", { default: "generic" }],
            "no-restricted-imports": [
                "error",
                {
                    paths: restrictedImportPaths,
                },
            ],
        },
        languageOptions: {
            parserOptions: { projectService: true, tsconfigRootDir: __dirname },
        },
    },
]);
