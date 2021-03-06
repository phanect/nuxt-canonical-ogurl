"use strict";

module.exports = {
  root: true,
  extends: "plugin:@phanect/plain",

  env: {
    browser: true,
    node: true,
  },
  plugins: [ "@phanect" ],

  overrides: [
    {
      files: [ "tests/**/*.test.js" ],
      extends: "plugin:@phanect/jest",
    },
    {
      files: [ "tests/fixtures/**/*.js", "tests/fixtures/**/*.vue" ],
      extends: "plugin:@phanect/nuxt+js",
      parserOptions: {
        sourceType: "module",
      },
      rules: {
        "vue/multi-word-component-names": "off", // TODO disable in @phanect/eslint-plugin
      },
    },
  ],
};
