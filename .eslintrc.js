"use strict";

module.exports = {
  root: true,
  extends: "plugin:@phanect/plain",

  env: {
    browser: true,
    node: true,
  },
  plugins: [ "@phanect" ],
};
