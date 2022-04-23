"use strict";

const { resolve } = require("path");

module.exports = function() { // must NOT be arrow function ( () => { /* ... */ } )
  this.nuxt.hook("build:before", () => {
    const options = this.options.canonicalOgUrl;
    const trailingSlash = this.options.router.trailingSlash;

    this.addPlugin({
      src: resolve(__dirname, "plugin.js"),
      fileName: "nuxt-canonical-ogurl.js",
      options: {
        ...options,
        trailingSlash,
      },
    });
  });
};

module.exports.meta = require("../package.json");
