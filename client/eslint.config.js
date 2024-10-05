import globals from "globals";
import pluginJs from "@eslint/js";
import pluginReact from "eslint-plugin-react";

export default [
  { files: ["**/*.{js,mjs,cjs,jsx}"] }, // Specify the files to target (JavaScript and JSX)
  { languageOptions: { globals: globals.browser } }, // Set global variables for browser environment
  pluginJs.configs.recommended, // Include recommended rules from ESLint core
  pluginReact.configs.flat.recommended, // Include recommended rules from React plugin
  {
    settings: {
      react: {
        version: "detect", // Automatically detect the version of React
      },
    },
  },
  {
    rules: {
      "no-unused-vars": "warn",
      "react/prop-types": "off",
      semi: ["error", "always"], // Asegura que haya punto y coma al final de las líneas
      quotes: ["error", "double"], // Usa comillas dobles
    },
  },
];
