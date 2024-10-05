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
      // Add settings for React
      react: {
        version: "detect", // Automatically detect the version of React
      },
    },
  },
  {
    rules: {
      // Disable prop-types rule
      "react/prop-types": "off", // Turn off prop-types validation
    },
  },
];
