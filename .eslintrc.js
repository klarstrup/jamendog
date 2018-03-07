const path = require("path");
const baseRules = require("eslint-config-airbnb-base/rules/style");
const [_, ...restricted] = baseRules.rules["no-restricted-syntax"];

const PATHS = require("./config/paths");

module.exports = {
  extends: ["react-app", "plugin:jsx-a11y/recommended"],
  plugins: ["jsx-a11y"],
  parser: "babel-eslint",
  parserOptions: {
    ecmaVersion: 2017,
    sourceType: "module",
    jsx: true,
  },
  env: {
    node: true,
    browser: true,
  },
  settings: {
    "import/resolver": {
      node: {
        paths: [PATHS.src, PATHS.root, "node_modules"],
      },
    },
  },
  globals: {
    SERVER: false,
  },
};
