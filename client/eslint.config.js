import globals from "globals";
import pluginJs from "@eslint/js";
import pluginReact from "eslint-plugin-react";

export default [
  {
    files: ["**/*.{js,mjs,cjs,jsx}"], // Specify the files to target (JavaScript and JSX)
  },
  {
    languageOptions: {
      globals: globals.browser, // Set global variables for the browser environment
    },
  },
  pluginJs.configs.recommended, // Include recommended rules from the ESLint core
  pluginReact.configs.flat.recommended, // Include recommended rules from the React plugin
  {
    settings: {
      react: {
        version: "detect", // Automatically detect the version of React
      },
    },
  },
  {
    rules: {
      "no-unused-vars": "warn", // Warn for unused variables instead of an error
      "react/prop-types": "off", // Disable prop-types validation
      semi: ["error", "always"], // Ensure semicolons at the end of lines
      quotes: ["error", "double"], // Enforce the use of double quotes
    },
  },
  {
    // Add Node.js environment for config files where `module.exports` is used
    files: ["jest.config.js", "*.config.js"], // Target configuration files
    languageOptions: {
      globals: { ...globals.node }, // Enable Node.js globals like `module`, `require`, etc.
    },
    rules: {
      "no-undef": "off", // Disable `no-undef` for these files since Node.js globals are defined
    },
  },
  {
    // Override for test files to include Jest globals
    files: ["**/*.test.js", "**/*.spec.js"], // Target your test files
    languageOptions: {
      globals: { ...globals.jest }, // Enable Jest globals like `test`, `expect`
    },
  },
];
