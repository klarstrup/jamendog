const PATHS = require("./config/paths");

module.exports = {
  extends: ["react-app"],
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
