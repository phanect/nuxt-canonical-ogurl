"use strict";

module.exports = {
  root: true,
  extends: "phanective/plain",

  env: {
    browser: true,
    node: true,
  },

  overrides: [
    {
      files: [ "tests/**/*.test.js" ],
      extends: "phanective/jest",
    },
    {
      files: [ "tests/fixtures/**/*.js", "tests/fixtures/**/*.vue" ],
      extends: "phanective/nuxt+js",
      parserOptions: {
        sourceType: "module",
      },
      rules: {
        "vue/multi-word-component-names": "off", // TODO disable in @phanect/eslint-plugin
      },
    },
  ],
};
