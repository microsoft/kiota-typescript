import jsdoc from "eslint-plugin-jsdoc";
import preferArrow from "eslint-plugin-prefer-arrow";
import typescriptEslint from "@typescript-eslint/eslint-plugin";
import header from "@tony.ganchev/eslint-plugin-header";
import globals from "globals";
import tsParser from "@typescript-eslint/parser";
import path from "node:path";
import { fileURLToPath } from "node:url";
import js from "@eslint/js";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
    baseDirectory: __dirname,
    recommendedConfig: js.configs.recommended,
    allConfig: js.configs.all
});

export default [{
    ignores: [
        "**/.eslintrc.js",
        "**/*.mjs",
        "**/*.js",
        "**/*.js.map",
        "**/*.d.ts",
        "**/node_modules/",
        "**/dist/",
    ],
    files: ["**/*.ts"],
}, ...compat.extends(
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended-type-checked",
    "plugin:@typescript-eslint/stylistic-type-checked",
    "prettier",
    "@microsoft/eslint-config-msgraph/core",
), {
    plugins: {
        jsdoc,
        "prefer-arrow": preferArrow,
        "@typescript-eslint": typescriptEslint,
        header,
    },

    languageOptions: {
        globals: {
            ...globals.browser,
            ...globals.node,
        },

        parser: tsParser,
        ecmaVersion: 6,
        sourceType: "module",

        parserOptions: {
            project: [
                "packages/abstractions/tsconfig.json",
                "packages/authentication/azure/tsconfig.json",
                "packages/authentication/azure/tsconfig.json",
                "packages/http/fetch/tsconfig.json",
                "packages/serialization/form/tsconfig.json",
                "packages/serialization/json/tsconfig.json",
                "packages/serialization/multipart/tsconfig.json",
                "packages/authentication/azure/tsconfig.json",
                "packages/test/tsconfig.json",
            ],
        },
    },

    rules: {
        "@typescript-eslint/class-literal-property-style": ["error", "fields"],
        "@typescript-eslint/no-explicit-any": "warn",
        "prefer-arrow/prefer-arrow-functions": "warn",
        "@typescript-eslint/prefer-nullish-coalescing": "off",

        "header/header": [2, "block", [
            "*",
            " * -------------------------------------------------------------------------------------------",
            " * Copyright (c) Microsoft Corporation.  All Rights Reserved.  Licensed under the MIT License.",
            " * See License in the project root for license information.",
            " * -------------------------------------------------------------------------------------------",
            " ",
        ], 1],
    },
}];
